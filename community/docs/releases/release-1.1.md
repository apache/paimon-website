---
title: "Release 1.1"
type: release
version: 1.1.1
weight: 93
---

# Apache Paimon 1.1 Available

May 16, 2025 - Jingsong Lee (jingsonglee0@gmail.com)

Apache Paimon PMC Officially Releases Milestone 1.1 Stable Version (Version 1.1.1).

This core version has been carefully polished over nearly four months, aggregating the wisdom of over 60 developers from the
global open-source community. In total, it has accumulated over 400 code commits, fully demonstrating the power of community-driven
technological evolution. We sincerely express our gratitude to all contributors!

## Highlights 

1. REST Catalog: Provides a lightweight implementation to access Catalog services, completely decoupling dependency on Hive Metastore. Designed specifically for Paimon's unique features.
2. External File Mode: Enabled via data-file.external-paths, allowing files to exist outside table directories. Unlocks support for super-large tables and partitioned files migration to cold storage.
3. Adaptive Bucketing: Configuring bucket = -2 activates Postpone Bucket Mode, designed to address challenges in bucket definition. Empowers backend services to perform intelligent compaction and rescaling.
4. File System Ecosystem: Adds support for Tencent Cloud Object Storage, Microsoft Azure Storage, and Huawei OBS file systems.
5. Compatibility Notes: When file-index.bitmap.columns is enabled, Bitmap Index V2 is activated by default. Older readers cannot recognize this format; users must upgrade to new readers if using new writers.

## REST Catalog

REST Catalog is ready in this release, benefits of REST Catalog:
1. Decoupled Architecture
   - Interacts with Catalog Server via well-defined REST APIs.
   - Enables independent evolution and extension of Catalog Server and REST clients.
2. Language Agnosticism
   - Developers can implement Catalog Server in any programming language as long as REST APIs are followed.
   - Leverages existing team expertise and tech stacks.
3. Vendor Lock-in Avoidance
   - Designed to work with any Catalog Server. 
   - Reduces migration costs for REST servers, as clients only need to comply with REST protocols.

<img src="./img/1.1-rest-api.png" alt="rest" />

REST API definition (https://paimon.apache.org/docs/master/concepts/rest/rest-api/):

## External Files

Apache Paimon's external files were previously stored entirely within the table folder in earlier versions. This allowed the Manifest to record only relative paths for files,
offering the following advantages:

1. Smaller Manifest size
2. Easier migration (simply copy files directly)

However, some requirements necessitate storing files externally, such as managing cold/hot data across multiple file systems. This release introduces the following parameters to address these needs:

1. data-file.external-paths: Comma-separated external paths where table data will be written.
2. data-file.external-paths.strategy: Strategy for selecting external paths when writing data:
   - none mode: No external storage is selected; data remains in the default warehouse path.
   - specific-fs: Choose a specific file system as the external path (e.g., S3, OSS).
   - round-robin: Sequentially select paths from data-file.external-paths when writing new files.

If certain data can be cooled, you can use these configurations to copy specific partitions to object storage to reduce costs.

## Adaptive Bucket (Postpone Bucket)

Bucket configuration has long been a key challenge in Paimon usage, and Compaction management is also complex. The Adaptive Bucket (Postpone Bucket) mode was designed to simplify these complexities.

<img src="./img/1.1-postpone.png" alt="rest" />

There is a temporary area for storing fresh data, providing backend services with flexible control space. This allows users to avoid worrying about Bucket configuration and Compaction stability.

## Other Features

1. This version supports in-place upgrade from Iceberg tables to Paimon tables, which is suitable for HDFS-like file systems.
2. The 'precommit-compact' parameter is now supported for non-keyed tables, significantly reducing small files during streaming writes.
3. A new parameter dynamic-bucket.max-buckets has been introduced to prevent excessive Bucket generation in keyed tables when using bucket = -1 mode.
4. The default value of sync-all-properties for HiveCatalog tables has been set to True, ensuring all Paimon table options are synchronized to Hive Metastore (HMS) by default.

## Future Roadmap

1. Develop a Light REST SDK with dependency-free design to avoid introducing Hadoop-related dependencies and reduce usage costs.
2. Expand Iceberg Snapshots compatibility to support real-time data integration with Iceberg’s Deletion Vectors, currently focusing on top-level files in keyed tables.
3. Enable file cloning from Hive, Hudi, and Iceberg tables to Paimon tables.
