import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerSearchRepos(server: McpServer) {
  server.registerTool(
    "search_repos",
    {
      description: "Search GitHub repositories by programming language.",
      inputSchema: {
        language: z.string().describe("Programming language, e.g. 'typescript'"),
      },
    },
    async ({ language }) => ({
      content: [{ type: "text", text: `search_repos not implemented (language: ${language})` }],
    }),
  );
}
