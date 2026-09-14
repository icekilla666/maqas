#!/usr/bin/env bash
# Run on the server before replacing the running containers.
set -euo pipefail
cd "$(dirname "$0")/.."

for tool in docker openssl; do
  command -v "$tool" >/dev/null || { echo "Missing command: $tool" >&2; exit 1; }
done

for file in .env backend/.env deploy/certs/fullchain.pem deploy/certs/privkey.pem; do
  test -s "$file" || { echo "Missing or empty file: $file" >&2; exit 1; }
done

docker compose config --quiet
openssl x509 -in deploy/certs/fullchain.pem -noout -checkend 0
openssl verify -purpose sslserver -verify_hostname maqas.ru \
  -untrusted deploy/certs/fullchain.pem deploy/certs/fullchain.pem

certificate_key=$(openssl x509 -in deploy/certs/fullchain.pem -pubkey -noout \
  | openssl pkey -pubin -outform DER | openssl dgst -sha256)
private_key=$(openssl pkey -in deploy/certs/privkey.pem -passin pass: -pubout -outform DER \
  | openssl dgst -sha256)

if [ "$certificate_key" != "$private_key" ]; then
  echo "The certificate does not match the private key." >&2
  exit 1
fi

# Creates a temporary container without publishing ports or restarting services.
docker compose run --rm --no-deps nginx nginx -t
echo "Certificate and nginx configuration checks passed. Running services were not restarted."
