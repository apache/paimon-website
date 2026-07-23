---
title: "PyPaimon Release 0.3.0"
type: release
version: pypaimon-0.3.0
weight: 91
---

# PyPaimon 0.3.0 Available

Sep 18, 2025 - Wenhai Zhao (umiblue864@gmail.com)

## What is PyPaimon?

[PyPaimon](https://github.com/apache/paimon-python) is the Python SDK of Apache Paimon. It provides a way
for users to get data from Paimon tables with Python for data analysis, and write data back to Paimon tables.

## Version Overview

This version of PyPaimon supports following features:

1. Connect to `Catalog`.
2. Get or create table.
3. Batch read: Filter and projection pushdown, and reading data as Apache Arrow, Pandas, DuckDB and Ray format.
4. Batch write: Insert into or overwrite table with Apache Arrow and Pandas data.

The detailed document can found at https://paimon.apache.org/docs/master/program-api/python-api/.

### Connect to Catalog

You can create a `Catalog` with options just like in SQL:

```python
from pypaimon import CatalogFactory

# Note that keys and values are all string
catalog_options = {
    'warehouse': 'file:///path/to/warehouse'
}
catalog = CatalogFactory.create(catalog_options)
```

Currently, PyPaimon only support filesystem catalog and rest catalog. See [Catalog](https://github.com/apache/paimon-python).


### Get or create table

You can get a existed table from `Catalog` by its identifier:

```python
table = catalog.get_table('database_name.table_name')
```

You can also create a new table. The table field definitions are described by `pyarrow.Schema`, and you can set primary keys,
partition keys, table options and comment.

```python
import pyarrow as pa
from pypaimon import Schema

# field definitions
pa_schema = pa.schema([
    ('dt', pa.string()),
    ('hh', pa.string()),
    ('pk', pa.int64()),
    ('value', pa.string())
])
# table schema
schema = Schema(
    pa_schema=pa_schema, 
    partition_keys=['dt', 'hh'],
    primary_keys=['dt', 'hh', 'pk'],
    options={'bucket': '2'},
    comment='my test table'
)

# create table 
catalog.create_table(identifier='default.test_table', schema=schema, ignore_if_exists=False)
```

Then you can get table read and write interfaces from table.

## Batch Write

Assume that you already hava the table `default.test_table` described in the previous section. Let's see how to write or overwrite it.

First, assume that you have a dataframe data of 2025-09-02, 12 o'clock, and you want to write it into the table.

```python
write_builder = table.new_batch_write_builder()
table_write = write_builder.new_write()
table_commit = write_builder.new_commit()

# you can write data many times before committing
dataframe = ...
table_write.write_pandas(dataframe)

commit_messages = table_write.prepare_commit()
table_commit.commit(commit_messages)

table_write.close()
table_commit.close()
```
Let's see how to overwrite the partition 'dt=2025-09-02,hh=12' with new data.
```python
write_builder = table.new_batch_write_builder()
# set partition to overwrite
write_builder = write_builder.overwrite({'dt': '2025-09-02', 'hh': '12'})

table_write = write_builder.new_write()
table_commit = write_builder.new_commit()

# then write data
dataframe = ...
table_write.write_pandas(dataframe)

commit_messages = table_write.prepare_commit()
table_commit.commit(commit_messages)

table_write.close()
table_commit.close()
```

### Various data formats

PyPaimon supports reading data in following formats: Pandas, Apache Arrow and DuckDB, and writing data in following
formats: Pandas, Apache Arrow. Please refer to the [document](https://paimon.apache.org/docs/master/program-api/python-api/) for details.

## Batch read

Assume that you already hava the table `default.test_table` described in the previous section. Let's see how to read data from it.

```python
from pypaimon.py4j import Catalog

catalog_options = {
  'warehouse': 'path/to/warehouse',
  'metastore': 'filesystem',
}
catalog = Catalog.create(catalog_options)
table = catalog.get_table('default.test_table')

# use ReadBuilder to perform filter and projection pushdown
read_builder = table.new_read_builder()

# select partition: dt='2025-09-02',hh='12'
predicate_builder = read_builder.new_predicate_builder()
dt_predicate = predicate_builder.equal('dt', '2025-09-02')
dt_hh = predicate_builder.equal('hh', '12')
partition_predicate = predicate_builder.and_([dt_predicate, dt_hh])
read_builder = read_builder.with_filter(partition_predicate)

# select pk and value
read_builder = read_builder.with_projection(['pk', 'value'])

# plan splits
table_scan = read_builder.new_scan()
splits = table_scan.splits()

# read data to pandas.DataFrame
df = table_read.to_pandas(splits)
```

Then you can do some analysis on the dataframe with Python.
