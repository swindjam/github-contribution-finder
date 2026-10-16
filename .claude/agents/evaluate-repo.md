---
name: evaluate-repo
description: Evaluates a specified Github repo for suitability based on the specified criteria
tools: 
    mcp__github-contribution-finder__get_repo, 
    mcp__github-contribution-finder__search_repo_issues, 
    mcp__github-contribution-finder__get_repo_issue, 
    Skill
model: sonnet
---

Your task is to evaluate a specified repo for suitability against the specified goal. 
Use the `evaluate-repo-suitability` skill to evaluate the repo.

If the repo is suitable, fetch issues for the repo using the `search_repo_issues` tool and use the 
`evaluate-repo-issue-suitability` skill to judge if an issue is suitable.
If you have found a suitable issue for the repo, do not continue checking for other repo issues.
If you have not found a suitable issue after the first 20 issues, stop checking this repo.

If the repo is not suitable, do not check for issues at all.

You should return if the repo is Suitable/Not suitable, along with a suitable issue (if the repo is suitable).