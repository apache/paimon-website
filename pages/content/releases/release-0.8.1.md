---
title: "Release 0.8.1"
weight: 996
type: docs
aliases:
- /release-0.8.html
---
<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# Apache Paimon 0.8.1 Available

June 11, 2024 - Jingsong Lee (jingsonglee0@gmail.com)

Apache Paimon PMC has officially released Apache Paimon 0.8.1 version. This is the bug fix version of release 0.8.

Thank you to all contributors for their support!

## Version Overview

This release includes 58 commits. Including:
1. 30+ bugfix commits.
2. 20+ document improvements.

The notable bugs include:
1. Paimon [#3476](https://github.com/apache/paimon/pull/3476): Make Flink Sink be compatible with Paimon 0.7.
2. Paimon [#3454](https://github.com/apache/paimon/pull/3454): Fix files system table performance issue by scanning all files during plan.
3. Paimon [#3484](https://github.com/apache/paimon/pull/3484): Fix infinite loops caused by nested types.
4. Paimon [#3467](https://github.com/apache/paimon/pull/3467): Fix that cannot read UPDATE_BEFORE of ignore-delete table.
5. Paimon [#3438](https://github.com/apache/paimon/pull/3438): Fix raw convert fail for old version storage read-optimized table.
6. Paimon [#3435](https://github.com/apache/paimon/pull/3435): Fix parquet conf cannot pass to parquet writer, for example, you cannot specify zstd level for parquet.
7. Paimon [#3338](https://github.com/apache/paimon/pull/3338): Incremental-between tags should deduplicate records, for a long time, its outcome has been more.
8. Paimon [#3314](https://github.com/apache/paimon/pull/3314): Paimon CDC: Fix when the order of the same field differs, it is considered a schema change, the bottleneck will be on the schema change.
9. Paimon [#3499](https://github.com/apache/paimon/pull/3499): Avoid commit conflicts caused by prolonged backpressure (Don't panic).
10. Paimon [#3452](https://github.com/apache/paimon/pull/3452): Fix FIRST_ROW merge engine for changelog-producer is none.

## Documentation

https://paimon.apache.org/docs/0.8/