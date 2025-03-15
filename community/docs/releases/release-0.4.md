---
title: "Release 0.4"
type: release
version: 0.4.0
weight: 40
---

# Apache Paimon 0.4 Available

June 07, 2023

We are happy to announce the availability of Paimon 0.4. This is the first release of the system inside the Apache Incubator and under the name Paimon. Releases up to 0.3 were under the name Flink Table Store, a sub-project of Flink where Paimon originates from.

## What is Paimon?

Apache Paimon(incubating) is a streaming data lake platform that supports high-speed data ingestion, change data tracking and efficient real-time analytics.

Paimon offers the following core capabilities:

- **Unified Batch & Streaming**: Paimon supports batch write and batch read, as well as streaming write changes and streaming read table changelogs.
- **Data Lake**: As a data lake storage, Paimon has the following advantages: low cost, high reliability, and scalable metadata.
- **Merge Engines**: Paimon supports rich Merge Engines. By default, the last entry of the primary key is reserved. You can also use the "partial-update" or "aggregation" engine.
- **Changelog producer**: Paimon supports rich Changelog producers, such as "lookup" and "full-compaction". The correct changelog can simplify the construction of a streaming pipeline.
- **Append Only Tables**: Paimon supports Append Only tables, automatically compact small files, and provides orderly stream reading. You can use this to replace message queues.

## Release 0.4

Paimon 0.4 includes many bug fixes and improvements that make the system more stable and robust.

Download the release [here](https://paimon.apache.org/docs/0.4/project/download/).
