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

## Highlights

- Expanded multimodal data support, including BLOB, VECTOR, VARIANT shredding,
  full-text search, vector search, and hybrid global indexes.
- Continued data-evolution and row-tracking improvements for efficient partial
  updates without rewriting complete rows.
- Broader engine coverage, including Flink 2.0, 2.1, and 2.2, Spark 4.0 and
  4.1, and the existing Flink, Spark, and Hive integrations.
- A substantially expanded PyPaimon SDK for native Python reads and writes,
  catalog operations, distributed processing, and AI ecosystem integrations.
- Lookup and compaction improvements, including LocalKvDb-backed lookup state,
  safer failure handling, and reduced memory use.
- Improved Iceberg compatibility, REST catalog behavior, object-store support,
  and release packaging across JDK 8, 11, and 17.

## Downloads and packages

- [Apache Paimon 2.0.0 source release](https://downloads.apache.org/paimon/paimon-2.0.0/)
- [PyPaimon 2.0.0 source release](https://downloads.apache.org/paimon/pypaimon-2.0.0/)
- [Apache Paimon artifacts on Maven Central](https://central.sonatype.com/search?q=g%3Aorg.apache.paimon%20v%3A2.0.0)
- [PyPaimon 2.0.0 on PyPI](https://pypi.org/project/pypaimon/2.0.0/)
- [Apache Paimon 2.0 documentation](https://paimon.apache.org/docs/2.0/)

For the complete list of changes, see the
[full changelog](https://github.com/apache/paimon/compare/release-1.4.2...release-2.0.0).

Thank you to every contributor and community member who made this release
possible.
