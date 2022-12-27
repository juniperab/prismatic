import { ReactElement } from 'react'
import { HintGridMiddle2, HintGridMiddle1, HintGridOuter, HintGridInner } from './hintGridLayout'
import { Hint } from '../../../lib/puzzle/hint/hint'
import { HintGridRow } from './HintGridRow'
import { AnyColor } from '../../../lib/colour/colourConversions'

export interface HintGridProps {
  hints: Hint[]
  guesses: AnyColor[]
  numCols: number
  numRows: number
}

export function HintGrid(props: HintGridProps): ReactElement {
  const { hints, guesses, numCols, numRows } = props
  const aspectRatio = numCols / numRows

  const rows = []
  for (let i = 0; i < numRows; i++) {
    if (hints.length > i) {
      rows.push(<HintGridRow hint={hints[i]} numCols={numCols} key={i} />)
    } else if (guesses.length > i) {
      rows.push(<HintGridRow guess={guesses[i]} numCols={numCols} key={i} />)
    } else {
      rows.push(<HintGridRow numCols={numCols} key={i} />)
    }
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
