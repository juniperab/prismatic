import styled from "styled-components";
import {useAppSelector} from "../../app/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import {AnyColor, hueDiff, rotateHue, toHex, toHSV} from "../../app/utils/colourMath";
import {CSSProperties} from "react";
import {HintSpec, PuzzleMode, selectPuzzleState} from "../../app/modules/puzzle/puzzleSlice";

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
function getHintsHSV(guess: AnyColor, target: AnyColor, spec: HintSpec): HintColour[] {
    const hsvG = toHSV(guess)
    const hsvT = toHSV(target)

    // get a hint for the hue of the target colour
    function getHueHint() {
        // the absolute different between the hue of the guess and the hue of the target
        const diff = hueDiff({from: hsvG.h, to: hsvT.h})
        // the percentage of the cutoff distance that the hue of the guess lies away from the hue of the target.
        // N.B. 100% = the guess is at the cutoff
        const diffPct = Math.min(Math.abs(diff) / spec.hueCutoff, 1) * 100
        const hue = rotateHue(hsvG.h, spec.hueStep * Math.sign(diff))
        const saturation = diffPct
        const value = Math.abs(diff) > spec.hueCutoff ? 0 : 100
        return {label: 'H', colour: {h: hue, s: saturation, v: value}}
    }

    // get a hint for the saturation of the target colour
    function getSaturationHint() {
        // the absolute different between the saturation of the guess and the saturation of the target
        const diff = hsvT.s - hsvG.s
        // the percentage of the cutoff distance that the saturation of the guess lies away from the saturation
        // of the target. N.B. 100% = the guess is at the cutoff
        const diffPct = Math.min(Math.abs(diff) / spec.saturationCutoff, 1) * 100
        const hue = hsvG.h // use the hue of the guess
        const saturation = diffPct
        const value = diff < 0 ? 0 : 100 // 'Price is Right' rules
        return {label: 'S', colour: {h: hue, s: saturation, v: value}}
    }

    // get a hint for the value of the target colour
    function getValueHint() {
        // the absolute different between the value of the guess and the value of the target
        const diff = hsvT.v - hsvG.v
        // the percentage of the cutoff distance that the value of the guess lies away from the value of the target.
        // N.B. 100% = the guess is at the cutoff
        const diffPct = Math.min(Math.abs(diff) / spec.valueCutoff, 1) * 100
        const hue = hsvG.h // hue doesn't matter
        const saturation = 0 // hint will always be greyscale
        const value = diff > 0 ? 0 : (100 - diffPct / 4) // inverted 'Price is Right' rules, in [75% and 100%]
        return {label: 'V', colour: {h: hue, s: saturation, v: value}}
    }

    return [
        {label: '?', colour: guess},
        getHueHint(),
        getSaturationHint(),
        getValueHint(),
        undefined,
    ]
}

function getHints(mode: PuzzleMode, guess: AnyColor, target: AnyColor, spec: HintSpec) {
    switch (mode) {
        case "rgb": return [{label: '?', colour: guess}]
        case 'hsl': return [{label: '?', colour: guess}]
        case "hsv": return getHintsHSV(guess, target, spec)
    }
    throw new Error('invalid mode')
}

export function GuessDisplay() {
    const { previousGuesses } = useAppSelector(selectColourGuesserState)
    const { hintSpec, mode, target } = useAppSelector(selectPuzzleState)

    function renderGuessResult(guess: AnyColor, key: number) {
        const hints = getHints(mode, guess, target, hintSpec)
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
