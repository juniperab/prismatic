import { ReactElement } from "react"
import { HintGridMiddle2, HintGridMiddle1, HintGridOuter, HintGridInner } from "./hintGridLayout"
import { Hint } from "../../../lib/puzzle/hint/hint"

export interface HintGridProps {
  hints: Hint[]
}

export function HintGrid(props: HintGridProps): ReactElement {
  return <HintGridOuter>
    <HintGridMiddle1>
      <HintGridMiddle2>
        <HintGridInner>

        </HintGridInner>
      </HintGridMiddle2>
    </HintGridMiddle1>
  </HintGridOuter>
}
