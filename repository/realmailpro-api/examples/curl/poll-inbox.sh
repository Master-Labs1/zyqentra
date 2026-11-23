#!/usr/bin/env bash
# GET /inboxes/{id}/messages — 3 credits. Usage: ./poll-inbox.sh INBOX_ID
source "$(dirname "$0")/_common.sh"
: "${1:?Usage: poll-inbox.sh INBOX_ID}"
curl -sS "$BASE_URL/inboxes/$1/messages" -H "Authorization: Bearer $REALMAILPRO_API_KEY"
