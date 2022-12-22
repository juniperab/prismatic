import { CSSProperties, ReactElement, useRef, useState } from 'react'
import {
  ColourChooserInner,
  ColourChooserOuter,
  ColourChooserSelection,
  ColourChooserSelectionPending,
} from './colourChooserLayout'
import { InfiniteHammerArea } from '../hammer/InfiniteHammerArea'
import { HammerOnChangeCallback, HammerOnTapCallback } from '../hammer/HammerArea'
import { HSBColor, toCssColour } from "../../../lib/colour/colourConversions";
import { rotateHue } from '../../../lib/colour/colourMath'
import { ColourChooserHelpOverlay, OverlayState, useOverlayState } from './ColourChooserHelpOverlay'
import { defaultTo } from 'lodash'

export type NewColourCallback = (colour: HSBColor) => void

export interface ColourChooserProps {
  // callback triggered when the colour is changed in any way, even during a gesture
  onChange?: NewColourCallback

  // callback triggered when a gesture completes
  onChangeComplete?: NewColourCallback

  // callback triggered when the selection area is tapped
  onSelect?: () => void
}

const initialOverlayState: OverlayState = {
  show: true,
  ticksBeforeHide: 20,
}

export function ColourChooser(props: ColourChooserProps): ReactElement {
  const { onChange, onChangeComplete, onSelect } = props
  const selectorRef = useRef<HTMLDivElement>(null)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(50)
  const [brightness, setBrightness] = useState(50)
  const [overlay, showOverlay, tickOverlay] = useOverlayState(initialOverlayState)
  const [dragging, setDragging] = useState(false)
  const [selectionPending, setSelectionPending] = useState(false)

  const currentColour: HSBColor = { h: hue, s: saturation, b: brightness }

  const handleHammerAreaChange = ((values, gestureComplete) => {
    const pctX = values.x / Math.max(values.containerWidth, 1)
    const pctY = values.y / Math.max(values.containerHeight, 1)
    const newHue = rotateHue(values.rotation, 0)
    let newSaturation = Math.abs(-1 * pctX * 100 + 50) % 200
    let newBrightness = Math.abs(pctY * 100 + 50) % 200
    newSaturation = newSaturation > 100 ? 200 - newSaturation : newSaturation
    newBrightness = newBrightness > 100 ? 200 - newBrightness : newBrightness
    setHue(newHue)
    setSaturation(newSaturation)
    setBrightness(newBrightness)
    tickOverlay(1)
    setDragging(!gestureComplete)
    setSelectionPending(false)
    defaultTo(gestureComplete ? onChangeComplete : onChange, () => {})({
      h: newHue,
      s: newSaturation,
      b: newBrightness,
    })
  }) as HammerOnChangeCallback

  const handleHammerAreaTap = ((x, y, target: HTMLElement) => {
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
  }) as HammerOnTapCallback

  const overlayStyle: CSSProperties = {
    backgroundColor: toCssColour({ h: hue, s: 50, b: 100, a: 50 }),
  }
  const selectionStyle: CSSProperties = {
    backgroundColor: toCssColour(currentColour),
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
        mirrorTiles={true}
        onChange={handleHammerAreaChange}
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
