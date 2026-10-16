Github Contribution Finder
-----

This is a small demo project to showcase the use of MCP tools, agent skills and subagents, working in unison to achieve a goal.

This is designed to work on the basis of finding a repo to contribute to, based on user input. 
The main skill is `find-repo-for-contribution` which triggers usage of the MCP server tools and the other skills and subagent.

Example starting prompt to trigger the skills and tools:

> find me a github repo to contribute to

The flow of this after the prompt is:

`find-repo-for-contribution (skill) -> search_repos (mcp tool) -> evaluate-repo (subagent)`

And inside the subagent
`evaluate-repo-suitability / evaluate-repo-issue-suitability (skills) + get_repo / search_repo_issues / get_repo_issue (mcp tools)`


Getting started
---

Add the MCP server to your local agent (e.g. Claude)
`claude mcp add --transport http github-contribution-finder http://localhost:3000/mcp`

Create a `.env` file, based off `.env.example`. This requires a `GITHUB_TOKEN`.

Then start the app

`npm run dev`

Testing
----

To run the tests
`npm test`

To run the inspector for manual testing of the tools
`npm run inspector`

