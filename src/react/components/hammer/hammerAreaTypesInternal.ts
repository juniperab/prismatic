import { HammerAreaProps, HammerAreaValues } from "./hammerAreaTypes";
import { RefObject } from "react";

export type HammerOnUpdatePropValuesCallback = (changedValues: Partial<HammerAreaValues>) => void

export interface InternalHammerAreaProps extends HammerAreaProps {
  // overrides for the internal state values of the HammerArea
  displayValues?: Partial<HammerAreaValues>
  // callback function triggered when the values of the HammerArea change as
  // a result of the component's props updating
  onUpdatePropValues?: HammerOnUpdatePropValuesCallback
}

export interface _HammerAreaProps extends InternalHammerAreaProps {
  containerHeight: number
  modifierKeyPressed: boolean
  containerRef: RefObject<HTMLDivElement>
  containerWidth: number
}

export interface HammerEventValues {
  rotation: number
  scale: number
  x: number
  y: number
}

export enum HammerAction {
  None = 'none',
  Pan = 'pan',
  ScaleRotate = 'scale/rotate',
}
