import type { ScheduleBlock } from './curriculum-schedule';
import { WEEK_0 } from './curriculum-week-0';
import { WEEK_1 } from './curriculum-week-1';
import { WEEK_2 } from './curriculum-week-2';
import { WEEK_3 } from './curriculum-week-3';
import { WEEK_4 } from './curriculum-week-4';
import { WEEK_5 } from './curriculum-week-5';
import { WEEK_6 } from './curriculum-week-6';
import { WEEK_7 } from './curriculum-week-7';

// ── Bloom's Taxonomy levels ───────────────────────────────────────────────────
export type BloomLevel = 1 | 2 | 3 | 4 | 5 | 6;
// 1=Remember 2=Understand 3=Apply 4=Analyse 5=Evaluate 6=Create

// ── MCQ for compliance assessment ────────────────────────────────────────────
/** Per-locale string (Phase 6 i18n architecture) */
export type McqLocaleMap = { en?: string; nl?: string; fr?: string };
export type McqOptionsLocaleMap = {
  en?: [string, string, string, string];
  nl?: [string, string, string, string];
  fr?: [string, string, string, string];
};

export interface McqQuestion {
  id: string;
  question: string;                           // fallback when questionI18n not set
  options: [string, string, string, string]; // always 4 options — fallback
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;                        // shown after answer — fallback
  bloomLevel: BloomLevel;
  euAiActRelevant: boolean;                   // flags compliance-critical questions
  points: number;
  /** [Phase 6 Wave B] Per-locale question text override */
  questionI18n?: McqLocaleMap;
  /** [Phase 6 Wave B] Per-locale 4 options override */
  optionsI18n?: McqOptionsLocaleMap;
  /** [Phase 6 Wave B] Per-locale explanation override */
  explanationI18n?: McqLocaleMap;
}

/** Phase 6 Wave B helper: resolve MCQ in user's locale.
 *  Fallback chain: locale → en → original `question`/`options`/`explanation` field. */
export function getLocalizedMcq(q: McqQuestion, locale: string): {
  question: string;
  options: [string, string, string, string];
  explanation: string;
} {
  const lang = (locale === 'nl' || locale === 'fr' || locale === 'en') ? locale : 'en';
  return {
    question: q.questionI18n?.[lang] ?? q.questionI18n?.en ?? q.question,
    options: q.optionsI18n?.[lang] ?? q.optionsI18n?.en ?? q.options,
    explanation: q.explanationI18n?.[lang] ?? q.explanationI18n?.en ?? q.explanation,
  };
}

/** Phase 7 — i18n locale map for curriculum strings */
export type CurriculumLocaleMap = { en?: string; nl?: string; fr?: string };
export type CurriculumLocaleArrayMap = { en?: string[]; nl?: string[]; fr?: string[] };

export interface CurriculumWeek {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  targetAudience: string;
  bloomLevels?: BloomLevel[];                 // which Bloom levels this week covers
  days: CurriculumDay[];
  weeklyQuiz?: McqQuestion[];                 // 5-8 MCQ per week for retention
  complianceRelevant?: boolean;               // marks EU AI Act content
  badgeName?: string;
  badgeIcon?: string;
  // [Phase 7] Per-locale overrides — fall back to the non-i18n field if missing
  titleI18n?: CurriculumLocaleMap;
  subtitleI18n?: CurriculumLocaleMap;
  descriptionI18n?: CurriculumLocaleMap;
  objectivesI18n?: CurriculumLocaleArrayMap;
  targetAudienceI18n?: CurriculumLocaleMap;
  badgeNameI18n?: CurriculumLocaleMap;
}

export interface CurriculumDay {
  day: number;
  title: string;
  schedule: ScheduleBlock[];
  lessons: CurriculumLesson[];
  // [Phase 7] Per-locale title override
  titleI18n?: CurriculumLocaleMap;
}

// ScheduleBlock moved to curriculum-schedule.ts — re-export for backwards compatibility
export type { ScheduleBlock } from './curriculum-schedule';

export interface CurriculumLesson {
  id: string;
  title: string;
  type: 'theory' | 'demo' | 'lab' | 'review' | 'mixed';
  duration: number;
  description: string;
  content: string;
  exercises?: CurriculumExercise[];
  // [Phase 7] Per-locale overrides — fall back to NL field if locale missing
  titleI18n?: CurriculumLocaleMap;
  descriptionI18n?: CurriculumLocaleMap;
  contentI18n?: CurriculumLocaleMap;
}

export interface CurriculumExercise {
  id: string;
  title: string;
  instructions: string;
  type: 'prompt-craft' | 'code-review' | 'free-form' | 'multiple-choice' | 'peer-review';
  difficulty: number;
  points: number;
  // [Phase 7] Per-locale overrides
  titleI18n?: CurriculumLocaleMap;
  instructionsI18n?: CurriculumLocaleMap;
}

// ───────── Phase 7 helpers — resolve i18n with fallback ─────────
function pickLocale(locale: string): 'en' | 'nl' | 'fr' {
  return (locale === 'nl' || locale === 'fr' || locale === 'en') ? locale : 'en';
}

export function getLocalizedWeek(w: CurriculumWeek, locale: string) {
  const l = pickLocale(locale);
  return {
    ...w,
    title: w.titleI18n?.[l] ?? w.titleI18n?.en ?? w.title,
    subtitle: w.subtitleI18n?.[l] ?? w.subtitleI18n?.en ?? w.subtitle,
    description: w.descriptionI18n?.[l] ?? w.descriptionI18n?.en ?? w.description,
    objectives: w.objectivesI18n?.[l] ?? w.objectivesI18n?.en ?? w.objectives,
    targetAudience: w.targetAudienceI18n?.[l] ?? w.targetAudienceI18n?.en ?? w.targetAudience,
    badgeName: w.badgeNameI18n?.[l] ?? w.badgeNameI18n?.en ?? w.badgeName,
  };
}

export function getLocalizedDay(d: CurriculumDay, locale: string) {
  const l = pickLocale(locale);
  return {
    ...d,
    title: d.titleI18n?.[l] ?? d.titleI18n?.en ?? d.title,
  };
}

export function getLocalizedLesson(les: CurriculumLesson, locale: string) {
  const l = pickLocale(locale);
  return {
    ...les,
    title: les.titleI18n?.[l] ?? les.titleI18n?.en ?? les.title,
    description: les.descriptionI18n?.[l] ?? les.descriptionI18n?.en ?? les.description,
    content: les.contentI18n?.[l] ?? les.contentI18n?.en ?? les.content,
  };
}

export function getLocalizedExercise(ex: CurriculumExercise, locale: string) {
  const l = pickLocale(locale);
  return {
    ...ex,
    title: ex.titleI18n?.[l] ?? ex.titleI18n?.en ?? ex.title,
    instructions: ex.instructionsI18n?.[l] ?? ex.instructionsI18n?.en ?? ex.instructions,
  };
}

// Moved to curriculum-schedule.ts to break circular import TDZ
// Re-export for backwards compatibility.
export { dailySchedule } from './curriculum-schedule';

export const curriculum: CurriculumWeek[] = [
  WEEK_0,


  WEEK_1,


  // ── WEEK 2-3: SQUAD A ──
  WEEK_2,

  // ── WEEK 4-5: SQUAD B ──
  WEEK_3,

  // ── WEEK 4 / LEVEL 5: SPECIFICATION ENGINEERING ──
  WEEK_4,

  // ── WEEK 5 / LEVEL 6: MODEL LANDSCAPE ──
  WEEK_5,

  // ── WEEK 6 / LEVEL 7: CLAUDE CODE MASTERY ──
  WEEK_6,

  // ── WEEK 7 / LEVEL 8: RALF LOOP & SCALE (AI-DRAFT v0.1) ──
  WEEK_7,

  // ── WEEK 8-9: CONSOLIDATIE ──
  {
    id: 'week-8-9',
    number: 8,
    title: 'Consolidatie & Capstone',
    titleI18n: {
      en: 'Consolidation & Capstone',
      nl: 'Consolidatie & Capstone',
      fr: 'Consolidation & Capstone',
    },
    subtitle: 'Office Hours, Kennisdeling & Capstone',
    subtitleI18n: {
      en: 'Office Hours, Knowledge Sharing & Capstone',
      nl: 'Office Hours, Kennisdeling & Capstone',
      fr: 'Office Hours, partage de connaissances & Capstone',
    },
    description: 'De laatste twee weken brengen alle squads samen. Open office hours, cross-squad kennisdeling, en de mini-capstone waar elk squad hun AI-workflow improvement presenteert.',
    descriptionI18n: {
      en: 'The last two weeks bring all squads together. Open office hours, cross-squad knowledge sharing, and the mini-capstone where each squad presents their AI workflow improvement.',
      nl: 'De laatste twee weken brengen alle squads samen. Open office hours, cross-squad kennisdeling, en de mini-capstone waar elk squad hun AI-workflow improvement presenteert.',
      fr: 'Les deux dernières semaines réunissent toutes les squads. Office hours ouvertes, partage de connaissances inter-squads, et le mini-capstone où chaque squad présente son amélioration de workflow IA.',
    },
    objectives: [
      'Deel kennis en ervaringen tussen squads',
      'Identificeer AI Champions voor Wave 2',
      'Presenteer squad capstone project',
      'RALF retrospective over het hele traject',
    ],
    objectivesI18n: {
      en: [
        'Share knowledge and experiences between squads',
        'Identify AI Champions for Wave 2',
        'Present squad capstone project',
        'RALF retrospective over the entire journey',
      ],
      nl: [
        'Deel kennis en ervaringen tussen squads',
        'Identificeer AI Champions voor Wave 2',
        'Presenteer squad capstone project',
        'RALF retrospective over het hele traject',
      ],
      fr: [
        'Partagez connaissances et expériences entre squads',
        'Identifiez les AI Champions pour Wave 2',
        'Présentez le projet capstone de la squad',
        'Rétrospective RALF sur l\'ensemble du parcours',
      ],
    },
    targetAudience: 'Alle squads (A + B + C)',
    targetAudienceI18n: {
      en: 'All squads (A + B + C)',
      nl: 'Alle squads (A + B + C)',
      fr: 'Toutes les squads (A + B + C)',
    },
    badgeName: 'RALF Champion',
    badgeNameI18n: {
      en: 'RALF Champion',
      nl: 'RALF Champion',
      fr: 'RALF Champion',
    },
    badgeIcon: '🏆',
        weeklyQuiz: [
      {
        id: 'w8-q1',
        question: 'Na 9 weken training: wat is het meest waardevolle dat je kunt bijdragen aan je team?',
        questionI18n: {
          en: 'After 9 weeks of training: what is the most valuable thing you can contribute to your team?',
          nl: 'Na 9 weken training: wat is het meest waardevolle dat je kunt bijdragen aan je team?',
          fr: 'Après 9 semaines de formation : quelle est la chose la plus précieuse que vous pouvez apporter à votre équipe ?',
        },
        options: ['Meer code schrijven met AI', 'Je kennis overdragen — anderen leren hoe ze AI effectief gebruiken', 'Alle AI-tools voor je team selecteren', 'AI-gebruik documenteren in een rapport'],
        optionsI18n: {
          en: ['Write more code with AI', 'Transfer your knowledge — teach others how to use AI effectively', 'Select all AI tools for your team', 'Document AI usage in a report'],
          nl: ['Meer code schrijven met AI', 'Je kennis overdragen — anderen leren hoe ze AI effectief gebruiken', 'Alle AI-tools voor je team selecteren', 'AI-gebruik documenteren in een rapport'],
          fr: ['Écrire plus de code avec l\'IA', 'Transférer vos connaissances — apprendre aux autres à utiliser l\'IA efficacement', 'Sélectionner tous les outils IA pour votre équipe', 'Documenter l\'utilisation de l\'IA dans un rapport'],
        },
        correctIndex: 1,
        explanation: 'Kennisoverdracht is de multiplicator. Eén AI-native engineer die vijf anderen traint creëert 5x de impact. De capstone-presentatie is geen afsluiting — het is het begin van je rol als AI-champion in je team.',
        explanationI18n: {
          en: 'Knowledge transfer is the multiplier. One AI-native engineer who trains five others creates 5x the impact. The capstone presentation is not a closing — it is the start of your role as an AI champion in your team.',
          nl: 'Kennisoverdracht is de multiplicator. Eén AI-native engineer die vijf anderen traint creëert 5x de impact. De capstone-presentatie is geen afsluiting — het is het begin van je rol als AI-champion in je team.',
          fr: 'Le transfert de connaissances est le multiplicateur. Un ingénieur AI-native qui forme cinq autres crée 5x l\'impact. La présentation capstone n\'est pas une conclusion — c\'est le début de votre rôle de champion IA dans votre équipe.',
        },
        bloomLevel: 5,
        euAiActRelevant: false,
        points: 10,
      },
      {
        id: 'w8-q2',
        question: 'Wat is de kernboodschap van de RALF retrospective in week 8-9?',
        questionI18n: {
          en: 'What is the core message of the RALF retrospective in weeks 8-9?',
          nl: 'Wat is de kernboodschap van de RALF retrospective in week 8-9?',
          fr: 'Quel est le message central de la rétrospective RALF en semaines 8-9 ?',
        },
        options: ['Evalueer welke AI-tools je gebruikt hebt', 'Identificeer patronen in wat werkte en codificeer ze als CLAUDE.md regels en skills', 'Bereken je ROI van de training', 'Plan de volgende AI-training'],
        optionsI18n: {
          en: ['Evaluate which AI tools you used', 'Identify patterns in what worked and codify them as CLAUDE.md rules and skills', 'Calculate your ROI from the training', 'Plan the next AI training'],
          nl: ['Evalueer welke AI-tools je gebruikt hebt', 'Identificeer patronen in wat werkte en codificeer ze als CLAUDE.md regels en skills', 'Bereken je ROI van de training', 'Plan de volgende AI-training'],
          fr: ['Évaluer quels outils IA vous avez utilisés', 'Identifier les motifs de ce qui a fonctionné et les codifier comme règles CLAUDE.md et skills', 'Calculer votre ROI de la formation', 'Planifier la prochaine formation IA'],
        },
        correctIndex: 1,
        explanation: 'De wekelijkse RALF retrospective converteert individuele lessen naar teamkennis: wat werkte wordt een CLAUDE.md regel, wat mislukte wordt een anti-pattern in je skills. Zo compound je de leeruitkomsten.',
        explanationI18n: {
          en: 'The weekly RALF retrospective converts individual lessons into team knowledge: what worked becomes a CLAUDE.md rule, what failed becomes an anti-pattern in your skills. This is how you compound the learning outcomes.',
          nl: 'De wekelijkse RALF retrospective converteert individuele lessen naar teamkennis: wat werkte wordt een CLAUDE.md regel, wat mislukte wordt een anti-pattern in je skills. Zo compound je de leeruitkomsten.',
          fr: 'La rétrospective RALF hebdomadaire convertit les leçons individuelles en connaissances d\'équipe : ce qui a fonctionné devient une règle CLAUDE.md, ce qui a échoué devient un anti-pattern dans vos skills. C\'est ainsi que vous démultipliez les acquis d\'apprentissage.',
        },
        bloomLevel: 5,
        euAiActRelevant: false,
        points: 10,
      },
      {
        id: 'w8-q3',
        question: 'Wanneer gaan de EU AI Act-verplichtingen voor hoog-risico AI-systemen in de financiële sector gelden?',
        questionI18n: {
          en: 'When do the EU AI Act obligations for high-risk AI use cases in the financial sector apply?',
          nl: 'Wanneer gaan de EU AI Act-verplichtingen voor hoog-risico AI-toepassingen in de financiële sector gelden?',
          fr: 'Quand les obligations de l\'EU AI Act pour les cas d\'usage IA à haut risque dans le secteur financier s\'appliquent-elles ?',
        },
        options: ['Februari 2025', 'Augustus 2026', 'December 2027', 'Augustus 2028'],
        optionsI18n: {
          en: ['February 2025', 'August 2026', 'December 2027', 'August 2028'],
          nl: ['Februari 2025', 'Augustus 2026', 'December 2027', 'Augustus 2028'],
          fr: ['Février 2025', 'Août 2026', 'Décembre 2027', 'Août 2028'],
        },
        correctIndex: 2,
        explanation: 'Voor hoog-risico AI-toepassingen in de financiële sector gelden de relevante EU AI Act-verplichtingen vanaf 2 december 2027. Augustus 2026 is de algemene toepassingsdatum, niet de Annex III-deadline voor deze use case.',
        explanationI18n: {
          en: 'For high-risk AI use cases in the financial sector, the relevant EU AI Act obligations apply from 2 December 2027. August 2026 is the general application date, not the Annex III deadline for this use case.',
          nl: 'Voor hoog-risico AI-toepassingen in de financiële sector gelden de relevante EU AI Act-verplichtingen vanaf 2 december 2027. Augustus 2026 is de algemene toepassingsdatum, niet de Annex III-deadline voor deze use case.',
          fr: 'Pour les cas d\'usage IA à haut risque dans le secteur financier, les obligations pertinentes de l\'EU AI Act s\'appliquent à partir du 2 décembre 2027. Août 2026 est la date d\'application générale, pas l\'échéance de l\'Annexe III pour ce cas.',
        },
        bloomLevel: 1,
        euAiActRelevant: true,
        points: 10,
      },
      {
        id: 'w8-q4',
        question: 'Hoe bewijs je als organisatie dat je voldoet aan EU AI Act Artikel 4 (AI-geletterdheid)?',
        questionI18n: {
          en: 'How does an organisation prove compliance with EU AI Act Article 4 (AI literacy)?',
          nl: 'Hoe bewijs je als organisatie dat je voldoet aan EU AI Act Artikel 4 (AI-geletterdheid)?',
          fr: 'Comment une organisation prouve-t-elle sa conformité à l\'article 4 de l\'EU AI Act (littératie IA) ?',
        },
        options: ['Door AI-tools te installeren bij alle medewerkers', 'Via gedocumenteerde training, assessments met slagingsdrempel, en completion records', 'Door een AI-strategie document te publiceren', 'Door een extern audit te laten uitvoeren'],
        optionsI18n: {
          en: ['By installing AI tools for all employees', 'Via documented training, assessments with a passing threshold, and completion records', 'By publishing an AI strategy document', 'By having an external audit performed'],
          nl: ['Door AI-tools te installeren bij alle medewerkers', 'Via gedocumenteerde training, assessments met slagingsdrempel, en completion records', 'Door een AI-strategie document te publiceren', 'Door een extern audit te laten uitvoeren'],
          fr: ['En installant des outils IA chez tous les collaborateurs', 'Via une formation documentée, des évaluations avec seuil de réussite et des relevés d\'achèvement', 'En publiant un document de stratégie IA', 'En faisant réaliser un audit externe'],
        },
        correctIndex: 1,
        explanation: 'EU AI Act Artikel 4 vereist AANTOONBARE AI-geletterdheid: training (gedocumenteerd), assessment (met meetbare slagingsdrempel, zoals 70%), en completion records per medewerker. Dit is precies wat de AI Literacy Compliance Toets in dit platform levert.',
        explanationI18n: {
          en: 'EU AI Act Article 4 requires DEMONSTRABLE AI literacy: training (documented), assessment (with a measurable passing threshold, such as 70%), and completion records per employee. This is exactly what the AI Literacy Compliance Test in this platform delivers.',
          nl: 'EU AI Act Artikel 4 vereist AANTOONBARE AI-geletterdheid: training (gedocumenteerd), assessment (met meetbare slagingsdrempel, zoals 70%), en completion records per medewerker. Dit is precies wat de AI Literacy Compliance Toets in dit platform levert.',
          fr: 'L\'article 4 de l\'EU AI Act exige une littératie IA DÉMONTRABLE : formation (documentée), évaluation (avec un seuil de réussite mesurable, comme 70 %) et relevés d\'achèvement par collaborateur. C\'est exactement ce que fournit le Test de Conformité Littératie IA de cette plateforme.',
        },
        bloomLevel: 3,
        euAiActRelevant: true,
        points: 10,
      },
    ],
    days: [
      {
        day: 1,
        title: 'Cross-Squad Kennisdeling',
        schedule: [
          { time: '09:00 - 09:30', emoji: '☕', label: 'Welcome back — alle squads samen', type: 'checkin' },
          { time: '09:30 - 10:30', emoji: '📚', label: 'Groep 1: Top learnings', type: 'theory' },
          { time: '10:30 - 10:45', emoji: '☕', label: 'Pauze', type: 'break' },
          { time: '10:45 - 11:45', emoji: '📚', label: 'Groep 2: Top learnings', type: 'theory' },
          { time: '11:45 - 12:30', emoji: '📚', label: 'Groep 3: Top learnings', type: 'theory' },
          { time: '12:30 - 13:30', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
          { time: '13:30 - 15:30', emoji: '🔨', label: 'Cross-squad pair programming', type: 'lab' },
          { time: '15:30 - 16:00', emoji: '🔄', label: 'Reflectie & capstone briefing', type: 'review' },
        ],
        lessons: [
          {
            id: 'w8d1-sharing',
            title: 'Cross-Squad Knowledge Sharing',
            type: 'mixed',
            duration: 180,
            description: 'Elke squad presenteert hun top 3 learnings en best practices.',
            content: `# Cross-Squad Knowledge Sharing

## 📝 Format

Elke squad krijgt **45 minuten**:

- ⏱️ 20 min presentatie *(top 3 learnings)*
- ⏱️ 15 min live demo *(beste AI-workflow)*
- ⏱️ 10 min Q&A

---

## 🔧 Voorbereiding per Squad

Bereid voor:

1. **Top 3 Learnings** — wat was het meest impactvolle dat jullie geleerd hebben?
2. **Biggest Fail** — waar ging het mis en wat leerden jullie daarvan?
3. **Best Prompt** — de prompt waar jullie het meest trots op zijn
4. **Workflow Demo** — live demo van jullie AI-workflow in actie

---

## 🚀 Cross-Squad Pair Programming

Na de presentaties: pair programming sessies.

- ✅ Twee engineers uit verschillende teams
- ✅ Werk samen aan een kleine feature
- ✅ Combineer jullie verschillende expertises
- ✅ Documenteer wat je van elkaar geleerd hebt`,
            contentI18n: {
              en: `# Cross-Squad Knowledge Sharing

## 📝 Format

Each squad gets **45 minutes**:

- ⏱️ 20 min presentation *(top 3 learnings)*
- ⏱️ 15 min live demo *(best AI workflow)*
- ⏱️ 10 min Q&A

---

## 🔧 Preparation per Squad

Prepare:

1. **Top 3 Learnings** — what was the most impactful thing you learned?
2. **Biggest Fail** — where did things go wrong and what did you learn from it?
3. **Best Prompt** — the prompt you are most proud of
4. **Workflow Demo** — live demo of your AI workflow in action

---

## 🚀 Cross-Squad Pair Programming

After the presentations: pair programming sessions.

- ✅ Two engineers from different teams
- ✅ Work together on a small feature
- ✅ Combine your different areas of expertise
- ✅ Document what you learned from each other`,
              nl: `# Cross-Squad Knowledge Sharing

## 📝 Format

Elke squad krijgt **45 minuten**:

- ⏱️ 20 min presentatie *(top 3 learnings)*
- ⏱️ 15 min live demo *(beste AI-workflow)*
- ⏱️ 10 min Q&A

---

## 🔧 Voorbereiding per Squad

Bereid voor:

1. **Top 3 Learnings** — wat was het meest impactvolle dat jullie geleerd hebben?
2. **Biggest Fail** — waar ging het mis en wat leerden jullie daarvan?
3. **Best Prompt** — de prompt waar jullie het meest trots op zijn
4. **Workflow Demo** — live demo van jullie AI-workflow in actie

---

## 🚀 Cross-Squad Pair Programming

Na de presentaties: pair programming sessies.

- ✅ Twee engineers uit verschillende teams
- ✅ Werk samen aan een kleine feature
- ✅ Combineer jullie verschillende expertises
- ✅ Documenteer wat je van elkaar geleerd hebt`,
              fr: `# Cross-Squad Knowledge Sharing

## 📝 Format

Chaque squad dispose de **45 minutes** :

- ⏱️ 20 min de présentation *(top 3 learnings)*
- ⏱️ 15 min de démo live *(le meilleur workflow IA)*
- ⏱️ 10 min de Q&A

---

## 🔧 Préparation par squad

Préparez :

1. **Top 3 Learnings** — qu'avez-vous appris de plus impactant ?
2. **Biggest Fail** — où cela a-t-il dérapé et qu'en avez-vous tiré ?
3. **Best Prompt** — le prompt dont vous êtes le plus fiers
4. **Workflow Demo** — démo live de votre workflow IA en action

---

## 🚀 Cross-Squad Pair Programming

Après les présentations : sessions de pair programming.

- ✅ Deux ingénieurs de squads différentes
- ✅ Travaillez ensemble sur une petite fonctionnalité
- ✅ Combinez vos expertises respectives
- ✅ Documentez ce que vous avez appris l'un de l'autre`,
            },
          },
        ],
      },
      {
        day: 2,
        title: 'Office Hours & Deep Dives',
        schedule: [
          { time: '09:00 - 09:30', emoji: '☕', label: 'Check-in & agenda afstemming', type: 'checkin' },
          { time: '09:30 - 12:30', emoji: '💬', label: 'Open Office Hours (roterende thema\'s)', type: 'review' },
          { time: '12:30 - 13:30', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
          { time: '13:30 - 15:30', emoji: '🔨', label: 'Capstone project werktijd', type: 'lab' },
          { time: '15:30 - 16:00', emoji: '📋', label: 'Progress check & morgen preview', type: 'wrapup' },
        ],
        lessons: [
          {
            id: 'w8d2-office',
            title: 'Office Hours — Open Q&A',
            type: 'mixed',
            duration: 180,
            description: 'Roterende thema-tafels waar engineers hun specifieke vragen kunnen stellen.',
            content: `# Office Hours

## 📝 Thema Tafels *(roterend per 45 min)*

### 🧠 Tafel 1: Prompt Engineering Deep Dive

- Pentagon optimalisatie
- L5 prompts schrijven
- Domain-specifieke patronen

---

### ⚙️ Tafel 2: MCP & Tooling

- Custom MCP servers bouwen
- Tool chaining
- Debugging MCP issues

---

### ✅ Tafel 3: Code Quality & Testing

- AI-generated tests optimaliseren
- Security review workflows
- Performance monitoring

---

### 🚀 Tafel 4: Workflow & Productivity

- CLAUDE.md best practices
- Team workflows met AI
- Knowledge sharing patronen

---

**Engineers roteren elke 45 minuten naar een andere tafel.**`,
            contentI18n: {
              en: `# Office Hours

## 📝 Theme Tables *(rotating every 45 min)*

### 🧠 Table 1: Prompt Engineering Deep Dive

- Pentagon optimisation
- Writing L5 prompts
- Domain-specific patterns

---

### ⚙️ Table 2: MCP & Tooling

- Building custom MCP servers
- Tool chaining
- Debugging MCP issues

---

### ✅ Table 3: Code Quality & Testing

- Optimising AI-generated tests
- Security review workflows
- Performance monitoring

---

### 🚀 Table 4: Workflow & Productivity

- CLAUDE.md best practices
- Team workflows with AI
- Knowledge sharing patterns

---

**Engineers rotate to a different table every 45 minutes.**`,
              nl: `# Office Hours

## 📝 Thema Tafels *(roterend per 45 min)*

### 🧠 Tafel 1: Prompt Engineering Deep Dive

- Pentagon optimalisatie
- L5 prompts schrijven
- Domain-specifieke patronen

---

### ⚙️ Tafel 2: MCP & Tooling

- Custom MCP servers bouwen
- Tool chaining
- Debugging MCP issues

---

### ✅ Tafel 3: Code Quality & Testing

- AI-generated tests optimaliseren
- Security review workflows
- Performance monitoring

---

### 🚀 Tafel 4: Workflow & Productivity

- CLAUDE.md best practices
- Team workflows met AI
- Knowledge sharing patronen

---

**Engineers roteren elke 45 minuten naar een andere tafel.**`,
              fr: `# Office Hours

## 📝 Tables thématiques *(rotation toutes les 45 min)*

### 🧠 Table 1 : Prompt Engineering Deep Dive

- Optimisation Pentagon
- Rédaction de prompts L5
- Patterns spécifiques au domaine

---

### ⚙️ Table 2 : MCP & Tooling

- Construire des serveurs MCP personnalisés
- Tool chaining
- Debug des problèmes MCP

---

### ✅ Table 3 : Code Quality & Testing

- Optimiser les tests générés par l'IA
- Workflows de revue de sécurité
- Performance monitoring

---

### 🚀 Table 4 : Workflow & Productivity

- CLAUDE.md best practices
- Workflows d'équipe avec l'IA
- Patterns de partage de connaissances

---

**Les ingénieurs changent de table toutes les 45 minutes.**`,
            },
          },
        ],
      },
      {
        day: 3,
        title: 'Capstone Presentaties & RALF Retrospective',
        schedule: [
          { time: '09:00 - 09:30', emoji: '☕', label: 'Laatste prep & setup', type: 'checkin' },
          { time: '09:30 - 11:30', emoji: '⚡', label: 'Capstone Presentaties (3 squads × 30 min)', type: 'demo' },
          { time: '11:30 - 12:00', emoji: '🏆', label: 'Awards & Badge Ceremony', type: 'wrapup' },
          { time: '12:00 - 13:00', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
          { time: '13:00 - 14:30', emoji: '🔄', label: 'RALF Retrospective — Volledig Programma', type: 'review' },
          { time: '14:30 - 15:30', emoji: '📋', label: 'Wave 2 Preview & Champion Selectie', type: 'wrapup' },
          { time: '15:30 - 16:00', emoji: '🎉', label: 'Afsluiting & Borrel', type: 'checkin' },
        ],
        lessons: [
          {
            id: 'w8d3-capstone',
            title: 'Capstone Presentaties',
            type: 'demo',
            duration: 120,
            description: 'Elk squad presenteert hun AI-workflow improvement project.',
            content: `# Mini-Capstone

## 🎯 De Opdracht

Elk squad heeft de afgelopen weken gewerkt aan een concreet project.

> 🎓 **De missie**
>
> "Verbeter één workflow in jullie dagelijks werk met AI."

---

## 📝 Presentatie Format *(30 min per squad)*

1. **Het probleem** *(5 min)* — welke workflow was inefficiënt?
2. **De oplossing** *(10 min)* — hoe hebben jullie AI geïntegreerd?
3. **Live demo** *(10 min)* — toon de nieuwe workflow in actie
4. **Resultaten** *(5 min)* — meetbare verbetering + lessons learned

---

## ✅ Evaluatie Criteria

- **Impact** — hoeveel tijd/kwaliteit wordt bespaard?
- **Reproduceerbaarheid** — kunnen andere teams dit overnemen?
- **Creativiteit** — innovatief gebruik van AI-tools
- **Presentatie** — helder, beknopt, overtuigend

---

## 🏆 Awards

- 🥇 **Best Overall** — beste combinatie van alle criteria
- 🚀 **Most Innovative** — meest creatieve AI-toepassing
- 📊 **Biggest Impact** — grootste meetbare verbetering
- 🤝 **Best Team Effort** — beste samenwerking en kennisdeling`,
            contentI18n: {
              en: `# Mini-Capstone

## 🎯 The Assignment

Each squad has worked over the past weeks on a concrete project.

> 🎓 **The mission**
>
> "Improve one workflow in your daily work with AI."

---

## 📝 Presentation Format *(30 min per squad)*

1. **The problem** *(5 min)* — which workflow was inefficient?
2. **The solution** *(10 min)* — how did you integrate AI?
3. **Live demo** *(10 min)* — show the new workflow in action
4. **Results** *(5 min)* — measurable improvement + lessons learned

---

## ✅ Evaluation Criteria

- **Impact** — how much time/quality is saved?
- **Reproducibility** — can other teams adopt it?
- **Creativity** — innovative use of AI tools
- **Presentation** — clear, concise, convincing

---

## 🏆 Awards

- 🥇 **Best Overall** — best combination of all criteria
- 🚀 **Most Innovative** — most creative AI application
- 📊 **Biggest Impact** — largest measurable improvement
- 🤝 **Best Team Effort** — best collaboration and knowledge sharing`,
              nl: `# Mini-Capstone

## 🎯 De Opdracht

Elk squad heeft de afgelopen weken gewerkt aan een concreet project.

> 🎓 **De missie**
>
> "Verbeter één workflow in jullie dagelijks werk met AI."

---

## 📝 Presentatie Format *(30 min per squad)*

1. **Het probleem** *(5 min)* — welke workflow was inefficiënt?
2. **De oplossing** *(10 min)* — hoe hebben jullie AI geïntegreerd?
3. **Live demo** *(10 min)* — toon de nieuwe workflow in actie
4. **Resultaten** *(5 min)* — meetbare verbetering + lessons learned

---

## ✅ Evaluatie Criteria

- **Impact** — hoeveel tijd/kwaliteit wordt bespaard?
- **Reproduceerbaarheid** — kunnen andere teams dit overnemen?
- **Creativiteit** — innovatief gebruik van AI-tools
- **Presentatie** — helder, beknopt, overtuigend

---

## 🏆 Awards

- 🥇 **Best Overall** — beste combinatie van alle criteria
- 🚀 **Most Innovative** — meest creatieve AI-toepassing
- 📊 **Biggest Impact** — grootste meetbare verbetering
- 🤝 **Best Team Effort** — beste samenwerking en kennisdeling`,
              fr: `# Mini-Capstone

## 🎯 La mission

Chaque squad a travaillé pendant les semaines précédentes sur un projet concret.

> 🎓 **La mission**
>
> « Améliorez un workflow de votre travail quotidien grâce à l'IA. »

---

## 📝 Format de présentation *(30 min par squad)*

1. **Le problème** *(5 min)* — quel workflow était inefficace ?
2. **La solution** *(10 min)* — comment avez-vous intégré l'IA ?
3. **Démo live** *(10 min)* — montrez le nouveau workflow en action
4. **Résultats** *(5 min)* — amélioration mesurable + lessons learned

---

## ✅ Critères d'évaluation

- **Impact** — combien de temps / qualité est gagné ?
- **Reproductibilité** — d'autres équipes peuvent-elles l'adopter ?
- **Créativité** — usage innovant des outils IA
- **Présentation** — claire, concise, convaincante

---

## 🏆 Awards

- 🥇 **Best Overall** — meilleure combinaison de tous les critères
- 🚀 **Most Innovative** — application IA la plus créative
- 📊 **Biggest Impact** — plus grande amélioration mesurable
- 🤝 **Best Team Effort** — meilleure collaboration et partage de connaissances`,
            },
            exercises: [
              {
                id: 'w8d3-ex1',
                title: 'Capstone Presentatie',
                instructions: 'Bereid de capstone presentatie voor: probleem, oplossing, live demo, en resultaten. Upload je presentatie materiaal en een kort verslag van de resultaten.',
                type: 'peer-review' as const,
                difficulty: 4,
                points: 50,
              },
            ],
          },
          {
            id: 'w8d3-retro',
            title: 'RALF Retrospective — Het Volledige Programma',
            type: 'review',
            duration: 90,
            description: 'Volledige RALF retrospective over alle 9 weken.',
            content: `# RALF Retrospective

## 🔄 Review — Wat hebben we bereikt?

- Hoeveel engineers zijn getraind?
- Wat zijn de adoption metrics?
- Welke KPIs zijn verbeterd?

---

## 🧠 Analyze — Wat werkte, wat niet?

- Welke onderdelen van het curriculum waren het meest waardevol?
- Waar hadden we meer tijd nodig?
- Wat was overbodig?

---

## 🎓 Learn — Wat nemen we mee?

- Top 3 inzichten voor Wave 2
- Feedback voor het curriculum
- Suggesties voor tooling/infrastructure

---

## 🔧 Fix — Wat gaan we veranderen?

- Curriculum aanpassingen voor Wave 2
- Nieuwe tools of workflows
- Organisatorische veranderingen

---

## 🏆 Champion Selectie

Per squad worden 2-3 AI Champions geselecteerd:

- ✅ **Criteria** — enthousiasme, kennis, bereidheid om anderen te helpen
- ✅ **Rol in Wave 2** — buddy system voor nieuwe squads
- ✅ **Ongoing** — maandelijkse AI community meetup`,
            contentI18n: {
              en: `# RALF Retrospective

## 🔄 Review — What did we achieve?

- How many engineers were trained?
- What are the adoption metrics?
- Which KPIs improved?

---

## 🧠 Analyze — What worked, what did not?

- Which parts of the curriculum were most valuable?
- Where did we need more time?
- What was redundant?

---

## 🎓 Learn — What do we take with us?

- Top 3 insights for Wave 2
- Feedback on the curriculum
- Suggestions for tooling/infrastructure

---

## 🔧 Fix — What are we going to change?

- Curriculum adjustments for Wave 2
- New tools or workflows
- Organisational changes

---

## 🏆 Champion Selection

Per squad, 2-3 AI Champions are selected:

- ✅ **Criteria** — enthusiasm, knowledge, willingness to help others
- ✅ **Role in Wave 2** — buddy system for new squads
- ✅ **Ongoing** — monthly AI community meetup`,
              nl: `# RALF Retrospective

## 🔄 Review — Wat hebben we bereikt?

- Hoeveel engineers zijn getraind?
- Wat zijn de adoption metrics?
- Welke KPIs zijn verbeterd?

---

## 🧠 Analyze — Wat werkte, wat niet?

- Welke onderdelen van het curriculum waren het meest waardevol?
- Waar hadden we meer tijd nodig?
- Wat was overbodig?

---

## 🎓 Learn — Wat nemen we mee?

- Top 3 inzichten voor Wave 2
- Feedback voor het curriculum
- Suggesties voor tooling/infrastructure

---

## 🔧 Fix — Wat gaan we veranderen?

- Curriculum aanpassingen voor Wave 2
- Nieuwe tools of workflows
- Organisatorische veranderingen

---

## 🏆 Champion Selectie

Per squad worden 2-3 AI Champions geselecteerd:

- ✅ **Criteria** — enthousiasme, kennis, bereidheid om anderen te helpen
- ✅ **Rol in Wave 2** — buddy system voor nieuwe squads
- ✅ **Ongoing** — maandelijkse AI community meetup`,
              fr: `# RALF Retrospective

## 🔄 Review — qu'avons-nous accompli ?

- Combien d'ingénieurs ont été formés ?
- Quels sont les indicateurs d'adoption ?
- Quels KPI se sont améliorés ?

---

## 🧠 Analyze — qu'est-ce qui a fonctionné, qu'est-ce qui n'a pas fonctionné ?

- Quelles parties du curriculum ont été les plus précieuses ?
- Où avions-nous besoin de plus de temps ?
- Qu'est-ce qui était superflu ?

---

## 🎓 Learn — que retenons-nous ?

- Top 3 enseignements pour la Wave 2
- Feedback sur le curriculum
- Suggestions pour l'outillage / l'infrastructure

---

## 🔧 Fix — qu'allons-nous changer ?

- Ajustements du curriculum pour la Wave 2
- Nouveaux outils ou workflows
- Changements organisationnels

---

## 🏆 Sélection des Champions

Par squad, 2 à 3 AI Champions sont sélectionnés :

- ✅ **Critères** — enthousiasme, connaissances, volonté d'aider les autres
- ✅ **Rôle en Wave 2** — buddy system pour les nouvelles squads
- ✅ **En continu** — meetup mensuel de la communauté IA`,
            },
          },
        ],
      },
    ],
  },
];

// ── AI Literacy Compliance Eindtoets (EU AI Act Article 4) ──────────────────
// 30 vragen — min. 70% (21/30) vereist voor compliance-certificaat
// Gebaseerd op: EU AI Act, Worldline beleid, AI fundamentals
export const aiLiteracyComplianceTest: McqQuestion[] = [
  // SECTIE 1: EU AI Act Kennis (10 vragen)
  {
    id: 'cmp-01',
    question: 'Welk artikel van de EU AI Act verplicht organisaties tot het waarborgen van AI-geletterdheid bij medewerkers?',
    questionI18n: {
      en: 'Which article of the EU AI Act requires organisations to ensure AI literacy among staff?',
      nl: 'Welk artikel van de EU AI Act verplicht organisaties tot het waarborgen van AI-geletterdheid bij medewerkers?',
      fr: 'Quel article de l\'EU AI Act oblige les organisations à garantir la littératie en IA chez leurs employés ?',
    },
    options: ['Artikel 1', 'Artikel 4', 'Artikel 13', 'Artikel 52'],
    optionsI18n: {
      en: ['Article 1', 'Article 4', 'Article 13', 'Article 52'],
      nl: ['Artikel 1', 'Artikel 4', 'Artikel 13', 'Artikel 52'],
      fr: ['Article 1', 'Article 4', 'Article 13', 'Article 52'],
    },
    correctIndex: 1,
    explanation: 'Artikel 4 van de EU AI Act verplicht providers en deployers van AI-systemen om AI-geletterdheid te waarborgen bij betrokken medewerkers.',
    explanationI18n: {
      en: 'Article 4 of the EU AI Act requires providers and deployers of AI systems to ensure AI literacy among the staff involved.',
      nl: 'Artikel 4 van de EU AI Act verplicht providers en deployers van AI-systemen om AI-geletterdheid te waarborgen bij betrokken medewerkers.',
      fr: 'L\'article 4 de l\'EU AI Act oblige les providers et déployeurs de systèmes d\'IA à garantir la littératie en IA chez le personnel concerné.',
    },
    bloomLevel: 1,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-02',
    question: 'Welke AI-toepassing is absoluut VERBODEN onder de EU AI Act?',
    questionI18n: {
      en: 'Which AI application is absolutely BANNED under the EU AI Act?',
      nl: 'Welke AI-toepassing is absoluut VERBODEN onder de EU AI Act?',
      fr: 'Quelle application IA est absolument INTERDITE sous l\'EU AI Act ?',
    },
    options: [
      'Fraudedetectie in betalingssystemen',
      'Real-time biometrische surveillance in openbare ruimte door overheden',
      'Aanbevelingssystemen voor online winkels',
      'AI-gestuurde klantenservice chatbots',
    ],
    optionsI18n: {
      en: [
        'Fraud detection in payment systems',
        'Real-time biometric surveillance in public spaces by government authorities',
        'Recommendation systems for online shops',
        'AI-driven customer service chatbots',
      ],
      nl: [
        'Fraudedetectie in betalingssystemen',
        'Real-time biometrische surveillance in openbare ruimte door overheden',
        'Aanbevelingssystemen voor online winkels',
        'AI-gestuurde klantenservice chatbots',
      ],
      fr: [
        'Détection de fraude dans les systèmes de paiement',
        'Surveillance biométrique en temps réel dans l\'espace public par les autorités',
        'Systèmes de recommandation pour boutiques en ligne',
        'Chatbots de service client pilotés par IA',
      ],
    },
    correctIndex: 1,
    explanation: 'Artikel 5 EU AI Act verbiedt real-time biometrische massasurveillance in openbare ruimte door overheidsinstanties. Dit is een absolute grens zonder uitzonderingen.',
    explanationI18n: {
      en: 'Article 5 EU AI Act bans real-time biometric mass surveillance in public spaces by government authorities. This is an absolute boundary with no exceptions.',
      nl: 'Artikel 5 EU AI Act verbiedt real-time biometrische massasurveillance in openbare ruimte door overheidsinstanties. Dit is een absolute grens zonder uitzonderingen.',
      fr: 'L\'article 5 de l\'EU AI Act interdit la surveillance biométrique de masse en temps réel dans l\'espace public par les autorités gouvernementales. C\'est une limite absolue sans exception.',
    },
    bloomLevel: 2,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-03',
    question: 'Een fraudedetectiesysteem bij Worldline valt onder welke EU AI Act risicoclassificatie?',
    questionI18n: {
      en: 'A fraud detection system at Worldline falls under which EU AI Act risk classification?',
      nl: 'Een fraudedetectiesysteem bij Worldline valt onder welke EU AI Act risicoclassificatie?',
      fr: 'Un système de détection de fraude chez Worldline relève de quelle classification de risque EU AI Act ?',
    },
    options: ['Minimaal risico', 'Beperkt risico', 'Hoog risico', 'Verboden'],
    optionsI18n: {
      en: ['Minimal risk', 'Limited risk', 'High risk', 'Prohibited'],
      nl: ['Minimaal risico', 'Beperkt risico', 'Hoog risico', 'Verboden'],
      fr: ['Risque minimal', 'Risque limité', 'Risque élevé', 'Interdit'],
    },
    correctIndex: 2,
    explanation: 'Bijlage III van de EU AI Act classificeert AI-systemen voor krediet- en fraudebeoordeling in de financiële sector als "hoog risico". Dit vereist conformiteitsbeoordeling en menselijk toezicht.',
    explanationI18n: {
      en: 'Annex III of the EU AI Act classifies AI systems for credit and fraud assessment in the financial sector as "high risk". This requires conformity assessment and human oversight.',
      nl: 'Bijlage III van de EU AI Act classificeert AI-systemen voor krediet- en fraudebeoordeling in de financiële sector als "hoog risico". Dit vereist conformiteitsbeoordeling en menselijk toezicht.',
      fr: 'L\'Annexe III de l\'EU AI Act classifie les systèmes IA d\'évaluation de crédit et de fraude dans le secteur financier comme « haut risque ». Cela exige une évaluation de conformité et une supervision humaine.',
    },
    bloomLevel: 2,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-04',
    question: 'Welke documentatieverplichting geldt voor hoog-risico AI-systemen?',
    questionI18n: {
      en: 'Which documentation requirement applies to high-risk AI systems?',
      nl: 'Welke documentatieverplichting geldt voor hoog-risico AI-systemen?',
      fr: 'Quelle obligation de documentation s\'applique aux systèmes IA à haut risque ?',
    },
    options: [
      'Jaarlijkse rapportage aan de Europese Commissie',
      'Technische documentatie, logging van beslissingen en conformiteitsbeoordeling',
      'Alleen interne audit door het IT-departement',
      'Geen documentatie vereist als het systeem minder dan 100 gebruikers heeft',
    ],
    optionsI18n: {
      en: [
        'Annual report to the European Commission',
        'Technical documentation, decision logging and conformity assessment',
        'Internal audit by IT department only',
        'No documentation required if system has fewer than 100 users',
      ],
      nl: [
        'Jaarlijkse rapportage aan de Europese Commissie',
        'Technische documentatie, logging van beslissingen en conformiteitsbeoordeling',
        'Alleen interne audit door het IT-departement',
        'Geen documentatie vereist als het systeem minder dan 100 gebruikers heeft',
      ],
      fr: [
        'Rapport annuel à la Commission européenne',
        'Documentation technique, journalisation des décisions et évaluation de conformité',
        'Audit interne par le département IT uniquement',
        'Aucune documentation requise si le système a moins de 100 utilisateurs',
      ],
    },
    correctIndex: 1,
    explanation: 'Hoog-risico AI-systemen vereisen uitgebreide technische documentatie, logboeken van beslissingen, risicobeheer en een conformiteitsbeoordeling. Dit is de kern van EU AI Act compliance.',
    explanationI18n: {
      en: 'High-risk AI systems require extensive technical documentation, decision logs, risk management and a conformity assessment. This is the core of EU AI Act compliance.',
      nl: 'Hoog-risico AI-systemen vereisen uitgebreide technische documentatie, logboeken van beslissingen, risicobeheer en een conformiteitsbeoordeling. Dit is de kern van EU AI Act compliance.',
      fr: 'Les systèmes IA à haut risque exigent une documentation technique étendue, des journaux de décisions, une gestion des risques et une évaluation de conformité. C\'est le cœur de la conformité EU AI Act.',
    },
    bloomLevel: 2,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-05',
    question: 'Wanneer gaan de EU AI Act-verplichtingen voor hoog-risico AI-systemen in de financiële sector gelden?',
    questionI18n: {
      en: 'When do the EU AI Act obligations for high-risk AI use cases in the financial sector apply?',
      nl: 'Wanneer gaan de EU AI Act-verplichtingen voor hoog-risico AI-toepassingen in de financiële sector gelden?',
      fr: 'Quand les obligations de l\'EU AI Act pour les cas d\'usage IA à haut risque dans le secteur financier s\'appliquent-elles ?',
    },
    options: ['Augustus 2024', 'Februari 2025', 'December 2027', 'Augustus 2028'],
    optionsI18n: {
      en: ['August 2024', 'February 2025', 'December 2027', 'August 2028'],
      nl: ['Augustus 2024', 'Februari 2025', 'December 2027', 'Augustus 2028'],
      fr: ['Août 2024', 'Février 2025', 'Décembre 2027', 'Août 2028'],
    },
    correctIndex: 2,
    explanation: 'Voor hoog-risico AI-toepassingen in de financiële sector gelden de relevante EU AI Act-verplichtingen vanaf 2 december 2027. Augustus 2026 is de algemene toepassingsdatum, niet de Annex III-deadline voor deze use case.',
    explanationI18n: {
      en: 'For high-risk AI use cases in the financial sector, the relevant EU AI Act obligations apply from 2 December 2027. August 2026 is the general application date, not the Annex III deadline for this use case.',
      nl: 'Voor hoog-risico AI-toepassingen in de financiële sector gelden de relevante EU AI Act-verplichtingen vanaf 2 december 2027. Augustus 2026 is de algemene toepassingsdatum, niet de Annex III-deadline voor deze use case.',
      fr: 'Pour les cas d\'usage IA à haut risque dans le secteur financier, les obligations pertinentes de l\'EU AI Act s\'appliquent à partir du 2 décembre 2027. Août 2026 est la date d\'application générale, pas l\'échéance de l\'Annexe III pour ce cas.',
    },
    bloomLevel: 1,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-06',
    question: 'Wat vereist het "human in the loop" principe voor AI-systemen?',
    questionI18n: {
      en: 'What does the "human in the loop" principle require for AI systems?',
      nl: 'Wat vereist het "human in the loop" principe voor AI-systemen?',
      fr: 'Qu\'exige le principe « humain dans la boucle » pour les systèmes IA ?',
    },
    options: [
      'Een mens moet elke AI-prompt goedkeuren voor verzending',
      'AI-systemen mogen geen autonome beslissingen nemen die mensen significant beïnvloeden zonder mogelijkheid tot menselijke interventie',
      'Alle AI-output moet worden herschreven door een menselijke medewerker',
      'AI mag alleen worden gebruikt als er een menselijke supervisor fysiek aanwezig is',
    ],
    optionsI18n: {
      en: [
        'A human must approve every AI prompt before submission',
        'AI systems must not make autonomous decisions that significantly affect people without the option for human intervention',
        'All AI output must be rewritten by a human employee',
        'AI may only be used when a human supervisor is physically present',
      ],
      nl: [
        'Een mens moet elke AI-prompt goedkeuren voor verzending',
        'AI-systemen mogen geen autonome beslissingen nemen die mensen significant beïnvloeden zonder mogelijkheid tot menselijke interventie',
        'Alle AI-output moet worden herschreven door een menselijke medewerker',
        'AI mag alleen worden gebruikt als er een menselijke supervisor fysiek aanwezig is',
      ],
      fr: [
        'Un humain doit approuver chaque prompt IA avant envoi',
        'Les systèmes IA ne peuvent pas prendre de décisions autonomes affectant significativement les personnes sans possibilité d\'intervention humaine',
        'Toute sortie IA doit être réécrite par un employé humain',
        'L\'IA ne peut être utilisée que si un superviseur humain est physiquement présent',
      ],
    },
    correctIndex: 1,
    explanation: '"Human in the loop" betekent dat mensen de mogelijkheid moeten hebben om AI-beslissingen te reviewen, overrulen en corrigeren. Dit is een kernvereiste van de EU AI Act voor hoog-risico systemen.',
    explanationI18n: {
      en: '"Human in the loop" means humans must have the ability to review, override and correct AI decisions. This is a core requirement of the EU AI Act for high-risk systems.',
      nl: '"Human in the loop" betekent dat mensen de mogelijkheid moeten hebben om AI-beslissingen te reviewen, overrulen en corrigeren. Dit is een kernvereiste van de EU AI Act voor hoog-risico systemen.',
      fr: '« Humain dans la boucle » signifie que les humains doivent pouvoir examiner, outrepasser et corriger les décisions IA. C\'est une exigence fondamentale de l\'EU AI Act pour les systèmes à haut risque.',
    },
    bloomLevel: 3,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-07',
    question: 'Een klant heeft recht op uitleg over een AI-beslissing. Welk principe beschrijft dit?',
    questionI18n: {
      en: 'A customer is entitled to explanation about an AI decision. Which principle describes this?',
      nl: 'Een klant heeft recht op uitleg over een AI-beslissing. Welk principe beschrijft dit?',
      fr: 'Un client a droit à une explication sur une décision IA. Quel principe décrit cela ?',
    },
    options: ['AI Transparency', 'Explainability / Right to Explanation', 'Data Minimisation', 'Purpose Limitation'],
    optionsI18n: {
      en: ['AI Transparency', 'Explainability / Right to Explanation', 'Data Minimisation', 'Purpose Limitation'],
      nl: ['AI Transparency', 'Explainability / Right to Explanation', 'Data Minimisation', 'Purpose Limitation'],
      fr: ['Transparence IA', 'Explicabilité / Droit à l\'explication', 'Minimisation des données', 'Limitation des finalités'],
    },
    correctIndex: 1,
    explanation: 'Het recht op uitleg (Explainability) verplicht organisaties om te kunnen verklaren hoe en waarom een AI-systeem een beslissing nam die een persoon betreft. Dit staat in de EU AI Act en sluit aan bij GDPR.',
    explanationI18n: {
      en: 'The right to explanation (Explainability) requires organisations to explain how and why an AI system made a decision affecting a person. This is in the EU AI Act and aligns with GDPR.',
      nl: 'Het recht op uitleg (Explainability) verplicht organisaties om te kunnen verklaren hoe en waarom een AI-systeem een beslissing nam die een persoon betreft. Dit staat in de EU AI Act en sluit aan bij GDPR.',
      fr: 'Le droit à l\'explication (Explainability) oblige les organisations à pouvoir expliquer comment et pourquoi un système IA a pris une décision concernant une personne. Cela figure dans l\'EU AI Act et s\'aligne avec le GDPR.',
    },
    bloomLevel: 2,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-08',
    question: 'Welke actie is VERPLICHT als je een bias ontdekt in een hoog-risico AI-systeem?',
    questionI18n: {
      en: 'Which action is MANDATORY when you discover bias in a high-risk AI system?',
      nl: 'Welke actie is VERPLICHT als je een bias ontdekt in een hoog-risico AI-systeem?',
      fr: 'Quelle action est OBLIGATOIRE lorsque vous découvrez un biais dans un système IA à haut risque ?',
    },
    options: [
      'De bias intern documenteren en accepteren als systeembeperking',
      'Het systeem direct uit productie halen tot de bias verholpen is',
      'De bias melden bij de Data Protection Officer en mitigerende maatregelen implementeren',
      'Gebruikers informeren via de algemene gebruiksvoorwaarden',
    ],
    optionsI18n: {
      en: [
        'Document the bias internally and accept it as a system limitation',
        'Immediately remove the system from production until bias is fixed',
        'Report the bias to the Data Protection Officer and implement mitigation measures',
        'Inform users via the general terms of service',
      ],
      nl: [
        'De bias intern documenteren en accepteren als systeembeperking',
        'Het systeem direct uit productie halen tot de bias verholpen is',
        'De bias melden bij de Data Protection Officer en mitigerende maatregelen implementeren',
        'Gebruikers informeren via de algemene gebruiksvoorwaarden',
      ],
      fr: [
        'Documenter le biais en interne et l\'accepter comme limite du système',
        'Retirer immédiatement le système de production jusqu\'à correction du biais',
        'Signaler le biais au Data Protection Officer et mettre en œuvre des mesures d\'atténuation',
        'Informer les utilisateurs via les conditions générales d\'utilisation',
      ],
    },
    correctIndex: 2,
    explanation: 'Bij ontdekking van bias in hoog-risico AI moeten mitigerende maatregelen worden geïmplementeerd. De DPO moet betrokken worden. Transparantie naar gebruikers kan verplicht zijn afhankelijk van de ernst.',
    explanationI18n: {
      en: 'On discovering bias in high-risk AI, mitigation measures must be implemented. The DPO must be involved. Transparency to users may be required depending on severity.',
      nl: 'Bij ontdekking van bias in hoog-risico AI moeten mitigerende maatregelen worden geïmplementeerd. De DPO moet betrokken worden. Transparantie naar gebruikers kan verplicht zijn afhankelijk van de ernst.',
      fr: 'Lors de la découverte d\'un biais dans une IA à haut risque, des mesures d\'atténuation doivent être mises en œuvre. Le DPO doit être impliqué. La transparence vis-à-vis des utilisateurs peut être obligatoire selon la gravité.',
    },
    bloomLevel: 4,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-09',
    question: 'ISO 42001 is een internationale norm voor:',
    questionI18n: {
      en: 'ISO 42001 is an international standard for:',
      nl: 'ISO 42001 is een internationale norm voor:',
      fr: 'ISO 42001 est une norme internationale pour :',
    },
    options: [
      'Cybersecurity management systemen',
      'AI management systemen — governance, risico en compliance voor AI',
      'Cloudinfrastructuur certificering',
      'Privacy by design implementatie',
    ],
    optionsI18n: {
      en: [
        'Cybersecurity management systems',
        'AI management systems — governance, risk and compliance for AI',
        'Cloud infrastructure certification',
        'Privacy by design implementation',
      ],
      nl: [
        'Cybersecurity management systemen',
        'AI management systemen — governance, risico en compliance voor AI',
        'Cloudinfrastructuur certificering',
        'Privacy by design implementatie',
      ],
      fr: [
        'Systèmes de gestion de cybersécurité',
        'Systèmes de gestion IA — gouvernance, risque et conformité pour l\'IA',
        'Certification d\'infrastructure cloud',
        'Implémentation Privacy by design',
      ],
    },
    correctIndex: 1,
    explanation: 'ISO 42001 (gepubliceerd 2023) is de internationale norm voor AI Management Systems. Het biedt een framework voor verantwoord AI-gebruik en sluit aan bij EU AI Act vereisten.',
    explanationI18n: {
      en: 'ISO 42001 (published 2023) is the international standard for AI Management Systems. It provides a framework for responsible AI use and aligns with EU AI Act requirements.',
      nl: 'ISO 42001 (gepubliceerd 2023) is de internationale norm voor AI Management Systems. Het biedt een framework voor verantwoord AI-gebruik en sluit aan bij EU AI Act vereisten.',
      fr: 'ISO 42001 (publiée 2023) est la norme internationale pour les Systèmes de Gestion IA. Elle fournit un cadre pour l\'utilisation responsable de l\'IA et s\'aligne avec les exigences de l\'EU AI Act.',
    },
    bloomLevel: 1,
    euAiActRelevant: true,
    points: 8,
  },
  {
    id: 'cmp-10',
    question: 'Welke gegevens mag je NOOIT in een AI-model invoeren bij Worldline?',
    questionI18n: {
      en: 'Which data must you NEVER input into an AI model at Worldline?',
      nl: 'Welke gegevens mag je NOOIT in een AI-model invoeren bij Worldline?',
      fr: 'Quelles données ne devez-vous JAMAIS saisir dans un modèle IA chez Worldline ?',
    },
    options: [
      'Geanonimiseerde testdata uit de staging-omgeving',
      'PAN (kaartnummers), CVV-codes, of andere persoonsgebonden betaalgegevens',
      'Technische foutmeldingen zonder persoonsgegevens',
      'Publiek beschikbare API-documentatie',
    ],
    optionsI18n: {
      en: [
        'Anonymised test data from the staging environment',
        'PAN (card numbers), CVV codes, or other personal payment data',
        'Technical error messages without personal data',
        'Publicly available API documentation',
      ],
      nl: [
        'Geanonimiseerde testdata uit de staging-omgeving',
        'PAN (kaartnummers), CVV-codes, of andere persoonsgebonden betaalgegevens',
        'Technische foutmeldingen zonder persoonsgegevens',
        'Publiek beschikbare API-documentatie',
      ],
      fr: [
        'Données de test anonymisées de l\'environnement de staging',
        'PAN (numéros de carte), codes CVV, ou autres données de paiement personnelles',
        'Messages d\'erreur techniques sans données personnelles',
        'Documentation API publiquement disponible',
      ],
    },
    correctIndex: 1,
    explanation: 'PAN, CVV en betaalkaartgegevens mogen NOOIT in externe AI-systemen worden ingevoerd. Dit is een absolute vereiste van PCI-DSS en wordt versterkt door EU AI Act. Gebruik altijd gesynthetiseerde of geanonimiseerde data.',
    explanationI18n: {
      en: 'PAN, CVV and card data must NEVER be entered into external AI systems. This is an absolute PCI-DSS requirement reinforced by EU AI Act. Always use synthetic or anonymised data.',
      nl: 'PAN, CVV en betaalkaartgegevens mogen NOOIT in externe AI-systemen worden ingevoerd. Dit is een absolute vereiste van PCI-DSS en wordt versterkt door EU AI Act. Gebruik altijd gesynthetiseerde of geanonimiseerde data.',
      fr: 'Les PAN, CVV et données de carte ne doivent JAMAIS être saisis dans des systèmes IA externes. C\'est une exigence absolue de PCI-DSS, renforcée par l\'EU AI Act. Utilisez toujours des données synthétiques ou anonymisées.',
    },
    bloomLevel: 1,
    euAiActRelevant: true,
    points: 10,
  },

  // SECTIE 2: AI Fundamentals (10 vragen)
  {
    id: 'cmp-11',
    question: 'Wat is "Retrieval Augmented Generation" (RAG)?',
    questionI18n: {
      en: 'What is "Retrieval Augmented Generation" (RAG)?',
      nl: 'Wat is "Retrieval Augmented Generation" (RAG)?',
      fr: 'Qu\'est-ce que la « Retrieval Augmented Generation » (RAG) ?',
    },
    options: [
      'Een trainingstechniek om modellen kleiner te maken',
      'Een methode waarbij een AI-model bij elke vraag relevante documenten ophaalt en gebruikt in zijn antwoord',
      'Een beveiligingsprotocol voor AI-API-toegang',
      'Een methode om AI-output automatisch te verifiëren',
    ],
    optionsI18n: {
      en: [
        'A training technique to shrink models',
        'A method where an AI model retrieves relevant documents on each query and uses them in its response',
        'A security protocol for AI API access',
        'A method to automatically verify AI output',
      ],
      nl: [
        'Een trainingstechniek om modellen kleiner te maken',
        'Een methode waarbij een AI-model bij elke vraag relevante documenten ophaalt en gebruikt in zijn antwoord',
        'Een beveiligingsprotocol voor AI-API-toegang',
        'Een methode om AI-output automatisch te verifiëren',
      ],
      fr: [
        'Une technique d\'entraînement pour réduire les modèles',
        'Une méthode où un modèle IA récupère des documents pertinents à chaque question et les utilise dans sa réponse',
        'Un protocole de sécurité pour l\'accès aux API IA',
        'Une méthode pour vérifier automatiquement les sorties IA',
      ],
    },
    correctIndex: 1,
    explanation: 'RAG combineert een taalmodel met een externe kennisbank. Het model zoekt relevante documenten op (retrieval) en gebruikt deze bij het genereren van het antwoord. LibreChat bij Worldline gebruikt RAG met Confluence.',
    explanationI18n: {
      en: 'RAG combines a language model with an external knowledge base. The model retrieves relevant documents and uses them to generate the answer. LibreChat at Worldline uses RAG with Confluence.',
      nl: 'RAG combineert een taalmodel met een externe kennisbank. Het model zoekt relevante documenten op (retrieval) en gebruikt deze bij het genereren van het antwoord. LibreChat bij Worldline gebruikt RAG met Confluence.',
      fr: 'La RAG combine un modèle de langage avec une base de connaissances externe. Le modèle récupère des documents pertinents et les utilise pour générer la réponse. LibreChat chez Worldline utilise la RAG avec Confluence.',
    },
    bloomLevel: 2,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-12',
    question: 'Wat is de primaire oorzaak van "hallucination" bij AI-taalmodellen?',
    questionI18n: {
      en: 'What is the primary cause of "hallucination" in AI language models?',
      nl: 'Wat is de primaire oorzaak van "hallucination" bij AI-taalmodellen?',
      fr: 'Quelle est la cause principale de l\'« hallucination » dans les modèles de langage IA ?',
    },
    options: [
      'De modellen zijn getraind op te weinig data',
      'Modellen genereren statistisch waarschijnlijke tekst zonder factverificatie — ze "weten" niet wat waar is',
      'Hoge temperatuursinstellingen veroorzaken altijd hallucination',
      'Hallucination treedt alleen op bij kleine modellen',
    ],
    optionsI18n: {
      en: [
        'The models are trained on too little data',
        'Models generate statistically likely text without fact verification — they do not "know" what is true',
        'High temperature settings always cause hallucination',
        'Hallucination only occurs in small models',
      ],
      nl: [
        'De modellen zijn getraind op te weinig data',
        'Modellen genereren statistisch waarschijnlijke tekst zonder factverificatie — ze "weten" niet wat waar is',
        'Hoge temperatuursinstellingen veroorzaken altijd hallucination',
        'Hallucination treedt alleen op bij kleine modellen',
      ],
      fr: [
        'Les modèles sont entraînés sur trop peu de données',
        'Les modèles génèrent du texte statistiquement plausible sans vérification factuelle — ils ne « savent » pas ce qui est vrai',
        'Une température élevée provoque toujours des hallucinations',
        'L\'hallucination ne se produit que dans les petits modèles',
      ],
    },
    correctIndex: 1,
    explanation: 'Taalmodellen genereren tokens op basis van statistische patronen, niet op basis van feitelijke kennis. Ze hebben geen mechanisme om te "weten" of iets waar is. Dit leidt tot overtuigende maar onjuiste output.',
    explanationI18n: {
      en: 'Language models generate tokens based on statistical patterns, not factual knowledge. They have no mechanism to "know" if something is true. This leads to convincing but incorrect output.',
      nl: 'Taalmodellen genereren tokens op basis van statistische patronen, niet op basis van feitelijke kennis. Ze hebben geen mechanisme om te "weten" of iets waar is. Dit leidt tot overtuigende maar onjuiste output.',
      fr: 'Les modèles de langage génèrent des tokens sur la base de motifs statistiques, pas de connaissances factuelles. Ils n\'ont aucun mécanisme pour « savoir » si quelque chose est vrai. Cela conduit à des sorties convaincantes mais incorrectes.',
    },
    bloomLevel: 2,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-13',
    question: 'Een temperatuursinstelling van 0.0 bij een AI-model leidt tot:',
    questionI18n: {
      en: 'A temperature setting of 0.0 in an AI model results in:',
      nl: 'Een temperatuursinstelling van 0.0 bij een AI-model leidt tot:',
      fr: 'Un réglage de température à 0.0 dans un modèle IA conduit à :',
    },
    options: [
      'Creatievere en diversere output',
      'Lagere verwerkingssnelheid',
      'Deterministische, reproduceerbare output — het model kiest altijd de meest waarschijnlijke optie',
      'Weigering om vragen te beantwoorden',
    ],
    optionsI18n: {
      en: [
        'More creative and diverse output',
        'Lower processing speed',
        'Deterministic, reproducible output — the model always picks the most likely option',
        'Refusal to answer questions',
      ],
      nl: [
        'Creatievere en diversere output',
        'Lagere verwerkingssnelheid',
        'Deterministische, reproduceerbare output — het model kiest altijd de meest waarschijnlijke optie',
        'Weigering om vragen te beantwoorden',
      ],
      fr: [
        'Sortie plus créative et diverse',
        'Vitesse de traitement plus basse',
        'Sortie déterministe et reproductible — le modèle choisit toujours l\'option la plus probable',
        'Refus de répondre aux questions',
      ],
    },
    correctIndex: 2,
    explanation: 'Temperature 0.0 maakt het model deterministisch: dezelfde input geeft altijd dezelfde output. Dit is ideaal voor code-generatie en compliance-kritische toepassingen waar consistentie vereist is.',
    explanationI18n: {
      en: 'Temperature 0.0 makes the model deterministic: same input always yields same output. Ideal for code generation and compliance-critical use cases requiring consistency.',
      nl: 'Temperature 0.0 maakt het model deterministisch: dezelfde input geeft altijd dezelfde output. Dit is ideaal voor code-generatie en compliance-kritische toepassingen waar consistentie vereist is.',
      fr: 'La température 0.0 rend le modèle déterministe : même entrée donne toujours la même sortie. Idéal pour la génération de code et les usages critiques de conformité exigeant de la cohérence.',
    },
    bloomLevel: 3,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-14',
    question: 'Welke AI-architectuur ligt aan de basis van alle moderne taalmodellen (GPT, Claude, Gemini)?',
    questionI18n: {
      en: 'Which AI architecture underlies all modern language models (GPT, Claude, Gemini)?',
      nl: 'Welke AI-architectuur ligt aan de basis van alle moderne taalmodellen (GPT, Claude, Gemini)?',
      fr: 'Quelle architecture IA est à la base de tous les modèles de langage modernes (GPT, Claude, Gemini) ?',
    },
    options: ['Recurrent Neural Networks (RNN)', 'Convolutional Neural Networks (CNN)', 'Transformer-architectuur met self-attention', 'Decision Trees en Random Forests'],
    optionsI18n: {
      en: ['Recurrent Neural Networks (RNN)', 'Convolutional Neural Networks (CNN)', 'Transformer architecture with self-attention', 'Decision Trees and Random Forests'],
      nl: ['Recurrent Neural Networks (RNN)', 'Convolutional Neural Networks (CNN)', 'Transformer-architectuur met self-attention', 'Decision Trees en Random Forests'],
      fr: ['Réseaux Neuronaux Récurrents (RNN)', 'Réseaux Neuronaux Convolutifs (CNN)', 'Architecture Transformer avec self-attention', 'Arbres de décision et Random Forests'],
    },
    correctIndex: 2,
    explanation: 'Het Transformer-paper "Attention Is All You Need" (Google, 2017) introduceerde de architectuur die alle moderne grote taalmodellen aandrijft. Het self-attention mechanisme is de kern van de doorbraak.',
    explanationI18n: {
      en: 'The Transformer paper "Attention Is All You Need" (Google, 2017) introduced the architecture powering all modern large language models. Self-attention is the core breakthrough.',
      nl: 'Het Transformer-paper "Attention Is All You Need" (Google, 2017) introduceerde de architectuur die alle moderne grote taalmodellen aandrijft. Het self-attention mechanisme is de kern van de doorbraak.',
      fr: 'Le papier Transformer « Attention Is All You Need » (Google, 2017) a introduit l\'architecture qui alimente tous les grands modèles de langage modernes. Le self-attention est la percée centrale.',
    },
    bloomLevel: 1,
    euAiActRelevant: false,
    points: 5,
  },
  {
    id: 'cmp-15',
    question: 'Je wil een AI-model vragen je code te reviewen. Welke temperatuurinstelling is het meest geschikt?',
    questionI18n: {
      en: 'You want to ask an AI model to review your code. Which temperature setting is most suitable?',
      nl: 'Je wil een AI-model vragen je code te reviewen. Welke temperatuurinstelling is het meest geschikt?',
      fr: 'Vous voulez demander à un modèle IA de relire votre code. Quel réglage de température est le plus adapté ?',
    },
    options: ['1.5 — voor maximale creativiteit', '0.0 — 0.3 — voor consistente, reproduceerbare analyse', '1.0 — de standaardinstelling', '0.7 — voor gebalanceerde output'],
    optionsI18n: {
      en: ['1.5 — for maximum creativity', '0.0 — 0.3 — for consistent, reproducible analysis', '1.0 — the default setting', '0.7 — for balanced output'],
      nl: ['1.5 — voor maximale creativiteit', '0.0 — 0.3 — voor consistente, reproduceerbare analyse', '1.0 — de standaardinstelling', '0.7 — voor gebalanceerde output'],
      fr: ['1.5 — pour créativité maximale', '0.0 — 0.3 — pour analyse cohérente et reproductible', '1.0 — le réglage par défaut', '0.7 — pour sortie équilibrée'],
    },
    correctIndex: 1,
    explanation: 'Code review vereist consistentie en nauwkeurigheid, geen creativiteit. Lage temperatuur (0.0-0.3) zorgt voor reproduceerbare, betrouwbare analyse. Hogere temperatuur verhoogt de kans op onbetrouwbare bevindingen.',
    explanationI18n: {
      en: 'Code review requires consistency and accuracy, not creativity. Low temperature (0.0-0.3) ensures reproducible, reliable analysis. Higher temperature increases the risk of unreliable findings.',
      nl: 'Code review vereist consistentie en nauwkeurigheid, geen creativiteit. Lage temperatuur (0.0-0.3) zorgt voor reproduceerbare, betrouwbare analyse. Hogere temperatuur verhoogt de kans op onbetrouwbare bevindingen.',
      fr: 'La revue de code exige cohérence et précision, pas de créativité. Une basse température (0.0-0.3) assure une analyse reproductible et fiable. Une température plus élevée augmente le risque de conclusions peu fiables.',
    },
    bloomLevel: 3,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-16',
    question: 'Wat is "prompt injection"?',
    questionI18n: {
      en: 'What is "prompt injection"?',
      nl: 'Wat is "prompt injection"?',
      fr: 'Qu\'est-ce que l\'« injection de prompt » ?',
    },
    options: [
      'Een techniek om prompts sneller te verwerken',
      'Een aanval waarbij kwaadaardige tekst in de AI-input probeert het model te manipuleren',
      'Het injecteren van voorbeelden in een prompt voor few-shot learning',
      'Een methode om API-sleutels veilig door te sturen',
    ],
    optionsI18n: {
      en: [
        'A technique to process prompts faster',
        'An attack where malicious text in AI input tries to manipulate the model',
        'Injecting examples into a prompt for few-shot learning',
        'A method to safely forward API keys',
      ],
      nl: [
        'Een techniek om prompts sneller te verwerken',
        'Een aanval waarbij kwaadaardige tekst in de AI-input probeert het model te manipuleren',
        'Het injecteren van voorbeelden in een prompt voor few-shot learning',
        'Een methode om API-sleutels veilig door te sturen',
      ],
      fr: [
        'Une technique pour traiter les prompts plus rapidement',
        'Une attaque où du texte malveillant dans l\'entrée IA tente de manipuler le modèle',
        'Injecter des exemples dans un prompt pour le few-shot learning',
        'Une méthode pour transférer les clés API en toute sécurité',
      ],
    },
    correctIndex: 1,
    explanation: 'Prompt injection is een beveiligingsrisico waarbij aanvallers kwaadaardige instructies in gebruikersinput verstoppen om het AI-model te manipuleren. Kritiek voor Worldline-systemen die gebruikersinput verwerken.',
    explanationI18n: {
      en: 'Prompt injection is a security risk where attackers hide malicious instructions in user input to manipulate the AI model. Critical for Worldline systems processing user input.',
      nl: 'Prompt injection is een beveiligingsrisico waarbij aanvallers kwaadaardige instructies in gebruikersinput verstoppen om het AI-model te manipuleren. Kritiek voor Worldline-systemen die gebruikersinput verwerken.',
      fr: 'L\'injection de prompt est un risque de sécurité où les attaquants cachent des instructions malveillantes dans les entrées utilisateur pour manipuler le modèle IA. Critique pour les systèmes Worldline traitant des entrées utilisateur.',
    },
    bloomLevel: 2,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-17',
    question: 'Welk model gebruik je voor een taak die hoge nauwkeurigheid vereist maar grote volumes verwerkt?',
    questionI18n: {
      en: 'Which model do you use for a task requiring high accuracy but processing large volumes?',
      nl: 'Welk model gebruik je voor een taak die hoge nauwkeurigheid vereist maar grote volumes verwerkt?',
      fr: 'Quel modèle utilisez-vous pour une tâche exigeant une grande précision mais traitant de gros volumes ?',
    },
    options: [
      'Altijd het grootste beschikbare model voor maximale kwaliteit',
      'Claude Opus of GPT-4 — altijd',
      'Het lichtste model dat de taak adequaat uitvoert (Model Economy principe)',
      'Open source modellen zijn altijd beter voor volume',
    ],
    optionsI18n: {
      en: [
        'Always the largest available model for maximum quality',
        'Claude Opus or GPT-4 — always',
        'The lightest model that adequately performs the task (Model Economy principle)',
        'Open source models are always better for volume',
      ],
      nl: [
        'Altijd het grootste beschikbare model voor maximale kwaliteit',
        'Claude Opus of GPT-4 — altijd',
        'Het lichtste model dat de taak adequaat uitvoert (Model Economy principe)',
        'Open source modellen zijn altijd beter voor volume',
      ],
      fr: [
        'Toujours le plus grand modèle disponible pour qualité maximale',
        'Claude Opus ou GPT-4 — toujours',
        'Le modèle le plus léger qui exécute adéquatement la tâche (principe Model Economy)',
        'Les modèles open source sont toujours meilleurs pour le volume',
      ],
    },
    correctIndex: 2,
    explanation: 'Model Economy: gebruik het goedkoopste model dat de taak adequaat uitvoert. T0 (geen model) → T1 (goedkoop/snel) → T2 (balanced) → T3 (premium). Volume-taken op T3 is onnodig duur en traag.',
    explanationI18n: {
      en: 'Model Economy: use the cheapest model that adequately performs the task. T0 (no model) → T1 (cheap/fast) → T2 (balanced) → T3 (premium). Volume tasks on T3 are unnecessarily expensive and slow.',
      nl: 'Model Economy: gebruik het goedkoopste model dat de taak adequaat uitvoert. T0 (geen model) → T1 (goedkoop/snel) → T2 (balanced) → T3 (premium). Volume-taken op T3 is onnodig duur en traag.',
      fr: 'Model Economy : utilisez le modèle le moins cher qui exécute adéquatement la tâche. T0 (pas de modèle) → T1 (bon marché/rapide) → T2 (équilibré) → T3 (premium). Les tâches de volume sur T3 sont inutilement coûteuses et lentes.',
    },
    bloomLevel: 3,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-18',
    question: 'Wat is het verschil tussen "fine-tuning" en "RAG" als methoden om een model domeinkennis te geven?',
    questionI18n: {
      en: 'What is the difference between "fine-tuning" and "RAG" as methods to give a model domain knowledge?',
      nl: 'Wat is het verschil tussen "fine-tuning" en "RAG" als methoden om een model domeinkennis te geven?',
      fr: 'Quelle est la différence entre « fine-tuning » et « RAG » comme méthodes pour donner des connaissances de domaine à un modèle ?',
    },
    options: [
      'Fine-tuning en RAG zijn synoniemen voor dezelfde techniek',
      'Fine-tuning bakt kennis in het model via training; RAG haalt kennis op uit een externe database bij elke query',
      'RAG is alleen voor open-source modellen; fine-tuning voor commerciële modellen',
      'Fine-tuning is goedkoper dan RAG voor grote kennisbanken',
    ],
    optionsI18n: {
      en: [
        'Fine-tuning and RAG are synonyms for the same technique',
        'Fine-tuning bakes knowledge into the model via training; RAG retrieves knowledge from an external database on each query',
        'RAG is only for open-source models; fine-tuning for commercial models',
        'Fine-tuning is cheaper than RAG for large knowledge bases',
      ],
      nl: [
        'Fine-tuning en RAG zijn synoniemen voor dezelfde techniek',
        'Fine-tuning bakt kennis in het model via training; RAG haalt kennis op uit een externe database bij elke query',
        'RAG is alleen voor open-source modellen; fine-tuning voor commerciële modellen',
        'Fine-tuning is goedkoper dan RAG voor grote kennisbanken',
      ],
      fr: [
        'Fine-tuning et RAG sont des synonymes de la même technique',
        'Le fine-tuning intègre la connaissance dans le modèle via l\'entraînement ; la RAG récupère la connaissance d\'une base externe à chaque requête',
        'La RAG ne concerne que les modèles open-source ; le fine-tuning les modèles commerciaux',
        'Le fine-tuning est moins cher que la RAG pour de grandes bases de connaissances',
      ],
    },
    correctIndex: 1,
    explanation: 'Fine-tuning past modelgewichten aan via training op domeindata (permanent, duur). RAG haalt actuele documenten op bij elke query (dynamisch, goedkoper, up-to-date). LibreChat gebruikt RAG met Confluence.',
    explanationI18n: {
      en: 'Fine-tuning adjusts model weights via training on domain data (permanent, expensive). RAG retrieves current documents on each query (dynamic, cheaper, up-to-date). LibreChat uses RAG with Confluence.',
      nl: 'Fine-tuning past modelgewichten aan via training op domeindata (permanent, duur). RAG haalt actuele documenten op bij elke query (dynamisch, goedkoper, up-to-date). LibreChat gebruikt RAG met Confluence.',
      fr: 'Le fine-tuning ajuste les poids du modèle via l\'entraînement sur des données de domaine (permanent, cher). La RAG récupère des documents actuels à chaque requête (dynamique, moins cher, à jour). LibreChat utilise la RAG avec Confluence.',
    },
    bloomLevel: 4,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-19',
    question: 'Welke risicominimalisatiemaatregel is meest effectief bij het gebruik van AI voor code-review?',
    questionI18n: {
      en: 'Which risk-minimisation measure is most effective when using AI for code review?',
      nl: 'Welke risicominimalisatiemaatregel is meest effectief bij het gebruik van AI voor code-review?',
      fr: 'Quelle mesure de minimisation des risques est la plus efficace lors de l\'utilisation d\'IA pour la revue de code ?',
    },
    options: [
      'Alle AI-suggesties automatisch accepteren om tijd te besparen',
      'AI-output altijd behandelen als definitief — het model heeft meer context',
      'AI-output gebruiken als input voor menselijke review, niet als vervanging ervan',
      'Alleen AI-modellen gebruiken die getraind zijn op Worldline-specifieke code',
    ],
    optionsI18n: {
      en: [
        'Automatically accept all AI suggestions to save time',
        'Always treat AI output as final — the model has more context',
        'Use AI output as input for human review, not as a replacement',
        'Only use AI models trained on Worldline-specific code',
      ],
      nl: [
        'Alle AI-suggesties automatisch accepteren om tijd te besparen',
        'AI-output altijd behandelen als definitief — het model heeft meer context',
        'AI-output gebruiken als input voor menselijke review, niet als vervanging ervan',
        'Alleen AI-modellen gebruiken die getraind zijn op Worldline-specifieke code',
      ],
      fr: [
        'Accepter automatiquement toutes les suggestions IA pour gagner du temps',
        'Toujours traiter la sortie IA comme définitive — le modèle a plus de contexte',
        'Utiliser la sortie IA comme entrée pour la revue humaine, pas comme remplacement',
        'N\'utiliser que des modèles IA entraînés sur du code spécifique à Worldline',
      ],
    },
    correctIndex: 2,
    explanation: 'AI-code-review is het meest effectief als aanvulling op — niet vervanging van — menselijke review. AI detecteert patronen goed maar mist bedrijfscontext, intentie en edge cases die een menselijke reviewer begrijpt.',
    explanationI18n: {
      en: 'AI code review is most effective as a complement to — not replacement of — human review. AI detects patterns well but misses business context, intent and edge cases a human reviewer understands.',
      nl: 'AI-code-review is het meest effectief als aanvulling op — niet vervanging van — menselijke review. AI detecteert patronen goed maar mist bedrijfscontext, intentie en edge cases die een menselijke reviewer begrijpt.',
      fr: 'La revue de code par IA est plus efficace en complément — pas en remplacement — de la revue humaine. L\'IA détecte bien les motifs mais manque le contexte métier, l\'intention et les cas limites qu\'un relecteur humain comprend.',
    },
    bloomLevel: 5,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-20',
    question: 'Je team wil AI inzetten voor het automatisch verwerken van klantklachten over betalingen. Wat is de eerste stap?',
    questionI18n: {
      en: 'Your team wants to use AI to automatically process customer complaints about payments. What is the first step?',
      nl: 'Je team wil AI inzetten voor het automatisch verwerken van klantklachten over betalingen. Wat is de eerste stap?',
      fr: 'Votre équipe veut utiliser l\'IA pour traiter automatiquement les plaintes clients sur les paiements. Quelle est la première étape ?',
    },
    options: [
      'Direct deployen — AI is snel en schaalt goed',
      'Een EU AI Act risicoclassificatie uitvoeren om te bepalen welke verplichtingen gelden',
      'Vijf AI-modellen vergelijken op nauwkeurigheid',
      'Het budget bepalen voor de AI-implementatie',
    ],
    optionsI18n: {
      en: [
        'Deploy directly — AI is fast and scales well',
        'Perform an EU AI Act risk classification to determine which obligations apply',
        'Compare five AI models on accuracy',
        'Determine the budget for the AI implementation',
      ],
      nl: [
        'Direct deployen — AI is snel en schaalt goed',
        'Een EU AI Act risicoclassificatie uitvoeren om te bepalen welke verplichtingen gelden',
        'Vijf AI-modellen vergelijken op nauwkeurigheid',
        'Het budget bepalen voor de AI-implementatie',
      ],
      fr: [
        'Déployer directement — l\'IA est rapide et s\'adapte bien',
        'Effectuer une classification de risque EU AI Act pour déterminer les obligations applicables',
        'Comparer cinq modèles IA sur la précision',
        'Déterminer le budget pour la mise en œuvre IA',
      ],
    },
    correctIndex: 1,
    explanation: 'De eerste stap bij elke nieuwe AI-implementatie is het vaststellen van de EU AI Act risicoclassificatie. Dit bepaalt welke verplichtingen (documentatie, menselijk toezicht, conformiteitsbeoordeling) gelden.',
    explanationI18n: {
      en: 'The first step in any new AI implementation is to establish the EU AI Act risk classification. This determines which obligations (documentation, human oversight, conformity assessment) apply.',
      nl: 'De eerste stap bij elke nieuwe AI-implementatie is het vaststellen van de EU AI Act risicoclassificatie. Dit bepaalt welke verplichtingen (documentatie, menselijk toezicht, conformiteitsbeoordeling) gelden.',
      fr: 'La première étape de toute nouvelle implémentation IA est d\'établir la classification de risque EU AI Act. Cela détermine les obligations (documentation, supervision humaine, évaluation de conformité) qui s\'appliquent.',
    },
    bloomLevel: 5,
    euAiActRelevant: true,
    points: 10,
  },

  // SECTIE 3: Praktische AI-geletterdheid (10 vragen)
  {
    id: 'cmp-21',
    question: 'Wat is het Pentagon Model in prompt engineering?',
    questionI18n: {
      en: 'What is the Pentagon Model in prompt engineering?',
      nl: 'Wat is het Pentagon Model in prompt engineering?',
      fr: 'Qu\'est-ce que le Pentagon Model en prompt engineering ?',
    },
    options: [
      'Een beveiligingsframework voor AI-API\'s',
      'Vijf niveaus van AI-model kwaliteit',
      'Vijf elementen van een effectief prompt: Role, Context, Goal, Constraints, Output Format',
      'De vijf goedgekeurde AI-tools bij Worldline',
    ],
    optionsI18n: {
      en: [
        'A security framework for AI APIs',
        'Five levels of AI model quality',
        'Five elements of an effective prompt: Role, Context, Goal, Constraints, Output Format',
        'The five approved AI tools at Worldline',
      ],
      nl: [
        'Een beveiligingsframework voor AI-API\'s',
        'Vijf niveaus van AI-model kwaliteit',
        'Vijf elementen van een effectief prompt: Role, Context, Goal, Constraints, Output Format',
        'De vijf goedgekeurde AI-tools bij Worldline',
      ],
      fr: [
        'Un cadre de sécurité pour les API IA',
        'Cinq niveaux de qualité de modèle IA',
        'Cinq éléments d\'un prompt efficace : Role, Context, Goal, Constraints, Output Format',
        'Les cinq outils IA approuvés chez Worldline',
      ],
    },
    correctIndex: 2,
    explanation: 'Het Pentagon Model beschrijft de vijf atomen van een effectief prompt: Role (wie is de AI?), Context (achtergrond), Goal (wat wil je?), Constraints (beperkingen), Output Format (hoe moet het eruitzien?).',
    explanationI18n: {
      en: 'The Pentagon Model describes the five atoms of an effective prompt: Role (who is the AI?), Context (background), Goal (what do you want?), Constraints (limitations), Output Format (what should it look like?).',
      nl: 'Het Pentagon Model beschrijft de vijf atomen van een effectief prompt: Role (wie is de AI?), Context (achtergrond), Goal (wat wil je?), Constraints (beperkingen), Output Format (hoe moet het eruitzien?).',
      fr: 'Le Pentagon Model décrit les cinq atomes d\'un prompt efficace : Role (qui est l\'IA ?), Context (contexte), Goal (que voulez-vous ?), Constraints (contraintes), Output Format (à quoi cela doit-il ressembler ?).',
    },
    bloomLevel: 1,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-22',
    question: 'Wat is het RALF-framework?',
    questionI18n: {
      en: 'What is the RALF framework?',
      nl: 'Wat is het RALF-framework?',
      fr: 'Qu\'est-ce que le framework RALF ?',
    },
    options: [
      'Een beveiligingsprotocol: Risk, Authentication, Logging, Firewall',
      'Een AI-kwaliteitscyclus: Review, Analyze, Learn, Fix',
      'Een modelkeuze-raamwerk: Reliable, Affordable, Lightweight, Fast',
      'Een dataverwerkingsprincipe: Reduce, Anonymise, Limit, Filter',
    ],
    optionsI18n: {
      en: [
        'A security protocol: Risk, Authentication, Logging, Firewall',
        'An AI quality cycle: Review, Analyze, Learn, Fix',
        'A model selection framework: Reliable, Affordable, Lightweight, Fast',
        'A data processing principle: Reduce, Anonymise, Limit, Filter',
      ],
      nl: [
        'Een beveiligingsprotocol: Risk, Authentication, Logging, Firewall',
        'Een AI-kwaliteitscyclus: Review, Analyze, Learn, Fix',
        'Een modelkeuze-raamwerk: Reliable, Affordable, Lightweight, Fast',
        'Een dataverwerkingsprincipe: Reduce, Anonymise, Limit, Filter',
      ],
      fr: [
        'Un protocole de sécurité : Risk, Authentication, Logging, Firewall',
        'Un cycle de qualité IA : Review, Analyze, Learn, Fix',
        'Un cadre de sélection de modèle : Reliable, Affordable, Lightweight, Fast',
        'Un principe de traitement de données : Reduce, Anonymise, Limit, Filter',
      ],
    },
    correctIndex: 1,
    explanation: 'RALF is een kwaliteitscyclus voor AI-output: Review (lees het terug), Analyze (voldoet het aan de spec?), Learn (wat klopt niet?), Fix (verbeter het). Het is de kern van iteratief AI-gebruik.',
    explanationI18n: {
      en: 'RALF is a quality cycle for AI output: Review (read it back), Analyze (does it meet the spec?), Learn (what is wrong?), Fix (improve it). It is the core of iterative AI use.',
      nl: 'RALF is een kwaliteitscyclus voor AI-output: Review (lees het terug), Analyze (voldoet het aan de spec?), Learn (wat klopt niet?), Fix (verbeter het). Het is de kern van iteratief AI-gebruik.',
      fr: 'RALF est un cycle de qualité pour les sorties IA : Review (relire), Analyze (correspond-il au spec ?), Learn (qu\'est-ce qui cloche ?), Fix (améliorer). C\'est le cœur de l\'usage itératif de l\'IA.',
    },
    bloomLevel: 1,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-23',
    question: 'Je schrijft een prompt voor het analyseren van een Jira-ticket. Welke benadering levert de beste output?',
    questionI18n: {
      en: 'You write a prompt to analyse a Jira ticket. Which approach yields the best output?',
      nl: 'Je schrijft een prompt voor het analyseren van een Jira-ticket. Welke benadering levert de beste output?',
      fr: 'Vous écrivez un prompt pour analyser un ticket Jira. Quelle approche produit la meilleure sortie ?',
    },
    options: [
      '"Analyseer dit ticket"',
      '"Je bent een senior Agile coach. Analyseer dit Jira-ticket op: sprint-impact, afhankelijkheden en aanbevolen story points. Geef je antwoord in een tabel."',
      '"Maak dit ticket beter"',
      '"Wat denk je van dit ticket?"',
    ],
    optionsI18n: {
      en: [
        '"Analyse this ticket"',
        '"You are a senior Agile coach. Analyse this Jira ticket for: sprint impact, dependencies, and recommended story points. Provide your answer in a table."',
        '"Make this ticket better"',
        '"What do you think of this ticket?"',
      ],
      nl: [
        '"Analyseer dit ticket"',
        '"Je bent een senior Agile coach. Analyseer dit Jira-ticket op: sprint-impact, afhankelijkheden en aanbevolen story points. Geef je antwoord in een tabel."',
        '"Maak dit ticket beter"',
        '"Wat denk je van dit ticket?"',
      ],
      fr: [
        '« Analyse ce ticket »',
        '« Tu es un coach Agile senior. Analyse ce ticket Jira selon : impact sprint, dépendances et story points recommandés. Donne ta réponse sous forme de tableau. »',
        '« Améliore ce ticket »',
        '« Que penses-tu de ce ticket ? »',
      ],
    },
    correctIndex: 1,
    explanation: 'De tweede optie past het Pentagon Model toe: Role (senior Agile coach), Context (impliciet: sprint-context), Goal (analyseer), Constraints (sprint-impact, afhankelijkheden, SP), Output Format (tabel). Specifiek en gestructureerd.',
    explanationI18n: {
      en: 'The second option applies the Pentagon Model: Role (senior Agile coach), Context (implicit: sprint context), Goal (analyse), Constraints (sprint impact, dependencies, SP), Output Format (table). Specific and structured.',
      nl: 'De tweede optie past het Pentagon Model toe: Role (senior Agile coach), Context (impliciet: sprint-context), Goal (analyseer), Constraints (sprint-impact, afhankelijkheden, SP), Output Format (tabel). Specifiek en gestructureerd.',
      fr: 'La deuxième option applique le Pentagon Model : Role (coach Agile senior), Context (implicite : contexte sprint), Goal (analyser), Constraints (impact sprint, dépendances, SP), Output Format (tableau). Spécifique et structuré.',
    },
    bloomLevel: 3,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-24',
    question: 'Wat is "Intent Engineering" in de context van AI-gebruik?',
    questionI18n: {
      en: 'What is "Intent Engineering" in the context of AI use?',
      nl: 'Wat is "Intent Engineering" in de context van AI-gebruik?',
      fr: 'Qu\'est-ce que l\'« Intent Engineering » dans le contexte de l\'utilisation IA ?',
    },
    options: [
      'Het technisch configureren van AI-intentieherkenning',
      'Communiceren van het WAAROM achter je vraag — goal hierarchies en motivaties meegeven',
      'Het testen of een AI-model de juiste intentie heeft',
      'Een methode om AI-output automatisch te filteren op intentie',
    ],
    optionsI18n: {
      en: [
        'Technically configuring AI intent recognition',
        'Communicating the WHY behind your question — sharing goal hierarchies and motivations',
        'Testing whether an AI model has the right intent',
        'A method to automatically filter AI output by intent',
      ],
      nl: [
        'Het technisch configureren van AI-intentieherkenning',
        'Communiceren van het WAAROM achter je vraag — goal hierarchies en motivaties meegeven',
        'Het testen of een AI-model de juiste intentie heeft',
        'Een methode om AI-output automatisch te filteren op intentie',
      ],
      fr: [
        'Configurer techniquement la reconnaissance d\'intention IA',
        'Communiquer le POURQUOI derrière votre question — partager les hiérarchies de but et motivations',
        'Tester si un modèle IA a la bonne intention',
        'Une méthode pour filtrer automatiquement la sortie IA par intention',
      ],
    },
    correctIndex: 1,
    explanation: 'Intent Engineering gaat verder dan "WAT wil je?" naar "WAAROM wil je het?". Door de motivatie en context te delen krijgt het AI-model de informatie om betere, meer contextrelevante beslissingen te nemen.',
    explanationI18n: {
      en: 'Intent Engineering goes beyond "WHAT do you want?" to "WHY do you want it?". By sharing motivation and context, the AI model gets the information to make better, more contextually relevant decisions.',
      nl: 'Intent Engineering gaat verder dan "WAT wil je?" naar "WAAROM wil je het?". Door de motivatie en context te delen krijgt het AI-model de informatie om betere, meer contextrelevante beslissingen te nemen.',
      fr: 'L\'Intent Engineering va au-delà de « QUE voulez-vous ? » à « POURQUOI le voulez-vous ? ». En partageant motivation et contexte, le modèle IA obtient les informations pour prendre de meilleures décisions plus pertinentes contextuellement.',
    },
    bloomLevel: 2,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-25',
    question: 'Je collega vraagt je AI te gebruiken om een klantcontract te analyseren op risico\'s. Wat doe je als eerste?',
    questionI18n: {
      en: 'Your colleague asks you to use AI to analyse a customer contract for risks. What do you do first?',
      nl: 'Je collega vraagt je AI te gebruiken om een klantcontract te analyseren op risico\'s. Wat doe je als eerste?',
      fr: 'Votre collègue vous demande d\'utiliser l\'IA pour analyser un contrat client à la recherche de risques. Que faites-vous en premier ?',
    },
    options: [
      'Het contract direct in ChatGPT plakken voor snelle analyse',
      'Controleren of het contract persoonsgegevens bevat en of LibreChat de juiste tool is voor dit type analyse',
      'Het contract uitprinten en handmatig analyseren',
      'Een nieuw AI-model selecteren dat gespecialiseerd is in contractanalyse',
    ],
    optionsI18n: {
      en: [
        'Paste the contract directly into ChatGPT for quick analysis',
        'Check whether the contract contains personal data and whether LibreChat is the right tool for this type of analysis',
        'Print the contract and analyse manually',
        'Select a new AI model specialised in contract analysis',
      ],
      nl: [
        'Het contract direct in ChatGPT plakken voor snelle analyse',
        'Controleren of het contract persoonsgegevens bevat en of LibreChat de juiste tool is voor dit type analyse',
        'Het contract uitprinten en handmatig analyseren',
        'Een nieuw AI-model selecteren dat gespecialiseerd is in contractanalyse',
      ],
      fr: [
        'Coller le contrat directement dans ChatGPT pour une analyse rapide',
        'Vérifier si le contrat contient des données personnelles et si LibreChat est le bon outil pour ce type d\'analyse',
        'Imprimer le contrat et l\'analyser manuellement',
        'Sélectionner un nouveau modèle IA spécialisé dans l\'analyse de contrats',
      ],
    },
    correctIndex: 1,
    explanation: 'Voordat je gevoelige documenten analyseert, controleer je: bevat het PII of vertrouwelijke data? Is de gebruikte tool (LibreChat is approved, ChatGPT niet) goedgekeurd? Dit is standaard compliance-gedrag.',
    explanationI18n: {
      en: 'Before analysing sensitive documents, check: does it contain PII or confidential data? Is the tool used (LibreChat is approved, ChatGPT is not) authorised? This is standard compliance behaviour.',
      nl: 'Voordat je gevoelige documenten analyseert, controleer je: bevat het PII of vertrouwelijke data? Is de gebruikte tool (LibreChat is approved, ChatGPT niet) goedgekeurd? Dit is standaard compliance-gedrag.',
      fr: 'Avant d\'analyser des documents sensibles, vérifiez : contiennent-ils des PII ou des données confidentielles ? L\'outil utilisé (LibreChat est approuvé, ChatGPT non) est-il autorisé ? C\'est un comportement standard de conformité.',
    },
    bloomLevel: 4,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-26',
    question: 'Specification Engineering gebruikt GIVEN/WHEN/THEN om:',
    questionI18n: {
      en: 'Specification Engineering uses GIVEN/WHEN/THEN to:',
      nl: 'Specification Engineering gebruikt GIVEN/WHEN/THEN om:',
      fr: 'Specification Engineering utilise GIVEN/WHEN/THEN pour :',
    },
    options: [
      'Bugs in bestaande code te documenteren',
      'AI-output deterministisch en testbaar te maken door exacte invoer-uitvoer-condities te definiëren',
      'Een AI-systeem te certificeren voor hoog-risico gebruik',
      'Testscenario\'s te genereren voor handmatige QA',
    ],
    optionsI18n: {
      en: [
        'Document bugs in existing code',
        'Make AI output deterministic and testable by defining exact input-output conditions',
        'Certify an AI system for high-risk use',
        'Generate test scenarios for manual QA',
      ],
      nl: [
        'Bugs in bestaande code te documenteren',
        'AI-output deterministisch en testbaar te maken door exacte invoer-uitvoer-condities te definiëren',
        'Een AI-systeem te certificeren voor hoog-risico gebruik',
        'Testscenario\'s te genereren voor handmatige QA',
      ],
      fr: [
        'Documenter les bugs dans le code existant',
        'Rendre la sortie IA déterministe et testable en définissant des conditions exactes d\'entrée-sortie',
        'Certifier un système IA pour un usage à haut risque',
        'Générer des scénarios de test pour QA manuelle',
      ],
    },
    correctIndex: 1,
    explanation: 'GIVEN/WHEN/THEN maakt AI-prompts precies: GIVEN (begincondities), WHEN (actie of input), THEN (verwachte output). Dit maakt output voorspelbaar, testbaar en aantoonbaar voldoend aan specificaties.',
    explanationI18n: {
      en: 'GIVEN/WHEN/THEN makes AI prompts precise: GIVEN (initial conditions), WHEN (action or input), THEN (expected output). This makes output predictable, testable and verifiably meeting specifications.',
      nl: 'GIVEN/WHEN/THEN maakt AI-prompts precies: GIVEN (begincondities), WHEN (actie of input), THEN (verwachte output). Dit maakt output voorspelbaar, testbaar en aantoonbaar voldoend aan specificaties.',
      fr: 'GIVEN/WHEN/THEN rend les prompts IA précis : GIVEN (conditions initiales), WHEN (action ou entrée), THEN (sortie attendue). Cela rend la sortie prévisible, testable et vérifiablement conforme aux spécifications.',
    },
    bloomLevel: 3,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-27',
    question: 'Je bouwt een AI-feature die transaction-anomalieën detecteert. Je begint met:',
    questionI18n: {
      en: 'You are building an AI feature that detects transaction anomalies. You start with:',
      nl: 'Je bouwt een AI-feature die transaction-anomalieën detecteert. Je begint met:',
      fr: 'Vous construisez une fonctionnalité IA qui détecte des anomalies de transaction. Vous commencez par :',
    },
    options: [
      'Het productie-datasetsmodel trainen voor maximale nauwkeurigheid',
      'EU AI Act risicoclassificatie, compliance-vereisten vastleggen, dan pas technische implementatie',
      'Het goedkoopste beschikbare model selecteren',
      'Een PoC bouwen met productiedata om stakeholders te overtuigen',
    ],
    optionsI18n: {
      en: [
        'Train the production dataset model for maximum accuracy',
        'EU AI Act risk classification, fix compliance requirements, then technical implementation',
        'Select the cheapest available model',
        'Build a PoC with production data to convince stakeholders',
      ],
      nl: [
        'Het productie-datasetsmodel trainen voor maximale nauwkeurigheid',
        'EU AI Act risicoclassificatie, compliance-vereisten vastleggen, dan pas technische implementatie',
        'Het goedkoopste beschikbare model selecteren',
        'Een PoC bouwen met productiedata om stakeholders te overtuigen',
      ],
      fr: [
        'Entraîner le modèle sur le dataset de production pour précision maximale',
        'Classification de risque EU AI Act, fixer les exigences de conformité, puis implémentation technique',
        'Sélectionner le modèle le moins cher disponible',
        'Construire un PoC avec des données de production pour convaincre les parties prenantes',
      ],
    },
    correctIndex: 1,
    explanation: 'Bij hoog-risico AI (fraudedetectie = Bijlage III EU AI Act) begint het met governance: risicoclassificatie, conformiteitsvereisten, human oversight design. Technische implementatie volgt pas daarna.',
    explanationI18n: {
      en: 'For high-risk AI (fraud detection = Annex III EU AI Act), it starts with governance: risk classification, conformity requirements, human oversight design. Technical implementation follows only after.',
      nl: 'Bij hoog-risico AI (fraudedetectie = Bijlage III EU AI Act) begint het met governance: risicoclassificatie, conformiteitsvereisten, human oversight design. Technische implementatie volgt pas daarna.',
      fr: 'Pour l\'IA à haut risque (détection de fraude = Annexe III EU AI Act), cela commence par la gouvernance : classification de risque, exigences de conformité, conception de supervision humaine. L\'implémentation technique ne suit qu\'après.',
    },
    bloomLevel: 5,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'cmp-28',
    question: 'Welk percentage van de eindtoets moet een medewerker halen voor een AI-geletterdheid certificaat bij Worldline?',
    questionI18n: {
      en: 'What percentage of the final test must an employee score for an AI literacy certificate at Worldline?',
      nl: 'Welk percentage van de eindtoets moet een medewerker halen voor een AI-geletterdheid certificaat bij Worldline?',
      fr: 'Quel pourcentage du test final un employé doit-il obtenir pour un certificat de littératie IA chez Worldline ?',
    },
    options: ['50% — voldoende', '60% — ruim voldoende', '70% — de minimale compliancedrempel', '100% — alles moet correct zijn'],
    optionsI18n: {
      en: ['50% — pass', '60% — comfortable pass', '70% — the minimum compliance threshold', '100% — everything must be correct'],
      nl: ['50% — voldoende', '60% — ruim voldoende', '70% — de minimale compliancedrempel', '100% — alles moet correct zijn'],
      fr: ['50 % — suffisant', '60 % — largement suffisant', '70 % — le seuil minimum de conformité', '100 % — tout doit être correct'],
    },
    correctIndex: 2,
    explanation: '70% is de standaard minimumdrempel voor compliance-certificaten in professionele leertrajecten, inclusief AI-geletterdheid. Dit balanceert grondigheid met haalbaarheid voor technische medewerkers.',
    explanationI18n: {
      en: '70% is the standard minimum threshold for compliance certificates in professional learning paths, including AI literacy. This balances thoroughness with feasibility for technical employees.',
      nl: '70% is de standaard minimumdrempel voor compliance-certificaten in professionele leertrajecten, inclusief AI-geletterdheid. Dit balanceert grondigheid met haalbaarheid voor technische medewerkers.',
      fr: '70 % est le seuil minimum standard pour les certificats de conformité dans les parcours d\'apprentissage professionnels, y compris la littératie IA. Cela équilibre rigueur et faisabilité pour les employés techniques.',
    },
    bloomLevel: 1,
    euAiActRelevant: true,
    points: 5,
  },
  {
    id: 'cmp-29',
    question: 'Welke bewering over AI-modellen is CORRECT?',
    questionI18n: {
      en: 'Which statement about AI models is CORRECT?',
      nl: 'Welke bewering over AI-modellen is CORRECT?',
      fr: 'Quelle affirmation sur les modèles IA est CORRECTE ?',
    },
    options: [
      'Grotere modellen zijn altijd beter voor elke taak',
      'Open-source modellen zijn per definitie onveiliger dan closed-source modellen',
      'Het meest geschikte model hangt af van de taak: nauwkeurigheid, snelheid, privacyvereisten en kosten',
      'Claude-modellen mogen niet worden gebruikt voor code-gerelateerde taken',
    ],
    optionsI18n: {
      en: [
        'Larger models are always better for every task',
        'Open-source models are by definition less safe than closed-source models',
        'The most suitable model depends on the task: accuracy, speed, privacy requirements and cost',
        'Claude models may not be used for code-related tasks',
      ],
      nl: [
        'Grotere modellen zijn altijd beter voor elke taak',
        'Open-source modellen zijn per definitie onveiliger dan closed-source modellen',
        'Het meest geschikte model hangt af van de taak: nauwkeurigheid, snelheid, privacyvereisten en kosten',
        'Claude-modellen mogen niet worden gebruikt voor code-gerelateerde taken',
      ],
      fr: [
        'Les modèles plus grands sont toujours meilleurs pour chaque tâche',
        'Les modèles open-source sont par définition moins sûrs que les modèles closed-source',
        'Le modèle le plus adapté dépend de la tâche : précision, vitesse, exigences de confidentialité et coût',
        'Les modèles Claude ne peuvent pas être utilisés pour des tâches liées au code',
      ],
    },
    correctIndex: 2,
    explanation: 'Modelkeuze is taakspecifiek. Het Model Economy principe: gebruik het goedkoopste model dat adequaat presteert voor de specifieke usecase, rekening houdend met privacy, snelheid en cost-per-token.',
    explanationI18n: {
      en: 'Model selection is task-specific. The Model Economy principle: use the cheapest model that performs adequately for the specific use case, considering privacy, speed and cost-per-token.',
      nl: 'Modelkeuze is taakspecifiek. Het Model Economy principe: gebruik het goedkoopste model dat adequaat presteert voor de specifieke usecase, rekening houdend met privacy, snelheid en cost-per-token.',
      fr: 'Le choix du modèle est spécifique à la tâche. Principe Model Economy : utilisez le modèle le moins cher qui performe adéquatement pour le cas d\'usage spécifique, en tenant compte de la confidentialité, vitesse et coût par token.',
    },
    bloomLevel: 4,
    euAiActRelevant: false,
    points: 8,
  },
  {
    id: 'cmp-30',
    question: 'Je ziet dat een AI-systeem consequent slechtere resultaten geeft voor klanten uit een bepaalde regio. Dit is een voorbeeld van:',
    questionI18n: {
      en: 'You notice an AI system consistently gives worse results for customers from a particular region. This is an example of:',
      nl: 'Je ziet dat een AI-systeem consequent slechtere resultaten geeft voor klanten uit een bepaalde regio. Dit is een voorbeeld van:',
      fr: 'Vous remarquez qu\'un système IA donne systématiquement de moins bons résultats pour les clients d\'une région particulière. C\'est un exemple de :',
    },
    options: [
      'Normale statistische variatie — acceptabel',
      'Algoritmische bias — moet worden gemeld, onderzocht en gecorrigeerd',
      'Een netwerklatencie-probleem',
      'Een API rate-limiting issue',
    ],
    optionsI18n: {
      en: [
        'Normal statistical variation — acceptable',
        'Algorithmic bias — must be reported, investigated and corrected',
        'A network latency problem',
        'An API rate-limiting issue',
      ],
      nl: [
        'Normale statistische variatie — acceptabel',
        'Algoritmische bias — moet worden gemeld, onderzocht en gecorrigeerd',
        'Een netwerklatencie-probleem',
        'Een API rate-limiting issue',
      ],
      fr: [
        'Variation statistique normale — acceptable',
        'Biais algorithmique — doit être signalé, examiné et corrigé',
        'Un problème de latence réseau',
        'Un problème de limitation de débit API',
      ],
    },
    correctIndex: 1,
    explanation: 'Systematisch slechtere resultaten voor een demografische groep is algoritmische bias. Onder de EU AI Act moeten hoog-risico AI-systemen worden getest op bias, en gevonden biases moeten worden gemitigeerd en gedocumenteerd.',
    explanationI18n: {
      en: 'Systematically worse results for a demographic group is algorithmic bias. Under the EU AI Act, high-risk AI systems must be tested for bias, and discovered biases must be mitigated and documented.',
      nl: 'Systematisch slechtere resultaten voor een demografische groep is algoritmische bias. Onder de EU AI Act moeten hoog-risico AI-systemen worden getest op bias, en gevonden biases moeten worden gemitigeerd en gedocumenteerd.',
      fr: 'Des résultats systématiquement moins bons pour un groupe démographique est un biais algorithmique. Sous l\'EU AI Act, les systèmes IA à haut risque doivent être testés pour les biais, et les biais découverts doivent être atténués et documentés.',
    },
    bloomLevel: 5,
    euAiActRelevant: true,
    points: 10,
  },
];

// Helper: get all weekly quiz questions
export function getAllWeeklyQuizQuestions(): McqQuestion[] {
  return curriculum.flatMap((week) => week.weeklyQuiz ?? []);
}

// Helper: get compliance test questions by section
export function getComplianceTestBySection(): { euAiAct: McqQuestion[]; fundamentals: McqQuestion[]; practical: McqQuestion[] } {
  const euAiAct = aiLiteracyComplianceTest.slice(0, 10);
  const fundamentals = aiLiteracyComplianceTest.slice(10, 20);
  const practical = aiLiteracyComplianceTest.slice(20, 30);
  return { euAiAct, fundamentals, practical };
}

// Helper: calculate passing score
export const COMPLIANCE_PASSING_SCORE = 0.70; // 70% minimum
export const COMPLIANCE_TOTAL_POINTS = aiLiteracyComplianceTest.reduce((sum, q) => sum + q.points, 0);

// ─────────────────────────────────────────────────────────────────────────────
// Phase 4 Fix #2 — Role-aware compliance test
// ─────────────────────────────────────────────────────────────────────────────
// 6-persona test (18 apr): non-technical rollen (finops, pm, manager) faalden
// 1-2x op Section 2 (AI Fundamentals technical). Fix: swap 5 deep-tech vragen
// met 5 role-applied vragen die hetzelfde EU AI Act / PCI-DSS kennisniveau
// testen maar op toegankelijker niveau.

const NON_TECHNICAL_ROLES = new Set<string>(['finops', 'pm', 'manager']);

// 5 role-applied substitute questions (voor non-technical rollen) — Wave B 3-talig
const roleAppliedComplianceQuestions: McqQuestion[] = [
  {
    id: 'compliance-role-1',
    question: 'Een collega vraagt je om klantdata naar ChatGPT te sturen voor analyse. Wat doe je?',
    questionI18n: {
      en: 'A colleague asks you to send customer data to ChatGPT for analysis. What do you do?',
      nl: 'Een collega vraagt je om klantdata naar ChatGPT te sturen voor analyse. Wat doe je?',
      fr: 'Un collègue vous demande d\'envoyer des données clients à ChatGPT pour analyse. Que faites-vous ?',
    },
    options: [
      'Data opsturen — ChatGPT is algemeen bekend en veilig',
      'Weigeren: Worldline approved tools zijn Claude Code, LibreChat, en Copilot (niet ChatGPT direct)',
      'Eerst PAN/CVV anonimiseren, dan opsturen',
      'Direct naar de CISO escaleren zonder verder actie',
    ],
    optionsI18n: {
      en: [
        'Send the data — ChatGPT is widely known and safe',
        'Refuse: Worldline-approved tools are Claude Code, LibreChat, and Copilot (not ChatGPT direct)',
        'Anonymise PAN/CVV first, then send',
        'Escalate directly to CISO without further action',
      ],
      nl: [
        'Data opsturen — ChatGPT is algemeen bekend en veilig',
        'Weigeren: Worldline approved tools zijn Claude Code, LibreChat, en Copilot (niet ChatGPT direct)',
        'Eerst PAN/CVV anonimiseren, dan opsturen',
        'Direct naar de CISO escaleren zonder verder actie',
      ],
      fr: [
        'Envoyer les données — ChatGPT est largement connu et sûr',
        'Refuser : les outils approuvés par Worldline sont Claude Code, LibreChat et Copilot (pas ChatGPT direct)',
        'Anonymiser PAN/CVV d\'abord, puis envoyer',
        'Escalader directement au CISO sans autre action',
      ],
    },
    correctIndex: 1,
    explanation: 'Alleen approved tools (Claude Code PRIMARY, LibreChat fallback, Copilot in IDE) zijn toegestaan. Zelfs na anonimisering blijft Worldline data naar non-approved tools een compliance-breach.',
    explanationI18n: {
      en: 'Only approved tools (Claude Code PRIMARY, LibreChat fallback, Copilot in IDE) are allowed. Even after anonymisation, Worldline data going to non-approved tools remains a compliance breach.',
      nl: 'Alleen approved tools (Claude Code PRIMARY, LibreChat fallback, Copilot in IDE) zijn toegestaan. Zelfs na anonimisering blijft Worldline data naar non-approved tools een compliance-breach.',
      fr: 'Seuls les outils approuvés (Claude Code PRIMAIRE, LibreChat fallback, Copilot dans l\'IDE) sont autorisés. Même après anonymisation, des données Worldline envoyées à des outils non approuvés restent une violation de conformité.',
    },
    bloomLevel: 3,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'compliance-role-2',
    question: 'Wat is het verschil tussen "AI makes a decision" en "AI assists a decision" volgens EU AI Act?',
    questionI18n: {
      en: 'What is the difference between "AI makes a decision" and "AI assists a decision" under the EU AI Act?',
      nl: 'Wat is het verschil tussen "AI makes a decision" en "AI assists a decision" volgens EU AI Act?',
      fr: 'Quelle est la différence entre « l\'IA prend une décision » et « l\'IA assiste une décision » selon l\'EU AI Act ?',
    },
    options: [
      'Geen verschil — beide zijn gelijk gereguleerd',
      'AI makes = high-risk automatisch; AI assists = human-in-loop vereist, dus lagere risico-classificatie',
      'AI assists is verboden onder Art. 5',
      'Alleen "AI makes" moet gelogd worden',
    ],
    optionsI18n: {
      en: [
        'No difference — both are regulated equally',
        'AI makes = high-risk automatically; AI assists = human-in-loop required, so lower risk classification',
        'AI assists is banned under Art. 5',
        'Only "AI makes" needs to be logged',
      ],
      nl: [
        'Geen verschil — beide zijn gelijk gereguleerd',
        'AI makes = high-risk automatisch; AI assists = human-in-loop vereist, dus lagere risico-classificatie',
        'AI assists is verboden onder Art. 5',
        'Alleen "AI makes" moet gelogd worden',
      ],
      fr: [
        'Aucune différence — les deux sont réglementés à l\'identique',
        'AI makes = haut risque automatiquement ; AI assists = humain dans la boucle requis, donc classification de risque inférieure',
        'AI assists est interdit sous l\'Art. 5',
        'Seul « AI makes » doit être journalisé',
      ],
    },
    correctIndex: 1,
    explanation: 'Human-in-loop (Art. 14) is kern-verschil. Als mens eindbeslissing neemt op basis van AI-suggestie, valt het vaak in "limited risk". Volautonoom AI = "high-risk" met conformity assessment.',
    explanationI18n: {
      en: 'Human-in-loop (Art. 14) is the core difference. When a human makes the final decision based on AI suggestion, it often falls into "limited risk". Fully autonomous AI = "high-risk" with conformity assessment.',
      nl: 'Human-in-loop (Art. 14) is kern-verschil. Als mens eindbeslissing neemt op basis van AI-suggestie, valt het vaak in "limited risk". Volautonoom AI = "high-risk" met conformity assessment.',
      fr: 'L\'humain dans la boucle (Art. 14) est la différence centrale. Si un humain prend la décision finale sur la base d\'une suggestion IA, cela tombe souvent en « risque limité ». IA totalement autonome = « haut risque » avec évaluation de conformité.',
    },
    bloomLevel: 4,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'compliance-role-3',
    question: 'Je bouwt een AI-adoptie KPI dashboard. Welke metric is GEEN goede indicator?',
    questionI18n: {
      en: 'You are building an AI adoption KPI dashboard. Which metric is NOT a good indicator?',
      nl: 'Je bouwt een AI-adoptie KPI dashboard. Welke metric is GEEN goede indicator?',
      fr: 'Vous construisez un dashboard KPI d\'adoption IA. Quelle métrique n\'est PAS un bon indicateur ?',
    },
    options: [
      '% AI-assisted PRs met "ai-assisted" Jira label',
      'Gemiddelde tijd per code review (voor/na AI)',
      'Totaal aantal prompts verzonden naar Claude Code',
      'Bias-audit score op fraud-classificatie uitkomsten',
    ],
    optionsI18n: {
      en: [
        '% of AI-assisted PRs with "ai-assisted" Jira label',
        'Average time per code review (before/after AI)',
        'Total number of prompts sent to Claude Code',
        'Bias-audit score on fraud-classification outcomes',
      ],
      nl: [
        '% AI-assisted PRs met "ai-assisted" Jira label',
        'Gemiddelde tijd per code review (voor/na AI)',
        'Totaal aantal prompts verzonden naar Claude Code',
        'Bias-audit score op fraud-classificatie uitkomsten',
      ],
      fr: [
        '% de PRs assistés par IA avec label Jira « ai-assisted »',
        'Temps moyen par revue de code (avant/après IA)',
        'Nombre total de prompts envoyés à Claude Code',
        'Score d\'audit de biais sur les résultats de classification de fraude',
      ],
    },
    correctIndex: 2,
    explanation: 'Totaal prompts meet activiteit, niet waarde. Velocity-verandering, kwaliteit, en bias-audits zijn outcome-metrics die AI-adoption ROI aantonen.',
    explanationI18n: {
      en: 'Total prompts measures activity, not value. Velocity change, quality, and bias audits are outcome metrics that prove AI-adoption ROI.',
      nl: 'Totaal prompts meet activiteit, niet waarde. Velocity-verandering, kwaliteit, en bias-audits zijn outcome-metrics die AI-adoption ROI aantonen.',
      fr: 'Le nombre total de prompts mesure l\'activité, pas la valeur. Le changement de vélocité, la qualité et les audits de biais sont des métriques de résultat qui prouvent le ROI de l\'adoption IA.',
    },
    bloomLevel: 5,
    euAiActRelevant: false,
    points: 10,
  },
  {
    id: 'compliance-role-4',
    question: 'Een FinOps analyst genereert fraud-threshold voorstellen met AI. Welke compliance-stap is VERPLICHT?',
    questionI18n: {
      en: 'A FinOps analyst generates fraud-threshold proposals with AI. Which compliance step is MANDATORY?',
      nl: 'Een FinOps analyst genereert fraud-threshold voorstellen met AI. Welke compliance-stap is VERPLICHT?',
      fr: 'Un analyste FinOps génère des propositions de seuils de fraude avec l\'IA. Quelle étape de conformité est OBLIGATOIRE ?',
    },
    options: [
      'Geen — FinOps is analyse, geen productie-decision',
      'Human review door senior engineer + audit trail met prompt/output logging',
      'CISO-approval voor elke prompt',
      'EU AI Act conformity assessment per run',
    ],
    optionsI18n: {
      en: [
        'None — FinOps is analysis, not production decision',
        'Human review by senior engineer + audit trail with prompt/output logging',
        'CISO approval for every prompt',
        'EU AI Act conformity assessment per run',
      ],
      nl: [
        'Geen — FinOps is analyse, geen productie-decision',
        'Human review door senior engineer + audit trail met prompt/output logging',
        'CISO-approval voor elke prompt',
        'EU AI Act conformity assessment per run',
      ],
      fr: [
        'Aucune — FinOps est de l\'analyse, pas une décision de production',
        'Revue humaine par un ingénieur senior + audit trail avec journalisation prompt/output',
        'Approbation CISO pour chaque prompt',
        'Évaluation de conformité EU AI Act par exécution',
      ],
    },
    correctIndex: 1,
    explanation: 'Fraud-classificatie is high-risk (Annex III). Art. 14 vereist human-in-loop + Art. 12 logging. Conformity assessment is één keer per systeem, niet per run.',
    explanationI18n: {
      en: 'Fraud classification is high-risk (Annex III). Art. 14 requires human-in-loop + Art. 12 logging. Conformity assessment is once per system, not per run.',
      nl: 'Fraud-classificatie is high-risk (Annex III). Art. 14 vereist human-in-loop + Art. 12 logging. Conformity assessment is één keer per systeem, niet per run.',
      fr: 'La classification de fraude est à haut risque (Annexe III). L\'Art. 14 exige l\'humain dans la boucle + l\'Art. 12 la journalisation. L\'évaluation de conformité se fait une fois par système, pas par exécution.',
    },
    bloomLevel: 4,
    euAiActRelevant: true,
    points: 10,
  },
  {
    id: 'compliance-role-5',
    question: 'Je team wil Deep Wiki gebruiken voor auto-documentatie. Wat moet je controleren voor productie-gebruik?',
    questionI18n: {
      en: 'Your team wants to use Deep Wiki for auto-documentation. What must you verify before production use?',
      nl: 'Je team wil Deep Wiki gebruiken voor auto-documentatie. Wat moet je controleren voor productie-gebruik?',
      fr: 'Votre équipe veut utiliser Deep Wiki pour l\'auto-documentation. Que devez-vous vérifier avant utilisation en production ?',
    },
    options: [
      'Alleen dat de docs leesbaar zijn',
      'PCI-DSS scope: geen PAN/CVV in training data + GDPR retention + bias op seniors vs juniors output-kwaliteit',
      'Niets — RAG is read-only dus geen compliance-issues',
      'Alleen of de output in het Nederlands is',
    ],
    optionsI18n: {
      en: [
        'Only that the docs are readable',
        'PCI-DSS scope: no PAN/CVV in training data + GDPR retention + bias on seniors vs juniors output quality',
        'Nothing — RAG is read-only so no compliance issues',
        'Only whether the output is in Dutch',
      ],
      nl: [
        'Alleen dat de docs leesbaar zijn',
        'PCI-DSS scope: geen PAN/CVV in training data + GDPR retention + bias op seniors vs juniors output-kwaliteit',
        'Niets — RAG is read-only dus geen compliance-issues',
        'Alleen of de output in het Nederlands is',
      ],
      fr: [
        'Uniquement que la documentation est lisible',
        'Périmètre PCI-DSS : pas de PAN/CVV dans les données d\'entraînement + rétention GDPR + biais sur la qualité de sortie seniors vs juniors',
        'Rien — RAG est en lecture seule donc pas de problèmes de conformité',
        'Uniquement si la sortie est en néerlandais',
      ],
    },
    correctIndex: 1,
    explanation: 'RAG-systemen leken "safe" maar kunnen sensitive data lekken via retrieval. PCI-DSS (geen card-data), GDPR (retention + lawful basis), en bias-audits op output-kwaliteit zijn alle drie verplicht.',
    explanationI18n: {
      en: 'RAG systems seemed "safe" but can leak sensitive data via retrieval. PCI-DSS (no card data), GDPR (retention + lawful basis), and bias audits on output quality are all three required.',
      nl: 'RAG-systemen leken "safe" maar kunnen sensitive data lekken via retrieval. PCI-DSS (geen card-data), GDPR (retention + lawful basis), en bias-audits op output-kwaliteit zijn alle drie verplicht.',
      fr: 'Les systèmes RAG semblaient « safe » mais peuvent fuiter des données sensibles via la récupération. PCI-DSS (pas de données carte), GDPR (rétention + base légale) et audits de biais sur la qualité de sortie sont les trois requis.',
    },
    bloomLevel: 5,
    euAiActRelevant: true,
    points: 10,
  },
];

/**
 * Phase 4 Fix #2: return role-weighted compliance test.
 * For non-technical roles (finops/pm/manager): replace 5 deep-technical fundamentals
 * questions with 5 role-applied compliance questions that test same EU AI Act /
 * PCI-DSS knowledge at accessible level.
 * For technical roles (backend/frontend/devops/qa): return original 30 questions.
 */
export function getComplianceTestForRole(role: string | undefined): McqQuestion[] {
  if (!role || !NON_TECHNICAL_ROLES.has(role)) {
    return aiLiteracyComplianceTest; // technical roles get original 30
  }

  // Non-technical: swap 5 deep-tech Section 2 questions (indices 12-16) with role-applied
  const result = [...aiLiteracyComplianceTest];
  for (let i = 0; i < 5; i++) {
    result[12 + i] = roleAppliedComplianceQuestions[i];
  }
  return result;
}

/** Cooldown between retry attempts (Phase 4 Fix #2 prevention of brute-forcing) */
export const COMPLIANCE_RETRY_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

// Get all lessons flat
export function getAllLessons(): CurriculumLesson[] {
  return curriculum.flatMap((week) =>
    week.days.flatMap((day) => day.lessons)
  );
}

// Get all exercises flat
export function getAllExercises(): CurriculumExercise[] {
  return getAllLessons().flatMap((lesson) => lesson.exercises ?? []);
}

// Find week by ID
export function getWeekById(id: string): CurriculumWeek | undefined {
  return curriculum.find((w) => w.id === id);
}

// Find lesson by ID
export function getLessonById(id: string): CurriculumLesson | undefined {
  return getAllLessons().find((l) => l.id === id);
}

// v1.9.1 Punt 2 — UI label helper. Maps week index to a "Level N" label
// for presentation. Does NOT change underlying data (weekId / weekNumber
// stay for URL routes + API). Sequential 1..6 regardless of week.number gaps.
export function getLevelLabel(weekIndex: number): string {
  return `Level ${weekIndex + 1}`;
}

// Get Level label for a specific weekId (looks up index in curriculum array).
export function getLevelLabelForWeek(weekId: string): string {
  const idx = curriculum.findIndex((w) => w.id === weekId);
  return idx >= 0 ? getLevelLabel(idx) : weekId;
}

// Ordered list of ALL lessonIds the student traverses in course order.
// Includes pre-work modules + mental-model intro + all curriculum.ts lessons.
// Source of truth for Continue button + Next Lesson navigation.
export const ORDERED_COURSE_LESSON_IDS: readonly string[] = [
  'prework-1-what-is-ai-first',
  'prework-2-claude-code-intro',
  'prework-3-eu-ai-act',
  'prework-4-worldline-compliance',
  'prework-5-laptop-check',
  'mental-model-intro',
  ...getAllLessons().map((l) => l.id),
];

// Get the next lesson ID in course order. Returns undefined if at the end.
export function getNextLessonId(currentLessonId: string): string | undefined {
  const idx = ORDERED_COURSE_LESSON_IDS.indexOf(currentLessonId);
  if (idx === -1 || idx >= ORDERED_COURSE_LESSON_IDS.length - 1) return undefined;
  return ORDERED_COURSE_LESSON_IDS[idx + 1];
}

// Get the first lesson the student has not yet completed (per profile.completedLessons).
// Falls back to the first lesson if nothing completed, or the last lesson if all complete.
export function getFirstIncompleteLessonId(completedLessonIds: readonly string[]): string {
  const completed = new Set(completedLessonIds);
  const firstOpen = ORDERED_COURSE_LESSON_IDS.find((id) => !completed.has(id));
  return firstOpen ?? ORDERED_COURSE_LESSON_IDS[ORDERED_COURSE_LESSON_IDS.length - 1];
}
