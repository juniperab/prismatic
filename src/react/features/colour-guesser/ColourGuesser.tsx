import styled from 'styled-components'
import { ColourPicker } from '../../components/colour-picker/ColourPicker'
import React, { CSSProperties, ReactElement, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { AnyColor, toHex, toHSL, toRGB } from '../../../lib/colour/colourConversions'
import {
  getNextHint,
  giveUp,
  selectPuzzleState,
  setCurrentColour,
  startNewGame,
} from '../../../redux/puzzle/puzzleSlice'

const WHITE = '#FFFFFF'
const BLACK = '#000000'

const GuessButton = styled.button.attrs(() => ({
  type: 'button',
}))`
  background-color: transparent;
  border-radius: 3px;
  border: 2px solid;
  display: inline-block;
  font-size: 1em;
  margin: 1em 0 0 0;
  padding: 0.25em 1em;
  width: 100%;
`

const NewGameButton = styled(GuessButton)`
  border: 3px dashed;
  font-weight: bold;
`

const GiveUpButton = styled(GuessButton)``

export function ColourGuesser(): ReactElement {
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hoveringGU, setHoveringGU] = useState(false)
  const [clickingGU, setClickingGU] = useState(false)
  const { answerName, currentColour } = useAppSelector(selectPuzzleState)
  const dispatch = useAppDispatch()

  const lowLuminance = toHSL(currentColour).l < 50
  let mainColour: AnyColor = currentColour
  let accentColour: AnyColor = lowLuminance ? WHITE : BLACK
  let addShadow = lowLuminance

  if (answerName !== undefined) {
    mainColour = '#FFFFFF'
    accentColour = '#000000'
    addShadow = true
  }

  if (hovering !== clicking) {
    const tmpColour = mainColour
    mainColour = accentColour
    accentColour = tmpColour
    addShadow = !addShadow
  }

  let giveUpMainColor: AnyColor = '#E0E0E0'
  let giveUpAccentColour: AnyColor = '#606060'
  let giveUpAddShadow = false
  if (hoveringGU !== clickingGU) {
    giveUpMainColor = '#606060'
    giveUpAccentColour = '#E0E0E0'
    giveUpAddShadow = true
  }

  const buttonStyle: CSSProperties = {
    backgroundColor: toHex(mainColour),
    borderColor: toHex(accentColour),
    color: toHex(accentColour),
    boxShadow: addShadow ? 'rgba(0, 0, 0, 0.15) 0 0 0 1px, rgba(0, 0, 0, 0.15) 0 8px 16px' : 'none',
  }
  const giveUpStyle: CSSProperties = {
    backgroundColor: toHex(giveUpMainColor),
    borderColor: toHex(giveUpAccentColour),
    color: toHex(giveUpAccentColour),
    boxShadow: giveUpAddShadow ? 'rgba(0, 0, 0, 0.15) 0 0 0 1px, rgba(0, 0, 0, 0.15) 0 8px 16px' : 'none',
  }

  function renderButton(): ReactElement {
    if (answerName !== undefined) {
      // TODO: new game button does not work
      return (
        <NewGameButton
          style={buttonStyle}
          onMouseOver={() => setHovering(true)}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseDown={() => setClicking(true)}
          onMouseUp={() => setClicking(false)}
          onClick={() => dispatch(startNewGame())}
        >
          New Game
        </NewGameButton>
      )
    }
    return (
      <>
        <GuessButton
          style={buttonStyle}
          onMouseOver={() => setHovering(true)}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseDown={() => setClicking(true)}
          onMouseUp={() => setClicking(false)}
          onClick={() => dispatch(getNextHint())}
        >
          Make a guess
        </GuessButton>
        <GiveUpButton
          style={giveUpStyle}
          onMouseOver={() => setHoveringGU(true)}
          onMouseEnter={() => setHoveringGU(true)}
          onMouseLeave={() => setHoveringGU(false)}
          onMouseDown={() => setClickingGU(true)}
          onMouseUp={() => setClickingGU(false)}
          onClick={() => dispatch(giveUp())}
        >
          Give Up
        </GiveUpButton>
      </>
    )
  }

  // <HelpLink onClick={() => dispatch(setHelpVisible(true))}>
  //   How to play
  // </HelpLink>
  return (
    <>
      <ColourPicker
        currentColour={toRGB(currentColour)}
        onSelect={(newColour) => dispatch(setCurrentColour(newColour))}
      />
      {renderButton()}
    </>
  )
}
