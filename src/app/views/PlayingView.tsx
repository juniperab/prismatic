import React, { CSSProperties, ReactElement } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectAppState, ViewType } from '../../redux/app/appSlice'
import {
  _PlayingViewSectionLower as PVSectionLower,
  _PlayingView as PlayingViewElement,
  _PlayingViewSectionUpper as PVSectionUpper,
  playingViewLayout,
  _PlayingViewSectionLowerOverlay as PVSLOverlay,
  _PlayingViewSectionLowerOverlaySection as PVSLOverlaySection,
} from './playingViewLayout'
import { HintGrid } from '../hint-display/HintGrid'
import { makeGuess, selectPuzzleState, setCurrentColour } from '../../redux/puzzle/puzzleSlice'
import { ColourChooser, NewColourCallback } from '../../react/components/colour-chooser/ColourChooser'
import { selectConfigState } from '../../redux/config/configSlice'
import { useResizeDetector } from 'react-resize-detector'
import { hintGridLayout } from '../hint-display/hintGridLayout'
import { AnyColour } from '../../lib/colour/colours'
import { mostContrasting, toCssColour } from '../../lib/colour/colourConversions'
import { useTheme } from 'styled-components'
import { Theme } from '../../theme/theme'
import { Icon } from '../../theme/elements/Icon'
import { H1 } from '../../theme/elements/H1'
import { SpanClickable } from '../../theme/elements/Span'
import { restartWithNewPuzzle } from '../../redux/app/appActions'

export function PlayingView(): ReactElement | null {
  const { activeView } = useAppSelector(selectAppState)
  const { guessGridShape, hintStyle } = useAppSelector(selectConfigState)
  const { answer, currentColour, gaveUp, hints } = useAppSelector(selectPuzzleState)
  const { width, height, ref } = useResizeDetector()
  const theme = useTheme() as Theme
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

  const answerView: ReactElement | undefined = ((): ReactElement | undefined => {
    if (answer === undefined) return undefined
    const style: CSSProperties = {
      backgroundColor: toCssColour(answer),
      color: toCssColour(mostContrasting(answer, theme.colours.appText, ...theme.colours.appTextAlt)),
    }
    return (
      <PVSLOverlay style={style}>
        <PVSLOverlaySection>
          <Icon color={style.color}>{gaveUp ? <theme.icons.pottedPlant.svg /> : <theme.icons.tada.svg />}</Icon>
        </PVSLOverlaySection>
        <PVSLOverlaySection>
          <div>
            <H1>{answer.name}</H1>
          </div>
          <div>
            <p>
              <SpanClickable onClick={() => dispatch(restartWithNewPuzzle())}>New Game?</SpanClickable>
            </p>
          </div>
        </PVSLOverlaySection>
      </PVSLOverlay>
    )
  })()

  const colourChooser: ReactElement | undefined = ((): ReactElement | undefined => {
    if (answerView !== undefined) return undefined
    return (
      <ColourChooser
        onChangeComplete={receiveNewColour}
        onSelect={receiveColourSubmit}
        colour={currentColour}
        disabled={answer !== undefined || hints.length >= maxHints}
      />
    )
  })()

  return (
    <PlayingViewElement ref={ref}>
      <PVSectionUpper style={styleUpper}>
        <HintGrid
          answer={answer}
          hints={hints}
          hintStyle={hintStyle}
          maxHeight={upperHeight}
          maxWidth={w}
          numCols={guessGridShape[0]}
          numRows={guessGridShape[1]}
          onClick={(hint) => dispatch(setCurrentColour(hint.guessedColour))}
        />
      </PVSectionUpper>
      <PVSectionLower style={styleLower}>
        {colourChooser}
        {answerView}
      </PVSectionLower>
    </PlayingViewElement>
  )
}
