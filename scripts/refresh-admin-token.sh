#!/usr/bin/env bash
# Refresh the backend admin JWT stored in .admin-token (used by the unattended
# /seo-update run for /api/admin/analytics/*). Tokens last 30 days; the backend's
# POST /api/admin/refresh-token swaps a valid — or recently expired (<=14 days) —
# token for a fresh one *without* the admin password, so this can run unattended.
#
# Usage: scripts/refresh-admin-token.sh [path/to/.admin-token]
# Env:   NEXT_PUBLIC_API_URL (optional) — backend base URL.
# Exit:  0 refreshed · 1 refresh rejected (log in again) · 2 no token file
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOKEN_FILE="${1:-$ROOT/.admin-token}"
API="${NEXT_PUBLIC_API_URL:-https://parties247-backend.onrender.com}"
API="${API%/}"

if [ ! -f "$TOKEN_FILE" ]; then
  echo "No token file at $TOKEN_FILE." >&2
  echo "Bootstrap once with the admin password:" >&2
  echo "  curl -s -X POST $API/api/admin/login -H 'Content-Type: application/json' -d '{\"password\":\"...\"}' | sed -n 's/.*\"token\":\"\\([^\"]*\\)\".*/\\1/p' > $TOKEN_FILE" >&2
  exit 2
fi

TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"
RESPONSE="$(curl -sS --max-time 60 -w $'\n%{http_code}' -X POST "$API/api/admin/refresh-token" \
  -H "Authorization: Bearer $TOKEN")"
STATUS="${RESPONSE##*$'\n'}"
BODY="${RESPONSE%$'\n'*}"

if [ "$STATUS" != "200" ]; then
  echo "Refresh rejected (HTTP $STATUS): $BODY" >&2
  echo "The token is past the 14-day refresh grace window — log in again (see bootstrap above)." >&2
  exit 1
fi

NEW_TOKEN="$(printf '%s' "$BODY" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')"
if [ -z "$NEW_TOKEN" ]; then
  echo "Refresh returned 200 but no token: $BODY" >&2
  exit 1
fi

umask 077
printf '%s' "$NEW_TOKEN" > "$TOKEN_FILE.tmp"
mv "$TOKEN_FILE.tmp" "$TOKEN_FILE"
EXPIRES="$(printf '%s' "$BODY" | sed -n 's/.*"expiresAt":"\([^"]*\)".*/\1/p')"
echo "Admin token refreshed${EXPIRES:+ (expires $EXPIRES)}."
