---
title: "Downloads"
weight: 1
type: docs
aliases:
- /downloads.html
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

# Downloads

Paimon is released as a source artifact, and also through Maven.

## Source Releases

| RELEASE | DATE | COMMIT | DOWNLOAD |
|---|---|---|---|
| 0.6.0 | 2023-12-11 | [5a371a](https://github.com/apache/incubator-paimon/commit/5a371aa614b32081c873fdb76f53547fc1fb6e7a) | [tar](https://www.apache.org/dyn/closer.lua?filename=incubator/paimon/paimon-0.6.0-incubating/apache-paimon-0.6.0-incubating-src.tgz&action=download) ([digest](https://dlcdn.apache.org/incubator/paimon/paimon-0.6.0-incubating/apache-paimon-0.6.0-incubating-src.tgz.sha512), [pgp](https://dlcdn.apache.org/incubator/paimon/paimon-0.6.0-incubating/apache-paimon-0.6.0-incubating-src.tgz.asc)) |
| 0.5.0 | 2023-09-06 | [79a47f](https://github.com/apache/incubator-paimon/commit/79a47f9eeb77f56fc1f11de2aeca165f2076e94b) | [tar](https://www.apache.org/dyn/closer.lua?filename=incubator/paimon/paimon-0.5.0-incubating/apache-paimon-0.5.0-incubating-src.tgz&action=download) ([digest](https://dlcdn.apache.org/incubator/paimon/paimon-0.5.0-incubating/apache-paimon-0.5.0-incubating-src.tgz.sha512), [pgp](https://dlcdn.apache.org/incubator/paimon/paimon-0.5.0-incubating/apache-paimon-0.5.0-incubating-src.tgz.asc)) |
| 0.4.0 | 2023-06-10 | [40ac3c](https://github.com/apache/incubator-paimon/commit/40ac3c7d7602171d3c2d71f073c607a02cb9e364) | [tar](https://www.apache.org/dyn/closer.lua?filename=incubator/paimon/paimon-0.4.0-incubating/apache-paimon-0.4.0-incubating-src.tgz&action=download) ([digest](https://dlcdn.apache.org/incubator/paimon/paimon-0.4.0-incubating/apache-paimon-0.4.0-incubating-src.tgz.sha512), [pgp](https://dlcdn.apache.org/incubator/paimon/paimon-0.4.0-incubating/apache-paimon-0.4.0-incubating-src.tgz.asc)) |

To download a source distribution for a particular release, click on the *tar* link.

The commit hash links to github, which contains the release’s version control history but does not contain the definitive source artifacts.

For security, hash and signature files are always hosted at [Apache](https://downloads.apache.org/).

## Verify the Integrity of the Files

You must verify the integrity of the downloaded file using the PGP signature (.asc file) or a hash (.sha256; .md5 for older releases). For more information why this must be done, please read [Verifying Apache Software Foundation Releases](https://www.apache.org/info/verification.html).

To verify the signature using GPG or PGP, please do the following:

1. Download the release artifact and the corresponding PGP signature from the table above.
2. Download the [Apache Paimon KEYS file](https://dlcdn.apache.org/incubator/paimon/KEYS).
3. Import the KEYS file and verify the downloaded artifact using one of the following methods:

```bash
gpg --import KEYS
gpg --verify downloaded_file.asc downloaded_file
```

or

```bash
pgpk -a KEYS
pgpv downloaded_file.asc
```

or

```bash
pgp -ka KEYS
pgp downloaded_file.asc
```

## Maven Artifacts

Add the following to the dependencies section of your `pom.xml` file:

{{< tabs "maven-artifacts" >}}

{{< tab "Flink" >}}

Please replace `${flink.version}` in the following xml file to the version of Flink you're using. For example, `1.17` or `1.18`.

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.paimon</groupId>
        <artifactId>paimon-flink-${flink.version}</artifactId>
        <version>0.6.0-incubating</version>
    </dependency>
</dependencies>
```

Also include `<dependency>` elements for any extension modules you need: `paimon-flink-cdc`, `paimon-flink-action`, and so forth.

{{< /tab >}}

{{< tab "Spark3" >}}

Please replace `${spark.version}` in the following xml file to the version of Flink you're using. For example, `3.4` or `3.5`.

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.paimon</groupId>
        <artifactId>paimon-spark-${spark.version}</artifactId>
        <version>0.6.0-incubating</version>
    </dependency>
</dependencies>
```
{{< /tab >}}

{{< /tabs >}}
