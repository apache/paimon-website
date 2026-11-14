#!/usr/bin/env bash
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -euo pipefail

source_dir=$(realpath "$1")
destination=$(realpath -m "$2")
staging=$(mktemp -d)
trap 'rm -rf "$staging"' EXIT

cd "$source_dir"
git checkout --quiet main
cp docs/source/_static/versions.json "$staging/versions.json"

# Use full release labels to find release-X.Y branches. The stable switcher
# identifier is empty; archived identifiers contain only the major.minor series.
# Write the plan separately so malformed metadata fails before any build starts.
python3 - "$staging/versions.json" > "$staging/plan" <<'PY'
import json
import re
import sys

with open(sys.argv[1]) as stream:
    versions = json.load(stream)
base_url = "https://paimon.apache.org/docs/cpp/"
assert len(versions) >= 2, "Expected main and stable documentation entries"
main, stable, *archives = versions
assert main["version"] == "main" and main["url"] == base_url + "main/"
match = re.fullmatch(r"(\d+\.\d+)\.\d+ \(stable\)", stable["name"])
assert match and stable["version"] == "" and stable.get("preferred") is True
assert stable["url"] == base_url
stable_series = match.group(1)
# Build stable first because it occupies the root of the staged tree.
print(f"stable\trelease-{stable_series}\t.")
print("main\tmain\tmain")
seen = {stable_series}
for entry in archives:
    match = re.fullmatch(r"(\d+\.\d+)\.\d+", entry["name"])
    assert match, f"Invalid archived release label: {entry!r}"
    series = match.group(1)
    assert series not in seen, f"Duplicate release series: {series}"
    assert entry["version"] == series and entry["url"] == base_url + series + "/"
    seen.add(series)
    print(f"{series}\trelease-{series}\t{series}")
PY

# Check every required branch before starting. Publishing a partial tree would
# leave the shared version dropdown pointing at missing documentation.
while IFS=$'\t' read -r channel branch path; do
    git rev-parse --verify "refs/remotes/origin/$branch" >/dev/null
done < "$staging/plan"

while IFS=$'\t' read -r channel branch path; do
    git checkout --quiet "$branch"
    python3 -m pip install -r docs/requirements.txt
    rm -rf apidoc/xml docs/_build
    (cd apidoc && doxygen)
    (cd docs && PAIMON_DOCS_VERSION="$channel" make html)
    mkdir -p "$staging/html/$path"
    cp -a docs/_build/html/. "$staging/html/$path/"
    # Keep each built copy consistent with the shared list from main, even if
    # an older release branch still contains legacy version metadata.
    cp "$staging/versions.json" "$staging/html/$path/_static/versions.json"
    git reset --hard HEAD
    git clean -fdx
done < "$staging/plan"

# Replace only after all versions succeed. This also removes obsolete versions
# without deleting Sphinx's _static, _sources or generated page directories.
mkdir -p "$(dirname "$destination")"
rm -rf "$destination"
mv "$staging/html" "$destination"
