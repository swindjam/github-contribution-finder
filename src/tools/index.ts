import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchRepos } from "./search_repos/index.js";
import { registerGetRepo } from "./get_repo/index.js";
import { registerSearchRepoIssues } from "./search_repo_issues/index.js";
import { registerGetRepoIssue } from "./get_repo_issue/index.js";

export function registerTools(server: McpServer) {
  registerSearchRepos(server);
  registerGetRepo(server);
  registerSearchRepoIssues(server);
  registerGetRepoIssue(server);
}
