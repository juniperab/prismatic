// Attribution: from Elsy Santos: https://github.com/elsa-santos/react-gesture-handler

import { RecognizersPan } from "./gesturePan"
import { RecognizersPinch } from "./gesturePinch"
import { RecognizersPress } from "./gesturePress"
import { RecognizersRotate } from "./gestureRotate"
import { RecognizersSwipe } from "./gestureSwipe"
import { RecognizersTap } from "./gestureTap"
import { RecognizersType } from "./gestureBase"
import { ReactElement, ReactNode, useLayoutEffect, useRef } from "react"
import Hammer from 'hammerjs'

export interface GesturesProps {
  children: ReactNode;
  options?: HammerOptions;
  recognizers?: {
    [RecognizersType.Pan]?: RecognizersPan;
    [RecognizersType.Pinch]?: RecognizersPinch;
    [RecognizersType.Press]?: RecognizersPress;
    [RecognizersType.Rotate]?: RecognizersRotate;
    [RecognizersType.Swipe]?: RecognizersSwipe;
    [RecognizersType.Tap]?: RecognizersTap;
  };
}

export const Gestures = (props: GesturesProps): ReactElement => {
  const { children, options, recognizers, } = props
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const $container: HTMLDivElement | null = containerRef.current;
    let hammer: HammerManager | null = null;
    let recognizersKeyType: RecognizersType[] = [];

    /**
     * initialize hammerJS
     */
    if ($container !== undefined && $container !== null) {
      hammer = new Hammer.Manager($container, options);

      if (recognizers !== undefined && hammer !== undefined) {
        recognizersKeyType = Object.keys(recognizers) as RecognizersType[];

        recognizersKeyType.forEach((recognizerType) => {
          const events = recognizers[recognizerType]?.events;
          const options = recognizers[recognizerType]?.options;

          hammer?.add(new Hammer[recognizerType](options));

          if (events !== undefined) {
            Object.entries(events).forEach(([eventName, event]) => {
              event !== undefined && hammer !== null && hammer.on(`${eventName}`, event);
            });
          }
        });
      }
    }

    return () => {
      if ($container !== null && hammer !== null && recognizers !== undefined) {
        recognizersKeyType.forEach((recognizerType) => {
          const events = recognizers[recognizerType]?.events;
          if (events !== undefined) {
            Object.entries(events).forEach(([eventName, event]) => {
              event !== undefined && hammer !== null && hammer.off(`${eventName}`, event);
            });
          }
        });
        hammer.destroy();
      }
    };
  }, [options, recognizers]);

  return <div ref={containerRef}>{children}</div>;
};

