# github-contribution-finder

MCP server (MCP TypeScript SDK v2: `@modelcontextprotocol/server`, `/express`, `/node`; stateless, one `McpServer` per request) that exposes GitHub lookups as tools for the `evaluate-repo` agent and the skills in `.claude/`.

## Tools

Tool names are snake_case and match `.claude/agents/evaluate-repo.md`. Each tool lives in its own snake_case directory under `src/tools/` and is registered from `src/tools/index.ts`.

| Tool | Params |
|---|---|
| `search_repos` | `language: string` |
| `get_repo` | `owner: string`, `repo: string` |
| `search_repo_issues` | `owner: string`, `repo: string`, `pageSize: number`, `page: number` |
| `get_repo_issue` | `owner: string`, `repo: string`, `issue: number` |

## Tool structure

Follow the `get_repo` / `get_repo_issue` pattern:

- `src/tools/<tool>/<tool-name>.ts`: the logic, as a function that takes the Octokit client as its first argument (dependency injection). Do not import `src/shared/github.ts` here.
- `src/tools/<tool>/index.ts`: thin MCP registration only. Defines the zod input schema (wrapped in `z.object({...})`), calls the logic function with the shared `octokit`, and maps the result to MCP content.
- `src/tools/<tool>/tests/<tool-name>.test.ts`: vitest tests.
- The logic function wraps the request in try/catch and returns a discriminated union: `found`, `not_found` (GitHub 404) or `error` (anything else).
- In the registration, `not_found` is a normal text result. `error` sets `isError: true`.
- The shared client lives in `src/shared/github.ts` and reads `GITHUB_TOKEN`. Keep `.env.example` in step with any new env vars.

## Testing

- Use vitest (`npm test`).
- Put tests in a `tests/` subdirectory next to the code under test (`src/tools/<tool>/tests/<tool-name>.test.ts`), not alongside the source files. Import the code under test from the parent directory (`from "../<tool-name>"`).
- Use the real `Octokit` class. Do not mock the octokit module.
- Spy on `globalThis.fetch` with `vi.spyOn` so the full request flow runs, and assert the URL that was requested.
- Cover success, 404, a server error, and a failed request.

## Build and modules

- The project is native ESM (`"type": "module"`). `tsconfig.json` uses `module: esnext` / `moduleResolution: bundler` with `noEmit`; `tsc` is only used to type-check (`npm run typecheck`).
- `npm run build` bundles `src/index.ts` to `dist/index.js` with tsup (config in `tsup.config.ts`). `npm start` runs the bundle.
- Do not use `.js` extensions on any import. The v2 SDK packages (`@modelcontextprotocol/server`, `/express`, `/node`) are imported from their package root, so no extension is needed. Do not reintroduce the v1 `@modelcontextprotocol/sdk/...` subpath imports.

## Working style

- When asked to plan, include the actual code in the plan.
- Only do what the current step asks. For example, if asked for tool shape and registration, do not add GitHub logic yet.
- Do not commit unless asked.
