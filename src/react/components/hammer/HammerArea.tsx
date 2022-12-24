import { debounce, defaultTo, has } from 'lodash'
import { Component, CSSProperties, ReactElement, ReactNode, RefObject } from 'react'
import Hammer from 'hammerjs'
import { useResizeDetector } from 'react-resize-detector'
import { HammerAreaInner, HammerAreaOuter } from './hammerAreaLayout'
import { useModifierKeys } from '../../hooks/useModifierKeys'
import { euclideanDistance, floatEquals } from "../../../lib/math/math";

export type HammerAreaClamp = [number | undefined, number | undefined] // [min, max]

export type HammerOnChangeCallback = (newValues: HammerAreaValues, gestureComplete: boolean) => void
export type HammerOnResizeCallback = (width: number, height: number) => void
export type HammerOnTapCallback = (x: number, y: number, target: HTMLElement) => void
export type HammerOnUpdatePropValuesCallback = (changedValues: Partial<HammerAreaValues>) => void

export interface HammerAreaValues {
  displayOffsetX: number
  displayOffsetY: number
  displayRotation: number
  displayScale: number
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
  onUpdatePropValues?: HammerOnUpdatePropValuesCallback
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

interface InternalHammerAreaProps extends HammerAreaProps {
  containerHeight: number
  modifierKeyPressed: boolean
  containerRef: RefObject<HTMLDivElement>
  containerWidth: number
}

interface HammerEventValues {
  rotation: number
  scale: number
  x: number
  y: number
}

enum HammerAction {
  None = 'none',
  Pan = 'pan',
  ScaleRotate = 'scale/rotate',
}

const defaultHammerAreaValues: HammerAreaValues = {
  displayOffsetX: 0,
  displayOffsetY: 0,
  displayRotation: 0,
  displayScale: 1,
  rotation: 0,
  scale: 1,
  x: 0,
  y: 0,
}

/**
 * Fill out a partial specification of HammerAreaValues with default values
 * for the unspecified properties.
 *
 * @param partialValues     a partial specification of HammerAreaValues
 * @param defaults          the default values to use
 */
function withDefaults(
  partialValues: Partial<HammerAreaValues> = {},
  defaults: HammerAreaValues = defaultHammerAreaValues,
): HammerAreaValues {
  return {
    displayOffsetX: defaultTo(partialValues.displayOffsetX, defaults.displayOffsetX),
    displayOffsetY: defaultTo(partialValues.displayOffsetY, defaults.displayOffsetY),
    displayRotation: defaultTo(partialValues.displayRotation, defaults.displayRotation),
    displayScale: defaultTo(partialValues.displayScale, defaults.displayScale),
    rotation: defaultTo(partialValues.rotation, defaults.rotation),
    scale: defaultTo(partialValues.scale, defaults.scale),
    x: defaultTo(partialValues.x, defaults.x),
    y: defaultTo(partialValues.y, defaults.y),
  }
}

/**
 * Determine whether two instances of HammerAreaValues are equal
 *
 * @param a   an instance of HammerAreaValues
 * @param b   another instance of HammerAreaValues
 */
function valuesEquals(a: HammerAreaValues, b: HammerAreaValues): boolean {
  return floatEquals(a.displayOffsetX, b.displayOffsetX)
    && floatEquals(a.displayOffsetY, b.displayOffsetY)
    && floatEquals(a.displayRotation, b.displayRotation)
    && floatEquals(a.displayScale, b.displayScale)
    && floatEquals(a.rotation, b.rotation)
    && floatEquals(a.scale, b.scale)
    && floatEquals(a.x, b.x)
    && floatEquals(a.y, b.y)
}

/**
 * Return only those components of the new values that differ from the old values.
 *
 * @param oldValues   the old values to compare
 * @param newValues   the new values that may have changed
 */
function valuesDiffs(oldValues: HammerAreaValues, newValues: HammerAreaValues): HammerAreaValues {
  return {
    // displayOffsetX: !floatEquals(oldValues.displayOffsetX, newValues.displayOffsetX) ? newValues.displayOffsetX : undefined,
    // displayOffsetY: !floatEquals(oldValues.displayOffsetY, newValues.displayOffsetY) ? newValues.displayOffsetY : undefined,
    // displayRotation: !floatEquals(oldValues.displayRotation, newValues.displayRotation) ? newValues.displayRotation : undefined,
    // displayScale: !floatEquals(oldValues.displayScale, newValues.displayScale) ? newValues.displayScale : undefined,
    // rotation: !floatEquals(oldValues.rotation, newValues.rotation) ? newValues.rotation : undefined,
    // scale: !floatEquals(oldValues.scale, newValues.scale) ? newValues.scale : undefined,
    // x: !floatEquals(oldValues.x, newValues.x) ? newValues.x : undefined,
    // y: !floatEquals(oldValues.y, newValues.y) ? newValues.y : undefined,
    displayOffsetX: newValues.displayOffsetX - oldValues.displayOffsetX,
    displayOffsetY: newValues.displayOffsetY - oldValues.displayOffsetY,
    displayRotation: newValues.displayRotation - oldValues.displayRotation,
    displayScale: newValues.displayScale - oldValues.displayScale,
    rotation: newValues.rotation - oldValues.rotation,
    scale: newValues.scale - oldValues.scale,
    x: newValues.x - oldValues.x,
    y: newValues.y - oldValues.y,
  }
}

/**
 * Clamp a value within the given bounds, if specified.
 *
 * @param value       the input value
 * @param clamp       the clamp to apply
 */
function clampValue(value: number, clamp: HammerAreaClamp | undefined): number {
  if (clamp === undefined) return value
  if (clamp[0] !== undefined) {
    value = Math.max(value, clamp[0])
  }
  if (clamp[1] !== undefined) {
    value = Math.min(value, clamp[1])
  }
  return value
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
 * @param currentProps          the current component props
 * @private                     the adjusted baseline values
 */
function newValuesForPan(
  eventValues: HammerEventValues,
  eventStartValues: HammerEventValues,
  currentValues: HammerAreaValues,
  currentProps: HammerAreaProps
): HammerAreaValues {
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
  const newDisplayOffsetX =
    currentProps.lockX !== true ? currentValues.displayOffsetX + actualDeltaX : currentValues.displayOffsetX
  const newDisplayOffsetY =
    currentProps.lockY !== true ? currentValues.displayOffsetY + actualDeltaY : currentValues.displayOffsetY

  // adjust the amount that x or y changes according to the display scale
  newX = currentValues.x + actualDeltaX / currentValues.displayScale
  newY = currentValues.y + actualDeltaY / currentValues.displayScale

  // TODO: handle updates to X and Y when the rotation is unlocked

  return {
    ...currentValues,
    displayOffsetX: newDisplayOffsetX,
    displayOffsetY: newDisplayOffsetY,
    displayRotation: currentValues.displayRotation,
    displayScale: currentValues.displayScale,
    rotation: currentValues.rotation,
    scale: currentValues.scale,
    x: newX,
    y: newY,
  }
}

/**
 * Compute what the new baseline values would be for a scale/rotate event,
 * given the event input.
 *
 * The input is assumed to be a 'scale/rotate' event,
 * so the scale and rotation of the input are considered,
 * while deltaX and deltaY are ignored.
 *
 * @param eventValues           the current values of event
 * @param eventStartValues      the initial values at the beginning of the event
 * @param currentValues         the current baseline values
 * @param currentProps          the current component props
 * @private                     the adjusted baseline values
 */
function newValuesForScaleRotate(
  eventValues: HammerEventValues,
  eventStartValues: HammerEventValues,
  currentValues: HammerAreaValues,
  currentProps: HammerAreaProps
): HammerAreaValues {
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
      ? currentValues.displayRotation + actualDeltaRotation
      : currentValues.displayRotation

  // if the scale is unlocked, calculate a new display value
  const actualDeltaScale = newScale / currentValues.scale
  const newDisplayScale =
    currentProps.lockScale !== true ? currentValues.displayScale * actualDeltaScale : currentValues.displayScale

  // if the rotation is unlocked, update the display offsets for x and y when the rotation changes,
  // so that the contents will rotate smoothly around the current centre point
  let newDisplayOffsetX = currentValues.displayOffsetX
  let newDisplayOffsetY = currentValues.displayOffsetY
  if (currentProps.lockRotation !== true) {
    const hypotenuse = euclideanDistance([currentValues.displayOffsetX, currentValues.displayOffsetY])
    let currentDisplayOffsetAngleX = 0
    let currentDisplayOffsetAngleY = 0
    if (hypotenuse !== 0) {
      currentDisplayOffsetAngleX = -1 * Math.acos(currentValues.displayOffsetX / hypotenuse)
      currentDisplayOffsetAngleY = -1 * Math.asin(currentValues.displayOffsetY / hypotenuse)
      if (currentValues.displayOffsetY < 0) currentDisplayOffsetAngleX *= -1
      if (currentValues.displayOffsetX < 0) currentDisplayOffsetAngleY = Math.PI - currentDisplayOffsetAngleY
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
    ...currentValues,
    displayOffsetX: newDisplayOffsetX,
    displayOffsetY: newDisplayOffsetY,
    displayRotation: newDisplayRotation,
    displayScale: newDisplayScale,
    rotation: newRotation,
    scale: newScale,
    x: currentValues.x,
    y: currentValues.y,
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
 * @param currentProps          the current component props
 * @private                     the adjusted baseline values
 */
function newValuesForScaleRotateViaPan(
  eventValues: HammerEventValues,
  eventStartValues: HammerEventValues,
  currentValues: HammerAreaValues,
  currentProps: InternalHammerAreaProps
): HammerAreaValues {
  const { containerHeight, containerWidth } = currentProps
  const deltaX = eventStartValues.x - eventValues.x
  const deltaY = eventStartValues.y - eventValues.y
  const modifiedEventValues = {
    rotation: (deltaX / containerWidth) * 360,
    scale: Math.pow(2, (deltaY / containerHeight) * -2),
    x: 0,
    y: 0,
  }
  const modifiedEventStartValues = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: 0,
  }
  return newValuesForScaleRotate(modifiedEventValues, modifiedEventStartValues, currentValues, currentProps)
}

/**
 * An area of the screen in which one- and two-fingers gestures can be used to
 * pan, zoom, and rotate.
 *
 * The display of the contents of this component itself are not automatically
 * manipulated in any way when these gestures occur. Rather the component's
 * onChange callback is triggered, allowing a component that wraps this one
 * to update the way its contents are displayed in various ways. For example,
 * the contents could be moved on the screen in response to a pan gesture,
 * or the position of the contents could remain unchanged but a state value
 * incremented or decremented that affects the way some aspect of the component
 * is rendered.
 */
class InternalHammerArea extends Component<InternalHammerAreaProps> {
  private _hammer: HammerManager | null = null
  private currentAction: HammerAction
  private currentActionIsModified: boolean
  private currentValues: HammerAreaValues
  private eventStartValues: HammerEventValues
  private mostRecentEvent: HammerInput | undefined = undefined

  constructor(props: InternalHammerAreaProps) {
    super(props)
    this.currentValues = withDefaults(props.values)
    this.eventStartValues = this.currentValues
    this.currentAction = HammerAction.None
    this.currentActionIsModified = false
  }

  private readonly callOnChange: HammerOnChangeCallback = (values, complete) => {
    console.log(`HammerArea onChange${complete ? ' (complete)' : ''}`)
    if (complete) {
      console.log(`change x ${values.x}`)
      console.log(`change y ${values.y}`)
    }
    if (this.props.onChange !== undefined) this.props.onChange(values, complete)
  }

  private readonly callOnResize: HammerOnResizeCallback = (width: number, height: number) => {
    console.log(`HammerArea onResize (width: ${width}, height: ${height}`)
    if (this.props.onResize !== undefined) this.props.onResize(width, height)
  }

  private readonly callOnTap: HammerOnTapCallback = (x, y, target) => {
    console.log(`HammerArea onTap (x: ${x}, y: ${y}`)
    if (this.props.onTap !== undefined) this.props.onTap(x, y, target)
  }

  private readonly callOnUpdatePropValues: HammerOnUpdatePropValuesCallback = (newValues) => {
    console.log(`HammerArea onUpdatePropValues`)
  }

  private readonly handleHammerStartPan: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.None) return
    if (this.props.modifierKeyPressed) this.currentActionIsModified = true
    this.currentAction = HammerAction.Pan
    this.mostRecentEvent = ev
    this.eventStartValues = {
      x: ev.deltaX,
      y: ev.deltaY,
      rotation: 0,
      scale: 1,
    }
  }

  private readonly handleHammerStartScaleRotate: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.None) return
    this.currentAction = HammerAction.ScaleRotate
    this.mostRecentEvent = ev
    this.eventStartValues = {
      x: 0,
      y: 0,
      rotation: ev.rotation,
      scale: ev.scale,
    }
  }

  /**
   * Handle a Hammer 'pan' event update that is still in progress.
   * Base values are not changed.
   * @param ev  the Hammer event
   */
  private readonly handleHammerProgressivePan: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.Pan) return
    this.mostRecentEvent = ev
    const eventValues: HammerEventValues = { rotation: ev.rotation, scale: ev.scale, x: ev.deltaX, y: ev.deltaY }
    let newValues
    if (this.currentActionIsModified)
      newValues = newValuesForScaleRotateViaPan(eventValues, this.eventStartValues, this.currentValues, this.props)
    else newValues = newValuesForPan(eventValues, this.eventStartValues, this.currentValues, this.props)
    this.callOnChange(newValues, false)
  }

  /**
   * Handle a Hammer 'scale' and/or 'rotate' event update that is still in progress.
   * Base values are not changed.
   * @param ev  the Hammer event
   */
  private readonly handleHammerProgressiveScaleRotate: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.ScaleRotate) return
    this.mostRecentEvent = ev
    const eventValues: HammerEventValues = { rotation: ev.rotation, scale: ev.scale, x: ev.deltaX, y: ev.deltaY }
    const newValues = newValuesForScaleRotate(eventValues, this.eventStartValues, this.currentValues, this.props)
    this.callOnChange(newValues, false)
  }

  /**
   * Handle the end of a Hammer 'pan' event.
   * Updates the base values to reflect the final result of the event.
   *
   * N.B. this function is not debounced and should not be used directly.
   * @param ev  the Hammer event
   */
  private readonly _handleHammerEndPanNotDebounced: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.Pan) return
    this.currentAction = HammerAction.None
    this.mostRecentEvent = undefined
    const eventValues: HammerEventValues = { rotation: ev.rotation, scale: ev.scale, x: ev.deltaX, y: ev.deltaY }
    if (this.currentActionIsModified) {
      this.currentValues = newValuesForScaleRotateViaPan(
        eventValues,
        this.eventStartValues,
        this.currentValues,
        this.props
      )
    } else {
      this.currentValues = newValuesForPan(eventValues, this.eventStartValues, this.currentValues, this.props)
    }
    this.currentActionIsModified = false
    this.callOnChange(this.currentValues, true)
  }

  /**
   * Handle the end of a Hammer 'pan' event.
   * Updates the base values to reflect the final result of the event.
   * @param ev  the Hammer event
   */
  private readonly handleHammerEndPan = debounce(this._handleHammerEndPanNotDebounced, 10)

  /**
   * Handle the end of a Hammer 'scale' and/or 'rotate' event
   * Updates the base values to reflect the final result of the event.
   *
   * N.B. this function is not debounced and should not be used directly.
   * @param ev  the Hammer event
   */
  private readonly _handleHammerEndScaleRotateNotDebounced: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.ScaleRotate) return
    this.currentAction = HammerAction.None
    this.currentActionIsModified = false
    this.mostRecentEvent = undefined
    const eventValues: HammerEventValues = { rotation: ev.rotation, scale: ev.scale, x: ev.deltaX, y: ev.deltaY }
    this.currentValues = newValuesForScaleRotate(eventValues, this.eventStartValues, this.currentValues, this.props)
    this.callOnChange(this.currentValues, true)
  }

  /**
   * Handle the end of a Hammer 'scale' and/or 'rotate' event
   * Updates the base values to reflect the final result of the event.
   * @param ev  the Hammer event
   */
  private readonly handleHammerEndScaleRotate = debounce(this._handleHammerEndScaleRotateNotDebounced, 10)

  /**
   * Handle the cancellation of a Hammer event. Base values are not changes.
   */
  private readonly handleHammerCancelEvent: (ev: HammerInput) => void = (_) => {
    this.currentAction = HammerAction.None
    this.currentActionIsModified = false
    this.mostRecentEvent = undefined
    this.callOnChange(this.currentValues, true)
  }

  private readonly handleHammerTapEvent: (ev: HammerInput) => void = (ev) => {
    if (this.props.containerRef.current === null) throw new Error('null container')
    // get the position of the tap relative to the HammerArea container
    // regardless of whether the tap occurred on top of an overlay element or not
    const containerRect = this.props.containerRef.current.getBoundingClientRect()
    const containerX = containerRect.left
    const containerY = containerRect.top
    const tapRelX = ev.center.x - containerX
    const tapRelY = ev.center.y - containerY
    this.callOnTap(tapRelX, tapRelY, ev.target)
  }

  /**
   * Initialize the HammerManager with the appropriate event handlers.
   * @param mc
   */
  private readonly setupHammer: (mc: HammerManager) => void = (mc) => {
    const pan = new Hammer.Pan()
    const pinch = new Hammer.Pinch()
    const rotate = new Hammer.Rotate()
    const tap = new Hammer.Tap()
    pinch.recognizeWith(rotate)
    mc.add([pan, pinch, rotate, tap])
    mc.on('panstart', this.handleHammerStartPan)
    // N.B. using 'pinchstart' as well as 'rotatestart' only produces duplicates; everything starts with rotate
    mc.on('rotatestart', this.handleHammerStartScaleRotate)
    mc.on('pan', this.handleHammerProgressivePan)
    mc.on('pinch rotate', this.handleHammerProgressiveScaleRotate)
    mc.on('panend', this.handleHammerEndPan)
    // N.B. using 'pinchend' as well as 'rotateend' only produces duplicates; everything ends with rotate
    mc.on('rotateend', this.handleHammerEndScaleRotate)
    mc.on('pancancel pinchcancel rotatecancel', this.handleHammerCancelEvent)
    mc.on('tap', this.handleHammerTapEvent)
  }

  componentDidMount(): void {
    // create a HammerManager connected to the container div
    if (this.props.containerRef.current === null) {
      throw new Error('cannot find container element')
    }
    // attach a Hammer Manager to the container element
    this._hammer = new Hammer.Manager(this.props.containerRef.current)
    this.setupHammer(this._hammer)
    // this.callOnChange(this.currentValues, true)
  }

  componentDidUpdate(prevProps: Readonly<InternalHammerAreaProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.containerHeight !== prevProps.containerHeight || this.props.containerWidth !== prevProps.containerWidth) {
      this.callOnResize(this.props.containerWidth, this.props.containerHeight)
    }
    const newValues = withDefaults(this.props.values, this.currentValues)
    if (!valuesEquals(this.currentValues, newValues)) {
      console.log('new values from props')
      const changedValues = valuesDiffs(this.currentValues, newValues)
      console.log(changedValues)
      // if (!floatEquals(this.currentValues.displayOffsetX, newValues.displayOffsetX))
      //   console.log(`from props displayOffsetX ${this.currentValues.displayOffsetX} -> ${newValues.displayOffsetX}`)
      // if (!floatEquals(this.currentValues.displayOffsetY, newValues.displayOffsetY))
      //   console.log(`from props displayOffsetY ${this.currentValues.displayOffsetY} -> ${newValues.displayOffsetY}`)
      // if (!floatEquals(this.currentValues.displayRotation, newValues.displayRotation))
      //   console.log(`from props displayRotation ${this.currentValues.displayRotation} -> ${newValues.displayRotation}`)
      // if (!floatEquals(this.currentValues.displayScale, newValues.displayScale))
      //   console.log(`from props displayScale ${this.currentValues.displayScale} -> ${newValues.displayScale}`)
      // if (!floatEquals(this.currentValues.rotation, newValues.rotation))
      //   console.log(`from props rotation ${this.currentValues.rotation} -> ${newValues.rotation}`)
      // if (!floatEquals(this.currentValues.scale, newValues.scale))
      //   console.log(`from props scale ${this.currentValues.scale} -> ${newValues.scale}`)
      // if (!floatEquals(this.currentValues.x, newValues.x))
      //   console.log(`from props x ${this.currentValues.x} -> ${newValues.x}`)
      // if (!floatEquals(this.currentValues.y, newValues.y))
      //   console.log(`from props y ${this.currentValues.y} -> ${newValues.y}`)
      this.currentValues = newValues
      this.callOnUpdatePropValues(newValues)
    }
  }

  componentWillUnmount(): void {
    // tear down the HammerManager connected to the container div, if it exists.
    if (this._hammer !== null) {
      this._hammer.destroy()
      this._hammer = null
    }
  }

  render(): ReactElement {
    // ensure the container's style has a 'position' property set to something.
    // it will *probably* not work properly if the effective value is 'position: static'
    // but that is up to the caller.
    const style = Object.assign({}, this.props.style)
    if (!has(style, 'position')) {
      style.position = 'relative'
    }

    let cursor = this.props.modifierKeyPressed ? 'col-resize' : 'default'
    if (this.currentAction !== HammerAction.None) cursor = 'grabbing'

    return (
      <HammerAreaOuter style={this.props.style}>
        {this.props.children}
        {this.props.underlay !== undefined && <HammerAreaInner>{this.props.underlay}</HammerAreaInner>}
        <HammerAreaInner
          onMouseDown={(event) => event.preventDefault()}
          ref={this.props.containerRef}
          style={{ cursor }}
        >
          {this.props.overlay}
        </HammerAreaInner>
      </HammerAreaOuter>
    )
  }
}

export function HammerArea(props: HammerAreaProps): ReactElement {
  const { width, height, ref } = useResizeDetector()
  const { altKeyDown, ctrlKeyDown, metaKeyDown } = useModifierKeys()
  const actualWidth = defaultTo(width, 0)
  const actualHeight = defaultTo(height, 0)
  return (
    <InternalHammerArea
      containerRef={ref}
      containerWidth={actualWidth}
      containerHeight={actualHeight}
      modifierKeyPressed={altKeyDown || ctrlKeyDown || metaKeyDown}
      {...props}
    >
      {props.children}
    </InternalHammerArea>
  )
}
