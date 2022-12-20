import { ReactElement } from 'react'
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { selectAppState, ViewType } from '../../../redux/app/appSlice'
import {
  PlayingViewLowerSection,
  PlayingViewOuter,
  PlayingViewSectionDivider,
  PlayingViewUpperSection,
} from './playingViewLayout'
import { HintGrid } from '../../components/hint-grid/HintGrid'
import { submitGuess, selectPuzzleState, setCurrentColour } from '../../../redux/puzzle/puzzleSlice'
import { ColourChooser, NewColourCallback } from "../../components/colour-chooser/ColourChooser"
import { AnyColor } from "../../../lib/colour/colourConversions"

export function PlayingView(): ReactElement | null {
  const { activeView } = useAppSelector(selectAppState)
  const { hints } = useAppSelector(selectPuzzleState)
  const dispatch = useAppDispatch()

  if (activeView !== ViewType.playing) {
    return null
  }

  const receiveNewColour: NewColourCallback = (colour: AnyColor) => {
    dispatch(setCurrentColour(colour))
  }

  const receiveColourSubmit: () => void = () => {
    console.log('receiveColourSubmit')
    void dispatch(submitGuess('foo'))
  }

  return (
    <PlayingViewOuter>
      <PlayingViewUpperSection>
        <HintGrid hints={hints} />
      </PlayingViewUpperSection>
      <PlayingViewSectionDivider />
      <PlayingViewLowerSection>
        <ColourChooser
          onChangeComplete={receiveNewColour}
          onSelect={receiveColourSubmit}
        />
      </PlayingViewLowerSection>
    </PlayingViewOuter>
  )
}
