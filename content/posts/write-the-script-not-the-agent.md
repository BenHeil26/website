---
title: "Write the Script, Not the Agent"
date: 2026-06-25
desc: Repeatable tasks belong in a deterministic script or daemon, not in an agent you re-run every day.
---

Disclaimer: this post is neither anti-AI or pro-AI. So if you have come here to feel empowered to be either then move along

I've spent the last few months automating little parts of my workflow. Things like committing my notes on a schedule, pulling my assigned tickets into my daily note, and scraping the day's messages into a section I can skim later. None of it is glamorous, but it's the kind of repeatable busywork that adds up. The modern temptation is to reach for an agent for all of it. Wire up an LLM with a few tools, give it access to your files and your calendar and your ticketing system, and just ask it every morning to "set up my daily note." That works. It's also the wrong tool for most of what I wanted. 

## The pull toward an agent-in-the-loop

An agent-in-the-loop is when you keep a model in the runtime path of a task you do over and over. Every time the task runs, the model runs. It reads the situation, decides what to do, and does it.

<pre class="mermaid">
flowchart TD
    Trigger([Scheduled trigger fires]) --> Agent[LLM reads context and reasons]
    Agent --> Decide{Decide next action}
    Decide -->|needs more info| Tool[Call a tool]
    Tool --> Observe[Observe the result]
    Observe --> Agent
    Decide -->|task complete| Done([Done, until next run])
    Done -. next run: tokens paid again .-> Trigger
</pre>

This is genuinely great for a certain class of problem. If the input is messy, the goal is fuzzy, or the right action depends on judgment that's hard to write down, then having a model reason about it each time is exactly what you want. Triaging an unfamiliar bug report, drafting a reply, summarizing a long thread into something useful, deciding which of fifteen possible follow-ups actually matters. That's where the stochastic nature of the thing is a feature. You don't know the answer ahead of time, so you pay a model to figure it out.

But a lot of the work I was automating isn't like that at all. "Commit the repo if it changed" has exactly one correct behavior. "Read the ticket list and write it into a markdown section" is a transform with no judgment in it. There's nothing to reason about. And once you notice that, putting a model in the loop starts to look expensive and a little reckless.

## What it actually costs

Two things bother me about keeping a model in the loop for deterministic work.

The first is tokens. Every single run costs money and latency. A task that fires every thirty minutes, or every morning, or on every file save, is going to rack up a real bill over a year, and you're paying it to re-derive an answer that never changes. You're renting computation to rediscover the same conclusion on a loop. Doing this across 1000 employees is going to create a footprint that ends up getting making business clamp down on usage and even [lay people off](https://jobloss.ai/).

The second is determinism, and this is the one I care about more. A model will not do exactly the same thing twice. Most of the time it's close enough. But "most of the time" is a terrible property for _most_ software. I don't want my notes committed with a slightly different message format depending on the model's mood, and I definitely don't want it to occasionally decide that committing isn't necessary today, or to helpfully reformat a section I asked it to leave alone. When I write `git add -A && git commit`, I know precisely what happens. Every time. Forever.

So for the repeatable stuff, I did the obvious thing: I had an agent write a script, and then I got the agent out of the loop.

## A daemon instead of a morning ritual

The smallest example is committing my notes on a schedule. The agent-in-the-loop version of this is asking a model to "check if my notes changed and commit them" on some cadence. The deterministic version is about forty lines of bash:

```bash
#!/usr/bin/env bash
set -euo pipefail

# auto-commit: If the notes repo has uncommitted changes, stage everything and
# create a commit using the repo's configured git identity.
#
# Usage: auto-commit [repo-path]
#
# - repo-path defaults to this script's parent repository.
# - Commit message is "commit notes <date>" (see COMMIT_DATE_FMT below).
# - Set AUTO_COMMIT_PUSH=1 to also `git push` after committing.
#
# This is intended to be run on a schedule by launchd (see install-autocommit),
# but it is safe to run by hand at any time. It is a no-op when the tree is clean.

# Resolve the repo: explicit arg wins, otherwise the dir containing scripts/.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="${1:-$(cd "$SCRIPT_DIR/.." && pwd)}"

# launchd hands processes a minimal PATH, so make sure git (Homebrew or system)
# is reachable.
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

COMMIT_DATE_FMT="${COMMIT_DATE_FMT:-%Y-%m-%d %H:%M}"
LOG_FILE="${HOME}/.local/share/notes/auto-commit.log"
mkdir -p "$(dirname "$LOG_FILE")"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"; }

cd "$REPO_DIR"

# Bail out cleanly if this isn't a git work tree.
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  log "not a git repository: $REPO_DIR — skipping"
  exit 0
fi

# Nothing staged/unstaged/untracked => nothing to do.
if [ -z "$(git status --porcelain)" ]; then
  exit 0
fi

git add -A

MESSAGE="commit notes $(date "+$COMMIT_DATE_FMT")"
if git commit -m "$MESSAGE" >> "$LOG_FILE" 2>&1; then
  log "committed: $MESSAGE"
else
  log "commit failed (see above)"
  exit 1
fi

if [ "${AUTO_COMMIT_PUSH:-0}" = "1" ]; then
  if git push >> "$LOG_FILE" 2>&1; then
    log "pushed"
  else
    log "push failed (see above)"
    exit 1
  fi
fi
```

That's the whole idea. It's a no-op when there's nothing to do and it's identical on every run. The only thing left is to run it on a schedule, which on macOS means a `launchd` agent:

```xml
<key>ProgramArguments</key>
<array>
    <string>/path/to/auto-commit</string>
</array>
<key>RunAtLoad</key>
<true/>
<key>StartInterval</key>
<integer>1800</integer>
```

On Linux you'd reach for a systemd timer or a cron entry, and on Windows it's a scheduled task or a small service. The mechanism doesn't matter much. The point is that the thing running every thirty minutes is a fixed program, not a model. It costs nothing to run, it can't surprise me, and it'll still be working the same way long after I've forgotten I wrote it.

## Transforms are the obvious case

The pattern repeats for anything that's really just data in, formatted text out. One of my scripts pulls my currently assigned tickets and drops them into a `## Jira` section in the daily note. Another reads recent notifications off the system and writes a `## Slack` section. These feel like the kind of thing people now reach for an agent and a pile of MCP servers to do, but there's no reasoning involved. It's a query and a template.

The one detail worth getting right is that re-running the script shouldn't pile up duplicate sections. So instead of appending, the script replaces the section in place:

```bash
if grep -q "^## Slack" "$NOTE_PATH"; then
    # Found an existing section — rewrite the file with the new
    # block swapped in for the old one, leaving everything else alone.
    ...
else
    # No section yet — append a fresh one.
fi
```

Idempotency is the property that's easy to guarantee in code and weirdly hard to guarantee from a model. The script will produce the same file whether you run it once or fifty times. An agent might, but you're trusting it to, and you're paying for the privilege each time.

## So where does the agent fit in?

Here's the part I want to be clear about, because "just write a script" will turn off the AI bros, but I am not against AI as a whole. I really just want people to use AI where it's needed and not just because you want to turn your brain off or token-maxx. 

The agent was enormously useful. It just fit in the right place: writing the gnarly one-time logic that is specific to my needs, not executing it on a loop. The notification-scraping script, for instance, has to read a binary plist out of a local database whose schema and key names have drifted across macOS versions. Figuring that out is genuinely fiddly, exploratory work with a lot of dead ends that I don't care to follow, and having a model churn through it was great. That's a problem where stochastic exploration pays off. You don't know the shape of the answer going in.

But that exploration happens once. The output is a deterministic script. The model did its messy, expensive, pseudo-creative thing exactly one time, and what it left behind is something I can run a thousand times for free with no model involved. The best move an agent made for me was writing itself out of the loop. This is actual 10x engineering vs what I see getting recommended by most folks online. 

## The line I'd draw

If you've spent real time with software, you've already internalized when a problem is deterministic. A transform, a scheduled chore, a check with one correct answer. These have been solved by plain code for decades, and that hasn't changed. The arrival of capable models doesn't make a deterministic problem worth solving stochastically. If anything it raises the stakes, because now there's a tempting, slightly magical way to solve it badly.

So the line I try to hold is this: reach for stochasticism where it's actually valuable, and refuse it where determinism is good enough. Fuzzy input, judgment calls, open-ended generation, things you genuinely can't specify ahead of time go to the model. Anything you can write down completely goes in a script. The fact that you *can* put a model in the loop is not a reason to.

