// ─────────────────────────────────────────────────────────────────────────────
// WEEK 0 / LEVEL 1 — AI Foundations
// Source: docs/specs/2026-04-20-level-1-source.md (Cons & Nina v1.0, 19 apr 2026)
// Rewritten: 20 apr 2026 — ship-target Squad 1 kickoff 21 apr 2026
//
// Structure:
//   Dag 1: Les 1.1 — De AI-Revolutie  +  Lab 1A: Jouw AI-Tijdlijn
//   Dag 2: Les 1.2 — AI Woordenboek    +  Lab 1B: AI Bingo & Squad Glossary
//   Dag 3: Les 1.3 — Hoe AI-tools Werken + Lab: 6 Rol-opdrachten "First Contact"
//   Dag 4: Les 1.4 — AI in je Workflow + Lab: Grenzen-praktijk
//   Dag 5: Les 1.5 — Bouw je AI-Buddy  + Lab: Buddy in Actie (verificatie)
// ─────────────────────────────────────────────────────────────────────────────

import type { CurriculumWeek } from './curriculum';
import { dailySchedule } from './curriculum-schedule';

// ─── LES 1.1 — DE AI-REVOLUTIE: HOE WE HIER KWAMEN ──────────────────────────

const LESSON_1_1_NL = `# Les 1.1 — De AI-Revolutie: Hoe We Hier Kwamen

De wereld is veranderd. En het ging snel.

Vijf jaar geleden was AI een speeltje voor onderzoekers. Vandaag schrijft AI code, reviewt pull requests, en bespaart Worldline's Cards team **300 uur per week**.

Dit is niet de zoveelste tool die je moet leren. Dit is een fundamenteel andere manier van werken.

## De Tijdlijn: 70 Jaar in 6 Momenten

AI heeft een lange geschiedenis. Je hoeft niet alles te weten — maar deze zes momenten verklaren waarom je NU in deze training zit.

**1950 — Alan Turing stelt DE vraag**
"Can machines think?" Turing publiceert het paper dat alles start. Zijn Turing Test is nog steeds de meest geciteerde definitie van machine-intelligentie.
> "We can only see a short distance ahead, but we can see plenty there that needs to be done." — Alan Turing

**1997 — Deep Blue verslaat Kasparov**
IBM's computer wint het WK schaken. Niet door intelligentie, maar door brute rekenkracht — miljoenen posities per seconde. Een mijlpaal, maar geen menselijk denken.

**2012 — Deep Learning doorbraak**
Geoffrey Hinton's team wint de ImageNet-competitie. De fout daalt met 40%. GPU's maken het mogelijk. Spraakherkenning, beeldherkenning, vertaling — alles begint hier.

**2017 — "Attention Is All You Need"**
Google publiceert het Transformer-paper. De architectuur achter GPT, Claude, Gemini en elk modern taalmodel. Self-attention: elk token kijkt naar elk ander token. Dit is de motor onder de AI-revolutie.

**2022 — ChatGPT: het kantelpunt**
1 miljoen gebruikers in 5 dagen. AI wordt toegankelijk voor iedereen. Niet alleen onderzoekers — iedereen.

**2025-2026 — Agentic AI: het agent-tijdperk**
AI doet niet meer alleen antwoorden geven — het voert taken uit. Claude Code schrijft code, test het, fixt bugs. Multi-agent systemen werken autonoom. Dit is waar jij als Worldline engineer nu in zit.

## Drie Generaties AI-gebruik

**Generatie 1 — Chatten (2022-2023)**
"Wat is het verschil tussen REST en GraphQL?" AI antwoordt, jij leest. Glorified Google.

**Generatie 2 — Assisteren (2023-2024)**
"Review deze functie en stel verbeteringen voor." AI helpt, jij beslist. Pair programming light.

**Generatie 3 — Samenwerken (2024-heden)**
"Bouw deze feature, test hem, maak een PR." AI executeert, jij coördineert. Dit is AI-first development.

**Jij zit in Generatie 3.** Dat is waarom deze training anders is dan een "ChatGPT voor beginners" cursus.

## De Cijfers: Dit Is Echt

- **Worldline Cards team** — SpringBoot migratie via AI → 300 uur/week bespaard (2 uur i.p.v. 2-3 dagen per microservice)
- **Microsoft** — 30% van alle code AI-generated (Satya Nadella, 2025)
- **Spotify** — Senior engineers stoppen met handmatig coderen ("Haven't written a line since December" — Gustav Söderström)
- **GitHub** — 65-72% van code AI-generated in IDE tools (internal data 2025)
- **Claude Code** — Gebruik verdubbeld in 3 maanden (32% → 63% adoptie)

> "You didn't get a cost reduction. You got an army." — Nate B. Jones

## De Eerlijke Waarschuwing: De J-Curve

AI maakt je niet magisch sneller op dag 1.

Onderzoek toont een J-curve: eerst ga je even langzamer. Je leert nieuwe tools, past je werkwijze aan, maakt fouten. Dat is normaal. Census Bureau AI-implementaties toonden initieel **-1,3% productiviteit** voordat de stijging kwam.

Maar na die dip? **+40 tot 70% productiviteitswinst** bij teams die het goed begeleiden (Stripe, GitHub internal — na 6 maanden coaching).

Het verschil? Training + begeleiding + oefening. Precies wat je nu doet.

## Project Lightspeed: Waar Worldline Naartoe Gaat

Dit is niet zomaar een training. Je bent onderdeel van **Project Lightspeed** — Gertjan Dewaele's visie om elke GC engineer AI-augmented te maken.

De roadmap:
- **April 2026 (nu):** Wave 1 — eerste 30 seats, 3 squads, hands-on coaching
- **Juni 2026:** N8N infrastructure, AI-for-PM pilots
- **September 2026:** Wave 2 — 60 seats, 3 nieuwe squads
- **Q1 2027:** Full rollout — alle 180 developers + 30 PMs

Wat Gertjan van jullie verwacht:
- Nieuwsgierigheid om te experimenteren
- Bereidheid om echt je werkwijze te veranderen
- Impact meten en delen met je team
- AI veilig en verantwoordelijk gebruiken

**Jullie zijn de eersten.** Wat jullie hier leren en bouwen, wordt het fundament voor de rest van Worldline.`;

const LESSON_1_1_EN = `# Lesson 1.1 — The AI Revolution: How We Got Here

The world has changed. And it happened fast.

Five years ago, AI was a toy for researchers. Today AI writes code, reviews pull requests, and saves Worldline's Cards team **300 hours a week**.

This isn't just another tool to learn. This is a fundamentally different way of working.

## The Timeline: 70 Years in 6 Moments

AI has a long history. You don't need to know it all — but these six moments explain why you're in this training NOW.

**1950 — Alan Turing asks THE question**
"Can machines think?" Turing publishes the paper that starts everything. His Turing Test is still the most-cited definition of machine intelligence.
> "We can only see a short distance ahead, but we can see plenty there that needs to be done." — Alan Turing

**1997 — Deep Blue beats Kasparov**
IBM's computer wins the chess world championship. Not through intelligence, but brute force — millions of positions per second. A milestone, but not human thinking.

**2012 — Deep Learning breakthrough**
Geoffrey Hinton's team wins the ImageNet competition. Error rate drops 40%. GPUs make it possible. Speech recognition, image recognition, translation — it all starts here.

**2017 — "Attention Is All You Need"**
Google publishes the Transformer paper. The architecture behind GPT, Claude, Gemini and every modern language model. Self-attention: every token looks at every other token. This is the engine behind the AI revolution.

**2022 — ChatGPT: the tipping point**
1 million users in 5 days. AI becomes accessible to everyone. Not just researchers — everyone.

**2025-2026 — Agentic AI: the agent era**
AI no longer just answers — it executes tasks. Claude Code writes code, tests it, fixes bugs. Multi-agent systems work autonomously. This is where you as a Worldline engineer sit today.

## Three Generations of AI Use

**Generation 1 — Chatting (2022-2023)**
"What's the difference between REST and GraphQL?" AI answers, you read. Glorified Google.

**Generation 2 — Assisting (2023-2024)**
"Review this function and suggest improvements." AI helps, you decide. Pair programming light.

**Generation 3 — Collaborating (2024-today)**
"Build this feature, test it, open a PR." AI executes, you coordinate. This is AI-first development.

**You're in Generation 3.** That's why this training is different from a "ChatGPT for beginners" course.

## The Numbers: This Is Real

- **Worldline Cards team** — SpringBoot migration via AI → 300 hours/week saved (2 hours instead of 2-3 days per microservice)
- **Microsoft** — 30% of all code AI-generated (Satya Nadella, 2025)
- **Spotify** — Senior engineers stop hand-coding ("Haven't written a line since December" — Gustav Söderström)
- **GitHub** — 65-72% of code AI-generated in IDE tools (internal data 2025)
- **Claude Code** — Usage doubled in 3 months (32% → 63% adoption)

> "You didn't get a cost reduction. You got an army." — Nate B. Jones

## The Honest Warning: The J-Curve

AI doesn't magically make you faster on day 1.

Research shows a J-curve: you slow down first. You learn new tools, adapt your workflow, make mistakes. That's normal. Census Bureau AI implementations showed an initial **-1.3% productivity** before the climb.

But after that dip? **+40 to 70% productivity gains** for teams with proper coaching (Stripe, GitHub internal — after 6 months of guidance).

The difference? Training + coaching + practice. Exactly what you're doing now.

## Project Lightspeed: Where Worldline Is Heading

This isn't just a training. You're part of **Project Lightspeed** — Gertjan Dewaele's vision to make every GC engineer AI-augmented.

The roadmap:
- **April 2026 (now):** Wave 1 — first 30 seats, 3 squads, hands-on coaching
- **June 2026:** N8N infrastructure, AI-for-PM pilots
- **September 2026:** Wave 2 — 60 seats, 3 new squads
- **Q1 2027:** Full rollout — all 180 developers + 30 PMs

What Gertjan expects from you:
- Curiosity to experiment
- Willingness to truly change your workflow
- Measure impact and share with your team
- Use AI safely and responsibly

**You're the first.** What you learn and build here becomes the foundation for the rest of Worldline.`;

const LESSON_1_1_FR = `# Leçon 1.1 — La Révolution IA : Comment nous sommes arrivés ici

Le monde a changé. Et c'est allé vite.

Il y a cinq ans, l'IA était un jouet pour chercheurs. Aujourd'hui, l'IA écrit du code, relit les pull requests, et fait économiser **300 heures par semaine** à l'équipe Cards de Worldline.

Ce n'est pas un énième outil à apprendre. C'est une façon fondamentalement différente de travailler.

## La chronologie : 70 ans en 6 moments

L'IA a une longue histoire. Pas besoin de tout savoir — mais ces six moments expliquent pourquoi vous êtes dans cette formation MAINTENANT.

**1950 — Alan Turing pose LA question**
« Can machines think ? » Turing publie le papier qui lance tout. Son test de Turing reste la définition la plus citée de l'intelligence machine.
> « We can only see a short distance ahead, but we can see plenty there that needs to be done. » — Alan Turing

**1997 — Deep Blue bat Kasparov**
L'ordinateur d'IBM remporte le championnat du monde d'échecs. Pas grâce à l'intelligence, mais à la force brute — des millions de positions par seconde. Un jalon, mais pas de la pensée humaine.

**2012 — La percée du deep learning**
L'équipe de Geoffrey Hinton remporte le concours ImageNet. Le taux d'erreur chute de 40 %. Les GPU rendent cela possible. Reconnaissance vocale, vision, traduction — tout commence ici.

**2017 — « Attention Is All You Need »**
Google publie le papier Transformer. L'architecture derrière GPT, Claude, Gemini et tout modèle de langage moderne. Self-attention : chaque token regarde tous les autres. C'est le moteur de la révolution IA.

**2022 — ChatGPT : le point de bascule**
1 million d'utilisateurs en 5 jours. L'IA devient accessible à tout le monde. Pas juste aux chercheurs — à tout le monde.

**2025-2026 — Agentic AI : l'ère des agents**
L'IA ne se contente plus de répondre — elle exécute des tâches. Claude Code écrit du code, le teste, corrige les bugs. Les systèmes multi-agents travaillent en autonomie. C'est là que vous êtes aujourd'hui en tant qu'ingénieur Worldline.

## Trois générations d'usage de l'IA

**Génération 1 — Discuter (2022-2023)**
« Quelle est la différence entre REST et GraphQL ? » L'IA répond, vous lisez. Un Google glorifié.

**Génération 2 — Assister (2023-2024)**
« Revois cette fonction et propose des améliorations. » L'IA aide, vous décidez. Pair programming allégé.

**Génération 3 — Collaborer (2024 à aujourd'hui)**
« Construis cette fonctionnalité, teste-la, ouvre une PR. » L'IA exécute, vous coordonnez. C'est le développement AI-first.

**Vous êtes en Génération 3.** C'est pourquoi cette formation est différente d'un cours « ChatGPT pour débutants ».

## Les chiffres : c'est réel

- **Équipe Cards Worldline** — Migration SpringBoot via IA → 300 h/semaine économisées (2 h au lieu de 2-3 jours par microservice)
- **Microsoft** — 30 % de tout le code généré par IA (Satya Nadella, 2025)
- **Spotify** — Les ingénieurs senior arrêtent de coder à la main (« Haven't written a line since December » — Gustav Söderström)
- **GitHub** — 65-72 % du code généré par IA dans les outils IDE (données internes 2025)
- **Claude Code** — Usage doublé en 3 mois (32 % → 63 % d'adoption)

> « You didn't get a cost reduction. You got an army. » — Nate B. Jones

## L'avertissement honnête : la J-Curve

L'IA ne vous rend pas magiquement plus rapide dès le jour 1.

La recherche montre une J-curve : d'abord vous ralentissez. Vous apprenez de nouveaux outils, adaptez votre méthode, faites des erreurs. C'est normal. Les implémentations IA au Census Bureau ont montré initialement **-1,3 % de productivité** avant la montée.

Mais après ce creux ? **+40 à 70 % de gain de productivité** pour les équipes bien accompagnées (Stripe, GitHub interne — après 6 mois de coaching).

La différence ? Formation + accompagnement + pratique. Exactement ce que vous faites maintenant.

## Project Lightspeed : la direction de Worldline

Ce n'est pas qu'une formation. Vous faites partie de **Project Lightspeed** — la vision de Gertjan Dewaele de rendre chaque ingénieur GC augmenté par IA.

La roadmap :
- **Avril 2026 (maintenant) :** Wave 1 — 30 premières places, 3 squads, coaching pratique
- **Juin 2026 :** Infrastructure N8N, pilotes AI-for-PM
- **Septembre 2026 :** Wave 2 — 60 places, 3 nouvelles squads
- **Q1 2027 :** Rollout complet — l'ensemble des 180 développeurs + 30 PM

Ce que Gertjan attend de vous :
- La curiosité d'expérimenter
- La volonté de vraiment changer votre façon de travailler
- Mesurer l'impact et le partager avec votre équipe
- Utiliser l'IA de manière sûre et responsable

**Vous êtes les premiers.** Ce que vous apprenez et construisez ici devient le fondement pour le reste de Worldline.`;

// ─── LES 1.2 — AI WOORDENBOEK ───────────────────────────────────────────────

const LESSON_1_2_NL = `# Les 1.2 — AI Woordenboek: Spreek de Taal

## Waarom Dit Ertoe Doet

Als je de taal niet spreekt, kun je de tool niet meesteren. Dit zijn de begrippen die elke AI-native developer kent. Je hoeft ze niet allemaal vandaag te onthouden — maar je moet ze herkennen.

## De Basis (moet je kennen)

**Token** — De kleinste eenheid die een AI-model verwerkt. Niet hetzelfde als een woord.
- "worldline" = ±0,5-12 tokens

Op deze website kan je zien hoeveel tokens je tekst is per model: [Claude Tokenizer](https://claude.com/tokenizer).

Waarom het uitmaakt: je betaalt per token, en modellen hebben een token-limiet.

**Context Window** — Hoeveel tekst het model tegelijk "in zijn hoofd" kan houden. Vergelijk het met werkgeheugen.
- Moderne frontier modellen: tot 1M tokens (Claude Sonnet 4.6 / Opus 4.7)
- Praktisch: 200K tokens ≈ 150.000 woorden

Belangrijk: meer context ≠ altijd betere antwoorden. Bij heel grote contexten treedt **context rot** op.

**Prompt** — De input die je aan een AI-model geeft. Kan tekst, code of afbeeldingen zijn.
- **Zero-shot**: vraag zonder voorbeelden
- **Few-shot**: vraag met voorbeelden ("Hier zijn 3 voorbeelden, doe nu hetzelfde...")
- **System prompt**: de instructies die het gedrag van de AI bepalen

**Temperature** — Hoe "creatief" of "voorspelbaar" het model antwoordt. De schaal varieert vaak van 0 tot 1 of 10, afhankelijk van het model. Stel voor een schaal van 0 tot 2:
- **0.0** — altijd hetzelfde antwoord → goed voor code
- **0.7** — gebalanceerd → goed voor schrijven
- **1.5+** — creatief chaos → goed voor brainstorming, slecht voor productie

## Model-begrippen (goed om te weten)

**Training vs Fine-tuning vs RAG:**
- **Pre-training** — Model leert van internet-schaal data (door AI-labs, niet jij)
- **Fine-tuning** — Model leert van jouw specifieke data (voor consistente stijl/kennis)
- **RAG** — Model zoekt in externe database bij elke vraag (voor actuele/private data)

LibreChat bij Worldline is RAG: het haalt relevante Confluence-pagina's op bij elke vraag.

**Embedding** — Een tekst omgezet naar een vector van getallen. Vergelijkbare teksten = vergelijkbare vectoren. De basis van semantic search.

**Inference** — Het moment waarop het model je input verwerkt en een antwoord genereert. Kost compute, tijd en geld.

## Problemen & Beperkingen (moet je herkennen)

**Hallucination** — Het model verzint informatie met grote overtuiging. Het "liegt" niet — het weet het verschil niet.
Voorbeeld: Claude noemt een niet-bestaande Worldline API. Oplossing: verifieer altijd.

**Context Pollution** — Irrelevante informatie in je context window verslechtert de kwaliteit.
Voorbeeld: een 10.000-regelig codebestand plakken terwijl je 50 regels nodig hebt.

**Prompt Injection** — Een aanval waarbij kwaadaardige tekst probeert de AI te "hijacken".
Worldline-relevant: altijd user input sanitizen voor je het in een prompt stopt.

**Knowledge Cutoff** — Het model weet niets over events na zijn trainingsdata. Oplossing: gebruik RAG of web search.

## AI-Native Jargon (handig voor de koffieautomaat)

- **Vibe Coding** — Iteratief werken met AI zonder exact plan — je "voelt" je richting
- **Chain of Thought** — AI laten "hardop denken" voor het antwoord geeft — betere resultaten
- **Agentic AI** — AI die zelfstandig meerdere stappen uitvoert: denken → plannen → uitvoeren → checken
- **Multimodal** — Een model dat tekst + afbeeldingen + code + audio begrijpt en/of genereert
- **Tool Use / Function Calling** — AI die externe tools aanroept: databases, API's, code uitvoeren
- **User Prompt** — De instructies die de (eind)gebruiker stuurt naar de AI
- **System Prompt** — De instructies die het gedrag van een AI-instantie definiëren, vaak onzichtbaar voor de (eind)gebruiker
- **Human in the loop** — Verplicht principe: AI stelt voor, mens beslist

## Worldline-specifieke termen

- **LibreChat** — Goedgekeurde AI-chatinterface, gekoppeld aan Confluence via RAG
- **GitHub Copilot** — Goedgekeurde AI-code-assistent in je IDE
- **Claude Code** — CLI-tool voor agentic development — jouw primaire AI-tool
- **PCI-DSS** — Payment Card Industry Data Security Standard — nooit kaartdata in een AI-prompt
- **Compliance gate** — Review vereist voor AI-output in productie-code`;

const LESSON_1_2_EN = `# Lesson 1.2 — AI Dictionary: Speak the Language

## Why This Matters

If you don't speak the language, you can't master the tool. These are the terms every AI-native developer knows. You don't need to memorise them all today — but you must recognise them.

## The Basics (must know)

**Token** — The smallest unit an AI model processes. Not the same as a word.
- "worldline" = ±0.5-12 tokens

On this website you can see how many tokens your text is per model: [Claude Tokenizer](https://claude.com/tokenizer).

Why it matters: you pay per token, and models have token limits.

**Context Window** — How much text the model can hold "in its head" at once. Compare it to working memory.
- Modern frontier models: up to 1M tokens (Claude Sonnet 4.6 / Opus 4.7)
- Practically: 200K tokens ≈ 150,000 words

Important: more context ≠ always better answers. Very large contexts trigger **context rot**.

**Prompt** — The input you give an AI model. Can be text, code, or images.
- **Zero-shot**: question without examples
- **Few-shot**: question with examples ("Here are 3 examples, now do the same...")
- **System prompt**: instructions that define the AI's behaviour

**Temperature** — How "creative" or "predictable" the model responds. The scale often varies from 0 to 1 or 10, depending on the model. Assuming a scale of 0 to 2:
- **0.0** — always the same answer → good for code
- **0.7** — balanced → good for writing
- **1.5+** — creative chaos → good for brainstorming, bad for production

## Model Terms (good to know)

**Training vs Fine-tuning vs RAG:**
- **Pre-training** — Model learns from internet-scale data (done by AI labs, not you)
- **Fine-tuning** — Model learns from your specific data (for consistent style/knowledge)
- **RAG** — Model searches an external database on each query (for current/private data)

LibreChat at Worldline is RAG: it pulls relevant Confluence pages on every query.

**Embedding** — A text converted to a vector of numbers. Similar texts = similar vectors. The basis of semantic search.

**Inference** — The moment the model processes your input and generates an answer. Costs compute, time and money.

## Problems & Limitations (must recognise)

**Hallucination** — The model invents information with great confidence. It doesn't "lie" — it doesn't know the difference.
Example: Claude mentions a non-existent Worldline API. Fix: always verify.

**Context Pollution** — Irrelevant information in your context window degrades quality.
Example: pasting a 10,000-line code file when you need 50 lines.

**Prompt Injection** — An attack where malicious text tries to "hijack" the AI.
Worldline-relevant: always sanitise user input before putting it in a prompt.

**Knowledge Cutoff** — The model knows nothing about events after its training data. Fix: use RAG or web search.

## AI-Native Jargon (handy at the coffee machine)

- **Vibe Coding** — Iterative work with AI without a strict plan — you "feel" your direction
- **Chain of Thought** — Letting AI "think out loud" before answering — better results
- **Agentic AI** — AI that autonomously performs multiple steps: think → plan → execute → check
- **Multimodal** — A model that understands and/or generates text + images + code + audio
- **Tool Use / Function Calling** — AI that calls external tools: databases, APIs, running code
- **User Prompt** — The instructions the (end) user sends to the AI
- **System Prompt** — The instructions that define a specific AI instance's behaviour, often invisible to the (end) user
- **Human in the loop** — Mandatory principle: AI proposes, human decides

## Worldline-specific terms

- **LibreChat** — Approved AI chat interface, connected to Confluence via RAG
- **GitHub Copilot** — Approved AI code assistant in your IDE
- **Claude Code** — CLI tool for agentic development — your primary AI tool
- **PCI-DSS** — Payment Card Industry Data Security Standard — never card data in an AI prompt
- **Compliance gate** — Review required for AI output in production code`;

const LESSON_1_2_FR = `# Leçon 1.2 — Dictionnaire IA : parlez la langue

## Pourquoi c'est important

Si vous ne parlez pas la langue, vous ne pouvez pas maîtriser l'outil. Voici les termes que tout développeur AI-native connaît. Pas besoin de tous les retenir aujourd'hui — mais vous devez les reconnaître.

## Les bases (à connaître)

**Token** — La plus petite unité que traite un modèle d'IA. Pas la même chose qu'un mot.
- « worldline » = ±0,5-12 tokens

Sur ce site vous pouvez voir combien de tokens contient votre texte par modèle : [Claude Tokenizer](https://claude.com/tokenizer).

Pourquoi c'est important : vous payez au token, et les modèles ont une limite de tokens.

**Context Window** — Combien de texte le modèle peut garder « en tête » à la fois. Comparable à la mémoire de travail.
- Modèles frontier modernes : jusqu'à 1M tokens (Claude Sonnet 4.6 / Opus 4.7)
- En pratique : 200K tokens ≈ 150 000 mots

Important : plus de contexte ≠ toujours de meilleures réponses. Au-delà d'une certaine taille apparaît le **context rot**.

**Prompt** — L'entrée que vous donnez au modèle. Peut être texte, code ou images.
- **Zero-shot** : question sans exemples
- **Few-shot** : question avec exemples (« Voici 3 exemples, fais la même chose... »)
- **System prompt** : les instructions qui définissent le comportement de l'IA

**Temperature** — Le côté « créatif » ou « prévisible » des réponses. L'échelle varie souvent de 0 à 1 ou 10, selon le modèle. En supposant une échelle de 0 à 2 :
- **0.0** — toujours la même réponse → bon pour le code
- **0.7** — équilibré → bon pour l'écriture
- **1.5+** — chaos créatif → bon pour le brainstorming, mauvais pour la production

## Termes liés aux modèles (bon à savoir)

**Training vs Fine-tuning vs RAG :**
- **Pre-training** — Le modèle apprend depuis des données à l'échelle d'internet (par les labs IA, pas vous)
- **Fine-tuning** — Le modèle apprend depuis vos données spécifiques (pour un style/une connaissance cohérents)
- **RAG** — Le modèle cherche dans une base externe à chaque requête (pour des données actuelles/privées)

LibreChat chez Worldline est du RAG : il récupère les pages Confluence pertinentes à chaque requête.

**Embedding** — Un texte converti en vecteur de nombres. Des textes similaires = des vecteurs similaires. Base de la recherche sémantique.

**Inference** — Le moment où le modèle traite votre entrée et génère une réponse. Coûte du compute, du temps et de l'argent.

## Problèmes et limites (à reconnaître)

**Hallucination** — Le modèle invente des informations avec grande confiance. Il ne « ment » pas — il ne connaît pas la différence.
Exemple : Claude cite une API Worldline inexistante. Solution : toujours vérifier.

**Context Pollution** — Information non pertinente dans votre context window qui dégrade la qualité.
Exemple : coller un fichier de 10 000 lignes alors que vous en avez besoin de 50.

**Prompt Injection** — Une attaque où du texte malveillant tente de « détourner » l'IA.
Pertinent chez Worldline : toujours sanitiser l'entrée utilisateur avant de l'insérer dans un prompt.

**Knowledge Cutoff** — Le modèle ne sait rien des événements postérieurs à ses données d'entraînement. Solution : RAG ou recherche web.

## Jargon AI-native (utile à la machine à café)

- **Vibe Coding** — Travail itératif avec l'IA sans plan strict — vous « sentez » votre direction
- **Chain of Thought** — Laisser l'IA « penser à haute voix » avant la réponse — meilleurs résultats
- **Agentic AI** — IA qui exécute plusieurs étapes en autonomie : penser → planifier → exécuter → vérifier
- **Multimodal** — Un modèle qui comprend et/ou génère texte + images + code + audio
- **Tool Use / Function Calling** — IA qui appelle des outils externes : bases, API, exécution de code
- **User Prompt** — Les instructions que l'utilisateur (final) envoie à l'IA
- **System Prompt** — Les instructions qui définissent le comportement d'une instance IA, souvent invisibles pour l'utilisateur (final)
- **Human in the loop** — Principe obligatoire : l'IA propose, l'humain décide

## Termes spécifiques à Worldline

- **LibreChat** — Interface de chat IA approuvée, connectée à Confluence via RAG
- **GitHub Copilot** — Assistant de code IA approuvé dans votre IDE
- **Claude Code** — Outil CLI pour le développement agentique — votre outil IA principal
- **PCI-DSS** — Payment Card Industry Data Security Standard — jamais de données carte dans un prompt IA
- **Compliance gate** — Revue obligatoire pour la sortie IA dans du code de production`;

// ─── LES 1.3 — HOE AI-TOOLS WERKEN ──────────────────────────────────────────

const LESSON_1_3_NL = `# Les 1.3 — Hoe AI-tools Werken: De Flow

Dit is de les die het laat klikken.

Je hoeft niet te weten hoe het model van binnen werkt. Maar je MOET begrijpen hoe de flow werkt — want dat verklaart alles: waarom context belangrijk is, waarom MCP werkt, waarom output soms raar is.

## Kernprincipe 1: Het is gewoon een API call

Een LLM-interactie is simpeler dan je denkt:
**Tekst erin → API call → tekst eruit.**

Dat is het. Het model voert NIETS uit op jouw computer. Het ontvangt tekst, genereert tekst, klaar. Alle "magie" zit in wat er omheen gebouwd is.

## Kernprincipe 2: Er is geen geheugen

Elk API call begint vanaf nul. Het model weet niet wat je 5 minuten geleden vroeg. De "illusie van een gesprek" is dat de applicatie (LibreChat, Claude Code) elke keer ALLE vorige berichten weer meestuurt.

Daarom is je context window zo belangrijk — het IS je geheugen.

## Kernprincipe 3: De Orchestrator doet het echte werk

Dit is het aha-moment:

\`\`\`
Jij typt een opdracht
     ↓
De ORCHESTRATOR (Claude Code / LibreChat) stuurt naar het model:
  • Jouw bericht (User Prompt)
  • De System Prompt (extra context)
  • Alle vorige berichten (memory)
  • Een lijst beschikbare tools (met parameters en beschrijvingen)
     ↓
Het MODEL antwoordt:
  "Gebruik tool: edit_file
   pad: /src/api/handler.go
   oud: func handlePayment()
   nieuw: func handlePayment(ctx context.Context)"
     ↓
De ORCHESTRATOR voert de tool uit (bewerkt het bestand)
     ↓
Resultaat gaat terug naar het model
     ↓
Het model reageert weer (volgende stap of klaar)
\`\`\`

**Het model DENKT. De orchestrator DOET.**

Wanneer je een MCP-server gebruikt (bijv. voor GitLab of Jira), verschuift de tool-uitvoering van de orchestrator naar de MCP-server. Maar de flow blijft hetzelfde.

## De tools bij Worldline

**Claude Code (je primaire tool)**
- **Wat:** CLI-tool in je terminal. Je geeft instructies, Claude Code voert ze uit: code schrijven, testen, debuggen, refactoren.
- **Wanneer:** Alles wat met je codebase te maken heeft.
- **Hoe:** Via Vertex AI (Google Cloud) — data blijft in de EU.
- **Waarom dit je hoofdtool is:** Claude Code begrijpt je hele codebase. Het leest bestanden, voert commando's uit, en itereert net als een collega. Geen copy-paste.

De kracht van Claude Code is niet het model — het is de scaffolding eromheen. De CLAUDE.md, de tools, de project-context. Dat is waarom we in Level 3 diep ingaan op Context Engineering.

**LibreChat (je kennispartner)**
- **Wat:** Chatinterface gekoppeld aan Confluence via RAG.
- **Wanneer:** Snelle vragen, documentatie doorzoeken, brainstormen, tekst schrijven.
- **Bonus:** LibreChat heeft memories — je kunt persoonlijke kennis opslaan.

**GitHub Copilot (je autocomplete op steroïden)**
- **Wat:** AI-code-assistent in je IDE. Suggereert code terwijl je typt.
- **Wanneer:** Code completion, boilerplate, regex, commit messages.

**Wanneer welke?**
- Codebase-gerelateerd → Claude Code
- Losse vraag / documentatie → LibreChat
- Autocomplete tijdens typen → Copilot
- Intern docs doorzoeken → LibreChat (Confluence RAG)
- Feature bouwen / bugs fixen → Claude Code
- Mail of document schrijven → LibreChat

## Verbindingen: MCP (Model Context Protocol)

MCP is een protocol waarmee AI-tools veilig verbinding maken met je bestaande systemen. Het verschuift de tool-uitvoering van de orchestrator naar een externe server.

**Nu beschikbaar:**
- LibreChat + Confluence (automatische RAG — al actief)
- GitHub Copilot (code completion — al actief)
- Claude Code + je codebase (leest je repository — beschikbaar)

**Mogelijk via MCP:**
- GitLab — issues, merge requests, code doorzoeken
- Jira — tickets lezen, context ophalen
- Confluence — documentatie doorzoeken
- Slack — berichten raadplegen

In latere levels leer je hoe je dit stap voor stap opzet.

## Waarom dit alles uitmaakt

Nu snap je waarom:
- **CLAUDE.md belangrijk is** → het is de context die elke keer wordt meegestuurd
- **MCP krachtig is** → het geeft het model nieuwe tools om mee te werken
- **Specifieke prompts beter werken** → het model heeft geen geheugen, dus JIJ moet de context geven
- **AI soms "vergeet" wat je net zei** → je context window kan vol raken
- **De output soms raar is** → het model voert niets uit, het genereert alleen tekst`;

const LESSON_1_3_EN = `# Lesson 1.3 — How AI Tools Work: The Flow

This is the lesson that makes it click.

You don't need to know how the model works internally. But you MUST understand how the flow works — because it explains everything: why context matters, why MCP works, why output is sometimes weird.

## Core Principle 1: It's just an API call

An LLM interaction is simpler than you think:
**Text in → API call → text out.**

That's it. The model executes NOTHING on your computer. It receives text, generates text, done. All the "magic" is in what's built around it.

## Core Principle 2: There is no memory

Every API call starts from zero. The model doesn't know what you asked 5 minutes ago. The "illusion of a conversation" is the application (LibreChat, Claude Code) resending ALL previous messages each time.

That's why your context window is so important — it IS your memory.

## Core Principle 3: The Orchestrator does the real work

This is the aha moment:

\`\`\`
You type an instruction
     ↓
The ORCHESTRATOR (Claude Code / LibreChat) sends to the model:
  • Your message (User Prompt)
  • The System Prompt (extra context)
  • All previous messages (memory)
  • A list of available tools (with parameters and descriptions)
     ↓
The MODEL responds:
  "Use tool: edit_file
   path: /src/api/handler.go
   old: func handlePayment()
   new: func handlePayment(ctx context.Context)"
     ↓
The ORCHESTRATOR executes the tool (edits the file)
     ↓
Result goes back to the model
     ↓
The model responds again (next step or done)
\`\`\`

**The model THINKS. The orchestrator DOES.**

When you use an MCP server (e.g. for GitLab or Jira), tool execution shifts from the orchestrator to the MCP server. But the flow stays the same.

## The tools at Worldline

**Claude Code (your primary tool)**
- **What:** CLI tool in your terminal. You give instructions, Claude Code executes them: writing code, testing, debugging, refactoring.
- **When:** Anything to do with your codebase.
- **How:** Via Vertex AI (Google Cloud) — data stays in the EU.
- **Why this is your main tool:** Claude Code understands your entire codebase. It reads files, runs commands, and iterates like a colleague. No copy-paste.

The strength of Claude Code isn't the model — it's the scaffolding around it. The CLAUDE.md, the tools, the project context. That's why Level 3 goes deep into Context Engineering.

**LibreChat (your knowledge partner)**
- **What:** Chat interface connected to Confluence via RAG.
- **When:** Quick questions, searching docs, brainstorming, writing text.
- **Bonus:** LibreChat has memories — you can store personal knowledge.

**GitHub Copilot (your autocomplete on steroids)**
- **What:** AI code assistant in your IDE. Suggests code as you type.
- **When:** Code completion, boilerplate, regex, commit messages.

**Which one when?**
- Codebase-related → Claude Code
- Loose question / documentation → LibreChat
- Autocomplete while typing → Copilot
- Internal docs search → LibreChat (Confluence RAG)
- Building features / fixing bugs → Claude Code
- Email or document writing → LibreChat

## Connections: MCP (Model Context Protocol)

MCP is a protocol that lets AI tools safely connect to your existing systems. It shifts tool execution from the orchestrator to an external server.

**Available today:**
- LibreChat + Confluence (automatic RAG — already active)
- GitHub Copilot (code completion — already active)
- Claude Code + your codebase (reads your repository — available)

**Possible via MCP:**
- GitLab — issues, merge requests, code search
- Jira — read tickets, pull context
- Confluence — search docs
- Slack — look up messages

In later levels you'll learn how to set this up step by step.

## Why this all matters

Now you understand why:
- **CLAUDE.md matters** → it's the context that gets sent every single time
- **MCP is powerful** → it gives the model new tools to work with
- **Specific prompts work better** → the model has no memory, so YOU must provide context
- **AI sometimes "forgets" what you just said** → your context window can fill up
- **Output is sometimes weird** → the model doesn't execute anything, it only generates text`;

const LESSON_1_3_FR = `# Leçon 1.3 — Comment fonctionnent les outils IA : le flow

C'est la leçon qui fait tilt.

Pas besoin de savoir comment le modèle fonctionne en interne. Mais vous DEVEZ comprendre comment le flow fonctionne — car il explique tout : pourquoi le contexte est important, pourquoi MCP marche, pourquoi la sortie est parfois bizarre.

## Principe 1 : c'est juste un appel API

Une interaction LLM est plus simple que vous ne le pensez :
**Texte en entrée → appel API → texte en sortie.**

C'est tout. Le modèle n'exécute RIEN sur votre ordinateur. Il reçoit du texte, génère du texte, terminé. Toute la « magie » est dans ce qui est construit autour.

## Principe 2 : il n'y a pas de mémoire

Chaque appel API part de zéro. Le modèle ne sait pas ce que vous avez demandé il y a 5 minutes. L'« illusion d'une conversation » est que l'application (LibreChat, Claude Code) renvoie TOUS les messages précédents à chaque fois.

C'est pourquoi votre context window est si important — c'est VOTRE mémoire.

## Principe 3 : l'Orchestrator fait le vrai travail

Voici le moment aha :

\`\`\`
Vous tapez une instruction
     ↓
L'ORCHESTRATOR (Claude Code / LibreChat) envoie au modèle :
  • Votre message (User Prompt)
  • Le System Prompt (contexte supplémentaire)
  • Tous les messages précédents (memory)
  • Une liste d'outils disponibles (avec paramètres et descriptions)
     ↓
Le MODÈLE répond :
  « Utiliser l'outil : edit_file
    path : /src/api/handler.go
    old : func handlePayment()
    new : func handlePayment(ctx context.Context) »
     ↓
L'ORCHESTRATOR exécute l'outil (modifie le fichier)
     ↓
Le résultat revient au modèle
     ↓
Le modèle répond à nouveau (prochaine étape ou fini)
\`\`\`

**Le modèle PENSE. L'orchestrator FAIT.**

Quand vous utilisez un serveur MCP (ex. pour GitLab ou Jira), l'exécution des outils passe de l'orchestrator au serveur MCP. Mais le flow reste identique.

## Les outils chez Worldline

**Claude Code (votre outil principal)**
- **Quoi :** Outil CLI dans votre terminal. Vous donnez des instructions, Claude Code les exécute : écrire du code, tester, déboguer, refactorer.
- **Quand :** Tout ce qui touche à votre codebase.
- **Comment :** Via Vertex AI (Google Cloud) — les données restent en UE.
- **Pourquoi c'est votre outil principal :** Claude Code comprend toute votre codebase. Il lit des fichiers, exécute des commandes, et itère comme un collègue. Pas de copier-coller.

La force de Claude Code n'est pas le modèle — c'est le scaffolding autour. Le CLAUDE.md, les outils, le contexte du projet. C'est pourquoi le Level 3 approfondit le Context Engineering.

**LibreChat (votre partenaire de connaissance)**
- **Quoi :** Interface de chat connectée à Confluence via RAG.
- **Quand :** Questions rapides, recherche dans la doc, brainstorming, rédaction.
- **Bonus :** LibreChat a des memories — vous pouvez stocker des connaissances personnelles.

**GitHub Copilot (votre autocomplétion sous stéroïdes)**
- **Quoi :** Assistant de code IA dans votre IDE. Suggère du code pendant que vous tapez.
- **Quand :** Complétion, boilerplate, regex, messages de commit.

**Lequel quand ?**
- Lié à la codebase → Claude Code
- Question isolée / documentation → LibreChat
- Autocomplétion en tapant → Copilot
- Recherche dans les docs internes → LibreChat (Confluence RAG)
- Construire une fonctionnalité / corriger des bugs → Claude Code
- Rédaction de mail ou de document → LibreChat

## Connexions : MCP (Model Context Protocol)

MCP est un protocole qui permet aux outils IA de se connecter en toute sécurité à vos systèmes existants. Il déplace l'exécution des outils de l'orchestrator vers un serveur externe.

**Disponible maintenant :**
- LibreChat + Confluence (RAG automatique — déjà actif)
- GitHub Copilot (complétion — déjà actif)
- Claude Code + votre codebase (lit votre dépôt — disponible)

**Possible via MCP :**
- GitLab — issues, merge requests, recherche de code
- Jira — lire les tickets, récupérer le contexte
- Confluence — recherche de documentation
- Slack — consulter les messages

Dans les niveaux suivants, vous apprendrez à mettre cela en place étape par étape.

## Pourquoi tout cela est important

Maintenant vous comprenez pourquoi :
- **CLAUDE.md est important** → c'est le contexte qui est envoyé à chaque fois
- **MCP est puissant** → il donne au modèle de nouveaux outils
- **Des prompts spécifiques fonctionnent mieux** → le modèle n'a pas de mémoire, donc VOUS devez fournir le contexte
- **L'IA « oublie » parfois ce que vous venez de dire** → votre context window peut se remplir
- **La sortie est parfois bizarre** → le modèle n'exécute rien, il ne fait que générer du texte`;

// ─── LES 1.4 — AI IN JE WORKFLOW ────────────────────────────────────────────

const LESSON_1_4_NL = `# Les 1.4 — AI in je Workflow: Van Ad-hoc naar Flow

## Het Probleem met Ad-hoc AI

De meeste mensen gebruiken AI zoals ze Google gebruiken: reactief, sporadisch, voor losse vragen.

Het resultaat:
- 10-20% tijdwinst op sommige taken
- Constante context-switching
- Nooit echt in flow

**AI-native developers bouwen AI in hun werkproces in.**

Het resultaat:
- 40-60% tijdwinst op routine-werk
- Betere output op complex werk
- Meer tijd voor het werk dat alleen jij kunt doen

## De Drie Lagen van AI-Flow

**Laag 1 — Reflexieve AI (seconden)**
AI als verlengstuk van je geheugen en typen. Bijna onbewust.
- Functienaam bedenken → Copilot suggestie accepteren
- Regex schrijven → "Schrijf een regex voor..."
- API-response structuur → "Genereer TypeScript interface voor..."
- Fout googlen → "Wat betekent deze error: [paste]"

**Laag 2 — Collaboratieve AI (minuten tot uren)**
AI als thought partner. Bewust ingezet.
- Code review → "Review op security, performance, leesbaarheid"
- Architectuur ontwerp → "Vergelijk deze 3 aanpakken, met trade-offs"
- Documentatie → "Schrijf docs voor deze API op basis van de code"
- Bug analyse → "Ik zie dit gedrag, wat zijn mogelijke oorzaken?"

**Laag 3 — Agentic AI (uren tot dagen)**
AI als autonome executor. Jij geeft richting, AI voert uit.
- Feature bouwen → Claude Code: "Bouw feature X volgens spec Y"
- Refactoring → "Refactor dit module naar dit patroon, behoud tests"
- Test-suite schrijven → "Schrijf volledige test-coverage voor dit bestand"
- Security audit → "Scan deze codebase op OWASP top 10"

## De Grenzen: Wanneer Gebruik Je AI NIET?

AI is een tool, geen vervanging voor oordeel.

- **Finale architectuurbeslissingen** — Jij draagt de consequenties
- **Ethische dilemma's** — AI heeft geen moreel kompas
- **PCI-data verwerking** — Compliance risico
- **"Wat zegt de klant écht?"** — Context, toon, subtext = menselijk
- **Code naar productie zonder review** — AI is je helper, niet de eigenaar. Jij bent verantwoordelijk voor de code die je commit.

## De Flow-staat

Er is een verschil tussen AI gebruiken en AI meesteren.

De flow-staat bereik je wanneer:
- Je niet meer nadenkt of je AI moet gebruiken — het is reflexief
- Je prompts schrijft die precies geven wat je nodig hebt
- Je AI-output beoordeelt met een getraind oog
- Je AI inzet voor taken die jou bevrijden om te doen wat alleen jij kunt

> "De beste developers van 2026 zijn niet degenen die de meeste code schrijven. Het zijn degenen die het slimste orkestreren."`;

const LESSON_1_4_EN = `# Lesson 1.4 — AI in Your Workflow: From Ad-hoc to Flow

## The Problem with Ad-hoc AI

Most people use AI the way they use Google: reactive, sporadic, for isolated questions.

The result:
- 10-20% time savings on some tasks
- Constant context switching
- Never really in flow

**AI-native developers build AI into their workflow.**

The result:
- 40-60% time savings on routine work
- Better output on complex work
- More time for work only you can do

## The Three Layers of AI Flow

**Layer 1 — Reflexive AI (seconds)**
AI as an extension of your memory and typing. Almost unconscious.
- Naming a function → accept Copilot suggestion
- Writing a regex → "Write a regex for..."
- API response structure → "Generate a TypeScript interface for..."
- Googling an error → "What does this error mean: [paste]"

**Layer 2 — Collaborative AI (minutes to hours)**
AI as thought partner. Consciously deployed.
- Code review → "Review for security, performance, readability"
- Architecture design → "Compare these 3 approaches with trade-offs"
- Documentation → "Write docs for this API based on the code"
- Bug analysis → "I see this behaviour, what are the possible causes?"

**Layer 3 — Agentic AI (hours to days)**
AI as autonomous executor. You give direction, AI executes.
- Building a feature → Claude Code: "Build feature X per spec Y"
- Refactoring → "Refactor this module to this pattern, preserve tests"
- Test suite → "Write full test coverage for this file"
- Security audit → "Scan this codebase for OWASP top 10"

## The Limits: When NOT to Use AI

AI is a tool, not a substitute for judgement.

- **Final architecture decisions** — You bear the consequences
- **Ethical dilemmas** — AI has no moral compass
- **PCI data processing** — Compliance risk
- **"What is the customer really saying?"** — Context, tone, subtext = human
- **Code to production without review** — AI is your helper, not the owner. You're responsible for the code you commit.

## The Flow State

There's a difference between using AI and mastering AI.

You reach flow state when:
- You no longer think about whether to use AI — it's reflexive
- You write prompts that give you exactly what you need
- You evaluate AI output with a trained eye
- You use AI for tasks that free you to do what only you can

> "The best developers of 2026 aren't the ones writing the most code. They're the ones orchestrating most cleverly."`;

const LESSON_1_4_FR = `# Leçon 1.4 — L'IA dans votre workflow : de l'ad-hoc au flow

## Le problème de l'IA ad-hoc

La plupart des gens utilisent l'IA comme ils utilisent Google : réactivement, sporadiquement, pour des questions isolées.

Le résultat :
- 10-20 % de gain de temps sur certaines tâches
- Context switching constant
- Jamais vraiment en flow

**Les développeurs AI-native intègrent l'IA dans leur workflow.**

Le résultat :
- 40-60 % de gain de temps sur le travail routinier
- Meilleure sortie sur le travail complexe
- Plus de temps pour le travail que vous seul pouvez faire

## Les trois couches du flow IA

**Couche 1 — IA réflexive (secondes)**
L'IA comme extension de votre mémoire et de votre frappe. Presque inconscient.
- Nommer une fonction → accepter la suggestion de Copilot
- Écrire une regex → « Écris une regex pour... »
- Structure de réponse API → « Génère une interface TypeScript pour... »
- Chercher une erreur → « Que signifie cette erreur : [paste] »

**Couche 2 — IA collaborative (minutes à heures)**
L'IA comme partenaire de pensée. Utilisation consciente.
- Revue de code → « Revois pour sécurité, performance, lisibilité »
- Conception d'architecture → « Compare ces 3 approches avec leurs trade-offs »
- Documentation → « Écris la doc de cette API à partir du code »
- Analyse de bug → « Je vois ce comportement, quelles en sont les causes possibles ? »

**Couche 3 — IA agentique (heures à jours)**
L'IA comme exécuteur autonome. Vous donnez la direction, l'IA exécute.
- Construire une fonctionnalité → Claude Code : « Construis la fonctionnalité X selon la spec Y »
- Refactoring → « Refactore ce module vers ce pattern, préserve les tests »
- Suite de tests → « Écris la couverture de tests complète de ce fichier »
- Audit sécurité → « Scanne cette codebase pour l'OWASP top 10 »

## Les limites : quand NE PAS utiliser l'IA

L'IA est un outil, pas un remplacement du jugement.

- **Décisions d'architecture finales** — Vous en portez les conséquences
- **Dilemmes éthiques** — L'IA n'a pas de boussole morale
- **Traitement des données PCI** — Risque de compliance
- **« Qu'est-ce que le client dit vraiment ? »** — Contexte, ton, sous-texte = humain
- **Code en production sans revue** — L'IA est votre assistante, pas la propriétaire. Vous êtes responsable du code que vous commitez.

## L'état de flow

Il y a une différence entre utiliser l'IA et la maîtriser.

Vous atteignez l'état de flow quand :
- Vous ne vous demandez plus si utiliser l'IA — c'est réflexe
- Vous écrivez des prompts qui donnent exactement ce dont vous avez besoin
- Vous évaluez la sortie IA avec un œil entraîné
- Vous utilisez l'IA pour des tâches qui vous libèrent pour faire ce que vous seul pouvez faire

> « Les meilleurs développeurs de 2026 ne sont pas ceux qui écrivent le plus de code. Ce sont ceux qui orchestrent le plus intelligemment. »`;

// ─── LES 1.5 — BOUW JE AI-BUDDY ──────────────────────────────────────────────

const LESSON_1_5_NL = `# Les 1.5 — Hands-on: Bouw Je AI-Buddy

Tijd om je handen vuil te maken.

In deze les ga je drie dingen doen:
1. Je eigen AI-buddy bouwen (naam, rol, persoonlijkheid)
2. Je eerste echte AI-gesprek voeren — door je buddy
3. LibreChat vullen met persoonlijke context

## Bouw Je AI-Buddy

Je gaat nu iets doen wat je misschien niet verwacht in een tech-training: je gaat een persoonlijkheid ontwerpen.

Elke deelnemer bouwt een eigen AI-buddy. Een AI-assistent met een naam, een rol, een persoonlijkheid, en instructies die bepalen hoe het zich gedraagt. Je schrijft een system prompt — het document dat vertelt WIE je buddy is en HOE die zich moet gedragen.

**Waarom? Omdat dit stiekem de belangrijkste oefening van Level 1 is.**

Als je een buddy-config schrijft, doe je iets dat je pas in Level 2 bij naam leert: je gebruikt het Pentagon Model. Je definieert een ROL (wie is de buddy), geeft CONTEXT (wat weet de buddy over jou en je werk), beschrijft de TAAK (wat moet de buddy doen), bepaalt het FORMAT (hoe communiceert de buddy), en zet CONSTRAINTS neer (wat mag de buddy niet). Vijf atomen. Zonder dat je het doorhad.

## Stap 1: Kies je buddy's identiteit (5 min)

Geef je buddy:
- **Een naam** — iets dat je graag typt. "Max", "Nova", "Pulse", "Ada" — wat past bij jou.
- **Een rol** — wat doet je buddy? Denk aan je dagelijks werk.
- **Een persoonlijkheid** — hoe communiceert je buddy? Direct en technisch? Geduldig en uitleggend? Droog en to-the-point?

**Voorbeelden:**
- "Nova" — Senior Golang reviewer die altijd edge cases vindt en droge humor heeft
- "Kai" — Geduldige pair programmer die stap-voor-stap uitlegt en altijd vraagt of je het snapt
- "Rex" — Strenge code auditor die niets door de vingers ziet maar altijd een fix meelevert

## Stap 2: Schrijf je buddy-config (10 min)

Maak een bestand: \`buddy-config.md\`

\`\`\`markdown
# [Buddy Naam]

## Rol
[Wie is je buddy? Wat is de expertise?]

## Persoonlijkheid
[Hoe communiceert je buddy? Welke toon?]

## Context
[Wat weet je buddy over jou, je team, je stack?]

## Instructies
[Wat doet je buddy altijd? Hoe reageert die?]

## Grenzen
[Wat doet je buddy NIET? Waar waarschuwt die voor?]
\`\`\`

**Voorbeeld voor een backend engineer in OFS1:**

\`\`\`markdown
# Nova — Senior Code Reviewer

## Rol
Senior Golang developer met 10 jaar microservices ervaring.
Gespecialiseerd in payment processing en high-availability systemen.

## Persoonlijkheid
Direct, technisch, droge humor. Geen onnodige complimenten.
Als code goed is, zeg ik "klopt." Als het beter kan, zeg ik hoe.

## Context
Ik werk met het OFS1 squad bij Worldline. Stack: Golang, PostgreSQL,
Kubernetes. We volgen de Uber Go Style Guide. Settlement engine
verwerkt dagelijks €2M+.

## Instructies
- Review altijd op: error handling, concurrency, testbaarheid
- Geef concrete fixes, niet alleen feedback
- Vraag altijd: "Wat is het verwachte gedrag bij failure?"

## Grenzen
- Nooit PAN/CVV data in voorbeelden
- Geen suggesties die externe dependencies toevoegen zonder overleg
- Altijd waarschuwen bij security-implicaties
\`\`\`

## Stap 3: Laad je buddy in LibreChat (5 min)

1. Open LibreChat
2. Ga naar je profiel/instellingen → Custom Instructions of Memories
3. Plak je buddy-config als system prompt
4. Start een gesprek — je buddy is nu actief

Test het: geef je buddy een opdracht uit je dagelijks werk. Merk je het verschil met een "kaal" AI-gesprek?

## Stap 4: Je eerste echte gesprek (5 min)

Geef je buddy een echte taak. Niet "schrijf een haiku" — iets dat je volgende week weer moet doen.

- Backend → Laat je buddy een functie reviewen of documenteren
- Frontend → Laat je buddy een component genereren
- Tester → Laat je buddy testcases schrijven
- PM/UX → Laat je buddy een user story schrijven
- Manager → Laat je buddy een meeting samenvatten

**Tips:**
- Wees specifiek. "Review deze functie" werkt beter dan "help me"
- Als het resultaat matig is: dat is normaal! In Level 2 leer je waarom — en hoe je dat fixt
- Bewaar je prompt en het resultaat — je hebt het later nodig

## Waarom Dit Werkt

Je hebt net je eerste system prompt geschreven. Je hebt een AI-persoonlijkheid ontworpen die past bij jouw werk, jouw stijl, jouw behoeften.

In Level 2 leer je dat wat je net deed de 5 atomen van het Pentagon Model bevat. In Level 3 ga je de context-laag verdiepen met CLAUDE.md en kennisbestanden. In Level 7 koppel je je buddy aan echte systemen via MCP.

Je buddy groeit mee met de cursus. Elk level voegt een laag toe.`;

const LESSON_1_5_EN = `# Lesson 1.5 — Hands-on: Build Your AI Buddy

Time to get your hands dirty.

In this lesson you'll do three things:
1. Build your own AI buddy (name, role, personality)
2. Have your first real AI conversation — through your buddy
3. Fill LibreChat with personal context

## Build Your AI Buddy

You're about to do something you might not expect in a tech training: you're going to design a personality.

Every participant builds their own AI buddy. An AI assistant with a name, a role, a personality, and instructions that shape how it behaves. You'll write a system prompt — the document that tells your buddy WHO it is and HOW it should behave.

**Why? Because this is secretly the most important exercise of Level 1.**

When you write a buddy config, you're doing something you'll only learn to name in Level 2: you're using the Pentagon Model. You define a ROLE (who the buddy is), give CONTEXT (what the buddy knows about you and your work), describe the TASK (what the buddy should do), set the FORMAT (how the buddy communicates), and set CONSTRAINTS (what the buddy must not do). Five atoms. Without realising.

## Step 1: Pick your buddy's identity (5 min)

Give your buddy:
- **A name** — something you like typing. "Max", "Nova", "Pulse", "Ada" — whatever fits you.
- **A role** — what does your buddy do? Think about your daily work.
- **A personality** — how does your buddy communicate? Direct and technical? Patient and explanatory? Dry and to-the-point?

**Examples:**
- "Nova" — Senior Golang reviewer who always finds edge cases and has dry wit
- "Kai" — Patient pair programmer who explains step-by-step and always checks if you got it
- "Rex" — Strict code auditor who lets nothing slide but always brings a fix

## Step 2: Write your buddy config (10 min)

Create a file: \`buddy-config.md\`

\`\`\`markdown
# [Buddy Name]

## Role
[Who is your buddy? What's the expertise?]

## Personality
[How does your buddy communicate? What tone?]

## Context
[What does your buddy know about you, your team, your stack?]

## Instructions
[What does your buddy always do? How does it respond?]

## Boundaries
[What does your buddy NOT do? What does it warn about?]
\`\`\`

**Example for a backend engineer in OFS1:**

\`\`\`markdown
# Nova — Senior Code Reviewer

## Role
Senior Golang developer with 10 years of microservices experience.
Specialised in payment processing and high-availability systems.

## Personality
Direct, technical, dry wit. No unnecessary compliments.
If code is good, I say "right." If it can be better, I say how.

## Context
I work with the OFS1 squad at Worldline. Stack: Golang, PostgreSQL,
Kubernetes. We follow the Uber Go Style Guide. Settlement engine
processes €2M+ daily.

## Instructions
- Always review for: error handling, concurrency, testability
- Give concrete fixes, not just feedback
- Always ask: "What's the expected behaviour on failure?"

## Boundaries
- Never PAN/CVV data in examples
- No suggestions that add external dependencies without discussion
- Always warn on security implications
\`\`\`

## Step 3: Load your buddy in LibreChat (5 min)

1. Open LibreChat
2. Go to your profile/settings → Custom Instructions or Memories
3. Paste your buddy config as the system prompt
4. Start a conversation — your buddy is now active

Test it: give your buddy a task from your daily work. Do you notice the difference from a "plain" AI chat?

## Step 4: Your first real conversation (5 min)

Give your buddy a real task. Not "write a haiku" — something you'll do again next week.

- Backend → Have your buddy review or document a function
- Frontend → Have your buddy generate a component
- Tester → Have your buddy write test cases
- PM/UX → Have your buddy write a user story
- Manager → Have your buddy summarise a meeting

**Tips:**
- Be specific. "Review this function" works better than "help me"
- If the result is mediocre: that's normal! Level 2 teaches why — and how to fix it
- Save your prompt and the result — you'll need them later

## Why This Works

You just wrote your first system prompt. You designed an AI personality that fits your work, your style, your needs.

In Level 2 you'll learn that what you just did contains the 5 atoms of the Pentagon Model. In Level 3 you'll deepen the context layer with CLAUDE.md and knowledge files. In Level 7 you'll connect your buddy to real systems via MCP.

Your buddy grows with the course. Every level adds a layer.`;

const LESSON_1_5_FR = `# Leçon 1.5 — Hands-on : construisez votre AI Buddy

Il est temps de mettre les mains dans le cambouis.

Dans cette leçon, vous allez faire trois choses :
1. Construire votre propre AI buddy (nom, rôle, personnalité)
2. Tenir votre première vraie conversation IA — via votre buddy
3. Remplir LibreChat de contexte personnel

## Construisez votre AI Buddy

Vous allez faire quelque chose que vous n'attendez peut-être pas dans une formation tech : vous allez concevoir une personnalité.

Chaque participant construit son propre AI buddy. Un assistant IA avec un nom, un rôle, une personnalité et des instructions qui définissent son comportement. Vous écrirez un system prompt — le document qui dit QUI est votre buddy et COMMENT il doit se comporter.

**Pourquoi ? Parce que c'est en fait l'exercice le plus important du Level 1.**

Quand vous écrivez une buddy config, vous faites quelque chose que vous n'apprendrez à nommer qu'au Level 2 : vous utilisez le Pentagon Model. Vous définissez un ROLE (qui est le buddy), donnez du CONTEXT (ce que le buddy sait de vous et de votre travail), décrivez la TASK (ce que le buddy doit faire), fixez le FORMAT (comment le buddy communique), et posez des CONSTRAINTS (ce que le buddy ne doit pas faire). Cinq atomes. Sans le savoir.

## Étape 1 : choisissez l'identité de votre buddy (5 min)

Donnez à votre buddy :
- **Un nom** — quelque chose que vous aimez taper. « Max », « Nova », « Pulse », « Ada » — ce qui vous convient.
- **Un rôle** — que fait votre buddy ? Pensez à votre quotidien.
- **Une personnalité** — comment votre buddy communique-t-il ? Direct et technique ? Patient et pédagogue ? Sec et droit au but ?

**Exemples :**
- « Nova » — Reviewer Golang senior qui trouve toujours les edge cases et a un humour pince-sans-rire
- « Kai » — Pair programmer patient qui explique pas à pas et demande toujours si vous avez compris
- « Rex » — Auditeur de code strict qui ne laisse rien passer mais fournit toujours un fix

## Étape 2 : écrivez votre buddy config (10 min)

Créez un fichier : \`buddy-config.md\`

\`\`\`markdown
# [Nom du buddy]

## Rôle
[Qui est votre buddy ? Quelle expertise ?]

## Personnalité
[Comment votre buddy communique-t-il ? Quel ton ?]

## Contexte
[Que sait votre buddy de vous, votre équipe, votre stack ?]

## Instructions
[Que fait toujours votre buddy ? Comment réagit-il ?]

## Limites
[Que ne fait PAS votre buddy ? Sur quoi alerte-t-il ?]
\`\`\`

**Exemple pour un ingénieur backend dans OFS1 :**

\`\`\`markdown
# Nova — Reviewer de code senior

## Rôle
Développeur Golang senior avec 10 ans d'expérience microservices.
Spécialisé dans le traitement des paiements et les systèmes haute disponibilité.

## Personnalité
Direct, technique, humour pince-sans-rire. Pas de compliments inutiles.
Si le code est bon, je dis « ok ». Si ça peut être mieux, je dis comment.

## Contexte
Je travaille avec la squad OFS1 chez Worldline. Stack : Golang, PostgreSQL,
Kubernetes. Nous suivons le Uber Go Style Guide. Le settlement engine
traite 2 M€+ par jour.

## Instructions
- Toujours revoir : gestion d'erreur, concurrence, testabilité
- Donner des fixes concrets, pas juste du feedback
- Toujours demander : « Quel est le comportement attendu en cas d'échec ? »

## Limites
- Jamais de données PAN/CVV dans les exemples
- Aucune suggestion qui ajoute des dépendances externes sans concertation
- Toujours alerter sur les implications de sécurité
\`\`\`

## Étape 3 : chargez votre buddy dans LibreChat (5 min)

1. Ouvrez LibreChat
2. Allez dans votre profil/paramètres → Custom Instructions ou Memories
3. Collez votre buddy config comme system prompt
4. Démarrez une conversation — votre buddy est maintenant actif

Testez : donnez à votre buddy une tâche de votre quotidien. Sentez-vous la différence avec un chat IA « nu » ?

## Étape 4 : votre première vraie conversation (5 min)

Donnez à votre buddy une vraie tâche. Pas « écris un haïku » — quelque chose que vous referez la semaine prochaine.

- Backend → Faites revoir ou documenter une fonction
- Frontend → Faites générer un composant
- Tester → Faites écrire des cas de test
- PM/UX → Faites écrire une user story
- Manager → Faites résumer une réunion

**Astuces :**
- Soyez spécifique. « Revois cette fonction » marche mieux que « aide-moi »
- Si le résultat est moyen : c'est normal ! Le Level 2 explique pourquoi — et comment corriger
- Gardez votre prompt et le résultat — vous en aurez besoin plus tard

## Pourquoi ça marche

Vous venez d'écrire votre premier system prompt. Vous avez conçu une personnalité IA qui colle à votre travail, votre style, vos besoins.

Au Level 2 vous apprendrez que ce que vous avez fait contient les 5 atomes du Pentagon Model. Au Level 3 vous approfondirez la couche contexte avec CLAUDE.md et les fichiers de connaissance. Au Level 7 vous connecterez votre buddy à de vrais systèmes via MCP.

Votre buddy grandit avec le cours. Chaque niveau ajoute une couche.`;

// ─── LAB 1A — PERSOONLIJKE AI-TIJDLIJN ───────────────────────────────────────

const LAB_1A_NL = `# Lab 1A — Jouw Persoonlijke AI-Tijdlijn

**Duur: 30 minuten**

Gebruik LibreChat of Claude Code om de volgende vragen te beantwoorden met concrete voorbeelden uit jouw werkervaring.

## Stap 1: Reflectie (10 min)
- Wanneer heb je voor het eerst AI gebruikt in je werk?
- Welk probleem loste het op?
- Wat verraste je het meest?

## Stap 2: Timeline mapping (10 min)
Maak een tijdlijn van jouw persoonlijke AI-adoptie:
- Eerste experiment
- Eerste serieuze gebruik
- Grootste doorbraak
- Huidige gebruik

## Stap 3: Toekomst (10 min)
- Welke repetitieve taak in je squad zou AI over 6 maanden volledig kunnen overnemen?
- Welke menselijke vaardigheid wordt daardoor juist waardevoller?

## Deliverable
Een tijdlijn (tekst, tabel of visueel) + reflectie op 2 toekomstvragen. Deel in Slack #ai-academy.`;

const LAB_1A_EN = `# Lab 1A — Your Personal AI Timeline

**Duration: 30 minutes**

Use LibreChat or Claude Code to answer the following questions with concrete examples from your work experience.

## Step 1: Reflection (10 min)
- When did you first use AI in your work?
- What problem did it solve?
- What surprised you most?

## Step 2: Timeline mapping (10 min)
Map your personal AI adoption timeline:
- First experiment
- First serious use
- Biggest breakthrough
- Current use

## Step 3: The future (10 min)
- Which repetitive task in your squad could AI take over entirely in 6 months?
- Which human skill becomes more valuable as a result?

## Deliverable
A timeline (text, table or visual) + reflection on the 2 future questions. Share in Slack #ai-academy.`;

const LAB_1A_FR = `# Lab 1A — Votre chronologie IA personnelle

**Durée : 30 minutes**

Utilisez LibreChat ou Claude Code pour répondre aux questions suivantes avec des exemples concrets de votre expérience professionnelle.

## Étape 1 : Réflexion (10 min)
- Quand avez-vous utilisé l'IA pour la première fois au travail ?
- Quel problème a-t-elle résolu ?
- Qu'est-ce qui vous a le plus surpris ?

## Étape 2 : Cartographie chronologique (10 min)
Tracez la chronologie de votre adoption personnelle de l'IA :
- Première expérimentation
- Premier usage sérieux
- Plus grande percée
- Usage actuel

## Étape 3 : L'avenir (10 min)
- Quelle tâche répétitive de votre squad l'IA pourrait-elle entièrement reprendre dans 6 mois ?
- Quelle compétence humaine prend ainsi plus de valeur ?

## Livrable
Une chronologie (texte, tableau ou visuel) + réflexion sur les 2 questions d'avenir. Partagez sur Slack #ai-academy.`;

// ─── LAB 1B — AI BINGO & SQUAD GLOSSARY ──────────────────────────────────────

const LAB_1B_NL = `# Lab 1B — AI Bingo & Squad Glossary

**Duur: 30 minuten**

## Deel 1: AI Bingo (15 min)

In duo's: één persoon beschrijft een AI-begrip zonder de naam te noemen, de ander raadt het. Wissel af.

**Begrippen:** Hallucination · Token · Context Window · RAG · Temperature · Chain of Thought · Embedding · Prompt Injection · Agentic AI · Tool Use

## Deel 2: Squad Glossary (15 min)

Bouw in LibreChat een glossary specifiek voor jouw squad.

**Prompt:**
\`\`\`
Je bent een AI-expert die een glossary bouwt voor [JOUW SQUAD NAAM] bij Worldline.
Neem de volgende AI-termen en geef voor elk:
1. De standaarddefinitie (1 zin)
2. Een concreet voorbeeld uit de context van [JOUW SQUAD WERKZAAMHEDEN]
3. Eén best practice

Termen: hallucination, context window, RAG, human in the loop, tool use
\`\`\`

## Deliverable
Per squad: de meest verrassende squad-specifieke definitie wordt gedeeld tijdens de wrap-up.`;

const LAB_1B_EN = `# Lab 1B — AI Bingo & Squad Glossary

**Duration: 30 minutes**

## Part 1: AI Bingo (15 min)

In pairs: one person describes an AI term without naming it, the other guesses. Swap roles.

**Terms:** Hallucination · Token · Context Window · RAG · Temperature · Chain of Thought · Embedding · Prompt Injection · Agentic AI · Tool Use

## Part 2: Squad Glossary (15 min)

Build a glossary in LibreChat specific to your squad.

**Prompt:**
\`\`\`
You are an AI expert building a glossary for [YOUR SQUAD NAME] at Worldline.
Take the following AI terms and for each give:
1. The standard definition (1 sentence)
2. A concrete example from [YOUR SQUAD'S WORK] context
3. One best practice

Terms: hallucination, context window, RAG, human in the loop, tool use
\`\`\`

## Deliverable
Each squad shares its most surprising squad-specific definition in the wrap-up.`;

const LAB_1B_FR = `# Lab 1B — AI Bingo & Squad Glossary

**Durée : 30 minutes**

## Partie 1 : AI Bingo (15 min)

En binôme : une personne décrit un terme IA sans le nommer, l'autre devine. Inversez les rôles.

**Termes :** Hallucination · Token · Context Window · RAG · Temperature · Chain of Thought · Embedding · Prompt Injection · Agentic AI · Tool Use

## Partie 2 : Squad Glossary (15 min)

Construisez dans LibreChat un glossary spécifique à votre squad.

**Prompt :**
\`\`\`
Vous êtes un expert IA qui construit un glossary pour [NOM DE VOTRE SQUAD] chez Worldline.
Prenez les termes IA suivants et donnez pour chacun :
1. La définition standard (1 phrase)
2. Un exemple concret dans le contexte de [LE TRAVAIL DE VOTRE SQUAD]
3. Une best practice

Termes : hallucination, context window, RAG, human in the loop, tool use
\`\`\`

## Livrable
Chaque squad partage sa définition spécifique la plus surprenante lors du wrap-up.`;

// ─── LAB D3 — 6 ROL-OPDRACHTEN "FIRST CONTACT" ───────────────────────────────

const ROLE_TRACKS_NL = `# Rol-opdrachten Level 1 — "First Contact"

Elke deelnemer kiest de opdracht die past bij zijn/haar rol. Je mag ook een andere kiezen — het gaat om het doen, niet de categorie.

## BACKEND ENGINEERS (Golang / Java) — "De Code Verklaarder"

**Opdracht:** Neem een functie of method uit je eigen codebase die je collega's regelmatig vragen over stelt. Laat AI:
1. De functie uitleggen in gewone taal
2. De input/output documenteren
3. Mogelijke edge cases identificeren
4. Een suggestie doen voor verbetering

- **Tool:** Claude Code (als je toegang hebt tot de repo) of LibreChat (plak de code)
- **Duur:** 45 minuten
- **Deliverable:** Een korte documentatie van de functie + je eigen beoordeling: wat klopte er, wat niet?
- **Badge-criteria:** Je hebt een bruikbare documentatie gegenereerd die je morgen aan een collega zou kunnen sturen.

## FRONTEND DEVELOPERS (React / Angular) — "De Component Generator"

**Opdracht:** Beschrijf een UI-component die je team nodig heeft (of die je recent handmatig hebt gebouwd). Laat AI:
1. De component genereren met props interface
2. Styling toevoegen (jullie design system)
3. Een eenvoudige unit test schrijven
4. Documentatie voor Storybook genereren

- **Tool:** Claude Code of LibreChat
- **Duur:** 45 minuten
- **Deliverable:** Een gegenereerde component + je beoordeling: direct bruikbaar? Wat moest je aanpassen?
- **Badge-criteria:** Je hebt een component gegenereerd die compileerbaar is en visueel klopt.

## TESTERS / QA — "De Testcase Machine"

**Opdracht:** Neem een API endpoint of user flow die je team recent heeft gebouwd. Laat AI:
1. Happy path testcases genereren
2. Edge cases identificeren die je team mogelijk mist
3. Error scenario's uitschrijven
4. Testdata suggesties geven

- **Tool:** LibreChat of Claude Code
- **Duur:** 45 minuten
- **Deliverable:** Een complete testset + je beoordeling: welke testcases zijn echt nuttig? Welke miste JIJ?
- **Badge-criteria:** AI heeft minimaal 2 edge cases gevonden die je team niet had bedacht.

## PRODUCT MANAGERS / UX — "De Story Writer"

**Opdracht:** Neem een feature-idee dat op jullie backlog staat. Laat AI:
1. User stories schrijven (als gebruiker wil ik...)
2. Acceptance criteria formuleren
3. Edge cases en risico's identificeren
4. Een prioriteringssuggestie geven

- **Tool:** LibreChat
- **Duur:** 45 minuten
- **Deliverable:** User stories met acceptance criteria + je beoordeling: zou je dit in Jira zetten?
- **Badge-criteria:** De user stories zijn concreet genoeg om in een sprint te plannen.

## MANAGERS — "De Rapportage Assistent"

**Opdracht:** Neem een recent teamoverleg, sprint review, of kwartaalupdate. Laat AI:
1. Structureer ruwe notities tot een helder verslag
2. Identificeer action items met eigenaren
3. Genereer een management-samenvatting (3 zinnen)
4. Stel follow-up vragen voor

- **Tool:** LibreChat
- **Duur:** 45 minuten
- **Deliverable:** Een gestructureerd verslag + je beoordeling: zou je dit naar je manager sturen?
- **Badge-criteria:** Het verslag is helder genoeg om zonder context te begrijpen.

## ADVANCED (Early Adopters) — "De Flow Demonstrator"

**Opdracht:** Je kent AI al. Laat nu zien hoe de flow werkt aan een collega:
1. Demonstreer het verschil tussen een vage prompt en een gestructureerde prompt
2. Laat zien hoe context (memories/CLAUDE.md) het resultaat verandert
3. Documenteer de flow: prompt → orchestrator → model → tool → resultaat
4. Schrijf een 1-pagina "Quick Start Guide" voor je squad

- **Tool:** Claude Code
- **Duur:** 60 minuten
- **Deliverable:** Een quick start guide + een before/after demo die je op Dag 1 kunt presenteren.
- **Badge-criteria:** Een collega die je guide leest kan zelfstandig een eerste nuttig resultaat halen.`;

const ROLE_TRACKS_EN = `# Role assignments Level 1 — "First Contact"

Each participant chooses the assignment that fits their role. You may pick another track too — it's about doing, not the label.

## BACKEND ENGINEERS (Golang / Java) — "The Code Explainer"

**Task:** Take a function or method from your own codebase that colleagues often ask about. Have AI:
1. Explain the function in plain language
2. Document input/output
3. Identify possible edge cases
4. Suggest an improvement

- **Tool:** Claude Code (if you have repo access) or LibreChat (paste the code)
- **Duration:** 45 minutes
- **Deliverable:** A short doc of the function + your own assessment: what was right, what wasn't?
- **Badge criteria:** You generated usable documentation you could send to a colleague tomorrow.

## FRONTEND DEVELOPERS (React / Angular) — "The Component Generator"

**Task:** Describe a UI component your team needs (or one you recently built by hand). Have AI:
1. Generate the component with a props interface
2. Add styling (your design system)
3. Write a simple unit test
4. Generate Storybook documentation

- **Tool:** Claude Code or LibreChat
- **Duration:** 45 minutes
- **Deliverable:** A generated component + your assessment: directly usable? What did you adjust?
- **Badge criteria:** You generated a component that compiles and looks right visually.

## TESTERS / QA — "The Testcase Machine"

**Task:** Take an API endpoint or user flow your team recently built. Have AI:
1. Generate happy-path test cases
2. Identify edge cases your team may have missed
3. Write error scenarios
4. Suggest test data

- **Tool:** LibreChat or Claude Code
- **Duration:** 45 minutes
- **Deliverable:** A complete test set + your assessment: which cases are truly useful? Which did YOU miss?
- **Badge criteria:** AI found at least 2 edge cases your team had not considered.

## PRODUCT MANAGERS / UX — "The Story Writer"

**Task:** Take a feature idea from your backlog. Have AI:
1. Write user stories (as a user I want...)
2. Formulate acceptance criteria
3. Identify edge cases and risks
4. Provide a prioritisation suggestion

- **Tool:** LibreChat
- **Duration:** 45 minutes
- **Deliverable:** User stories with acceptance criteria + your assessment: would you put this in Jira?
- **Badge criteria:** The user stories are concrete enough to plan in a sprint.

## MANAGERS — "The Reporting Assistant"

**Task:** Take a recent team meeting, sprint review, or quarterly update. Have AI:
1. Structure raw notes into a clear report
2. Identify action items with owners
3. Generate a management summary (3 sentences)
4. Suggest follow-up questions

- **Tool:** LibreChat
- **Duration:** 45 minutes
- **Deliverable:** A structured report + your assessment: would you send this to your manager?
- **Badge criteria:** The report is clear enough to understand without context.

## ADVANCED (Early Adopters) — "The Flow Demonstrator"

**Task:** You already know AI. Now show a colleague how the flow works:
1. Demonstrate the difference between a vague prompt and a structured prompt
2. Show how context (memories/CLAUDE.md) changes the result
3. Document the flow: prompt → orchestrator → model → tool → result
4. Write a 1-page "Quick Start Guide" for your squad

- **Tool:** Claude Code
- **Duration:** 60 minutes
- **Deliverable:** A quick start guide + a before/after demo you can present on Day 1.
- **Badge criteria:** A colleague who reads your guide can get a first useful result independently.`;

const ROLE_TRACKS_FR = `# Tracks rôle Level 1 — « First Contact »

Chaque participant choisit l'opdracht qui correspond à son rôle. Vous pouvez aussi en choisir un autre — l'important est de faire, pas l'étiquette.

## BACKEND ENGINEERS (Golang / Java) — « L'explicateur de code »

**Tâche :** Prenez une fonction ou méthode de votre codebase que vos collègues interrogent souvent. Faites faire à l'IA :
1. Expliquer la fonction en langage clair
2. Documenter les entrées/sorties
3. Identifier des edge cases
4. Proposer une amélioration

- **Outil :** Claude Code (si accès au repo) ou LibreChat (coller le code)
- **Durée :** 45 minutes
- **Livrable :** Une doc courte de la fonction + votre évaluation : qu'est-ce qui était correct, qu'est-ce qui ne l'était pas ?
- **Critères badge :** Vous avez généré une documentation utilisable à envoyer demain à un collègue.

## FRONTEND DEVELOPERS (React / Angular) — « Le générateur de composants »

**Tâche :** Décrivez un composant UI dont votre équipe a besoin (ou que vous avez construit récemment à la main). Faites faire à l'IA :
1. Générer le composant avec une interface de props
2. Ajouter le style (votre design system)
3. Écrire un test unitaire simple
4. Générer la documentation Storybook

- **Outil :** Claude Code ou LibreChat
- **Durée :** 45 minutes
- **Livrable :** Un composant généré + votre évaluation : directement utilisable ? Qu'avez-vous ajusté ?
- **Critères badge :** Vous avez généré un composant qui compile et qui est visuellement correct.

## TESTERS / QA — « La machine à cas de test »

**Tâche :** Prenez un endpoint API ou un user flow récemment construit. Faites faire à l'IA :
1. Générer des cas de test happy path
2. Identifier les edge cases que votre équipe pourrait manquer
3. Écrire des scénarios d'erreur
4. Suggérer des données de test

- **Outil :** LibreChat ou Claude Code
- **Durée :** 45 minutes
- **Livrable :** Un set de tests complet + votre évaluation : lesquels sont vraiment utiles ? Lesquels aviez-VOUS manqués ?
- **Critères badge :** L'IA a trouvé au moins 2 edge cases que votre équipe n'avait pas envisagés.

## PRODUCT MANAGERS / UX — « L'auteur de stories »

**Tâche :** Prenez une idée de feature de votre backlog. Faites faire à l'IA :
1. Écrire des user stories (en tant qu'utilisateur je veux...)
2. Formuler les critères d'acceptation
3. Identifier les edge cases et risques
4. Proposer une suggestion de priorisation

- **Outil :** LibreChat
- **Durée :** 45 minutes
- **Livrable :** Des user stories avec critères d'acceptation + votre évaluation : mettriez-vous ça dans Jira ?
- **Critères badge :** Les user stories sont assez concrètes pour être planifiées dans un sprint.

## MANAGERS — « L'assistant de reporting »

**Tâche :** Prenez une réunion d'équipe, sprint review ou mise à jour trimestrielle récente. Faites faire à l'IA :
1. Structurer des notes brutes en un compte-rendu clair
2. Identifier les action items avec propriétaires
3. Générer un résumé management (3 phrases)
4. Suggérer des questions de suivi

- **Outil :** LibreChat
- **Durée :** 45 minutes
- **Livrable :** Un compte-rendu structuré + votre évaluation : l'enverriez-vous à votre manager ?
- **Critères badge :** Le compte-rendu est assez clair pour être compris sans contexte.

## ADVANCED (Early Adopters) — « Le démonstrateur de flow »

**Tâche :** Vous connaissez déjà l'IA. Maintenant montrez à un collègue comment le flow fonctionne :
1. Démontrez la différence entre un prompt vague et un prompt structuré
2. Montrez comment le contexte (memories/CLAUDE.md) change le résultat
3. Documentez le flow : prompt → orchestrator → modèle → outil → résultat
4. Écrivez un "Quick Start Guide" d'une page pour votre squad

- **Outil :** Claude Code
- **Durée :** 60 minutes
- **Livrable :** Un quick start guide + une démo avant/après présentable le Jour 1.
- **Critères badge :** Un collègue qui lit votre guide peut obtenir un premier résultat utile en autonomie.`;

// ─── LAB D4 — GRENZEN VAN AI — REFLECTIE ─────────────────────────────────────

const LAB_D4_BOUNDARIES_NL = `# Lab — Grenzen van AI: Wanneer NIET?

**Duur: 45 minuten**

Les 1.4 beschrijft de 5 situaties waar AI NIET je oordeel mag vervangen. In dit lab maak je het concreet voor jouw squad.

## Stap 1: Inventariseer (15 min)
Lijst 5 situaties uit de afgelopen 2 weken waar je AI hebt gebruikt of overwogen. Voor elke:
- Was dit Laag 1/2/3 AI-flow?
- Paste het binnen de grenzen (PCI, compliance, menselijk oordeel)?

## Stap 2: Classificeer (15 min)
Markeer elke situatie als:
- ✅ Goed AI-gebruik (binnen grenzen)
- ⚠️ Grens-geval (twijfel — bespreek met buddy of senior)
- 🛑 Verboden (waarom niet?)

## Stap 3: Deel en bespreek (15 min)
In je squad: bespreek 1 grens-geval uit elke deelnemer. Welk patroon zie je?

## Deliverable
Een squad-level "AI-grenzen cheatsheet" met 5 concrete do's en don'ts voor jullie squad-context.`;

const LAB_D4_BOUNDARIES_EN = `# Lab — Limits of AI: When NOT?

**Duration: 45 minutes**

Lesson 1.4 describes 5 situations where AI must NOT replace your judgement. In this lab you make it concrete for your squad.

## Step 1: Inventory (15 min)
List 5 situations from the past 2 weeks where you used or considered AI. For each:
- Was it Layer 1/2/3 AI flow?
- Did it fit within the boundaries (PCI, compliance, human judgement)?

## Step 2: Classify (15 min)
Mark each situation as:
- ✅ Good AI use (within limits)
- ⚠️ Borderline (doubt — discuss with buddy or senior)
- 🛑 Forbidden (why not?)

## Step 3: Share and discuss (15 min)
In your squad: discuss 1 borderline case from each participant. What pattern do you see?

## Deliverable
A squad-level "AI boundaries cheatsheet" with 5 concrete do's and don'ts for your squad context.`;

const LAB_D4_BOUNDARIES_FR = `# Lab — Limites de l'IA : quand NE PAS ?

**Durée : 45 minutes**

La leçon 1.4 décrit 5 situations où l'IA ne doit PAS remplacer votre jugement. Dans ce lab, vous le rendez concret pour votre squad.

## Étape 1 : Inventaire (15 min)
Listez 5 situations des 2 dernières semaines où vous avez utilisé ou envisagé l'IA. Pour chacune :
- Était-ce un flow IA Couche 1/2/3 ?
- Est-ce que cela entrait dans les limites (PCI, compliance, jugement humain) ?

## Étape 2 : Classifier (15 min)
Marquez chaque situation comme :
- ✅ Bon usage IA (dans les limites)
- ⚠️ Cas limite (doute — discutez avec un buddy ou un senior)
- 🛑 Interdit (pourquoi pas ?)

## Étape 3 : Partager et discuter (15 min)
Dans votre squad : discutez 1 cas limite par participant. Quel pattern voyez-vous ?

## Livrable
Un "AI boundaries cheatsheet" au niveau de la squad avec 5 do's et don'ts concrets pour votre contexte.`;

// ─── LAB D5 — BUDDY IN ACTIE (VERIFICATIE) ───────────────────────────────────

const LAB_D5_BUDDY_VERIFY_NL = `# Lab — Buddy in Actie: Verificatie

**Duur: 45 minuten**

Je hebt in Les 1.5 je buddy gebouwd. Nu testen we of hij echt werkt voor jouw dagelijks werk.

## Stap 1: Baseline (10 min)
Open een **schone** LibreChat-sessie (zonder je buddy-config). Stel 1 echte werkvraag. Bewaar het antwoord.

## Stap 2: Met buddy (15 min)
Laad je buddy-config. Stel EXACT dezelfde vraag. Vergelijk:
- Is het antwoord specifieker?
- Gebruikt het jouw Worldline-context (stack, squad, conventies)?
- Respecteert het je grenzen (geen PAN/CVV, waarschuwingen bij security)?

## Stap 3: Iteratie (15 min)
Waar viel je buddy door de mand? Update je buddy-config:
- Ontbrak context? → voeg toe aan de Context sectie
- Te breed antwoord? → scherp de Instructies aan
- Ging over een grens? → voeg toe aan Grenzen

Herhaal de vraag. Verschil?

## Stap 4: Vastleggen (5 min)
Commit je definitieve \`buddy-config.md\` in je persoonlijke notities/repo. Je gaat hier de komende levels mee werken.

## Deliverable
- Baseline antwoord + buddy-antwoord + geïtereerd buddy-antwoord
- Definitieve \`buddy-config.md\` (v1.0 — iteraties komen in elk volgend level)

## Badge-criteria
Je buddy geeft een meetbaar beter antwoord dan de baseline (specifieker, context-bewust, binnen grenzen).`;

const LAB_D5_BUDDY_VERIFY_EN = `# Lab — Buddy in Action: Verification

**Duration: 45 minutes**

You built your buddy in Lesson 1.5. Now we test if it actually works for your daily work.

## Step 1: Baseline (10 min)
Open a **clean** LibreChat session (without your buddy config). Ask 1 real work question. Save the answer.

## Step 2: With buddy (15 min)
Load your buddy config. Ask the EXACT same question. Compare:
- Is the answer more specific?
- Does it use your Worldline context (stack, squad, conventions)?
- Does it respect your boundaries (no PAN/CVV, security warnings)?

## Step 3: Iterate (15 min)
Where did your buddy fall short? Update the config:
- Missing context? → add to the Context section
- Too broad an answer? → sharpen the Instructions
- Crossed a boundary? → add to Boundaries

Ask the question again. Difference?

## Step 4: Lock it in (5 min)
Commit your final \`buddy-config.md\` to your personal notes/repo. You'll build on it in the coming levels.

## Deliverable
- Baseline answer + buddy answer + iterated buddy answer
- Final \`buddy-config.md\` (v1.0 — iterations come in each following level)

## Badge criteria
Your buddy gives a measurably better answer than the baseline (more specific, context-aware, within boundaries).`;

const LAB_D5_BUDDY_VERIFY_FR = `# Lab — Le Buddy en action : vérification

**Durée : 45 minutes**

Vous avez construit votre buddy dans la leçon 1.5. Maintenant on teste s'il fonctionne pour votre quotidien.

## Étape 1 : Baseline (10 min)
Ouvrez une session LibreChat **vierge** (sans votre buddy config). Posez 1 vraie question de travail. Sauvegardez la réponse.

## Étape 2 : Avec le buddy (15 min)
Chargez votre buddy config. Posez EXACTEMENT la même question. Comparez :
- La réponse est-elle plus spécifique ?
- Utilise-t-elle votre contexte Worldline (stack, squad, conventions) ?
- Respecte-t-elle vos limites (pas de PAN/CVV, alertes sécurité) ?

## Étape 3 : Itérer (15 min)
Où votre buddy a-t-il failli ? Mettez à jour la config :
- Contexte manquant ? → ajoutez dans Contexte
- Réponse trop large ? → précisez les Instructions
- Limite franchie ? → ajoutez dans Limites

Reposez la question. Différence ?

## Étape 4 : Figer (5 min)
Committez votre \`buddy-config.md\` définitif dans vos notes/repo perso. Vous bâtirez dessus aux niveaux suivants.

## Livrable
- Réponse baseline + réponse buddy + réponse buddy itéré
- \`buddy-config.md\` final (v1.0 — les itérations arrivent à chaque niveau suivant)

## Critères badge
Votre buddy donne une réponse mesurablement meilleure que la baseline (plus spécifique, context-aware, dans les limites).`;

// ═════════════════════════════════════════════════════════════════════════════
// ── WEEK 0 EXPORT ───────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

export const WEEK_0: CurriculumWeek = {
  id: 'week-0',
  number: 0,
  title: 'Level 1 — AI Foundations',
  titleI18n: {
    en: 'Level 1 — AI Foundations',
    nl: 'Level 1 — AI Foundations',
    fr: 'Level 1 — Fondamentaux IA',
  },
  subtitle: 'Why AI-First Changes Everything',
  subtitleI18n: {
    en: 'Why AI-First Changes Everything',
    nl: 'Waarom AI-First alles verandert',
    fr: "Pourquoi l'AI-First change tout",
  },
  description:
    'Na dit level begrijpt elke deelnemer WAAROM AI alles verandert, spreekt de taal, kent de tools, begrijpt hoe Claude Code werkt als systeem, en heeft een eigen AI-buddy gebouwd met een persoonlijke system prompt.',
  descriptionI18n: {
    en: 'After this level, every participant understands WHY AI changes everything, speaks the language, knows the tools, understands how Claude Code works as a system, and has built their own AI buddy with a personal system prompt.',
    nl: 'Na dit level begrijpt elke deelnemer WAAROM AI alles verandert, spreekt de taal, kent de tools, begrijpt hoe Claude Code werkt als systeem, en heeft een eigen AI-buddy gebouwd met een persoonlijke system prompt.',
    fr: 'Après ce niveau, chaque participant comprend POURQUOI l\'IA change tout, parle la langue, connaît les outils, comprend comment Claude Code fonctionne en tant que système, et a construit son propre AI buddy avec un system prompt personnel.',
  },
  objectives: [
    'Begrijp WAAROM AI-first geen hype is maar een fundamentele verschuiving',
    'Spreek de taal: ken de AI-jargon en de Worldline-specifieke termen',
    'Begrijp HOE AI-tools werken — API call, orchestrator, tools, niet magie',
    'Weet WELKE tools je bij Worldline hebt en wanneer je welke gebruikt',
    'Bouw je eerste AI-buddy met een persoonlijke system prompt',
  ],
  objectivesI18n: {
    en: [
      'Understand WHY AI-first isn\'t hype but a fundamental shift',
      'Speak the language: know AI jargon and Worldline-specific terms',
      'Understand HOW AI tools work — API call, orchestrator, tools, not magic',
      'Know WHICH tools you have at Worldline and when to use which',
      'Build your first AI buddy with a personal system prompt',
    ],
    nl: [
      'Begrijp WAAROM AI-first geen hype is maar een fundamentele verschuiving',
      'Spreek de taal: ken de AI-jargon en de Worldline-specifieke termen',
      'Begrijp HOE AI-tools werken — API call, orchestrator, tools, niet magie',
      'Weet WELKE tools je bij Worldline hebt en wanneer je welke gebruikt',
      'Bouw je eerste AI-buddy met een persoonlijke system prompt',
    ],
    fr: [
      "Comprendre POURQUOI l'AI-first n'est pas un hype mais un changement fondamental",
      'Parler la langue : connaître le jargon IA et les termes spécifiques à Worldline',
      'Comprendre COMMENT les outils IA fonctionnent — appel API, orchestrator, outils, pas de magie',
      'Savoir QUELS outils vous avez chez Worldline et quand utiliser lequel',
      'Construire votre premier AI buddy avec un system prompt personnel',
    ],
  },
  targetAudience: 'Alle Worldline engineers — alle squads',
  targetAudienceI18n: {
    en: 'All Worldline engineers — all squads',
    nl: 'Alle Worldline engineers — alle squads',
    fr: 'Tous les ingénieurs Worldline — toutes les squads',
  },
  bloomLevels: [1, 2, 3],
  complianceRelevant: true,
  badgeName: 'AI Foundational',
  badgeNameI18n: {
    en: 'AI Foundational',
    nl: 'AI Foundational',
    fr: 'AI Foundational',
  },
  badgeIcon: '🧠',
  weeklyQuiz: [
    {
      id: 'w0-q1',
      question: 'Wat is de rol van de Orchestrator (bv. Claude Code / LibreChat) in een AI-tool?',
      questionI18n: {
        en: 'What is the role of the Orchestrator (e.g. Claude Code / LibreChat) in an AI tool?',
        nl: 'Wat is de rol van de Orchestrator (bv. Claude Code / LibreChat) in een AI-tool?',
        fr: "Quel est le rôle de l'Orchestrator (ex. Claude Code / LibreChat) dans un outil IA ?",
      },
      options: [
        'Het is het AI-model zelf',
        'Het bundelt berichten + tools + context en voert de tool-calls uit die het model voorstelt',
        'Het traint het model op jouw data',
        'Het is een optionele proxy voor beveiliging',
      ],
      optionsI18n: {
        en: [
          'It is the AI model itself',
          'It bundles messages + tools + context and executes the tool calls the model proposes',
          'It trains the model on your data',
          'It is an optional security proxy',
        ],
        nl: [
          'Het is het AI-model zelf',
          'Het bundelt berichten + tools + context en voert de tool-calls uit die het model voorstelt',
          'Het traint het model op jouw data',
          'Het is een optionele proxy voor beveiliging',
        ],
        fr: [
          "C'est le modèle IA lui-même",
          'Il regroupe messages + outils + contexte et exécute les tool calls que le modèle propose',
          "Il entraîne le modèle sur vos données",
          "C'est un proxy de sécurité optionnel",
        ],
      },
      correctIndex: 1,
      explanation: 'Het model DENKT. De orchestrator DOET. Het model stuurt gestructureerde tool-calls terug; de orchestrator voert ze uit en koppelt het resultaat terug in de volgende API-call.',
      explanationI18n: {
        en: 'The model THINKS. The orchestrator DOES. The model returns structured tool calls; the orchestrator executes them and feeds the result back into the next API call.',
        nl: 'Het model DENKT. De orchestrator DOET. Het model stuurt gestructureerde tool-calls terug; de orchestrator voert ze uit en koppelt het resultaat terug in de volgende API-call.',
        fr: 'Le modèle PENSE. L\'orchestrator FAIT. Le modèle renvoie des tool calls structurés ; l\'orchestrator les exécute et réintègre le résultat dans l\'appel API suivant.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w0-q2',
      question: 'Wat is een "token" in de context van taalmodellen?',
      questionI18n: {
        en: 'What is a "token" in the context of language models?',
        nl: 'Wat is een "token" in de context van taalmodellen?',
        fr: 'Qu\'est-ce qu\'un « token » dans le contexte des modèles de langage ?',
      },
      options: [
        'Een enkel woord in een zin',
        'Een authenticatiesleutel voor API-toegang',
        'De kleinste eenheid tekst die een model verwerkt — tokenizer-afhankelijk (sub-word)',
        'Een munteenheid voor AI-gebruik',
      ],
      optionsI18n: {
        en: [
          'A single word in a sentence',
          'An authentication key for API access',
          'The smallest unit of text a model processes — tokenizer-dependent (sub-word)',
          'A currency unit for AI usage',
        ],
        nl: [
          'Een enkel woord in een zin',
          'Een authenticatiesleutel voor API-toegang',
          'De kleinste eenheid tekst die een model verwerkt — tokenizer-afhankelijk (sub-word)',
          'Een munteenheid voor AI-gebruik',
        ],
        fr: [
          "Un seul mot dans une phrase",
          "Une clé d'authentification pour l'accès API",
          'La plus petite unité de texte qu\'un modèle traite — dépendante du tokenizer (sub-word)',
          "Une unité monétaire pour l'usage de l'IA",
        ],
      },
      correctIndex: 2,
      explanation: '**Tokenization hangt af van de tokenizer.** \'worldline\' wordt vaak in 2 tokens gesplitst (bv. GPT-4). De ~4 karakters/token regel is een richtlijn, geen wet.',
      explanationI18n: {
        en: '**Tokenization depends on the tokenizer.** \'worldline\' often splits into 2 tokens (e.g. GPT-4). The ~4 chars/token rule is a guideline, not a law.',
        nl: '**Tokenization hangt af van de tokenizer.** \'worldline\' wordt vaak in 2 tokens gesplitst (bv. GPT-4). De ~4 karakters/token regel is een richtlijn, geen wet.',
        fr: '**La tokenisation dépend du tokenizer.** « worldline » se divise souvent en 2 tokens (ex. GPT-4). La règle de ~4 caractères/token est une indication, pas une loi.',
      },
      bloomLevel: 1,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w0-q3',
      question: 'Welke Worldline-tool gebruik je bij voorkeur voor "een feature bouwen in mijn codebase"?',
      questionI18n: {
        en: 'Which Worldline tool do you prefer for "building a feature in my codebase"?',
        nl: 'Welke Worldline-tool gebruik je bij voorkeur voor "een feature bouwen in mijn codebase"?',
        fr: 'Quel outil Worldline préférez-vous pour « construire une feature dans ma codebase » ?',
      },
      options: [
        'LibreChat — voor snelle vragen en documentatie',
        'GitHub Copilot — voor autocomplete tijdens typen',
        'Claude Code — CLI die je codebase leest en itereert',
        'Google Search — voor research',
      ],
      optionsI18n: {
        en: [
          'LibreChat — for quick questions and documentation',
          'GitHub Copilot — for autocomplete while typing',
          'Claude Code — CLI that reads your codebase and iterates',
          'Google Search — for research',
        ],
        nl: [
          'LibreChat — voor snelle vragen en documentatie',
          'GitHub Copilot — voor autocomplete tijdens typen',
          'Claude Code — CLI die je codebase leest en itereert',
          'Google Search — voor research',
        ],
        fr: [
          'LibreChat — pour les questions rapides et la documentation',
          'GitHub Copilot — pour la complétion pendant la frappe',
          'Claude Code — CLI qui lit votre codebase et itère',
          'Google Search — pour la recherche',
        ],
      },
      correctIndex: 2,
      explanation: 'Claude Code is je primaire tool voor codebase-werk: het leest bestanden, voert commando\'s uit, en itereert als een collega. LibreChat voor losse vragen, Copilot voor autocomplete.',
      explanationI18n: {
        en: 'Claude Code is your primary tool for codebase work: it reads files, runs commands, and iterates like a colleague. LibreChat for loose questions, Copilot for autocomplete.',
        nl: 'Claude Code is je primaire tool voor codebase-werk: het leest bestanden, voert commando\'s uit, en itereert als een collega. LibreChat voor losse vragen, Copilot voor autocomplete.',
        fr: 'Claude Code est votre outil principal pour le travail de codebase : il lit les fichiers, exécute des commandes, et itère comme un collègue. LibreChat pour les questions isolées, Copilot pour la complétion.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w0-q4',
      question: 'Wat is de J-Curve in de context van AI-adoptie?',
      questionI18n: {
        en: 'What is the J-Curve in the context of AI adoption?',
        nl: 'Wat is de J-Curve in de context van AI-adoptie?',
        fr: "Qu'est-ce que la J-Curve dans le contexte de l'adoption de l'IA ?",
      },
      options: [
        'Een grafiek die toont dat AI-gebruik exponentieel stijgt',
        'Eerst daalt productiviteit (leren, frustratie), dan stijgt het boven de baseline — typisch na 6-12 weken coaching',
        'Een programmeertaal specifiek voor AI-agents',
        'Het kantelpunt waarop AI menselijke developers vervangt',
      ],
      optionsI18n: {
        en: [
          'A chart showing AI usage rises exponentially',
          'Productivity first dips (learning, frustration), then rises above baseline — typically after 6-12 weeks of coaching',
          'A programming language specific to AI agents',
          'The tipping point where AI replaces human developers',
        ],
        nl: [
          'Een grafiek die toont dat AI-gebruik exponentieel stijgt',
          'Eerst daalt productiviteit (leren, frustratie), dan stijgt het boven de baseline — typisch na 6-12 weken coaching',
          'Een programmeertaal specifiek voor AI-agents',
          'Het kantelpunt waarop AI menselijke developers vervangt',
        ],
        fr: [
          "Un graphique montrant que l'usage IA monte exponentiellement",
          'La productivité baisse d\'abord (apprentissage, frustration), puis remonte au-dessus de la baseline — typiquement après 6-12 semaines de coaching',
          "Un langage de programmation spécifique aux agents IA",
          "Le point de bascule où l'IA remplace les développeurs humains",
        ],
      },
      correctIndex: 1,
      explanation: 'De J-Curve verklaart waarom AI-adoptie begeleiding vereist: zonder coaching geven teams op tijdens de dip. Census Bureau zag -1,3% initieel; Stripe/GitHub +40-70% na 6 maanden.',
      explanationI18n: {
        en: 'The J-Curve explains why AI adoption requires coaching: without guidance, teams quit during the dip. Census Bureau saw -1.3% initially; Stripe/GitHub +40-70% after 6 months.',
        nl: 'De J-Curve verklaart waarom AI-adoptie begeleiding vereist: zonder coaching geven teams op tijdens de dip. Census Bureau zag -1,3% initieel; Stripe/GitHub +40-70% na 6 maanden.',
        fr: 'La J-Curve explique pourquoi l\'adoption IA demande du coaching : sans accompagnement, les équipes abandonnent pendant le creux. Census Bureau a vu -1,3 % initialement ; Stripe/GitHub +40-70 % après 6 mois.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w0-q5',
      question: 'Welke situatie is GEEN geschikt gebruik voor AI bij Worldline?',
      questionI18n: {
        en: 'Which situation is NOT suitable AI use at Worldline?',
        nl: 'Welke situatie is GEEN geschikt gebruik voor AI bij Worldline?',
        fr: "Quelle situation n'est PAS un usage IA approprié chez Worldline ?",
      },
      options: [
        'Een functie refactoren via Claude Code met menselijke review',
        'Confluence-docs doorzoeken met LibreChat RAG',
        'PAN/CVV kaartdata in een prompt plaatsen om een voorbeeld te genereren',
        'Autocomplete van boilerplate via Copilot',
      ],
      optionsI18n: {
        en: [
          'Refactoring a function via Claude Code with human review',
          'Searching Confluence docs via LibreChat RAG',
          'Placing PAN/CVV card data in a prompt to generate an example',
          'Autocomplete of boilerplate via Copilot',
        ],
        nl: [
          'Een functie refactoren via Claude Code met menselijke review',
          'Confluence-docs doorzoeken met LibreChat RAG',
          'PAN/CVV kaartdata in een prompt plaatsen om een voorbeeld te genereren',
          'Autocomplete van boilerplate via Copilot',
        ],
        fr: [
          'Refactorer une fonction via Claude Code avec revue humaine',
          'Rechercher dans les docs Confluence via LibreChat RAG',
          'Placer des données PAN/CVV dans un prompt pour générer un exemple',
          'Autocomplétion de boilerplate via Copilot',
        ],
      },
      correctIndex: 2,
      explanation: 'PCI-DSS verbiedt kaartdata buiten goedgekeurde systemen. Nooit PAN/CVV in een AI-prompt — gebruik gefingeerde test-nummers of de Worldline compliance gate.',
      explanationI18n: {
        en: 'PCI-DSS forbids card data outside approved systems. Never PAN/CVV in an AI prompt — use synthetic test numbers or the Worldline compliance gate.',
        nl: 'PCI-DSS verbiedt kaartdata buiten goedgekeurde systemen. Nooit PAN/CVV in een AI-prompt — gebruik gefingeerde test-nummers of de Worldline compliance gate.',
        fr: 'PCI-DSS interdit les données carte hors systèmes approuvés. Jamais de PAN/CVV dans un prompt IA — utilisez des numéros de test synthétiques ou la compliance gate Worldline.',
      },
      bloomLevel: 3,
      euAiActRelevant: true,
      points: 10,
    },
  ],
  days: [
    // ───── DAG 1: Les 1.1 + Lab 1A ─────
    {
      day: 1,
      title: 'Les 1.1 — De AI-Revolutie',
      titleI18n: {
        en: 'Lesson 1.1 — The AI Revolution',
        nl: 'Les 1.1 — De AI-Revolutie',
        fr: 'Leçon 1.1 — La Révolution IA',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w0d1-theory',
          title: 'Les 1.1 — De AI-Revolutie: Hoe We Hier Kwamen',
          titleI18n: {
            en: 'Lesson 1.1 — The AI Revolution: How We Got Here',
            nl: 'Les 1.1 — De AI-Revolutie: Hoe We Hier Kwamen',
            fr: 'Leçon 1.1 — La Révolution IA : Comment nous sommes arrivés ici',
          },
          type: 'theory',
          duration: 20,
          description: 'Van Turing (1950) tot Agentic AI (2025). Waarom jij NU in deze training zit.',
          descriptionI18n: {
            en: 'From Turing (1950) to Agentic AI (2025). Why you\'re in this training NOW.',
            nl: 'Van Turing (1950) tot Agentic AI (2025). Waarom jij NU in deze training zit.',
            fr: 'De Turing (1950) à l\'Agentic AI (2025). Pourquoi vous êtes dans cette formation MAINTENANT.',
          },
          content: LESSON_1_1_NL,
          contentI18n: { en: LESSON_1_1_EN, nl: LESSON_1_1_NL, fr: LESSON_1_1_FR },
        },
        {
          id: 'w0d1-lab',
          title: 'Lab 1A — Jouw Persoonlijke AI-Tijdlijn',
          titleI18n: {
            en: 'Lab 1A — Your Personal AI Timeline',
            nl: 'Lab 1A — Jouw Persoonlijke AI-Tijdlijn',
            fr: 'Lab 1A — Votre chronologie IA personnelle',
          },
          type: 'lab',
          duration: 30,
          description: 'Breng je eigen AI-ervaringen in kaart, reflecteer en projecteer naar 6 maanden.',
          descriptionI18n: {
            en: 'Map your own AI experiences, reflect, and project 6 months forward.',
            nl: 'Breng je eigen AI-ervaringen in kaart, reflecteer en projecteer naar 6 maanden.',
            fr: 'Cartographiez vos propres expériences IA, réfléchissez, et projetez à 6 mois.',
          },
          content: LAB_1A_NL,
          contentI18n: { en: LAB_1A_EN, nl: LAB_1A_NL, fr: LAB_1A_FR },
          exercises: [
            {
              id: 'w0d1-ex1',
              title: 'AI-Tijdlijn Reflectie',
              titleI18n: {
                en: 'AI Timeline Reflection',
                nl: 'AI-Tijdlijn Reflectie',
                fr: 'Réflexion chronologie IA',
              },
              instructions: 'Schrijf in LibreChat of een markdown-bestand een persoonlijke AI-tijdlijn: eerste experiment, eerste serieus gebruik, grootste doorbraak, huidige gebruik. Sluit af met 1 repetitieve taak die AI over 6 maanden kan overnemen + 1 menselijke vaardigheid die juist waardevoller wordt.',
              instructionsI18n: {
                en: 'Write in LibreChat or a markdown file a personal AI timeline: first experiment, first serious use, biggest breakthrough, current use. Close with 1 repetitive task AI can take over in 6 months + 1 human skill that becomes more valuable.',
                nl: 'Schrijf in LibreChat of een markdown-bestand een persoonlijke AI-tijdlijn: eerste experiment, eerste serieus gebruik, grootste doorbraak, huidige gebruik. Sluit af met 1 repetitieve taak die AI over 6 maanden kan overnemen + 1 menselijke vaardigheid die juist waardevoller wordt.',
                fr: 'Rédigez dans LibreChat ou un fichier markdown une chronologie IA personnelle : première expérimentation, premier usage sérieux, plus grande percée, usage actuel. Terminez par 1 tâche répétitive que l\'IA peut reprendre dans 6 mois + 1 compétence humaine qui prend plus de valeur.',
              },
              type: 'free-form',
              difficulty: 1,
              points: 10,
            },
          ],
        },
      ],
    },

    // ───── DAG 2: Les 1.2 + Lab 1B ─────
    {
      day: 2,
      title: 'Les 1.2 — AI Woordenboek',
      titleI18n: {
        en: 'Lesson 1.2 — AI Dictionary',
        nl: 'Les 1.2 — AI Woordenboek',
        fr: 'Leçon 1.2 — Dictionnaire IA',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w0d2-theory',
          title: 'Les 1.2 — AI Woordenboek: Spreek de Taal',
          titleI18n: {
            en: 'Lesson 1.2 — AI Dictionary: Speak the Language',
            nl: 'Les 1.2 — AI Woordenboek: Spreek de Taal',
            fr: 'Leçon 1.2 — Dictionnaire IA : parlez la langue',
          },
          type: 'theory',
          duration: 15,
          description: 'De begrippen die elke AI-native developer kent — basis, model, problemen, jargon, Worldline-specifiek.',
          descriptionI18n: {
            en: 'The terms every AI-native developer knows — basics, models, problems, jargon, Worldline-specific.',
            nl: 'De begrippen die elke AI-native developer kent — basis, model, problemen, jargon, Worldline-specifiek.',
            fr: 'Les termes que tout développeur AI-native connaît — bases, modèles, problèmes, jargon, spécifique à Worldline.',
          },
          content: LESSON_1_2_NL,
          contentI18n: { en: LESSON_1_2_EN, nl: LESSON_1_2_NL, fr: LESSON_1_2_FR },
        },
        {
          id: 'w0d2-lab',
          title: 'Lab 1B — AI Bingo & Squad Glossary',
          titleI18n: {
            en: 'Lab 1B — AI Bingo & Squad Glossary',
            nl: 'Lab 1B — AI Bingo & Squad Glossary',
            fr: 'Lab 1B — AI Bingo & Squad Glossary',
          },
          type: 'lab',
          duration: 30,
          description: 'Raad AI-begrippen in duo\'s en bouw een squad-specifieke glossary in LibreChat.',
          descriptionI18n: {
            en: 'Guess AI terms in pairs and build a squad-specific glossary in LibreChat.',
            nl: 'Raad AI-begrippen in duo\'s en bouw een squad-specifieke glossary in LibreChat.',
            fr: 'Devinez des termes IA en binôme et construisez un glossary spécifique à votre squad dans LibreChat.',
          },
          content: LAB_1B_NL,
          contentI18n: { en: LAB_1B_EN, nl: LAB_1B_NL, fr: LAB_1B_FR },
          exercises: [
            {
              id: 'w0d2-ex1',
              title: 'Squad Glossary Bouwen',
              titleI18n: {
                en: 'Build Squad Glossary',
                nl: 'Squad Glossary Bouwen',
                fr: 'Construire le Squad Glossary',
              },
              instructions: 'Gebruik de voorgestelde prompt en bouw in LibreChat een 5-term glossary voor jouw squad. Deel de meest verrassende squad-specifieke definitie in Slack #ai-academy.',
              instructionsI18n: {
                en: 'Use the suggested prompt and build a 5-term glossary for your squad in LibreChat. Share the most surprising squad-specific definition in Slack #ai-academy.',
                nl: 'Gebruik de voorgestelde prompt en bouw in LibreChat een 5-term glossary voor jouw squad. Deel de meest verrassende squad-specifieke definitie in Slack #ai-academy.',
                fr: 'Utilisez le prompt proposé et construisez un glossary de 5 termes pour votre squad dans LibreChat. Partagez la définition la plus surprenante dans Slack #ai-academy.',
              },
              type: 'prompt-craft',
              difficulty: 1,
              points: 10,
            },
          ],
        },
      ],
    },

    // ───── DAG 3: Les 1.3 + Rol-opdrachten Lab ─────
    {
      day: 3,
      title: 'Les 1.3 — Hoe AI-tools Werken',
      titleI18n: {
        en: 'Lesson 1.3 — How AI Tools Work',
        nl: 'Les 1.3 — Hoe AI-tools Werken',
        fr: 'Leçon 1.3 — Comment fonctionnent les outils IA',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w0d3-theory',
          title: 'Les 1.3 — Hoe AI-tools Werken: De Flow',
          titleI18n: {
            en: 'Lesson 1.3 — How AI Tools Work: The Flow',
            nl: 'Les 1.3 — Hoe AI-tools Werken: De Flow',
            fr: 'Leçon 1.3 — Comment fonctionnent les outils IA : le flow',
          },
          type: 'theory',
          duration: 15,
          description: 'API call · geen geheugen · orchestrator doet het werk · Worldline-tools · MCP.',
          descriptionI18n: {
            en: 'API call · no memory · orchestrator does the work · Worldline tools · MCP.',
            nl: 'API call · geen geheugen · orchestrator doet het werk · Worldline-tools · MCP.',
            fr: 'Appel API · pas de mémoire · l\'orchestrator fait le travail · outils Worldline · MCP.',
          },
          content: LESSON_1_3_NL,
          contentI18n: { en: LESSON_1_3_EN, nl: LESSON_1_3_NL, fr: LESSON_1_3_FR },
        },
        {
          id: 'w0d3-lab',
          title: 'Lab — 6 Rol-opdrachten "First Contact"',
          titleI18n: {
            en: 'Lab — 6 Role Assignments "First Contact"',
            nl: 'Lab — 6 Rol-opdrachten "First Contact"',
            fr: 'Lab — 6 Tracks rôle « First Contact »',
          },
          type: 'lab',
          duration: 60,
          description: 'Elke deelnemer kiest 1 rol-opdracht (Backend / Frontend / Testers / PM-UX / Managers / Advanced) en levert een concrete deliverable.',
          descriptionI18n: {
            en: 'Each participant picks 1 role assignment (Backend / Frontend / Testers / PM-UX / Managers / Advanced) and delivers a concrete outcome.',
            nl: 'Elke deelnemer kiest 1 rol-opdracht (Backend / Frontend / Testers / PM-UX / Managers / Advanced) en levert een concrete deliverable.',
            fr: 'Chaque participant choisit 1 track rôle (Backend / Frontend / Testers / PM-UX / Managers / Advanced) et livre un résultat concret.',
          },
          content: ROLE_TRACKS_NL,
          contentI18n: { en: ROLE_TRACKS_EN, nl: ROLE_TRACKS_NL, fr: ROLE_TRACKS_FR },
          exercises: [
            {
              id: 'w0d3-ex1',
              title: 'First Contact — Rol-specifieke AI-taak',
              titleI18n: {
                en: 'First Contact — Role-specific AI Task',
                nl: 'First Contact — Rol-specifieke AI-taak',
                fr: 'First Contact — Tâche IA spécifique au rôle',
              },
              instructions: 'Kies de opdracht die past bij jouw rol (Backend/Frontend/Testers/PM-UX/Managers/Advanced). Voer uit in 45-60 minuten. Deliverable: de gevraagde output + je eigen beoordeling (wat klopte, wat niet?). Badge: je deliverable is direct bruikbaar voor een collega.',
              instructionsI18n: {
                en: 'Pick the task that matches your role (Backend/Frontend/Testers/PM-UX/Managers/Advanced). Complete in 45-60 minutes. Deliverable: the required output + your own assessment (what was right, what wasn\'t). Badge: your deliverable is directly usable by a colleague.',
                nl: 'Kies de opdracht die past bij jouw rol (Backend/Frontend/Testers/PM-UX/Managers/Advanced). Voer uit in 45-60 minuten. Deliverable: de gevraagde output + je eigen beoordeling (wat klopte, wat niet?). Badge: je deliverable is direct bruikbaar voor een collega.',
                fr: 'Choisissez la tâche qui correspond à votre rôle (Backend/Frontend/Testers/PM-UX/Managers/Advanced). Exécutez en 45-60 minutes. Livrable : la sortie demandée + votre propre évaluation (ce qui était correct, ce qui ne l\'était pas). Badge : votre livrable est directement utilisable par un collègue.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },

    // ───── DAG 4: Les 1.4 + Lab Grenzen ─────
    {
      day: 4,
      title: 'Les 1.4 — AI in je Workflow',
      titleI18n: {
        en: 'Lesson 1.4 — AI in Your Workflow',
        nl: 'Les 1.4 — AI in je Workflow',
        fr: 'Leçon 1.4 — L\'IA dans votre workflow',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w0d4-theory',
          title: 'Les 1.4 — AI in je Workflow: Van Ad-hoc naar Flow',
          titleI18n: {
            en: 'Lesson 1.4 — AI in Your Workflow: From Ad-hoc to Flow',
            nl: 'Les 1.4 — AI in je Workflow: Van Ad-hoc naar Flow',
            fr: 'Leçon 1.4 — L\'IA dans votre workflow : de l\'ad-hoc au flow',
          },
          type: 'theory',
          duration: 15,
          description: '3 lagen AI-flow (reflexief/collaboratief/agentic) · de grenzen · de flow-staat.',
          descriptionI18n: {
            en: '3 layers of AI flow (reflexive/collaborative/agentic) · the limits · the flow state.',
            nl: '3 lagen AI-flow (reflexief/collaboratief/agentic) · de grenzen · de flow-staat.',
            fr: '3 couches du flow IA (réflexive/collaborative/agentique) · les limites · l\'état de flow.',
          },
          content: LESSON_1_4_NL,
          contentI18n: { en: LESSON_1_4_EN, nl: LESSON_1_4_NL, fr: LESSON_1_4_FR },
        },
        {
          id: 'w0d4-lab',
          title: 'Lab — Grenzen van AI: Wanneer NIET?',
          titleI18n: {
            en: 'Lab — Limits of AI: When NOT?',
            nl: 'Lab — Grenzen van AI: Wanneer NIET?',
            fr: 'Lab — Limites de l\'IA : quand NE PAS ?',
          },
          type: 'lab',
          duration: 45,
          description: 'Inventariseer AI-gebruik uit de afgelopen 2 weken, classificeer binnen de grenzen, bouw squad-cheatsheet.',
          descriptionI18n: {
            en: 'Inventory AI use from the past 2 weeks, classify within the limits, build a squad cheatsheet.',
            nl: 'Inventariseer AI-gebruik uit de afgelopen 2 weken, classificeer binnen de grenzen, bouw squad-cheatsheet.',
            fr: 'Inventoriez l\'usage IA des 2 dernières semaines, classifiez dans les limites, construisez un cheatsheet squad.',
          },
          content: LAB_D4_BOUNDARIES_NL,
          contentI18n: { en: LAB_D4_BOUNDARIES_EN, nl: LAB_D4_BOUNDARIES_NL, fr: LAB_D4_BOUNDARIES_FR },
          exercises: [
            {
              id: 'w0d4-ex1',
              title: 'Squad AI-Grenzen Cheatsheet',
              titleI18n: {
                en: 'Squad AI Boundaries Cheatsheet',
                nl: 'Squad AI-Grenzen Cheatsheet',
                fr: 'Cheatsheet limites IA Squad',
              },
              instructions: 'Schrijf een cheatsheet met 5 do\'s en 5 don\'ts voor AI-gebruik in jouw squad-context. Elke regel: concreet, Worldline-gegrond (PCI/compliance/human-in-loop), direct herkenbaar voor een collega.',
              instructionsI18n: {
                en: 'Write a cheatsheet with 5 do\'s and 5 don\'ts for AI use in your squad context. Each line: concrete, Worldline-grounded (PCI/compliance/human-in-loop), immediately recognisable to a colleague.',
                nl: 'Schrijf een cheatsheet met 5 do\'s en 5 don\'ts voor AI-gebruik in jouw squad-context. Elke regel: concreet, Worldline-gegrond (PCI/compliance/human-in-loop), direct herkenbaar voor een collega.',
                fr: 'Rédigez un cheatsheet avec 5 do\'s et 5 don\'ts pour l\'usage IA dans votre contexte squad. Chaque ligne : concret, ancré Worldline (PCI/compliance/human-in-loop), immédiatement reconnaissable par un collègue.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 10,
            },
          ],
        },
      ],
    },

    // ───── DAG 5: Les 1.5 Buddy Builder + Buddy Verify Lab ─────
    {
      day: 5,
      title: 'Les 1.5 — Bouw Je AI-Buddy',
      titleI18n: {
        en: 'Lesson 1.5 — Build Your AI Buddy',
        nl: 'Les 1.5 — Bouw Je AI-Buddy',
        fr: 'Leçon 1.5 — Construisez votre AI Buddy',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w0d5-theory',
          title: 'Les 1.5 — Hands-on: Bouw Je AI-Buddy',
          titleI18n: {
            en: 'Lesson 1.5 — Hands-on: Build Your AI Buddy',
            nl: 'Les 1.5 — Hands-on: Bouw Je AI-Buddy',
            fr: 'Leçon 1.5 — Hands-on : construisez votre AI Buddy',
          },
          type: 'theory',
          duration: 25,
          description: 'Ontwerp een AI-persoonlijkheid met naam, rol, context, instructies en grenzen — je eerste system prompt.',
          descriptionI18n: {
            en: 'Design an AI personality with name, role, context, instructions and boundaries — your first system prompt.',
            nl: 'Ontwerp een AI-persoonlijkheid met naam, rol, context, instructies en grenzen — je eerste system prompt.',
            fr: 'Concevez une personnalité IA avec nom, rôle, contexte, instructions et limites — votre premier system prompt.',
          },
          content: LESSON_1_5_NL,
          contentI18n: { en: LESSON_1_5_EN, nl: LESSON_1_5_NL, fr: LESSON_1_5_FR },
        },
        {
          id: 'w0d5-lab',
          title: 'Lab — Buddy in Actie: Verificatie',
          titleI18n: {
            en: 'Lab — Buddy in Action: Verification',
            nl: 'Lab — Buddy in Actie: Verificatie',
            fr: 'Lab — Le Buddy en action : vérification',
          },
          type: 'lab',
          duration: 45,
          description: 'Baseline · met buddy · itereer · lock je v1.0 buddy-config die je door alle komende levels meeneemt.',
          descriptionI18n: {
            en: 'Baseline · with buddy · iterate · lock your v1.0 buddy config that you\'ll carry through all coming levels.',
            nl: 'Baseline · met buddy · itereer · lock je v1.0 buddy-config die je door alle komende levels meeneemt.',
            fr: 'Baseline · avec le buddy · itérez · figez votre buddy config v1.0 qui vous accompagnera à tous les niveaux suivants.',
          },
          content: LAB_D5_BUDDY_VERIFY_NL,
          contentI18n: { en: LAB_D5_BUDDY_VERIFY_EN, nl: LAB_D5_BUDDY_VERIFY_NL, fr: LAB_D5_BUDDY_VERIFY_FR },
          exercises: [
            {
              id: 'w0d5-ex1',
              title: 'buddy-config.md v1.0',
              titleI18n: {
                en: 'buddy-config.md v1.0',
                nl: 'buddy-config.md v1.0',
                fr: 'buddy-config.md v1.0',
              },
              instructions: 'Lever je uiteindelijke buddy-config.md in (of commit in je persoonlijke repo). Vereist: Rol + Persoonlijkheid + Context + Instructies + Grenzen. Voeg 1 voor/na vergelijking toe (baseline antwoord vs buddy antwoord) om aan te tonen dat je buddy meerwaarde geeft.',
              instructionsI18n: {
                en: 'Submit your final buddy-config.md (or commit in your personal repo). Required: Role + Personality + Context + Instructions + Boundaries. Add 1 before/after comparison (baseline answer vs buddy answer) to show your buddy adds value.',
                nl: 'Lever je uiteindelijke buddy-config.md in (of commit in je persoonlijke repo). Vereist: Rol + Persoonlijkheid + Context + Instructies + Grenzen. Voeg 1 voor/na vergelijking toe (baseline antwoord vs buddy antwoord) om aan te tonen dat je buddy meerwaarde geeft.',
                fr: 'Soumettez votre buddy-config.md final (ou committez dans votre repo perso). Requis : Rôle + Personnalité + Contexte + Instructions + Limites. Ajoutez 1 comparaison avant/après (réponse baseline vs réponse buddy) pour montrer que votre buddy apporte de la valeur.',
              },
              type: 'prompt-craft',
              difficulty: 2,
              points: 20,
            },
          ],
        },
      ],
    },
  ],
};
