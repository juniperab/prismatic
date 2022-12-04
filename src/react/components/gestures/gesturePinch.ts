// Attribution: from Elsy Santos: https://github.com/elsa-santos/react-gesture-handler

import { RecognizerBase } from "./gestureBase"

export enum PinchEvent {
  PINCH = 'pinch', // together with all of below
  PINCH_START = 'pinchstart',
  PINCH_MOVE = 'pinchmove',
  PINCH_END = 'pinchend',
  PINCH_CANCEL = 'pinchcancel',
  PINCH_IN = 'pinchin',
  PINCH_OUT = 'pinchout'
}

export type PinchEvents = Partial<Record<PinchEvent, HammerListener>>;

export interface RecognizersPinch extends RecognizerBase {
  events?: PinchEvents;
}