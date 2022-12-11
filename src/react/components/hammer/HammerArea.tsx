import * as _ from "lodash"
import { Component, createRef, CSSProperties, ReactElement, ReactNode, RefObject } from "react"
import Hammer from 'hammerjs'

export type HammerAreaClamp = [number | undefined, number | undefined] // [min, max]

enum HammerAction {
  None = 'none', Pan = 'pan', ScaleRotate = 'scale/rotate'
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
  onChange: (offsetX: number, offsetY: number, scale: number, rotation: number) => void
  // style to apply to the container div that wraps the HammerArea's children
  style?: CSSProperties
}

interface HammerAreaState {
  offsetX: number,
  offsetY: number,
  rotation: number,
  scale: number,
}

/**
 * Clamp a value within the given bounds, if specified.
 *
 * @param value       the input value
 * @param clamp       the clamp to apply
 */
function clampValue (value: number, clamp: HammerAreaClamp | undefined): number {
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
 * @param ev              a Hammer event
 * @param currentState    the current component state
 * @param currentProps    the current component props
 * @param initialValues   basis value derived from the initial state of the event
 * @private               the adjusted component state
 */
function newStateForPan(
  ev: HammerInput,
  currentState: HammerAreaState,
  currentProps: HammerAreaProps,
  initialValues: HammerAreaState,
): HammerAreaState {
  let newOffsetX = currentState.offsetX + (ev.deltaX - initialValues.offsetX)
  let newOffsetY = currentState.offsetY + (ev.deltaY - initialValues.offsetY)
  newOffsetX = clampValue(newOffsetX, currentProps.clampX)
  newOffsetY = clampValue(newOffsetY, currentProps.clampY)
  return {
    rotation: currentState.rotation,
    scale: currentState.scale,
    offsetX: newOffsetX,
    offsetY: newOffsetY,
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
 * @param ev              a Hammer event
 * @param currentState    the current component state
 * @param currentProps    the current  component props
 * @param initialValues   basis value derived from the initial state of the event
 * @private               the adjusted component state
 */
function newStateForScaleRotate(
  ev: HammerInput,
  currentState: HammerAreaState,
  currentProps: HammerAreaProps,
  initialValues: HammerAreaState,
): HammerAreaState {
  let newRotation = currentState.rotation + ev.rotation - initialValues.rotation
  let newScale = currentState.scale * ev.scale / initialValues.scale

  // if rotation is getting clamped, reset the initial so that turning the
  // other way will immediately produce a rotation change.
  const clampedRotation = clampValue(newRotation, currentProps.clampRotation)
  if (Math.abs(clampedRotation - newRotation) > 0.0001) {
    initialValues.rotation = currentState.rotation + ev.rotation - clampedRotation
  }
  newRotation = clampedRotation

  // if scale is getting clamped, reset the initial so that zooming the
  // other way will immediately produce a scale change.
  const clampedScale = clampValue(newScale, currentProps.clampScale)
  if (Math.abs(clampedScale - newScale) > 0.1) {
    initialValues.scale = currentState.scale * ev.scale / clampedScale
  }
  newScale = clampedScale

  // if the scale is unlocked, update the x and y offsets when the scale changes
  // so that the contents will zoom smoothly around the current centre point
  const actualDeltaScale = currentProps.lockScale !== true
    ? newScale / currentState.scale
    : 1
  // TODO: make it rotate around the current centre point vs the origin

  return {
    rotation: newRotation,
    scale: newScale,
    offsetX: currentState.offsetX * actualDeltaScale,
    offsetY: currentState.offsetY * actualDeltaScale,
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
export class HammerArea extends Component<HammerAreaProps, HammerAreaState> {
  private readonly containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>()
  private _hammer: HammerManager | null = null
  private initialValues: HammerAreaState
  private currentAction: HammerAction

  constructor(props: HammerAreaProps) {
    super(props)
    this.state = {
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      scale: 1,
    }
    this.initialValues = this.state
    this.currentAction = HammerAction.None
  }

  private readonly handleHammerStartPan: (ev: HammerInput) => void = ev => {
    if (this.currentAction !== HammerAction.None) return
    this.currentAction = HammerAction.Pan
    this.initialValues = {
      offsetX: ev.deltaX,
      offsetY: ev.deltaY,
      rotation: 0,
      scale: 1,
    }
  }

  private readonly handleHammerStartScaleRotate: (ev: HammerInput) => void = ev => {
    if (this.currentAction !== HammerAction.None) return
    this.currentAction = HammerAction.ScaleRotate
    this.initialValues = {
      offsetX: 0,
      offsetY: 0,
      rotation: ev.rotation,
      scale: ev.scale,
    }
  }

  /**
   * Handle a Hammer 'pan' event update that is still in progress.
   * Base values are not changed.
   * @param ev  the Hammer event
   */
  private readonly handleHammerProgressivePan: (ev: HammerInput) => void = ev => {
    if (this.currentAction !== HammerAction.Pan) return
    if (this.props.onChange !== undefined) {
      const newState = newStateForPan(ev, this.state, this.props, this.initialValues)
      this.props.onChange(newState.offsetX, newState.offsetY, newState.rotation, newState.scale)
    }
  }

  /**
   * Handle a Hammer 'scale' and/or 'rotate' event update that is still in progress.
   * Base values are not changed.
   * @param ev  the Hammer event
   */
  private readonly handleHammerProgressiveScaleRotate: (ev: HammerInput) => void = ev => {
    if (this.currentAction !== HammerAction.ScaleRotate) return
    if (this.props.onChange !== undefined) {
      const newState = newStateForScaleRotate(ev, this.state, this.props, this.initialValues)
      this.props.onChange(newState.offsetX, newState.offsetY, newState.rotation, newState.scale)
    }
  }

  /**
   * Handle the end of a Hammer 'pan' event.
   * Updates the base values to reflect the final result of the event.
   *
   * N.B. this function is not debounced and should not be used directly.
   * @param ev  the Hammer event
   */
  private readonly _handleHammerEndPanNotDebounced: (ev: HammerInput) => void = ev => {
    if (this.currentAction !== HammerAction.Pan) return
    this.currentAction = HammerAction.None
    const initialValues = Object.assign({}, this.initialValues)
    this.setState((state, props) => {
      const newState = newStateForPan(ev, state, props, initialValues)
      if (this.props.onChange !== undefined) {
        this.props.onChange(newState.offsetX, newState.offsetY, newState.rotation, newState.scale)
      }
      return newState
    })
  }

  /**
   * Handle the end of a Hammer 'pan' event.
   * Updates the base values to reflect the final result of the event.
   * @param ev  the Hammer event
   */
  private readonly handleHammerEndPan = _.debounce(this._handleHammerEndPanNotDebounced, 10)

  /**
   * Handle the end of a Hammer 'scale' and/or 'rotate' event
   * Updates the base values to reflect the final result of the event.
   *
   * N.B. this function is not debounced and should not be used directly.
   * @param ev  the Hammer event
   */
  private readonly _handleHammerEndScaleRotateNotDebounced: (ev: HammerInput) => void = ev => {
    if (this.currentAction !== HammerAction.ScaleRotate) return
    this.currentAction = HammerAction.None
    const initialValues = Object.assign({}, this.initialValues)
    this.setState((state, props) => {
      const newState = newStateForScaleRotate(ev, state, props, initialValues)
      if (this.props.onChange !== undefined) {
        this.props.onChange(newState.offsetX, newState.offsetY, newState.rotation, newState.scale)
      }
      return newState
    })
  }

  /**
   * Handle the end of a Hammer 'scale' and/or 'rotate' event
   * Updates the base values to reflect the final result of the event.
   * @param ev  the Hammer event
   */
  private readonly handleHammerEndScaleRotate = _.debounce(this._handleHammerEndScaleRotateNotDebounced, 10)

  /**
   * Handle the cancellation of a Hammer event. Base values are not changes.
   */
  private readonly handleHammerCancelEvent: (ev: HammerInput) => void = ev => {
    this.currentAction = HammerAction.None
    if (this.props.onChange !== undefined) {
      this.props.onChange(
        this.state.offsetX,
        this.state.offsetY,
        this.state.rotation,
        this.state.scale,
      )
    }
  }

  /**
   * Initialize the HammerManager with the appropriate event handlers.
   * @param mc
   */
  private readonly setupHammer: (mc: HammerManager) => void = mc => {
    const pan = new Hammer.Pan();
    const pinch = new Hammer.Pinch();
    const rotate = new Hammer.Rotate();
    pinch.recognizeWith(rotate);
    mc.add([pan, pinch, rotate]);
    mc.on("panstart", this.handleHammerStartPan)
    // N.B. using 'pinchstart' as well as 'rotatestart' only produces duplicates; everything starts with rotate
    mc.on("rotatestart", this.handleHammerStartScaleRotate)
    mc.on("pan", this.handleHammerProgressivePan)
    mc.on("pinch rotate", this.handleHammerProgressiveScaleRotate)
    mc.on("panend", this.handleHammerEndPan)
    // N.B. using 'pinchend' as well as 'rotateend' only produces duplicates; everything ends with rotate
    mc.on("rotateend", this.handleHammerEndScaleRotate)
    mc.on("pancancel pinchcancel rotatecancel", this.handleHammerCancelEvent)
  }

  componentDidMount(): void {
    // create a HammerManager connected to the container div
    if (this.containerRef.current === null) {
      throw new Error("cannot find container element")
    }
    this._hammer = new Hammer.Manager(this.containerRef.current);
    this.setupHammer(this._hammer)
  }

  componentWillUnmount(): void {
    // tear down the HammerManager connected to the container div, if it exists.
    if (this._hammer !== null) {
      this._hammer.destroy()
      this._hammer = null;
    }
  }

  render(): ReactElement {
    // wrap the children in a container div with a HammerManager connected to it.
    return <div ref={this.containerRef} style={this.props.style}>{this.props.children}</div>
  }

}
