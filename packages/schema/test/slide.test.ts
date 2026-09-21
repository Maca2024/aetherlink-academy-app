import {describe, expect, it} from 'vitest';
import {decodeSlide, encodeSlide, participantSlide} from '../src/index.ts';

const base = {id: 'slide-1', lessonId: 'lesson-1', ordinal: 1, title: 'Title', type: 'context' as const};
const examples = [
  base,
  {...base, id: 'slide-pillars', layout: 'pillars' as const, items: [{label: 'Useful'}]},
  {...base, id: 'slide-steps', layout: 'steps' as const, items: [{label: 'Step', caption: 'Caption'}]},
  {...base, id: 'slide-compare', layout: 'compare' as const, columns: [{title: 'A', items: ['one']}]},
  {...base, id: 'slide-exercise', layout: 'exercise' as const, steps: ['Do it'], timer: 25},
  {...base, id: 'slide-recap', layout: 'recap' as const, items: [{label: 'Done'}]},
];

describe('Slide schema', () => {
  it('decodes every layout observed in the source fixture, including absent layout', () => {
    for (const example of examples) {
      const decoded = decodeSlide(example);
      expect(encodeSlide(decoded)).toEqual(example);
    }
  });

  it('rejects unknown layouts with a layout path', () => {
    try { decodeSlide({...base, layout: 'invented'}); throw new Error('expected parse failure'); }
    catch (error) { expect(String(error)).toMatch(/layout/); }
  });

  it('keeps prompt whitespace and visual metadata while removing only quiz answers for participants', () => {
    const prompt = 'first line\n  second line\n';
    const slide = decodeSlide({...base, prompt, notes: 'speaker', secret: 'hidden', visual: {quiz: {answer: 2, prompt: 'keep'}, art: {quiz: {answer: 'display label'}}, bot: 'wave', answer: 'legitimate'} });
    const projected = participantSlide(slide);
    expect(projected.prompt).toBe(prompt);
    expect(projected).toEqual({...base, prompt, visual: {quiz: {prompt: 'keep'}, art: {quiz: {answer: 'display label'}}, bot: 'wave', answer: 'legitimate'}});
  });

  it('projects a slide without visual metadata without adding hidden fields', () => {
    const projected = participantSlide(decodeSlide({...base, notes: 'speaker', secret: 'hidden'}));
    expect(projected).toEqual(base);
  });
});
