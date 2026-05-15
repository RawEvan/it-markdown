---
name: "it-markdown"
description: "Launch the it-md-notepad interactive Markdown editor for visual editing of .md files. Invoke when the user wants to edit, preview, or interactively modify a markdown file with widgets (sliders, checkboxes, tabs, etc.), or when asked to open a visual editor for markdown content."
---

# it-markdown Skill

## Overview

`it-markdown` provides an interactive Markdown editing workflow through `it-md-notepad` — a lightweight web-based editor with live preview and interactive widgets (sliders, checkboxes, radio buttons, tabs, collapsible sections).

## When to Invoke

- User asks to "edit markdown visually", "open markdown editor", or "preview markdown interactively"
- User wants to create or modify a `.md` file with interactive widgets
- User needs a GUI for editing markdown instead of raw text manipulation
- User says "open this file in notepad", "show me a preview", or "let me edit interactively"

## Prerequisites

- Node.js >= 20
- `it-md-notepad` must be available at `it-md-notepad/` (relative to the it-markdown repo root)

## Default Editor: it-md-notepad

The built-in `it-md-notepad` editor is the primary tool for interactive markdown editing. It is located at `it-md-notepad/` in the repo root.

### Launch it-md-notepad with a file

```bash
# From the it-markdown repo root
node it-md-notepad/bin/it-md-notepad.mjs /absolute/path/to/file.md
```

The server will print a URL like `http://localhost:3456`.

### For development (with hot reload)

```bash
cd it-md-notepad && npm install && npm run dev
```

### Open in browser

Provide the URL to the user or open it automatically if a browser command is available.

## File I/O API

The it-md-notepad server exposes a simple REST API for file operations:

- **GET** `/api/file?path=/absolute/path/to/file.md` — Read file content
- **POST** `/api/file` with JSON body `{ path, content }` — Write file content

## AI Assistant Workflow

```
1. AI generates or identifies a markdown file
2. AI launches: node it-md-notepad/bin/it-md-notepad.mjs <file>
3. AI tells user the URL to open in browser
4. User edits interactively and clicks Save
5. AI reads the updated file from disk and continues
```

## Interactive Widget Syntax

it-md-notepad supports it-markdown widget syntax:

```markdown
[Label](!slider:min=0,max=100,value=50,id=brightness)
[Label](!checkbox:options=A|B|C,id=opts)
[Label](!radio:options=Red|Green|Blue,id=color)
[!tab:Tab Name]
Tab content here
[!collapse:Title]
Collapsible content
```

## Example: Complete Session

```bash
# Step 1: Create a markdown file with widgets
cat > /tmp/demo.md << 'EOF'
# Interactive Demo

[Rate this](!slider:min=1,max=10,value=5,id=rating)

[Features](!checkbox:options=Fast|Reliable|Easy to use,id=features)

[Choose one](!radio:options=Option A|Option B|Option C,id=choice)
EOF

# Step 2: Launch it-md-notepad
node it-md-notepad/bin/it-md-notepad.mjs /tmp/demo.md

# Step 3: Server prints URL — user opens it in browser
# Step 4: User edits and saves
# Step 5: AI reads /tmp/demo.md to get updated content
```

## Alternative: Rust Native Editor

For a native desktop experience, there is also a Rust/egui version:

```bash
cd examples/md-notepad-rust && cargo run --release -- /path/to/file.md
```

This version does not require Node.js but has the same interactive markdown capabilities.

## Notes

- The server uses a random available port by default. Use `--port` to specify one.
- Files are read/written using absolute paths. Relative paths are resolved against `process.cwd()`.
- The server serves static files from the `it-md-notepad/` directory.
- CORS is enabled for all origins.
