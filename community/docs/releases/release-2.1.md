---
title: "Release 2.1"
type: release
version: 2.1.0
weight: 98
---

<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements. See the NOTICE file
distributed with this work for additional information
regarding copyright ownership. The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied. See the License for the
specific language governing permissions and limitations
under the License.
-->

# Apache Paimon 2.1 Available

The Apache Paimon community is pleased to announce Apache Paimon 2.1.0 and
PyPaimon 2.1.0. This release builds on Paimon's multimodal lakehouse capabilities
with expanded Python-native execution, storage and merge correctness fixes,
and improvements to distributed data processing.

These notes describe the code in the approved 2.1.0 release. See the
[complete changelog](https://github.com/apache/paimon/compare/release-2.0.0...release-2.1.0)
for all changes since 2.0.0.

## PyPaimon and Native Execution

PyPaimon expands its optional Rust-backed execution through `pypaimon-rust`,
including scan planning, Arrow reads and writes, table updates and upserts,
and native commit paths for supported tables and catalogs.

The release extends native support for nested Data Evolution rows, BLOB
collections, Variant updates, column-subset writes, external data paths,
dynamic buckets, and branch writes. Resolved REST metadata can be reused by
native readers, avoiding repeated catalog setup in parallel reads.

Native execution remains capability-dependent. Follow the
[PyPaimon documentation](https://paimon.apache.org/docs/2.1/pypaimon/python-api/)
for options, optional dependencies and supported combinations, rather than
assuming every table or storage backend follows the same execution path.

## Correctness and Reliability

Important fixes include:

- Snapshot expiration rejects invalid `retain_min` values rather than deleting
  files belonging to retained snapshots.
- Projected and partial-update reads preserve sequence-group deletion state.
- OSS retry handling covers `QpsLimitExceeded` and server-side errors, including
  responses whose error bodies cannot be parsed.
- Native planning and reading better preserve Java-compatible scan semantics,
  row tracking, deletion vectors and BLOB limits.

The release also improves Ray-based processing, including distributed BLOB
read request locality and native primary-key scan sharding.

## Engine Artifacts and Upgrade Checks

Convenience artifacts include connectors for Flink 1.x and 2.x, Spark 3.x and
4.x, Hive, and supported object-storage filesystems. Choose the artifact for
your exact engine version; Spark artifact names also include the Scala binary
version, such as `paimon-spark-3.5_2.12` or `paimon-spark-4.1_2.13`.

Before upgrading, test your table types, merge engines, catalog and filesystem
configuration against the released version. Review the
[2.1 documentation](https://paimon.apache.org/docs/2.1/) for compatibility and
installation requirements.

## Downloads and Packages

- [Apache Paimon 2.1.0 source, signature and SHA-512 checksum](https://downloads.apache.org/paimon/paimon-2.1.0/)
- [PyPaimon 2.1.0 source, signature and SHA-512 checksum](https://downloads.apache.org/paimon/pypaimon-2.1.0/)
- [Apache Paimon KEYS for signature verification](https://downloads.apache.org/paimon/KEYS)
- [Apache Paimon 2.1.0 GitHub release](https://github.com/apache/paimon/releases/tag/release-2.1.0)
- [PyPaimon 2.1.0 on PyPI](https://pypi.org/project/pypaimon/2.1.0/)
- [Apache Paimon 2.1 documentation](https://paimon.apache.org/docs/2.1/)

Install the Python convenience package with:

```bash
pip install pypaimon==2.1.0
```

Thank you to every contributor, reviewer and user who helped develop and
verify this release.
