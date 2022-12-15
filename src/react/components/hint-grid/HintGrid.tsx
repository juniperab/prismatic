import { ReactElement } from 'react'
import { HintGridMiddle2, HintGridMiddle1, HintGridOuter, HintGridInner, hintGridLayout } from './hintGridLayout'
import { Hint } from '../../../lib/puzzle/hint/hint'
import { HintGridRow } from './HintGridRow'

export interface HintGridProps {
  hints: Hint[]
}

export function HintGrid(props: HintGridProps): ReactElement {
  const rows = Array(hintGridLayout.rows)
    .fill(0)
    .map((_, idx) => <HintGridRow key={idx} />)

  return (
    <HintGridOuter>
      <HintGridMiddle1>
        <HintGridMiddle2>
          <HintGridInner>{rows}</HintGridInner>
        </HintGridMiddle2>
      </HintGridMiddle1>
    </HintGridOuter>
  )
}
