---
title: "Release 1.3"
type: release
version: 1.3.0
weight: 95
---

# Apache Paimon 1.3 Available

NOV 27, 2025 - Jingsong Lee (jingsonglee0@gmail.com)

Apache Paimon PMC has officially released version 1.3. This core version has undergone over 3 months of careful polishing, 
with a total of more than 500 code commits completed. We would like to express our sincere gratitude to all the developers
who have participated in the contribution!

## Version Overview

Notable changes in this version are:
1. PyPaimon: Refactored Python SDK, a pure Python implementation version without JVM, with performance surpassing Java SDK in some scenarios.
2. Row Tracking: adds a global Row ID to the table; Data Evolution provides tables with the ability to quickly update column data, optimizing for large and wide tables.
3. Incremental Clustering: Sort and cluster data in an incremental manner, optimizing data layout at a relatively low cost and providing fast query validation for the Append table.
4. Rest Catalog: Virtual File System， Allow access to the file system managed by Rest Catalog in the form of database and table names, with unified directory names and unified permission management.
5. Performance optimization: Support Spark TopN push down; Limit push down; Introduce a new high-performance Range bitmap.
6. Performance optimization: Manifest Cache organizes its cache according to partitions and buckets, making it more efficient for OLAP engines to scan Manifests during queries.
7. Commit Conflict: Resolve the potential risk of file storage errors caused by MERGE-INTO and COMPACT simultaneously.

## Multimodal data lake

The direction of multimodal data lake, Apache Paimon focuses on the following directions:
1. Support multimodal data storage such as text, images, audio and video, and also support unified storage of structured tags and vector data. The Paimon community is developing capabilities for Blob storage and vector storage.
2. Provide efficient retrieval of multimodal data, including random retrieval and global indexing. The Paimon community is developing global indexing capabilities, providing bitmap, B-tree, vector indexing, and other capabilities.
3. Deep AI integration and application collaboration, docking with AI related distributed engines and applications, Paimon requires a high-performance Python SDK to integrate with the JVM free AI Python ecosystem.
4. The multimodal direction requires support for rapid column addition of tables to provide fast updates of tags corresponding to multimodal data, enabling engineers to quickly tagging and greatly improving the efficiency of AI processing.

Paimon 1.3 has made significant progress in both @3 and @4, and is being designed and developed for @1 and @2. We hope to release it in the next version.

### PyPaimon

We need a powerful PyPaimon SDK for the AI oriented Python ecosystem. PyPaimon had a version (0.2) last year that encapsulated Java code based on Py4j. Although it can meet all table schemas, it has the following serious issues:
1. The performance is too poor. If Py4j has data transmission, the performance will regress significantly.
2. JVM dependencies require the client's machine to install JVM related dependencies.

To this end, Paimon 1.3 completely reshaped the PyPaimon code and integrated it into the Paimon main repository, completely re implementing Paimon's Python SDK from the Python ecosystem. We compared its related performance:

<img src="./img/1.3-pypaimon.png" alt="pypaimon" />

As can be seen, compared to the old version of Python SDK, the performance is significantly ahead; Compared to Java implementation, it is also faster in some scenarios, thanks to the performance optimization of Arrow's native read and write in the Python ecosystem.

Note that currently PyPaimon can basically meet the requirements in the Append table, but only supports simple Deduplication capabilities for the primary key table, and does not currently support rich patterns. In future versions, the community will:
1. Continue to improve PyPaimon and cover more modes.
2. In the future, PyPaimon will be used to integrate with more ecosystems, such as Ray and Daft engines.

### Row Tracking

Row Tracking allows Paimon to track row level changes in the Append table. Once enabled on the Paimon table, two additional hidden columns will be added to the table structure:
1. _ROW_ID: BIGINT， This is the unique identifier for each row in the table. It is used to track updates of rows and can be used to identify rows when updating, merging, or deleting.
2. _SEQUENCE_NUMBER: BIGINT， This is a field indicating the version of this record. It is actually the snapshot ID of the snapshot to which this row belongs. It is used to track updates to the row version.

The biggest benefit of Row Tracking is the design of global IDs for tables, which lays the foundation for our subsequent Data Evolution and global indexing mechanisms.

Although Paimon supports full Schema Evolution, allowing you to freely add, modify, or delete column schemas. But how to update column data, you can use the MERGE Into statement, but it will overwrite all the affected row data during execution, which has high storage and computational costs.

Data Evolution is a new feature of the Append table that completely changes the way data evolution is handled, especially when adding new columns. This mode allows you to update some columns without rewriting the entire data file. On the contrary, it writes new column data into separate files and intelligently merges them with the original data during read operations.

For example, SQL:

```sql
CREATE TABLE target_table (id INT, b INT, c INT) 
TBLPROPERTIES (
  'row-tracking.enabled' = 'true', 
  'data-evolution.enabled' = 'true' 
);

INSERT INTO target_table VALUES (1, 1, 1), (2, 2, 2);

CREATE TABLE source_table (id INT, b INT);

INSERT INTO source_table VALUES (1, 11), (2, 22), (3, 33);
MERGE INTO target_table AS t USING source_table AS
 s ON t.id = s.id WHEN MATCHED THEN UPDATE SET t.b = s.b
  WHEN NOT MATCHED THEN INSERT (id, b, c) 
  VALUES (id, b, 0);

SELECT * FROM target_table;

+----+----+----+ 
| id | b  | c  |
+----+----+----+ 
| 1  | 11 | 1  | 
| 2  | 22 | 2  | 
| 3  | 33 | 0  |
```

This statement only updates column b in the target table target_table based on the matching records of the source table source_table, while keeping columns id and c unchanged, and inserts a new record with the specified value. The difference between this and tables without Data Evolution enabled is that only column b data is written to the new file, which is very lightweight.

In the performance comparison of typical data testing, after Data Evolution, the performance of the original MERGE Into is compared:
1. MERGE INTO has been optimized from 27 minutes to 17 minutes, significantly reducing execution time. If there are fewer updated data, the comparison becomes even stronger.
2. MERGE INTO storage space has been reduced from 170 GB to 1 GB, significantly reducing storage consumption and lowering costs.

Subsequent community plans:
1. Develop global indexes, including scalar indexes and vector indexes, to accelerate data queries.
2. Introducing Blob storage allows Paimon tables to easily store and analyze blob data ranging from KB to GB.

## Incremental Clustering

In version 1.3, a new and flexible data management method called Incremental Clustering is provided for the Append table. It is not only responsible for merging small files,
but also sorts and clusters data incrementally, optimizing data layout at a relatively low cost and bringing a fast query experience to the Append table. At the same time, 
users can flexibly adjust clustering keys without rewriting the data, and the data will dynamically evolve with the execution of incremental clustering, gradually achieving 
optimal results and significantly reducing the decision-making complexity related to user data layout.

To balance the effects of write amplification and sorting, Paimon utilized the hierarchical concept of LSM Tree to layer data files and the idea of Universal Compaction to select files that need to be clustered.

<img src="./img/1.3-incremetal-1.png" alt="incremental-1" />

Through multi-level design, the data volume of each cluster is controlled. The higher the level of data clustering, the more stable it is, and the lower the probability of rewriting, in order to slow down write amplification while ensuring good sorting performance.

Compared to tables without Cluster, under the dual clustering key filtering condition, Incremental Cluster query efficiency can be improved by over 150x;

<img src="./img/1.3-incremetal-2.png" alt="incremental-2" />

After enabling Incremental Cluster for the Append table, scheduling Incremental Cluster periodically can not only solve the problem of small files, but also maintain excellent query efficiency for the Append table. At the same time, you can change the clustering key at any time after changing the query mode.

## Virtual File System

REST Catalog provides built-in storage, including Paimon Table, Format Table, and Object Table (also known as Fileset or Volume), and some scenarios require direct access to the file system. And our REST Catalog generates UUID paths for tables, which makes it difficult to directly access the file system.

Therefore, PVFS (Paimon Virtual File System) allows users to access it through“ pvfs://catalog/database/table/ The path directly accesses all files of Catalog, including all internal tables. Another advantage is that all users access this file system through the permission system of Paimon REST Catalog, without the need to maintain another file system permission system.

```scala
val spark = SparkSession.builder()
  .appName("PVFS CSV Analysis")
  .config("spark.hadoop.fs.pvfs.impl",
    "org.apache.paimon.vfs.hadoop.PaimonVirtualFileSystem")
  .config("spark.hadoop.fs.pvfs.uri", 
      "http://localhost:10000")
  .config("spark.hadoop.fs.pvfs.token.provider", "bear")
  .config("spark.hadoop.fs.pvfs.token", "token")
  .getOrCreate()
  
spark.sql( s""" 
      |CREATE TEMPORARY VIEW csv_table
      |USING csv 
      |OPTIONS ( 
      |  path 'pvfs://catalog_name/database_name/my_format_table_name/a.csv', 
      |  header 'true', 
      |  inferSchema 'true' 
      |) """.stripMargin )
```

## Other Optimizations

The Apache Paimon community continues to improve storage and read-write links, continuously optimizing performance and usability:
1. In terms of performance, it supports more push down options, such as Spark TopN push down; Limit push down; Introducing a new high-performance Range bitmap; In addition, for the performance of OLAP queries, improve the Manifest Cache to organize its cache according to partitions and buckets.
2. In terms of usage, address the potential risk of file storage errors caused by the simultaneous use of MERGE-INTO and COMPACT, especially the conflict issue in Deletion Vectors mode.
