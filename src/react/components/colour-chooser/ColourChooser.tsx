import { ReactElement } from "react"
import { ColourChooserOuter } from "./colourChooserLayout"
import { HsvColorPicker } from "react-colorful"
import { InfiniteHammerArea } from "../infinite/InfiniteHammerArea"
import styled from "styled-components"

const TempContents = styled.div`
  background-color: darkgreen;
  color: lightsteelblue;
`

export function ColourChooser(): ReactElement {

  return <InfiniteHammerArea>
    <TempContents>Hello world</TempContents>
  </InfiniteHammerArea>

  // return <InfiniteHammerArea>
  //   <ColourChooserOuter>
  //     <HsvColorPicker
  //       // style={{transform: `scale(${scale})`}}
  //       color={{h: 120, s: 50, v: 50}}
  //     />
  //   </ColourChooserOuter>
  // </InfiniteHammerArea>
}