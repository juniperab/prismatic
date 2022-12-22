import { CSSProperties, ReactElement } from "react";
import { HintRowCell, HintRowOuter } from './hintGridLayout'
import { Hint, HintItem, HintVisitor, HSBHint, visitHint } from "../../../lib/puzzle/hint/hint";
import { AnyColor, chooseMostContrastingColour, toCssColour } from "../../../lib/colour/colourConversions";

export interface HintGridRowProps {
  guess?: AnyColor | undefined,
  hint?: Hint | undefined,
  numCols: number,
}

function renderCell(
  key: number | string,
  colour: AnyColor | undefined,
  highlight: boolean,
  symbol: string,
): ReactElement {
  // TODO: source the contrasting colour options from the theme
  const contrastingColour = colour !== undefined
    ? toCssColour(chooseMostContrastingColour(colour, 'white', 'black'))
    : undefined
  const style: CSSProperties = {
    backgroundColor: colour !== undefined ? toCssColour(colour) : undefined,
    color: contrastingColour,
    borderColor: contrastingColour,
  }
  return <HintRowCell
    data-highlight={highlight}
    key={key}
    style={style}
  >
    {symbol}
  </HintRowCell>
}

function renderHintItemCell(symbol: string, hintItem: HintItem | undefined): ReactElement {
  if (hintItem === undefined) return renderCell(symbol, 'black', false, symbol)
  return renderCell(symbol, hintItem.colour, false, symbol)
}

function renderHintCellsHSB(hint: HSBHint): ReactElement[] {
  return [
    renderCell('guess', hint.guessedColour, false, ''),
    renderHintItemCell('H', hint.hue),
    renderHintItemCell('S', hint.saturation),
    renderHintItemCell('B', hint.brightness),
  ]
}

const renderCellsHintVisitor: HintVisitor<ReactElement[]> = {
  rgb: () => [],
  hsl: () => [],
  hsb: hint => renderHintCellsHSB(hint)
}

export function HintGridRow(props: HintGridRowProps): ReactElement {
  const { guess, hint, numCols } = props

  // fill the row with blank cells
  const cells = Array(numCols)
    .fill(0)
    .map((_, idx) => renderCell(idx, undefined, false, ''))

  if (hint !== undefined) {
    const hintCells = visitHint(hint, renderCellsHintVisitor)
    for (let i = 0; i < cells.length && i < hintCells.length; i++) {
      cells[i] = hintCells[i]
    }
  } else if (guess !== undefined) {
    cells[0] = renderCell('guess', guess, false, '')
  }

  return <HintRowOuter data-cols={numCols}>{cells}</HintRowOuter>
}
