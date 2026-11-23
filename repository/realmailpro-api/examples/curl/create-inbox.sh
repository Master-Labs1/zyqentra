#!/usr/bin/env bash
# POST /inboxes — 1 credit (alias) or 3 credits (original). Usage: ./create-inbox.sh [service]
source "$(dirname "$0")/_common.sh"
SERVICE="${1:-gmail_alias}"
curl -sS -X POST "$BASE_URL/inboxes" \
  -H "Authorization: Bearer $REALMAILPRO_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"service\":\"$SERVICE\"}"
