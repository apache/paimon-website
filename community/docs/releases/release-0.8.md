---
title: "Release 0.8"
type: release
version: 0.8.0
date: 2024-05-09
---

# Apache Paimon 0.8 Available

May 9, 2024 - Jingsong Lee (jingsonglee0@gmail.com)

Apache Paimon PMC has officially released Apache Paimon 0.8.0 version. A total of 47 people contributed to
this version and completed over 350 Commits. Thank you to all contributors for their support!

This version is the first release by Paimon after graduating and becoming a top-level project on Apache.
It includes a large number of new features and is also the longest release by Paimon.

## Version Overview

Paimon's long-term plan is to become a unified lake storage format that meets the main requirements for minute level
big data: offline batch computing, real-time stream computing, and OLAP computing.

The notable changes in this version include:

1. Add Deletion Vectors for near real-time updates and fast queries
2. Adjust the default value of Bucket to -1 to improve usability for new learners
3. Add a universal file indexing mechanism to improve OLAP query performance
4. Optimize memory and performance for read and write processes, reduce IO access times
5. A separate management mechanism for Changelog files to extend their lifecycle
6. Add a file system based privilege system to manage read and write permissions

## Deletion Vectors

Paimon's Deletion Vectors mode allows your primary key table (with 'delete-vectors.enabled' set to 'true') to achieve
significant read performance improvement without sacrificing too much write update performance, achieving near real-time
updates and fast queries.

<img src="./img/deletion-vectors.png" alt="deletion vectors" />

This mode will do more work to generate deletion files at checkpoint, so it is recommended that your Flink stream write
jobs have a larger 'execution.checkpointing.timeout' value to avoid checkpoint timeouts.

With the latest 0.8.0 version of paimon-flink, paimon-spark, paimon-hive, and paimon-trino, you can enjoy the optimized
query performance of this feature, and the Starrocks integration will be included in 3.2.8 & 3.3.2 versions, Apache Doris
integration will be included in 2.0.10 & 2.1.4 versions.

It is recommended to enable this feature for most primary key tables.

## Bucket Default Value

```sql
CREATE TABLE T (
  k INT PRIMARY KEY NOT ENFORCED,
  v0 INT,
  v1 INT
);
```

For the above SQL CREATE TABLE, Paimon used a default value of bucket of 1 in the past version, which caused some new
learners to test Paimon with single parallelism, which would be a big bottleneck, this version adjusts the bucket to -1:

- For primary key tables: bucket to -1 uses dynamic bucket mode, which will consume more writes resources than the fixed
  bucket mode, but it brings distributed processing with easy configuration.
- For Append tables: a bucket of -1 is a scalable mode, which has better and more convenient distributed processing.

This change will greatly improve the experience, and Paimon can cover most scenarios without having to configure any
parameters. For compatibility issues, old tables will continue to use bucket 1 by default, only newly created tables
will be affected.

## Universal File Indexing

Prior to this release, you could use ORC's own indexing mechanism to speed up queries, but it only supported a few
indexes such as Bloom filter, and you could only generate good corresponding indexes when writing to a file.

To solve these problems, this release proposes Paimon's Universal file index (configure 'file-index.bloom-filter.columns'),
which will maintain the index file separately:

- Supports not only indexing of fields, but also construction of indexes on Map Keys.
- Plans to support building indexes on existing files at any time, which will prevent you from rewriting data files when
  adding new indexes.
- Plan to add indexes for Bitmap, N-Gram BloomFilter, inverted, and so on in subsequent releases.

The current universal file index is only the basic framework, and only supports Append tables, which need to be
improved in subsequent releases.

## Read and Write Performance Optimization

In this release, the performance of critical codes for reading and writing has been optimized:

1. Write performance optimization:
   a. Optimized serialization performance on writes, with a 10-20% performance improvement on overall writes.
   b. Significantly improved the performance of Append table for multi-partition writes (more than 5 partitions).
   c. Increased the default value of 'num-sorted-run.stop-trigger', which slows down backpressure.
   d. Optimized startup performance for dynamic bucket writes.
2. Commit performance optimization:
   a. Dramatically reduce the memory usage of Commit node.
   b. Remove useless checks in Commit, write-only commits will be much faster.
   c. Partition Expire performance has been greatly improved.
3. Query performance optimization:
   a. Significantly reduce the memory usage of Plan generation.
   b. Reduced access to the file system NameNode in the plan and read phases, which is also beneficial to the OLAP performance of the object store.
   c. codegen supports cache, which will effectively improve the performance of short queries.
   d. Hive queries dramatically reduce the frequency of file system NameNode accesses by serializing Table objects.
   e. Dramatically improve the query performance of the first_row merge-engine.

## Changelog Lifecycle

In the previous version, for primary key table, the default Snapshot retention time of Table is 1 hour, which means
the Snapshots before 1 hour will be expired, this will seriously affect the security of streaming read, the job
streaming read this table can not hang for more than 1 hour, otherwise it will consume the snapshot that have already
been expired, and it won't be able to be recovered.

The solution can be to configure `consumer-id` in the streaming job, the job that writes the table will check all the
consumers of the table in the filesystem when deciding whether the snapshot has expired or not, if there are still users
relying on the snapshot, the snapshot will not be deleted at the time of expiration. However, consumers require some
management operations and different jobs need to be configured with different consumer ids, which requires some
management costs.

In this release, a new solution is proposed, which allow the Paimon table to act like a real queue and save Changelogs
for a longer period of time. Actually, the reason we can't save too many snapshots is that the Snapshot contains the
result file of multiple versions of Compaction, which is very large and takes up more space, while we only need the
Changelog file for streaming read, so we can separate the lifecycle of the Changelog:

<img src="./img/changelog-lifecycle.png" alt="changelog lifecycle" />

When the Snapshot expires, we create the corresponding changelog reference, delete the multiple versions of the Compaction
file, and keep only the Changelog file. This way you can set up a changelog lifecycle of 1 day:

```sql
CREATE TABLE T (
  k INT PRIMARY KEY NOT ENFORCED,
  ...
) WITH (
  'changelog-producer'='input',
  'changelog.time-retained' = '1 d'
)
```

The current version only supports Changelog files, so you need to configure `changelog-producer` for table to work.

## Privilege management system

In this release, Paimon provides a file-based privilege system. Permissions determine which users can perform which
operations on which objects, so you can manage table access in a fine-grained way. Currently, Paimon uses the
Identity-Based Access Control (IBAC) permission model, where permissions are assigned directly to users.

```sql
CREATE CATALOG `my-catalog` WITH (
    'type' = 'paimon',
     -- ...
    'user' = 'root',
    'password' = 'mypassword'
);

-- create a user authenticated by the specified password
-- change 'user' and 'password' to the username and password you want
CALL sys.create_privileged_user('user', 'password');

-- you can change 'user' to the username you want, and 'SELECT' to other privilege you want
-- grant 'user' with privilege 'SELECT' on the whole catalog
CALL sys.grant_privilege_to_user('user', 'SELECT');
-- grant 'user' with privilege 'SELECT' on database my_db
CALL sys.grant_privilege_to_user('user', 'SELECT', 'my_db');
-- grant 'user' with privilege 'SELECT' on table my_db.my_tbl
CALL sys.grant_privilege_to_user('user', 'SELECT', 'my_db', 'my_tbl');
```

This privilege system does not prevent access to older versions. Please upgrade all engines to the new Paimon version
for the privilege system to take effect.

## The rest of the core features

1. support TTL specification when creating Tag, which allows you to create Tag more freely for safe batch reading.
2. new record level TTL configuration (`record-level.expire-time`), the data will be expired at the time of Compaction,
   which can effectively reduce the pressure of Compaction by eliminating the expired data.
3. aggregation functions `collect`, `merge_map`, `last_value`, `nested_update` support retraction
   (`DELETE` / `UPDATE_BEFORE`) message input, the specific use of the test with your scenario.
4. Sequence Field is redesigned, when two data's Sequence Fields are equal, the order of entering Paimon will be used
   to decide the order.
5. A new Time Travel method is added, which can specify the batch reading from snapshot watermark.
6. Documentation: Flink and Spark have separate catalogs, including pages for reading, writing, table management, etc.
   Hope you like them.
7. system tables: greatly improve the query performance and stability of `files` & `snapshots` & `partitions` system table.
8. ORC: greatly improve the write performance of orc complex types (array, map); support zstd compression, which is a
   highly recommended algorithm for high compression.

## Flink

### DataStream API

The old version does not provide DataStream API, it is recommended to use Table API and DataStream conversion to write
code, however, it is difficult to solve some problems, for example, users want to write to Paimon while writing to
other DataStream Sinks, Table conversion is difficult to solve this problem. So this version proposes a complete
DataStream API:

1. `FlinkSinkBuilder`: build DataStream Sink. 2.
2. `FlinkSourceBuilder`: build the DataStream Source.

3. We still don't recommend you to use DataStream API directly, we recommend you to prioritize using SQL to solve your business problems.

### Lookup Join

1. Flink Lookup Join uses Hash Lookup to fetch data in this version, which avoids the overhead of RocksDB's data
   insertion.
2. This version also continues to improve the Hash Lookup, supports compression, and defaults to lz4, the
   `changelog-producer` for lookup will also benefit from this.
3. And Flink Lookup Join introduces max_pt mode, which is an interesting mode, it will only join the latest partition data, which is more suitable for the dimension table where each partition is full data.

At present, Flink Lookup Join is still worth improving, for example, it does not Shuffle the data of the main table
(or we can say fact table) according to the primary key of the dimension table, and the current Cache utilization is
very unfriendly, which leads to a large amount of IO, which is a problem that needs to be solved in the next version
of Flink.

### Other Flink Changes

1. Batch read partitioned table performance has been greatly improved. Previously, due to a design problem, each batch
   would scan all partitions, which has now been removed.
2. Metrics system has been redesigned, removing metrics at partition and bucket level, which would cause OOM when Flink
   JobManager runs for a long time.
3. Introduced `commit.force-create-snapshot` to force snapshot generation, which allows certain operations to strongly
   rely on snapshot generation.
4. Enhance Compact Sort: introduce Hilbert Sort, this kind of Sort still has some effect when there are more than 5
   fields, while z-order only recommends to sort within 5 fields; Sort new Range policy, which can avoid the skewed
   sorting problem due to the inconsistency of row sizes.
5. CDC Ingestion's time function supports the handling of epoch time.
6. Optimized the scalability of Flink's `consumer-id` streaming to support multi-partition streaming.
7. Flink 1.19, COMPACT Procedure support named argument, and we regret to decide, due to the maintenance of more than 5
   versions, no longer support Flink 1.14, recommended to use Flink 1.17 + version!

## Spark

Spark continues to optimize query performance, supporting the generation and use of statistics at the table level.

Spark uses COW technology to support DELETE and UPDATE for Append tables, and Spark DELETE supports primary key tables
for all MergeEngines. Spark DELETE and UPDATE also support subquery conditions. Spark COMPACT Procedure supports the
where method.

Other improvements:

1. Spark Generic Catalog supports function methods.
2. Delete Tag Procedure supports the ability to delete multiple Tags.
3. Unfortunately, due to the maintenance of more than 5 versions, Spark 2 is no longer supported, recommended to use
   Spark 3.3+ version.

## Ecology and Related Projects

1. Hive Migration: Supports migration of entire Hive Database to Paimon Tables.
2. Introducing Jdbc Catalog, which allows you to get rid of the Hive Metastore dependency.
3. Hive Writer supports Tez-mr engine, we only recommend Hive Writer for small data volume.
4. Paimon-Trino latest version only supports Trino 420+ version, but the performance of query orc has been greatly
   improved.
5. Paimon-Webui project development has made great progress and will be released soon.
