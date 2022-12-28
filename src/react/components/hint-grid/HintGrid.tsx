import { ReactElement } from 'react'
import { HintGridMiddle2, HintGridMiddle1, HintGridOuter, HintGridInner, HintGridRow } from "./hintGridLayout";
import { Hint } from '../../../lib/puzzle/hint/hint'
import { HintDisplay } from "../hint-display/HintDisplay";

export interface HintGridProps {
  hints: Hint[]
  numCols: number
  numRows: number
}

export function HintGrid(props: HintGridProps): ReactElement {
  const { hints, numCols, numRows } = props
  const aspectRatio = numCols / numRows

  const rows: ReactElement[] = []
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    const cells: ReactElement[] = []
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      const hintIdx = rowIdx * numCols + colIdx
      const hint = hints[hintIdx]
      cells.push(<HintDisplay hint={hint} key={colIdx}/>)
    }
    rows.push(<HintGridRow data-cols={numCols} key={rowIdx}>{cells}</HintGridRow>)
  }

  return (
    <HintGridOuter>
      <HintGridMiddle1 data-aspect-ratio={aspectRatio}>
        <HintGridMiddle2 data-aspect-ratio={aspectRatio}>
          <HintGridInner data-rows={numRows}>{rows}</HintGridInner>
        </HintGridMiddle2>
      </HintGridMiddle1>
    </HintGridOuter>
  )
}
