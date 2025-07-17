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
| 1.2.0   | 2025-07-16 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-1.2.0/apache-paimon-1.2.0-src.tgz)               ([digest](https://downloads.apache.org/paimon/paimon-1.2.0/apache-paimon-1.2.0-src.tgz.sha512),                [pgp](https://downloads.apache.org/paimon/paimon-1.2.0/apache-paimon-1.2.0-src.tgz.asc)) |                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 1.1.1   | 2025-05-16 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-1.1.1/apache-paimon-1.1.1-src.tgz)               ([digest](https://downloads.apache.org/paimon/paimon-1.1.1/apache-paimon-1.1.1-src.tgz.sha512),                [pgp](https://downloads.apache.org/paimon/paimon-1.1.1/apache-paimon-1.1.1-src.tgz.asc)) |                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 1.0.1   | 2025-02-10 | [tar](https://www.apache.org/dyn/closer.lua/paimon/paimon-1.0.1/apache-paimon-1.0.1-src.tgz)               ([digest](https://downloads.apache.org/paimon/paimon-1.0.1/apache-paimon-1.0.1-src.tgz.sha512),                [pgp](https://downloads.apache.org/paimon/paimon-1.0.1/apache-paimon-1.0.1-src.tgz.asc)) |                                                                                                                                                                                                                                                                                                                                                                                                                                            |

To download a source distribution for a particular release, click on the *tar* link.

For security, hash and signature files are always hosted at [Apache](https://downloads.apache.org/).

All Paimon releases are available via https://archive.apache.org/dist/paimon/ including checksums and signatures.

## Verify the Integrity of the Files

You must verify the integrity of the downloaded file using the PGP signature (.asc file) or a hash (.sha256; .md5 for older releases). For more information why this must be done, please read [Verifying Apache Software Foundation Releases](https://www.apache.org/info/verification.html).

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

Please replace `${flink.version}` in the following xml file to the version of Flink you're using. For example, `1.17` or `1.18`.

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.paimon</groupId>
        <artifactId>paimon-flink-${flink.version}</artifactId>
        <version>1.1.0</version>
    </dependency>
</dependencies>
```

Also include `<dependency>` elements for any extension modules you need: `paimon-flink-cdc`, `paimon-flink-action`, and so forth.

### Spark

Please replace `${spark.version}` in the following xml file to the version of Flink you're using. For example, `3.4` or `3.5`.

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.paimon</groupId>
        <artifactId>paimon-spark-${spark.version}</artifactId>
        <version>1.1.0</version>
    </dependency>
</dependencies>
```
