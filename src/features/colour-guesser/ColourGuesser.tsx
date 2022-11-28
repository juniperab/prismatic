import * as _ from "lodash";
import styled from "styled-components";
import {ColourPicker} from "../../components/colour-picker/ColourPicker";
import React, {CSSProperties, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {guessColour, guessCurrentColour, selectColour, selectColourGuesserState} from "./colourGuesserSlice";
import {AnyColor, isColourMatch, toHex, toHSL, toRGB} from "../../app/utils/colourMath";
import {selectPuzzleState, startNewGame} from "../../app/modules/puzzle/puzzleSlice";

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

export function ColourGuesser() {
    const [ hovering, setHovering ] = useState(false)
    const [ clicking, setClicking ] = useState(false)
    const [ hoveringGU, setHoveringGU ] = useState(false)
    const [ clickingGU, setClickingGU ] = useState(false)
    const { colour, previousGuesses } = useAppSelector(selectColourGuesserState)
    const { precision, target } = useAppSelector(selectPuzzleState)
    const dispatch = useAppDispatch()

    const lowLuminance = toHSL(colour).l < 50
    let mainColour: AnyColor = colour
    let accentColour: AnyColor = lowLuminance ? WHITE : BLACK
    let addShadow = lowLuminance

    const gameOver = previousGuesses.length > 0 && isColourMatch(_.last(previousGuesses) as AnyColor, target, precision)
    if (gameOver) {
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
    let giveUpAddShadow = false;
    if (hoveringGU !== clickingGU) {
        giveUpMainColor = '#606060'
        giveUpAccentColour = '#E0E0E0'
        giveUpAddShadow = true;
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

    function renderButton() {
        if (gameOver) {
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
                    onClick={() => dispatch(guessCurrentColour())}
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
                    onClick={() => dispatch(guessColour(target))}
                >
                    Give Up
                </GiveUpButton>
            </>
        )

    }

    return (
        <>
            <ColourPicker
                colour={toRGB(colour)}
                onSelect={(newColour) => {console.log(newColour); dispatch(selectColour(newColour))}}
            />
            {renderButton()}
        </>
    )
}