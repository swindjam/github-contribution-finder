import type { Octokit } from "@octokit/rest";

export interface RepoDetails {
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  topics: string[];
  license: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  sizeKb: number;
  archived: boolean;
  hasIssues: boolean;
  createdAt: string | null;
  pushedAt: string | null;
}

export type GetRepoResult =
  | { status: "found"; repo: RepoDetails }
  | { status: "not_found" }
  | { status: "error"; message: string };

export async function getRepo(
  client: Octokit,
  owner: string,
  repo: string,
): Promise<GetRepoResult> {
  try {
    const { data } = await client.repos.get({ owner, repo });

    return {
      status: "found",
      repo: {
        fullName: data.full_name,
        url: data.html_url,
        description: data.description,
        language: data.language,
        topics: data.topics ?? [],
        license: data.license?.spdx_id ?? null,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        sizeKb: data.size,
        archived: data.archived,
        hasIssues: data.has_issues,
        createdAt: data.created_at,
        pushedAt: data.pushed_at,
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
