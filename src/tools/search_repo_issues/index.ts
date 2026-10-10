import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerSearchRepoIssues(server: McpServer) {
  server.registerTool(
    "search_repo_issues",
    {
      description: "List issues for a GitHub repository.",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        pageSize: z.number().describe("Number of issues to return"),
      },
    },
    async ({ owner, repo, pageSize }) => ({
      content: [
        { type: "text", text: `search_repo_issues not implemented (${owner}/${repo}, pageSize: ${pageSize})` },
      ],
    }),
  );
}
