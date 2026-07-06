#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"

PUBLIC_PAGES=(
  "index.html"
  "barriles.html"
  "cervezas.html"
  "chopera.html"
  "contacto.html"
  "merch.html"
  "sobre-nosotros.html"
)

DETAIL_PAGES=(
  "cervezas/amber.html"
  "cervezas/apacalipsis.html"
  "cervezas/blonde.html"
  "cervezas/ipa.html"
  "cervezas/porter.html"
)

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/cervezas"

for page in "${PUBLIC_PAGES[@]}"; do
  cp "$ROOT_DIR/$page" "$DIST_DIR/$page"
done

for page in "${DETAIL_PAGES[@]}"; do
  cp "$ROOT_DIR/$page" "$DIST_DIR/$page"
done

cp -R "$ROOT_DIR/css" "$DIST_DIR/css"
cp -R "$ROOT_DIR/js" "$DIST_DIR/js"

while IFS= read -r asset_path; do
  mkdir -p "$DIST_DIR/$(dirname "$asset_path")"
  cp "$ROOT_DIR/$asset_path" "$DIST_DIR/$asset_path"
done < <(
  perl -nE '
    while (/(?:src|href)="([^"]+)"/g) {
      my $path = $1;
      next unless $path =~ m{^(?:\.\./)?assets/};
      $path =~ s{^\.\./}{};
      $path =~ s{[?#].*$}{};
      say $path;
    }
  ' "${PUBLIC_PAGES[@]/#/$ROOT_DIR/}" "${DETAIL_PAGES[@]/#/$ROOT_DIR/}" | sort -u
)

find "$DIST_DIR" -name '.DS_Store' -delete
