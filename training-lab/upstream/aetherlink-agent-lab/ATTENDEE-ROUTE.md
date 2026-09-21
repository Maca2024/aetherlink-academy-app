# Attendee route · Squad 1 Day 5

Use this page as the navigation card during the workshop. Keep the browser and
terminal side by side. Download or clone each repository only once.

| When | Open or run | Download / action | End result |
| --- | --- | --- | --- |
| Before 10:00 | [Day 5 presentation](https://aetherlink-training.ryanlisse.chatgpt.site/?squad=1&day=5#1) | Open the URL; do not download the slides | Presentation is ready at slide 1 |
| 10:00–10:55 · Plan + Design | [Support-triage guide](https://github.com/RyanLisse/aetherlink-agent-lab/tree/main/scenarios/support-triage) and the live Day 5 deck | Read the guide in the browser. Do not run a model or import credentials yet | `intent` and node-to-contract map in your run log |
| 10:55–11:20 · Card 1 | This repository, local checkout | If you have not cloned it, run the clone commands below. Switch to `squad-1/day-5` only when the facilitator says so | Local branch and `progress.md` ready |
| 11:20–11:35 · break | No new page | No download; keep the checkout | Return with the same branch open |
| 11:35–12:00 · first run | [Day 5 tutorial repo](https://github.com/RyanLisse/aetherlink-day5-n8n-to-agent) | Clone it once. Do not download a ZIP or bundle. Compare lesson branches with `git diff`; do not overwrite your work | First local Claude Code result or an `OPEN` access note |
| 13:00–14:15 · Test | Day 5 presentation at the current slide; local `scenarios/support-triage` files | Use the already cloned files. Download/import `n8n/workflows/support-triage.json` only if you need to inspect the source locally; select credentials in n8n, never export them | Trace, checker output and human gate |
| 14:15–15:15 · Deploy | [Handoff template](templates/handoff.md) in this repo | No new download. Fill the template and give it to the person next to you | A colleague can reproduce or names the blocker |
| 15:15–16:00 · optional E2E + Maintain | Day 5 presentation and this route card | No new download. Use only fictional or sanitized data; record `OPEN` where evidence is missing | Made / Learned / Can do and one next action |

## One-time setup

```sh
git clone https://github.com/RyanLisse/aetherlink-agent-lab.git
cd aetherlink-agent-lab
git fetch origin
git switch --create workshop/your-name --track origin/squad-1/day-5

# Clone the Day 5 translation tutorial once, when Card 2 starts.
git clone https://github.com/RyanLisse/aetherlink-day5-n8n-to-agent.git
```

If a checkout already exists, run `git status` before switching branches. Do
not reset, delete, or replace local work. The `step-*` branches are comparison
points; your `workshop/your-name` branch is where you keep notes and evidence.

## What not to download

Do not download credentials, `.env` files, private exports, customer data,
trainer answer keys, or ZIP/bundle files. The public repositories and the live
presentation contain the material needed for the exercise. A prepared workflow,
fixture, or example output is not evidence that a model ran.
