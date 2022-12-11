import { ReactElement } from "react"
import { ColourChooserOuter } from "./colourChooserLayout"
import { HsvColorPicker } from "react-colorful"
import { Infinite } from "../infinite/Infinite"
import styled from "styled-components"

const TempContents = styled.div`
  background-color: darkgreen;
  color: lightsteelblue;
`

export function ColourChooser(): ReactElement {

  return <Infinite>
    <TempContents>Hello world</TempContents>
  </Infinite>

  // return <Infinite>
  //   <ColourChooserOuter>
  //     <HsvColorPicker
  //       // style={{transform: `scale(${scale})`}}
  //       color={{h: 120, s: 50, v: 50}}
  //     />
  //   </ColourChooserOuter>
  // </Infinite>
}