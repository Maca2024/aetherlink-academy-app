// ─────────────────────────────────────────────────────────────────────────────
// WEEK 7 / LEVEL 8 — RALF Loop & Scale (AI-DRAFT v0.1)
// Source: docs/levels/level-8/source.md (⚠️ AI-DRAFT — Review Required)
//
// Structuur v0.1:
//   Dag 1: Les 8.1 Wat is RALF?              + Lab 8A Bouw Je Eerste RALF Loop
//   Dag 2: Les 8.2 Self-Learning Systems     + Lab — 5-componenten pattern design
//   Dag 3: Les 8.3 N8N Automation            + Lab — N8N workflow schetsen
//   Dag 4: Les 8.4 Skills Marketplace        + Lab — skill publiceren
//   Dag 5: Les 8.5 Scale + Finale Challenge  + Lab 8B Finale (teams 2-3)
// ─────────────────────────────────────────────────────────────────────────────

import type { CurriculumWeek } from './curriculum';
import { dailySchedule } from './curriculum-schedule';

// ─── LES 8.1 — Wat is RALF? ──────────────────────────────────────────────────

const LESSON_8_1_NL = `# Les 8.1 — Wat is RALF? De Vier Letters die Alles Veranderen

## Het Einde van Eenmalige AI

Tot Level 7 was elke AI-interactie in wezen eenmalig. Je schrijft een prompt, krijgt output, past toe, klaar. De volgende keer begin je opnieuw. Elke iteratie staat los van de vorige.

Dat werkt, tot je grote problemen wilt oplossen. Grote problemen vragen herhaalde iteratie. Grote problemen vragen een **loop** die je output steeds beter maakt. Niet één keer denken-doen-klaar, maar een cyclus die blijft draaien tot het goed is.

Dat is RALF.

## De Vier Stappen

**R — Review**
Kijk naar wat je hebt. Wat werkt? Wat werkt niet? Wat is onduidelijk?
Niet oordelen. Observeren.

**A — Analyze**
Waarom werkt het werkende? Waarom faalt het falende?
Root cause, niet symptomen.

**L — Learn**
Wat betekent dit voor de volgende iteratie?
Welke aanname moet veranderen? Welke spec moet scherper?

**F — Fix**
Pas de aanpassing toe. Schrijf de spec om. Herformuleer de prompt.
En begin opnieuw — met geleerd inzicht.

Dan terug naar R. **Altijd.**

## De Never-Ending Loop

RALF stopt nooit. Dat is de kern. Elke output is een invoer voor de volgende iteratie. Elke iteratie verfijnt wat er is. De loop draait:

> R → A → L → F → R → A → L → F → R → ...

Je denkt misschien: *"Dat klinkt inefficiënt."* Het tegenovergestelde is waar. Zonder RALF los je één probleem per keer. Met RALF los je hetzelfde probleem steeds beter op — en elke iteratie is goedkoper dan de vorige omdat je leerdata accumuleert.

## Waarom Dit de Perfecte Afsluiting Is

- Level 2 leerde je **hoe te vragen** (Pentagon)
- Level 3 leerde je **hoe context te laden** (Context Engineering)
- Level 4 leerde je **hoe waarom te communiceren** (Intent Engineering)
- Level 5 leerde je **hoe testbaar te maken** (Specification Engineering)
- Level 6 leerde je **het juiste model te kiezen** (Model Landscape)
- Level 7 leerde je **je development-omgeving** (Claude Code Mastery)

Level 8 leert je **hoe dit alles zichzelf blijft verbeteren**. Zonder RALF blijven de vorige 7 levels statische kennis. Met RALF worden ze een **levend systeem**.

## Het Eerste Principe

De grote misvatting over AI: *je moet het één keer goed doen.*
De werkelijkheid: **je moet het elke keer beter doen.**

RALF is niet een framework. Het is een houding.`;

const LESSON_8_1_EN = `# Lesson 8.1 — What Is RALF? The Four Letters That Change Everything

## The End of One-Off AI

Until Level 7, every AI interaction was essentially one-off. You write a prompt, get output, apply it, done. Next time you start over. Each iteration stands alone.

That works, until you want to solve big problems. Big problems demand repeated iteration. Big problems require a **loop** that makes your output steadily better. Not once think-do-done, but a cycle that keeps turning until it's right.

That's RALF.

## The Four Steps

**R — Review**
Look at what you have. What works? What doesn't? What's unclear?
Don't judge. Observe.

**A — Analyze**
Why does the working part work? Why does the failing part fail?
Root cause, not symptoms.

**L — Learn**
What does this mean for the next iteration?
Which assumption must change? Which spec needs sharpening?

**F — Fix**
Apply the adjustment. Rewrite the spec. Reformulate the prompt.
And start over — with learned insight.

Then back to R. **Always.**

## The Never-Ending Loop

RALF never stops. That's the core. Every output is input for the next iteration. Every iteration refines what's there. The loop turns:

> R → A → L → F → R → A → L → F → R → ...

You might think: *"That sounds inefficient."* The opposite is true. Without RALF you solve a problem once. With RALF you solve the same problem ever better — and each iteration is cheaper than the last because learning accumulates.

## Why This Is the Perfect Closing

- Level 2 taught you **how to ask** (Pentagon)
- Level 3 taught you **how to load context** (Context Engineering)
- Level 4 taught you **how to communicate why** (Intent Engineering)
- Level 5 taught you **how to make testable** (Specification Engineering)
- Level 6 taught you **how to pick the right model** (Model Landscape)
- Level 7 taught you **your development environment** (Claude Code Mastery)

Level 8 teaches you **how all of this keeps improving itself**. Without RALF the previous 7 levels remain static knowledge. With RALF they become a **living system**.

## The First Principle

The big misconception about AI: *you have to get it right once.*
The reality: **you have to get it better every time.**

RALF isn't a framework. It's a stance.`;

const LESSON_8_1_FR = `# Leçon 8.1 — Qu'est-ce que RALF ? Les Quatre Lettres Qui Changent Tout

## La Fin de l'IA One-Off

Jusqu'au Level 7, chaque interaction IA était essentiellement one-off. Vous écrivez un prompt, recevez output, appliquez, fini. Prochaine fois vous recommencez. Chaque itération est isolée.

Ça marche, jusqu'à ce que vous vouliez résoudre de gros problèmes. Les gros problèmes demandent des itérations répétées. Les gros problèmes demandent une **boucle** qui améliore votre sortie progressivement. Pas « penser-faire-fini » en une fois, mais un cycle qui tourne jusqu'à ce que ce soit juste.

C'est RALF.

## Les Quatre Étapes

**R — Review**
Regardez ce que vous avez. Qu'est-ce qui fonctionne ? Qu'est-ce qui ne fonctionne pas ?
Ne jugez pas. Observez.

**A — Analyze**
Pourquoi ce qui fonctionne fonctionne ? Pourquoi ce qui échoue échoue ?
Cause profonde, pas symptômes.

**L — Learn**
Que signifie ceci pour la prochaine itération ?
Quelle hypothèse doit changer ? Quelle spec doit être plus nette ?

**F — Fix**
Appliquez l'ajustement. Réécrivez la spec. Reformulez le prompt.
Et recommencez — avec le nouvel insight.

Puis retour à R. **Toujours.**

## La Boucle Sans Fin

RALF ne s'arrête jamais. C'est le cœur. Chaque sortie est l'entrée de la prochaine itération. Chaque itération raffine ce qui existe. La boucle tourne :

> R → A → L → F → R → A → L → F → R → ...

Vous pensez peut-être : *« Ça semble inefficace. »* Le contraire est vrai. Sans RALF vous résolvez un problème à la fois. Avec RALF vous résolvez le même problème toujours mieux — et chaque itération est moins chère que la précédente parce que l'apprentissage s'accumule.

## Pourquoi C'est la Parfaite Clôture

- Level 2 vous a appris **comment demander** (Pentagon)
- Level 3 vous a appris **comment charger le context** (Context Engineering)
- Level 4 vous a appris **comment communiquer le pourquoi** (Intent Engineering)
- Level 5 vous a appris **comment rendre testable** (Specification Engineering)
- Level 6 vous a appris **comment choisir le bon modèle** (Model Landscape)
- Level 7 vous a appris **votre environnement dev** (Claude Code Mastery)

Level 8 vous apprend **comment tout ceci s'améliore soi-même**. Sans RALF les 7 levels précédents restent du savoir statique. Avec RALF ils deviennent un **système vivant**.

## Le Premier Principe

La grande idée fausse sur l'IA : *il faut le faire bien une fois.*
La réalité : **il faut le faire mieux à chaque fois.**

RALF n'est pas un framework. C'est une posture.`;

// ─── LES 8.2 — Self-Learning Systems ─────────────────────────────────────────

const LESSON_8_2_NL = `# Les 8.2 — Self-Learning Systems: AI die Zichzelf Verbetert

## Van RALF naar Self-Learning

Een RALF loop die JIJ bedient is al waardevol. Een RALF loop die zichzelf bedient is transformatief.

Self-learning systems zijn AI-constructies die de RALF cyclus zelf draaien:
- Ze produceren output
- Ze meten hoe goed die output is
- Ze leren van de gap tussen verwacht en geleverd
- Ze passen hun eigen prompts/configuratie aan voor de volgende run

Dit is waar AI-first development écht begint te lonen.

## Drie Niveaus van Self-Learning

**Niveau 1: Metric-gedreven**
De AI meet zichzelf tegen objectieve metrics. Voorbeeld: een test-generatie skill die het pass-rate van gegenereerde tests meet. Als pass-rate daalt onder 80%, past de skill zichzelf aan.

**Niveau 2: Feedback-gedreven**
De AI leert van expliciete menselijke feedback. Voorbeeld: een code-review skill die bijhoudt welke suggesties worden geaccepteerd en welke niet. De skill past zijn prioriteiten aan.

**Niveau 3: Emergent**
De AI leert van impliciete signalen in het systeem. Voorbeeld: een Jira-wizard skill die leert welke tickets daadwerkelijk worden opgepakt en welke blijven liggen — en ticket-creation-stijl aanpast om acceptatie te verhogen.

Bij Worldline begin je met **Niveau 1**. Niveau 2 komt na 4-6 weken ervaring. Niveau 3 is een advanced practice.

## Het Self-Learning Pattern

Elke self-learning skill heeft vijf componenten:

1. **Trigger** — wanneer wordt de skill geactiveerd?
2. **Execution** — wat produceert de skill?
3. **Measurement** — hoe wordt de output gemeten?
4. **Reflection** — wat betekent het meetresultaat?
5. **Adjustment** — welke configuratie verandert voor de volgende run?

Deze vijf lijken op R-A-L-F-R. **Dat is geen toeval.**

## Worldline-Specifieke Toepassingen

**Code-review skill met self-learning:**
- Meet: percentage suggesties geaccepteerd in MRs
- Leert: welke pattern-categorieën (concurrency, errors, PCI) worden meest/minst geaccepteerd
- Past aan: prioriteit-ranking van categorieën

**Test-generatie skill met self-learning:**
- Meet: pass-rate bij eerste run
- Leert: welke test-stijlen leiden tot hogere pass-rate
- Past aan: default test-framework en assertion-style

**Incident post-mortem skill met self-learning:**
- Meet: kwaliteitsscore van post-mortems door lead engineers
- Leert: welke secties worden vaak uitgebreid, welke worden ingekort
- Past aan: default template-structuur

## De Valkuil: Drift

Self-learning zonder guardrails drift. Een systeem dat zichzelf verbetert kan ook zichzelf in de verkeerde richting optimaliseren. Klassiek voorbeeld: een code-review skill die leert dat CRITICAL-meldingen worden genegeerd — en stopt met ze te geven.

**De regel:** elke self-learning skill heeft een **human-in-the-loop checkpoint**. Minimaal wekelijks reviewt een mens de drift-richting. De skill mag leren, maar niet sluipend de guardrails eroderen.`;

const LESSON_8_2_EN = `# Lesson 8.2 — Self-Learning Systems: AI That Improves Itself

## From RALF to Self-Learning

A RALF loop YOU operate is already valuable. A RALF loop that operates itself is transformative.

Self-learning systems are AI constructs that drive the RALF cycle themselves:
- They produce output
- They measure how good that output is
- They learn from the gap between expected and delivered
- They adjust their own prompts/configuration for the next run

This is where AI-first development really starts paying off.

## Three Levels of Self-Learning

**Level 1: Metric-driven**
The AI measures itself against objective metrics. Example: a test-generation skill that measures pass-rate of generated tests. If pass-rate drops below 80%, the skill adjusts itself.

**Level 2: Feedback-driven**
The AI learns from explicit human feedback. Example: a code-review skill that tracks which suggestions are accepted and which aren't. The skill adjusts its priorities.

**Level 3: Emergent**
The AI learns from implicit signals in the system. Example: a Jira wizard skill that learns which tickets actually get picked up vs which linger — and adjusts ticket-creation style to increase acceptance.

At Worldline you start with **Level 1**. Level 2 comes after 4-6 weeks of experience. Level 3 is an advanced practice.

## The Self-Learning Pattern

Every self-learning skill has five components:

1. **Trigger** — when is the skill activated?
2. **Execution** — what does the skill produce?
3. **Measurement** — how is the output measured?
4. **Reflection** — what does the measurement mean?
5. **Adjustment** — which configuration changes for the next run?

These five resemble R-A-L-F-R. **Not by accident.**

## Worldline-Specific Applications

**Code-review skill with self-learning:**
- Measures: percentage of suggestions accepted in MRs
- Learns: which pattern categories (concurrency, errors, PCI) get most/least accepted
- Adjusts: priority ranking of categories

**Test-generation skill with self-learning:**
- Measures: first-run pass-rate
- Learns: which test styles lead to higher pass-rates
- Adjusts: default test framework and assertion style

**Incident post-mortem skill with self-learning:**
- Measures: post-mortem quality score by lead engineers
- Learns: which sections get expanded, which shortened
- Adjusts: default template structure

## The Pitfall: Drift

Self-learning without guardrails drifts. A system that improves itself can also optimise itself in the wrong direction. Classic example: a code-review skill that learns CRITICAL alerts are ignored — and stops giving them.

**The rule:** every self-learning skill has a **human-in-the-loop checkpoint**. At least weekly a human reviews the drift direction. The skill may learn, but may not quietly erode guardrails.`;

const LESSON_8_2_FR = `# Leçon 8.2 — Systèmes Auto-Apprenants : IA Qui S'Améliore Elle-Même

## De RALF à Self-Learning

Une boucle RALF que VOUS opérez est déjà précieuse. Une boucle RALF qui s'opère elle-même est transformative.

Les systèmes self-learning sont des constructions IA qui pilotent le cycle RALF elles-mêmes :
- Elles produisent une sortie
- Elles mesurent la qualité de cette sortie
- Elles apprennent de l'écart entre attendu et livré
- Elles ajustent leurs propres prompts/config pour la prochaine run

C'est là que le dev AI-first commence vraiment à payer.

## Trois Niveaux de Self-Learning

**Niveau 1 : Metric-driven**
L'IA se mesure contre des métriques objectives. Exemple : un skill test-gen qui mesure le pass-rate. Si pass-rate < 80%, le skill s'ajuste.

**Niveau 2 : Feedback-driven**
L'IA apprend du feedback humain explicite. Exemple : un skill code-review qui suit quelles suggestions sont acceptées.

**Niveau 3 : Emergent**
L'IA apprend de signaux implicites dans le système. Exemple : un Jira wizard qui apprend quels tickets sont pris et lesquels traînent.

Chez Worldline vous commencez au **Niveau 1**. Niveau 2 après 4-6 semaines. Niveau 3 est advanced.

## Le Pattern Self-Learning

Chaque skill self-learning a cinq composants :

1. **Trigger** — quand le skill s'active ?
2. **Execution** — que produit le skill ?
3. **Measurement** — comment la sortie est mesurée ?
4. **Reflection** — que signifie la mesure ?
5. **Adjustment** — quelle config change pour la prochaine run ?

Ces cinq ressemblent à R-A-L-F-R. **Ce n'est pas un hasard.**

## Applications Worldline-Spécifiques

**Skill code-review self-learning :**
- Mesure : % suggestions acceptées en MR
- Apprend : quelles catégories (concurrency, errors, PCI) sont le plus/moins acceptées
- Ajuste : priorité des catégories

**Skill test-gen self-learning :**
- Mesure : pass-rate première run
- Apprend : quels styles donnent des pass-rates plus élevés
- Ajuste : framework et style d'assertion par défaut

## Le Piège : Drift

Self-learning sans guardrails dérive. Un système qui s'améliore peut aussi s'optimiser dans la mauvaise direction. Exemple classique : un skill code-review qui apprend que les alertes CRITICAL sont ignorées — et arrête de les donner.

**La règle :** chaque skill self-learning a un **human-in-the-loop checkpoint**. Au moins hebdomadaire un humain review la direction de drift. Le skill peut apprendre, mais pas éroder silencieusement les guardrails.`;

// ─── LES 8.3 — N8N Automation ────────────────────────────────────────────────

const LESSON_8_3_NL = `# Les 8.3 — N8N Automation: Workflows die Nooit Slapen

## De Kracht van Asynchroon

Jij slaapt. Jouw AI hoeft niet te slapen.

N8N is een workflow-automatiseringstool die RALF loops 24/7 kan draaien. Elke nacht, elk weekend, elke feestdag — terwijl jij rust, kan je systeem doorwerken.

## Typische Nachtelijke Workflows

**Dagelijkse rapportage (21:00):**
1. Haal sprint-metrics uit Jira (via MCP)
2. Haal MR-statistieken uit GitLab (via MCP)
3. Correleer: welke tickets zijn gemerged, welke blijven open
4. Genereer management rapport
5. Plaats in Confluence, notificeer squad lead in Slack

Terwijl jij thuis eet, staat er om 22:00 een complete rapportage klaar.

**Nachtelijke test-suite uitbreiding (02:00):**
1. Identificeer merged MRs van de dag
2. Per MR: check of er voldoende test-coverage is
3. Voor MRs onder threshold: genereer aanvullende tests
4. Commit tests in een \`nightly-tests\` branch
5. Maak MR voor review de volgende ochtend

De QA-engineer opent 's ochtends zijn laptop en heeft 20 minuten review-werk in plaats van 4 uur test-schrijfwerk.

**Weekend documentatie-scan (zaterdag 03:00):**
1. Scan alle code-wijzigingen van de week
2. Identificeer functies waar docstrings ontbreken of verouderd zijn
3. Genereer docstring-updates
4. Maak een samenvattende MR
5. Notificeer de team lead maandag 09:00

Documentatie blijft up-to-date zonder dat iemand er expliciet tijd voor reserveert.

## De N8N + Claude Code Architectuur

\`\`\`
N8N Scheduler (cron trigger)
    ↓
HTTP request naar interne endpoint
    ↓
Claude Code headless mode (claude -p "...")
    ↓
Claude Code leest context (CLAUDE.md + @-mentions + MCP)
    ↓
Output wordt verwerkt door N8N
    ↓
Resultaat naar Jira/GitLab/Slack/Confluence
\`\`\`

N8N is de orchestrator. Claude Code doet het denkwerk. MCPs zijn de handen. Samen werken ze terwijl jij slaapt.

## Worldline Guardrails voor Nachtelijke Workflows

De Level 6 guardrails gelden **extra zwaar** wanneer niemand toekijkt:

- **Geen auto-deploys naar productie.** Elke AI-gegenereerde wijziging stopt bij "MR aangemaakt". Een mens keurt goed.
- **Geen PCI/PII data in de workflow.** Data blijft gesanitiseerd.
- **Minimale permissions per MCP.** Read-only tenzij strikt nodig.
- **Audit-trail verplicht.** Elke actie logt wat, wanneer, waarom.
- **Circuit breaker.** Als 3 opeenvolgende runs falen, stopt de workflow en notificeert een mens.

## De Echte Waarde

Het punt van nachtelijke workflows is niet "meer werk doen". Het punt is **kwaliteits-tijd vrijmaken voor mensen**. Als de AI de repetitieve documentatie-updates doet, kan de engineer zich focussen op architectuur. Als de AI de routine-rapportages maakt, kan de manager zich focussen op strategie.

Automatisering die waarde creëert door menselijke aandacht te verplaatsen, niet te vervangen.`;

const LESSON_8_3_EN = `# Lesson 8.3 — N8N Automation: Workflows That Never Sleep

## The Power of Asynchronous

You sleep. Your AI doesn't have to.

N8N is a workflow automation tool that can run RALF loops 24/7. Every night, every weekend, every holiday — while you rest, your system can keep working.

## Typical Overnight Workflows

**Daily reporting (21:00):**
1. Fetch sprint metrics from Jira (via MCP)
2. Fetch MR statistics from GitLab (via MCP)
3. Correlate: which tickets got merged, which stay open
4. Generate management report
5. Post to Confluence, notify squad lead in Slack

While you're eating dinner, by 22:00 a complete report is waiting.

**Nightly test-suite expansion (02:00):**
1. Identify day's merged MRs
2. Per MR: check if test coverage is adequate
3. For MRs below threshold: generate additional tests
4. Commit tests to a \`nightly-tests\` branch
5. Create MR for next-morning review

The QA engineer opens their laptop in the morning to 20 minutes of review work instead of 4 hours of test-writing.

**Weekend documentation scan (Saturday 03:00):**
1. Scan all code changes of the week
2. Identify functions with missing or outdated docstrings
3. Generate docstring updates
4. Create summarising MR
5. Notify team lead Monday 09:00

Documentation stays up to date without anyone explicitly carving out time.

## The N8N + Claude Code Architecture

\`\`\`
N8N Scheduler (cron trigger)
    ↓
HTTP request to internal endpoint
    ↓
Claude Code headless mode (claude -p "...")
    ↓
Claude Code loads context (CLAUDE.md + @-mentions + MCP)
    ↓
Output processed by N8N
    ↓
Result to Jira/GitLab/Slack/Confluence
\`\`\`

N8N is the orchestrator. Claude Code does the thinking. MCPs are the hands. Together they work while you sleep.

## Worldline Guardrails for Overnight Workflows

Level 6 guardrails apply **extra strictly** when no one watches:

- **No auto-deploys to production.** Every AI-generated change stops at "MR created". A human approves.
- **No PCI/PII data in the workflow.** Data stays sanitised.
- **Minimum permissions per MCP.** Read-only unless strictly needed.
- **Audit trail mandatory.** Every action logs what, when, why.
- **Circuit breaker.** If 3 consecutive runs fail, the workflow stops and notifies a human.

## The Real Value

The point of overnight workflows isn't "more work done". The point is **freeing up quality time for humans**. If AI handles the repetitive documentation updates, the engineer can focus on architecture. If AI handles routine reports, the manager can focus on strategy.

Automation that creates value by redirecting human attention, not replacing it.`;

const LESSON_8_3_FR = `# Leçon 8.3 — Automation N8N : Workflows Qui Ne Dorment Jamais

## La Puissance de l'Asynchrone

Vous dormez. Votre IA n'est pas obligée.

N8N est un outil d'automation workflow qui peut faire tourner des boucles RALF 24/7. Chaque nuit, chaque weekend, chaque jour férié — pendant que vous vous reposez, votre système peut continuer à travailler.

## Workflows Nocturnes Typiques

**Rapport quotidien (21:00) :**
1. Récupérer metrics sprint Jira (via MCP)
2. Récupérer statistiques MR GitLab (via MCP)
3. Corréler : quels tickets mergés, lesquels restent ouverts
4. Générer rapport management
5. Poster dans Confluence, notifier squad lead Slack

Pendant que vous dînez, à 22:00 un rapport complet est prêt.

**Extension nocturne test-suite (02:00) :**
1. Identifier MRs mergées du jour
2. Par MR : vérifier si test-coverage suffisante
3. Pour MRs sous threshold : générer tests supplémentaires
4. Commit dans branche \`nightly-tests\`
5. Créer MR pour review matin suivant

Le QA engineer ouvre son laptop le matin avec 20 min de review au lieu de 4h d'écriture tests.

**Scan documentation weekend (samedi 03:00) :**
1. Scanner tous changements code de la semaine
2. Identifier fonctions avec docstrings manquantes/obsolètes
3. Générer mises à jour docstring
4. Créer MR récapitulative
5. Notifier team lead lundi 09:00

Documentation reste à jour sans temps explicite.

## L'Architecture N8N + Claude Code

\`\`\`
N8N Scheduler (cron trigger)
    ↓
HTTP request vers endpoint interne
    ↓
Claude Code mode headless (claude -p "...")
    ↓
Claude Code charge context (CLAUDE.md + @-mentions + MCP)
    ↓
Sortie traitée par N8N
    ↓
Résultat vers Jira/GitLab/Slack/Confluence
\`\`\`

N8N est l'orchestrator. Claude Code fait le travail mental. Les MCPs sont les mains.

## Guardrails Worldline pour Workflows Nocturnes

Les guardrails Level 6 s'appliquent **d'autant plus** quand personne ne regarde :

- **Pas de auto-deploys en prod.** Toute modif IA s'arrête à "MR créée". Un humain approuve.
- **Pas de données PCI/PII dans le workflow.** Data sanitisée.
- **Permissions minimum par MCP.** Read-only sauf strictement nécessaire.
- **Audit trail obligatoire.** Chaque action log quoi, quand, pourquoi.
- **Circuit breaker.** Si 3 runs consécutives échouent, le workflow s'arrête et notifie un humain.

## La Vraie Valeur

Le but des workflows nocturnes n'est pas « faire plus de travail ». C'est **libérer du temps de qualité pour les humains**. Si l'IA fait les maj doc répétitives, l'engineer peut se focaliser sur l'architecture.

Automation qui crée de la valeur en redirigeant l'attention humaine, pas en la remplaçant.`;

// ─── LES 8.4 — Skills Marketplace ────────────────────────────────────────────

const LESSON_8_4_NL = `# Les 8.4 — De Skills Marketplace: Collectieve Intelligentie

## Van Persoonlijk naar Gedeeld

In Level 7 leerde je skills bouwen en delen binnen je squad. Level 8 verbreedt dit: de **Worldline Skills Marketplace** — een interne bibliotheek waar alle squads skills publiceren, reviewen, en hergebruiken.

## Hoe de Marketplace Werkt

De Marketplace is een GitLab-repository met een specifieke structuur:

\`\`\`
worldline-skills-marketplace/
├── catalog/
│   ├── backend/
│   │   ├── code-review/
│   │   │   ├── SKILL.md
│   │   │   ├── README.md
│   │   │   └── metadata.json
│   │   └── migration-assistant/
│   ├── frontend/
│   ├── qa/
│   ├── pm-ux/
│   └── cross-functional/
├── index.md
└── CONTRIBUTING.md
\`\`\`

Elke skill heeft:
- \`SKILL.md\` — de eigenlijke skill (Level 7 format)
- \`README.md\` — installatie-instructies, voorbeelden, auteur
- \`metadata.json\` — versie, dependencies, squad-of-origin, review-status

## Contributie-Workflow

**Publiceren:**
1. Test je skill 5x op verschillende input in je eigen squad
2. Peer-review door minimaal 2 mensen (Level 7 best practice)
3. Maak MR naar \`worldline-skills-marketplace\`
4. Reviewer uit andere squad checkt op generaliseerbaarheid
5. Merge → skill is beschikbaar voor iedereen

**Gebruiken:**
1. Zoek in de catalog-structuur of via de index.md
2. Clone of symlink naar je \`.claude/skills/\` map
3. Run de skill zoals elke andere skill
4. Geef feedback via GitLab issues

## Kwaliteitscriteria voor de Marketplace

Niet elke skill hoort thuis in de Marketplace.

**✅ Wel geschikt:**
- Squad-agnostisch: werkt voor minstens 3 squads
- Getest: 5+ runs, documented pass-rate
- Guarded: Worldline PCI/PII compliance expliciet
- Metrisch: output is objectief meetbaar
- Onderhouden: auteur commit tot updates

**❌ Niet geschikt:**
- Squad-specifiek (blijft in squad repo)
- Experimenteel (blijft persoonlijk)
- Ongetest of zelden gebruikt
- Met hardcoded credentials of paden
- Zonder expliciete owner

## De Collectieve RALF Loop

De Marketplace zelf is een RALF loop op organisatie-niveau:

- **Review:** welke skills worden het meest gedownload?
- **Analyze:** welke skills krijgen feedback-issues?
- **Learn:** welke categorieën missen in het assortiment?
- **Fix:** gerichte skills-hackathons om gaps op te vullen

Eén keer per kwartaal een Marketplace-review met squad leads. Drift detecteren. Kwaliteit bewaken. Nieuwe prioriteiten zetten.

## Persoonlijk Belang

Bijdragen aan de Marketplace is niet alleen altruïsme. Het is carrière-investering:
- Je skills worden gebruikt door 300+ engineers
- Metrics zichtbaar in je performance review
- Cross-squad reputation
- Directe input op hoe Worldline met AI werkt

**De beste skill-auteurs worden de facto thought leaders op hun vakgebied.**`;

const LESSON_8_4_EN = `# Lesson 8.4 — The Skills Marketplace: Collective Intelligence

## From Personal to Shared

In Level 7 you learned to build and share skills within your squad. Level 8 broadens this: the **Worldline Skills Marketplace** — an internal library where all squads publish, review, and reuse skills.

## How the Marketplace Works

The Marketplace is a GitLab repo with a specific structure:

\`\`\`
worldline-skills-marketplace/
├── catalog/
│   ├── backend/
│   │   ├── code-review/
│   │   │   ├── SKILL.md
│   │   │   ├── README.md
│   │   │   └── metadata.json
│   │   └── migration-assistant/
│   ├── frontend/
│   ├── qa/
│   ├── pm-ux/
│   └── cross-functional/
├── index.md
└── CONTRIBUTING.md
\`\`\`

Each skill has:
- \`SKILL.md\` — the actual skill (Level 7 format)
- \`README.md\` — install instructions, examples, author
- \`metadata.json\` — version, dependencies, squad-of-origin, review status

## Contribution Workflow

**Publishing:**
1. Test your skill 5x on different inputs in your squad
2. Peer-review by minimum 2 people (Level 7 best practice)
3. MR to \`worldline-skills-marketplace\`
4. Reviewer from another squad checks generalisability
5. Merge → available to everyone

**Using:**
1. Search in catalog structure or via index.md
2. Clone or symlink to your \`.claude/skills/\`
3. Run like any other skill
4. Feedback via GitLab issues

## Quality Criteria

Not every skill belongs in the Marketplace.

**✅ Suitable:**
- Squad-agnostic: works for 3+ squads
- Tested: 5+ runs, documented pass-rate
- Guarded: Worldline PCI/PII compliance explicit
- Metric-capable: output objectively measurable
- Maintained: author commits to updates

**❌ Not suitable:**
- Squad-specific (stays in squad repo)
- Experimental (stays personal)
- Untested or rarely used
- With hardcoded credentials or paths
- Without explicit owner

## The Collective RALF Loop

The Marketplace itself is an org-level RALF loop:

- **Review:** which skills get downloaded most?
- **Analyze:** which skills get feedback issues?
- **Learn:** which categories are missing?
- **Fix:** targeted skills-hackathons to fill gaps

Once per quarter a Marketplace review with squad leads. Detect drift. Safeguard quality. Set new priorities.

## Personal Stake

Contributing to the Marketplace isn't just altruism. It's career investment:
- Your skills used by 300+ engineers
- Metrics visible in performance reviews
- Cross-squad reputation
- Direct influence on Worldline AI practices

**The best skill authors become de facto thought leaders in their area.**`;

const LESSON_8_4_FR = `# Leçon 8.4 — Le Skills Marketplace : Intelligence Collective

## Du Personnel au Partagé

Au Level 7 vous avez appris à construire et partager des skills dans votre squad. Level 8 élargit ça : le **Worldline Skills Marketplace** — une bibliothèque interne où toutes les squads publient, reviewent, et réutilisent des skills.

## Comment le Marketplace Fonctionne

Le Marketplace est un repo GitLab avec une structure spécifique :

\`\`\`
worldline-skills-marketplace/
├── catalog/
│   ├── backend/
│   │   ├── code-review/
│   │   │   ├── SKILL.md
│   │   │   ├── README.md
│   │   │   └── metadata.json
│   ├── frontend/
│   ├── qa/
│   ├── pm-ux/
│   └── cross-functional/
├── index.md
└── CONTRIBUTING.md
\`\`\`

Chaque skill a :
- \`SKILL.md\` — le skill lui-même (format Level 7)
- \`README.md\` — instructions install, exemples, auteur
- \`metadata.json\` — version, dependencies, squad-d'origine, statut review

## Workflow de Contribution

**Publier :**
1. Tester skill 5x sur inputs différents dans votre squad
2. Peer-review par minimum 2 personnes
3. MR vers \`worldline-skills-marketplace\`
4. Reviewer d'une autre squad vérifie généralisabilité
5. Merge → disponible pour tous

**Utiliser :**
1. Chercher dans catalog ou via index.md
2. Clone ou symlink vers \`.claude/skills/\`
3. Lancer comme n'importe quel skill
4. Feedback via issues GitLab

## Critères de Qualité

**✅ Adapté :**
- Squad-agnostic : fonctionne pour 3+ squads
- Testé : 5+ runs, pass-rate documenté
- Guarded : conformité PCI/PII Worldline explicite
- Mesurable : sortie objectivement mesurable
- Maintenu : auteur s'engage aux updates

**❌ Pas adapté :**
- Squad-spécifique
- Expérimental
- Non testé
- Avec credentials hardcoded
- Sans owner explicite

## La Boucle RALF Collective

Le Marketplace est lui-même une boucle RALF org-level :

- **Review :** quels skills téléchargés le plus ?
- **Analyze :** quels skills ont issues feedback ?
- **Learn :** quelles catégories manquent ?
- **Fix :** hackathons skills ciblés pour combler gaps

Une fois par trimestre : review Marketplace avec squad leads.

## Intérêt Personnel

Contribuer n'est pas pure altruisme. C'est investissement carrière :
- Vos skills utilisés par 300+ engineers
- Metrics visibles en performance review
- Réputation cross-squad
- Influence directe sur pratique IA Worldline

**Les meilleurs auteurs de skills deviennent thought leaders de facto.**`;

// ─── LES 8.5 — Scale ─────────────────────────────────────────────────────────

const LESSON_8_5_NL = `# Les 8.5 — Scale: Van Individueel naar Team naar Organisatie

## De Drie Schalen

Wat je in Level 1-7 leerde werkt op **individueel niveau**. Level 8 breidt dit uit naar **team niveau** en **organisatie niveau**. Dezelfde principes, andere toepassing.

## Schaal 1: Individueel (Level 1-7 recap)

- Pentagon prompts voor jouw taken
- CLAUDE.md voor jouw context
- Skills voor jouw terugkerende werk
- Jouw RALF loop op jouw output

Dit schaalt met jou. Stopt als jij stopt.

## Schaal 2: Team (Level 8 nieuw)

- **Shared CLAUDE.md** op project-niveau (team context)
- **Shared skills** in \`.claude/skills/\` (team workflows)
- **Shared MCPs** in \`.claude.json\` (team integraties)
- **Shared RALF loop** via team retrospectives + skill-updates

Dit schaalt met je team. Blijft waardevol als teamleden wisselen.

## Schaal 3: Organisatie (Level 8 finale)

- **Skills Marketplace** (Worldline-wide)
- **Org-level MCPs** (gedeelde Jira/GitLab/Confluence configuraties)
- **Cross-squad RALF metrics** (welke skills werken waar het best?)
- **Leadership alignment** via Gertjans metrics-framework

Dit schaalt met Worldline als bedrijf. Genereert waarde onafhankelijk van individuen.

## De Migratie-Strategie

- **Week 1-4:** individueel niveau. Bouw je persoonlijke workflow.
- **Week 5-8:** team niveau. Deel je beste skills met je squad. Bouw gedeelde context.
- **Week 9+:** organisatie niveau. Publiceer top-skills in de Marketplace. Draag bij aan cross-squad initiatives.

Probeer niet alle drie tegelijk. Bouw laag voor laag.

## Leadership Principes voor AI-First Teams

Als je squad lead of manager bent, dit zijn de vijf regels:

**1. Bescherm exploratie-tijd.**
Engineers hebben tijd nodig om skills te bouwen. Plan 10-20% tijd per sprint expliciet voor tool-building.

**2. Beloon delen, niet bezitten.**
Een skill in de Marketplace is meer waard dan een skill in één squad. Metrics reflecteren dit.

**3. Meet de RALF loop zelf.**
Hoe vaak wordt er retrospective-geleerd? Hoe vaak leidt dat tot skill-updates? Dit is je echte KPI.

**4. Geef veiligheid aan falen.**
AI-experimenten die niet werken zijn leermomenten, geen afbreukrisico's. Maak dat expliciet.

**5. Houd de guardrails heilig.**
Productiviteit mag nooit compliance overstijgen. Bij twijfel: compliance wint.

## De Finale Waarheid

Waarom je AI-first werkt is niet omdat AI beter is dan mensen. Het is omdat mensen **met AI** beter zijn dan mensen **zonder AI**. De loop is niet AI-vs-mens. De loop is:

> mens + AI → output → mens + AI → beter output → mens + AI → nog beter

**Dat is RALF op elke schaal.**

**Dat is Worldline AI-First.**

Welkom in de never-ending loop.`;

const LESSON_8_5_EN = `# Lesson 8.5 — Scale: From Individual to Team to Organisation

## The Three Scales

What you learned in Levels 1-7 works at **individual level**. Level 8 extends this to **team level** and **organisation level**. Same principles, different application.

## Scale 1: Individual (Levels 1-7 recap)

- Pentagon prompts for your tasks
- CLAUDE.md for your context
- Skills for your recurring work
- Your RALF loop on your output

Scales with you. Stops when you stop.

## Scale 2: Team (Level 8 new)

- **Shared CLAUDE.md** at project level (team context)
- **Shared skills** in \`.claude/skills/\` (team workflows)
- **Shared MCPs** in \`.claude.json\` (team integrations)
- **Shared RALF loop** via team retrospectives + skill updates

Scales with your team. Stays valuable when members change.

## Scale 3: Organisation (Level 8 finale)

- **Skills Marketplace** (Worldline-wide)
- **Org-level MCPs** (shared Jira/GitLab/Confluence configs)
- **Cross-squad RALF metrics** (which skills work best where?)
- **Leadership alignment** via Gertjan's metrics framework

Scales with Worldline as a company. Generates value independent of individuals.

## The Migration Strategy

- **Weeks 1-4:** individual. Build your personal workflow.
- **Weeks 5-8:** team. Share your best skills with your squad. Build shared context.
- **Weeks 9+:** organisation. Publish top skills to the Marketplace. Contribute cross-squad.

Don't try all three at once. Build layer by layer.

## Leadership Principles for AI-First Teams

If you're a squad lead or manager, these five rules:

**1. Protect exploration time.**
Engineers need time to build skills. Plan 10-20% per sprint explicitly for tool-building.

**2. Reward sharing, not owning.**
A skill in the Marketplace is worth more than a skill in one squad. Metrics reflect this.

**3. Measure the RALF loop itself.**
How often is retro-learning happening? How often does that lead to skill updates? This is your real KPI.

**4. Make failure safe.**
AI experiments that don't work are learning moments, not liabilities. Make that explicit.

**5. Keep guardrails sacred.**
Productivity must never override compliance. When in doubt: compliance wins.

## The Final Truth

Why AI-first works isn't because AI is better than humans. It's because humans **with AI** are better than humans **without AI**. The loop isn't AI-vs-human. The loop is:

> human + AI → output → human + AI → better output → human + AI → even better

**That's RALF at every scale.**

**That's Worldline AI-First.**

Welcome to the never-ending loop.`;

const LESSON_8_5_FR = `# Leçon 8.5 — Scale : De l'Individu à l'Équipe à l'Organisation

## Les Trois Échelles

Ce que vous avez appris aux Levels 1-7 fonctionne au **niveau individuel**. Level 8 étend ça au **niveau équipe** et **niveau organisation**. Mêmes principes, applications différentes.

## Échelle 1 : Individuelle (rappel Levels 1-7)

- Prompts Pentagon pour vos tâches
- CLAUDE.md pour votre context
- Skills pour votre travail récurrent
- Votre boucle RALF sur votre sortie

Scale avec vous. S'arrête quand vous vous arrêtez.

## Échelle 2 : Équipe (nouveau Level 8)

- **CLAUDE.md partagé** au niveau projet (context équipe)
- **Skills partagés** dans \`.claude/skills/\` (workflows équipe)
- **MCPs partagés** dans \`.claude.json\` (intégrations équipe)
- **Boucle RALF partagée** via rétros équipe + updates skill

Scale avec votre équipe. Reste précieux quand membres changent.

## Échelle 3 : Organisation (finale Level 8)

- **Skills Marketplace** (Worldline-wide)
- **MCPs org-level** (configs Jira/GitLab/Confluence partagées)
- **Metrics RALF cross-squad** (quels skills marchent où ?)
- **Alignement leadership** via framework metrics Gertjan

Scale avec Worldline. Génère valeur indépendante des individus.

## Stratégie de Migration

- **Semaines 1-4 :** individuel. Construire workflow personnel.
- **Semaines 5-8 :** équipe. Partager meilleurs skills avec squad.
- **Semaines 9+ :** organisation. Publier top skills au Marketplace.

N'essayez pas les trois en même temps. Construisez couche par couche.

## Principes Leadership pour Équipes AI-First

Si vous êtes squad lead ou manager, voici les cinq règles :

**1. Protéger le temps d'exploration.**
Les engineers ont besoin de temps pour construire des skills. 10-20% par sprint.

**2. Récompenser le partage, pas la possession.**
Skill au Marketplace vaut plus que skill dans une squad.

**3. Mesurer la boucle RALF elle-même.**
À quelle fréquence retro-learning ? Combien mène à updates skill ? Vraie KPI.

**4. Rendre l'échec sûr.**
Expériences IA qui ne marchent pas = moments d'apprentissage.

**5. Garder les guardrails sacrés.**
Productivité ne doit jamais écraser compliance. En doute : compliance gagne.

## La Vérité Finale

Pourquoi AI-first marche n'est pas parce que l'IA est meilleure que les humains. C'est parce que les humains **avec IA** sont meilleurs que les humains **sans IA**. La boucle n'est pas IA-vs-humain. La boucle est :

> humain + IA → sortie → humain + IA → meilleure sortie → humain + IA → encore meilleur

**C'est RALF à chaque échelle.**

**C'est Worldline AI-First.**

Bienvenue dans la boucle sans fin.`;

// ─── LAB 8A — Bouw Je Eerste RALF Loop ───────────────────────────────────────

const LAB_8A_NL = `# Lab 8A — Bouw Je Eerste RALF Loop (45 min)

Je gaat een kleine maar complete RALF loop bouwen voor een terugkerende taak. Geen theorie meer — alleen doen.

## Stap 1: Kies Je Taak (5 min)

Kies een taak die je MINSTENS 3x per week doet. Moet aan vier criteria voldoen:
- Objectief meetbaar (er is een "goed" en "slecht")
- Herhaalbaar (kern-werk wijzigt niet)
- Instrueerbaar (je kunt beschrijven wat je doet)
- Niet-kritisch (falen is OK voor dit lab)

**Voorbeelden:** MR descriptions schrijven · sprint-retrospective samenvattingen · commit-message reviewen · Slack-status updates.

## Stap 2: Baseline Meten (10 min)

Voer de taak één keer handmatig uit. Meet:
- Tijd (minuten)
- Kwaliteit-zelfscore (1-10)
- Iteraties (hoeveel rondes tot acceptabel)

Schrijf de meting op. Dit is je **pre-RALF baseline**.

## Stap 3: Bouw De Skill (15 min)

Bouw een skill (Level 7 format) die de taak automatiseert. Voeg aan de standaard SKILL.md sectie een extra toe:

\`\`\`markdown
## RALF Self-Measurement

Na elke uitvoering, documenteer in een log-file:
- Datum/tijd
- Input (kort)
- Output quality (zelfscore 1-10)
- Iteraties voordat acceptabel
- Notitie: wat zou ik volgende keer anders doen?

Log-locatie: .claude/ralf-logs/[skill-naam].md
\`\`\`

## Stap 4: Run 3x + Meet (10 min)

Run de skill drie keer op verschillende input. Vul telkens het log in.

Na de derde run: analyseer het log. Zie je patronen?

## Stap 5: Fix (5 min)

Pas de SKILL.md aan op basis van je bevindingen. Bijvoorbeeld:
- Scherpere instructie
- Extra constraint
- Duidelijker output-format

Dit is de F van RALF. En — cruciaal — het is niet klaar. **Volgende week run je opnieuw, meet opnieuw, leer opnieuw, fix opnieuw.**

**Deliverable:** SKILL.md + 3 log-entries + reflectie op wat je in week 2 anders gaat doen.`;

const LAB_8A_EN = `# Lab 8A — Build Your First RALF Loop (45 min)

You're going to build a small but complete RALF loop for a recurring task. No more theory — just doing.

## Step 1: Pick Your Task (5 min)

Pick a task you do AT LEAST 3x per week. Four criteria:
- Objectively measurable
- Repeatable (core work doesn't change)
- Instructable (you can describe what you do)
- Non-critical (failure is OK for this lab)

**Examples:** writing MR descriptions · sprint retrospective summaries · reviewing commit messages · Slack status updates.

## Step 2: Measure Baseline (10 min)

Do the task once manually. Measure:
- Time (minutes)
- Quality self-score (1-10)
- Iterations (rounds until acceptable)

Write down the measurement. This is your **pre-RALF baseline**.

## Step 3: Build the Skill (15 min)

Build a skill (Level 7 format) that automates the task. Add an extra section to the standard SKILL.md:

\`\`\`markdown
## RALF Self-Measurement

After every run, log in:
- Date/time
- Input (brief)
- Output quality (self-score 1-10)
- Iterations until acceptable
- Note: what would I do differently next time?

Log location: .claude/ralf-logs/[skill-name].md
\`\`\`

## Step 4: Run 3x + Measure (10 min)

Run the skill three times on different input. Fill the log each time.

After the third run: analyse the log. Do you see patterns?

## Step 5: Fix (5 min)

Adjust SKILL.md based on findings. For example:
- Sharper instruction
- Extra constraint
- Clearer output format

This is the F of RALF. And — crucially — you're not done. **Next week you run again, measure again, learn again, fix again.**

**Deliverable:** SKILL.md + 3 log entries + reflection on what you'll do differently in week 2.`;

const LAB_8A_FR = `# Lab 8A — Construire Votre Première Boucle RALF (45 min)

Vous allez construire une boucle RALF petite mais complète pour une tâche récurrente. Plus de théorie — que du concret.

## Étape 1 : Choisir Votre Tâche (5 min)

Tâche que vous faites AU MOINS 3x par semaine. Quatre critères :
- Objectivement mesurable
- Répétable
- Instructable
- Non-critique

**Exemples :** écrire descriptions MR · résumés rétro sprint · review commit-messages · updates statut Slack.

## Étape 2 : Mesurer Baseline (10 min)

Faire la tâche une fois manuellement. Mesurer :
- Temps (minutes)
- Auto-score qualité (1-10)
- Itérations (rondes jusqu'à acceptable)

C'est votre **baseline pré-RALF**.

## Étape 3 : Construire le Skill (15 min)

Construire un skill (format Level 7) qui automatise. Ajouter section :

\`\`\`markdown
## RALF Self-Measurement

Après chaque run, logger :
- Date/heure
- Input (bref)
- Qualité output (auto-score 1-10)
- Itérations jusqu'acceptable
- Note : que ferais-je différemment ?

Location log : .claude/ralf-logs/[nom-skill].md
\`\`\`

## Étape 4 : Lancer 3x + Mesurer (10 min)

Lancer le skill trois fois sur input différent. Remplir log chaque fois.

Analyser le log. Voyez-vous des patterns ?

## Étape 5 : Fix (5 min)

Ajuster SKILL.md selon les findings :
- Instruction plus nette
- Contrainte supplémentaire
- Format output plus clair

C'est le F de RALF. Et — crucial — **vous n'avez pas fini. La semaine prochaine vous relancez, mesurez, apprenez, fixez.**

**Deliverable :** SKILL.md + 3 log-entries + réflexion pour semaine 2.`;

// ─── LAB 8B — De Finale Challenge ────────────────────────────────────────────

const LAB_8B_NL = `# Lab 8B — De Finale Challenge (teams van 2-3) — 60 min

Dit is de afsluiting van de Academy. **Niet individueel. In team.** Omdat het echte werk in teams gebeurt.

## Context

Elk team bouwt een **mini-systeem** dat drie dingen combineert:
1. Een RALF loop (Lab 8A patroon)
2. N8N automation (nachtelijke trigger)
3. Output in de Marketplace (deelbaar)

Het systeem lost een echt probleem op uit jullie dagelijks werk. Geen synthetisch voorbeeld. Iets wat je team morgen kan gebruiken.

## Stap 1: Probleem-Selectie (10 min)

Brainstorm in team: welke drie taken kosten jullie squad wekelijks samen minstens 5 uur?

Kies er één. Als je twijfelt: kies de saaiste. Die heeft de grootste ROI als je hem automatiseert.

## Stap 2: Ontwerp (15 min)

Schrijf op één pagina:
- **Pentagon prompt** voor de kern-actie (Level 2-5)
- **Intent + Goal Hierarchy** (Level 4)
- **GIVEN/WHEN/THEN specs** voor output kwaliteit (Level 5)
- **N8N trigger** (wanneer draait het?)
- **Output-bestemming** (Jira/GitLab/Confluence/Slack)
- **Meetpunt** (wat meet kwaliteit?)

## Stap 3: Bouw (25 min)

Verdeel het werk:
- Persoon 1: SKILL.md + pentagon prompt
- Persoon 2: N8N workflow (schema op papier of in tool)
- Persoon 3: Meet-logic + Marketplace-docs

Kom elke 10 minuten samen voor **mini-RALF**: Review wat er is, Analyze wat ontbreekt, Learn van het teamlid dat eerder klaar was, Fix in de volgende 10 minuten.

## Stap 4: Demo + Peer Review (10 min)

Elk team demonstreert 3 minuten + 2 minuten Q&A. De andere teams zijn reviewers. Rubric:

- Is er een RALF-meet-loop? (0-5)
- Is de N8N automation realistisch? (0-5)
- Is de output Marketplace-klaar? (0-5)
- Lost het een echt probleem op? (0-5)

**Score minimum om te "slagen": 14/20.**

## Stap 5: Publiceer (5 min)

Als je team het haalt: commit je skill naar de Marketplace als DRAFT. Die krijgt een formele review later door de Skills Council. Als je niet haalt: commit het naar je team-repo als werkdossier voor volgende week.

**Deliverable:** SKILL.md + N8N-schema + Marketplace-MR (of team-MR) + peer-review scores.`;

const LAB_8B_EN = `# Lab 8B — The Final Challenge (teams of 2-3) — 60 min

This is the Academy closing. **Not individual. In team.** Because real work happens in teams.

## Context

Each team builds a **mini system** combining three things:
1. A RALF loop (Lab 8A pattern)
2. N8N automation (nightly trigger)
3. Output in the Marketplace (shareable)

The system solves a real problem from your daily work. Not a synthetic example. Something your team can use tomorrow.

## Step 1: Problem Selection (10 min)

Brainstorm: which three tasks cost your squad weekly 5+ hours combined?

Pick one. When in doubt: pick the most boring. Biggest ROI when automated.

## Step 2: Design (15 min)

One page:
- **Pentagon prompt** for the core action (Levels 2-5)
- **Intent + Goal Hierarchy** (Level 4)
- **GIVEN/WHEN/THEN specs** for output quality (Level 5)
- **N8N trigger** (when does it run?)
- **Output destination** (Jira/GitLab/Confluence/Slack)
- **Measurement** (what measures quality?)

## Step 3: Build (25 min)

Split work:
- Person 1: SKILL.md + pentagon prompt
- Person 2: N8N workflow (schema on paper or in tool)
- Person 3: Measurement logic + Marketplace docs

Every 10 minutes regroup for **mini-RALF**: Review, Analyze, Learn, Fix.

## Step 4: Demo + Peer Review (10 min)

Each team: 3 min demo + 2 min Q&A. Other teams review. Rubric:

- RALF measurement loop? (0-5)
- N8N automation realistic? (0-5)
- Output Marketplace-ready? (0-5)
- Solves real problem? (0-5)

**Pass threshold: 14/20.**

## Step 5: Publish (5 min)

If passed: commit skill to Marketplace as DRAFT. Formal review by Skills Council later. If not: commit to team repo as working document for next week.

**Deliverable:** SKILL.md + N8N schema + Marketplace-MR (or team-MR) + peer-review scores.`;

const LAB_8B_FR = `# Lab 8B — Le Final Challenge (équipes de 2-3) — 60 min

C'est la clôture de l'Academy. **Pas individuel. En équipe.** Parce que le vrai travail se fait en équipe.

## Context

Chaque équipe construit un **mini-système** combinant trois choses :
1. Une boucle RALF (pattern Lab 8A)
2. Automation N8N (trigger nocturne)
3. Sortie au Marketplace (partageable)

Le système résout un vrai problème de votre travail quotidien.

## Étape 1 : Sélection Problème (10 min)

Brainstorm : quelles trois tâches coûtent hebdomadairement 5h+ combiné ?

Choisissez-en une. En doute : la plus ennuyeuse. Plus grand ROI.

## Étape 2 : Design (15 min)

Une page :
- **Prompt Pentagon** pour action core (Levels 2-5)
- **Intent + Goal Hierarchy** (Level 4)
- **Specs GIVEN/WHEN/THEN** pour qualité output (Level 5)
- **Trigger N8N** (quand tourne-t-il ?)
- **Destination output** (Jira/GitLab/Confluence/Slack)
- **Mesure** (qu'est-ce qui mesure qualité ?)

## Étape 3 : Construire (25 min)

Répartir :
- Personne 1 : SKILL.md + prompt pentagon
- Personne 2 : workflow N8N (schéma)
- Personne 3 : logique mesure + docs Marketplace

Toutes les 10 min : **mini-RALF**.

## Étape 4 : Demo + Peer Review (10 min)

Chaque équipe : 3 min demo + 2 min Q&A. Autres équipes reviewers. Rubric :

- Boucle mesure RALF ? (0-5)
- Automation N8N réaliste ? (0-5)
- Output Marketplace-ready ? (0-5)
- Résout vrai problème ? (0-5)

**Seuil pour passer : 14/20.**

## Étape 5 : Publier (5 min)

Si passé : commit skill au Marketplace comme DRAFT. Review formelle par Skills Council plus tard.

**Deliverable :** SKILL.md + schéma N8N + Marketplace-MR + scores peer-review.`;

// ═════════════════════════════════════════════════════════════════════════════
// ── WEEK 7 EXPORT ───────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

export const WEEK_7: CurriculumWeek = {
  id: 'week-7',
  number: 7,
  title: 'Level 8 — RALF Loop & Scale',
  titleI18n: {
    en: 'Level 8 — RALF Loop & Scale',
    nl: 'Level 8 — RALF Loop & Scale',
    fr: 'Level 8 — RALF Loop & Scale',
  },
  subtitle: 'The Never-Ending Loop · van individueel naar organisatie',
  subtitleI18n: {
    en: 'The Never-Ending Loop · from individual to organisation',
    nl: 'The Never-Ending Loop · van individueel naar organisatie',
    fr: 'The Never-Ending Loop · de l\'individu à l\'organisation',
  },
  description:
    'Finale Academy level: RALF Loop als kern-ritme (Review · Analyze · Learn · Fix · herhaal). Self-learning systems met 5-componenten pattern, N8N nachtelijke workflows met Worldline guardrails, Skills Marketplace voor collectieve intelligentie, en scaling van individueel → team → organisatie. Eindigt met Finale Challenge in teams van 2-3. Cumulatief op alle Level 1-7 skills.',
  descriptionI18n: {
    en: 'Academy finale level: RALF Loop as core rhythm (Review · Analyze · Learn · Fix · repeat). Self-learning systems with 5-component pattern, N8N overnight workflows with Worldline guardrails, Skills Marketplace for collective intelligence, and scaling individual → team → organisation. Ends with Final Challenge in teams of 2-3. Cumulative on all Level 1-7 skills.',
    nl: 'Finale Academy level: RALF Loop als kern-ritme (Review · Analyze · Learn · Fix · herhaal). Self-learning systems met 5-componenten pattern, N8N nachtelijke workflows met Worldline guardrails, Skills Marketplace voor collectieve intelligentie, en scaling van individueel → team → organisatie. Eindigt met Finale Challenge in teams van 2-3. Cumulatief op alle Level 1-7 skills.',
    fr: 'Level finale de l\'Academy : boucle RALF comme rythme core. Systèmes self-learning, workflows N8N nocturnes avec guardrails, Skills Marketplace, scaling individuel → équipe → organisation. Final Challenge en équipes de 2-3. Cumulatif sur tous les Levels 1-7.',
  },
  objectives: [
    'Bouw en onderhoud een RALF Loop (Review · Analyze · Learn · Fix · never-ending)',
    'Ontwerp self-learning systems met het 5-componenten pattern (trigger/execution/measurement/reflection/adjustment)',
    'Configureer N8N workflows die 24/7 draaien met Worldline-compliance guardrails',
    'Draag bij aan de Skills Marketplace en de collectieve RALF-loop op organisatie-niveau',
    'Schaal AI-first werken van individueel naar team naar organisatie',
  ],
  objectivesI18n: {
    en: [
      'Build and maintain a RALF Loop (Review · Analyze · Learn · Fix · never-ending)',
      'Design self-learning systems with the 5-component pattern (trigger/execution/measurement/reflection/adjustment)',
      'Configure N8N workflows running 24/7 with Worldline compliance guardrails',
      'Contribute to the Skills Marketplace and org-level collective RALF loop',
      'Scale AI-first working from individual to team to organisation',
    ],
    nl: [
      'Bouw en onderhoud een RALF Loop (Review · Analyze · Learn · Fix · never-ending)',
      'Ontwerp self-learning systems met het 5-componenten pattern (trigger/execution/measurement/reflection/adjustment)',
      'Configureer N8N workflows die 24/7 draaien met Worldline-compliance guardrails',
      'Draag bij aan de Skills Marketplace en de collectieve RALF-loop op organisatie-niveau',
      'Schaal AI-first werken van individueel naar team naar organisatie',
    ],
    fr: [
      'Construire et maintenir une boucle RALF (never-ending)',
      'Concevoir des systèmes self-learning avec le pattern 5-composants',
      'Configurer des workflows N8N 24/7 avec guardrails Worldline',
      'Contribuer au Skills Marketplace et boucle RALF org-level',
      'Scaler l\'AI-first de l\'individu à l\'équipe à l\'organisation',
    ],
  },
  targetAudience: 'Alle Worldline engineers — Finale Academy level (Wave 1 afsluiting)',
  targetAudienceI18n: {
    en: 'All Worldline engineers — Academy finale level (Wave 1 closing)',
    nl: 'Alle Worldline engineers — Finale Academy level (Wave 1 afsluiting)',
    fr: 'Tous les ingénieurs Worldline — Finale Academy (clôture Wave 1)',
  },
  bloomLevels: [4, 5, 6],
  complianceRelevant: true,
  badgeName: 'RALF Master',
  badgeNameI18n: {
    en: 'RALF Master',
    nl: 'RALF Master',
    fr: 'RALF Master',
  },
  badgeIcon: '♾️',
  weeklyQuiz: [
    {
      id: 'w7-q1',
      question: 'Waar staat RALF voor?',
      questionI18n: {
        en: 'What does RALF stand for?',
        nl: 'Waar staat RALF voor?',
        fr: 'Que signifie RALF ?',
      },
      options: [
        'Rapid AI Learning Framework',
        'Review · Analyze · Learn · Fix (never-ending loop)',
        'Recursive Agent Loop Function',
        'Real-time AI Logging Framework',
      ],
      optionsI18n: {
        en: [
          'Rapid AI Learning Framework',
          'Review · Analyze · Learn · Fix (never-ending loop)',
          'Recursive Agent Loop Function',
          'Real-time AI Logging Framework',
        ],
        nl: [
          'Rapid AI Learning Framework',
          'Review · Analyze · Learn · Fix (never-ending loop)',
          'Recursive Agent Loop Function',
          'Real-time AI Logging Framework',
        ],
        fr: [
          'Rapid AI Learning Framework',
          'Review · Analyze · Learn · Fix (never-ending loop)',
          'Recursive Agent Loop Function',
          'Real-time AI Logging Framework',
        ],
      },
      correctIndex: 1,
      explanation: 'RALF = Review (kijk naar output zonder oordeel) · Analyze (root cause, geen symptomen) · Learn (wat moet anders volgende keer) · Fix (pas aan en begin opnieuw). De loop stopt nooit.',
      explanationI18n: {
        en: 'RALF = Review (observe without judging) · Analyze (root cause) · Learn (what must change) · Fix (adjust and restart). The loop never stops.',
        nl: 'RALF = Review (kijk naar output zonder oordeel) · Analyze (root cause, geen symptomen) · Learn (wat moet anders volgende keer) · Fix (pas aan en begin opnieuw). De loop stopt nooit.',
        fr: 'RALF = Review · Analyze · Learn · Fix. La boucle ne s\'arrête jamais.',
      },
      bloomLevel: 1,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w7-q2',
      question: 'Welke 5 componenten heeft een self-learning skill?',
      questionI18n: {
        en: 'Which 5 components does a self-learning skill have?',
        nl: 'Welke 5 componenten heeft een self-learning skill?',
        fr: 'Quels 5 composants a un skill self-learning ?',
      },
      options: [
        'Input / Process / Output / Review / Improve',
        'Trigger · Execution · Measurement · Reflection · Adjustment',
        'Start · Run · Test · Report · Stop',
        'Fetch · Transform · Load · Monitor · Alert',
      ],
      optionsI18n: {
        en: [
          'Input / Process / Output / Review / Improve',
          'Trigger · Execution · Measurement · Reflection · Adjustment',
          'Start · Run · Test · Report · Stop',
          'Fetch · Transform · Load · Monitor · Alert',
        ],
        nl: [
          'Input / Process / Output / Review / Improve',
          'Trigger · Execution · Measurement · Reflection · Adjustment',
          'Start · Run · Test · Report · Stop',
          'Fetch · Transform · Load · Monitor · Alert',
        ],
        fr: [
          'Input / Process / Output / Review / Improve',
          'Trigger · Execution · Measurement · Reflection · Adjustment',
          'Start · Run · Test · Report · Stop',
          'Fetch · Transform · Load · Monitor · Alert',
        ],
      },
      correctIndex: 1,
      explanation: 'De vijf: (1) Trigger wanneer activeert, (2) Execution wat produceert, (3) Measurement hoe gemeten, (4) Reflection wat betekent het, (5) Adjustment welke config verandert. Lijkt op R-A-L-F-R.',
      explanationI18n: {
        en: 'The five: Trigger (when activates) · Execution (what produces) · Measurement (how measured) · Reflection (what it means) · Adjustment (what config changes). Resembles R-A-L-F-R.',
        nl: 'De vijf: (1) Trigger wanneer activeert, (2) Execution wat produceert, (3) Measurement hoe gemeten, (4) Reflection wat betekent het, (5) Adjustment welke config verandert. Lijkt op R-A-L-F-R.',
        fr: 'Les cinq : Trigger · Execution · Measurement · Reflection · Adjustment. Ressemble à R-A-L-F-R.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w7-q3',
      question: 'Wat mag N8N workflow AUTOMATISCH doen bij Worldline?',
      questionI18n: {
        en: 'What may an N8N workflow do AUTOMATICALLY at Worldline?',
        nl: 'Wat mag N8N workflow AUTOMATISCH doen bij Worldline?',
        fr: 'Que peut faire un workflow N8N AUTOMATIQUEMENT chez Worldline ?',
      },
      options: [
        'Auto-deploy naar productie (tijd besparen)',
        'MR aanmaken voor review, met audit-trail en circuit breaker — geen auto-deploy',
        'Credentials roteren zonder menselijke goedkeuring',
        'Data uit productie-DB halen en analyseren',
      ],
      optionsI18n: {
        en: [
          'Auto-deploy to production (save time)',
          'Create MR for review, with audit trail and circuit breaker — no auto-deploy',
          'Rotate credentials without human approval',
          'Fetch production DB data and analyse',
        ],
        nl: [
          'Auto-deploy naar productie (tijd besparen)',
          'MR aanmaken voor review, met audit-trail en circuit breaker — geen auto-deploy',
          'Credentials roteren zonder menselijke goedkeuring',
          'Data uit productie-DB halen en analyseren',
        ],
        fr: [
          'Auto-deploy en prod',
          'Créer MR pour review, avec audit trail et circuit breaker — pas d\'auto-deploy',
          'Roter credentials sans approbation',
          'Fetch data prod DB',
        ],
      },
      correctIndex: 1,
      explanation: 'N8N mag MRs aanmaken, rapporteren, analyseren. Niet deployen. Niet prod-data aanraken. Circuit breaker na 3 failed runs. Audit-trail verplicht. Level 6 guardrails extra zwaar bij geen toezicht.',
      explanationI18n: {
        en: 'N8N may create MRs, report, analyse. Not deploy. Not touch prod data. Circuit breaker after 3 failed runs. Audit trail mandatory.',
        nl: 'N8N mag MRs aanmaken, rapporteren, analyseren. Niet deployen. Niet prod-data aanraken. Circuit breaker na 3 failed runs. Audit-trail verplicht. Level 6 guardrails extra zwaar bij geen toezicht.',
        fr: 'N8N peut créer MRs, rapporter, analyser. Pas deploy. Pas toucher data prod. Circuit breaker après 3 échecs.',
      },
      bloomLevel: 2,
      euAiActRelevant: true,
      points: 10,
    },
    {
      id: 'w7-q4',
      question: 'Wanneer is een skill geschikt voor de Skills Marketplace?',
      questionI18n: {
        en: 'When is a skill suitable for the Skills Marketplace?',
        nl: 'Wanneer is een skill geschikt voor de Skills Marketplace?',
        fr: 'Quand un skill est-il adapté au Skills Marketplace ?',
      },
      options: [
        'Altijd — alle skills horen daar',
        'Alleen als het squad-specifiek en experimenteel is',
        'Squad-agnostisch (≥3 squads) · getest 5+ runs · PCI-guarded · metrisch meetbaar · onderhouden',
        'Alleen als auteur een senior engineer is',
      ],
      optionsI18n: {
        en: [
          'Always — all skills belong there',
          'Only if squad-specific and experimental',
          'Squad-agnostic (≥3 squads) · tested 5+ runs · PCI-guarded · metric-capable · maintained',
          'Only if author is senior engineer',
        ],
        nl: [
          'Altijd — alle skills horen daar',
          'Alleen als het squad-specifiek en experimenteel is',
          'Squad-agnostisch (≥3 squads) · getest 5+ runs · PCI-guarded · metrisch meetbaar · onderhouden',
          'Alleen als auteur een senior engineer is',
        ],
        fr: [
          'Toujours',
          'Squad-spécifique et expérimental',
          'Squad-agnostic (≥3 squads) · testé 5+ · PCI-guarded · mesurable · maintenu',
          'Seulement si auteur senior',
        ],
      },
      correctIndex: 2,
      explanation: '5 criteria: squad-agnostisch, getest, guarded (Worldline compliance), metrisch, onderhouden. Squad-specifiek blijft in squad repo. Experimenteel blijft persoonlijk.',
      explanationI18n: {
        en: '5 criteria: squad-agnostic, tested, guarded (compliance), metric-capable, maintained. Squad-specific stays in squad repo. Experimental stays personal.',
        nl: '5 criteria: squad-agnostisch, getest, guarded (Worldline compliance), metrisch, onderhouden. Squad-specifiek blijft in squad repo. Experimenteel blijft persoonlijk.',
        fr: '5 critères : squad-agnostic, testé, guarded, mesurable, maintenu.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w7-q5',
      question: 'Wat is de finale waarheid van Worldline AI-First?',
      questionI18n: {
        en: 'What is the final truth of Worldline AI-First?',
        nl: 'Wat is de finale waarheid van Worldline AI-First?',
        fr: 'Quelle est la vérité finale de Worldline AI-First ?',
      },
      options: [
        'AI is beter dan mensen',
        'Mensen MET AI zijn beter dan mensen ZONDER AI · de loop is mens+AI, niet AI-vs-mens',
        'AI zal alle banen overnemen',
        'Mensen zijn altijd beter dan AI',
      ],
      optionsI18n: {
        en: [
          'AI is better than humans',
          'Humans WITH AI are better than humans WITHOUT AI · the loop is human+AI, not AI-vs-human',
          'AI will take all jobs',
          'Humans are always better than AI',
        ],
        nl: [
          'AI is beter dan mensen',
          'Mensen MET AI zijn beter dan mensen ZONDER AI · de loop is mens+AI, niet AI-vs-mens',
          'AI zal alle banen overnemen',
          'Mensen zijn altijd beter dan AI',
        ],
        fr: [
          'L\'IA est meilleure que les humains',
          'Humains AVEC IA sont meilleurs que humains SANS IA · la boucle est humain+IA',
          'L\'IA prendra tous les jobs',
          'Les humains sont toujours meilleurs',
        ],
      },
      correctIndex: 1,
      explanation: 'Human+AI → output → Human+AI → beter output. De loop is niet AI-vs-mens maar samen-werken. Dat is RALF op elke schaal. Dat is Worldline AI-First.',
      explanationI18n: {
        en: 'Human+AI → output → Human+AI → better output. The loop is cooperative, not adversarial. RALF at every scale.',
        nl: 'Human+AI → output → Human+AI → beter output. De loop is niet AI-vs-mens maar samen-werken. Dat is RALF op elke schaal. Dat is Worldline AI-First.',
        fr: 'Humain+IA → output → Humain+IA → meilleur. La boucle est coopérative.',
      },
      bloomLevel: 3,
      euAiActRelevant: true,
      points: 10,
    },
  ],
  days: [
    {
      day: 1,
      title: 'Les 8.1 — Wat is RALF?',
      titleI18n: {
        en: 'Lesson 8.1 — What Is RALF?',
        nl: 'Les 8.1 — Wat is RALF?',
        fr: 'Leçon 8.1 — Qu\'est-ce que RALF ?',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w7d1-theory',
          title: 'Les 8.1 — Wat is RALF? De Vier Letters die Alles Veranderen',
          titleI18n: {
            en: 'Lesson 8.1 — What Is RALF? The Four Letters That Change Everything',
            nl: 'Les 8.1 — Wat is RALF? De Vier Letters die Alles Veranderen',
            fr: 'Leçon 8.1 — Qu\'est-ce que RALF ?',
          },
          type: 'theory',
          duration: 20,
          description: 'RALF: Review · Analyze · Learn · Fix · never-ending loop · cumulatieve waarde van Level 1-7 activeren',
          descriptionI18n: {
            en: 'RALF: Review · Analyze · Learn · Fix · never-ending loop · activating cumulative Level 1-7 value',
            nl: 'RALF: Review · Analyze · Learn · Fix · never-ending loop · cumulatieve waarde van Level 1-7 activeren',
            fr: 'RALF · never-ending loop · activation cumulative Levels 1-7',
          },
          content: LESSON_8_1_NL,
          contentI18n: { en: LESSON_8_1_EN, nl: LESSON_8_1_NL, fr: LESSON_8_1_FR },
        },
        {
          id: 'w7d1-lab',
          title: 'Lab 8A — Bouw Je Eerste RALF Loop',
          titleI18n: {
            en: 'Lab 8A — Build Your First RALF Loop',
            nl: 'Lab 8A — Bouw Je Eerste RALF Loop',
            fr: 'Lab 8A — Construire Votre Première Boucle RALF',
          },
          type: 'lab',
          duration: 45,
          description: 'Terugkerende taak → SKILL.md met RALF Self-Measurement sectie → baseline meten → 3x runnen → analyseren → fixen',
          descriptionI18n: {
            en: 'Recurring task → SKILL.md with RALF Self-Measurement section → measure baseline → run 3x → analyse → fix',
            nl: 'Terugkerende taak → SKILL.md met RALF Self-Measurement sectie → baseline meten → 3x runnen → analyseren → fixen',
            fr: 'Tâche récurrente → SKILL.md avec section RALF Self-Measurement → baseline → 3x run → analyse → fix',
          },
          content: LAB_8A_NL,
          contentI18n: { en: LAB_8A_EN, nl: LAB_8A_NL, fr: LAB_8A_FR },
          exercises: [
            {
              id: 'w7d1-ex1',
              title: 'Eerste RALF loop draaiend met 3 log-entries',
              titleI18n: {
                en: 'First RALF loop running with 3 log entries',
                nl: 'Eerste RALF loop draaiend met 3 log-entries',
                fr: 'Première boucle RALF avec 3 log-entries',
              },
              instructions: 'Kies taak. Baseline meten. SKILL.md bouwen met RALF Self-Measurement sectie. 3 runs uitvoeren met logs. Log analyseren. SKILL.md aanpassen. Deliverable: SKILL.md + 3 logs + reflectie wat je week 2 anders gaat doen.',
              instructionsI18n: {
                en: 'Pick task. Measure baseline. Build SKILL.md with RALF Self-Measurement section. Run 3x with logs. Analyse. Adjust SKILL.md. Deliverable: SKILL.md + 3 logs + week-2 reflection.',
                nl: 'Kies taak. Baseline meten. SKILL.md bouwen met RALF Self-Measurement sectie. 3 runs uitvoeren met logs. Log analyseren. SKILL.md aanpassen. Deliverable: SKILL.md + 3 logs + reflectie wat je week 2 anders gaat doen.',
                fr: 'Choisir tâche. Baseline. SKILL.md avec RALF Self-Measurement. 3 runs. Analyser. Ajuster. Deliverable : SKILL.md + 3 logs + réflexion.',
              },
              type: 'free-form',
              difficulty: 3,
              points: 25,
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: 'Les 8.2 — Self-Learning Systems',
      titleI18n: {
        en: 'Lesson 8.2 — Self-Learning Systems',
        nl: 'Les 8.2 — Self-Learning Systems',
        fr: 'Leçon 8.2 — Systèmes Auto-Apprenants',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w7d2-theory',
          title: 'Les 8.2 — Self-Learning Systems: AI die Zichzelf Verbetert',
          titleI18n: {
            en: 'Lesson 8.2 — Self-Learning Systems: AI That Improves Itself',
            nl: 'Les 8.2 — Self-Learning Systems: AI die Zichzelf Verbetert',
            fr: 'Leçon 8.2 — Systèmes Auto-Apprenants',
          },
          type: 'theory',
          duration: 20,
          description: '3 niveaus (metric/feedback/emergent) · 5-componenten pattern (trigger/execution/measurement/reflection/adjustment) · drift-risk + human-in-loop checkpoint',
          descriptionI18n: {
            en: '3 levels (metric/feedback/emergent) · 5-component pattern · drift-risk + human-in-loop checkpoint',
            nl: '3 niveaus (metric/feedback/emergent) · 5-componenten pattern (trigger/execution/measurement/reflection/adjustment) · drift-risk + human-in-loop checkpoint',
            fr: '3 niveaux · pattern 5-composants · risque drift + human-in-loop',
          },
          content: LESSON_8_2_NL,
          contentI18n: { en: LESSON_8_2_EN, nl: LESSON_8_2_NL, fr: LESSON_8_2_FR },
        },
        {
          id: 'w7d2-lab',
          title: 'Lab — Self-Learning Pattern Design voor Eigen Skill',
          titleI18n: {
            en: 'Lab — Self-Learning Pattern Design for Own Skill',
            nl: 'Lab — Self-Learning Pattern Design voor Eigen Skill',
            fr: 'Lab — Design Pattern Self-Learning pour Skill',
          },
          type: 'lab',
          duration: 30,
          description: 'Kies bestaande skill → ontwerp alle 5 componenten (trigger/execution/measurement/reflection/adjustment) → definieer drift-checkpoint',
          descriptionI18n: {
            en: 'Pick existing skill → design all 5 components → define drift checkpoint',
            nl: 'Kies bestaande skill → ontwerp alle 5 componenten (trigger/execution/measurement/reflection/adjustment) → definieer drift-checkpoint',
            fr: 'Choisir skill existant → designer 5 composants → drift checkpoint',
          },
          content: LAB_8A_NL,
          contentI18n: { en: LAB_8A_EN, nl: LAB_8A_NL, fr: LAB_8A_FR },
          exercises: [
            {
              id: 'w7d2-ex1',
              title: '5-componenten ontwerp op 1 A4',
              titleI18n: {
                en: '5-component design on 1 page',
                nl: '5-componenten ontwerp op 1 A4',
                fr: 'Design 5-composants sur 1 page',
              },
              instructions: 'Bestaande skill kiezen. Per component (trigger/execution/measurement/reflection/adjustment) één alinea. Drift-checkpoint definiëren (wie reviewt wanneer). Deliverable: 1-A4 document + skill-update plan week 2.',
              instructionsI18n: {
                en: 'Pick existing skill. One paragraph per component. Define drift checkpoint (who reviews when). Deliverable: 1-page doc + week-2 skill update plan.',
                nl: 'Bestaande skill kiezen. Per component (trigger/execution/measurement/reflection/adjustment) één alinea. Drift-checkpoint definiëren (wie reviewt wanneer). Deliverable: 1-A4 document + skill-update plan week 2.',
                fr: 'Skill existant. Un paragraphe par composant. Drift checkpoint. Deliverable : 1-page + plan update.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: 'Les 8.3 — N8N Automation',
      titleI18n: {
        en: 'Lesson 8.3 — N8N Automation',
        nl: 'Les 8.3 — N8N Automation',
        fr: 'Leçon 8.3 — Automation N8N',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w7d3-theory',
          title: 'Les 8.3 — N8N Automation: Workflows die Nooit Slapen',
          titleI18n: {
            en: 'Lesson 8.3 — N8N Automation: Workflows That Never Sleep',
            nl: 'Les 8.3 — N8N Automation: Workflows die Nooit Slapen',
            fr: 'Leçon 8.3 — Automation N8N',
          },
          type: 'theory',
          duration: 20,
          description: 'Nachtelijke workflows (rapportage 21:00 / tests 02:00 / docs 03:00) · N8N + Claude Code architectuur · 5 extra guardrails bij geen toezicht',
          descriptionI18n: {
            en: 'Overnight workflows · N8N + Claude Code architecture · 5 extra guardrails with no oversight',
            nl: 'Nachtelijke workflows (rapportage 21:00 / tests 02:00 / docs 03:00) · N8N + Claude Code architectuur · 5 extra guardrails bij geen toezicht',
            fr: 'Workflows nocturnes · architecture N8N + Claude Code · 5 guardrails extra',
          },
          content: LESSON_8_3_NL,
          contentI18n: { en: LESSON_8_3_EN, nl: LESSON_8_3_NL, fr: LESSON_8_3_FR },
        },
        {
          id: 'w7d3-lab',
          title: 'Lab — N8N Workflow Schetsen voor Eigen Squad',
          titleI18n: {
            en: 'Lab — N8N Workflow Sketch for Own Squad',
            nl: 'Lab — N8N Workflow Schetsen voor Eigen Squad',
            fr: 'Lab — Esquisse Workflow N8N',
          },
          type: 'lab',
          duration: 30,
          description: 'Identificeer 3 repetitieve wekelijkse taken · schets N8N workflow voor de beste kandidaat · definieer guardrails + circuit breaker',
          descriptionI18n: {
            en: 'Identify 3 repetitive weekly tasks · sketch N8N workflow for best candidate · define guardrails + circuit breaker',
            nl: 'Identificeer 3 repetitieve wekelijkse taken · schets N8N workflow voor de beste kandidaat · definieer guardrails + circuit breaker',
            fr: '3 tâches répétitives hebdo · esquisser workflow N8N · guardrails + circuit breaker',
          },
          content: LAB_8A_NL,
          contentI18n: { en: LAB_8A_EN, nl: LAB_8A_NL, fr: LAB_8A_FR },
          exercises: [
            {
              id: 'w7d3-ex1',
              title: 'N8N workflow schets + guardrail plan',
              titleI18n: {
                en: 'N8N workflow sketch + guardrail plan',
                nl: 'N8N workflow schets + guardrail plan',
                fr: 'Esquisse workflow N8N + plan guardrail',
              },
              instructions: '3 repetitieve taken lijsten. Kies beste kandidaat. Schets: wanneer triggert, welke MCPs, welke output-bestemming. Guardrails (geen auto-deploy, audit-trail, circuit breaker) expliciet. Deliverable: schets + guardrail plan.',
              instructionsI18n: {
                en: 'List 3 repetitive tasks. Pick best. Sketch: when trigger, which MCPs, output destination. Guardrails explicit. Deliverable: sketch + guardrail plan.',
                nl: '3 repetitieve taken lijsten. Kies beste kandidaat. Schets: wanneer triggert, welke MCPs, welke output-bestemming. Guardrails (geen auto-deploy, audit-trail, circuit breaker) expliciet. Deliverable: schets + guardrail plan.',
                fr: '3 tâches. Choisir meilleure. Esquisser. Guardrails explicites.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    {
      day: 4,
      title: 'Les 8.4 — Skills Marketplace',
      titleI18n: {
        en: 'Lesson 8.4 — Skills Marketplace',
        nl: 'Les 8.4 — Skills Marketplace',
        fr: 'Leçon 8.4 — Skills Marketplace',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w7d4-theory',
          title: 'Les 8.4 — De Skills Marketplace: Collectieve Intelligentie',
          titleI18n: {
            en: 'Lesson 8.4 — The Skills Marketplace: Collective Intelligence',
            nl: 'Les 8.4 — De Skills Marketplace: Collectieve Intelligentie',
            fr: 'Leçon 8.4 — Le Skills Marketplace',
          },
          type: 'theory',
          duration: 15,
          description: 'Marketplace structuur (catalog/category/skill) · contributie-workflow · 5 kwaliteitscriteria · collectieve RALF op kwartaal-niveau',
          descriptionI18n: {
            en: 'Marketplace structure · contribution workflow · 5 quality criteria · collective quarterly RALF',
            nl: 'Marketplace structuur (catalog/category/skill) · contributie-workflow · 5 kwaliteitscriteria · collectieve RALF op kwartaal-niveau',
            fr: 'Structure Marketplace · workflow contribution · 5 critères · RALF collective trimestrielle',
          },
          content: LESSON_8_4_NL,
          contentI18n: { en: LESSON_8_4_EN, nl: LESSON_8_4_NL, fr: LESSON_8_4_FR },
        },
        {
          id: 'w7d4-lab',
          title: 'Lab — Kwaliteitscheck Eigen Skill voor Marketplace',
          titleI18n: {
            en: 'Lab — Quality Check Own Skill for Marketplace',
            nl: 'Lab — Kwaliteitscheck Eigen Skill voor Marketplace',
            fr: 'Lab — Check Qualité Skill pour Marketplace',
          },
          type: 'lab',
          duration: 30,
          description: 'Bestaande skill tegen 5 Marketplace-criteria afchecken · gap-analyse · verbeterplan om Marketplace-ready te worden',
          descriptionI18n: {
            en: 'Check existing skill against 5 Marketplace criteria · gap analysis · improvement plan to Marketplace-ready',
            nl: 'Bestaande skill tegen 5 Marketplace-criteria afchecken · gap-analyse · verbeterplan om Marketplace-ready te worden',
            fr: 'Check skill vs 5 critères Marketplace · gap analyse · plan amélioration',
          },
          content: LAB_8A_NL,
          contentI18n: { en: LAB_8A_EN, nl: LAB_8A_NL, fr: LAB_8A_FR },
          exercises: [
            {
              id: 'w7d4-ex1',
              title: 'Marketplace-readiness assessment',
              titleI18n: {
                en: 'Marketplace-readiness assessment',
                nl: 'Marketplace-readiness assessment',
                fr: 'Assessment Marketplace-readiness',
              },
              instructions: 'Eigen skill tegen 5 criteria (squad-agnostisch/getest/guarded/metrisch/onderhouden). Per criterium: score 1-5. Gap analyse. Verbeterplan met deadlines. Deliverable: assessment + plan.',
              instructionsI18n: {
                en: 'Own skill vs 5 criteria. Per criterion: 1-5. Gap analysis. Improvement plan with deadlines. Deliverable: assessment + plan.',
                nl: 'Eigen skill tegen 5 criteria (squad-agnostisch/getest/guarded/metrisch/onderhouden). Per criterium: score 1-5. Gap analyse. Verbeterplan met deadlines. Deliverable: assessment + plan.',
                fr: 'Skill vs 5 critères. Score 1-5. Gap. Plan avec deadlines.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    {
      day: 5,
      title: 'Les 8.5 — Scale + Finale Challenge',
      titleI18n: {
        en: 'Lesson 8.5 — Scale + Final Challenge',
        nl: 'Les 8.5 — Scale + Finale Challenge',
        fr: 'Leçon 8.5 — Scale + Finale',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w7d5-theory',
          title: 'Les 8.5 — Scale: Van Individueel naar Team naar Organisatie',
          titleI18n: {
            en: 'Lesson 8.5 — Scale: From Individual to Team to Organisation',
            nl: 'Les 8.5 — Scale: Van Individueel naar Team naar Organisatie',
            fr: 'Leçon 8.5 — Scale : De l\'Individu à l\'Organisation',
          },
          type: 'theory',
          duration: 15,
          description: '3 schalen (individueel/team/org) · migratie-strategie (week 1-4 individueel, 5-8 team, 9+ org) · 5 leadership principes · finale waarheid (mens+AI > mens alleen)',
          descriptionI18n: {
            en: '3 scales · migration strategy · 5 leadership principles · final truth (human+AI > human alone)',
            nl: '3 schalen (individueel/team/org) · migratie-strategie (week 1-4 individueel, 5-8 team, 9+ org) · 5 leadership principes · finale waarheid (mens+AI > mens alleen)',
            fr: '3 échelles · stratégie migration · 5 principes leadership · vérité finale (humain+IA > humain seul)',
          },
          content: LESSON_8_5_NL,
          contentI18n: { en: LESSON_8_5_EN, nl: LESSON_8_5_NL, fr: LESSON_8_5_FR },
        },
        {
          id: 'w7d5-lab',
          title: 'Lab 8B — De Finale Challenge (teams van 2-3)',
          titleI18n: {
            en: 'Lab 8B — The Final Challenge (teams of 2-3)',
            nl: 'Lab 8B — De Finale Challenge (teams van 2-3)',
            fr: 'Lab 8B — Le Final Challenge (équipes de 2-3)',
          },
          type: 'lab',
          duration: 60,
          description: 'TEAM LAB · combineer RALF + N8N + Marketplace · lost echt probleem op · mini-RALF iteraties elke 10 min · peer-review op 4-punt rubric (minimum 14/20) · publiceer bij slagen',
          descriptionI18n: {
            en: 'TEAM LAB · combine RALF + N8N + Marketplace · solves real problem · mini-RALF every 10 min · peer-review on 4-point rubric (min 14/20) · publish if pass',
            nl: 'TEAM LAB · combineer RALF + N8N + Marketplace · lost echt probleem op · mini-RALF iteraties elke 10 min · peer-review op 4-punt rubric (minimum 14/20) · publiceer bij slagen',
            fr: 'LAB ÉQUIPE · combiner RALF + N8N + Marketplace · résout vrai problème · mini-RALF · peer-review 14/20',
          },
          content: LAB_8B_NL,
          contentI18n: { en: LAB_8B_EN, nl: LAB_8B_NL, fr: LAB_8B_FR },
          exercises: [
            {
              id: 'w7d5-ex1',
              title: 'Finale Challenge team-deliverable',
              titleI18n: {
                en: 'Final Challenge team deliverable',
                nl: 'Finale Challenge team-deliverable',
                fr: 'Deliverable équipe Final Challenge',
              },
              instructions: 'Team van 2-3. Kies echt probleem. Ontwerp (15 min) + Bouw (25 min) + Demo (10 min) + Publiceer (5 min). Mini-RALF elke 10 min. Deliverable: SKILL.md + N8N-schema + Marketplace-MR (of team-MR) + peer-review scores. Minimum 14/20 om te slagen.',
              instructionsI18n: {
                en: 'Team of 2-3. Pick real problem. Design (15) + Build (25) + Demo (10) + Publish (5). Mini-RALF every 10 min. Deliverable: SKILL.md + N8N schema + Marketplace-MR + peer-review scores. Min 14/20 to pass.',
                nl: 'Team van 2-3. Kies echt probleem. Ontwerp (15 min) + Bouw (25 min) + Demo (10 min) + Publiceer (5 min). Mini-RALF elke 10 min. Deliverable: SKILL.md + N8N-schema + Marketplace-MR (of team-MR) + peer-review scores. Minimum 14/20 om te slagen.',
                fr: 'Équipe 2-3. Vrai problème. Design + Build + Demo + Publish. Mini-RALF toutes les 10 min. Deliverable : SKILL.md + schéma N8N + Marketplace-MR + scores. Min 14/20.',
              },
              type: 'peer-review',
              difficulty: 3,
              points: 30,
            },
          ],
        },
      ],
    },
  ],
};
