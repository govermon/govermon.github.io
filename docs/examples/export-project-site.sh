#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROJECT_SLUG="${PROJECT_SLUG:-my-project}"
TARGET_DIR="${1:-$ROOT_DIR/.site-export/projects/$PROJECT_SLUG}"

mkdir -p "$TARGET_DIR"

cp "$ROOT_DIR/docs/index.html" "$TARGET_DIR/index.html"
cp "$ROOT_DIR/docs/site.css" "$TARGET_DIR/site.css"
cp "$ROOT_DIR/docs/site-status.json" "$TARGET_DIR/site-status.json"
cp "$ROOT_DIR/docs/live-app.html" "$TARGET_DIR/live-app.html"
cp "$ROOT_DIR/docs/project.json" "$TARGET_DIR/project.json"

printf 'Exported project site bundle to %s\n' "$TARGET_DIR"