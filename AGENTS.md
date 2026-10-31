# SchemaCraft - Agent Guidelines & Project Specification

## 1. Absolute Rule: File Size Limit
- **NO file may exceed 200 lines of code.** This is a strict constraint.
- Any file exceeding or nearing 200 lines must be decomposed into modular, single-responsibility files (e.g., hooks, subcomponents, utilities).

## 2. Project Overview & Branding
- **Name**: SchemaCraft (Visual ERD & API Docs Studio).
- **Branding Rule**: Do NOT use the name "eraser" anywhere in the app UI, branding, window titles, or user-facing text. Keep the folder name `eraser-offline` unchanged as requested.
- **Architecture**: Local-first desktop app built with Tauri v2 + React 19 + TypeScript + Vite + Tailwind CSS.

## 3. Core Features & User Requirements
1. **ERD Code Syntax & Monaco Editor**:
   - Parses table blocks: `tableName [icon: <name>, color: <color>] { field type modifiers }`.
   - Modifiers: `pk`, `fk`, `??`, `?`, `unique`, comments (`// ...`).
   - Relations: `TableA.col < TableB.col` (one-to-many), `>` (many-to-one), `-` (one-to-one), `<>` (many-to-many).
   - Built-in Monaco Editor with custom ERD language and theme for exact cursor positioning and real-time syntax highlighting.
   - **Sane Debouncing**: Live typing in the editor triggers diagram parsing and Dagre layout calculation with a 180ms debounce window (`useDebounce`), and disk saving debounced at 450ms, eliminating typing micro-stutters while keeping the canvas immediately responsive.
   - **Resizable Right Panel**: Interactive left drag handle allows smooth resizing of the editor panel between 320px and 75vw (default 480px) with persistent memory.

2. **Visual Canvas**:
   - Dark canvas (`#121316`) with subtle dot grid.
   - Table cards with colored borders matching theme.
   - Orthogonal Manhattan connectors with rounded corners, anchor connection dots, and cardinality markers (`1` and `*`).
   - Interactive zoom & pan, table dragging without zoom reset, auto-layout, and fit-to-screen.
   - **Click-to-editor jump**: Clicking any table card or field in the diagram opens the editor and jumps/scrolls directly to that table's or field's line in the code.
   - **Touchpad gesture control**: Touchpad pinch gestures scale the canvas diagram directly like the zoom buttons, while capture-phase preventDefault prevents the native window UI from zooming.

3. **Onboarding & Author Notes Tracking**:
   - Onboarding modal detects and confirms local Git credentials (`git config user.name` & `user.email`).
   - Right-click context menu on tables or fields allows adding documentation notes.
   - Notes are persisted in `<diagram>.notes.json` and tracked/committed with Git.
   - Visual note indicator badges appear on tables and fields when notes exist.
   - **Author-protected deletion**: Only the author who wrote a note can delete it.

4. **Export**:
   - High-resolution export (retina resolution, custom background, full diagram bounding box) with zero foreignObject dependencies to prevent browser security taint.

5. **Directory Workspace & Multi-File Architecture**:
   - User can point to ANY local directory.
   - Lists all active diagrams in the project sidebar.
   - Supports creating new diagram files, editing individual diagrams, or combining all diagrams into a unified cross-model ERD.

6. **Integrated Git Support**:
   - Switch local branches & create new branches from within the app.
   - Check working tree status (clean vs modified/untracked files).
   - Stage and commit changes with commit messages.
   - Review past commits: inspect commit history and view/preview schema at any historical commit.

7. **Cross-Platform Release & CI**:
   - Build scripts: `scripts/build-appimage.sh`, `scripts/build-windows.sh`, and `scripts/build-windows.bat`.
   - GitHub Actions workflow: `.github/workflows/build-and-release.yml` building Linux AppImage and Windows NSIS `.exe`.

8. **Testing**:
   - Unit tests for every component and utility.
