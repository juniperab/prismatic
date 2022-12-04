// Attribution: from Elsy Santos: https://github.com/elsa-santos/react-gesture-handler

export enum RecognizersType {
  Pan = 'Pan',
  Pinch = 'Pinch',
  Press = 'Press',
  Rotate = 'Rotate',
  Swipe = 'Swipe',
  Tap = 'Tap'
}

export interface RecognizerBase {
  options?: RecognizerOptions;
}
