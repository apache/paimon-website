---
title: "Release 0.6"
type: release
version: 0.6.0
---

# Apache Paimon 0.6 Available

December 13, 2023 - Paimon Community (dev@paimon.apache.org)

Apache Paimon PPMC has officially released Apache Paimon 0.6.0-incubating version. A total of 58 people contributed to
this version and completed over 400 Commits. Thank you to all contributors for their support!

Some outstanding developments are:

1. Flink Paimon CDC almost supports all mainstream data ingestion currently available.
2. Flink 1.18 and Paimon supports CALL procedure, this will make table management easier.
3. Cross partition update is available for production!
4. Read-optimized table is introduced to enhance query performance.
5. Append scalable mode is available for production!
6. Paimon Presto module is available for production!
7. Metrics system is integrated to Flink Metrics.
8. Spark Paimon has made tremendous progress.

For details, please refer to the following text.

## Flink

### Paimon CDC

Paimon CDC integrates Flink CDC, Kafka, Pulsar, etc., and provides comprehensive support in version 0.6:

1. Kafka CDC supports formats: Canal Json, Debezium Json, Maxwell and OGG.
2. Pulsar CDC is added, both Table Sync and Database Sync.
3. Mongo CDC is available for production!

### Flink Batch Source

By default, the parallelism of batch reads is the same as the number of splits, while the parallelism of stream reads
is the same as the number of buckets, but not greater than scan.infer-parallelism.max (Default is 1024).

### Flink Streaming Source

Consumer-id is available for production!

You can specify the consumer-id when streaming read table record consuming snapshot id in Paimon, the newly started 
job can continue to consume from the previous progress without resuming from the state. You can also set consumer.mode
to at-least-once to get better checkpoint time. 

### Flink Time Travel

Flink 1.18 SQL supports Time Travel Query (You can also use dynamic option):

```sql
SELECT * FROM t FOR SYSTEM_TIME AS OF TIMESTAMP '2023-01-01 00:00:00';
```

### Flink Call Procedures

Flink 1.18 SQL supports Call Procedures:

| Procedure Name |    Example    |
|:------:|:-------------:|
| compact  |  CALL sys.compact('default.T', 'p=0', 'zorder', 'a,b', 'sink.parallelism=4')  |
| compact_database  |  CALL sys.compact_database('db1|db2', 'combined', 'table_.*', 'ignore', 'sink.parallelism=4')   |
| create_tag  |   CALL sys.create_tag('default.T', 'my_tag', 10)   |
| delete_tag  |   CALL sys.delete_tag('default.T', 'my_tag')   |
| merge_into  |   CALL sys.merge_into('default.T', '', '', 'default.S', 'T.id=S.order_id', '', 'price=T.price+20', '', '*')   |
| remove_orphan_files  |   CALL remove_orphan_files('default.T', '2023-10-31 12:00:00')   |
| reset_consumer  |   CALL sys.reset_consumer('default.T', 'myid', 10)  |
| rollback_to  |   CALL sys.rollback_to('default.T', 10)   |

Flink 1.19 will support Named Arguments which will make it easier to use when there are multiple arguments.

### Committer Improvement

The Committee is responsible for submitting metadata, and sometimes it may have bottlenecks that can lead to 
backpressure operations. In 0.6, we have the following optimizations:

1. By default, paimon will delete expired snapshots synchronously. Users can use asynchronous expiration mode by 
   setting snapshot.expire.execution-mode to async to improve performance.
2. You can use fine-grained-resource-management of Flink to increase committer heap memory and cpu only.

## Primary Key Table

### Cross Partition Update

Cross partition update is available for production!

Currently Flink batch & streaming writes are supported and has been applied by enterprises to production environments!
How to use Cross partition update:

1. Primary keys not contain all partition fields.
2. Use dynamic bucket mode, which means bucket is -1.

This mode directly maintains the mapping of keys to partition and bucket, uses local disks, and initializes indexes by
reading all existing keys in the table when starting write job. Although maintaining the index is necessary, this mode
also maintains high throughput performance. Please try it out.

### Read Optimized

For Primary Key Table, it's a 'MergeOnRead' technology. When reading data, multiple layers of LSM data are merged, and
the number of parallelism will be limited by the number of buckets. If you want to query fast enough in certain scenarios,
but can only find older data, you can query from read-optimized table: SELECT * FROM T$ro.

But the freshness of the data cannot be guaranteed, you can configure 'full-compaction.delta-commits' when writing data
to ensure that data with a determined latency is read.

StarRocks and other OLAP systems will release a version to greatly enhance query performance for read-optimized tables
based on Paimon 0.6.

### Partial Update

In 0.6, you can define aggregation functions for the partial-update merge engine with sequence group. This allows you
to perform special aggregations on certain fields under certain conditions, such as count, sum, etc.

### Compaction

We have introduced some asynchronous techniques to further improve the performance of Compaction! 20%+

And 0.6 introduces the database compaction, you can run the following command to submit a compaction job for multiple
database. If you submit a streaming job, the job will continuously monitor new changes to the table and perform
compactions as needed.

## Append Table

Append scalable mode is available for production!

By defining 'bucket' = '-1' to non-primary table, you can assign an append scalable mode for the table. This type of
table is an upgrade to Hive format. You can use it:

1. Spark, Flink Batch Read & Write, including INSERT OVERWRITE support.
2. Flink, Spark Streaming Read & Write, Flink will do small files compaction.
3. You can sort (z-order) this table, which will greatly accelerate query performance, especially when there are filtering conditions related to sorting keys.

You can set write-buffer-for-append option for append-only table, to apply situations where a large number of partitions
are streaming written simultaneously.

0.6 also introduce Hive Table Migration, Apache Hive supports ORC, Parquet file formats that could be migrated to Paimon.
When migrating data to a paimon table, the origin table will be permanently disappeared. So please back up your data if
you still need the original table. The migrated table will be append table. You can use Flink Spark CALL procedure to
migrate Hive table.

StarRocks and other OLAP systems will release a version to greatly enhance query performance for append tables based on Paimon 0.6.

## Tag Management

### Upsert To Partitioned

The Tag will maintain the manifests and data files of the snapshot. Offline data warehouses require an immutable view
every day to ensure the idempotence of calculations. So we created a Tag mechanism to output these views.

However, the traditional use of Hive data warehouses is more accustomed to using partitions to specify the query's Tag,
and is more accustomed to using Hive computing engines.

So, we introduce metastore.tag-to-partition and metastore.tag-to-partition.preview to mapping a non-partitioned primary
key table to the partition table in Hive metastore, and mapping the partition field to the name of the Tag to be fully
compatible with Hive.

### Tag with Flink Savepoint

You cannot recover a write job from an old Flink savepoint, which may cause issues with the Paimon table. In 0.6, we
avoided this situation where an exception is thrown when data anomalies occur, causing the job to fail to start.

If you want to recover from the old savepoint, we recommend setting sink.savepoint.auto-tag to true to enable the
feature of automatically creating tags for Flink savepoint.

## Formats

0.6 upgrates ORC version to 1.8.3, and Parquet version to 1.13.1. ORC natively supports ZSTD in this version, which
is a compression algorithm with a higher compression rate. We recommend using it when high compression rates are needed.

## Metrics System

In 0.6, Paimon has built a metrics system to measure the behaviours of reading and writing, Paimon has supported
built-in metrics to measure operations of commits, scans, writes and compactions, which can be bridged to computing
engine like Flink. The most important for streaming read is currentFetchEventTimeLag.

## Paimon Spark

1. Support Spark 3.5
2. Structured Streaming: Supports serving as a Streaming Source, supports source side traffic control through custom read triggers, and supports stream read changelog
3. Row Level Operation: DELETE optimization, supporting UPDATE and MERGE INTO
4. Call Procedure: Add compact and migrate_table, migrate_file, remove_orphan_files, create_tag, delete_tag, rollback
5. Query optimization: Push down filter optimization, support for Push down limit, and runtime filter (DPP)
6. Other: Truncate Table optimization, support for CTAS, support for Truncate Partition

## Paimon Trino

The Paimon Trino module mainly performs the following tasks to accelerate queries:

1. Optimize the issue of converting pages to avoid memory overflow caused by large pages
2. Implemented Limit Pushdown and can combine partition pruning

## Paimon Presto

The Paimon Presto module is available for production! The following capabilities have been added:

1. Implement Filter Pushdown, which allows Paimon Presto to be available for production
2. Use the Inject mode, which allows Paimon Catalog to reside in the process and improve query speed

## What's next?

Report your requirements!
