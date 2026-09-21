// ─────────────────────────────────────────────────────────────────────────────
// WEEK 2 / LEVEL 3 — Context Engineering
// Source: docs/levels/level-3/source.md (Cons & Nina v1.0, 19 apr 2026)
// Shipped: 20 apr 2026
//
// Structure:
//   Dag 1: Les 3.1 Waarom Context Alles Is    + Lab 3A Confluence Pain
//   Dag 2: Les 3.2 CLAUDE.md: AI's Geheugen   + Lab 3B Bouw Je Kennisbank
//   Dag 3: Les 3.3 Atomic Documentation       + Lab 6 Context Architect role tracks
//   Dag 4: Les 3.4 Context Rot & Discipline   + Lab Session Hygiene Practice
//   Dag 5: Les 3.5 MCP Preview                 + Lab CLI vs MCP Decision
// ─────────────────────────────────────────────────────────────────────────────

import type { CurriculumWeek } from './curriculum';
import { dailySchedule } from './curriculum-schedule';

// ─── LES 3.1 — Waarom Context Alles Is ───────────────────────────────────────

const LESSON_3_1_NL = `# Les 3.1 — Waarom Context Alles Is

## Het Experiment

Neem deze prompt: "Review deze functie."

Geef hem aan Claude zonder context. Je krijgt generieke feedback. "Overweeg meer error handling." "Voeg comments toe." Nutteloos.

Geef nu dezelfde prompt aan Claude, maar voeg toe:
- Dit is Golang, niet Java
- Het is onderdeel van de settlement engine die dagelijks €2M verwerkt
- We draaien op Kubernetes met 3 replicas
- Ons team volgt de Uber Go Style Guide
- De functie moet thread-safe zijn

Zelfde model. Zelfde prompt. Compleet ander resultaat. De review gaat nu over race conditions, context propagation, graceful shutdown, en error wrapping — precies wat je nodig hebt.

**Dat verschil? Dat is context.**

## De 6 Context-Lagen

In Level 2 leerde je de CONTEXT-atoom van het Pentagon Model. Nu gaan we dieper. Er zijn zes lagen van context die je AI kunt geven — en de meeste mensen gebruiken er maar één of twee. Elke laag heeft zijn eigen \`.md\` file.

**Laag 1: Codebase**
Architectuur, dependencies, patronen, directory-structuur. Je AI moet weten hoe je project is opgebouwd om relevante suggesties te doen.

**Laag 2: Documentatie**
Confluence, README's, API specs, design docs. De geschreven kennis van je team. Hier zit een groot probleem — maar daarover meer in Les 3.3.

**Laag 3: Tickets**
Jira, sprint context, acceptance criteria. De AI weet niet dat je in sprint 14 zit en dat de deadline vrijdag is — tenzij je het vertelt.

**Laag 4: Team**
Wie doet wat, code conventies, review-afspraken, naming patterns. "Wij gebruiken errors.Wrap, niet fmt.Errorf" is context die het verschil maakt tussen bruikbare en onbruikbare code.

**Laag 5: Domein**
Betalingsverkeer, PCI-DSS, compliance, Worldline-specifieke regels. De AI weet niet dat je nooit PAN-data in logs mag schrijven — tenzij je het expliciet maakt.

**Laag 6: Geschiedenis**
Eerdere beslissingen, tech debt, migratie-status. "We zijn bezig met een migratie van monoliet naar microservices — gebruik het nieuwe service pattern, niet het oude" is context die voorkomt dat AI code genereert die je volgende week weer moet weggooien.

\`\`\`
project/
├── CLAUDE.md                      ← Laag 1: Codebase (architectuur, patronen)
├── docs/
│   └── context/
│       ├── documentation.md       ← Laag 2: Confluence/API specs samenvatting
│       ├── sprint-context.md      ← Laag 3: Tickets, sprint, deadline
│       ├── team-conventions.md    ← Laag 4: Code conventies, review-afspraken
│       ├── domain-rules.md        ← Laag 5: PCI-DSS, compliance, Worldline-regels
│       └── history.md             ← Laag 6: Tech debt, migraties, beslissingen
\`\`\`

**De 6 lagen = WAT je AI moet weten.**
**MCP = HOE je AI het te weten komt.**

Je hebt twee smaken:
- **Statisch:** \`.md\` files die je handmatig bijhoudt (goed voor lagen die weinig veranderen — Laag 5, Laag 4)
- **Dynamisch:** MCP-servers die live data ophalen (essentieel voor lagen die snel veranderen — Laag 3 tickets, Laag 1 code)

De slimste setup is een mix:

| Laag | Statisch | Dynamisch |
|------|----------|-----------|
| Laag 1: Codebase | \`CLAUDE.md\` | GitLab MCP |
| Laag 2: Documentatie | \`docs/context/documentation.md\` | Confluence MCP |
| Laag 3: Tickets | — | Jira MCP (puur dynamisch) |
| Laag 4: Team | \`team-conventions.md\` | — (puur statisch) |
| Laag 5: Domein | \`domain-rules.md\` | — (puur statisch) |
| Laag 6: Geschiedenis | \`history.md\` | GitLab MCP (git log, blame) |

## Context Is Niet Optioneel

In Level 1 leerde je dat het model geen geheugen heeft. Elke API call begint op nul.

In Level 2 leerde je dat CONTEXT een van de 5 atomen is van elke goede prompt.

In Level 3 gaan we een stap verder: context is niet zomaar een atoom — het is de **BELANGRIJKSTE** atoom. Je kunt een prompt schrijven zonder ROL en nog redelijk resultaat krijgen. Zonder FORMAT en het is nog bruikbaar. Maar zonder CONTEXT krijg je gegarandeerd rommel.

> "Het maakt niet uit hoe goed je prompt is als de AI niet weet waar het over gaat."

De rest van dit level leert je hoe je context structureert, opslaat, en beschikbaar maakt — zodat je het niet elke keer opnieuw hoeft te typen.`;

const LESSON_3_1_EN = `# Lesson 3.1 — Why Context Is Everything

## The Experiment

Take this prompt: "Review this function."

Give it to Claude without context. You get generic feedback. "Consider more error handling." "Add comments." Useless.

Now give the same prompt to Claude, but add:
- This is Golang, not Java
- It's part of the settlement engine processing €2M per day
- We run on Kubernetes with 3 replicas
- Our team follows the Uber Go Style Guide
- The function must be thread-safe

Same model. Same prompt. Completely different result. The review is now about race conditions, context propagation, graceful shutdown, and error wrapping — exactly what you need.

**That difference? That's context.**

## The 6 Context Layers

In Level 2 you learned the CONTEXT atom of the Pentagon Model. Now we go deeper. There are six layers of context you can give your AI — and most people use only one or two. Each layer has its own \`.md\` file.

**Layer 1: Codebase**
Architecture, dependencies, patterns, directory structure. Your AI must know how your project is structured to provide relevant suggestions.

**Layer 2: Documentation**
Confluence, READMEs, API specs, design docs. Your team's written knowledge. Here's a big problem — more on that in Lesson 3.3.

**Layer 3: Tickets**
Jira, sprint context, acceptance criteria. The AI doesn't know you're in sprint 14 and that the deadline is Friday — unless you tell it.

**Layer 4: Team**
Who does what, code conventions, review agreements, naming patterns. "We use errors.Wrap, not fmt.Errorf" is context that makes the difference between usable and unusable code.

**Layer 5: Domain**
Payments, PCI-DSS, compliance, Worldline-specific rules. The AI doesn't know you must never log PAN data — unless you make it explicit.

**Layer 6: History**
Past decisions, tech debt, migration status. "We're migrating from monolith to microservices — use the new service pattern, not the old" is context that prevents AI from generating code you'd have to throw away next week.

\`\`\`
project/
├── CLAUDE.md                      ← Layer 1: Codebase (architecture, patterns)
├── docs/
│   └── context/
│       ├── documentation.md       ← Layer 2: Confluence/API specs summary
│       ├── sprint-context.md      ← Layer 3: Tickets, sprint, deadline
│       ├── team-conventions.md    ← Layer 4: Code conventions, review agreements
│       ├── domain-rules.md        ← Layer 5: PCI-DSS, compliance, Worldline rules
│       └── history.md             ← Layer 6: Tech debt, migrations, decisions
\`\`\`

**The 6 layers = WHAT your AI needs to know.**
**MCP = HOW your AI finds it out.**

Two flavours:
- **Static:** \`.md\` files you maintain by hand (good for layers that rarely change — Layer 5, Layer 4)
- **Dynamic:** MCP servers that pull live data (essential for layers that change fast — Layer 3 tickets, Layer 1 code)

The smartest setup is a mix:

| Layer | Static | Dynamic |
|-------|--------|---------|
| Layer 1: Codebase | \`CLAUDE.md\` | GitLab MCP |
| Layer 2: Documentation | \`docs/context/documentation.md\` | Confluence MCP |
| Layer 3: Tickets | — | Jira MCP (purely dynamic) |
| Layer 4: Team | \`team-conventions.md\` | — (purely static) |
| Layer 5: Domain | \`domain-rules.md\` | — (purely static) |
| Layer 6: History | \`history.md\` | GitLab MCP (git log, blame) |

## Context Is Not Optional

Level 1: the model has no memory. Every API call starts from zero.
Level 2: CONTEXT is one of the 5 atoms of every good prompt.
Level 3 takes a step further: context isn't just an atom — it's **THE MOST IMPORTANT** atom. You can write a prompt without ROLE and still get reasonable output. Without FORMAT it's still usable. But without CONTEXT you guaranteed get garbage.

> "It doesn't matter how good your prompt is if the AI doesn't know what it's about."

The rest of this level teaches you how to structure, store, and make context available — so you don't have to type it again every time.`;

const LESSON_3_1_FR = `# Leçon 3.1 — Pourquoi le contexte est tout

## L'expérience

Prenez ce prompt : « Revois cette fonction. »

Donnez-le à Claude sans contexte. Vous obtenez du feedback générique. « Pensez à plus de gestion d'erreur. » « Ajoutez des commentaires. » Inutile.

Donnez maintenant le même prompt à Claude, mais ajoutez :
- C'est du Golang, pas du Java
- C'est une partie du settlement engine qui traite 2 M€ par jour
- On tourne sur Kubernetes avec 3 replicas
- Notre équipe suit le Uber Go Style Guide
- La fonction doit être thread-safe

Même modèle. Même prompt. Résultat complètement différent. La revue porte maintenant sur les race conditions, la propagation du context, le graceful shutdown, et l'error wrapping — exactement ce dont vous avez besoin.

**Cette différence ? C'est le contexte.**

## Les 6 couches de contexte

Au Level 2 vous avez appris l'atome CONTEXT du Pentagon Model. Maintenant on va plus loin. Il y a six couches de contexte que vous pouvez donner à votre IA — et la plupart des gens n'en utilisent qu'une ou deux. Chaque couche a son propre fichier \`.md\`.

**Couche 1 : Codebase**
Architecture, dépendances, patterns, structure des répertoires. Votre IA doit savoir comment votre projet est organisé pour faire des suggestions pertinentes.

**Couche 2 : Documentation**
Confluence, READMEs, specs API, design docs. La connaissance écrite de votre équipe. Il y a un gros problème ici — plus dans la Leçon 3.3.

**Couche 3 : Tickets**
Jira, contexte de sprint, critères d'acceptation. L'IA ne sait pas que vous êtes en sprint 14 et que la deadline est vendredi — sauf si vous le dites.

**Couche 4 : Équipe**
Qui fait quoi, conventions de code, accords de revue, patterns de nommage. « On utilise errors.Wrap, pas fmt.Errorf » est le contexte qui fait la différence entre du code utilisable et inutilisable.

**Couche 5 : Domaine**
Paiements, PCI-DSS, compliance, règles spécifiques Worldline. L'IA ne sait pas qu'il ne faut jamais logger les données PAN — sauf si vous le rendez explicite.

**Couche 6 : Historique**
Décisions passées, dette technique, statut de migration. « On migre du monolithe aux microservices — utilise le nouveau service pattern, pas l'ancien » est le contexte qui évite que l'IA génère du code à jeter la semaine suivante.

\`\`\`
project/
├── CLAUDE.md                      ← Couche 1 : Codebase (architecture, patterns)
├── docs/
│   └── context/
│       ├── documentation.md       ← Couche 2 : résumé Confluence/specs API
│       ├── sprint-context.md      ← Couche 3 : tickets, sprint, deadline
│       ├── team-conventions.md    ← Couche 4 : conventions code, revues
│       ├── domain-rules.md        ← Couche 5 : PCI-DSS, compliance, règles Worldline
│       └── history.md             ← Couche 6 : dette tech, migrations, décisions
\`\`\`

**Les 6 couches = CE QUE votre IA doit savoir.**
**MCP = COMMENT votre IA l'apprend.**

Deux saveurs :
- **Statique :** fichiers \`.md\` maintenus manuellement (bon pour les couches qui changent peu — Couche 5, Couche 4)
- **Dynamique :** serveurs MCP qui récupèrent des données live (essentiel pour les couches qui changent vite — Couche 3 tickets, Couche 1 code)

Le setup le plus intelligent est un mix :

| Couche | Statique | Dynamique |
|--------|----------|-----------|
| Couche 1 : Codebase | \`CLAUDE.md\` | GitLab MCP |
| Couche 2 : Documentation | \`docs/context/documentation.md\` | Confluence MCP |
| Couche 3 : Tickets | — | Jira MCP (purement dynamique) |
| Couche 4 : Équipe | \`team-conventions.md\` | — (purement statique) |
| Couche 5 : Domaine | \`domain-rules.md\` | — (purement statique) |
| Couche 6 : Historique | \`history.md\` | GitLab MCP (git log, blame) |

## Le contexte n'est pas optionnel

Level 1 : le modèle n'a pas de mémoire. Chaque appel API commence à zéro.
Level 2 : CONTEXT est l'un des 5 atomes de chaque bon prompt.
Level 3 va plus loin : le contexte n'est pas juste un atome — c'est **LE PLUS IMPORTANT**. Vous pouvez écrire un prompt sans ROLE et avoir encore un résultat raisonnable. Sans FORMAT c'est encore utilisable. Mais sans CONTEXT vous avez garanti de la rouille.

> « Peu importe la qualité de votre prompt si l'IA ne sait pas de quoi il s'agit. »

Le reste de ce niveau vous apprend à structurer, stocker et rendre disponible le contexte — pour ne pas avoir à le retaper à chaque fois.`;

// ─── LES 3.2 — CLAUDE.md ─────────────────────────────────────────────────────

const LESSON_3_2_NL = `# Les 3.2 — CLAUDE.md: Je AI's Geheugen

## Wat Is CLAUDE.md?

Het meest krachtige context-mechanisme dat je hebt.

Een CLAUDE.md-bestand in je project root is het eerste wat Claude Code leest wanneer je een gesprek start. Het is alsof je een nieuwe collega op dag 1 een briefing geeft: dit is onze stack, dit zijn onze conventies, dit mag je wel en niet doen.

Het wordt automatisch meegestuurd bij elke interactie. Je hoeft het niet te plakken, niet te @-mention-en, niet te herhalen. Het is er gewoon.

## Wat Erin Hoort

Een goede CLAUDE.md bevat vier secties:

### Stack & Architecture
Welke talen, frameworks, databases. Hoe je project is georganiseerd.

\`\`\`markdown
# Project: Settlement Engine

## Stack
- Golang 1.22
- PostgreSQL 15 via pgx
- Kubernetes (GKE)
- GitLab CI/CD

## Architecture
- /cmd/ — Entry points
- /internal/service/ — Business logic
- /internal/repository/ — Database layer
- /internal/api/ — HTTP handlers
\`\`\`

### Conventions
Code stijl, naming, patterns. De ongeschreven regels van je team.

\`\`\`markdown
## Conventions
- Error handling: errors.Wrap, nooit fmt.Errorf
- Naming: camelCase voor variabelen, PascalCase voor exports
- Tests: table-driven tests, testify voor assertions
- Commits: conventional commits (feat:, fix:, refactor:)
\`\`\`

### Do's & Don'ts
Wat de AI wel en niet mag doen. De non-negotiables.

\`\`\`markdown
## Do's
- Altijd context.Context als eerste parameter
- Unit tests bij elke nieuwe functie
- Error messages in het Engels

## Don'ts
- Geen fmt.Println in productie-code
- Geen PAN/CVV data loggen
- Geen externe dependencies zonder team-overleg
\`\`\`

### Current Focus
Waar je team nu aan werkt. Dit verandert regelmatig — en dat is oké.

\`\`\`markdown
## Current Focus
- Migratie settlement-engine naar microservices (Q2 2026)
- Performance optimalisatie batch-processing
- PCI-DSS re-certificering voorbereiden
\`\`\`

## De Scalpel-Regel

Hier komt het verrassende inzicht.

Onderzoek van Chase Hughes (ETH Zurich, 2025) toont aan dat CLAUDE.md-bestanden de task success rate kunnen **VERLAGEN** en **20% meer tokens kosten** wanneer ze te groot zijn.

De problemen bij grote context files:
- **Excessive tool calling** — de agent "checkt" constant de context in plaats van te werken
- **Context pollution** — irrelevante regels vervuilen elke prompt
- **False confidence** — de agent gelooft onjuiste CLAUDE.md-regels boven de werkelijke code

**De vuistregel: kleinere CLAUDE.md (<80 regels) verslaat grotere. Altijd.**

CLAUDE.md helpt **WEL** bij:
- Projecten zonder goede README of docs
- Handgeschreven, strakke non-negotiables
- Persoonlijke assistent-setups

CLAUDE.md helpt **NIET** bij:
- Standaard coding-projecten met goede documentatie
- Bestanden van 200+ regels met "alles wat nuttig kan zijn"
- Lijsten van regels die je ook uit de code kunt afleiden

> "Default context should contain nearly nothing. Include only what's needed for THIS task." — Nate B. Jones

## LibreChat Memories

Naast CLAUDE.md voor je codebase heb je LibreChat memories voor persoonlijke context.

In Level 1 heb je je eerste memories ingesteld. Nu ga je ze strategisch inzetten:

**Effectieve memories:**
- "Ik ben backend engineer in OFS1, ik werk met Golang en PostgreSQL"
- "Onze settlement engine verwerkt €2M per dag, uptime SLA is 99.99%"
- "Bij code review focus ik altijd op error handling en concurrency"

**Ineffectieve memories:**
- "Ik werk bij Worldline" (te vaag)
- "Ik vind clean code belangrijk" (niet actionable)
- De hele Uber Go Style Guide kopiëren (te veel)

Memories werken het best als ze specifiek, relevant, en beknopt zijn. Net als CLAUDE.md.

## De Context Hiërarchie

In de praktijk heb je vier niveaus van context beschikbaar:

1. **Project Context (CLAUDE.md)** — automatisch, altijd aanwezig
2. **File Context (@-mentions)** — wijs AI naar specifieke bestanden
3. **Conversation Context** — bouw progressief op in een gesprek
4. **MCP Context** — live verbindingen met externe systemen

De kunst is weten welk niveau je wanneer gebruikt. Project context voor de basis. File context voor specifieke taken. Conversation context voor iteratie. MCP voor live data.`;

const LESSON_3_2_EN = `# Lesson 3.2 — CLAUDE.md: Your AI's Memory

## What Is CLAUDE.md?

The most powerful context mechanism you have.

A CLAUDE.md file in your project root is the first thing Claude Code reads when you start a conversation. It's like giving a new colleague a day 1 briefing: this is our stack, these are our conventions, here's what you can and can't do.

It's automatically included in every interaction. You don't have to paste it, @-mention it, or repeat it. It's just there.

## What Goes In

A good CLAUDE.md has four sections:

### Stack & Architecture
Which languages, frameworks, databases. How your project is organised.

\`\`\`markdown
# Project: Settlement Engine

## Stack
- Golang 1.22
- PostgreSQL 15 via pgx
- Kubernetes (GKE)
- GitLab CI/CD

## Architecture
- /cmd/ — Entry points
- /internal/service/ — Business logic
- /internal/repository/ — Database layer
- /internal/api/ — HTTP handlers
\`\`\`

### Conventions
Code style, naming, patterns. Your team's unwritten rules.

\`\`\`markdown
## Conventions
- Error handling: errors.Wrap, never fmt.Errorf
- Naming: camelCase for variables, PascalCase for exports
- Tests: table-driven, testify for assertions
- Commits: conventional commits (feat:, fix:, refactor:)
\`\`\`

### Do's & Don'ts
What AI is and isn't allowed to do. Non-negotiables.

\`\`\`markdown
## Do's
- Always context.Context as first parameter
- Unit tests with every new function
- Error messages in English

## Don'ts
- No fmt.Println in production code
- No PAN/CVV data in logs
- No external dependencies without team review
\`\`\`

### Current Focus
What your team is working on now. Changes regularly — that's fine.

\`\`\`markdown
## Current Focus
- Settlement-engine migration to microservices (Q2 2026)
- Batch-processing performance optimisation
- PCI-DSS re-certification prep
\`\`\`

## The Scalpel Rule

Here's the surprising insight.

Research by Chase Hughes (ETH Zurich, 2025) shows CLAUDE.md files can **LOWER** task success rate and **cost 20% more tokens** when they're too large.

Problems with large context files:
- **Excessive tool calling** — the agent constantly "checks" the context instead of working
- **Context pollution** — irrelevant rules pollute every prompt
- **False confidence** — the agent believes incorrect CLAUDE.md rules over the actual code

**Rule of thumb: smaller CLAUDE.md (<80 lines) beats larger. Always.**

CLAUDE.md **HELPS** with:
- Projects without good README or docs
- Hand-written, strict non-negotiables
- Personal assistant setups

CLAUDE.md **DOES NOT HELP** with:
- Standard coding projects with good documentation
- Files of 200+ lines with "everything that could be useful"
- Lists of rules you can also derive from the code

> "Default context should contain nearly nothing. Include only what's needed for THIS task." — Nate B. Jones

## LibreChat Memories

Besides CLAUDE.md for your codebase, you have LibreChat memories for personal context.

**Effective memories:**
- "I'm a backend engineer in OFS1, I work with Golang and PostgreSQL"
- "Our settlement engine processes €2M per day, uptime SLA 99.99%"
- "In code review I always focus on error handling and concurrency"

**Ineffective memories:**
- "I work at Worldline" (too vague)
- "I value clean code" (not actionable)
- Copying the entire Uber Go Style Guide (too much)

Memories work best when they are specific, relevant, and concise. Just like CLAUDE.md.

## The Context Hierarchy

In practice, you have four levels of context:

1. **Project Context (CLAUDE.md)** — automatic, always present
2. **File Context (@-mentions)** — point AI at specific files
3. **Conversation Context** — build progressively in a chat
4. **MCP Context** — live connections to external systems

The art is knowing which level to use when. Project context for the foundation. File context for specific tasks. Conversation context for iteration. MCP for live data.`;

const LESSON_3_2_FR = `# Leçon 3.2 — CLAUDE.md : la mémoire de votre IA

## Qu'est-ce que CLAUDE.md ?

Le mécanisme de contexte le plus puissant que vous ayez.

Un fichier CLAUDE.md à la racine de votre projet est la première chose que Claude Code lit quand vous démarrez une conversation. C'est comme donner à un nouveau collègue un briefing jour 1 : voici notre stack, nos conventions, ce qui se fait et ce qui ne se fait pas.

Il est automatiquement inclus à chaque interaction. Pas besoin de le coller, de le @-mentionner, de le répéter. Il est là.

## Ce qu'il contient

Un bon CLAUDE.md a quatre sections :

### Stack & Architecture
Quels langages, frameworks, bases de données. Comment le projet est organisé.

### Conventions
Style de code, nommage, patterns. Les règles non écrites de votre équipe.

### Do's & Don'ts
Ce que l'IA peut et ne peut pas faire. Les non-négociables.

### Current Focus
Ce sur quoi l'équipe travaille maintenant. Change régulièrement — et c'est ok.

## La règle du scalpel

Voici l'insight surprenant.

La recherche de Chase Hughes (ETH Zurich, 2025) montre que les fichiers CLAUDE.md peuvent **RÉDUIRE** le taux de succès et **coûter 20 % de tokens en plus** quand ils sont trop gros.

Problèmes des gros fichiers de contexte :
- **Excessive tool calling** — l'agent "vérifie" sans cesse le contexte au lieu de travailler
- **Context pollution** — des règles non pertinentes polluent chaque prompt
- **False confidence** — l'agent croit les règles erronées du CLAUDE.md plus que le code réel

**Règle du pouce : CLAUDE.md plus petit (<80 lignes) bat plus grand. Toujours.**

CLAUDE.md **AIDE** : projets sans bon README · non-négociables écrits à la main · setup d'assistant personnel.

CLAUDE.md **N'AIDE PAS** : projets standards bien documentés · fichiers de 200+ lignes · listes dérivables du code.

> « Default context should contain nearly nothing. Include only what's needed for THIS task. » — Nate B. Jones

## LibreChat Memories

En plus de CLAUDE.md vous avez les memories LibreChat pour le contexte personnel. Spécifique, pertinent, concis.

## La hiérarchie du contexte

1. **Project Context (CLAUDE.md)** — automatique, toujours présent
2. **File Context (@-mentions)** — pointez l'IA vers des fichiers spécifiques
3. **Conversation Context** — construit progressivement dans un chat
4. **MCP Context** — connexions live aux systèmes externes

L'art est de savoir quel niveau utiliser quand.`;

// ─── LES 3.3 — Atomic Documentation ───────────────────────────────────────────

const LESSON_3_3_NL = `# Les 3.3 — Atomic Documentation: Waarom Je Confluence Je AI Saboteert

## De Realiteit in Je Confluence

Zoek maar eens op "fraud detection rules" in jullie Confluence. Wat je vindt:

- "Fraud Detection — Overview" — aangemaakt 2019, nooit bijgewerkt
- "Fraud Rules v2 (FINAL)" — 47 pagina's, helft verouderd
- "Fraud Rules v2 (FINAL FINAL)" — kloon van de vorige met 3 wijzigingen
- "DEPRECATED — Old Fraud Docs" — maar nog gelinkt vanuit 12 andere pagina's
- "Connect API Fraud Checks" — contradicts de "FINAL FINAL" versie

Dit is geen hypothetisch scenario. Dit is je werkelijkheid.

En het is een probleem. Niet alleen voor mensen — voor AI.

## De 4 Anti-Patronen

### Anti-Patroon 1: Dubbele Waarheden

Pagina A: "Payment reconciliation runs at 23:00 CET"
Pagina B: "Reconciliation batch: daily at midnight UTC"
Pagina C: "Recon job: 22:00 — moved to 23:00 in Q3 2024"

Je RAG-systeem haalt alle drie op. Welke is correct? Het model heeft geen idee. Het middelt ze, of kiest willekeurig, of hallucineert een compromis.

**Resultaat:** "Het systeem draait reconciliatie ergens tussen 22:00 en 00:00."

Niemand zou dat accepteren in code. Maar in documentatie toleren we het al jaren.

### Anti-Patroon 2: Verouderde Informatie Zonder Tijdstempel

> "Connect API v3 supports up to 500 transactions per second."
> Geschreven in 2021 — het systeem is sindsdien 3x geschaald.

De AI citeert dit getal in een architectuurdocument dat naar de CTO gaat. Niemand checkt het. Het oude getal wordt nu de nieuwe "waarheid".

### Anti-Patroon 3: Conflicterende Views

De FinOps-squad beschrijft het payment flow vanuit kosten-perspectief. De Connect API-squad beschrijft hetzelfde flow vanuit latency-perspectief. De QA-squad beschrijft het vanuit test-scenario's.

Drie pagina's, één systeem, drie incompatibele "waarheden".

### Anti-Patroon 4: Kopiëren in Plaats van Linken

Pagina "Fraud Rules": "Transactions above €10,000 require manual review"
Pagina "Connect API Guide": "Transactions above €10,000 require manual review"
Pagina "Onboarding Guide": "Transactions above €10,000 require manual review"

De drempel wordt verhoogd naar €15,000. Iemand past pagina 1 aan. Pagina's 2 en 3 bevatten nu verouderde informatie — voor maanden, misschien jaren.

## Het Atomaire Documentatie Principe

**Elk feit bestaat op één plek. Alles andere linkt ernaar.**

Dit is niet nieuw. Het is hoe Wikipedia werkt. Het is hoe je codebase werkt — DRY (Don't Repeat Yourself). Maar in documentatie vergeten we het constant.

**Single Source of Truth:**

\`\`\`
Fraud Threshold — canonical pagina:
  "Manual review threshold: €15,000 (all currencies)"
  Last updated: 2026-03-15 by [naam]
  Reviewed by: Compliance (Q1 2026)

Alle andere pagina's: [[→ Fraud Threshold]]
\`\`\`

Als de drempel verandert, verander je één pagina. Alle links zijn automatisch actueel.

## De AI-Ready Checklist

Voordat documentatie "AI-ready" is:
- **Single source** — geen duplicaten, elk feit op één plek
- **Atomaire chunks** — elk document behandelt één concept
- **Expliciete links** — \`[[→ canonical-page]]\` voor afhankelijkheden
- **Consistente terminologie** — altijd "payment reconciliation", nooit soms "recon job"
- **Geen stale refs** — tijdstempel + review datum op elk document
- **AI-leesbare structuur** — headers, lijsten, code blocks — geen lappen proza

## Waarom Dit Urgent Is bij Worldline

Jullie hebben al drie AI-systemen live die documentatie consumeren:
- **Deep Wiki** — query's over jullie documentatie
- **Patrick's Cat** — incident resolution agent
- **Incident Resolution Agent** — Worldline's eigen systeem

Al deze systemen zijn zo goed als hun brondata. **Garbage in, garbage out.**

Het goede nieuws: je hoeft niet alles te refactoren. Begin met de 20% van je documentatie die 80% van de AI-query's beantwoordt. Maak dat atomic. De rest volgt.`;

const LESSON_3_3_EN = `# Lesson 3.3 — Atomic Documentation: Why Your Confluence Sabotages Your AI

## The Reality in Your Confluence

Search for "fraud detection rules" in your Confluence. What you find:
- "Fraud Detection — Overview" — created 2019, never updated
- "Fraud Rules v2 (FINAL)" — 47 pages, half outdated
- "Fraud Rules v2 (FINAL FINAL)" — clone of the previous with 3 changes
- "DEPRECATED — Old Fraud Docs" — but still linked from 12 other pages
- "Connect API Fraud Checks" — contradicts the "FINAL FINAL" version

This isn't hypothetical. This is your reality.

And it's a problem. Not just for humans — for AI.

## The 4 Anti-Patterns

### Anti-Pattern 1: Duplicate Truths

Page A: "Payment reconciliation runs at 23:00 CET"
Page B: "Reconciliation batch: daily at midnight UTC"
Page C: "Recon job: 22:00 — moved to 23:00 in Q3 2024"

Your RAG system retrieves all three. Which is correct? The model has no idea. It averages them, picks randomly, or hallucinates a compromise.

**Result:** "The system runs reconciliation somewhere between 22:00 and 00:00."

No one would accept that in code. But in docs we've tolerated it for years.

### Anti-Pattern 2: Outdated Info Without Timestamp

> "Connect API v3 supports up to 500 TPS."
> Written in 2021 — system has since scaled 3x.

AI cites this in an architecture doc that goes to the CTO. No one checks. The old number becomes the new "truth".

### Anti-Pattern 3: Conflicting Views

FinOps describes payment flow from cost perspective. Connect API from latency. QA from test scenarios.

Three pages, one system, three incompatible "truths".

### Anti-Pattern 4: Copying Instead of Linking

Same threshold (€10,000) on 3 pages. Someone updates page 1 to €15,000. Pages 2 and 3 now contain stale info — for months, maybe years.

## The Atomic Documentation Principle

**Every fact lives in one place. Everything else links to it.**

Not new. This is how Wikipedia works. How your codebase works — DRY. But in documentation we forget constantly.

**Single Source of Truth:**

\`\`\`
Fraud Threshold — canonical page:
  "Manual review threshold: €15,000 (all currencies)"
  Last updated: 2026-03-15 by [name]
  Reviewed by: Compliance (Q1 2026)

All other pages: [[→ Fraud Threshold]]
\`\`\`

Threshold changes → one page updates → all links are auto-current.

## The AI-Ready Checklist

Before docs are "AI-ready":
- **Single source** — no duplicates
- **Atomic chunks** — one concept per doc
- **Explicit links** — \`[[→ canonical-page]]\` for dependencies
- **Consistent terminology** — always "payment reconciliation", never sometimes "recon job"
- **No stale refs** — timestamp + review date on every doc
- **AI-readable structure** — headers, lists, code blocks — no walls of prose

## Why This Is Urgent at Worldline

You have three AI systems consuming documentation live:
- **Deep Wiki** — queries about your documentation
- **Patrick's Cat** — incident resolution agent
- **Incident Resolution Agent** — Worldline's own system

All as good as their source data. **Garbage in, garbage out.**

Good news: you don't have to refactor everything. Start with the 20% of docs that answer 80% of AI queries. Make that atomic. The rest follows.`;

const LESSON_3_3_FR = `# Leçon 3.3 — Atomic Documentation : pourquoi votre Confluence sabote votre IA

## La réalité dans votre Confluence

Cherchez « fraud detection rules » dans votre Confluence. Ce que vous trouvez : plusieurs versions (FINAL, FINAL FINAL), pages obsolètes de 2019, docs contradictoires entre squads. Ce n'est pas hypothétique — c'est votre réalité.

## Les 4 anti-patterns

### Anti-Pattern 1 : Vérités dupliquées

Page A : « Reconciliation à 23:00 CET » · Page B : « minuit UTC » · Page C : « 22:00 — déplacé à 23:00 ». Le RAG récupère les trois. Le modèle hallucine un compromis.

### Anti-Pattern 2 : Info obsolète sans horodatage

« Connect API v3 supports up to 500 TPS. » Écrit en 2021 — le système a été mis à l'échelle 3x. L'IA cite l'ancien chiffre dans un doc pour le CTO.

### Anti-Pattern 3 : Vues conflictuelles

FinOps décrit le flow paiement du point de vue coûts. Connect API du point de vue latence. QA du point de vue tests. Trois pages, un système, trois « vérités » incompatibles.

### Anti-Pattern 4 : Copier au lieu de linker

Même seuil (10 000 €) sur 3 pages. Quelqu'un met à jour la page 1 à 15 000 €. Les pages 2 et 3 sont maintenant obsolètes — pour des mois.

## Le principe d'Atomic Documentation

**Chaque fait vit à un seul endroit. Tout le reste y link.**

Pas nouveau. C'est Wikipedia. C'est DRY dans votre codebase. Mais en documentation on l'oublie sans cesse.

## La checklist AI-Ready

- **Single source** — pas de duplicats
- **Chunks atomiques** — un concept par doc
- **Liens explicites** — \`[[→ canonical-page]]\`
- **Terminologie cohérente**
- **Pas de refs périmées** — horodatage + date de revue
- **Structure AI-readable** — headers, listes, blocs code

## Pourquoi c'est urgent chez Worldline

Trois systèmes IA live consomment votre doc : Deep Wiki · Patrick's Cat · Incident Resolution Agent.

**Garbage in, garbage out.**

Commencez par les 20 % de docs qui répondent à 80 % des requêtes IA. Rendez-les atomic. Le reste suit.`;

// ─── LES 3.4 — Context Rot ───────────────────────────────────────────────────

const LESSON_3_4_NL = `# Les 3.4 — Context Rot & Context Discipline

## Context Rot

Je bent 45 minuten bezig met Claude Code. Het gesprek is lang. De context window raakt vol. En langzaam — zonder dat je het merkt — worden de antwoorden slechter.

**Dit is context rot.**

Chase Hughes' regel: elke 100K tokens in je context window zorgt voor **~2% kwaliteitsdaling**. Bij 1M context — het maximum van moderne modellen — is dat **~20% effectiviteitsverlies**.

Het model wordt niet dommer. Het raakt de draad kwijt. Net als jij na 4 uur in dezelfde codebase staren — je mist dingen die je aan het begin direct had gezien.

## De Vuistregels

- **200K context window:** ververs bij 20-25% gebruik (~50K tokens)
- **1M context window:** ververs bij 50% gebruik (~500K tokens)
- Gebruik \`/clear\` — **niet** \`/compact\`. In 99 van de 100 gevallen is een schone start beter dan een samenvatting van een rommelig gesprek.

## Session Management

De beste engineers behandelen AI-gesprekken als git branches: **kort, gefocust, één taak per sessie.**

**Slecht:** een gesprek van 2 uur waar je 6 verschillende features bespreekt, bugs fixt, en tussendoor je CLAUDE.md update.

**Goed:**
- Sessie 1: "Refactor de handlePayment functie" → klaar → \`/clear\`
- Sessie 2: "Schrijf tests voor de gerefactorde functie" → klaar → \`/clear\`
- Sessie 3: "Update de API docs" → klaar → \`/clear\`

Elke sessie begint fris. Met de juiste context geladen. Zonder de rommel van vorige taken.

## Worldline-Specifiek

Na elke voltooide sub-taak: **clear + re-scope**. Geen "alles in één sessie" marathons. Bij complexe refactors: splits in 3 aparte sessies met tussenresultaten opgeslagen in bestanden.

Installeer de status bar die je context-percentage toont. Als je boven de **40%** zit, is het tijd om te verversen.

## De Praktische Routine

**Begin elke sessie:**
1. \`/clear\` (schone start)
2. CLAUDE.md is automatisch geladen
3. \`@\`-mention de specifieke bestanden voor deze taak
4. Geef je taak in Pentagon-formaat (Level 2)

**Tijdens de sessie:**
- Eén taak per gesprek
- Als je van onderwerp wisselt → \`/clear\`
- Sla tussenresultaten op in bestanden, niet in het gesprek

**Einde sessie:**
- Check: is de output opgeslagen?
- \`/clear\` voor de volgende taak`;

const LESSON_3_4_EN = `# Lesson 3.4 — Context Rot & Context Discipline

## Context Rot

You're 45 minutes into Claude Code. The conversation is long. The context window is filling up. And slowly — without you noticing — answers get worse.

**This is context rot.**

Chase Hughes' rule: every 100K tokens in your context window causes **~2% quality drop**. At 1M context — modern model max — that's **~20% effectiveness loss**.

The model doesn't get dumber. It loses the thread. Like you after 4 hours staring at the same codebase — you miss things you'd have spotted instantly at the start.

## The Rules of Thumb

- **200K context window:** refresh at 20-25% usage (~50K tokens)
- **1M context window:** refresh at 50% usage (~500K tokens)
- Use \`/clear\` — **not** \`/compact\`. In 99 out of 100 cases a clean start beats a summary of a messy chat.

## Session Management

The best engineers treat AI conversations like git branches: **short, focused, one task per session.**

**Bad:** a 2-hour chat where you discuss 6 features, fix bugs, and update CLAUDE.md along the way.

**Good:**
- Session 1: "Refactor the handlePayment function" → done → \`/clear\`
- Session 2: "Write tests for the refactored function" → done → \`/clear\`
- Session 3: "Update the API docs" → done → \`/clear\`

Every session starts fresh. With correct context loaded. Without leftover noise.

## Worldline-Specific

After every completed sub-task: **clear + re-scope**. No "everything in one session" marathons. For complex refactors: split into 3 separate sessions with intermediate results saved to files.

Install the status bar that shows context percentage. Above **40%** = refresh time.

## The Practical Routine

**Start each session:**
1. \`/clear\`
2. CLAUDE.md auto-loaded
3. \`@\`-mention specific files for this task
4. Give task in Pentagon format (Level 2)

**During session:**
- One task per chat
- Topic switch → \`/clear\`
- Save intermediate results to files, not chat

**End session:**
- Output saved?
- \`/clear\` for next`;

const LESSON_3_4_FR = `# Leçon 3.4 — Context Rot & discipline du contexte

## Context Rot

Vous êtes 45 minutes dans Claude Code. La conversation est longue. Le context window se remplit. Et lentement — sans que vous le remarquiez — les réponses deviennent moins bonnes.

**C'est le context rot.**

Règle de Chase Hughes : chaque 100K tokens dans votre context window cause **~2 % de baisse de qualité**. À 1M de contexte — max des modèles modernes — c'est **~20 % de perte d'efficacité**.

Le modèle ne devient pas plus bête. Il perd le fil. Comme vous après 4 heures à fixer la même codebase — vous ratez des choses que vous auriez vues tout de suite au début.

## Les règles du pouce

- **200K context window :** rafraîchir à 20-25 % d'usage (~50K tokens)
- **1M context window :** rafraîchir à 50 % (~500K tokens)
- Utilisez \`/clear\` — **pas** \`/compact\`. Dans 99 cas sur 100 un démarrage propre bat un résumé d'une session bordélique.

## Gestion de session

Les meilleurs ingénieurs traitent les sessions IA comme des branches git : **courtes, focus, une tâche par session.**

**Mauvais :** session de 2h où vous discutez 6 features, corrigez des bugs, et mettez à jour CLAUDE.md en chemin.

**Bon :**
- Session 1 : « Refactor handlePayment » → fini → \`/clear\`
- Session 2 : « Écris les tests » → fini → \`/clear\`
- Session 3 : « Update API docs » → fini → \`/clear\`

## Spécifique Worldline

Après chaque sous-tâche : **clear + re-scope**. Pas de marathons « tout en une session ». Pour les refactors complexes : splittez en 3 sessions avec résultats intermédiaires dans des fichiers.

Installez la status bar qui montre le pourcentage de contexte. Au-dessus de **40 %** = temps de rafraîchir.

## La routine pratique

**Début :** \`/clear\` · CLAUDE.md auto · \`@\`-mention fichiers · prompt Pentagon.
**Pendant :** une tâche par chat · changement de sujet → \`/clear\` · sauvegardes dans fichiers.
**Fin :** output sauvé ? \`/clear\` pour la suivante.`;

// ─── LES 3.5 — MCP Preview ───────────────────────────────────────────────────

const LESSON_3_5_NL = `# Les 3.5 — MCP: AI met Superpowers (Preview)

> **Dit is een preview.** In Level 7 (Claude Code Mastery) ga je MCP-servers opzetten en configureren. Hier leer je wat het is en waarom het ertoe doet.

## Wat Is MCP?

**MCP — Model Context Protocol** — is een open standaard die AI-modellen verbindt met externe systemen.

Denk aan het als USB-poorten voor je AI:
- **Zonder MCP** — AI kan alleen tekst lezen en genereren
- **Met MCP** — AI kan je database querien, git commits lezen, Slack berichten sturen, en meer

MCP verschuift de tool-uitvoering van de orchestrator naar een externe server. De flow uit Level 1 blijft hetzelfde — het model DENKT, de server DOET — maar de server heeft nu toegang tot echte systemen.

## CLIs vs MCPs: De 2026 Shift

Hier iets dat je moet weten voordat iedereen MCP overal gaat installeren.

**Chase Hughes (2026):** "CLIs over MCPs" is de grootste tool-integratie shift van dit jaar.

**Waarom CLIs vaak winnen:**
- **Token-kosten:** Playwright CLI = **90K tokens goedkoper** dan Playwright MCP (gemeten, niet geschat)
- Terminal-in-terminal = zero overhead
- Minder context pollution
- Betere auditability (shell history = audit trail)

**Waarom MCPs nuttig blijven:**
- Structured output (tool-call format)
- Per-tool error handling
- Veilige permission gating
- Tools zonder CLI-equivalent

**Worldline-regel voor Wave 1:**
- GitHub → gebruik \`gh\` CLI (niet GitHub MCP)
- Vercel → gebruik \`vercel\` CLI
- Playwright → gebruik \`playwright\` CLI (tenzij UI-automation in agent loop)
- Database queries → direct \`psql\` via allowlist (niet Supabase MCP voor read-only)
- MCP bewaren voor: Fireflies, Monday, Slack (waar de CLI ontbreekt)

## MCP Setup (Preview)

In je project's \`.claude.json\`:

\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "$DATABASE_URL"
      }
    }
  }
}
\`\`\`

Dit geeft Claude Code live toegang tot je database schema. Het kan nu:
- Je tabelstructuur opvragen
- Queries schrijven die passen bij je echte schema
- Migraties genereren die werken

In Level 7 ga je dit stap voor stap opzetten.

## Security — Niet Onderhandelbaar

MCP servers hebben toegang tot echte systemen. Dat maakt ze **krachtig én gevaarlijk.**

- Gebruik **read-only credentials** waar mogelijk
- Beperk directory access tot projectmappen
- Nooit production database credentials in development
- Review MCP server code voordat je het installeert
- MCP = attack surface — tool descriptions kunnen prompt injection bevatten

Bij Worldline geldt bovendien: audit elke MCP tool description op security-implicaties voor PCI-DSS workflows. Geen uitzonderingen.`;

const LESSON_3_5_EN = `# Lesson 3.5 — MCP: AI with Superpowers (Preview)

> **This is a preview.** In Level 7 (Claude Code Mastery) you'll set up and configure MCP servers. Here you learn what it is and why it matters.

## What Is MCP?

**MCP — Model Context Protocol** — is an open standard that connects AI models to external systems.

Think of it as USB ports for your AI:
- **Without MCP** — AI can only read and generate text
- **With MCP** — AI can query your database, read git commits, send Slack messages, and more

MCP shifts tool execution from the orchestrator to an external server. The flow from Level 1 stays the same — the model THINKS, the server DOES — but the server now has access to real systems.

## CLIs vs MCPs: The 2026 Shift

Something to know before everyone installs MCP everywhere.

**Chase Hughes (2026):** "CLIs over MCPs" is the biggest tool-integration shift of this year.

**Why CLIs often win:**
- **Token cost:** Playwright CLI = **90K tokens cheaper** than Playwright MCP (measured, not estimated)
- Terminal-in-terminal = zero overhead
- Less context pollution
- Better auditability (shell history = audit trail)

**Why MCPs remain useful:**
- Structured output (tool-call format)
- Per-tool error handling
- Safe permission gating
- Tools without CLI equivalent

**Worldline rule for Wave 1:**
- GitHub → use \`gh\` CLI (not GitHub MCP)
- Vercel → use \`vercel\` CLI
- Playwright → use \`playwright\` CLI (unless UI-automation in agent loop)
- Database queries → direct \`psql\` via allowlist (not Supabase MCP for read-only)
- Keep MCP for: Fireflies, Monday, Slack (where CLI is missing)

## MCP Setup (Preview)

In your project's \`.claude.json\`:

\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "$DATABASE_URL"
      }
    }
  }
}
\`\`\`

This gives Claude Code live access to your database schema. Level 7 walks you through it.

## Security — Non-Negotiable

MCP servers have access to real systems. That makes them **powerful and dangerous.**

- Use **read-only credentials** where possible
- Restrict directory access to project folders
- Never production database credentials in development
- Review MCP server code before installing
- MCP = attack surface — tool descriptions can contain prompt injection

At Worldline: audit every MCP tool description for PCI-DSS security implications. No exceptions.`;

const LESSON_3_5_FR = `# Leçon 3.5 — MCP : l'IA avec superpouvoirs (Preview)

> **C'est une preview.** Au Level 7 (Claude Code Mastery) vous configurerez des serveurs MCP. Ici vous apprenez ce que c'est et pourquoi c'est important.

## Qu'est-ce que MCP ?

**MCP — Model Context Protocol** — est un standard ouvert qui connecte les modèles IA aux systèmes externes.

Comme des ports USB pour votre IA :
- **Sans MCP** — l'IA ne peut que lire et générer du texte
- **Avec MCP** — l'IA peut interroger votre base, lire les commits git, envoyer des Slack, et plus

## CLIs vs MCPs : le shift 2026

**Chase Hughes (2026) :** « CLIs over MCPs » est le plus gros shift d'intégration d'outils de cette année.

**Pourquoi les CLIs gagnent souvent :**
- **Coût tokens :** Playwright CLI = **90K tokens moins cher** que Playwright MCP (mesuré)
- Terminal-in-terminal = zéro overhead
- Moins de context pollution
- Meilleure auditability (shell history = audit trail)

**Pourquoi les MCPs restent utiles :**
- Sortie structurée
- Gestion d'erreur par tool
- Permission gating sûr
- Outils sans équivalent CLI

**Règle Worldline Wave 1 :** GitHub → \`gh\` CLI · Vercel → \`vercel\` CLI · Playwright → \`playwright\` CLI · DB queries → \`psql\` · MCP réservé à Fireflies, Monday, Slack.

## Setup MCP (Preview)

\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": { "DATABASE_URL": "$DATABASE_URL" }
    }
  }
}
\`\`\`

## Sécurité — non-négociable

- **Read-only credentials** quand possible
- Restreindre l'accès aux dossiers du projet
- Jamais de credentials production en dev
- Review le code MCP avant installation
- MCP = surface d'attaque — descriptions d'outils peuvent contenir prompt injection

Chez Worldline : audit chaque description d'outil MCP pour les implications PCI-DSS. Pas d'exception.`;

// ─── LAB 3A — Confluence Pain ────────────────────────────────────────────────

const LAB_3A_NL = `# Lab 3A — Pain Lab: Voel de Confluence Pijn

**Duur: 30 minuten**

**Pedagogisch principe:** voelen > voorkauwen. Je gaat de pijn voelen voordat je de oplossing krijgt.

## Stap 1: De Chaos (10 min)

Hieronder staat een "realistische" Confluence-pagina over het payment systeem. Lees het door en probeer een antwoord te vinden op deze vraag:

> **"Wat is de exacte drempel voor manual fraud review, en wanneer is dit voor het laatste gewijzigd?"**

\`\`\`
# Fraud Detection & Payment Rules

Last updated: unknown

## Overview
Our fraud detection system is described here. See also "Fraud Rules v2 (FINAL)"
and "Fraud Rules v2 (FINAL FINAL)" which has the latest info. Note that the
Connect API page also has some of this info but it might be slightly different.

## Fraud Thresholds
Transactions above €10,000 require manual review. Actually per the Q3 2024 update
this was changed to €12,500 but only for EUR transactions. For GBP I think it's
still £8,500 but check with Compliance. USD is $11,000 per the Americas team page.

## Payment Reconciliation
The reconciliation job runs at 23:00 CET. Or 00:00 UTC — same thing more or less.
There was an email in Q3 2024 about moving it, someone should check if that happened.

## Connect API Rate Limits
The Connect API supports up to 500 transactions per second (as of 2021 docs).
This might have changed. Ask the Connect team.

## Manual Review Process
When a transaction requires manual review:
1. Flag it in the fraud queue
2. Wait for analyst (SLA: 4 hours, or maybe 2 hours for high-value)
3. Analyst approves or rejects
4. See also: "Manual Review Process v2" which supersedes this

## Important: this section is DEPRECATED
Everything above may be outdated. The new process is documented
in "Fraud Detection 2025 Overhaul" but that page is still a draft.

## Fraud Detection 2025 Overhaul (DRAFT — not yet approved)
Thresholds: €15,000 for all currencies (pending Compliance sign-off)
Reconciliation: 23:30 CET (moved from 23:00, effective Q1 2025)
Rate limits: 2,400 TPS (post-infrastructure upgrade March 2025)
\`\`\`

Lees het. Wees gefrustreerd. Onthoud dat gevoel — **dat gevoel is de les.**

## Stap 2: Refactor (15 min)

Nu is het jouw beurt. Refactor deze documentatie naar **atomaire, AI-ready structuur.**

**Criteria:**
- Single source voor elk feit
- Atomaire chunks (één concept per sectie)
- Expliciete links (\`[[→ canonical-page]]\` syntax)
- Consistente terminologie
- Geen stale verwijzingen (voeg "Last updated" toe)
- AI-leesbare structuur (headers, lijsten)

## Stap 3: Vergelijk (5 min)

Stel je voor dat je dezelfde vraag aan een RAG-systeem stelt — eerst met de oude documentatie, dan met jouw refactored versie. Wat is het verschil?

**Deliverable:** Je gerefactorde documentatie.`;

const LAB_3A_EN = `# Lab 3A — Pain Lab: Feel the Confluence Pain

**Duration: 30 minutes**

**Pedagogy:** feeling > lecturing. Feel the pain before you get the solution.

## Step 1: The Chaos (10 min)

Read the messy "realistic" Confluence page and find an answer to:

> **"What's the exact threshold for manual fraud review, and when was it last changed?"**

(Same Confluence mess as NL source — 4 conflicting thresholds · DEPRECATED sections still linked · DRAFT overhaul pending Compliance sign-off.)

Read it. Be frustrated. Remember that feeling — **that feeling is the lesson.**

## Step 2: Refactor (15 min)

Now your turn. Refactor to atomic, AI-ready structure.

**Criteria:**
- Single source per fact
- Atomic chunks
- Explicit \`[[→ canonical-page]]\` links
- Consistent terminology
- No stale refs (add "Last updated")
- AI-readable structure

## Step 3: Compare (5 min)

Imagine asking a RAG the same question — first with old docs, then with your refactor. What's the difference?

**Deliverable:** Your refactored documentation.`;

const LAB_3A_FR = `# Lab 3A — Pain Lab : Ressentez la douleur Confluence

**Durée : 30 minutes**

**Pédagogie :** ressentir > expliquer. Vous allez ressentir la douleur avant d'avoir la solution.

## Étape 1 : Le chaos (10 min)

Lisez la page Confluence « réaliste » et trouvez une réponse à :

> **« Quel est le seuil exact pour manual fraud review, et quand a-t-il été modifié en dernier ? »**

(Même chaos Confluence que source NL — 4 seuils contradictoires · sections DEPRECATED encore liées · overhaul DRAFT pending Compliance.)

Lisez. Soyez frustré. Retenez ce sentiment — **ce sentiment est la leçon.**

## Étape 2 : Refactor (15 min)

À vous. Refactor vers structure atomique AI-ready.

**Critères :** Single source · chunks atomiques · liens \`[[→ canonical-page]]\` explicites · terminologie cohérente · pas de refs périmées (ajoutez « Last updated ») · structure AI-readable.

## Étape 3 : Comparer (5 min)

Imaginez poser la même question à un RAG — avec l'ancienne doc, puis votre refactor. Différence ?

**Livrable :** Votre documentation refactorée.`;

// ─── LAB 3B — Kennisbank ─────────────────────────────────────────────────────

const LAB_3B_NL = `# Lab 3B — Bouw Je Kennisbank

**Duur: 45 minuten**

Je gaat een echte kennisbank bouwen. Niet theoretisch — werkend. Iets dat je **maandag** kunt gebruiken.

## Stap 1: CLAUDE.md schrijven (15 min)

Maak een CLAUDE.md voor je eigen werkproject. Gebruik dit template:

\`\`\`markdown
# [Project Naam]

## Stack
[Lijst je tech stack — talen, frameworks, databases]

## Conventions
[Code stijl, naming, test patterns, commit conventions]

## Architecture
[Directory structuur + korte uitleg per map]

## Do's
[Wat AI WEL moet doen — max 5 regels]

## Don'ts
[Wat AI NIET mag doen — max 5 regels]

## Current Focus
[Waar je team nu aan werkt]
\`\`\`

**Onthoud de scalpel-regel:** onder de **80 regels**. Als het langer is, schrap.

## Stap 2: Context Layering (15 min)

Kies een echte taak uit je sprint of backlog. Voer hem uit met alle 4 context-niveaus:
1. CLAUDE.md op zijn plek (project context)
2. \`@\`-mention de relevante bestanden (file context)
3. Bouw je prompt op in 3 stappen: breed → focus → detail (conversation context)
4. Observeer het verschil in output kwaliteit

## Stap 3: Before/After (10 min)

Vergelijk de output met en zonder context.
- **Relevantie:** past het bij je project?
- **Iteraties:** hoeveel keer moest je corrigeren?
- **Kwaliteit:** types, error handling, conventies — klopt het?

## Stap 4: Sla op en deel (5 min)

Commit je CLAUDE.md in je repository. Deel het met je squad.

**Deliverable:** Een werkende CLAUDE.md (<80 regels) + before/after vergelijking.`;

const LAB_3B_EN = `# Lab 3B — Build Your Knowledge Base

**Duration: 45 minutes**

Build a real knowledge base. Not theoretical — working. Something you can use on **Monday**.

## Step 1: Write CLAUDE.md (15 min)

Create CLAUDE.md for your own project. Template:

\`\`\`markdown
# [Project Name]

## Stack
[tech stack]

## Conventions
[code style, naming, test patterns, commit conventions]

## Architecture
[directory structure + short per-dir explanation]

## Do's
[max 5 lines]

## Don'ts
[max 5 lines]

## Current Focus
[what team is working on]
\`\`\`

**Scalpel rule:** under **80 lines**. If longer, cut.

## Step 2: Context Layering (15 min)

Take a real sprint task. Execute with all 4 context levels:
1. CLAUDE.md in place
2. \`@\`-mention relevant files
3. Build prompt in 3 steps: broad → focus → detail
4. Observe output quality difference

## Step 3: Before/After (10 min)

Compare output with and without context: relevance · iterations · quality.

## Step 4: Save and share (5 min)

Commit CLAUDE.md. Share with squad.

**Deliverable:** Working CLAUDE.md (<80 lines) + before/after comparison.`;

const LAB_3B_FR = `# Lab 3B — Construisez votre base de connaissances

**Durée : 45 minutes**

Construisez une vraie knowledge base. Pas théorique — fonctionnelle. Utilisable **lundi**.

## Étape 1 : Écrire CLAUDE.md (15 min)

Template CLAUDE.md avec Stack · Conventions · Architecture · Do's · Don'ts · Current Focus.

**Règle du scalpel :** moins de **80 lignes**. Plus long ? Coupez.

## Étape 2 : Context Layering (15 min)

Prenez une vraie tâche du sprint. Exécutez avec les 4 niveaux :
1. CLAUDE.md en place
2. \`@\`-mention fichiers pertinents
3. Prompt en 3 étapes : large → focus → détail
4. Observez la différence de qualité

## Étape 3 : Avant/Après (10 min)

Comparez : pertinence · itérations · qualité.

## Étape 4 : Sauver et partager (5 min)

Commit CLAUDE.md. Partagez avec la squad.

**Livrable :** CLAUDE.md (<80 lignes) + comparaison avant/après.`;

// ─── Role tracks (6 tracks combined per locale) ──────────────────────────────

const ROLE_TRACKS_NL = `# Rol-opdrachten Level 3 — "De Context Architect Challenge"

## BACKEND ENGINEERS (Golang / Java) — "Context Architect: Squad Repository CLAUDE.md"
**Opdracht:** Schrijf een CLAUDE.md voor je squad's repository die elke engineer en elke AI-tool direct productief maakt.

**Wat erin moet:**
1. Tech stack met versies en key dependencies
2. Architectuurbeslissingen (waarom microservices, waarom dit pattern)
3. Code conventies (error handling, naming, test patterns)
4. Non-negotiables (PCI, security, performance eisen)
5. Current focus (lopende migraties, refactors, tech debt)

**Aanpak:** Begin met wat je een nieuwe collega zou vertellen op dag 1. Schrap alles wat je uit de code kunt afleiden. Houd het onder 80 regels. Test het: geef Claude Code een taak met en zonder je CLAUDE.md. Vergelijk de output.

- **Tool:** Claude Code + je eigen repository
- **Duur:** 45 minuten
- **Deliverable:** Een werkende CLAUDE.md + before/after vergelijking
- **Badge-criteria:** Een nieuwe teamgenoot die alleen je CLAUDE.md leest kan binnen 10 minuten een eerste bruikbare AI-interactie hebben met de codebase.

## FRONTEND DEVELOPERS (React / Angular) — "Context Architect: Design System Kennisbestand"
**Opdracht:** Schrijf een kennisbestand voor je design system dat AI helpt om componenten te genereren die passen bij jullie visuele standaard.

**Wat erin moet:** Component library en tokens · styling conventies · state management patterns (loading/error/empty) · accessibility standaard · do's & don'ts met voorbeelden.

**Aanpak:** Kies 3 bestaande componenten als referentie. Beschrijf het patroon dat ze delen — niet de implementatie. Test: laat AI een nieuwe component genereren met en zonder je kennisbestand.

- **Tool:** Claude Code of LibreChat
- **Duur:** 45 minuten
- **Deliverable:** \`design-system-context.md\` + een gegenereerde component als bewijs
- **Badge-criteria:** Een AI die je kennisbestand leest genereert een component die visueel past bij je bestaande design system zonder handmatige styling-fixes.

## TESTERS / QA — "Context Architect: Test Kennisbestand"
**Opdracht:** Schrijf een kennisbestand dat AI helpt om tests te genereren die passen bij jullie test-strategie en kwaliteitseisen.

**Wat erin moet:** Test types (unit/integration/e2e/contract) · coverage eisen · tools/frameworks · testdata conventies · edge case patronen specifiek voor jullie domein.

**Aanpak:** Begin bij je meest recente test suite. Documenteer wat een "goede test" is bij jullie (niet generiek, specifiek). Test: laat AI tests genereren met en zonder je kennisbestand.

- **Tool:** Claude Code of LibreChat
- **Duur:** 45 minuten
- **Deliverable:** \`test-knowledge.md\` + gegenereerde tests als bewijs
- **Badge-criteria:** AI-gegenereerde tests volgen jullie test-patronen en zijn uitvoerbaar zonder structurele aanpassingen.

## PRODUCT MANAGERS / UX — "Context Architect: Product Kennisbestand"
**Opdracht:** Schrijf een kennisbestand dat AI helpt om user stories, PRD's, en analyses te schrijven die passen bij jullie product en gebruikers.

**Wat erin moet:** Product visie · 2-3 kernpersona's · 3 belangrijkste user journeys · prioriteringsframework · domein-specifieke terminologie.

**Aanpak:** Begin bij je product roadmap. Voeg persona's toe die specifiek genoeg zijn om bruikbaar te zijn. Test: laat AI een user story schrijven met en zonder je kennisbestand.

- **Tool:** LibreChat
- **Duur:** 45 minuten
- **Deliverable:** \`product-context.md\` + een gegenereerde user story als bewijs
- **Badge-criteria:** Een AI-gegenereerde user story die je zonder aanpassingen in Jira zou zetten.

## MANAGERS — "Context Architect: Team Kennisbestand"
**Opdracht:** Schrijf een kennisbestand dat AI helpt om rapportages, analyses, en communicatie te genereren die past bij jouw team en stakeholders.

**Wat erin moet:** Team samenstelling · processen (sprint ritme, review cadence, escalatie) · KPI's en meetmethodes · stakeholders per format · communicatie conventies.

**Aanpak:** Denk aan wat je elke keer opnieuw moet uitleggen. Maak het specifiek: niet "wekelijkse standup" maar "standup di+do 09:15, format: blocker → progress → plan". Test met rapportage-generatie.

- **Tool:** LibreChat
- **Duur:** 45 minuten
- **Deliverable:** \`team-context.md\` + een gegenereerde rapportage als bewijs
- **Badge-criteria:** De rapportage is herkenbaar als "van jouw team" — juiste KPI's, juiste toon, juiste stakeholders.

## ADVANCED (Early Adopters) — "Context Architect: Multi-File Kennisstructuur"
**Opdracht:** Bouw een multi-file kennisstructuur die team + code + product combineert in een samenhangende context-architectuur.

**Wat je moet opleveren:**
1. \`CLAUDE.md\` — project-level context
2. \`docs/team-context.md\` — team, processen, stakeholders
3. \`docs/domain-context.md\` — domeinkennis, compliance, terminology
4. Een index die beschrijft wanneer welk bestand relevant is
5. Evaluatie: hoe verandert de AI-output met de volledige structuur vs individuele bestanden?

**Aanpak:** Begin met CLAUDE.md. Voeg laag voor laag toe: team → domein → product. Test per laag. Documenteer het omslagpunt waar meer context contraproductief wordt. Pas de scalpel-regel toe.

- **Tool:** Claude Code
- **Duur:** 60 minuten
- **Deliverable:** Multi-file kennisstructuur + evaluatie per laag
- **Badge-criteria:** De kennisstructuur is modulair, elk bestand is <80 regels, en je kunt aantonen dat de combinatie betere output geeft dan de individuele bestanden.`;

const ROLE_TRACKS_EN = `# Level 3 Role Tracks — "The Context Architect Challenge"

## BACKEND ENGINEERS (Golang / Java) — "Squad Repository CLAUDE.md"
**Task:** Write a CLAUDE.md for your squad's repository that makes every engineer and AI-tool immediately productive.
**Contents:** Tech stack + versions · architecture decisions · code conventions · non-negotiables (PCI, security, performance) · current focus.
**Approach:** Start with what you'd tell a new colleague on day 1. Remove anything derivable from code. Keep under 80 lines. Test with and without.
- **Tool:** Claude Code + your repo
- **Duration:** 45 min
- **Deliverable:** Working CLAUDE.md + before/after comparison
- **Badge:** New teammate with only your CLAUDE.md has a first useful AI interaction within 10 min.

## FRONTEND DEVELOPERS (React / Angular) — "Design System Knowledge File"
**Task:** Write a knowledge file for your design system that helps AI generate components matching your visual standard.
**Contents:** Component library + tokens · styling conventions · state patterns (loading/error/empty) · a11y standard · do's & don'ts with examples.
**Approach:** Pick 3 existing components as reference. Describe the shared pattern — not the implementation.
- **Tool:** Claude Code or LibreChat
- **Duration:** 45 min
- **Deliverable:** \`design-system-context.md\` + a generated component as proof
- **Badge:** AI with your knowledge file generates a component that visually fits without manual styling fixes.

## TESTERS / QA — "Test Knowledge File"
**Task:** Knowledge file that helps AI generate tests matching your test strategy and quality requirements.
**Contents:** Test types · coverage requirements · tools/frameworks · test data conventions · edge case patterns specific to your domain.
**Approach:** Start from your most recent test suite. Document what a "good test" is (specific, not generic).
- **Tool:** Claude Code or LibreChat
- **Duration:** 45 min
- **Deliverable:** \`test-knowledge.md\` + generated tests as proof
- **Badge:** AI-generated tests follow your patterns and are executable without structural changes.

## PM / UX — "Product Knowledge File"
**Task:** Knowledge file that helps AI write user stories, PRDs, and analyses matching your product and users.
**Contents:** Product vision · 2-3 core personas · 3 most important user journeys · prioritisation framework · domain terminology.
**Approach:** Start from your product roadmap. Personas specific enough to be useful.
- **Tool:** LibreChat
- **Duration:** 45 min
- **Deliverable:** \`product-context.md\` + a generated user story as proof
- **Badge:** AI-generated user story you'd put into Jira without changes.

## MANAGERS — "Team Knowledge File"
**Task:** Knowledge file that helps AI generate reports, analyses, and communication matching your team and stakeholders.
**Contents:** Team composition · processes (sprint rhythm, review cadence, escalation) · KPIs + measurement · stakeholders per format · communication conventions.
**Approach:** Think of what you re-explain every time. Be specific: not "weekly standup" but "standup Tue+Thu 09:15, format: blocker → progress → plan".
- **Tool:** LibreChat
- **Duration:** 45 min
- **Deliverable:** \`team-context.md\` + a generated report as proof
- **Badge:** Report is recognisable as "from your team" — right KPIs, right tone, right stakeholders.

## ADVANCED (Early Adopters) — "Multi-File Knowledge Structure"
**Task:** Build a multi-file knowledge structure combining team + code + product in a coherent context architecture.
**Deliverables:** \`CLAUDE.md\` + \`docs/team-context.md\` + \`docs/domain-context.md\` + an index + per-layer evaluation.
**Approach:** Start with CLAUDE.md. Add layer by layer. Test per layer. Document the tipping point where more context becomes counterproductive. Apply scalpel rule.
- **Tool:** Claude Code
- **Duration:** 60 min
- **Deliverable:** Multi-file structure + per-layer evaluation
- **Badge:** Modular, each file <80 lines, provably better output than individual files.`;

const ROLE_TRACKS_FR = `# Tracks rôle Level 3 — « The Context Architect Challenge »

## BACKEND ENGINEERS (Golang / Java) — « Squad Repository CLAUDE.md »
**Tâche :** CLAUDE.md pour le repo de votre squad qui rend chaque ingénieur et outil IA immédiatement productif.
**Contenu :** Stack tech + versions · décisions d'architecture · conventions de code · non-négociables (PCI, sécurité, perf) · current focus.
**Approche :** Commencez par ce que vous diriez à un nouveau collègue jour 1. Retirez ce qui se déduit du code. Moins de 80 lignes. Testez avec/sans.
- **Outil :** Claude Code + votre repo
- **Durée :** 45 min
- **Livrable :** CLAUDE.md fonctionnel + comparaison avant/après
- **Badge :** Nouveau coéquipier avec seulement votre CLAUDE.md a une première interaction IA utile en 10 min.

## FRONTEND DEVELOPERS (React / Angular) — « Design System Knowledge File »
**Tâche :** Fichier de connaissance pour votre design system qui aide l'IA à générer des composants alignés sur votre standard visuel.
**Contenu :** Librairie de composants + tokens · conventions de style · patterns d'état · a11y · do's & don'ts avec exemples.
- **Outil :** Claude Code ou LibreChat
- **Durée :** 45 min
- **Livrable :** \`design-system-context.md\` + composant généré
- **Badge :** L'IA génère un composant qui s'intègre visuellement sans fixes manuels.

## TESTERS / QA — « Test Knowledge File »
**Tâche :** Knowledge file qui aide l'IA à générer des tests alignés sur votre stratégie de test.
**Contenu :** Types de test · exigences coverage · outils/frameworks · conventions test data · edge cases spécifiques au domaine.
- **Outil :** Claude Code ou LibreChat
- **Durée :** 45 min
- **Livrable :** \`test-knowledge.md\` + tests générés
- **Badge :** Tests générés suivent vos patterns et sont exécutables sans changement structurel.

## PM / UX — « Product Knowledge File »
**Tâche :** Knowledge file qui aide l'IA à écrire user stories, PRDs, analyses alignés sur votre produit.
**Contenu :** Vision produit · 2-3 personas · 3 user journeys clés · framework de priorisation · terminologie domaine.
- **Outil :** LibreChat
- **Durée :** 45 min
- **Livrable :** \`product-context.md\` + user story générée
- **Badge :** User story IA directement collable dans Jira.

## MANAGERS — « Team Knowledge File »
**Tâche :** Knowledge file qui aide l'IA à générer rapports, analyses, communications alignés sur votre équipe.
**Contenu :** Composition · processus (sprint rhythm, review cadence, escalade) · KPIs + mesure · stakeholders par format · conventions de communication.
- **Outil :** LibreChat
- **Durée :** 45 min
- **Livrable :** \`team-context.md\` + rapport généré
- **Badge :** Rapport reconnaissable comme « de votre équipe » — bons KPIs, bon ton, bons stakeholders.

## ADVANCED (Early Adopters) — « Multi-File Knowledge Structure »
**Tâche :** Structure multi-fichiers combinant team + code + product dans une architecture de contexte cohérente.
**Livrables :** \`CLAUDE.md\` + \`docs/team-context.md\` + \`docs/domain-context.md\` + index + évaluation par couche.
**Approche :** Commencez par CLAUDE.md. Ajoutez couche par couche. Testez par couche. Documentez le point de bascule où plus de contexte devient contre-productif. Appliquez la règle du scalpel.
- **Outil :** Claude Code
- **Durée :** 60 min
- **Livrable :** Structure multi-fichiers + évaluation par couche
- **Badge :** Modulaire, chaque fichier <80 lignes, meilleure sortie démontrable que les fichiers individuels.`;

// ═════════════════════════════════════════════════════════════════════════════
// ── WEEK 2 EXPORT ───────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

export const WEEK_2: CurriculumWeek = {
  id: 'week-2',
  number: 2,
  title: 'Level 3 — Context Engineering',
  titleI18n: {
    en: 'Level 3 — Context Engineering',
    nl: 'Level 3 — Context Engineering',
    fr: 'Level 3 — Context Engineering',
  },
  subtitle: 'De 6 lagen die je AI voeden',
  subtitleI18n: {
    en: 'The 6 layers that feed your AI',
    nl: 'De 6 lagen die je AI voeden',
    fr: 'Les 6 couches qui nourrissent votre IA',
  },
  description:
    'Na dit level begrijpt elke deelnemer waarom context het verschil maakt tussen nutteloze en briljante AI-output. Je kent de 6 context-lagen, kunt een CLAUDE.md schrijven, herkent documentatie die je AI saboteert, en hebt een werkende kennisbank gebouwd voor je squad.',
  descriptionI18n: {
    en: 'After this level, every participant understands why context makes the difference between useless and brilliant AI output. You know the 6 context layers, can write a CLAUDE.md, recognise documentation that sabotages your AI, and have built a working knowledge base for your squad.',
    nl: 'Na dit level begrijpt elke deelnemer waarom context het verschil maakt tussen nutteloze en briljante AI-output. Je kent de 6 context-lagen, kunt een CLAUDE.md schrijven, herkent documentatie die je AI saboteert, en hebt een werkende kennisbank gebouwd voor je squad.',
    fr: 'Après ce niveau, chaque participant comprend pourquoi le contexte fait la différence entre une sortie IA inutile et brillante. Vous connaissez les 6 couches de contexte, savez écrire un CLAUDE.md, reconnaissez la documentation qui sabote votre IA, et avez construit une base de connaissances fonctionnelle pour votre squad.',
  },
  objectives: [
    'Ken de 6 context-lagen en zet ze bewust in (codebase, docs, tickets, team, domein, geschiedenis)',
    'Schrijf een effectieve CLAUDE.md die de scalpel-regel volgt (<80 regels)',
    'Herken de 4 documentatie anti-patronen en refactor naar atomaire structuur',
    'Voorkom context rot met session discipline (/clear > /compact)',
    'Begrijp MCP als context-mechanisme + de CLIs-over-MCPs-2026-shift',
  ],
  objectivesI18n: {
    en: [
      'Know the 6 context layers and deploy them deliberately (codebase, docs, tickets, team, domain, history)',
      'Write an effective CLAUDE.md that follows the scalpel rule (<80 lines)',
      'Spot the 4 documentation anti-patterns and refactor to atomic structure',
      'Prevent context rot with session discipline (/clear > /compact)',
      'Understand MCP as context mechanism + the CLIs-over-MCPs-2026-shift',
    ],
    nl: [
      'Ken de 6 context-lagen en zet ze bewust in (codebase, docs, tickets, team, domein, geschiedenis)',
      'Schrijf een effectieve CLAUDE.md die de scalpel-regel volgt (<80 regels)',
      'Herken de 4 documentatie anti-patronen en refactor naar atomaire structuur',
      'Voorkom context rot met session discipline (/clear > /compact)',
      'Begrijp MCP als context-mechanisme + de CLIs-over-MCPs-2026-shift',
    ],
    fr: [
      'Connaître les 6 couches de contexte et les déployer délibérément (codebase, docs, tickets, équipe, domaine, historique)',
      'Écrire un CLAUDE.md efficace qui suit la règle du scalpel (<80 lignes)',
      'Repérer les 4 anti-patterns de documentation et refactorer en structure atomique',
      'Prévenir le context rot avec discipline de session (/clear > /compact)',
      'Comprendre MCP comme mécanisme de contexte + le shift CLIs-over-MCPs-2026',
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
  badgeName: 'Context Architect',
  badgeNameI18n: {
    en: 'Context Architect',
    nl: 'Context Architect',
    fr: 'Context Architect',
  },
  badgeIcon: '🏛️',
  weeklyQuiz: [
    {
      id: 'w2-q1',
      question: 'Hoeveel context-lagen zijn er en welke is het meest gebruikt?',
      questionI18n: {
        en: 'How many context layers are there, and which is most used?',
        nl: 'Hoeveel context-lagen zijn er en welke is het meest gebruikt?',
        fr: 'Combien de couches de contexte existe-t-il, et laquelle est la plus utilisée ?',
      },
      options: [
        '3 lagen — alle 3 evenveel gebruikt',
        '6 lagen — meeste mensen gebruiken er maar 1-2 (codebase + docs)',
        '9 lagen — gelijk verdeeld',
        '1 laag — de prompt zelf',
      ],
      optionsI18n: {
        en: [
          '3 layers — all used equally',
          '6 layers — most people use only 1-2 (codebase + docs)',
          '9 layers — evenly distributed',
          '1 layer — the prompt itself',
        ],
        nl: [
          '3 lagen — alle 3 evenveel gebruikt',
          '6 lagen — meeste mensen gebruiken er maar 1-2 (codebase + docs)',
          '9 lagen — gelijk verdeeld',
          '1 laag — de prompt zelf',
        ],
        fr: [
          '3 couches — toutes utilisées également',
          '6 couches — la plupart n\'en utilisent que 1-2 (codebase + docs)',
          '9 couches — réparties également',
          '1 couche — le prompt lui-même',
        ],
      },
      correctIndex: 1,
      explanation: '6 lagen: Codebase · Documentatie · Tickets · Team · Domein · Geschiedenis. De meeste teams gebruiken er 1-2 (codebase + docs). De andere 4 worden vergeten terwijl ze vaak het verschil maken tussen generieke en briljante output.',
      explanationI18n: {
        en: '6 layers: Codebase · Documentation · Tickets · Team · Domain · History. Most teams use 1-2 (codebase + docs). The other 4 are forgotten — yet they often make the difference between generic and brilliant output.',
        nl: '6 lagen: Codebase · Documentatie · Tickets · Team · Domein · Geschiedenis. De meeste teams gebruiken er 1-2 (codebase + docs). De andere 4 worden vergeten terwijl ze vaak het verschil maken tussen generieke en briljante output.',
        fr: '6 couches : Codebase · Documentation · Tickets · Équipe · Domaine · Historique. La plupart des équipes en utilisent 1-2 (codebase + docs). Les 4 autres sont oubliées alors qu\'elles font souvent la différence entre générique et brillant.',
      },
      bloomLevel: 1,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w2-q2',
      question: 'Wat is de scalpel-regel voor CLAUDE.md volgens ETH Zurich onderzoek (Chase Hughes 2025)?',
      questionI18n: {
        en: 'What\'s the scalpel rule for CLAUDE.md per ETH Zurich research (Chase Hughes 2025)?',
        nl: 'Wat is de scalpel-regel voor CLAUDE.md volgens ETH Zurich onderzoek (Chase Hughes 2025)?',
        fr: 'Quelle est la règle du scalpel pour CLAUDE.md selon la recherche ETH Zurich (Chase Hughes 2025) ?',
      },
      options: [
        'Minimaal 200 regels — alles documenteren',
        '<80 regels — kleiner verslaat groter, altijd',
        'Exact 100 regels — sweet spot',
        'Afhankelijk van project-grootte',
      ],
      optionsI18n: {
        en: [
          'At least 200 lines — document everything',
          '<80 lines — smaller beats bigger, always',
          'Exactly 100 lines — sweet spot',
          'Depends on project size',
        ],
        nl: [
          'Minimaal 200 regels — alles documenteren',
          '<80 regels — kleiner verslaat groter, altijd',
          'Exact 100 regels — sweet spot',
          'Afhankelijk van project-grootte',
        ],
        fr: [
          'Au moins 200 lignes — tout documenter',
          '<80 lignes — plus petit bat plus grand, toujours',
          'Exactement 100 lignes — sweet spot',
          'Dépend de la taille du projet',
        ],
      },
      correctIndex: 1,
      explanation: 'Grote CLAUDE.md (>80 regels) VERLAGEN task success rate en kosten 20% meer tokens. Problemen: excessive tool calling, context pollution, false confidence. Regel: kleiner verslaat groter, altijd.',
      explanationI18n: {
        en: 'Large CLAUDE.md (>80 lines) LOWER task success rate and cost 20% more tokens. Problems: excessive tool calling, context pollution, false confidence. Rule: smaller beats bigger, always.',
        nl: 'Grote CLAUDE.md (>80 regels) VERLAGEN task success rate en kosten 20% meer tokens. Problemen: excessive tool calling, context pollution, false confidence. Regel: kleiner verslaat groter, altijd.',
        fr: 'Les gros CLAUDE.md (>80 lignes) RÉDUISENT le taux de succès et coûtent 20 % de tokens en plus. Problèmes : excessive tool calling, context pollution, false confidence. Règle : plus petit bat plus grand, toujours.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 10,
    },
    {
      id: 'w2-q3',
      question: 'Welke van deze 4 anti-patronen vinden we meest in Worldline Confluence?',
      questionI18n: {
        en: 'Which of the 4 anti-patterns is most common in Worldline Confluence?',
        nl: 'Welke van deze 4 anti-patronen vinden we meest in Worldline Confluence?',
        fr: 'Lequel des 4 anti-patterns est le plus courant dans la Confluence Worldline ?',
      },
      options: [
        'Alleen dubbele waarheden',
        'Alleen kopiëren in plaats van linken',
        'Alle vier: dubbele waarheden · verouderd zonder tijdstempel · conflicterende views · kopiëren i.p.v. linken',
        'Geen enkele — Confluence werkt prima',
      ],
      optionsI18n: {
        en: [
          'Only duplicate truths',
          'Only copying instead of linking',
          'All four: duplicate truths · outdated without timestamp · conflicting views · copying instead of linking',
          'None — Confluence works fine',
        ],
        nl: [
          'Alleen dubbele waarheden',
          'Alleen kopiëren in plaats van linken',
          'Alle vier: dubbele waarheden · verouderd zonder tijdstempel · conflicterende views · kopiëren i.p.v. linken',
          'Geen enkele — Confluence werkt prima',
        ],
        fr: [
          'Seulement vérités dupliquées',
          'Seulement copier au lieu de linker',
          'Les quatre : vérités dupliquées · obsolète sans horodatage · vues conflictuelles · copier au lieu de linker',
          'Aucun — Confluence marche très bien',
        ],
      },
      correctIndex: 2,
      explanation: 'Alle vier bestaan naast elkaar. Oplossing: atomic documentation — elk feit op één plek, alles andere linkt. Begin met de 20% docs die 80% van de AI-queries beantwoordt.',
      explanationI18n: {
        en: 'All four exist side by side. Solution: atomic documentation — every fact in one place, everything else links. Start with the 20% of docs that answer 80% of AI queries.',
        nl: 'Alle vier bestaan naast elkaar. Oplossing: atomic documentation — elk feit op één plek, alles andere linkt. Begin met de 20% docs die 80% van de AI-queries beantwoordt.',
        fr: 'Les quatre coexistent. Solution : atomic documentation — chaque fait à un seul endroit, tout le reste y link. Commencez par les 20 % de docs qui répondent à 80 % des requêtes IA.',
      },
      bloomLevel: 3,
      euAiActRelevant: false,
      points: 10,
    },
    {
      id: 'w2-q4',
      question: 'Bij welk context-gebruik (200K window) moet je verversen volgens Chase Hughes?',
      questionI18n: {
        en: 'At what context usage (200K window) should you refresh per Chase Hughes?',
        nl: 'Bij welk context-gebruik (200K window) moet je verversen volgens Chase Hughes?',
        fr: 'À quel usage de contexte (fenêtre 200K) devez-vous rafraîchir selon Chase Hughes ?',
      },
      options: [
        '80% — pas bij bijna-vol',
        '50% — halverwege',
        '20-25% (~50K tokens) — elke 100K = 2% kwaliteitsdaling',
        'Nooit — model regelt zelf',
      ],
      optionsI18n: {
        en: [
          '80% — only near full',
          '50% — halfway',
          '20-25% (~50K tokens) — every 100K = 2% quality drop',
          'Never — model handles it',
        ],
        nl: [
          '80% — pas bij bijna-vol',
          '50% — halverwege',
          '20-25% (~50K tokens) — elke 100K = 2% kwaliteitsdaling',
          'Nooit — model regelt zelf',
        ],
        fr: [
          '80 % — seulement proche du plein',
          '50 % — à mi-chemin',
          '20-25 % (~50K tokens) — chaque 100K = 2 % de baisse de qualité',
          'Jamais — le modèle gère',
        ],
      },
      correctIndex: 2,
      explanation: 'Context rot: elke 100K tokens = ~2% kwaliteitsdaling. Bij 1M context = ~20% verlies. Ververs met /clear (niet /compact) bij 20-25% gebruik op 200K window. Eén taak per sessie.',
      explanationI18n: {
        en: 'Context rot: every 100K tokens = ~2% quality drop. At 1M context = ~20% loss. Refresh with /clear (not /compact) at 20-25% usage on 200K window. One task per session.',
        nl: 'Context rot: elke 100K tokens = ~2% kwaliteitsdaling. Bij 1M context = ~20% verlies. Ververs met /clear (niet /compact) bij 20-25% gebruik op 200K window. Eén taak per sessie.',
        fr: 'Context rot : chaque 100K tokens = ~2 % de baisse. À 1M = ~20 % de perte. Rafraîchir avec /clear (pas /compact) à 20-25 % d\'usage sur 200K. Une tâche par session.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 10,
    },
    {
      id: 'w2-q5',
      question: 'Waarom zijn CLIs in 2026 vaak beter dan MCPs voor tool-integratie?',
      questionI18n: {
        en: 'Why are CLIs in 2026 often better than MCPs for tool integration?',
        nl: 'Waarom zijn CLIs in 2026 vaak beter dan MCPs voor tool-integratie?',
        fr: 'Pourquoi les CLIs en 2026 sont-ils souvent meilleurs que les MCPs pour l\'intégration d\'outils ?',
      },
      options: [
        'CLIs zijn nieuwer',
        'Token-kosten: bv. Playwright CLI = 90K tokens goedkoper dan Playwright MCP; betere auditability via shell history',
        'MCPs zijn buggy',
        'Er is geen verschil',
      ],
      optionsI18n: {
        en: [
          'CLIs are newer',
          'Token cost: e.g. Playwright CLI = 90K tokens cheaper than Playwright MCP; better auditability via shell history',
          'MCPs are buggy',
          'No difference',
        ],
        nl: [
          'CLIs zijn nieuwer',
          'Token-kosten: bv. Playwright CLI = 90K tokens goedkoper dan Playwright MCP; betere auditability via shell history',
          'MCPs zijn buggy',
          'Er is geen verschil',
        ],
        fr: [
          'Les CLIs sont plus récents',
          'Coût tokens : ex. Playwright CLI = 90K tokens moins cher que Playwright MCP ; meilleure auditability via shell history',
          'Les MCPs ont des bugs',
          'Aucune différence',
        ],
      },
      correctIndex: 1,
      explanation: 'Chase Hughes 2026: "CLIs over MCPs" shift. Redenen: token-efficiëntie (gemeten verschil), zero overhead (terminal-in-terminal), minder context pollution, shell history als audit trail. Worldline-regel: gh/vercel/playwright/psql als CLI, MCP alleen voor tools zonder CLI (Fireflies, Monday, Slack).',
      explanationI18n: {
        en: 'Chase Hughes 2026: "CLIs over MCPs" shift. Reasons: token efficiency (measured difference), zero overhead (terminal-in-terminal), less context pollution, shell history as audit trail. Worldline rule: gh/vercel/playwright/psql as CLI, MCP only for tools without CLI (Fireflies, Monday, Slack).',
        nl: 'Chase Hughes 2026: "CLIs over MCPs" shift. Redenen: token-efficiëntie (gemeten verschil), zero overhead (terminal-in-terminal), minder context pollution, shell history als audit trail. Worldline-regel: gh/vercel/playwright/psql als CLI, MCP alleen voor tools zonder CLI (Fireflies, Monday, Slack).',
        fr: 'Chase Hughes 2026 : shift « CLIs over MCPs ». Raisons : efficacité tokens (diff mesurée), zéro overhead (terminal-in-terminal), moins de context pollution, shell history comme audit trail. Règle Worldline : gh/vercel/playwright/psql en CLI, MCP uniquement pour outils sans CLI (Fireflies, Monday, Slack).',
      },
      bloomLevel: 3,
      euAiActRelevant: false,
      points: 10,
    },
  ],
  days: [
    // ───── DAG 1: Les 3.1 + Lab 3A ─────
    {
      day: 1,
      title: 'Les 3.1 — Waarom Context Alles Is',
      titleI18n: {
        en: 'Lesson 3.1 — Why Context Is Everything',
        nl: 'Les 3.1 — Waarom Context Alles Is',
        fr: 'Leçon 3.1 — Pourquoi le contexte est tout',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w2d1-theory',
          title: 'Les 3.1 — Waarom Context Alles Is',
          titleI18n: {
            en: 'Lesson 3.1 — Why Context Is Everything',
            nl: 'Les 3.1 — Waarom Context Alles Is',
            fr: 'Leçon 3.1 — Pourquoi le contexte est tout',
          },
          type: 'theory',
          duration: 20,
          description: 'Het Experiment + de 6 context-lagen (codebase/docs/tickets/team/domein/geschiedenis) + waarom context de belangrijkste atoom is',
          descriptionI18n: {
            en: 'The Experiment + the 6 context layers (codebase/docs/tickets/team/domain/history) + why context is the most important atom',
            nl: 'Het Experiment + de 6 context-lagen (codebase/docs/tickets/team/domein/geschiedenis) + waarom context de belangrijkste atoom is',
            fr: 'L\'Expérience + les 6 couches de contexte (codebase/docs/tickets/équipe/domaine/historique) + pourquoi le contexte est l\'atome le plus important',
          },
          content: LESSON_3_1_NL,
          contentI18n: { en: LESSON_3_1_EN, nl: LESSON_3_1_NL, fr: LESSON_3_1_FR },
        },
        {
          id: 'w2d1-lab',
          title: 'Lab 3A — Pain Lab: Voel de Confluence Pijn',
          titleI18n: {
            en: 'Lab 3A — Pain Lab: Feel the Confluence Pain',
            nl: 'Lab 3A — Pain Lab: Voel de Confluence Pijn',
            fr: 'Lab 3A — Pain Lab: Ressentez la douleur Confluence',
          },
          type: 'lab',
          duration: 30,
          description: 'Voel de chaos van verrotte documentatie · refactor naar atomic structuur · vergelijk RAG-output',
          descriptionI18n: {
            en: 'Feel the chaos of rotten docs · refactor to atomic structure · compare RAG output',
            nl: 'Voel de chaos van verrotte documentatie · refactor naar atomic structuur · vergelijk RAG-output',
            fr: 'Ressentez le chaos de la doc pourrie · refactor en structure atomique · comparez la sortie RAG',
          },
          content: LAB_3A_NL,
          contentI18n: { en: LAB_3A_EN, nl: LAB_3A_NL, fr: LAB_3A_FR },
          exercises: [
            {
              id: 'w2d1-ex1',
              title: 'Confluence Refactor naar Atomic',
              titleI18n: {
                en: 'Confluence Refactor to Atomic',
                nl: 'Confluence Refactor naar Atomic',
                fr: 'Refactor Confluence en Atomic',
              },
              instructions: 'Lees de messy fraud-detection Confluence pagina. Lever: (1) score op de 4 anti-patterns (welke zie je?), (2) atomic refactor met single source per feit + canonical links + tijdstempels, (3) 1-zin reflectie: welk verschil verwacht je in RAG-output.',
              instructionsI18n: {
                en: 'Read the messy fraud-detection Confluence page. Deliver: (1) score on 4 anti-patterns (which do you see?), (2) atomic refactor with single source per fact + canonical links + timestamps, (3) 1-sentence reflection: what difference do you expect in RAG output.',
                nl: 'Lees de messy fraud-detection Confluence pagina. Lever: (1) score op de 4 anti-patterns (welke zie je?), (2) atomic refactor met single source per feit + canonical links + tijdstempels, (3) 1-zin reflectie: welk verschil verwacht je in RAG-output.',
                fr: 'Lisez la page Confluence messy fraud-detection. Livrez : (1) score sur les 4 anti-patterns (lesquels voyez-vous ?), (2) refactor atomic avec single source par fait + liens canoniques + horodatages, (3) réflexion 1-phrase : quelle différence attendez-vous en sortie RAG.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 2: Les 3.2 + Lab 3B ─────
    {
      day: 2,
      title: 'Les 3.2 — CLAUDE.md',
      titleI18n: {
        en: 'Lesson 3.2 — CLAUDE.md',
        nl: 'Les 3.2 — CLAUDE.md',
        fr: 'Leçon 3.2 — CLAUDE.md',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w2d2-theory',
          title: 'Les 3.2 — CLAUDE.md: Je AI\'s Geheugen',
          titleI18n: {
            en: 'Lesson 3.2 — CLAUDE.md: Your AI\'s Memory',
            nl: 'Les 3.2 — CLAUDE.md: Je AI\'s Geheugen',
            fr: 'Leçon 3.2 — CLAUDE.md : la mémoire de votre IA',
          },
          type: 'theory',
          duration: 20,
          description: '4 secties (Stack/Conventions/Do\'s-Don\'ts/Focus) · scalpel-regel <80 regels · LibreChat memories · context hiërarchie',
          descriptionI18n: {
            en: '4 sections (Stack/Conventions/Do\'s-Don\'ts/Focus) · scalpel rule <80 lines · LibreChat memories · context hierarchy',
            nl: '4 secties (Stack/Conventions/Do\'s-Don\'ts/Focus) · scalpel-regel <80 regels · LibreChat memories · context hiërarchie',
            fr: '4 sections (Stack/Conventions/Do\'s-Don\'ts/Focus) · règle du scalpel <80 lignes · LibreChat memories · hiérarchie du contexte',
          },
          content: LESSON_3_2_NL,
          contentI18n: { en: LESSON_3_2_EN, nl: LESSON_3_2_NL, fr: LESSON_3_2_FR },
        },
        {
          id: 'w2d2-lab',
          title: 'Lab 3B — Bouw Je Kennisbank',
          titleI18n: {
            en: 'Lab 3B — Build Your Knowledge Base',
            nl: 'Lab 3B — Bouw Je Kennisbank',
            fr: 'Lab 3B — Construisez votre base de connaissances',
          },
          type: 'lab',
          duration: 45,
          description: 'CLAUDE.md schrijven voor eigen project + context layering testen + before/after meten',
          descriptionI18n: {
            en: 'Write CLAUDE.md for your own project + test context layering + measure before/after',
            nl: 'CLAUDE.md schrijven voor eigen project + context layering testen + before/after meten',
            fr: 'Écrire CLAUDE.md pour votre projet + tester context layering + mesurer avant/après',
          },
          content: LAB_3B_NL,
          contentI18n: { en: LAB_3B_EN, nl: LAB_3B_NL, fr: LAB_3B_FR },
          exercises: [
            {
              id: 'w2d2-ex1',
              title: 'CLAUDE.md v1.0 (<80 regels) + before/after',
              titleI18n: {
                en: 'CLAUDE.md v1.0 (<80 lines) + before/after',
                nl: 'CLAUDE.md v1.0 (<80 regels) + before/after',
                fr: 'CLAUDE.md v1.0 (<80 lignes) + avant/après',
              },
              instructions: 'Lever: (1) CLAUDE.md voor je project met 4 secties, <80 regels, (2) een echte sprint-taak uitgevoerd met en zonder CLAUDE.md, (3) korte vergelijking op relevantie/iteraties/kwaliteit.',
              instructionsI18n: {
                en: 'Deliver: (1) CLAUDE.md for your project with 4 sections, <80 lines, (2) a real sprint task executed with and without CLAUDE.md, (3) brief comparison on relevance/iterations/quality.',
                nl: 'Lever: (1) CLAUDE.md voor je project met 4 secties, <80 regels, (2) een echte sprint-taak uitgevoerd met en zonder CLAUDE.md, (3) korte vergelijking op relevantie/iteraties/kwaliteit.',
                fr: 'Livrez : (1) CLAUDE.md pour votre projet avec 4 sections, <80 lignes, (2) une vraie tâche sprint exécutée avec et sans CLAUDE.md, (3) comparaison courte sur pertinence/itérations/qualité.',
              },
              type: 'prompt-craft',
              difficulty: 2,
              points: 20,
            },
          ],
        },
      ],
    },
    // ───── DAG 3: Les 3.3 + Role tracks ─────
    {
      day: 3,
      title: 'Les 3.3 — Atomic Documentation',
      titleI18n: {
        en: 'Lesson 3.3 — Atomic Documentation',
        nl: 'Les 3.3 — Atomic Documentation',
        fr: 'Leçon 3.3 — Atomic Documentation',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w2d3-theory',
          title: 'Les 3.3 — Atomic Documentation: Waarom Je Confluence Je AI Saboteert',
          titleI18n: {
            en: 'Lesson 3.3 — Atomic Documentation: Why Your Confluence Sabotages Your AI',
            nl: 'Les 3.3 — Atomic Documentation: Waarom Je Confluence Je AI Saboteert',
            fr: 'Leçon 3.3 — Atomic Documentation : pourquoi votre Confluence sabote votre IA',
          },
          type: 'theory',
          duration: 20,
          description: '4 anti-patronen (dubbele waarheden/verouderd/conflicterend/kopiëren) + AI-Ready checklist + Worldline urgentie',
          descriptionI18n: {
            en: '4 anti-patterns (duplicate truths/outdated/conflicting/copying) + AI-Ready checklist + Worldline urgency',
            nl: '4 anti-patronen (dubbele waarheden/verouderd/conflicterend/kopiëren) + AI-Ready checklist + Worldline urgentie',
            fr: '4 anti-patterns (vérités dupliquées/obsolète/conflictuel/copie) + checklist AI-Ready + urgence Worldline',
          },
          content: LESSON_3_3_NL,
          contentI18n: { en: LESSON_3_3_EN, nl: LESSON_3_3_NL, fr: LESSON_3_3_FR },
        },
        {
          id: 'w2d3-lab',
          title: 'Lab — 6 Rol-opdrachten "Context Architect Challenge"',
          titleI18n: {
            en: 'Lab — 6 Role Tracks "Context Architect Challenge"',
            nl: 'Lab — 6 Rol-opdrachten "Context Architect Challenge"',
            fr: 'Lab — 6 Tracks rôle « Context Architect Challenge »',
          },
          type: 'lab',
          duration: 60,
          description: 'Kies 1 rol-opdracht (Backend/Frontend/QA/PM-UX/Manager/Advanced) en bouw een rol-specifiek kennisbestand',
          descriptionI18n: {
            en: 'Pick 1 role track (Backend/Frontend/QA/PM-UX/Manager/Advanced) and build a role-specific knowledge file',
            nl: 'Kies 1 rol-opdracht (Backend/Frontend/QA/PM-UX/Manager/Advanced) en bouw een rol-specifiek kennisbestand',
            fr: 'Choisissez 1 track rôle (Backend/Frontend/QA/PM-UX/Manager/Advanced) et construisez un knowledge file spécifique au rôle',
          },
          content: ROLE_TRACKS_NL,
          contentI18n: { en: ROLE_TRACKS_EN, nl: ROLE_TRACKS_NL, fr: ROLE_TRACKS_FR },
          exercises: [
            {
              id: 'w2d3-ex1',
              title: 'Rol-specifiek kennisbestand + before/after',
              titleI18n: {
                en: 'Role-specific knowledge file + before/after',
                nl: 'Rol-specifiek kennisbestand + before/after',
                fr: 'Knowledge file spécifique au rôle + avant/après',
              },
              instructions: 'Kies de opdracht passend bij je rol. Lever: kennisbestand (<80 regels per file) + gegenereerd bewijs (component/tests/story/rapportage) + meetbare vergelijking met baseline.',
              instructionsI18n: {
                en: 'Pick the task matching your role. Deliver: knowledge file (<80 lines per file) + generated proof (component/tests/story/report) + measurable baseline comparison.',
                nl: 'Kies de opdracht passend bij je rol. Lever: kennisbestand (<80 regels per file) + gegenereerd bewijs (component/tests/story/rapportage) + meetbare vergelijking met baseline.',
                fr: 'Choisissez la tâche qui correspond à votre rôle. Livrez : knowledge file (<80 lignes par fichier) + preuve générée (composant/tests/story/rapport) + comparaison mesurable avec baseline.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 4: Les 3.4 + Session Hygiene ─────
    {
      day: 4,
      title: 'Les 3.4 — Context Rot',
      titleI18n: {
        en: 'Lesson 3.4 — Context Rot',
        nl: 'Les 3.4 — Context Rot',
        fr: 'Leçon 3.4 — Context Rot',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w2d4-theory',
          title: 'Les 3.4 — Context Rot & Context Discipline',
          titleI18n: {
            en: 'Lesson 3.4 — Context Rot & Context Discipline',
            nl: 'Les 3.4 — Context Rot & Context Discipline',
            fr: 'Leçon 3.4 — Context Rot & discipline du contexte',
          },
          type: 'theory',
          duration: 15,
          description: '2% per 100K regel · session management · /clear > /compact · Worldline routine',
          descriptionI18n: {
            en: '2% per 100K rule · session management · /clear > /compact · Worldline routine',
            nl: '2% per 100K regel · session management · /clear > /compact · Worldline routine',
            fr: 'Règle 2% par 100K · gestion de session · /clear > /compact · routine Worldline',
          },
          content: LESSON_3_4_NL,
          contentI18n: { en: LESSON_3_4_EN, nl: LESSON_3_4_NL, fr: LESSON_3_4_FR },
        },
        {
          id: 'w2d4-lab',
          title: 'Lab — Session Hygiene Practice',
          titleI18n: {
            en: 'Lab — Session Hygiene Practice',
            nl: 'Lab — Session Hygiene Practice',
            fr: 'Lab — Pratique de Session Hygiene',
          },
          type: 'lab',
          duration: 30,
          description: 'Oefen de session discipline routine met 3 aparte Claude Code sessies voor 3 afgebakende sub-taken',
          descriptionI18n: {
            en: 'Practice the session discipline routine with 3 separate Claude Code sessions for 3 scoped sub-tasks',
            nl: 'Oefen de session discipline routine met 3 aparte Claude Code sessies voor 3 afgebakende sub-taken',
            fr: 'Pratiquez la routine de discipline de session avec 3 sessions Claude Code séparées pour 3 sous-tâches cadrées',
          },
          content: `# Lab — Session Hygiene Practice

**Duur: 30 minuten**

## Opdracht
Splits een complexe taak uit je backlog in 3 afgebakende sub-taken. Voor elk:
1. Start een nieuwe Claude Code sessie met \`/clear\`
2. Voer de sub-taak uit
3. Sla tussenresultaten op in bestanden (niet in het gesprek)
4. \`/clear\` voor de volgende

## Vergelijking
Doe parallel dezelfde complexe taak in 1 lange sessie (marathon).
Vergelijk:
- Context-percentage aan eind
- Aantal correcties per sub-taak
- Kwaliteit van het eindresultaat

## Deliverable
Gedeeld document in Slack #ai-academy met: 3 tussenresultaten + vergelijking marathon vs. session-split + aanbevolen pattern voor jouw squad.`,
          contentI18n: {
            en: `# Lab — Session Hygiene Practice

**Duration: 30 minutes**

## Task
Split a complex backlog task into 3 scoped sub-tasks. For each:
1. Start a new Claude Code session with \`/clear\`
2. Execute the sub-task
3. Save intermediate results to files (not chat)
4. \`/clear\` for the next

## Comparison
In parallel, do the same complex task in 1 long session (marathon).
Compare:
- Context percentage at end
- Corrections per sub-task
- Final output quality

## Deliverable
Shared doc in Slack #ai-academy with: 3 intermediate results + marathon vs. session-split comparison + recommended pattern for your squad.`,
            nl: `# Lab — Session Hygiene Practice

**Duur: 30 minuten**

## Opdracht
Splits een complexe taak uit je backlog in 3 afgebakende sub-taken. Voor elk:
1. Start een nieuwe Claude Code sessie met \`/clear\`
2. Voer de sub-taak uit
3. Sla tussenresultaten op in bestanden (niet in het gesprek)
4. \`/clear\` voor de volgende

## Vergelijking
Doe parallel dezelfde complexe taak in 1 lange sessie (marathon).
Vergelijk:
- Context-percentage aan eind
- Aantal correcties per sub-taak
- Kwaliteit van het eindresultaat

## Deliverable
Gedeeld document in Slack #ai-academy met: 3 tussenresultaten + vergelijking marathon vs. session-split + aanbevolen pattern voor jouw squad.`,
            fr: `# Lab — Pratique de Session Hygiene

**Durée : 30 minutes**

## Tâche
Splittez une tâche complexe du backlog en 3 sous-tâches cadrées. Pour chacune :
1. Démarrez une nouvelle session Claude Code avec \`/clear\`
2. Exécutez la sous-tâche
3. Sauvegardez les résultats intermédiaires dans des fichiers (pas dans le chat)
4. \`/clear\` pour la suivante

## Comparaison
En parallèle, faites la même tâche complexe en 1 longue session (marathon).
Comparez :
- Pourcentage de contexte à la fin
- Corrections par sous-tâche
- Qualité de la sortie finale

## Livrable
Document partagé dans Slack #ai-academy : 3 résultats intermédiaires + comparaison marathon vs. session-split + pattern recommandé pour votre squad.`,
          },
          exercises: [
            {
              id: 'w2d4-ex1',
              title: 'Session Marathon vs. Session Split',
              titleI18n: {
                en: 'Session Marathon vs. Session Split',
                nl: 'Session Marathon vs. Session Split',
                fr: 'Session Marathon vs. Session Split',
              },
              instructions: 'Splits 1 complexe taak in 3 sessies met /clear. Lever: 3 tussenresultaten + marathon-vergelijking + aanbevolen pattern voor jouw squad.',
              instructionsI18n: {
                en: 'Split 1 complex task into 3 sessions with /clear. Deliver: 3 intermediate results + marathon comparison + recommended pattern for your squad.',
                nl: 'Splits 1 complexe taak in 3 sessies met /clear. Lever: 3 tussenresultaten + marathon-vergelijking + aanbevolen pattern voor jouw squad.',
                fr: 'Splittez 1 tâche complexe en 3 sessions avec /clear. Livrez : 3 résultats intermédiaires + comparaison marathon + pattern recommandé pour votre squad.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 10,
            },
          ],
        },
      ],
    },
    // ───── DAG 5: Les 3.5 + CLI vs MCP Decision ─────
    {
      day: 5,
      title: 'Les 3.5 — MCP Preview',
      titleI18n: {
        en: 'Lesson 3.5 — MCP Preview',
        nl: 'Les 3.5 — MCP Preview',
        fr: 'Leçon 3.5 — Preview MCP',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w2d5-theory',
          title: 'Les 3.5 — MCP: AI met Superpowers (Preview)',
          titleI18n: {
            en: 'Lesson 3.5 — MCP: AI with Superpowers (Preview)',
            nl: 'Les 3.5 — MCP: AI met Superpowers (Preview)',
            fr: 'Leçon 3.5 — MCP : l\'IA avec superpouvoirs (Preview)',
          },
          type: 'theory',
          duration: 15,
          description: 'Wat is MCP · CLIs over MCPs 2026 shift (Chase Hughes) · Worldline-regel Wave 1 · Security non-negotiable',
          descriptionI18n: {
            en: 'What is MCP · CLIs over MCPs 2026 shift (Chase Hughes) · Worldline rule Wave 1 · Security non-negotiable',
            nl: 'Wat is MCP · CLIs over MCPs 2026 shift (Chase Hughes) · Worldline-regel Wave 1 · Security non-negotiable',
            fr: 'Qu\'est-ce que MCP · shift CLIs over MCPs 2026 (Chase Hughes) · règle Worldline Wave 1 · Sécurité non-négociable',
          },
          content: LESSON_3_5_NL,
          contentI18n: { en: LESSON_3_5_EN, nl: LESSON_3_5_NL, fr: LESSON_3_5_FR },
        },
        {
          id: 'w2d5-lab',
          title: 'Lab — CLI vs MCP Decision Matrix',
          titleI18n: {
            en: 'Lab — CLI vs MCP Decision Matrix',
            nl: 'Lab — CLI vs MCP Decision Matrix',
            fr: 'Lab — Matrice de décision CLI vs MCP',
          },
          type: 'lab',
          duration: 30,
          description: 'Inventariseer je squad\'s tool-integraties en beslis per tool: CLI of MCP of beide',
          descriptionI18n: {
            en: 'Inventory your squad\'s tool integrations and decide per tool: CLI or MCP or both',
            nl: 'Inventariseer je squad\'s tool-integraties en beslis per tool: CLI of MCP of beide',
            fr: 'Inventoriez les intégrations d\'outils de votre squad et décidez par outil : CLI ou MCP ou les deux',
          },
          content: `# Lab — CLI vs MCP Decision Matrix

**Duur: 30 minuten**

## Opdracht
Maak een tool-integratie matrix voor je squad.

## Stappen
1. **Inventariseer** (10 min): lijst 5-10 externe tools die je squad gebruikt (GitHub, Jira, Slack, etc.)
2. **Beslis** (15 min): voor elk tool, kies CLI of MCP (of beide) op basis van:
   - Is er een volwassen CLI? (bv. \`gh\`, \`vercel\`, \`jira-cli\`)
   - Hoeveel tokens kost de MCP versie?
   - Is audit-trail nodig (shell history)?
   - Is structured output vereist (agent loop)?
3. **Documenteer** (5 min): schrijf je keuzes in een markdown tabel met rationale per keuze.

## Deliverable
Decision matrix in \`docs/tooling-strategy.md\` met kolommen: Tool · CLI Available · MCP Available · Keuze · Rationale.`,
          contentI18n: {
            en: `# Lab — CLI vs MCP Decision Matrix

**Duration: 30 minutes**

## Task
Build a tool-integration matrix for your squad.

## Steps
1. **Inventory** (10 min): list 5-10 external tools your squad uses (GitHub, Jira, Slack, etc.)
2. **Decide** (15 min): for each tool, choose CLI or MCP (or both) based on:
   - Is there a mature CLI? (e.g. \`gh\`, \`vercel\`, \`jira-cli\`)
   - How many tokens does the MCP version cost?
   - Is audit trail needed (shell history)?
   - Is structured output required (agent loop)?
3. **Document** (5 min): write your choices in a markdown table with per-choice rationale.

## Deliverable
Decision matrix in \`docs/tooling-strategy.md\` with columns: Tool · CLI Available · MCP Available · Choice · Rationale.`,
            nl: `# Lab — CLI vs MCP Decision Matrix

**Duur: 30 minuten**

## Opdracht
Maak een tool-integratie matrix voor je squad.

## Stappen
1. **Inventariseer** (10 min): lijst 5-10 externe tools die je squad gebruikt (GitHub, Jira, Slack, etc.)
2. **Beslis** (15 min): voor elk tool, kies CLI of MCP (of beide) op basis van:
   - Is er een volwassen CLI? (bv. \`gh\`, \`vercel\`, \`jira-cli\`)
   - Hoeveel tokens kost de MCP versie?
   - Is audit-trail nodig (shell history)?
   - Is structured output vereist (agent loop)?
3. **Documenteer** (5 min): schrijf je keuzes in een markdown tabel met rationale per keuze.

## Deliverable
Decision matrix in \`docs/tooling-strategy.md\` met kolommen: Tool · CLI Available · MCP Available · Keuze · Rationale.`,
            fr: `# Lab — Matrice de décision CLI vs MCP

**Durée : 30 minutes**

## Tâche
Construisez une matrice d'intégration d'outils pour votre squad.

## Étapes
1. **Inventorier** (10 min) : listez 5-10 outils externes utilisés par votre squad (GitHub, Jira, Slack, etc.)
2. **Décider** (15 min) : par outil, choisissez CLI ou MCP (ou les deux) en fonction de :
   - Y a-t-il un CLI mature ? (ex. \`gh\`, \`vercel\`, \`jira-cli\`)
   - Combien de tokens coûte la version MCP ?
   - Audit trail nécessaire (shell history) ?
   - Sortie structurée requise (agent loop) ?
3. **Documenter** (5 min) : écrivez vos choix en tableau markdown avec rationale par choix.

## Livrable
Matrice de décision dans \`docs/tooling-strategy.md\` avec colonnes : Outil · CLI Disponible · MCP Disponible · Choix · Rationale.`,
          },
          exercises: [
            {
              id: 'w2d5-ex1',
              title: 'Tool-integratie decision matrix',
              titleI18n: {
                en: 'Tool-integration decision matrix',
                nl: 'Tool-integratie decision matrix',
                fr: 'Matrice de décision d\'intégration d\'outils',
              },
              instructions: 'Lever een decision matrix (markdown tabel) voor 5-10 tools met keuze CLI/MCP/beide + rationale per keuze. Volg de Worldline Wave-1 regel als baseline.',
              instructionsI18n: {
                en: 'Deliver a decision matrix (markdown table) for 5-10 tools with CLI/MCP/both choice + per-choice rationale. Follow the Worldline Wave-1 rule as baseline.',
                nl: 'Lever een decision matrix (markdown tabel) voor 5-10 tools met keuze CLI/MCP/beide + rationale per keuze. Volg de Worldline Wave-1 regel als baseline.',
                fr: 'Livrez une matrice de décision (tableau markdown) pour 5-10 outils avec choix CLI/MCP/les deux + rationale par choix. Suivez la règle Worldline Wave-1 comme baseline.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 10,
            },
          ],
        },
      ],
    },
  ],
};
