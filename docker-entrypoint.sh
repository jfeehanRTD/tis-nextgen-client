#!/bin/sh
set -e

# Default to localhost:8082 for ACI container group (shared localhost networking)
export TIS_API_UPSTREAM="${TIS_API_UPSTREAM:-http://localhost:8082}"

echo "TIS API upstream: ${TIS_API_UPSTREAM}"

# Substitute environment variables in nginx config
envsubst '${TIS_API_UPSTREAM}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
