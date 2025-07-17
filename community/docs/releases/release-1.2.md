---
title: "Release 1.2"
type: release
version: 1.2.0
weight: 94
---

# Apache Paimon 1.2 Available

JUL 16, 2025 - Zelin Yu (yuzelin.yzl@gmail.com)

The Apache Paimon PMC officially announces the release of Apache Paimon 1.2.0. This version has been developed for 
nearly 3 moths, bringing together the wisdom of more than 50 developers from the global open source community, and 
has completed more than 260 commits. We sincerely thank all the developers who contributed!

## Version Overview

Notable changes in this version are:
1. Polished Iceberg compatibility, more silky integration with Iceberg.
2. Introduce Function to enhance data processing and query capabilities.
3. REST Catalog capability further enhanced.
4. Postpone bucket (adaptive bucket) Table capability enhancement and bug fix.
5. Support for migrating Hudi tables to Paimon tables.
6. Continue to enhance the integration with Flink/Spark/Hive, add new features and fix bugs.
7. Make multiple optimizations for memory usage to avoid potential OOM issues.

## Iceberg Compatibility

In this version, Iceberg compatibility adds the following capabilities:

1. Deletion vector compatibility: The file format of Iceberg's deletion vector is different from Paimon's, so we 
introduce a new deletion vector file format. You can set `delete-vectors.bitmap64 = true` to produce the 
Iceberg-compatible delete vector files.

2. Flexible storage location setting: When `metadata.iceberg.storage = table-location` is set, the Iceberg metadata 
is stored in the table directory, but won't be registered in Hive/AWS Glue. Therefore, a new option 
`metadata.iceberg.storage-location` is introduced. When it is set to `table-location`, the Iceberg metadata is stored 
in the table directory and also registered in Hive/AWS Glue. In this way, you can deployment the data flexibly.

3. Tag support: Now, when a Paimon Tag is created or deleted, the corresponding Iceberg metadata is also changed, and you
can access the Tag through Iceberg.

## Function

We introduce the Function interface for better data and query processing. Currently, supporting three types:

1. File Function: Provides the Function definition through a File.
2. Lambda Function: Defines the Function by Java lambda expression.
3. SQL Function： Defines the Function by Java SQL.

Examples of Function management by Spark are as follows:

Create:
```
CALL sys.create_function(
	`function` => 'my_db.area_func',
	`inputParams` => '[{"id": 0, "name":"length", "type":"INT"}, {"id": 1, "name":"width", "type":"INT"}]',
	`returnParams` => '[{"id": 0, "name":"area", "type":"BIGINT"}]',
	`deterministic` => true,
	`comment` => 'comment',
	`options` => 'k1=v1,k2=v2'
);
```

Modify the definition:
```
CALL sys.alter_function(
  `function` => 'my_db.area_func',
  `change` => '{"action" : "addDefinition", "name" : "spark", "definition" : {"type" : "lambda", "definition" : "(Integer length, Integer width) -> { return (long) length * width; }", "language": "JAVA" } }'
);
```

Using in query:
```
SELECT paimon.my_db.area_func(1, 2);
```

Delete:
```
CALL sys.drop_function(`function` => 'my_db.area_func');
```

Currently, the wide-used computing engines don't support functions well. When they provide better Function interfaces, 
we can provide a more convenient user interface with the computing engines.

## REST Catalog

This release continues to enhance the REST Catalog, providing the following optimizations and bug fixes:

1. Provide row-level and column-level data authentication interfaces.
2. Add the following data access interfaces: list tables, list views, list functions.
3. Support list object with pattern.
4. Provide the snapshot access interface.
5. Fix the problem that the table created under REST Catalog cannot read the fallback branch.

## Postpone Bucket

This version continues to improve the Postpone bucket table capabilities, such as:

1. Support deletion vector.
2. Support `partition.sink-strategy` option which improves write performance.
3. Paimon CDC supports Postpone bucket table.
4. Fix the problem that lookup join with a Postpone bucket table as dimension table produces wrong result.
5. Fix possible data error problem of Postpone bucket table write job when the source and sink parallelisms are not the same.
6. Fix the problem that the Postpone bucket table cannot be streaming read when `changelog-producer = none`.
7. Fix possible data lost problem if the rescale and compaction jobs of one Postpone bucket table are submitted at the same time. 
The `commit.strict-mode.last-safe-snapshot` option is provided to solve it. The job will check the correctness of commit from the 
snapshot specified by the option. If the job is newly started, you can directly set it to -1.

## Hudi Migration

We provide a Huid table migration tool to support Hudi table easily integrated with the Paimon ecosystem. Currently, only Hudi 
tables registered in HMS are supported. The usage is as follows (through the Flink Jar job):

```
<FLINK_HOME>/flink run ./paimon-flink-action-1.2.0.jar \
  clone \
  --database default \
  --table hudi_table \
  --catalog_conf metastore=hive \
  --catalog_conf uri=thrift://localhost:9088 \
  --target_database test \
  --target_table test_table \
  --target_catalog_conf warehouse=my_warehouse \
  --parallelism 10 \
  --where <partition_filter_spec>
```

## Compute Engine Integration Enhancements

This version provides new features and bug fixes of the Flink/Spark/Hive connector:

1. Flink lookup join optimization: Previously, all data of the Paimon dimension table needs to be cached in task manager. 
[FLIP-462](https://cwiki.apache.org/confluence/display/FLINK/FLIP-462+Support+Custom+Data+Distribution+for+Input+Stream+of+Lookup+Join)
allows to customize the data shuffle mode of the lookup join operator. Paimon implements this optimization, allowing each subtask 
to load part of the dimension table data (instead of full data). In this way, the loading of the dimension table will take less time 
when starting the job and the cache will use less memory. 

This optimization requires: i) Using Flink 2.0; ii) The Paimon table is a Fixed bucket table and the join keys contains all bucket keys
(if not configured, the bucket keys is the same as primary keys). You should use lookup join hints to enable this optimization:

```
-- customers is the Paimon dimension table
SELECT /*+ LOOKUP('table'='c', 'shuffle'='true') */
o.order_id, o.total, c.country, c.zip
FROM orders AS o
JOIN customers
FOR SYSTEM_TIME AS OF o.proc_time AS c
ON o.customer_id = c.id;
```

2. Paimon dimension table supports to be loaded in-memory cache: Previously, Paimon dimension table uses RocksDB as the cache, 
but its performance is not very good. Therefore, this version introduces purely in-memory cache for dimension table data (note 
that it may lead to OOM). You can set `lookup.cache = memory` to enable it.

3. Support V2 write for Spark which reducing serialization overhead and improving write performance. Currently, only fixed bucket 
and append-only (bucket = -1) table are supported. You can set `write.use-v2-write = true` to enable it.

4. Fix the possible data error problem of Spark bucket join after rescaling bucket.

5. Fix that Hive cannot read/write data of timestamp with local timezone type correctly.

## Memory Usage Optimization

Our users have fed back many OOM problems, and we have made some optimizations to solve them:

1. Optimize the deserialization of the data file statistics to reduce memory usage.

2. For Flink batch jobs, the splits scan are handled in initialization phase in job manager. If the amount of data is large, the job 
initialization will take a long time and even fail with OOM. To avoid this, you scan set `scan.dedicated-split-generation = true` to 
let the splits be scanned in task manager after the job is started.

3. If you write too many partitions at a time to a Postpone bucket table, it is easy to cause OOM. We have optimized the memery usage
to solve it. 

4. When too many partitions data are expired in a single commit, it is possibly to produce OOM. You can set `partition.expiration-batch-size`
to specify the limit of maximum partitions can be expired in a single commit to avoid this problem.

## Others

1. Support default value: The old version of the default value implementation has some defects, and we reimplemented a new version of it.
Spark and Flink usages are as follows:

Spark:
```
-- Define
CREATE TABLE my_table (
    a INT,
    b INT DEFAULT 2
);

-- Modify
ALTER TABLE my_table ALTER COLUMN b SET DEFAULT 3;
```

Flink: Flink SQL does not support default values now, so you should create the table first, then set the default values through Procedure.
```
CREATE TABLE my_table (
    a INT,
    b INT
);

CALL sys.alter_column_default_value('default.my_table', 'b', '2');
```

2. Introduce a new time travel option: `scan.creation-time-millis` to specify a timestamp. If a snapshot is available near the time, starting 
from the snapshot. Otherwise, reading files created later than the specified time. This option combines the `scan.snapshot-id/scan.timestamp-millis` 
and `scan.file-creation-time-millis`.

3. Support custom partition expiration strategy: You can provide a custom `PartitionExpireStrategyFactory` and set the table option `partition.expiration-strategy = custom`
to activate your partition expiration method.

4. Support custom Flink commit listeners: You can provide multiple custom `CommitListenerFactory` and set the table option `commit.custom-listeners = listener1,listener2,...` 
to activate your commit actions at commit phase in a Flink write job.
