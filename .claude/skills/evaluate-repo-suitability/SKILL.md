---
name: evaluate-repo-suitability
description: Evaluate a Github repo's suitability based on the specified goal
---

Assess the repo as a whole, based on raw metrics. Fetch the repo details using the `get_repo` tool.

Use the repo metrics to evaluate if the repo is suitable. 
E.g. for a beginner a poorly documented repo is unlikely to be suitable, nor is a very complex repo.

Return a verdict of Suitable/Not suitable for the repo. 