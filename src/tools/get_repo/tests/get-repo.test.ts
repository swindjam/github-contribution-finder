import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";
import { Octokit } from "@octokit/rest";
import { getRepo } from "../get-repo";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("getRepo", () => {
  let fetchSpy: MockInstance<typeof fetch>;
  let client: Octokit;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
    client = new Octokit();
  });

  it("returns mapped repo details and requests the right owner/repo", async () => {
    const githubRepo = {
      full_name: "facebook/react",
      html_url: "https://github.com/facebook/react",
      description: "The library for web and native user interfaces.",
      language: "JavaScript",
      topics: ["javascript", "ui"],
      license: { spdx_id: "MIT" },
      stargazers_count: 100,
      forks_count: 20,
      open_issues_count: 5,
      size: 1234,
      archived: false,
      has_issues: true,
      created_at: "2013-05-24T16:15:54Z",
      pushed_at: "2026-10-01T00:00:00Z",
    };
    fetchSpy.mockResolvedValue(jsonResponse(200, githubRepo));

    const result = await getRepo(client, "facebook", "react");

    expect(result).toEqual({
      status: "found",
      repo: {
        fullName: "facebook/react",
        url: "https://github.com/facebook/react",
        description: "The library for web and native user interfaces.",
        language: "JavaScript",
        topics: ["javascript", "ui"],
        license: "MIT",
        stars: 100,
        forks: 20,
        openIssues: 5,
        sizeKb: 1234,
        archived: false,
        hasIssues: true,
        createdAt: "2013-05-24T16:15:54Z",
        pushedAt: "2026-10-01T00:00:00Z",
      },
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe("https://api.github.com/repos/facebook/react");
  });

  it("returns not_found when GitHub responds 404", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(404, { message: "Not Found" }));

    expect(await getRepo(client, "nobody", "nothing")).toEqual({ status: "not_found" });
  });

  it("returns an error when GitHub responds with a server error", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(500, { message: "Server Error" }));

    const result = await getRepo(client, "facebook", "react");

    expect(result.status).toBe("error");
  });

  it("returns an error when the request itself fails", async () => {
    fetchSpy.mockRejectedValue(new Error("network down"));

    const result = await getRepo(client, "facebook", "react");

    expect(result.status).toBe("error");
  });
});
