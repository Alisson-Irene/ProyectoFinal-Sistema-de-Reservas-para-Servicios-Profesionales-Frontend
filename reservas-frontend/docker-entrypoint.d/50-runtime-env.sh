#!/bin/sh
set -eu

envsubst '${API_BASE_URL}' \
  < /usr/share/nginx/html/env.template.js \
  > /usr/share/nginx/html/env.js
