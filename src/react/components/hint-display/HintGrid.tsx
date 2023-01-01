import { CSSProperties, ReactElement, useEffect, useState } from 'react'
import { _HintGrid as HintGridElement, hintGridLayout } from './hintGridLayout'
import { Hint } from '../../../lib/puzzle/hint'
import { HintCircle } from './HintCircle'
import { AnyColour } from '../../../lib/colour/colours'

export interface HintGridProps {
  answer?: AnyColour
  hints: Hint[]
  maxHeight?: number
  maxWidth?: number
  numCols: number
  numRows: number
  onClick?: (hint: Hint) => void
}

export function HintGrid(props: HintGridProps): ReactElement {
  const { answer, hints, maxHeight, maxWidth, numCols, numRows, onClick } = props
  const [visible, setVisible] = useState(false)
  const maxItems = numCols * numRows

  useEffect(() => {
    setVisible(true)
  }, [])

  const items = hints.slice(0, maxItems).map((hint, idx) => <HintCircle hint={hint} key={idx} onClick={onClick} />)
  if (items.length < maxItems && answer !== undefined) {
    items.push(<HintCircle answer={answer} key="answer" onClick={onClick} />)
  }
  while (items.length < maxItems) items.push(<HintCircle key={items.length} />)

  const h = Math.max(maxHeight ?? 1, 1)
  const w = Math.max(maxWidth ?? 1, 1)
  const aspectRatio = numCols / numRows
  const maxGridHeight = maxWidth !== undefined ? (w + hintGridLayout.gap) / aspectRatio - hintGridLayout.gap : undefined
  const maxGridWidth = maxHeight !== undefined ? (h + hintGridLayout.gap) * aspectRatio - hintGridLayout.gap : undefined

  const hintGridStyle: CSSProperties = {
    maxHeight: maxGridHeight,
    maxWidth: maxGridWidth,
  }

  return (
    <HintGridElement data-cols={numCols} data-rows={numRows} data-show={visible} style={hintGridStyle}>
      {items}
    </HintGridElement>
  )
}
