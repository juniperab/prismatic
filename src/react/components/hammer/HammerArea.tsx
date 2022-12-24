import { debounce, defaultTo, has } from 'lodash'
import { Component, ReactElement } from 'react'
import Hammer from 'hammerjs'
import { useResizeDetector } from 'react-resize-detector'
import { HammerAreaInner, HammerAreaOuter } from './hammerAreaLayout'
import { useModifierKeys } from '../../hooks/useModifierKeys'
import {
  HammerAreaProps, HammerAreaValues,
  HammerOnResizeCallback,
  HammerOnTapCallback
} from "./hammerAreaTypes";
import {
  HammerAction,
  HammerEventValues,
  _HammerAreaProps,
  HammerOnUpdatePropValuesCallback, InternalHammerOnChangeCallback, InternalHammerAreaProps
} from "./hammerAreaTypesInternal";
import { valuesDiffs, valuesEquals, withDefaults } from "./hammerAreaFunctions";
import { newValuesForPan, newValuesForScaleRotate, newValuesForScaleRotateViaPan } from "./hammerAreaFunctionsInternal";

const defaultHammerAreaValues: HammerAreaValues = {
  rotation: 0,
  scale: 1,
  x: 0,
  y: 0,
}

const defaultHammerAreaDisplayValues: HammerAreaValues = {
  rotation: 0,
  scale: 1,
  x: 0,
  y: 0,
}

class _HammerArea extends Component<_HammerAreaProps> {
  private _hammer: HammerManager | null = null
  private currentAction: HammerAction
  private currentActionIsModified: boolean
  private currentValues: HammerAreaValues
  private currentDisplayValues: HammerAreaValues
  private eventStartValues: HammerEventValues
  private mostRecentEvent: HammerInput | undefined = undefined

  constructor(props: _HammerAreaProps) {
    super(props)
    this.currentValues = withDefaults(props.values, defaultHammerAreaValues)
    this.currentDisplayValues = withDefaults(props.values, defaultHammerAreaDisplayValues)
    this.eventStartValues = this.currentValues
    this.currentAction = HammerAction.None
    this.currentActionIsModified = false
  }

  private readonly callOnChange: InternalHammerOnChangeCallback = newData => {
    const { newValues, gestureComplete } = newData
    console.log(`HammerArea onChange${gestureComplete ? ' (complete)' : ''}`)
    if (gestureComplete) {
      console.log(`change x ${newValues.x}`)
      console.log(`change y ${newValues.y}`)
    }
    if (this.props.onChange !== undefined) this.props.onChange(newData)
    if (this.props.onChangeInternal !== undefined) this.props.onChangeInternal(newData)
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
    this.eventStartValues = { rotation: 0, scale: 1, x: ev.deltaX, y: ev.deltaY }
  }

  private readonly handleHammerStartScaleRotate: (ev: HammerInput) => void = (ev) => {
    if (this.currentAction !== HammerAction.None) return
    this.currentAction = HammerAction.ScaleRotate
    this.mostRecentEvent = ev
    this.eventStartValues = { rotation: ev.rotation, scale: ev.scale, x: 0, y: 0 }
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
    if (this.currentActionIsModified) {
      this.callOnChange({
        ...newValuesForScaleRotateViaPan(
          eventValues,
          this.eventStartValues,
          this.currentValues,
          this.currentDisplayValues,
          this.props,
        ),
        gestureComplete: false,
      })
    } else {
      this.callOnChange({
        ...newValuesForPan(
          eventValues,
          this.eventStartValues,
          this.currentValues,
          this.currentDisplayValues,
          this.props,
        ),
        gestureComplete: false,
      })
    }
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
    this.callOnChange({
      ...newValuesForScaleRotate(
        eventValues,
        this.eventStartValues,
        this.currentValues,
        this.currentDisplayValues,
        this.props,
      ),
      gestureComplete: true,
    })
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
    let newData
    if (this.currentActionIsModified) {
      newData = newValuesForScaleRotateViaPan(
        eventValues,
        this.eventStartValues,
        this.currentValues,
        this.currentDisplayValues,
        this.props
      )
    } else {
      newData = newValuesForPan(
        eventValues,
        this.eventStartValues,
        this.currentValues,
        this.currentDisplayValues,
        this.props
      )
    }
    this.currentValues = newData.newValues
    this.currentDisplayValues = newData.newDisplayValues
    this.currentActionIsModified = false
    this.callOnChange({ ...newData, gestureComplete: true })
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
    const newData = newValuesForScaleRotate(
      eventValues,
      this.eventStartValues,
      this.currentValues,
      this.currentDisplayValues,
      this.props
    )
    this.currentValues = newData.newValues
    this.currentDisplayValues = newData.newDisplayValues
    this.callOnChange({ ...newData, gestureComplete: true })
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
    this.callOnChange({
      newValues: this.currentValues,
      newDisplayValues: this.currentDisplayValues,
      gestureComplete: true,
    })
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

  componentDidUpdate(prevProps: Readonly<_HammerAreaProps>, prevState: Readonly<{}>, snapshot?: any): void {
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

export function InternalHammerArea(props: InternalHammerAreaProps): ReactElement {
  const { width, height, ref } = useResizeDetector()
  const { altKeyDown, ctrlKeyDown, metaKeyDown } = useModifierKeys()
  const actualWidth = defaultTo(width, 0)
  const actualHeight = defaultTo(height, 0)
  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <_HammerArea
      containerRef={ref}
      containerWidth={actualWidth}
      containerHeight={actualHeight}
      modifierKeyPressed={altKeyDown || ctrlKeyDown || metaKeyDown}
      {...props}
    >
      {props.children}
    </_HammerArea>
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
 * incremented or decremented that affects the way some other aspect of the
 * component is rendered.
 */
export function HammerArea(props: HammerAreaProps): ReactElement {
  return <InternalHammerArea {...props}>{props.children}</InternalHammerArea>
}
