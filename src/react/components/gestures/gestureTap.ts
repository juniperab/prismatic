// Attribution: from Elsy Santos: https://github.com/elsa-santos/react-gesture-handler

import { RecognizerBase } from "./gestureBase"

export enum TapEvent {
  TAP = 'tap'
}

export type TapEvents = Partial<Record<TapEvent, HammerListener>>;

export interface RecognizersTap extends RecognizerBase {
  events?: TapEvents;
}