import * as vscode from "vscode";
import { renderImdToHtml } from "it-markdown";

/**
 * Get extension configuration
 * @returns {import("it-markdown").RenderHtmlOptions}
 */
function getConfig() {
  const config = vscode.workspace.getConfiguration("itMarkdown");
  return {
    safeMode: config.get("safeMode", true),
    staticOnly: config.get("staticOnly", false),
    groupTabs: config.get("groupTabs", true),
  };
}

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("it-markdown.previewHtml", () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "markdown") {
        vscode.window.showWarningMessage("Open a Markdown (.md) file first.");
        return;
      }

      const text = editor.document.getText();
      const options = getConfig();
      const html = renderImdToHtml(text, options);

      const panel = vscode.window.createWebviewPanel(
        "itmarkdownPreview",
        "it-markdown preview",
        vscode.ViewColumn.Beside,
        { enableScripts: !options.staticOnly },
      );

      panel.webview.html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", system-ui, "Ubuntu", "Droid Sans", sans-serif;
  font-size: 14px;
  line-height: 1.5;
  padding: 0 20px;
  max-width: 900px;
  margin: 0 auto;
  color: var(--vscode-foreground);
  background-color: var(--vscode-editor-background);
}
.itm-widget { margin: 1em 0; }
.itm-button { padding: 6px 16px; cursor: pointer; }
.itm-slider { width: 100%; }
.itm-radio-group, .itm-checkbox-group { display: flex; flex-direction: column; gap: 8px; }
.itm-tabs { border: 1px solid var(--vscode-panel-border); border-radius: 4px; }
.itm-tab-list { display: flex; border-bottom: 1px solid var(--vscode-panel-border); }
.itm-tab { padding: 8px 16px; cursor: pointer; border: none; background: transparent; color: var(--vscode-foreground); }
.itm-tab-active { background: var(--vscode-tab-activeBackground); border-bottom: 2px solid var(--vscode-tab-activeBorder); }
.itm-tab-panel { padding: 16px; }
.itm-collapse { border: 1px solid var(--vscode-panel-border); border-radius: 4px; }
.itm-collapse summary { padding: 8px 16px; cursor: pointer; font-weight: 500; }
.itm-collapse div { padding: 0 16px 16px; }
</style>
</head>
<body>${html}</body>
</html>`;
    }),

    vscode.commands.registerCommand("it-markdown.toggleStaticOnly", async () => {
      const config = vscode.workspace.getConfiguration("itMarkdown");
      const current = config.get("staticOnly", false);
      await config.update("staticOnly", !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Static Only Mode: ${!current ? "Enabled" : "Disabled"}`);
    }),
  );
}

export function deactivate() {}
