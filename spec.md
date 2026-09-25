# MCP Server Reference Project — Spec

## Goal

A small reference MCP server in TypeScript, paired with agent skills, to start future MCP projects from a known shape. The domain is GitHub, chosen because the API is open and easy to access, and the data is safe to work with in a public repo.

It should show:

- A server with several single-purpose tools
- Skills that chain those tools and refer to each other
- A skill that asks clarifying questions before acting
- A clean split: tools fetch and filter, the model judges

## Example prompt

> I'm looking to learn Go. What's a good open source repo to work on?

The agent asks about experience, other languages known, and the kind of project wanted (APIs, libraries, CLIs), then searches, reviews a shortlist, and recommends a few repos with starter issues and reasons.

## Tools

Each does one job. They return facts and filtered candidates, never a verdict on what is "good for a beginner".

- `search_repos`: find candidate repos using hard filters (language, activity, licence, size, labels)
- `review_repo`: return measurable signals about a repo (size, tests, contribution guide, PR responsiveness) so the skill can judge complexity
- `search_issues`: find candidate starter issues in a repo (good first issue label, unassigned, recent)
- `get_issue`: fetch one issue's full text and comments for closer reading
- `save_shortlist` (optional): write the final shortlist to a local file

## Skills

- `find-oss-contribution`: the entry point. Asks the clarifying questions, restates the answers as a short brief, runs the workflow and recommends three repos
- `assess-repo-fit`: how to judge a repo's complexity and health against the person's level, using the `review_repo` signals
- `assess-issue-quality`: how to tell whether an issue is well scoped, unclaimed and truly beginner-friendly, including spotting stale or mislabelled ones
- `shortlist-format`: the recommendation template and evidence rules, so output is consistent between runs

## Stack and evals

- TypeScript, with Octokit for the GitHub API and Vitest for ordinary tests
- Evals with Evalite, kept separate from the normal tests because they are slower, cost tokens and are not deterministic
- Evals run against a fake GitHub of synthetic repos and issues with deliberate traps built in. Live GitHub is for a small smoke test only

What the evals check:

- **Ask or skip:** a vague prompt gets clarifying questions, a specific one goes straight to searching
- **Tool use:** the right tools are called with the right filters
- **Grounding:** every repo and issue recommended appears in the tool results
- **Judgement (later):** trap cases such as a stale "good first issue", an archived repo, or a repo too big for a beginner

The first version checks the first turn only, with scripted user replies added later. The harness tests what the skills say, not whether a real client would trigger them.
