import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { octokit } from "../../shared/github";
import { getRepo } from "./get-repo";

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
    async ({ owner, repo }) => {
      const result = await getRepo(octokit, owner, repo);

      switch (result.status) {
        case "found":
          return { content: [{ type: "text", text: JSON.stringify(result.repo, null, 2) }] };
        case "not_found":
          return { content: [{ type: "text", text: `Repository ${owner}/${repo} was not found.` }] };
        case "error":
          return {
            isError: true,
            content: [{ type: "text", text: `Failed to fetch ${owner}/${repo}: ${result.message}` }],
          };
      }
    },
  );
}
