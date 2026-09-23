#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
FILE="${1:-}"
[[ -f "$FILE" ]] || { echo "ERRO: backup não encontrado: $FILE" >&2; exit 1; }
[[ -f .env ]] || { echo "ERRO: .env não encontrado." >&2; exit 1; }
set -a; source .env; set +a

echo "ATENÇÃO: a restauração substituirá os dados atuais do banco ${POSTGRES_DB}."
read -r -p "Digite RESTAURAR para continuar: " CONFIRM
[[ "$CONFIRM" == "RESTAURAR" ]] || { echo "Restauração cancelada."; exit 1; }

SAFETY_BACKUP="$(bash scripts/backup.sh)"
echo "Backup de segurança criado: $SAFETY_BACKUP"
gzip -t "$FILE"
gzip -dc "$FILE" | docker compose exec -T db psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$POSTGRES_DB"
echo "Restauração concluída. Reiniciando a aplicação."
docker compose restart app
