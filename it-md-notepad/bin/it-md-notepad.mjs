#!/usr/bin/env node

/**
 * it-md-notepad - The default interactive Markdown editor for it-markdown.
 *
 * Usage:
 *   it-md-notepad [file.md]           Open the given markdown file
 *   it-md-notepad --port 3000         Use a specific port
 *   it-md-notepad --help              Show help
 *
 * This script starts a Vite dev server with custom API endpoints
 * for reading/writing markdown files.
 */

import { createServer } from "vite";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = { port: 0, file: null, help: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--port" || arg === "-p") {
      args.port = parseInt(argv[++i], 10) || 0;
    } else if (!arg.startsWith("-")) {
      args.file = arg;
    }
  }
  return args;
}

function showHelp() {
  console.log(`
it-md-notepad - Interactive Markdown Editor

Usage:
  it-md-notepad [options] [file.md]

Options:
  -p, --port <number>   Server port (default: random available port)
  -h, --help            Show this help message

Examples:
  it-md-notepad                    Start with empty document
  it-md-notepad notes.md           Open notes.md
  it-md-notepad -p 3000 notes.md   Use port 3000
`);
}

// Check if it-markdown is built
function checkDependencies() {
  const distPath = path.resolve(rootDir, "..", "dist", "index.js");
  if (!existsSync(distPath)) {
    console.error("❌ it-markdown module not found. Please run 'npm run build' first.");
    return false;
  }
  return true;
}

async function resolveFilePath(inputPath) {
  if (!inputPath) return null;
  if (path.isAbsolute(inputPath)) return inputPath;
  return path.resolve(process.cwd(), inputPath);
}

async function startServer(args) {
  console.log("🚀 Starting it-md-notepad...\n");

  const server = await createServer({
    root: rootDir,
    server: {
      port: args.port,
      open: false,
    },
    resolve: {
      alias: {
        "it-markdown": path.resolve(rootDir, ".."),
      },
    },
    plugins: [
      {
        name: "it-md-notepad-api",
        configureServer(server) {
          server.middlewares.use("/api/file", async (req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");

            if (req.method === "OPTIONS") {
              res.statusCode = 204;
              res.end();
              return;
            }

            const url = new URL(req.url, `http://${req.headers.host}`);
            const filePath = url.searchParams.get("path") || "";
            const targetPath = await resolveFilePath(filePath);

            if (req.method === "GET") {
              try {
                const content = await fs.readFile(targetPath, "utf-8");
                res.setHeader("Content-Type", "text/plain");
                res.statusCode = 200;
                res.end(content);
              } catch (err) {
                res.statusCode = 404;
                res.end(`File not found: ${filePath}`);
              }
              return;
            }

            if (req.method === "POST") {
              let body = "";
              for await (const chunk of req) body += chunk;
              try {
                const { path: savePath, content } = JSON.parse(body);
                const target = await resolveFilePath(savePath);
                const parentDir = path.dirname(target);
                await fs.mkdir(parentDir, { recursive: true });
                await fs.writeFile(target, content, "utf-8");
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify({ ok: true, path: target }));
              } catch (err) {
                res.statusCode = 500;
                res.end(`Error: ${err.message}`);
              }
              return;
            }

            res.statusCode = 405;
            res.end("Method not allowed");
          });
        },
      },
    ],
  });

  await server.listen();

  const addr = server.httpServer.address();
  const port = typeof addr === "object" ? addr?.port : addr;
  const url = `http://localhost:${port}`;

  console.log(`✅ it-md-notepad is running at ${url}\n`);

  if (args.file) {
    const fileUrl = `${url}?file=${encodeURIComponent(args.file)}`;
    console.log(`📄 Open file: ${fileUrl}\n`);
  }

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🔴 Stopping server...");
    server.close().then(() => {
      process.exit(0);
    });
  });
}

const args = parseArgs(process.argv);

if (args.help) {
  showHelp();
  process.exit(0);
}

if (!checkDependencies()) {
  process.exit(1);
}

startServer(args).catch((err) => {
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});
