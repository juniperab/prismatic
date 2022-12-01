import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import styled from "styled-components";
import {AnyColor, toHex, toHSL, toHSB, toRGB} from "../../lib/colour/colourConversions";
import {selectPuzzleState} from "../../modules/puzzle/puzzleSlice";
import {useState} from "react";
import {hueDiff} from "../../lib/colour/colourMath";
import {selectDebugState, setDisplayMode} from "./debugSlice";
import {loadPuzzleById} from "../../lib/puzzle/api/puzzle";
import {Hint} from "../../lib/puzzle/api/hint";

const DataView = styled.div`
  text-align: left;
  //height: 390px;
  overflow-y: scroll;
  font-family: monospace;
  font-size: x-small;
  label {
    font-weight: bold;
  }
  ul {
    padding-left: 2em;
  }
  li {
    list-style-type: '* ';
    vertical-align: text-bottom;
  }
`

const Toggle = styled.span`
  &:hover {
    text-decoration: underline;
  }
`

export function Debug() {
    const { currentColour } = useAppSelector(selectColourGuesserState)
    const { displayMode } = useAppSelector(selectDebugState)
    const { mode, precision, puzzleId, hints } = useAppSelector(selectPuzzleState)
    const puzzle = loadPuzzleById(puzzleId)
    const [ visible, setVisible ] = useState(false)
    const dispatch = useAppDispatch()

    function swatch(colour: AnyColor) {
        const hsl = toHSL(colour)
        const hex = toHex(colour)
        const swatchTextColour = hsl.l < 50 ? 'white' : 'black'
        return (
            <span className='swatch' style={{backgroundColor: hex, color: swatchTextColour}}>
                &nbsp;{hex}&nbsp;
            </span>
        )
    }

    function describeColour(colour: AnyColor) {
        const rgb = toRGB(colour)
        const hsl = toHSL(colour)
        const hsb = toHSB(colour)

        return (
            <ul>
                <li>Hex: {swatch(rgb)} RGB: {rgb.r}, {rgb.g}, {rgb.b}</li>
                <li>HSL/V: {hsl.h} {hsl.s}% {hsl.l}% / {hsb.h} {hsb.s}% {hsb.b}%</li>
            </ul>
        )
    }

    function renderDebugContent() {
        return (
            <>
                <label>Debug Mode:&nbsp;&nbsp;&nbsp;
                    <Toggle onClick={() => dispatch(setDisplayMode('rgb'))}>
                        {displayMode === 'rgb' ? '[' : ''}RGB{displayMode === 'rgb' ? ']' : ''}
                    </Toggle>&nbsp;
                    <Toggle onClick={() => dispatch(setDisplayMode('hsl'))}>
                        {displayMode === 'hsl' ? '[' : ''}HSL{displayMode === 'hsl' ? ']' : ''}
                    </Toggle>&nbsp;
                    <Toggle onClick={() => dispatch(setDisplayMode('hsb'))}>
                        {displayMode === 'hsb' ? '[' : ''}HSB{displayMode === 'hsb' ? ']' : ''}
                    </Toggle>
                </label>
                <br/><br/>
                <label>Puzzle Mode:&nbsp;&nbsp;&nbsp;
                    {mode === 'rgb' ? '*' : ''}RGB{mode === 'rgb' ? '*' : ''}&nbsp;
                    {mode === 'hsl' ? '*' : ''}HSL{mode === 'hsl' ? '*' : ''}&nbsp;
                    {mode === 'hsb' ? '*' : ''}HSB{mode === 'hsb' ? '*' : ''}
                </label>
                <br/><br/>
                <label>Answer Colour: '{puzzle.answerName}'</label>
                {describeColour(puzzle.answer)}
                <label>Precision: {precision}</label>
                <br/><br/>
                <label>Selected Colour</label>
                {describeColour(currentColour)}
                <label>Previous Guesses</label>
                <ul style={{fontSize: 'xx-small'}}>
                    {
                        hints.map((hint: Hint, idx: number) => {
                            const rgbT = toRGB(puzzle.answer)
                            const hslT = toHSL(puzzle.answer)
                            const hsbT = toHSB(puzzle.answer)
                            const rgbG = toRGB(hint.guessedColour)
                            const hslG = toHSL(hint.guessedColour)
                            const hsbG = toHSB(hint.guessedColour)
                            const rgbDiffString = 'ΔRGB: ' +
                                `${rgbT.r - rgbG.r}, ${rgbT.g - rgbG.g}, ${rgbT.b - rgbG.b}`
                            const hslDiffString = 'ΔHSL: ' +
                                `${hueDiff(hslT.h, hslG.h)} ${hslT.s - hslG.s}% ${hslT.l - hslG.l}%`
                            const hsbDiffString = 'HSB: ' +
                                `${hueDiff(hsbT.h, hsbG.h)} ${hsbT.s - hsbG.s}% ${hsbT.b - hsbG.b}%`
                            let diffString = ''
                            switch (displayMode) {
                                case 'rgb': diffString = rgbDiffString; break
                                case 'hsl': diffString = hslDiffString; break
                                case 'hsb': diffString = hsbDiffString; break
                            }
                            return (
                                <li key={idx}>
                                    {swatch(rgbG)} {diffString}
                                </li>
                            )
                        })
                    }
                </ul>
            </>
        )
    }

    return (
        <DataView>
            <div style={{textAlign: 'center'}}>
                <Toggle onClick={() => setVisible(true)}>
                    {visible ? '[' : ''}SHOW{visible ? ']' : ''}
                </Toggle>&nbsp;
                <Toggle onClick={() => setVisible(false)}>
                    {!visible ? '[' : ''}HIDE{!visible ? ']' : ''}
                </Toggle>
            </div>
            <br/>
            {visible && renderDebugContent()}
        </DataView>
    )
}