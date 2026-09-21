import React, {useEffect, useMemo, useState} from 'react';
import {ArrowRight, Check, ChevronDown, Circle, Clock, GraduationCap, LockKeyhole, Sparkles} from 'lucide-react';
import {api} from '../api';
import {useI18n} from '../i18n';
import {
  curriculum,
  getLocalizedDay,
  getLocalizedExercise,
  getLocalizedLesson,
  getLocalizedWeek,
} from './data/curriculum';

const allLessons = curriculum.flatMap((week) => week.days.flatMap((day) => day.lessons));
const allExercises = allLessons.flatMap((lesson) => lesson.exercises || []);
const firstLessonId = allLessons[0]?.id || null;

const copy = (locale, en, nl) => locale === 'nl' ? nl : en;

function MarkdownContent({value}) {
  const lines = String(value || '').split(/\r?\n/);
  let code = false;
  return <div className="worldline-markdown">
    {lines.map((line, index) => {
      if (line.trim().startsWith('```')) {
        code = !code;
        return <div className="worldline-code-fence" key={`fence-${index}`} aria-hidden="true"/>;
      }
      if (code) return <pre className="worldline-code" key={`code-${index}`}>{line || ' '}</pre>;
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        const Tag = heading[1].length === 1 ? 'h2' : heading[1].length === 2 ? 'h3' : 'h4';
        return <Tag key={`heading-${index}`}>{heading[2]}</Tag>;
      }
      if (/^\s*[-*]\s+/.test(line)) return <li key={`item-${index}`}>{line.replace(/^\s*[-*]\s+/, '')}</li>;
      if (!line.trim()) return <div className="worldline-spacer" key={`space-${index}`} aria-hidden="true"/>;
      return <p key={`paragraph-${index}`}>{line}</p>;
    })}
  </div>;
}

function ProgressRing({completed, total}) {
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return <div className="worldline-progress-ring" style={{'--progress': `${percent * 3.6}deg`}} aria-label={`${percent}% complete`}>
    <strong>{percent}%</strong><small>{completed}/{total}</small>
  </div>;
}

export function WorldlineCourse({room}) {
  const {locale} = useI18n();
  const [progress, setProgress] = useState({completedLessonIds: [], completedExerciseIds: [], activeLessonId: firstLessonId});
  const [activeLessonId, setActiveLessonId] = useState(firstLessonId);
  const [activeWeekId, setActiveWeekId] = useState(curriculum[0]?.id);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setError('');
    api('worldline-progress').then((next) => {
      if (!active) return;
      setProgress(next);
      const nextId = next.activeLessonId || allLessons.find((lesson) => !next.completedLessonIds.includes(lesson.id))?.id || firstLessonId;
      setActiveLessonId(nextId);
      const week = curriculum.find((candidate) => candidate.days.some((day) => day.lessons.some((lesson) => lesson.id === nextId)));
      if (week) setActiveWeekId(week.id);
    }).catch((cause) => active && setError(cause.message));
    return () => { active = false; };
  }, [room.me?.id]);

  const completedLessons = useMemo(() => new Set(progress.completedLessonIds || []), [progress.completedLessonIds]);
  const completedExercises = useMemo(() => new Set(progress.completedExerciseIds || []), [progress.completedExerciseIds]);
  const week = curriculum.find((candidate) => candidate.id === activeWeekId) || curriculum[0];
  const lesson = allLessons.find((candidate) => candidate.id === activeLessonId) || week?.days[0]?.lessons[0];
  const localizedWeek = week ? getLocalizedWeek(week, locale) : null;
  const localizedLesson = lesson ? getLocalizedLesson(lesson, locale) : null;
  const currentDay = week?.days.find((day) => day.lessons.some((candidate) => candidate.id === lesson?.id)) || week?.days[0];
  const localizedCurrentDay = currentDay ? getLocalizedDay(currentDay, locale) : null;
  const completedCount = completedLessons.size;
  const nextLesson = lesson ? allLessons[allLessons.findIndex((candidate) => candidate.id === lesson.id) + 1] : null;

  function selectWeek(nextWeek) {
    setActiveWeekId(nextWeek.id);
    const next = nextWeek.days[0]?.lessons[0];
    if (next) setActiveLessonId(next.id);
  }

  async function saveProgress(payload, id) {
    if (room.me.role === 'Facilitator') return;
    setBusyId(id);
    setError('');
    try {
      const next = await api('worldline-progress', payload);
      setProgress(next);
      if (next.activeLessonId) setActiveLessonId(next.activeLessonId);
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusyId(null);
    }
  }

  function openLesson(nextLesson) {
    setActiveLessonId(nextLesson.id);
    const nextWeek = curriculum.find((candidate) => candidate.days.some((day) => day.lessons.some((candidateLesson) => candidateLesson.id === nextLesson.id)));
    if (nextWeek) setActiveWeekId(nextWeek.id);
  }

  const lessonIsComplete = Boolean(lesson && completedLessons.has(lesson.id));
  return <section className="worldline-course" aria-labelledby="worldline-course-title">
    <div className="worldline-hero">
      <div>
        <p className="worldline-eyebrow"><GraduationCap size={16}/>{copy(locale, 'WORLDLINE AI-FIRST ACADEMY', 'WORLDLINE AI-FIRST ACADEMY')}</p>
        <h2 id="worldline-course-title">{copy(locale, 'Build the way AI works.', 'Bouw de manier waarop AI werkt.')}</h2>
        <p className="worldline-lede">{copy(locale, 'A complete 9-week path from AI foundations to RALF, Claude Code and team-scale delivery.', 'Een complete 9-weekse route van AI-fundamentals naar RALF, Claude Code en delivery op teamschaal.')}</p>
      </div>
      <div className="worldline-hero-stats">
        <ProgressRing completed={completedCount} total={allLessons.length}/>
        <div><strong>{curriculum.length}</strong><span>{copy(locale, 'levels', 'levels')}</span></div>
        <div><strong>{allExercises.length}</strong><span>{copy(locale, 'labs & exercises', 'labs & oefeningen')}</span></div>
      </div>
    </div>

    {error && <div className="error" role="alert">{error}</div>}
    {room.me.role === 'Facilitator' && <div className="worldline-facilitator-note"><LockKeyhole size={16}/>{copy(locale, 'Facilitator view: participants save their own course progress.', 'Facilitatorweergave: deelnemers slaan hun eigen cursusvoortgang op.')}</div>}

    <div className="worldline-layout">
      <aside className="worldline-curriculum" aria-label={copy(locale, 'Course levels', 'Cursuslevels')}>
        <div className="worldline-side-heading"><span>{copy(locale, 'THE PATH', 'DE ROUTE')}</span><small>{completedCount}/{allLessons.length}</small></div>
        {curriculum.map((candidate, index) => {
          const candidateLessons = candidate.days.flatMap((day) => day.lessons);
          const done = candidateLessons.filter((candidateLesson) => completedLessons.has(candidateLesson.id)).length;
          const localized = getLocalizedWeek(candidate, locale);
          return <button type="button" key={candidate.id} className={`worldline-level ${candidate.id === week?.id ? 'selected' : ''}`} onClick={() => selectWeek(candidate)}>
            <span className="worldline-level-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="worldline-level-copy"><strong>{localized.title}</strong><small>{done}/{candidateLessons.length} · {candidate.badgeName || copy(locale, 'level', 'level')}</small></span>
            <span className="worldline-level-mark">{done === candidateLessons.length && candidateLessons.length ? <Check size={15}/> : <ChevronDown size={15}/>}</span>
          </button>;
        })}
      </aside>

      <div className="worldline-main">
        {localizedWeek && <div className="worldline-week-heading">
          <div><p className="worldline-eyebrow">LEVEL {String((curriculum.indexOf(week) + 1)).padStart(2, '0')} · {localizedCurrentDay?.title}</p><h3>{localizedWeek.title}</h3><p>{localizedWeek.description}</p></div>
          <Sparkles size={23}/>
        </div>}
        <div className="worldline-lesson-list">
          {week?.days.flatMap((day) => { const localizedDay = getLocalizedDay(day, locale); return localizedDay.lessons.map((candidate) => ({...getLocalizedLesson(candidate, locale), dayTitle: localizedDay.title})); }).map((candidate) => <button type="button" key={candidate.id} className={`worldline-lesson-row ${candidate.id === lesson?.id ? 'selected' : ''}`} onClick={() => setActiveLessonId(candidate.id)}>
            <span className={`worldline-status ${completedLessons.has(candidate.id) ? 'done' : ''}`}>{completedLessons.has(candidate.id) ? <Check size={14}/> : <Circle size={13}/>}</span>
            <span><small>{candidate.dayTitle} · {candidate.type}</small><strong>{candidate.title}</strong></span>
            <span className="worldline-duration"><Clock size={13}/>{candidate.duration}m</span>
          </button>)}
        </div>

        {localizedLesson && <article className="worldline-lesson-card">
          <div className="worldline-lesson-meta"><span>{localizedLesson.type}</span><span>{localizedLesson.duration} min</span><span>{lessonIsComplete ? copy(locale, 'Completed', 'Afgerond') : copy(locale, 'In progress', 'Bezig')}</span></div>
          <h3>{localizedLesson.title}</h3>
          <p className="worldline-lesson-description">{localizedLesson.description}</p>
          <MarkdownContent value={localizedLesson.content}/>
          {(localizedLesson.exercises || []).length > 0 && <div className="worldline-exercises">
            <div className="worldline-section-label"><span>{copy(locale, 'PRACTICE LAB', 'PRACTICE LAB')}</span><small>{localizedLesson.exercises.length} {copy(locale, 'exercises', 'oefeningen')}</small></div>
            {localizedLesson.exercises.map((exercise) => {
              const localizedExercise = getLocalizedExercise(exercise, locale);
              const done = completedExercises.has(exercise.id);
              return <div className={`worldline-exercise ${done ? 'done' : ''}`} key={exercise.id}>
                <button type="button" className="worldline-exercise-toggle" disabled={busyId === exercise.id || room.me.role === 'Facilitator'} onClick={() => saveProgress({exerciseId: exercise.id, completed: !done, activeLessonId: lesson.id}, exercise.id)} aria-label={done ? copy(locale, 'Mark exercise open', 'Markeer oefening als open') : copy(locale, 'Mark exercise complete', 'Markeer oefening als afgerond')}>
                  {done ? <Check size={15}/> : <Circle size={15}/>}
                </button>
                <div><strong>{localizedExercise.title}</strong><p>{localizedExercise.instructions}</p><small>{localizedExercise.points} pts · {copy(locale, 'difficulty', 'moeilijkheid')} {localizedExercise.difficulty}/3</small></div>
              </div>;
            })}
          </div>}
          <div className="worldline-lesson-actions">
            <button type="button" className={lessonIsComplete ? 'secondary' : 'gradient'} disabled={busyId === lesson?.id || room.me.role === 'Facilitator'} onClick={() => saveProgress({lessonId: lesson.id, completed: !lessonIsComplete, activeLessonId: lesson.id}, lesson.id)}>
              {lessonIsComplete ? <Check size={17}/> : <Circle size={17}/>} {lessonIsComplete ? copy(locale, 'Completed', 'Afgerond') : copy(locale, 'Mark complete', 'Markeer als afgerond')}
            </button>
            {nextLesson && <button type="button" className="worldline-next" onClick={() => openLesson(nextLesson)}>{copy(locale, 'Next lesson', 'Volgende les')} <ArrowRight size={17}/></button>}
          </div>
        </article>}
      </div>
    </div>
  </section>;
}
