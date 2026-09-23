#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
[[ -f .env ]] || { echo "ERRO: arquivo .env não encontrado." >&2; exit 1; }
set -a; source .env; set +a

BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TARGET="$BACKUP_DIR/coonto_${POSTGRES_DB}_${STAMP}.sql.gz"

docker compose exec -T db pg_dump --clean --if-exists --no-owner --no-privileges -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip -9 > "$TARGET"
gzip -t "$TARGET"
find "$BACKUP_DIR" -type f -name 'coonto_*.sql.gz' -mtime "+${BACKUP_RETENTION_DAYS:-30}" -delete
echo "$TARGET"
