#!/usr/bin/env bash
# GET /account/balance — free.
source "$(dirname "$0")/_common.sh"
curl -sS "$BASE_URL/account/balance" -H "Authorization: Bearer $REALMAILPRO_API_KEY"
