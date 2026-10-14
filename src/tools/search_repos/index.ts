import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { octokit } from "../../shared/github";
import { searchRepos } from "./search-repos";

export function registerSearchRepos(server: McpServer) {
  server.registerTool(
    "search_repos",
    {
      description: "Search GitHub repositories by programming language.",
      inputSchema: z.object({
        language: z.string().describe("Programming language, e.g. 'typescript'"),
      }),
    },
    async ({ language }) => {
      const result = await searchRepos(octokit, language);

      switch (result.status) {
        case "found":
          return { content: [{ type: "text", text: JSON.stringify(result.repos, null, 2) }] };
        case "error":
          return {
            isError: true,
            content: [{ type: "text", text: `Failed to search repositories: ${result.message}` }],
          };
      }
    },
  );
}
