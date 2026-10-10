import type { Octokit } from "@octokit/rest";

export interface RepoIssueDetails {
  number: number;
  title: string;
  url: string;
  state: string;
  body: string | null;
  labels: string[];
  comments: number;
  assignee: string | null;
  isPullRequest: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetRepoIssueResult =
  | { status: "found"; issue: RepoIssueDetails }
  | { status: "not_found" }
  | { status: "error"; message: string };

export async function getRepoIssue(
  client: Octokit,
  owner: string,
  repo: string,
  issue: number,
): Promise<GetRepoIssueResult> {
  try {
    const { data } = await client.issues.get({ owner, repo, issue_number: issue });

    return {
      status: "found",
      issue: {
        number: data.number,
        title: data.title,
        url: data.html_url,
        state: data.state,
        body: data.body ?? null,
        labels: data.labels.map((label) => (typeof label === "string" ? label : (label.name ?? ""))),
        comments: data.comments,
        assignee: data.assignee?.login ?? null,
        isPullRequest: Boolean(data.pull_request),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    };
  } catch (error) {
    if ((error as { status?: number }).status === 404) {
      return { status: "not_found" };
    }
    const message = error instanceof Error ? error.message : String(error);
    return { status: "error", message };
  }
}
