import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import worker from "../worker.js";

const root = new URL("..", import.meta.url).pathname;
const publicDir = join(root, "public");
const port = Number.parseInt(process.argv[2] || process.env.PORT || "8792", 10);
const env = {
  APP_ENV: "local",
  OPENAI_MODEL: "gpt-4.1-nano",
  OPENAI_GENERATION_MODEL: "gpt-4.1-nano",
  OPENAI_EXPLAIN_MODEL: "gpt-4.1-nano",
  ...loadDevVars(join(root, ".dev.vars"))
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

createServer(async (incoming, response) => {
  try {
    const url = new URL(incoming.url || "/", `http://${incoming.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      const body = await readBody(incoming);
      const request = new Request(url, {
        method: incoming.method,
        headers: incoming.headers,
        body: body.length ? body : undefined
      });
      const workerResponse = await worker.fetch(request, env);
      response.writeHead(workerResponse.status, Object.fromEntries(workerResponse.headers.entries()));
      response.end(Buffer.from(await workerResponse.arrayBuffer()));
      return;
    }

    const filePath = safePublicPath(url.pathname);
    const finalPath = existsSync(filePath) ? filePath : join(publicDir, "index.html");
    const content = await readFile(finalPath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(finalPath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(content);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Unknown server error");
  }
}).listen(port, "127.0.0.1", () => {
  const aiStatus = env.OPENAI_API_KEY ? "OpenAI enabled" : "OpenAI demo mode";
  console.log(`Chinese Reading Coach dev server: http://localhost:${port} (${aiStatus})`);
});

function loadDevVars(path) {
  if (!existsSync(path)) return {};
  const text = readFileSync(path, "utf8");
  const vars = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    vars[match[1]] = stripQuotes(match[2].trim());
  }
  return vars;
}

function stripQuotes(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function safePublicPath(pathname) {
  const clean = pathname === "/" ? "/index.html" : pathname;
  const normalized = normalize(join(publicDir, decodeURIComponent(clean)));
  if (!normalized.startsWith(publicDir)) {
    return join(publicDir, "index.html");
  }
  return normalized;
}

function readBody(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
