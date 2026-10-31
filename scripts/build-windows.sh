#!/usr/bin/env bash
set -euo pipefail

echo "=============================================="
echo " Building SchemaCraft Windows (.exe) Package  "
echo "=============================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${SCRIPT_DIR}/../package.json" ]; then
  PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
else
  PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../eraser-offline" && pwd)"
fi

cd "${PROJECT_ROOT}"

echo "1. Checking prerequisites..."
if ! command -v pnpm &> /dev/null; then
  echo "Error: pnpm is required. Please install pnpm."
  exit 1
fi

echo "2. Installing dependencies..."
pnpm install

echo "3. Building frontend..."
pnpm build

echo "4. Building Windows NSIS installer (.exe)..."
pnpm tauri build --bundles nsis

echo ""
echo "=============================================="
echo " Build Complete! "
echo " Windows .exe located in: ${PROJECT_ROOT}/src-tauri/target/release/bundle/nsis/"
echo "=============================================="
