import * as vscode from "vscode";
import { renderImdToHtml } from "it-markdown";

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
      const html = renderImdToHtml(text, { safeMode: true, staticOnly: false });
      const panel = vscode.window.createWebviewPanel(
        "itmarkdownPreview",
        "it-markdown preview",
        vscode.ViewColumn.Beside,
        { enableScripts: false },
      );
      panel.webview.html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`;
    }),
  );
}
