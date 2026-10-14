import type { Octokit } from "@octokit/rest";

export interface IssueSummary {
  number: number;
  title: string;
  url: string;
  labels: string[];
  comments: number;
  createdAt: string;
}

export type SearchRepoIssuesResult =
  | { status: "found"; issues: IssueSummary[] }
  | { status: "not_found" }
  | { status: "error"; message: string };

export async function searchRepoIssues(
  client: Octokit,
  owner: string,
  repo: string,
  pageSize: number,
  page: number,
): Promise<SearchRepoIssuesResult> {
  try {
    const { data } = await client.issues.listForRepo({
      owner,
      repo,
      state: "open",
      per_page: pageSize,
      page,
    });

    return {
      status: "found",
      issues: data
        .filter((item) => !item.pull_request)
        .map((item) => ({
          number: item.number,
          title: item.title,
          url: item.html_url,
          labels: item.labels.map((label) =>
            typeof label === "string" ? label : (label.name ?? ""),
          ),
          comments: item.comments,
          createdAt: item.created_at,
        })),
    };
  } catch (error) {
    if ((error as { status?: number }).status === 404) {
      return { status: "not_found" };
    }
    const message = error instanceof Error ? error.message : String(error);
    return { status: "error", message };
  }
}
