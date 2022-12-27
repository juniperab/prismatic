import { ReactElement } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectAppState, ViewType } from '../../../redux/app/appSlice'
import {
  PlayingViewLowerSection,
  PlayingViewOuter,
  PlayingViewSectionDivider,
  PlayingViewUpperSection,
} from './playingViewLayout'
import { HintGrid } from '../../components/hint-grid/HintGrid'
import { makeGuess, selectPuzzleState, setCurrentColour } from '../../../redux/puzzle/puzzleSlice'
import { ColourChooser, NewColourCallback } from '../../components/colour-chooser/ColourChooser'
import { AnyColor } from '../../../lib/colour/colourConversions'
import { selectConfigState } from "../../../redux/config/configSlice";

export function PlayingView(): ReactElement | null {
  const { activeView } = useAppSelector(selectAppState)
  const { guessGridShape } = useAppSelector(selectConfigState)
  const { currentColour, guesses, hints } = useAppSelector(selectPuzzleState)
  const dispatch = useAppDispatch()

  if (activeView !== ViewType.playing) {
    return null
  }

  const receiveNewColour: NewColourCallback = (colour: AnyColor) => {
    dispatch(setCurrentColour(colour))
  }

  const receiveColourSubmit: () => void = () => {
    void dispatch(makeGuess(currentColour))
  }

  return (
    <PlayingViewOuter>
      <PlayingViewUpperSection>
        <HintGrid
          hints={hints}
          guesses={guesses}
          numCols={guessGridShape[0]}
          numRows={guessGridShape[1]}
        />
      </PlayingViewUpperSection>
      <PlayingViewSectionDivider />
      <PlayingViewLowerSection>
        <ColourChooser onChangeComplete={receiveNewColour} onSelect={receiveColourSubmit} colour={currentColour} />
      </PlayingViewLowerSection>
    </PlayingViewOuter>
  )
}
