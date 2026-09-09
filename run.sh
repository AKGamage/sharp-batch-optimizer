#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
#  Image Converter — macOS / Linux launcher
#  Double-click (macOS .command) or run: bash run.sh
# ──────────────────────────────────────────────────────────────

set -e

# cd to script directory (works for both .sh and .command)
cd "$(dirname "$0")"

echo ""
echo "============================================================"
echo "   Image Converter — Setup & Run"
echo "============================================================"
echo ""

# ─── Check Node.js ────────────────────────────────────────────
if ! command -v node &> /dev/null; then
    echo "  ERROR: Node.js is not installed."
    echo ""
    echo "  Install it from https://nodejs.org"
    echo "  or via your package manager:"
    echo "    macOS:  brew install node"
    echo "    Ubuntu: sudo apt install nodejs npm"
    echo ""
    read -rp "  Press Enter to exit..."
    exit 1
fi

NODE_VER=$(node -v)
echo "  Node.js ${NODE_VER} detected."

# ─── Check npm ────────────────────────────────────────────────
if ! command -v npm &> /dev/null; then
    echo "  ERROR: npm is not available. Please reinstall Node.js."
    echo ""
    read -rp "  Press Enter to exit..."
    exit 1
fi

# ─── Check input folder ──────────────────────────────────────
if [ ! -d "input" ]; then
    echo "  ERROR: input/ folder not found."
    echo "  Create an input/ folder and add your images."
    echo ""
    read -rp "  Press Enter to exit..."
    exit 1
fi

# ─── Install dependencies if needed ──────────────────────────
if [ ! -d "node_modules/sharp" ]; then
    echo ""
    echo "  Installing dependencies..."
    echo ""

    if [ ! -f "package.json" ]; then
        npm init -y
    fi

    npm install sharp

    if [ $? -ne 0 ]; then
        echo ""
        echo "  ERROR: Failed to install sharp. Check your internet connection."
        echo ""
        read -rp "  Press Enter to exit..."
        exit 1
    fi

    echo ""
    echo "  Dependencies installed successfully."
    echo ""
else
    echo "  Dependencies already installed."
fi

# ─── Run the converter ───────────────────────────────────────
echo ""
node convert.js

echo ""
read -rp "  Press Enter to exit..."
