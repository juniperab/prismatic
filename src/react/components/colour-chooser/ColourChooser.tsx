import { CSSProperties, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import {
  ColourChooserInner,
  ColourChooserOuter,
  ColourChooserSelection,
  ColourChooserSelectionPending,
} from './colourChooserLayout'
import { InfiniteHammerArea } from '../hammer/InfiniteHammerArea'
import { AnyColor, HSBColor, toCssColour, toHSB } from '../../../lib/colour/colourConversions'
import { rotateHue } from '../../../lib/colour/colourMath'
import { ColourChooserHelpOverlay, OverlayState, useOverlayState } from './ColourChooserHelpOverlay'
import { defaultTo } from 'lodash'
import { HammerOnChangeCallback, HammerOnResizeCallback, HammerOnTapCallback } from '../hammer/hammerAreaTypes'

export type NewColourCallback = (colour: HSBColor) => void

export interface ColourChooserProps {
  // callback triggered when the colour is changed in any way, even during a gesture
  onChange?: NewColourCallback

  // callback triggered when a gesture completes
  onChangeComplete?: NewColourCallback

  // callback triggered when the selection area is tapped
  onSelect?: () => void
  colour: AnyColor
}

const initialOverlayState: OverlayState = {
  show: false, // TODO: either make this 'true' or add a way to manually show it
  ticksBeforeHide: 20,
}

export function ColourChooser(props: ColourChooserProps): ReactElement {
  const { onChange, onChangeComplete, onSelect } = props
  const propsColourHSB = toHSB(props.colour)
  const selectorRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(1)
  const [height, setHeight] = useState(1)
  const [hue, setHue] = useState(propsColourHSB.h)
  const [saturation, setSaturation] = useState(propsColourHSB.s)
  const [brightness, setBrightness] = useState(propsColourHSB.b)
  const [overlay, showOverlay, tickOverlay] = useOverlayState(initialOverlayState)
  const [dragging, setDragging] = useState(false)
  const [selectionPending, setSelectionPending] = useState(false)

  const updateHue: (rotation: number) => number = useCallback(
    (rotation) => {
      const newHue = rotateHue(rotation, 0)
      setHue(newHue)
      return newHue
    },
    [setHue]
  )

  const updateSaturation: (x: number) => number = useCallback(
    (x) => {
      const pctX = x / Math.max(width, 1)
      let newSaturation = Math.abs(-1 * pctX * 100 + 50) % 200
      newSaturation = newSaturation > 100 ? 200 - newSaturation : newSaturation
      setSaturation(newSaturation)
      return newSaturation
    },
    [setSaturation, width]
  )

  const updateBrightness: (y: number) => number = useCallback(
    (y) => {
      const pctY = y / Math.max(height, 1)
      let newBrightness = Math.abs(pctY * 100 + 50) % 200
      newBrightness = newBrightness > 100 ? 200 - newBrightness : newBrightness
      setBrightness(newBrightness)
      return newBrightness
    },
    [setBrightness, height]
  )

  useEffect(() => {
    const hsb: HSBColor = toHSB(props.colour)
    updateHue(hsb.h)
    updateSaturation(hsb.s)
    updateBrightness(hsb.b)
  }, [props, updateHue, updateSaturation, updateBrightness])

  const handleHammerAreaChange: HammerOnChangeCallback = (newData) => {
    const { newValues, gestureComplete } = newData
    const { rotation, x, y } = newValues
    tickOverlay(1)
    setDragging(!gestureComplete)
    setSelectionPending(false)
    defaultTo(gestureComplete ? onChangeComplete : onChange, () => {})({
      h: updateHue(rotation),
      s: updateSaturation(x),
      b: updateBrightness(y),
    })
  }

  const handleHammerAreaResize: HammerOnResizeCallback = (width, height) => {
    setWidth(width)
    setHeight(height)
  }

  const handleHammerAreaTap: HammerOnTapCallback = (x, y, target: HTMLElement) => {
    if (overlay.show) {
      showOverlay(false)
      return
    }
    if (target === selectorRef.current) {
      if (selectionPending) {
        setSelectionPending(false)
        if (onSelect !== undefined) onSelect()
      } else {
        setSelectionPending(true)
      }
    } else {
      setSelectionPending(false)
    }
  }

  const overlayStyle: CSSProperties = {
    backgroundColor: toCssColour({ h: hue, s: 50, b: 100, a: 50 }),
  }
  const selectionStyle: CSSProperties = {
    backgroundColor: toCssColour({ h: hue, s: saturation, b: brightness }),
    cursor: dragging ? undefined : 'pointer',
  }

  const underlayComponent = <ColourChooserHelpOverlay style={overlayStyle} visible={overlay.show} />
  const overlayComponent = selectionPending ? (
    <ColourChooserSelectionPending data-show={!overlay.show} ref={selectorRef} style={selectionStyle} />
  ) : (
    <ColourChooserSelection data-show={!overlay.show} ref={selectorRef} style={selectionStyle} />
  )

  return (
    <ColourChooserOuter>
      <InfiniteHammerArea
        clampScale={[1, 10]}
        lockRotation={true}
        // values={{
        //   x: (propsColourHSB.s - 50) * width / 100,
        //   y: (propsColourHSB.b - 50) * height / 100,
        //   rotation: propsColourHSB.h,
        // }}
        mirrorTiles={true}
        onChange={handleHammerAreaChange}
        onResize={handleHammerAreaResize}
        onTap={handleHammerAreaTap}
        underlay={underlayComponent}
        overlay={overlayComponent}
        style={{
          height: '100%',
          position: 'relative',
          width: '100%',
        }}
      >
        <ColourChooserInner
          style={{
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
          }}
        />
      </InfiniteHammerArea>
    </ColourChooserOuter>
  )
}
