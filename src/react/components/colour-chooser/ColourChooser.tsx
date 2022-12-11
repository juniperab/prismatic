import { ReactElement } from "react"
import { ColourChooserOuter } from "./colourChooserLayout"
import { HsvColorPicker } from "react-colorful"
import { InfiniteHammerArea } from "../hammer/InfiniteHammerArea"
import { HammerAreaValues } from "../hammer/HammerArea"

export function ColourChooser(): ReactElement {

  const handleHammerAreaChange: (values: HammerAreaValues) => void = values => {
    console.log(`X: ${values.displayOffsetX} = ${values.x}     Y: ${values.displayOffsetY} = ${values.y}`)
  }

  return <InfiniteHammerArea
    clampScale={[1, 10]}
    lockRotation={true}
    onChange={handleHammerAreaChange}
  >
    <ColourChooserOuter>
      <HsvColorPicker color={{h: 120, s: 50, v: 50}} />
    </ColourChooserOuter>
  </InfiniteHammerArea>
}
