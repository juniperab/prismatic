import { CSSProperties, ReactElement } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectAppState, ViewType } from '../../../redux/app/appSlice'
import {
  _PlayingViewSectionLower as PVSectionLower,
  _PlayingView as PlayingViewElement,
  _PlayingViewSectionUpper as PVSectionUpper,
  playingViewLayout,
} from './playingViewLayout'
import { HintGrid } from '../../components/hint-grid/HintGrid'
import { makeGuess, selectPuzzleState, setCurrentColour } from '../../../redux/puzzle/puzzleSlice'
import { ColourChooser, NewColourCallback } from '../../components/colour-chooser/ColourChooser'
import { selectConfigState } from '../../../redux/config/configSlice'
import { useResizeDetector } from 'react-resize-detector'
import { hintGridLayout } from '../../components/hint-grid/hintGridLayout'
import { AnyColour } from "../../../lib/colour/colours";

export function PlayingView(): ReactElement | null {
  const { activeView } = useAppSelector(selectAppState)
  const { guessGridShape } = useAppSelector(selectConfigState)
  const { answerName, currentColour, hints } = useAppSelector(selectPuzzleState)
  const { width, height, ref } = useResizeDetector()
  const dispatch = useAppDispatch()

  if (activeView !== ViewType.playing) {
    return null
  }

  const receiveNewColour: NewColourCallback = (colour: AnyColour) => {
    dispatch(setCurrentColour(colour))
  }

  const receiveColourSubmit: () => void = () => {
    void dispatch(makeGuess(currentColour))
  }

  const h = Math.max(height ?? 1, 1)
  const w = Math.max(width ?? 1, 1)
  const aspectRatio = guessGridShape[0] / guessGridShape[1] // width / height
  const maxHints = guessGridShape[0] * guessGridShape[1]
  const upperHeight = Math.min(
    (w + hintGridLayout.gap) / aspectRatio - hintGridLayout.gap,
    h - playingViewLayout.lower.minHeight - playingViewLayout.gap
  )
  const lowerHeight = Math.max(playingViewLayout.lower.minHeight, h - upperHeight - playingViewLayout.gap)
  const styleUpper: CSSProperties = {
    height: upperHeight,
  }
  const styleLower: CSSProperties = {
    height: lowerHeight,
    marginTop: playingViewLayout.gap,
  }

  return (
    <PlayingViewElement ref={ref}>
      <PVSectionUpper style={styleUpper}>
        <HintGrid
          answer={answerName}
          hints={hints}
          maxHeight={upperHeight}
          maxWidth={w}
          numCols={guessGridShape[0]}
          numRows={guessGridShape[1]}
          onClick={(hint) => dispatch(setCurrentColour(hint.guessedColour))}
        />
      </PVSectionUpper>
      <PVSectionLower style={styleLower}>
        <ColourChooser
          onChangeComplete={receiveNewColour}
          onSelect={receiveColourSubmit}
          colour={currentColour}
          disabled={answerName !== undefined || hints.length >= maxHints}
        />
      </PVSectionLower>
    </PlayingViewElement>
  )
}
