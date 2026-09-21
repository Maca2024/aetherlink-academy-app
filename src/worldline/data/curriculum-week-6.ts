// ─────────────────────────────────────────────────────────────────────────────
// WEEK 6 / LEVEL 7 — Claude Code Mastery (Cons & Nina v1.0)
// Source: docs/levels/level-7/source.md (Cons & Nina v1.0, 20 apr 2026)
//
// Structuur v1.0:
//   Dag 1: Les 7.1 Van Chat naar CLI                  + Lab 7A MCP Server (GitLab)
//   Dag 2: Les 7.2 MCP Servers                        + Lab — CLI/MCP inventaris
//   Dag 3: Les 7.3 Skills en Agents                   + Lab 7B Skill Bouwen en Delen
//   Dag 4: Les 7.4 Workflow Integratie                + Lab — dag in Claude Code
//   Dag 5: Les 7.5 Permission Management              + Rol-opdracht Tool Builder Challenge
// ─────────────────────────────────────────────────────────────────────────────

import type { CurriculumWeek } from './curriculum';
import { dailySchedule } from './curriculum-schedule';

// ─── LES 7.1 — Van Chat naar CLI ─────────────────────────────────────────────

const LESSON_7_1_NL = `# Les 7.1 — Van Chat naar CLI

## Waarom de Terminal

In Level 1-6 heb je voornamelijk met LibreChat gewerkt — een chat-interface. Comfortabel, visueel, en goed voor leren. Maar het is niet waar de echte productiviteit zit.

Claude Code is een CLI-tool. Het draait in je terminal. En dat verandert alles.

**Het verschil:**

**LibreChat (chat):**
- Je typt een prompt
- Je krijgt tekst terug
- Je kopieert de code
- Je plakt het in je editor
- Je past het aan
- Repeat

**Claude Code (CLI):**
- Je typt een prompt
- Claude leest je bestanden
- Claude schrijft direct in je bestanden
- Claude runt je tests
- Claude commit de wijziging
- Jij reviewt en keurt goed

Minder kopiëren, minder plakken, minder context-wisseling. De AI werkt IN je codebase, niet NAAST.

## Setup

Claude Code is al beschikbaar in jullie development-omgeving. Check het:

\`\`\`bash
claude --version
\`\`\`

Als het werkt, ben je klaar. Als niet, vraag je squad lead om de setup-instructies.

Het eerste commando:

\`\`\`bash
claude
\`\`\`

Dit opent een interactieve sessie. Je zit nu in Claude Code. Alles wat je typt gaat naar het model. Je CLAUDE.md wordt automatisch geladen (Level 3).

## De Basis-Commando's

- \`/clear\` — Begin een nieuw gesprek (schone context)
- \`/compact\` — Vat het huidige gesprek samen (gebruikt /clear liever)
- \`/cost\` — Bekijk hoeveel tokens je hebt gebruikt
- \`/help\` — Toon alle beschikbare commando's

**Bestanden meegeven:**

\`\`\`bash
claude "Review @src/handlers/payment.go op concurrency issues"
\`\`\`

De @-mention vertelt Claude Code welk bestand het moet lezen. Geen copy-paste nodig.

**Meerdere bestanden:**

\`\`\`bash
claude "Vergelijk @src/handlers/payment.go met @src/handlers/refund.go — zijn de error handling patterns consistent?"
\`\`\`

Claude leest beide bestanden en vergelijkt ze. In LibreChat zou je de code moeten kopiëren en plakken. In Claude Code wijs je ernaar.

## Headless Mode

Voor scripting en automatisering:

\`\`\`bash
claude -p "Schrijf unit tests voor alle functies in src/handlers/payment.go" --output-file tests.go
\`\`\`

Dit runt Claude Code zonder interactieve sessie. Input in, output uit. Perfect voor CI/CD pipelines en automatisering.

## De Context uit Level 3 — Nu in Actie

In Level 3 schreef je een CLAUDE.md. In Level 7 zie je waarom.

Claude Code leest automatisch:
1. \`~/.claude/CLAUDE.md\` — je persoonlijke defaults
2. \`project-root/CLAUDE.md\` — project-specifieke context
3. Alle \`@-mentioned\` bestanden — taak-specifieke context

Die drie lagen samen geven Claude Code meer context dan je ooit in LibreChat zou plakken. En het kost je nul moeite — het is automatisch.`;

const LESSON_7_1_EN = `# Lesson 7.1 — From Chat to CLI

## Why the Terminal

In Levels 1-6 you worked mostly with LibreChat — a chat interface. Comfortable, visual, and good for learning. But it's not where real productivity lives.

Claude Code is a CLI tool. It runs in your terminal. And that changes everything.

**The difference:**

**LibreChat (chat):**
- You type a prompt
- You get text back
- You copy the code
- You paste it in your editor
- You adjust it
- Repeat

**Claude Code (CLI):**
- You type a prompt
- Claude reads your files
- Claude writes directly in your files
- Claude runs your tests
- Claude commits the change
- You review and approve

Less copying, less pasting, less context-switching. The AI works IN your codebase, not NEXT to it.

## Setup

Claude Code is already available in your development environment. Check it:

\`\`\`bash
claude --version
\`\`\`

If it works, you're ready. If not, ask your squad lead for setup instructions.

First command:

\`\`\`bash
claude
\`\`\`

This opens an interactive session. You're in Claude Code now. Everything you type goes to the model. Your CLAUDE.md is loaded automatically (Level 3).

## Basic Commands

- \`/clear\` — Start a new conversation (clean context)
- \`/compact\` — Summarise the current conversation (prefer /clear)
- \`/cost\` — See how many tokens you've used
- \`/help\` — Show all available commands

**Passing files:**

\`\`\`bash
claude "Review @src/handlers/payment.go for concurrency issues"
\`\`\`

The @-mention tells Claude Code which file to read. No copy-paste needed.

**Multiple files:**

\`\`\`bash
claude "Compare @src/handlers/payment.go with @src/handlers/refund.go — are the error handling patterns consistent?"
\`\`\`

Claude reads both files and compares them. In LibreChat you'd have to copy and paste the code. In Claude Code you point at it.

## Headless Mode

For scripting and automation:

\`\`\`bash
claude -p "Write unit tests for all functions in src/handlers/payment.go" --output-file tests.go
\`\`\`

This runs Claude Code without an interactive session. Input in, output out. Perfect for CI/CD pipelines and automation.

## Context from Level 3 — Now in Action

In Level 3 you wrote a CLAUDE.md. In Level 7 you see why.

Claude Code automatically reads:
1. \`~/.claude/CLAUDE.md\` — your personal defaults
2. \`project-root/CLAUDE.md\` — project-specific context
3. All \`@-mentioned\` files — task-specific context

Those three layers together give Claude Code more context than you'd ever paste into LibreChat. And it costs you zero effort — it's automatic.`;

const LESSON_7_1_FR = `# Leçon 7.1 — Du Chat au CLI

## Pourquoi le Terminal

Aux Levels 1-6 vous avez principalement travaillé avec LibreChat — une interface chat. Confortable, visuelle, et bonne pour apprendre. Mais ce n'est pas où la vraie productivité réside.

Claude Code est un outil CLI. Il tourne dans votre terminal. Et ça change tout.

**La différence :**

**LibreChat (chat) :**
- Vous tapez un prompt
- Vous recevez du texte
- Vous copiez le code
- Vous collez dans votre éditeur
- Vous ajustez
- Répétez

**Claude Code (CLI) :**
- Vous tapez un prompt
- Claude lit vos fichiers
- Claude écrit directement dans vos fichiers
- Claude lance vos tests
- Claude commit la modification
- Vous reviewez et approuvez

Moins de copier, moins de coller, moins de switch de context. L'IA travaille DANS votre codebase, pas À CÔTÉ.

## Setup

Claude Code est déjà disponible dans votre environnement dev. Vérifiez :

\`\`\`bash
claude --version
\`\`\`

Si ça marche, vous êtes prêt. Sinon, demandez à votre squad lead les instructions setup.

Première commande :

\`\`\`bash
claude
\`\`\`

Ça ouvre une session interactive. Vous êtes dans Claude Code. Tout ce que vous tapez va au modèle. Votre CLAUDE.md se charge automatiquement (Level 3).

## Commandes de Base

- \`/clear\` — Commencer une nouvelle conversation (context propre)
- \`/compact\` — Résumer la conversation actuelle (préférez /clear)
- \`/cost\` — Voir combien de tokens utilisés
- \`/help\` — Afficher toutes les commandes

**Passer des fichiers :**

\`\`\`bash
claude "Review @src/handlers/payment.go pour issues de concurrence"
\`\`\`

La @-mention dit à Claude Code quel fichier lire. Pas besoin de copy-paste.

**Plusieurs fichiers :**

\`\`\`bash
claude "Compare @src/handlers/payment.go avec @src/handlers/refund.go — les patterns d'error handling sont-ils cohérents ?"
\`\`\`

Claude lit les deux et compare. Dans LibreChat il faudrait copier-coller le code. Dans Claude Code vous pointez.

## Mode Headless

Pour scripting et automation :

\`\`\`bash
claude -p "Écris des unit tests pour toutes les fonctions dans src/handlers/payment.go" --output-file tests.go
\`\`\`

Ça lance Claude Code sans session interactive. Input dedans, output dehors. Parfait pour pipelines CI/CD et automation.

## Le Context du Level 3 — Maintenant en Action

Au Level 3 vous avez écrit un CLAUDE.md. Au Level 7 vous voyez pourquoi.

Claude Code lit automatiquement :
1. \`~/.claude/CLAUDE.md\` — vos defaults personnels
2. \`project-root/CLAUDE.md\` — context projet
3. Tous les fichiers \`@-mentioned\` — context tâche

Ces trois couches ensemble donnent plus de context que vous ne colleriez jamais dans LibreChat. Et ça vous coûte zéro effort — c'est automatique.`;

// ─── LES 7.2 — MCP Servers ───────────────────────────────────────────────────

const LESSON_7_2_NL = `# Les 7.2 — MCP Servers: Bouw Je Eigen Integraties

## De Preview Wordt Werkelijkheid

In Level 3 (Les 3.5) kreeg je een preview van MCP — Model Context Protocol. Je leerde wat het is en waarom het belangrijk is. Nu ga je er daadwerkelijk mee werken.

## Wat MCP Doet

MCP verbindt Claude Code met externe systemen. Zonder MCP kan Claude Code:
- Bestanden lezen en schrijven
- Commands uitvoeren in je terminal
- Code analyseren

Met MCP kan Claude Code ook:
- Je GitLab repo doorzoeken (merge requests, issues, pipelines)
- Je Jira board lezen (tickets, sprint status, backlogs)
- Je database schema opvragen (tabellen, relaties, constraints)
- Slack berichten lezen (channel history, threads)

MCP verandert Claude Code van een code-tool naar een development platform.

## MCP Architectuur

Het is simpeler dan het klinkt:

> Claude Code ↔ MCP Server ↔ Extern Systeem

De MCP Server is een klein programma (meestal Node.js of Python) dat:
1. Luistert naar verzoeken van Claude Code
2. Vertaalt ze naar API-calls
3. Stuurt het resultaat terug

Je hoeft de MCP-specificatie niet te kennen. Je hoeft alleen te weten hoe je een server configureert en — optioneel — hoe je er een bouwt.

## Configuratie

MCP-servers worden geconfigureerd in je project:

\`\`\`json
// .claude.json (in je project root)
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-gitlab"],
      "env": {
        "GITLAB_TOKEN": "$GITLAB_TOKEN",
        "GITLAB_URL": "https://gitlab.worldline.com"
      }
    }
  }
}
\`\`\`

Na configuratie kun je in Claude Code vragen:

> "Welke merge requests staan open voor ons project?"
> "Wat zijn de comments op MR #1234?"
> "Toon de CI/CD pipeline status van de main branch"

Claude Code gebruikt de MCP-server om deze informatie op te halen. Je hoeft niet naar GitLab te navigeren.

## CLIs vs MCPs — De Afweging (herhaling uit Level 3)

Herinnering: niet alles hoeft via MCP.

**Gebruik de CLI als die er is:**
- \`git\` → gewoon git (niet GitHub MCP)
- \`kubectl\` → gewoon kubectl
- \`psql\` → gewoon psql met read-only credentials

**Gebruik MCP als er geen goede CLI is:**
- Jira → MCP (geen Jira CLI die alles kan)
- Confluence → MCP
- Slack → MCP (voor gestructureerde data)

Waarom: CLIs zijn goedkoper (minder tokens), sneller, en beter auditeerbaar.

## Beschikbare MCP Servers bij Worldline

| Systeem | MCP Server | Status |
|---------|-----------|--------|
| GitLab | \`@anthropic/mcp-server-gitlab\` | Beschikbaar |
| Jira | Community MCP server | In evaluatie |
| PostgreSQL | \`@modelcontextprotocol/server-postgres\` | Beschikbaar (read-only) |
| Slack | Community MCP server | In evaluatie |
| Confluence | Custom (intern) | In development |

Check met je squad lead welke MCP-servers beschikbaar en goedgekeurd zijn.`;

const LESSON_7_2_EN = `# Lesson 7.2 — MCP Servers: Build Your Own Integrations

## The Preview Becomes Reality

In Level 3 (Lesson 3.5) you got a preview of MCP — Model Context Protocol. You learned what it is and why it matters. Now you actually work with it.

## What MCP Does

MCP connects Claude Code to external systems. Without MCP, Claude Code can:
- Read and write files
- Run commands in your terminal
- Analyse code

With MCP, Claude Code can also:
- Search your GitLab repo (merge requests, issues, pipelines)
- Read your Jira board (tickets, sprint status, backlogs)
- Query your database schema (tables, relations, constraints)
- Read Slack messages (channel history, threads)

MCP turns Claude Code from a code tool into a development platform.

## MCP Architecture

Simpler than it sounds:

> Claude Code ↔ MCP Server ↔ External System

The MCP Server is a small program (usually Node.js or Python) that:
1. Listens to requests from Claude Code
2. Translates them to API calls
3. Sends the result back

You don't need to know the MCP specification. You just need to know how to configure a server and — optionally — how to build one.

## Configuration

MCP servers are configured in your project:

\`\`\`json
// .claude.json (in your project root)
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-gitlab"],
      "env": {
        "GITLAB_TOKEN": "$GITLAB_TOKEN",
        "GITLAB_URL": "https://gitlab.worldline.com"
      }
    }
  }
}
\`\`\`

After configuration you can ask Claude Code:

> "Which merge requests are open on our project?"
> "What are the comments on MR #1234?"
> "Show the CI/CD pipeline status of the main branch"

Claude Code uses the MCP server to fetch this info. You don't have to navigate to GitLab.

## CLIs vs MCPs — The Trade-off (Level 3 recap)

Reminder: not everything needs MCP.

**Use the CLI if one exists:**
- \`git\` → just git (not GitHub MCP)
- \`kubectl\` → just kubectl
- \`psql\` → just psql with read-only credentials

**Use MCP when there's no good CLI:**
- Jira → MCP (no Jira CLI that does it all)
- Confluence → MCP
- Slack → MCP (for structured data)

Why: CLIs are cheaper (fewer tokens), faster, and more auditable.

## Available MCP Servers at Worldline

| System | MCP Server | Status |
|--------|-----------|--------|
| GitLab | \`@anthropic/mcp-server-gitlab\` | Available |
| Jira | Community MCP server | Under evaluation |
| PostgreSQL | \`@modelcontextprotocol/server-postgres\` | Available (read-only) |
| Slack | Community MCP server | Under evaluation |
| Confluence | Custom (internal) | In development |

Check with your squad lead which MCP servers are available and approved.`;

const LESSON_7_2_FR = `# Leçon 7.2 — Serveurs MCP : Construisez Vos Propres Intégrations

## L'Aperçu Devient Réalité

Au Level 3 (Leçon 3.5) vous avez eu un aperçu de MCP — Model Context Protocol. Vous avez appris ce que c'est et pourquoi c'est important. Maintenant vous travaillez réellement avec.

## Ce Que MCP Fait

MCP connecte Claude Code à des systèmes externes. Sans MCP, Claude Code peut :
- Lire et écrire des fichiers
- Lancer des commandes dans votre terminal
- Analyser du code

Avec MCP, Claude Code peut aussi :
- Chercher dans votre repo GitLab (merge requests, issues, pipelines)
- Lire votre board Jira (tickets, sprint status, backlogs)
- Interroger votre schéma DB (tables, relations, contraintes)
- Lire messages Slack (historique channel, threads)

MCP transforme Claude Code d'un outil code en plateforme de développement.

## Architecture MCP

Plus simple qu'il n'y paraît :

> Claude Code ↔ Serveur MCP ↔ Système Externe

Le serveur MCP est un petit programme (généralement Node.js ou Python) qui :
1. Écoute les requêtes de Claude Code
2. Les traduit en appels API
3. Renvoie le résultat

Vous n'avez pas à connaître la spec MCP. Il faut juste savoir configurer un serveur et — optionnellement — en construire un.

## Configuration

Les serveurs MCP sont configurés dans votre projet :

\`\`\`json
// .claude.json (dans la racine du projet)
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-gitlab"],
      "env": {
        "GITLAB_TOKEN": "$GITLAB_TOKEN",
        "GITLAB_URL": "https://gitlab.worldline.com"
      }
    }
  }
}
\`\`\`

Après configuration, vous pouvez demander à Claude Code :

> « Quelles merge requests sont ouvertes sur notre projet ? »
> « Quels sont les comments sur MR #1234 ? »
> « Statut pipeline CI/CD de la branche main »

## CLIs vs MCPs — L'Arbitrage (rappel Level 3)

Rappel : tout n'a pas besoin de MCP.

**Utilisez la CLI si elle existe :**
- \`git\` → juste git (pas GitHub MCP)
- \`kubectl\` → juste kubectl
- \`psql\` → juste psql avec credentials read-only

**Utilisez MCP quand il n'y a pas de bonne CLI :**
- Jira → MCP (pas de CLI Jira complète)
- Confluence → MCP
- Slack → MCP (pour données structurées)

Pourquoi : les CLIs sont moins chères (moins de tokens), plus rapides, mieux auditables.

## Serveurs MCP Disponibles chez Worldline

| Système | Serveur MCP | Statut |
|---------|-------------|--------|
| GitLab | \`@anthropic/mcp-server-gitlab\` | Disponible |
| Jira | Community MCP server | En évaluation |
| PostgreSQL | \`@modelcontextprotocol/server-postgres\` | Disponible (read-only) |
| Slack | Community MCP server | En évaluation |
| Confluence | Custom (interne) | En développement |

Vérifiez avec votre squad lead quels serveurs MCP sont disponibles et approuvés.`;

// ─── LES 7.3 — Skills en Agents ──────────────────────────────────────────────

const LESSON_7_3_NL = `# Les 7.3 — Skills en Agents: Herbruikbare AI-Workflows

## Van Eenmalig naar Herbruikbaar

Tot nu toe was elke interactie met AI eenmalig. Je schrijft een prompt, krijgt output, klaar. Volgende keer schrijf je de prompt opnieuw. Of je scrolt door je chat-history. Of je vergeet de helft.

Skills lossen dit op. Een skill is een herbruikbare AI-workflow — een prompt met structuur, context, en instructies die je opslaat en opnieuw kunt gebruiken.

## Wat Is Een Skill?

Een skill is een markdown-bestand (\`SKILL.md\`) dat beschrijft:
- Wat de skill doet
- Wanneer hij actief wordt
- Hoe de AI zich moet gedragen
- Welke output verwacht wordt

**Voorbeeld — een code review skill:**

\`\`\`markdown
---
name: code-review
description: Review code op Worldline standards — error handling, concurrency, PCI compliance
---

# Code Review — Worldline Standards

## Wanneer
Gebruik deze skill wanneer je code wilt reviewen op team-standaarden.

## Instructies
1. Lees de aangeboden code
2. Check op:
   - Error handling (errors.Wrap pattern)
   - Concurrency safety (mutex, channels, context.Context)
   - PCI compliance (geen PAN/CVV in logs, geen credentials)
   - Test coverage (heeft het tests?)
   - Naming conventions (camelCase intern, PascalCase exports)
3. Geef feedback in dit format:
   - CRITICAL: moet gefixt voor merge
   - WARNING: zou gefixt moeten worden
   - SUGGESTION: nice to have
4. Eindig met een overall score (1-10) en een samenvatting
\`\`\`

Eenmaal opgeslagen, kun je deze skill activeren:

\`\`\`bash
claude /code-review @src/handlers/payment.go
\`\`\`

Elke keer dezelfde kwaliteit. Geen prompt opnieuw schrijven. Geen checklist vergeten.

## Waar Skills Opslaan

**Persoonlijke skills:**
\`~/.claude/skills/[skill-naam]/SKILL.md\`

**Project skills** (gedeeld met team):
\`project-root/.claude/skills/[skill-naam]/SKILL.md\`

Persoonlijke skills zijn alleen voor jou. Project skills zijn voor iedereen in het team. Kies bewust.

## Skills vs Agents

Een **skill** is een set instructies. Een **agent** is een skill die zelfstandig handelt.

**Skill:** "Als ik vraag om een code review, doe het volgens deze regels."
→ Jij activeert, jij stuurt, jij keurt goed.

**Agent:** "Monitor merge requests. Bij elke nieuwe MR, doe automatisch een code review."
→ De agent handelt zelfstandig, jij krijgt het resultaat.

**Bij Worldline — belangrijk:** agents die zelfstandig handelen vereisen extra guardrails. Het review-pattern uit Level 6 geldt: AI genereert → mens reviewt → mens keurt goed. Geen agent die autonoom naar productie deployt.

## Skills Bouwen — Best Practices

**1. Eén verantwoordelijkheid per skill**
"code-review" is goed. "code-review-en-deployment-en-documentatie" is te breed.

**2. Specifieke trigger**
Beschrijf wanneer de skill actief wordt. Hoe specifieker, hoe beter.

**3. Concrete output**
Definieer het verwachte output-format. Geen "geef feedback" maar "geef feedback in CRITICAL/WARNING/SUGGESTION format met scores."

**4. Test je skill**
Run hem 3 keer op verschillende input. Is de output consistent? Dan is je skill goed.

**5. Review voor delen**
Behandel skills als code. Peer review voordat je ze breder deelt. Guardrails gelden ook voor skills.`;

const LESSON_7_3_EN = `# Lesson 7.3 — Skills and Agents: Reusable AI Workflows

## From One-off to Reusable

Until now every AI interaction was one-off. You write a prompt, get output, done. Next time you write the prompt again. Or scroll through chat history. Or forget half of it.

Skills solve this. A skill is a reusable AI workflow — a prompt with structure, context, and instructions that you save and reuse.

## What Is a Skill?

A skill is a markdown file (\`SKILL.md\`) that describes:
- What the skill does
- When it activates
- How the AI should behave
- What output is expected

**Example — a code review skill:**

\`\`\`markdown
---
name: code-review
description: Review code against Worldline standards — error handling, concurrency, PCI compliance
---

# Code Review — Worldline Standards

## When
Use this skill when you want to review code against team standards.

## Instructions
1. Read the given code
2. Check for:
   - Error handling (errors.Wrap pattern)
   - Concurrency safety (mutex, channels, context.Context)
   - PCI compliance (no PAN/CVV in logs, no credentials)
   - Test coverage (are there tests?)
   - Naming conventions (camelCase internal, PascalCase exports)
3. Give feedback in this format:
   - CRITICAL: must fix before merge
   - WARNING: should be fixed
   - SUGGESTION: nice to have
4. End with an overall score (1-10) and a summary
\`\`\`

Once saved, you activate this skill:

\`\`\`bash
claude /code-review @src/handlers/payment.go
\`\`\`

Same quality every time. No rewriting the prompt. No forgetting the checklist.

## Where to Save Skills

**Personal skills:**
\`~/.claude/skills/[skill-name]/SKILL.md\`

**Project skills** (shared with team):
\`project-root/.claude/skills/[skill-name]/SKILL.md\`

Personal skills are just for you. Project skills are for everyone in the team. Choose deliberately.

## Skills vs Agents

A **skill** is a set of instructions. An **agent** is a skill that acts autonomously.

**Skill:** "When I ask for a code review, do it following these rules."
→ You activate, you direct, you approve.

**Agent:** "Monitor merge requests. On every new MR, run a code review automatically."
→ The agent acts autonomously, you receive the result.

**At Worldline — important:** agents that act autonomously require extra guardrails. The review pattern from Level 6 applies: AI generates → human reviews → human approves. No agent that autonomously deploys to production.

## Building Skills — Best Practices

**1. One responsibility per skill**
"code-review" is good. "code-review-and-deployment-and-documentation" is too broad.

**2. Specific trigger**
Describe when the skill activates. The more specific, the better.

**3. Concrete output**
Define the expected output format. Not "give feedback" but "give feedback in CRITICAL/WARNING/SUGGESTION format with scores."

**4. Test your skill**
Run it 3 times on different input. Is the output consistent? Then your skill is good.

**5. Review before sharing**
Treat skills as code. Peer-review before sharing widely. Guardrails apply to skills too.`;

const LESSON_7_3_FR = `# Leçon 7.3 — Skills et Agents : Workflows IA Réutilisables

## Du One-off au Réutilisable

Jusqu'à présent chaque interaction IA était one-off. Vous écrivez un prompt, recevez output, fini. Prochaine fois vous écrivez à nouveau. Ou vous scrollez dans l'historique. Ou vous oubliez la moitié.

Les skills résolvent ça. Un skill est un workflow IA réutilisable — un prompt avec structure, context, et instructions que vous sauvegardez et réutilisez.

## Qu'est-ce Qu'un Skill ?

Un skill est un fichier markdown (\`SKILL.md\`) qui décrit :
- Ce que le skill fait
- Quand il s'active
- Comment l'IA doit se comporter
- Quel output est attendu

**Exemple — un skill code review :**

\`\`\`markdown
---
name: code-review
description: Review de code selon standards Worldline — error handling, concurrency, PCI compliance
---

# Code Review — Worldline Standards

## Quand
Utilisez ce skill pour reviewer du code selon les standards équipe.

## Instructions
1. Lire le code proposé
2. Vérifier :
   - Error handling (errors.Wrap pattern)
   - Concurrency safety (mutex, channels, context.Context)
   - PCI compliance (pas de PAN/CVV dans logs, pas de credentials)
   - Test coverage (y a-t-il des tests ?)
   - Naming conventions (camelCase interne, PascalCase exports)
3. Donner feedback dans ce format :
   - CRITICAL : à fixer avant merge
   - WARNING : devrait être fixé
   - SUGGESTION : nice to have
4. Finir avec un score global (1-10) et résumé
\`\`\`

Une fois sauvegardé, activez-le :

\`\`\`bash
claude /code-review @src/handlers/payment.go
\`\`\`

Même qualité à chaque fois. Pas à réécrire le prompt. Pas à oublier la checklist.

## Où Sauvegarder les Skills

**Skills personnels :**
\`~/.claude/skills/[nom-skill]/SKILL.md\`

**Skills projet** (partagés avec l'équipe) :
\`project-root/.claude/skills/[nom-skill]/SKILL.md\`

Les skills personnels sont pour vous seul. Les skills projet pour toute l'équipe. Choisissez consciemment.

## Skills vs Agents

Un **skill** est un set d'instructions. Un **agent** est un skill qui agit de manière autonome.

**Skill :** « Quand je demande un code review, fais-le selon ces règles. »
→ Vous activez, vous dirigez, vous approuvez.

**Agent :** « Monitore les merge requests. À chaque nouvelle MR, fais un code review automatique. »
→ L'agent agit de manière autonome, vous recevez le résultat.

**Chez Worldline — important :** les agents autonomes nécessitent des guardrails supplémentaires. Le pattern review du Level 6 s'applique : IA génère → humain review → humain approuve. Pas d'agent qui déploie automatiquement en prod.

## Construire des Skills — Best Practices

**1. Une responsabilité par skill**
« code-review » c'est bon. « code-review-et-deployment-et-documentation » c'est trop large.

**2. Trigger spécifique**
Décrivez quand le skill s'active. Plus spécifique, mieux c'est.

**3. Output concret**
Définissez le format attendu. Pas « donnez feedback » mais « donnez feedback en format CRITICAL/WARNING/SUGGESTION avec scores. »

**4. Testez votre skill**
Lancez-le 3 fois sur input différent. Output cohérent ? Alors c'est bon.

**5. Review avant partage**
Traitez les skills comme du code. Peer-review avant partage large. Les guardrails s'appliquent aussi aux skills.`;

// ─── LES 7.4 — Workflow Integratie ───────────────────────────────────────────

const LESSON_7_4_NL = `# Les 7.4 — Workflow Integratie: Claude Code in Je Dev-Cyclus

## De Dagelijkse Workflow

Dit is hoe een Claude Code-powered development dag eruitziet:

**Ochtend — Context laden:**
1. Open je terminal
2. \`claude\` (start sessie, CLAUDE.md wordt geladen)
3. "Wat staat er open in onze sprint?" (via Jira MCP)
4. "Toon de comments op MR #1234" (via GitLab MCP)
5. Kies je eerste taak

**Taak uitvoeren:**
1. "Refactor @src/handlers/payment.go — splits de handlePayment functie op in validateInput, processPayment, en handleResponse" (intent + taak)
2. Claude Code leest het bestand, maakt de wijzigingen, schrijft de nieuwe functies
3. Jij reviewt de diff
4. "Schrijf table-driven tests voor de 3 nieuwe functies"
5. Claude Code schrijft de tests
6. "Run de tests" (claude runt \`go test ./...\`)
7. Tests slagen → commit

**Afsluiting:**
1. \`/cost\` — check je token-gebruik
2. \`/clear\` — schone context voor morgen

Totale wijziging: je schrijft minder code en leest meer code. Review wordt je hoofdtaak, niet schrijven.

## Git Integratie

Claude Code kan direct met git werken:

> "Commit deze wijzigingen met message 'refactor: split handlePayment into 3 functions'"
> "Maak een nieuwe branch feature/split-payment-handler"
> "Wat is het verschil tussen mijn branch en main?"

Maar — belangrijk — Claude Code commit nooit zonder jouw goedkeuring. Je krijgt altijd een preview van wat er gecommit wordt. Jij keurt goed of wijst af.

## IDE Integratie

Claude Code werkt met elke editor. Je hoeft niet te switchen.

- **VS Code:** Claude Code in de integrated terminal
- **JetBrains (IntelliJ/GoLand):** Claude Code in de terminal tab
- **Vim/Neovim:** Claude Code in een split pane
- **Standalone terminal:** gewoon je favoriete terminal

De kracht is dat Claude Code je bestanden leest en schrijft, ongeacht welke editor ze opent. Je editor voor weergave, Claude Code voor actie.

## De Productivity Stack

Het complete plaatje:

- **LibreChat** — brainstorm, vergelijken, documentatie
- **Claude Code** — implementatie, refactoring, debugging
- **CLAUDE.md** — project context (automatisch)
- **Skills** — herbruikbare workflows (activeerbaar)
- **MCP** — live verbinding met GitLab, Jira, databases

Elk tool heeft zijn plek. Geen overlap, geen duplicatie.`;

const LESSON_7_4_EN = `# Lesson 7.4 — Workflow Integration: Claude Code in Your Dev Cycle

## The Daily Workflow

This is what a Claude Code-powered development day looks like:

**Morning — Loading context:**
1. Open your terminal
2. \`claude\` (start session, CLAUDE.md loads)
3. "What's open in our sprint?" (via Jira MCP)
4. "Show comments on MR #1234" (via GitLab MCP)
5. Pick your first task

**Running a task:**
1. "Refactor @src/handlers/payment.go — split the handlePayment function into validateInput, processPayment, and handleResponse" (intent + task)
2. Claude Code reads the file, makes the changes, writes the new functions
3. You review the diff
4. "Write table-driven tests for the 3 new functions"
5. Claude Code writes the tests
6. "Run the tests" (claude runs \`go test ./...\`)
7. Tests pass → commit

**Wrap-up:**
1. \`/cost\` — check your token usage
2. \`/clear\` — clean context for tomorrow

Net change: you write less code and read more code. Review becomes your main task, not writing.

## Git Integration

Claude Code can work directly with git:

> "Commit these changes with message 'refactor: split handlePayment into 3 functions'"
> "Create a new branch feature/split-payment-handler"
> "What's the difference between my branch and main?"

But — important — Claude Code never commits without your approval. You always get a preview of what will be committed. You approve or reject.

## IDE Integration

Claude Code works with any editor. No switching.

- **VS Code:** Claude Code in the integrated terminal
- **JetBrains (IntelliJ/GoLand):** Claude Code in the terminal tab
- **Vim/Neovim:** Claude Code in a split pane
- **Standalone terminal:** just your favourite terminal

The power is that Claude Code reads and writes your files regardless of which editor opens them. Your editor for display, Claude Code for action.

## The Productivity Stack

The complete picture:

- **LibreChat** — brainstorm, comparison, documentation
- **Claude Code** — implementation, refactoring, debugging
- **CLAUDE.md** — project context (automatic)
- **Skills** — reusable workflows (activatable)
- **MCP** — live connection to GitLab, Jira, databases

Each tool has its place. No overlap, no duplication.`;

const LESSON_7_4_FR = `# Leçon 7.4 — Intégration Workflow : Claude Code dans Votre Cycle Dev

## Le Workflow Quotidien

Voici à quoi ressemble une journée dev avec Claude Code :

**Matin — Chargement du context :**
1. Ouvrez votre terminal
2. \`claude\` (démarre session, CLAUDE.md se charge)
3. « Qu'est-ce qui est ouvert dans notre sprint ? » (via Jira MCP)
4. « Montre les comments sur MR #1234 » (via GitLab MCP)
5. Choisissez votre première tâche

**Exécuter une tâche :**
1. « Refactor @src/handlers/payment.go — divise la fonction handlePayment en validateInput, processPayment, et handleResponse » (intent + tâche)
2. Claude Code lit le fichier, fait les changements, écrit les nouvelles fonctions
3. Vous reviewez le diff
4. « Écris des table-driven tests pour les 3 nouvelles fonctions »
5. Claude Code écrit les tests
6. « Lance les tests » (claude lance \`go test ./...\`)
7. Tests passent → commit

**Clôture :**
1. \`/cost\` — vérifie consommation tokens
2. \`/clear\` — context propre pour demain

Changement net : vous écrivez moins de code et lisez plus. La review devient votre tâche principale, pas l'écriture.

## Intégration Git

Claude Code peut travailler directement avec git :

> « Commit ces changements avec message 'refactor: split handlePayment into 3 functions' »
> « Crée une nouvelle branche feature/split-payment-handler »
> « Quelle est la différence entre ma branche et main ? »

Mais — important — Claude Code ne commit jamais sans votre approbation. Vous recevez toujours un preview. Vous approuvez ou rejetez.

## Intégration IDE

Claude Code fonctionne avec n'importe quel éditeur. Pas besoin de switcher.

- **VS Code :** Claude Code dans le terminal intégré
- **JetBrains (IntelliJ/GoLand) :** Claude Code dans le tab terminal
- **Vim/Neovim :** Claude Code dans un split pane
- **Terminal standalone :** juste votre terminal préféré

La force c'est que Claude Code lit et écrit vos fichiers peu importe quel éditeur les ouvre.

## Le Stack Productivity

Le tableau complet :

- **LibreChat** — brainstorm, comparaison, documentation
- **Claude Code** — implémentation, refactoring, debug
- **CLAUDE.md** — context projet (automatique)
- **Skills** — workflows réutilisables (activables)
- **MCP** — connexion live à GitLab, Jira, bases de données

Chaque outil a sa place. Pas de chevauchement, pas de duplication.`;

// ─── LES 7.5 — Permission Management ─────────────────────────────────────────

const LESSON_7_5_NL = `# Les 7.5 — Permission Management en Veilig Werken

## De Realiteit

Claude Code heeft toegang tot je filesystem. Het kan bestanden lezen, schrijven, en commands uitvoeren. Dat is krachtig. En dat maakt veilig werken niet optioneel — het maakt het essentieel.

## Permission Modes

Claude Code heeft drie permission modes:

**Default Mode:**
- Leest bestanden: automatisch toegestaan
- Schrijft bestanden: vraagt toestemming
- Runt commands: vraagt toestemming
- De veiligste modus. Begin hiermee.

**Accept Edits Mode:**
- Leest bestanden: automatisch toegestaan
- Schrijft bestanden: automatisch toegestaan
- Runt commands: vraagt toestemming
- Handiger voor ervaren gebruikers, maar je moet de diffs reviewen.

**YOLO Mode (\`--dangerously-skip-permissions\`):**
- Alles automatisch toegestaan
- **NOOIT GEBRUIKEN. NOOIT.** Dit staat in de guardrails.

Begin met Default Mode. Na een paar weken ervaring kun je naar Accept Edits. YOLO bestaat niet in jullie vocabulaire.

## Wat Je Moet Reviewen

Bij elke toestemmingsvraag, check:

**Bestandswijzigingen:**
- Welk bestand wordt gewijzigd?
- Past de wijziging bij wat je vroeg?
- Worden er geen bestanden gewijzigd die je niet noemde?

**Commands:**
- Welk command wordt uitgevoerd?
- Is het een read-only command of wijzigt het iets?
- Heeft het side-effects (netwerk, database, deployment)?

**MCP-calls:**
- Welk extern systeem wordt benaderd?
- Is het read-only of write?
- Bevat het gevoelige data?

## De Permission Fatigue Trap

Gertjan waarschuwde hiervoor: *"After a while people start clicking yes, yes, yes without really checking."*

Dit is een reëel gevaar. Na 30 minuten Claude Code gebruik wordt het verleidelijk om elke prompt te accepteren. Doe het niet.

**Tactiek:** neem na elke 5 toestemmingen 10 seconden pauze. Lees de volgende vraag echt. Het kost je 10 seconden en kan je uren debugging besparen.

## Scope Beperken

Beperk Claude Code's werkgebied:

- Werk altijd in een project-directory, niet in je home-folder
- Gebruik \`.gitignore\` — bestanden die git negeert, negeert Claude Code ook
- Geef MCP-servers minimale permissions (read-only waar mogelijk)
- Gebruik environment variables voor credentials, nooit hardcoded

**Bij Worldline specifiek:**
- Geen access tot productie-databases vanuit Claude Code
- Geen PCI-gerelateerde directories in de werkscope
- MCP-servers alleen met corporate auth tokens`;

const LESSON_7_5_EN = `# Lesson 7.5 — Permission Management and Working Safely

## The Reality

Claude Code has access to your filesystem. It can read files, write files, and run commands. That's powerful. And it makes safe working not optional — it makes it essential.

## Permission Modes

Claude Code has three permission modes:

**Default Mode:**
- Reads files: automatically allowed
- Writes files: asks permission
- Runs commands: asks permission
- The safest mode. Start here.

**Accept Edits Mode:**
- Reads files: automatically allowed
- Writes files: automatically allowed
- Runs commands: asks permission
- Handier for experienced users, but you must review diffs.

**YOLO Mode (\`--dangerously-skip-permissions\`):**
- Everything automatically allowed
- **NEVER USE. NEVER.** It's in the guardrails.

Start with Default Mode. After a few weeks experience you can move to Accept Edits. YOLO doesn't exist in your vocabulary.

## What to Review

At every permission prompt, check:

**File changes:**
- Which file is being changed?
- Does the change match what you asked?
- Are there no files changed you didn't mention?

**Commands:**
- Which command is being run?
- Is it read-only or does it change something?
- Does it have side effects (network, database, deployment)?

**MCP calls:**
- Which external system is being accessed?
- Is it read-only or write?
- Does it contain sensitive data?

## The Permission Fatigue Trap

Gertjan warned about this: *"After a while people start clicking yes, yes, yes without really checking."*

This is a real danger. After 30 minutes using Claude Code it gets tempting to accept every prompt. Don't.

**Tactic:** after every 5 permissions, take a 10-second pause. Really read the next prompt. Costs 10 seconds, can save hours of debugging.

## Limiting Scope

Limit Claude Code's work area:

- Always work in a project directory, not your home folder
- Use \`.gitignore\` — files git ignores, Claude Code ignores too
- Give MCP servers minimum permissions (read-only where possible)
- Use environment variables for credentials, never hardcoded

**At Worldline specifically:**
- No access to production databases from Claude Code
- No PCI-related directories in the work scope
- MCP servers only with corporate auth tokens`;

const LESSON_7_5_FR = `# Leçon 7.5 — Gestion des Permissions et Travail Sécurisé

## La Réalité

Claude Code a accès à votre filesystem. Il peut lire des fichiers, en écrire, et lancer des commandes. C'est puissant. Et ça rend le travail sécurisé non optionnel — c'est essentiel.

## Modes de Permission

Claude Code a trois modes de permission :

**Default Mode :**
- Lire fichiers : automatiquement autorisé
- Écrire fichiers : demande permission
- Lancer commandes : demande permission
- Le mode le plus sûr. Commencez ici.

**Accept Edits Mode :**
- Lire fichiers : automatiquement autorisé
- Écrire fichiers : automatiquement autorisé
- Lancer commandes : demande permission
- Plus pratique pour utilisateurs expérimentés, mais vous devez reviewer les diffs.

**YOLO Mode (\`--dangerously-skip-permissions\`) :**
- Tout automatiquement autorisé
- **JAMAIS UTILISER. JAMAIS.** C'est dans les guardrails.

Commencez avec Default Mode. Après quelques semaines d'expérience vous pouvez passer à Accept Edits. YOLO n'existe pas dans votre vocabulaire.

## Ce Qu'il Faut Reviewer

À chaque permission prompt, vérifiez :

**Modifications fichiers :**
- Quel fichier est modifié ?
- La modif correspond-elle à ce que vous avez demandé ?
- Y a-t-il des fichiers modifiés que vous n'aviez pas mentionnés ?

**Commandes :**
- Quelle commande est lancée ?
- Read-only ou modifiant ?
- Effets de bord (réseau, base, déploiement) ?

**Calls MCP :**
- Quel système externe est accédé ?
- Read-only ou write ?
- Contient-il des données sensibles ?

## Le Permission Fatigue Trap

Gertjan a prévenu : *« After a while people start clicking yes, yes, yes without really checking. »*

Danger réel. Après 30 minutes d'utilisation Claude Code il devient tentant d'accepter chaque prompt. Ne le faites pas.

**Tactique :** après chaque 5 permissions, prenez une pause de 10 secondes. Lisez vraiment le prompt suivant. Ça coûte 10 secondes, ça peut économiser des heures de debug.

## Limiter la Scope

Limitez la zone de travail de Claude Code :

- Travaillez toujours dans un dossier projet, pas dans votre home
- Utilisez \`.gitignore\` — les fichiers que git ignore, Claude Code ignore aussi
- Donnez aux serveurs MCP les permissions minimum (read-only si possible)
- Utilisez env vars pour credentials, jamais hardcoded

**Chez Worldline spécifiquement :**
- Pas d'accès aux bases prod depuis Claude Code
- Pas de dossiers liés à PCI dans la scope
- Serveurs MCP uniquement avec tokens corporate`;

// ─── LAB 7A — MCP Server (GitLab) ────────────────────────────────────────────

const LAB_7A_NL = `# Lab 7A — MCP Server Bouwen: Read-Only GitLab (30 min)

Je gaat een MCP-server configureren die Claude Code verbindt met jullie GitLab. Na dit lab kan Claude Code je merge requests lezen, pipeline status checken, en code history doorzoeken — allemaal vanuit de terminal.

## Stap 1: Configuratie (10 min)

Maak een \`.claude.json\` in je project root (als die er nog niet is):

\`\`\`json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-gitlab"],
      "env": {
        "GITLAB_TOKEN": "$GITLAB_TOKEN",
        "GITLAB_URL": "https://gitlab.worldline.com"
      }
    }
  }
}
\`\`\`

Zorg dat je \`GITLAB_TOKEN\` environment variable is ingesteld met een Personal Access Token (read-only scope).

**Belangrijk:** gebruik een token met ALLEEN read access. Geen write. Geen admin. Read-only.

## Stap 2: Test (10 min)

Start Claude Code en test de verbinding:

> "Welke repositories heb ik toegang tot?"
> "Toon de laatste 5 merge requests voor [project-naam]"
> "Wat is de status van de CI/CD pipeline voor de main branch?"

Als het werkt, heb je nu live GitLab-data in Claude Code.

## Stap 3: Gebruik (10 min)

Probeer een echte taak:

> "Review MR #[nummer] — check de code changes op onze team-conventies"
> "Welke bestanden zijn gewijzigd in de laatste 3 commits op main?"
> "Zijn er merge conflicts tussen mijn branch en main?"

**Deliverable:** Werkende GitLab MCP-configuratie + screenshots van 3 succesvolle queries.`;

const LAB_7A_EN = `# Lab 7A — Build an MCP Server: Read-Only GitLab (30 min)

You will configure an MCP server that connects Claude Code to your GitLab. After this lab Claude Code can read your merge requests, check pipeline status, and search code history — all from the terminal.

## Step 1: Configuration (10 min)

Create a \`.claude.json\` in your project root (if it doesn't exist):

\`\`\`json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-gitlab"],
      "env": {
        "GITLAB_TOKEN": "$GITLAB_TOKEN",
        "GITLAB_URL": "https://gitlab.worldline.com"
      }
    }
  }
}
\`\`\`

Make sure your \`GITLAB_TOKEN\` env var is set with a Personal Access Token (read-only scope).

**Important:** use a token with ONLY read access. No write. No admin. Read-only.

## Step 2: Test (10 min)

Start Claude Code and test the connection:

> "Which repositories do I have access to?"
> "Show the last 5 merge requests for [project-name]"
> "What's the status of the CI/CD pipeline on main?"

If it works, you now have live GitLab data in Claude Code.

## Step 3: Usage (10 min)

Try a real task:

> "Review MR #[number] — check the code changes against our team conventions"
> "Which files changed in the last 3 commits on main?"
> "Are there merge conflicts between my branch and main?"

**Deliverable:** Working GitLab MCP configuration + screenshots of 3 successful queries.`;

const LAB_7A_FR = `# Lab 7A — Construire un Serveur MCP : Read-Only GitLab (30 min)

Vous allez configurer un serveur MCP qui connecte Claude Code à votre GitLab. Après ce lab, Claude Code peut lire vos merge requests, vérifier statut pipeline, et chercher dans l'historique code — tout depuis le terminal.

## Étape 1 : Configuration (10 min)

Créez un \`.claude.json\` dans la racine de votre projet :

\`\`\`json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-gitlab"],
      "env": {
        "GITLAB_TOKEN": "$GITLAB_TOKEN",
        "GITLAB_URL": "https://gitlab.worldline.com"
      }
    }
  }
}
\`\`\`

Assurez-vous que votre \`GITLAB_TOKEN\` env var est set avec un Personal Access Token (scope read-only).

**Important :** utilisez un token avec UNIQUEMENT accès read. Pas write. Pas admin. Read-only.

## Étape 2 : Test (10 min)

Lancez Claude Code et testez la connexion :

> « À quels repositories ai-je accès ? »
> « Montre les 5 dernières merge requests pour [nom-projet] »
> « Quel est le statut de la pipeline CI/CD sur main ? »

Si ça marche, vous avez maintenant des données GitLab live dans Claude Code.

## Étape 3 : Utilisation (10 min)

Essayez une vraie tâche :

> « Review MR #[numéro] — vérifie les changements contre nos conventions équipe »
> « Quels fichiers ont changé dans les 3 derniers commits sur main ? »
> « Y a-t-il des conflits de merge entre ma branche et main ? »

**Deliverable :** Config GitLab MCP fonctionnelle + screenshots de 3 queries réussies.`;

// ─── LAB 7B — Skill Bouwen ───────────────────────────────────────────────────

const LAB_7B_NL = `# Lab 7B — Skill Bouwen en Delen (45 min)

Je gaat een skill bouwen voor een terugkerende taak in je dagelijks werk, en die delen met je squad.

## Stap 1: Identificeer Je Terugkerende Taak (5 min)

Welke taak doe je minstens 1x per week met AI? Voorbeelden:
- Code review op team-standaarden
- Release notes schrijven
- Sprint rapportage samenvatten
- Incident post-mortem structureren
- Merge request beschrijving schrijven

Kies er één.

## Stap 2: Schrijf de Skill (15 min)

Maak het bestand:
\`project-root/.claude/skills/[skill-naam]/SKILL.md\`

**Structuur:**

\`\`\`markdown
---
name: [skill-naam]
description: [één zin — specifiek genoeg voor auto-trigger]
---

# [Skill Naam]

## Wanneer
[Beschrijf wanneer deze skill actief wordt]

## Instructies
[Stap-voor-stap proces]

## Output Format
[Beschrijf exact hoe de output eruit moet zien]

## Constraints
[Wat mag niet — Worldline guardrails]

## Voorbeeld
[Geef een concreet voorbeeld van input → output]
\`\`\`

## Stap 3: Test (10 min)

Run je skill 3 keer op verschillende input:

\`\`\`bash
claude /[skill-naam] @[bestand-1]
claude /[skill-naam] @[bestand-2]
claude /[skill-naam] @[bestand-3]
\`\`\`

Is de output consistent? Volgt het je format? Zijn de guardrails intact?

## Stap 4: Peer Review (10 min)

Wissel skills met je buurman. Review op:
- Is de beschrijving specifiek genoeg?
- Zijn de instructies helder?
- Zijn de guardrails compleet (geen PCI data, geen credentials)?
- Zou je deze skill zelf gebruiken?

Geef feedback. Pas je skill aan op basis van de feedback.

## Stap 5: Commit en Deel (5 min)

Commit je skill in de repository. Nu kan iedereen in je squad hem gebruiken.

**Deliverable:** Een werkende, gereviewed skill in de project-repository.`;

const LAB_7B_EN = `# Lab 7B — Build and Share a Skill (45 min)

You will build a skill for a recurring task in your daily work, and share it with your squad.

## Step 1: Identify Your Recurring Task (5 min)

Which task do you do at least 1x per week with AI? Examples:
- Code review against team standards
- Writing release notes
- Summarising sprint reports
- Structuring incident post-mortems
- Writing MR descriptions

Pick one.

## Step 2: Write the Skill (15 min)

Create the file:
\`project-root/.claude/skills/[skill-name]/SKILL.md\`

**Structure:**

\`\`\`markdown
---
name: [skill-name]
description: [one sentence — specific enough to auto-trigger]
---

# [Skill Name]

## When
[Describe when this skill activates]

## Instructions
[Step-by-step process]

## Output Format
[Describe exactly what the output should look like]

## Constraints
[What is not allowed — Worldline guardrails]

## Example
[Give a concrete input → output example]
\`\`\`

## Step 3: Test (10 min)

Run your skill 3 times on different input:

\`\`\`bash
claude /[skill-name] @[file-1]
claude /[skill-name] @[file-2]
claude /[skill-name] @[file-3]
\`\`\`

Is the output consistent? Does it follow your format? Are guardrails intact?

## Step 4: Peer Review (10 min)

Swap skills with your neighbour. Review on:
- Is the description specific enough?
- Are the instructions clear?
- Are the guardrails complete (no PCI data, no credentials)?
- Would you use this skill yourself?

Give feedback. Adjust your skill based on feedback.

## Step 5: Commit and Share (5 min)

Commit your skill in the repository. Now everyone in your squad can use it.

**Deliverable:** A working, reviewed skill in the project repository.`;

const LAB_7B_FR = `# Lab 7B — Construire et Partager un Skill (45 min)

Vous allez construire un skill pour une tâche récurrente de votre travail quotidien, et le partager avec votre squad.

## Étape 1 : Identifier Votre Tâche Récurrente (5 min)

Quelle tâche faites-vous au moins 1x par semaine avec l'IA ? Exemples :
- Code review selon standards équipe
- Écrire release notes
- Résumer rapports sprint
- Structurer post-mortems incidents
- Écrire descriptions MR

Choisissez-en une.

## Étape 2 : Écrire le Skill (15 min)

Créez le fichier :
\`project-root/.claude/skills/[nom-skill]/SKILL.md\`

**Structure :**

\`\`\`markdown
---
name: [nom-skill]
description: [une phrase — assez spécifique pour auto-trigger]
---

# [Nom Skill]

## Quand
[Décrivez quand ce skill s'active]

## Instructions
[Processus étape par étape]

## Format de Sortie
[Décrivez exactement à quoi doit ressembler la sortie]

## Contraintes
[Ce qui n'est pas autorisé — Worldline guardrails]

## Exemple
[Donnez un exemple concret input → output]
\`\`\`

## Étape 3 : Test (10 min)

Lancez votre skill 3 fois sur input différent :

\`\`\`bash
claude /[nom-skill] @[fichier-1]
claude /[nom-skill] @[fichier-2]
claude /[nom-skill] @[fichier-3]
\`\`\`

La sortie est-elle cohérente ? Suit-elle votre format ? Les guardrails sont-ils intacts ?

## Étape 4 : Peer Review (10 min)

Échangez skills avec votre voisin. Review sur :
- La description est-elle assez spécifique ?
- Les instructions sont-elles claires ?
- Les guardrails sont-ils complets ?
- Utiliseriez-vous ce skill vous-même ?

Donnez feedback. Ajustez votre skill.

## Étape 5 : Commit et Partage (5 min)

Commit votre skill dans le repository. Maintenant toute votre squad peut l'utiliser.

**Deliverable :** Un skill fonctionnel et reviewé dans le repo projet.`;

// ═════════════════════════════════════════════════════════════════════════════
// ── WEEK 6 EXPORT ───────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

export const WEEK_6: CurriculumWeek = {
  id: 'week-6',
  number: 6,
  title: 'Level 7 — Claude Code Mastery',
  titleI18n: {
    en: 'Level 7 — Claude Code Mastery',
    nl: 'Level 7 — Claude Code Mastery',
    fr: 'Level 7 — Claude Code Mastery',
  },
  subtitle: 'Your AI Development Environment · van chat naar engineering',
  subtitleI18n: {
    en: 'Your AI Development Environment · from chat to engineering',
    nl: 'Your AI Development Environment · van chat naar engineering',
    fr: 'Your AI Development Environment · du chat à l\'engineering',
  },
  description:
    'Na dit level kun je Claude Code als volwaardige development-omgeving gebruiken. Je begrijpt MCP-servers, kunt er zelf een bouwen, kent het verschil tussen skills en agents, hebt je persoonlijke workflow geoptimaliseerd en past permission management toe. Van chat naar engineering — review wordt je hoofdtaak.',
  descriptionI18n: {
    en: 'After this level you can use Claude Code as a full development environment. You understand MCP servers, can build one yourself, know the difference between skills and agents, have optimised your personal workflow, and apply permission management. From chat to engineering — review becomes your main task.',
    nl: 'Na dit level kun je Claude Code als volwaardige development-omgeving gebruiken. Je begrijpt MCP-servers, kunt er zelf een bouwen, kent het verschil tussen skills en agents, hebt je persoonlijke workflow geoptimaliseerd en past permission management toe. Van chat naar engineering — review wordt je hoofdtaak.',
    fr: 'Après ce niveau vous utilisez Claude Code comme environnement dev complet. Vous comprenez les serveurs MCP, pouvez en construire un, connaissez la différence skills vs agents, avez optimisé votre workflow personnel, et appliquez la gestion des permissions.',
  },
  objectives: [
    'Werk met Claude Code als CLI — @-mentions, headless mode, /clear-/compact-/cost commando\'s',
    'Configureer MCP-servers (GitLab/Jira/Postgres) en ken de CLI-vs-MCP afweging',
    'Schrijf, test, en deel skills (SKILL.md format) · kent verschil skill vs agent',
    'Integreer Claude Code in je dagelijkse dev-workflow · review-centered development',
    'Pas permission management consistent toe · Default Mode default · NOOIT --dangerously-skip-permissions',
  ],
  objectivesI18n: {
    en: [
      'Work with Claude Code as CLI — @-mentions, headless mode, /clear /compact /cost commands',
      'Configure MCP servers (GitLab/Jira/Postgres) and know the CLI-vs-MCP trade-off',
      'Write, test, and share skills (SKILL.md format) · know skill vs agent difference',
      'Integrate Claude Code into your daily dev workflow · review-centered development',
      'Apply permission management consistently · Default Mode by default · NEVER --dangerously-skip-permissions',
    ],
    nl: [
      'Werk met Claude Code als CLI — @-mentions, headless mode, /clear-/compact-/cost commando\'s',
      'Configureer MCP-servers (GitLab/Jira/Postgres) en ken de CLI-vs-MCP afweging',
      'Schrijf, test, en deel skills (SKILL.md format) · kent verschil skill vs agent',
      'Integreer Claude Code in je dagelijkse dev-workflow · review-centered development',
      'Pas permission management consistent toe · Default Mode default · NOOIT --dangerously-skip-permissions',
    ],
    fr: [
      'Travaillez avec Claude Code comme CLI — @-mentions, mode headless',
      'Configurez serveurs MCP (GitLab/Jira/Postgres) et connaissez l\'arbitrage CLI-vs-MCP',
      'Écrivez, testez, et partagez des skills (format SKILL.md) · connaissez skill vs agent',
      'Intégrez Claude Code dans votre workflow dev quotidien',
      'Appliquez la gestion des permissions · JAMAIS --dangerously-skip-permissions',
    ],
  },
  targetAudience: 'Alle Worldline engineers — alle squads',
  targetAudienceI18n: {
    en: 'All Worldline engineers — all squads',
    nl: 'Alle Worldline engineers — alle squads',
    fr: 'Tous les ingénieurs Worldline — toutes les squads',
  },
  bloomLevels: [3, 4, 5],
  complianceRelevant: true,
  badgeName: 'Tool Builder',
  badgeNameI18n: {
    en: 'Tool Builder',
    nl: 'Tool Builder',
    fr: 'Tool Builder',
  },
  badgeIcon: '🛠️',
  weeklyQuiz: [
    {
      id: 'w6-q1',
      question: 'Wat is het kernverschil tussen LibreChat en Claude Code?',
      questionI18n: {
        en: 'What is the core difference between LibreChat and Claude Code?',
        nl: 'Wat is het kernverschil tussen LibreChat en Claude Code?',
        fr: 'Quelle est la différence clé entre LibreChat et Claude Code ?',
      },
      options: [
        'LibreChat is sneller dan Claude Code',
        'Claude Code werkt IN je codebase (lees/schrijft bestanden, runt commands), LibreChat werkt NAAST (copy-paste)',
        'Claude Code gebruikt andere modellen',
        'LibreChat heeft betere UI',
      ],
      optionsI18n: {
        en: [
          'LibreChat is faster than Claude Code',
          'Claude Code works IN your codebase (read/write files, run commands), LibreChat works NEXT TO (copy-paste)',
          'Claude Code uses different models',
          'LibreChat has a better UI',
        ],
        nl: [
          'LibreChat is sneller dan Claude Code',
          'Claude Code werkt IN je codebase (lees/schrijft bestanden, runt commands), LibreChat werkt NAAST (copy-paste)',
          'Claude Code gebruikt andere modellen',
          'LibreChat heeft betere UI',
        ],
        fr: [
          'LibreChat est plus rapide',
          'Claude Code travaille DANS votre codebase (lit/écrit fichiers, lance commandes), LibreChat travaille À CÔTÉ',
          'Claude Code utilise des modèles différents',
          'LibreChat a une meilleure UI',
        ],
      },
      correctIndex: 1,
      explanation: 'Claude Code is CLI-native — minder copy-paste, minder context-wisseling. @-mentions voor file referentie, /clear-/compact-/cost commands, automatic CLAUDE.md loading.',
      explanationI18n: {
        en: 'Claude Code is CLI-native — less copy-paste, less context switching. @-mentions for file references, /clear /compact /cost commands, automatic CLAUDE.md loading.',
        nl: 'Claude Code is CLI-native — minder copy-paste, minder context-wisseling. @-mentions voor file referentie, /clear-/compact-/cost commands, automatic CLAUDE.md loading.',
        fr: 'Claude Code est CLI-native — moins de copy-paste, moins de switch context. @-mentions pour fichiers, commandes /clear /compact /cost.',
      },
      bloomLevel: 1,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w6-q2',
      question: 'Wanneer gebruik je MCP in plaats van een CLI?',
      questionI18n: {
        en: 'When do you use MCP instead of a CLI?',
        nl: 'Wanneer gebruik je MCP in plaats van een CLI?',
        fr: 'Quand utilisez-vous MCP au lieu d\'une CLI ?',
      },
      options: [
        'Altijd — MCP is altijd beter',
        'Als er geen goede CLI bestaat (Jira/Confluence/Slack) · gebruik CLI wel voor git/kubectl/psql',
        'Alleen voor read-only access',
        'Nooit — altijd de CLI',
      ],
      optionsI18n: {
        en: [
          'Always — MCP is always better',
          'When no good CLI exists (Jira/Confluence/Slack) · use CLI for git/kubectl/psql',
          'Only for read-only access',
          'Never — always the CLI',
        ],
        nl: [
          'Altijd — MCP is altijd beter',
          'Als er geen goede CLI bestaat (Jira/Confluence/Slack) · gebruik CLI wel voor git/kubectl/psql',
          'Alleen voor read-only access',
          'Nooit — altijd de CLI',
        ],
        fr: [
          'Toujours — MCP est toujours mieux',
          'Quand pas de bonne CLI (Jira/Confluence/Slack) · utilisez CLI pour git/kubectl/psql',
          'Uniquement pour read-only',
          'Jamais — toujours la CLI',
        ],
      },
      correctIndex: 1,
      explanation: 'CLIs zijn goedkoper (minder tokens), sneller, en beter auditeerbaar. Gebruik MCP voor systemen zonder goede CLI. Level 3 preview → Level 7 werkelijkheid.',
      explanationI18n: {
        en: 'CLIs are cheaper (fewer tokens), faster, and more auditable. Use MCP for systems without a good CLI. Level 3 preview → Level 7 reality.',
        nl: 'CLIs zijn goedkoper (minder tokens), sneller, en beter auditeerbaar. Gebruik MCP voor systemen zonder goede CLI. Level 3 preview → Level 7 werkelijkheid.',
        fr: 'Les CLIs sont moins chères (moins de tokens), plus rapides, mieux auditables. MCP pour systèmes sans bonne CLI.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w6-q3',
      question: 'Wat is het verschil tussen een skill en een agent?',
      questionI18n: {
        en: 'What is the difference between a skill and an agent?',
        nl: 'Wat is het verschil tussen een skill en een agent?',
        fr: 'Quelle est la différence entre un skill et un agent ?',
      },
      options: [
        'Skills zijn gratis, agents kosten geld',
        'Skill = set instructies die JIJ activeert · Agent = skill die ZELFSTANDIG handelt',
        'Agents zijn verouderd, alleen skills meer',
        'Geen verschil — synoniemen',
      ],
      optionsI18n: {
        en: [
          'Skills are free, agents cost money',
          'Skill = instruction set YOU activate · Agent = skill that acts AUTONOMOUSLY',
          'Agents are deprecated, only skills now',
          'No difference — synonyms',
        ],
        nl: [
          'Skills zijn gratis, agents kosten geld',
          'Skill = set instructies die JIJ activeert · Agent = skill die ZELFSTANDIG handelt',
          'Agents zijn verouderd, alleen skills meer',
          'Geen verschil — synoniemen',
        ],
        fr: [
          'Skills sont gratuits, agents coûtent',
          'Skill = instructions que VOUS activez · Agent = skill qui agit AUTONOMEMENT',
          'Agents sont dépréciés',
          'Pas de différence',
        ],
      },
      correctIndex: 1,
      explanation: 'Skill: jij activeert, jij stuurt, jij keurt goed. Agent: handelt autonoom. Bij Worldline: agents vereisen extra guardrails — review pattern uit Level 6 blijft gelden (geen autonome deploy naar prod).',
      explanationI18n: {
        en: 'Skill: you activate, you direct, you approve. Agent: acts autonomously. At Worldline: agents need extra guardrails — review pattern from Level 6 still applies (no autonomous deploy to prod).',
        nl: 'Skill: jij activeert, jij stuurt, jij keurt goed. Agent: handelt autonoom. Bij Worldline: agents vereisen extra guardrails — review pattern uit Level 6 blijft gelden (geen autonome deploy naar prod).',
        fr: 'Skill : vous activez, vous dirigez, vous approuvez. Agent : agit autonomement. Chez Worldline : agents nécessitent guardrails supplémentaires.',
      },
      bloomLevel: 2,
      euAiActRelevant: true,
      points: 10,
    },
    {
      id: 'w6-q4',
      question: 'Welke 3 permission modes heeft Claude Code en welke is verboden bij Worldline?',
      questionI18n: {
        en: 'What 3 permission modes does Claude Code have and which is forbidden at Worldline?',
        nl: 'Welke 3 permission modes heeft Claude Code en welke is verboden bij Worldline?',
        fr: 'Quels 3 modes de permission a Claude Code et lequel est interdit chez Worldline ?',
      },
      options: [
        'Read / Write / Execute — alle drie toegestaan',
        'Default / Accept Edits / YOLO (--dangerously-skip-permissions) — YOLO is VERBODEN',
        'Admin / User / Guest — Admin is verboden',
        'Safe / Normal / Fast — Fast is verboden',
      ],
      optionsI18n: {
        en: [
          'Read / Write / Execute — all three allowed',
          'Default / Accept Edits / YOLO (--dangerously-skip-permissions) — YOLO is FORBIDDEN',
          'Admin / User / Guest — Admin is forbidden',
          'Safe / Normal / Fast — Fast is forbidden',
        ],
        nl: [
          'Read / Write / Execute — alle drie toegestaan',
          'Default / Accept Edits / YOLO (--dangerously-skip-permissions) — YOLO is VERBODEN',
          'Admin / User / Guest — Admin is verboden',
          'Safe / Normal / Fast — Fast is verboden',
        ],
        fr: [
          'Read / Write / Execute',
          'Default / Accept Edits / YOLO (--dangerously-skip-permissions) — YOLO INTERDIT',
          'Admin / User / Guest',
          'Safe / Normal / Fast',
        ],
      },
      correctIndex: 1,
      explanation: 'Default = alles vraagt permission (veiligste). Accept Edits = reads/writes auto, commands vraagt. YOLO = alles auto — NOOIT gebruiken (staat in Worldline guardrails, Gertjan: permission fatigue trap).',
      explanationI18n: {
        en: 'Default = everything asks permission (safest). Accept Edits = reads/writes auto, commands asks. YOLO = all auto — NEVER use (in Worldline guardrails, Gertjan: permission fatigue trap).',
        nl: 'Default = alles vraagt permission (veiligste). Accept Edits = reads/writes auto, commands vraagt. YOLO = alles auto — NOOIT gebruiken (staat in Worldline guardrails, Gertjan: permission fatigue trap).',
        fr: 'Default = tout demande permission. Accept Edits = reads/writes auto. YOLO = tout auto — JAMAIS utiliser.',
      },
      bloomLevel: 2,
      euAiActRelevant: true,
      points: 10,
    },
    {
      id: 'w6-q5',
      question: 'Wat is de "productivity stack" voor Claude Code workflow?',
      questionI18n: {
        en: 'What is the "productivity stack" for Claude Code workflow?',
        nl: 'Wat is de "productivity stack" voor Claude Code workflow?',
        fr: 'Quel est le « productivity stack » pour le workflow Claude Code ?',
      },
      options: [
        'Alleen Claude Code',
        'LibreChat (brainstorm) + Claude Code (implement) + CLAUDE.md (context) + Skills (workflows) + MCP (integraties)',
        'Claude Code + VS Code',
        'Alleen MCP servers',
      ],
      optionsI18n: {
        en: [
          'Just Claude Code',
          'LibreChat (brainstorm) + Claude Code (implement) + CLAUDE.md (context) + Skills (workflows) + MCP (integrations)',
          'Claude Code + VS Code',
          'Just MCP servers',
        ],
        nl: [
          'Alleen Claude Code',
          'LibreChat (brainstorm) + Claude Code (implement) + CLAUDE.md (context) + Skills (workflows) + MCP (integraties)',
          'Claude Code + VS Code',
          'Alleen MCP servers',
        ],
        fr: [
          'Juste Claude Code',
          'LibreChat (brainstorm) + Claude Code (implement) + CLAUDE.md (context) + Skills (workflows) + MCP (intégrations)',
          'Claude Code + VS Code',
          'Juste MCP servers',
        ],
      },
      correctIndex: 1,
      explanation: 'Elk tool heeft zijn plek: LibreChat voor denken/vergelijken, Claude Code voor doen, CLAUDE.md voor automatische context, Skills voor terugkerende workflows, MCP voor live system access. Geen overlap.',
      explanationI18n: {
        en: 'Each tool has its place: LibreChat for thinking/comparing, Claude Code for doing, CLAUDE.md for auto context, Skills for recurring workflows, MCP for live system access. No overlap.',
        nl: 'Elk tool heeft zijn plek: LibreChat voor denken/vergelijken, Claude Code voor doen, CLAUDE.md voor automatische context, Skills voor terugkerende workflows, MCP voor live system access. Geen overlap.',
        fr: 'Chaque outil a sa place. Pas de chevauchement.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
  ],
  days: [
    // ───── DAG 1: Les 7.1 + Lab 7A ─────
    {
      day: 1,
      title: 'Les 7.1 — Van Chat naar CLI',
      titleI18n: {
        en: 'Lesson 7.1 — From Chat to CLI',
        nl: 'Les 7.1 — Van Chat naar CLI',
        fr: 'Leçon 7.1 — Du Chat au CLI',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w6d1-theory',
          title: 'Les 7.1 — Van Chat naar CLI',
          titleI18n: {
            en: 'Lesson 7.1 — From Chat to CLI',
            nl: 'Les 7.1 — Van Chat naar CLI',
            fr: 'Leçon 7.1 — Du Chat au CLI',
          },
          type: 'theory',
          duration: 20,
          description: 'Terminal > chat · @-mentions · /clear-/compact-/cost · headless mode · 3-laag context laden (~/.claude/CLAUDE.md + project + @)',
          descriptionI18n: {
            en: 'Terminal > chat · @-mentions · /clear /compact /cost · headless mode · 3-layer context loading',
            nl: 'Terminal > chat · @-mentions · /clear-/compact-/cost · headless mode · 3-laag context laden',
            fr: 'Terminal > chat · @-mentions · mode headless · 3 couches context',
          },
          content: LESSON_7_1_NL,
          contentI18n: { en: LESSON_7_1_EN, nl: LESSON_7_1_NL, fr: LESSON_7_1_FR },
        },
        {
          id: 'w6d1-lab',
          title: 'Lab 7A — MCP Server: Read-Only GitLab',
          titleI18n: {
            en: 'Lab 7A — MCP Server: Read-Only GitLab',
            nl: 'Lab 7A — MCP Server: Read-Only GitLab',
            fr: 'Lab 7A — Serveur MCP : Read-Only GitLab',
          },
          type: 'lab',
          duration: 30,
          description: '.claude.json GitLab config · GITLAB_TOKEN read-only scope · 3 query types (MR list / pipeline status / code history)',
          descriptionI18n: {
            en: '.claude.json GitLab config · GITLAB_TOKEN read-only · 3 query types (MR list / pipeline / code history)',
            nl: '.claude.json GitLab config · GITLAB_TOKEN read-only scope · 3 query types (MR list / pipeline status / code history)',
            fr: 'Config .claude.json GitLab · GITLAB_TOKEN read-only · 3 types de queries',
          },
          content: LAB_7A_NL,
          contentI18n: { en: LAB_7A_EN, nl: LAB_7A_NL, fr: LAB_7A_FR },
          exercises: [
            {
              id: 'w6d1-ex1',
              title: 'GitLab MCP werkend + 3 query screenshots',
              titleI18n: {
                en: 'GitLab MCP working + 3 query screenshots',
                nl: 'GitLab MCP werkend + 3 query screenshots',
                fr: 'MCP GitLab fonctionnel + 3 screenshots',
              },
              instructions: '.claude.json opzetten met read-only GITLAB_TOKEN. Claude Code herstarten. Test 3 queries (MRs, pipeline, commits). Screenshots opnemen als bewijs. Deliverable: werkende config + 3 screenshots.',
              instructionsI18n: {
                en: 'Set up .claude.json with read-only GITLAB_TOKEN. Restart Claude Code. Test 3 queries (MRs, pipeline, commits). Capture screenshots as proof. Deliverable: working config + 3 screenshots.',
                nl: '.claude.json opzetten met read-only GITLAB_TOKEN. Claude Code herstarten. Test 3 queries (MRs, pipeline, commits). Screenshots opnemen als bewijs. Deliverable: werkende config + 3 screenshots.',
                fr: 'Setup .claude.json avec GITLAB_TOKEN read-only. Redémarrez Claude Code. Testez 3 queries.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 2: Les 7.2 + CLI/MCP inventaris lab ─────
    {
      day: 2,
      title: 'Les 7.2 — MCP Servers: Bouw Je Eigen Integraties',
      titleI18n: {
        en: 'Lesson 7.2 — MCP Servers: Build Your Own Integrations',
        nl: 'Les 7.2 — MCP Servers: Bouw Je Eigen Integraties',
        fr: 'Leçon 7.2 — Serveurs MCP : Construisez Vos Intégrations',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w6d2-theory',
          title: 'Les 7.2 — MCP Servers: Bouw Je Eigen Integraties',
          titleI18n: {
            en: 'Lesson 7.2 — MCP Servers: Build Your Own Integrations',
            nl: 'Les 7.2 — MCP Servers: Bouw Je Eigen Integraties',
            fr: 'Leçon 7.2 — Serveurs MCP',
          },
          type: 'theory',
          duration: 20,
          description: 'MCP architectuur (Claude Code↔Server↔Systeem) · .claude.json config · CLIs-vs-MCPs afweging · Worldline-beschikbare servers',
          descriptionI18n: {
            en: 'MCP architecture · .claude.json config · CLIs-vs-MCPs trade-off · Worldline-available servers',
            nl: 'MCP architectuur (Claude Code↔Server↔Systeem) · .claude.json config · CLIs-vs-MCPs afweging · Worldline-beschikbare servers',
            fr: 'Architecture MCP · config .claude.json · arbitrage CLIs-vs-MCPs',
          },
          content: LESSON_7_2_NL,
          contentI18n: { en: LESSON_7_2_EN, nl: LESSON_7_2_NL, fr: LESSON_7_2_FR },
        },
        {
          id: 'w6d2-lab',
          title: 'Lab — CLI/MCP Inventaris Je Squad',
          titleI18n: {
            en: 'Lab — CLI/MCP Inventory Your Squad',
            nl: 'Lab — CLI/MCP Inventaris Je Squad',
            fr: 'Lab — Inventaire CLI/MCP Votre Squad',
          },
          type: 'lab',
          duration: 30,
          description: 'Lijst de systemen die je squad dagelijks gebruikt. Per systeem: CLI beschikbaar? MCP-kandidaat? Waarom? Prioriteer top-3 MCP-kandidaten.',
          descriptionI18n: {
            en: 'List systems your squad uses daily. Per system: CLI available? MCP candidate? Why? Prioritise top-3 MCP candidates.',
            nl: 'Lijst de systemen die je squad dagelijks gebruikt. Per systeem: CLI beschikbaar? MCP-kandidaat? Waarom? Prioriteer top-3 MCP-kandidaten.',
            fr: 'Listez systèmes utilisés quotidiennement. Par système : CLI ? Candidat MCP ? Priorisez top-3.',
          },
          content: LAB_7A_NL,
          contentI18n: { en: LAB_7A_EN, nl: LAB_7A_NL, fr: LAB_7A_FR },
          exercises: [
            {
              id: 'w6d2-ex1',
              title: 'CLI/MCP matrix + top-3 MCP kandidaten',
              titleI18n: {
                en: 'CLI/MCP matrix + top-3 MCP candidates',
                nl: 'CLI/MCP matrix + top-3 MCP kandidaten',
                fr: 'Matrice CLI/MCP + top-3 candidats MCP',
              },
              instructions: '5-10 systemen die je squad gebruikt (GitLab/Jira/Confluence/Slack/Postgres/Grafana/etc). Per systeem: heeft CLI? Hoe goed? MCP gewenst? Waarom? Deliverable: matrix + top-3 prioriteiten met kosten/baten.',
              instructionsI18n: {
                en: '5-10 systems your squad uses (GitLab/Jira/Confluence/Slack/Postgres/Grafana/etc). Per system: has CLI? How good? MCP wanted? Why? Deliverable: matrix + top-3 priorities with cost/benefit.',
                nl: '5-10 systemen die je squad gebruikt (GitLab/Jira/Confluence/Slack/Postgres/Grafana/etc). Per systeem: heeft CLI? Hoe goed? MCP gewenst? Waarom? Deliverable: matrix + top-3 prioriteiten met kosten/baten.',
                fr: '5-10 systèmes squad. Par système : CLI ? MCP souhaité ? Deliverable : matrice + top-3.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 3: Les 7.3 + Lab 7B Skill Bouwen ─────
    {
      day: 3,
      title: 'Les 7.3 — Skills en Agents: Herbruikbare AI-Workflows',
      titleI18n: {
        en: 'Lesson 7.3 — Skills and Agents: Reusable AI Workflows',
        nl: 'Les 7.3 — Skills en Agents: Herbruikbare AI-Workflows',
        fr: 'Leçon 7.3 — Skills et Agents : Workflows IA Réutilisables',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w6d3-theory',
          title: 'Les 7.3 — Skills en Agents',
          titleI18n: {
            en: 'Lesson 7.3 — Skills and Agents',
            nl: 'Les 7.3 — Skills en Agents',
            fr: 'Leçon 7.3 — Skills et Agents',
          },
          type: 'theory',
          duration: 20,
          description: 'SKILL.md format (name/description/when/instructions/output/constraints) · persoonlijk vs project · skill vs agent (review pattern) · 5 best practices',
          descriptionI18n: {
            en: 'SKILL.md format · personal vs project · skill vs agent (review pattern) · 5 best practices',
            nl: 'SKILL.md format (name/description/when/instructions/output/constraints) · persoonlijk vs project · skill vs agent (review pattern) · 5 best practices',
            fr: 'Format SKILL.md · personnel vs projet · skill vs agent · 5 best practices',
          },
          content: LESSON_7_3_NL,
          contentI18n: { en: LESSON_7_3_EN, nl: LESSON_7_3_NL, fr: LESSON_7_3_FR },
        },
        {
          id: 'w6d3-lab',
          title: 'Lab 7B — Skill Bouwen en Delen',
          titleI18n: {
            en: 'Lab 7B — Build and Share a Skill',
            nl: 'Lab 7B — Skill Bouwen en Delen',
            fr: 'Lab 7B — Construire et Partager un Skill',
          },
          type: 'lab',
          duration: 45,
          description: 'Kies terugkerende taak → SKILL.md schrijven → 3x testen op verschillende input → peer review → commit in project repo',
          descriptionI18n: {
            en: 'Pick recurring task → write SKILL.md → test 3x on different input → peer review → commit to project repo',
            nl: 'Kies terugkerende taak → SKILL.md schrijven → 3x testen op verschillende input → peer review → commit in project repo',
            fr: 'Choisissez tâche récurrente → écrivez SKILL.md → testez 3x → peer review → commit',
          },
          content: LAB_7B_NL,
          contentI18n: { en: LAB_7B_EN, nl: LAB_7B_NL, fr: LAB_7B_FR },
          exercises: [
            {
              id: 'w6d3-ex1',
              title: 'Eigen skill gebouwd + gereviewd + gecommit',
              titleI18n: {
                en: 'Own skill built + reviewed + committed',
                nl: 'Eigen skill gebouwd + gereviewd + gecommit',
                fr: 'Skill personnel construit + reviewé + committé',
              },
              instructions: 'Kies taak uit je dagelijks werk. Schrijf SKILL.md volgens structuur (Wanneer/Instructies/Output/Constraints/Voorbeeld). Test 3x. Peer review met buurman. Commit in project repo. Deliverable: SKILL.md bestand + 3 test outputs + review feedback + commit.',
              instructionsI18n: {
                en: 'Pick task from your daily work. Write SKILL.md per structure (When/Instructions/Output/Constraints/Example). Test 3x. Peer review with neighbour. Commit to project repo. Deliverable: SKILL.md file + 3 test outputs + review feedback + commit.',
                nl: 'Kies taak uit je dagelijks werk. Schrijf SKILL.md volgens structuur (Wanneer/Instructies/Output/Constraints/Voorbeeld). Test 3x. Peer review met buurman. Commit in project repo. Deliverable: SKILL.md bestand + 3 test outputs + review feedback + commit.',
                fr: 'Choisissez tâche. Écrivez SKILL.md. Testez 3x. Peer review. Commit.',
              },
              type: 'free-form',
              difficulty: 3,
              points: 25,
            },
          ],
        },
      ],
    },
    // ───── DAG 4: Les 7.4 + full-day Claude Code lab ─────
    {
      day: 4,
      title: 'Les 7.4 — Workflow Integratie',
      titleI18n: {
        en: 'Lesson 7.4 — Workflow Integration',
        nl: 'Les 7.4 — Workflow Integratie',
        fr: 'Leçon 7.4 — Intégration Workflow',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w6d4-theory',
          title: 'Les 7.4 — Claude Code in Je Dev-Cyclus',
          titleI18n: {
            en: 'Lesson 7.4 — Claude Code in Your Dev Cycle',
            nl: 'Les 7.4 — Claude Code in Je Dev-Cyclus',
            fr: 'Leçon 7.4 — Claude Code dans Votre Cycle Dev',
          },
          type: 'theory',
          duration: 15,
          description: 'Dag-cyclus: ochtend context → taak uitvoeren → /cost + /clear · git integratie (altijd met approval) · IDE-agnostisch · productivity stack 5 tools',
          descriptionI18n: {
            en: 'Day cycle: morning context → run task → /cost + /clear · git integration (always with approval) · IDE-agnostic · productivity stack 5 tools',
            nl: 'Dag-cyclus: ochtend context → taak uitvoeren → /cost + /clear · git integratie (altijd met approval) · IDE-agnostisch · productivity stack 5 tools',
            fr: 'Cycle jour · intégration git (toujours avec approbation) · IDE-agnostic · stack 5 outils',
          },
          content: LESSON_7_4_NL,
          contentI18n: { en: LESSON_7_4_EN, nl: LESSON_7_4_NL, fr: LESSON_7_4_FR },
        },
        {
          id: 'w6d4-lab',
          title: 'Lab — Eén Dag Alleen in Claude Code',
          titleI18n: {
            en: 'Lab — One Day Only in Claude Code',
            nl: 'Lab — Eén Dag Alleen in Claude Code',
            fr: 'Lab — Une Journée Uniquement dans Claude Code',
          },
          type: 'lab',
          duration: 30,
          description: 'Eén werkdag alleen Claude Code voor implementatie. Geen LibreChat kopiëren-plakken. Meet: tijd/taak, review-uren vs write-uren.',
          descriptionI18n: {
            en: 'One workday only Claude Code for implementation. No LibreChat copy-paste. Measure: time/task, review hours vs write hours.',
            nl: 'Eén werkdag alleen Claude Code voor implementatie. Geen LibreChat kopiëren-plakken. Meet: tijd/taak, review-uren vs write-uren.',
            fr: 'Une journée uniquement Claude Code pour implémentation. Pas de copy-paste LibreChat. Mesurez : temps/tâche, review vs write.',
          },
          content: LAB_7B_NL,
          contentI18n: { en: LAB_7B_EN, nl: LAB_7B_NL, fr: LAB_7B_FR },
          exercises: [
            {
              id: 'w6d4-ex1',
              title: 'Dag-log + tijdsverdeling analyse',
              titleI18n: {
                en: 'Day log + time allocation analysis',
                nl: 'Dag-log + tijdsverdeling analyse',
                fr: 'Journal jour + analyse allocation temps',
              },
              instructions: 'Log per taak: wat deed je, hoeveel tijd, hoeveel review vs schrijven, hoeveel iteraties. Aan einde van dag: vergelijk met typische pre-Claude Code dag. Deliverable: dag-log + reflectie (5-10 regels) wat werkte en wat niet.',
              instructionsI18n: {
                en: 'Log per task: what did you do, how much time, review vs write, how many iterations. End of day: compare to typical pre-Claude Code day. Deliverable: day log + reflection (5-10 lines) what worked and what didn\'t.',
                nl: 'Log per taak: wat deed je, hoeveel tijd, hoeveel review vs schrijven, hoeveel iteraties. Aan einde van dag: vergelijk met typische pre-Claude Code dag. Deliverable: dag-log + reflectie (5-10 regels) wat werkte en wat niet.',
                fr: 'Log par tâche. Fin de jour : comparez avec journée pré-Claude Code. Deliverable : log + réflexion.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 5: Les 7.5 + Rol-opdracht Tool Builder Challenge ─────
    {
      day: 5,
      title: 'Les 7.5 — Permission Management en Veilig Werken',
      titleI18n: {
        en: 'Lesson 7.5 — Permission Management and Working Safely',
        nl: 'Les 7.5 — Permission Management en Veilig Werken',
        fr: 'Leçon 7.5 — Gestion des Permissions et Travail Sécurisé',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w6d5-theory',
          title: 'Les 7.5 — Permission Management',
          titleI18n: {
            en: 'Lesson 7.5 — Permission Management',
            nl: 'Les 7.5 — Permission Management',
            fr: 'Leçon 7.5 — Gestion des Permissions',
          },
          type: 'theory',
          duration: 15,
          description: '3 modes (Default/Accept Edits/YOLO) · wat reviewen (files/commands/MCP) · permission fatigue trap · scope beperken · Worldline-specifiek (geen prod DB/PCI dirs)',
          descriptionI18n: {
            en: '3 modes (Default/Accept Edits/YOLO) · what to review · permission fatigue trap · limit scope · Worldline specific',
            nl: '3 modes (Default/Accept Edits/YOLO) · wat reviewen (files/commands/MCP) · permission fatigue trap · scope beperken · Worldline-specifiek (geen prod DB/PCI dirs)',
            fr: '3 modes · que reviewer · permission fatigue trap · limiter scope',
          },
          content: LESSON_7_5_NL,
          contentI18n: { en: LESSON_7_5_EN, nl: LESSON_7_5_NL, fr: LESSON_7_5_FR },
        },
        {
          id: 'w6d5-lab',
          title: 'Rol-opdracht — De Tool Builder Challenge',
          titleI18n: {
            en: 'Role Assignment — The Tool Builder Challenge',
            nl: 'Rol-opdracht — De Tool Builder Challenge',
            fr: 'Mission de rôle — Le Tool Builder Challenge',
          },
          type: 'lab',
          duration: 60,
          description: 'Per rol: bouw iets bruikbaar voor je squad (MCP server / design skill / test skill / Jira wizard / presentation gen / MCP ecosystem). Deliverable peer-reviewable binnen 10 min setup.',
          descriptionI18n: {
            en: 'Per role: build something useful for your squad. Deliverable peer-reviewable within 10 min setup.',
            nl: 'Per rol: bouw iets bruikbaar voor je squad (MCP server / design skill / test skill / Jira wizard / presentation gen / MCP ecosystem). Deliverable peer-reviewable binnen 10 min setup.',
            fr: 'Par rôle : construisez quelque chose d\'utile pour votre squad.',
          },
          content: LAB_7B_NL,
          contentI18n: { en: LAB_7B_EN, nl: LAB_7B_NL, fr: LAB_7B_FR },
          exercises: [
            {
              id: 'w6d5-ex1',
              title: 'Tool Builder Challenge eigen rol-track',
              titleI18n: {
                en: 'Tool Builder Challenge your role track',
                nl: 'Tool Builder Challenge eigen rol-track',
                fr: 'Tool Builder Challenge votre rôle',
              },
              instructions: 'Kies je rol-track. Bouw de deliverable (MCP server / skill / workflow). Documenteer setup voor teamgenoten. Badge: teamgenoot kan je deliverable installeren en gebruiken binnen 10 minuten. Advanced: 3+ MCP-servers met cross-system queries.',
              instructionsI18n: {
                en: 'Pick your role track. Build the deliverable. Document setup for teammates. Badge: teammate can install and use within 10 minutes. Advanced: 3+ MCP servers with cross-system queries.',
                nl: 'Kies je rol-track. Bouw de deliverable (MCP server / skill / workflow). Documenteer setup voor teamgenoten. Badge: teamgenoot kan je deliverable installeren en gebruiken binnen 10 minuten. Advanced: 3+ MCP-servers met cross-system queries.',
                fr: 'Choisissez votre rôle. Construisez le deliverable. Documentez setup.',
              },
              type: 'free-form',
              difficulty: 3,
              points: 25,
            },
          ],
        },
      ],
    },
  ],
};
