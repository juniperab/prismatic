import { HammerAreaProps, HammerAreaValues, HammerOnChangeData } from './hammerAreaTypes'

export type HammerOnUpdatePropValuesCallback = (changedValues: Partial<HammerAreaValues>) => void

export interface InternalHammerOnChangeData extends HammerOnChangeData {
  newDisplayValues: HammerAreaValues
}
export type InternalHammerOnChangeCallback = (newData: InternalHammerOnChangeData) => void

export interface InternalHammerAreaProps extends HammerAreaProps {
  // overrides for the internal state values of the HammerArea
  displayValues?: Partial<HammerAreaValues>
  // additional callback function triggered when any of the coordinates changes
  onChangeInternal?: InternalHammerOnChangeCallback
  // callback function triggered when the values of the HammerArea change as
  // a result of the component's props updating
  onUpdatePropValues?: HammerOnUpdatePropValuesCallback
}

export interface HammerEventValues {
  rotation: number
  scale: number
  x: number
  y: number
}
