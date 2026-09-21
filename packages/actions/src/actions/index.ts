import {emptyRegistry, registerAction} from '../registry.ts';
import {getParticipantCount} from './get-participant-count.ts';
import {getScreenState} from './get-screen-state.ts';
import {startTimer} from './start-timer.ts';

export {ClassroomState, ClassroomStateLive} from './state.ts';

export const registry = registerAction(registerAction(registerAction(emptyRegistry, getScreenState), startTimer), getParticipantCount);
