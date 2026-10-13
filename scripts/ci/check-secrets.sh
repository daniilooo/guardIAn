#!/usr/bin/env bash
# Falha se houver arquivos .env versionados ou padrões de segredo conhecidos no repositório.
# Na Fase 3 os padrões passam a vir de packages/shared (fonte única, ADR-0007).
set -euo pipefail

status=0

envs=$(git ls-files | grep -E '(^|/)\.env(\..+)?$' | grep -vE '(^|/)\.env\.example$' || true)
if [ -n "$envs" ]; then
  echo "::error::Arquivos .env versionados:"; echo "$envs"; status=1
fi

patterns=(
  'sk-ant-[A-Za-z0-9_-]{20,}'                 # Anthropic
  'sk-(proj-)?[A-Za-z0-9_-]{32,}'             # OpenAI
  'gh[pousr]_[A-Za-z0-9]{36,}'                # GitHub token
  'github_pat_[A-Za-z0-9_]{40,}'              # GitHub fine-grained
  'AKIA[0-9A-Z]{16}'                          # AWS access key
  'AIza[0-9A-Za-z_-]{35}'                     # Google API key
  'xox[baprs]-[A-Za-z0-9-]{10,}'              # Slack
  'sk_live_[A-Za-z0-9]{24,}'                  # Stripe
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'        # Chave privada PEM
)
regex=$(printf '%s\n' "${patterns[@]}" | sed -E 's/[[:space:]]+#.*$//' | paste -sd'|')

hits=$(git ls-files -z | xargs -0 grep -nIE -- "$regex" -- 2>/dev/null | grep -v '^scripts/ci/check-secrets.sh:' || true)
if [ -n "$hits" ]; then
  # Mostra apenas arquivo:linha — nunca o valor (o log do CI é público).
  echo "::error::Possíveis segredos encontrados (arquivo:linha):"
  echo "$hits" | cut -d: -f1,2
  status=1
fi

[ $status -eq 0 ] && echo "Nenhum segredo ou .env versionado encontrado."
exit $status
