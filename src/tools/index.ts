import { McpServer } from "@modelcontextprotocol/server";
import { registerSearchRepos } from "./search_repos/index";
import { registerGetRepo } from "./get_repo/index";
import { registerSearchRepoIssues } from "./search_repo_issues/index";
import { registerGetRepoIssue } from "./get_repo_issue/index";

export function registerTools(server: McpServer) {
  registerSearchRepos(server);
  registerGetRepo(server);
  registerSearchRepoIssues(server);
  registerGetRepoIssue(server);
}
