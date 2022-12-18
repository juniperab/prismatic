import { CSSProperties, Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react"
import {
  ColourChooserInner,
  ColourChooserOuter,
  ColourChooserSelection
} from "./colourChooserLayout"
import { InfiniteHammerArea } from '../hammer/InfiniteHammerArea'
import { HammerAreaValues } from '../hammer/HammerArea'
import { toHSL } from '../../../lib/colour/colourConversions'
import { rotateHue } from '../../../lib/colour/colourMath'
import { ColourChooserHelpOverlay } from "./ColourChooserHelpOverlay"

interface OverlayState {
  show: boolean,
  ticksBeforeHide: number,
}

const initialOverlayState: OverlayState = {
  show: true,
  ticksBeforeHide: 20
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function overlayFunctions(setOverlay: Dispatch<SetStateAction<OverlayState>>) {

  const addOverlayTicks = (ticks: number): void => setOverlay(prev => {
    const newTicks = prev.ticksBeforeHide - ticks
    return {
      ...prev,
      ticksBeforeHide: newTicks,
      show: newTicks > 0,
    }
  })

  const hideOverlay = (): void => setOverlay(prev => { return { ...prev, show: false } })

  const showOverlay = (): void => setOverlay(prev => { return {
    ...prev,
    show: true,
    ticksBeforeHide: initialOverlayState.ticksBeforeHide }
  })

  return { addOverlayTicks, hideOverlay, showOverlay }
}

export function ColourChooser(): ReactElement {
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(50)
  const [brightness, setBrightness] = useState(50)
  const [overlay, setOverlay] = useState(initialOverlayState)
  const { hideOverlay, showOverlay, addOverlayTicks } = overlayFunctions(setOverlay)

  useEffect(() => {
    showOverlay()
    // const t = setTimeout(hideOverlay, 5000)
    // return () => clearTimeout(t)
  }, [])

  const currentColourHslCss =  (() => {
    const hsl = toHSL({ h: hue, s: saturation, b: brightness })
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  })()

  const handleHammerAreaChange: (values: HammerAreaValues) => void = (values) => {
    const pctX = values.x / Math.max(values.containerWidth, 1)
    const pctY = values.y / Math.max(values.containerHeight, 1)
    let newSaturation = Math.abs(-1 * pctX * 100 + 50) % 200
    let newBrightness = Math.abs(pctY * 100 + 50) % 200
    newSaturation = newSaturation > 100 ? 200 - newSaturation : newSaturation
    newBrightness = newBrightness > 100 ? 200 - newBrightness : newBrightness
    setHue(rotateHue(values.rotation, 0))
    setSaturation(newSaturation)
    setBrightness(newBrightness)
    addOverlayTicks(1)
  }

  const handleHammerAreaTap: () => void = () => { overlay.show ? hideOverlay() : showOverlay() }

  const overlayStyle: CSSProperties = {
    backgroundColor: (() => {
      const c = toHSL({h: hue, s: 50, b: 100})
      return `hsla(${c.h}, ${c.s}%, ${c.l}%, 50%)`
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
      <ColourChooserSelection data-show={!overlay.show} style={{ backgroundColor: `${currentColourHslCss}` }} />
    </ColourChooserOuter>
  )
}
