---
title: "Release 1.0"
type: release
version: 1.0.1
---

# Apache Paimon 1.0 Available

Feb 10, 2025 - Jingsong Lee (jingsonglee0@gmail.com)

Apache Paimon PMC Officially Releases Milestone 1.0 Stable Version (Version 1.0.1).

This core version has undergone nearly 5 months of meticulous refinement, gathering the wisdom of over 70 developers from the
global open-source community, resulting in more than 520 code submissions that fully demonstrate the power of community-driven
technological evolution. We sincerely thank all the developers who contributed!

Notably, Paimon 1.0 has successfully passed rigorous production verification from top enterprises such as Alibaba Group and
ByteDance. During the peak of traffic during the Double Eleven Global Shopping Festival, Paimon demonstrated excellent scalability
and stability. This milestone not only marks the official entry of stream lake-warehouse technology into a new stage of mature 
development but also proves that Paimon’s lake storage architecture has industrial-grade capabilities to support data storage 
exceeding 100 PB.

## Overview

In Paimon 1.0, there were no major kernel modifications introduced; the focus has been on stabilizing and optimizing kernel design.
We have introduced some eco-friendly features related to the Catalog, strengthened snapshot submissions, enhanced lookup performance,
and optimized the storage of primary key tables.

1. We have introduced many exciting ecosystem integrations; the Catalog ecosystem now supports Format Tables to be compatible with Hive tables.
   It also supports views and introduces Object Tables to manage unstructured data.
2. Iceberg compatibility has officially entered production availability in version 1.0, with integration into AWS-related ecosystems, and DuckDB's capability to read Iceberg tables.
3. We have significantly optimized the capabilities related to snapshot transactions to handle submissions of extremely large or wide tables.
4. We have core enhancements to the Orphan File Clean to enable distributed execution, which is a core part of our daily table management and operations.
5. The algorithm for local lookups (which is the basis for Lookup Changelog-producer, primary key table Deletion Vectors mode, and Flink Lookup Join) has changed from Hash to Sort, greatly enhancing local disk compression rates.
6. Count(*) SQL acceleration has been implemented, which no longer requires reading data files but returns results directly; this acceleration effect will benefit both non-primary key tables and primary key DV tables.
7. The Thin mode for primary key tables has been introduced, where primary key-related fields will no longer be stored redundantly; however, this feature is not enabled by default for compatibility reasons.
8. The Bitmap in file indexing has been significantly enhanced by allowing the index to be pushed down to the page level of Parquet files, which significantly boosts query performance.

## Ecosystem

### Catalog Ecosystem

<img src="./img/v1-catalog.png" alt="catalog" />

The image above shows the current Catalog ecosystem related to Paimon 1.0. Before version 1.0, there were only Paimon Primary Key Tables and Append Tables; version 1.0 has greatly expanded this ecosystem:

1. View: When the metastore (such as Hive) supports views, it can support views. If there is no metastore, only temporary views can be used, which exist only in the current session. Persistent views will currently save the original SQL. If cross-engine view usage is needed, users can write cross-engine SQL statements.
2. Format Table: When the metastore (such as Hive) supports format tables, Format Tables are supported. Hive tables in the metastore will map to Paimon's format tables for reading and writing by computation engines (Spark, Hive, Flink). This type is mainly used for compatibility with Hive tables.
3. Object Table: Object Tables provide metadata indexing for unstructured data objects in designated object storage directories, allowing users to analyze unstructured data in object storage.
4. Materialized Table: Materialized Tables aim to simplify batch processing and streaming data pipelines, providing a consistent development experience, such as with Flink Materialized Tables. Currently, only Flink SQL is integrated into materialized tables.

The upcoming Paimon versions will:

1. Bring support for Views and Format Tables to FileSystemCatalog.
2. Consider supporting dialects for Views.
3. Propose cross-engine materialized view definitions for Materialized Tables, allowing cooperative operations with engines such as Spark and StarRocks.
4. Introduce cross-engine function definitions.

### Iceberg Compatibility

Paimon supports generating Iceberg-compatible metadata so that Iceberg Readers can directly use Paimon tables. This Iceberg compatibility has become production-ready in this version!

<img src="./img/v1-iceberg.png" alt="iceberg" />

With Iceberg compatibility, a large ecosystem of Iceberg can be unlocked, including various serverless computing products. Paimon 1.0 core addressed:

1. Support for complex types.
2. Verification of integration with Athena and Glue Catalog.
3. Verification of DuckDB’s capability to read Iceberg data.

Paimon key tables organize data files as an LSM tree, meaning data files must be merged before queries or combined with Deletion Vectors. However, Iceberg Readers cannot merge data files and can only query the highest level of data files in the LSM tree. The highest-level data files are generated through full compaction.

Fortunately, Iceberg’s latest R&D also supports Deletion Vectors, allowing Paimon primary key table Deletion Vectors to produce Iceberg snapshots without loss. Further integration will occur following Iceberg's new version release.

## Transactions

In Alibaba Group's Taobao business, the largest single partition of the biggest table even exceeds 100TB, presenting many challenges for the Manifest. Therefore, in Paimon 1.0, we have significantly improved the performance of snapshot submissions and the performance during multi-job writing.

This version introduced Manifest Merging memory optimization, avoiding retaining full DataFileMeta in memory, preventing memory issues that had led to instability (e.g., OOM) in previous versions.

<img src="./img/v1-commit.png" alt="commit" />

Simultaneous submissions from multiple jobs are a core capability of Paimon; for instance, one job writes data while another handles compaction. However, in previous versions, if the data volume was too large and too many files were involved, submission failures occurred frequently, which could lead to job failover. This version significantly optimizes the recurring conflict issues during simultaneous writes, preventing prolonged conflicts that could lead to job failover.

This version introduced a Dense mode for statistics that avoids occupying a lot of unnecessary space, allowing super wide tables with over 1000 columns to be well supported. The amount of metadata storage has been reduced by 100 times when 'metadata.stats-mode' = 'none'.

The Dense mode for statistics may introduce compatibility issues; however, it only affects the 'metadata.stats-mode' = 'none' case. If you want to maintain compatibility with old-version Readers, you can configure 'metadata.stats-dense-store' = 'false', though this is generally not recommended as it does not save much metadata space in non-dense mode.

When deleting files, it also supports not saving statistical information, configurable via 'manifest.delete-file-drop-stats' = 'true', with a default value of false due to similar compatibility concerns with older-version Readers. If you have upgraded all Readers, it is advisable to enable this parameter, which will further enhance compaction's stability.

## Management

When Paimon’s writing jobs undergo failover, some uncommitted temporary files may remain, wasting storage space in the file system; thus, Paimon provides tools for cleaning orphan files.

However, this tool was executed in single-machine mode in previous versions, leading to significant performance issues in cleaning super large tables. Therefore, this version has introduced distributed execution capabilities that support Flink and Spark computation engines.

## Performance

### Local Lookup

Local lookup is the fundamental capability of Paimon’s point query LSM structure, serving as the foundational infrastructure for:

1. Lookup changelog-producer: generates changelogs from historical files.
2. Primary key table deletion vectors mode: generates deletion vectors from historical files.
3. Flink Lookup Join: uses local lookup when the join condition is the primary key of the dimension table.

Earlier versions used HashFile to solve the lookup challenge, though it had two drawbacks:

1. Multiple disk copies occur while generating HashFile.
2. HashFile had poor compression rates, even with ZSTD compression only achieving 2-3 times compression.

In Paimon 1.0, we switched to a new Sort Based file format:

<img src="./img/v1-sort.png" alt="sort" />

This format, similar to LevelDB SST files, has better compression rates and lower disk IO amplification. Tests on various datasets have shown compression rates improved by 3-5 times in many scenarios compared to Hash files.

### Count(*) Optimization

Paimon stores statistical information about data files in the Manifest. For Count(*) SQL queries, the data could originally be returned from within the Manifest, but prior versions still read every file, leading to high consumption.

In Paimon 1.0, we optimized this SQL in conjunction with Flink and Spark, for example, in the following SQL:

```sql
-- Querying Append table, can be accelerated
SELECT COUNT(*) FROM APPEND_T;

-- Querying Append table with specified partition, can be accelerated
SELECT COUNT(*) FROM APPEND_T WHERE dt = '20250101';

-- Querying primary key table in DV mode, can be accelerated
SELECT COUNT(*) FROM PRIMARY_KEY_T_DV;
```

### Thin Mode for Primary Key Tables

Previously, Paimon saved the following structure to the primary key table data files:

1. Key columns
2. _VALUE_KIND
3. _SEQUENCE_NUMBER
4. Value columns

In practice, it can be observed that the Value columns already contain all Key columns, thus saving the same data redundantly.

In the new version, the 'data-file.thin-mode' option has been provided to avoid saving redundant Key columns, which can save storage and enhance read/write performance.

Note that this feature may cause compatibility issues with old-version Readers; therefore, it is not enabled by default. Please ensure to upgrade your reading end first.

### File Index

The bitmap index in previous versions had some effect on point queries but was limited. In this version:

1. The Bitmap has been pushed down to the Parquet Reader and operates at the page level, significantly enhancing the filtering effect of the Bitmap and improving performance.
2. Bit-Slice Index Bitmap has been supported; BSI file indexing is a numeric range index used to accelerate range queries.
3. Additionally, primary key tables in Deletion Vectors mode support file-level indexing.

The new Bitmap index is also under discussion in the community and will significantly enhance performance when indexing columns have a high cardinality.

### Catalog Optimization

To avoid bottlenecks caused by metadata, the Catalog has also undergone some optimizations:

1. HiveCatalog: Significantly optimized unnecessary getTable calls, greatly accelerating the performance of listTables.
2. CachingCatalog: Introduced partition caching, added snapshot file caching, and included cached statistics.

### Parquet Reader

We completely restructured Paimon's Parquet Reader by referencing Spark SQL's Parquet Reader, significantly improving the read performance of complex types and reducing bugs related to complex types.

## Other Features

Improvements in Nested Schema support Nested Projection Pushdown and Nested Schema Evolution, allowing Paimon to fully support nested types and complete Schema Evolution.

Interestingly, a binlog system table has been introduced to allow querying binlogs through a binlog table; previous and subsequent updates will be packed into a single line, allowing stream reads to behave like MySQL binlogs, enabling you to处理在一起的 -U 和 +U 消息 (process -U and +U messages together).

## Flink Integration

In addition to advancing the Materialized Table with the Flink community, Paimon 1.0 also presents many enhancements related to stream processing and batch processing.

For Stream Processing:

1. CDC: Kafka Sync now supports complex types and Aliyun JSON types.
2. Local Merge (configured with 'local-merge-buffer-size') now utilizes a Hash algorithm, which is very beneficial for the efficiency of certain aggregated tables.
3. The Lookup Join has added a blacklist mechanism to avoid refresh impacts on stability during critical moments.
4. Memory optimizations for automatic compaction of Append tables allow extremely large tables to automatically compact small files.
5. When enabling Changelog-producer as Lookup, if Flink's checkpoint interval is short (e.g., 30 seconds), and the number of buckets is large, each snapshot may generate many small change log files. Therefore, a configuration 'changelog.precommit-compact' was introduced to compress small change log files into larger ones.

For Batch Processing:

1. Supports speculative execution in Flink batch processing.
2. Supports integration of Flink with Paimon, enabling access to statistics.
3. Supports generating Paimon statistics using Flink SQL.

## Spark Integration

Spark 4 has released preview 2 version, one of its important capabilities being Variant, including Variant Shredding, which can greatly enhance the handling of semi-structured data. The Paimon community will connect to the Variant and Variant Shredding capabilities in subsequent releases.

Additionally, Spark SQL supports using dynamic parameters to configure tables, for example:

```sql
-- set scan.snapshot-id=1 for the table default.T in any catalogs
SET spark.paimon.*.default.T.scan.snapshot-id=1;
SELECT * FROM default.T;
```

## Future Plans: REST

In future plans, we will focus on building the RESTCatalog and promoting the development of REST Servers. We expect to significantly enhance the overall experience, availability, and usability of the lake-warehouse through REST metadata services.
