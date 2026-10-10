import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerGetRepoIssue(server: McpServer) {
  server.registerTool(
    "get_repo_issue",
    {
      description: "Get the details of a single issue in a GitHub repository.",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue: z.number().describe("Issue number"),
      },
    },
    async ({ owner, repo, issue }) => ({
      content: [{ type: "text", text: `get_repo_issue not implemented (${owner}/${repo}#${issue})` }],
    }),
  );
}
