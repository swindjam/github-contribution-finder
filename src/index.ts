import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { registerTools } from "./tools/index";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Stateless: the factory runs once per request, so every call gets a fresh server.
const handler = createMcpHandler(() => {
  const server = new McpServer({
    name: "github-contribution-finder",
    version: "1.0.0",
  });

  registerTools(server);

  return server;
});

const app = createMcpExpressApp();
const nodeHandler = toNodeHandler(handler);

app.all("/mcp", (req, res) => void nodeHandler(req, res, req.body));

const httpServer = app.listen(PORT, () => {
  console.log(`MCP server listening on port ${PORT}`);
});

let shuttingDown = false;

function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`Received ${signal}, shutting down...`);
  httpServer.close((err) => {
    if (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
