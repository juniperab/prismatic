import { HammerAction, HammerAreaProps, HammerAreaValues } from "./hammerAreaTypes";
import { clampValue, valuesEquals, withDefaults } from './hammerAreaFunctions'
import { euclideanDistance } from '../../../lib/math/math'

/**
 * Return the number of degree needed to rotate from a to b.
 * The result will always be on [-180, 180]
 *
 * @param to      the ending-point hues
 * @param from    the starting-point hues
 */
function rotationDiff(to: number, from: number): number {
  let diff = to - from
  while (diff > 180) diff -= 360
  while (diff < -180) diff += 360
  return diff
}

export function internalModifiedEventValuesForScaleRotateExclusion(
  eventValues: { rotation: number, scale: number },
  eventStartValues: { rotation: number, scale: number },
  currentAction: HammerAction,
  rotationThreshold: number,
  scaleThreshold: number,
): [ newEventValues: { rotation: number, scale: number }, newAction: HammerAction ] {
  let action: HammerAction = currentAction
  const rDiff: number = rotationDiff(eventValues.rotation, eventStartValues.rotation)
  if (action === HammerAction.ScaleRotate) {
    if (Math.abs(rDiff) >= rotationThreshold) {
      action = HammerAction.Rotate
    } else if (Math.abs(1 - eventValues.scale) >= scaleThreshold) {
      action = HammerAction.Scale
    }
  }

  const newEventValues = {
    rotation: eventStartValues.rotation,
    scale: eventStartValues.scale,
  }
  if (action === HammerAction.Rotate) {
    if (Math.abs(rDiff) > rotationThreshold) {
      newEventValues.rotation = eventStartValues.rotation + rDiff - (Math.sign(rDiff) * rotationThreshold)
    }
  } else if (action === HammerAction.Scale) {
    newEventValues.scale = eventValues.scale
  }
  return [ newEventValues, action ]
}

/**
 * Compute what the new baseline values would be for a pan event,
 * given the event input, without actually updating the baseline values.
 *
 * The input is assumed to be a 'pan' event,
 * so the deltaX and deltaY of the input are considered,
 * while scale and rotation are ignored.
 *
 * @param eventValues           the current values of event
 * @param eventStartValues      the initial values at the beginning of the event
 * @param currentValues         the current baseline values
 * @param currentDisplayValues  the current baseline display values
 * @param currentProps          the current component props
 * @private                     the adjusted baseline values
 */
export function internalNewValuesForPan(
  eventValues: { x: number; y: number },
  eventStartValues: { x: number; y: number },
  currentValues: HammerAreaValues,
  currentDisplayValues: HammerAreaValues,
  currentProps: HammerAreaProps
): { newDisplayValues: HammerAreaValues; newValues: HammerAreaValues } {
  let newX = currentValues.x + (eventValues.x - eventStartValues.x)
  let newY = currentValues.y + (eventValues.y - eventStartValues.y)
  const clampedX = clampValue(newX, currentProps.clampX)
  const clampedY = clampValue(newY, currentProps.clampY)

  // if X or Y is getting clamped, reset the initial so that panning the
  // other way will immediately produce a change.
  if (Math.abs(clampedX - newX) > 0.0001) {
    eventStartValues.x = currentValues.x + eventValues.x - clampedX
  }
  if (Math.abs(clampedY - newY) > 0.0001) {
    eventStartValues.y = currentValues.y + eventValues.y - clampedY
  }
  newX = clampedX
  newY = clampedY

  // if X or Y is unlocked, calculate a new display value for them
  const actualDeltaX = newX - currentValues.x
  const actualDeltaY = newY - currentValues.y
  const newDisplayX = currentProps.lockX !== true ? currentDisplayValues.x + actualDeltaX : currentDisplayValues.x
  const newDisplayY = currentProps.lockY !== true ? currentDisplayValues.y + actualDeltaY : currentDisplayValues.y

  // adjust the amount that x or y changes according to the display scale
  newX = currentValues.x + actualDeltaX / currentDisplayValues.scale
  newY = currentValues.y + actualDeltaY / currentDisplayValues.scale

  // TODO: handle updates to X and Y when the rotation is unlocked

  return {
    newDisplayValues: {
      ...currentDisplayValues,
      x: newDisplayX,
      y: newDisplayY,
      rotation: currentDisplayValues.rotation,
      scale: currentDisplayValues.scale,
    },
    newValues: {
      ...currentValues,
      rotation: currentValues.rotation,
      scale: currentValues.scale,
      x: newX,
      y: newY,
    },
  }
}

/**
 * Compute what the new baseline values would be for a scale/rotate event,
 * given the event input.
 *
 * @param eventValues           the current values of event
 * @param eventStartValues      the initial values at the beginning of the event
 * @param currentValues         the current baseline values
 * @param currentDisplayValues  the current baseline display values
 * @param currentProps          the current component props
 * @private                     the adjusted baseline values
 */
export function internalNewValuesForScaleRotate(
  eventValues: { rotation: number; scale: number },
  eventStartValues: { rotation: number; scale: number },
  currentValues: HammerAreaValues,
  currentDisplayValues: HammerAreaValues,
  currentProps: HammerAreaProps
): { newDisplayValues: HammerAreaValues; newValues: HammerAreaValues } {
  let newRotation = currentValues.rotation + eventValues.rotation - eventStartValues.rotation
  let newScale = (currentValues.scale * eventValues.scale) / eventStartValues.scale

  // if rotation is getting clamped, reset the initial so that turning the
  // other way will immediately produce a rotation change.
  const clampedRotation = clampValue(newRotation, currentProps.clampRotation)
  if (Math.abs(clampedRotation - newRotation) > 0.0001) {
    eventStartValues.rotation = currentValues.rotation + eventValues.rotation - clampedRotation
  }
  newRotation = clampedRotation

  // if scale is getting clamped, reset the initial so that zooming the
  // other way will immediately produce a scale change.
  const clampedScale = clampValue(newScale, currentProps.clampScale)
  if (Math.abs(clampedScale - newScale) > 0.1) {
    eventStartValues.scale = (currentValues.scale * eventValues.scale) / clampedScale
  }
  newScale = clampedScale

  // if the rotation is unlocked, calculate a new display value
  const actualDeltaRotation = newRotation - currentValues.rotation
  const newDisplayRotation =
    currentProps.lockRotation !== true
      ? currentDisplayValues.rotation + actualDeltaRotation
      : currentDisplayValues.rotation

  // if the scale is unlocked, calculate a new display value
  const actualDeltaScale = newScale / currentValues.scale
  const newDisplayScale =
    currentProps.lockScale !== true ? currentDisplayValues.scale * actualDeltaScale : currentDisplayValues.scale

  // if the rotation is unlocked, update the display offsets for x and y when the rotation changes,
  // so that the contents will rotate smoothly around the current centre point
  let newDisplayOffsetX = currentDisplayValues.x
  let newDisplayOffsetY = currentDisplayValues.y
  if (currentProps.lockRotation !== true) {
    const hypotenuse = euclideanDistance([currentDisplayValues.x, currentDisplayValues.y])
    let currentDisplayOffsetAngleX = 0
    let currentDisplayOffsetAngleY = 0
    if (hypotenuse !== 0) {
      currentDisplayOffsetAngleX = -1 * Math.acos(currentDisplayValues.x / hypotenuse)
      currentDisplayOffsetAngleY = -1 * Math.asin(currentDisplayValues.y / hypotenuse)
      if (currentDisplayValues.y < 0) currentDisplayOffsetAngleX *= -1
      if (currentDisplayValues.x < 0) currentDisplayOffsetAngleY = Math.PI - currentDisplayOffsetAngleY
    }
    const newDisplayOffsetAngleX = -1 * ((actualDeltaRotation * Math.PI) / 180 - currentDisplayOffsetAngleX)
    const newDisplayOffsetAngleY = -1 * ((actualDeltaRotation * Math.PI) / 180 - currentDisplayOffsetAngleY)
    newDisplayOffsetX = hypotenuse * Math.cos(newDisplayOffsetAngleX)
    newDisplayOffsetY = -1 * hypotenuse * Math.sin(newDisplayOffsetAngleY)
  }

  // if the scale is unlocked, update the x and y offsets when the scale changes,
  // so that the contents will zoom smoothly around the current centre point
  if (currentProps.lockScale !== true) {
    newDisplayOffsetX *= actualDeltaScale
    newDisplayOffsetY *= actualDeltaScale
  }

  return {
    newDisplayValues: {
      ...currentDisplayValues,
      x: newDisplayOffsetX,
      y: newDisplayOffsetY,
      rotation: newDisplayRotation,
      scale: newDisplayScale,
    },
    newValues: {
      ...currentValues,
      rotation: newRotation,
      scale: newScale,
      x: currentValues.x,
      y: currentValues.y,
    },
  }
}

/**
 * Compute what the new baseline values would be as the result
 * of a 'modified' pan event, where deltaX is taken to be a change in rotation,
 * and deltaY is taken to be a change in scale.
 *
 * The input is assumed to be from a 'pan' event,
 * so the deltaX and deltaY of the input are considered,
 * while rotation and scale are ignored.
 *
 * @param eventValues           the current values of event
 * @param eventStartValues      the initial values at the beginning of the event
 * @param currentValues         the current baseline values
 * @param currentDisplayValues  the current baseline display values
 * @param currentProps          the current component props
 * @param currentDimensions     the current dimensions of the component's main area
 * @private                     the adjusted baseline values
 */
export function internalNewValuesForScaleRotateViaPan(
  eventValues: HammerAreaValues,
  eventStartValues: HammerAreaValues,
  currentValues: HammerAreaValues,
  currentDisplayValues: HammerAreaValues,
  currentProps: HammerAreaProps,
  currentDimensions: { height: number; width: number }
): { newDisplayValues: HammerAreaValues; newValues: HammerAreaValues } {
  const { height, width } = currentDimensions
  const deltaX = eventStartValues.x - eventValues.x
  const deltaY = eventStartValues.y - eventValues.y
  const modifiedEventValues = {
    rotation: (deltaX / width) * 360,
    scale: Math.pow(2, (deltaY / height) * -2),
    x: 0,
    y: 0,
  }
  const modifiedEventStartValues = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: 0,
  }
  return internalNewValuesForScaleRotate(
    modifiedEventValues,
    modifiedEventStartValues,
    currentValues,
    currentDisplayValues,
    currentProps
  )
}

/**
 * Compute what the new baseline values would be as the result of an update
 * to the HammerArea's props.values.
 *
 * @param newPropsValuesPartial     the values specified by the newly updated props
 * @param prevPropsValuesPartial    the previously specified values from the old props
 * @param currentValues             the current baseline values
 * @param currentDisplayValues      the current baseline display values
 * @param currentProps              the current props
 */
export function internalNewValuesFromProps(
  newPropsValuesPartial: Partial<HammerAreaValues> | undefined,
  prevPropsValuesPartial: Partial<HammerAreaValues> | undefined,
  currentValues: HammerAreaValues,
  currentDisplayValues: HammerAreaValues,
  currentProps: HammerAreaProps
): { newDisplayValues: HammerAreaValues; newValues: HammerAreaValues } | undefined {
  const prevPropsValues = withDefaults(prevPropsValuesPartial, currentValues)
  const newPropsValues = withDefaults(newPropsValuesPartial, currentValues)
  if (!valuesEquals(prevPropsValues, newPropsValues)) {
    let newData = internalNewValuesForScaleRotate(
      { rotation: 0, scale: 1 },
      currentValues,
      currentValues,
      currentDisplayValues,
      currentProps
    )
    newData = internalNewValuesForPan(
      newPropsValues,
      newData.newValues,
      newData.newValues,
      newData.newDisplayValues,
      currentProps
    )
    newData = internalNewValuesForScaleRotate(
      newPropsValues,
      newData.newValues,
      newData.newValues,
      newData.newDisplayValues,
      currentProps
    )
    return newData
  }
  return undefined
}
