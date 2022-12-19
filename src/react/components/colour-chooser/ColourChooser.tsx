import { CSSProperties, ReactElement, useState } from "react"
import {
  ColourChooserInner, colourChooserLayout,
  ColourChooserOuter,
  ColourChooserSelection
} from "./colourChooserLayout"
import { InfiniteHammerArea } from '../hammer/InfiniteHammerArea'
import { HammerOnChangeCallback, HammerOnTapCallback } from "../hammer/HammerArea"
import { HSBColor, toHSL } from "../../../lib/colour/colourConversions"
import { rotateHue } from '../../../lib/colour/colourMath'
import {
  ColourChooserHelpOverlay,
  OverlayState, useOverlayState
} from "./ColourChooserHelpOverlay"
import { euclideanDistance } from "../../../lib/math/math"
import { defaultTo} from "lodash"

export type NewColourCallback = (colour: HSBColor) => void

export interface ColourChooserProps {
  // callback triggered when the colour is changed in any way, even during a gesture
  onChange?: NewColourCallback

  // callback triggered when a gesture completes
  onChangeComplete?: NewColourCallback

  // callback triggered when the selection area is tapped
  onSelect?: NewColourCallback
}

const initialOverlayState: OverlayState = {
  show: true,
  ticksBeforeHide: 20
}

export function ColourChooser(props: ColourChooserProps): ReactElement {
  const { onChange, onChangeComplete, onSelect } = props
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(50)
  const [brightness, setBrightness] = useState(50)
  const [overlay, showOverlay, tickOverlay] = useOverlayState(initialOverlayState)

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
    setHeight(values.containerHeight)
    setWidth(values.containerWidth)
    tickOverlay(1)
    defaultTo(
      gestureComplete ? onChangeComplete : onChange, () => {}
    )({ h: newHue, s: newSaturation, b: newBrightness })
  }) as HammerOnChangeCallback

  const handleHammerAreaTap = ((x, y) => {
    if (overlay.show) {
      showOverlay(false)
      return
    }
    const distanceFromCentre = euclideanDistance([x - width / 2, y - height / 2])
    if (distanceFromCentre <= colourChooserLayout.selector.diameter / 2) {
      if (onSelect !== undefined) onSelect({ h: hue, s: saturation, b: brightness })
    }
  }) as HammerOnTapCallback

  const overlayStyle: CSSProperties = {
    backgroundColor: (() => {
      const c = toHSL({h: hue, s: 50, b: 100})
      return `hsla(${c.h}, ${c.s}%, ${c.l}%, 50%)`
    })()
  }
  const selectionStyle: CSSProperties = {
    backgroundColor: (() => {
      const hsl = toHSL(currentColour)
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    })()
  }

  return (
    <ColourChooserOuter>
      <InfiniteHammerArea
        clampScale={[1, 10]}
        lockRotation={true}
        mirrorTiles={true}
        onChange={handleHammerAreaChange}
        onTap={handleHammerAreaTap}
        overlay={<ColourChooserHelpOverlay style={overlayStyle} visible={overlay.show}/>}
        style={{
          height: '100%',
          position: 'relative',
          width: '100%',
        }}
      >
        <ColourChooserInner style={{
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
        }} />
      </InfiniteHammerArea>
      <ColourChooserSelection data-show={!overlay.show} style={selectionStyle} />
    </ColourChooserOuter>
  )
}
