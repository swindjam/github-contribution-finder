import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { octokit } from "../../shared/github";
import { searchRepoIssues } from "./search-repo-issues";

export function registerSearchRepoIssues(server: McpServer) {
  server.registerTool(
    "search_repo_issues",
    {
      description: "List open issues for a GitHub repository. Pull requests are excluded.",
      inputSchema: z.object({
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        pageSize: z.number().int().min(1).max(100).describe("Number of issues per page"),
        page: z.number().int().min(1).describe("Page number, starting at 1"),
      }),
    },
    async ({ owner, repo, pageSize, page }) => {
      const result = await searchRepoIssues(octokit, owner, repo, pageSize, page);

      switch (result.status) {
        case "found":
          return { content: [{ type: "text", text: JSON.stringify(result.issues, null, 2) }] };
        case "not_found":
          return { content: [{ type: "text", text: `Repository ${owner}/${repo} was not found.` }] };
        case "error":
          return {
            isError: true,
            content: [{ type: "text", text: `Failed to fetch issues for ${owner}/${repo} (page ${page}): ${result.message}` }],
          };
      }
    },
  );
}
