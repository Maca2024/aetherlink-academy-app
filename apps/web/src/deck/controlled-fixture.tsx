import {createRoot, type Root} from 'react-dom/client';
import {StrictMode, useEffect, useState, type ReactElement} from 'react';
import {Deck, type DeckMode, type DeckSlide} from '@academy/deck';
import {sourceSlides} from './slides.js';
import {normalizeSlides} from './normalize.js';

const fixtureSlides = normalizeSlides(sourceSlides.map((slide) => ({...slide})));

export interface ControlledFixtureControls {
  readonly setSlides: (slides: ReadonlyArray<DeckSlide>) => void;
  readonly setIndex: (index: number) => void;
  readonly setRevealStep: (step: number) => void;
  readonly setMode: (mode: DeckMode) => void;
  readonly reset: () => void;
  readonly unmount: () => void;
}

interface FixtureState {
  readonly slides: ReadonlyArray<DeckSlide>;
  readonly index: number;
  readonly revealStep: number;
  readonly mode: DeckMode;
}

interface FixtureSetters {
  readonly setSlides: (slides: ReadonlyArray<DeckSlide>) => void;
  readonly setIndex: (index: number) => void;
  readonly setRevealStep: (step: number) => void;
  readonly setMode: (mode: DeckMode) => void;
}

const initialState = (): FixtureState => ({slides: fixtureSlides, index: 0, revealStep: -1, mode: 'projector'});

export function mount(container: HTMLElement): ControlledFixtureControls {
  const root: Root = createRoot(container);
  let setters: FixtureSetters | undefined;
  const pending: Array<(next: FixtureSetters) => void> = [];
  const call = (operation: (next: FixtureSetters) => void): void => {
    if (setters) operation(setters);
    else pending.push(operation);
  };

  function Fixture(): ReactElement {
    const initial = initialState();
    const [slides, setSlides] = useState<ReadonlyArray<DeckSlide>>(initial.slides);
    const [index, setIndex] = useState(initial.index);
    const [revealStep, setRevealStep] = useState(initial.revealStep);
    const [mode, setMode] = useState<DeckMode>(initial.mode);
    useEffect(() => {
      setters = {setSlides, setIndex, setRevealStep, setMode};
      const operations = pending.splice(0);
      operations.forEach((operation) => operation(setters!));
      return () => { setters = undefined; };
    });
    const safeIndex = slides.length === 0 ? 0 : Math.min(Math.max(index, 0), slides.length - 1);
    return <Deck slides={slides} index={safeIndex} revealStep={revealStep} mode={mode} onIndexChange={setIndex} onRevealStepChange={setRevealStep} presence={<span>Fixture presence</span>} />;
  }

  root.render(<StrictMode><Fixture/></StrictMode>);
  return {
    setSlides: (slides) => call((next) => next.setSlides(slides)),
    setIndex: (index) => call((next) => next.setIndex(index)),
    setRevealStep: (step) => call((next) => next.setRevealStep(step)),
    setMode: (mode) => call((next) => next.setMode(mode)),
    reset: () => call((next) => { const initial = initialState(); next.setSlides(initial.slides); next.setIndex(initial.index); next.setRevealStep(initial.revealStep); next.setMode(initial.mode); }),
    unmount: () => root.unmount(),
  };
}
