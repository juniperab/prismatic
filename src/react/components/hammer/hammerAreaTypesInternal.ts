import { HammerAreaProps, HammerAreaValues, HammerOnChangeCallback, HammerOnChangeData } from "./hammerAreaTypes";
import { RefObject } from "react";

export type HammerOnUpdatePropValuesCallback = (changedValues: Partial<HammerAreaValues>) => void

export interface InternalHammerOnChangeData extends HammerOnChangeData {
  newDisplayValues: HammerAreaValues,
}
export type InternalHammerOnChangeCallback = (newData: InternalHammerOnChangeData) => void

export interface InternalHammerAreaProps extends HammerAreaProps {
  // overrides for the internal state values of the HammerArea
  displayValues?: Partial<HammerAreaValues>
  onChangeInternal?: InternalHammerOnChangeCallback
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
