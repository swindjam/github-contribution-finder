import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { octokit } from "../../shared/github";
import { getRepoIssue } from "./get-repo-issue";

export function registerGetRepoIssue(server: McpServer) {
  server.registerTool(
    "get_repo_issue",
    {
      description: "Get the details of a single issue in a GitHub repository.",
      inputSchema: z.object({
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue: z.number().describe("Issue number"),
      }),
    },
    async ({ owner, repo, issue }) => {
      const result = await getRepoIssue(octokit, owner, repo, issue);

      switch (result.status) {
        case "found":
          return { content: [{ type: "text", text: JSON.stringify(result.issue, null, 2) }] };
        case "not_found":
          return {
            content: [{ type: "text", text: `Issue ${owner}/${repo}#${issue} was not found.` }],
          };
        case "error":
          return {
            isError: true,
            content: [
              { type: "text", text: `Failed to fetch ${owner}/${repo}#${issue}: ${result.message}` },
            ],
          };
      }
    },
  );
}
