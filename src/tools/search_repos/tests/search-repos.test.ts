import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { Octokit } from "@octokit/rest";
import { searchRepos } from "../search-repos";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const searchBody = {
  total_count: 1,
  incomplete_results: false,
  items: [
    {
      name: "react",
      owner: { login: "facebook" },
      html_url: "https://github.com/facebook/react",
      description: "The library for web and native user interfaces.",
      language: "JavaScript",
      stargazers_count: 100,
      open_issues_count: 5,
      updated_at: "2026-10-01T00:00:00Z",
    },
  ],
};

describe("searchRepos", () => {
  let fetchSpy: MockInstance<typeof fetch>;
  let client: Octokit;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
    client = new Octokit();
  });

  it("returns mapped repos and sends the language query", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(200, searchBody));

    const result = await searchRepos(client, "javascript");

    expect(result).toEqual({
      status: "found",
      repos: [
        {
          owner: "facebook",
          repo: "react",
          url: "https://github.com/facebook/react",
          description: "The library for web and native user interfaces.",
          language: "JavaScript",
          stars: 100,
          openIssues: 5,
          updatedAt: "2026-10-01T00:00:00Z",
        },
      ],
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const url = new URL(String(fetchSpy.mock.calls[0][0]));
    expect(url.origin + url.pathname).toBe("https://api.github.com/search/repositories");
    expect(url.searchParams.get("q")).toBe('language:"javascript"');
    expect(url.searchParams.get("sort")).toBe("stars");
    expect(url.searchParams.get("per_page")).toBe("30");
  });

  it("returns an empty list when nothing matches", async () => {
    fetchSpy.mockResolvedValue(
      jsonResponse(200, { total_count: 0, incomplete_results: false, items: [] }),
    );

    expect(await searchRepos(client, "cobol")).toEqual({ status: "found", repos: [] });
  });

  it("returns an error when GitHub responds with an error", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(500, { message: "Server Error" }));

    const result = await searchRepos(client, "javascript");

    expect(result.status).toBe("error");
  });

  it("returns an error when the request itself fails", async () => {
    fetchSpy.mockRejectedValue(new Error("network down"));

    const result = await searchRepos(client, "javascript");

    expect(result.status).toBe("error");
  });
});
