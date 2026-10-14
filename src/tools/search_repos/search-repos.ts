import type { Octokit } from "@octokit/rest";

export interface RepoSummary {
  owner: string | null;
  repo: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  openIssues: number;
  updatedAt: string;
}

export type SearchReposResult =
  | { status: "found"; repos: RepoSummary[] }
  | { status: "error"; message: string };

export async function searchRepos(
  client: Octokit,
  language: string,
): Promise<SearchReposResult> {
  try {
    const { data } = await client.search.repos({
      q: `language:"${language.replace(/"/g, "")}"`,
      sort: "stars",
      order: "desc",
      per_page: 30,
    });

    return {
      status: "found",
      repos: data.items.map((item) => ({
        owner: item.owner?.login ?? null,
        repo: item.name,
        url: item.html_url,
        description: item.description,
        language: item.language,
        stars: item.stargazers_count,
        openIssues: item.open_issues_count,
        updatedAt: item.updated_at,
      })),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: "error", message };
  }
}
