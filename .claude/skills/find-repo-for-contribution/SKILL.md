---
name: find-repo-for-contribution
description: >-
   Based on the user's question, find a prioritised list of 3 Github repositories they could contribute to. 
  Ask qualifying questions to understand the users experience and stack familiarity.
    Use this skill when the user asks for a suggestion or to help find them a repo to contribute to. 
  This depends on the issue-evaluator-mcp server, which should be the sole source of information.
---

# Ask qualifying questions

Suitable repositories will depend on the user's knowledge. 
An experienced engineer can likely contribute to any repo in a known stack, but will benefit from a well documented repo in an unfamiliar stack.
A less experience engineer will benefit from a well documented repo regardless.

Ask a max of 3 clarifying questions such as:
- What is your experience level with <language>?
- What is your strongest language and how much experience do you have?

Skip any/all of these questions if the information is already given. 
E.g. "I am an experience Go engineer looking to contribute to Go projects" shares the experience and stack knowledge up front.

# Search for repos

Search for repos based on the context after asking clarifying questions. 
This should use the `search_repos` tool based on the context you have (e.g. language).

# Assess Repo Suitability

For the found repos, assess their suitability by fetching the repo details via the `get_repo` tool.
Use the `assess-repo-suitability` skill to evaluate the repo.

# Review Repo Issues

For the repos, fetch the currently open and unassigned issues via the `search_issues` tool.
Use the `assess-repo-issue-suitability` skill to judge how suitable each issue is.

Discard or shortlist the repo based on the review outcome. 
If you have found a suitable issue for the repo, don't check for other repo issues.
If you have found no suitable issue after the first 20, move on to other repos.

Once you have shortlisted 3 suitable repos, do not check for the remaining repos. 

# Format Response

Format the response of repos to the user. This should match:

Repo name [url]
Overview
Suggested Issue

Use this format for all 3 shortlisted repos and number them to show a priority.