// Attribution: from Elsy Santos: https://github.com/elsa-santos/react-gesture-handler

import { RecognizerBase } from "./gestureBase"

export enum RotateEvent {
  ROTATE = 'rotate',
  ROTATE_START = 'rotatestart',
  ROTATE_MOVE = 'rotatemove',
  ROTATE_END = 'rotateend',
  ROTATE_CANCEL = 'rotatecancel'
}

export type RotateEvents = Partial<Record<RotateEvent, HammerListener>>;

export interface RecognizersRotate extends RecognizerBase {
  events?: RotateEvents;
}