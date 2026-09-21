# AetherLink training lab

This directory is a self-contained training lab with deterministic fictional data. It provides the shared fixtures for days 1 through 5 and local read-only integrations for the exercises.

## Start the mocks

Use Node 24 and pnpm 11.19.0. Run this command from the repository root after cloning.

```sh
pnpm install --frozen-lockfile && pnpm --filter training-lab start:mocks
```

The command keeps four local servers running.

| Service | URL | Port |
| --- | --- | ---: |
| Weather HTTP | `http://127.0.0.1:48135/weather` | 48135 |
| Jira MCP | `http://127.0.0.1:48136/mcp` | 48136 |
| GitLab MCP | `http://127.0.0.1:48137/mcp` | 48137 |
| Confluence MCP | `http://127.0.0.1:48138/mcp` | 48138 |

The MCP servers expose read-only tools. They contain no credentials and no remote-system calls. Every issue, merge request, page, and weather response is fictional and deterministic.

## Claude Code example

Copy this example to a participant-owned Claude Code configuration. It contains no secret.

```json
{
  "mcpServers": {
    "training-jira": {
      "type": "http",
      "url": "http://127.0.0.1:48136/mcp"
    },
    "training-gitlab": {
      "type": "http",
      "url": "http://127.0.0.1:48137/mcp"
    },
    "training-confluence": {
      "type": "http",
      "url": "http://127.0.0.1:48138/mcp"
    }
  }
}
```

The participant uses their own Claude Code login. No API key is stored in this repository.

## Verify the real integrations

```sh
pnpm --filter training-lab test
```

The integration test starts the real local servers, creates an `@modelcontextprotocol/client` client for each MCP endpoint, calls `listTools`, calls one fixture tool, and calls the weather HTTP endpoint. It does not replace those calls with test doubles.

Assignment cards use the `assignment.starterPath` convention. Each value is a path relative to this directory, such as `day-01/starter` or `day-02/claude-agent-sdk`.

## Imported participant source

The source material under [`upstream/aetherlink-agent-lab`](upstream/aetherlink-agent-lab) is copied from [RyanLisse/aetherlink-agent-lab](https://github.com/RyanLisse/aetherlink-agent-lab) at commit `765d99a656ac34005b9be53bdfb5daf7878b810a`, the upstream `main` revision inspected on 2026-09-21. The imported MIT license is preserved at [`upstream/aetherlink-agent-lab/LICENSE`](upstream/aetherlink-agent-lab/LICENSE). The upstream files remain attributed source material. The day folders and mocks in this directory are the training-lab integration layer.
