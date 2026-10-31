# SchemaCraft 📐

> Local-first desktop studio for building API documentation and data models using code-driven Entity Relationship Diagrams (ERD).

Built with **Tauri v2**, **React 19**, **TypeScript**, **Monaco Editor**, and **Tailwind CSS**.

---

## ✨ Features

- **Code-Driven ERDs**: Define models with intuitive SchemaCraft syntax: `tableName [icon: user, color: blue] { field type modifiers }` and `table1.col < table2.col`.
- **Integrated Monaco Editor**: Real-time syntax highlighting for tables, attributes, fields, types, and relations. Accurate cursor tracking with 180ms debounced graph parsing.
- **Interactive Canvas**: Obsidian dark theme, auto-layout powered by Dagre, Manhattan orthogonal connectors with rounded corners and cardinality badges (`1` and `*`).
- **Click-to-Code Jump**: Click any table card or column row to open the editor and jump directly to its definition line.
- **Resizable Right Panel**: Smooth drag-to-resize splitter between 320px and 75vw with persistent local storage.
- **Author-Tracked Diagram Notes**: Right-click any table or field to attach documentation notes. Persisted in `<diagram>.notes.json` and tracked by Git. Author-protected deletion.
- **Git Integration**: Built-in branch switching, branch creation, commit staging, commit history review, and automatic author detection.
- **High-Res Export**: Retina-sharp PNG and SVG export with on-screen notification displaying the exact output path.
- **Local-First Workspaces**: Point to any local directory and manage multiple diagram files (`.erd`, `.md`).

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                      SchemaCraft                       │
├──────────────────────────┬─────────────────────────────┤
│   Tauri Rust Backend     │   React 19 Frontend         │
│   (src-tauri/)           │   (src/)                    │
├──────────────────────────┼─────────────────────────────┤
│ • Native Git CLI wrapper │ • Monaco Editor (ERD Lang)  │
│ • Local FS operations    │ • SVG Canvas & Dagre Layout │
│ • PNG rasterization save │ • Notes & Git State Hooks   │
│ • Webview configurations │ • Tailwind & Lucide Icons   │
└──────────────────────────┴─────────────────────────────┘
```

- **Strict Code Limit**: Every file across the codebase is under **200 lines**.
- **Data Persistence**: Plain text files (`.erd`, `.md`) and JSON files (`.notes.json`).

---

## 🚀 Installation & Prerequisites

### Prerequisites

- **Node.js**: v20 or newer
- **pnpm**: v9 or v10 (`npm i -g pnpm`)
- **Rust**: stable toolchain (`rustup default stable`)

#### Linux System Dependencies (Ubuntu / Debian / Arch):
```bash
# Ubuntu / Debian
sudo apt-get update && sudo apt-get install -y \
  libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf build-essential curl wget file

# Arch Linux
sudo pacman -S --needed webkit2gtk-4.1 base-devel curl wget
```

---

## 💻 Development

```bash
# 1. Install dependencies
pnpm install

# 2. Run unit tests
pnpm test

# 3. Start the desktop app in development mode
pnpm tauri dev
```

---

## 📦 Building & Distribution

### Linux AppImage
```bash
pnpm run build:appimage
# Or run the script:
./scripts/build-appimage.sh
```
*Output: `src-tauri/target/release/bundle/appimage/*.AppImage`*

### Windows Installer (.exe)
```bash
pnpm run build:windows
# Or on Windows cmd:
scripts\build-windows.bat
```
*Output: `src-tauri/target/release/bundle/nsis/*-setup.exe`*

### GitHub Actions CI/CD
Automated builds are configured in `.github/workflows/build-and-release.yml` to compile and publish Linux AppImages and Windows installers on every push or tag release.

---

## 🧪 Testing

```bash
pnpm test
```
Runs 18 test suites containing **40 unit tests** via Vitest covering the parser, layout router, Monaco editor, notes system, canvas, and Git integration.

---

## 📄 License

MIT License.
