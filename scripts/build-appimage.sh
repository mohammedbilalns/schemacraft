#!/usr/bin/env bash
set -euo pipefail

echo "=============================================="
echo " Building SchemaCraft Linux AppImage Package  "
echo "=============================================="

# Ensure we are in project root or eraser-offline
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../eraser-offline" && pwd)"

cd "${PROJECT_ROOT}"

echo "1. Checking dependencies..."
if ! command -v pnpm &> /dev/null; then
  echo "Error: pnpm is required. Please install pnpm."
  exit 1
fi

if ! command -v cargo &> /dev/null; then
  echo "Error: cargo/Rust is required. Please install Rust."
  exit 1
fi

echo "2. Installing dependencies..."
pnpm install

echo "3. Running unit tests..."
pnpm test

echo "4. Building frontend..."
pnpm build

echo "5. Building Tauri AppImage bundle..."
pnpm tauri build --bundles appimage

echo ""
echo "=============================================="
echo " Build Complete! "
echo " AppImage located in: ${PROJECT_ROOT}/src-tauri/target/release/bundle/appimage/"
echo "=============================================="
