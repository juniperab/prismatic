import { ReactElement, useState } from 'react'
import { ColourChooserInner, ColourChooserOuter, ColourChooserSelection } from './colourChooserLayout'
import { InfiniteHammerArea } from '../hammer/InfiniteHammerArea'
import { HammerAreaValues } from '../hammer/HammerArea'
import { toHSL } from '../../../lib/colour/colourConversions'
import { rotateHue } from '../../../lib/colour/colourMath'

export function ColourChooser(): ReactElement {
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(50)
  const [brightness, setBrightness] = useState(50)

  function currentColourHslCss(): string {
    const hsl = toHSL({ h: hue, s: saturation, b: brightness })
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  }

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
  }

  return (
    <ColourChooserOuter>
      <InfiniteHammerArea
        clampScale={[1, 10]}
        lockRotation={true}
        mirrorTiles={true}
        onChange={handleHammerAreaChange}
        style={{
          height: '100%',
          position: 'relative',
          width: '100%',
        }}
      >
        <ColourChooserInner style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }} />
      </InfiniteHammerArea>
      <ColourChooserSelection style={{ backgroundColor: `${currentColourHslCss()}` }} />
    </ColourChooserOuter>
  )
}
