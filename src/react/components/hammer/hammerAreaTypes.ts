import { CSSProperties, ReactNode } from 'react'

export enum HammerAction {
  None = 'none',
  Pan = 'pan',
  ScaleRotate = 'scale/rotate',
}

export type HammerAreaClamp = [number | undefined, number | undefined] // [min, max]

export interface HammerOnChangeData {
  newValues: HammerAreaValues
  gestureComplete: boolean
}

export type HammerOnChangeCallback = (newData: HammerOnChangeData) => void
export type HammerOnResizeCallback = (width: number, height: number) => void
export type HammerOnTapCallback = (x: number, y: number, target: HTMLElement) => void

export interface HammerAreaValues {
  rotation: number
  scale: number
  x: number
  y: number
}

export interface HammerAreaProps {
  // contents of the HammerArea
  children?: ReactNode
  // bounds on which to clamp the scale
  clampScale?: HammerAreaClamp
  // bounds on which to clamp the rotation
  clampRotation?: HammerAreaClamp
  // bounds on which to clamp the X offset
  clampX?: HammerAreaClamp
  // bounds on which to clamp to Y offset
  clampY?: HammerAreaClamp
  // whether to take the scale into account when updating the other dimensions;
  // this would apply if the scale were not used to update the visual display
  // of the children
  lockScale?: boolean
  // whether to take the rotation into account when updating the other dimensions;
  // this would apply if the rotation were not used to update the visual display
  // of the children
  lockRotation?: boolean
  // whether to take the X offset into account when updating the other dimensions;
  // this would apply if the X offset were not used to update the visual display
  // of the children
  lockX?: boolean
  // whether to take the Y offset into account when updating the other dimensions;
  // this would apply if the Y offset were not used to update the visual display
  // of the children
  lockY?: boolean
  // callback function triggered when any of the coordinates changes
  onChange?: HammerOnChangeCallback
  // callback function triggered when the area is tapped
  onResize?: HammerOnResizeCallback
  onTap?: HammerOnTapCallback
  // elements to render inside the div to which Hammer is attached;
  // these elements may be interacted with, to the extent that such
  // interaction does not conflict with the user events that Hammer
  // is listening for. And, Hammer will be aware if, for instance,
  // one of these elements is tapped on as opposed to the main Hammer div
  // itself
  overlay?: ReactNode
  // style to apply to the container div that wraps the HammerArea's children
  style?: CSSProperties
  // elements to render beneath the div to which Hammer is attached;
  // these elements will be visible but may not be interacted with
  // and will receive no events
  underlay?: ReactNode
  // overrides for the internal state values of the HammerArea
  values?: Partial<HammerAreaValues>
}
