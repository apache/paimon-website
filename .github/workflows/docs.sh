#!/usr/bin/env bash
################################################################################
#  Licensed to the Apache Software Foundation (ASF) under one
#  or more contributor license agreements.  See the NOTICE file
#  distributed with this work for additional information
#  regarding copyright ownership.  The ASF licenses this file
#  to you under the Apache License, Version 2.0 (the
#  "License"); you may not use this file except in compliance
#  with the License.  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
# limitations under the License.
################################################################################
set -e

mvn --version
java -version
javadoc -J-version

# setup hugo
HUGO_REPO=https://github.com/gohugoio/hugo/releases/download/v0.80.0/hugo_extended_0.80.0_Linux-64bit.tar.gz
HUGO_ARTIFACT=hugo_extended_0.80.0_Linux-64bit.tar.gz
if ! curl --fail -OL $HUGO_REPO ; then
	echo "Failed to download Hugo binary"
	exit 1
fi
tar -zxvf $HUGO_ARTIFACT
git submodule update --init --recursive
# generate docs into docs/target
./hugo -v --source docs --destination target
if [ $? -ne 0 ]; then
	echo "Error building the docs"
	exit 1
fi

# build Paimon; required for Javadoc step
mvn -T 2C -B clean install -DskipTests -Pflink1,spark3

# build java/scala docs
mkdir -p docs/target/api
mvn javadoc:aggregate -B -pl "!paimon-e2e-tests" -Ppaimon-website-javadoc \
    -DadditionalJOption="-Xdoclint:none --allow-script-in-comments" \
    -Dmaven.javadoc.failOnError=false \
    -Dcheckstyle.skip=true \
    -Dspotless.check.skip=true \
    -Denforcer.skip=true \
    -Dheader="<a href=\"http://paimon.apache.org/\" target=\"_top\"><h1>Back to Paimon Website</h1></a> <script>var _paq=window._paq=window._paq||[];_paq.push([\"disableCookies\"]),_paq.push([\"setDomains\",[\"*.paimon.apache.org\"]]),_paq.push([\"trackPageView\"]),_paq.push([\"enableLinkTracking\"]),function(){var u=\"//matomo.privacy.apache.org/\";_paq.push([\"setTrackerUrl\",u+\"matomo.php\"]),_paq.push([\"setSiteId\",\"1\"]);var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s)}();</script>"
mv target/site/apidocs docs/target/api/java
