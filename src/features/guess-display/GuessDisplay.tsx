import styled from "styled-components";
import {useAppSelector} from "../../app/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import {AnyColor, hueDiff, rotateHue, toHex, toHSV} from "../../app/utils/colourMath";
import {CSSProperties} from "react";
import {selectPuzzleState} from "../../app/modules/puzzle/puzzleSlice";

const GuessList = styled.div`
  height: 360px;
  overflow-y: scroll;
`

const GuessBox = styled.div`
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

const HintBox = styled.div`
  border: 1px dotted black;
  background-color: transparent;
  text-align: center;

  display: inline-table;
  height: 100%;
  flex: none;
  flex-grow: 1;
  span {
    display: table-cell;
    vertical-align: middle;
  }
`

type HintColour = {label: string, colour: AnyColor} | undefined

/**
 * Generate hints about the target colour, across multiple dimensions of the colour space,
 * based on the colour that was guessed.
 *
 * For each hint dimension:
 *  - if the guess was too far away (based on a cutoff) from the target on that dimension, the hint will be black.
 *  - if the guess was exactly correct on that dimension, the hint will be white.
 *  - the closer the guess is to correct, the less saturated (more white) the hint will be.
 *
 * When all hints are white, the target colour will have been guessed exactly.
 *
 * @param guess     The guess that was made by the player
 * @param target    The colour that the player is trying to identify
 */
function getHints(guess: AnyColor, target: AnyColor): HintColour[] {
    const hsvG = toHSV(guess)
    const hsvT = toHSV(target)

    const hueCutoff = 90
    const hueDifference = hueDiff({from: hsvG.h, to: hsvT.h})
    const hueHintHue = rotateHue(hsvG.h, 90 * Math.sign(hueDifference))
    const hueHintSaturation = Math.min(Math.abs(hueDifference) / hueCutoff, 1) * 100
    const hueHintValue = Math.abs(hueDifference) > hueCutoff ? 0 : 100

    return [
        {label: '?', colour: guess},
        {label: 'H', colour: {h: hueHintHue, s: hueHintSaturation, v: hueHintValue}},
        undefined,
        undefined,
        undefined,
    ]
}

export function GuessDisplay() {
    const { previousGuesses } = useAppSelector(selectColourGuesserState)
    const { mode, target } = useAppSelector(selectPuzzleState)

    function renderGuessResult(guess: AnyColor, key: number) {
        const hints = getHints(guess, target)
        return <GuessBox key={key}>
            {
                hints.map((hint, idx) => {
                    let hintStyle: CSSProperties = {}
                    let hintText: string = ''
                    if (hint) {
                        hintStyle = {
                            backgroundColor: toHex(hint.colour)
                        }
                        hintText = hint.label
                    }
                    return (
                        <HintBox key={idx} style={hintStyle}>
                            <span>{hintText}</span>
                        </HintBox>
                    )
                })
            }
        </GuessBox>
    }

    return (
        <GuessList>
            {previousGuesses.map((guess, idx) => renderGuessResult(guess, idx))}
        </GuessList>
    )
}
