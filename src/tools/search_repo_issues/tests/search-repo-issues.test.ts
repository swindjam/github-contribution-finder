import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { Octokit } from "@octokit/rest";
import { searchRepoIssues } from "../search-repo-issues";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const issuesBody = [
  {
    number: 42,
    title: "Fix typo in README",
    html_url: "https://github.com/facebook/react/issues/42",
    labels: [{ name: "good first issue" }, "documentation"],
    comments: 3,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    number: 43,
    title: "A pull request",
    html_url: "https://github.com/facebook/react/pull/43",
    labels: [],
    comments: 0,
    created_at: "2026-09-02T00:00:00Z",
    pull_request: { url: "https://api.github.com/repos/facebook/react/pulls/43" },
  },
];

describe("searchRepoIssues", () => {
  let fetchSpy: MockInstance<typeof fetch>;
  let client: Octokit;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
    client = new Octokit();
  });

  it("returns mapped issues, excludes pull requests, and sends owner/repo/pageSize/page", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(200, issuesBody));

    const result = await searchRepoIssues(client, "facebook", "react", 20, 2);

    expect(result).toEqual({
      status: "found",
      issues: [
        {
          number: 42,
          title: "Fix typo in README",
          url: "https://github.com/facebook/react/issues/42",
          labels: ["good first issue", "documentation"],
          comments: 3,
          createdAt: "2026-09-01T00:00:00Z",
        },
      ],
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const url = new URL(String(fetchSpy.mock.calls[0][0]));
    expect(url.origin + url.pathname).toBe("https://api.github.com/repos/facebook/react/issues");
    expect(url.searchParams.get("state")).toBe("open");
    expect(url.searchParams.get("per_page")).toBe("20");
    expect(url.searchParams.get("page")).toBe("2");
  });

  it("returns not_found when the repo does not exist", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(404, { message: "Not Found" }));

    expect(await searchRepoIssues(client, "nobody", "nothing", 20, 1)).toEqual({
      status: "not_found",
    });
  });

  it("returns an error when GitHub responds with a server error", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(500, { message: "Server Error" }));

    const result = await searchRepoIssues(client, "facebook", "react", 20, 2);

    expect(result.status).toBe("error");
  });

  it("returns an error when the request itself fails", async () => {
    fetchSpy.mockRejectedValue(new Error("network down"));

    const result = await searchRepoIssues(client, "facebook", "react", 20, 2);

    expect(result.status).toBe("error");
  });
});
