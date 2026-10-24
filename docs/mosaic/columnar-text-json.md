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

# Columnar text JSON

`ColumnarTextJsonWriter` exports one Mosaic row group as a JSON object containing
comma-separated text columns. This is useful when a downstream interface accepts
each column as a text sequence rather than individual typed rows.

The writer consumes Mosaic's encoded scalar columns directly. It avoids creating
intermediate Arrow arrays, reuses formatted constants, and streams the result to
the caller's `OutputStream`. It does not compress the result or manage storage.

## Format

For these logical columns:

| Row | speed | state |
| --- | --- | --- |
| 0 | 10 | on |
| 1 | null | off |
| 2 | 12 | null |

the output is:

```json
{"speed":"10,,12","state":"on,off,"}
```

- Each object key is a column name. Columns follow the reader's projection order.
- Each value is one JSON string, **not** a JSON array. Entries follow logical row
  order and are separated by a comma.
- Null and empty strings both produce empty entries. Commas within string values
  remain literal. Quotes, backslashes, and control characters receive JSON escaping,
  but there is no additional CSV quoting or delimiter escaping.
- Integers use base ten without grouping. Finite doubles follow `Double.toString`
  on the calling JVM, including negative zero. Decimals follow
  `BigDecimal.toPlainString`, preserving their scale.

This is a text aggregation format, not a lossless encoding of typed rows. In
particular, null cannot be distinguished from an empty string, and commas in values
cannot be distinguished from entry separators. Consumers needing that distinction
should use typed Arrow access or another serialization format.

## Java API

```java
try (MosaicReader reader = MosaicReader.open(input, fileLength, allocator);
        MosaicRowGroupReader rowGroup = reader.openRowGroup(0)) {
    ColumnarTextJsonWriter.Status status =
            ColumnarTextJsonWriter.write(rowGroup, output);
}
```

Projection can be set on `MosaicReader` before opening the row group. The writer
uses the row group's actual schema; callers do not supply a second schema or make
a separate assertion that the input has been validated.

The supported value types are signed integers, DOUBLE, Decimal128, and UTF8 in
ALL_NULL, CONST, DICT, and PLAIN encodings. All-null columns of other scalar types
are also supported. Nested columns are not supported.

## Results and failures

| Result | Output | Caller action |
| --- | --- | --- |
| `WRITTEN` | One complete JSON object | Use the result |
| `UNSUPPORTED` | Unchanged | Use `rowGroup.readColumns(allocator)` or another exporter |
| Exception | May contain an incomplete object | Discard this result; do not append a fallback |

Capability checks and DOUBLE formatting happen before output starts. Non-finite
doubles and more than 65,536 distinct values needing JVM formatting return
`UNSUPPORTED`. Other values are validated during streaming, so invalid UTF8,
malformed values, or output failures can be reported after bytes have been written.
`UNSUPPORTED` is a capability result, not a certificate that all input is valid.

The writer neither flushes nor closes the caller's stream. Callers must ensure
failed results do not become visible downstream. Compression, buffering, and
publication belong to the caller; they are not part of the text format.

## Ownership and memory

Close the row-group reader when finished. It allows one active operation and
rejects concurrent or reentrant reads and writes. Closing during an operation
prevents new calls and releases the native handle after that operation returns.

The encoding views borrow buffers owned by the row group. The writer uses bounded
scratch buffers instead of accumulating a whole text column. This does not bound
the size of the loaded row group or any output that the caller chooses to retain.
