import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("GITHUB_TOKEN is not set. Add it to your .env file (see .env.example).");
}

export const octokit = new Octokit({ auth: token });
