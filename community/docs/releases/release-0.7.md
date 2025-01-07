---
title: "Release 0.7"
type: release
version: 0.7.0
date: 2024-02-29
---

# Apache Paimon 0.7 Available

February 29, 2024 - Paimon Community (dev@paimon.apache.org)

Apache Paimon PPMC has officially released Apache Paimon 0.7.0-incubating version. A total of 34 people contributed to
this version and completed over 300 Commits. Thank you to all contributors for their support!

In this version, we mainly focus on enhancement and optimization for the existing features. For more details, please 
refer to the following content below.

## Flink

### Lookup Join

1. Fix bug that lookup join cannot handle sequence field of dim table.
2. Introduced primary key partial lookup based on Paimon hash lookup for lookup join. 
3. Use parallel reading and bulk loading to speed up initial data loading of dim table.

### Paimon CDC

In 0.7, we continued to improve the Paimon CDC:

1. Support Postgres table synchronization.
2. Paimon data commit relies on checkpoint but many users forget to enable it when submitting CDC job. In this case, the job 
will set checkpoint interval to 180 seconds.
3. Support UNAWARE Bucket mode table as CDC sink.
4. Support extract time attribute from CDC input as watermark. Now, you can set `tag.automatic-creation` to `watermark` in CDC jobs.

## Spark

1. Merge-into supports WHEN NOT MATCHED BY SOURCE semantics.
2. Sort compact supports Hilbert Curve sorter.
3. Multiple optimization for improving query performance.

## Hive

In 0.7, we mainly focus on improving compatibility with Hive.

1. Support timestamp with local time zone type.
2. Support create database with location, comment and properties of HiveSQL.
3. Support table comment.

## Tag Management

1. Support a new `tag.automatic-creation` mode `batch`. In this mode, a tag will be created after a batch job completed.
2. The tag auto creation relies on commit, so if no commit when it is time to auto-create tag,  the tag won't be created. 
In this case, we introduce an option `snapshot.watermark-idle-timeout`. If the flink source idles over the specified 
timeout duration, the job will force to create a snapshot and thus trigger tag creation.

## New Aggregation Functions

1. count: counts the values across multiple rows.
2. product: computes product values across multiple rows.
3. nested-update: collects multiple rows into one ARRAY<ROW> (so-called 'nested table'). You can use `fields.<field-name>.nested-key=pk0,pk1,...` to 
define the primary keys of the nested table. If no keys defined, the rows will be appended to the array.
4. collect: collects elements into an ARRAY. You can set `fields.<field-name>.distinct=true` to deduplicate elements.
5. merge_map: merges input maps into single map.

## New Metrics

1. Support Flink standard connector metric `currentEmitEventTimeLag`.
2. Support `level0FileCount` to show the compaction progress.

## Other Improvements

Besides above, there are some useful improvements for existed features:

1. New time travel option `scan.file-creation-time-millis`: By specifying this option, only the data files created after 
this time will be read. It is more convenient than `scan.timestamp-millis` and `scan.tag-name`, but is imprecise (depending 
on whether compaction occurs).
2. For primary key table, now the row kind can be determined by field which is specified by option `rowkind.field`.
3. Support ignoring delete records in deduplicate mode by option `deduplicate.ignore-delete`.
4. Support ignoring consumer id when starting streaming reading job by option `consumer.ignore-progress`.
5. Support new procedure `expire_snapshots` to manually trigger snapshot expiration.
6. Support new system table `aggregation_fields` to show the aggregation fields information for aggregate or partial-update table.
7. Introduce bloom filter to speed up the local file lookup, which can benefit both lookup changelog-producer and flink lookup join.
