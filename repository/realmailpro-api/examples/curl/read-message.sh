#!/usr/bin/env bash
# GET /messages/{id} — 3 credits. Usage: ./read-message.sh MESSAGE_ID
source "$(dirname "$0")/_common.sh"
: "${1:?Usage: read-message.sh MESSAGE_ID}"
curl -sS "$BASE_URL/messages/$1" -H "Authorization: Bearer $REALMAILPRO_API_KEY"
