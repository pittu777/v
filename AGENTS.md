<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->



to make model default 

use this : /model kilo-auto --global

cd freellmapi



PS D:\vendor> hermes sessions list
Title                        Workspace          Last Active   ID
──────────────────────────────────────────────────────────────────────────────────────────────────────────────
hermes sessions list         vendor             just now      local-548b2102e13e9952dc33a33e9a47a09ee8419a88edcc7c56ae703e19887991f0
how are you ?                vendor             29m ago       local-3d91f535aa6b23e23f20d2fed29827b0c71f089781b2aef33842e39c9b4b700c
hi #2                        vendor             31m ago       local-8f31b06f0e959a33e4cabf67f9e4a26146b565354151cbedc121a7588d43d3d9
—                            vendor             36m ago       local-2ee963c4b00249f2a158b8d5b2357e5bd83984a7cbc89534f5ed7d39f8bdfe59
Analyze project structure    —                  18h ago       local-703616ef4099fee29715396a1b07fd438895d93e46731e404bc2aea531bb8afa
—                            vendor             19h ago       local-34a8f8ce8fd80fa58e25be15989d912f26650bf025f85916b00ce71ea68d39ae
can you please fix page.ts   vendor             2d ago        local-0a30adef471c9e945ed82d85b3321f34528628ff05542858e0bd59c712ff7d38
hi how are you ?             —                  2d ago        local-9473bc8ce1251a1a6e351c0898f7218c3e39d0c3abd90d710656e027cbf2226b
hi                           vendor             2d ago        local-f4f65d560793e512ae8242124ebc2dd06317da270a04c47601400b010924a057
Exit conversation            vendor             2d ago        local-2d5bbe1d6950bbb5ba41c1d3a314ee3d3ffa37527efc6de5164f863b568cbdbd
—                            vendor             2d ago        local-a7372d0a8123e0998ff6b1d9dfab747a89f6e22d0cf36d72c2921ab3f2a45afd
List product feature backe   vendor             31m ago       local-9d3043b8f5bfab0cba7871a8d6099634a7e432dd79cc685f73aecf33929c1524
PS D:\vendor> 



for delete all = hermes sessions prune --older-than 0 --yes

for deleting perticular session = hermes sessions delete local-9473bc8ce1251a1a6e351c0898f7218c3e39d0c3abd90d710656e027cbf2226b --yes















<!--  -->
# Hermes Agent CLI Cheat Sheet

Here’s a practical cheat sheet for the Hermes CLI commands you’ve been using, especially changing models, providers, reasoning, and session settings.

These commands are based on the Hermes help output you shared earlier. Slash commands are entered inside the Hermes interactive terminal, not in ordinary PowerShell—unless otherwise noted.

## 1. Model and provider

| Command                                | What it does                                            |
| -------------------------------------- | ------------------------------------------------------- |
| `/model`                               | Open the model picker                                   |
| `/model kilo-auto`                     | Switch to `kilo-auto` for this session                  |
| `/model kilo-auto --global`            | Set `kilo-auto` as the persistent default               |
| `/model auto --global`                 | Set `auto` as the persistent default                    |
| `/model <model> --provider <provider>` | Select a model with a provider                          |
| `/model <model> --reasoning high`      | Switch model and set reasoning level                    |
| `/model --refresh`                     | Refresh the model list                                  |
| `/config`                              | Show current model, provider, URL, and config           |
| `/status`                              | Show session, model, token, and context info            |
| `/codex-runtime`                       | Toggle Codex app-server runtime for OpenAI/Codex models |

### Your FreeLLMAPI setup

Your current configuration uses a custom OpenAI-compatible endpoint:

```
Base URL: http://localhost:3001/v1
Provider: Local
Model: kilo-auto
```

To make `kilo-auto` your default:

```
/model kilo-auto --global
```

To change models temporarily:

```
/model qwen3-coder
```

To return to `kilo-auto`:

```
/model kilo-auto
```

Note: `/model` changes the model selection. The provider configuration itself is managed through Hermes’ model setup/configuration flow.

## 2. Reasoning and response display

| Command                       | What it does                                           |
| ----------------------------- | ------------------------------------------------------ |
| `/reasoning`                  | Manage reasoning effort and display                    |
| `/reasoning show`             | Show reasoning display                                 |
| `/reasoning hide`             | Hide reasoning display                                 |
| `/reasoning <level> --global` | Set reasoning level persistently                       |
| `/verbose`                    | Cycle tool progress display: off → new → all → verbose |
| `/focus on`                   | Show only your prompt and final response               |
| `/focus off`                  | Restore normal view                                    |
| `/statusbar` or `/sb`         | Toggle model/context status bar                        |
| `/battery on`                 | Show battery-style context indicator                   |
| `/timestamps on`              | Show timestamps                                        |
| `/footer on`                  | Show runtime metadata footer                           |
| `/skin`                       | Change terminal theme                                  |
| `/indicator`                  | Change busy indicator style                            |
| `/voice`                      | Manage voice mode                                      |
| `/wake`                       | Manage “Hey Hermes” wake-word listener                 |

## 3. Session and conversation

| Command                    | What it does                         |
| -------------------------- | ------------------------------------ |
| `/new`                     | Start a fresh session                |
| `/new <name>`              | Start a named session                |
| `/reset`                   | Start a fresh session                |
| `/clear`                   | Clear screen and start a new session |
| `/history`                 | Show conversation history            |
| `/retry`                   | Retry the last user message          |
| `/undo`                    | Back up one turn and re-prompt       |
| `/undo <N>`                | Back up N user turns                 |
| `/title <name>`            | Set session title                    |
| `/save <json\\|md\\|html>` | Export conversation                  |
| `/resume <name>`           | Resume a named session               |
| `/sessions`                | Browse and resume previous sessions  |
| `/branch`                  | Branch current conversation          |
| `/fork`                    | Alias for `/branch`                  |
| `/quit` or `/exit`         | Exit Hermes                          |
| `/quit --delete`           | Exit and delete session history      |

## 4. Context and token usage

| Command               | What it does                             |
| --------------------- | ---------------------------------------- |
| `/context` or `/ctx`  | Show context window details              |
| `/context all`        | Show detailed context breakdown          |
| `/compress`           | Compress conversation context            |
| `/compress here 10`   | Compress while keeping recent turns      |
| `/compress --preview` | Preview compression                      |
| `/autoprune on`       | Enable automatic pruning of old sessions |
| `/autoprune off`      | Disable automatic pruning                |
| `/usage`              | Show token usage and rate limits         |
| `/insights`           | Show usage insights                      |
| `/insights 7`         | Show insights for a number of days       |

## 5. Tools, skills, and agents

| Command                 | What it does                                      |
| ----------------------- | ------------------------------------------------- |
| `/tools list`           | List tools                                        |
| `/tools disable <name>` | Disable a tool                                    |
| `/tools enable <name>`  | Enable a tool                                     |
| `/toolsets`             | List available toolsets                           |
| `/skills`               | Search, install, inspect, or manage skills        |
| `/help skills`          | List skill commands                               |
| `/bundles`              | List skill bundles                                |
| `/agents` or `/tasks`   | Show active agents/tasks                          |
| `/bg <prompt>`          | Run a prompt in a background session              |
| `/review`               | Spawn an independent agent to review work         |
| `/plan <task>`          | Write an implementation plan without executing it |
| `/init`                 | Generate/update project instructions              |
| `/learn <description>`  | Learn a reusable skill                            |
| `/reload-skills`        | Rescan installed skills                           |
| `/reload-mcp`           | Reload MCP servers from config                    |

## 6. Background work and automation

| Command                                | What it does                               |
| -------------------------------------- | ------------------------------------------ |
| `/queue <prompt>`                      | Queue a prompt for the next turn           |
| `/queue list`                          | List queued prompts                        |
| `/queue edit N <prompt>`               | Edit queued prompt N                       |
| `/queue rm N`                          | Remove queued prompt N                     |
| `/queue clear`                         | Clear queued prompts                       |
| `/steer <prompt>`                      | Inject a message after the next tool call  |
| `/busy`                                | Configure behavior while Hermes is working |
| `/goal <text>`                         | Set a standing goal                        |
| `/goal status`                         | Show current goal status                   |
| `/goal pause`                          | Pause the goal                             |
| `/goal resume`                         | Resume the goal                            |
| `/goal clear`                          | Clear the goal                             |
| `/heartbeat every <interval> <prompt>` | Set recurring prompt while idle            |
| `/heartbeat status`                    | Show heartbeat status                      |
| `/loop <interval> <prompt>`            | Repeat a prompt on an interval             |
| `/loop status`                         | Show loop status                           |
| `/loop pause`                          | Pause loop                                 |
| `/loop stop`                           | Stop loop                                  |
| `/cron`                                | Manage scheduled tasks                     |
| `/suggestions`                         | Review suggested automations               |
| `/blueprint`                           | Set up an automation from a blueprint      |

## 7. Git and project workflow

| Command                  | What it does                      |
| ------------------------ | --------------------------------- |
| `/diff`                  | Show Git changes                  |
| `/diff staged`           | Show staged changes               |
| `/diff all`              | Show all changes                  |
| `/worktree list`         | List Git worktrees                |
| `/worktree new <name>`   | Create isolated worktree          |
| `/worktree prune`        | Prune worktrees                   |
| `/rollback`              | List filesystem checkpoints       |
| `/rollback <number>`     | Restore a checkpoint              |
| `/snapshot create`       | Create Hermes state snapshot      |
| `/snapshot restore <id>` | Restore snapshot                  |
| `/stop`                  | Kill running background processes |

## 8. Account, configuration, and information

| Command                    | What it does                           |
| -------------------------- | -------------------------------------- |
| `/whoami`                  | Show command access                    |
| `/profile`                 | Show active profile and home directory |
| `/version` or `/v`         | Show Hermes version                    |
| `/help`                    | Show available commands                |
| `/help <filter>`           | Search commands                        |
| `/palette`                 | Open command palette                   |
| `/export`                  | Export profile                         |
| `/import <archive>`        | Import a profile                       |
| `/login`                   | Sign in to Nous                        |
| `/subscription`            | View/change Nous plan                  |
| `/topup`                   | Manage Nous balance                    |
| `/platforms` or `/gateway` | Show gateway/platform status           |
| `/debug`                   | Create a debug report                  |
| `/update`                  | Update Hermes Agent                    |
| `/reload`                  | Reload environment variables           |
| `/plugins`                 | List installed plugins                 |
| `/copy`                    | Copy last assistant response           |
| `/paste`                   | Attach clipboard image                 |
| `/image <path>`            | Attach a local image                   |

These command names and descriptions reflect the Hermes CLI help output you pasted. Some commands or options can vary by installed Hermes version.&#x20;

Pasted text(20261030-074348).txt



## 9. Keyboard shortcuts

| Shortcut      | Action                         |
| ------------- | ------------------------------ |
| `Ctrl + P`    | Open command palette           |
| `Ctrl + J`    | Insert a new line              |
| `Alt + Enter` | Insert a new line              |
| `\ + Enter`   | Insert a new line              |
| `Ctrl + G`    | Open draft editor              |
| `Alt + G`     | Draft editor in VS Code/Cursor |
| `Alt + V`     | Paste image                    |

## 10. Your most useful commands — quick reference

For your current Hermes + FreeLLMAPI workflow, these are the ones worth memorizing:

```
/config
/model
/model kilo-auto
/model kilo-auto --global
/model auto --global
/status
/reasoning
/usage
/context
/compress
/new
/resume
/help
/exit
```

My recommendation: use `/model kilo-auto --global` to persist your default, `/config` to verify the provider and URL, and `/status` when you want to check which model is active.

For the complete command list in your installed version, type:

```
/help
```

You can also filter it:

```
/help model
/help reasoning
/help tools
```