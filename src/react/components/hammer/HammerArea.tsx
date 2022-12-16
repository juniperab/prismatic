import { debounce, defaultTo, has } from 'lodash'
import { Component, CSSProperties, ReactElement, ReactNode, RefObject } from 'react'
import Hammer from 'hammerjs'
import { useResizeDetector } from 'react-resize-detector'
import { HammerAreaInner, HammerAreaOuter } from './hammerAreaLayout'
import { useModifierKeys } from "../../hooks/useModifierKeys"

export type HammerAreaClamp = [number | undefined, number | undefined] // [min, max]

interface InternalHammerAreaValues {
  displayOffsetX: number
  displayOffsetY: number
  displayRotation: number
  displayScale: number
  rotation: number
  scale: number
  x: number
  y: number
}

export interface HammerAreaValues extends InternalHammerAreaValues {
  containerWidth: number
  containerHeight: number
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
  initialX?: number
  initialY?: number
  initialRotation?: number
  initialScale?: number
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
  onChange?: (newValues: HammerAreaValues) => void
  // style to apply to the container div that wraps the HammerArea's children
  style?: CSSProperties
}

interface InternalHammerAreaProps extends HammerAreaProps {
  containerRef: RefObject<HTMLDivElement>
  modifierKey: boolean
  width: number
  height: number
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
  currentValues: InternalHammerAreaValues,
  currentProps: HammerAreaProps,
): InternalHammerAreaValues {
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
  currentValues: InternalHammerAreaValues,
  currentProps: HammerAreaProps,
): InternalHammerAreaValues {
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
    const hypotenuse = Math.sqrt(Math.pow(currentValues.displayOffsetX, 2) + Math.pow(currentValues.displayOffsetY, 2))
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
  currentValues: InternalHammerAreaValues,
  currentProps: InternalHammerAreaProps,
): InternalHammerAreaValues {
  const { height, width } = currentProps
  const deltaX = eventStartValues.x - eventValues.x
  const deltaY = eventStartValues.y - eventValues.y
  const modifiedEventValues = {
    rotation: deltaX / width * 360,
    scale: Math.pow(2, deltaY / height * -2),
    x: 0,
    y: 0,
  }
  const modifiedEventStartValues = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: 0,
  }
  return newValuesForScaleRotate(
    modifiedEventValues,
    modifiedEventStartValues,
    currentValues,
    currentProps
  )
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
  private currentValues: InternalHammerAreaValues
  private eventStartValues: HammerEventValues

  constructor(props: InternalHammerAreaProps) {
    super(props)
    this.currentValues = {
      displayOffsetX: defaultTo(props.initialX, 0),
      displayOffsetY: defaultTo(props.initialY, 0),
      displayRotation: defaultTo(props.initialRotation, 0),
      displayScale: defaultTo(props.initialScale, 1),
      x: defaultTo(props.initialX, 0),
      y: defaultTo(props.initialY, 0),
      rotation: defaultTo(props.initialRotation, 0),
      scale: defaultTo(props.initialScale, 1),
    }
    this.eventStartValues = this.currentValues
    this.currentAction = HammerAction.None
    this.currentActionIsModified = false
  }

  private readonly callOnChange: (values: InternalHammerAreaValues) => void = (values) => {
    if (this.props.onChange !== undefined) this.props.onChange({
      ...values,
      containerHeight: this.props.height,
      containerWidth: this.props.width,
    })
  }

  private readonly handleHammerStartPan: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.None) return
    if (this.props.modifierKey) this.currentActionIsModified = true
    this.currentAction = HammerAction.Pan
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
    const eventValues: HammerEventValues = { rotation: ev.rotation, scale: ev.scale, x: ev.deltaX, y: ev.deltaY }
    let newValues
    if (this.currentActionIsModified)
      newValues = newValuesForScaleRotateViaPan(eventValues, this.eventStartValues, this.currentValues, this.props)
    else
      newValues = newValuesForPan(eventValues, this.eventStartValues, this.currentValues, this.props)
    this.callOnChange(newValues)
  }

  /**
   * Handle a Hammer 'scale' and/or 'rotate' event update that is still in progress.
   * Base values are not changed.
   * @param ev  the Hammer event
   */
  private readonly handleHammerProgressiveScaleRotate: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.ScaleRotate) return
    const eventValues: HammerEventValues = { rotation: ev.rotation, scale: ev.scale, x: ev.deltaX, y: ev.deltaY }
    const newValues = newValuesForScaleRotate(eventValues, this.eventStartValues, this.currentValues, this.props)
    this.callOnChange(newValues)
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
    const eventValues: HammerEventValues = { rotation: ev.rotation, scale: ev.scale, x: ev.deltaX, y: ev.deltaY }
    if (this.currentActionIsModified) {
      console.log('end modified pan')
      this.currentValues = newValuesForScaleRotateViaPan(eventValues, this.eventStartValues, this.currentValues, this.props)
    } else {
      console.log('end pan')
      this.currentValues = newValuesForPan(eventValues, this.eventStartValues, this.currentValues, this.props)
    }
    this.currentActionIsModified = false
    this.callOnChange(this.currentValues)
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
    const eventValues: HammerEventValues = { rotation: ev.rotation, scale: ev.scale, x: ev.deltaX, y: ev.deltaY }
    this.currentValues = newValuesForScaleRotate(eventValues, this.eventStartValues, this.currentValues, this.props)
    this.callOnChange(this.currentValues)
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
    this.callOnChange(this.currentValues)
  }

  /**
   * Initialize the HammerManager with the appropriate event handlers.
   * @param mc
   */
  private readonly setupHammer: (mc: HammerManager) => void = (mc) => {
    const pan = new Hammer.Pan()
    const pinch = new Hammer.Pinch()
    const rotate = new Hammer.Rotate()
    pinch.recognizeWith(rotate)
    mc.add([pan, pinch, rotate])
    mc.on('panstart', this.handleHammerStartPan)
    // N.B. using 'pinchstart' as well as 'rotatestart' only produces duplicates; everything starts with rotate
    mc.on('rotatestart', this.handleHammerStartScaleRotate)
    mc.on('pan', this.handleHammerProgressivePan)
    mc.on('pinch rotate', this.handleHammerProgressiveScaleRotate)
    mc.on('panend', this.handleHammerEndPan)
    // N.B. using 'pinchend' as well as 'rotateend' only produces duplicates; everything ends with rotate
    mc.on('rotateend', this.handleHammerEndScaleRotate)
    mc.on('pancancel pinchcancel rotatecancel', this.handleHammerCancelEvent)
  }

  componentDidMount(): void {
    // create a HammerManager connected to the container div
    if (this.props.containerRef.current === null) {
      throw new Error('cannot find container element')
    }
    // attach a Hammer Manager to the container element
    this._hammer = new Hammer.Manager(this.props.containerRef.current)
    this.setupHammer(this._hammer)
  }

  componentDidUpdate(prevProps: Readonly<InternalHammerAreaProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.height !== prevProps.height || this.props.width !== prevProps.width)
      this.callOnChange(this.currentValues)
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

    let cursor = this.props.modifierKey  ? "move" : "grab"
    if (this.currentAction !== HammerAction.None) cursor = 'grabbing'

    return (
      <HammerAreaOuter style={this.props.style}>
        {this.props.children}
        <HammerAreaInner
          onMouseDown={event => event.preventDefault()}
          ref={this.props.containerRef}
          style={{cursor}}
        />
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
      width={actualWidth}
      height={actualHeight}
      modifierKey={altKeyDown || ctrlKeyDown || metaKeyDown}
      {...props}
    >
      {props.children}
    </InternalHammerArea>
  )
}
