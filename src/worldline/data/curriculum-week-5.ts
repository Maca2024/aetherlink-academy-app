// ─────────────────────────────────────────────────────────────────────────────
// WEEK 5 / LEVEL 6 — Model Landscape (Cons & Nina v1.0)
// Source: docs/levels/level-6/source.md (Cons & Nina v1.0, 20 apr 2026)
//
// Structuur v1.0:
//   Dag 1: Les 6.1 Waarom Het Model Uitmaakt          + Lab 6A Het Model Duel
//   Dag 2: Les 6.2 De Grote Drie                      + Lab — model-comparison matrix
//   Dag 3: Les 6.3 LibreChat Model-Switchboard        + Lab 6B Team Decision Guide
//   Dag 4: Les 6.4 Token-Efficiëntie                  + Lab — kostenanalyse
//   Dag 5: Les 6.5 Worldline Guardrails               + Rol-opdracht Model Duel Challenge
// ─────────────────────────────────────────────────────────────────────────────

import type { CurriculumWeek } from './curriculum';
import { dailySchedule } from './curriculum-schedule';

// ─── LES 6.1 — Waarom Het Model Uitmaakt ─────────────────────────────────────

const LESSON_6_1_NL = `# Les 6.1 — Waarom Het Model Uitmaakt

## Niet Elk Brein Is Gelijk

Tot nu toe heb je waarschijnlijk één model gebruikt voor alles. Claude in LibreChat, of misschien Claude Code in je terminal. En het werkt. Dus waarom zou je je druk maken over andere modellen?

Omdat het verschil groter is dan je denkt.

Neem deze taak: "Analyseer deze Golang functie op concurrency bugs."

Claude Opus geeft je een gedetailleerde analyse met race condition patterns, mutex suggesties, en een refactored versie. Duurt 15 seconden, kost ~$0.08.

Claude Haiku geeft je een snellere maar oppervlakkigere analyse. Vindt de obvious race condition maar mist de subtiele. Duurt 3 seconden, kost ~$0.001.

GPT-4o geeft een goede analyse maar structureert de output anders — meer uitleg, minder code.

Gemini Pro geeft een correcte analyse en kan bovendien een diagram genereren van de goroutine flow.

Vier modellen, vier resultaten, vier prijskaartjes. Welke is "het beste"? Dat hangt af van je taak, je budget, en je tijdsdruk.

## Het Model-Selectie Framework

**Drie vragen:**

1. **Wat is de complexiteit van mijn taak?**
   - Simple (syntax, formatting, boilerplate) → klein model
   - Medium (code review, refactoring, tests schrijven) → medium model
   - Complex (architectuur, debugging, multi-file analyse) → groot model

2. **Wat is mijn kwaliteitseis?**
   - Verkenning/brainstorm → snelheid wint, klein model prima
   - Productie-code → kwaliteit wint, groot model
   - Klantcommunicatie → nuance wint, groot model

3. **Wat is mijn budget/tijdsdruk?**
   - 100 calls per dag → let op kosten, gebruik klein model voor triviale taken
   - 10 calls per dag → kwaliteit eerst, gebruik het beste model
   - Deadline in 2 uur → snelheid eerst, mix modellen

De kunst is niet het beste model kiezen — het is het juiste model voor de juiste taak kiezen.

## Model Tiers

**Tier 1: Frontier Models** (zwaarste taken)
- Claude Opus, GPT-4o, Gemini Ultra
- → Architectuurbeslissingen, complexe debugging, multi-file refactoring
- → Duur, langzaam, maar de beste output

**Tier 2: Balanced Models** (dagelijks werk)
- Claude Sonnet, GPT-4o-mini, Gemini Pro
- → Code review, tests schrijven, documentatie, feature development
- → Goede balans tussen kwaliteit en kosten

**Tier 3: Speed Models** (triviale taken)
- Claude Haiku, GPT-4o-mini, Gemini Flash
- → Formatting, boilerplate, simpele vragen, bulk-verwerking
- → Snel en goedkoop, maar mist nuance bij complexe taken

De fout die de meeste mensen maken: Tier 1 gebruiken voor Tier 3 taken. Alsof je een Ferrari inzet om boodschappen te doen. Het werkt, maar je betaalt 50x meer dan nodig.`;

const LESSON_6_1_EN = `# Lesson 6.1 — Why the Model Matters

## Not Every Brain Is Equal

Until now you probably used one model for everything. Claude in LibreChat, or maybe Claude Code in your terminal. And it works. So why should you care about other models?

Because the difference is bigger than you think.

Take this task: "Analyse this Golang function for concurrency bugs."

Claude Opus gives you a detailed analysis with race condition patterns, mutex suggestions, and a refactored version. Takes 15 seconds, costs ~$0.08.

Claude Haiku gives you a faster but shallower analysis. Finds the obvious race condition but misses the subtle one. Takes 3 seconds, costs ~$0.001.

GPT-4o gives a good analysis but structures the output differently — more explanation, less code.

Gemini Pro gives a correct analysis and on top can generate a diagram of the goroutine flow.

Four models, four results, four price tags. Which is "the best"? That depends on your task, your budget, and your time pressure.

## The Model Selection Framework

**Three questions:**

1. **What is the complexity of my task?**
   - Simple (syntax, formatting, boilerplate) → small model
   - Medium (code review, refactoring, writing tests) → medium model
   - Complex (architecture, debugging, multi-file analysis) → large model

2. **What is my quality bar?**
   - Exploration/brainstorm → speed wins, small model fine
   - Production code → quality wins, large model
   - Client communication → nuance wins, large model

3. **What is my budget/time pressure?**
   - 100 calls per day → watch costs, use small model for trivial tasks
   - 10 calls per day → quality first, use the best model
   - Deadline in 2 hours → speed first, mix models

The art is not choosing the best model — it's choosing the right model for the right task.

## Model Tiers

**Tier 1: Frontier Models** (heaviest tasks)
- Claude Opus, GPT-4o, Gemini Ultra
- → Architecture decisions, complex debugging, multi-file refactoring
- → Expensive, slow, but the best output

**Tier 2: Balanced Models** (daily work)
- Claude Sonnet, GPT-4o-mini, Gemini Pro
- → Code review, writing tests, documentation, feature development
- → Good balance between quality and cost

**Tier 3: Speed Models** (trivial tasks)
- Claude Haiku, GPT-4o-mini, Gemini Flash
- → Formatting, boilerplate, simple questions, bulk processing
- → Fast and cheap, but misses nuance on complex tasks

The mistake most people make: using Tier 1 for Tier 3 tasks. Like deploying a Ferrari to go grocery shopping. It works, but you're paying 50x more than needed.`;

const LESSON_6_1_FR = `# Leçon 6.1 — Pourquoi le Modèle Compte

## Tous les Cerveaux Ne Sont Pas Égaux

Jusqu'à présent vous avez probablement utilisé un seul modèle pour tout. Claude dans LibreChat, ou peut-être Claude Code dans votre terminal. Et ça marche. Alors pourquoi se soucier d'autres modèles ?

Parce que la différence est plus grande que vous ne le pensez.

Prenez cette tâche : « Analysez cette fonction Golang pour les bugs de concurrence. »

Claude Opus vous donne une analyse détaillée avec race condition patterns, suggestions mutex, et une version refactorée. Prend 15 secondes, coûte ~$0.08.

Claude Haiku vous donne une analyse plus rapide mais plus superficielle. Trouve la race condition évidente mais rate la subtile. Prend 3 secondes, coûte ~$0.001.

GPT-4o donne une bonne analyse mais structure la sortie différemment — plus d'explications, moins de code.

Gemini Pro donne une analyse correcte et peut en plus générer un diagramme du flow goroutine.

Quatre modèles, quatre résultats, quatre étiquettes de prix. Lequel est « le meilleur » ? Ça dépend de votre tâche, votre budget, et votre pression temps.

## Le Framework de Sélection de Modèle

**Trois questions :**

1. **Quelle est la complexité de ma tâche ?**
   - Simple (syntaxe, formatage, boilerplate) → petit modèle
   - Medium (code review, refactoring, écrire tests) → modèle moyen
   - Complex (architecture, debug, analyse multi-fichiers) → grand modèle

2. **Quelle est mon exigence qualité ?**
   - Exploration/brainstorm → vitesse gagne, petit modèle OK
   - Code production → qualité gagne, grand modèle
   - Communication client → nuance gagne, grand modèle

3. **Quel est mon budget/pression temps ?**
   - 100 calls par jour → attention coûts, petit modèle pour tâches triviales
   - 10 calls par jour → qualité d'abord, meilleur modèle
   - Deadline dans 2h → vitesse d'abord, mix modèles

L'art n'est pas de choisir le meilleur modèle — c'est de choisir le bon modèle pour la bonne tâche.

## Tiers de Modèles

**Tier 1 : Frontier Models** (tâches les plus lourdes)
- Claude Opus, GPT-4o, Gemini Ultra
- → Décisions d'architecture, debug complexe, refactoring multi-fichiers
- → Cher, lent, mais la meilleure sortie

**Tier 2 : Balanced Models** (travail quotidien)
- Claude Sonnet, GPT-4o-mini, Gemini Pro
- → Code review, écrire tests, documentation, dev feature
- → Bon équilibre entre qualité et coût

**Tier 3 : Speed Models** (tâches triviales)
- Claude Haiku, GPT-4o-mini, Gemini Flash
- → Formatage, boilerplate, questions simples, traitement en masse
- → Rapide et pas cher, mais rate la nuance sur tâches complexes

L'erreur que la plupart des gens font : utiliser Tier 1 pour des tâches Tier 3. Comme déployer une Ferrari pour faire les courses. Ça marche, mais vous payez 50x plus que nécessaire.`;

// ─── LES 6.2 — De Grote Drie: Claude, Gemini, GPT ────────────────────────────

const LESSON_6_2_NL = `# Les 6.2 — De Grote Drie: Claude, Gemini, GPT

Dit is geen marketingverhaal. Dit is wat we in de praktijk zien bij Worldline-achtige use cases: code-heavy, enterprise, compliance-gevoelig.

## Claude (Anthropic)

**Sterktes:**
- Code generatie en review — consistent de beste in benchmarks voor Golang/Java
- Lange context — tot 200K tokens, leest hele codebases in één keer
- Instruction following — doet precies wat je vraagt, volgt specs nauwkeurig
- Veiligheid — weigert liever dan dat het hallucineert
- CLAUDE.md support — native integratie in development workflow

**Zwaktes:**
- Geen native image generation
- Kan conservatief zijn — weigert soms taken die prima zijn
- Duurder dan GPT voor vergelijkbare taken

**Bij Worldline beschikbaar via:**
- LibreChat (alle tiers)
- Claude Code CLI (via Vertex AI)

**Wanneer Claude kiezen:**
- Code schrijven, reviewen, testen
- Complexe prompts waar instruction following cruciaal is
- Taken waar je NIET wilt dat het model creatief afwijkt van de spec

## Gemini (Google)

**Sterktes:**
- Multimodaal — kan afbeeldingen, video, en audio verwerken
- Google integratie — werkt naadloos met Google Workspace tools
- Lange context — tot 1M tokens (grootste van alle modellen)
- Snelheid — Gemini Flash is extreem snel voor triviale taken
- Prijs — competitief, vooral Flash tier

**Zwaktes:**
- Instruction following minder consistent dan Claude
- Code kwaliteit wisselend — sterk in Python, minder in Golang
- Soms te creatief — voegt dingen toe die je niet vroeg

**Bij Worldline beschikbaar via:**
- LibreChat (geselecteerde tiers)
- Vertex AI (direct)

**Wanneer Gemini kiezen:**
- Multimodale taken (screenshots analyseren, diagrammen beschrijven)
- Bulk-verwerking waar snelheid cruciaal is (Gemini Flash)
- Taken die Google Workspace integratie nodig hebben

## GPT (OpenAI)

**Sterktes:**
- Breed inzetbaar — goed in bijna alles, uitblinker in weinig
- Grootste community — meeste tutorials, voorbeelden, en tooling
- Function calling — sterke tool-use implementatie
- Creative writing — beste in natuurlijke, menselijk klinkende tekst

**Zwaktes:**
- Code kwaliteit onder Claude voor enterprise-talen (Golang, Java)
- Kan "te behulpzaam" zijn — geeft antwoord ook als het niet zeker is
- Pricing model complex (per model, per feature)

**Bij Worldline beschikbaar via:**
- LibreChat (geselecteerde tiers)

**Wanneer GPT kiezen:**
- Documentatie en technische schrijftaken
- Brainstorm sessies waar creativiteit belangrijk is
- Taken waar de community veel voorbeelden voor heeft

## Het Eerlijke Antwoord

Geen model is "het beste." De modellen convergeren — elke nieuwe release verkleint de verschillen. Wat vandaag een sterkte is van Claude, kan volgende maand door Gemini zijn ingehaald.

Daarom is het belangrijker om te leren HOE je modellen vergelijkt dan WELK model je vandaag moet kiezen. De vergelijkingsmethode blijft waardevol, zelfs als de modellen veranderen.`;

const LESSON_6_2_EN = `# Lesson 6.2 — The Big Three: Claude, Gemini, GPT

This is not a marketing story. This is what we see in practice on Worldline-style use cases: code-heavy, enterprise, compliance-sensitive.

## Claude (Anthropic)

**Strengths:**
- Code generation and review — consistently the best in benchmarks for Golang/Java
- Long context — up to 200K tokens, reads entire codebases at once
- Instruction following — does exactly what you ask, follows specs carefully
- Safety — prefers refusing over hallucinating
- CLAUDE.md support — native integration in development workflow

**Weaknesses:**
- No native image generation
- Can be conservative — sometimes refuses tasks that are fine
- More expensive than GPT for comparable tasks

**Available at Worldline via:**
- LibreChat (all tiers)
- Claude Code CLI (via Vertex AI)

**When to pick Claude:**
- Writing, reviewing, testing code
- Complex prompts where instruction following is critical
- Tasks where you do NOT want the model to creatively deviate from the spec

## Gemini (Google)

**Strengths:**
- Multimodal — can process images, video, and audio
- Google integration — works seamlessly with Google Workspace tools
- Long context — up to 1M tokens (largest of all models)
- Speed — Gemini Flash is extremely fast for trivial tasks
- Price — competitive, especially Flash tier

**Weaknesses:**
- Instruction following less consistent than Claude
- Code quality variable — strong in Python, less in Golang
- Sometimes too creative — adds things you didn't ask for

**Available at Worldline via:**
- LibreChat (selected tiers)
- Vertex AI (direct)

**When to pick Gemini:**
- Multimodal tasks (analysing screenshots, describing diagrams)
- Bulk processing where speed is critical (Gemini Flash)
- Tasks that need Google Workspace integration

## GPT (OpenAI)

**Strengths:**
- Broadly deployable — good at almost everything, standout at little
- Largest community — most tutorials, examples, and tooling
- Function calling — strong tool-use implementation
- Creative writing — best at natural, human-sounding text

**Weaknesses:**
- Code quality below Claude for enterprise languages (Golang, Java)
- Can be "too helpful" — gives an answer even if not sure
- Pricing model complex (per model, per feature)

**Available at Worldline via:**
- LibreChat (selected tiers)

**When to pick GPT:**
- Documentation and technical writing tasks
- Brainstorm sessions where creativity matters
- Tasks for which the community has many examples

## The Honest Answer

No model is "the best." Models are converging — each new release narrows the gap. What is Claude's strength today, Gemini may match next month.

That is why it is more important to learn HOW to compare models than WHICH model to pick today. The comparison method stays valuable, even when the models change.`;

const LESSON_6_2_FR = `# Leçon 6.2 — Les Trois Grands : Claude, Gemini, GPT

Ce n'est pas une histoire marketing. C'est ce que nous voyons en pratique sur des use cases de type Worldline : code-heavy, enterprise, compliance-sensitive.

## Claude (Anthropic)

**Forces :**
- Génération et review de code — constamment le meilleur sur benchmarks Golang/Java
- Contexte long — jusqu'à 200K tokens, lit des codebases entières en une fois
- Instruction following — fait exactement ce qu'on demande, suit les specs précisément
- Sécurité — préfère refuser plutôt qu'halluciner
- Support CLAUDE.md — intégration native dans le workflow dev

**Faiblesses :**
- Pas de génération d'images native
- Peut être conservateur — refuse parfois des tâches OK
- Plus cher que GPT pour tâches comparables

**Disponible chez Worldline via :**
- LibreChat (tous tiers)
- Claude Code CLI (via Vertex AI)

**Quand choisir Claude :**
- Écrire, reviewer, tester du code
- Prompts complexes où l'instruction following est critique
- Tâches où vous NE voulez PAS que le modèle dévie créativement de la spec

## Gemini (Google)

**Forces :**
- Multimodal — peut traiter images, vidéo, et audio
- Intégration Google — fonctionne avec Google Workspace
- Contexte long — jusqu'à 1M tokens (plus grand de tous)
- Vitesse — Gemini Flash est extrêmement rapide pour tâches triviales
- Prix — compétitif, surtout tier Flash

**Faiblesses :**
- Instruction following moins consistant que Claude
- Qualité code variable — fort en Python, moins en Golang
- Parfois trop créatif — ajoute des choses non demandées

**Disponible chez Worldline via :**
- LibreChat (tiers sélectionnés)
- Vertex AI (direct)

**Quand choisir Gemini :**
- Tâches multimodales (analyser screenshots, décrire diagrammes)
- Traitement en masse où la vitesse compte (Gemini Flash)
- Tâches nécessitant l'intégration Google Workspace

## GPT (OpenAI)

**Forces :**
- Largement déployable — bon à presque tout, excellent à peu
- Plus grande communauté — plus de tutoriels, exemples, outillage
- Function calling — implémentation tool-use forte
- Creative writing — meilleur pour texte naturel, qui sonne humain

**Faiblesses :**
- Qualité code en-dessous de Claude pour langages enterprise (Golang, Java)
- Peut être « trop serviable » — donne une réponse même incertain
- Pricing complexe (par modèle, par feature)

**Disponible chez Worldline via :**
- LibreChat (tiers sélectionnés)

**Quand choisir GPT :**
- Documentation et tâches d'écriture technique
- Sessions brainstorm où la créativité importe
- Tâches où la communauté a beaucoup d'exemples

## La Réponse Honnête

Aucun modèle n'est « le meilleur ». Les modèles convergent — chaque nouvelle release rétrécit l'écart. Ce qui est une force de Claude aujourd'hui, Gemini peut l'égaler le mois prochain.

C'est pourquoi il est plus important d'apprendre COMMENT comparer les modèles que QUEL modèle choisir aujourd'hui. La méthode de comparaison reste précieuse, même si les modèles changent.`;

// ─── LES 6.3 — LibreChat: Je Model-Switchboard ───────────────────────────────

const LESSON_6_3_NL = `# Les 6.3 — LibreChat: Je Model-Switchboard

## Jullie Geheime Wapen

De meeste bedrijven hebben toegang tot één model. Jullie hebben LibreChat — een interface die je laat schakelen tussen modellen alsof je een TV-kanaal wisselt.

Dit is een enorm voordeel. Maar alleen als je weet wanneer je welk kanaal kiest.

## Hoe LibreChat Werkt

LibreChat is een self-hosted chat interface die meerdere AI-providers ondersteunt. Bij Worldline is het geconfigureerd met:
- Claude (alle tiers, via Vertex AI)
- Gemini (geselecteerde tiers, via Vertex AI)
- GPT (geselecteerde tiers)

In de interface:
1. Open een nieuw gesprek
2. Kies je model uit de dropdown (linksboven)
3. Chat — het model verwerkt je prompt
4. Wil je vergelijken? Open een nieuw gesprek, kies een ander model, plak dezelfde prompt

Dat is alles. Geen configuratie, geen API keys, geen setup. Het staat klaar.

## LibreChat Memories

In Level 3 leerde je over CLAUDE.md als context voor Claude Code. LibreChat heeft een vergelijkbaar mechanisme: **memories**.

Memories zijn persoonlijke context-snippets die automatisch worden meegestuurd bij elke prompt. Ze werken model-onafhankelijk — of je nu Claude, Gemini, of GPT kiest, je memories zijn er.

**Effectieve memories:**
- "Ik ben backend engineer bij OFS1, ik werk met Golang en PostgreSQL"
- "Ons team volgt de Uber Go Style Guide"
- "Bij code review focus ik op concurrency en error handling"

Dit is je persoonlijke CLAUDE.md, maar dan voor LibreChat. Dezelfde principes gelden: kort, specifiek, relevant.

## Claude Code vs LibreChat

Twee tools, twee use cases:

**Claude Code (CLI):**
- Directe toegang tot je codebase
- Leest en schrijft bestanden
- Runt commands
- Ideaal voor: implementatie, refactoring, debugging

**LibreChat (chat):**
- Geen directe code-toegang
- Model-agnostisch (switch tussen providers)
- Ideaal voor: brainstorm, vergelijking, documentatie, analyse

**De vuistregel:** als je bestanden moet lezen of schrijven → Claude Code. Als je moet denken, vergelijken, of schrijven → LibreChat.`;

const LESSON_6_3_EN = `# Lesson 6.3 — LibreChat: Your Model Switchboard

## Your Secret Weapon

Most companies have access to one model. You have LibreChat — an interface that lets you switch between models like changing a TV channel.

This is a huge advantage. But only if you know when to pick which channel.

## How LibreChat Works

LibreChat is a self-hosted chat interface that supports multiple AI providers. At Worldline it is configured with:
- Claude (all tiers, via Vertex AI)
- Gemini (selected tiers, via Vertex AI)
- GPT (selected tiers)

In the interface:
1. Open a new conversation
2. Pick your model from the dropdown (top left)
3. Chat — the model processes your prompt
4. Want to compare? Open a new conversation, pick another model, paste the same prompt

That's all. No configuration, no API keys, no setup. It's ready.

## LibreChat Memories

In Level 3 you learned about CLAUDE.md as context for Claude Code. LibreChat has a similar mechanism: **memories**.

Memories are personal context snippets that are automatically attached to every prompt. They work model-agnostic — whether you pick Claude, Gemini, or GPT, your memories are there.

**Effective memories:**
- "I am a backend engineer in OFS1, I work with Golang and PostgreSQL"
- "Our team follows the Uber Go Style Guide"
- "On code review I focus on concurrency and error handling"

This is your personal CLAUDE.md, but for LibreChat. Same principles: short, specific, relevant.

## Claude Code vs LibreChat

Two tools, two use cases:

**Claude Code (CLI):**
- Direct access to your codebase
- Reads and writes files
- Runs commands
- Ideal for: implementation, refactoring, debugging

**LibreChat (chat):**
- No direct code access
- Model-agnostic (switch between providers)
- Ideal for: brainstorm, comparison, documentation, analysis

**Rule of thumb:** if you must read or write files → Claude Code. If you must think, compare, or write → LibreChat.`;

const LESSON_6_3_FR = `# Leçon 6.3 — LibreChat : Votre Model-Switchboard

## Votre Arme Secrète

La plupart des entreprises ont accès à un modèle. Vous avez LibreChat — une interface qui vous permet de basculer entre modèles comme changer de chaîne TV.

C'est un énorme avantage. Mais seulement si vous savez quand choisir quelle chaîne.

## Comment LibreChat Fonctionne

LibreChat est une interface chat self-hosted qui supporte plusieurs providers IA. Chez Worldline elle est configurée avec :
- Claude (tous tiers, via Vertex AI)
- Gemini (tiers sélectionnés, via Vertex AI)
- GPT (tiers sélectionnés)

Dans l'interface :
1. Ouvrez une nouvelle conversation
2. Choisissez votre modèle dans le dropdown (en haut à gauche)
3. Chattez — le modèle traite votre prompt
4. Voulez-vous comparer ? Ouvrez une nouvelle conversation, choisissez un autre modèle, collez le même prompt

C'est tout. Pas de configuration, pas d'API keys, pas de setup. C'est prêt.

## LibreChat Memories

Au Level 3 vous avez appris sur CLAUDE.md comme context pour Claude Code. LibreChat a un mécanisme similaire : **memories**.

Les memories sont des snippets de context personnels automatiquement envoyés avec chaque prompt. Ils fonctionnent model-agnostic — que vous choisissiez Claude, Gemini, ou GPT, vos memories sont là.

**Memories efficaces :**
- « Je suis backend engineer chez OFS1, je travaille avec Golang et PostgreSQL »
- « Notre équipe suit le Uber Go Style Guide »
- « Sur code review je me concentre sur concurrence et error handling »

C'est votre CLAUDE.md personnel, mais pour LibreChat. Mêmes principes : court, spécifique, pertinent.

## Claude Code vs LibreChat

Deux outils, deux use cases :

**Claude Code (CLI) :**
- Accès direct à votre codebase
- Lit et écrit des fichiers
- Lance des commandes
- Idéal pour : implémentation, refactoring, debug

**LibreChat (chat) :**
- Pas d'accès direct au code
- Model-agnostic (switch entre providers)
- Idéal pour : brainstorm, comparaison, documentation, analyse

**Règle :** si vous devez lire ou écrire des fichiers → Claude Code. Si vous devez penser, comparer, ou écrire → LibreChat.`;

// ─── LES 6.4 — Token-Efficiëntie en Kostenbewustzijn ─────────────────────────

const LESSON_6_4_NL = `# Les 6.4 — Token-Efficiëntie en Kostenbewustzijn

## Wat Tokens Zijn

Elk woord dat je naar een AI stuurt, en elk woord dat terugkomt, wordt geteld in tokens. Ruwweg: 1 token ≈ 0.75 woorden in het Engels. Code is token-intensiever dan tekst.

Dit is belangrijk omdat:
- Je betaalt per token (input + output)
- Er een maximum is per gesprek (context window)
- Meer tokens = langzamere response

Token-bewustzijn is niet zuinigheid — het is efficiëntie. Je wilt maximale output per token.

## De Kosten

Ruwweg (prijzen veranderen, check altijd de actuele stand):

**Tier 1 (Frontier):**
- Claude Opus: ~$15 per 1M input tokens, ~$75 per 1M output tokens
- GPT-4o: ~$5 per 1M input, ~$15 per 1M output

**Tier 2 (Balanced):**
- Claude Sonnet: ~$3 per 1M input, ~$15 per 1M output
- Gemini Pro: ~$1.25 per 1M input, ~$5 per 1M output

**Tier 3 (Speed):**
- Claude Haiku: ~$0.25 per 1M input, ~$1.25 per 1M output
- Gemini Flash: ~$0.075 per 1M input, ~$0.30 per 1M output

**Het verschil:** dezelfde taak kost op Claude Opus ~200x meer dan op Gemini Flash.

## Token-Besparingstechnieken

**1. Right-size je model**
Gebruik niet Opus voor "format deze JSON." Haiku doet dat net zo goed voor een fractie van de kosten.

**2. Geef precies genoeg context**
De scalpel-regel uit Level 3 is ook een kostenbesparing. Elke onnodige regel in je context is tokens die je betaalt maar niet nodig hebt.

**3. Gebruik @-mentions in plaats van copy-paste**
In Claude Code: \`@bestand.go\` stuurt alleen de relevante code. Copy-paste stuurt vaak meer dan nodig.

**4. Splits lange taken**
Eén gesprek van 200K tokens is duurder en slechter dan vier gesprekken van 50K tokens. De context rot uit Level 3 kost je ook tokens.

**5. Caching**
Sommige providers bieden prompt caching — herhaalde context wordt goedkoper. Check of dit beschikbaar is in jullie LibreChat configuratie.

## Gertjans Metrics: Token Usage

Uit het Metrics Framework: Gertjan wil "Daily active usage on AI tools (Token usage)" meten. Niet om te beperken — maar om te begrijpen.

Het doel is bewustzijn:
- Hoeveel tokens gebruikt je squad per sprint?
- Wat is het verschil tussen squads?
- Correleert hoger token-gebruik met betere output?

De verwachting: token-gebruik stijgt in het begin (leren, experimenteren) en stabiliseert daarna (efficiëntie). Als het blijft stijgen zonder betere output, is dat een signaal.`;

const LESSON_6_4_EN = `# Lesson 6.4 — Token Efficiency and Cost Awareness

## What Tokens Are

Every word you send to an AI, and every word that comes back, is counted in tokens. Roughly: 1 token ≈ 0.75 words in English. Code is more token-intensive than text.

This matters because:
- You pay per token (input + output)
- There is a maximum per conversation (context window)
- More tokens = slower response

Token awareness is not frugality — it's efficiency. You want maximum output per token.

## The Cost

Roughly (prices change, always check current state):

**Tier 1 (Frontier):**
- Claude Opus: ~$15 per 1M input tokens, ~$75 per 1M output tokens
- GPT-4o: ~$5 per 1M input, ~$15 per 1M output

**Tier 2 (Balanced):**
- Claude Sonnet: ~$3 per 1M input, ~$15 per 1M output
- Gemini Pro: ~$1.25 per 1M input, ~$5 per 1M output

**Tier 3 (Speed):**
- Claude Haiku: ~$0.25 per 1M input, ~$1.25 per 1M output
- Gemini Flash: ~$0.075 per 1M input, ~$0.30 per 1M output

**The difference:** the same task costs ~200x more on Claude Opus than on Gemini Flash.

## Token Saving Techniques

**1. Right-size your model**
Don't use Opus for "format this JSON." Haiku does that just as well for a fraction of the cost.

**2. Give just enough context**
The scalpel rule from Level 3 is also a cost saving. Every unneeded line in your context is tokens you pay for but don't need.

**3. Use @-mentions instead of copy-paste**
In Claude Code: \`@file.go\` sends only the relevant code. Copy-paste often sends more than needed.

**4. Split long tasks**
One 200K-token conversation is more expensive and worse than four 50K conversations. Context rot from Level 3 also costs you tokens.

**5. Caching**
Some providers offer prompt caching — repeated context gets cheaper. Check if it's available in your LibreChat configuration.

## Gertjan's Metrics: Token Usage

From the Metrics Framework: Gertjan wants to measure "Daily active usage on AI tools (Token usage)". Not to limit — but to understand.

The goal is awareness:
- How many tokens does your squad use per sprint?
- What is the difference between squads?
- Does higher token usage correlate with better output?

The expectation: token usage rises at first (learning, experimenting) and stabilises afterwards (efficiency). If it keeps rising without better output, that's a signal.`;

const LESSON_6_4_FR = `# Leçon 6.4 — Efficacité des Tokens et Conscience des Coûts

## Ce Que Sont les Tokens

Chaque mot que vous envoyez à une IA, et chaque mot qui revient, est compté en tokens. Grosso modo : 1 token ≈ 0.75 mots en anglais. Le code est plus token-intensif que le texte.

C'est important car :
- Vous payez par token (input + output)
- Il y a un maximum par conversation (context window)
- Plus de tokens = réponse plus lente

La conscience des tokens n'est pas de la pingrerie — c'est de l'efficacité. Vous voulez la sortie maximale par token.

## Les Coûts

Grosso modo (les prix changent, vérifiez toujours l'état actuel) :

**Tier 1 (Frontier) :**
- Claude Opus : ~$15 par 1M input tokens, ~$75 par 1M output tokens
- GPT-4o : ~$5 par 1M input, ~$15 par 1M output

**Tier 2 (Balanced) :**
- Claude Sonnet : ~$3 par 1M input, ~$15 par 1M output
- Gemini Pro : ~$1.25 par 1M input, ~$5 par 1M output

**Tier 3 (Speed) :**
- Claude Haiku : ~$0.25 par 1M input, ~$1.25 par 1M output
- Gemini Flash : ~$0.075 par 1M input, ~$0.30 par 1M output

**La différence :** la même tâche coûte ~200x plus sur Claude Opus que sur Gemini Flash.

## Techniques pour Économiser des Tokens

**1. Right-size votre modèle**
N'utilisez pas Opus pour « formattez ce JSON ». Haiku fait ça aussi bien pour une fraction du coût.

**2. Donnez juste assez de context**
La règle scalpel du Level 3 est aussi une économie de coûts. Chaque ligne inutile dans votre context est des tokens payés mais non nécessaires.

**3. Utilisez @-mentions au lieu de copy-paste**
Dans Claude Code : \`@fichier.go\` envoie seulement le code pertinent. Copy-paste envoie souvent plus que nécessaire.

**4. Divisez les longues tâches**
Une conversation de 200K tokens est plus chère et pire que quatre conversations de 50K. Le context rot du Level 3 vous coûte aussi des tokens.

**5. Caching**
Certains providers offrent prompt caching — le context répété devient moins cher. Vérifiez la disponibilité dans votre LibreChat.

## Metrics de Gertjan : Token Usage

Depuis le Metrics Framework : Gertjan veut mesurer « Daily active usage on AI tools (Token usage) ». Pas pour limiter — pour comprendre.

Le but est la conscience :
- Combien de tokens votre squad utilise par sprint ?
- Quelle est la différence entre squads ?
- L'usage plus haut corrèle-t-il avec une meilleure sortie ?

L'attente : l'usage monte au début (apprentissage, expérimentation) et se stabilise ensuite (efficacité). S'il continue à monter sans meilleure sortie, c'est un signal.`;

// ─── LES 6.5 — Worldline Guardrails: Wat Mag en Wat Niet ─────────────────────

const LESSON_6_5_NL = `# Les 6.5 — Worldline Guardrails: Wat Mag en Wat Niet

## Dit Is Niet Optioneel

Tot nu toe ging deze cursus over wat je KAN doen met AI. Nu gaan we het hebben over wat je NIET MAG doen. En dit is net zo belangrijk — misschien belangrijker.

Gertjan Dewaele heeft de Worldline AI Guardrails gedefinieerd. Dit zijn geen suggesties. **Dit zijn regels. Overtreding kan je baan kosten.**

## De Basis: Vertex AI + Google Enterprise

Alle AI bij Worldline draait via Vertex AI met een Google Enterprise Agreement. Dat betekent:
- Je data wordt NIET gebruikt voor model training
- Data blijft binnen de EU
- IP is beschermd

Dit is waarom jullie LibreChat en Claude Code mogen gebruiken voor je werkcode. De data is veilig.

## Wat WEL Mag

- Code schrijven, reviewen, refactoren
- Unit tests en testdata genereren (niet-gevoelig)
- Documentatie, README's, runbooks schrijven
- Brainstormen over oplossingen
- Interne documentatie samenvatten via goedgekeurde tools

**Vuistregel:** als het je sneller maakt zonder gevoelige data bloot te stellen — prima.

## Wat NIET Mag — Lees Dit Twee Keer

- **NOOIT** PCI data (kaartnummers, CVV) naar AI sturen
- **NOOIT** credentials (API keys, wachtwoorden, tokens) in prompts
- **GEEN** klant PII in prompts
- **GEEN** persoonlijke AI-accounts voor werk (alleen corporate tools)
- **GEEN** ongereviewed AI-wijzigingen naar productie deployen
- **GEEN** data uit Production/Pre-production databases
- **GEEN** Worldline beleid of procedures delen met externe AI

Dit geldt voor ALLE modellen, ALLE tools, ALLE situaties. **Geen uitzonderingen.**

## Het Review Pattern

Elke AI-gegenereerde wijziging volgt dit pad:

> AI genereert → Jij reviewt → Jij commit → Peer reviewt → Automation deployt → Mens keurt goed

Geen stap overslaan. De AI is je assistent, niet je vervanger. **JIJ bent verantwoordelijk voor de code die je commit.**

## Production Workflows

Voor productie-systemen (N8N, agents, automatisering):

**Mag wel:**
- AI voor analyse van system outputs (logs, errors, API responses)
- Transactiedata via goedgekeurde API's/MCP's met filtering
- Gesanitiseerde data (PAN, tokens, PII verwijderd)

**Mag niet:**
- Directe database access met write/execute
- Create, Update, Delete via AI agents
- Raw tables/dumps met gevoelige velden
- Credentials met write access in AI workflows

**Pattern:** System → sanitized API/MCP → AI. De AI ziet alleen de gesanitiseerde versie.

## Skills en Agents

Behandel skills als code. Dat betekent:
- Eigen skills bouwen: prima
- Zelf reviewen voor eigen gebruik: prima
- Delen met je team: peer-review verplicht
- Random skills van internet downloaden: NIET zonder review

Je bent verantwoordelijk voor begrijpen wat je skills doen. "Ik heb het gedownload en het werkte" is geen excuus als het PCI data lekt.

## De Gouden Regel van Permissions

**NOOIT \`--dangerously-skip-permissions\` gebruiken. Nooit.** Wat het ook is. Hoe laat het ook is. Hoeveel haast je ook hebt.

Lees elke permission prompt. Begrijp wat de agent probeert te doen. Geef minimale permissions. Als je twijfelt: weiger.

> *"One common failure mode is the agent gives a long explanation, asks for permissions a few times, and after a while people start clicking yes, yes, yes without really checking what is being approved."* — Gertjan Dewaele

## De Guardrails Checklist

Bij ELKE AI-taak, controleer:

- [ ] Geen PCI data / credentials / PII in mijn prompt?
- [ ] Menselijke review van alle AI-output voordat het naar productie gaat?
- [ ] Alleen goedgekeurde tools (LibreChat, Claude Code via Vertex)?
- [ ] Permission management correct (geen YOLO mode)?
- [ ] Output gelabeld als \`ai-assisted\` in Jira?

Print deze checklist uit. Plak hem naast je scherm. Na 4 weken is het een automatisme. Tot die tijd: lees hem elke keer.`;

const LESSON_6_5_EN = `# Lesson 6.5 — Worldline Guardrails: What's Allowed and What's Not

## This Is Not Optional

Until now this course was about what you CAN do with AI. Now we're going to talk about what you MAY NOT do. And this is just as important — maybe more important.

Gertjan Dewaele defined the Worldline AI Guardrails. These are not suggestions. **These are rules. Violation can cost your job.**

## The Foundation: Vertex AI + Google Enterprise

All AI at Worldline runs via Vertex AI with a Google Enterprise Agreement. That means:
- Your data is NOT used for model training
- Data stays within the EU
- IP is protected

This is why you can use LibreChat and Claude Code for your work code. The data is safe.

## What IS Allowed

- Writing, reviewing, refactoring code
- Generating unit tests and test data (non-sensitive)
- Writing documentation, READMEs, runbooks
- Brainstorming solutions
- Summarising internal docs via approved tools

**Rule of thumb:** if it makes you faster without exposing sensitive data — fine.

## What Is NOT Allowed — Read Twice

- **NEVER** send PCI data (card numbers, CVV) to AI
- **NEVER** credentials (API keys, passwords, tokens) in prompts
- **NO** customer PII in prompts
- **NO** personal AI accounts for work (only corporate tools)
- **NO** unreviewed AI changes deployed to production
- **NO** data from Production/Pre-production databases
- **NO** sharing Worldline policy or procedures with external AI

This applies to ALL models, ALL tools, ALL situations. **No exceptions.**

## The Review Pattern

Every AI-generated change follows this path:

> AI generates → You review → You commit → Peer reviews → Automation deploys → Human approves

Don't skip a step. The AI is your assistant, not your replacement. **YOU are responsible for the code you commit.**

## Production Workflows

For production systems (N8N, agents, automation):

**Allowed:**
- AI for analysis of system outputs (logs, errors, API responses)
- Transaction data via approved APIs/MCPs with filtering
- Sanitised data (PAN, tokens, PII removed)

**Not allowed:**
- Direct database access with write/execute
- Create, Update, Delete via AI agents
- Raw tables/dumps with sensitive fields
- Credentials with write access in AI workflows

**Pattern:** System → sanitised API/MCP → AI. The AI only sees the sanitised version.

## Skills and Agents

Treat skills like code. That means:
- Building your own skills: fine
- Reviewing yourself for personal use: fine
- Sharing with your team: peer-review required
- Random skills from the internet: NOT without review

You are responsible for understanding what your skills do. "I downloaded it and it worked" is no excuse when it leaks PCI data.

## The Golden Rule of Permissions

**NEVER use \`--dangerously-skip-permissions\`. Never.** Whatever it is. Whatever time. However much of a hurry you're in.

Read every permission prompt. Understand what the agent is trying to do. Give minimum permissions. When in doubt: refuse.

> *"One common failure mode is the agent gives a long explanation, asks for permissions a few times, and after a while people start clicking yes, yes, yes without really checking what is being approved."* — Gertjan Dewaele

## The Guardrails Checklist

At EVERY AI task, check:

- [ ] No PCI data / credentials / PII in my prompt?
- [ ] Human review of all AI output before production?
- [ ] Only approved tools (LibreChat, Claude Code via Vertex)?
- [ ] Permission management correct (no YOLO mode)?
- [ ] Output labelled as \`ai-assisted\` in Jira?

Print this checklist. Pin it next to your screen. After 4 weeks it's automatic. Until then: read it every time.`;

const LESSON_6_5_FR = `# Leçon 6.5 — Worldline Guardrails : Ce Qui Est Autorisé et Ce Qui Ne L'est Pas

## Ce N'est Pas Optionnel

Jusqu'à présent ce cours portait sur ce que vous POUVEZ faire avec l'IA. Maintenant nous allons parler de ce que vous NE DEVEZ PAS faire. Et c'est tout aussi important — peut-être plus important.

Gertjan Dewaele a défini les Worldline AI Guardrails. Ce ne sont pas des suggestions. **Ce sont des règles. Une violation peut vous coûter votre job.**

## La Fondation : Vertex AI + Google Enterprise

Toute IA chez Worldline tourne via Vertex AI avec un Google Enterprise Agreement. Ça veut dire :
- Vos données ne sont PAS utilisées pour entraîner le modèle
- Les données restent dans l'UE
- La PI est protégée

C'est pourquoi vous pouvez utiliser LibreChat et Claude Code pour votre code de travail. Les données sont sécurisées.

## Ce Qui EST Autorisé

- Écrire, reviewer, refactorer du code
- Générer unit tests et test data (non-sensible)
- Écrire documentation, READMEs, runbooks
- Brainstormer des solutions
- Résumer documentation interne via outils approuvés

**Règle :** si ça vous accélère sans exposer de données sensibles — OK.

## Ce Qui N'est PAS Autorisé — Lisez Deux Fois

- **JAMAIS** envoyer des données PCI (numéros de carte, CVV) à l'IA
- **JAMAIS** credentials (API keys, mots de passe, tokens) dans prompts
- **PAS** de PII client dans prompts
- **PAS** de comptes IA personnels pour le travail (seulement outils corporate)
- **PAS** de changements IA non reviewés déployés en production
- **PAS** de données des bases Production/Pre-production
- **PAS** de partage de politique ou procédures Worldline avec IA externe

Ça s'applique à TOUS les modèles, TOUS les outils, TOUTES les situations. **Aucune exception.**

## Le Pattern de Review

Chaque changement généré par IA suit ce chemin :

> IA génère → Vous reviewez → Vous committez → Pair reviewe → Automation déploie → Humain approuve

Ne sautez pas d'étape. L'IA est votre assistant, pas votre remplaçant. **VOUS êtes responsable du code que vous committez.**

## Workflows Production

Pour systèmes de production (N8N, agents, automation) :

**Autorisé :**
- IA pour analyse de sorties système (logs, errors, API responses)
- Data transactionnelle via API/MCPs approuvés avec filtrage
- Données sanitisées (PAN, tokens, PII retirés)

**Non autorisé :**
- Accès direct base avec write/execute
- Create, Update, Delete via agents IA
- Tables/dumps bruts avec champs sensibles
- Credentials avec write access dans workflows IA

**Pattern :** Système → API/MCP sanitisée → IA. L'IA ne voit que la version sanitisée.

## Skills et Agents

Traitez les skills comme du code. Ça veut dire :
- Construire vos propres skills : OK
- Reviewer vous-même pour usage personnel : OK
- Partager avec votre équipe : peer-review obligatoire
- Skills random d'internet : PAS sans review

Vous êtes responsable de comprendre ce que font vos skills. « Je l'ai téléchargé et ça marchait » n'est pas une excuse si ça fuit des données PCI.

## La Règle d'Or des Permissions

**JAMAIS \`--dangerously-skip-permissions\`. Jamais.** Quoi que ce soit. Quelle que soit l'heure. Quelle que soit votre urgence.

Lisez chaque permission prompt. Comprenez ce que l'agent essaie de faire. Donnez les permissions minimales. Dans le doute : refusez.

> *« One common failure mode is the agent gives a long explanation, asks for permissions a few times, and after a while people start clicking yes, yes, yes without really checking what is being approved. »* — Gertjan Dewaele

## La Checklist Guardrails

À CHAQUE tâche IA, vérifiez :

- [ ] Pas de données PCI / credentials / PII dans mon prompt ?
- [ ] Review humaine de toute sortie IA avant production ?
- [ ] Seulement outils approuvés (LibreChat, Claude Code via Vertex) ?
- [ ] Gestion permissions correcte (pas de mode YOLO) ?
- [ ] Sortie labellée \`ai-assisted\` dans Jira ?

Imprimez cette checklist. Collez-la à côté de votre écran. Après 4 semaines c'est automatique. D'ici là : lisez-la à chaque fois.`;

// ─── LAB 6A — Het Model Duel ─────────────────────────────────────────────────

const LAB_6A_NL = `# Lab 6A — Het Model Duel (30 min)

Je gaat dezelfde taak uitvoeren met meerdere modellen en objectief vergelijken. Geen meningen — data.

## Stap 1: Kies Je Taak (3 min)

Kies één taak uit je dagelijks werk. Iets dat je deze week sowieso moest doen. Voorbeelden:
- Een functie reviewen op bugs
- Een test suite genereren voor een endpoint
- Een technisch document schrijven
- Een user story uitwerken
- Een rapportage samenvatten

Schrijf je prompt in Pentagon-formaat met intent en specs (alles uit Level 2-5). Dezelfde prompt voor elk model.

## Stap 2: Run Met 2-3 Modellen (15 min)

Open LibreChat. Kies model 1 (bijvoorbeeld Claude Sonnet). Run je prompt. Bewaar de output.

Open een nieuw gesprek. Kies model 2 (bijvoorbeeld Gemini Pro). Plak dezelfde prompt. Bewaar de output.

Optioneel: herhaal met model 3.

**Let op:** gebruik EXACT dezelfde prompt. Geen aanpassingen per model. Het punt is vergelijken.

## Stap 3: Evalueer (12 min)

Vul voor elk model in:

\`\`\`
Model: [naam]
Kwaliteit (1-10): [score]
  - Correctheid: [correct/deels/fout]
  - Compleetheid: [alles/meeste/weinig]
  - Relevantie: [past bij Worldline context/generiek]
Iteraties nodig: [0/1/2/3+]
Snelheid: [snel/gemiddeld/langzaam]
Direct inzetbaar: [ja/nee/met aanpassingen]

Conclusie: Model [X] wint voor DEZE taak omdat [reden].
\`\`\`

Wees specifiek. "Claude was beter" is geen conclusie. "Claude gaf een compleet migratieplan met 4 stappen en expliciete rollback procedure, Gemini miste de rollback en gaf een generiek plan" is een conclusie.

**Deliverable:** Je prompt + outputs per model + evaluatie-tabel.`;

const LAB_6A_EN = `# Lab 6A — The Model Duel (30 min)

You will run the same task with multiple models and compare objectively. No opinions — data.

## Step 1: Pick Your Task (3 min)

Pick one task from your daily work. Something you had to do this week anyway. Examples:
- Review a function for bugs
- Generate a test suite for an endpoint
- Write a technical document
- Flesh out a user story
- Summarise a report

Write your prompt in Pentagon format with intent and specs (everything from Levels 2-5). Same prompt for every model.

## Step 2: Run with 2-3 Models (15 min)

Open LibreChat. Pick model 1 (for example Claude Sonnet). Run your prompt. Save the output.

Open a new conversation. Pick model 2 (for example Gemini Pro). Paste the same prompt. Save the output.

Optional: repeat with model 3.

**Important:** use EXACTLY the same prompt. No per-model adjustments. The point is to compare.

## Step 3: Evaluate (12 min)

For each model, fill in:

\`\`\`
Model: [name]
Quality (1-10): [score]
  - Correctness: [correct/partial/wrong]
  - Completeness: [all/most/little]
  - Relevance: [fits Worldline context/generic]
Iterations needed: [0/1/2/3+]
Speed: [fast/medium/slow]
Directly usable: [yes/no/with adjustments]

Conclusion: Model [X] wins for THIS task because [reason].
\`\`\`

Be specific. "Claude was better" is not a conclusion. "Claude gave a complete migration plan with 4 steps and explicit rollback procedure, Gemini missed the rollback and gave a generic plan" is a conclusion.

**Deliverable:** Your prompt + outputs per model + evaluation table.`;

const LAB_6A_FR = `# Lab 6A — Le Duel de Modèles (30 min)

Vous allez exécuter la même tâche avec plusieurs modèles et comparer objectivement. Pas d'opinions — des données.

## Étape 1 : Choisir Votre Tâche (3 min)

Choisissez une tâche de votre travail quotidien. Quelque chose que vous deviez faire cette semaine. Exemples :
- Reviewer une fonction pour bugs
- Générer une test suite pour un endpoint
- Écrire un document technique
- Développer une user story
- Résumer un rapport

Écrivez votre prompt en format Pentagon avec intent et specs (tout du Level 2-5). Même prompt pour chaque modèle.

## Étape 2 : Lancer avec 2-3 Modèles (15 min)

Ouvrez LibreChat. Choisissez modèle 1 (par exemple Claude Sonnet). Lancez votre prompt. Sauvegardez la sortie.

Ouvrez une nouvelle conversation. Choisissez modèle 2 (par exemple Gemini Pro). Collez le même prompt. Sauvegardez la sortie.

Optionnel : répétez avec modèle 3.

**Important :** utilisez EXACTEMENT le même prompt. Pas d'ajustements par modèle. Le but c'est de comparer.

## Étape 3 : Évaluer (12 min)

Pour chaque modèle, remplissez :

\`\`\`
Modèle : [nom]
Qualité (1-10) : [score]
  - Exactitude : [correct/partiel/faux]
  - Complétude : [tout/plupart/peu]
  - Pertinence : [fits Worldline context/générique]
Itérations nécessaires : [0/1/2/3+]
Vitesse : [rapide/moyen/lent]
Utilisable direct : [oui/non/avec ajustements]

Conclusion : Modèle [X] gagne pour CETTE tâche parce que [raison].
\`\`\`

Soyez spécifique. « Claude était mieux » n'est pas une conclusion. « Claude a donné un plan de migration complet avec 4 étapes et procédure rollback explicite, Gemini a raté le rollback et donné un plan générique » est une conclusion.

**Deliverable :** Votre prompt + sorties par modèle + tableau d'évaluation.`;

// ─── LAB 6B — Team Decision Guide ────────────────────────────────────────────

const LAB_6B_NL = `# Lab 6B — Bouw Je Team Decision Guide (45 min)

Je gaat een model decision guide schrijven voor je squad. Een document dat iedereen in je team kan gebruiken om het juiste model te kiezen voor de juiste taak.

## Stap 1: Inventariseer Je Taken (10 min)

Lijst de 10 meest voorkomende AI-taken in je squad:
- Code review
- Test generatie
- Bug analysis
- Documentatie
- Boilerplate code
- Refactoring
- Deployment scripts
- Rapportage
- User story uitwerking
- Etc.

Categoriseer ze: Simple / Medium / Complex.

## Stap 2: Map Model naar Taak (15 min)

Vul de matrix in:

| Taak | Complexiteit | Aanbevolen Model | Waarom | Geschatte Kosten |
|------|-------------|------------------|--------|-----------------|
| Code review (simpel) | Simple | Haiku/Flash | Snel genoeg, 50x goedkoper | ~$0.001 |
| Architectuurbeslissing | Complex | Opus | Nuance en diepte nodig | ~$0.10 |
| Unit tests | Medium | Sonnet | Goede balans | ~$0.02 |

Baseer dit op je ervaring uit Lab 6A en de afgelopen weken.

## Stap 3: Guardrails Toevoegen (10 min)

Voeg aan je guide toe:
- De guardrails checklist (Les 6.5)
- Model-specifieke waarschuwingen (bijv: "Gemini kan bij code-taken code genereren die niet bij onze stack past")
- Escalatie: wanneer switch je van Tier 3 naar Tier 1?

## Stap 4: Deel Met Je Squad (10 min)

Formatteer je guide als een leesbaar document:
- Titel: "[Squad Naam] — AI Model Decision Guide"
- Tabel met taak → model mapping
- Guardrails sectie
- Kostenindicatie per tier
- Tips voor token-efficiëntie

**Deliverable:** Een model decision guide die je squad direct kan gebruiken.`;

const LAB_6B_EN = `# Lab 6B — Build Your Team Decision Guide (45 min)

You will write a model decision guide for your squad. A document that everyone in your team can use to pick the right model for the right task.

## Step 1: Inventory Your Tasks (10 min)

List the 10 most common AI tasks in your squad:
- Code review
- Test generation
- Bug analysis
- Documentation
- Boilerplate code
- Refactoring
- Deployment scripts
- Reporting
- User story flesh-out
- Etc.

Categorise them: Simple / Medium / Complex.

## Step 2: Map Model to Task (15 min)

Fill in the matrix:

| Task | Complexity | Recommended Model | Why | Estimated Cost |
|------|-----------|-------------------|-----|----------------|
| Code review (simple) | Simple | Haiku/Flash | Fast enough, 50x cheaper | ~$0.001 |
| Architecture decision | Complex | Opus | Needs nuance and depth | ~$0.10 |
| Unit tests | Medium | Sonnet | Good balance | ~$0.02 |

Base this on your experience from Lab 6A and the past weeks.

## Step 3: Add Guardrails (10 min)

Add to your guide:
- The guardrails checklist (Lesson 6.5)
- Model-specific warnings (e.g. "Gemini may generate code on code tasks that doesn't match our stack")
- Escalation: when do you switch from Tier 3 to Tier 1?

## Step 4: Share With Your Squad (10 min)

Format your guide as a readable document:
- Title: "[Squad Name] — AI Model Decision Guide"
- Table with task → model mapping
- Guardrails section
- Cost indication per tier
- Tips for token efficiency

**Deliverable:** A model decision guide your squad can use immediately.`;

const LAB_6B_FR = `# Lab 6B — Construire Votre Team Decision Guide (45 min)

Vous allez écrire un model decision guide pour votre squad. Un document que tous dans votre équipe peuvent utiliser pour choisir le bon modèle pour la bonne tâche.

## Étape 1 : Inventoriez Vos Tâches (10 min)

Listez les 10 tâches IA les plus courantes dans votre squad :
- Code review
- Génération tests
- Analyse bugs
- Documentation
- Code boilerplate
- Refactoring
- Scripts déploiement
- Reporting
- Développement user story
- Etc.

Catégorisez : Simple / Medium / Complex.

## Étape 2 : Mapper Modèle à Tâche (15 min)

Remplissez la matrice :

| Tâche | Complexité | Modèle Recommandé | Pourquoi | Coût Estimé |
|-------|-----------|-------------------|----------|-------------|
| Code review (simple) | Simple | Haiku/Flash | Assez rapide, 50x moins cher | ~$0.001 |
| Décision architecture | Complex | Opus | Besoin nuance et profondeur | ~$0.10 |
| Unit tests | Medium | Sonnet | Bon équilibre | ~$0.02 |

Basez ça sur votre expérience du Lab 6A et des dernières semaines.

## Étape 3 : Ajouter les Guardrails (10 min)

Ajoutez à votre guide :
- La checklist guardrails (Leçon 6.5)
- Avertissements spécifiques au modèle (ex : « Gemini peut générer sur tâches code du code qui ne fit pas notre stack »)
- Escalade : quand passez-vous de Tier 3 à Tier 1 ?

## Étape 4 : Partagez Avec Votre Squad (10 min)

Formatez votre guide comme document lisible :
- Titre : « [Nom Squad] — AI Model Decision Guide »
- Tableau avec mapping tâche → modèle
- Section guardrails
- Indication coûts par tier
- Tips pour efficacité tokens

**Deliverable :** Un model decision guide que votre squad peut utiliser directement.`;

// ═════════════════════════════════════════════════════════════════════════════
// ── WEEK 5 EXPORT ───────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

export const WEEK_5: CurriculumWeek = {
  id: 'week-5',
  number: 5,
  title: 'Level 6 — Model Landscape',
  titleI18n: {
    en: 'Level 6 — Model Landscape',
    nl: 'Level 6 — Model Landscape',
    fr: 'Level 6 — Model Landscape',
  },
  subtitle: 'Choosing the Right Brain for the Job · model-tier framework + guardrails',
  subtitleI18n: {
    en: 'Choosing the Right Brain for the Job · model tier framework + guardrails',
    nl: 'Choosing the Right Brain for the Job · model-tier framework + guardrails',
    fr: 'Choosing the Right Brain for the Job · framework model-tier + guardrails',
  },
  description:
    'Na dit level weet je welk AI-model je wanneer inzet, waarom dat uitmaakt, en hoe je modellen objectief vergelijkt op echte taken. Je hebt een team decision guide geschreven die je squad direct kan gebruiken, en je begrijpt token-efficiëntie, kosten, en de Worldline guardrails die bepalen wat wel en niet mag.',
  descriptionI18n: {
    en: 'After this level you know which AI model to use when, why it matters, and how to compare models objectively on real tasks. You have written a team decision guide your squad can use immediately, and you understand token efficiency, costs, and the Worldline guardrails that decide what is allowed and what is not.',
    nl: 'Na dit level weet je welk AI-model je wanneer inzet, waarom dat uitmaakt, en hoe je modellen objectief vergelijkt op echte taken. Je hebt een team decision guide geschreven die je squad direct kan gebruiken, en je begrijpt token-efficiëntie, kosten, en de Worldline guardrails die bepalen wat wel en niet mag.',
    fr: 'Après ce niveau vous savez quel modèle IA utiliser quand, pourquoi ça compte, et comment comparer les modèles objectivement sur des tâches réelles. Vous avez écrit un team decision guide utilisable directement, et vous comprenez l\'efficacité des tokens, les coûts, et les Worldline guardrails qui déterminent ce qui est autorisé et ce qui ne l\'est pas.',
  },
  objectives: [
    'Kies het juiste model voor de juiste taak via het Tier 1/2/3 framework (Frontier/Balanced/Speed)',
    'Benoem sterktes en zwaktes van Claude, Gemini, en GPT voor enterprise use cases',
    'Gebruik LibreChat effectief als model-switchboard (incl. memories als persoonlijke CLAUDE.md)',
    'Schat token-kosten in en pas 5 token-besparingstechnieken toe (right-size, scalpel, @-mentions, splits, caching)',
    'Pas de Worldline AI guardrails consistent toe (PCI/credentials/PII taboes, review pattern, permission hygiene)',
  ],
  objectivesI18n: {
    en: [
      'Pick the right model for the right task via the Tier 1/2/3 framework (Frontier/Balanced/Speed)',
      'Name strengths and weaknesses of Claude, Gemini, and GPT for enterprise use cases',
      'Use LibreChat effectively as a model switchboard (incl. memories as personal CLAUDE.md)',
      'Estimate token costs and apply 5 saving techniques (right-size, scalpel, @-mentions, splitting, caching)',
      'Apply Worldline AI guardrails consistently (PCI/credentials/PII taboos, review pattern, permission hygiene)',
    ],
    nl: [
      'Kies het juiste model voor de juiste taak via het Tier 1/2/3 framework (Frontier/Balanced/Speed)',
      'Benoem sterktes en zwaktes van Claude, Gemini, en GPT voor enterprise use cases',
      'Gebruik LibreChat effectief als model-switchboard (incl. memories als persoonlijke CLAUDE.md)',
      'Schat token-kosten in en pas 5 token-besparingstechnieken toe (right-size, scalpel, @-mentions, splits, caching)',
      'Pas de Worldline AI guardrails consistent toe (PCI/credentials/PII taboes, review pattern, permission hygiene)',
    ],
    fr: [
      'Choisir le bon modèle pour la bonne tâche via le framework Tier 1/2/3',
      'Nommer forces et faiblesses de Claude, Gemini, et GPT pour use cases enterprise',
      'Utiliser LibreChat efficacement comme model switchboard (memories comme CLAUDE.md personnel)',
      'Estimer les coûts tokens et appliquer 5 techniques d\'économie',
      'Appliquer les Worldline AI guardrails de manière consistante (PCI/credentials/PII tabous, review pattern, permission hygiene)',
    ],
  },
  targetAudience: 'Alle Worldline engineers — alle squads',
  targetAudienceI18n: {
    en: 'All Worldline engineers — all squads',
    nl: 'Alle Worldline engineers — alle squads',
    fr: 'Tous les ingénieurs Worldline — toutes les squads',
  },
  bloomLevels: [2, 3, 4],
  complianceRelevant: true,
  badgeName: 'Model Strategist',
  badgeNameI18n: {
    en: 'Model Strategist',
    nl: 'Model Strategist',
    fr: 'Model Strategist',
  },
  badgeIcon: '🧠',
  weeklyQuiz: [
    {
      id: 'w5-q1',
      question: 'Wat zijn de drie tiers van het Model-Selectie Framework?',
      questionI18n: {
        en: 'What are the three tiers of the Model Selection Framework?',
        nl: 'Wat zijn de drie tiers van het Model-Selectie Framework?',
        fr: 'Quels sont les trois tiers du Model Selection Framework ?',
      },
      options: [
        'Free / Plus / Pro',
        'Frontier (Opus/GPT-4o) / Balanced (Sonnet/Gemini Pro) / Speed (Haiku/Flash)',
        'Chat / Code / Multimodal',
        'Dev / Staging / Prod',
      ],
      optionsI18n: {
        en: [
          'Free / Plus / Pro',
          'Frontier (Opus/GPT-4o) / Balanced (Sonnet/Gemini Pro) / Speed (Haiku/Flash)',
          'Chat / Code / Multimodal',
          'Dev / Staging / Prod',
        ],
        nl: [
          'Free / Plus / Pro',
          'Frontier (Opus/GPT-4o) / Balanced (Sonnet/Gemini Pro) / Speed (Haiku/Flash)',
          'Chat / Code / Multimodal',
          'Dev / Staging / Prod',
        ],
        fr: [
          'Free / Plus / Pro',
          'Frontier (Opus/GPT-4o) / Balanced (Sonnet/Gemini Pro) / Speed (Haiku/Flash)',
          'Chat / Code / Multimodal',
          'Dev / Staging / Prod',
        ],
      },
      correctIndex: 1,
      explanation: 'Tier 1 Frontier voor zware taken (architectuur, complexe debugging). Tier 2 Balanced voor dagelijks werk (code review, tests). Tier 3 Speed voor triviale taken (formatting, boilerplate).',
      explanationI18n: {
        en: 'Tier 1 Frontier for heavy tasks (architecture, complex debug). Tier 2 Balanced for daily work (code review, tests). Tier 3 Speed for trivial tasks (formatting, boilerplate).',
        nl: 'Tier 1 Frontier voor zware taken (architectuur, complexe debugging). Tier 2 Balanced voor dagelijks werk (code review, tests). Tier 3 Speed voor triviale taken (formatting, boilerplate).',
        fr: 'Tier 1 Frontier pour tâches lourdes. Tier 2 Balanced pour travail quotidien. Tier 3 Speed pour tâches triviales.',
      },
      bloomLevel: 1,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w5-q2',
      question: 'Wat is de kostenverhouding tussen Claude Opus en Gemini Flash voor dezelfde taak?',
      questionI18n: {
        en: 'What is the cost ratio between Claude Opus and Gemini Flash for the same task?',
        nl: 'Wat is de kostenverhouding tussen Claude Opus en Gemini Flash voor dezelfde taak?',
        fr: 'Quel est le rapport de coût entre Claude Opus et Gemini Flash pour la même tâche ?',
      },
      options: [
        'Ongeveer gelijk',
        '~10x duurder op Opus',
        '~200x duurder op Opus',
        '~1000x duurder op Opus',
      ],
      optionsI18n: {
        en: [
          'Roughly equal',
          '~10x more expensive on Opus',
          '~200x more expensive on Opus',
          '~1000x more expensive on Opus',
        ],
        nl: [
          'Ongeveer gelijk',
          '~10x duurder op Opus',
          '~200x duurder op Opus',
          '~1000x duurder op Opus',
        ],
        fr: [
          'Environ égal',
          '~10x plus cher sur Opus',
          '~200x plus cher sur Opus',
          '~1000x plus cher sur Opus',
        ],
      },
      correctIndex: 2,
      explanation: 'Claude Opus ~$15/1M input + $75/1M output, Gemini Flash ~$0.075/1M input + $0.30/1M output. Voor triviale taken is Flash 200x goedkoper — right-sizing bespaart veel.',
      explanationI18n: {
        en: 'Claude Opus ~$15/1M input + $75/1M output, Gemini Flash ~$0.075/1M input + $0.30/1M output. For trivial tasks Flash is 200x cheaper — right-sizing saves a lot.',
        nl: 'Claude Opus ~$15/1M input + $75/1M output, Gemini Flash ~$0.075/1M input + $0.30/1M output. Voor triviale taken is Flash 200x goedkoper — right-sizing bespaart veel.',
        fr: 'Claude Opus ~$15/1M input + $75/1M output, Gemini Flash ~$0.075/1M input + $0.30/1M output. Pour tâches triviales Flash est 200x moins cher.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w5-q3',
      question: 'Wat mag je NOOIT naar een AI-model sturen volgens de Worldline Guardrails?',
      questionI18n: {
        en: 'What must you NEVER send to an AI model per the Worldline Guardrails?',
        nl: 'Wat mag je NOOIT naar een AI-model sturen volgens de Worldline Guardrails?',
        fr: 'Que ne devez-vous JAMAIS envoyer à un modèle IA selon les Worldline Guardrails ?',
      },
      options: [
        'Code snippets',
        'Documentatie',
        'PCI data (kaartnummers, CVV), credentials, klant PII, productiedata',
        'Unit tests',
      ],
      optionsI18n: {
        en: [
          'Code snippets',
          'Documentation',
          'PCI data (card numbers, CVV), credentials, customer PII, production data',
          'Unit tests',
        ],
        nl: [
          'Code snippets',
          'Documentatie',
          'PCI data (kaartnummers, CVV), credentials, klant PII, productiedata',
          'Unit tests',
        ],
        fr: [
          'Snippets de code',
          'Documentation',
          'Données PCI (numéros carte, CVV), credentials, PII client, données production',
          'Unit tests',
        ],
      },
      correctIndex: 2,
      explanation: 'Geldt voor ALLE modellen, ALLE tools, ALLE situaties — geen uitzonderingen. Overtreding kan je baan kosten. Pattern: System → sanitized API/MCP → AI.',
      explanationI18n: {
        en: 'Applies to ALL models, ALL tools, ALL situations — no exceptions. Violation can cost your job. Pattern: System → sanitised API/MCP → AI.',
        nl: 'Geldt voor ALLE modellen, ALLE tools, ALLE situaties — geen uitzonderingen. Overtreding kan je baan kosten. Pattern: System → sanitized API/MCP → AI.',
        fr: 'S\'applique à TOUS les modèles, TOUS les outils, TOUTES les situations — aucune exception. Violation peut coûter votre job.',
      },
      bloomLevel: 1,
      euAiActRelevant: true,
      points: 10,
    },
    {
      id: 'w5-q4',
      question: 'Welke 5 token-besparingstechnieken noemt Les 6.4?',
      questionI18n: {
        en: 'Which 5 token saving techniques does Lesson 6.4 name?',
        nl: 'Welke 5 token-besparingstechnieken noemt Les 6.4?',
        fr: 'Quelles 5 techniques d\'économie de tokens la Leçon 6.4 nomme-t-elle ?',
      },
      options: [
        'Copy-paste / Full context / Long conversations / No caching / Max verbosity',
        'Right-size model / Scalpel context / @-mentions / Split lange taken / Caching',
        'Alleen GPT / Alleen Claude / Alleen Gemini / Mix / None',
        'Monitoring / Logging / Alerting / Dashboards / Reports',
      ],
      optionsI18n: {
        en: [
          'Copy-paste / Full context / Long conversations / No caching / Max verbosity',
          'Right-size model / Scalpel context / @-mentions / Split long tasks / Caching',
          'Only GPT / Only Claude / Only Gemini / Mix / None',
          'Monitoring / Logging / Alerting / Dashboards / Reports',
        ],
        nl: [
          'Copy-paste / Full context / Long conversations / No caching / Max verbosity',
          'Right-size model / Scalpel context / @-mentions / Split lange taken / Caching',
          'Alleen GPT / Alleen Claude / Alleen Gemini / Mix / None',
          'Monitoring / Logging / Alerting / Dashboards / Reports',
        ],
        fr: [
          'Copy-paste / Full context / Long conversations / No caching / Max verbosity',
          'Right-size modèle / Scalpel context / @-mentions / Diviser tâches longues / Caching',
          'Seulement GPT / Seulement Claude / Seulement Gemini / Mix / None',
          'Monitoring / Logging / Alerting / Dashboards / Reports',
        ],
      },
      correctIndex: 1,
      explanation: '1) Right-size (geen Opus voor JSON format) 2) Scalpel context (Level 3 regel) 3) @-mentions ipv copy-paste 4) Splits lange taken (context rot) 5) Caching waar beschikbaar.',
      explanationI18n: {
        en: '1) Right-size (no Opus for JSON format) 2) Scalpel context (Level 3 rule) 3) @-mentions instead of copy-paste 4) Split long tasks (context rot) 5) Caching where available.',
        nl: '1) Right-size (geen Opus voor JSON format) 2) Scalpel context (Level 3 regel) 3) @-mentions ipv copy-paste 4) Splits lange taken (context rot) 5) Caching waar beschikbaar.',
        fr: '1) Right-size 2) Scalpel context 3) @-mentions au lieu de copy-paste 4) Diviser tâches longues 5) Caching où disponible.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w5-q5',
      question: 'Wat is het verplichte review pattern voor AI-gegenereerde wijzigingen bij Worldline?',
      questionI18n: {
        en: 'What is the mandatory review pattern for AI-generated changes at Worldline?',
        nl: 'Wat is het verplichte review pattern voor AI-gegenereerde wijzigingen bij Worldline?',
        fr: 'Quel est le pattern de review obligatoire pour les changements IA chez Worldline ?',
      },
      options: [
        'AI genereert → direct naar productie',
        'AI genereert → Jij reviewt → Jij commit → Peer reviewt → Automation deployt → Mens keurt goed',
        'AI genereert → AI reviewt → AI deployt',
        'Alleen bij kritieke changes reviewen',
      ],
      optionsI18n: {
        en: [
          'AI generates → straight to production',
          'AI generates → You review → You commit → Peer reviews → Automation deploys → Human approves',
          'AI generates → AI reviews → AI deploys',
          'Only review on critical changes',
        ],
        nl: [
          'AI genereert → direct naar productie',
          'AI genereert → Jij reviewt → Jij commit → Peer reviewt → Automation deployt → Mens keurt goed',
          'AI genereert → AI reviewt → AI deployt',
          'Alleen bij kritieke changes reviewen',
        ],
        fr: [
          'IA génère → directement en production',
          'IA génère → Vous reviewez → Vous committez → Pair reviewe → Automation déploie → Humain approuve',
          'IA génère → IA reviewe → IA déploie',
          'Review seulement sur changements critiques',
        ],
      },
      correctIndex: 1,
      explanation: 'Zes stappen, geen enkele overslaan. AI is je assistent, niet je vervanger. JIJ bent verantwoordelijk voor de code die je commit. Jira label: `ai-assisted`.',
      explanationI18n: {
        en: 'Six steps, skip none. AI is your assistant, not your replacement. YOU are responsible for the code you commit. Jira label: `ai-assisted`.',
        nl: 'Zes stappen, geen enkele overslaan. AI is je assistent, niet je vervanger. JIJ bent verantwoordelijk voor de code die je commit. Jira label: `ai-assisted`.',
        fr: 'Six étapes, n\'en sautez aucune. L\'IA est votre assistant, pas votre remplaçant. VOUS êtes responsable du code committé.',
      },
      bloomLevel: 2,
      euAiActRelevant: true,
      points: 10,
    },
  ],
  days: [
    // ───── DAG 1: Les 6.1 + Lab 6A ─────
    {
      day: 1,
      title: 'Les 6.1 — Waarom Het Model Uitmaakt',
      titleI18n: {
        en: 'Lesson 6.1 — Why the Model Matters',
        nl: 'Les 6.1 — Waarom Het Model Uitmaakt',
        fr: 'Leçon 6.1 — Pourquoi le Modèle Compte',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w5d1-theory',
          title: 'Les 6.1 — Waarom Het Model Uitmaakt',
          titleI18n: {
            en: 'Lesson 6.1 — Why the Model Matters',
            nl: 'Les 6.1 — Waarom Het Model Uitmaakt',
            fr: 'Leçon 6.1 — Pourquoi le Modèle Compte',
          },
          type: 'theory',
          duration: 20,
          description: 'Model selectie framework (complexiteit/kwaliteit/budget) · Tier 1/2/3 · Ferrari-voor-boodschappen anti-pattern',
          descriptionI18n: {
            en: 'Model selection framework (complexity/quality/budget) · Tier 1/2/3 · Ferrari-for-groceries anti-pattern',
            nl: 'Model selectie framework (complexiteit/kwaliteit/budget) · Tier 1/2/3 · Ferrari-voor-boodschappen anti-pattern',
            fr: 'Framework sélection modèle · Tier 1/2/3 · anti-pattern Ferrari-pour-courses',
          },
          content: LESSON_6_1_NL,
          contentI18n: { en: LESSON_6_1_EN, nl: LESSON_6_1_NL, fr: LESSON_6_1_FR },
        },
        {
          id: 'w5d1-lab',
          title: 'Lab 6A — Het Model Duel',
          titleI18n: {
            en: 'Lab 6A — The Model Duel',
            nl: 'Lab 6A — Het Model Duel',
            fr: 'Lab 6A — Le Duel de Modèles',
          },
          type: 'lab',
          duration: 30,
          description: 'Dezelfde Pentagon+intent+spec prompt op 2-3 modellen · objectieve evaluatie op kwaliteit/iteraties/snelheid/inzetbaarheid',
          descriptionI18n: {
            en: 'Same Pentagon+intent+spec prompt on 2-3 models · objective evaluation on quality/iterations/speed/usability',
            nl: 'Dezelfde Pentagon+intent+spec prompt op 2-3 modellen · objectieve evaluatie op kwaliteit/iteraties/snelheid/inzetbaarheid',
            fr: 'Même prompt Pentagon+intent+spec sur 2-3 modèles · évaluation objective',
          },
          content: LAB_6A_NL,
          contentI18n: { en: LAB_6A_EN, nl: LAB_6A_NL, fr: LAB_6A_FR },
          exercises: [
            {
              id: 'w5d1-ex1',
              title: 'Model duel + evaluatie-tabel',
              titleI18n: {
                en: 'Model duel + evaluation table',
                nl: 'Model duel + evaluatie-tabel',
                fr: 'Duel de modèles + tableau d\'évaluation',
              },
              instructions: 'Eén taak, dezelfde prompt, 2-3 modellen. Evalueer op kwaliteit, iteraties, snelheid, direct-inzetbaarheid. Conclusie: welk model wint voor deze taak en waarom.',
              instructionsI18n: {
                en: 'One task, same prompt, 2-3 models. Evaluate on quality, iterations, speed, direct usability. Conclusion: which model wins for this task and why.',
                nl: 'Eén taak, dezelfde prompt, 2-3 modellen. Evalueer op kwaliteit, iteraties, snelheid, direct-inzetbaarheid. Conclusie: welk model wint voor deze taak en waarom.',
                fr: 'Une tâche, même prompt, 2-3 modèles. Évaluez qualité, itérations, vitesse, usabilité directe. Conclusion.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 2: Les 6.2 + comparison-matrix lab ─────
    {
      day: 2,
      title: 'Les 6.2 — De Grote Drie: Claude, Gemini, GPT',
      titleI18n: {
        en: 'Lesson 6.2 — The Big Three: Claude, Gemini, GPT',
        nl: 'Les 6.2 — De Grote Drie: Claude, Gemini, GPT',
        fr: 'Leçon 6.2 — Les Trois Grands : Claude, Gemini, GPT',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w5d2-theory',
          title: 'Les 6.2 — De Grote Drie: Claude, Gemini, GPT',
          titleI18n: {
            en: 'Lesson 6.2 — The Big Three: Claude, Gemini, GPT',
            nl: 'Les 6.2 — De Grote Drie: Claude, Gemini, GPT',
            fr: 'Leçon 6.2 — Les Trois Grands',
          },
          type: 'theory',
          duration: 20,
          description: 'Per-provider sterktes/zwaktes bij Worldline-achtige use cases · wanneer Claude/Gemini/GPT kiezen · convergentie-insight',
          descriptionI18n: {
            en: 'Per-provider strengths/weaknesses on Worldline-style use cases · when to pick Claude/Gemini/GPT · convergence insight',
            nl: 'Per-provider sterktes/zwaktes bij Worldline-achtige use cases · wanneer Claude/Gemini/GPT kiezen · convergentie-insight',
            fr: 'Forces/faiblesses par provider sur use cases type Worldline · convergence',
          },
          content: LESSON_6_2_NL,
          contentI18n: { en: LESSON_6_2_EN, nl: LESSON_6_2_NL, fr: LESSON_6_2_FR },
        },
        {
          id: 'w5d2-lab',
          title: 'Lab — Provider Comparison Matrix',
          titleI18n: {
            en: 'Lab — Provider Comparison Matrix',
            nl: 'Lab — Provider Comparison Matrix',
            fr: 'Lab — Matrice de Comparaison Providers',
          },
          type: 'lab',
          duration: 30,
          description: 'Bouw een matrix voor jouw squad-use-cases: welk model voor welk scenario. Koppel terug aan tier-framework.',
          descriptionI18n: {
            en: 'Build a matrix for your squad use cases: which model for which scenario. Link back to tier framework.',
            nl: 'Bouw een matrix voor jouw squad-use-cases: welk model voor welk scenario. Koppel terug aan tier-framework.',
            fr: 'Construisez une matrice pour les use cases de votre squad.',
          },
          content: LAB_6A_NL,
          contentI18n: { en: LAB_6A_EN, nl: LAB_6A_NL, fr: LAB_6A_FR },
          exercises: [
            {
              id: 'w5d2-ex1',
              title: 'Provider matrix eigen squad',
              titleI18n: {
                en: 'Provider matrix for your squad',
                nl: 'Provider matrix eigen squad',
                fr: 'Matrice provider pour votre squad',
              },
              instructions: 'Lijst 5 squad-use-cases. Per use-case: welk provider past het best (Claude/Gemini/GPT) + welke tier? Onderbouw met sterktes/zwaktes uit Les 6.2.',
              instructionsI18n: {
                en: 'List 5 squad use cases. Per use case: which provider fits best (Claude/Gemini/GPT) + which tier? Justify with strengths/weaknesses from Lesson 6.2.',
                nl: 'Lijst 5 squad-use-cases. Per use-case: welk provider past het best (Claude/Gemini/GPT) + welke tier? Onderbouw met sterktes/zwaktes uit Les 6.2.',
                fr: 'Listez 5 use cases squad. Par use case : quel provider fit le mieux + quel tier ?',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 3: Les 6.3 + Lab 6B Decision Guide ─────
    {
      day: 3,
      title: 'Les 6.3 — LibreChat: Je Model-Switchboard',
      titleI18n: {
        en: 'Lesson 6.3 — LibreChat: Your Model Switchboard',
        nl: 'Les 6.3 — LibreChat: Je Model-Switchboard',
        fr: 'Leçon 6.3 — LibreChat : Votre Model-Switchboard',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w5d3-theory',
          title: 'Les 6.3 — LibreChat: Je Model-Switchboard',
          titleI18n: {
            en: 'Lesson 6.3 — LibreChat: Your Model Switchboard',
            nl: 'Les 6.3 — LibreChat: Je Model-Switchboard',
            fr: 'Leçon 6.3 — LibreChat : Votre Model-Switchboard',
          },
          type: 'theory',
          duration: 15,
          description: 'LibreChat als self-hosted multi-provider interface · memories als persoonlijke CLAUDE.md · Claude Code vs LibreChat vuistregel',
          descriptionI18n: {
            en: 'LibreChat as self-hosted multi-provider interface · memories as personal CLAUDE.md · Claude Code vs LibreChat rule',
            nl: 'LibreChat als self-hosted multi-provider interface · memories als persoonlijke CLAUDE.md · Claude Code vs LibreChat vuistregel',
            fr: 'LibreChat comme interface multi-provider self-hosted · memories comme CLAUDE.md personnel',
          },
          content: LESSON_6_3_NL,
          contentI18n: { en: LESSON_6_3_EN, nl: LESSON_6_3_NL, fr: LESSON_6_3_FR },
        },
        {
          id: 'w5d3-lab',
          title: 'Lab 6B — Bouw Je Team Decision Guide',
          titleI18n: {
            en: 'Lab 6B — Build Your Team Decision Guide',
            nl: 'Lab 6B — Bouw Je Team Decision Guide',
            fr: 'Lab 6B — Construisez Votre Team Decision Guide',
          },
          type: 'lab',
          duration: 45,
          description: '10 squad-taken → taak/complexiteit/model/waarom/kosten matrix. Guardrails toevoegen. Direct bruikbaar document voor je team.',
          descriptionI18n: {
            en: '10 squad tasks → task/complexity/model/why/cost matrix. Add guardrails. Document usable immediately by your team.',
            nl: '10 squad-taken → taak/complexiteit/model/waarom/kosten matrix. Guardrails toevoegen. Direct bruikbaar document voor je team.',
            fr: '10 tâches squad → matrice tâche/complexité/modèle/pourquoi/coût. Guardrails.',
          },
          content: LAB_6B_NL,
          contentI18n: { en: LAB_6B_EN, nl: LAB_6B_NL, fr: LAB_6B_FR },
          exercises: [
            {
              id: 'w5d3-ex1',
              title: 'Team Decision Guide 10-taak matrix',
              titleI18n: {
                en: 'Team Decision Guide 10-task matrix',
                nl: 'Team Decision Guide 10-taak matrix',
                fr: 'Team Decision Guide matrice 10 tâches',
              },
              instructions: 'Lijst 10 squad-taken, categoriseer Simple/Medium/Complex, map op tier + model + waarom + kostenschatting. Voeg guardrails checklist toe. Deliverable: leesbaar document voor je team.',
              instructionsI18n: {
                en: 'List 10 squad tasks, categorise Simple/Medium/Complex, map to tier + model + why + cost estimate. Add guardrails checklist. Deliverable: readable document for your team.',
                nl: 'Lijst 10 squad-taken, categoriseer Simple/Medium/Complex, map op tier + model + waarom + kostenschatting. Voeg guardrails checklist toe. Deliverable: leesbaar document voor je team.',
                fr: 'Listez 10 tâches squad, catégorisez, mappez au tier + modèle + pourquoi + coût. Checklist guardrails.',
              },
              type: 'free-form',
              difficulty: 3,
              points: 25,
            },
          ],
        },
      ],
    },
    // ───── DAG 4: Les 6.4 + kostenanalyse-lab ─────
    {
      day: 4,
      title: 'Les 6.4 — Token-Efficiëntie en Kostenbewustzijn',
      titleI18n: {
        en: 'Lesson 6.4 — Token Efficiency and Cost Awareness',
        nl: 'Les 6.4 — Token-Efficiëntie en Kostenbewustzijn',
        fr: 'Leçon 6.4 — Efficacité des Tokens et Conscience des Coûts',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w5d4-theory',
          title: 'Les 6.4 — Token-Efficiëntie en Kostenbewustzijn',
          titleI18n: {
            en: 'Lesson 6.4 — Token Efficiency and Cost Awareness',
            nl: 'Les 6.4 — Token-Efficiëntie en Kostenbewustzijn',
            fr: 'Leçon 6.4 — Efficacité des Tokens et Conscience des Coûts',
          },
          type: 'theory',
          duration: 15,
          description: 'Kosten per 1M tokens per tier · 200x verschil Opus vs Flash · 5 besparingstechnieken · Gertjans metrics',
          descriptionI18n: {
            en: 'Cost per 1M tokens per tier · 200x difference Opus vs Flash · 5 saving techniques · Gertjan\'s metrics',
            nl: 'Kosten per 1M tokens per tier · 200x verschil Opus vs Flash · 5 besparingstechnieken · Gertjans metrics',
            fr: 'Coût par 1M tokens par tier · 200x différence · 5 techniques économie',
          },
          content: LESSON_6_4_NL,
          contentI18n: { en: LESSON_6_4_EN, nl: LESSON_6_4_NL, fr: LESSON_6_4_FR },
        },
        {
          id: 'w5d4-lab',
          title: 'Lab — Kostenanalyse Eigen Sprint',
          titleI18n: {
            en: 'Lab — Cost Analysis Your Own Sprint',
            nl: 'Lab — Kostenanalyse Eigen Sprint',
            fr: 'Lab — Analyse des Coûts de Votre Sprint',
          },
          type: 'lab',
          duration: 30,
          description: 'Schat kosten van je huidige sprint bij 3 scenarios: all-Opus / all-Sonnet / mixed-tier routing. Vergelijk besparingen.',
          descriptionI18n: {
            en: 'Estimate costs of your current sprint under 3 scenarios: all-Opus / all-Sonnet / mixed-tier routing. Compare savings.',
            nl: 'Schat kosten van je huidige sprint bij 3 scenarios: all-Opus / all-Sonnet / mixed-tier routing. Vergelijk besparingen.',
            fr: 'Estimez coûts de votre sprint actuel sous 3 scénarios.',
          },
          content: LAB_6B_NL,
          contentI18n: { en: LAB_6B_EN, nl: LAB_6B_NL, fr: LAB_6B_FR },
          exercises: [
            {
              id: 'w5d4-ex1',
              title: '3-scenario kostenvergelijking',
              titleI18n: {
                en: '3-scenario cost comparison',
                nl: '3-scenario kostenvergelijking',
                fr: 'Comparaison coûts 3 scénarios',
              },
              instructions: 'Neem je laatste sprint-log. Schat tokens per taak. Bereken kosten bij all-Opus, all-Sonnet, mixed-tier routing. Rapporteer besparing in %.',
              instructionsI18n: {
                en: 'Take your last sprint log. Estimate tokens per task. Compute costs under all-Opus, all-Sonnet, mixed-tier routing. Report savings in %.',
                nl: 'Neem je laatste sprint-log. Schat tokens per taak. Bereken kosten bij all-Opus, all-Sonnet, mixed-tier routing. Rapporteer besparing in %.',
                fr: 'Prenez votre dernier sprint log. Estimez tokens par tâche. Calculez coûts sous 3 scénarios. Rapportez économie en %.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 5: Les 6.5 + Rol-opdracht Model Duel Challenge ─────
    {
      day: 5,
      title: 'Les 6.5 — Worldline Guardrails: Wat Mag en Wat Niet',
      titleI18n: {
        en: 'Lesson 6.5 — Worldline Guardrails: What\'s Allowed and What\'s Not',
        nl: 'Les 6.5 — Worldline Guardrails: Wat Mag en Wat Niet',
        fr: 'Leçon 6.5 — Worldline Guardrails : Ce Qui Est Autorisé et Ce Qui Ne L\'est Pas',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w5d5-theory',
          title: 'Les 6.5 — Worldline Guardrails',
          titleI18n: {
            en: 'Lesson 6.5 — Worldline Guardrails',
            nl: 'Les 6.5 — Worldline Guardrails',
            fr: 'Leçon 6.5 — Worldline Guardrails',
          },
          type: 'theory',
          duration: 20,
          description: 'Vertex AI + Enterprise Agreement basis · wat wel/niet mag · review pattern 6-stappen · permission hygiene · 5-punt checklist',
          descriptionI18n: {
            en: 'Vertex AI + Enterprise Agreement foundation · what is / is not allowed · 6-step review pattern · permission hygiene · 5-point checklist',
            nl: 'Vertex AI + Enterprise Agreement basis · wat wel/niet mag · review pattern 6-stappen · permission hygiene · 5-punt checklist',
            fr: 'Vertex AI + Enterprise Agreement · autorisé/interdit · review pattern 6 étapes · permission hygiene',
          },
          content: LESSON_6_5_NL,
          contentI18n: { en: LESSON_6_5_EN, nl: LESSON_6_5_NL, fr: LESSON_6_5_FR },
        },
        {
          id: 'w5d5-lab',
          title: 'Rol-opdracht — Het Model Duel Challenge',
          titleI18n: {
            en: 'Role Assignment — The Model Duel Challenge',
            nl: 'Rol-opdracht — Het Model Duel Challenge',
            fr: 'Mission de rôle — Le Model Duel Challenge',
          },
          type: 'lab',
          duration: 60,
          description: 'Per rol: 2-3 modellen vergelijken op rol-specifieke taak (Backend/Frontend/QA/PM-UX/Managers/Advanced). Objectief meetrapport + squad-aanbeveling.',
          descriptionI18n: {
            en: 'Per role: compare 2-3 models on role-specific task. Objective measurement report + squad recommendation.',
            nl: 'Per rol: 2-3 modellen vergelijken op rol-specifieke taak (Backend/Frontend/QA/PM-UX/Managers/Advanced). Objectief meetrapport + squad-aanbeveling.',
            fr: 'Par rôle : comparer 2-3 modèles sur tâche spécifique. Rapport objectif + recommandation squad.',
          },
          content: LAB_6A_NL,
          contentI18n: { en: LAB_6A_EN, nl: LAB_6A_NL, fr: LAB_6A_FR },
          exercises: [
            {
              id: 'w5d5-ex1',
              title: 'Model Duel Challenge eigen rol-track',
              titleI18n: {
                en: 'Model Duel Challenge your role track',
                nl: 'Model Duel Challenge eigen rol-track',
                fr: 'Model Duel Challenge votre rôle',
              },
              instructions: 'Kies je rol-track. Voer Model Duel uit op track-specifieke taak. Lever: vergelijkingsrapport met objectieve data (niet meningen), minimaal 2 modellen, onderbouwde squad-aanbeveling. Badge: rapport peer-review-ready, Advanced ook kosten-efficiency bewijs multi-model.',
              instructionsI18n: {
                en: 'Pick your role track. Run Model Duel on track-specific task. Deliver: comparison report with objective data (not opinions), at least 2 models, justified squad recommendation. Badge: peer-review-ready report, Advanced also cost-efficiency proof multi-model.',
                nl: 'Kies je rol-track. Voer Model Duel uit op track-specifieke taak. Lever: vergelijkingsrapport met objectieve data (niet meningen), minimaal 2 modellen, onderbouwde squad-aanbeveling. Badge: rapport peer-review-ready, Advanced ook kosten-efficiency bewijs multi-model.',
                fr: 'Choisissez votre rôle. Lancez Model Duel. Livrez rapport avec données objectives, minimum 2 modèles, recommandation squad justifiée.',
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
