---
title: "Release 0.9"
type: release
version: 0.9.0
date: 2024-09-13
---

# Apache Paimon 0.9 Available

Sep 13, 2024 - Jingsong Lee (jingsonglee0@gmail.com)

The Apache Paimon PMC officially announces the release of Apache Paimon 0.9.0. This version was developed over the
course of four months, with the participation of 80 contributors, resulting in more than 600 commits.

Thank you to all contributors for your support!

The community has decided that the next version will be 1.0, marking that most functionalities of Apache Paimon have
become relatively mature and stable.

## Version Overview

Paimon's long-term plan is to become a unified lake storage format that meets the main requirements for minute level
big data: offline batch computing, real-time stream computing, and OLAP computing.

Notable changes in this version include:

1. Paimon Branch: The branch functionality is now officially production-ready, and the introduction of the 'scan.fallback-branch'
   feature helps to better unify stream and batch storage for businesses.
2. Universal Format: This version introduces native Iceberg compatibility. You can enable Iceberg compatibility mode, and
   Paimon will generate Iceberg-compatible snapshots in real-time, allowing you to use the Iceberg ecosystem to read this Paimon table.
3. Caching Catalog: This version introduces the implementation of Caching Catalog by default. Table metadata and manifest
   files will be cached in the catalog, which can accelerate OLAP query performance.
4. Improvements in Bucketed Append Table Availability: The small file issue has been significantly alleviated, and it
   can be applied to bucketed joins in Spark, reducing shuffles during joins.
5. Support for DELETE & UPDATE & MERGEINTO in Append Tables: This version introduces support for DELETE, UPDATE, and
   MERGE INTO in append tables. You can modify and delete records in append tables using Spark SQL, and it also supports
   Deletion Vectors mode.

## Compatibility Changes

The following changes may impact the compatibility of your usage.

### Bucketed Append Tables

When defining a table without a primary key, if the number of 'bucket' is defined, the table is considered a Bucketed 
Append table, previously referred to as an Append Queue table, as it is more commonly used in ordered stream writes and
reads. The issue of small files has been significantly alleviated, and it can be applied in Spark for Bucketed Joins, 
reducing shuffles during joins.

Here are some changes to its default values:

1. Bucketed Append tables are prohibited from being defined without a bucket-key. The behavior in previous versions was
   to hash the entire row to determine the corresponding bucket, which is an unintuitive behavior. We recommend using
   an older version of Paimon to refresh the data (write into a new valid table).
2. The default value of the 'compaction.max.file-num' option for Bucketed Append tables has been adjusted to 5, meaning
   there will be fewer small files within a single bucket to avoid excessive small files affecting production usability.

Despite this, we still recommend that you avoid defining Bucketed Append tables unless necessary; the default bucket -1
mode is more user-friendly.

### File Format and Compression

The Paimon community is focused on improving overall performance under default options. The following option default
values have been modified in version 0.9:

1. File Format 'file.format': The default has changed from ORC to Parquet. There is no essential difference between these
   formats, but Parquet generally performs better, and the community has completed all capabilities for Parquet, including
   support for nested types, Filter PushDown, and more.
2. File Size 'target-file-size': The size for primary key tables remains at 128MB, while the default for non-primary key
   tables (Append tables) has been adjusted to 256MB.
3. Compression Default 'file.compression': The default has changed from LZ4 to ZSTD, with the default ZSTD compression
   level set to 1. You can adjust the compression level using 'file.compression.zstd-level', consuming more CPU for
   greater compression rates.
4. Local Spill Compression Level 'spill-compression.zstd-level': Likewise, local spill can also achieve greater
   compression rates by adjusting the level.

### CDC Ingestion

The dependency for Flink CDC has been upgraded to version 3.1. Since Flink CDC has become a sub-project of Flink in this
version, the package names have been modified, rendering older versions of CDC unsupported. MySQL CDC, MongoDB CDC, and
Postgres CDC will be affected.

## Paimon Branch

Branching is an interesting feature that allows us to manipulate Paimon tables in a manner similar to Git. It has
reached a production-ready state in Paimon 0.9, and Alibaba's internal teams are already using it in production
environments for tasks such as data correction and stream-batch integration.

For example, you can use branches for data correction:

```sql
-- create branch named 'branch1' from tag 'tag1'
CALL sys.create_branch('default.T', 'branch1', 'tag1');

-- write to branch 'branch1'
INSERT INTO `t$branch_branch1` SELECT ...

-- read from branch 'branch1'
SELECT * FROM `t$branch_branch1`;

-- replace master branch with 'branch1'
CALL sys.fast_forward('default.T', 'branch1');
```

You can also use branches for unified stream-batch storage. You can set up a separate stream branch and then configure
'scan.fallback-branch'. This way, when a batch processing job reads from the current branch and a partition is missing,
it will attempt to read that partition from the fallback branch.

Suppose you create a Paimon table partitioned by date. You have a long-running streaming job that inserts records into
Paimon so that today's data can be queried in a timely manner. You also have a nightly batch processing job that overwrites
the partitions in Paimon to ensure data accuracy. When you query this Paimon table, you want to read first from the results
of the batch processing job. However, if a specific partition (for example, today's partition) is missing in its results,
you want to read from the results of the streaming job. In this case, you can create a branch for the streaming job and 
set 'scan.fallback-branch' to that streaming branch.

```sql
-- create a branch for streaming job (realtime)
CALL sys.create_branch('default.T', 'rt');

-- set primary key and bucket number for the branch
ALTER TABLE `T$branch_rt` SET (
    'primary-key' = 'dt,name',
    'bucket' = '2',
    'changelog-producer' = 'lookup'
);

-- set fallback branch
ALTER TABLE T SET (
    'scan.fallback-branch' = 'rt'
);

SELECT * FROM T;
```

## Universal Format

Paimon's Universal Format allows you to use Iceberg clients or compute engines to read data within Paimon. By using the
'metadata.iceberg-compatible' option, Paimon automatically generates Iceberg snapshots in the filesystem when creating
snapshots, without requiring any additional dependencies or concerns about governance-related issues.

Notable points include:

1. Iceberg metadata is stored in the file system (corresponding to Iceberg's HadoopCatalog). For example, you can read
   it using Spark DataFrame: spark.read.format("iceberg").load("path").
2. Iceberg views are read-only, and writing through this method may corrupt the table.
3. For primary key tables, Iceberg views can only access the highest level (LSM Level) files. You can configure
   'compaction.optimization-interval' to control the visibility of the data.

## Caching Catalog

Paimon's metadata is stored in the filesystem, which leads to frequent access to the filesystem during the planning
phase in compute engines, potentially impacting single-point performance, especially in object storage where this cost
is even higher.

This version introduces the implementation of Caching Catalog by default, which will be enabled automatically
(it only caches manifest files smaller than 1MB by default). This can accelerate the performance of OLAP queries.

You can control the behavior of the cache using the following options:

| option                              | default | description                                                                     | 
|-------------------------------------|---------|---------------------------------------------------------------------------------|
| cache-enabled                       | true    | Controls whether the catalog will cache databases, tables and manifests.        |
| cache.expiration-interval           | 1 min   | Controls the duration for which databases and tables in the catalog are cached. |
| cache.manifest.max-memory           | (none)  | Controls the maximum memory to cache manifest content.                          |
| cache.manifest.small-file-memory    | 128 mb  | Controls the cache memory to cache small manifest files.                        |
| cache.manifest.small-file-threshold | 1 mb    | Controls the threshold of small manifest file.                                  | 

## Deletion Vectors

The Deletion Vectors mode is fully available in version 0.9.

For primary key tables, the Deletion Vectors mode now supports asynchronous compaction (defaulting to semi-synchronous),
significantly enhancing its usability without heavily impacting checkpoints. Since the DV mode requires local disk usage,
we recommend using SSDs for local disks; performance can be quite poor with lower-quality HDDs.

For non-primary key tables (Append tables), version 0.9 supports DELETE, UPDATE, and MERGE INTO operations via Spark SQL,
making Paimon append tables resemble complete database tables, enabling fine-grained modifications and deletions for users.

Moreover, non-primary key tables also support the Deletion Vectors mode. Before enabling it, deletions and modifications
are done using copy-on-write; once the DV mode is enabled, deletions and modifications switch to merge-on-write.
Deletion files will be removed during compaction.

## Core

### New Aggregation Functions

The new aggregation functions include hll_sketch, theta_sketch, rbm32, and rbm64. You can use these sketch-related
functions to estimate COUNT DISTINCT.

Paimon does not support custom aggregation functions but encourages you to propose enhancements to the built-in function library in the community.

### Universal File Index

The universal file index now supports the Bitmap type and also supports the REWRITE CALL command, allowing you to regenerate the corresponding index.

Bitmap indexes perform well under joint filter conditions across multiple fields.

### Historical Partition Compact

Additionally, if your table is a partitioned table, although Paimon has built-in automatic compaction, its historical
partitions may not have undergone full compaction. In version 0.9, we introduced partition_idle_time to automatically
select partitions that haven't been updated for full compaction, reducing small files and improving query performance.

## Flink

### Cluster

Clustering allows you to organize data in an Append table based on the values of certain columns during the write process.
This data organization method can significantly improve the efficiency of downstream tasks when reading data, as it enables
faster and more targeted data queries. This feature only supports Append tables (with bucket = -1) and batch execution mode.

```sql
INSERT INTO my_table /*+ OPTIONS('sink.clustering.by-columns' = 'a,b') */ SELECT * FROM source;
```

### Partition Mark Done

For partitioned tables, each partition may need to be scheduled to trigger downstream batch computations. Therefore,
it is essential to choose the right timing to indicate that a partition is ready for scheduling, while minimizing
data drift during the scheduling process. We refer to this process as "Marking a Partition as Done."

```sql
CREATE TABLE my_partitioned_table (
    f0 INT,
    f1 INT,
    f2 INT,
    ...
    dt STRING
) PARTITIONED BY (dt) WITH (
    'partition.timestamp-formatter'='yyyyMMdd',
    'partition.timestamp-pattern'='$dt',
    'partition.time-interval'='1 d',
    'partition.idle-time-to-done'='15 m'
);
```

1. First, it is necessary to define the time parsing for the partition and the time interval between partitions to
   determine when it is appropriate to mark a partition as complete.
2. Second, idle time needs to be defined, which determines how long a partition must wait without new data before it
   can be marked as complete.
3. Third, by default, marking a partition as complete will create a _SUCCESS file. You can also configure
   partition.mark-done-action to define specific actions.

### Table Clone

In Paimon 0.9, the clone table action is supported for data migration. Currently, it only clones the table files used
by the latest snapshot. If the table you are cloning hasn’t been modified during this period, it is recommended to
submit a Flink batch job for better performance. However, if you wish to clone the table while writing, you should
submit a Flink stream processing job for automatic fault recovery. This command can assist you with convenient data
backup and migration.

### Procedures

Paimon 0.9 introduces a large number of procedures. Additionally, Flink procedures now support the latest version of
named procedures, making your execution more convenient without the need to specify all parameters forcefully.

## Spark

### Dynamic Options

Historically, Spark SQL lacked the capability for dynamic parameters, while Flink SQL offers dynamic options that are
very convenient. In version 0.9, Spark introduces this capability through the SET command. The SET command allows for
specific Paimon configurations by requiring the prefix spark.paimon. to be added.

```sql
-- set paimon conf
SET spark.paimon.file.block-size=512M;

-- reset conf
RESET spark.paimon.file.block-size;
```

### Bucketed Join

Hive has a feature called Bucketed Join. When two tables are bucketed by the same column, a Bucketed Join can be
performed without the need for shuffling the data; the join can be executed directly on the buckets, making it very efficient.

Buckets are one of the core concepts in Paimon. Previously, Paimon lacked integration with compute engines, preventing
the utilization of this feature for optimization.

In version 0.9, Paimon achieves deep integration with Spark SQL, enabling this optimization:

- Optimized Execution: By leveraging the bucket structure during join operations, Paimon can significantly reduce 
  the overhead of data shuffling, leading to better performance on join queries.
- Seamless Configuration: Users can easily define buckets when creating tables, allowing for straightforward
  implementation of bucketed joins in their Spark SQL queries.

```sql
-- Enable bucketing optimization
SET spark.sql.sources.v2.bucketing.enabled=true;

-- Bucketed Join
SELECT * FROM t1 JOIN t2 on t1.id = t2.id
```

As long as both tables involved in the join are bucketed tables (whether they are primary key tables or non-primary key
tables) and the bucket-key field corresponds to the join field, an efficient Bucketed Join will take place. This
optimization minimizes data shuffling and enhances query performance, making it a valuable feature for handling large
datasets in Paimon.

### Writing to Dynamic Bucket Tables

- Optimized Writing: Spark SQL can now write to dynamic bucket tables with optimizations that reduce data shuffling
  during the first write operation.
- Cross-Partition Updates: Spark SQL now supports writing to tables with cross-partition updates, although the overall
  efficiency for these operations is still not optimal.

## Other Progress

- Paimon Web UI: The Web UI is being released; feel free to try it out!
- Paimon Python: The release process for version 0.1 is expected to start soon.
- Paimon Rust: In development, with an expected release of a readable version in 0.1.
