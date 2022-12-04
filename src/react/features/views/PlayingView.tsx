import { ReactElement } from "react"
import { useAppSelector } from "../../../redux/hooks"
import { selectAppState, ViewType } from "../../../redux/app/appSlice"
import {
  PlayingViewLowerSection,
  PlayingViewOuter,
  PlayingViewSectionDivider,
  PlayingViewUpperSection
} from "./playingViewLayout"
import { HintGrid } from "../../components/hint/HintGrid"
import { selectPuzzleState } from "../../../redux/puzzle/puzzleSlice"

export function PlayingView(): ReactElement | null {
  const { activeView } = useAppSelector(selectAppState)
  const { hints } = useAppSelector(selectPuzzleState)

  if (activeView !== ViewType.playing) {
    return null
  }

  return <PlayingViewOuter>
    <PlayingViewUpperSection>
      <HintGrid hints={hints}/>
    </PlayingViewUpperSection>
    <PlayingViewSectionDivider/>
    <PlayingViewLowerSection>
      Colour Picker goes here
    </PlayingViewLowerSection>
  </PlayingViewOuter>
}
