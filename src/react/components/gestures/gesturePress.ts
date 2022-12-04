// Attribution: from Elsy Santos: https://github.com/elsa-santos/react-gesture-handler

import { RecognizerBase } from "./gestureBase"

export enum PressEvent {
  PRESS = 'press',
  PRESS_UP = 'pressup'
}

export type PressEvents = Partial<Record<PressEvent, HammerListener>>;

export interface RecognizersPress extends RecognizerBase {
  events?: PressEvents;
}