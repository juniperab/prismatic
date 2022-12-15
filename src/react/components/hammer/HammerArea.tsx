import { debounce, defaultTo, has } from 'lodash'
import { Component, CSSProperties, ReactElement, ReactNode, RefObject } from 'react'
import Hammer from 'hammerjs'
import { useResizeDetector } from 'react-resize-detector'
import { HammerAreaInner, HammerAreaOuter } from './hammerAreaLayout'

export type HammerAreaClamp = [number | undefined, number | undefined] // [min, max]

export interface HammerAreaValues {
  containerWidth: number
  containerHeight: number
  displayOffsetX: number
  displayOffsetY: number
  displayRotation: number
  displayScale: number
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
  width: number
  height: number
}

interface HammerAreaState {
  displayOffsetX: number
  displayOffsetY: number
  displayRotation: number
  displayScale: number
  rotation: number
  scale: number
  x: number
  y: number
}

interface HammerEventStartValues {
  rotation: number
  scale: number
  x: number
  y: number
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
 * Compute what the new state would be, given the event input,
 * without actually updating the state.
 *
 * The input is assumed to be a 'pan' event,
 * so the deltaX and deltaY of the input are considered,
 * while scale and rotation are ignored.
 *
 * @param event           a Hammer event
 * @param currentState    the current component state
 * @param currentProps    the current component props
 * @param eventStart      basis value derived from the initial state of the event
 * @private               the adjusted component state
 */
function newStateForPan(
  event: HammerInput,
  currentState: HammerAreaState,
  currentProps: HammerAreaProps,
  eventStart: HammerEventStartValues
): HammerAreaState {
  let newX = currentState.x + (event.deltaX - eventStart.x)
  let newY = currentState.y + (event.deltaY - eventStart.y)
  const clampedX = clampValue(newX, currentProps.clampX)
  const clampedY = clampValue(newY, currentProps.clampY)

  // if X or Y is getting clamped, reset the initial so that panning the
  // other way will immediately produce a change.
  if (Math.abs(clampedX - newX) > 0.0001) {
    eventStart.x = currentState.x + event.deltaX - clampedX
  }
  if (Math.abs(clampedY - newY) > 0.0001) {
    eventStart.y = currentState.y + event.deltaY - clampedY
  }
  newX = clampedX
  newY = clampedY

  // if X or Y is unlocked, calculate a new display value for them
  const actualDeltaX = newX - currentState.x
  const actualDeltaY = newY - currentState.y
  const newDisplayOffsetX =
    currentProps.lockX !== true ? currentState.displayOffsetX + actualDeltaX : currentState.displayOffsetX
  const newDisplayOffsetY =
    currentProps.lockY !== true ? currentState.displayOffsetY + actualDeltaY : currentState.displayOffsetY

  return {
    displayOffsetX: newDisplayOffsetX,
    displayOffsetY: newDisplayOffsetY,
    displayRotation: currentState.displayRotation,
    displayScale: currentState.displayScale,
    rotation: currentState.rotation,
    scale: currentState.scale,
    x: newX,
    y: newY,
  }
}

/**
 * Compute what the new state would be, given the event input,
 * without actually updating the state.
 *
 * The input is assumed to be a 'scale/rotate' event,
 * so the scale and rotation of the input are considered,
 * while deltaX and deltaY are ignored.
 *
 * @param event           a Hammer event
 * @param currentState    the current component state
 * @param currentProps    the current  component props
 * @param eventStart      basis value derived from the initial state of the event
 * @private               the adjusted component state
 */
function newStateForScaleRotate(
  event: HammerInput,
  currentState: HammerAreaState,
  currentProps: HammerAreaProps,
  eventStart: HammerEventStartValues
): HammerAreaState {
  let newRotation = currentState.rotation + event.rotation - eventStart.rotation
  let newScale = (currentState.scale * event.scale) / eventStart.scale

  // if rotation is getting clamped, reset the initial so that turning the
  // other way will immediately produce a rotation change.
  const clampedRotation = clampValue(newRotation, currentProps.clampRotation)
  if (Math.abs(clampedRotation - newRotation) > 0.0001) {
    eventStart.rotation = currentState.rotation + event.rotation - clampedRotation
  }
  newRotation = clampedRotation

  // if scale is getting clamped, reset the initial so that zooming the
  // other way will immediately produce a scale change.
  const clampedScale = clampValue(newScale, currentProps.clampScale)
  if (Math.abs(clampedScale - newScale) > 0.1) {
    eventStart.scale = (currentState.scale * event.scale) / clampedScale
  }
  newScale = clampedScale

  // if the rotation is unlocked, calculate a new display value
  const actualDeltaRotation = newRotation - currentState.rotation
  const newDisplayRotation =
    currentProps.lockRotation !== true
      ? currentState.displayRotation + actualDeltaRotation
      : currentState.displayRotation

  // if the scale is unlocked, calculate a new display value
  const actualDeltaScale = newScale / currentState.scale
  const newDisplayScale =
    currentProps.lockScale !== true ? currentState.displayScale * actualDeltaScale : currentState.displayScale

  // if the rotation is unlocked, update the display offsets for x and y when the rotation changes,
  // so that the contents will rotate smoothly around the current centre point
  let newDisplayOffsetX = currentState.displayOffsetX
  let newDisplayOffsetY = currentState.displayOffsetY
  if (currentProps.lockRotation !== true) {
    const hypotenuse = Math.sqrt(Math.pow(currentState.displayOffsetX, 2) + Math.pow(currentState.displayOffsetY, 2))
    let currentDisplayOffsetAngleX = 0
    let currentDisplayOffsetAngleY = 0
    if (hypotenuse !== 0) {
      currentDisplayOffsetAngleX = -1 * Math.acos(currentState.displayOffsetX / hypotenuse)
      currentDisplayOffsetAngleY = -1 * Math.asin(currentState.displayOffsetY / hypotenuse)
      if (currentState.displayOffsetY < 0) currentDisplayOffsetAngleX *= -1
      if (currentState.displayOffsetX < 0) currentDisplayOffsetAngleY = Math.PI - currentDisplayOffsetAngleY
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
    displayOffsetX: newDisplayOffsetX,
    displayOffsetY: newDisplayOffsetY,
    displayRotation: newDisplayRotation,
    displayScale: newDisplayScale,
    rotation: newRotation,
    scale: newScale,
    x: currentState.x,
    y: currentState.y,
  }
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
class InternalHammerArea extends Component<InternalHammerAreaProps, HammerAreaState> {
  private _hammer: HammerManager | null = null
  private eventStartValues: HammerEventStartValues
  private currentAction: HammerAction

  constructor(props: InternalHammerAreaProps) {
    super(props)
    this.state = {
      displayOffsetX: defaultTo(props.initialX, 0),
      displayOffsetY: defaultTo(props.initialY, 0),
      displayRotation: defaultTo(props.initialRotation, 0),
      displayScale: defaultTo(props.initialScale, 1),
      x: defaultTo(props.initialX, 0),
      y: defaultTo(props.initialY, 0),
      rotation: defaultTo(props.initialRotation, 0),
      scale: defaultTo(props.initialScale, 1),
    }
    this.eventStartValues = this.state
    this.currentAction = HammerAction.None
  }

  private readonly callOnChange: (state: HammerAreaState) => void = (state) => {
    if (this.props.onChange !== undefined) {
      this.props.onChange({
        containerHeight: this.props.height,
        containerWidth: this.props.width,
        ...state,
      })
    }
  }

  private readonly handleHammerStartPan: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.None) return
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
    const newState = newStateForPan(ev, this.state, this.props, this.eventStartValues)
    this.callOnChange(newState)
  }

  /**
   * Handle a Hammer 'scale' and/or 'rotate' event update that is still in progress.
   * Base values are not changed.
   * @param ev  the Hammer event
   */
  private readonly handleHammerProgressiveScaleRotate: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.ScaleRotate) return
    const newState = newStateForScaleRotate(ev, this.state, this.props, this.eventStartValues)
    this.callOnChange(newState)
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
    const newState = newStateForPan(ev, this.state, this.props, this.eventStartValues)
    this.callOnChange(newState)
    const initialValues = Object.assign({}, this.eventStartValues)
    this.setState((state, props) => newStateForPan(ev, state, props, initialValues))
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
    const newState = newStateForScaleRotate(ev, this.state, this.props, this.eventStartValues)
    this.callOnChange(newState)
    const initialValues = Object.assign({}, this.eventStartValues)
    this.setState((state, props) => newStateForScaleRotate(ev, state, props, initialValues))
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
    this.callOnChange(this.state)
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

    // wrap the children in a container div with a HammerManager connected to it.
    return (
      <HammerAreaOuter style={this.props.style}>
        {this.props.children}
        <HammerAreaInner ref={this.props.containerRef} />
      </HammerAreaOuter>
    )
  }
}

export function HammerArea(props: HammerAreaProps): ReactElement {
  const { width, height, ref } = useResizeDetector()
  const actualWidth = defaultTo(width, 0)
  const actualHeight = defaultTo(height, 0)
  return (
    <InternalHammerArea containerRef={ref} width={actualWidth} height={actualHeight} {...props}>
      {props.children}
    </InternalHammerArea>
  )
}
