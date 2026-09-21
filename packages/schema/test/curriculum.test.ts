import {describe, expect, it} from 'vitest';
import {decodeAssignment} from '../src/assignment.ts';
import {decodeCourse, decodeDay, decodeTrack} from '../src/course.ts';
import {decodeLesson} from '../src/lesson.ts';
import {decodeQuizQuestion, participantQuizQuestion} from '../src/quiz.ts';
import {decodeRoom} from '../src/room.ts';

const course = {id: 'course-1', title: {en: 'Effect Foundations'}, locale: 'en' as const, sourceGitUrl: 'https://example.test/repo.git', sourceCommit: 'abc123'};
const track = {id: 'track-1', courseId: 'course-1', version: 1, ordinal: 1, name: {en: 'Core'}};
const day = {id: 'day-1', trackId: 'track-1', courseId: 'course-1', version: 1, ordinal: 1, kind: 'teaching' as const, title: {en: 'Day 1'}};
const lesson = {id: 'lesson-1', dayId: 'day-1', courseId: 'course-1', version: 1, slug: 'intro', title: {en: 'Intro'}, mode: 'guided' as const, durationMinutes: 45};

describe('curriculum entity schemas', () => {
  it('decodes a course, track, day and lesson with version integrity', () => {
    expect(decodeCourse(course).currentVersion).toBeUndefined();
    expect(decodeTrack(track).version).toBe(1);
    expect(decodeDay(day).ordinal).toBe(1);
    expect(decodeLesson(lesson).slug).toBe('intro');
  });

  it('rejects a day ordinal above the 7-day plan with a path naming the field', () => {
    try {
      decodeDay({...day, ordinal: 8});
      throw new Error('expected parse failure');
    } catch (error) {
      expect(String(error)).toMatch(/ordinal/);
    }
  });

  it('rejects a course version below 1', () => {
    try {
      decodeTrack({...track, version: 0});
      throw new Error('expected parse failure');
    } catch (error) {
      expect(String(error)).toMatch(/version/);
    }
  });

  it('decodes an assignment referencing a lesson and localized steps', () => {
    const assignment = decodeAssignment({
      id: 'assignment-1',
      lessonId: 'lesson-1',
      courseId: 'course-1',
      version: 1,
      title: {en: 'Ship it'},
      minutes: 20,
      steps: [{en: 'Do the thing'}],
    });
    expect(assignment.steps?.[0]?.en).toBe('Do the thing');
  });

  it('keeps the quiz answer out of the participant projection', () => {
    const question = decodeQuizQuestion({
      id: 'quiz-1',
      lessonId: 'lesson-1',
      courseId: 'course-1',
      version: 1,
      question: {en: 'What is Effect?'},
      options: [{en: 'A runtime'}, {en: 'A framework'}],
      answer: 0,
    });
    const projected = participantQuizQuestion(question);
    expect(projected).not.toHaveProperty('answer');
    expect(Object.keys(projected)).not.toContain('answer');
  });

  it('decodes a room pin', () => {
    const room = decodeRoom({id: 'room-1', courseId: 'course-1', pinnedVersion: 1});
    expect(room.pinnedVersion).toBe(1);
  });

  it('rejects a quiz with no options', () => {
    expect(() =>
      decodeQuizQuestion({id: 'quiz-2', lessonId: 'lesson-1', courseId: 'course-1', version: 1, question: {en: 'Q'}, options: [], answer: 0}),
    ).toThrow(/options/);
  });

  it('rejects a quiz answer equal to the option count', () => {
    expect(() =>
      decodeQuizQuestion({id: 'quiz-3', lessonId: 'lesson-1', courseId: 'course-1', version: 1, question: {en: 'Q'}, options: [{en: 'One'}], answer: 1}),
    ).toThrow(/answer/);
  });

  it('decodes a lesson with legacy kicker, loop and workedExample fields', () => {
    const decoded = decodeLesson({
      ...lesson,
      kicker: 'Les 3 · Agents in n8n',
      loop: [{label: '0 agents', prompt: 'Wat bewijst de deterministische flow zonder LLM?'}],
      workedExample: 'Importeer starter/n8n-repository-review.json.',
    });
    expect(decoded.loop?.[0]?.label).toBe('0 agents');
    expect(decoded.workedExample).toMatch(/starter/);
  });

  it('decodes a day with guide/participant/agent repo attribution', () => {
    const decoded = decodeDay({...day, guideUrl: 'https://example.test/guide', participantRepo: 'org/participant', agentRepo: 'org/agent'});
    expect(decoded.agentRepo).toBe('org/agent');
  });

  it('decodes an assignment with legacy checks, starterFiles and lessonIds', () => {
    const decoded = decodeAssignment({
      id: 'assignment-2',
      lessonId: 'lesson-1',
      courseId: 'course-1',
      version: 1,
      title: {en: 'Review'},
      minutes: 25,
      checks: ['Verwijs naar een concreet bestand en passage.'],
      starterFiles: ['README.md', 'CLAUDE.md'],
      lessonIds: ['lesson-1', 'lesson-2'],
    });
    expect(decoded.starterFiles).toEqual(['README.md', 'CLAUDE.md']);
    expect(decoded.lessonIds).toHaveLength(2);
  });
});
