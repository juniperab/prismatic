import * as _ from "lodash"
import { Component, createRef, CSSProperties, ReactElement, ReactNode, RefObject } from "react"
import Hammer from 'hammerjs'

export type Clamp = [number | undefined, number | undefined] // [min, max]

enum Action {
  None = 'none', Pan = 'pan', ScaleRotate = 'scale/rotate'
}

export interface HammerComponentProps {
  children?: ReactNode
  clampScale?: Clamp
  clampRotation?: Clamp
  clampX?: Clamp
  clampY?: Clamp
  lockScale?: boolean
  lockRotation?: boolean
  lockX?: boolean
  lockY?: boolean
  onChange: (x: number, y: number, scale: number, rotation: number) => void
  style?: CSSProperties
}

interface HammerComponentState {
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
function clampValue (value: number, clamp: Clamp | undefined): number {
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
  currentState: HammerComponentState,
  currentProps: HammerComponentProps,
  initialValues: HammerComponentState,
): HammerComponentState {
  let newOffsetX = currentState.offsetX + (ev.deltaX - initialValues.offsetX)
  let newOffsetY = currentState.offsetY + (ev.deltaY - initialValues.offsetY)
  newOffsetX = clampValue(newOffsetX, currentProps.clampX)
  newOffsetY = clampValue(newOffsetY, currentProps.clampY)
  return {
    rotation: currentState.rotation,
    scale: currentState.scale,
    offsetX: currentProps.lockX === true ? currentState.offsetX : newOffsetX,
    offsetY: currentProps.lockY === true ? currentState.offsetY : newOffsetY,
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
  currentState: HammerComponentState,
  currentProps: HammerComponentProps,
  initialValues: HammerComponentState,
): HammerComponentState {
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

  const actualDeltaScale = newScale / currentState.scale
  // TODO: make it rotate around the current centre point vs the origin

  return {
    rotation: currentProps.lockRotation === true ? currentState.rotation : newRotation,
    scale: currentProps.lockScale === true ? currentState.scale : newScale,
    offsetX: currentState.offsetX * actualDeltaScale,
    offsetY: currentState.offsetY * actualDeltaScale,
  }
}

export class HammerComponent extends Component<HammerComponentProps, HammerComponentState> {
  private readonly containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>()
  private _hammer: HammerManager | null = null
  private initialValues: HammerComponentState
  private currentAction: Action

  constructor(props: HammerComponentProps) {
    super(props)
    this.state = {
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      scale: 1,
    }
    this.initialValues = this.state
    this.currentAction = Action.None
  }

  private readonly handleHammerStartPan: (ev: HammerInput) => void = ev => {
    if (this.currentAction !== Action.None) return
    this.currentAction = Action.Pan
    this.initialValues = {
      offsetX: ev.deltaX,
      offsetY: ev.deltaY,
      rotation: 0,
      scale: 1,
    }
  }

  private readonly handleHammerStartScaleRotate: (ev: HammerInput) => void = ev => {
    if (this.currentAction !== Action.None) return
    this.currentAction = Action.ScaleRotate
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
    if (this.currentAction !== Action.Pan) return
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
    if (this.currentAction !== Action.ScaleRotate) return
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
    if (this.currentAction !== Action.Pan) return
    this.currentAction = Action.None
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
    if (this.currentAction !== Action.ScaleRotate) return
    this.currentAction = Action.None
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
    this.currentAction = Action.None
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
