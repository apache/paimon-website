---
title: "Paimon Rust Release 0.2.0"
type: release
version: Rust 0.2.0
---

# Paimon Rust 0.2.0 Available

May 2026 - Yuxia Luo (luoyuxia@apache.org)

The Apache Paimon PMC is pleased to announce the release of Paimon Rust 0.2.0. This release includes
59 commits: 54 from 12 human contributors and 5 dependency update commits from dependabot. We would like
to express our sincere gratitude to all the developers who have participated in the contribution!

## What's New in 0.2.0?

Building on the foundation laid by 0.1.0, this release significantly advances feature parity with the
Java implementation. The highlights include primary key table write support, the partial-update merge
engine, Vortex columnar format, Blob type, Lumina vector index, comprehensive system tables, and an
expanded DML/DDL SQL surface through DataFusion.

### Supported Table Types

| Table Type                               | Scan      | Read      | Write                                  |
|------------------------------------------|-----------|-----------|----------------------------------------|
| Append-Only Table                        | Supported | Supported | Supported (INSERT, COW DML)            |
| Primary Key Table                        | Supported | Supported | **Supported (New in 0.2.0)**           |
| Data Evolution Table (Append-Only)       | Supported | Supported | Supported (MERGE & UPDATE)             |

- **Append-Only Table**: Now supports copy-on-write DML operations (DELETE, UPDATE, MERGE INTO) in
  addition to INSERT INTO/OVERWRITE.
- **Primary Key Table**: Now supports read/write with sort-merge deduplication, fixed and dynamic bucket
  assignment, and postpone bucket mode. Supports Deduplicate, PartialUpdate, and FirstRow merge engines.
  Note: partial-update with `deletion-vectors.enabled=true` is not yet supported.
- **Data Evolution Table**: Continues to support MERGE & UPDATE with enhanced row-ID validation.

## New Features

### Primary Key Table Write

The most significant addition in 0.2.0 is primary key table write support:

- **Sort-Merge Deduplication** — merge-on-read primary key semantics with full sort-merge writer
  implementation.
- **Fixed Bucket Assignment** — deterministic row-to-bucket mapping based on primary key hash.
- **Dynamic Bucket Assignment** — automatic bucket scaling based on data volume, allowing
  tables to grow without manual resharding.
- **Postpone Bucket (bucket=-2)** — deferred bucket assignment for cross-partition primary key tables.

### Partial-Update Merge Engine

Introduced the partial-update merge engine, supporting field-by-field merge semantics for both
fixed-bucket and dynamic-bucket primary key tables. This enables incremental column updates
without rewriting entire rows — a critical feature for wide-table ETL pipelines.

### Vortex Columnar Format

Added [Vortex](https://github.com/spiraldb/vortex) as an optional columnar file format alongside
Parquet, ORC, and Avro. Vortex provides compressed columnar storage with predicate pushdown and
selection support. Enable it via the `vortex` feature flag.

### Blob Type

Introduced the Blob type for storing large binary objects (images, documents, model weights, etc.)
with DDL semantics. Supports blob descriptor write for append-only tables and blob file reading
in data evolution flows.

### Lumina Vector Index

Added vector index read infrastructure via the Lumina module, bringing vector similarity search
capabilities to Paimon Rust. This lays the groundwork for AI/ML workloads on Paimon tables.

### Copy-on-Write DML for Append-Only Tables

Append-only tables now support full DML operations (DELETE, UPDATE, MERGE INTO) via a copy-on-write
strategy, enabling mutable semantics on immutable storage.

### COUNT(*) Pushdown

Enabled exact `COUNT(*)` pushdown via partition statistics, avoiding full data scans for count-only
queries when partition-level row counts are available.

### Avro Reader Optimization

Replaced `serde_avro_fast` with `apache-avro` and introduced a custom Avro OCF reader for manifest
parsing with filtered decoding, improving manifest read performance and correctness.

## DataFusion Integration Enhancements

### System Tables

Added comprehensive system tables for metadata inspection via standard SQL:

| System Table                | Description                                  |
|-----------------------------|----------------------------------------------|
| `$schemas`                  | Table schema version history                 |
| `$snapshots`                | Snapshot metadata and history                |
| `$tags`                     | Tag definitions and snapshot links           |
| `$manifests`                | Manifest entries with partition stats        |
| `$partitions`               | Partition metadata and statistics            |
| `$files`                    | Data file listing and metadata               |
| `$table_indexes`            | Index definitions                            |
| `$branches`                 | Branch metadata                              |
| `$options`                  | Table configuration options                  |
| `$referenced_files_size`    | Space used by files in the latest snapshot   |
| `$physical_files_size`      | Actual disk usage of table data              |

Example:

```sql
SELECT * FROM paimon.my_db.`my_table$snapshots` ORDER BY snapshot_id DESC LIMIT 5;
```

### DML & SQL

Significant SQL surface expansion in this release:

- **Hive-style INSERT OVERWRITE PARTITION** — overwrite specific partitions while preserving others.
- **TRUNCATE TABLE** — remove all data from a table.
- **DROP PARTITION** — drop specific partitions.
- **CALL Procedures** — `CALL tag(...)` for tagging and `CALL rollback(...)` for rollback operations.
- **Session-Scoped Dynamic Options** — `SET` / `RESET` for runtime configuration overrides.

### SQLContext with Multi-Catalog Support

Renamed `PaimonSqlHandler` to `SQLContext` with multi-catalog support, enabling users to register
and query across multiple Paimon catalogs in a single DataFusion session.

### Branch Manager

Added branch manager support, enabling branch-based development workflows for Paimon tables.

### Temporary Tables

Added catalog-level temporary table support for intermediate computation results that do not
need to be persisted.

### Table-Valued Functions

Introduced table-valued functions auto-registered when a catalog is registered with SQLContext:

- `vector_search` — vector similarity search via Lumina index.
- `full_text_search` — full-text search via Tantivy index (feature-gated with `fulltext`).

### Other Improvements

- **Reject typed columns in PARTITIONED BY** — improved DDL validation.
- **Error logging for catalog methods** — better observability for silent failures.
- **RESTCatalog list_partitions** — support listing and paginating partitions via REST API.

## Getting Started

Add dependencies to your `Cargo.toml`:

```toml
[dependencies]
paimon = "0.2.0"
paimon-datafusion = "0.2.0"
tokio = { version = "1", features = ["full"] }
```

### Write to a Primary Key Table with DataFusion SQL

```rust
use std::sync::Arc;
use paimon::{CatalogOptions, FileSystemCatalog, Options};
use paimon_datafusion::SQLContext;

#[tokio::main]
async fn main() {
    // 1. Create a catalog and register it with SQLContext
    let mut options = Options::new();
    options.set(CatalogOptions::WAREHOUSE, "/path/to/warehouse");
    let catalog = FileSystemCatalog::new(options).unwrap();

    let mut ctx = SQLContext::new();
    ctx.register_catalog("paimon", Arc::new(catalog)).await.unwrap();

    // 2. Create a database and a primary key table
    ctx.sql("CREATE SCHEMA paimon.my_db").await.unwrap();
    ctx.sql("CREATE TABLE paimon.my_db.users (
        id BIGINT,
        name STRING,
        age INT,
        PRIMARY KEY (id) NOT ENFORCED
    )").await.unwrap();

    // 3. Insert data
    ctx.sql("INSERT INTO paimon.my_db.users VALUES (1, 'Alice', 30), (2, 'Bob', 25)")
        .await.unwrap()
        .collect().await.unwrap();

    // 4. Query the table
    ctx.sql("SELECT * FROM paimon.my_db.users")
        .await.unwrap()
        .show().await.unwrap();

    // 5. Inspect metadata via system tables
    ctx.sql("SELECT * FROM paimon.my_db.`users$snapshots`")
        .await.unwrap()
        .show().await.unwrap();
}
```

For more information, visit the [documentation](https://paimon.apache.org/docs/rust/) and the
[GitHub repository](https://github.com/apache/paimon-rust).

## Contributors

Thanks to all the contributors who made this release possible:

Arpit Jain, Jiajia Li, Jingsong Lee, Jiwen liu, QuakeWang, XiaoHongbo, Zach,
jerry, liang, shyjsarah, xuzifu666, Yuxia Luo
