@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js first: https://nodejs.org/
    if not defined M3U8_NO_PAUSE pause
    exit /b 1
)

rem Yarn 3 defaults to PnP, electron-builder needs node_modules
set YARN_NODE_LINKER=node-modules

rem Mirrors for users in China; remove these lines if you use a proxy / VPN
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
set FFMPEG_BINARIES_URL=https://npmmirror.com/mirrors/ffmpeg-static

if not exist "node_modules\electron\package.json" (
    echo [1/2] Installing dependencies with Yarn 3...
    call node .yarn\releases\yarn-3.5.1.cjs install
    if errorlevel 1 (
        echo [ERROR] Dependency installation failed.
        if not defined M3U8_NO_PAUSE pause
        exit /b 1
    )
) else (
    echo [1/2] Dependencies already installed, skip.
)

rem electron-builder cannot delete files that are in use by a running app
powershell -NoProfile -Command "$found = $false; try { foreach ($p in Get-Process -Name M3U8-Downloader -ErrorAction SilentlyContinue) { if ($p.Path -like '*\dist\win-unpacked\*') { $found = $true } } } catch { }; if ($found) { exit 1 } else { exit 0 }"
if errorlevel 1 (
    echo [ERROR] The app is running from "dist\win-unpacked". Please close it and run this script again.
    if not defined M3U8_NO_PAUSE pause
    exit /b 1
)

echo [2/2] Building Windows package...
call node_modules\.bin\electron-builder.cmd --win --publish never
if errorlevel 1 (
    echo [ERROR] Build failed.
    if not defined M3U8_NO_PAUSE pause
    exit /b 1
)

echo.
echo Build completed. Artifacts in the "dist" folder:
dir /b dist\*.exe dist\*.zip
echo.
if not defined M3U8_NO_PAUSE pause
endlocal
