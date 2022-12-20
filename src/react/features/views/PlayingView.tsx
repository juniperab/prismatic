import { ReactElement } from 'react'
import { useAppSelector } from '../../../redux/hooks'
import { selectAppState, ViewType } from '../../../redux/app/appSlice'
import {
  PlayingViewLowerSection,
  PlayingViewOuter,
  PlayingViewSectionDivider,
  PlayingViewUpperSection,
} from './playingViewLayout'
import { HintGrid } from '../../components/hint-grid/HintGrid'
import { submitGuess, selectPuzzleState, setCurrentColour } from '../../../redux/puzzle/puzzleSlice'
import { ColourChooser } from '../../components/colour-chooser/ColourChooser'

export function PlayingView(): ReactElement | null {
  const { activeView } = useAppSelector(selectAppState)
  const { hints } = useAppSelector(selectPuzzleState)

  if (activeView !== ViewType.playing) {
    return null
  }

  return (
    <PlayingViewOuter>
      <PlayingViewUpperSection>
        <HintGrid hints={hints} />
      </PlayingViewUpperSection>
      <PlayingViewSectionDivider />
      <PlayingViewLowerSection>
        <ColourChooser onChangeComplete={setCurrentColour} onSelect={submitGuess} />
      </PlayingViewLowerSection>
    </PlayingViewOuter>
  )
}
