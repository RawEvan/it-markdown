#!/usr/bin/env bash

set -e

REPO_URL="https://github.com/RawEvan/it-markdown.git"
INSTALL_DIR="${HOME}/.it-markdown"
SKILL_NAME="it-markdown"

# Detect AI tool directory
if [ -d ".claude" ]; then
    SKILL_DIR=".claude/skills/${SKILL_NAME}"
elif [ -d ".trae" ]; then
    SKILL_DIR=".trae/skills/${SKILL_NAME}"
else
    # Default to .claude
    SKILL_DIR=".claude/skills/${SKILL_NAME}"
fi

echo "Installing it-markdown skill..."

# 1. Clone or update repo
if [ -d "${INSTALL_DIR}/.git" ]; then
    echo "Updating it-markdown..."
    git -C "${INSTALL_DIR}" pull --quiet
else
    echo "Cloning it-markdown..."
    git clone --depth 1 "${REPO_URL}" "${INSTALL_DIR}"
fi

# 2. Install dependencies
echo "Installing dependencies..."
cd "${INSTALL_DIR}"
if ! [ -d "node_modules" ]; then
    npm install --silent
fi
if ! [ -d "it-md-notepad/node_modules" ]; then
    cd it-md-notepad && npm install --silent
fi

# 3. Install skill to current project
echo "Installing skill to ${SKILL_DIR}..."
mkdir -p "$(dirname "${SKILL_DIR}")"

# Remove old link if exists
if [ -L "${SKILL_DIR}" ]; then
    rm "${SKILL_DIR}"
fi

# Create relative symlink
ln -sf "${INSTALL_DIR}/skills/${SKILL_NAME}" "${SKILL_DIR}"

echo ""
echo "✅ it-markdown skill installed successfully!"
echo ""
echo "Skill location: ${SKILL_DIR}"
echo "Editor location: ${INSTALL_DIR}/it-md-notepad"
echo ""
echo "Usage:"
echo "  node ${INSTALL_DIR}/it-md-notepad/bin/it-md-notepad.mjs <file.md>"
echo ""
echo "Or ask your AI assistant:"
echo "  'Open this markdown file in the editor'"
