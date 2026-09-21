// ─────────────────────────────────────────────────────────────────────────────
// WEEK 3 / LEVEL 4 — Intent Engineering (Cons & Nina v1.0)
// Source: docs/levels/level-4/source.md (Cons & Nina v1.0, 20 apr 2026)
//
// Structuur v1.0 (vervangt AI-DRAFT v0.1):
//   Dag 1: Les 4.1 Intent Is NOT in the Text    + Lab 4A Pain Lab caching
//   Dag 2: Les 4.2 Van Wat naar Waarom          + Lab 4B Goal Hierarchies
//   Dag 3: Les 4.3 De Goal Hierarchy            + Lab 6 Builder Challenge
//   Dag 4: Les 4.4 Trade-off Frameworks         + Lab — ADR writing
//   Dag 5: Les 4.5 Advanced Prompt Techniques   + Lab — CoT/Few-Shot/Iterative/Meta
// ─────────────────────────────────────────────────────────────────────────────

import type { CurriculumWeek } from './curriculum';
import { dailySchedule } from './curriculum-schedule';

// ─── LES 4.1 — Intent Is NOT in the Text ─────────────────────────────────────

const LESSON_4_1_NL = `# Les 4.1 — Intent Is NOT in the Text

## De Kern-Misvatting

Je hebt nu drie levels achter de rug. Je kent het Pentagon Model, je snapt context, je kunt een CLAUDE.md schrijven. En toch — toch — krijg je soms output die technisch correct is maar fundamenteel verkeerd.

**Waarom?**

Omdat je de AI vertelt WAT je wilt, maar niet WAAROM.

## Het Intent Gap Framework

Nate B. Jones formuleerde het zo: **"Intent is NOT in the text."**

Dat klinkt als een filosofisch statement, maar het is een praktisch probleem. De kloof tussen wat je typt en wat de AI echt moet snappen — dat is het **Intent Gap**.

De verleidelijke interpretatie: "Intent Engineering = voeg een 'waarom' alinea toe aan je prompt." Dit is oppervlakkig en werkt niet.

De echte interpretatie: intent leeft in **context + historie + impliciete aannames** — NIET in wat je letterlijk typt.

Een Worldline fraud-agent die "Detecteer verdachte transacties" als prompt krijgt, weet niet:
- Wanneer stoppen en een mens vragen
- Welke constraint wint bij conflict (recall vs precision)
- Wat specifiek NIET mag gebeuren (false positives kosten klantrelatie)

Die drie dingen staan niet in je prompt. Ze zitten in jouw hoofd. En zolang ze daar blijven, is het Intent Gap open.

## De 3 Intent Safety Vragen

Nate stelt drie vragen die je voor elke AI-taak moet beantwoorden — voordat je begint met prompten:

1. **Wat zou ik NIET willen dat de agent doet, zelfs als het doel bereikt wordt?**
2. **Wanneer moet het stoppen en vragen?**
3. **Als doel en constraint conflicteren — welke wint?**

Neem een concreet Worldline-voorbeeld.

**Taak:** "Optimaliseer de checkout flow voor snelheid."

- **Vraag 1 — Wat mag NIET?** De fraud check overslaan. Zelfs als dat 200ms scheelt. Fraud check is niet onderhandelbaar.
- **Vraag 2 — Wanneer stoppen?** Als de optimalisatie een wijziging vereist in de PCI-gecertificeerde flow. Dan stop je en vraag je het Security team.
- **Vraag 3 — Doel vs constraint?** Snelheid wint van elegantie. Maar compliance wint van snelheid. Altijd.

Deze vragen vervangen je prompt niet. Ze zijn **aanvullende artefacten** — een goal hierarchy, een escalation policy, een trade-off policy — die naast de prompt de agent begrenzen.

## Waarom Level 1-3 Niet Genoeg Is

- **Level 1:** AI is een krachtige tool.
- **Level 2:** Hoe je effectief communiceert (Pentagon).
- **Level 3:** Hoe je de juiste achtergrond geeft (Context).

Maar tot nu toe was je bezig met het **WAT** en het **WAARMEE**. Level 4 voegt de derde dimensie toe: het **WAAROM**.

**Zonder intent:**
> "Schrijf een caching layer voor onze API responses."

**Met intent:**
> "Onze checkout flow heeft 200ms latency. Gebruikers haken af boven 100ms. We willen een caching layer die checkout-endpoints prioriteert, stale data accepteert tot 30 seconden, cache invalidation doet bij payment status changes, en de bestaande Redis instance hergebruikt."

Zelfde taak. Compleet ander kwaliteitsniveau. En dat verschil is niet context — je gaf in beide gevallen technische context. Het verschil is dat de AI nu weet WAAROM je dit bouwt, en daardoor betere architectuurbeslissingen kan maken.`;

const LESSON_4_1_EN = `# Lesson 4.1 — Intent Is NOT in the Text

## The Core Misconception

You've completed three levels. You know the Pentagon Model, you get context, you can write a CLAUDE.md. And still — still — you sometimes get output that is technically correct but fundamentally wrong.

**Why?**

Because you tell the AI WHAT you want, but not WHY.

## The Intent Gap Framework

Nate B. Jones put it like this: **"Intent is NOT in the text."**

Sounds philosophical. It's actually a practical problem. The gap between what you type and what the AI actually needs to understand — that is the **Intent Gap**.

The tempting interpretation: "Intent Engineering = add a 'why' paragraph to your prompt." This is shallow and doesn't work.

The real interpretation: intent lives in **context + history + implicit assumptions** — NOT in what you literally type.

A Worldline fraud agent receiving "Detect suspicious transactions" as its prompt doesn't know:
- When to stop and ask a human
- Which constraint wins on conflict (recall vs precision)
- What specifically must NOT happen (false positives cost customer relationships)

Those three things aren't in your prompt. They're in your head. And while they stay there, the Intent Gap stays open.

## The 3 Intent Safety Questions

Nate asks three questions you must answer for every AI task — before you start prompting:

1. **What would I NOT want the agent to do, even if the goal is met?**
2. **When should it stop and ask?**
3. **If goal and constraint conflict — which wins?**

A concrete Worldline example.

**Task:** "Optimise the checkout flow for speed."

- **Question 1 — What NOT?** Skip the fraud check. Even if it saves 200ms. Fraud check is non-negotiable.
- **Question 2 — When stop?** If the optimisation requires a change to the PCI-certified flow. Stop and ask the Security team.
- **Question 3 — Goal vs constraint?** Speed wins over elegance. But compliance wins over speed. Always.

These questions don't replace your prompt. They're **supporting artefacts** — a goal hierarchy, an escalation policy, a trade-off policy — that bound the agent alongside the prompt.

## Why Level 1-3 Isn't Enough

- **Level 1:** AI is a powerful tool.
- **Level 2:** How you communicate effectively (Pentagon).
- **Level 3:** How you give the right background (Context).

But until now, you were working on the **WHAT** and the **WITH WHAT**. Level 4 adds the third dimension: the **WHY**.

**Without intent:**
> "Write a caching layer for our API responses."

**With intent:**
> "Our checkout flow has 200ms latency. Users drop off above 100ms. We want a caching layer that prioritises checkout endpoints, accepts stale data up to 30 seconds, does cache invalidation on payment status changes, and reuses the existing Redis instance."

Same task. Completely different quality level. And that difference isn't context — you gave technical context in both cases. The difference is that the AI now knows WHY you build this, and can therefore make better architectural decisions.`;

const LESSON_4_1_FR = `# Leçon 4.1 — Intent Is NOT in the Text

## L'idée fausse fondamentale

Vous avez terminé trois niveaux. Vous connaissez le Pentagon Model, vous comprenez le contexte, vous pouvez écrire un CLAUDE.md. Et pourtant — pourtant — vous obtenez parfois une sortie techniquement correcte mais fondamentalement fausse.

**Pourquoi ?**

Parce que vous dites à l'IA QUOI vous voulez, mais pas POURQUOI.

## Le framework Intent Gap

Nate B. Jones l'a formulé ainsi : **« Intent is NOT in the text. »**

Ça sonne philosophique. C'est en réalité un problème pratique. L'écart entre ce que vous tapez et ce que l'IA doit vraiment comprendre — c'est l'**Intent Gap**.

L'interprétation tentante : « Intent Engineering = ajouter un paragraphe 'pourquoi' à votre prompt. » C'est superficiel et ça ne marche pas.

La vraie interprétation : l'intent vit dans **contexte + historique + hypothèses implicites** — PAS dans ce que vous tapez littéralement.

Un agent fraude Worldline recevant « Détecte les transactions suspectes » comme prompt ne sait pas :
- Quand s'arrêter et demander à un humain
- Quelle contrainte gagne en cas de conflit (recall vs precision)
- Ce qui ne doit explicitement PAS se passer (false positives coûtent la relation client)

Ces trois choses ne sont pas dans votre prompt. Elles sont dans votre tête. Et tant qu'elles y restent, l'Intent Gap reste ouvert.

## Les 3 questions Intent Safety

Nate pose trois questions auxquelles vous devez répondre pour chaque tâche IA — avant de commencer à prompter :

1. **Que ne voudrais-je PAS que l'agent fasse, même si le but est atteint ?**
2. **Quand doit-il s'arrêter et demander ?**
3. **Si but et contrainte entrent en conflit — lequel gagne ?**

Un exemple concret Worldline.

**Tâche :** « Optimise le flow checkout pour la vitesse. »

- **Question 1 — Quoi NON ?** Sauter le fraud check. Même si ça gagne 200ms. Fraud check est non-négociable.
- **Question 2 — Quand s'arrêter ?** Si l'optimisation exige une modification du flow PCI-certifié. S'arrêter et demander l'équipe Security.
- **Question 3 — But vs contrainte ?** Vitesse gagne sur élégance. Mais compliance gagne sur vitesse. Toujours.

Ces questions ne remplacent pas votre prompt. Ce sont des **artefacts de soutien** — une goal hierarchy, une escalation policy, une trade-off policy — qui bornent l'agent à côté du prompt.

## Pourquoi Level 1-3 ne suffit pas

- **Level 1 :** L'IA est un outil puissant.
- **Level 2 :** Comment communiquer efficacement (Pentagon).
- **Level 3 :** Comment donner le bon background (Context).

Mais jusqu'ici, vous étiez sur le **QUOI** et le **AVEC QUOI**. Le Level 4 ajoute la troisième dimension : le **POURQUOI**.

**Sans intent :**
> « Écris une caching layer pour nos API responses. »

**Avec intent :**
> « Notre checkout flow a 200ms de latence. Les utilisateurs décrochent au-dessus de 100ms. On veut une caching layer qui priorise les endpoints checkout, accepte des données stale jusqu'à 30 secondes, fait de la cache invalidation sur les changements de payment status, et réutilise l'instance Redis existante. »

Même tâche. Niveau de qualité complètement différent. Et cette différence n'est pas le contexte — vous avez donné du contexte technique dans les deux cas. La différence est que l'IA sait maintenant POURQUOI vous construisez cela, et peut donc prendre de meilleures décisions architecturales.`;

// ─── LES 4.2 — Van "Wat" naar "Waarom" ───────────────────────────────────────

const LESSON_4_2_NL = `# Les 4.2 — Van "Wat" naar "Waarom"

## Het Verschil in Actie

Laten we het concreet maken. Twee prompts, dezelfde taak.

**Prompt (wat):**
> "Schrijf een functie die een lijst sorteert met quicksort."

**Intent (waarom):**
> "Ik heb een performante sorteeroplossing nodig voor lijsten tot 10K items waar stabiliteit belangrijk is — gelijke elementen moeten hun oorspronkelijke volgorde behouden."

De eerste prompt levert quicksort op. Precies wat je vroeg. Maar quicksort is niet stabiel. Als je stability nodig hebt, is mergesort de betere keuze. De AI wist dat niet — omdat je het WAT gaf, niet het WAAROM.

De tweede prompt levert waarschijnlijk mergesort of Timsort op. De AI begrijpt het doel (performant + stabiel) en kiest zelf de beste aanpak.

**Dit is geen klein verschil. Dit is het verschil tussen code die werkt en code die het juiste probleem oplost.**

## Drie Lagen van Intent

Intent heeft diepte. Hoe dieper je gaat, hoe beter de output.

**Laag 1: Oppervlakte-intent**
> "Ik wil een dashboard."

→ AI maakt een generiek dashboard. Technisch correct, maar nutteloos.

**Laag 2: Functionele intent**
> "Ik wil een dashboard dat onze settlement volumes per merchant toont, gefilterd op datum en valuta."

→ AI maakt een bruikbaar dashboard. Juiste data, juiste filters.

**Laag 3: Strategische intent**
> "Onze settlement managers verliezen 2 uur per dag aan handmatige rapportages. Ze moeten in 30 seconden kunnen zien welke merchants afwijkende volumes hebben. De huidige drempel is >15% afwijking van het 7-daags gemiddelde. Dit dashboard vervangt de Excel die Pieter elke ochtend handmatig maakt."

→ AI maakt een dashboard met anomaly detection, alerts, en een design dat geoptimaliseerd is voor snelle scanning. Omdat het WAAROM helder is.

## Het Instinctprobleem

Waarom doen we dit niet automatisch? Omdat het voelt als extra werk.

Je denkt: "Ik weet wat ik wil, ik typ het, klaar." Maar de helft van wat je "weet" is impliciet. Het zit in je ervaring, in de gesprekken die je vorige week had, in de sprint retro van maandag.

De AI heeft die ervaring niet. Die gesprekken niet gehoord. Die retro niet bijgewoond.

**Elke minuut die je besteedt aan het expliciteren van je intent, bespaart je drie minuten iteratie achteraf.** Dat is geen schatting — dat is het patroon dat we bij elke squad zien.

## Wanneer Intent Er Het Meest Toe Doet

Niet elke taak heeft een uitgebreide intent nodig.

**Intent is cruciaal bij:**
- Architectuurbeslissingen — de AI moet weten welke trade-offs acceptabel zijn
- Refactoring — de AI moet weten wat het einddoel is, niet alleen wat er nu fout is
- Feature development — de AI moet weten voor wie je bouwt en waarom
- Code review — de AI moet weten welke kwaliteitscriteria gelden

**Intent is minder belangrijk bij:**
- Syntax vragen — "hoe sorteer ik een slice in Go" heeft geen intent nodig
- Boilerplate — "maak een REST handler voor /api/users" is duidelijk genoeg
- Formatting — "converteer dit naar een tabel" is letterlijk`;

const LESSON_4_2_EN = `# Lesson 4.2 — From "What" to "Why"

## The Difference in Action

Let's make it concrete. Two prompts, same task.

**Prompt (what):**
> "Write a function that sorts a list using quicksort."

**Intent (why):**
> "I need a performant sort for lists up to 10K items where stability matters — equal elements must keep their original order."

The first prompt delivers quicksort. Exactly what you asked. But quicksort isn't stable. If you need stability, mergesort is the better choice. The AI didn't know that — because you gave the WHAT, not the WHY.

The second prompt likely delivers mergesort or Timsort. The AI understands the goal (performant + stable) and picks the best approach itself.

**This isn't a small difference. This is the difference between code that works and code that solves the right problem.**

## Three Layers of Intent

Intent has depth. The deeper you go, the better the output.

**Layer 1: Surface intent**
> "I want a dashboard."

→ AI makes a generic dashboard. Technically correct, useless.

**Layer 2: Functional intent**
> "I want a dashboard that shows our settlement volumes per merchant, filtered by date and currency."

→ AI makes a usable dashboard. Right data, right filters.

**Layer 3: Strategic intent**
> "Our settlement managers lose 2 hours per day on manual reports. They must be able to see in 30 seconds which merchants have abnormal volumes. Current threshold is >15% deviation from 7-day average. This dashboard replaces the Excel that Pieter makes by hand every morning."

→ AI makes a dashboard with anomaly detection, alerts, and a design optimised for fast scanning. Because the WHY is clear.

## The Instinct Problem

Why don't we do this automatically? Because it feels like extra work.

You think: "I know what I want, I type it, done." But half of what you "know" is implicit. It lives in your experience, in conversations from last week, in Monday's sprint retro.

The AI doesn't have that experience. Didn't hear those conversations. Didn't attend that retro.

**Every minute you spend making your intent explicit saves three minutes of iteration after.** Not an estimate — it's the pattern we see with every squad.

## When Intent Matters Most

Not every task needs elaborate intent.

**Intent is crucial for:**
- Architecture decisions — the AI must know which trade-offs are acceptable
- Refactoring — the AI must know what the end goal is, not just what's wrong now
- Feature development — the AI must know for whom you build and why
- Code review — the AI must know which quality criteria apply

**Intent matters less for:**
- Syntax questions — "how do I sort a slice in Go" needs no intent
- Boilerplate — "make a REST handler for /api/users" is clear enough
- Formatting — "convert this to a table" is literal`;

const LESSON_4_2_FR = `# Leçon 4.2 — De « Quoi » à « Pourquoi »

## La différence en action

Rendons ça concret. Deux prompts, même tâche.

**Prompt (quoi) :**
> « Écris une fonction qui trie une liste avec quicksort. »

**Intent (pourquoi) :**
> « J'ai besoin d'une solution de tri performante pour des listes jusqu'à 10K items où la stabilité importe — les éléments égaux doivent garder leur ordre original. »

Le premier prompt livre quicksort. Exactement ce que vous avez demandé. Mais quicksort n'est pas stable. Si vous avez besoin de stabilité, mergesort est le meilleur choix. L'IA ne le savait pas — parce que vous avez donné le QUOI, pas le POURQUOI.

Le deuxième prompt livre probablement mergesort ou Timsort. L'IA comprend le but (performant + stable) et choisit la meilleure approche elle-même.

**Ce n'est pas une petite différence. C'est la différence entre du code qui marche et du code qui résout le bon problème.**

## Trois couches d'intent

L'intent a de la profondeur. Plus vous allez profond, meilleure est la sortie.

**Couche 1 : Intent de surface**
> « Je veux un dashboard. »

→ L'IA fait un dashboard générique. Techniquement correct, inutile.

**Couche 2 : Intent fonctionnel**
> « Je veux un dashboard qui montre nos volumes de settlement par merchant, filtré par date et devise. »

→ L'IA fait un dashboard utilisable. Bonnes données, bons filtres.

**Couche 3 : Intent stratégique**
> « Nos settlement managers perdent 2h par jour en rapports manuels. Ils doivent voir en 30 secondes quels merchants ont des volumes anormaux. Seuil actuel : >15% déviation de la moyenne sur 7 jours. Ce dashboard remplace l'Excel que Pieter fait à la main chaque matin. »

→ L'IA fait un dashboard avec anomaly detection, alertes, et un design optimisé pour scanning rapide. Parce que le POURQUOI est clair.

## Le problème de l'instinct

Pourquoi ne faisons-nous pas ça automatiquement ? Parce que ça ressemble à du travail en plus.

Vous pensez : « Je sais ce que je veux, je tape, fini. » Mais la moitié de ce que vous « savez » est implicite. Ça vit dans votre expérience, dans les conversations de la semaine dernière, dans la sprint retro de lundi.

L'IA n'a pas cette expérience. N'a pas entendu ces conversations. N'a pas assisté à cette retro.

**Chaque minute passée à expliciter votre intent vous économise trois minutes d'itération après.** Pas une estimation — c'est le pattern qu'on voit avec chaque squad.

## Quand l'intent compte le plus

Toutes les tâches n'ont pas besoin d'intent élaboré.

**L'intent est crucial pour :**
- Décisions d'architecture — l'IA doit savoir quels trade-offs sont acceptables
- Refactoring — l'IA doit savoir le but final, pas juste ce qui est faux maintenant
- Feature development — l'IA doit savoir pour qui vous construisez et pourquoi
- Code review — l'IA doit savoir quels critères de qualité s'appliquent

**L'intent importe moins pour :**
- Questions syntaxe — « comment trier une slice en Go » n'a pas besoin d'intent
- Boilerplate — « fais un REST handler pour /api/users » est assez clair
- Formatting — « convertis ça en tableau » est littéral`;

// ─── LES 4.3 — De Goal Hierarchy ─────────────────────────────────────────────

const LESSON_4_3_NL = `# Les 4.3 — De Goal Hierarchy

## Van Abstract naar Concreet

Intent is krachtig, maar het moet gestructureerd zijn. Een lap tekst met "dit is waarom" helpt niet als het ongeorganiseerd is.

De **Goal Hierarchy** is je structuur. Van abstract naar concreet, van missie naar constraint:

\`\`\`
Mission — waarom bestaat dit project?
  Objective — wat willen we bereiken dit kwartaal?
    Goal — wat is het specifieke doel van deze feature?
      Task — welke concrete stappen zijn nodig?
        Constraint — wat zijn de grenzen?
\`\`\`

## Een Worldline Voorbeeld

\`\`\`
Mission: Betrouwbare payment processing voor merchants
  Objective: Checkout conversie verhogen van 87% naar 95%
    Goal: Response time onder 100ms voor checkout flow
      Task: Implement Redis caching voor /api/checkout/*
        Constraint: Max 30s stale, invalidate bij status change
\`\`\`

Geef dit aan Claude Code en vergelijk het met: "Implementeer caching voor de checkout API."

Het verschil is enorm. Met de Goal Hierarchy:
- Claude kiest Redis (want je noemde het)
- Claude stelt een TTL van 30 seconden voor (want je noemde de constraint)
- Claude voegt cache invalidation toe bij payment status changes (want het begrijpt het doel)
- Claude overweegt warmup strategieën (want het begrijpt dat conversie het uiteindelijke doel is)

Zonder de Goal Hierarchy:
- Claude kiest misschien in-memory caching (simpeler, maar schaalt niet)
- Claude stelt een willekeurige TTL voor
- Claude vergeet invalidation (want het weet niet dat stale data een conversieprobleem is)
- Claude optimaliseert voor de verkeerde metric

## Hoe Je Een Goal Hierarchy Schrijft

Het kost 2-3 minuten. Serieus.

1. **Begin bij de top** — Wat is het grote plaatje? Waarom bestaat dit project/feature? Schrijf het in één zin.
2. **Zoom in op het kwartaaldoel** — Wat probeert je team dit kwartaal te bereiken? Welke KPI willen jullie verbeteren?
3. **Definieer het specifieke doel** — Wat is de meetbare uitkomst van deze specifieke taak?
4. **Lijst je taken** — Welke concrete stappen zijn nodig? Dit is het deel dat je normaal al deed.
5. **Benoem de grenzen** — Wat mag niet? Wat zijn de non-negotiables? Welke trade-offs zijn acceptabel?

Die 5 stappen neem je mee in je prompt. Niet als een formeel document — gewoon als context die de AI helpt betere beslissingen te nemen.

## De Valkuil: Te Veel Hierarchy

Meer is niet altijd beter. Een Goal Hierarchy van 40 regels is contraproductief — de AI raakt de focus kwijt.

**De vuistregel: 5-10 regels.** Mission, objective, goal, 2-3 taken, 2-3 constraints. Klaar.

Als je meer nodig hebt, splits je taak op in kleinere taken — elk met hun eigen beknopte hierarchy.`;

const LESSON_4_3_EN = `# Lesson 4.3 — The Goal Hierarchy

## From Abstract to Concrete

Intent is powerful, but it must be structured. A block of "this is why" doesn't help if it's unorganised.

The **Goal Hierarchy** is your structure. From abstract to concrete, from mission to constraint:

\`\`\`
Mission — why does this project exist?
  Objective — what do we want to achieve this quarter?
    Goal — what's the specific goal of this feature?
      Task — which concrete steps are needed?
        Constraint — what are the boundaries?
\`\`\`

## A Worldline Example

\`\`\`
Mission: Reliable payment processing for merchants
  Objective: Raise checkout conversion from 87% to 95%
    Goal: Response time under 100ms for checkout flow
      Task: Implement Redis caching for /api/checkout/*
        Constraint: Max 30s stale, invalidate on status change
\`\`\`

Give this to Claude Code and compare with: "Implement caching for the checkout API."

The difference is enormous. With the Goal Hierarchy:
- Claude picks Redis (you named it)
- Claude proposes a 30-second TTL (you named the constraint)
- Claude adds cache invalidation on payment status changes (because it understands the goal)
- Claude considers warmup strategies (because it understands conversion is the ultimate goal)

Without the Goal Hierarchy:
- Claude might pick in-memory caching (simpler, doesn't scale)
- Claude proposes an arbitrary TTL
- Claude forgets invalidation (doesn't know stale data is a conversion problem)
- Claude optimises for the wrong metric

## How To Write A Goal Hierarchy

Takes 2-3 minutes. Seriously.

1. **Start at the top** — What's the big picture? Why does this project/feature exist? Write it in one sentence.
2. **Zoom in on the quarterly goal** — What's your team trying to achieve this quarter? Which KPI do you want to improve?
3. **Define the specific goal** — What's the measurable outcome of this specific task?
4. **List your tasks** — Which concrete steps are needed? This is the part you normally already did.
5. **Name the boundaries** — What's not allowed? What are the non-negotiables? Which trade-offs are acceptable?

Those 5 steps you take with you in your prompt. Not as a formal document — just as context that helps the AI make better decisions.

## The Trap: Too Much Hierarchy

More isn't always better. A Goal Hierarchy of 40 lines is counterproductive — the AI loses focus.

**Rule of thumb: 5-10 lines.** Mission, objective, goal, 2-3 tasks, 2-3 constraints. Done.

If you need more, split your task into smaller tasks — each with their own concise hierarchy.`;

const LESSON_4_3_FR = `# Leçon 4.3 — La Goal Hierarchy

## De l'abstrait au concret

L'intent est puissant, mais doit être structuré. Un bloc de « voici pourquoi » ne sert à rien s'il n'est pas organisé.

La **Goal Hierarchy** est votre structure. De l'abstrait au concret, de la mission à la contrainte :

\`\`\`
Mission — pourquoi ce projet existe-t-il ?
  Objective — que veut-on accomplir ce trimestre ?
    Goal — quel est le but spécifique de cette feature ?
      Task — quelles étapes concrètes ?
        Constraint — quelles sont les limites ?
\`\`\`

## Un exemple Worldline

\`\`\`
Mission : Payment processing fiable pour merchants
  Objective : Élever conversion checkout de 87% à 95%
    Goal : Response time sous 100ms pour checkout flow
      Task : Implémenter Redis caching pour /api/checkout/*
        Constraint : Max 30s stale, invalidate sur status change
\`\`\`

Donnez ça à Claude Code et comparez avec : « Implémente du caching pour la checkout API. »

La différence est énorme. Avec la Goal Hierarchy :
- Claude choisit Redis (vous l'avez nommé)
- Claude propose un TTL de 30 secondes (vous avez nommé la contrainte)
- Claude ajoute cache invalidation sur les payment status changes (car il comprend le but)
- Claude considère des stratégies de warmup (car il comprend que la conversion est le but final)

Sans la Goal Hierarchy :
- Claude choisit peut-être in-memory caching (plus simple, mais ne scale pas)
- Claude propose un TTL arbitraire
- Claude oublie l'invalidation (il ne sait pas que stale data est un problème de conversion)
- Claude optimise pour la mauvaise métrique

## Comment écrire une Goal Hierarchy

Ça prend 2-3 minutes. Sérieusement.

1. **Commencez par le sommet** — Quelle est la big picture ? Pourquoi ce projet/feature existe ? Écrivez-le en une phrase.
2. **Zoomez sur le but trimestriel** — Que votre équipe essaie-t-elle d'accomplir ce trimestre ? Quel KPI voulez-vous améliorer ?
3. **Définissez le but spécifique** — Quelle est la sortie mesurable de cette tâche spécifique ?
4. **Listez vos tâches** — Quelles étapes concrètes ? C'est la partie que vous faisiez déjà.
5. **Nommez les limites** — Qu'est-ce qui n'est pas permis ? Quels non-négociables ? Quels trade-offs acceptables ?

Ces 5 étapes, vous les emmenez dans votre prompt. Pas comme document formel — juste comme contexte qui aide l'IA à mieux décider.

## Le piège : trop de hierarchy

Plus n'est pas toujours mieux. Une Goal Hierarchy de 40 lignes est contre-productive — l'IA perd le focus.

**Règle de base : 5-10 lignes.** Mission, objective, goal, 2-3 tasks, 2-3 constraints. Fini.

Si vous avez besoin de plus, divisez votre tâche en plus petites — chacune avec sa propre hierarchy concise.`;

// ─── LES 4.4 — Trade-off Frameworks ──────────────────────────────────────────

const LESSON_4_4_NL = `# Les 4.4 — Trade-off Frameworks

## Elke Beslissing Is Een Trade-off

In software engineering is er zelden een "beste" oplossing. Er zijn trade-offs. En de AI kan alleen goede trade-offs maken als jij ze expliciet maakt.

Zonder expliciete trade-offs kiest de AI de "nette" oplossing — de oplossing die er in een textbook het mooist uitziet. Maar in de praktijk wil je soms de pragmatische oplossing. De snelle oplossing. De "goed genoeg" oplossing.

## Het Trade-off Canvas

Bij elke architectuurbeslissing kun je zes dimensies evalueren:

- **Performance** — hoe snel is het?
- **Complexity** — hoe moeilijk is het te begrijpen en onderhouden?
- **Maintainability** — hoe makkelijk is het aan te passen?
- **Cost** — wat kost het (infra, tokens, tijd)?
- **Time-to-market** — hoe snel is het live?
- **Scalability** — houdt het stand bij groei?

Geen oplossing scoort op alle zes een 10. Dat is het punt. Door te benoemen welke dimensies je prioriteert, geeft je de AI een kompas.

## Trade-off Prompting in de Praktijk

**Prompt zonder trade-off:**
> "Ontwerp een systeem voor real-time fraud detection."

→ De AI bouwt een complex event-driven systeem met ML-pipelines, feature stores, en real-time scoring. Technisch briljant. Drie maanden buildtijd.

**Prompt met trade-off:**
> "Ontwerp een fraud detection systeem. Trade-offs: we accepteren 5% lagere recall voor 10x lagere complexity. Time-to-market wint van perfectie — we willen binnen 2 sprints live. Scalability is belangrijk tot 10K TPS, niet meer."

→ De AI bouwt een regelgebaseerd systeem met 5 heuristics, een async queue voor verdachte transacties, en een dashboard voor handmatige review. Live in 2 sprints. Niet perfect, maar precies wat je nodig hebt.

## Architecture Decision Records

Een goede gewoonte: documenteer elke significante beslissing als ADR.

\`\`\`markdown
# ADR-001: Redis voor Checkout Caching

## Status: Accepted
## Context: Checkout latency >200ms, target <100ms
## Decision: Redis caching met 30s TTL
## Consequences:
  - Latency naar ~50ms
  - Eventual consistency (max 30s stale)
  - Operationele complexiteit (Redis cluster management)
## Trade-offs accepted:
  - Stale data is acceptabel voor checkout-snelheid
  - Extra operationele last is acceptabel voor gebruikerservaring
\`\`\`

Het mooie: je kunt AI vragen om dit voor je te schrijven. Geef Claude je beslissing en vraag om een ADR. Daarna: vraag Claude om **devil's advocate** te spelen.

> "Speel devil's advocate. Waarom zou Redis voor checkout caching een slechte beslissing kunnen zijn? Welke scenario's maken dit problematisch?"

Dit is intent engineering in actie: je vertelt de AI niet alleen wat je wilt, maar vraagt het actief om je aannames uit te dagen.`;

const LESSON_4_4_EN = `# Lesson 4.4 — Trade-off Frameworks

## Every Decision Is A Trade-off

In software engineering there's rarely a "best" solution. There are trade-offs. And the AI can only make good trade-offs if you make them explicit.

Without explicit trade-offs, the AI picks the "neat" solution — the one that looks prettiest in a textbook. But in practice you sometimes want the pragmatic solution. The fast solution. The "good enough" solution.

## The Trade-off Canvas

For every architectural decision you can evaluate six dimensions:

- **Performance** — how fast is it?
- **Complexity** — how hard to understand and maintain?
- **Maintainability** — how easy to change?
- **Cost** — what does it cost (infra, tokens, time)?
- **Time-to-market** — how fast is it live?
- **Scalability** — does it hold up as you grow?

No solution scores a 10 on all six. That's the point. By naming which dimensions you prioritise, you give the AI a compass.

## Trade-off Prompting In Practice

**Prompt without trade-off:**
> "Design a system for real-time fraud detection."

→ The AI builds a complex event-driven system with ML pipelines, feature stores, and real-time scoring. Technically brilliant. Three months of build time.

**Prompt with trade-off:**
> "Design a fraud detection system. Trade-offs: we accept 5% lower recall for 10x lower complexity. Time-to-market wins over perfection — we want live within 2 sprints. Scalability matters up to 10K TPS, no more."

→ The AI builds a rule-based system with 5 heuristics, an async queue for suspicious transactions, and a dashboard for manual review. Live in 2 sprints. Not perfect, but exactly what you need.

## Architecture Decision Records

A good habit: document every significant decision as an ADR.

\`\`\`markdown
# ADR-001: Redis for Checkout Caching

## Status: Accepted
## Context: Checkout latency >200ms, target <100ms
## Decision: Redis caching with 30s TTL
## Consequences:
  - Latency to ~50ms
  - Eventual consistency (max 30s stale)
  - Operational complexity (Redis cluster management)
## Trade-offs accepted:
  - Stale data is acceptable for checkout speed
  - Extra operational burden is acceptable for user experience
\`\`\`

The nice part: you can ask AI to write it for you. Give Claude your decision and ask for an ADR. Then: ask Claude to play **devil's advocate**.

> "Play devil's advocate. Why might Redis for checkout caching be a bad decision? Which scenarios make this problematic?"

This is intent engineering in action: you don't only tell the AI what you want, you actively ask it to challenge your assumptions.`;

const LESSON_4_4_FR = `# Leçon 4.4 — Trade-off Frameworks

## Chaque décision est un trade-off

En software engineering il y a rarement une « meilleure » solution. Il y a des trade-offs. Et l'IA ne peut faire de bons trade-offs que si vous les rendez explicites.

Sans trade-offs explicites, l'IA choisit la solution « propre » — celle qui a l'air la plus belle dans un textbook. Mais en pratique vous voulez parfois la solution pragmatique. La solution rapide. La solution « assez bonne ».

## Le Trade-off Canvas

Pour chaque décision architecturale vous pouvez évaluer six dimensions :

- **Performance** — à quelle vitesse ?
- **Complexity** — à quel point difficile à comprendre et maintenir ?
- **Maintainability** — à quel point facile à changer ?
- **Cost** — combien ça coûte (infra, tokens, temps) ?
- **Time-to-market** — à quelle vitesse live ?
- **Scalability** — tient-il debout en croissant ?

Aucune solution ne marque 10 sur les six. C'est le point. En nommant les dimensions que vous priorisez, vous donnez à l'IA une boussole.

## Trade-off Prompting en pratique

**Prompt sans trade-off :**
> « Conçois un système de real-time fraud detection. »

→ L'IA construit un système event-driven complexe avec ML pipelines, feature stores, et real-time scoring. Techniquement brillant. Trois mois de build.

**Prompt avec trade-off :**
> « Conçois un système de fraud detection. Trade-offs : on accepte 5% de recall en moins pour 10x moins de complexity. Time-to-market gagne sur la perfection — on veut live en 2 sprints. Scalability importe jusqu'à 10K TPS, pas plus. »

→ L'IA construit un système à base de règles avec 5 heuristiques, une async queue pour transactions suspectes, et un dashboard pour revue manuelle. Live en 2 sprints. Pas parfait, mais exactement ce qu'il faut.

## Architecture Decision Records

Bonne habitude : documentez chaque décision significative comme ADR.

\`\`\`markdown
# ADR-001 : Redis pour Checkout Caching

## Status : Accepted
## Context : Checkout latency >200ms, target <100ms
## Decision : Redis caching avec TTL 30s
## Consequences :
  - Latency vers ~50ms
  - Eventual consistency (max 30s stale)
  - Complexité opérationnelle (Redis cluster management)
## Trade-offs accepted :
  - Stale data est acceptable pour la vitesse checkout
  - Charge opérationnelle extra acceptable pour UX
\`\`\`

Le bon côté : vous pouvez demander à l'IA de l'écrire. Donnez à Claude votre décision et demandez un ADR. Puis : demandez à Claude de jouer **devil's advocate**.

> « Joue devil's advocate. Pourquoi Redis pour checkout caching pourrait-il être une mauvaise décision ? Quels scénarios rendent cela problématique ? »

C'est l'intent engineering en action : vous ne dites pas seulement à l'IA ce que vous voulez, vous lui demandez activement de challenger vos hypothèses.`;

// ─── LES 4.5 — Advanced Prompt Techniques ────────────────────────────────────

const LESSON_4_5_NL = `# Les 4.5 — Advanced Prompt Techniques

Nu je intent en trade-offs beheerst, vier technieken die je prompts naar het volgende niveau tillen.

## Chain-of-Thought (CoT)

Laat de AI stap voor stap denken in plaats van direct een antwoord te geven.

**Zonder CoT:**
> "Refactor deze functie."

→ AI herschrijft de functie. Misschien goed, misschien niet. Je weet niet waarom het die keuzes maakte.

**Met CoT:**
> "Denk stap voor stap na over hoe je deze refactoring aanpakt:
> 1. Analyseer eerst de huidige structuur
> 2. Identificeer de tight coupling
> 3. Ontwerp de nieuwe interfaces
> 4. Plan de migratiestappen
> 5. Schrijf dan pas code"

→ AI doorloopt elke stap zichtbaar. Je ziet het denkproces. Je kunt bijsturen voordat het de verkeerde kant op gaat.

**Wanneer CoT gebruiken:**
- Complexe refactoring met meerdere stappen
- Debugging waarbij de oorzaak niet duidelijk is
- Architectuurbeslissingen waarbij je de redenering wilt zien

## Few-Shot Prompting

Geef voorbeelden van gewenste output. De AI leert het patroon en past het toe.

> "Hier is hoe we API endpoints structureren in dit project:
>
> Voorbeeld 1:
> \`\`\`go
> // GET /api/users
> func GetUsers(ctx context.Context, w http.ResponseWriter, r *http.Request) {
>     users, err := service.ListUsers(ctx)
>     if err != nil {
>         http.Error(w, "internal error", http.StatusInternalServerError)
>         return
>     }
>     json.NewEncoder(w).Encode(users)
> }
> \`\`\`
>
> Schrijf nu een endpoint voor: // GET /api/transactions?status=pending&page=1"

De AI ziet het patroon: context als eerste parameter, error handling stijl, response format. En volgt het.

**Wanneer few-shot gebruiken:**
- Wanneer je team een specifiek code-patroon volgt
- Wanneer de output een specifiek format moet hebben
- Wanneer je wilt dat de AI jullie stijl overneemt, niet de generieke stijl

## Iterative Refinement

Bouw je prompt op in rondes. Niet alles in één keer.

- **Ronde 1:** "Genereer een eerste versie van deze functie."
- **Ronde 2:** "Review deze code op error handling en edge cases."
- **Ronde 3:** "Optimaliseer voor performance — we verwerken 5K requests per seconde."
- **Ronde 4:** "Voeg unit tests toe in table-driven test format."

Elke ronde bouwt voort op de vorige. De AI heeft de context van het hele gesprek en kan progressief verbeteren.

Dit is krachtiger dan één megaprompt. Waarom? Omdat je na elke ronde kunt bijsturen. Je ziet de tussenresultaten en kunt de richting aanpassen.

## Meta-Prompting

De meest ondergewaardeerde techniek. Vraag de AI om je prompt te verbeteren.

> "Ik wil een prompt schrijven om onze settlement reconciliation te automatiseren. Welke informatie mis je om me het beste te helpen? Stel me 5 gerichte vragen."

De AI stelt vragen als:
- Welk format heeft je reconciliation data?
- Wat zijn de acceptabele toleranties voor afwijkingen?
- Moet het systeem zelf corrigeren of alleen rapporteren?
- Welke edge cases zijn er (weekenden, feestdagen, valutaconversie)?
- Wie is de eindgebruiker van de output?

Door die vragen te beantwoorden schrijf je je prompt vanzelf — en het is een betere prompt dan je alleen had geschreven.`;

const LESSON_4_5_EN = `# Lesson 4.5 — Advanced Prompt Techniques

Now that you master intent and trade-offs, four techniques that lift your prompts to the next level.

## Chain-of-Thought (CoT)

Let the AI think step by step instead of giving a direct answer.

**Without CoT:**
> "Refactor this function."

→ AI rewrites the function. Maybe good, maybe not. You don't know why it made those choices.

**With CoT:**
> "Think step by step about how to approach this refactoring:
> 1. Analyse the current structure first
> 2. Identify the tight coupling
> 3. Design the new interfaces
> 4. Plan the migration steps
> 5. Only then write code"

→ AI walks every step visibly. You see the thought process. You can steer before it goes the wrong way.

**When to use CoT:**
- Complex refactoring with multiple steps
- Debugging where the cause isn't clear
- Architectural decisions where you want to see the reasoning

## Few-Shot Prompting

Give examples of desired output. The AI learns the pattern and applies it.

> "Here's how we structure API endpoints in this project:
>
> Example 1:
> \`\`\`go
> // GET /api/users
> func GetUsers(ctx context.Context, w http.ResponseWriter, r *http.Request) {
>     users, err := service.ListUsers(ctx)
>     if err != nil {
>         http.Error(w, "internal error", http.StatusInternalServerError)
>         return
>     }
>     json.NewEncoder(w).Encode(users)
> }
> \`\`\`
>
> Now write an endpoint for: // GET /api/transactions?status=pending&page=1"

The AI sees the pattern: context as first parameter, error handling style, response format. And follows it.

**When to use few-shot:**
- When your team follows a specific code pattern
- When output needs a specific format
- When you want the AI to adopt your style, not the generic one

## Iterative Refinement

Build your prompt in rounds. Not everything at once.

- **Round 1:** "Generate a first version of this function."
- **Round 2:** "Review this code for error handling and edge cases."
- **Round 3:** "Optimise for performance — we process 5K requests per second."
- **Round 4:** "Add unit tests in table-driven test format."

Each round builds on the previous. The AI has the full conversation context and can improve progressively.

This is more powerful than one megaprompt. Why? Because you can steer after each round. You see intermediate results and adjust direction.

## Meta-Prompting

The most undervalued technique. Ask the AI to improve your prompt.

> "I want to write a prompt to automate our settlement reconciliation. What info do you need to help me best? Ask me 5 targeted questions."

The AI asks things like:
- What format is your reconciliation data?
- What are acceptable tolerances for deviations?
- Should the system self-correct or only report?
- What edge cases exist (weekends, holidays, currency conversion)?
- Who's the end user of the output?

Answering those questions writes your prompt for you — and it's a better prompt than you'd have written alone.`;

const LESSON_4_5_FR = `# Leçon 4.5 — Advanced Prompt Techniques

Maintenant que vous maîtrisez intent et trade-offs, quatre techniques qui élèvent vos prompts au niveau suivant.

## Chain-of-Thought (CoT)

Laissez l'IA réfléchir étape par étape au lieu de donner une réponse directe.

**Sans CoT :**
> « Refactore cette fonction. »

→ L'IA réécrit la fonction. Peut-être bien, peut-être pas. Vous ne savez pas pourquoi ces choix.

**Avec CoT :**
> « Réfléchis étape par étape à comment aborder ce refactoring :
> 1. Analyse d'abord la structure actuelle
> 2. Identifie le tight coupling
> 3. Conçois les nouvelles interfaces
> 4. Planifie les étapes de migration
> 5. Écris ensuite le code »

→ L'IA parcourt chaque étape visiblement. Vous voyez la pensée. Vous pouvez rediriger avant que ça parte de travers.

**Quand utiliser CoT :**
- Refactoring complexe avec plusieurs étapes
- Debugging où la cause n'est pas claire
- Décisions architecturales où vous voulez voir le raisonnement

## Few-Shot Prompting

Donnez des exemples de sortie souhaitée. L'IA apprend le pattern et l'applique.

> « Voici comment on structure les endpoints API dans ce projet :
>
> Exemple 1 :
> \`\`\`go
> // GET /api/users
> func GetUsers(ctx context.Context, w http.ResponseWriter, r *http.Request) {
>     users, err := service.ListUsers(ctx)
>     if err != nil {
>         http.Error(w, "internal error", http.StatusInternalServerError)
>         return
>     }
>     json.NewEncoder(w).Encode(users)
> }
> \`\`\`
>
> Écris maintenant un endpoint pour : // GET /api/transactions?status=pending&page=1 »

L'IA voit le pattern : context en premier paramètre, style error handling, format réponse. Et suit.

**Quand utiliser few-shot :**
- Quand votre équipe suit un pattern code spécifique
- Quand la sortie doit avoir un format spécifique
- Quand vous voulez que l'IA adopte votre style, pas le générique

## Iterative Refinement

Construisez votre prompt par rondes. Pas tout d'un coup.

- **Ronde 1 :** « Génère une première version de cette fonction. »
- **Ronde 2 :** « Revois ce code pour error handling et edge cases. »
- **Ronde 3 :** « Optimise pour la performance — on traite 5K requêtes/seconde. »
- **Ronde 4 :** « Ajoute des unit tests en format table-driven. »

Chaque ronde construit sur la précédente. L'IA a le contexte de toute la conversation et peut s'améliorer progressivement.

Plus puissant qu'un megaprompt. Pourquoi ? Parce que vous pouvez rediriger après chaque ronde. Vous voyez les résultats intermédiaires et ajustez la direction.

## Meta-Prompting

La technique la plus sous-évaluée. Demandez à l'IA d'améliorer votre prompt.

> « Je veux écrire un prompt pour automatiser notre settlement reconciliation. Quelle info te manque pour m'aider au mieux ? Pose-moi 5 questions ciblées. »

L'IA pose des questions comme :
- Quel format ont vos données de réconciliation ?
- Quelles tolérances acceptables pour les écarts ?
- Le système doit-il corriger lui-même ou juste reporter ?
- Quels edge cases (weekends, jours fériés, conversion devise) ?
- Qui est l'utilisateur final de la sortie ?

En répondant à ces questions, vous écrivez votre prompt tout seul — et c'est un meilleur prompt que vous auriez écrit seul.`;

// ─── LAB 4A — Pain Lab: Voel het Intent Gap ──────────────────────────────────

const LAB_4A_NL = `# Lab 4A — Pain Lab: Voel het Intent Gap

**Duur: 30 minuten**

Pedagogisch principe: dezelfde les als Lab 3A — voelen > voorkauwen. Je gaat het verschil ervaren tussen prompten zonder en met intent.

## Stap 1: Zonder Intent (10 min)

Open LibreChat. Gebruik het Pentagon Model uit Level 2. Schrijf een prompt voor deze taak:

> "Schrijf een caching layer voor onze API."

Gebruik alle atomen: ROL, CONTEXT, TAAK, FORMAT, CONSTRAINTS. Maar geef GEEN intent — geen waarom, geen doel, geen trade-offs.

Bewaar de output.

## Stap 2: Met Intent (10 min)

Zelfde taak. Zelfde Pentagon-structuur. Maar nu voeg je intent toe:

> "Onze checkout flow heeft 200ms gemiddelde latency. Gebruikers haken af boven 100ms — we meten 13% drop-off. We willen de latency voor checkout-gerelateerde endpoints onder 80ms brengen.
>
> **Trade-offs:**
> - Eventual consistency is acceptabel (max 30s stale)
> - Operationele complexiteit is acceptabel als het de latency haalt
> - We hergebruiken de bestaande Redis instance (geen nieuwe infra)
>
> **Goal Hierarchy:**
> - Mission: Betrouwbare checkout ervaring voor merchants
> - Objective: Conversie van 87% naar 95%
> - Goal: Checkout latency <80ms (p95)
> - Task: Redis caching voor /api/checkout/* endpoints
> - Constraint: Max 30s TTL, invalidate bij payment status change"

Bewaar de output.

## Stap 3: Vergelijk (10 min)

Leg beide outputs naast elkaar. Beantwoord:
- Welke output maakt betere architectuurbeslissingen?
- Welke output anticipeert op edge cases die relevant zijn voor jouw situatie?
- Hoeveel iteraties zou je nodig hebben om output 1 naar het niveau van output 2 te brengen?
- Hoeveel tijd kostte het schrijven van de intent vs. de geschatte iteratietijd?

**Deliverable:** Twee outputs + vergelijkingsnotities.`;

const LAB_4A_EN = `# Lab 4A — Pain Lab: Feel the Intent Gap

**Duration: 30 minutes**

Pedagogical principle: same lesson as Lab 3A — feel > explain. You'll experience the difference between prompting without and with intent.

## Step 1: Without Intent (10 min)

Open LibreChat. Use the Pentagon Model from Level 2. Write a prompt for this task:

> "Write a caching layer for our API."

Use all atoms: ROLE, CONTEXT, TASK, FORMAT, CONSTRAINTS. But give NO intent — no why, no goal, no trade-offs.

Save the output.

## Step 2: With Intent (10 min)

Same task. Same Pentagon structure. But now add intent:

> "Our checkout flow has 200ms average latency. Users drop off above 100ms — we measure 13% drop-off. We want latency for checkout-related endpoints below 80ms.
>
> **Trade-offs:**
> - Eventual consistency is acceptable (max 30s stale)
> - Operational complexity is acceptable if it meets latency
> - We reuse the existing Redis instance (no new infra)
>
> **Goal Hierarchy:**
> - Mission: Reliable checkout experience for merchants
> - Objective: Conversion from 87% to 95%
> - Goal: Checkout latency <80ms (p95)
> - Task: Redis caching for /api/checkout/* endpoints
> - Constraint: Max 30s TTL, invalidate on payment status change"

Save the output.

## Step 3: Compare (10 min)

Put both outputs side by side. Answer:
- Which output makes better architectural decisions?
- Which output anticipates edge cases relevant to your situation?
- How many iterations would you need to lift output 1 to the level of output 2?
- How much time did writing the intent cost vs. estimated iteration time?

**Deliverable:** Two outputs + comparison notes.`;

const LAB_4A_FR = `# Lab 4A — Pain Lab : Ressentez l'Intent Gap

**Durée : 30 minutes**

Principe pédagogique : même leçon que Lab 3A — ressentir > expliquer. Vous allez expérimenter la différence entre prompter sans et avec intent.

## Étape 1 : Sans Intent (10 min)

Ouvrez LibreChat. Utilisez le Pentagon Model du Level 2. Écrivez un prompt pour cette tâche :

> « Écris une caching layer pour notre API. »

Utilisez tous les atomes : RÔLE, CONTEXT, TÂCHE, FORMAT, CONSTRAINTS. Mais ne donnez AUCUN intent — pas de pourquoi, pas de but, pas de trade-offs.

Sauvegardez la sortie.

## Étape 2 : Avec Intent (10 min)

Même tâche. Même structure Pentagon. Mais ajoutez intent :

> « Notre checkout flow a 200ms de latence moyenne. Les utilisateurs décrochent au-dessus de 100ms — on mesure 13% drop-off. On veut la latence pour les endpoints checkout sous 80ms.
>
> **Trade-offs :**
> - Eventual consistency est acceptable (max 30s stale)
> - Complexité opérationnelle acceptable si ça atteint la latence
> - On réutilise l'instance Redis existante (pas de nouvelle infra)
>
> **Goal Hierarchy :**
> - Mission : Expérience checkout fiable pour merchants
> - Objective : Conversion de 87% à 95%
> - Goal : Checkout latency <80ms (p95)
> - Task : Redis caching pour /api/checkout/* endpoints
> - Constraint : Max 30s TTL, invalidate sur payment status change »

Sauvegardez la sortie.

## Étape 3 : Comparez (10 min)

Mettez les deux sorties côte à côte. Répondez :
- Quelle sortie fait de meilleures décisions architecturales ?
- Quelle sortie anticipe les edge cases pertinents à votre situation ?
- Combien d'itérations pour élever la sortie 1 au niveau de la sortie 2 ?
- Combien de temps pour écrire l'intent vs. temps d'itération estimé ?

**Livrable :** Deux sorties + notes de comparaison.`;

// ─── LAB 4B — Goal Hierarchies voor Echte Features ───────────────────────────

const LAB_4B_NL = `# Lab 4B — Goal Hierarchies voor Echte Features

**Duur: 45 minuten**

Nu ga je het echt doen. Met je eigen werk, je eigen features, je eigen squad.

## Stap 1: Goal Hierarchy Bouwen (15 min)

Kies een feature uit je huidige sprint of backlog. Niet iets hypothetisch — iets echts.

Bouw een complete Goal Hierarchy:

\`\`\`
Mission: [waarom bestaat dit project/product?]
  Objective: [wat willen we dit kwartaal bereiken?]
    Goal: [wat is het meetbare doel van deze feature?]
      Task: [welke concrete stappen?]
        Constraint: [wat mag niet? wat zijn de grenzen?]
\`\`\`

Identificeer de trade-offs op elk niveau:
- Wat prioriteer je: snelheid of kwaliteit?
- Wat accepteer je: complexiteit of beperkte functionaliteit?
- Wat is niet onderhandelbaar?

## Stap 2: Before/After met Intent (15 min)

Voer dezelfde feature twee keer uit in Claude Code of LibreChat:

1. **Zonder intent** — alleen de "wat" (Pentagon prompt uit Level 2)
2. **Met intent** — Pentagon + Goal Hierarchy + Trade-offs

Vergelijk op:
- **Architectuurbeslissingen** — kiest de AI betere patterns?
- **Edge case handling** — anticipeert de AI op relevante scenario's?
- **Code kwaliteit** — past het bij jullie standaarden?
- **Relevantie** — lost het je echte probleem op?

## Stap 3: Trade-off Documentatie (10 min)

Schrijf voor je feature een mini-ADR:

\`\`\`markdown
# ADR: [titel]
## Context: [wat is de situatie]
## Decision: [wat heb je besloten]
## Trade-offs accepted: [wat accepteer je]
## Consequences: [wat zijn de gevolgen]
\`\`\`

## Stap 4: Reflectie (5 min)

- Hoeveel extra tijd kostte het schrijven van de Goal Hierarchy?
- Hoeveel iteratietijd bespaarde het?
- Wat is je netto tijdsbesparing?

**Deliverable:** Goal Hierarchy + before/after outputs + mini-ADR.`;

const LAB_4B_EN = `# Lab 4B — Goal Hierarchies for Real Features

**Duration: 45 minutes**

Now you do it for real. With your own work, your own features, your own squad.

## Step 1: Build A Goal Hierarchy (15 min)

Pick a feature from your current sprint or backlog. Not hypothetical — real.

Build a complete Goal Hierarchy:

\`\`\`
Mission: [why does this project/product exist?]
  Objective: [what do we want to achieve this quarter?]
    Goal: [what's the measurable goal of this feature?]
      Task: [which concrete steps?]
        Constraint: [what's not allowed? what are the boundaries?]
\`\`\`

Identify trade-offs at each level:
- What do you prioritise: speed or quality?
- What do you accept: complexity or limited functionality?
- What's non-negotiable?

## Step 2: Before/After With Intent (15 min)

Run the same feature twice in Claude Code or LibreChat:

1. **Without intent** — only the "what" (Pentagon prompt from Level 2)
2. **With intent** — Pentagon + Goal Hierarchy + Trade-offs

Compare on:
- **Architecture decisions** — does the AI pick better patterns?
- **Edge case handling** — does the AI anticipate relevant scenarios?
- **Code quality** — does it fit your standards?
- **Relevance** — does it solve your real problem?

## Step 3: Trade-off Documentation (10 min)

Write a mini-ADR for your feature:

\`\`\`markdown
# ADR: [title]
## Context: [what's the situation]
## Decision: [what did you decide]
## Trade-offs accepted: [what do you accept]
## Consequences: [what are the consequences]
\`\`\`

## Step 4: Reflection (5 min)

- How much extra time did writing the Goal Hierarchy cost?
- How much iteration time did it save?
- What's your net time saved?

**Deliverable:** Goal Hierarchy + before/after outputs + mini-ADR.`;

const LAB_4B_FR = `# Lab 4B — Goal Hierarchies pour Vraies Features

**Durée : 45 minutes**

Maintenant vous le faites pour de vrai. Avec votre propre travail, vos features, votre squad.

## Étape 1 : Construire une Goal Hierarchy (15 min)

Choisissez une feature de votre sprint ou backlog actuel. Pas hypothétique — réelle.

Construisez une Goal Hierarchy complète :

\`\`\`
Mission : [pourquoi ce projet/produit existe ?]
  Objective : [que veut-on accomplir ce trimestre ?]
    Goal : [quel est le but mesurable de cette feature ?]
      Task : [quelles étapes concrètes ?]
        Constraint : [qu'est-ce qui n'est pas permis ? quelles limites ?]
\`\`\`

Identifiez les trade-offs à chaque niveau :
- Que priorisez-vous : vitesse ou qualité ?
- Qu'acceptez-vous : complexité ou fonctionnalité limitée ?
- Qu'est-ce qui est non-négociable ?

## Étape 2 : Before/After avec Intent (15 min)

Exécutez la même feature deux fois dans Claude Code ou LibreChat :

1. **Sans intent** — juste le « quoi » (prompt Pentagon du Level 2)
2. **Avec intent** — Pentagon + Goal Hierarchy + Trade-offs

Comparez sur :
- **Décisions architecturales** — l'IA choisit-elle de meilleurs patterns ?
- **Edge case handling** — l'IA anticipe-t-elle les scénarios pertinents ?
- **Qualité du code** — colle-t-il à vos standards ?
- **Pertinence** — résout-il votre vrai problème ?

## Étape 3 : Documentation trade-off (10 min)

Écrivez un mini-ADR pour votre feature :

\`\`\`markdown
# ADR : [titre]
## Context : [quelle situation]
## Decision : [qu'avez-vous décidé]
## Trade-offs accepted : [qu'acceptez-vous]
## Consequences : [quelles conséquences]
\`\`\`

## Étape 4 : Réflexion (5 min)

- Combien de temps en plus pour écrire la Goal Hierarchy ?
- Combien de temps d'itération économisé ?
- Quelle est votre économie nette ?

**Livrable :** Goal Hierarchy + sorties before/after + mini-ADR.`;

// ─── ROLE TRACKS — De Builder Challenge ──────────────────────────────────────

const ROLE_TRACKS_NL = `# Rol-opdrachten Level 4 — "De Builder Challenge"

**Dit is de GROTE opdracht van het programma.** De Builder Challenge start in Level 4 en loopt door in Level 5. Je begint met intent en goal hierarchies, en in het volgende level voeg je specificaties en verificatie toe.

## BACKEND ENGINEERS (Golang / Java) — "De Migratie-Versneller"

**Opdracht:** Neem een echte microservice uit jullie codebase. Gebruik intent engineering om een compleet migratieplan te genereren — niet door de AI te vertellen HOE, maar door helder te maken WAAROM en WAARHEEN.

Wat je prompt moet bevatten:
1. **Goal Hierarchy:** waarom deze migratie, wat is het kwartaaldoel
2. **Trade-offs:** snelheid vs grondigheid, backward compatibility vs clean break
3. **Constraints:** welke API's mogen niet breken, welke SLA's gelden
4. **Niet-onderhandelbaren:** PCI compliance, zero-downtime requirement
5. **Iteratie-log:** documenteer elke keer dat je de intent aanscherpt

- **Tool:** Claude Code
- **Duur:** 45 minuten
- **Deliverable:** Goal Hierarchy + intent-prompts + migratieplan + iteratie-log
- **Badge-criteria:** Het migratieplan is specifiek genoeg dat een teamgenoot het kan uitvoeren zonder extra uitleg, en de trade-offs zijn expliciet gedocumenteerd.

## FRONTEND DEVELOPERS (React / Angular) — "De Component Factory"

**Opdracht:** Bouw een prompt-pipeline die van een design-beschrijving naar een volledig React component gaat — met props, styling, tests, en documentatie. Maar het begint bij intent: waarom dit component, voor wie, welk probleem lost het op.

Wat je prompt moet bevatten:
1. **Goal Hierarchy:** welk gebruikersprobleem lost dit component op
2. **Trade-offs:** flexibiliteit vs eenvoud, pixel-perfect vs pragmatisch
3. **Constraints:** accessibility eisen, performance budget, design system compliance
4. **Niet-onderhandelbaren:** WCAG 2.1 AA, responsive, geen externe dependencies
5. **Iteratie-log:** hoe veranderde de output toen je de intent aanscherpte

- **Tool:** Claude Code of LibreChat
- **Duur:** 45 minuten
- **Deliverable:** Goal Hierarchy + prompt-pipeline + werkend component + iteratie-log
- **Badge-criteria:** Het component compileert, is accessible (WCAG 2.1 AA), en past bij het bestaande design system zonder handmatige styling-fixes.

## TESTERS / QA — "De Edge Case Hunter"

**Opdracht:** Gebruik intent engineering om alle edge cases te vinden die je team gemist heeft voor een bestaand endpoint of feature. Het verschil met gewoon "zoek edge cases": je geeft de AI de intent van het systeem, zodat het weet welke edge cases ertoe doen.

Wat je prompt moet bevatten:
1. **Goal Hierarchy:** wat is het doel van dit endpoint/feature, wie gebruikt het
2. **Trade-offs:** welke edge cases zijn critical vs nice-to-have
3. **Constraints:** SLA's, compliance eisen, data validatie regels
4. **Niet-onderhandelbaren:** security edge cases zijn altijd critical
5. **Iteratie-log:** welke edge cases vond de AI pas na intent-verdieping

- **Tool:** Claude Code of LibreChat
- **Duur:** 45 minuten
- **Deliverable:** Goal Hierarchy + twee sets edge cases + vergelijking + iteratie-log
- **Badge-criteria:** Minstens 3 edge cases gevonden die het team nog niet had, waarvan minstens 1 een potentieel productieprobleem is.

## PRODUCT MANAGERS / UX — "De Discovery Agent"

**Opdracht:** Gebruik intent engineering om van een feature-idee naar een complete discovery te gaan — marktanalyse, user stories, acceptance criteria, en prioriteringsadvies. Het startpunt: een heldere Goal Hierarchy die de AI vertelt WAAROM deze feature ertoe doet.

Wat je prompt moet bevatten:
1. **Goal Hierarchy:** welk bedrijfsdoel dient deze feature, welke KPI verbetert
2. **Trade-offs:** time-to-market vs completeness, MVP vs full feature
3. **Constraints:** budget, teamcapaciteit, technische haalbaarheid
4. **Niet-onderhandelbaren:** gebruikersonderzoek als basis, niet aannames
5. **Iteratie-log:** hoe veranderde de output toen je de intent verscherpte

- **Tool:** LibreChat
- **Duur:** 45 minuten
- **Deliverable:** Goal Hierarchy + discovery document + user stories + iteratie-log
- **Badge-criteria:** De user stories zijn specifiek genoeg dat een developer ze direct kan oppakken, en de prioritering is onderbouwd met een helder trade-off framework.

## MANAGERS — "Het AI Dashboard"

**Opdracht:** Gebruik intent engineering om ruwe data (sprint velocity, incidents, feedback) om te zetten naar een gestructureerd rapport met Mermaid charts, trends, en aanbevelingen. Niet door te zeggen "maak een rapport" — maar door de AI te vertellen voor wie het rapport is, wat ze ermee moeten doen, en welke beslissingen het moet ondersteunen.

Wat je prompt moet bevatten:
1. **Goal Hierarchy:** welke beslissing moet dit rapport ondersteunen
2. **Trade-offs:** detail vs leesbaarheid, volledigheid vs focus
3. **Constraints:** max 2 pagina's, leesbaar in 5 minuten
4. **Niet-onderhandelbaren:** data moet correct zijn, geen aannames zonder bronvermelding
5. **Iteratie-log:** hoe veranderde de toon en focus toen je de intent verscherpte

- **Tool:** LibreChat
- **Duur:** 45 minuten
- **Deliverable:** Goal Hierarchy + twee rapportversies + vergelijking + iteratie-log
- **Badge-criteria:** Het rapport is direct bruikbaar voor de gedefinieerde stakeholder — juiste toon, juiste KPI's, juiste lengte.

## ADVANCED (Early Adopters) — "De Agent Architect"

**Opdracht:** Ontwerp een multi-agent systeem op papier — inclusief prompt specs voor elke agent. Dit is intent engineering op het hoogste niveau: je definieert niet alleen de intent van je eigen prompt, maar de intent van een heel systeem van samenwerkende agents.

Wat je moet opleveren:
1. **Systeemoverzicht:** welke agents, welke verantwoordelijkheden, hoe communiceren ze
2. **Per agent:** Goal Hierarchy + trade-offs + constraints + escalation policy
3. **Inter-agent intent:** wanneer delegeert agent A naar agent B, en waarom
4. **Failure modes:** wat als een agent verkeerd handelt, hoe wordt dat gecorrigeerd
5. **Intent conflict resolution:** als twee agents conflicterende goals hebben, wie wint

- **Tool:** Claude Code + eigen teksteditor
- **Duur:** 60 minuten
- **Deliverable:** Multi-agent systeem design + prompt specs per agent + intent documentatie
- **Badge-criteria:** Het ontwerp is helder genoeg dat een ander team het kan implementeren, en de intent op elk niveau (systeem, agent, interactie) is expliciet gedocumenteerd.`;

const ROLE_TRACKS_EN = `# Level 4 Role Tracks — "The Builder Challenge"

**This is the BIG assignment of the programme.** The Builder Challenge starts in Level 4 and continues in Level 5. You begin with intent and goal hierarchies, and in the next level you add specifications and verification.

## BACKEND ENGINEERS (Golang / Java) — "The Migration Accelerator"

**Task:** Take a real microservice from your codebase. Use intent engineering to generate a complete migration plan — not by telling the AI HOW, but by making clear WHY and WHERE TO.

Your prompt should contain:
1. **Goal Hierarchy:** why this migration, what is the quarterly goal
2. **Trade-offs:** speed vs thoroughness, backward compatibility vs clean break
3. **Constraints:** which APIs mustn't break, which SLAs apply
4. **Non-negotiables:** PCI compliance, zero-downtime requirement
5. **Iteration log:** document every time you sharpen the intent

- **Tool:** Claude Code
- **Duration:** 45 minutes
- **Deliverable:** Goal Hierarchy + intent prompts + migration plan + iteration log
- **Badge criteria:** Migration plan specific enough that a teammate can execute it without extra explanation, and trade-offs explicitly documented.

## FRONTEND DEVELOPERS (React / Angular) — "The Component Factory"

**Task:** Build a prompt pipeline that goes from a design description to a full React component — with props, styling, tests, and docs. But it starts at intent: why this component, for whom, what problem does it solve.

Your prompt should contain:
1. **Goal Hierarchy:** which user problem does this component solve
2. **Trade-offs:** flexibility vs simplicity, pixel-perfect vs pragmatic
3. **Constraints:** accessibility requirements, performance budget, design system compliance
4. **Non-negotiables:** WCAG 2.1 AA, responsive, no external dependencies
5. **Iteration log:** how did output change when you sharpened intent

- **Tool:** Claude Code or LibreChat
- **Duration:** 45 minutes
- **Deliverable:** Goal Hierarchy + prompt pipeline + working component + iteration log
- **Badge criteria:** Component compiles, is accessible (WCAG 2.1 AA), and fits the existing design system without manual styling fixes.

## TESTERS / QA — "The Edge Case Hunter"

**Task:** Use intent engineering to find all edge cases your team missed for an existing endpoint or feature. The difference with just "find edge cases": you give the AI the intent of the system, so it knows which edge cases matter.

Your prompt should contain:
1. **Goal Hierarchy:** what's the goal of this endpoint/feature, who uses it
2. **Trade-offs:** which edge cases are critical vs nice-to-have
3. **Constraints:** SLAs, compliance requirements, data validation rules
4. **Non-negotiables:** security edge cases are always critical
5. **Iteration log:** which edge cases did the AI find only after intent deepening

- **Tool:** Claude Code or LibreChat
- **Duration:** 45 minutes
- **Deliverable:** Goal Hierarchy + two sets of edge cases + comparison + iteration log
- **Badge criteria:** At least 3 edge cases found that the team didn't have, of which at least 1 is a potential production issue.

## PRODUCT MANAGERS / UX — "The Discovery Agent"

**Task:** Use intent engineering to go from feature idea to complete discovery — market analysis, user stories, acceptance criteria, prioritisation advice. Starting point: a clear Goal Hierarchy telling the AI WHY this feature matters.

Your prompt should contain:
1. **Goal Hierarchy:** which business goal does this feature serve, which KPI improves
2. **Trade-offs:** time-to-market vs completeness, MVP vs full feature
3. **Constraints:** budget, team capacity, technical feasibility
4. **Non-negotiables:** user research as basis, not assumptions
5. **Iteration log:** how did output change when you sharpened intent

- **Tool:** LibreChat
- **Duration:** 45 minutes
- **Deliverable:** Goal Hierarchy + discovery document + user stories + iteration log
- **Badge criteria:** User stories specific enough for a developer to pick up directly, and prioritisation backed by a clear trade-off framework.

## MANAGERS — "The AI Dashboard"

**Task:** Use intent engineering to convert raw data (sprint velocity, incidents, feedback) into a structured report with Mermaid charts, trends, and recommendations. Not by saying "make a report" — but by telling the AI for whom the report is, what they should do with it, and which decisions it should support.

Your prompt should contain:
1. **Goal Hierarchy:** which decision should this report support
2. **Trade-offs:** detail vs readability, completeness vs focus
3. **Constraints:** max 2 pages, readable in 5 minutes
4. **Non-negotiables:** data must be correct, no assumptions without source
5. **Iteration log:** how did tone and focus change when you sharpened intent

- **Tool:** LibreChat
- **Duration:** 45 minutes
- **Deliverable:** Goal Hierarchy + two report versions + comparison + iteration log
- **Badge criteria:** Report directly usable for the defined stakeholder — right tone, right KPIs, right length.

## ADVANCED (Early Adopters) — "The Agent Architect"

**Task:** Design a multi-agent system on paper — including prompt specs for every agent. This is intent engineering at the highest level: you define not only the intent of your own prompt but the intent of a whole system of collaborating agents.

What you must deliver:
1. **System overview:** which agents, which responsibilities, how do they communicate
2. **Per agent:** Goal Hierarchy + trade-offs + constraints + escalation policy
3. **Inter-agent intent:** when does agent A delegate to agent B, and why
4. **Failure modes:** what if an agent acts wrong, how is that corrected
5. **Intent conflict resolution:** if two agents have conflicting goals, who wins

- **Tool:** Claude Code + own text editor
- **Duration:** 60 minutes
- **Deliverable:** Multi-agent system design + prompt specs per agent + intent documentation
- **Badge criteria:** Design clear enough that another team can implement it, and intent at every level (system, agent, interaction) explicitly documented.`;

const ROLE_TRACKS_FR = `# Tracks rôle Level 4 — « La Builder Challenge »

**C'est la GRANDE tâche du programme.** La Builder Challenge démarre au Level 4 et continue au Level 5. Vous commencez avec intent et goal hierarchies, et au niveau suivant vous ajoutez specs et vérification.

## BACKEND ENGINEERS (Golang / Java) — « L'Accélérateur de Migration »

**Tâche :** Prenez un vrai microservice de votre codebase. Utilisez l'intent engineering pour générer un plan de migration complet — pas en disant à l'IA COMMENT, mais en rendant clair POURQUOI et VERS OÙ.

Votre prompt doit contenir :
1. **Goal Hierarchy :** pourquoi cette migration, quel but trimestriel
2. **Trade-offs :** vitesse vs rigueur, backward compatibility vs clean break
3. **Constraints :** quelles API ne doivent pas casser, quels SLA
4. **Non-négociables :** PCI compliance, zero-downtime
5. **Iteration log :** documentez chaque affinement d'intent

- **Outil :** Claude Code
- **Durée :** 45 minutes
- **Livrable :** Goal Hierarchy + prompts intent + plan migration + iteration log
- **Critères badge :** Plan de migration spécifique assez qu'un coéquipier l'exécute sans explication, trade-offs explicitement documentés.

## FRONTEND DEVELOPERS (React / Angular) — « La Component Factory »

**Tâche :** Construisez un prompt pipeline qui va d'une description design à un composant React complet — avec props, styling, tests, doc. Mais ça commence par l'intent : pourquoi ce composant, pour qui, quel problème résout-il.

Votre prompt doit contenir :
1. **Goal Hierarchy :** quel problème user ce composant résout-il
2. **Trade-offs :** flexibilité vs simplicité, pixel-perfect vs pragmatique
3. **Constraints :** exigences accessibility, performance budget, design system compliance
4. **Non-négociables :** WCAG 2.1 AA, responsive, pas de dépendances externes
5. **Iteration log :** comment la sortie a-t-elle changé quand vous avez affiné l'intent

- **Outil :** Claude Code ou LibreChat
- **Durée :** 45 minutes
- **Livrable :** Goal Hierarchy + prompt pipeline + composant fonctionnel + iteration log
- **Critères badge :** Composant compile, accessible (WCAG 2.1 AA), s'intègre au design system existant sans fixes styling manuels.

## TESTERS / QA — « L'Edge Case Hunter »

**Tâche :** Utilisez l'intent engineering pour trouver tous les edge cases que votre équipe a ratés pour un endpoint existant ou une feature. La différence avec juste « trouve des edge cases » : vous donnez à l'IA l'intent du système, donc elle sait quels edge cases comptent.

Votre prompt doit contenir :
1. **Goal Hierarchy :** quel est le but de cet endpoint/feature, qui l'utilise
2. **Trade-offs :** quels edge cases sont critical vs nice-to-have
3. **Constraints :** SLA, exigences compliance, règles validation data
4. **Non-négociables :** security edge cases sont toujours critical
5. **Iteration log :** quels edge cases l'IA a trouvés après intent approfondi

- **Outil :** Claude Code ou LibreChat
- **Durée :** 45 minutes
- **Livrable :** Goal Hierarchy + deux sets d'edge cases + comparaison + iteration log
- **Critères badge :** Au moins 3 edge cases trouvés que l'équipe n'avait pas, dont au moins 1 problème production potentiel.

## PRODUCT MANAGERS / UX — « Le Discovery Agent »

**Tâche :** Utilisez l'intent engineering pour aller d'une idée de feature à un discovery complet — analyse marché, user stories, acceptance criteria, conseil priorisation. Point de départ : une Goal Hierarchy claire qui dit à l'IA POURQUOI cette feature importe.

Votre prompt doit contenir :
1. **Goal Hierarchy :** quel but business cette feature sert, quel KPI améliore
2. **Trade-offs :** time-to-market vs complétude, MVP vs full feature
3. **Constraints :** budget, capacité équipe, faisabilité technique
4. **Non-négociables :** user research comme base, pas d'hypothèses
5. **Iteration log :** comment la sortie a-t-elle changé quand vous avez affiné l'intent

- **Outil :** LibreChat
- **Durée :** 45 minutes
- **Livrable :** Goal Hierarchy + discovery document + user stories + iteration log
- **Critères badge :** User stories spécifiques pour qu'un dev les prenne direct, priorisation soutenue par framework trade-off clair.

## MANAGERS — « Le AI Dashboard »

**Tâche :** Utilisez l'intent engineering pour convertir des données brutes (sprint velocity, incidents, feedback) en un rapport structuré avec Mermaid charts, tendances, recommandations. Pas en disant « fais un rapport » — mais en disant à l'IA pour qui le rapport, quoi en faire, quelles décisions il doit supporter.

Votre prompt doit contenir :
1. **Goal Hierarchy :** quelle décision ce rapport doit supporter
2. **Trade-offs :** détail vs lisibilité, complétude vs focus
3. **Constraints :** max 2 pages, lisible en 5 minutes
4. **Non-négociables :** data doit être correcte, pas d'hypothèses sans source
5. **Iteration log :** comment ton et focus ont-ils changé quand vous avez affiné l'intent

- **Outil :** LibreChat
- **Durée :** 45 minutes
- **Livrable :** Goal Hierarchy + deux versions rapport + comparaison + iteration log
- **Critères badge :** Rapport directement utilisable pour le stakeholder défini — bon ton, bons KPI, bonne longueur.

## ADVANCED (Early Adopters) — « L'Agent Architect »

**Tâche :** Concevez un système multi-agent sur papier — y compris prompt specs pour chaque agent. C'est de l'intent engineering au plus haut niveau : vous définissez non seulement l'intent de votre propre prompt mais l'intent d'un système entier d'agents collaborants.

Ce que vous devez livrer :
1. **Vue système :** quels agents, quelles responsabilités, comment communiquent
2. **Par agent :** Goal Hierarchy + trade-offs + constraints + escalation policy
3. **Intent inter-agent :** quand agent A délègue-t-il à agent B, et pourquoi
4. **Failure modes :** si un agent agit mal, comment est-ce corrigé
5. **Intent conflict resolution :** si deux agents ont des goals conflictuels, qui gagne

- **Outil :** Claude Code + éditeur texte personnel
- **Durée :** 60 minutes
- **Livrable :** Design système multi-agent + prompt specs par agent + documentation intent
- **Critères badge :** Design clair assez qu'une autre équipe l'implémente, intent à chaque niveau (système, agent, interaction) explicitement documenté.`;

// ═════════════════════════════════════════════════════════════════════════════
// ── WEEK 3 EXPORT ───────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

export const WEEK_3: CurriculumWeek = {
  id: 'week-3',
  number: 3,
  title: 'Level 4 — Intent Engineering',
  titleI18n: {
    en: 'Level 4 — Intent Engineering',
    nl: 'Level 4 — Intent Engineering',
    fr: 'Level 4 — Intent Engineering',
  },
  subtitle: 'Teaching AI What You Actually Want · van instructie naar intentie',
  subtitleI18n: {
    en: 'Teaching AI What You Actually Want · from instruction to intention',
    nl: 'Teaching AI What You Actually Want · van instructie naar intentie',
    fr: 'Teaching AI What You Actually Want · de l\'instruction à l\'intention',
  },
  description:
    'Na dit level begrijpt elke deelnemer het verschil tussen een instructie en een intentie. Je kunt een Goal Hierarchy schrijven (Mission → Objective → Goal → Task → Constraint), trade-offs expliciteren via het 6-dimensie canvas, en je prompts verrijken met advanced techniques (CoT, Few-Shot, Iterative Refinement, Meta-Prompting) — zodat AI niet alleen doet wat je zegt, maar begrijpt wat je bedoelt.',
  descriptionI18n: {
    en: 'After this level every participant understands the difference between an instruction and an intention. You can write a Goal Hierarchy (Mission → Objective → Goal → Task → Constraint), make trade-offs explicit via the 6-dimension canvas, and enrich prompts with advanced techniques (CoT, Few-Shot, Iterative Refinement, Meta-Prompting) — so AI does not only what you say, but understands what you mean.',
    nl: 'Na dit level begrijpt elke deelnemer het verschil tussen een instructie en een intentie. Je kunt een Goal Hierarchy schrijven (Mission → Objective → Goal → Task → Constraint), trade-offs expliciteren via het 6-dimensie canvas, en je prompts verrijken met advanced techniques (CoT, Few-Shot, Iterative Refinement, Meta-Prompting) — zodat AI niet alleen doet wat je zegt, maar begrijpt wat je bedoelt.',
    fr: 'Après ce niveau, chaque participant comprend la différence entre une instruction et une intention. Vous pouvez écrire une Goal Hierarchy (Mission → Objective → Goal → Task → Constraint), rendre les trade-offs explicites via le canvas 6-dimensions, et enrichir vos prompts avec des advanced techniques (CoT, Few-Shot, Iterative Refinement, Meta-Prompting) — pour que l\'IA ne fasse pas seulement ce que vous dites, mais comprenne ce que vous voulez dire.',
  },
  objectives: [
    'Herken het Intent Gap — verschil tussen wat je typt en wat de AI moet begrijpen',
    'Beantwoord de 3 Intent Safety vragen voor elke AI-taak',
    'Schrijf een Goal Hierarchy (Mission → Objective → Goal → Task → Constraint) in 5-10 regels',
    'Maak trade-offs expliciet via het 6-dimensie canvas (performance/complexity/maintainability/cost/time-to-market/scalability)',
    'Pas advanced techniques toe: Chain-of-Thought, Few-Shot, Iterative Refinement, Meta-Prompting',
  ],
  objectivesI18n: {
    en: [
      'Recognise the Intent Gap — difference between what you type and what the AI must understand',
      'Answer the 3 Intent Safety questions for every AI task',
      'Write a Goal Hierarchy (Mission → Objective → Goal → Task → Constraint) in 5-10 lines',
      'Make trade-offs explicit via the 6-dimension canvas (performance/complexity/maintainability/cost/time-to-market/scalability)',
      'Apply advanced techniques: Chain-of-Thought, Few-Shot, Iterative Refinement, Meta-Prompting',
    ],
    nl: [
      'Herken het Intent Gap — verschil tussen wat je typt en wat de AI moet begrijpen',
      'Beantwoord de 3 Intent Safety vragen voor elke AI-taak',
      'Schrijf een Goal Hierarchy (Mission → Objective → Goal → Task → Constraint) in 5-10 regels',
      'Maak trade-offs expliciet via het 6-dimensie canvas (performance/complexity/maintainability/cost/time-to-market/scalability)',
      'Pas advanced techniques toe: Chain-of-Thought, Few-Shot, Iterative Refinement, Meta-Prompting',
    ],
    fr: [
      'Reconnaître l\'Intent Gap — différence entre ce que vous tapez et ce que l\'IA doit comprendre',
      'Répondre aux 3 questions Intent Safety pour chaque tâche IA',
      'Écrire une Goal Hierarchy (Mission → Objective → Goal → Task → Constraint) en 5-10 lignes',
      'Rendre les trade-offs explicites via le canvas 6-dimensions',
      'Appliquer les advanced techniques : Chain-of-Thought, Few-Shot, Iterative Refinement, Meta-Prompting',
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
  badgeName: 'Intent Architect',
  badgeNameI18n: {
    en: 'Intent Architect',
    nl: 'Intent Architect',
    fr: 'Intent Architect',
  },
  badgeIcon: '🎯',
  weeklyQuiz: [
    {
      id: 'w3-q1',
      question: 'Wat bedoelt Nate B. Jones met "Intent is NOT in the text"?',
      questionI18n: {
        en: 'What does Nate B. Jones mean by "Intent is NOT in the text"?',
        nl: 'Wat bedoelt Nate B. Jones met "Intent is NOT in the text"?',
        fr: 'Que veut dire Nate B. Jones par "Intent is NOT in the text" ?',
      },
      options: [
        'Intent moet via voice in plaats van tekst',
        'Intent leeft in context + historie + impliciete aannames, niet letterlijk in de prompt',
        'De AI moet intent zelf afleiden zonder hulp',
        'Prompts mogen geen intent bevatten',
      ],
      optionsI18n: {
        en: [
          'Intent must come via voice instead of text',
          'Intent lives in context + history + implicit assumptions, not literally in the prompt',
          'The AI must infer intent itself without help',
          'Prompts should contain no intent',
        ],
        nl: [
          'Intent moet via voice in plaats van tekst',
          'Intent leeft in context + historie + impliciete aannames, niet letterlijk in de prompt',
          'De AI moet intent zelf afleiden zonder hulp',
          'Prompts mogen geen intent bevatten',
        ],
        fr: [
          'Intent doit venir par voice plutôt que texte',
          'Intent vit dans contexte + historique + hypothèses implicites, pas littéralement dans le prompt',
          'L\'IA doit inférer l\'intent elle-même',
          'Les prompts ne doivent pas contenir d\'intent',
        ],
      },
      correctIndex: 1,
      explanation: 'Het Intent Gap = kloof tussen wat je typt en wat je bedoelt. De intent zit in jouw hoofd (ervaring, gesprekken, aannames) — je moet het expliciteren om de AI het te geven.',
      explanationI18n: {
        en: 'The Intent Gap = distance between what you type and what you mean. Intent lives in your head (experience, conversations, assumptions) — you must make it explicit to give it to the AI.',
        nl: 'Het Intent Gap = kloof tussen wat je typt en wat je bedoelt. De intent zit in jouw hoofd (ervaring, gesprekken, aannames) — je moet het expliciteren om de AI het te geven.',
        fr: 'L\'Intent Gap = écart entre ce que vous tapez et ce que vous voulez dire. L\'intent vit dans votre tête — vous devez l\'expliciter pour le donner à l\'IA.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w3-q2',
      question: 'Wat zijn de 5 lagen van de Goal Hierarchy?',
      questionI18n: {
        en: 'What are the 5 layers of the Goal Hierarchy?',
        nl: 'Wat zijn de 5 lagen van de Goal Hierarchy?',
        fr: 'Quelles sont les 5 couches de la Goal Hierarchy ?',
      },
      options: [
        'Strategy / Tactics / Execution / Review / Iterate',
        'Mission → Objective → Goal → Task → Constraint',
        'Business → Team → Squad → Engineer → Task',
        'Why → What → Where → When → How',
      ],
      optionsI18n: {
        en: [
          'Strategy / Tactics / Execution / Review / Iterate',
          'Mission → Objective → Goal → Task → Constraint',
          'Business → Team → Squad → Engineer → Task',
          'Why → What → Where → When → How',
        ],
        nl: [
          'Strategy / Tactics / Execution / Review / Iterate',
          'Mission → Objective → Goal → Task → Constraint',
          'Business → Team → Squad → Engineer → Task',
          'Why → What → Where → When → How',
        ],
        fr: [
          'Stratégie / Tactique / Exécution / Review / Itérer',
          'Mission → Objective → Goal → Task → Constraint',
          'Business → Équipe → Squad → Ingénieur → Task',
          'Pourquoi → Quoi → Où → Quand → Comment',
        ],
      },
      correctIndex: 1,
      explanation: 'Mission (waarom project), Objective (kwartaaldoel), Goal (meetbare feature-doel), Task (concrete stappen), Constraint (grenzen). Vuistregel: 5-10 regels totaal, niet 40.',
      explanationI18n: {
        en: 'Mission (why project), Objective (quarterly goal), Goal (measurable feature goal), Task (concrete steps), Constraint (boundaries). Rule of thumb: 5-10 lines total, not 40.',
        nl: 'Mission (waarom project), Objective (kwartaaldoel), Goal (meetbare feature-doel), Task (concrete stappen), Constraint (grenzen). Vuistregel: 5-10 regels totaal, niet 40.',
        fr: 'Mission (pourquoi projet), Objective (but trimestriel), Goal (but feature mesurable), Task (étapes concrètes), Constraint (limites). Règle : 5-10 lignes total, pas 40.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w3-q3',
      question: 'Welke 3 vragen moet je voor elke AI-taak beantwoorden volgens de Intent Safety Framework?',
      questionI18n: {
        en: 'Which 3 questions should you answer for every AI task per the Intent Safety Framework?',
        nl: 'Welke 3 vragen moet je voor elke AI-taak beantwoorden volgens de Intent Safety Framework?',
        fr: 'Quelles 3 questions poser pour chaque tâche IA selon Intent Safety Framework ?',
      },
      options: [
        'Wat / Wanneer / Waarom',
        'Wat mag NIET? / Wanneer stoppen? / Doel vs constraint?',
        'Model / Prompt / Output',
        'Plan / Execute / Review',
      ],
      optionsI18n: {
        en: [
          'What / When / Why',
          'What NOT? / When to stop? / Goal vs constraint?',
          'Model / Prompt / Output',
          'Plan / Execute / Review',
        ],
        nl: [
          'Wat / Wanneer / Waarom',
          'Wat mag NIET? / Wanneer stoppen? / Doel vs constraint?',
          'Model / Prompt / Output',
          'Plan / Execute / Review',
        ],
        fr: [
          'Quoi / Quand / Pourquoi',
          'Quoi NON ? / Quand s\'arrêter ? / But vs contrainte ?',
          'Modèle / Prompt / Sortie',
          'Plan / Exécuter / Review',
        ],
      },
      correctIndex: 1,
      explanation: 'Nate\'s 3 vragen: (1) Wat mag NIET, zelfs als doel bereikt wordt? (2) Wanneer stop en vraag je? (3) Als doel en constraint conflicteren, welke wint?',
      explanationI18n: {
        en: 'Nate\'s 3 questions: (1) What NOT, even if goal is met? (2) When stop and ask? (3) If goal and constraint conflict, which wins?',
        nl: 'Nate\'s 3 vragen: (1) Wat mag NIET, zelfs als doel bereikt wordt? (2) Wanneer stop en vraag je? (3) Als doel en constraint conflicteren, welke wint?',
        fr: 'Les 3 questions de Nate : (1) Quoi NON, même si but atteint ? (2) Quand arrêter et demander ? (3) Si but et contrainte conflit, lequel gagne ?',
      },
      bloomLevel: 3,
      euAiActRelevant: false,
      points: 10,
    },
    {
      id: 'w3-q4',
      question: 'Hoeveel dimensies evalueer je volgens het Trade-off Canvas?',
      questionI18n: {
        en: 'How many dimensions do you evaluate per the Trade-off Canvas?',
        nl: 'Hoeveel dimensies evalueer je volgens het Trade-off Canvas?',
        fr: 'Combien de dimensions évaluez-vous selon le Trade-off Canvas ?',
      },
      options: ['3 (iron triangle)', '6 (performance / complexity / maintainability / cost / time-to-market / scalability)', '12 (alle kwaliteitsattributen)', 'Alleen de 2 belangrijkste'],
      optionsI18n: {
        en: ['3 (iron triangle)', '6 (performance / complexity / maintainability / cost / time-to-market / scalability)', '12 (all quality attributes)', 'Only the top 2'],
        nl: ['3 (iron triangle)', '6 (performance / complexity / maintainability / cost / time-to-market / scalability)', '12 (alle kwaliteitsattributen)', 'Alleen de 2 belangrijkste'],
        fr: ['3 (triangle de fer)', '6 (performance / complexité / maintenabilité / coût / time-to-market / scalability)', '12 (tous attributs qualité)', 'Seulement le top 2'],
      },
      correctIndex: 1,
      explanation: 'Zes dimensies. Geen enkele oplossing scoort 10 op alle zes. Door te benoemen welke je prioriteert, geef je de AI een kompas voor architectuurbeslissingen.',
      explanationI18n: {
        en: 'Six dimensions. No solution scores 10 on all six. By naming which ones you prioritise, you give the AI a compass for architecture decisions.',
        nl: 'Zes dimensies. Geen enkele oplossing scoort 10 op alle zes. Door te benoemen welke je prioriteert, geef je de AI een kompas voor architectuurbeslissingen.',
        fr: 'Six dimensions. Aucune solution ne marque 10 sur les six. En nommant vos priorités, vous donnez à l\'IA une boussole pour les décisions architecturales.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w3-q5',
      question: 'Wat is Meta-Prompting?',
      questionI18n: {
        en: 'What is Meta-Prompting?',
        nl: 'Wat is Meta-Prompting?',
        fr: 'Qu\'est-ce que le Meta-Prompting ?',
      },
      options: [
        'Een prompt schrijven over prompts',
        'De AI om vragen vragen zodat jij een betere prompt schrijft',
        'Een prompt in meta-formaat (YAML, JSON)',
        'Prompts met veel metadata',
      ],
      optionsI18n: {
        en: [
          'Writing a prompt about prompts',
          'Asking the AI for questions so you write a better prompt',
          'A prompt in meta format (YAML, JSON)',
          'Prompts with lots of metadata',
        ],
        nl: [
          'Een prompt schrijven over prompts',
          'De AI om vragen vragen zodat jij een betere prompt schrijft',
          'Een prompt in meta-formaat (YAML, JSON)',
          'Prompts met veel metadata',
        ],
        fr: [
          'Écrire un prompt sur les prompts',
          'Demander à l\'IA des questions pour écrire un meilleur prompt',
          'Un prompt en format meta (YAML, JSON)',
          'Prompts avec beaucoup de metadata',
        ],
      },
      correctIndex: 1,
      explanation: 'Meta-Prompting: "Welke info mis je om me het beste te helpen? Stel me 5 gerichte vragen." Door die vragen te beantwoorden schrijf je vanzelf een betere prompt.',
      explanationI18n: {
        en: 'Meta-Prompting: "What info do you need to help me best? Ask me 5 targeted questions." Answering those questions writes a better prompt naturally.',
        nl: 'Meta-Prompting: "Welke info mis je om me het beste te helpen? Stel me 5 gerichte vragen." Door die vragen te beantwoorden schrijf je vanzelf een betere prompt.',
        fr: 'Meta-Prompting : « Quelle info te manque pour m\'aider au mieux ? Pose 5 questions. » Répondre écrit un meilleur prompt naturellement.',
      },
      bloomLevel: 3,
      euAiActRelevant: false,
      points: 10,
    },
  ],
  days: [
    // ───── DAG 1: Les 4.1 + Lab 4A ─────
    {
      day: 1,
      title: 'Les 4.1 — Intent Is NOT in the Text',
      titleI18n: {
        en: 'Lesson 4.1 — Intent Is NOT in the Text',
        nl: 'Les 4.1 — Intent Is NOT in the Text',
        fr: 'Leçon 4.1 — Intent Is NOT in the Text',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w3d1-theory',
          title: 'Les 4.1 — Intent Is NOT in the Text',
          titleI18n: {
            en: 'Lesson 4.1 — Intent Is NOT in the Text',
            nl: 'Les 4.1 — Intent Is NOT in the Text',
            fr: 'Leçon 4.1 — Intent Is NOT in the Text',
          },
          type: 'theory',
          duration: 20,
          description: 'Intent Gap · Nate\'s 3 Intent Safety vragen · Worldline base intents',
          descriptionI18n: {
            en: 'Intent Gap · Nate\'s 3 Intent Safety questions · Worldline base intents',
            nl: 'Intent Gap · Nate\'s 3 Intent Safety vragen · Worldline base intents',
            fr: 'Intent Gap · 3 questions Intent Safety de Nate · intents base Worldline',
          },
          content: LESSON_4_1_NL,
          contentI18n: { en: LESSON_4_1_EN, nl: LESSON_4_1_NL, fr: LESSON_4_1_FR },
        },
        {
          id: 'w3d1-lab',
          title: 'Lab 4A — Pain Lab: Voel het Intent Gap',
          titleI18n: {
            en: 'Lab 4A — Pain Lab: Feel the Intent Gap',
            nl: 'Lab 4A — Pain Lab: Voel het Intent Gap',
            fr: 'Lab 4A — Pain Lab : Ressentez l\'Intent Gap',
          },
          type: 'lab',
          duration: 30,
          description: 'Caching layer prompt — zonder intent vs met Goal Hierarchy · before/after vergelijking',
          descriptionI18n: {
            en: 'Caching layer prompt — without intent vs with Goal Hierarchy · before/after comparison',
            nl: 'Caching layer prompt — zonder intent vs met Goal Hierarchy · before/after vergelijking',
            fr: 'Prompt caching layer — sans intent vs avec Goal Hierarchy · comparaison before/after',
          },
          content: LAB_4A_NL,
          contentI18n: { en: LAB_4A_EN, nl: LAB_4A_NL, fr: LAB_4A_FR },
          exercises: [
            {
              id: 'w3d1-ex1',
              title: 'Before/After caching prompts + vergelijking',
              titleI18n: {
                en: 'Before/After caching prompts + comparison',
                nl: 'Before/After caching prompts + vergelijking',
                fr: 'Prompts caching before/after + comparaison',
              },
              instructions: 'Twee Pentagon prompts voor caching layer: zonder intent, met Goal Hierarchy + trade-offs. Beantwoord: welke output beter? Welke iteraties bespaard?',
              instructionsI18n: {
                en: 'Two Pentagon prompts for caching layer: without intent, with Goal Hierarchy + trade-offs. Answer: which output better? Which iterations saved?',
                nl: 'Twee Pentagon prompts voor caching layer: zonder intent, met Goal Hierarchy + trade-offs. Beantwoord: welke output beter? Welke iteraties bespaard?',
                fr: 'Deux prompts Pentagon pour caching layer : sans intent, avec Goal Hierarchy + trade-offs. Répondre : quelle sortie meilleure ? Quelles itérations économisées ?',
              },
              type: 'prompt-craft',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 2: Les 4.2 + Lab 4B ─────
    {
      day: 2,
      title: 'Les 4.2 — Van "Wat" naar "Waarom"',
      titleI18n: {
        en: 'Lesson 4.2 — From "What" to "Why"',
        nl: 'Les 4.2 — Van "Wat" naar "Waarom"',
        fr: 'Leçon 4.2 — De "Quoi" à "Pourquoi"',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w3d2-theory',
          title: 'Les 4.2 — Van "Wat" naar "Waarom"',
          titleI18n: {
            en: 'Lesson 4.2 — From "What" to "Why"',
            nl: 'Les 4.2 — Van "Wat" naar "Waarom"',
            fr: 'Leçon 4.2 — De "Quoi" à "Pourquoi"',
          },
          type: 'theory',
          duration: 20,
          description: 'Quicksort vs mergesort voorbeeld · 3 lagen van intent · wanneer intent cruciaal is',
          descriptionI18n: {
            en: 'Quicksort vs mergesort example · 3 layers of intent · when intent is crucial',
            nl: 'Quicksort vs mergesort voorbeeld · 3 lagen van intent · wanneer intent cruciaal is',
            fr: 'Exemple quicksort vs mergesort · 3 couches d\'intent · quand l\'intent est crucial',
          },
          content: LESSON_4_2_NL,
          contentI18n: { en: LESSON_4_2_EN, nl: LESSON_4_2_NL, fr: LESSON_4_2_FR },
        },
        {
          id: 'w3d2-lab',
          title: 'Lab 4B — Goal Hierarchies voor Echte Features',
          titleI18n: {
            en: 'Lab 4B — Goal Hierarchies for Real Features',
            nl: 'Lab 4B — Goal Hierarchies voor Echte Features',
            fr: 'Lab 4B — Goal Hierarchies pour Vraies Features',
          },
          type: 'lab',
          duration: 45,
          description: 'Goal Hierarchy voor eigen sprint-feature · before/after met intent · mini-ADR',
          descriptionI18n: {
            en: 'Goal Hierarchy for your own sprint feature · before/after with intent · mini ADR',
            nl: 'Goal Hierarchy voor eigen sprint-feature · before/after met intent · mini-ADR',
            fr: 'Goal Hierarchy pour feature sprint · before/after avec intent · mini-ADR',
          },
          content: LAB_4B_NL,
          contentI18n: { en: LAB_4B_EN, nl: LAB_4B_NL, fr: LAB_4B_FR },
          exercises: [
            {
              id: 'w3d2-ex1',
              title: 'Goal Hierarchy + before/after + mini-ADR',
              titleI18n: {
                en: 'Goal Hierarchy + before/after + mini-ADR',
                nl: 'Goal Hierarchy + before/after + mini-ADR',
                fr: 'Goal Hierarchy + before/after + mini-ADR',
              },
              instructions: 'Lever: complete Goal Hierarchy voor echte sprint-feature + 2 AI-outputs (zonder/met intent) + mini-ADR met trade-offs + reflectie op tijdsbesparing.',
              instructionsI18n: {
                en: 'Deliver: complete Goal Hierarchy for real sprint feature + 2 AI outputs (without/with intent) + mini ADR with trade-offs + reflection on time saved.',
                nl: 'Lever: complete Goal Hierarchy voor echte sprint-feature + 2 AI-outputs (zonder/met intent) + mini-ADR met trade-offs + reflectie op tijdsbesparing.',
                fr: 'Livrez : Goal Hierarchy complète pour feature réelle + 2 sorties IA (sans/avec intent) + mini-ADR + réflexion temps économisé.',
              },
              type: 'free-form',
              difficulty: 3,
              points: 20,
            },
          ],
        },
      ],
    },
    // ───── DAG 3: Les 4.3 + Builder Challenge role tracks ─────
    {
      day: 3,
      title: 'Les 4.3 — De Goal Hierarchy',
      titleI18n: {
        en: 'Lesson 4.3 — The Goal Hierarchy',
        nl: 'Les 4.3 — De Goal Hierarchy',
        fr: 'Leçon 4.3 — La Goal Hierarchy',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w3d3-theory',
          title: 'Les 4.3 — De Goal Hierarchy',
          titleI18n: {
            en: 'Lesson 4.3 — The Goal Hierarchy',
            nl: 'Les 4.3 — De Goal Hierarchy',
            fr: 'Leçon 4.3 — La Goal Hierarchy',
          },
          type: 'theory',
          duration: 20,
          description: 'Mission → Objective → Goal → Task → Constraint · 5-step schrijfproces · valkuil te veel hierarchy',
          descriptionI18n: {
            en: 'Mission → Objective → Goal → Task → Constraint · 5-step writing process · trap of too much hierarchy',
            nl: 'Mission → Objective → Goal → Task → Constraint · 5-step schrijfproces · valkuil te veel hierarchy',
            fr: 'Mission → Objective → Goal → Task → Constraint · processus écriture 5 étapes · piège trop de hierarchy',
          },
          content: LESSON_4_3_NL,
          contentI18n: { en: LESSON_4_3_EN, nl: LESSON_4_3_NL, fr: LESSON_4_3_FR },
        },
        {
          id: 'w3d3-lab',
          title: 'Lab — 6 Rol-opdrachten "De Builder Challenge"',
          titleI18n: {
            en: 'Lab — 6 Role Tracks "The Builder Challenge"',
            nl: 'Lab — 6 Rol-opdrachten "De Builder Challenge"',
            fr: 'Lab — 6 Tracks rôle « La Builder Challenge »',
          },
          type: 'lab',
          duration: 60,
          description: 'Builder Challenge start in Level 4 en loopt door in Level 5 · kies 1 rol (Backend/Frontend/QA/PM/Manager/Advanced)',
          descriptionI18n: {
            en: 'Builder Challenge starts in Level 4 and continues in Level 5 · pick 1 role (Backend/Frontend/QA/PM/Manager/Advanced)',
            nl: 'Builder Challenge start in Level 4 en loopt door in Level 5 · kies 1 rol (Backend/Frontend/QA/PM/Manager/Advanced)',
            fr: 'La Builder Challenge démarre au Level 4 et continue au Level 5 · choisissez 1 rôle',
          },
          content: ROLE_TRACKS_NL,
          contentI18n: { en: ROLE_TRACKS_EN, nl: ROLE_TRACKS_NL, fr: ROLE_TRACKS_FR },
          exercises: [
            {
              id: 'w3d3-ex1',
              title: 'Builder Challenge deliverable (start multi-level)',
              titleI18n: {
                en: 'Builder Challenge deliverable (multi-level start)',
                nl: 'Builder Challenge deliverable (start multi-level)',
                fr: 'Livrable Builder Challenge (début multi-level)',
              },
              instructions: 'Kies rol-track. Duur 45-60 min. Deliverable: Goal Hierarchy + intent-prompts + output + iteratie-log. Badge: rol-specifiek criterium gehaald. Wordt uitgebreid in Level 5 met specs + verificatie.',
              instructionsI18n: {
                en: 'Pick role track. 45-60 min. Deliverable: Goal Hierarchy + intent prompts + output + iteration log. Badge: role-specific criterion met. Extended in Level 5 with specs + verification.',
                nl: 'Kies rol-track. Duur 45-60 min. Deliverable: Goal Hierarchy + intent-prompts + output + iteratie-log. Badge: rol-specifiek criterium gehaald. Wordt uitgebreid in Level 5 met specs + verificatie.',
                fr: 'Choisissez track. 45-60 min. Livrable : Goal Hierarchy + prompts intent + sortie + iteration log. Badge : critère rôle atteint. Étendu au Level 5 avec specs + vérification.',
              },
              type: 'free-form',
              difficulty: 3,
              points: 20,
            },
          ],
        },
      ],
    },
    // ───── DAG 4: Les 4.4 + Lab ADR ─────
    {
      day: 4,
      title: 'Les 4.4 — Trade-off Frameworks',
      titleI18n: {
        en: 'Lesson 4.4 — Trade-off Frameworks',
        nl: 'Les 4.4 — Trade-off Frameworks',
        fr: 'Leçon 4.4 — Trade-off Frameworks',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w3d4-theory',
          title: 'Les 4.4 — Trade-off Frameworks',
          titleI18n: {
            en: 'Lesson 4.4 — Trade-off Frameworks',
            nl: 'Les 4.4 — Trade-off Frameworks',
            fr: 'Leçon 4.4 — Trade-off Frameworks',
          },
          type: 'theory',
          duration: 15,
          description: '6-dimensie canvas · fraud detection voorbeeld · ADRs + devil\'s advocate',
          descriptionI18n: {
            en: '6-dimension canvas · fraud detection example · ADRs + devil\'s advocate',
            nl: '6-dimensie canvas · fraud detection voorbeeld · ADRs + devil\'s advocate',
            fr: 'Canvas 6 dimensions · exemple fraud detection · ADRs + devil\'s advocate',
          },
          content: LESSON_4_4_NL,
          contentI18n: { en: LESSON_4_4_EN, nl: LESSON_4_4_NL, fr: LESSON_4_4_FR },
        },
        {
          id: 'w3d4-lab',
          title: 'Lab — ADR Writing Practice',
          titleI18n: {
            en: 'Lab — ADR Writing Practice',
            nl: 'Lab — ADR Writing Practice',
            fr: 'Lab — Pratique d\'écriture ADR',
          },
          type: 'lab',
          duration: 30,
          description: 'Schrijf een ADR voor een recente beslissing · AI als devil\'s advocate · trade-offs documenteren',
          descriptionI18n: {
            en: 'Write an ADR for a recent decision · AI as devil\'s advocate · document trade-offs',
            nl: 'Schrijf een ADR voor een recente beslissing · AI als devil\'s advocate · trade-offs documenteren',
            fr: 'Écrire un ADR pour décision récente · IA comme devil\'s advocate · documenter trade-offs',
          },
          content: `# Lab — ADR Writing Practice

**Duur: 30 minuten**

Neem een recente significante beslissing uit je team (architectuur, tool-keuze, process-change).

## Stap 1: Schrijf de ADR (15 min)

\`\`\`markdown
# ADR-00X: [Titel]

## Status: [Proposed / Accepted / Deprecated]
## Context: [Wat is de situatie?]
## Decision: [Wat hebben we besloten?]
## Consequences: [Wat zijn de gevolgen — positief en negatief?]
## Trade-offs accepted: [Wat accepteren we?]
\`\`\`

## Stap 2: Laat AI devil's advocate spelen (10 min)

Geef Claude je ADR en vraag:
> "Speel devil's advocate. Waarom zou deze beslissing verkeerd kunnen zijn? Welke scenario's maken het problematisch?"

Documenteer de gevonden risico's.

## Stap 3: Revise (5 min)

Pas je ADR aan op basis van wat de AI vond. Voeg een "Risks identified" sectie toe.

**Deliverable:** Originele ADR + devil's advocate output + herziene versie.`,
          contentI18n: {
            en: `# Lab — ADR Writing Practice

**Duration: 30 minutes**

Take a recent significant decision from your team (architecture, tool choice, process change).

## Step 1: Write the ADR (15 min)

\`\`\`markdown
# ADR-00X: [Title]

## Status: [Proposed / Accepted / Deprecated]
## Context: [What's the situation?]
## Decision: [What did we decide?]
## Consequences: [What are the consequences — positive and negative?]
## Trade-offs accepted: [What do we accept?]
\`\`\`

## Step 2: Let AI play devil's advocate (10 min)

Give Claude your ADR and ask:
> "Play devil's advocate. Why might this decision be wrong? Which scenarios make it problematic?"

Document the risks found.

## Step 3: Revise (5 min)

Adjust your ADR based on what the AI found. Add a "Risks identified" section.

**Deliverable:** Original ADR + devil's advocate output + revised version.`,
            nl: `# Lab — ADR Writing Practice

**Duur: 30 minuten**

Neem een recente significante beslissing uit je team (architectuur, tool-keuze, process-change).

## Stap 1: Schrijf de ADR (15 min)

\`\`\`markdown
# ADR-00X: [Titel]

## Status: [Proposed / Accepted / Deprecated]
## Context: [Wat is de situatie?]
## Decision: [Wat hebben we besloten?]
## Consequences: [Wat zijn de gevolgen — positief en negatief?]
## Trade-offs accepted: [Wat accepteren we?]
\`\`\`

## Stap 2: Laat AI devil's advocate spelen (10 min)

Geef Claude je ADR en vraag:
> "Speel devil's advocate. Waarom zou deze beslissing verkeerd kunnen zijn? Welke scenario's maken het problematisch?"

Documenteer de gevonden risico's.

## Stap 3: Revise (5 min)

Pas je ADR aan op basis van wat de AI vond. Voeg een "Risks identified" sectie toe.

**Deliverable:** Originele ADR + devil's advocate output + herziene versie.`,
            fr: `# Lab — Pratique d'écriture ADR

**Durée : 30 minutes**

Prenez une décision significative récente de votre équipe.

## Étape 1 : Écrire l'ADR (15 min)

\`\`\`markdown
# ADR-00X : [Titre]

## Status : [Proposed / Accepted / Deprecated]
## Context : [Quelle situation ?]
## Decision : [Qu'avez-vous décidé ?]
## Consequences : [Conséquences — positives et négatives ?]
## Trade-offs accepted : [Qu'acceptez-vous ?]
\`\`\`

## Étape 2 : IA comme devil's advocate (10 min)

Donnez à Claude votre ADR et demandez :
> « Joue devil's advocate. Pourquoi cette décision pourrait-elle être mauvaise ? Quels scénarios problématiques ? »

Documentez les risques trouvés.

## Étape 3 : Révisez (5 min)

Ajustez votre ADR. Ajoutez une section « Risks identified ».

**Livrable :** ADR original + sortie devil's advocate + version révisée.`,
          },
          exercises: [
            {
              id: 'w3d4-ex1',
              title: 'ADR + devil\'s advocate iteratie',
              titleI18n: {
                en: 'ADR + devil\'s advocate iteration',
                nl: 'ADR + devil\'s advocate iteratie',
                fr: 'ADR + itération devil\'s advocate',
              },
              instructions: 'Complete ADR voor team-beslissing. AI devil\'s advocate prompt + output. Herziene ADR met "Risks identified" sectie.',
              instructionsI18n: {
                en: 'Complete ADR for team decision. AI devil\'s advocate prompt + output. Revised ADR with "Risks identified" section.',
                nl: 'Complete ADR voor team-beslissing. AI devil\'s advocate prompt + output. Herziene ADR met "Risks identified" sectie.',
                fr: 'ADR complet pour décision équipe. Prompt IA devil\'s advocate + sortie. ADR révisé avec section « Risks identified ».',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 5: Les 4.5 + Lab Advanced Techniques ─────
    {
      day: 5,
      title: 'Les 4.5 — Advanced Prompt Techniques',
      titleI18n: {
        en: 'Lesson 4.5 — Advanced Prompt Techniques',
        nl: 'Les 4.5 — Advanced Prompt Techniques',
        fr: 'Leçon 4.5 — Advanced Prompt Techniques',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w3d5-theory',
          title: 'Les 4.5 — Advanced Prompt Techniques',
          titleI18n: {
            en: 'Lesson 4.5 — Advanced Prompt Techniques',
            nl: 'Les 4.5 — Advanced Prompt Techniques',
            fr: 'Leçon 4.5 — Advanced Prompt Techniques',
          },
          type: 'theory',
          duration: 15,
          description: 'Chain-of-Thought · Few-Shot · Iterative Refinement · Meta-Prompting',
          descriptionI18n: {
            en: 'Chain-of-Thought · Few-Shot · Iterative Refinement · Meta-Prompting',
            nl: 'Chain-of-Thought · Few-Shot · Iterative Refinement · Meta-Prompting',
            fr: 'Chain-of-Thought · Few-Shot · Iterative Refinement · Meta-Prompting',
          },
          content: LESSON_4_5_NL,
          contentI18n: { en: LESSON_4_5_EN, nl: LESSON_4_5_NL, fr: LESSON_4_5_FR },
        },
        {
          id: 'w3d5-lab',
          title: 'Lab — Advanced Techniques Practice',
          titleI18n: {
            en: 'Lab — Advanced Techniques Practice',
            nl: 'Lab — Advanced Techniques Practice',
            fr: 'Lab — Pratique Advanced Techniques',
          },
          type: 'lab',
          duration: 30,
          description: '4 technieken (CoT/Few-Shot/Iterative/Meta) toepassen op 4 echte taken',
          descriptionI18n: {
            en: '4 techniques (CoT/Few-Shot/Iterative/Meta) applied to 4 real tasks',
            nl: '4 technieken (CoT/Few-Shot/Iterative/Meta) toepassen op 4 echte taken',
            fr: '4 techniques appliquées à 4 tâches réelles',
          },
          content: `# Lab — Advanced Techniques Practice

**Duur: 30 minuten**

Kies 4 taken uit je werk. Pas elke techniek op één taak toe:

## Chain-of-Thought (7 min)
Taak: complexe refactoring of debug. Vraag AI om stap-voor-stap te denken. Documenteer het denkproces.

## Few-Shot (7 min)
Taak: code genereren in jullie team-stijl. Geef 2 voorbeelden. Evalueer of AI het patroon overneemt.

## Iterative Refinement (8 min)
Taak: feature bouwen. 3 rondes — v1 basis, v2 review, v3 optimize. Documenteer per ronde wat verbeterde.

## Meta-Prompting (8 min)
Taak: iets dat je elke maand doet (rapport, template). Laat AI 5 vragen stellen. Beantwoord. Bouw prompt.

**Deliverable:** 4 technieken × 4 taken + reflectie: welke techniek leverde het grootste kwaliteitsverschil?`,
          contentI18n: {
            en: `# Lab — Advanced Techniques Practice

**Duration: 30 minutes**

Pick 4 tasks from your work. Apply each technique to one task:

## Chain-of-Thought (7 min)
Task: complex refactoring or debug. Ask AI to think step-by-step. Document the thinking.

## Few-Shot (7 min)
Task: generate code in your team style. Give 2 examples. Evaluate if AI adopts the pattern.

## Iterative Refinement (8 min)
Task: build a feature. 3 rounds — v1 basic, v2 review, v3 optimise. Document per round what improved.

## Meta-Prompting (8 min)
Task: something you do monthly (report, template). Let AI ask 5 questions. Answer. Build prompt.

**Deliverable:** 4 techniques × 4 tasks + reflection: which technique delivered the biggest quality jump?`,
            nl: `# Lab — Advanced Techniques Practice

**Duur: 30 minuten**

Kies 4 taken uit je werk. Pas elke techniek op één taak toe:

## Chain-of-Thought (7 min)
Taak: complexe refactoring of debug. Vraag AI om stap-voor-stap te denken. Documenteer het denkproces.

## Few-Shot (7 min)
Taak: code genereren in jullie team-stijl. Geef 2 voorbeelden. Evalueer of AI het patroon overneemt.

## Iterative Refinement (8 min)
Taak: feature bouwen. 3 rondes — v1 basis, v2 review, v3 optimize. Documenteer per ronde wat verbeterde.

## Meta-Prompting (8 min)
Taak: iets dat je elke maand doet (rapport, template). Laat AI 5 vragen stellen. Beantwoord. Bouw prompt.

**Deliverable:** 4 technieken × 4 taken + reflectie: welke techniek leverde het grootste kwaliteitsverschil?`,
            fr: `# Lab — Pratique Advanced Techniques

**Durée : 30 minutes**

Choisissez 4 tâches. Appliquez chaque technique à une tâche :

## Chain-of-Thought (7 min)
Tâche : refactoring complexe ou debug. Demandez à l'IA de penser étape par étape. Documentez.

## Few-Shot (7 min)
Tâche : générer du code style équipe. Donnez 2 exemples. Évaluez.

## Iterative Refinement (8 min)
Tâche : construire une feature. 3 rondes — v1 base, v2 review, v3 optimise.

## Meta-Prompting (8 min)
Tâche : quelque chose mensuel. L'IA pose 5 questions. Répondez. Construisez le prompt.

**Livrable :** 4 techniques × 4 tâches + réflexion : quelle technique a livré le plus grand saut de qualité ?`,
          },
          exercises: [
            {
              id: 'w3d5-ex1',
              title: '4 technieken × 4 echte taken met reflectie',
              titleI18n: {
                en: '4 techniques × 4 real tasks with reflection',
                nl: '4 technieken × 4 echte taken met reflectie',
                fr: '4 techniques × 4 tâches réelles avec réflexion',
              },
              instructions: 'Pas CoT, Few-Shot, Iterative Refinement en Meta-Prompting elk op één echte taak toe. Documenteer output + reflectie op welke techniek het grootste verschil maakte.',
              instructionsI18n: {
                en: 'Apply CoT, Few-Shot, Iterative Refinement and Meta-Prompting each to one real task. Document output + reflect on which technique made the biggest difference.',
                nl: 'Pas CoT, Few-Shot, Iterative Refinement en Meta-Prompting elk op één echte taak toe. Documenteer output + reflectie op welke techniek het grootste verschil maakte.',
                fr: 'Appliquez CoT, Few-Shot, Iterative Refinement et Meta-Prompting chacun à une tâche réelle. Documentez sortie + réflexion technique impact max.',
              },
              type: 'prompt-craft',
              difficulty: 3,
              points: 20,
            },
          ],
        },
      ],
    },
  ],
};
