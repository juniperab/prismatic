import * as _ from "lodash"
import { Component, createRef, ReactElement, ReactNode, RefObject } from "react"
import Hammer from 'hammerjs'

export interface HammerComponentProps {
  children: ReactNode
  onManipulate: (x: number, y: number, scale: number, rotation: number) => void
  maxScale?: number
  minScale?: number
}

export class HammerComponent extends Component<HammerComponentProps> {
  readonly containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>()
  _hammer: HammerManager | null = null

  deltaX = 0
  deltaY = 0
  rotation = 0
  scale = 1

  constructor(props: HammerComponentProps) {
    super(props)
  }

  calculateScale: (evScale: number) => number = evScale => {
    let newScale = this.scale * evScale
    if (this.props.minScale !== undefined) {
      newScale = Math.max(newScale, this.props.minScale)
    }
    if (this.props.maxScale !== undefined) {
      newScale = Math.min(newScale, this.props.maxScale)
    }
    return newScale
  }

  handleHammerProgressivePan: (ev: HammerInput) => void = ev => {
    if (this.props.onManipulate !== undefined) {
      this.props.onManipulate(
        this.deltaX + ev.deltaX,
        this.deltaY + ev.deltaY,
        this.rotation,
        this.scale,
      )
    }
  }

  handleHammerProgressiveScaleRotate: (ev: HammerInput) => void = ev => {
    if (this.props.onManipulate !== undefined) {
      this.props.onManipulate(
        this.deltaX,
        this.deltaY,
        this.rotation + ev.rotation,
        this.calculateScale(ev.scale),
      )
    }
  }

  handleHammerEndPan: (ev: HammerInput) => void = ev => {
    this.deltaX += ev.deltaX
    this.deltaY += ev.deltaY
    if (this.props.onManipulate !== undefined) {
      this.props.onManipulate(this.deltaX, this.deltaY, this.rotation, this.scale)
    }
  }

  _handleHammerEndScaleRotate: (ev: HammerInput) => void = ev => {
    this.rotation += ev.rotation
    this.scale = this.calculateScale(ev.scale)
    if (this.props.onManipulate !== undefined) {
      this.props.onManipulate(this.deltaX, this.deltaY, this.rotation, this.scale)
    }
  }

  handleHammerEndScaleRotateDebounced = _.debounce(this._handleHammerEndScaleRotate, 10)

  handleHammerCancelEvent: (ev: HammerInput) => void = ev => {
    if (this.props.onManipulate !== undefined) {
      this.props.onManipulate(
        this.deltaX,
        this.deltaY,
        this.rotation,
        this.scale,
      )
    }
  }

  setupHammer(mc: HammerManager): void {
    const pan = new Hammer.Pan();
    const pinch = new Hammer.Pinch();
    const rotate = new Hammer.Rotate();
    pinch.recognizeWith(rotate);
    mc.add([pan, pinch, rotate]);
    mc.on("pan", this.handleHammerProgressivePan)
    mc.on("pinch rotate", this.handleHammerProgressiveScaleRotate)
    mc.on("panend", this.handleHammerEndPan)
    mc.on("pinchend rotateend", this.handleHammerEndScaleRotateDebounced)
    mc.on("pancancel pinchcancel rotatecancel", this.handleHammerCancelEvent)
  }

  componentDidMount(): void {
    if (this.containerRef.current === null) {
      throw new Error("cannot find container element")
    }
    this._hammer = new Hammer.Manager(this.containerRef.current);
    this.setupHammer(this._hammer)
  }

  componentWillUnmount(): void {
    if (this._hammer !== null) {
      this._hammer.destroy()
      this._hammer = null;
    }
  }

  render(): ReactElement {
    return <div ref={this.containerRef}>{this.props.children}</div>
  }

}
