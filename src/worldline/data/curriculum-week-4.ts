// ─────────────────────────────────────────────────────────────────────────────
// WEEK 4 / LEVEL 5 — Specification Engineering (Cons & Nina v1.0)
// Source: docs/levels/level-5/source.md (Cons & Nina v1.0, 20 apr 2026)
//
// Structuur v1.0:
//   Dag 1: Les 5.1 Van Vaag naar Exact                  + Lab 5A Pain Lab: Spec-loze Output
//   Dag 2: Les 5.2 GIVEN/WHEN/THEN voor Prompts         + Lab — scenario-set schrijven
//   Dag 3: Les 5.3 AI Output Testen: Trust but Verify   + Lab 5B Full Stack Feature (4 Disciplines)
//   Dag 4: Les 5.4 De 4 Disciplines Gecombineerd        + Lab — integrated workflow
//   Dag 5: Les 5.5 AI Testing voor QA Professionals     + Lab — Builder Challenge Finale
// ─────────────────────────────────────────────────────────────────────────────

import type { CurriculumWeek } from './curriculum';
import { dailySchedule } from './curriculum-schedule';

// ─── LES 5.1 — Van Vaag naar Exact ───────────────────────────────────────────

const LESSON_5_1_NL = `# Les 5.1 — Van Vaag naar Exact

## Het Probleem

Je hebt nu vier levels achter de rug. Je schrijft een perfecte Pentagon-prompt, met rijke context, een heldere Goal Hierarchy, en expliciete trade-offs.

De AI genereert code.

En dan? **Hoe weet je of het correct is?**

Je kijkt ernaar. Je denkt "ja, dit ziet er goed uit." Je runt het. Het compileert. Tests? Eh, later.

Dit is hoe bugs naar productie gaan.

Specification Engineering lost dit op. Niet door meer te prompten — maar door je prompt zo te schrijven dat de output **testbaar en voorspelbaar** is.

## Het Verschil

**Zonder spec:**
> "Bouw een StudentDashboard component."

→ De AI maakt iets. Het compileert. Het toont data. Maar: klopt de progress berekening? Werkt het met 0 lessen? Wat als de user geen squad heeft? Niemand weet het — tot een gebruiker het vindt.

**Met spec:**
> "Bouw een StudentDashboard component.
>
> GIVEN: een user met 5 lessen waarvan 3 completed
> WHEN: het dashboard rendert
> THEN: progress bar toont 60%
>
> GIVEN: een user met 0 lessen
> WHEN: het dashboard rendert
> THEN: toon placeholder 'Nog geen lessen beschikbaar'
>
> GIVEN: een user waarvan alle lessen completed
> WHEN: het dashboard rendert
> THEN: toon 'Gefeliciteerd!' met confetti animatie"

Nu weet je precies wat je checkt. De AI weet precies wat het moet bouwen. En als het niet klopt, weet je precies waar het fout zit.

## Waarom Specs Je Tijd Besparen

Het voelt als extra werk. Specs schrijven voordat je bouwt — wie heeft daar tijd voor?

Jij. Want **zonder specs**:
- 3-5 iteraties om de output goed te krijgen
- Elke iteratie: 10-20 minuten
- Totaal: 30-100 minuten

**Met specs:**
- 5 minuten spec schrijven
- 1-2 iteraties (want de output is direct beter)
- Totaal: 15-25 minuten

De wiskunde is simpel. Specs besparen netto 15-75 minuten per feature. Per dag. Elke dag.

## De Twee Dimensies van Specificatie

Een goede spec heeft twee dimensies:

- **Functioneel:** WAT moet de output doen?
  → GIVEN/WHEN/THEN scenarios, edge cases, happy paths

- **Kwaliteit:** HOE GOED moet de output zijn?
  → Acceptance criteria, performance eisen, compliance vereisten

Level 5 behandelt beide.`;

const LESSON_5_1_EN = `# Lesson 5.1 — From Vague to Exact

## The Problem

You now have four levels behind you. You write a perfect Pentagon prompt, with rich context, a clear Goal Hierarchy, and explicit trade-offs.

The AI generates code.

And then? **How do you know it is correct?**

You look at it. You think "yes, this looks good." You run it. It compiles. Tests? Uh, later.

This is how bugs reach production.

Specification Engineering solves this. Not by prompting more — but by writing your prompt so the output is **testable and predictable**.

## The Difference

**Without spec:**
> "Build a StudentDashboard component."

→ The AI makes something. It compiles. It shows data. But: is the progress calculation correct? Does it work with 0 lessons? What if the user has no squad? Nobody knows — until a user finds out.

**With spec:**
> "Build a StudentDashboard component.
>
> GIVEN: a user with 5 lessons of which 3 completed
> WHEN: the dashboard renders
> THEN: progress bar shows 60%
>
> GIVEN: a user with 0 lessons
> WHEN: the dashboard renders
> THEN: show placeholder 'No lessons available yet'
>
> GIVEN: a user with all lessons completed
> WHEN: the dashboard renders
> THEN: show 'Congratulations!' with confetti animation"

Now you know exactly what you check. The AI knows exactly what to build. And if something is off, you know exactly where.

## Why Specs Save You Time

It feels like extra work. Writing specs before building — who has time for that?

You. Because **without specs**:
- 3-5 iterations to get output right
- Each iteration: 10-20 minutes
- Total: 30-100 minutes

**With specs:**
- 5 minutes writing the spec
- 1-2 iterations (because output is immediately better)
- Total: 15-25 minutes

The math is simple. Specs save 15-75 minutes per feature. Per day. Every day.

## The Two Dimensions of Specification

A good spec has two dimensions:

- **Functional:** WHAT must the output do?
  → GIVEN/WHEN/THEN scenarios, edge cases, happy paths

- **Quality:** HOW GOOD must the output be?
  → Acceptance criteria, performance requirements, compliance requirements

Level 5 covers both.`;

const LESSON_5_1_FR = `# Leçon 5.1 — Du Vague à l'Exact

## Le Problème

Vous avez maintenant quatre niveaux derrière vous. Vous écrivez un prompt Pentagon parfait, avec du contexte riche, une Goal Hierarchy claire, et des trade-offs explicites.

L'IA génère du code.

Et ensuite ? **Comment savez-vous que c'est correct ?**

Vous le regardez. Vous pensez "oui, ça a l'air bien." Vous le lancez. Ça compile. Les tests ? Plus tard.

C'est comme ça que les bugs arrivent en production.

Specification Engineering résout ce problème. Pas en promptant plus — mais en écrivant votre prompt pour que la sortie soit **testable et prévisible**.

## La Différence

**Sans spec :**
> "Construisez un composant StudentDashboard."

→ L'IA fait quelque chose. Ça compile. Ça montre des données. Mais : le calcul de progression est-il correct ? Fonctionne-t-il avec 0 leçon ? Et si l'utilisateur n'a pas de squad ? Personne ne le sait — jusqu'à ce qu'un utilisateur le trouve.

**Avec spec :**
> "Construisez un composant StudentDashboard.
>
> GIVEN : un utilisateur avec 5 leçons dont 3 complétées
> WHEN : le dashboard s'affiche
> THEN : la barre de progression montre 60%
>
> GIVEN : un utilisateur avec 0 leçon
> WHEN : le dashboard s'affiche
> THEN : montrer placeholder 'Aucune leçon disponible'
>
> GIVEN : un utilisateur avec toutes les leçons complétées
> WHEN : le dashboard s'affiche
> THEN : montrer 'Félicitations !' avec animation de confettis"

Maintenant vous savez exactement ce que vous vérifiez. L'IA sait exactement ce qu'elle doit construire. Et si quelque chose cloche, vous savez exactement où.

## Pourquoi les Specs Vous Font Gagner du Temps

Ça ressemble à du travail supplémentaire. Écrire des specs avant de construire — qui a le temps pour ça ?

Vous. Parce que **sans specs** :
- 3-5 itérations pour avoir la bonne sortie
- Chaque itération : 10-20 minutes
- Total : 30-100 minutes

**Avec specs :**
- 5 minutes pour écrire la spec
- 1-2 itérations (car la sortie est immédiatement meilleure)
- Total : 15-25 minutes

Les maths sont simples. Les specs font gagner 15-75 minutes par feature. Par jour. Tous les jours.

## Les Deux Dimensions de la Spécification

Une bonne spec a deux dimensions :

- **Fonctionnel :** QUOI doit faire la sortie ?
  → Scénarios GIVEN/WHEN/THEN, edge cases, happy paths

- **Qualité :** À QUEL POINT la sortie doit-elle être bonne ?
  → Critères d'acceptation, exigences de performance, exigences de conformité

Level 5 couvre les deux.`;

// ─── LES 5.2 — GIVEN/WHEN/THEN voor Prompts ──────────────────────────────────

const LESSON_5_2_NL = `# Les 5.2 — GIVEN/WHEN/THEN voor Prompts

## Van BDD naar Prompt Engineering

GIVEN/WHEN/THEN kennen de meeste developers van BDD (Behavior-Driven Development). Testers gebruiken het al jaren voor test-specificaties. Het briljante inzicht: **het werkt net zo goed voor AI-prompts.**

- **GIVEN** — de beginsituatie
- **WHEN** — de actie of trigger
- **THEN** — het verwachte resultaat

Dat is alles. Drie woorden. En ze veranderen de kwaliteit van je AI-output fundamenteel.

## Een Worldline Voorbeeld

Stel je bouwt een transactie-overzicht component.

**Zonder spec:**
> "Bouw een component dat transacties toont in een tabel."

**Met GIVEN/WHEN/THEN:**
> "Bouw een \`TransactionOverview\` component.
>
> **GIVEN:** een lijst van 50 transacties met status 'completed', 'pending', en 'failed'
> **WHEN:** het component rendert
> **THEN:**
>   - Toon een tabel met kolommen: Date, Merchant, Amount, Status
>   - Sorteer standaard op datum (nieuwste eerst)
>   - Status 'failed' in rood, 'pending' in oranje, 'completed' in groen
>
> **GIVEN:** een leeg transactielijst
> **WHEN:** het component rendert
> **THEN:** toon 'Geen transacties gevonden' met een refresh-knop
>
> **GIVEN:** de gebruiker klikt op een kolom-header
> **WHEN:** de tabel re-rendert
> **THEN:** sorteer op die kolom (toggle ascending/descending)
>
> **GIVEN:** meer dan 25 transacties
> **WHEN:** het component rendert
> **THEN:** toon paginering met max 25 per pagina
>
> **Edge cases:**
>   - Amount is negatief (refund) → toon met minteken en andere kleur
>   - Merchant naam is langer dan 30 chars → truncate met ellipsis
>   - Datum is vandaag → toon 'Vandaag' in plaats van de datum"

Dat is een specificatie. De AI weet precies wat je wilt. Jij weet precies wat je moet checken. En als iets niet klopt, kun je naar de specifieke GIVEN/WHEN/THEN wijzen.

## Acceptance Criteria als Prompt Section

Voeg na je GIVEN/WHEN/THEN een acceptance criteria sectie toe:

\`\`\`markdown
Acceptance Criteria:
  - [ ] Component compileert zonder TypeScript errors
  - [ ] Props interface is volledig getypeerd (geen 'any')
  - [ ] Responsive: mobile (320px) tot desktop (1440px)
  - [ ] Loading state getoond tijdens data fetch
  - [ ] Error state met retry button
  - [ ] Accessibility: alle interactieve elementen keyboard-focusbaar
  - [ ] Performance: geen unnecessary re-renders (React.memo waar nodig)
\`\`\`

Dit zijn je kwaliteitspoorten. Elke checkbox is een test. Als er eentje niet voldaan is, is de output niet klaar.

## Het Pattern

Na vier levels is het pattern:

1. **Pentagon Model** (Level 2) — WIE, WAT, HOE
2. **Context** (Level 3) — WAARMEE
3. **Intent + Goal Hierarchy** (Level 4) — WAAROM
4. **Specification** (Level 5) — WANNEER GOED GENOEG

Samen vormen ze het complete framework. Eén zonder de ander is incompleet.`;

const LESSON_5_2_EN = `# Lesson 5.2 — GIVEN/WHEN/THEN for Prompts

## From BDD to Prompt Engineering

Most developers know GIVEN/WHEN/THEN from BDD (Behavior-Driven Development). Testers have been using it for years for test specifications. The brilliant insight: **it works just as well for AI prompts.**

- **GIVEN** — the starting situation
- **WHEN** — the action or trigger
- **THEN** — the expected result

That's all. Three words. And they change the quality of your AI output fundamentally.

## A Worldline Example

Imagine you're building a transaction overview component.

**Without spec:**
> "Build a component that shows transactions in a table."

**With GIVEN/WHEN/THEN:**
> "Build a \`TransactionOverview\` component.
>
> **GIVEN:** a list of 50 transactions with status 'completed', 'pending', and 'failed'
> **WHEN:** the component renders
> **THEN:**
>   - Show a table with columns: Date, Merchant, Amount, Status
>   - Sort by date by default (newest first)
>   - Status 'failed' in red, 'pending' in orange, 'completed' in green
>
> **GIVEN:** an empty transaction list
> **WHEN:** the component renders
> **THEN:** show 'No transactions found' with a refresh button
>
> **GIVEN:** the user clicks a column header
> **WHEN:** the table re-renders
> **THEN:** sort by that column (toggle ascending/descending)
>
> **GIVEN:** more than 25 transactions
> **WHEN:** the component renders
> **THEN:** show pagination with max 25 per page
>
> **Edge cases:**
>   - Amount is negative (refund) → show with minus sign and different color
>   - Merchant name longer than 30 chars → truncate with ellipsis
>   - Date is today → show 'Today' instead of the date"

That is a specification. The AI knows exactly what you want. You know exactly what to check. And if something is off, you can point to a specific GIVEN/WHEN/THEN.

## Acceptance Criteria as Prompt Section

Add an acceptance criteria section after your GIVEN/WHEN/THEN:

\`\`\`markdown
Acceptance Criteria:
  - [ ] Component compiles without TypeScript errors
  - [ ] Props interface fully typed (no 'any')
  - [ ] Responsive: mobile (320px) to desktop (1440px)
  - [ ] Loading state shown during data fetch
  - [ ] Error state with retry button
  - [ ] Accessibility: all interactive elements keyboard-focusable
  - [ ] Performance: no unnecessary re-renders (React.memo where needed)
\`\`\`

These are your quality gates. Each checkbox is a test. If one fails, the output is not done.

## The Pattern

After four levels the pattern is:

1. **Pentagon Model** (Level 2) — WHO, WHAT, HOW
2. **Context** (Level 3) — WITH-WHAT
3. **Intent + Goal Hierarchy** (Level 4) — WHY
4. **Specification** (Level 5) — WHEN GOOD ENOUGH

Together they form the complete framework. One without the other is incomplete.`;

const LESSON_5_2_FR = `# Leçon 5.2 — GIVEN/WHEN/THEN pour les Prompts

## Du BDD au Prompt Engineering

La plupart des développeurs connaissent GIVEN/WHEN/THEN du BDD (Behavior-Driven Development). Les testeurs l'utilisent depuis des années pour les spécifications de tests. L'insight brillant : **ça marche tout aussi bien pour les prompts IA.**

- **GIVEN** — la situation de départ
- **WHEN** — l'action ou le déclencheur
- **THEN** — le résultat attendu

C'est tout. Trois mots. Et ils changent la qualité de votre sortie IA fondamentalement.

## Un Exemple Worldline

Imaginez que vous construisez un composant d'aperçu de transactions.

**Sans spec :**
> "Construisez un composant qui montre les transactions dans un tableau."

**Avec GIVEN/WHEN/THEN :**
> "Construisez un composant \`TransactionOverview\`.
>
> **GIVEN :** une liste de 50 transactions avec statut 'completed', 'pending', et 'failed'
> **WHEN :** le composant s'affiche
> **THEN :**
>   - Montrer un tableau avec colonnes : Date, Merchant, Amount, Status
>   - Trier par date par défaut (le plus récent d'abord)
>   - Statut 'failed' en rouge, 'pending' en orange, 'completed' en vert
>
> **GIVEN :** une liste de transactions vide
> **WHEN :** le composant s'affiche
> **THEN :** montrer 'Aucune transaction trouvée' avec bouton refresh
>
> **GIVEN :** l'utilisateur clique sur un en-tête de colonne
> **WHEN :** le tableau s'actualise
> **THEN :** trier par cette colonne (toggle ascending/descending)
>
> **GIVEN :** plus de 25 transactions
> **WHEN :** le composant s'affiche
> **THEN :** montrer pagination avec max 25 par page
>
> **Edge cases :**
>   - Amount négatif (refund) → montrer avec signe moins et autre couleur
>   - Nom Merchant plus de 30 chars → truncate avec ellipsis
>   - Date est aujourd'hui → montrer 'Aujourd'hui' au lieu de la date"

Ça c'est une spécification. L'IA sait exactement ce que vous voulez. Vous savez exactement ce qu'il faut vérifier. Et si quelque chose cloche, vous pouvez pointer le GIVEN/WHEN/THEN spécifique.

## Critères d'Acceptation comme Section du Prompt

Ajoutez une section de critères d'acceptation après votre GIVEN/WHEN/THEN :

\`\`\`markdown
Critères d'acceptation :
  - [ ] Le composant compile sans erreurs TypeScript
  - [ ] Interface props entièrement typée (pas de 'any')
  - [ ] Responsive : mobile (320px) à desktop (1440px)
  - [ ] État de chargement affiché pendant le fetch
  - [ ] État d'erreur avec bouton retry
  - [ ] Accessibilité : tous les éléments interactifs focusables au clavier
  - [ ] Performance : pas de re-renders inutiles (React.memo si nécessaire)
\`\`\`

Ce sont vos quality gates. Chaque checkbox est un test. Si un échoue, la sortie n'est pas prête.

## Le Pattern

Après quatre niveaux le pattern est :

1. **Pentagon Model** (Level 2) — QUI, QUOI, COMMENT
2. **Context** (Level 3) — AVEC-QUOI
3. **Intent + Goal Hierarchy** (Level 4) — POURQUOI
4. **Specification** (Level 5) — QUAND ASSEZ BIEN

Ensemble ils forment le framework complet. L'un sans l'autre est incomplet.`;

// ─── LES 5.3 — AI Output Testen: Trust but Verify ────────────────────────────

const LESSON_5_3_NL = `# Les 5.3 — AI Output Testen: Trust but Verify

## De Gouden Regel

**Never trust AI output blindly. Always verify.**

Maar — en dit is belangrijk — verificatie hoeft niet handmatig te zijn. Je kunt AI gebruiken om AI te testen.

## De AI Test Piramide

Stel je een piramide voor. Onderaan de goedkoopste, snelste tests. Bovenaan de duurste, maar meest waardevolle.

**Laag 1: TypeScript Compiler** (gratis)

\`strict: true\` in je \`tsconfig.json\` is je eerste verdedigingslinie. AI-gegenereerde code met type errors faalt direct. Geen handmatig werk nodig.

Dit vangt **~60% van de fouten**. Gratis. Automatisch. Altijd aan.

**Laag 2: Unit Tests** (bijna gratis)

Vraag Claude om tests te schrijven **voordat** het de implementatie schrijft:

> "Schrijf eerst Vitest unit tests voor de volgende specificatie:
> [jouw GIVEN/WHEN/THEN specs]
> Schrijf daarna de implementatie die alle tests laat slagen."

Test-first met AI is krachtiger dan test-after. Waarom? Omdat de tests de specificatie bevatten. De implementatie moet eraan voldoen. Als de tests falen, is de implementatie fout — niet de tests.

Dit vangt nog eens **~25% van de fouten**.

**Laag 3: Integration Tests** (low effort)

Playwright voor UI, Vitest voor API endpoints. Automatiseerbaar, herhaalbaar.

> "Genereer een Playwright test die:
> 1. Het TransactionOverview component laadt
> 2. Checkt dat de tabel 25 rijen toont
> 3. Klikt op de 'Amount' kolom-header
> 4. Verifieert dat de sortering is gewijzigd
> 5. Navigeert naar pagina 2
> 6. Verifieert dat er 25 nieuwe rijen staan"

**Laag 4: Manual Review** (duur maar noodzakelijk)

De resterende **~15%** vereist menselijk oordeel. Architectuurbeslissingen, security implicaties, performance impact — dit kun je (nog) niet volledig automatiseren.

Maar: door de onderste 3 lagen te automatiseren, heb je meer tijd voor deze 15%. Dat is de winst.

## De RALF Loop als Kwaliteitspoort

Na elke AI-generatie:

- **Review** — compileert het? Passeren de tests? Volgt het je GIVEN/WHEN/THEN?
- **Analyze** — zijn er security issues? Performance problemen? PCI-implicaties?
- **Learn** — wat kan ik beter specificeren volgende keer? Welke spec miste ik?
- **Fix** — itereer tot alle acceptance criteria groen zijn

Dit is niet één keer doen en klaar. Dit is een **loop**. Elke iteratie maakt je specificaties scherper, je tests completer, en je output betrouwbaarder.

## Test-Driven AI Development

De meest effectieve workflow die we bij Worldline hebben gezien:

1. Schrijf de GIVEN/WHEN/THEN spec (5 min)
2. Laat Claude de tests genereren op basis van de spec (2 min)
3. Laat Claude de implementatie schrijven die de tests moet halen (5 min)
4. Run de tests (1 min)
5. Als tests falen: laat Claude de implementatie fixen op basis van de test output (2-5 min)

**Totale tijd: 15-18 minuten voor een geteste, gespecificeerde feature.**

Vergelijk dat met: code schrijven (20 min) + debuggen (30 min) + achteraf tests toevoegen (20 min) + bugs fixen die tests blootleggen (20 min) = 90 minuten.

**5x sneller. Beter getest. Beter gedocumenteerd.**`;

const LESSON_5_3_EN = `# Lesson 5.3 — Testing AI Output: Trust but Verify

## The Golden Rule

**Never trust AI output blindly. Always verify.**

But — and this is important — verification does not have to be manual. You can use AI to test AI.

## The AI Test Pyramid

Picture a pyramid. At the bottom the cheapest, fastest tests. At the top the most expensive but most valuable.

**Layer 1: TypeScript Compiler** (free)

\`strict: true\` in your \`tsconfig.json\` is your first line of defence. AI-generated code with type errors fails immediately. No manual work needed.

This catches **~60% of errors**. Free. Automatic. Always on.

**Layer 2: Unit Tests** (almost free)

Ask Claude to write tests **before** it writes the implementation:

> "First write Vitest unit tests for the following specification:
> [your GIVEN/WHEN/THEN specs]
> Then write the implementation that makes all tests pass."

Test-first with AI is more powerful than test-after. Why? Because the tests contain the specification. The implementation must match. If tests fail, the implementation is wrong — not the tests.

This catches another **~25% of errors**.

**Layer 3: Integration Tests** (low effort)

Playwright for UI, Vitest for API endpoints. Automatable, repeatable.

> "Generate a Playwright test that:
> 1. Loads the TransactionOverview component
> 2. Checks the table shows 25 rows
> 3. Clicks the 'Amount' column header
> 4. Verifies sort order changed
> 5. Navigates to page 2
> 6. Verifies 25 new rows are shown"

**Layer 4: Manual Review** (expensive but necessary)

The remaining **~15%** requires human judgement. Architecture decisions, security implications, performance impact — these you cannot (yet) fully automate.

But: by automating the bottom 3 layers, you have more time for this 15%. That is the win.

## The RALF Loop as Quality Gate

After every AI generation:

- **Review** — does it compile? Do tests pass? Does it follow your GIVEN/WHEN/THEN?
- **Analyze** — are there security issues? Performance problems? PCI implications?
- **Learn** — what can I specify better next time? Which spec did I miss?
- **Fix** — iterate until all acceptance criteria are green

This is not once-and-done. This is a **loop**. Each iteration makes your specifications sharper, your tests more complete, and your output more reliable.

## Test-Driven AI Development

The most effective workflow we've seen at Worldline:

1. Write the GIVEN/WHEN/THEN spec (5 min)
2. Let Claude generate tests from the spec (2 min)
3. Let Claude write the implementation that must pass the tests (5 min)
4. Run the tests (1 min)
5. If tests fail: let Claude fix the implementation based on test output (2-5 min)

**Total time: 15-18 minutes for a tested, specified feature.**

Compare that to: writing code (20 min) + debugging (30 min) + adding tests afterwards (20 min) + fixing bugs revealed by tests (20 min) = 90 minutes.

**5x faster. Better tested. Better documented.**`;

const LESSON_5_3_FR = `# Leçon 5.3 — Tester la Sortie IA : Trust but Verify

## La Règle d'Or

**Never trust AI output blindly. Always verify.**

Mais — et c'est important — la vérification n'a pas à être manuelle. Vous pouvez utiliser l'IA pour tester l'IA.

## La Pyramide des Tests IA

Imaginez une pyramide. En bas les tests les moins chers, les plus rapides. En haut les plus chers mais les plus précieux.

**Couche 1 : Compilateur TypeScript** (gratuit)

\`strict: true\` dans votre \`tsconfig.json\` est votre première ligne de défense. Le code généré par IA avec erreurs de type échoue immédiatement. Aucun travail manuel nécessaire.

Cela attrape **~60% des erreurs**. Gratuit. Automatique. Toujours activé.

**Couche 2 : Tests Unitaires** (presque gratuit)

Demandez à Claude d'écrire les tests **avant** qu'il n'écrive l'implémentation :

> "Écrivez d'abord des tests Vitest unitaires pour la spécification suivante :
> [vos specs GIVEN/WHEN/THEN]
> Ensuite écrivez l'implémentation qui fait passer tous les tests."

Test-first avec IA est plus puissant que test-after. Pourquoi ? Parce que les tests contiennent la spécification. L'implémentation doit correspondre. Si les tests échouent, l'implémentation est fausse — pas les tests.

Cela attrape encore **~25% des erreurs**.

**Couche 3 : Tests d'Intégration** (low effort)

Playwright pour l'UI, Vitest pour les endpoints API. Automatisable, reproductible.

> "Générez un test Playwright qui :
> 1. Charge le composant TransactionOverview
> 2. Vérifie que le tableau montre 25 lignes
> 3. Clique sur l'en-tête de colonne 'Amount'
> 4. Vérifie que l'ordre de tri a changé
> 5. Navigue vers la page 2
> 6. Vérifie que 25 nouvelles lignes s'affichent"

**Couche 4 : Revue Manuelle** (chère mais nécessaire)

Les **~15%** restants nécessitent du jugement humain. Décisions d'architecture, implications de sécurité, impact performance — vous ne pouvez pas (encore) entièrement automatiser ça.

Mais : en automatisant les 3 couches du bas, vous avez plus de temps pour ces 15%. C'est le gain.

## La RALF Loop comme Quality Gate

Après chaque génération IA :

- **Review** — compile-t-il ? Les tests passent-ils ? Suit-il votre GIVEN/WHEN/THEN ?
- **Analyze** — y a-t-il des problèmes de sécurité ? Performance ? Implications PCI ?
- **Learn** — que puis-je mieux spécifier la prochaine fois ? Quelle spec ai-je ratée ?
- **Fix** — itérer jusqu'à ce que tous les critères d'acceptation soient verts

Ce n'est pas one-and-done. C'est une **boucle**. Chaque itération rend vos spécifications plus nettes, vos tests plus complets, et votre sortie plus fiable.

## Test-Driven AI Development

Le workflow le plus efficace que nous avons vu chez Worldline :

1. Écrire la spec GIVEN/WHEN/THEN (5 min)
2. Laisser Claude générer les tests depuis la spec (2 min)
3. Laisser Claude écrire l'implémentation qui doit passer les tests (5 min)
4. Lancer les tests (1 min)
5. Si les tests échouent : laisser Claude corriger l'implémentation selon la sortie des tests (2-5 min)

**Temps total : 15-18 minutes pour une feature testée et spécifiée.**

Comparez avec : écrire le code (20 min) + debug (30 min) + ajouter des tests après (20 min) + corriger les bugs révélés (20 min) = 90 minutes.

**5x plus rapide. Mieux testé. Mieux documenté.**`;

// ─── LES 5.4 — De 4 Disciplines Gecombineerd ─────────────────────────────────

const LESSON_5_4_NL = `# Les 5.4 — De 4 Disciplines Gecombineerd

## Het Complete Framework

Na 5 levels beheers je vier disciplines:

1. **Prompt Craft** — Het Pentagon Model (WAT je vraagt)
2. **Context Engineering** — De juiste informatie laden (WAAR het over gaat)
3. **Intent Engineering** — Het waarom communiceren (WAAROM je het vraagt)
4. **Specification Engineering** — Testbare output definiëren (HOE je het verifieert)

Elke discipline bouwt voort op de vorige. Geen ervan is optioneel als je consistente, productiewaardige output wilt.

## De Integrated Workflow

In de praktijk ziet het er zo uit:

**Stap 1: Intent** (2 min)
Definieer de Goal Hierarchy: Mission, Objective, Goal, Tasks, Constraints. Benoem de trade-offs. Beantwoord de 3 Intent Safety vragen.

**Stap 2: Context** (1 min)
Check: is je CLAUDE.md actueel? @-mention de relevante bestanden. Laad de juiste MCP servers (als beschikbaar).

**Stap 3: Prompt** (3 min)
Pentagon Model: Role, Context, Goal, Constraints, Output Format. Voeg je intent toe als aanvullende context.

**Stap 4: Specification** (3 min)
Schrijf GIVEN/WHEN/THEN scenarios (minimaal 3 — happy path + 2 edge cases). Definieer acceptance criteria (minimaal 5).

**Stap 5: Execute & Verify** (15-30 min)
Run de prompt. Check tegen je specs. RALF loop: Review, Analyze, Learn, Fix. Itereer tot alle acceptance criteria groen zijn.

## De Tijdsinvestering

Totale overhead: ~9 minuten prep voor 15-30 minuten uitvoering.

**ROI:** 9 minuten investering bespaart gemiddeld 2-3 iteratiecycli. Elke iteratiecyclus kost 15-30 minuten. Netto tijdsbesparing: **30-80 minuten per feature**.

Na 3 maanden is dit tweede natuur. Je denkt niet meer "ik moet een spec schrijven" — je denkt gewoon in specs. Net als je niet meer nadenkt over git add/commit/push — het zit in je vingers.

## De Feedback Loop

Elke keer dat je dit framework toepast:
- Je prompts worden beter (muscle memory)
- Je context wordt completer (CLAUDE.md groeit)
- Je specs worden preciezer (patronen herkennen)
- Je verificatie wordt sneller (tooling verbetert)

Dit is **compounding**. Week 1 kost het moeite. Week 4 gaat het vanzelf. Week 8 vraag je je af hoe je ooit zonder werkte.`;

const LESSON_5_4_EN = `# Lesson 5.4 — The 4 Disciplines Combined

## The Complete Framework

After 5 levels you master four disciplines:

1. **Prompt Craft** — The Pentagon Model (WHAT you ask)
2. **Context Engineering** — Loading the right information (WHERE it's about)
3. **Intent Engineering** — Communicating the why (WHY you ask)
4. **Specification Engineering** — Defining testable output (HOW you verify)

Each discipline builds on the previous. None is optional if you want consistent, production-grade output.

## The Integrated Workflow

In practice it looks like this:

**Step 1: Intent** (2 min)
Define the Goal Hierarchy: Mission, Objective, Goal, Tasks, Constraints. Name the trade-offs. Answer the 3 Intent Safety questions.

**Step 2: Context** (1 min)
Check: is your CLAUDE.md up to date? @-mention the relevant files. Load the right MCP servers (if available).

**Step 3: Prompt** (3 min)
Pentagon Model: Role, Context, Goal, Constraints, Output Format. Add your intent as supporting context.

**Step 4: Specification** (3 min)
Write GIVEN/WHEN/THEN scenarios (at least 3 — happy path + 2 edge cases). Define acceptance criteria (at least 5).

**Step 5: Execute & Verify** (15-30 min)
Run the prompt. Check against your specs. RALF loop: Review, Analyze, Learn, Fix. Iterate until all acceptance criteria are green.

## The Time Investment

Total overhead: ~9 minutes prep for 15-30 minutes of execution.

**ROI:** 9-minute investment saves on average 2-3 iteration cycles. Each iteration cycle costs 15-30 minutes. Net time savings: **30-80 minutes per feature**.

After 3 months this is second nature. You no longer think "I must write a spec" — you just think in specs. Like you no longer think about git add/commit/push — it's in your fingers.

## The Feedback Loop

Every time you apply this framework:
- Your prompts improve (muscle memory)
- Your context grows more complete (CLAUDE.md grows)
- Your specs get sharper (pattern recognition)
- Your verification gets faster (tooling improves)

This is **compounding**. Week 1 takes effort. Week 4 it's automatic. Week 8 you wonder how you ever worked without it.`;

const LESSON_5_4_FR = `# Leçon 5.4 — Les 4 Disciplines Combinées

## Le Framework Complet

Après 5 niveaux vous maîtrisez quatre disciplines :

1. **Prompt Craft** — Le Pentagon Model (QUOI vous demandez)
2. **Context Engineering** — Charger les bonnes informations (DE QUOI il s'agit)
3. **Intent Engineering** — Communiquer le pourquoi (POURQUOI vous demandez)
4. **Specification Engineering** — Définir une sortie testable (COMMENT vous vérifiez)

Chaque discipline construit sur la précédente. Aucune n'est optionnelle si vous voulez une sortie cohérente et de niveau production.

## Le Workflow Intégré

En pratique ça ressemble à ça :

**Étape 1 : Intent** (2 min)
Définir la Goal Hierarchy : Mission, Objective, Goal, Tasks, Constraints. Nommer les trade-offs. Répondre aux 3 questions Intent Safety.

**Étape 2 : Context** (1 min)
Vérifier : votre CLAUDE.md est-il à jour ? @-mentionner les fichiers pertinents. Charger les bons MCP servers (si disponibles).

**Étape 3 : Prompt** (3 min)
Pentagon Model : Role, Context, Goal, Constraints, Output Format. Ajouter votre intent comme contexte de soutien.

**Étape 4 : Specification** (3 min)
Écrire des scénarios GIVEN/WHEN/THEN (minimum 3 — happy path + 2 edge cases). Définir les critères d'acceptation (minimum 5).

**Étape 5 : Execute & Verify** (15-30 min)
Lancer le prompt. Vérifier contre vos specs. Boucle RALF : Review, Analyze, Learn, Fix. Itérer jusqu'à ce que tous les critères d'acceptation soient verts.

## L'Investissement en Temps

Overhead total : ~9 minutes de prep pour 15-30 minutes d'exécution.

**ROI :** 9 minutes d'investissement économisent en moyenne 2-3 cycles d'itération. Chaque cycle coûte 15-30 minutes. Économie nette : **30-80 minutes par feature**.

Après 3 mois c'est une seconde nature. Vous ne pensez plus "je dois écrire une spec" — vous pensez simplement en specs. Comme vous ne pensez plus à git add/commit/push — c'est dans vos doigts.

## La Feedback Loop

Chaque fois que vous appliquez ce framework :
- Vos prompts s'améliorent (muscle memory)
- Votre context devient plus complet (CLAUDE.md grandit)
- Vos specs deviennent plus nettes (reconnaissance de patterns)
- Votre vérification devient plus rapide (outillage s'améliore)

C'est **compounding**. Semaine 1 ça demande de l'effort. Semaine 4 c'est automatique. Semaine 8 vous vous demandez comment vous travailliez sans.`;

// ─── LES 5.5 — AI Testing voor QA Professionals ──────────────────────────────

const LESSON_5_5_NL = `# Les 5.5 — AI Testing voor QA Professionals

> *"GIVEN/WHEN/THEN is Gherkin — ik doe dit al 7 jaar. Nu snap ik waarom het ook voor AI-prompts werkt."*

Als tester heb je een voorsprong. Je denkt al in specificaties. Je denkt al in edge cases. Je denkt al in "wat kan er fout gaan." Level 5 is waar jouw expertise en AI samenkomen.

## Drie Lagen van AI Testing

**Laag 1: Test je prompts** (unit tests voor prompts)

Behandel je prompt als een functie. Zelfde input, verwachte output.

\`\`\`gherkin
Feature: IBAN Validatie Prompt
  Scenario: Geldig Nederlands IBAN
    Given de prompt bevat "Valideer: NL91ABNA0417164300"
    When ik de prompt uitvoer in LibreChat
    Then bevat het antwoord "geldig"
    And hallucineert het geen fictief antwoord

  Scenario: Ongeldig IBAN (verkeerde checksum)
    Given de prompt bevat "Valideer: NL91ABNA0417164399"
    When ik de prompt uitvoer
    Then bevat het antwoord "ongeldig"
    And geeft het een reden voor de afwijzing

  Scenario: Geen IBAN (random string)
    Given de prompt bevat "Valideer: ditisgeeniban"
    When ik de prompt uitvoer
    Then bevat het antwoord "ongeldig format"
\`\`\`

**Laag 2: Regression suite** (bij prompt-wijzigingen)

Sla je test cases op bij elke prompt-versie. Wijzig je de prompt? Run de volledige suite voordat je deployt. Precies zoals je dat doet met code.

**Laag 3: Bias auditing** (EU AI Act compliance)

Voor hoog-risico systemen — en Worldline heeft er meerdere:
- Test op demografische bias (verwerkt het systeem transacties gelijk ongeacht land?)
- Test op bedragsdrempels (gedraagt het systeem zich anders bij kleine vs grote bedragen?)
- Test op tijdstippen (is er verschil in verwerking overdag vs 's nachts?)
- Documenteer elk patroon en escaleer naar de DPO

## QA Checklist voor AI-gegenereerde Code

Dit is je standaard checklist. Print het uit. Plak het naast je scherm.

**SECURITY** (blockers — code gaat NIET door zonder check):
- [ ] SQL injection? String concatenation in queries?
- [ ] XSS? User input direct in HTML?
- [ ] Hardcoded credentials?
- [ ] PAN/CVV in logs?
- [ ] Prompt injection risico?

**CORRECTHEID:**
- [ ] Null/undefined edge cases afgedekt?
- [ ] Monetary values: BigDecimal (nooit float!)?
- [ ] Timezone-aware timestamps (UTC)?
- [ ] Error messages informatief maar niet te specifiek (geen stack traces naar user)?

**EU AI ACT** (hoog-risico systemen):
- [ ] Menselijke override mogelijk?
- [ ] Beslissingen gelogd en traceerbaar?
- [ ] Explainability beschikbaar?

## Pentagon Model voor QA

\`\`\`markdown
ROL: Senior QA engineer, payment processing, EU AI Act compliance.
CONTEXT: [jouw systeem, tech stack, test frameworks]
TAAK: Genereer een complete test suite:
  - Gherkin scenarios voor alle flows
  - Vitest unit tests
  - Playwright e2e tests
  - Security checklist
  - Bias audit matrix
FORMAT: component.test.ts + component.e2e.ts + security-report.md
CONSTRAINTS: Geen productiedata, WCAG 2.1 AA, PCI-DSS compliant
\`\`\`

Dit is het Pentagon Model uit Level 2 (v1.1 atomen: ROL/CONTEXT/TAAK/FORMAT/CONSTRAINTS) — maar nu met de diepte van Level 3 (context), Level 4 (intent), en Level 5 (specification). **Alle vier disciplines in één prompt.**`;

const LESSON_5_5_EN = `# Lesson 5.5 — AI Testing for QA Professionals

> *"GIVEN/WHEN/THEN is Gherkin — I've been doing this for 7 years. Now I understand why it also works for AI prompts."*

As a tester you have a head start. You already think in specifications. You already think in edge cases. You already think in "what can go wrong." Level 5 is where your expertise and AI come together.

## Three Layers of AI Testing

**Layer 1: Test your prompts** (unit tests for prompts)

Treat your prompt as a function. Same input, expected output.

\`\`\`gherkin
Feature: IBAN Validation Prompt
  Scenario: Valid Dutch IBAN
    Given the prompt contains "Validate: NL91ABNA0417164300"
    When I run the prompt in LibreChat
    Then the answer contains "valid"
    And does not hallucinate a fictional answer

  Scenario: Invalid IBAN (wrong checksum)
    Given the prompt contains "Validate: NL91ABNA0417164399"
    When I run the prompt
    Then the answer contains "invalid"
    And provides a reason for rejection

  Scenario: No IBAN (random string)
    Given the prompt contains "Validate: thisisnoiban"
    When I run the prompt
    Then the answer contains "invalid format"
\`\`\`

**Layer 2: Regression suite** (on prompt changes)

Save your test cases for each prompt version. Change the prompt? Run the full suite before deploying. Exactly like you do with code.

**Layer 3: Bias auditing** (EU AI Act compliance)

For high-risk systems — and Worldline has several:
- Test for demographic bias (does the system treat transactions equally regardless of country?)
- Test amount thresholds (does it behave differently for small vs large amounts?)
- Test timings (is there a difference in processing day vs night?)
- Document every pattern and escalate to the DPO

## QA Checklist for AI-Generated Code

This is your standard checklist. Print it. Pin it next to your screen.

**SECURITY** (blockers — code does NOT ship without check):
- [ ] SQL injection? String concatenation in queries?
- [ ] XSS? User input directly in HTML?
- [ ] Hardcoded credentials?
- [ ] PAN/CVV in logs?
- [ ] Prompt injection risk?

**CORRECTNESS:**
- [ ] Null/undefined edge cases covered?
- [ ] Monetary values: BigDecimal (never float!)?
- [ ] Timezone-aware timestamps (UTC)?
- [ ] Error messages informative but not too specific (no stack traces to user)?

**EU AI ACT** (high-risk systems):
- [ ] Human override possible?
- [ ] Decisions logged and traceable?
- [ ] Explainability available?

## Pentagon Model for QA

\`\`\`markdown
ROLE: Senior QA engineer, payment processing, EU AI Act compliance.
CONTEXT: [your system, tech stack, test frameworks]
TASK: Generate a complete test suite:
  - Gherkin scenarios for all flows
  - Vitest unit tests
  - Playwright e2e tests
  - Security checklist
  - Bias audit matrix
FORMAT: component.test.ts + component.e2e.ts + security-report.md
CONSTRAINTS: No production data, WCAG 2.1 AA, PCI-DSS compliant
\`\`\`

This is the Pentagon Model from Level 2 (v1.1 atoms: ROLE/CONTEXT/TASK/FORMAT/CONSTRAINTS) — but now with the depth of Level 3 (context), Level 4 (intent), and Level 5 (specification). **All four disciplines in one prompt.**`;

const LESSON_5_5_FR = `# Leçon 5.5 — Tests IA pour Professionnels QA

> *"GIVEN/WHEN/THEN c'est Gherkin — je fais ça depuis 7 ans. Maintenant je comprends pourquoi ça marche aussi pour les prompts IA."*

En tant que testeur vous avez une longueur d'avance. Vous pensez déjà en spécifications. Vous pensez déjà en edge cases. Vous pensez déjà en "qu'est-ce qui peut mal tourner." Level 5 c'est là où votre expertise et l'IA se rejoignent.

## Trois Couches de Tests IA

**Couche 1 : Tester vos prompts** (tests unitaires pour prompts)

Traitez votre prompt comme une fonction. Même input, output attendu.

\`\`\`gherkin
Feature: Prompt Validation IBAN
  Scenario: IBAN néerlandais valide
    Given le prompt contient "Valider : NL91ABNA0417164300"
    When je lance le prompt dans LibreChat
    Then la réponse contient "valide"
    And ne hallucine pas une réponse fictive

  Scenario: IBAN invalide (mauvaise checksum)
    Given le prompt contient "Valider : NL91ABNA0417164399"
    When je lance le prompt
    Then la réponse contient "invalide"
    And donne une raison pour le rejet

  Scenario: Pas d'IBAN (chaîne aléatoire)
    Given le prompt contient "Valider : ceciestpasuniban"
    When je lance le prompt
    Then la réponse contient "format invalide"
\`\`\`

**Couche 2 : Suite de régression** (lors de changements de prompt)

Sauvegardez vos cas de tests à chaque version de prompt. Changez le prompt ? Lancez la suite complète avant de déployer. Exactement comme vous le faites avec le code.

**Couche 3 : Audit de biais** (conformité EU AI Act)

Pour les systèmes à haut risque — et Worldline en a plusieurs :
- Tester le biais démographique (le système traite-t-il les transactions de manière égale quel que soit le pays ?)
- Tester les seuils de montants (se comporte-t-il différemment pour petits vs grands montants ?)
- Tester les timings (y a-t-il une différence de traitement jour vs nuit ?)
- Documenter chaque pattern et escalader au DPO

## Checklist QA pour le Code Généré par IA

Ceci est votre checklist standard. Imprimez-la. Collez-la à côté de votre écran.

**SECURITY** (blockers — le code ne passe PAS sans vérification) :
- [ ] SQL injection ? Concaténation de strings dans les queries ?
- [ ] XSS ? Input utilisateur directement en HTML ?
- [ ] Credentials hardcodés ?
- [ ] PAN/CVV dans les logs ?
- [ ] Risque de prompt injection ?

**EXACTITUDE :**
- [ ] Edge cases null/undefined couverts ?
- [ ] Valeurs monétaires : BigDecimal (jamais float !) ?
- [ ] Timestamps timezone-aware (UTC) ?
- [ ] Messages d'erreur informatifs mais pas trop spécifiques (pas de stack traces à l'utilisateur) ?

**EU AI ACT** (systèmes à haut risque) :
- [ ] Override humain possible ?
- [ ] Décisions loggées et traçables ?
- [ ] Explainability disponible ?

## Pentagon Model pour QA

\`\`\`markdown
ROLE : Senior QA engineer, payment processing, EU AI Act compliance.
CONTEXT : [votre système, tech stack, frameworks de test]
TASK : Générer une suite de tests complète :
  - Scénarios Gherkin pour tous les flows
  - Tests unitaires Vitest
  - Tests e2e Playwright
  - Checklist security
  - Matrice d'audit de biais
FORMAT : component.test.ts + component.e2e.ts + security-report.md
CONSTRAINTS : Pas de données prod, WCAG 2.1 AA, PCI-DSS compliant
\`\`\`

C'est le Pentagon Model de Level 2 (atomes v1.1 : ROLE/CONTEXT/TASK/FORMAT/CONSTRAINTS) — mais maintenant avec la profondeur de Level 3 (context), Level 4 (intent), et Level 5 (specification). **Les quatre disciplines dans un seul prompt.**`;

// ─── LAB 5A — Pain Lab: Spec-loze Output ─────────────────────────────────────

const LAB_5A_NL = `# Lab 5A — Pain Lab: Spec-loze Output (30 min)

**Pedagogisch principe:** je gaat het verschil voelen tussen output zonder en met specificatie. Net als in Lab 3A (context) en Lab 4A (intent) — maar nu voor specs.

## Stap 1: Zonder Spec (10 min)

Open LibreChat of Claude Code. Gebruik alles wat je geleerd hebt — Pentagon, context, intent. Maar schrijf **GEEN** GIVEN/WHEN/THEN en **GEEN** acceptance criteria.

Prompt:
> "Bouw een NotificationBell component dat het aantal ongelezen notificaties toont en bij klik een dropdown opent met de laatste 5 notificaties."

Evalueer de output:
- Wat gebeurt er bij 0 notificaties?
- Wat als er 100+ ongelezen zijn?
- Is er een loading state?
- Wat als de API faalt?
- Is het accessible (keyboard, screen reader)?

Bewaar de output en je observaties.

## Stap 2: Met Spec (10 min)

Zelfde component. Maar nu met GIVEN/WHEN/THEN:

> "Bouw een NotificationBell component.
>
> **GIVEN:** 0 ongelezen notificaties
> **WHEN:** component rendert
> **THEN:** toon bell icoon zonder badge
>
> **GIVEN:** 5 ongelezen notificaties
> **WHEN:** component rendert
> **THEN:** toon bell icoon met rode badge '5'
>
> **GIVEN:** 99+ ongelezen notificaties
> **WHEN:** component rendert
> **THEN:** toon badge '99+'
>
> **GIVEN:** gebruiker klikt op bell
> **WHEN:** dropdown opent
> **THEN:** toon laatste 5 notificaties met titel, tijd, en gelezen/ongelezen status
>
> **GIVEN:** API call voor notificaties faalt
> **WHEN:** dropdown opent
> **THEN:** toon 'Kon notificaties niet laden' met retry knop
>
> **GIVEN:** alle notificaties zijn gelezen
> **WHEN:** gebruiker opent dropdown
> **THEN:** toon 'Geen nieuwe notificaties' met link naar alle notificaties
>
> **Acceptance Criteria:**
> - [ ] TypeScript strict, geen any
> - [ ] Keyboard accessible (Enter/Space opent dropdown, Escape sluit)
> - [ ] aria-label op bell: 'X ongelezen notificaties'
> - [ ] Click outside dropdown sluit hem
> - [ ] Loading skeleton tijdens fetch
> - [ ] Responsive (mobile: full-screen overlay)"

Bewaar de output.

## Stap 3: Vergelijk (10 min)

Leg beide outputs naast elkaar. Beantwoord:
- Hoeveel van jouw edge cases dekte de AI zonder spec?
- Hoeveel acceptance criteria voldeed de eerste output?
- Wat is het kwaliteitsverschil?
- Hoeveel iteraties zou je nodig hebben om output 1 op het niveau van output 2 te brengen?

**Deliverable:** Twee outputs + vergelijkingsnotities.`;

const LAB_5A_EN = `# Lab 5A — Pain Lab: Spec-less Output (30 min)

**Pedagogical principle:** you will feel the difference between output with and without specification. Just like Lab 3A (context) and Lab 4A (intent) — but now for specs.

## Step 1: Without Spec (10 min)

Open LibreChat or Claude Code. Use everything you've learned — Pentagon, context, intent. But write **NO** GIVEN/WHEN/THEN and **NO** acceptance criteria.

Prompt:
> "Build a NotificationBell component that shows the number of unread notifications and on click opens a dropdown with the last 5 notifications."

Evaluate the output:
- What happens with 0 notifications?
- What if there are 100+ unread?
- Is there a loading state?
- What if the API fails?
- Is it accessible (keyboard, screen reader)?

Save the output and your observations.

## Step 2: With Spec (10 min)

Same component. But now with GIVEN/WHEN/THEN:

> "Build a NotificationBell component.
>
> **GIVEN:** 0 unread notifications
> **WHEN:** component renders
> **THEN:** show bell icon without badge
>
> **GIVEN:** 5 unread notifications
> **WHEN:** component renders
> **THEN:** show bell icon with red badge '5'
>
> **GIVEN:** 99+ unread notifications
> **WHEN:** component renders
> **THEN:** show badge '99+'
>
> **GIVEN:** user clicks bell
> **WHEN:** dropdown opens
> **THEN:** show last 5 notifications with title, time, and read/unread status
>
> **GIVEN:** API call for notifications fails
> **WHEN:** dropdown opens
> **THEN:** show 'Could not load notifications' with retry button
>
> **GIVEN:** all notifications are read
> **WHEN:** user opens dropdown
> **THEN:** show 'No new notifications' with link to all notifications
>
> **Acceptance Criteria:**
> - [ ] TypeScript strict, no any
> - [ ] Keyboard accessible (Enter/Space opens dropdown, Escape closes)
> - [ ] aria-label on bell: 'X unread notifications'
> - [ ] Click outside dropdown closes it
> - [ ] Loading skeleton during fetch
> - [ ] Responsive (mobile: full-screen overlay)"

Save the output.

## Step 3: Compare (10 min)

Place both outputs side by side. Answer:
- How many of your edge cases did the AI cover without spec?
- How many acceptance criteria did the first output meet?
- What is the quality difference?
- How many iterations would you need to bring output 1 to the level of output 2?

**Deliverable:** Two outputs + comparison notes.`;

const LAB_5A_FR = `# Lab 5A — Pain Lab : Sortie Sans Spec (30 min)

**Principe pédagogique :** vous allez ressentir la différence entre une sortie avec et sans spécification. Comme dans le Lab 3A (context) et Lab 4A (intent) — mais maintenant pour les specs.

## Étape 1 : Sans Spec (10 min)

Ouvrez LibreChat ou Claude Code. Utilisez tout ce que vous avez appris — Pentagon, context, intent. Mais n'écrivez **AUCUN** GIVEN/WHEN/THEN et **AUCUN** critère d'acceptation.

Prompt :
> "Construisez un composant NotificationBell qui montre le nombre de notifications non lues et ouvre au clic un dropdown avec les 5 dernières notifications."

Évaluez la sortie :
- Que se passe-t-il avec 0 notification ?
- Et s'il y en a 100+ non lues ?
- Y a-t-il un état de chargement ?
- Et si l'API échoue ?
- Est-ce accessible (clavier, lecteur d'écran) ?

Sauvegardez la sortie et vos observations.

## Étape 2 : Avec Spec (10 min)

Même composant. Mais maintenant avec GIVEN/WHEN/THEN :

> "Construisez un composant NotificationBell.
>
> **GIVEN :** 0 notification non lue
> **WHEN :** le composant s'affiche
> **THEN :** montrer l'icône bell sans badge
>
> **GIVEN :** 5 notifications non lues
> **WHEN :** le composant s'affiche
> **THEN :** montrer l'icône bell avec badge rouge '5'
>
> **GIVEN :** 99+ notifications non lues
> **WHEN :** le composant s'affiche
> **THEN :** montrer badge '99+'
>
> **GIVEN :** l'utilisateur clique sur la bell
> **WHEN :** le dropdown s'ouvre
> **THEN :** montrer les 5 dernières notifications avec titre, heure, et statut lu/non lu
>
> **GIVEN :** l'appel API pour notifications échoue
> **WHEN :** le dropdown s'ouvre
> **THEN :** montrer 'Impossible de charger les notifications' avec bouton retry
>
> **GIVEN :** toutes les notifications sont lues
> **WHEN :** l'utilisateur ouvre le dropdown
> **THEN :** montrer 'Aucune nouvelle notification' avec lien vers toutes les notifications
>
> **Critères d'acceptation :**
> - [ ] TypeScript strict, pas de any
> - [ ] Accessible au clavier (Enter/Espace ouvre dropdown, Escape ferme)
> - [ ] aria-label sur bell : 'X notifications non lues'
> - [ ] Clic en dehors ferme le dropdown
> - [ ] Loading skeleton pendant le fetch
> - [ ] Responsive (mobile : overlay plein écran)"

Sauvegardez la sortie.

## Étape 3 : Comparer (10 min)

Placez les deux sorties côte à côte. Répondez :
- Combien de vos edge cases l'IA a-t-elle couvert sans spec ?
- Combien de critères d'acceptation la première sortie a-t-elle respecté ?
- Quelle est la différence de qualité ?
- Combien d'itérations faudrait-il pour amener la sortie 1 au niveau de la sortie 2 ?

**Deliverable :** Deux sorties + notes de comparaison.`;

// ─── LAB 5B — Full Stack Feature met 4 Disciplines ───────────────────────────

const LAB_5B_NL = `# Lab 5B — Full Stack Feature met 4 Disciplines (45 min)

Dit is de integratielab. Alle vier disciplines, één feature, volledig uitgewerkt.

## Stap 1: Kies Je Feature (2 min)

Kies uit:
- A) Een dashboard widget die real-time data toont
- B) Een API endpoint met volledige error handling
- C) Een form met complexe validatie

Gebruik iets dat relevant is voor je dagelijks werk.

## Stap 2: Intent (5 min)

Schrijf de Goal Hierarchy:
- Mission: waarom bestaat dit project?
- Objective: wat wil je bereiken?
- Goal: wat is het meetbare doel van deze feature?
- Trade-offs: wat prioriteer je?

Beantwoord de 3 Intent Safety vragen.

## Stap 3: Context (3 min)

- Check je CLAUDE.md — is het actueel?
- @-mention de relevante bestanden
- Laad de juiste context voor deze specifieke taak

## Stap 4: Prompt (5 min)

Pentagon Model:
- Role: [specifiek voor jouw taak]
- Context: [je CLAUDE.md + bestanden]
- Goal: [wat moet de output doen]
- Constraints: [wat mag niet]
- Format: [hoe moet de output eruitzien]

## Stap 5: Specification (5 min)

Schrijf minimaal:
- 3 GIVEN/WHEN/THEN scenarios (happy path + 2 edge cases)
- 5 acceptance criteria
- 2 security checkpoints

## Stap 6: Execute & Verify (20 min)

- Run je prompt
- Check elke GIVEN/WHEN/THEN — klopt het?
- Check elke acceptance criterium — voldaan?
- Als iets niet klopt: itereer (RALF loop)
- Documenteer je iteraties

## Stap 7: Reflectie (5 min)

- Hoeveel iteraties waren nodig?
- Welke discipline was het meest waardevol voor deze specifieke taak?
- Waar zat de meeste tijdswinst?
- Wat zou je volgende keer anders doen?

**Deliverable:** Goal Hierarchy + prompt + specs + werkende code + test resultaten + RALF review notes.`;

const LAB_5B_EN = `# Lab 5B — Full Stack Feature with 4 Disciplines (45 min)

This is the integration lab. All four disciplines, one feature, fully worked out.

## Step 1: Choose Your Feature (2 min)

Pick one:
- A) A dashboard widget that shows real-time data
- B) An API endpoint with full error handling
- C) A form with complex validation

Use something relevant to your daily work.

## Step 2: Intent (5 min)

Write the Goal Hierarchy:
- Mission: why does this project exist?
- Objective: what do you want to achieve?
- Goal: what is the measurable goal of this feature?
- Trade-offs: what do you prioritise?

Answer the 3 Intent Safety questions.

## Step 3: Context (3 min)

- Check your CLAUDE.md — is it up to date?
- @-mention the relevant files
- Load the right context for this specific task

## Step 4: Prompt (5 min)

Pentagon Model:
- Role: [specific to your task]
- Context: [your CLAUDE.md + files]
- Goal: [what must the output do]
- Constraints: [what is not allowed]
- Format: [how must the output look]

## Step 5: Specification (5 min)

Write at minimum:
- 3 GIVEN/WHEN/THEN scenarios (happy path + 2 edge cases)
- 5 acceptance criteria
- 2 security checkpoints

## Step 6: Execute & Verify (20 min)

- Run your prompt
- Check every GIVEN/WHEN/THEN — does it hold?
- Check every acceptance criterion — met?
- If something is off: iterate (RALF loop)
- Document your iterations

## Step 7: Reflection (5 min)

- How many iterations were needed?
- Which discipline was most valuable for this specific task?
- Where was the biggest time saving?
- What would you do differently next time?

**Deliverable:** Goal Hierarchy + prompt + specs + working code + test results + RALF review notes.`;

const LAB_5B_FR = `# Lab 5B — Feature Full Stack avec 4 Disciplines (45 min)

Ceci est le lab d'intégration. Les quatre disciplines, une feature, entièrement développée.

## Étape 1 : Choisir Votre Feature (2 min)

Choisissez :
- A) Un widget de dashboard qui montre des données temps réel
- B) Un endpoint API avec gestion complète des erreurs
- C) Un formulaire avec validation complexe

Utilisez quelque chose de pertinent pour votre travail quotidien.

## Étape 2 : Intent (5 min)

Écrivez la Goal Hierarchy :
- Mission : pourquoi ce projet existe-t-il ?
- Objective : que voulez-vous accomplir ?
- Goal : quel est le but mesurable de cette feature ?
- Trade-offs : qu'est-ce que vous priorisez ?

Répondez aux 3 questions Intent Safety.

## Étape 3 : Context (3 min)

- Vérifiez votre CLAUDE.md — est-il à jour ?
- @-mentionnez les fichiers pertinents
- Chargez le bon contexte pour cette tâche spécifique

## Étape 4 : Prompt (5 min)

Pentagon Model :
- Role : [spécifique à votre tâche]
- Context : [votre CLAUDE.md + fichiers]
- Goal : [que doit faire la sortie]
- Constraints : [ce qui n'est pas autorisé]
- Format : [à quoi doit ressembler la sortie]

## Étape 5 : Specification (5 min)

Écrivez au minimum :
- 3 scénarios GIVEN/WHEN/THEN (happy path + 2 edge cases)
- 5 critères d'acceptation
- 2 checkpoints security

## Étape 6 : Execute & Verify (20 min)

- Lancez votre prompt
- Vérifiez chaque GIVEN/WHEN/THEN — est-ce que ça tient ?
- Vérifiez chaque critère d'acceptation — respecté ?
- Si quelque chose cloche : itérez (boucle RALF)
- Documentez vos itérations

## Étape 7 : Réflexion (5 min)

- Combien d'itérations ont été nécessaires ?
- Quelle discipline a été la plus précieuse pour cette tâche spécifique ?
- Où était le plus grand gain de temps ?
- Que feriez-vous différemment la prochaine fois ?

**Deliverable :** Goal Hierarchy + prompt + specs + code fonctionnel + résultats de tests + notes review RALF.`;

// ═════════════════════════════════════════════════════════════════════════════
// ── WEEK 4 EXPORT ───────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

export const WEEK_4: CurriculumWeek = {
  id: 'week-4',
  number: 4,
  title: 'Level 5 — Specification Engineering',
  titleI18n: {
    en: 'Level 5 — Specification Engineering',
    nl: 'Level 5 — Specification Engineering',
    fr: 'Level 5 — Specification Engineering',
  },
  subtitle: 'AI Systems That Don\'t Break · van output naar productieklaar',
  subtitleI18n: {
    en: 'AI Systems That Don\'t Break · from output to production-ready',
    nl: 'AI Systems That Don\'t Break · van output naar productieklaar',
    fr: 'AI Systems That Don\'t Break · de la sortie au production-ready',
  },
  description:
    'Na dit level kun je AI-output testbaar maken met GIVEN/WHEN/THEN specs, acceptance criteria schrijven die als kwaliteitspoort werken, de AI Test Piramide toepassen (compiler → unit → integration → manual review), en de 4 disciplines (Prompt, Context, Intent, Specification) combineren tot een geïntegreerde workflow. Je Builder Challenge uit Level 4 wordt productieklaar.',
  descriptionI18n: {
    en: 'After this level you can make AI output testable with GIVEN/WHEN/THEN specs, write acceptance criteria that act as quality gates, apply the AI Test Pyramid (compiler → unit → integration → manual review), and combine the 4 disciplines (Prompt, Context, Intent, Specification) into an integrated workflow. Your Builder Challenge from Level 4 becomes production-ready.',
    nl: 'Na dit level kun je AI-output testbaar maken met GIVEN/WHEN/THEN specs, acceptance criteria schrijven die als kwaliteitspoort werken, de AI Test Piramide toepassen (compiler → unit → integration → manual review), en de 4 disciplines (Prompt, Context, Intent, Specification) combineren tot een geïntegreerde workflow. Je Builder Challenge uit Level 4 wordt productieklaar.',
    fr: 'Après ce niveau vous pouvez rendre la sortie IA testable avec des specs GIVEN/WHEN/THEN, écrire des critères d\'acceptation qui agissent comme quality gates, appliquer la Pyramide de Tests IA (compilateur → unit → integration → revue manuelle), et combiner les 4 disciplines (Prompt, Context, Intent, Specification) en un workflow intégré. Votre Builder Challenge de Level 4 devient prêt pour la production.',
  },
  objectives: [
    'Schrijf GIVEN/WHEN/THEN scenarios die AI-output testbaar maken (minimaal 3 per feature)',
    'Definieer acceptance criteria die als kwaliteitspoort werken voor AI-code',
    'Pas de AI Test Piramide toe: TypeScript compiler → unit tests → integration tests → manual review',
    'Gebruik Test-Driven AI Development (specs → tests → implementatie) voor 5x snellere output',
    'Combineer de 4 disciplines (Prompt, Context, Intent, Specification) tot één workflow die 30-80 min/feature bespaart',
  ],
  objectivesI18n: {
    en: [
      'Write GIVEN/WHEN/THEN scenarios that make AI output testable (at least 3 per feature)',
      'Define acceptance criteria that act as a quality gate for AI code',
      'Apply the AI Test Pyramid: TypeScript compiler → unit tests → integration tests → manual review',
      'Use Test-Driven AI Development (specs → tests → implementation) for 5x faster output',
      'Combine the 4 disciplines (Prompt, Context, Intent, Specification) into one workflow that saves 30-80 min/feature',
    ],
    nl: [
      'Schrijf GIVEN/WHEN/THEN scenarios die AI-output testbaar maken (minimaal 3 per feature)',
      'Definieer acceptance criteria die als kwaliteitspoort werken voor AI-code',
      'Pas de AI Test Piramide toe: TypeScript compiler → unit tests → integration tests → manual review',
      'Gebruik Test-Driven AI Development (specs → tests → implementatie) voor 5x snellere output',
      'Combineer de 4 disciplines (Prompt, Context, Intent, Specification) tot één workflow die 30-80 min/feature bespaart',
    ],
    fr: [
      'Écrire des scénarios GIVEN/WHEN/THEN qui rendent la sortie IA testable (minimum 3 par feature)',
      'Définir des critères d\'acceptation qui agissent comme quality gate pour le code IA',
      'Appliquer la Pyramide de Tests IA : compilateur TypeScript → tests unitaires → tests d\'intégration → revue manuelle',
      'Utiliser Test-Driven AI Development (specs → tests → implémentation) pour une sortie 5x plus rapide',
      'Combiner les 4 disciplines (Prompt, Context, Intent, Specification) en un workflow qui économise 30-80 min/feature',
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
  badgeName: 'Specification Architect',
  badgeNameI18n: {
    en: 'Specification Architect',
    nl: 'Specification Architect',
    fr: 'Specification Architect',
  },
  badgeIcon: '✅',
  weeklyQuiz: [
    {
      id: 'w4-q1',
      question: 'Wat zijn de drie componenten van een GIVEN/WHEN/THEN specificatie?',
      questionI18n: {
        en: 'What are the three components of a GIVEN/WHEN/THEN specification?',
        nl: 'Wat zijn de drie componenten van een GIVEN/WHEN/THEN specificatie?',
        fr: 'Quels sont les trois composants d\'une spécification GIVEN/WHEN/THEN ?',
      },
      options: [
        'Input / Process / Output',
        'Beginsituatie / Actie of trigger / Verwacht resultaat',
        'Setup / Execute / Teardown',
        'Plan / Do / Check',
      ],
      optionsI18n: {
        en: [
          'Input / Process / Output',
          'Starting situation / Action or trigger / Expected result',
          'Setup / Execute / Teardown',
          'Plan / Do / Check',
        ],
        nl: [
          'Input / Process / Output',
          'Beginsituatie / Actie of trigger / Verwacht resultaat',
          'Setup / Execute / Teardown',
          'Plan / Do / Check',
        ],
        fr: [
          'Input / Process / Output',
          'Situation de départ / Action ou déclencheur / Résultat attendu',
          'Setup / Execute / Teardown',
          'Plan / Do / Check',
        ],
      },
      correctIndex: 1,
      explanation: 'GIVEN = de beginsituatie, WHEN = de actie of trigger, THEN = het verwachte resultaat. Drie woorden uit BDD (Behavior-Driven Development) die AI-output testbaar maken.',
      explanationI18n: {
        en: 'GIVEN = starting situation, WHEN = the action or trigger, THEN = expected result. Three words from BDD (Behavior-Driven Development) that make AI output testable.',
        nl: 'GIVEN = de beginsituatie, WHEN = de actie of trigger, THEN = het verwachte resultaat. Drie woorden uit BDD (Behavior-Driven Development) die AI-output testbaar maken.',
        fr: 'GIVEN = situation de départ, WHEN = action ou déclencheur, THEN = résultat attendu. Trois mots du BDD (Behavior-Driven Development) qui rendent la sortie IA testable.',
      },
      bloomLevel: 1,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w4-q2',
      question: 'Welke vier lagen vormen de AI Test Piramide?',
      questionI18n: {
        en: 'Which four layers form the AI Test Pyramid?',
        nl: 'Welke vier lagen vormen de AI Test Piramide?',
        fr: 'Quelles quatre couches forment la Pyramide de Tests IA ?',
      },
      options: [
        'Code review / Static analysis / Fuzzing / Pen test',
        'TypeScript compiler / Unit tests / Integration tests / Manual review',
        'Lint / Format / Build / Deploy',
        'Dev / Staging / Pre-prod / Prod',
      ],
      optionsI18n: {
        en: [
          'Code review / Static analysis / Fuzzing / Pen test',
          'TypeScript compiler / Unit tests / Integration tests / Manual review',
          'Lint / Format / Build / Deploy',
          'Dev / Staging / Pre-prod / Prod',
        ],
        nl: [
          'Code review / Static analysis / Fuzzing / Pen test',
          'TypeScript compiler / Unit tests / Integration tests / Manual review',
          'Lint / Format / Build / Deploy',
          'Dev / Staging / Pre-prod / Prod',
        ],
        fr: [
          'Code review / Analyse statique / Fuzzing / Pen test',
          'Compilateur TypeScript / Tests unitaires / Tests intégration / Revue manuelle',
          'Lint / Format / Build / Deploy',
          'Dev / Staging / Pre-prod / Prod',
        ],
      },
      correctIndex: 1,
      explanation: 'Laag 1 (compiler) vangt ~60% van de fouten gratis. Laag 2 (unit tests) vangt ~25%. Laag 3 (integration) vangt nog eens deel. Laag 4 (manual) is voor de resterende ~15% die menselijk oordeel vereist.',
      explanationI18n: {
        en: 'Layer 1 (compiler) catches ~60% of errors free. Layer 2 (unit tests) catches ~25%. Layer 3 (integration) catches another part. Layer 4 (manual) is for the remaining ~15% requiring human judgement.',
        nl: 'Laag 1 (compiler) vangt ~60% van de fouten gratis. Laag 2 (unit tests) vangt ~25%. Laag 3 (integration) vangt nog eens deel. Laag 4 (manual) is voor de resterende ~15% die menselijk oordeel vereist.',
        fr: 'Couche 1 (compilateur) attrape ~60% des erreurs gratuitement. Couche 2 (tests unitaires) attrape ~25%. Couche 3 (intégration) attrape encore une partie. Couche 4 (manuel) est pour les ~15% restants qui nécessitent du jugement humain.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w4-q3',
      question: 'Wat is Test-Driven AI Development?',
      questionI18n: {
        en: 'What is Test-Driven AI Development?',
        nl: 'Wat is Test-Driven AI Development?',
        fr: 'Qu\'est-ce que le Test-Driven AI Development ?',
      },
      options: [
        'AI gebruiken om achteraf tests te genereren na implementatie',
        'De AI laten raden wat de tests moeten doen',
        'Eerst spec → dan AI-tests laten genereren → dan AI-implementatie die tests haalt',
        'Tests automatisch runnen bij elke git commit',
      ],
      optionsI18n: {
        en: [
          'Using AI to generate tests afterwards, after implementation',
          'Let the AI guess what the tests should do',
          'First spec → then AI-generated tests → then AI implementation that passes tests',
          'Automatically run tests on every git commit',
        ],
        nl: [
          'AI gebruiken om achteraf tests te genereren na implementatie',
          'De AI laten raden wat de tests moeten doen',
          'Eerst spec → dan AI-tests laten genereren → dan AI-implementatie die tests haalt',
          'Tests automatisch runnen bij elke git commit',
        ],
        fr: [
          'Utiliser l\'IA pour générer des tests après l\'implémentation',
          'Laisser l\'IA deviner ce que les tests devraient faire',
          'D\'abord spec → puis tests générés par IA → puis implémentation IA qui passe les tests',
          'Lancer les tests automatiquement à chaque git commit',
        ],
      },
      correctIndex: 2,
      explanation: 'Test-Driven AI: spec → tests (AI) → implementatie (AI). De tests bevatten de specificatie. De implementatie moet eraan voldoen. Totale tijd: 15-18 min voor geteste feature. 5x sneller dan achteraf testen.',
      explanationI18n: {
        en: 'Test-Driven AI: spec → tests (AI) → implementation (AI). The tests contain the specification. The implementation must satisfy them. Total time: 15-18 min for a tested feature. 5x faster than after-the-fact testing.',
        nl: 'Test-Driven AI: spec → tests (AI) → implementatie (AI). De tests bevatten de specificatie. De implementatie moet eraan voldoen. Totale tijd: 15-18 min voor geteste feature. 5x sneller dan achteraf testen.',
        fr: 'Test-Driven AI : spec → tests (IA) → implémentation (IA). Les tests contiennent la spécification. L\'implémentation doit y correspondre. Temps total : 15-18 min pour une feature testée. 5x plus rapide que tester après coup.',
      },
      bloomLevel: 3,
      euAiActRelevant: false,
      points: 10,
    },
    {
      id: 'w4-q4',
      question: 'Welke 4 disciplines vormen samen het complete AI-engineering framework?',
      questionI18n: {
        en: 'Which 4 disciplines together form the complete AI engineering framework?',
        nl: 'Welke 4 disciplines vormen samen het complete AI-engineering framework?',
        fr: 'Quelles 4 disciplines forment ensemble le framework complet d\'ingénierie IA ?',
      },
      options: [
        'Plan / Execute / Test / Deploy',
        'Prompt Craft / Context Engineering / Intent Engineering / Specification Engineering',
        'Design / Build / Ship / Learn',
        'ROL / CONTEXT / TAAK / FORMAT',
      ],
      optionsI18n: {
        en: [
          'Plan / Execute / Test / Deploy',
          'Prompt Craft / Context Engineering / Intent Engineering / Specification Engineering',
          'Design / Build / Ship / Learn',
          'ROLE / CONTEXT / TASK / FORMAT',
        ],
        nl: [
          'Plan / Execute / Test / Deploy',
          'Prompt Craft / Context Engineering / Intent Engineering / Specification Engineering',
          'Design / Build / Ship / Learn',
          'ROL / CONTEXT / TAAK / FORMAT',
        ],
        fr: [
          'Plan / Execute / Test / Deploy',
          'Prompt Craft / Context Engineering / Intent Engineering / Specification Engineering',
          'Design / Build / Ship / Learn',
          'ROLE / CONTEXT / TASK / FORMAT',
        ],
      },
      correctIndex: 1,
      explanation: 'WAT (Prompt Craft) + WAARMEE (Context) + WAAROM (Intent) + WANNEER GOED GENOEG (Specification). Samen vormen ze het complete framework — één zonder de ander is incompleet.',
      explanationI18n: {
        en: 'WHAT (Prompt Craft) + WITH-WHAT (Context) + WHY (Intent) + WHEN GOOD ENOUGH (Specification). Together they form the complete framework — one without the other is incomplete.',
        nl: 'WAT (Prompt Craft) + WAARMEE (Context) + WAAROM (Intent) + WANNEER GOED GENOEG (Specification). Samen vormen ze het complete framework — één zonder de ander is incompleet.',
        fr: 'QUOI (Prompt Craft) + AVEC-QUOI (Context) + POURQUOI (Intent) + QUAND ASSEZ BIEN (Specification). Ensemble ils forment le framework complet — l\'un sans l\'autre est incomplet.',
      },
      bloomLevel: 2,
      euAiActRelevant: false,
      points: 5,
    },
    {
      id: 'w4-q5',
      question: 'Wat moet een QA checklist voor AI-gegenereerde code minimaal afdekken volgens Les 5.5?',
      questionI18n: {
        en: 'What must a QA checklist for AI-generated code cover at minimum according to Lesson 5.5?',
        nl: 'Wat moet een QA checklist voor AI-gegenereerde code minimaal afdekken volgens Les 5.5?',
        fr: 'Que doit couvrir au minimum une checklist QA pour le code généré par IA selon la Leçon 5.5 ?',
      },
      options: [
        'Alleen code style en formatting',
        'Security (SQLi/XSS/creds/PAN-CVV/prompt-injection) + Correctheid (null/BigDecimal/UTC) + EU AI Act (override/logging/explainability)',
        'Alleen unit test coverage ≥80%',
        'Alleen de CI/CD pipeline status',
      ],
      optionsI18n: {
        en: [
          'Only code style and formatting',
          'Security (SQLi/XSS/creds/PAN-CVV/prompt-injection) + Correctness (null/BigDecimal/UTC) + EU AI Act (override/logging/explainability)',
          'Only unit test coverage ≥80%',
          'Only CI/CD pipeline status',
        ],
        nl: [
          'Alleen code style en formatting',
          'Security (SQLi/XSS/creds/PAN-CVV/prompt-injection) + Correctheid (null/BigDecimal/UTC) + EU AI Act (override/logging/explainability)',
          'Alleen unit test coverage ≥80%',
          'Alleen de CI/CD pipeline status',
        ],
        fr: [
          'Seulement le style et formatage du code',
          'Security (SQLi/XSS/creds/PAN-CVV/prompt-injection) + Exactitude (null/BigDecimal/UTC) + EU AI Act (override/logging/explainability)',
          'Seulement la couverture de tests unitaires ≥80%',
          'Seulement le statut du pipeline CI/CD',
        ],
      },
      correctIndex: 1,
      explanation: 'De QA checklist heeft drie categorieën. Security items zijn blockers — code gaat NIET door zonder check. Correctheid vangt null/undefined, monetary BigDecimal, UTC timestamps. EU AI Act vereisten gelden voor hoog-risico systemen.',
      explanationI18n: {
        en: 'The QA checklist has three categories. Security items are blockers — code does NOT ship without check. Correctness catches null/undefined, monetary BigDecimal, UTC timestamps. EU AI Act requirements apply to high-risk systems.',
        nl: 'De QA checklist heeft drie categorieën. Security items zijn blockers — code gaat NIET door zonder check. Correctheid vangt null/undefined, monetary BigDecimal, UTC timestamps. EU AI Act vereisten gelden voor hoog-risico systemen.',
        fr: 'La checklist QA a trois catégories. Les items Security sont des blockers — le code ne passe PAS sans vérification. Exactitude attrape null/undefined, BigDecimal monétaire, timestamps UTC. Les exigences EU AI Act s\'appliquent aux systèmes à haut risque.',
      },
      bloomLevel: 3,
      euAiActRelevant: true,
      points: 10,
    },
  ],
  days: [
    // ───── DAG 1: Les 5.1 + Lab 5A ─────
    {
      day: 1,
      title: 'Les 5.1 — Van Vaag naar Exact',
      titleI18n: {
        en: 'Lesson 5.1 — From Vague to Exact',
        nl: 'Les 5.1 — Van Vaag naar Exact',
        fr: 'Leçon 5.1 — Du Vague à l\'Exact',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w4d1-theory',
          title: 'Les 5.1 — Van Vaag naar Exact',
          titleI18n: {
            en: 'Lesson 5.1 — From Vague to Exact',
            nl: 'Les 5.1 — Van Vaag naar Exact',
            fr: 'Leçon 5.1 — Du Vague à l\'Exact',
          },
          type: 'theory',
          duration: 20,
          description: 'Het probleem: AI-output zonder spec · Twee dimensies: functioneel (GIVEN/WHEN/THEN) + kwaliteit (acceptance criteria)',
          descriptionI18n: {
            en: 'The problem: AI output without spec · Two dimensions: functional (GIVEN/WHEN/THEN) + quality (acceptance criteria)',
            nl: 'Het probleem: AI-output zonder spec · Twee dimensies: functioneel (GIVEN/WHEN/THEN) + kwaliteit (acceptance criteria)',
            fr: 'Le problème : sortie IA sans spec · Deux dimensions : fonctionnel (GIVEN/WHEN/THEN) + qualité (critères d\'acceptation)',
          },
          content: LESSON_5_1_NL,
          contentI18n: { en: LESSON_5_1_EN, nl: LESSON_5_1_NL, fr: LESSON_5_1_FR },
        },
        {
          id: 'w4d1-lab',
          title: 'Lab 5A — Pain Lab: Spec-loze Output',
          titleI18n: {
            en: 'Lab 5A — Pain Lab: Spec-less Output',
            nl: 'Lab 5A — Pain Lab: Spec-loze Output',
            fr: 'Lab 5A — Pain Lab : Sortie Sans Spec',
          },
          type: 'lab',
          duration: 30,
          description: 'NotificationBell component — zonder spec vs met GIVEN/WHEN/THEN + acceptance criteria · before/after vergelijking',
          descriptionI18n: {
            en: 'NotificationBell component — without spec vs with GIVEN/WHEN/THEN + acceptance criteria · before/after comparison',
            nl: 'NotificationBell component — zonder spec vs met GIVEN/WHEN/THEN + acceptance criteria · before/after vergelijking',
            fr: 'Composant NotificationBell — sans spec vs avec GIVEN/WHEN/THEN + critères d\'acceptation · comparaison before/after',
          },
          content: LAB_5A_NL,
          contentI18n: { en: LAB_5A_EN, nl: LAB_5A_NL, fr: LAB_5A_FR },
          exercises: [
            {
              id: 'w4d1-ex1',
              title: 'Before/After NotificationBell + vergelijking',
              titleI18n: {
                en: 'Before/After NotificationBell + comparison',
                nl: 'Before/After NotificationBell + vergelijking',
                fr: 'NotificationBell before/after + comparaison',
              },
              instructions: 'Bouw NotificationBell zonder spec, dan met GIVEN/WHEN/THEN + acceptance criteria. Vergelijk: welke edge cases dekte de AI zonder spec? Hoeveel iteraties extra zou je nodig hebben?',
              instructionsI18n: {
                en: 'Build NotificationBell without spec, then with GIVEN/WHEN/THEN + acceptance criteria. Compare: which edge cases did AI cover without spec? How many extra iterations would you need?',
                nl: 'Bouw NotificationBell zonder spec, dan met GIVEN/WHEN/THEN + acceptance criteria. Vergelijk: welke edge cases dekte de AI zonder spec? Hoeveel iteraties extra zou je nodig hebben?',
                fr: 'Construisez NotificationBell sans spec, puis avec GIVEN/WHEN/THEN + critères d\'acceptation. Comparez : quels edge cases l\'IA a-t-elle couvert sans spec ? Combien d\'itérations supplémentaires faudrait-il ?',
              },
              type: 'free-form',
              difficulty: 1,
              points: 10,
            },
          ],
        },
      ],
    },
    // ───── DAG 2: Les 5.2 + Scenario-lab ─────
    {
      day: 2,
      title: 'Les 5.2 — GIVEN/WHEN/THEN voor Prompts',
      titleI18n: {
        en: 'Lesson 5.2 — GIVEN/WHEN/THEN for Prompts',
        nl: 'Les 5.2 — GIVEN/WHEN/THEN voor Prompts',
        fr: 'Leçon 5.2 — GIVEN/WHEN/THEN pour les Prompts',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w4d2-theory',
          title: 'Les 5.2 — GIVEN/WHEN/THEN voor Prompts',
          titleI18n: {
            en: 'Lesson 5.2 — GIVEN/WHEN/THEN for Prompts',
            nl: 'Les 5.2 — GIVEN/WHEN/THEN voor Prompts',
            fr: 'Leçon 5.2 — GIVEN/WHEN/THEN pour les Prompts',
          },
          type: 'theory',
          duration: 20,
          description: 'BDD → prompt engineering · Worldline TransactionOverview voorbeeld · Acceptance criteria als prompt section',
          descriptionI18n: {
            en: 'BDD → prompt engineering · Worldline TransactionOverview example · Acceptance criteria as prompt section',
            nl: 'BDD → prompt engineering · Worldline TransactionOverview voorbeeld · Acceptance criteria als prompt section',
            fr: 'BDD → prompt engineering · exemple Worldline TransactionOverview · critères d\'acceptation comme section du prompt',
          },
          content: LESSON_5_2_NL,
          contentI18n: { en: LESSON_5_2_EN, nl: LESSON_5_2_NL, fr: LESSON_5_2_FR },
        },
        {
          id: 'w4d2-lab',
          title: 'Lab — TransactionOverview Scenario-set',
          titleI18n: {
            en: 'Lab — TransactionOverview Scenario Set',
            nl: 'Lab — TransactionOverview Scenario-set',
            fr: 'Lab — Ensemble de Scénarios TransactionOverview',
          },
          type: 'lab',
          duration: 30,
          description: 'Schrijf GIVEN/WHEN/THEN voor 5 scenarios + 7 acceptance criteria voor een Worldline-component uit je eigen squad',
          descriptionI18n: {
            en: 'Write GIVEN/WHEN/THEN for 5 scenarios + 7 acceptance criteria for a Worldline component from your own squad',
            nl: 'Schrijf GIVEN/WHEN/THEN voor 5 scenarios + 7 acceptance criteria voor een Worldline-component uit je eigen squad',
            fr: 'Écrire GIVEN/WHEN/THEN pour 5 scénarios + 7 critères d\'acceptation pour un composant Worldline de votre propre squad',
          },
          content: LAB_5A_NL,
          contentI18n: { en: LAB_5A_EN, nl: LAB_5A_NL, fr: LAB_5A_FR },
          exercises: [
            {
              id: 'w4d2-ex1',
              title: 'Scenario-set voor eigen feature',
              titleI18n: {
                en: 'Scenario set for your own feature',
                nl: 'Scenario-set voor eigen feature',
                fr: 'Ensemble de scénarios pour votre feature',
              },
              instructions: 'Kies een feature uit je backlog. Schrijf 5 GIVEN/WHEN/THEN scenarios (happy path + 4 edge cases) + 7 acceptance criteria. Deel met je squad-partner voor review.',
              instructionsI18n: {
                en: 'Pick a feature from your backlog. Write 5 GIVEN/WHEN/THEN scenarios (happy path + 4 edge cases) + 7 acceptance criteria. Share with your squad partner for review.',
                nl: 'Kies een feature uit je backlog. Schrijf 5 GIVEN/WHEN/THEN scenarios (happy path + 4 edge cases) + 7 acceptance criteria. Deel met je squad-partner voor review.',
                fr: 'Choisissez une feature de votre backlog. Écrivez 5 scénarios GIVEN/WHEN/THEN (happy path + 4 edge cases) + 7 critères d\'acceptation. Partagez avec votre partenaire squad pour review.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 3: Les 5.3 + Lab 5B ─────
    {
      day: 3,
      title: 'Les 5.3 — AI Output Testen: Trust but Verify',
      titleI18n: {
        en: 'Lesson 5.3 — Testing AI Output: Trust but Verify',
        nl: 'Les 5.3 — AI Output Testen: Trust but Verify',
        fr: 'Leçon 5.3 — Tester la Sortie IA : Trust but Verify',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w4d3-theory',
          title: 'Les 5.3 — AI Output Testen: Trust but Verify',
          titleI18n: {
            en: 'Lesson 5.3 — Testing AI Output: Trust but Verify',
            nl: 'Les 5.3 — AI Output Testen: Trust but Verify',
            fr: 'Leçon 5.3 — Tester la Sortie IA : Trust but Verify',
          },
          type: 'theory',
          duration: 20,
          description: 'AI Test Piramide (compiler/unit/integration/manual) · RALF loop als kwaliteitspoort · Test-Driven AI Development (5x sneller)',
          descriptionI18n: {
            en: 'AI Test Pyramid (compiler/unit/integration/manual) · RALF loop as quality gate · Test-Driven AI Development (5x faster)',
            nl: 'AI Test Piramide (compiler/unit/integration/manual) · RALF loop als kwaliteitspoort · Test-Driven AI Development (5x sneller)',
            fr: 'Pyramide de Tests IA (compilateur/unit/integration/manual) · boucle RALF comme quality gate · Test-Driven AI Development (5x plus rapide)',
          },
          content: LESSON_5_3_NL,
          contentI18n: { en: LESSON_5_3_EN, nl: LESSON_5_3_NL, fr: LESSON_5_3_FR },
        },
        {
          id: 'w4d3-lab',
          title: 'Lab 5B — Full Stack Feature met 4 Disciplines',
          titleI18n: {
            en: 'Lab 5B — Full Stack Feature with 4 Disciplines',
            nl: 'Lab 5B — Full Stack Feature met 4 Disciplines',
            fr: 'Lab 5B — Feature Full Stack avec 4 Disciplines',
          },
          type: 'lab',
          duration: 45,
          description: 'Integratielab: Intent → Context → Prompt → Specification → Execute & Verify. 7 stappen, 45 min, 1 feature van je dagelijks werk',
          descriptionI18n: {
            en: 'Integration lab: Intent → Context → Prompt → Specification → Execute & Verify. 7 steps, 45 min, 1 feature from your daily work',
            nl: 'Integratielab: Intent → Context → Prompt → Specification → Execute & Verify. 7 stappen, 45 min, 1 feature van je dagelijks werk',
            fr: 'Lab d\'intégration : Intent → Context → Prompt → Specification → Execute & Verify. 7 étapes, 45 min, 1 feature de votre travail quotidien',
          },
          content: LAB_5B_NL,
          contentI18n: { en: LAB_5B_EN, nl: LAB_5B_NL, fr: LAB_5B_FR },
          exercises: [
            {
              id: 'w4d3-ex1',
              title: 'Full stack feature — alle 4 disciplines',
              titleI18n: {
                en: 'Full stack feature — all 4 disciplines',
                nl: 'Full stack feature — alle 4 disciplines',
                fr: 'Feature full stack — les 4 disciplines',
              },
              instructions: 'Kies 1 feature (dashboard widget / API endpoint / validatieform). Lever op: Goal Hierarchy + Pentagon prompt + GIVEN/WHEN/THEN + 5 acceptance criteria + werkende code + test-resultaten + RALF review notes.',
              instructionsI18n: {
                en: 'Pick 1 feature (dashboard widget / API endpoint / validation form). Deliver: Goal Hierarchy + Pentagon prompt + GIVEN/WHEN/THEN + 5 acceptance criteria + working code + test results + RALF review notes.',
                nl: 'Kies 1 feature (dashboard widget / API endpoint / validatieform). Lever op: Goal Hierarchy + Pentagon prompt + GIVEN/WHEN/THEN + 5 acceptance criteria + werkende code + test-resultaten + RALF review notes.',
                fr: 'Choisissez 1 feature (widget dashboard / endpoint API / formulaire validation). Livrez : Goal Hierarchy + prompt Pentagon + GIVEN/WHEN/THEN + 5 critères d\'acceptation + code fonctionnel + résultats tests + notes review RALF.',
              },
              type: 'free-form',
              difficulty: 3,
              points: 25,
            },
          ],
        },
      ],
    },
    // ───── DAG 4: Les 5.4 + Integrated Workflow Lab ─────
    {
      day: 4,
      title: 'Les 5.4 — De 4 Disciplines Gecombineerd',
      titleI18n: {
        en: 'Lesson 5.4 — The 4 Disciplines Combined',
        nl: 'Les 5.4 — De 4 Disciplines Gecombineerd',
        fr: 'Leçon 5.4 — Les 4 Disciplines Combinées',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w4d4-theory',
          title: 'Les 5.4 — De 4 Disciplines Gecombineerd',
          titleI18n: {
            en: 'Lesson 5.4 — The 4 Disciplines Combined',
            nl: 'Les 5.4 — De 4 Disciplines Gecombineerd',
            fr: 'Leçon 5.4 — Les 4 Disciplines Combinées',
          },
          type: 'theory',
          duration: 15,
          description: 'Integrated workflow: Intent → Context → Prompt → Spec → Execute. 9 min prep, 30-80 min gespaard. Compounding na 3 maanden',
          descriptionI18n: {
            en: 'Integrated workflow: Intent → Context → Prompt → Spec → Execute. 9 min prep, 30-80 min saved. Compounding after 3 months',
            nl: 'Integrated workflow: Intent → Context → Prompt → Spec → Execute. 9 min prep, 30-80 min gespaard. Compounding na 3 maanden',
            fr: 'Workflow intégré : Intent → Context → Prompt → Spec → Execute. 9 min prep, 30-80 min économisées. Compounding après 3 mois',
          },
          content: LESSON_5_4_NL,
          contentI18n: { en: LESSON_5_4_EN, nl: LESSON_5_4_NL, fr: LESSON_5_4_FR },
        },
        {
          id: 'w4d4-lab',
          title: 'Lab — Integrated Workflow op Eigen Taak',
          titleI18n: {
            en: 'Lab — Integrated Workflow on Your Own Task',
            nl: 'Lab — Integrated Workflow op Eigen Taak',
            fr: 'Lab — Workflow Intégré sur Votre Propre Tâche',
          },
          type: 'lab',
          duration: 30,
          description: 'Pak een taak uit je Jira backlog. Doorloop alle 5 stappen. Meet de tijd per stap. Vergelijk met je gebruikelijke workflow',
          descriptionI18n: {
            en: 'Pick a task from your Jira backlog. Run through all 5 steps. Measure time per step. Compare to your usual workflow',
            nl: 'Pak een taak uit je Jira backlog. Doorloop alle 5 stappen. Meet de tijd per stap. Vergelijk met je gebruikelijke workflow',
            fr: 'Prenez une tâche de votre backlog Jira. Parcourez les 5 étapes. Mesurez le temps par étape. Comparez à votre workflow habituel',
          },
          content: LAB_5B_NL,
          contentI18n: { en: LAB_5B_EN, nl: LAB_5B_NL, fr: LAB_5B_FR },
          exercises: [
            {
              id: 'w4d4-ex1',
              title: '5-stappen workflow met tijdsmeting',
              titleI18n: {
                en: '5-step workflow with time measurement',
                nl: '5-stappen workflow met tijdsmeting',
                fr: 'Workflow 5 étapes avec mesure du temps',
              },
              instructions: 'Eigen Jira taak: Intent (2 min) + Context (1 min) + Prompt (3 min) + Spec (3 min) + Execute (15-30 min). Noteer werkelijke tijden. Vergelijk met gebruikelijke workflow voor soortgelijke taken.',
              instructionsI18n: {
                en: 'Own Jira task: Intent (2 min) + Context (1 min) + Prompt (3 min) + Spec (3 min) + Execute (15-30 min). Note actual times. Compare to usual workflow for similar tasks.',
                nl: 'Eigen Jira taak: Intent (2 min) + Context (1 min) + Prompt (3 min) + Spec (3 min) + Execute (15-30 min). Noteer werkelijke tijden. Vergelijk met gebruikelijke workflow voor soortgelijke taken.',
                fr: 'Votre tâche Jira : Intent (2 min) + Context (1 min) + Prompt (3 min) + Spec (3 min) + Execute (15-30 min). Notez les temps réels. Comparez au workflow habituel pour des tâches similaires.',
              },
              type: 'free-form',
              difficulty: 2,
              points: 15,
            },
          ],
        },
      ],
    },
    // ───── DAG 5: Les 5.5 + Builder Challenge Finale ─────
    {
      day: 5,
      title: 'Les 5.5 — AI Testing voor QA Professionals',
      titleI18n: {
        en: 'Lesson 5.5 — AI Testing for QA Professionals',
        nl: 'Les 5.5 — AI Testing voor QA Professionals',
        fr: 'Leçon 5.5 — Tests IA pour Professionnels QA',
      },
      schedule: dailySchedule,
      lessons: [
        {
          id: 'w4d5-theory',
          title: 'Les 5.5 — AI Testing voor QA Professionals',
          titleI18n: {
            en: 'Lesson 5.5 — AI Testing for QA Professionals',
            nl: 'Les 5.5 — AI Testing voor QA Professionals',
            fr: 'Leçon 5.5 — Tests IA pour Professionnels QA',
          },
          type: 'theory',
          duration: 15,
          description: '3 lagen AI testing: prompt-tests + regression + bias auditing (EU AI Act) · QA checklist security/correctheid/compliance · Pentagon voor QA',
          descriptionI18n: {
            en: '3 layers AI testing: prompt tests + regression + bias auditing (EU AI Act) · QA checklist security/correctness/compliance · Pentagon for QA',
            nl: '3 lagen AI testing: prompt-tests + regression + bias auditing (EU AI Act) · QA checklist security/correctheid/compliance · Pentagon voor QA',
            fr: '3 couches tests IA : tests prompts + régression + audit de biais (EU AI Act) · checklist QA security/exactitude/conformité · Pentagon pour QA',
          },
          content: LESSON_5_5_NL,
          contentI18n: { en: LESSON_5_5_EN, nl: LESSON_5_5_NL, fr: LESSON_5_5_FR },
        },
        {
          id: 'w4d5-lab',
          title: 'Rol-opdracht — Builder Challenge Finale',
          titleI18n: {
            en: 'Role Assignment — Builder Challenge Finale',
            nl: 'Rol-opdracht — Builder Challenge Finale',
            fr: 'Mission de rôle — Finale Builder Challenge',
          },
          type: 'lab',
          duration: 60,
          description: 'De Builder Challenge uit Level 4 wordt productieklaar. Per rol: specificaties + AI-tests + resultaten. 6 rol-tracks (Backend/Frontend/QA/PM-UX/Managers/Advanced)',
          descriptionI18n: {
            en: 'The Builder Challenge from Level 4 becomes production-ready. Per role: specifications + AI-tests + results. 6 role tracks (Backend/Frontend/QA/PM-UX/Managers/Advanced)',
            nl: 'De Builder Challenge uit Level 4 wordt productieklaar. Per rol: specificaties + AI-tests + resultaten. 6 rol-tracks (Backend/Frontend/QA/PM-UX/Managers/Advanced)',
            fr: 'Le Builder Challenge de Level 4 devient prêt pour la production. Par rôle : spécifications + tests IA + résultats. 6 rôles (Backend/Frontend/QA/PM-UX/Managers/Advanced)',
          },
          content: LAB_5B_NL,
          contentI18n: { en: LAB_5B_EN, nl: LAB_5B_NL, fr: LAB_5B_FR },
          exercises: [
            {
              id: 'w4d5-ex1',
              title: 'Builder Challenge Finale — eigen rol-track',
              titleI18n: {
                en: 'Builder Challenge Finale — your role track',
                nl: 'Builder Challenge Finale — eigen rol-track',
                fr: 'Finale Builder Challenge — votre rôle',
              },
              instructions: 'Pak je Builder Challenge uit Level 4. Schrijf specificaties voor je deliverable. Laat Claude tests genereren. Run. Itereer. Badge-criteria per rol: ≥80% van AI-gegenereerde tests slaagt direct, spec is review-ready zonder mondelinge uitleg.',
              instructionsI18n: {
                en: 'Take your Builder Challenge from Level 4. Write specs for your deliverable. Let Claude generate tests. Run. Iterate. Badge criteria per role: ≥80% of AI-generated tests pass immediately, spec is review-ready without verbal explanation.',
                nl: 'Pak je Builder Challenge uit Level 4. Schrijf specificaties voor je deliverable. Laat Claude tests genereren. Run. Itereer. Badge-criteria per rol: ≥80% van AI-gegenereerde tests slaagt direct, spec is review-ready zonder mondelinge uitleg.',
                fr: 'Reprenez votre Builder Challenge de Level 4. Écrivez des specs pour votre deliverable. Laissez Claude générer les tests. Lancez. Itérez. Critères badge par rôle : ≥80% des tests générés par IA passent immédiatement, la spec est review-ready sans explication orale.',
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
