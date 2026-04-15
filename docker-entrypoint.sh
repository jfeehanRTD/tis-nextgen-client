#!/bin/sh
set -e

# Default to localhost:8082 for ACI container group (shared localhost networking)
export TIS_API_UPSTREAM="${TIS_API_UPSTREAM:-http://localhost:8082}"

echo "TIS API upstream: ${TIS_API_UPSTREAM}"

# Generate htpasswd file from environment variables
# AUTH_USERS format: "user1:pass1,user2:pass2"
# Falls back to default POC credentials if not set
AUTH_USERS="${AUTH_USERS:-tisadmin:tisng2026}"

echo "Configuring basic auth users..."
: > /etc/nginx/.htpasswd

echo "$AUTH_USERS" | tr ',' '\n' | while IFS=: read -r user pass; do
  if [ -n "$user" ] && [ -n "$pass" ]; then
    htpasswd -b /etc/nginx/.htpasswd "$user" "$pass"
  fi
done

echo "Auth configured for $(wc -l < /etc/nginx/.htpasswd) user(s)"

# Substitute environment variables in nginx config
envsubst '${TIS_API_UPSTREAM}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
