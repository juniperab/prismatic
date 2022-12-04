// Attribution: from Elsy Santos: https://github.com/elsa-santos/react-gesture-handler

import { RecognizerBase } from "./gestureBase"

export enum SwipeEvent {
  SWIPE = 'swipe',
  SWIPE_LEFT = 'swipeleft',
  SWIPE_RIGHT = 'swiperight',
  SWIPE_UP = 'swipeup',
  SWIPE_DOWN = 'swipedown'
}

export type SwipeEvents = Partial<Record<SwipeEvent, HammerListener>>;

export interface RecognizersSwipe extends RecognizerBase {
  events?: SwipeEvents;
}