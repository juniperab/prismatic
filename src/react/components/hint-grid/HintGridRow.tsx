import { ReactElement } from "react"
import { hintGridLayout, HintRowCell, HintRowOuter } from "./hintGridLayout"

export function HintGridRow(): ReactElement {
  const cells = Array(hintGridLayout.cols).fill(0).map((_, idx) => <HintRowCell key={idx}/>)

  return <HintRowOuter>
    {cells}
  </HintRowOuter>
}