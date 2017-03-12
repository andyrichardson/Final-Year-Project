#!/bin/bash
CWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

sudo $CWD/api.sh -t
sudo $CWD/auth.sh -t
sudo $CWD/neo4j.sh -t
sudo $CWD/web.sh -d
