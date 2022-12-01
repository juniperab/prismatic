import styled from 'styled-components'
import { useAppSelector } from '../../../redux/hooks'
import { NamedColor, toHex, toHSL } from '../../../lib/colour/colourConversions'
import { CSSProperties, ReactElement } from 'react'
import { selectPuzzleState } from '../../../redux/puzzle/puzzleSlice'
import {
  Hint,
  HintItem,
  HintVisitor,
  visitHint
} from '../../../lib/puzzle/hint/hint'

const HintList = styled.div`
  //height: 390px;
  overflow-y: scroll;
`

const HintBox = styled.div`
  height: 25px;
  width: auto;
  margin: 10px;
  padding: 5px;
  border: 1px solid black;
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;
  align-items: center;
  gap: 10px;
`

const HintItemBox = styled.div`
  background-color: transparent;
  border: 1px dotted black;
  display: inline-table;
  flex: auto;
  height: 100%;
  margin: 1px;
  text-align: center;
  span {
    display: table-cell;
    vertical-align: middle;
  }
`

const GuessItemBox = styled(HintItemBox)`
  flex-grow: 2;
`

const NoHintItemBox = styled(HintItemBox)`
  background-color: black;
`

const MatchingHintItemBox = styled(HintItemBox)`
  background-color: white;
  border: 2px dashed black;
  font-weight: bold;
  margin: 0;
`

function renderHintItem (hintItem: HintItem | undefined, name: string): ReactElement {
  if (hintItem == null) return <NoHintItemBox key={name}><span>&nbsp;</span></NoHintItemBox>
  const style: CSSProperties = {
    backgroundColor: toHex(hintItem.colour),
    color: toHSL(hintItem.colour).l >= 50 ? '#000000' : '#FFFFFF',
    border: hintItem.match ? '2px dashed black' : undefined
  }
  return <HintItemBox key={name} style={style}><span>{name}</span></HintItemBox>
}

function renderHint (hint: Hint, idx: number): ReactElement {
  const visitor: HintVisitor<Array<[string, (HintItem | undefined)]>> = {
    rgb: h => [['R', h.red], ['G', h.green], ['B', h.blue]],
    hsl: h => [['H', h.hue], ['S', h.saturation], ['L', h.luminance]],
    hsb: h => [['H', h.hue], ['S', h.saturation], ['B', h.brightness]]
  }
  const guessItemStyle: CSSProperties = {
    backgroundColor: toHex(hint.guessedColour),
    color: toHSL(hint.guessedColour).l >= 50 ? '#000000' : '#FFFFFF'
  }
  return <HintBox key={idx}>
        <GuessItemBox style={guessItemStyle}>&nbsp;</GuessItemBox>
        {visitHint(hint, visitor).map(h => renderHintItem(h[1], h[0]))}
    </HintBox>
}

function renderAnswer (answerName: NamedColor | undefined, gaveUp: boolean): ReactElement | undefined {
  if (answerName === undefined) return
  const style: CSSProperties = {
    backgroundColor: toHex(answerName),
    color: toHSL(answerName).l >= 50 ? '#000000' : '#FFFFFF'
  }
  if (gaveUp) {
    style.borderColor = 'red'
  }
  return <HintBox><MatchingHintItemBox style={style}><span>{answerName}</span></MatchingHintItemBox></HintBox>
}

export function HintDisplay (): ReactElement {
  const { hints, answerName, gaveUp } = useAppSelector(selectPuzzleState)
  return <HintList>
        {hints.map((hint: Hint, idx: number) => renderHint(hint, idx))}
        {renderAnswer(answerName, gaveUp)}
    </HintList>
}
