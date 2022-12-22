import { ReactElement } from 'react'
import { HintGridMiddle2, HintGridMiddle1, HintGridOuter, HintGridInner } from './hintGridLayout'
import { Hint } from '../../../lib/puzzle/hint/hint'
import { HintGridRow } from './HintGridRow'
import { useAppSelector } from "../../../redux/hooks";
import { selectConfigState } from "../../../redux/config/configSlice";
import { AnyColor } from "../../../lib/colour/colourConversions";

export interface HintGridProps {
  guesses: AnyColor[],
  hints: Hint[]
}

export function HintGrid(props: HintGridProps): ReactElement {
  const { guesses, hints } = props
  const { maxGuesses } = useAppSelector(selectConfigState)
  console.log(hints)

  const numCols = 4 // 5 for CMYK hints if I do them
  const numRows = maxGuesses
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
          <HintGridInner data-rows={numRows}>
            {rows}
          </HintGridInner>
        </HintGridMiddle2>
      </HintGridMiddle1>
    </HintGridOuter>
  )
}
