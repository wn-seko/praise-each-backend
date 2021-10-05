#!/bin/bash
set -eu

SCRIPT_DIR=$(cd $(dirname "${0}") && pwd)
REVISION=$(git show -s --format=%H | cut -c 1-7)

LATEST_TAG="${APP_REPOSITORY}:latest"
REVISION_TAG="${APP_REPOSITORY}:${REVISION}"

docker build -t ${LATEST_TAG} -f Dockerfile.app.prod .
docker tag ${LATEST_TAG} ${REVISION_TAG}
docker push ${LATEST_TAG}
docker rmi ${LATEST_TAG} ${REVISION_TAG}
