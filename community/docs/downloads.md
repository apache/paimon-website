---
title: "Downloads"
type: download
alias: downloads
---

# Downloads

Paimon is released as a source artifact, and also through Maven.

## Source Releases

| RELEASE | DATE       | DOWNLOAD                                                                                                                                                                                                                                                                                                           |
|---------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2.1.0   | 2026-10-12 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-2.1.0/apache-paimon-2.1.0-src.tgz) ([digest](https://downloads.apache.org/paimon/paimon-2.1.0/apache-paimon-2.1.0-src.tgz.sha512), [pgp](https://downloads.apache.org/paimon/paimon-2.1.0/apache-paimon-2.1.0-src.tgz.asc)) |
| 2.0.0   | 2026-08-07 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-2.0.0/apache-paimon-2.0.0-src.tgz)               ([digest](https://downloads.apache.org/paimon/paimon-2.0.0/apache-paimon-2.0.0-src.tgz.sha512),                [pgp](https://downloads.apache.org/paimon/paimon-2.0.0/apache-paimon-2.0.0-src.tgz.asc)) |
| 1.4.2   | 2026-06-23 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-1.4.2/apache-paimon-1.4.2-src.tgz)               ([digest](https://downloads.apache.org/paimon/paimon-1.4.2/apache-paimon-1.4.2-src.tgz.sha512),                [pgp](https://downloads.apache.org/paimon/paimon-1.4.2/apache-paimon-1.4.2-src.tgz.asc)) |
| 1.4.1   | 2026-04-27 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-1.4.1/apache-paimon-1.4.1-src.tgz)               ([digest](https://downloads.apache.org/paimon/paimon-1.4.1/apache-paimon-1.4.1-src.tgz.sha512),                [pgp](https://downloads.apache.org/paimon/paimon-1.4.1/apache-paimon-1.4.1-src.tgz.asc)) |                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 1.3.2   | 2026-05-14 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-1.3.2/apache-paimon-1.3.2-src.tgz)               ([digest](https://downloads.apache.org/paimon/paimon-1.3.2/apache-paimon-1.3.2-src.tgz.sha512),                [pgp](https://downloads.apache.org/paimon/paimon-1.3.2/apache-paimon-1.3.2-src.tgz.asc)) |                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 1.2.0   | 2025-07-16 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-1.2.0/apache-paimon-1.2.0-src.tgz)               ([digest](https://downloads.apache.org/paimon/paimon-1.2.0/apache-paimon-1.2.0-src.tgz.sha512),                [pgp](https://downloads.apache.org/paimon/paimon-1.2.0/apache-paimon-1.2.0-src.tgz.asc)) |                                                                                                                                                                                                                                                                                                                                                                                                                                            |

To download a source distribution for a particular release, click on the *tar* link.

For security, hash and signature files are always hosted at [Apache](https://downloads.apache.org/).

All Paimon releases are available via https://archive.apache.org/dist/paimon/ including checksums and signatures.

## PyPaimon

PyPaimon is released through PyPI:

```bash
pip install pypaimon==2.1.0
```

The Apache source distribution is also available:

| RELEASE | DATE       | DOWNLOAD                                                                                                                                                                                                                         |
|---------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2.1.0   | 2026-10-12 | [tar](https://www.apache.org/dyn/closer.lua/paimon/pypaimon-2.1.0/pypaimon-2.1.0.tar.gz) ([digest](https://downloads.apache.org/paimon/pypaimon-2.1.0/pypaimon-2.1.0.tar.gz.sha512), [pgp](https://downloads.apache.org/paimon/pypaimon-2.1.0/pypaimon-2.1.0.tar.gz.asc)) |
| 2.0.0   | 2026-08-07 | [tar](https://www.apache.org/dyn/closer.lua/paimon/pypaimon-2.0.0/pypaimon-2.0.0.tar.gz)               ([digest](https://downloads.apache.org/paimon/pypaimon-2.0.0/pypaimon-2.0.0.tar.gz.sha512),                [pgp](https://downloads.apache.org/paimon/pypaimon-2.0.0/pypaimon-2.0.0.tar.gz.asc)) |
| 1.4.2   | 2026-06-23 | [tar](https://www.apache.org/dyn/closer.lua/paimon/pypaimon-1.4.2/pypaimon-1.4.2.tar.gz)               ([digest](https://downloads.apache.org/paimon/pypaimon-1.4.2/pypaimon-1.4.2.tar.gz.sha512),                [pgp](https://downloads.apache.org/paimon/pypaimon-1.4.2/pypaimon-1.4.2.tar.gz.asc)) |

## Paimon Terraform

The Paimon Terraform provider manages Paimon REST Catalog databases, tables, and access policies with Terraform and OpenTofu. It is published as `apache/paimon` to the [OpenTofu Registry](https://search.opentofu.org/provider/apache/paimon/latest), and each [GitHub release](https://github.com/apache/terraform-provider-paimon/releases) carries signed provider binaries:

```hcl
terraform {
  required_providers {
    paimon = {
      source  = "apache/paimon"
      version = "0.1.0"
    }
  }
}
```

Until the provider is listed in the Terraform Registry, Terraform users can set `source = "registry.opentofu.org/apache/paimon"`.

The Apache source distribution is also available:

| RELEASE | DATE       | DOWNLOAD                                                                                                                                                                                                                                                                                                                                          |
|---------|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1.0   | 2026-10-21 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-terraform-0.1.0/apache-paimon-terraform-0.1.0-src.tgz) ([digest](https://downloads.apache.org/paimon/paimon-terraform-0.1.0/apache-paimon-terraform-0.1.0-src.tgz.sha512), [pgp](https://downloads.apache.org/paimon/paimon-terraform-0.1.0/apache-paimon-terraform-0.1.0-src.tgz.asc)) |

## Verify the Integrity of the Files

Verify the SHA-512 checksum (.sha512) and PGP signature (.asc) of each downloaded source archive. For more information why this must be done, please read [Verifying Apache Software Foundation Releases](https://www.apache.org/info/verification.html).

### Verify the hash digest

We use SHA-512 to verify the hash digest of the file.

To check a hash, you can first compute the SHA-512 checksum for the file you just downloaded, and then download the
digest file for comparison, they should be equal.

Compute the checksum of your file:
- Windows: certUtil -hashfile file SHA512
- Linux: sha512sum file
- Mac: shasum -a 512 file

### Verify the PGP signature

To verify the signature using GPG or PGP, please do the following:

1. Download the release artifact and the corresponding PGP signature from the table above.
2. Download the [Apache Paimon KEYS file](https://downloads.apache.org/paimon/KEYS).
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

### Flink

Please replace `${flink.version}` in the following xml file to the version of Flink you're using. For example, `1.20`.

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.paimon</groupId>
        <artifactId>paimon-flink-${flink.version}</artifactId>
        <version>2.1.0</version>
    </dependency>
</dependencies>
```

Also include `<dependency>` elements for any extension modules you need: `paimon-flink-cdc`, `paimon-flink-action`, and so forth.

### Spark

Replace `${spark.version}` with the Spark version you use and `${scala.binary.version}` with its Scala binary version. For example, use `3.5` and `2.12` for Spark 3.5, or `4.1` and `2.13` for Spark 4.1.

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.paimon</groupId>
        <artifactId>paimon-spark-${spark.version}_${scala.binary.version}</artifactId>
        <version>2.1.0</version>
    </dependency>
</dependencies>
```
