---
name: find-repo-for-contribution
description: >-
   Based on the user's question, find a prioritised list of 3 Github repositories they could contribute to. 
  Ask qualifying questions to understand the users experience and stack familiarity.
    Use this skill when the user asks for a suggestion or to help find them a repo to contribute to. 
  This depends on the github-contribution-finder server, which should be the sole source of information.
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

From these questions, create a goal to satisfy them. E.g. "Find a Go repo suitable for an experienced engineer who is new to Go"

# Search for repos

Search for repos based on the context after asking clarifying questions. 
This should use the `search_repos` tool based on the context you have (e.g. language).

# Assess Repo Suitability

For the found repos, evaluate their suitability via the `evaluate-repo` subagent.
Check the repos in parallel with a batch size of 5 to speed up processing and provide the defined goal to the subagent.
Discard or shortlist the repo based on the review outcome.
If you have not found 3 suitable repos in a batch, send the next batch of repos to the subagents.
If you have found more than 3 suitable repos in a batch, judge them and filter to only have 3 repos.

Once you have found 3 suitable repos, do not continue checking repo suitability.

# Format Response

Format the response of repos to the user. This should match:

Repo name [url]
Overview
Suggested Issue

Use this format for all 3 shortlisted repos and number them to show a priority, with the most suitable repo listed first.