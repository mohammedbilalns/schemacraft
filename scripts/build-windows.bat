@echo off
echo ==============================================
echo  Building SchemaCraft Windows (.exe) Package  
echo ==============================================

if exist "%~dp0package.json" (
    cd /d "%~dp0"
) else (
    cd /d "%~dp0\.."
)

echo 1. Installing dependencies...
call pnpm install

echo 2. Running unit tests...
call pnpm test

echo 3. Building frontend...
call pnpm build

echo 4. Building Windows NSIS installer (.exe)...
call pnpm tauri build --bundles nsis

echo.
echo ==============================================
echo  Build Complete!
echo  Installer located in src-tauri\target\release\bundle\nsis\
echo ==============================================
pause
