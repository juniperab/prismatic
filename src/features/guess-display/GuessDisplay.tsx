import styled from "styled-components";
import {useAppSelector} from "../../redux/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import {AnyColor, toHex, toHSL, toHSB, toKeyword} from "../../lib/colour/colourConversions";
import {CSSProperties} from "react";
import {HintSpec, PuzzleMode, selectPuzzleState} from "../../modules/puzzle/puzzleSlice";
import {hueDiff, rotateHue} from "../../lib/colour/colourMath";

const GuessList = styled.div`
  //height: 390px;
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

type HintColour = {label?: string, colour: AnyColor, match?: boolean} | undefined

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
 * @param guess         The guess that was made by the player
 * @param target        The colour that the player is trying to identify
 * @param spec          The specifications for how to generator hints
 * @param precision     The amount by which a guess may differ from the target and still be considered a match
 */
function getHintsHSB(guess: AnyColor, target: AnyColor, spec: HintSpec, precision: number): HintColour[] {
    const hsbG = toHSB(guess)
    const hsbT = toHSB(target)

    // get a hint for the hue of the target colour
    function getHueHint(): HintColour {
        // the absolute different between the hue of the guess and the hue of the target
        const diff = hueDiff(hsbT.h, hsbG.h)
        if (Math.abs(diff) <= precision) {
            return {label: 'H', colour: {h: hsbG.h, s: 0, b: 100}, match: true}
        }
        // the percentage of the cutoff distance that the hue of the guess lies away from the hue of the target.
        // N.B. 100% = the guess is at the cutoff
        const diffPct = Math.min(Math.abs(diff) / spec.hueCutoff, 1) * 100
        const hue = rotateHue(hsbG.h, spec.hueStep * Math.sign(diff))
        const saturation = diffPct
        const value = Math.abs(diff) > spec.hueCutoff ? 0 : 100
        return {label: 'H', colour: {h: hue, s: saturation, b: value}}
    }

    // get a hint for the saturation of the target colour
    function getSaturationHint(): HintColour {
        // the absolute different between the saturation of the guess and the saturation of the target
        const diff = hsbT.s - hsbG.s
        if (Math.abs(diff) <= precision) {
            return {label: 'S', colour: {h: hsbG.h, s: 0, b: 100}, match: true}
        }
        // the percentage of the cutoff distance that the saturation of the guess lies away from the saturation
        // of the target. N.B. 100% = the guess is at the cutoff
        const diffPct = Math.min(Math.abs(diff) / spec.saturationCutoff, 1) * 100
        const hue = hsbG.h // use the hue of the guess
        const saturation = diffPct
        const value = diff < 0 ? 0 : 100 // 'Price is Right' rules
        return {label: 'S', colour: {h: hue, s: saturation, b: value}}
    }

    // get a hint for the value of the target colour
    function getValueHint(): HintColour {
        // the absolute different between the value of the guess and the value of the target
        const diff = hsbT.b - hsbG.b
        if (Math.abs(diff) <= precision) {
            return {label: 'B', colour: {h: hsbG.h, s: 0, b: 100}, match: true}
        }
        // the percentage of the cutoff distance that the value of the guess lies away from the value of the target.
        // N.B. 100% = the guess is at the cutoff
        const diffPct = Math.min(Math.abs(diff) / spec.valueCutoff, 1) * 100
        const hue = hsbG.h // hue doesn't matter
        const saturation = 0 // hint will always be greyscale
        const value = diff > 0 ? 0 : (100 - (diffPct * spec.valueStep / 100)) // inverted 'Price is Right' rules
        return {label: 'B', colour: {h: hue, s: saturation, b: value}}
    }

    return [
        {colour: guess, match: true},
        getHueHint(),
        getSaturationHint(),
        getValueHint(),
    ]
}

function getHints(mode: PuzzleMode, guess: AnyColor, target: AnyColor, spec: HintSpec, precision: number) {
    switch (mode) {
        case "rgb": return [{label: 'rgb not implemented', colour: guess}]
        case 'hsl': return [{label: 'hsl not implemented', colour: guess}]
        case "hsb": return getHintsHSB(guess, target, spec, precision)
    }
    throw new Error('invalid mode')
}

export function GuessDisplay() {
    const { previousGuesses } = useAppSelector(selectColourGuesserState)
    const { hintSpec, mode, precision, target } = useAppSelector(selectPuzzleState)

    function renderGuessResult(guess: AnyColor, key: number) {
        let hints = getHints(mode, guess, target, hintSpec, precision)
        if (hints.every(hint => hint === undefined || hint.match)) {
            hints = [{label: toKeyword(target), colour: target, match: true}]
        }
        return <GuessBox key={key}>
            {
                hints.map((hint, idx) => {
                    let hintStyle: CSSProperties = {}
                    let hintText: JSX.Element | string = <>&nbsp;</>
                    if (hint) {
                        hintStyle = {
                            backgroundColor: toHex(hint.colour),
                            border: idx > 0 && hint.match ? '2px dashed black' : '1px dotted black',
                            fontWeight: idx > 0 && hint.match ? 'bold' : 'normal',
                            flexGrow: idx === 0 ? 2 : 1,
                            margin: hint.match ? 0 : '0 1px',
                        }
                        hintText = hint?.label ? hint.label : hintText
                        if (hint.label?.length !== undefined && hint.label.length > 1 && toHSL(hint.colour).l < 50) {
                            hintStyle.color = '#FFFFFF'
                        }
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
            {previousGuesses.map((guess: AnyColor, idx: number) => renderGuessResult(guess, idx))}
        </GuessList>
    )
}
