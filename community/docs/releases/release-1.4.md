---
title: "Release 1.4"
type: release
version: 1.4.2
weight: 96
---

# Apache Paimon 1.4 Available

Apache Paimon 1.4 includes 1,108 commits compared to version 1.3, covering a wide range of new features, performance optimizations, bug fixes, and ecosystem integration improvements. Release 1.4 is the longest and largest release in Paimon's history, laying a solid foundation for the multimodal AI direction. Looking ahead, version 2.0 will become a complete AI data lake — stay tuned.

## From Real-Time Data Lake to AI Multimodal Data Lake

Release 1.4 marks a major upgrade in Paimon's positioning. The official website homepage (`docs/content/_index.md`) has been redefined from the original "real-time data lake" to a unified lake format with three pillars:

The third pillar, Multimodal Data Lake, is newly introduced in 1.4. From the official website:

> Paimon is a multimodal lakehouse for AI. Keep multimodal data, metadata, and embeddings in the same table and query them via vector search, full-text search, or SQL.

Release 1.4 marks the strategic upgrade of Apache Paimon from a "real-time data lake" to an "AI multimodal data lake." By introducing BLOB type (multimodal large objects), Lumina vector index (DiskANN), Data Evolution (the foundation for data evolution), VECTOR type (native vectors), Variant Shredding (semi-structured columnar decomposition), and a significantly expanded PyPaimon SDK (PyTorch / Ray integration), Paimon has built a complete set of multimodal data management capabilities — managing structured data, semi-structured data, unstructured data, and vector embeddings in a single table, with unified querying through SQL, vector search. Paimon is no longer just a real-time data lake, but a multimodal data lake for the AI era.

## 1. BLOB Type — Multimodal Large Object Storage

@since 1.4.0, a brand-new data type for storing unstructured data such as images, videos, audio, documents, and model weights. Alibaba has already deployed multi-EB-scale multimodal data storage based on Blob Tables internally, providing a solid foundation for inference and multimodal model training.

Architecture Design:

- Blob data is stored in separate `.blob` files, while metadata is kept in standard columnar files (Parquet), achieving separation of storage and compute
- BlobDescriptor uses a versioned binary format (magic number `0x424C4F4244455343`), recording `(version, uri, offset, length)`
- Three storage modes

Key configuration options: `blob-field`, `blob-descriptor-field`, `blob-as-descriptor`, `blob-external-storage-path`

Write API (Java): `Blob.fromLocal()`, `Blob.fromHttp()`, `Blob.fromInputStream()`, `Blob.fromFile()`, `Blob.fromDescriptor()`

SQL Support: Table creation, writing, and MERGE INTO updates are supported in both Flink SQL and Spark SQL.

Approximately 40 related commits, covering partition support, rolling file writes, multiple Blob fields, external storage, Python SDK read/write, and more.

## 2. Vector Index — Lumina (DiskANN) + Global Index

A complete vector search infrastructure has been built:

- Lumina Vector Index: An approximate nearest neighbor (ANN) index based on the DiskANN algorithm, replacing the previous Lucene and FAISS approaches
- BTree Global Index: High-performance scalar lookup with row-range support
- Pre-filter: Scalar index filtering before vector search to improve retrieval efficiency
- Query interfaces:
  - Java API: `Table.newVectorSearchBuilder()`
  - Spark SQL: `vector_search` table-valued function
  - Flink SQL: `sys.vector_search` Procedure

Over 30 commits building the BTree + Vector Index global index infrastructure.

## 3. Data Evolution — Foundation for Multimodal Data Evolution

Data Evolution is the underlying foundation for Blob and Vector storage, supporting efficient row-level updates and partial column changes without rewriting entire files.

- Enabled via `row-tracking.enabled` + `data-evolution.enabled`
- Supports partial column updates by `_ROW_ID` (only writing changed columns)
- As applications evolve, new feature columns (e.g., embedding columns) can be continuously added without copying existing data
- Flink has optimized MERGE INTO operations in Data Evolution mode

## 4. PyPaimon — Native Python SDK for the AI Ecosystem

PyPaimon has been significantly expanded in 1.4, becoming the bridge between Paimon and the Python AI ecosystem. Pure Python implementation with no JDK dependency.

Alibaba has already deployed large-scale inference with Ray and Daft based on PyPaimon internally, with some data using PyTorch for direct-read training on Paimon data.

## 5. Variant Type Enhancement — Semi-Structured Data Shredding

The Variant type was introduced in 1.1, but 1.4 adds a complete Shredding (columnar decomposition) pipeline:

- Automatic schema inference
  - Supports configuring max width, max depth, minimum field cardinality ratio, and inference buffer row count
- Shredding Writer: Applies the inferred schema to actual writes, decomposing semi-structured data into native Parquet columns
- Clipped Read: Extracts only the needed columns during reads, avoiding full deserialization
- Parquet Variant logical type annotation: Standardized metadata annotation
- Flink has validated Shredding Variant read/write correctness

Approximately 23 Variant-related commits.

## 6. VECTOR Type — Native Vector Storage

A brand-new first-class citizen data type `VECTOR<t, n>` for dense vector storage.

- Supports 7 element types: BOOLEAN, TINYINT, SMALLINT, INT, BIGINT, FLOAT, DOUBLE
- Fixed dimensions, supporting up to 2,147,483,647 dimensions
- Vector columns can be stored independently in Lance format (`.vector.lance` files), coexisting with Parquet and Blob files
- Declared at the SQL layer via `vector-field` and `field.<name>.vector-dim` table properties
- Read/write support for Flink SQL, Spark SQL, Arrow, and Avro

## 7. Other Related Features

- Chain Table: A new mode for primary key tables that enables incremental computation through snapshot + delta branches, approximately 15 commits
- Object Table: Object table support, readable from both Spark SQL and Python
- Scenario Guide: New scenario guide documentation (600+ lines), clearly mapping AI/multimodal use cases to Paimon table types

---

## Release Checklist (Detailed)

### Checklist 1: Key Features Overview

- New Data Types
  - Blob Type & Storage
  - Vector Type & Vector Search
  - Variant Shredding Enhancement
- Core Engine
  - Global Index (BTree)
  - Data Evolution Enhancement
  - Format Table
  - Chain Table Batch Processing
  - Row Tracking
  - Incremental Clustering
- Performance Optimization
  - Parquet Stats In-Memory Extraction
  - Bucket-Level Predicate Pushdown
  - Manifest Entry Cache
  - Limit Pushdown for PK Tables
  - Entropy Inject for Throttling Prevention
- Ecosystem Integration
  - Flink 2.2
  - Spark 4.0 / V2 Write
  - PyPaimon CLI & Ray & PyTorch
  - REST Catalog Enhancement
  - Iceberg Compatibility Enhancement
- Security
  - 6 CVE Fixes
  - Comprehensive Dependency Upgrades

### 1. Blob Type and Blob Storage

- Introduce Blob data type and Blob data read/write support (#6268, #6344, #6283)
- Support rolling file writes for Blob (#6340)
- Support Blob Descriptor mode (`blob-as-descriptor`) read/write (#6367, #6373, #6374)
- Introduce Blob V2 version (#7216)
- Support external storage Blob columns and MERGE INTO updates (#7328)
- Support multiple Blob field definitions (#7105)
- Blob partition support (#6488, #6423)
- Blob target size configuration (#6424)
- Blob null blob support (#7125)
- Flink/Spark/Hive support for Blob type table creation and read/write (#6351, #6368, #6383)
- Python support for Blob read/write (#6390, #6420, #6465, #6863)

### 2. Vector Type and Vector Search

- Introduce Vector type definition and base API (#7204)
- Support vector search interface `Table.newVectorSearchBuilder` (#7509)
- Support Lucene vector index (#6773)
- Support Lumina vector index (#7330)
- Support FAISS vector index and JNI (#6985, #6991)
- Spark support for vector search (#6950)
- Flink support for vector search Procedure (#7550)
- Arrow/Avro/Flink support for Vector type (#7236, #7449, #7238)
- Vector storage support for data-evolution tables (#7240)

### 3. Global Index

- Introduce BTree global index (#6869)
- Support BTree index read/write structures (#6626, #6628)
- Spark support for building global index Procedure (#6956, #6684)
- Flink support for creating global index Procedure (#7241, #7413)
- Support BTree index incremental scan (#7416)
- Support multi-partition BTree index building (#7191)
- Python support for BTree index reading (#7160, #7163, #7167)
- Python support for global index (#6995)
- Support global index external path (#6994)
- Introduce `file_key_ranges` system table (#7500)

### 4. Data Evolution

- Data Evolution table support for Compact (#6828, #6839, #6875)
- Data Evolution table support for Limit pushdown (#7298)
- Data Evolution table support for index-optimized scan (#7305)
- Data Evolution table support for Manifest filtering (#6455)
- Data Evolution table support for Row ID pushdown (#6483, #6697)
- Flink introduces simplified MERGE INTO Procedure (#7128)
- Spark optimizes MERGE INTO self-merge updates (#6827)
- Python support for Data Evolution table `TableUpsertByKey` (#7462)
- Support conflict detection for Data Evolution tables (#7124)

### 5. Format Table

- Introduce Format Table write support (#6288)
- Support Text format table (#6879)
- Support CSV parsing mode (#6350)
- Support file split reading (#6556)
- Support file compression and custom default format (#6500)
- Support row delimiter (#6517)
- Support partition pruning (#6347, #6263)
- Spark support for Format Table read/write (#6296, #6365, #6442)
- Flink support for Format Table write (#6409)
- Support Overwrite operation (#6497)
- Support temporary file two-phase commit (#6510, #6525)

### 6. Chain Table

- Support Chain Table batch processing mode (#6394)
- Support Chain Table group partitions (#7524)
- Allow Chain Table to use non-dedup merge engines (#7172)
- Chain Table Compact retains Delete records (#7057)
- Support Chain Table re-overwrite (#7038)

### 7. Row Tracking

- Spark support for UPDATE/DELETE via `_ROW_ID` (#6335)
- Spark Merge Into support for `_ROW_ID` shortcut (#6745)
- Python support for reading Row Tracking metadata fields (#6819)
- Introduce `minRowId` and `maxRowId` to ManifestList (#6661)

### 8. Variant Type Enhancement

- Introduce Variant Shredding writer (#7035, #7017)
- Support clipped read for nested Variant (#7075)
- Support Shredded Variant assembly functions (#6652)
- Flink validates Shredded Variant read/write (#6623)
- Lookup support for Variant type (#6618)
- Variant column annotated with Variant logical type annotation (#7110)

### Checklist 2: Performance Optimization

#### 1. Performance Optimization

- Extract Parquet statistics from in-memory Footer, avoiding file re-reads (#7489)
- Introduce BucketSelector for bucket-level predicate pushdown (#7486)
- Cache `requestedSchema` and `fields` in ParquetReaderFactory (#7476)
- Optimize `FileStoreCommitImpl#filterCommitted` performance (#7275, #7239)
- Optimize Append table Limit reads (#6848)
- Optimize Snapshot collection in ExpireSnapshots (#7397)
- Introduce `DataPagedOutputSerializer` for Manifest Entry cache to limit memory (#6355)
- CSV optimization for short/byte/int/long parsing (#6856)
- Arrow reuses length arrays to avoid redundant memory allocation (#7573)
- Introduce Entropy Inject to prevent object storage throttling (#6832)
- Optimize `IndexFileMetaSerializer#rowArrayDataToDvMetas` (#6589)
- Introduce DeltaVarintCompressor for length array compression (#6280)
- Avro optimization for `map<string, string>` (#6256)

#### 2. Compaction Improvements

- Introduce `pk-clustering-override` for non-primary-key field clustering (#7426)
- Introduce `compaction.incremental-size-threshold` for forced full Compaction (#6754)
- Support configuring Compaction file count limit (#7520)
- Support Incremental Clustering for Append tables (#6338, #6559, #6961)
- Flink support for Incremental Clustering (#6395, #6449)
- Introduce Compaction Sort Buffer metrics (#7411)
- Clustering strategy changed to 'SIZE' (#6826)
- Support auto-clustering for historical partitions (#6472)
- Introduce Flink local sort mode for Incremental Clustering (#7466)
- Introduce bulk loading for clustering Compact bootstrap (#7497)

#### 3. Deletion Vector Improvements

- Introduce bucket-level DV index cache (#6407)
- Support DV conflict detection (#6303)
- Support DV mode for Incremental Clustering (#6559)
- Fix Append table DV Compaction error (#6258)

#### 4. Lookup Optimization

- Introduce `lookup.remote-file.enabled` for Lookup optimization (#6533)
- Introduce `lookup.remote-file.level-threshold` for using remote files at higher levels (#6614)
- Extract SST file format (#6755)
- Introduce `SimpleLsmKvDb` — KV store based on Paimon SST (#7407)
- Optimize Lookup table refresh with Snapshot Backlog full loading (#6966)

#### 5. New Aggregate Functions

- Introduce `merge_map_with_keytime` aggregate function (#7446)
- Introduce `nested_partial_update` aggregate function (#6924)
- `FieldListaggAgg` supports `distinct` parameter (#6566)

#### 6. Partition Management

- Introduce `Catalog.listPartitionsByNames` (#7340)
- Partition expiration supports cleaning up Done partitions (#7507)
- Support partition format validation (#7428)
- Support adding columns before partitions (#7374)
- Introduce `consumer.changelog-only` to retain fewer snapshots (#7499)

#### 7. Other Core Features

- Introduce `scan.primary-branch` symmetric to `scan.fallback-branch` (#7553)
- Support Rename Branch API (#7549)
- Support Create Branch IF NOT EXISTS (#7353)
- Support Rollback Schema (#7498)
- Introduce `visibility-callback.enabled` (#7235)
- Introduce `commit.discard-duplicate-files` for Append safety (#6464)
- Introduce `deletion-vectors.modifiable` to restrict DV modification (#6666)
- Support ignoring corrupted or missing files (#6821)
- Introduce Like LeafFunction (#6776)
- Introduce Between LeafFunction (#7209)
- Introduce Transform Predicate for complex predicates (#6498, #6506)
- Introduce `listTableDetails` method (#7266)
- Introduce `sys.tables` and `sys.partitions` global system tables (#6298)
- Support reading incremental Changelog and Delta between two Tags (#6324)
- Support Overwrite Upgrade (upgrading data files during overwrite) (#6815)
- Introduce Row Filter and Column Masking support (#7034)
- Introduce weighted strategy for `external-path` (#7356)
- Support Parquet Timestamp/Decimal filter pushdown (#7203, #7175)

### Checklist 3: Flink Integration

#### New Features

- Support Flink 2.2 (#6775)
- Remove Flink 1.15 support (#6486)
- Implement FLIP-314 LineageVertexProvider (#7311)
- Support Lookup Join async partition refresh (#7402)
- Support CDC Source (#6606)
- Support dropping primary keys (empty table) (#7566)
- Support system table dynamic options (#7414)
- StoreMultiCommitter supports per-table dynamic options (#7404)
- Batch jobs support `max_pt()` and `max_two_pt()` (#6728)
- Introduce built-in functions (#6891)
- `path_to_descriptor` function supports HTTP URLs (#7529)
- Support launching Flink jobs for all Actions (#6201)
- Introduce `sourceParallelismUpperBound` metric (#7117)
- Support Procedure to remove non-existent Manifest files (#6643)
- Disallow custom Shuffle Lookup Join in adaptive parallelism mode (#7504)

#### Bug Fixes

- Fix StreamExecutionEnv compatibility issue (#7615)
- Fix de-merge-into runtimeContext NoSuchMethod error (#7607)
- Fix SystemTableSource unordered flag (#7434)
- Fix Blob type conversion (#7405)
- Fix Lookup field type mismatch error (#6974)
- Fix DV table Show Partitions not working (#6921)
- Fix MonitorSource always busy (#7396)

### Checklist 4: Spark Integration

#### New Features

- Support Spark 4.0.2 (#7225)
- Bump Spark 3.5.8 (#7072)
- Support Scala 2.13 build and deployment (#6128)
- Support V2 Write DELETE for Append tables (#6704)
- Support V2 Write UPDATE for Append tables (#7097)
- Support V2 Write MERGE INTO for Append tables (#7200)
- Support `compact_database` Procedure (#6910)
- Support Rescale Procedure (#6612)
- Support `rewrite_file_index` Procedure (#6562)
- Support CopyFilesProcedure (#6625)
- Support Drop Partition (#6154)
- Support Describe Table Partition (#6359)
- Support SHOW VIEWS FROM syntax (#6873)
- Support reading Object Table (#7535)
- Introduce `source.split.target-size-with-column-pruning` (#6837)
- Introduce `read.allow.fullScan` (#6786)
- Introduce Substring/Upper/Lower/Trim/Cast Transform pushdown (#7170, #6521, #7134, #7273, #6581)
- Introduce AlwaysTrue/AlwaysFalse predicate support (#7224)
- Introduce Between predicate conversion (#7265)
- Format Table runtime filter support (#7226)
- Support REST Catalog Merge Schema (#7539)
- Support by-name resolution for nested Struct fields (#7487)
- V2 Write metrics (#6386, #6722)
- Support Postpone Bucket table batch write with fixed Bucket (#6534)
- Support Data Evolution table Compact (#6839)
- Introduce Drop Global Index Procedure (#6930)

#### Bug Fixes

- Fix MERGE INTO exprId mismatch (#7624)
- Fix View query VARCHAR/CHAR column type failure (#7585)
- Fix View CTE and ORDER BY parsing (#7552)
- Fix concurrent V2 MERGE INTO data inconsistency (#7432)
- Fix V1 DELETE incorrectly deleting NULL value rows (#7482)
- Fix EqualNullSafe incorrect when column has NULL values (#6943)
- Fix Clustering strategy auto-selection using wrong column count (#7514)
- Fix SparkHilbertUDF/SparkZOrderUDF null value NPE (#7451)
- Fix SparkCatalog converting option keys to lowercase (#6708)
- Fix Nested Struct field mapping (#7542)
- Fix DELETE Range condition (#7104)
- Fix Sort Compact partition filter (#6371)
- Fix Runtime Filter combined with regular Filter (#6998)

### Checklist 5: Python (PyPaimon) Integration

#### New Features

- Introduce Python CLI (#7358)
- Support Table Read/Snapshot/List Partitions/Database Management/Table Management (#7373, #7377, #7389, #7366, #7362, #7360)
- Support JSON format output (#7452)
- Support Ray DataSource distributed read/write (#6686, #6883)
- Support PyTorch Dataset reading (#6987)
- Support Streaming Read (AsyncStreamingTableScan) (#7424)
- Support Consumer management (#7349, #7415)
- Support Changelog Manager (#7492)
- Support Branch Manager API (#7448)
- Support Rename Branch/Tag API (#7561, #7322)
- Support Format Table (#7154)
- Support Object Table (#7400)
- Support Iceberg Table in REST Catalog (#7280)
- Support Schema Evolution reading (#6458, #6463)
- Support Dynamic Bucket write (#7363)
- Support Truncate (#7511)
- Support AlterTable (#6952)
- Support ROW/STRUCT type (#7129)
- Support DV primary key table reading (#6766)
- Support FUSE for REST Catalog (#7483)
- Support PyJindo (#7410)
- Support Lance file format (#6746)
- Introduce Update Columns by Shards for Data Evolution (#6861, #7148)
- Introduce Incremental-Between reading by timestamp (#6391)
- Introduce file pruning for DV PK tables (#7557)
- Support REST Token refresh (#7007)
- Support Predicate NotBetween/Like (#7352)
- Support Shard conflict detection (#7323, #7630)

#### Bug Fixes

- Fix Index Manifest not inherited from previous snapshot (#7662)
- Fix `_ROW_ID` duplication issue (#7626)
- Fix Token cache isolation (#7571)
- Fix REST signature mismatch (#7568)
- Fix Stats Evolution index mapping (#7593)
- Fix BlockHandle variable-length decoding (#7597)
- Fix Rolling stack overflow (#7578)
- Fix Avro writing timestamp without timezone error (#7259)
- Fix Null partition value causing TypeError (#7480)
- Fix Null handling in OR expressions (#7234)
- Fix PyArrow 6.x compatibility (#7292, #7180)
- Fix Python 3.6 compatibility (#7047, #6982)

### Checklist 6: REST Catalog Enhancement

- Introduce Consumers API definition (#7339)
- Introduce Reset Consumer API (#7372)
- Introduce Tag REST API definition (#6792)
- Introduce `tagNamePrefix` for `listTagsPaged` (#6947)
- Support `getTable` by ID (#7085)
- Support `tableType` parameter listing (#6295)
- Support external Paimon tables (#6446)
- Support default table creation options (#6598)
- Support Column Masking Rules (#7024)
- Support Rollback fromSnapshot (#6905)
- Improve HttpClient error response handling (#7254)
- IO Cache configuration options (#7425)

### Checklist 7: Iceberg Compatibility

- Support millisecond timestamp compatibility mode (#6352)
- Enhance Iceberg Snapshot Summary (#6370)
- Enhance Iceberg Snapshot metadata (#6354)
- Enhance timestamp type extended precision support (#6278)
- Support real UUID (#7136)
- Avoid partition evolution when Partition Field ID is non-zero (#7186)
- Preserve table properties during Iceberg to Paimon migration (#6388)
- Use latest Schema for creating and updating Hive tables (#6655)
- Fix Iceberg metadata parsing error (#7099)

### Checklist 8: CDC Integration

- Support Kafka CDC metadata columns (#7315)
- Support more MySQL CDC Source options (#6886)
- Support PostgreSQL CDC Source options (#6888)
- Bump Flink CDC version and migrate transformation tools (#6532)
- Fix special regex characters not escaped (#7619)
- Fix precision loss causing Float conversion error (#6291)
- Shade hikari to prevent AbstractMethodError (#7246)
- Avoid sending empty Schema change events (#7261)
- Preserve Avro field documentation as Paimon column comments (#6505)

### Checklist 9: Hive Integration

- Lazy initialization of HMS client pool (#7346)
- Fix Hive Catalog deadlock (#6783)
- Fix Bucket table splitting (#6594)
- Preserve default partition name when copying Hive tables (#6829)
- Use FileIO obtained from path (#6992)

### Checklist 10: File System and Storage

- Replace AWS SDK v2 Bundle with explicit module dependencies (#7285)
- Update S3 Multipart Upload to adapt to Hadoop 3.4+ (#7187)
- Support JindoCache (#6949)
- Support OSS Private Link (#6413)
- Support PVFS pread (#7247)
- Introduce Hadoop Uber module (#6224)

### Checklist 11: Security and Dependency Upgrades

- Upgrade lz4-java 1.10.4 (CVE fix) (#7384)
- Upgrade snappy-java 1.1.10.8 (CVE fix) (#7383)
- Upgrade aircompressor 2.0.3 (CVE fix) (#7375)
- Upgrade httpclient5 >5.4.3 (CVE-2025-27820) (#6787)
- Upgrade commons-lang3 3.18.0 (CVE-2025-48924) (#6781)
- Upgrade log4j-core 2.25.3 (#6845)
- Upgrade Parquet 1.16.0 (#7081)
- Upgrade assertj-core 3.27.7 (#7126)
- Upgrade LZ4 dependency 1.8.1 (#6737)
- Upgrade Lance 0.39.0 (#6758)

### Checklist 12: Other Improvements

#### Build and CI

- Introduce fast-build Profile (#7488)
- Upgrade GitHub Actions to adapt to Node 24 (#7008)
- Use PR title and description as Commit Message (#7142)
- Reduce number of tests triggered by CI
- Add AGENTS.md (#7297)

#### Clone and Migration

- Support Clone metadata only (#6967)
- Support skipping Clone when target table already exists (#7139)
- Support specifying target file format (#6273)
- Remove Hudi/Iceberg Clone and migration support (#7316)

#### Arrow

- Introduce Arrow native read/write interface (#6855)
- Support Arrow Variant/Shredding Writer (#7082)
- Improve data type conversion customization (#6695)

#### Parquet

- Fix INT96 `TimestampUpdater.skipValues` incorrectly skipping bytes (#7454)
- Improve ParquetReaderUtil column lookup diagnostics (#7493)
- Fix Parquet reader initialization performance regression (#6802)

#### Documentation

- Add Global Index documentation
- Add Blob Storage documentation (#6757)
- Add Scenario Guide
- Add Chain Table documentation
- Add View documentation (#6469)
- Add C++ Paimon API documentation (#6881)
- Add Python CLI/REST API documentation
- Update Append table documentation
- Update CDC ingestion documentation
- Update Spark Procedure documentation
- Numerous documentation link and spelling fixes

---

*When a data lake starts storing images, storing videos, searching vectors, and running PyTorch, it's no longer just a data lake — the AI multimodal data lake has arrived.*

*— By the way, this release article was entirely written by AI*
*— Formatting & editing: Jingsong Li*
*— Release Manager: Hongbo Xiao*
