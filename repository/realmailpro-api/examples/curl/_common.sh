#!/usr/bin/env bash
# Shared settings. Export REALMAILPRO_API_KEY in your shell or CI secret store — never hard-code it.
set -euo pipefail
: "${REALMAILPRO_API_KEY:?Set REALMAILPRO_API_KEY first}"
BASE_URL="${REALMAILPRO_BASE_URL:-https://realmailpro.online/api/public/v1}"
