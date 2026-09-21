// ─────────────────────────────────────────────────────────────────────────────
// Daily schedule — shared across all curriculum-week-N.ts files.
// Extracted from curriculum.ts to break circular import (TDZ) between
// curriculum.ts ↔ curriculum-week-0.ts ↔ curriculum-week-1.ts ↔ ...
// ─────────────────────────────────────────────────────────────────────────────

export interface ScheduleBlock {
  time: string;
  emoji: string;
  label: string;
  type: 'checkin' | 'theory' | 'break' | 'demo' | 'lab' | 'review' | 'wrapup' | 'lunch';
}

export const dailySchedule: ScheduleBlock[] = [
  { time: '09:00 - 09:30', emoji: '☕', label: 'Check-in & Dag Preview', type: 'checkin' },
  { time: '09:30 - 10:00', emoji: '📚', label: 'Theorie Blok', type: 'theory' },
  { time: '10:00 - 10:15', emoji: '☕', label: 'Koffiepauze', type: 'break' },
  { time: '10:15 - 11:00', emoji: '⚡', label: 'Live Demo', type: 'demo' },
  { time: '11:00 - 12:30', emoji: '🔨', label: 'Hands-on Lab', type: 'lab' },
  { time: '12:30 - 13:30', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
  { time: '13:30 - 15:30', emoji: '🔨', label: 'Hands-on Lab deel 2', type: 'lab' },
  { time: '15:30 - 15:45', emoji: '☕', label: 'Pauze', type: 'break' },
  { time: '15:45 - 16:15', emoji: '🔄', label: 'RALF Review', type: 'review' },
  { time: '16:15 - 16:30', emoji: '📋', label: 'Wrap-up & Morgen Preview', type: 'wrapup' },
];
