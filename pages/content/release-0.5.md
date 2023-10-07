---
title: "Release 0.5"
weight: -9
type: docs
aliases:
- /release-0.5.html
---
<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# Apache Paimon 0.5 Available

September 06, 2023 - Jingsong Lee (jingsonglee0@gmail.com)

We are happy to announce the availability of Paimon [0.5.0-incubating](https://paimon.apache.org/docs/0.5/).

Nearly 100 contributors have come to contribute release-0.5, we created 500+ commits together, bringing many exciting
new features and improvements to the community. Thank you all for your joint efforts!

Highlight:

- CDC Data Ingestion into Lake has reached maturity.
- Introduce Tags to provide immutable view to Offline data warehouse. 
- Dynamic Bucket mode for Primary Key Table is available in production.
- Introduce Append Only Scalable Table to replace Hive table. 

## CDC Ingestion

Paimon supports a variety of ways to [ingest data into Paimon](https://paimon.apache.org/docs/0.5/how-to/cdc-ingestion/)
tables with schema evolution. In release 0.5, a large number of new features have been added:

- MySQL Synchronizing Table
  - support synchronizing shards into one Paimon table
  - support type-mapping to make all fields to string
- MySQL Synchronizing Database
  - support merge multiple shards from multiple database
  - support `--mode combined` to a unified sink to sync all tables, and sync newly added tables without restarting job
- Kafka Synchronizing Table
  - synchronize one Kafka topic’s table into one Paimon table.
  - support Canal and OGG
- Kafka Synchronizing Database
  - synchronize one Kafka topic containing multiple tables or multiple topics containing one table each into one Paimon database.
  - support Canal and OGG
- MongoDB Synchronizing Collection
  - synchronize one Collection from MongoDB into one Paimon table.
- MongoDB Synchronizing Database 
  - synchronize the whole MongoDB database into one Paimon database.

## Primary Key Table

By specific Primary Key in creating table DDL, you can get a [Primary Key Table](https://paimon.apache.org/docs/0.5/concepts/primary-key-table/),
it accepts insert, update or delete records. 

### Dynamic Bucket

Configure `'bucket' = '-1'`, Paimon dynamically maintains the index, automatic expansion of the number of buckets.

- Option1: `'dynamic-bucket.target-row-num'`: controls the target row number for one bucket.
- Option2: `'dynamic-bucket.assigner-parallelism'`: Parallelism of assigner operator, controls the number of initialized bucket.

Dynamic Bucket mode uses HASH index to maintain mapping from key to bucket, it requires more memory than fixed bucket mode.
For performance:

1. Generally speaking, there is no performance loss, but there will be some additional memory consumption, **100 million**
   entries in a partition takes up **1 GB** more memory, partitions that are no longer active do not take up memory.
2. For tables with low update rates, this mode is recommended to significantly improve performance.

### Partial-Update: Sequence Group

A sequence-field may not solve the disorder problem of partial-update tables with multiple stream updates, because
the sequence-field may be overwritten by the latest data of another stream during multi-stream update. So we introduce
sequence group mechanism for partial-update tables. It can solve:

1. Disorder during multi-stream update. Each stream defines its own sequence-groups.
2. A true partial-update, not just a non-null update.
3. Accept delete records to retract partial columns.

### First Row Merge Engine

By specifying `'merge-engine' = 'first-row'`, users can keep the first row of the same primary key. It differs from the
`deduplicate` merge engine that in the `first-row` merge engine, it will generate insert only changelog.

This is of great help in replacing log deduplication in streaming computation.

### Lookup Changelog-Producer

Lookup Changelog-Producer is available in production, this can greatly reduce the delay for tables that need to
generate changelogs.

(Note: Please increase `'execution.checkpointing.max-concurrent-checkpoints'` Flink configuration, this is very
important for performance).

### Sequence Auto Padding

When the record is updated or deleted, the `sequence.field` must become larger and cannot remain unchanged.
For -U and +U, their sequence-fields must be different. If you cannot meet this requirement, Paimon provides
option to automatically pad the sequence field for you.

Configure `'sequence.auto-padding' = 'row-kind-flag'`: If you are using same value for -U and +U, just like "`op_ts`"
(the time that the change was made in the database) in Mysql Binlog. It is recommended to use the automatic
padding for row kind flag, which will automatically distinguish between -U (-D) and +U (+I).

### Asynchronous Compaction

Compaction is inherently asynchronous, but if you want it to be completely asynchronous and not blocking writing,
expect a mode to have maximum writing throughput, the compaction can be done slowly and not in a hurry.
You can use the following strategies for your table:

```shell
num-sorted-run.stop-trigger = 2147483647
sort-spill-threshold = 10
```

This configuration will generate more files during peak write periods and gradually merge into optimal read
performance during low write periods.

### Avro File Format

If you want to achieve ultimate compaction performance, you can consider using row storage file format AVRO.
- The advantage is that you can achieve high write throughput and compaction performance.
- The disadvantage is that your analysis queries will be slow, and the biggest problem with row storage is that it
  does not have the query projection. For example, if the table have 100 columns but only query a few columns, the
  IO of row storage cannot be ignored. Additionally, compression efficiency will decrease and storage costs will
  increase.

```shell
file.format = avro
metadata.stats-mode = none
```

If you don't want to modify all files to Avro format, at least you can consider modifying the files in the previous
layers to Avro format. You can use `'file.format.per.level' = '0:avro,1:avro'` to specify the files in the first two
layers to be in Avro format.

## Append Only Table

### Append Only Scalable Table

By defining `'bucket' = '-1'` to a non-pk table, you can assign an [Append Only Scalable Table](https://paimon.apache.org/docs/0.5/concepts/append-only-table/#append-for-scalable-table).
In this mode, the table doesn't have the concept of bucket anymore, read and write are concurrent. We regard this table
as a batch off-line table(although we can stream read and write still).

Using this mode, you can replace your Hive table to lake table.

We have auto small file compaction for this mode by default. And you can use `Sort Compact` action to sort whole partition,
using zorder sorter, this can greatly speed up data skipping when querying.

## Manage Tags

Paimon's snapshots can provide an easy way to query historical data. But in most scenarios, a job will generate too many
snapshots and table will expire old snapshots according to table configuration. Snapshot expiration will also delete old
data files, and the historical data of expired snapshots cannot be queried anymore.

To solve this problem, you can create a [Tag](https://paimon.apache.org/docs/0.5/maintenance/manage-tags/) based on a
snapshot. The tag will maintain the manifests and data files of the snapshot. A typical usage is creating tags daily,
then you can maintain the historical data of each day for batch reading.

Paimon supports automatic creation of tags in writing job. You can use `'tag.automatic-creation'`to create tags automatically.

And you can query the incremental data of Tags (or snapshots) too, both Flink and Spark support incremental queries. 

## Engines

### Flink

After Flink released [1.17](https://flink.apache.org/2023/03/23/announcing-the-release-of-apache-flink-1.17/), Paimon
underwent very in-depth integration.

- [ALTER TABLE](https://paimon.apache.org/docs/0.5/how-to/altering-tables/) syntax is enhanced by including the
  ability to ADD/MODIFY/DROP columns, making it easier for users to maintain their table schema.
- [FlinkGenericCatalog](https://paimon.apache.org/docs/0.5/engines/flink/#quick-start), you need to use Hive metastore. 
  Then, you can use all the tables from Paimon, Hive, and Flink Generic Tables (Kafka and other tables)!
- [Dynamic Partition Overwrite](https://paimon.apache.org/docs/0.5/how-to/writing-tables/#dynamic-overwrite) Flink’s
  default overwrite mode is dynamic partition overwrite (that means Paimon only deletes the partitions appear in the
  overwritten data). You can configure dynamic-partition-overwrite to change it to static overwritten.
- [Sync Partitions into Hive Metastore](https://paimon.apache.org/docs/0.5/how-to/creating-catalogs/#synchronizing-partitions-into-hive-metastore)
  By default, Paimon does not synchronize newly created partitions into Hive metastore. If you want to see a partitioned
  table in Hive and also synchronize newly created partitions into Hive metastore, please set the table property `metastore.partitioned-table` to true.
- [Retry Lookup Join](https://paimon.apache.org/docs/0.5/how-to/lookup-joins/) support Retry Lookup and Async Retry Lookup.

### Spark

Spark is another computing engine that Paimon has in-depth integration and has taken a big step forward at 0.5, including the following features:

- [INSERT OVERWRITE](https://paimon.apache.org/docs/0.5/how-to/writing-tables/#overwriting-the-whole-table) insert ovewrite
  partition, Spark’s default overwrite mode is static partition overwrite, you can enable dynamic overwritten too.
- Partition Management: Support `DROP PARTITION`, `SHOW PARTITIONS`.
- Supports saving a DataFrame to a paimon location.
- Schema merging write: You can set `write.merge-schema` to true to write with schema merging.
- Streaming sink: You can use Spark streaming `foreachBatch` API to streaming sink to Paimon.

## Download

Download the release [here](https://paimon.apache.org/docs/0.5/project/download/).

## What's next?

Paimon will be committed to solving the following scenarios for a long time:

1. Acceleration of CDC data into the lake: real-time writing, real-time query, and offline immutable partition view by using Tags.
2. Enrich Merge Engines to improve streaming computation: Partial-Update table, Aggregation table, First Row table.
3. Changelog Streaming read, build incremental stream processing based on lake storage.
4. Append mode accelerates Hive offline tables, writes in real time and brings query acceleration after sorting.
5. Append mode replaces some message queue scenarios, stream reads in input order, and without data TTL.
