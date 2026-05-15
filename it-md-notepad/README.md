# it-md-notepad

The default interactive Markdown editor for [it-markdown](https://github.com/evanw/it-markdown). Edit Markdown on the left, see live interactive preview on the right, and save back to disk.

## Features

- **Live preview** — Edit Markdown source and see instant rendered output
- **Interactive widgets** — Sliders, checkboxes, radio buttons, tabs, collapsible sections
- **File I/O** — Open and save `.md` files directly from the editor
- **Portable** — Single Node.js script, no build step required for the server
- **AI-friendly** — Designed for use with Claude Code and other AI coding assistants

## Installation

```bash
# From the it-markdown repo
npm install
cd it-md-notepad && npm install
```

Or run directly:

```bash
node it-md-notepad/bin/it-md-notepad.mjs notes.md
```

## Usage

```bash
# Start with empty document
node it-md-notepad/bin/it-md-notepad.mjs

# Open a file
node it-md-notepad/bin/it-md-notepad.mjs notes.md

# Use specific port
node it-md-notepad/bin/it-md-notepad.mjs -p 3000 notes.md

# Show help
node it-md-notepad/bin/it-md-notepad.mjs --help
```

When the server starts, it prints a URL like `http://localhost:3456`. Open it in your browser to start editing.

## AI Assistant Integration

it-md-notepad is designed to work seamlessly with AI coding assistants like Claude Code:

1. The AI launches `it-md-notepad file.md`
2. The user edits the file interactively in the browser
3. The user clicks **Save**
4. The AI reads the updated file and continues

This workflow is perfect for:
- Interactive documentation editing
- Form-based data collection
- Visual configuration tuning
- Collaborative content creation

## Widget Syntax

it-md-notepad uses [it-markdown](https://github.com/evanw/it-markdown) syntax for interactive widgets:

```markdown
## Slider

[Brightness](!slider:min=0,max=100,value=50,id=brightness)

## Checkbox

[Options](!checkbox:options=A|B|C,id=opts)

## Radio

[Color](!radio:options=Red|Green|Blue,id=color)

## Tabs

[!tab:First]
Tab 1 content

[!tab:Second]
Tab 2 content

## Collapsible

[!collapse:Details]
Hidden content here
```

## License

MIT
