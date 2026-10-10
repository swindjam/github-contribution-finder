import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerGetRepo(server: McpServer) {
  server.registerTool(
    "get_repo",
    {
      description: "Get details for a GitHub repository.",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
      },
    },
    async ({ owner, repo }) => ({
      content: [{ type: "text", text: `get_repo not implemented (${owner}/${repo})` }],
    }),
  );
}
