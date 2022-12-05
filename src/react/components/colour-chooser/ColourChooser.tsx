import { ReactElement, useState } from "react"
import { ColourChooserCover, ColourChooserOuter } from "./colourChooserLayout"
import { HsvColorPicker } from "react-colorful"
import { HammerComponent } from "../hammer/HammerComponent"

export function ColourChooser(): ReactElement {
  const [deltaX, setDeltaX] = useState(0)
  const [deltaY, setDeltaY] = useState(0)
  const [scale, setScale] = useState(1)

  function handleManipulate(x: number, y: number, r: number, s: number): void {
    setDeltaX(x)
    setDeltaY(y)
    setScale(s)
  }

  return <HammerComponent onManipulate={handleManipulate} minScale={1}>
      <ColourChooserOuter>
       <HsvColorPicker
         style={{transform: `scale(${scale})`}}
         color={{h: 120, s: 50, v: 50}}
       />
       <ColourChooserCover>
         {Math.round(deltaX)}, {Math.round(deltaY)} | {Math.round(scale * 100)}%
       </ColourChooserCover>
      </ColourChooserOuter>
    </HammerComponent>
}