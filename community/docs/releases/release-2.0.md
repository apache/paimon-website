---
title: "Release 2.0"
type: release
version: 2.0.0
weight: 97
---

# Apache Paimon 2.0 Available

The Apache Paimon community is pleased to announce Apache Paimon 2.0.0 and
PyPaimon 2.0.0. This major release advances Paimon as a unified multimodal
lakehouse for streaming, batch, and AI workloads, with matching Java and Python
release versions.

More than 100 contributors produced more than 1,100 commits on the road to this
release. We thank everyone who contributed code, design, documentation, testing,
release verification, and user feedback.

Paimon has always focused on making data in the lake fresh and mutable. Its
primary-key tables, merge engines, changelog production, and unified batch and
streaming access brought real-time updates to object storage. Paimon 2.0 keeps
that foundation and extends it for a new generation of workloads.

AI applications rarely work with rows and columns alone. A single record may
include an image or video, extracted text, evolving JSON metadata, several
embeddings, labels, and features produced at different times. In many existing
architectures, these representations are copied across an object store, a
lakehouse table, a vector database, and a search engine. Every copy adds another
ingestion pipeline, freshness boundary, access-control surface, and lifecycle
to operate.

Paimon 2.0 introduces a different model: keep the data, its derived
representations, and its indexes in one transactional table, while allowing
each modality to use the physical layout best suited to it.

The major highlights are:

- **A first-class Multimodal Table** for scalar values, text, BLOBs, fixed-size
  vectors, and schema-flexible Variant data.
- **Data Evolution** for adding or backfilling derived columns without rewriting
  every untouched column in the original files.
- **Retrieval where the data lives**, with BTree, Bitmap, vector, and full-text
  indexes, plus hybrid ranking across multiple retrieval routes.
- **A Python-native data plane** through PyPaimon, PyArrow, PyTorch, Ray Data,
  and Daft integrations.
- **Multimodal primary-key tables** that keep large objects and search indexes
  aligned with updates, deletes, and compaction.
- **Continued stream and batch interoperability** through Flink, Spark, the
  REST Catalog, and Iceberg-compatible metadata.

## One Table for Every Modality

The central addition in Paimon 2.0 is the
[Multimodal Table](https://paimon.apache.org/docs/2.0/multimodal-table/). It is
built on append tables with row tracking and Data Evolution, and allows one
logical row to carry ordinary columns together with large binary objects,
vectors, text, and semi-structured data.

This is not a single generic binary format for every workload. Paimon keeps one
table and one snapshot history while physically separating different kinds of
data:

- The [BLOB type](https://paimon.apache.org/docs/2.0/multimodal-table/blob/)
  stores images, video, audio, documents, and other large objects in dedicated
  `.blob` files. Queries that project only scalar columns do not read the BLOB
  payloads. Paimon also supports descriptor-only fields and BLOB views for
  reusing or referencing existing objects without unnecessary copies.
- The [VECTOR type](https://paimon.apache.org/docs/2.0/multimodal-table/vector/)
  represents a fixed-size dense vector with a declared element type and
  dimension. In a Data Evolution table, vector columns can be stored in
  dedicated Vortex files, independently of scalar and BLOB data.
- The [VARIANT type](https://paimon.apache.org/docs/2.0/multimodal-table/variant/)
  stores objects, arrays, and scalar values using the Parquet Variant binary
  encoding. Frequently queried paths can be shredded into typed Parquet
  sub-columns, while unmodeled fields remain available in the original Variant
  value.

The result is a useful separation of concerns: applications see one table;
storage and query paths remain specialized by modality.

Consider an AI catalog that contains a product image, its text description,
business metadata, and multiple embeddings. These values can now share the
same snapshot, partitioning, time-travel history, branch or tag, and catalog
policy. A data-quality rollback no longer has to coordinate independent
versions in a lake table, an object manifest, and a vector service.

## Data Evolution: Build Features Without Rewriting Raw Data

Multimodal datasets evolve differently from traditional analytical tables. Raw
media may arrive first. OCR text, captions, embeddings, moderation results, and
human labels are often produced later by independent pipelines. Rewriting a
large original file every time one derived column changes is expensive and
slows iteration.

[Data Evolution](https://paimon.apache.org/docs/2.0/multimodal-table/data-evolution/)
addresses this by assigning stable row IDs and allowing a subset of columns to
be written into new files. Readers merge those column files with the original
data at read time. Untouched columns remain in place.

This model enables:

- incremental embedding and feature backfills;
- partial-column updates from Spark SQL, Flink procedures, or PyPaimon;
- schema evolution without an immediate rewrite of the complete dataset; and
- row deletion through deletion vectors, followed by compaction when physical
  reclamation is needed.

Stable row IDs also connect data files, dedicated BLOB or vector files, and
global indexes. They are the coordination layer that lets independently
produced representations continue to describe the same logical record.

For large distributed feature jobs, PyPaimon can pair row IDs with Ray Data to
read or update only the owning files. This avoids a full target-table join for
workflows that have already resolved the rows they need to change.

## Search the Lake Without Moving the Data First

Storing multimodal data is only useful if applications can find it. Paimon 2.0
turns its [Global Index](https://paimon.apache.org/docs/2.0/multimodal-table/global-index/)
framework into a unified retrieval layer:

- **BTree indexes** accelerate selective equality, `IN`, range, and null
  predicates on scalar columns.
- **Bitmap indexes** use compressed row-ID bitmaps for tags and enum-like
  dimensions, including set, complement, prefix, and null predicates.
- **Vector indexes** provide approximate nearest-neighbor search with IVF-Flat,
  IVF-PQ, IVF-SQ, IVF-RQ, and DiskANN implementations. Workloads can choose
  among recall, latency, memory, and index-size trade-offs.
- **Full-text indexes** provide scored retrieval over string columns with
  configurable tokenization, including n-gram and Jieba tokenizers.

Paimon can apply a scalar index before vector retrieval, which is useful for
tenant, category, time, or governance filters. It can also combine several
vector and full-text routes through
[Hybrid Search](https://paimon.apache.org/docs/2.0/multimodal-table/global-index/hybrid-search/).
Reciprocal rank fusion, normalized weighted-score ranking, and weighted
reciprocal-rank ranking are available for merging candidates whose native score
scales differ.

This makes retrieval part of the table rather than a detached copy of it.
Index files are recorded in table metadata, tied to row-ID coverage, and read
against a captured table snapshot. Paimon exposes coverage and freshness
explicitly: fast mode searches indexed ranges, while full or detail modes can
cover gaps through raw-data fallback for supported index families. Applications
can therefore choose deliberately between the freshest complete result and the
lowest-latency indexed result.

## Mutable Multimodal Data with Primary-Key Tables

Many AI datasets are not append-only. Product catalogs, user profiles,
recommendation features, document corpora, and agent memory are continually
corrected or replaced by key.

Paimon 2.0 extends multimodal capabilities to
[primary-key tables](https://paimon.apache.org/docs/2.0/primary-key-table/global-index/).
They can maintain BTree, Bitmap, vector, and full-text indexes together with
compacted data files. Index groups record their source files and map matches
back to physical row positions; deletion vectors filter obsolete or deleted
rows when results are read.

Primary-key tables also support
[managed BLOB storage](https://paimon.apache.org/docs/2.0/primary-key-table/blob-storage/).
Payloads are stored in immutable packs and data files keep stable descriptors,
allowing MergeTree sorting, deduplication, and compaction to reorganize rows
without rewriting every surviving large object.

This closes an important gap between analytical history and serving data: the
same table can accept streaming upserts, retain snapshot history, and expose
modality-aware retrieval.

## Flink, Spark, and Open Lakehouse Interoperability

Paimon remains a multi-engine lake format. In 2.0, the multimodal capabilities
are available through the environments users already operate:

- **Flink SQL** can define BLOB and VECTOR fields, update Data Evolution tables
  through procedures, build indexes, and execute vector or full-text search.
- **Spark SQL** can use `UPDATE`, `DELETE`, and `MERGE INTO` with Data Evolution
  tables, and exposes vector, full-text, and hybrid search as table-valued
  functions. Spark 4.x can also query Variant data, including pushed-down
  extraction of shredded Variant paths in supported versions.
- **PyPaimon** provides local and distributed Python access without requiring a
  JVM data path for each application.
- **REST Catalog and Iceberg-compatible metadata** continue to make Paimon data
  discoverable and governable across engines and catalog deployments.

The goal is not to replace specialized compute engines. It is to give them a
shared, transactional storage layer for data that is no longer purely
relational.

## Before You Upgrade

Paimon 2.0 is a major release, and production deployments should review the
complete release notes and test their engine, catalog, and file-system
combinations before upgrading.

In particular:

- Multimodal Table features such as dedicated BLOB and vector storage require
  row tracking and Data Evolution. Global indexes on Data Evolution tables use
  unaware-bucket mode and require an index maintenance and coverage strategy.
- Variant data files use Parquet. SQL access requires Spark 4.0 or later, or
  Flink 2.1 or later; Spark Variant extraction pushdown requires Spark 4.1 or
  later.
- The default fast mode for vector and full-text retrieval searches indexed
  ranges. Use the documented full or detail modes where supported when complete
  fallback coverage is required.

## Downloads and packages

- [Apache Paimon 2.0.0 source release](https://downloads.apache.org/paimon/paimon-2.0.0/)
- [PyPaimon 2.0.0 source release](https://downloads.apache.org/paimon/pypaimon-2.0.0/)
- [Apache Paimon artifacts on Maven Central](https://central.sonatype.com/search?q=g%3Aorg.apache.paimon%20v%3A2.0.0)
- [PyPaimon 2.0.0 on PyPI](https://pypi.org/project/pypaimon/2.0.0/)
- [Apache Paimon 2.0 documentation](https://paimon.apache.org/docs/2.0/)

## Thank You

Apache Paimon 2.0.0 is the result of a broad community effort. We thank every
contributor, reviewer, release manager, documentation author, and user who
tested the release candidates and shared feedback.

Paimon began by bringing real-time updates to the data lake. With 2.0, it takes
the next step: one lake for streaming and batch data, and now one lake for every
modality.
