---
title: "Paimon Rust Release 0.1.0"
type: release
version: Rust 0.1.0
---

# Paimon Rust 0.1.0 Available

Apr 2026 - Yuxia Luo (luoyuxia@apache.org)

The Apache Paimon PMC officially announces the first release of Paimon Rust 0.1.0. This release includes
133 commits from 21 contributors. We would like to express our sincere gratitude to all the developers
who have participated in the contribution!

## What is Paimon Rust?

[Paimon Rust](https://github.com/apache/paimon-rust) is a native Rust implementation of the Apache Paimon
lake format. It provides a high-performance, cross-platform entry point to the Paimon ecosystem with
multi-language bindings and query engine integration.

## Version Overview

The first version of Paimon Rust supports the following features:

1. Full Paimon table format specification implementation.
2. Table Read: ReadBuilder with column projection, predicate pushdown, schema evolution, deletion vector, and multi-format reader (Parquet, ORC, Avro).
3. Table Write (Initial): INSERT INTO/OVERWRITE, SnapshotCommit, and MERGE & UPDATE support.
4. Table Scan: partition/bucket pruning, stats pruning, deletion vector filtering, and limit pushdown.
5. Index: File Index, BTree global index, and Tantivy full-text search.
6. Time Travel: by snapshot ID, timestamp, tag name, and DataFusion `VERSION AS OF`.
7. Catalog: Filesystem Catalog and REST Catalog.
8. Storage: Local filesystem, S3, OSS, and HDFS.
9. Apache DataFusion integration with DDL, DML, predicate pushdown, and parallelized split execution.
10. Language bindings: Python (pypaimon_rust), Go.

### Supported Table Types

| Table Type                               | Scan      | Read      | Write                      |
|------------------------------------------|-----------|-----------|----------------------------|
| Append-Only Table                        | Supported | Supported | Supported                  |
| Primary Key Table (with Deletion Vector) | Supported | Supported | Not yet supported          |
| Data Evolution Table (Append-Only)       | Supported | Supported | Supported (MERGE & UPDATE) |

- **Append-Only Table**: Fully supported for scan, read, and write. Supports partitioned and bucketed tables.
- **Primary Key Table**: Scan and read are supported when deletion vectors are enabled. Write is not yet supported
  in this version.
- **Data Evolution Table**: Supports MERGE INTO operations on append-only tables with `data-evolution.enabled`
  and `row-tracking.enabled`, enabling row-ID-based column updates.

### Table Format Specification

Implemented the complete Paimon spec layer including Snapshot, Schema, DataFileMeta, ManifestList, ManifestFile,
IndexManifest, and all primitive & complex data types with full serialization/deserialization support.

### Table Read

Paimon Rust provides a full-featured read path:

- **ReadBuilder** with column projection, partition-level and data-level predicate pushdown, and filter
  push-down to the Parquet read path.
- **Deletion Vector** support — plan, read, and apply deletion vectors with row-level filtering and
  cardinality tracking.
- **Schema Evolution** read with `SchemaManager`, supporting data evolution table mode and row-id-based
  evolution filtering.
- **Multi-format readers** — abstracted `FormatFileReader` with Parquet (primary), ORC, and Avro reader
  implementations.

### Table Scan

- **TableScan** with split planning.
- **Partition and bucket pruning** to skip irrelevant data.
- **Stats-based pruning** at both partition and data-file levels.
- **Deletion vector and postpone filtering** with data-evolution group pruning.
- **Limit pushdown** support.

### Table Write

The initial write path includes:

- **Write Pipeline** with DataFusion `INSERT INTO` / `INSERT OVERWRITE` support for append-only tables.
- **Commit Pipeline** with `SnapshotCommit` abstraction for atomic commits.
- **MERGE & UPDATE** support via `DataEvolutionWriter` for data evolution tables.

### Index

- **File Index** format read and write.
- **BTree Global Index** reader with async on-demand block loading.
- **Tantivy Full-Text Search** with on-demand archive reading.

### Time Travel

- Time travel by **snapshot ID**, **timestamp**, and **tag name**.
- DataFusion **`VERSION AS OF`** syntax support.

### Catalog

- **Filesystem Catalog** for local and cloud storage.
- **REST Catalog** with full database and table CRUD operations.

### Storage Backends

Paimon Rust supports multiple storage backends via [Apache OpenDAL](https://github.com/apache/opendal):

- **Local filesystem** (default)
- **Amazon S3**
- **Alibaba Cloud OSS**
- **HDFS** (via hdfs-native)

### Apache DataFusion Integration

The `paimon-datafusion` crate provides deep integration with Apache DataFusion:

- Full **CatalogProvider** integration — register Paimon catalogs as DataFusion catalogs.
- **DDL** support with `CREATE TABLE` and `PRIMARY KEY` constraint syntax.
- **INSERT INTO / INSERT OVERWRITE** write support.
- **Partition predicate pushdown** and **statistics** for scan optimization.
- **Parallelized split execution** for high throughput.
- **Limit pushdown**.
- **Time travel** with `VERSION AS OF`.
- **`$options` system table** for table options inspection.

### Python Binding

Introduced `pypaimon` core with DataFusion catalog integration, allowing Python users to query Paimon
tables via DataFusion's Python interface.

### Go Binding

- **C FFI binding** layer for cross-language interop.
- **Go binding** with table read, column projection, and filter push-down.
- **Predicate API** with compound predicates (And/Or/Not) support.

## Getting Started

Add `paimon` to your `Cargo.toml`:

```toml
[dependencies]
paimon = "0.1.0"
```

### Read a table with Paimon native API

```rust
use futures::TryStreamExt;
use paimon::{Catalog, CatalogOptions, FileSystemCatalog, Options};
use paimon::catalog::Identifier;

#[tokio::main]
async fn main() {
    // 1. Create a FileSystemCatalog
    let mut options = Options::new();
    options.set(CatalogOptions::WAREHOUSE, "/path/to/warehouse");
    let catalog = FileSystemCatalog::new(options).unwrap();

    // 2. Get a table
    let identifier = Identifier::new("my_db", "my_table");
    let table = catalog.get_table(&identifier).await.unwrap();

    // 3. Scan with projection and filter
    let mut read_builder = table.new_read_builder();
    read_builder.with_projection(&["id", "name"]);

    let scan = read_builder.new_scan();
    let plan = scan.plan().await.unwrap();

    // 4. Read data as Arrow RecordBatches
    let read = read_builder.new_read().unwrap();
    let batches: Vec<_> = read
        .to_arrow(plan.splits())
        .unwrap()
        .try_collect()
        .await
        .unwrap();

    for batch in &batches {
        println!("{:?}", batch);
    }
}
```

### Query with DataFusion SQL

Add `paimon-datafusion` to your `Cargo.toml`:

```toml
[dependencies]
paimon-datafusion = "0.1.0"
```

```rust
use std::sync::Arc;
use datafusion::prelude::SessionContext;
use paimon::{Catalog, CatalogOptions, FileSystemCatalog, Options};
use paimon_datafusion::PaimonCatalogProvider;

#[tokio::main]
async fn main() {
    // 1. Create a catalog and register it with DataFusion
    let mut options = Options::new();
    options.set(CatalogOptions::WAREHOUSE, "/path/to/warehouse");
    let catalog = FileSystemCatalog::new(options).unwrap();

    let provider = PaimonCatalogProvider::new(Arc::new(catalog));
    let ctx = SessionContext::new();
    ctx.register_catalog("paimon", Arc::new(provider));

    // 2. Query Paimon tables with SQL
    let df = ctx
        .sql("SELECT id, name FROM paimon.my_db.my_table WHERE id > 100")
        .await
        .unwrap();

    df.show().await.unwrap();
}
```

For more information, visit the [documentation](https://paimon.apache.org/docs/rust/) and the
[GitHub repository](https://github.com/apache/paimon-rust).

## Contributors

Thanks to all the contributors who made this release possible:

Aitozi, Asura7969, Cancai Cai, DogeKing, ErXi, ForwardXu, Huanbing, HunterXHunter, Jiajia Li,
Jingsong Lee, QuakeWang, Ryan Tan, SeungMin, Song Chuanqi, WenjunMin, XiaoHongbo, Xuanwo,
Yuxia Luo, Zach, umi, zmlcc
