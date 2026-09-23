#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
mkdir -p support
REPORT="support/coonto-support-report-$(date -u +%Y%m%dT%H%M%SZ).txt"

{
  echo "COONTO SUPPORT REPORT"
  echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "Kit version: $(cat VERSION 2>/dev/null || echo unknown)"
  echo
  echo "== SYSTEM =="
  uname -a
  [[ -r /etc/os-release ]] && sed -n '1,12p' /etc/os-release
  echo
  echo "== RESOURCES =="
  command -v free >/dev/null && free -h
  df -h "$ROOT_DIR"
  echo
  echo "== DOCKER =="
  docker --version 2>&1 || true
  docker compose version 2>&1 || true
  docker compose ps 2>&1 || true
  echo
  echo "== CONFIGURATION PRESENCE (NO VALUES) =="
  if [[ -f .env ]]; then
    sed -n 's/^\([A-Z0-9_]*\)=.*/\1=SET/p' .env | sort
  else
    echo ".env missing"
  fi
  echo
  echo "== DNS =="
  if [[ -f .env ]]; then
    DOMAIN="$(sed -n 's/^DOMAIN=//p' .env | tr -d '\"' | head -1)"
    echo "Domain: $DOMAIN"
    getent ahostsv4 "$DOMAIN" 2>&1 | head -10 || true
  fi
  echo
  echo "== LOCAL HEALTH =="
  APP_PORT="$(sed -n 's/^APP_PORT=//p' .env 2>/dev/null | tr -d '\"' | head -1)"
  curl -fsS --max-time 10 "http://127.0.0.1:${APP_PORT:-3100}/api/health" 2>&1 || true
  echo
  echo "== CADDY =="
  CADDYFILE="$(sed -n 's/^CADDYFILE=//p' .env 2>/dev/null | tr -d '\"' | head -1)"
  CADDY_SERVICE="$(sed -n 's/^CADDY_SERVICE=//p' .env 2>/dev/null | tr -d '\"' | head -1)"
  caddy version 2>&1 || true
  systemctl is-active "${CADDY_SERVICE:-caddy}" 2>&1 || true
  caddy validate --config "${CADDYFILE:-/etc/caddy/Caddyfile}" --adapter caddyfile 2>&1 || true
  echo
  echo "== APP LOGS (LAST 200 LINES) =="
  docker compose logs --no-color --tail=200 app 2>&1 || true
  echo
  echo "== DATABASE LOGS (LAST 100 LINES) =="
  docker compose logs --no-color --tail=100 db 2>&1 || true
} > "$REPORT"

# Redação defensiva de padrões que podem aparecer acidentalmente em logs.
sed -i -E 's/(postgresql:\/\/[^:]+:)[^@]+@/\1[REDACTED]@/g; s/(password|secret|token|code)=([^[:space:]]+)/\1=[REDACTED]/Ig' "$REPORT"
chmod 600 "$REPORT"
echo "$ROOT_DIR/$REPORT"
