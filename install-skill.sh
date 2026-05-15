#!/usr/bin/env bash

set -e

REPO_URL="https://github.com/RawEvan/it-markdown.git"
INSTALL_DIR="${HOME}/.it-markdown"
SKILL_NAME="it-markdown"

# Detect AI tool directory (global)
if [ -d "$HOME/.claude" ]; then
    SKILL_DIR="$HOME/.claude/skills/${SKILL_NAME}"
elif [ -d "$HOME/.trae" ]; then
    SKILL_DIR="$HOME/.trae/skills/${SKILL_NAME}"
else
    # Default to claude
    SKILL_DIR="$HOME/.claude/skills/${SKILL_NAME}"
fi

echo "=== Installing it-markdown skill ==="

# 1. Clone or update repo
if [ -d "${INSTALL_DIR}/.git" ]; then
    echo "[1/4] Updating it-markdown..."
    if git -C "${INSTALL_DIR}" pull --quiet; then
        echo "  ✅ Repository updated"
    else
        echo "  ❌ Failed to update repository"
        exit 1
    fi
else
    echo "[1/4] Cloning it-markdown..."
    if git clone --depth 1 "${REPO_URL}" "${INSTALL_DIR}"; then
        echo "  ✅ Repository cloned"
    else
        echo "  ❌ Failed to clone repository"
        exit 1
    fi
fi

# 2. Install dependencies
echo "[2/4] Installing dependencies..."
cd "${INSTALL_DIR}"

if [ ! -d "node_modules" ]; then
    if npm install --silent; then
        echo "  ✅ Main dependencies installed"
    else
        echo "  ❌ Failed to install main dependencies"
        exit 1
    fi
else
    echo "  ✅ Main dependencies already installed"
fi

if [ ! -d "it-md-notepad/node_modules" ]; then
    cd it-md-notepad
    if npm install --silent; then
        echo "  ✅ Editor dependencies installed"
    else
        echo "  ❌ Failed to install editor dependencies"
        exit 1
    fi
    cd "${INSTALL_DIR}"
else
    echo "  ✅ Editor dependencies already installed"
fi

# 3. Build project
echo "[3/4] Building project..."
if npm run build; then
    echo "  ✅ Build successful"
else
    echo "  ❌ Build failed"
    exit 1
fi

# 4. Install skill link
echo "[4/4] Installing skill link..."
mkdir -p "$(dirname "${SKILL_DIR}")"

if [ -L "${SKILL_DIR}" ]; then
    rm "${SKILL_DIR}"
fi

ln -sf "${INSTALL_DIR}/skills/${SKILL_NAME}" "${SKILL_DIR}"
echo "  ✅ Skill link created"

echo ""
echo "=== Installation Complete ==="
echo ""
echo "Skill location: ${SKILL_DIR}"
echo "Editor location: ${INSTALL_DIR}/it-md-notepad"
echo ""
echo "Usage:"
echo "  node ${INSTALL_DIR}/it-md-notepad/bin/it-md-notepad.mjs <file.md>"
echo ""
echo "Or ask your AI assistant:"
echo "  'Open this markdown file in the editor'"
