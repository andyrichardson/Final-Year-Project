#!/bin/bash
CWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$CWD/api.sh -t
$CWD/auth.sh -t
$CWD/neo4j.sh -t
$CWD/web.sh -t
