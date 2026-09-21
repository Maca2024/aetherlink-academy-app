// ─────────────────────────────────────────────────────────────────────────────
// WEEK 1 / LEVEL 2 — The Pentagon Model (Cons & Nina v1.1)
// Source: docs/levels/level-2/source.md (Cons & Nina v1.1, 20 apr 2026)
//
// Atoms v1.1: ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS
// (was v0.1 DRAFT: ROLE · CONTEXT · GOAL · PROCESS · FORMAT)
//
// Structure:
//   Dag 1: Les 2.1 Pentagon Model: De 5 Atomen       + Lab — Pentagon-Scan 3 prompts
//   Dag 2: Les 2.2 Elke Atoom in Detail              + Lab — Atom Annotation
//   Dag 3: Les 2.3 Before vs After                   + Lab — 6 Role Tracks (Pentagon Challenge)
//   Dag 4: Les 2.4 Anti-Patterns                     + Lab 2A Before/After Challenge
//   Dag 5: Les 2.5 Instant Fix Toolkit               + Lab 2B Template Builder
// ─────────────────────────────────────────────────────────────────────────────

import type { CurriculumWeek } from './curriculum';
import { dailySchedule } from './curriculum-schedule';

// ─── LES 2.1 — Het Pentagon Model: De 5 Atomen ───────────────────────────────

const LESSON_2_1_NL = `# Les 2.1 — Het Pentagon Model: De 5 Atomen

## Waarom Je Prompts Niet Werken

In Level 1 heb je je eerste AI-gesprek gevoerd. Misschien was het resultaat goed. Waarschijnlijk was het oké. Grote kans dat je dacht: "Ja, handig, maar niet geweldig."

Dat is niet de schuld van het model. Dat is de schuld van de prompt.

De meeste mensen praten tegen AI alsof ze een collega aanspreken in de gang: vaag, onvolledig, en met de verwachting dat de ander het wel begrijpt. Maar AI heeft geen gang-context. Het heeft geen geheugen van vorige gesprekken. Het weet niet in welk team je zit, aan welk project je werkt, of wat "goed" betekent in jouw wereld.

**Alles wat het model niet weet, moet je het vertellen.** Dat is waar het Pentagon Model voor is.

## Het Pentagon Model

Elke geweldige prompt bevat vijf elementen. Wij noemen ze de 5 atomen:

- **ROL** — Wie is de AI?
- **CONTEXT** — Wat moet de AI weten?
- **TAAK** — Wat moet de AI doen?
- **FORMAT** — Hoe moet de output eruitzien?
- **CONSTRAINTS** — Wat mag NIET?

Geen van deze atomen is optioneel. Laat er eentje weg, en de kwaliteit daalt. Voeg ze allemaal toe, en het verschil is dramatisch.

Het Pentagon is geen checklist — het is een denkmodel. Je hoeft niet altijd alle vijf letterlijk uit te schrijven. Maar je moet er altijd over nagedacht hebben. De beste prompts voelen moeiteloos, maar bevatten alle vijf — soms expliciet, soms impliciet.`;

const LESSON_2_1_EN = `# Lesson 2.1 — The Pentagon Model: The 5 Atoms

## Why Your Prompts Aren't Working

In Level 1 you had your first AI conversation. Maybe the result was good. Probably it was okay. Chances are you thought: "Yeah, handy, but not amazing."

That's not the model's fault. That's the prompt's fault.

Most people talk to AI the way they chat with a colleague in the hallway: vague, incomplete, expecting the other to fill in the gaps. But AI has no hallway context. It has no memory of previous conversations. It doesn't know which team you're in, which project you're working on, or what "good" means in your world.

**Anything the model doesn't know, you have to tell it.** That's what the Pentagon Model is for.

## The Pentagon Model

Every great prompt contains five elements. We call them the 5 atoms:

- **ROLE** — Who is the AI?
- **CONTEXT** — What should the AI know?
- **TASK** — What should the AI do?
- **FORMAT** — How should the output look?
- **CONSTRAINTS** — What is NOT allowed?

None of these atoms is optional. Leave one out and quality drops. Add them all and the difference is dramatic.

The Pentagon is not a checklist — it's a thinking model. You don't always need to write all five out literally. But you must always have thought about them. The best prompts feel effortless but contain all five — sometimes explicit, sometimes implicit.`;

const LESSON_2_1_FR = `# Leçon 2.1 — Le Pentagon Model : les 5 atomes

## Pourquoi vos prompts ne marchent pas

Au Level 1 vous avez eu votre première conversation avec l'IA. Peut-être le résultat était bon. Probablement correct. Vous avez probablement pensé : « Oui, pratique, mais pas génial. »

Ce n'est pas la faute du modèle. C'est la faute du prompt.

La plupart des gens parlent à l'IA comme ils parlent à un collègue dans le couloir : vague, incomplet, en attendant que l'autre remplisse les blancs. Mais l'IA n'a pas de contexte de couloir. Elle n'a pas de mémoire des conversations précédentes. Elle ne sait pas dans quelle équipe vous êtes, sur quel projet vous travaillez, ou ce que « bon » veut dire dans votre monde.

**Tout ce que le modèle ne sait pas, vous devez le lui dire.** C'est à ça que sert le Pentagon Model.

## Le Pentagon Model

Chaque excellent prompt contient cinq éléments. Nous les appelons les 5 atomes :

- **RÔLE** — Qui est l'IA ?
- **CONTEXT** — Que doit savoir l'IA ?
- **TÂCHE** — Que doit faire l'IA ?
- **FORMAT** — À quoi doit ressembler la sortie ?
- **CONSTRAINTS** — Qu'est-ce qui est INTERDIT ?

Aucun de ces atomes n'est optionnel. Oubliez-en un et la qualité chute. Ajoutez-les tous et la différence est dramatique.

Le Pentagon n'est pas une checklist — c'est un modèle de réflexion. Pas besoin de toujours écrire les cinq littéralement. Mais il faut toujours y avoir réfléchi. Les meilleurs prompts semblent sans effort mais contiennent les cinq — parfois explicites, parfois implicites.`;

// ─── LES 2.2 — Elke Atoom in Detail ──────────────────────────────────────────

const LESSON_2_2_NL = `# Les 2.2 — Elke Atoom in Detail

Nu gaan we elk atoom uitdiepen. Per atoom: wat is het, waarom maakt het verschil, en hoe ziet het eruit in de praktijk.

## Atoom 1: ROL — "Wie ben jij?"

De ROL vertelt het model vanuit welk perspectief het moet denken en antwoorden. Dit verandert alles: de diepte, de focus, het vocabulaire, de aannames.

Dezelfde vraag, andere ROL, totaal ander antwoord:
- "Senior Golang developer" → technisch, code-first, performance-bewust
- "QA engineer" → edge cases, faalscenario's, testbaarheid
- "Product manager" → user impact, business value, prioritering
- "Security auditor" → kwetsbaarheden, compliance, risico's

**Zonder ROL:** "Schrijf documentatie voor deze API." → Generiek, oppervlakkig, niet gericht op een publiek.

**Met ROL:** "Je bent een senior technical writer bij een fintech bedrijf. Schrijf documentatie voor deze API die door junior developers gelezen wordt. Focus op voorbeelden boven theorie." → Specifiek, gericht, met het juiste abstractieniveau.

Maak de ROL concreet. "Expert" is vaag. "Senior Golang developer met 10 jaar ervaring in microservices voor payment processing" is een ROL waar het model iets mee kan.

## Atoom 2: CONTEXT — "Wat moet je weten?"

CONTEXT is alles wat het model moet weten om een goed antwoord te geven. Onthoud uit Level 1: het model heeft geen geheugen. Elke keer begin je op nul. Alles wat je niet vertelt, weet het niet.

Context is de meest onderschatte atoom. De meeste slechte prompts falen niet door een slechte taak, maar door ontbrekende context.

Soorten context:
- **Technisch**: "Onze stack is Golang, PostgreSQL, Kubernetes"
- **Domein**: "We verwerken cross-border payments voor e-commerce"
- **Team**: "Ons team volgt clean architecture en de Uber Go Style Guide"
- **Situatie**: "Dit is een legacy service die we migreren naar microservices"

**Zonder CONTEXT:** "Review deze functie." → Model weet niet: welke taal, welk framework, welke standaarden.

**Met CONTEXT:** "Review deze Golang functie. Context: dit is onderdeel van onze settlement engine die dagelijks €2M verwerkt. We draaien op Kubernetes. Ons team volgt de Uber Go Style Guide. De functie moet thread-safe zijn." → Model reviewt op performance, reliability, error handling — precies wat je nodig hebt.

Let op: te veel context is ook een probleem. Plak niet je hele codebase. Geef het model wat het NODIG heeft, niet alles wat je HEBT. Herinner je context pollution uit Level 1.

## Atoom 3: TAAK — "Wat moet je doen?"

De TAAK is wat je wilt dat het model doet. Dit klinkt simpel, maar de meeste mensen zijn hier te vaag. "Help me" is geen taak. "Refactor deze functie" is beter. "Refactor deze functie zodat error handling consistent is met ons team-patroon" is goed.

Een goede taak is:
- **Specifiek** — niet "verbeter dit" maar "refactor naar clean architecture met dependency injection"
- **Meetbaar** — niet "maak het beter" maar "verminder de cyclomatic complexity naar <10"
- **Afgebakend** — niet "schrijf documentatie" maar "schrijf een README met: installatie, configuratie, 3 voorbeelden"

**Vaag:** "Help me met deze code." → Model weet niet: reviewen? Refactoren? Uitleggen? Testen?

**Specifiek:** "Refactor deze functie zodat: (1) error handling consistent is met ons team-patroon (errors.Wrap), (2) de functie maximaal 30 regels is, (3) er unit tests bij komen met minimaal 80% coverage." → Model weet precies wat je verwacht.

## Atoom 4: FORMAT — "Hoe moet het eruitzien?"

FORMAT vertelt het model HOE de output moet worden gepresenteerd. Zonder format-instructie kiest het model zelf — en je krijgt een essay wanneer je een tabel nodig hebt.

Format-opties:
- Markdown met headers en bullet points
- JSON met een specifiek schema
- Tabel met kolommen die je definieert
- Code met comments en type annotations
- Stap-voor-stap genummerde lijst
- Executive summary (max 3 zinnen)

**Zonder FORMAT:** "Vergelijk Golang en Java voor microservices." → Je krijgt een essay van 800 woorden. Niet wat je nodig hebt in een meeting.

**Met FORMAT:** "Vergelijk Golang en Java voor microservices. Format: tabel met kolommen: Criterium | Golang | Java | Winnaar. Criteria: performance, concurrency, learning curve, ecosystem, deployment size. Onder de tabel: 3-zin conclusie met aanbeveling." → Direct bruikbaar.

Geef een voorbeeld van de gewenste output. "Geef output in dit format: [voorbeeld]" werkt beter dan tien regels uitleg.

## Atoom 5: CONSTRAINTS — "Wat mag NIET?"

CONSTRAINTS zijn de grenzen. Wat het model NIET mag doen. Zonder constraints krijg je output die technisch correct kan zijn maar praktisch onhaalbaar.

Soorten constraints:
- **Veiligheid**: "Geen PCI data, geen credentials, geen PII"
- **Technisch**: "Alleen standaard library, geen externe dependencies"
- **Stijl**: "Maximaal 50 regels code per functie"
- **Scope**: "Alleen de settlement module, raak de andere services niet aan"
- **Taal**: "Alleen Golang, geen Python suggesties"
- **Output**: "Maximaal 1 A4, geen inleiding nodig"

**Zonder CONSTRAINTS:** "Schrijf een monitoring dashboard." → Model gebruikt React, D3, een GraphQL API, 4 externe libraries, en 2000 regels code. Niet wat je squad deze sprint kan leveren.

**Met CONSTRAINTS:** "Schrijf een monitoring dashboard. Constraints: alleen React + onze bestaande design tokens. Geen nieuwe dependencies. Max 200 regels code. Moet in 1 component passen. Data uit onze bestaande REST API." → Haalbaar, passend bij je team, deze sprint deliverable.

## Worldline-specifieke constraints

Bij Worldline zijn sommige constraints ALTIJD van toepassing:
- Nooit PAN, CVV, of volledige kaartnummers in prompts
- Nooit credentials of API keys
- Geen PII van klanten
- Alle AI-output door menselijke review voor productie
- Alleen goedgekeurde tools (LibreChat, Copilot, Claude Code)

Deze constraints zijn niet optioneel. Ze gelden voor ELKE prompt die je schrijft bij Worldline.`;

const LESSON_2_2_EN = `# Lesson 2.2 — Each Atom in Detail

Now we dig into each atom. Per atom: what it is, why it makes a difference, what it looks like in practice.

## Atom 1: ROLE — "Who are you?"

ROLE tells the model which perspective to think and answer from. This changes everything: depth, focus, vocabulary, assumptions.

Same question, different ROLE, totally different answer:
- "Senior Golang developer" → technical, code-first, performance-aware
- "QA engineer" → edge cases, failure scenarios, testability
- "Product manager" → user impact, business value, prioritisation
- "Security auditor" → vulnerabilities, compliance, risks

**Without ROLE:** "Write documentation for this API." → Generic, shallow, no target audience.

**With ROLE:** "You are a senior technical writer at a fintech. Write documentation for this API read by junior developers. Focus on examples over theory." → Specific, targeted, right abstraction level.

Make the ROLE concrete. "Expert" is vague. "Senior Golang developer with 10 years in microservices for payment processing" is a ROLE the model can work with.

## Atom 2: CONTEXT — "What do you need to know?"

CONTEXT is everything the model needs to know to give a good answer. Remember from Level 1: the model has no memory. Every time starts at zero. Anything you don't tell it, it doesn't know.

Context is the most underestimated atom. Most bad prompts fail not from a bad task, but from missing context.

Kinds of context:
- **Technical**: "Our stack is Golang, PostgreSQL, Kubernetes"
- **Domain**: "We process cross-border payments for e-commerce"
- **Team**: "Our team follows clean architecture and the Uber Go Style Guide"
- **Situational**: "This is a legacy service we're migrating to microservices"

**Without CONTEXT:** "Review this function." → Model doesn't know: language, framework, standards, audience.

**With CONTEXT:** "Review this Golang function. Context: part of our settlement engine that processes €2M daily. Runs on Kubernetes. Our team follows the Uber Go Style Guide. The function must be thread-safe." → Model reviews for performance, reliability, error handling.

Beware: too much context is also a problem. Don't paste your whole codebase. Give the model what it NEEDS, not everything you HAVE. Remember context pollution from Level 1.

## Atom 3: TASK — "What should you do?"

TASK is what you want the model to do. Sounds simple, but most people are too vague here. "Help me" is not a task. "Refactor this function" is better. "Refactor this function so error handling is consistent with our team pattern" is good.

A good task is:
- **Specific** — not "improve this" but "refactor to clean architecture with dependency injection"
- **Measurable** — not "make it better" but "reduce cyclomatic complexity to <10"
- **Scoped** — not "write documentation" but "write a README with: install, config, 3 examples"

**Vague:** "Help me with this code." → Model doesn't know: review? Refactor? Explain? Test?

**Specific:** "Refactor this function so: (1) error handling is consistent with our team pattern (errors.Wrap), (2) function max 30 lines, (3) unit tests with at least 80% coverage." → Model knows exactly what you expect.

## Atom 4: FORMAT — "How should it look?"

FORMAT tells the model HOW output should be presented. Without format instruction the model picks — and you get an essay when you need a table.

Format options:
- Markdown with headers and bullets
- JSON with a specific schema
- Table with columns you define
- Code with comments and type annotations
- Step-by-step numbered list
- Executive summary (max 3 sentences)

**Without FORMAT:** "Compare Golang and Java for microservices." → You get an 800-word essay. Not what you need in a meeting.

**With FORMAT:** "Compare Golang and Java for microservices. Format: table with columns: Criterion | Golang | Java | Winner. Criteria: performance, concurrency, learning curve, ecosystem, deployment size. Below the table: 3-sentence conclusion with recommendation." → Directly usable.

Give an example of the desired output. "Give output in this format: [example]" beats ten lines of description.

## Atom 5: CONSTRAINTS — "What is NOT allowed?"

CONSTRAINTS are the boundaries. What the model must NOT do. Without constraints you get output that may be technically correct but practically unusable.

Kinds of constraints:
- **Safety**: "No PCI data, no credentials, no PII"
- **Technical**: "Standard library only, no external dependencies"
- **Style**: "Max 50 lines per function"
- **Scope**: "Only the settlement module, don't touch other services"
- **Language**: "Golang only, no Python suggestions"
- **Output**: "Max 1 A4, no introduction"

**Without CONSTRAINTS:** "Write a monitoring dashboard." → Model uses React, D3, a GraphQL API, 4 external libraries, 2000 lines of code. Not what your squad can deliver this sprint.

**With CONSTRAINTS:** "Write a monitoring dashboard. Constraints: React + our existing design tokens only. No new dependencies. Max 200 lines. Must fit in one component. Data from our existing REST API." → Feasible, fits your team, sprint deliverable.

## Worldline-specific constraints

At Worldline, some constraints ALWAYS apply:
- Never PAN, CVV, or full card numbers in prompts
- Never credentials or API keys
- No customer PII
- All AI output through human review before production
- Approved tools only (LibreChat, Copilot, Claude Code)

These constraints are not optional. They apply to EVERY prompt you write at Worldline.`;

const LESSON_2_2_FR = `# Leçon 2.2 — Chaque atome en détail

On approfondit maintenant chaque atome. Par atome : ce que c'est, pourquoi ça compte, à quoi ça ressemble en pratique.

## Atome 1: RÔLE — « Qui es-tu ? »

Le RÔLE dit au modèle depuis quelle perspective penser et répondre. Ça change tout : la profondeur, le focus, le vocabulaire, les hypothèses.

Même question, RÔLE différent, réponse totalement différente :
- « Senior Golang developer » → technique, code-first, performance-conscient
- « QA engineer » → edge cases, scénarios d'échec, testabilité
- « Product manager » → impact utilisateur, valeur métier, priorisation
- « Security auditor » → vulnérabilités, conformité, risques

**Sans RÔLE :** « Écris la doc de cette API. » → Générique, superficiel, pas de public cible.

**Avec RÔLE :** « Tu es un senior technical writer dans une fintech. Écris la doc de cette API lue par des devs juniors. Focus exemples plutôt que théorie. » → Spécifique, ciblé, bon niveau d'abstraction.

Rendez le RÔLE concret. « Expert » est vague. « Senior Golang developer avec 10 ans en microservices pour paiements » est un RÔLE exploitable.

## Atome 2: CONTEXT — « Que dois-tu savoir ? »

Le CONTEXT est tout ce que le modèle doit savoir pour bien répondre. Rappel Level 1 : le modèle n'a pas de mémoire. Chaque fois on repart de zéro. Tout ce que vous ne dites pas, il ne sait pas.

Le CONTEXT est l'atome le plus sous-estimé. La plupart des mauvais prompts échouent non pas sur la tâche mais sur le contexte manquant.

Types de contexte :
- **Technique** : « Notre stack est Golang, PostgreSQL, Kubernetes »
- **Domaine** : « On traite des paiements cross-border pour l'e-commerce »
- **Équipe** : « Notre équipe suit clean architecture et le Uber Go Style Guide »
- **Situation** : « C'est un service legacy qu'on migre en microservices »

**Sans CONTEXT :** « Revois cette fonction. » → Le modèle ne sait pas : langage, framework, standards, public.

**Avec CONTEXT :** « Revois cette fonction Golang. Context : partie de notre settlement engine qui traite 2 M€ par jour. Tourne sur Kubernetes. Équipe suit Uber Go Style Guide. La fonction doit être thread-safe. » → Le modèle revoit perf, fiabilité, error handling.

Attention : trop de contexte est aussi un problème. Ne collez pas toute la codebase. Donnez ce dont le modèle a BESOIN, pas tout ce que vous AVEZ. Rappel context pollution du Level 1.

## Atome 3: TÂCHE — « Que dois-tu faire ? »

La TÂCHE est ce que vous voulez que le modèle fasse. Ça semble simple, mais la plupart sont trop vagues. « Aide-moi » n'est pas une tâche. « Refactore cette fonction » est mieux. « Refactore cette fonction pour que l'error handling soit cohérent avec notre pattern équipe » est bon.

Une bonne tâche est :
- **Spécifique** — pas « améliore ça » mais « refactore vers clean architecture avec dependency injection »
- **Mesurable** — pas « rends meilleur » mais « réduis la complexité cyclomatique à <10 »
- **Bornée** — pas « écris la doc » mais « écris un README avec : install, config, 3 exemples »

**Vague :** « Aide-moi avec ce code. » → Le modèle ne sait pas : revue ? Refactor ? Expliquer ? Tester ?

**Spécifique :** « Refactore cette fonction pour que : (1) error handling cohérent avec pattern équipe (errors.Wrap), (2) fonction max 30 lignes, (3) unit tests avec au moins 80% coverage. » → Le modèle sait exactement ce qui est attendu.

## Atome 4: FORMAT — « À quoi ça doit ressembler ? »

FORMAT dit au modèle COMMENT présenter la sortie. Sans instruction, le modèle choisit — et vous recevez un essai alors qu'il faut un tableau.

Options de format :
- Markdown avec headers et bullets
- JSON avec schéma précis
- Tableau avec colonnes définies
- Code avec commentaires et annotations types
- Liste numérotée étape par étape
- Résumé exécutif (max 3 phrases)

**Sans FORMAT :** « Compare Golang et Java pour microservices. » → Essai de 800 mots. Pas ce qu'il faut en réunion.

**Avec FORMAT :** « Compare Golang et Java pour microservices. Format : tableau avec colonnes : Critère | Golang | Java | Gagnant. Critères : performance, concurrence, courbe d'apprentissage, écosystème, taille déploiement. Sous le tableau : conclusion 3 phrases avec recommandation. » → Directement utilisable.

Donnez un exemple de la sortie souhaitée. « Sortie dans ce format : [exemple] » bat dix lignes de description.

## Atome 5: CONSTRAINTS — « Qu'est-ce qui est INTERDIT ? »

Les CONSTRAINTS sont les limites. Ce que le modèle NE doit PAS faire. Sans contraintes vous obtenez une sortie peut-être techniquement correcte mais pratiquement infaisable.

Types de contraintes :
- **Sécurité** : « Pas de données PCI, pas de credentials, pas de PII »
- **Technique** : « Seulement la stdlib, pas de dépendances externes »
- **Style** : « Max 50 lignes par fonction »
- **Portée** : « Seulement le module settlement, ne touche pas aux autres services »
- **Langage** : « Golang uniquement, pas de Python »
- **Sortie** : « Max 1 A4, pas d'introduction »

**Sans CONSTRAINTS :** « Écris un dashboard de monitoring. » → Le modèle utilise React, D3, une API GraphQL, 4 libs externes, 2000 lignes. Pas livrable ce sprint.

**Avec CONSTRAINTS :** « Écris un dashboard de monitoring. Contraintes : seulement React + nos design tokens. Pas de nouvelles dépendances. Max 200 lignes. Un seul composant. Données depuis notre REST API existante. » → Réaliste, adapté à l'équipe, livrable ce sprint.

## Contraintes spécifiques Worldline

Chez Worldline, certaines contraintes s'appliquent TOUJOURS :
- Jamais PAN, CVV, ou numéros de carte complets dans les prompts
- Jamais de credentials ou clés API
- Pas de PII client
- Toute sortie IA passe par revue humaine avant production
- Outils approuvés uniquement (LibreChat, Copilot, Claude Code)

Ces contraintes ne sont pas optionnelles. Elles s'appliquent à CHAQUE prompt que vous écrivez chez Worldline.`;

// ─── LES 2.3 — Before vs After ───────────────────────────────────────────────

const LESSON_2_3_NL = `# Les 2.3 — Before vs After: Het Verschil Zien

Dit is het aha-moment. Dezelfde opdracht. Zonder Pentagon vs met Pentagon. Kijk naar het verschil.

## Case 1: Code Review

**ZONDER PENTAGON:**

> "Review deze code."

Output: Generieke feedback. "Je zou error handling kunnen toevoegen." "Overweeg meer comments." Niet bruikbaar. Geen prioriteit. Geen concrete fixes.

**MET PENTAGON:**

> **ROL:** Senior Golang developer met 10 jaar microservices ervaring bij een payment processor.
>
> **CONTEXT:** Dit is de \`handlePayment\` functie in onze settlement service. Verwerkt dagelijks €2M. Draait op Kubernetes met 3 replicas. We volgen de Uber Go Style Guide.
>
> **TAAK:** Review deze functie op: (1) security vulnerabilities, (2) error handling completeness, (3) performance bottlenecks, (4) testbaarheid.
>
> **FORMAT:** Per categorie: bevinding + ernst (P1/P2/P3) + concrete fix als code snippet.
>
> **CONSTRAINTS:** Focus alleen op deze functie, niet op de caller. Geen refactoring-suggesties tenzij P1 security issue.

Output: 4 categorieën, concrete bevindingen met severity, copy-paste fixes. Direct bruikbaar in je PR review.

## Case 2: User Story Schrijven

**ZONDER PENTAGON:**

> "Schrijf een user story voor een zoekfunctie."

Output: "Als gebruiker wil ik kunnen zoeken zodat ik dingen kan vinden." Nutteloos.

**MET PENTAGON:**

> **ROL:** Senior product manager bij een e-commerce payment platform.
>
> **CONTEXT:** Onze merchants (Booking.com, Steam) willen transacties zoeken in hun dashboard. Huidige zoekfunctie filtert alleen op datum. Merchants verwerken 10K+ transacties per dag.
>
> **TAAK:** Schrijf een user story met acceptance criteria voor een real-time zoekfunctie op transacties.
>
> **FORMAT:** Als [persona] wil ik [actie] zodat [waarde]. Acceptance criteria als checklist. Inclusief edge cases.
>
> **CONSTRAINTS:** Zoek op: merchant ID, bedrag, status, datum. Max response time 2 seconden. Geen PAN/CVV in zoekresultaten.

Output: Complete user story, bruikbare acceptance criteria, edge cases die je team niet had bedacht.

## De patronen die je opvallen

- **Zonder Pentagon** = generiek · oppervlakkig · niet bruikbaar
- **Met Pentagon** = specifiek · concreet · direct deploy-baar

Het verschil is 60 seconden extra typen. De uitkomst verschilt factor 10.`;

const LESSON_2_3_EN = `# Lesson 2.3 — Before vs After: See the Difference

This is the aha moment. Same task. Without Pentagon vs with Pentagon. Look at the difference.

## Case 1: Code Review

**WITHOUT PENTAGON:**

> "Review this code."

Output: Generic feedback. "You could add error handling." "Consider more comments." Not usable. No priority. No concrete fixes.

**WITH PENTAGON:**

> **ROLE:** Senior Golang developer with 10 years of microservices experience at a payment processor.
>
> **CONTEXT:** This is the \`handlePayment\` function in our settlement service. Processes €2M daily. Runs on Kubernetes with 3 replicas. We follow the Uber Go Style Guide.
>
> **TASK:** Review this function for: (1) security vulnerabilities, (2) error handling completeness, (3) performance bottlenecks, (4) testability.
>
> **FORMAT:** Per category: finding + severity (P1/P2/P3) + concrete fix as a code snippet.
>
> **CONSTRAINTS:** Focus only on this function, not the caller. No refactoring suggestions unless P1 security issue.

Output: 4 categories, concrete findings with severity, copy-paste fixes. Directly usable in your PR review.

## Case 2: Writing a User Story

**WITHOUT PENTAGON:**

> "Write a user story for a search feature."

Output: "As a user I want to search so I can find things." Useless.

**WITH PENTAGON:**

> **ROLE:** Senior product manager at an e-commerce payment platform.
>
> **CONTEXT:** Our merchants (Booking.com, Steam) want to search transactions in their dashboard. Current search only filters by date. Merchants process 10K+ transactions per day.
>
> **TASK:** Write a user story with acceptance criteria for a real-time transaction search.
>
> **FORMAT:** As [persona] I want [action] so that [value]. Acceptance criteria as a checklist. Including edge cases.
>
> **CONSTRAINTS:** Search by: merchant ID, amount, status, date. Max response time 2 seconds. No PAN/CVV in search results.

Output: Complete user story, usable acceptance criteria, edge cases your team hadn't thought of.

## The patterns you'll notice

- **Without Pentagon** = generic · shallow · not usable
- **With Pentagon** = specific · concrete · deploy-ready

The difference is 60 seconds of extra typing. The outcome differs 10x.`;

const LESSON_2_3_FR = `# Leçon 2.3 — Before vs After : voir la différence

C'est le moment aha. Même tâche. Sans Pentagon vs avec Pentagon. Regardez la différence.

## Cas 1 : Code Review

**SANS PENTAGON :**

> « Revois ce code. »

Sortie : Feedback générique. « Tu pourrais ajouter de l'error handling. » « Plus de commentaires ? » Pas utilisable. Pas de priorité. Pas de fix concret.

**AVEC PENTAGON :**

> **RÔLE :** Senior Golang developer avec 10 ans d'expérience microservices chez un payment processor.
>
> **CONTEXT :** C'est la fonction \`handlePayment\` dans notre settlement service. Traite 2 M€/jour. Tourne sur Kubernetes avec 3 replicas. On suit le Uber Go Style Guide.
>
> **TÂCHE :** Revois cette fonction pour : (1) vulnérabilités sécurité, (2) completeness de l'error handling, (3) goulets de performance, (4) testabilité.
>
> **FORMAT :** Par catégorie : trouvaille + sévérité (P1/P2/P3) + fix concret en code snippet.
>
> **CONSTRAINTS :** Focus uniquement sur cette fonction, pas le caller. Pas de suggestions de refactoring sauf P1 sécurité.

Sortie : 4 catégories, trouvailles concrètes avec sévérité, fixes copy-paste. Directement utilisable en revue de PR.

## Cas 2 : Écrire une User Story

**SANS PENTAGON :**

> « Écris une user story pour une fonction de recherche. »

Sortie : « En tant qu'utilisateur je veux chercher pour trouver des choses. » Inutile.

**AVEC PENTAGON :**

> **RÔLE :** Senior product manager sur une plateforme de paiement e-commerce.
>
> **CONTEXT :** Nos marchands (Booking.com, Steam) veulent chercher des transactions dans leur dashboard. La recherche actuelle filtre seulement par date. Les marchands traitent 10K+ transactions par jour.
>
> **TÂCHE :** Écris une user story avec acceptance criteria pour une recherche temps réel sur transactions.
>
> **FORMAT :** En tant que [persona] je veux [action] pour [valeur]. Acceptance criteria en checklist. Incluant les edge cases.
>
> **CONSTRAINTS :** Recherche par : merchant ID, montant, statut, date. Temps de réponse max 2 secondes. Pas de PAN/CVV dans les résultats.

Sortie : User story complète, acceptance criteria utilisables, edge cases non anticipés par l'équipe.

## Les patterns à remarquer

- **Sans Pentagon** = générique · superficiel · pas utilisable
- **Avec Pentagon** = spécifique · concret · prêt à déployer

La différence fait 60 secondes de frappe en plus. Le résultat diffère d'un facteur 10.`;

// ─── LES 2.4 — Anti-Patterns ─────────────────────────────────────────────────

const LESSON_2_4_NL = `# Les 2.4 — Anti-Patterns: Wat Gaat Er Mis

Nu je weet hoe een goede prompt eruitziet, moet je ook herkennen wanneer het FOUT gaat. Dit zijn de anti-patterns die we het vaakst zien. Herken ze in je eigen prompts — en fix ze.

## Anti-Pattern 1: De Blob Prompt

Alles in één lange zin zonder structuur.

> "Kun je deze code reviewen en ook even kijken of de tests kloppen en misschien ook documentatie schrijven en oh ja, kun je ook een refactoring-voorstel doen?"

**Waarom het faalt:** het model weet niet wat prioriteit heeft. Output is oppervlakkig op alles, diep op niets.

**Fix:** Splits in aparte taken. Eén prompt per doel.

## Anti-Pattern 2: De Rolloze Prompt

Geen ROL meegegeven. Het model antwoordt als "generic helpful assistant".

> "Schrijf een API endpoint."

**Waarom het faalt:** een backend developer, een frontend developer, en een security engineer schrijven elk een compleet ander endpoint. Zonder ROL kiest het model de meest generieke versie.

**Fix:** Begin altijd met ROL. Wie moet dit antwoord geven?

## Anti-Pattern 3: De Context Dump

Te veel context. De hele codebase geplakt. 10.000 regels die het model moet verwerken.

**Waarom het faalt:** context pollution. Het model raakt de draad kwijt. De relevante informatie verdrinkt in de ruis.

**Fix:** Geef alleen wat het model NODIG heeft. Niet alles wat je HEBT.

## Anti-Pattern 4: De Wensdenker

> "Maak het perfect." "Schrijf de beste code." "Optimaliseer alles."

**Waarom het faalt:** "perfect" en "beste" zijn niet meetbaar. Het model weet niet wat JIJ onder "perfect" verstaat.

**Fix:** Wees specifiek. "Optimaliseer voor latency onder 100ms" of "Schrijf code die 95% test coverage haalt."`;

const LESSON_2_4_EN = `# Lesson 2.4 — Anti-Patterns: What Goes Wrong

Now that you know what a good prompt looks like, you must also recognise when it GOES WRONG. These are the anti-patterns we see most often. Spot them in your own prompts — and fix them.

## Anti-Pattern 1: The Blob Prompt

Everything in one long sentence without structure.

> "Can you review this code and also check if the tests are right and maybe write some documentation and oh, could you also suggest a refactor?"

**Why it fails:** the model doesn't know what is priority. Output is shallow on everything, deep on nothing.

**Fix:** Split into separate tasks. One prompt per goal.

## Anti-Pattern 2: The Role-less Prompt

No ROLE given. The model answers as "generic helpful assistant".

> "Write an API endpoint."

**Why it fails:** a backend developer, a frontend developer, and a security engineer each write a completely different endpoint. Without ROLE the model picks the most generic version.

**Fix:** Always start with ROLE. Who should answer this?

## Anti-Pattern 3: The Context Dump

Too much context. Whole codebase pasted. 10,000 lines the model must process.

**Why it fails:** context pollution. The model loses the thread. Relevant information drowns in the noise.

**Fix:** Give only what the model NEEDS. Not everything you HAVE.

## Anti-Pattern 4: The Wishful Thinker

> "Make it perfect." "Write the best code." "Optimise everything."

**Why it fails:** "perfect" and "best" are not measurable. The model doesn't know what YOU mean by "perfect".

**Fix:** Be specific. "Optimise for latency under 100ms" or "Write code that hits 95% test coverage."`;

const LESSON_2_4_FR = `# Leçon 2.4 — Anti-patterns : ce qui va de travers

Maintenant que vous savez à quoi ressemble un bon prompt, il faut aussi reconnaître quand ça TOURNE MAL. Voici les anti-patterns qu'on voit le plus souvent. Repérez-les dans vos propres prompts — et corrigez-les.

## Anti-Pattern 1 : Le Blob Prompt

Tout en une longue phrase sans structure.

> « Tu peux revoir ce code et vérifier aussi que les tests collent et peut-être écrire la doc et oh, tu pourrais proposer un refactor ? »

**Pourquoi ça échoue :** le modèle ne sait pas quelle est la priorité. Sortie superficielle partout, profonde nulle part.

**Fix :** Séparez en tâches distinctes. Un prompt par objectif.

## Anti-Pattern 2 : Le Prompt Sans Rôle

Pas de RÔLE donné. Le modèle répond en « assistant générique ».

> « Écris un endpoint API. »

**Pourquoi ça échoue :** un backend dev, un frontend dev, et un security engineer écrivent chacun un endpoint totalement différent. Sans RÔLE, le modèle choisit la version la plus générique.

**Fix :** Commencez toujours par le RÔLE. Qui doit répondre ?

## Anti-Pattern 3 : Le Context Dump

Trop de contexte. Toute la codebase collée. 10 000 lignes que le modèle doit traiter.

**Pourquoi ça échoue :** context pollution. Le modèle perd le fil. L'info pertinente se noie dans le bruit.

**Fix :** Ne donnez que ce dont le modèle a BESOIN. Pas tout ce que vous AVEZ.

## Anti-Pattern 4 : Le Penseur de Souhaits

> « Rends-le parfait. » « Écris le meilleur code. » « Optimise tout. »

**Pourquoi ça échoue :** « parfait » et « meilleur » ne sont pas mesurables. Le modèle ne sait pas ce que VOUS entendez par « parfait ».

**Fix :** Soyez spécifique. « Optimise pour latence sous 100ms » ou « Écris du code qui atteint 95% de coverage. »`;

// ─── LES 2.5 — De Instant Fix Toolkit ────────────────────────────────────────

const LESSON_2_5_NL = `# Les 2.5 — De Instant Fix Toolkit

Je prompt werkt niet. De output is slecht. Wat nu?

Gooi de prompt niet weg. Fix hem. Met deze 6 technieken repareer je 90% van de slechte output — in minder dan een minuut.

## Fix 1: Voeg een ROL toe

Output te generiek? Begin je prompt met: *"Je bent een [specifieke rol] met [X jaar] ervaring in [domein]."*

Verschil: van generic assistant naar domain expert.

## Fix 2: Geef een voorbeeld

Output in het verkeerde format? Zeg: *"Geef output in dit format: [plak voorbeeld]."*

Show, don't tell. Een voorbeeld zegt meer dan een beschrijving.

## Fix 3: Beperk de scope

Output te breed of te lang? Voeg toe: *"Focus alleen op [X]. Maximaal [Y] regels/zinnen/punten."*

Minder is meer. Een scherp antwoord op één vraag is beter dan een vaag antwoord op alles.

## Fix 4: Vraag om stap-voor-stap

Output springt te snel naar een conclusie? Voeg toe: *"Denk stap voor stap na. Laat je redenering zien."*

Chain of Thought. Het model redeneert beter hardop.

## Fix 5: Specificeer wat NIET mag

Output bevat ongewenste elementen? Voeg constraints toe: *"Gebruik GEEN [X]. Vermijd [Y]. Maximaal [Z]."*

Grenzen geven richting.

## Fix 6: Itereer — vraag door

Eerste output is 70% goed? Gooi niet weg. Bouw voort: *"Dit is goed, maar pas het volgende aan: [specifieke feedback]."*

AI-gesprekken zijn iteratief. De eerste prompt is zelden de laatste.

---

**De meeste problemen los je op met Fix 1 (ROL) + Fix 3 (scope).** Begin daar. Als dat niet genoeg is, stapel de andere fixes erop.`;

const LESSON_2_5_EN = `# Lesson 2.5 — The Instant Fix Toolkit

Your prompt isn't working. Output is poor. Now what?

Don't throw the prompt away. Fix it. With these 6 techniques you repair 90% of bad output — in under a minute.

## Fix 1: Add a ROLE

Output too generic? Start your prompt with: *"You are a [specific role] with [X years] experience in [domain]."*

Difference: from generic assistant to domain expert.

## Fix 2: Give an example

Output in the wrong format? Say: *"Give output in this format: [paste example]."*

Show, don't tell. An example beats a description.

## Fix 3: Narrow the scope

Output too broad or too long? Add: *"Focus only on [X]. Max [Y] lines/sentences/points."*

Less is more. A sharp answer to one question beats a vague answer to all.

## Fix 4: Ask for step-by-step

Output jumps to a conclusion too fast? Add: *"Think step by step. Show your reasoning."*

Chain of Thought. The model reasons better out loud.

## Fix 5: Specify what is NOT allowed

Output contains unwanted elements? Add constraints: *"Do NOT use [X]. Avoid [Y]. Max [Z]."*

Limits give direction.

## Fix 6: Iterate — keep asking

First output is 70% good? Don't throw away. Build on it: *"This is good, but adjust the following: [specific feedback]."*

AI conversations are iterative. The first prompt is rarely the last.

---

**Most problems you solve with Fix 1 (ROLE) + Fix 3 (scope).** Start there. If that's not enough, stack the other fixes on top.`;

const LESSON_2_5_FR = `# Leçon 2.5 — La Toolkit Instant Fix

Votre prompt ne marche pas. La sortie est mauvaise. Et maintenant ?

Ne jetez pas le prompt. Réparez-le. Avec ces 6 techniques vous corrigez 90 % des mauvaises sorties — en moins d'une minute.

## Fix 1 : Ajoutez un RÔLE

Sortie trop générique ? Commencez par : *« Tu es un [rôle spécifique] avec [X ans] d'expérience en [domaine]. »*

Différence : de l'assistant générique à l'expert domaine.

## Fix 2 : Donnez un exemple

Sortie dans le mauvais format ? Dites : *« Sortie dans ce format : [coller exemple]. »*

Show, don't tell. Un exemple vaut mieux qu'une description.

## Fix 3 : Restreignez la portée

Sortie trop large ou trop longue ? Ajoutez : *« Focus seulement sur [X]. Max [Y] lignes/phrases/points. »*

Moins c'est plus. Une réponse nette à une question bat une réponse floue à toutes.

## Fix 4 : Demandez du pas-à-pas

La sortie saute vite à la conclusion ? Ajoutez : *« Pense étape par étape. Montre ton raisonnement. »*

Chain of Thought. Le modèle raisonne mieux à voix haute.

## Fix 5 : Spécifiez ce qui est INTERDIT

La sortie contient des éléments indésirables ? Ajoutez des contraintes : *« N'utilise PAS [X]. Évite [Y]. Max [Z]. »*

Les limites donnent une direction.

## Fix 6 : Itérez — continuez de demander

Première sortie à 70 % correcte ? Ne jetez pas. Construisez dessus : *« C'est bon, mais ajuste ceci : [feedback spécifique]. »*

Les conversations IA sont itératives. Le premier prompt est rarement le dernier.

---

**La plupart des problèmes se résolvent avec Fix 1 (RÔLE) + Fix 3 (portée).** Commencez là. Si ce n'est pas assez, empilez les autres fixes par-dessus.`;

// ─── LAB 2A — Before/After Challenge ─────────────────────────────────────────

const LAB_2A_NL = `# Lab 2A — Before/After Challenge

**Duur: 30 minuten**

Neem de prompt die je in Level 1 (Les 1.5) hebt gebruikt voor je eerste AI-gesprek. Je gaat hem herschrijven met het Pentagon Model en het verschil zien.

## Stap 1: Haal je Level 1 prompt op
Pak de prompt die je in Level 1 hebt gebruikt. Bewaar de output.

## Stap 2: Herschrijf met Pentagon
Herschrijf dezelfde prompt, maar nu met alle 5 atomen:
- **ROL**: Wie moet dit antwoord geven?
- **CONTEXT**: Wat moet het model weten over je situatie?
- **TAAK**: Wat moet het model precies doen?
- **FORMAT**: Hoe wil je de output?
- **CONSTRAINTS**: Wat mag niet?

## Stap 3: Vergelijk
Voer beide prompts uit (de oude en de nieuwe) in LibreChat of Claude Code. Leg de output naast elkaar. Beantwoord:
- Wat is het verschil in kwaliteit?
- Welke atoom maakte het grootste verschil?
- Is de output direct bruikbaar?

## Stap 4: Deel
Deel je before/after met je buurman of squad. Bespreek: welke atoom vergaten jullie het vaakst?

**Deliverable:** Markdown-bestand met je before-prompt, after-prompt, beide outputs, en een 1-alinea reflectie.`;

const LAB_2A_EN = `# Lab 2A — Before/After Challenge

**Duration: 30 minutes**

Take the prompt you used in Level 1 (Lesson 1.5) for your first AI conversation. You'll rewrite it with the Pentagon Model and see the difference.

## Step 1: Retrieve your Level 1 prompt
Grab the prompt you used in Level 1. Keep the output.

## Step 2: Rewrite with Pentagon
Rewrite the same prompt but now with all 5 atoms:
- **ROLE**: Who should answer this?
- **CONTEXT**: What should the model know about your situation?
- **TASK**: What exactly should the model do?
- **FORMAT**: How do you want the output?
- **CONSTRAINTS**: What's not allowed?

## Step 3: Compare
Run both prompts (old and new) in LibreChat or Claude Code. Put the outputs side by side. Answer:
- What is the difference in quality?
- Which atom made the biggest difference?
- Is the output directly usable?

## Step 4: Share
Share your before/after with your neighbour or squad. Discuss: which atom did you forget most often?

**Deliverable:** Markdown file with before-prompt, after-prompt, both outputs, and a 1-paragraph reflection.`;

const LAB_2A_FR = `# Lab 2A — Before/After Challenge

**Durée : 30 minutes**

Prenez le prompt utilisé au Level 1 (Leçon 1.5) pour votre première conversation IA. Vous allez le réécrire avec le Pentagon Model et voir la différence.

## Étape 1 : Récupérez votre prompt Level 1
Prenez le prompt utilisé au Level 1. Conservez la sortie.

## Étape 2 : Réécrivez avec Pentagon
Réécrivez le même prompt avec les 5 atomes :
- **RÔLE** : Qui doit répondre ?
- **CONTEXT** : Que doit savoir le modèle sur votre situation ?
- **TÂCHE** : Que doit faire exactement le modèle ?
- **FORMAT** : Quelle sortie voulez-vous ?
- **CONSTRAINTS** : Qu'est-ce qui est interdit ?

## Étape 3 : Comparez
Exécutez les deux prompts (ancien et nouveau) dans LibreChat ou Claude Code. Mettez les sorties côte à côte. Répondez :
- Quelle est la différence de qualité ?
- Quel atome a fait la plus grande différence ?
- La sortie est-elle directement utilisable ?

## Étape 4 : Partagez
Partagez votre before/after avec votre voisin ou squad. Discutez : quel atome oubliiez-vous le plus souvent ?

**Livrable :** Fichier markdown avec before-prompt, after-prompt, les deux sorties, et une réflexion d'un paragraphe.`;

// ─── LAB 2B — Pentagon Template Builder ──────────────────────────────────────

const LAB_2B_NL = `# Lab 2B — Pentagon Template Builder

**Duur: 45 minuten**

Bouw een \`prompt-templates.md\` bestand met 3 herbruikbare Pentagon-templates voor taken die je ELKE WEEK doet.

## Stap 1: Identificeer je top 3 taken
Welke 3 taken doe je wekelijks die AI kan verbeteren? Denk aan: code review, documentatie, test schrijven, rapportage, planning.

## Stap 2: Bouw 3 Pentagon-templates

Per taak, schrijf een template:

\`\`\`
TEMPLATE: [Naam]
WANNEER: [Trigger — wanneer gebruik je dit?]
ROL: [...]
CONTEXT: [... met placeholders voor variabele delen]
TAAK: [...]
FORMAT: [...]
CONSTRAINTS: [...]
\`\`\`

## Stap 3: Test elke template
Voer elke template uit met echte (of realistische) data. Werkt het? Pas aan tot het klopt.

## Stap 4: Sla op
Sla je \`prompt-templates.md\` op in je project of LibreChat memories. Dit is je eerste herbruikbare AI-toolkit.

**Deliverable:** \`prompt-templates.md\` met 3 werkende templates + voorbeeld-output per template.`;

const LAB_2B_EN = `# Lab 2B — Pentagon Template Builder

**Duration: 45 minutes**

Build a \`prompt-templates.md\` file with 3 reusable Pentagon templates for tasks you do EVERY WEEK.

## Step 1: Identify your top 3 tasks
Which 3 tasks do you do weekly that AI can improve? Think: code review, documentation, writing tests, reporting, planning.

## Step 2: Build 3 Pentagon templates

Per task, write a template:

\`\`\`
TEMPLATE: [Name]
WHEN: [Trigger — when do you use this?]
ROLE: [...]
CONTEXT: [... with placeholders for variable parts]
TASK: [...]
FORMAT: [...]
CONSTRAINTS: [...]
\`\`\`

## Step 3: Test each template
Run each template with real (or realistic) data. Does it work? Adjust until correct.

## Step 4: Save
Save your \`prompt-templates.md\` in your project or LibreChat memories. This is your first reusable AI toolkit.

**Deliverable:** \`prompt-templates.md\` with 3 working templates + example output per template.`;

const LAB_2B_FR = `# Lab 2B — Pentagon Template Builder

**Durée : 45 minutes**

Construisez un fichier \`prompt-templates.md\` avec 3 templates Pentagon réutilisables pour des tâches que vous faites CHAQUE SEMAINE.

## Étape 1 : Identifiez vos 3 tâches top
Quelles 3 tâches faites-vous chaque semaine que l'IA peut améliorer ? Pensez : revue de code, doc, tests, reporting, planning.

## Étape 2 : Construisez 3 templates Pentagon

Par tâche, écrivez un template :

\`\`\`
TEMPLATE : [Nom]
QUAND : [Déclencheur — quand l'utilisez-vous ?]
RÔLE : [...]
CONTEXT : [... avec placeholders pour parties variables]
TÂCHE : [...]
FORMAT : [...]
CONSTRAINTS : [...]
\`\`\`

## Étape 3 : Testez chaque template
Exécutez chaque template avec des données réelles (ou réalistes). Ça marche ? Ajustez jusqu'à correct.

## Étape 4 : Sauvegardez
Sauvegardez \`prompt-templates.md\` dans votre projet ou LibreChat memories. C'est votre première toolkit IA réutilisable.

**Livrable :** \`prompt-templates.md\` avec 3 templates fonctionnels + exemple de sortie par template.`;

// ─── Role tracks (6 tracks × 3 locales — "De Pentagon Challenge") ────────────

const ROLE_TRACKS_NL = `# Rol-opdrachten Level 2 — "De Pentagon Challenge"

Elke deelnemer kiest de opdracht die past bij zijn/haar rol. Je mag ook een andere kiezen — het gaat om het doen, niet de categorie.

## BACKEND ENGINEERS (Golang / Java) — "Pentagon: De Code Documentor"

**Opdracht:** Schrijf een Pentagon-prompt die een microservice endpoint volledig documenteert. Niet een generiek "schrijf docs" — een prompt die je ELKE keer kunt hergebruiken.

Wat je prompt moet genereren:
1. Functie-uitleg in gewone taal
2. Input/output specificatie (types, validatie, edge cases)
3. Afhankelijkheden en side effects
4. Faalscenario's en error responses
5. Voorbeeld request/response

- **Tool:** Claude Code of LibreChat
- **Duur:** 45 minuten
- **Deliverable:** De Pentagon-prompt + de gegenereerde documentatie + je review-notities
- **Badge-criteria:** Een nieuwe teamgenoot kan het endpoint begrijpen en ermee werken zonder extra uitleg.

## FRONTEND DEVELOPERS (React / Angular) — "Pentagon: De Component Brief"

**Opdracht:** Schrijf een Pentagon-prompt die een React/Angular component genereert vanuit een tekstuele beschrijving. Van brief naar werkende code in één prompt.

Wat je prompt moet genereren:
1. Component code met TypeScript props interface
2. Styling (jullie design tokens)
3. States: loading, error, empty, filled
4. Accessibility (aria labels, keyboard nav)
5. Een eenvoudige unit test

- **Tool:** Claude Code of LibreChat
- **Duur:** 45 minuten
- **Deliverable:** De Pentagon-prompt + gegenereerde component + review
- **Badge-criteria:** De component compileert en ziet er visueel correct uit.

## TESTERS / QA — "Pentagon: De Testset Generator"

**Opdracht:** Schrijf een Pentagon-prompt die voor een API endpoint een complete testset genereert. Niet "schrijf tests" — maar een prompt die systematisch ELKE hoek belicht.

Wat je prompt moet genereren:
1. Happy path testcases (normaal gebruik)
2. Edge cases (grenswaarden, lege input, max values)
3. Error scenarios (401, 403, 404, 500, timeout)
4. Security tests (injection, unauthorized access)
5. Performance hints (verwachte response times)

- **Tool:** Claude Code of LibreChat
- **Duur:** 45 minuten
- **Deliverable:** De Pentagon-prompt + gegenereerde testset + review
- **Badge-criteria:** De testset bevat minimaal 3 edge cases die je team niet had bedacht.

## PRODUCT MANAGERS / UX — "Pentagon: De Story Writer"

**Opdracht:** Schrijf een Pentagon-prompt die een feature-idee vertaalt naar een complete user story met acceptance criteria. Van idee naar Jira-ready in één prompt.

Wat je prompt moet genereren:
1. User story (als [persona] wil ik [actie] zodat [waarde])
2. Acceptance criteria (als checklist)
3. Edge cases en risico's
4. Technische overwegingen (voor het dev-team)
5. Prioriteringssuggestie (must/should/could)

- **Tool:** LibreChat
- **Duur:** 45 minuten
- **Deliverable:** De Pentagon-prompt + gegenereerde user story + review
- **Badge-criteria:** De story is concreet en compleet genoeg om in een sprint te plannen.

## MANAGERS — "Pentagon: De Rapportage Machine"

**Opdracht:** Schrijf een Pentagon-prompt die een kwartaalrapportage-template genereert voor jouw team. Niet een generiek template — maar eentje die past bij JOUW team, JOUW KPI's, JOUW directeur.

Wat je prompt moet genereren:
1. Executive summary (3 zinnen)
2. KPI-overzicht met trends
3. Highlights en risico's
4. Team performance samenvatting
5. Actiepunten voor volgende kwartaal

- **Tool:** LibreChat
- **Duur:** 45 minuten
- **Deliverable:** De Pentagon-prompt + gegenereerde rapportage + review
- **Badge-criteria:** De rapportage is helder genoeg om zonder aanvullende context te begrijpen.

## ADVANCED (Early Adopters) — "Pentagon: De Prompt Chain"

**Opdracht:** Bouw een multi-step prompt chain — minimaal 3 stappen — waarbij de output van stap N de input is voor stap N+1. Elk stap gebruikt het Pentagon Model.

Voorbeeld chains:
- Code → Review → Refactor → Tests → Documentation
- Data → Analyse → Visualisatie → Presentatie
- Bug report → Root cause → Fix → Regression test

- **Tool:** Claude Code
- **Duur:** 60 minuten
- **Deliverable:** De volledige chain (3+ stappen) + Pentagon-prompt per stap + evaluatie waar de chain breekt
- **Badge-criteria:** De chain is end-to-end uitvoerbaar en levert bruikbare output op.`;

const ROLE_TRACKS_EN = `# Level 2 Role Tracks — "The Pentagon Challenge"

Each participant picks the task matching their role. You may pick another — it's about the doing, not the category.

## BACKEND ENGINEERS (Golang / Java) — "Pentagon: The Code Documentor"

**Task:** Write a Pentagon prompt that fully documents a microservice endpoint. Not generic "write docs" — a prompt you can reuse EVERY time.

What your prompt must generate:
1. Function explanation in plain language
2. Input/output spec (types, validation, edge cases)
3. Dependencies and side effects
4. Failure scenarios and error responses
5. Example request/response

- **Tool:** Claude Code or LibreChat
- **Duration:** 45 minutes
- **Deliverable:** The Pentagon prompt + generated documentation + review notes
- **Badge criteria:** A new teammate can understand the endpoint and work with it without extra explanation.

## FRONTEND DEVELOPERS (React / Angular) — "Pentagon: The Component Brief"

**Task:** Write a Pentagon prompt that generates a React/Angular component from a text description. From brief to working code in one prompt.

What your prompt must generate:
1. Component code with TypeScript props interface
2. Styling (your design tokens)
3. States: loading, error, empty, filled
4. Accessibility (aria labels, keyboard nav)
5. A simple unit test

- **Tool:** Claude Code or LibreChat
- **Duration:** 45 minutes
- **Deliverable:** The Pentagon prompt + generated component + review
- **Badge criteria:** Component compiles and looks visually correct.

## TESTERS / QA — "Pentagon: The Testset Generator"

**Task:** Write a Pentagon prompt that generates a complete test set for an API endpoint. Not "write tests" — a prompt that systematically covers EVERY angle.

What your prompt must generate:
1. Happy path testcases (normal use)
2. Edge cases (boundary values, empty input, max values)
3. Error scenarios (401, 403, 404, 500, timeout)
4. Security tests (injection, unauthorized access)
5. Performance hints (expected response times)

- **Tool:** Claude Code or LibreChat
- **Duration:** 45 minutes
- **Deliverable:** The Pentagon prompt + generated test set + review
- **Badge criteria:** Test set contains at least 3 edge cases your team hadn't thought of.

## PRODUCT MANAGERS / UX — "Pentagon: The Story Writer"

**Task:** Write a Pentagon prompt that turns a feature idea into a complete user story with acceptance criteria. From idea to Jira-ready in one prompt.

What your prompt must generate:
1. User story (as [persona] I want [action] so that [value])
2. Acceptance criteria (as a checklist)
3. Edge cases and risks
4. Technical considerations (for the dev team)
5. Priority suggestion (must/should/could)

- **Tool:** LibreChat
- **Duration:** 45 minutes
- **Deliverable:** The Pentagon prompt + generated user story + review
- **Badge criteria:** Story is concrete and complete enough to plan in a sprint.

## MANAGERS — "Pentagon: The Reporting Machine"

**Task:** Write a Pentagon prompt that generates a quarterly reporting template for your team. Not a generic template — one that fits YOUR team, YOUR KPIs, YOUR director.

What your prompt must generate:
1. Executive summary (3 sentences)
2. KPI overview with trends
3. Highlights and risks
4. Team performance summary
5. Action points for next quarter

- **Tool:** LibreChat
- **Duration:** 45 minutes
- **Deliverable:** The Pentagon prompt + generated report + review
- **Badge criteria:** Report is clear enough to read without additional context.

## ADVANCED (Early Adopters) — "Pentagon: The Prompt Chain"

**Task:** Build a multi-step prompt chain — at least 3 steps — where the output of step N is the input for step N+1. Each step uses the Pentagon Model.

Example chains:
- Code → Review → Refactor → Tests → Documentation
- Data → Analysis → Visualisation → Presentation
- Bug report → Root cause → Fix → Regression test

- **Tool:** Claude Code
- **Duration:** 60 minutes
- **Deliverable:** The full chain (3+ steps) + Pentagon prompt per step + evaluation where the chain breaks
- **Badge criteria:** Chain is end-to-end executable and produces usable output.`;

const ROLE_TRACKS_FR = `# Tracks rôle Level 2 — « La Pentagon Challenge »

Chaque participant choisit la tâche qui correspond à son rôle. Vous pouvez en choisir une autre — c'est le faire qui compte, pas la catégorie.

## BACKEND ENGINEERS (Golang / Java) — « Pentagon : Le Code Documentor »

**Tâche :** Écrivez un prompt Pentagon qui documente entièrement un endpoint microservice. Pas un « écris la doc » générique — un prompt réutilisable CHAQUE fois.

Ce que votre prompt doit générer :
1. Explication de la fonction en langage simple
2. Spec input/output (types, validation, edge cases)
3. Dépendances et side effects
4. Scénarios d'échec et réponses d'erreur
5. Exemple de request/response

- **Outil :** Claude Code ou LibreChat
- **Durée :** 45 minutes
- **Livrable :** Le prompt Pentagon + doc générée + notes de revue
- **Critères badge :** Un nouveau coéquipier peut comprendre l'endpoint et travailler sans explication supplémentaire.

## FRONTEND DEVELOPERS (React / Angular) — « Pentagon : Le Component Brief »

**Tâche :** Écrivez un prompt Pentagon qui génère un composant React/Angular depuis une description textuelle. Du brief au code fonctionnel en un prompt.

Ce que votre prompt doit générer :
1. Code composant avec interface props TypeScript
2. Styling (vos design tokens)
3. States : loading, error, empty, filled
4. Accessibilité (aria labels, navigation clavier)
5. Un unit test simple

- **Outil :** Claude Code ou LibreChat
- **Durée :** 45 minutes
- **Livrable :** Le prompt Pentagon + composant généré + revue
- **Critères badge :** Le composant compile et est visuellement correct.

## TESTERS / QA — « Pentagon : Le Testset Generator »

**Tâche :** Écrivez un prompt Pentagon qui génère un testset complet pour un endpoint API. Pas « écris des tests » — un prompt qui couvre systématiquement CHAQUE angle.

Ce que votre prompt doit générer :
1. Testcases happy path (usage normal)
2. Edge cases (valeurs limites, input vide, max)
3. Scénarios d'erreur (401, 403, 404, 500, timeout)
4. Tests sécurité (injection, accès non autorisé)
5. Indications performance (temps de réponse attendus)

- **Outil :** Claude Code ou LibreChat
- **Durée :** 45 minutes
- **Livrable :** Le prompt Pentagon + testset généré + revue
- **Critères badge :** Le testset contient au moins 3 edge cases non anticipés par l'équipe.

## PRODUCT MANAGERS / UX — « Pentagon : Le Story Writer »

**Tâche :** Écrivez un prompt Pentagon qui transforme une idée de feature en user story complète avec acceptance criteria. De l'idée au Jira-ready en un prompt.

Ce que votre prompt doit générer :
1. User story (en tant que [persona] je veux [action] pour [valeur])
2. Acceptance criteria (en checklist)
3. Edge cases et risques
4. Considérations techniques (pour l'équipe dev)
5. Suggestion de priorité (must/should/could)

- **Outil :** LibreChat
- **Durée :** 45 minutes
- **Livrable :** Le prompt Pentagon + user story générée + revue
- **Critères badge :** La story est concrète et complète pour être planifiée en sprint.

## MANAGERS — « Pentagon : La Machine à Reporting »

**Tâche :** Écrivez un prompt Pentagon qui génère un template de reporting trimestriel pour votre équipe. Pas un template générique — un qui convient à VOTRE équipe, VOS KPIs, VOTRE directeur.

Ce que votre prompt doit générer :
1. Résumé exécutif (3 phrases)
2. Vue d'ensemble KPIs avec tendances
3. Highlights et risques
4. Résumé performance équipe
5. Actions pour le prochain trimestre

- **Outil :** LibreChat
- **Durée :** 45 minutes
- **Livrable :** Le prompt Pentagon + rapport généré + revue
- **Critères badge :** Rapport clair sans besoin de contexte additionnel.

## ADVANCED (Early Adopters) — « Pentagon : Le Prompt Chain »

**Tâche :** Construisez une chaîne de prompts multi-étapes — au moins 3 étapes — où la sortie de l'étape N est l'entrée de l'étape N+1. Chaque étape utilise le Pentagon Model.

Exemples de chaînes :
- Code → Revue → Refactor → Tests → Documentation
- Données → Analyse → Visualisation → Présentation
- Bug report → Cause racine → Fix → Test de régression

- **Outil :** Claude Code
- **Durée :** 60 minutes
- **Livrable :** La chaîne complète (3+ étapes) + prompt Pentagon par étape + évaluation où la chaîne casse
- **Critères badge :** La chaîne est exécutable de bout en bout et produit une sortie utilisable.`;

// ═════════════════════════════════════════════════════════════════════════════
// ── WEEK 1 EXPORT ───────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

export const WEEK_1: CurriculumWeek = {
  id: 'week-1',
  number: 1,
  title: 'Level 2 — The Pentagon Model',
  titleI18n: {
    en: 'Level 2 — The Pentagon Model',
    nl: 'Level 2 — The Pentagon Model',
    fr: 'Level 2 — Le Pentagon Model',
  },
  subtitle: '5 atomen · Before/After · Instant Fix Toolkit',
  subtitleI18n: {
    en: '5 atoms · Before/After · Instant Fix Toolkit',
    nl: '5 atomen · Before/After · Instant Fix Toolkit',
    fr: '5 atomes · Before/After · Toolkit Instant Fix',
  },
  description:
    'Na dit level kan elke deelnemer een gestructureerde prompt bouwen die consistent goede output levert. Je kent de 5 atomen (ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS), herkent de 4 meest voorkomende fouten, en hebt een persoonlijke toolkit met herbruikbare prompt-templates.',
  descriptionI18n: {
    en: 'After this level every participant can build a structured prompt that consistently delivers good output. You know the 5 atoms (ROLE · CONTEXT · TASK · FORMAT · CONSTRAINTS), spot the 4 most common mistakes, and have a personal toolkit of reusable prompt templates.',
    nl: 'Na dit level kan elke deelnemer een gestructureerde prompt bouwen die consistent goede output levert. Je kent de 5 atomen (ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS), herkent de 4 meest voorkomende fouten, en hebt een persoonlijke toolkit met herbruikbare prompt-templates.',
    fr: 'Après ce niveau, chaque participant peut construire un prompt structuré qui livre une sortie cohérente. Vous connaissez les 5 atomes (RÔLE · CONTEXT · TÂCHE · FORMAT · CONSTRAINTS), repérez les 4 erreurs les plus fréquentes, et avez une toolkit personnelle de templates de prompts réutilisables.',
  },
  objectives: [
    'Ken de 5 atomen (ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS) uit je hoofd',
    'Zie het verschil tussen een vage en een gestructureerde prompt',
    'Herken de 4 anti-patterns en fix ze direct',
    'Fix slechte output met de Instant Fix Toolkit',
    'Bouw herbruikbare prompt-templates voor je dagelijks werk',
  ],
  objectivesI18n: {
    en: [
      'Know the 5 atoms (ROLE · CONTEXT · TASK · FORMAT · CONSTRAINTS) by heart',
      'See the difference between a vague and a structured prompt',
      'Spot the 4 anti-patterns and fix them on the spot',
      'Fix bad output with the Instant Fix Toolkit',
      'Build reusable prompt templates for your daily work',
    ],
    nl: [
      'Ken de 5 atomen (ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS) uit je hoofd',
      'Zie het verschil tussen een vage en een gestructureerde prompt',
      'Herken de 4 anti-patterns en fix ze direct',
      'Fix slechte output met de Instant Fix Toolkit',
      'Bouw herbruikbare prompt-templates voor je dagelijks werk',
    ],
    fr: [
      'Connaître les 5 atomes (RÔLE · CONTEXT · TÂCHE · FORMAT · CONSTRAINTS) par cœur',
      'Voir la différence entre un prompt vague et structuré',
      'Repérer les 4 anti-patterns et les fixer sur place',
      'Corriger les mauvaises sorties avec la toolkit Instant Fix',
      'Construire des templates de prompts réutilisables pour le quotidien',
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
  badgeName: 'Pentagon Architect',
  badgeNameI18n: {
    en: 'Pentagon Architect',
    nl: 'Pentagon Architect',
    fr: 'Pentagon Architect',
  },
  badgeIcon: '⬟',
  weeklyQuiz: [
    {
      id: 'w1-q1',
      question: 'Wat zijn de 5 atomen van het Pentagon Model?',
      questionI18n: {
        en: 'What are the 5 atoms of the Pentagon Model?',
        nl: 'Wat zijn de 5 atomen van het Pentagon Model?',
        fr: 'Quels sont les 5 atomes du Pentagon Model ?',
      },
      options: [
        'ROL · CONTEXT · GOAL · PROCESS · FORMAT',
        'ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS',
        'WHO · WHAT · WHEN · WHERE · WHY',
        'INPUT · CONTEXT · MODEL · OUTPUT · REVIEW',
      ],
      optionsI18n: {
        en: [
          'ROLE · CONTEXT · GOAL · PROCESS · FORMAT',
          'ROLE · CONTEXT · TASK · FORMAT · CONSTRAINTS',
          'WHO · WHAT · WHEN · WHERE · WHY',
          'INPUT · CONTEXT · MODEL · OUTPUT · REVIEW',
        ],
        nl: [
          'ROL · CONTEXT · GOAL · PROCESS · FORMAT',
          'ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS',
          'WHO · WHAT · WHEN · WHERE · WHY',
          'INPUT · CONTEXT · MODEL · OUTPUT · REVIEW',
        ],
        fr: [
          'RÔLE · CONTEXT · GOAL · PROCESS · FORMAT',
          'RÔLE · CONTEXT · TÂCHE · FORMAT · CONSTRAINTS',
          'WHO · WHAT · WHEN · WHERE · WHY',
          'INPUT · CONTEXT · MODEL · OUTPUT · REVIEW',
        ],
      },
      correctIndex: 1,
      explanation: 'Pentagon v1.1: ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS. CONSTRAINTS is kritiek bij Worldline (geen PAN/CVV, etc.).',
      explanationI18n: {
        en: 'Pentagon v1.1: ROLE · CONTEXT · TASK · FORMAT · CONSTRAINTS. CONSTRAINTS is critical at Worldline (no PAN/CVV, etc.).',
        nl: 'Pentagon v1.1: ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS. CONSTRAINTS is kritiek bij Worldline (geen PAN/CVV, etc.).',
        fr: 'Pentagon v1.1 : RÔLE · CONTEXT · TÂCHE · FORMAT · CONSTRAINTS. CONSTRAINTS est critique chez Worldline (pas de PAN/CVV, etc.).',
      },
      bloomLevel: 1,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w1-q2',
      question: 'Welke atoom mist in deze prompt: "Senior Go-reviewer. Review deze functie. Output als markdown-tabel."?',
      questionI18n: {
        en: 'Which atom is missing in: "Senior Go reviewer. Review this function. Output as markdown table."?',
        nl: 'Welke atoom mist in deze prompt: "Senior Go-reviewer. Review deze functie. Output als markdown-tabel."?',
        fr: 'Quel atome manque : « Senior Go reviewer. Revois cette fonction. Sortie en tableau markdown. » ?',
      },
      options: ['ROL', 'CONTEXT + TAAK (specifiek) + CONSTRAINTS', 'FORMAT', 'Alles zit erin'],
      optionsI18n: {
        en: ['ROLE', 'CONTEXT + TASK (specific) + CONSTRAINTS', 'FORMAT', 'Everything is there'],
        nl: ['ROL', 'CONTEXT + TAAK (specifiek) + CONSTRAINTS', 'FORMAT', 'Alles zit erin'],
        fr: ['RÔLE', 'CONTEXT + TÂCHE (spécifique) + CONSTRAINTS', 'FORMAT', 'Tout est là'],
      },
      correctIndex: 1,
      explanation: 'ROL (Senior Go-reviewer) en FORMAT (markdown-tabel) zijn er. CONTEXT (welke codebase? welke stack?), TAAK (waar specifiek review op?) en CONSTRAINTS (wat niet?) ontbreken.',
      explanationI18n: {
        en: 'ROLE (Senior Go reviewer) and FORMAT (markdown table) are there. CONTEXT (which codebase? stack?), TASK (review for what specifically?) and CONSTRAINTS (what not?) are missing.',
        nl: 'ROL (Senior Go-reviewer) en FORMAT (markdown-tabel) zijn er. CONTEXT (welke codebase? welke stack?), TAAK (waar specifiek review op?) en CONSTRAINTS (wat niet?) ontbreken.',
        fr: 'RÔLE (Senior Go reviewer) et FORMAT (tableau markdown) présents. CONTEXT (quelle codebase ? stack ?), TÂCHE (revoir sur quoi précisément ?) et CONSTRAINTS (quoi non ?) manquent.',
      },
      bloomLevel: 3,
      euAiActRelevant: false,
      points: 10,
    },
    {
      id: 'w1-q3',
      question: 'Welk anti-pattern beschrijft: "Kun je deze code reviewen en ook even kijken of de tests kloppen en misschien ook documentatie schrijven?"',
      questionI18n: {
        en: 'Which anti-pattern describes: "Can you review this code and also check if the tests are right and maybe write some documentation?"',
        nl: 'Welk anti-pattern beschrijft: "Kun je deze code reviewen en ook even kijken of de tests kloppen en misschien ook documentatie schrijven?"',
        fr: 'Quel anti-pattern décrit : « Tu peux revoir ce code et vérifier aussi les tests et peut-être écrire la doc ? »',
      },
      options: ['De Rolloze Prompt', 'De Blob Prompt', 'De Wensdenker', 'De Context Dump'],
      optionsI18n: {
        en: ['The Role-less Prompt', 'The Blob Prompt', 'The Wishful Thinker', 'The Context Dump'],
        nl: ['De Rolloze Prompt', 'De Blob Prompt', 'De Wensdenker', 'De Context Dump'],
        fr: ['Le Prompt Sans Rôle', 'Le Blob Prompt', 'Le Penseur de Souhaits', 'Le Context Dump'],
      },
      correctIndex: 1,
      explanation: 'Alles in één zin zonder prioriteit = Blob Prompt. Fix: splits in aparte taken, één prompt per doel.',
      explanationI18n: {
        en: 'Everything in one sentence without priority = Blob Prompt. Fix: split into separate tasks, one prompt per goal.',
        nl: 'Alles in één zin zonder prioriteit = Blob Prompt. Fix: splits in aparte taken, één prompt per doel.',
        fr: 'Tout en une phrase sans priorité = Blob Prompt. Fix : séparer en tâches distinctes, un prompt par objectif.',
      },
      bloomLevel: 3,
      euAiActRelevant: false,
      points: 10,
    },
    {
      id: 'w1-q4',
      question: 'Welke anti-pattern zit in: "Maak deze code beter."?',
      questionI18n: {
        en: 'Which anti-pattern is in: "Make this code better."?',
        nl: 'Welke anti-pattern zit in: "Maak deze code beter."?',
        fr: 'Quel anti-pattern est dans : « Rends ce code meilleur. » ?',
      },
      options: ['De Rolloze Prompt', 'De Context Dump', 'De Wensdenker', 'De Blob Prompt'],
      optionsI18n: {
        en: ['The Role-less Prompt', 'The Context Dump', 'The Wishful Thinker', 'The Blob Prompt'],
        nl: ['De Rolloze Prompt', 'De Context Dump', 'De Wensdenker', 'De Blob Prompt'],
        fr: ['Le Prompt Sans Rôle', 'Le Context Dump', 'Le Penseur de Souhaits', 'Le Blob Prompt'],
      },
      correctIndex: 2,
      explanation: '"Beter" is niet meetbaar. Model weet niet wat JIJ "beter" vindt. Fix: "Optimaliseer voor latency onder 100ms" of "Verhoog test coverage naar 95%."',
      explanationI18n: {
        en: '"Better" is not measurable. Model doesn\'t know what YOU mean by "better". Fix: "Optimise for latency under 100ms" or "Raise test coverage to 95%."',
        nl: '"Beter" is niet meetbaar. Model weet niet wat JIJ "beter" vindt. Fix: "Optimaliseer voor latency onder 100ms" of "Verhoog test coverage naar 95%."',
        fr: '« Meilleur » n\'est pas mesurable. Le modèle ne sait pas ce que VOUS entendez. Fix : « Optimise pour latence <100ms » ou « Atteins 95% coverage. »',
      },
      bloomLevel: 3,
      euAiActRelevant: false,
      points: 10,
    },
    {
      id: 'w1-q5',
      question: 'Welke 2 Instant Fixes lossen volgens Les 2.5 de meeste slechte prompts op?',
      questionI18n: {
        en: 'Which 2 Instant Fixes solve most bad prompts according to Lesson 2.5?',
        nl: 'Welke 2 Instant Fixes lossen volgens Les 2.5 de meeste slechte prompts op?',
        fr: 'Quels 2 Instant Fixes résolvent le plus de mauvais prompts selon la Leçon 2.5 ?',
      },
      options: [
        'Fix 2 (voorbeeld) + Fix 6 (itereer)',
        'Fix 1 (ROL) + Fix 3 (scope)',
        'Fix 4 (stap-voor-stap) + Fix 5 (constraints)',
        'Alle 6 altijd stapelen',
      ],
      optionsI18n: {
        en: [
          'Fix 2 (example) + Fix 6 (iterate)',
          'Fix 1 (ROLE) + Fix 3 (scope)',
          'Fix 4 (step-by-step) + Fix 5 (constraints)',
          'Always stack all 6',
        ],
        nl: [
          'Fix 2 (voorbeeld) + Fix 6 (itereer)',
          'Fix 1 (ROL) + Fix 3 (scope)',
          'Fix 4 (stap-voor-stap) + Fix 5 (constraints)',
          'Alle 6 altijd stapelen',
        ],
        fr: [
          'Fix 2 (exemple) + Fix 6 (itérer)',
          'Fix 1 (RÔLE) + Fix 3 (portée)',
          'Fix 4 (pas-à-pas) + Fix 5 (contraintes)',
          'Toujours empiler les 6',
        ],
      },
      correctIndex: 1,
      explanation: 'ROL (van generic naar expert) + scope (focus op X, max Y regels) lost 90% op. Stapel extra fixes alleen als deze twee onvoldoende zijn.',
      explanationI18n: {
        en: 'ROLE (from generic to expert) + scope (focus on X, max Y lines) fixes 90%. Stack other fixes only if these two are not enough.',
        nl: 'ROL (van generic naar expert) + scope (focus op X, max Y regels) lost 90% op. Stapel extra fixes alleen als deze twee onvoldoende zijn.',
        fr: 'RÔLE (de générique à expert) + portée (focus sur X, max Y lignes) résout 90 %. Empilez les autres fixes seulement si ces deux ne suffisent pas.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
  ],
  days: [
    // ───── DAG 1: Les 2.1 + Lab Pentagon-scan ─────
    {
      day: 1,
      title: 'Les 2.1 — Het Pentagon Model',
      titleI18n: {
        en: 'Lesson 2.1 — The Pentagon Model',
        nl: 'Les 2.1 — Het Pentagon Model',
        fr: 'Leçon 2.1 — Le Pentagon Model',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w1d1-theory',
          title: 'Les 2.1 — Het Pentagon Model: De 5 Atomen',
          titleI18n: {
            en: 'Lesson 2.1 — The Pentagon Model: The 5 Atoms',
            nl: 'Les 2.1 — Het Pentagon Model: De 5 Atomen',
            fr: 'Leçon 2.1 — Le Pentagon Model : les 5 atomes',
          },
          type: 'theory',
          duration: 20,
          description: 'Waarom prompts niet werken · de 5 atomen · denkmodel vs checklist',
          descriptionI18n: {
            en: 'Why prompts don\'t work · the 5 atoms · thinking model vs checklist',
            nl: 'Waarom prompts niet werken · de 5 atomen · denkmodel vs checklist',
            fr: 'Pourquoi les prompts échouent · les 5 atomes · modèle de pensée vs checklist',
          },
          content: LESSON_2_1_NL,
          contentI18n: { en: LESSON_2_1_EN, nl: LESSON_2_1_NL, fr: LESSON_2_1_FR },
        },
        {
          id: 'w1d1-lab',
          title: 'Lab — Pentagon Scan: 3 eigen prompts',
          titleI18n: {
            en: 'Lab — Pentagon Scan: 3 own prompts',
            nl: 'Lab — Pentagon Scan: 3 eigen prompts',
            fr: 'Lab — Scan Pentagon : 3 prompts personnels',
          },
          type: 'lab',
          duration: 30,
          description: 'Pak 3 eigen prompts uit de afgelopen week, tel de atomen, identificeer gaps',
          descriptionI18n: {
            en: 'Take 3 of your own prompts from this week, count the atoms, identify gaps',
            nl: 'Pak 3 eigen prompts uit de afgelopen week, tel de atomen, identificeer gaps',
            fr: 'Prenez 3 de vos propres prompts de cette semaine, comptez les atomes, identifiez les gaps',
          },
          content: `# Lab — Pentagon Scan

**Duur: 30 minuten**

Pak 3 prompts die je deze week aan Claude Code / LibreChat / Copilot hebt gegeven. Voor elk:

1. Tel de 5 atomen (ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS). Welke zijn aanwezig?
2. Noteer welke ontbreken.
3. Schrijf kort op: wat zou je herschrijven?

**Deliverable:** Markdown-bestand met 3 prompt-scans. Deel in Slack #ai-academy.`,
          contentI18n: {
            en: `# Lab — Pentagon Scan

**Duration: 30 minutes**

Take 3 prompts you gave to Claude Code / LibreChat / Copilot this week. For each:

1. Count the 5 atoms (ROLE · CONTEXT · TASK · FORMAT · CONSTRAINTS). Which are present?
2. Note which are missing.
3. Write briefly: what would you rewrite?

**Deliverable:** Markdown file with 3 prompt scans. Share in Slack #ai-academy.`,
            nl: `# Lab — Pentagon Scan

**Duur: 30 minuten**

Pak 3 prompts die je deze week aan Claude Code / LibreChat / Copilot hebt gegeven. Voor elk:

1. Tel de 5 atomen (ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS). Welke zijn aanwezig?
2. Noteer welke ontbreken.
3. Schrijf kort op: wat zou je herschrijven?

**Deliverable:** Markdown-bestand met 3 prompt-scans. Deel in Slack #ai-academy.`,
            fr: `# Lab — Scan Pentagon

**Durée : 30 minutes**

Prenez 3 prompts donnés à Claude Code / LibreChat / Copilot cette semaine. Pour chacun :

1. Comptez les 5 atomes (RÔLE · CONTEXT · TÂCHE · FORMAT · CONSTRAINTS). Lesquels présents ?
2. Notez ceux qui manquent.
3. Écrivez brièvement : qu'est-ce que vous réécririez ?

**Livrable :** Fichier markdown avec 3 scans. Partagez sur Slack #ai-academy.`,
          },
          exercises: [
            {
              id: 'w1d1-ex1',
              title: '3 Pentagon-scans',
              titleI18n: { en: '3 Pentagon scans', nl: '3 Pentagon-scans', fr: '3 scans Pentagon' },
              instructions: 'Scan 3 eigen prompts op de 5 atomen. Noteer per prompt: welke atomen aanwezig, welke ontbreken, 1-zin herschrijf-voorstel.',
              instructionsI18n: {
                en: 'Scan 3 of your own prompts on the 5 atoms. Per prompt: which atoms present, which missing, 1-sentence rewrite suggestion.',
                nl: 'Scan 3 eigen prompts op de 5 atomen. Noteer per prompt: welke atomen aanwezig, welke ontbreken, 1-zin herschrijf-voorstel.',
                fr: 'Scannez 3 de vos prompts sur les 5 atomes. Par prompt : atomes présents, manquants, suggestion de réécriture en 1 phrase.',
              },
              type: 'free-form',
              difficulty: 1,
              points: 10,
            },
          ],
        },
      ],
    },
    // ───── DAG 2: Les 2.2 + Lab Atom Annotation ─────
    {
      day: 2,
      title: 'Les 2.2 — Elke Atoom in Detail',
      titleI18n: {
        en: 'Lesson 2.2 — Each Atom in Detail',
        nl: 'Les 2.2 — Elke Atoom in Detail',
        fr: 'Leçon 2.2 — Chaque atome en détail',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w1d2-theory',
          title: 'Les 2.2 — Elke Atoom in Detail',
          titleI18n: {
            en: 'Lesson 2.2 — Each Atom in Detail',
            nl: 'Les 2.2 — Elke Atoom in Detail',
            fr: 'Leçon 2.2 — Chaque atome en détail',
          },
          type: 'theory',
          duration: 25,
          description: 'ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS — elk atoom met voorbeelden + Worldline-constraints',
          descriptionI18n: {
            en: 'ROLE · CONTEXT · TASK · FORMAT · CONSTRAINTS — each atom with examples + Worldline constraints',
            nl: 'ROL · CONTEXT · TAAK · FORMAT · CONSTRAINTS — elk atoom met voorbeelden + Worldline-constraints',
            fr: 'RÔLE · CONTEXT · TÂCHE · FORMAT · CONSTRAINTS — chaque atome avec exemples + contraintes Worldline',
          },
          content: LESSON_2_2_NL,
          contentI18n: { en: LESSON_2_2_EN, nl: LESSON_2_2_NL, fr: LESSON_2_2_FR },
        },
        {
          id: 'w1d2-lab',
          title: 'Lab — Atom Annotation',
          titleI18n: {
            en: 'Lab — Atom Annotation',
            nl: 'Lab — Atom Annotation',
            fr: 'Lab — Annotation d\'atomes',
          },
          type: 'lab',
          duration: 30,
          description: 'Schrijf bij een bestaande prompt elk atoom expliciet uit. Welke is sterk? Welke zwak?',
          descriptionI18n: {
            en: 'Annotate each atom explicitly on an existing prompt. Which is strong? Which is weak?',
            nl: 'Schrijf bij een bestaande prompt elk atoom expliciet uit. Welke is sterk? Welke zwak?',
            fr: 'Annotez explicitement chaque atome sur un prompt existant. Lequel est fort ? Lequel faible ?',
          },
          content: `# Lab — Atom Annotation

**Duur: 30 minuten**

Kies 1 prompt uit je Pentagon Scan van Dag 1. Annoteer elk atoom expliciet:

## Opdracht

Voor de gekozen prompt, schrijf uit:
- **ROL:** wat staat er letterlijk? Is dit specifiek of generiek?
- **CONTEXT:** welke soorten context (tech / domein / team / situatie)?
- **TAAK:** specifiek, meetbaar, afgebakend?
- **FORMAT:** expliciet opgegeven of impliciet?
- **CONSTRAINTS:** welke grenzen staan er? Welke ontbreken (vooral Worldline-specifiek)?

Voor elk atoom: score 0-2 (0=afwezig · 1=aanwezig maar zwak · 2=expliciet + sterk).

**Deliverable:** Annotatie-tabel met scores per atoom + 3 concrete verbeterpunten.`,
          contentI18n: {
            en: `# Lab — Atom Annotation

**Duration: 30 minutes**

Pick 1 prompt from your Day 1 Pentagon Scan. Annotate each atom explicitly:

## Task

For the chosen prompt, write out:
- **ROLE:** what's literally there? Specific or generic?
- **CONTEXT:** which kinds (tech / domain / team / situation)?
- **TASK:** specific, measurable, scoped?
- **FORMAT:** explicit or implicit?
- **CONSTRAINTS:** which limits? Which missing (especially Worldline-specific)?

Per atom: score 0-2 (0=absent · 1=present but weak · 2=explicit + strong).

**Deliverable:** Annotation table with scores per atom + 3 concrete improvements.`,
            nl: `# Lab — Atom Annotation

**Duur: 30 minuten**

Kies 1 prompt uit je Pentagon Scan van Dag 1. Annoteer elk atoom expliciet:

## Opdracht

Voor de gekozen prompt, schrijf uit:
- **ROL:** wat staat er letterlijk? Is dit specifiek of generiek?
- **CONTEXT:** welke soorten context (tech / domein / team / situatie)?
- **TAAK:** specifiek, meetbaar, afgebakend?
- **FORMAT:** expliciet opgegeven of impliciet?
- **CONSTRAINTS:** welke grenzen staan er? Welke ontbreken (vooral Worldline-specifiek)?

Voor elk atoom: score 0-2 (0=afwezig · 1=aanwezig maar zwak · 2=expliciet + sterk).

**Deliverable:** Annotatie-tabel met scores per atoom + 3 concrete verbeterpunten.`,
            fr: `# Lab — Annotation d'atomes

**Durée : 30 minutes**

Choisissez 1 prompt de votre Scan Pentagon du Jour 1. Annotez chaque atome explicitement :

## Tâche

Pour le prompt choisi, explicitez :
- **RÔLE :** qu'y a-t-il littéralement ? Spécifique ou générique ?
- **CONTEXT :** quels types (tech / domaine / équipe / situation) ?
- **TÂCHE :** spécifique, mesurable, bornée ?
- **FORMAT :** explicite ou implicite ?
- **CONSTRAINTS :** quelles limites ? Lesquelles manquent (surtout Worldline) ?

Par atome : score 0-2 (0=absent · 1=présent mais faible · 2=explicite + fort).

**Livrable :** Tableau d'annotation avec scores + 3 améliorations concrètes.`,
          },
          exercises: [
            {
              id: 'w1d2-ex1',
              title: 'Atom Annotation Tabel',
              titleI18n: {
                en: 'Atom Annotation Table',
                nl: 'Atom Annotation Tabel',
                fr: 'Tableau d\'annotation d\'atomes',
              },
              instructions: 'Score elke atoom 0/1/2 op je gekozen prompt. Schrijf bij elke atoom één zin rationale. Lever 3 concrete verbeterpunten.',
              instructionsI18n: {
                en: 'Score each atom 0/1/2 on your chosen prompt. One sentence rationale per atom. Deliver 3 concrete improvements.',
                nl: 'Score elke atoom 0/1/2 op je gekozen prompt. Schrijf bij elke atoom één zin rationale. Lever 3 concrete verbeterpunten.',
                fr: 'Notez chaque atome 0/1/2 sur le prompt choisi. Une phrase de justification par atome. Livrez 3 améliorations concrètes.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 3: Les 2.3 + Role Tracks (Pentagon Challenge) ─────
    {
      day: 3,
      title: 'Les 2.3 — Before vs After',
      titleI18n: {
        en: 'Lesson 2.3 — Before vs After',
        nl: 'Les 2.3 — Before vs After',
        fr: 'Leçon 2.3 — Before vs After',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w1d3-theory',
          title: 'Les 2.3 — Before vs After: Het Verschil Zien',
          titleI18n: {
            en: 'Lesson 2.3 — Before vs After: See the Difference',
            nl: 'Les 2.3 — Before vs After: Het Verschil Zien',
            fr: 'Leçon 2.3 — Before vs After : voir la différence',
          },
          type: 'theory',
          duration: 15,
          description: '2 cases (code review + user story) — zonder Pentagon vs met Pentagon, zij-aan-zij',
          descriptionI18n: {
            en: '2 cases (code review + user story) — without Pentagon vs with Pentagon, side by side',
            nl: '2 cases (code review + user story) — zonder Pentagon vs met Pentagon, zij-aan-zij',
            fr: '2 cas (revue code + user story) — sans Pentagon vs avec Pentagon, côte à côte',
          },
          content: LESSON_2_3_NL,
          contentI18n: { en: LESSON_2_3_EN, nl: LESSON_2_3_NL, fr: LESSON_2_3_FR },
        },
        {
          id: 'w1d3-lab',
          title: 'Lab — 6 Rol-opdrachten "De Pentagon Challenge"',
          titleI18n: {
            en: 'Lab — 6 Role Tracks "The Pentagon Challenge"',
            nl: 'Lab — 6 Rol-opdrachten "De Pentagon Challenge"',
            fr: 'Lab — 6 Tracks rôle « La Pentagon Challenge »',
          },
          type: 'lab',
          duration: 60,
          description: 'Kies 1 rol-opdracht (Backend/Frontend/QA/PM-UX/Manager/Advanced) en lever deliverable',
          descriptionI18n: {
            en: 'Pick 1 role track (Backend/Frontend/QA/PM-UX/Manager/Advanced) and deliver outcome',
            nl: 'Kies 1 rol-opdracht (Backend/Frontend/QA/PM-UX/Manager/Advanced) en lever deliverable',
            fr: 'Choisissez 1 track rôle (Backend/Frontend/QA/PM-UX/Manager/Advanced) et livrez le résultat',
          },
          content: ROLE_TRACKS_NL,
          contentI18n: { en: ROLE_TRACKS_EN, nl: ROLE_TRACKS_NL, fr: ROLE_TRACKS_FR },
          exercises: [
            {
              id: 'w1d3-ex1',
              title: 'Rol-specifieke Pentagon-opdracht',
              titleI18n: {
                en: 'Role-specific Pentagon task',
                nl: 'Rol-specifieke Pentagon-opdracht',
                fr: 'Tâche Pentagon spécifique au rôle',
              },
              instructions: 'Kies de opdracht passend bij je rol. Duur 45-60 min. Deliverable: de Pentagon-prompt + gegenereerde output + review. Badge: output haalt rol-specifieke criteria.',
              instructionsI18n: {
                en: 'Pick the task matching your role. 45-60 min. Deliverable: Pentagon prompt + generated output + review. Badge: output meets role-specific criteria.',
                nl: 'Kies de opdracht passend bij je rol. Duur 45-60 min. Deliverable: de Pentagon-prompt + gegenereerde output + review. Badge: output haalt rol-specifieke criteria.',
                fr: 'Choisissez la tâche correspondant à votre rôle. 45-60 min. Livrable : prompt Pentagon + sortie générée + revue. Badge : la sortie atteint les critères du rôle.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 4: Les 2.4 + Lab 2A Before/After Challenge ─────
    {
      day: 4,
      title: 'Les 2.4 — Anti-Patterns',
      titleI18n: {
        en: 'Lesson 2.4 — Anti-Patterns',
        nl: 'Les 2.4 — Anti-Patterns',
        fr: 'Leçon 2.4 — Anti-patterns',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w1d4-theory',
          title: 'Les 2.4 — Anti-Patterns: Wat Gaat Er Mis',
          titleI18n: {
            en: 'Lesson 2.4 — Anti-Patterns: What Goes Wrong',
            nl: 'Les 2.4 — Anti-Patterns: Wat Gaat Er Mis',
            fr: 'Leçon 2.4 — Anti-patterns : ce qui va de travers',
          },
          type: 'theory',
          duration: 15,
          description: '4 anti-patterns — Blob · Rolloze · Context Dump · Wensdenker',
          descriptionI18n: {
            en: '4 anti-patterns — Blob · Role-less · Context Dump · Wishful Thinker',
            nl: '4 anti-patterns — Blob · Rolloze · Context Dump · Wensdenker',
            fr: '4 anti-patterns — Blob · Sans Rôle · Context Dump · Penseur de Souhaits',
          },
          content: LESSON_2_4_NL,
          contentI18n: { en: LESSON_2_4_EN, nl: LESSON_2_4_NL, fr: LESSON_2_4_FR },
        },
        {
          id: 'w1d4-lab',
          title: 'Lab 2A — Before/After Challenge',
          titleI18n: {
            en: 'Lab 2A — Before/After Challenge',
            nl: 'Lab 2A — Before/After Challenge',
            fr: 'Lab 2A — Before/After Challenge',
          },
          type: 'lab',
          duration: 30,
          description: 'Herschrijf je Level 1 prompt met Pentagon en vergelijk outputs',
          descriptionI18n: {
            en: 'Rewrite your Level 1 prompt with Pentagon and compare outputs',
            nl: 'Herschrijf je Level 1 prompt met Pentagon en vergelijk outputs',
            fr: 'Réécrivez votre prompt Level 1 avec Pentagon et comparez les sorties',
          },
          content: LAB_2A_NL,
          contentI18n: { en: LAB_2A_EN, nl: LAB_2A_NL, fr: LAB_2A_FR },
          exercises: [
            {
              id: 'w1d4-ex1',
              title: 'Before/After prompt + reflectie',
              titleI18n: {
                en: 'Before/After prompt + reflection',
                nl: 'Before/After prompt + reflectie',
                fr: 'Prompt Before/After + réflexion',
              },
              instructions: 'Lever je before-prompt (Level 1), after-prompt (Pentagon), beide outputs, en 1-alinea reflectie: welke atoom maakte het grootste verschil?',
              instructionsI18n: {
                en: 'Deliver your before prompt (Level 1), after prompt (Pentagon), both outputs, and a 1-paragraph reflection: which atom made the biggest difference?',
                nl: 'Lever je before-prompt (Level 1), after-prompt (Pentagon), beide outputs, en 1-alinea reflectie: welke atoom maakte het grootste verschil?',
                fr: 'Livrez votre prompt before (Level 1), after (Pentagon), les deux sorties, et une réflexion d\'un paragraphe : quel atome a fait la plus grande différence ?',
              },
              type: 'prompt-craft',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 5: Les 2.5 + Lab 2B Template Builder ─────
    {
      day: 5,
      title: 'Les 2.5 — Instant Fix Toolkit',
      titleI18n: {
        en: 'Lesson 2.5 — Instant Fix Toolkit',
        nl: 'Les 2.5 — Instant Fix Toolkit',
        fr: 'Leçon 2.5 — Toolkit Instant Fix',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w1d5-theory',
          title: 'Les 2.5 — De Instant Fix Toolkit',
          titleI18n: {
            en: 'Lesson 2.5 — The Instant Fix Toolkit',
            nl: 'Les 2.5 — De Instant Fix Toolkit',
            fr: 'Leçon 2.5 — La Toolkit Instant Fix',
          },
          type: 'theory',
          duration: 15,
          description: '6 fixes — ROL · voorbeeld · scope · stap-voor-stap · wat NIET · itereer',
          descriptionI18n: {
            en: '6 fixes — ROLE · example · scope · step-by-step · what NOT · iterate',
            nl: '6 fixes — ROL · voorbeeld · scope · stap-voor-stap · wat NIET · itereer',
            fr: '6 fixes — RÔLE · exemple · portée · pas-à-pas · ce qui est INTERDIT · itérer',
          },
          content: LESSON_2_5_NL,
          contentI18n: { en: LESSON_2_5_EN, nl: LESSON_2_5_NL, fr: LESSON_2_5_FR },
        },
        {
          id: 'w1d5-lab',
          title: 'Lab 2B — Pentagon Template Builder',
          titleI18n: {
            en: 'Lab 2B — Pentagon Template Builder',
            nl: 'Lab 2B — Pentagon Template Builder',
            fr: 'Lab 2B — Pentagon Template Builder',
          },
          type: 'lab',
          duration: 45,
          description: 'Bouw 3 herbruikbare Pentagon-templates voor je dagelijks werk (prompt-templates.md)',
          descriptionI18n: {
            en: 'Build 3 reusable Pentagon templates for your daily work (prompt-templates.md)',
            nl: 'Bouw 3 herbruikbare Pentagon-templates voor je dagelijks werk (prompt-templates.md)',
            fr: 'Construisez 3 templates Pentagon réutilisables pour le quotidien (prompt-templates.md)',
          },
          content: LAB_2B_NL,
          contentI18n: { en: LAB_2B_EN, nl: LAB_2B_NL, fr: LAB_2B_FR },
          exercises: [
            {
              id: 'w1d5-ex1',
              title: 'prompt-templates.md met 3 werkende templates',
              titleI18n: {
                en: 'prompt-templates.md with 3 working templates',
                nl: 'prompt-templates.md met 3 werkende templates',
                fr: 'prompt-templates.md avec 3 templates fonctionnels',
              },
              instructions: 'Lever een prompt-templates.md met 3 templates. Per template: TEMPLATE/WANNEER/ROL/CONTEXT/TAAK/FORMAT/CONSTRAINTS + 1 voorbeeld-output. Badge: elke template is direct bruikbaar op echte werk-taken.',
              instructionsI18n: {
                en: 'Deliver a prompt-templates.md with 3 templates. Per template: TEMPLATE/WHEN/ROLE/CONTEXT/TASK/FORMAT/CONSTRAINTS + 1 example output. Badge: each template is directly usable on real work tasks.',
                nl: 'Lever een prompt-templates.md met 3 templates. Per template: TEMPLATE/WANNEER/ROL/CONTEXT/TAAK/FORMAT/CONSTRAINTS + 1 voorbeeld-output. Badge: elke template is direct bruikbaar op echte werk-taken.',
                fr: 'Livrez un prompt-templates.md avec 3 templates. Par template : TEMPLATE/QUAND/RÔLE/CONTEXT/TÂCHE/FORMAT/CONSTRAINTS + 1 exemple de sortie. Badge : chaque template est directement utilisable sur des tâches réelles.',
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
