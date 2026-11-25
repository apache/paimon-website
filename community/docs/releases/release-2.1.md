---
title: "Release 2.1"
type: release
version: 2.1.1
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

## 2.1.1 Patch Release

Apache Paimon 2.1.1 and PyPaimon 2.1.1 include the following fixes on the 2.1 branch.

## Correctness and reliability fixes

- Preserve files reused by compaction when aborting commits ([#10582](https://github.com/apache/paimon/pull/10582)).
- Delete only tag metadata when deleting tags ([#10823](https://github.com/apache/paimon/pull/10823)), and disable automatic conflict rollback by default ([#10768](https://github.com/apache/paimon/pull/10768)).
- Fix Iceberg snapshot summary totals and manifest pruning for removed files ([#10575](https://github.com/apache/paimon/pull/10575), [#10649](https://github.com/apache/paimon/pull/10649)).
- Preserve table UUIDs in REST rollback requests, support branch creation from expired tag snapshots, and align Python rollback behavior with Java ([#10528](https://github.com/apache/paimon/pull/10528), [#10880](https://github.com/apache/paimon/pull/10880), [#10934](https://github.com/apache/paimon/pull/10934), [#11049](https://github.com/apache/paimon/pull/11049)).
- Fix Data Evolution updates involving rolled vector and BLOB files ([#11085](https://github.com/apache/paimon/pull/11085), [#11118](https://github.com/apache/paimon/pull/11118)).
- Record correct delete row counts and preserve numeric types and explicit JSON nulls during Python VARIANT shredding ([#10435](https://github.com/apache/paimon/pull/10435), [#10633](https://github.com/apache/paimon/pull/10633)).
- Fix Jindo stream lifetime, REST FileIO caching and fork handling, and propagation of unchecked FileIO loader failures ([#10536](https://github.com/apache/paimon/pull/10536), [#10552](https://github.com/apache/paimon/pull/10552), [#10556](https://github.com/apache/paimon/pull/10556), [#10752](https://github.com/apache/paimon/pull/10752)).

## Dependency compatibility

- Keep release-2.1 Rust wheels below 0.5.0 ([#11218](https://github.com/apache/paimon/pull/11218)).
- Limit Ray to below 2.60 and cap pyroaring at 1.0.3 on Python 3.8 ([#10986](https://github.com/apache/paimon/pull/10986), [#10500](https://github.com/apache/paimon/pull/10500)).
- Fix readerwriterlock compatibility on Python 3.6/3.7 ([#10532](https://github.com/apache/paimon/pull/10532)).
- Update Testcontainers for Docker API compatibility and update the approved PyPI publishing action ([#10530](https://github.com/apache/paimon/pull/10530), [#11223](https://github.com/apache/paimon/pull/11223)).

See the [2.1.1 changelog](https://github.com/apache/paimon/compare/release-2.1.0...release-2.1.1) for the complete changes since 2.1.0.

## 2.1.0 Release Highlights

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

- [Apache Paimon 2.1.1 source, signature and SHA-512 checksum](https://downloads.apache.org/paimon/paimon-2.1.1/)
- [PyPaimon 2.1.1 source, signature and SHA-512 checksum](https://downloads.apache.org/paimon/pypaimon-2.1.1/)
- [Apache Paimon KEYS for signature verification](https://downloads.apache.org/paimon/KEYS)
- [Apache Paimon 2.1.1 GitHub release](https://github.com/apache/paimon/releases/tag/release-2.1.1)
- [PyPaimon 2.1.1 on PyPI](https://pypi.org/project/pypaimon/2.1.1/)
- [Apache Paimon 2.1 documentation](https://paimon.apache.org/docs/2.1/)

Install the Python convenience package with:

```bash
pip install pypaimon==2.1.1
```

Thank you to every contributor, reviewer and user who helped develop and
verify this release.
