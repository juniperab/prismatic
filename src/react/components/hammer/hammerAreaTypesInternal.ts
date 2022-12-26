import { HammerAreaProps, HammerAreaValues, HammerOnChangeData } from './hammerAreaTypes'

export type InternalHammerOnUpdatePropValuesCallback =
  (newValues: HammerAreaValues, newDisplayValues: HammerAreaValues) => void

export interface InternalHammerOnChangeData extends HammerOnChangeData {
  newDisplayValues: HammerAreaValues
}
export type InternalHammerOnChangeCallback = (newData: InternalHammerOnChangeData) => void

export interface InternalHammerAreaProps extends HammerAreaProps {
  // additional callback function triggered when any of the coordinates changes
  onChangeInternal?: InternalHammerOnChangeCallback
  // callback function triggered when the values of the HammerArea change as
  // a result of the component's props updating
  onUpdatePropValues?: InternalHammerOnUpdatePropValuesCallback
}
