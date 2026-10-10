import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";
import { Octokit } from "@octokit/rest";
import { getRepoIssue } from "../get-repo-issue";

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const githubIssue = {
  number: 42,
  title: "Fix typo in README",
  html_url: "https://github.com/facebook/react/issues/42",
  state: "open",
  body: "There is a typo in the README.",
  labels: [{ name: "good first issue" }, "documentation"],
  comments: 3,
  assignee: { login: "octocat" },
  created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-02T00:00:00Z",
};

describe("getRepoIssue", () => {
  let fetchSpy: MockInstance<typeof fetch>;
  let client: Octokit;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
    client = new Octokit();
  });

  it("returns mapped issue details and requests the right owner/repo/issue", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(200, githubIssue));

    const result = await getRepoIssue(client, "facebook", "react", 42);

    expect(result).toEqual({
      status: "found",
      issue: {
        number: 42,
        title: "Fix typo in README",
        url: "https://github.com/facebook/react/issues/42",
        state: "open",
        body: "There is a typo in the README.",
        labels: ["good first issue", "documentation"],
        comments: 3,
        assignee: "octocat",
        isPullRequest: false,
        createdAt: "2026-09-01T00:00:00Z",
        updatedAt: "2026-09-02T00:00:00Z",
      },
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe("https://api.github.com/repos/facebook/react/issues/42");
  });

  it("returns not_found when GitHub responds 404", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(404, { message: "Not Found" }));

    expect(await getRepoIssue(client, "facebook", "react", 999999)).toEqual({
      status: "not_found",
    });
  });

  it("returns an error when GitHub responds with a server error", async () => {
    fetchSpy.mockResolvedValue(jsonResponse(500, { message: "Server Error" }));

    const result = await getRepoIssue(client, "facebook", "react", 42);

    expect(result.status).toBe("error");
  });

  it("returns an error when the request itself fails", async () => {
    fetchSpy.mockRejectedValue(new Error("network down"));

    const result = await getRepoIssue(client, "facebook", "react", 42);

    expect(result.status).toBe("error");
  });
});
