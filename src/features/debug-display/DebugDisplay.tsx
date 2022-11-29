import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import styled from "styled-components";
import {AnyColor, toHex, toHSL, toHSB, toRGB} from "../../lib/colour/colourConversions";
import {selectPuzzleState, setMode} from "../../modules/puzzle/puzzleSlice";
import {useState} from "react";
import {hueDiff} from "../../lib/colour/colourMath";

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

export function DebugDisplay() {
    const { colour, previousGuesses } = useAppSelector(selectColourGuesserState)
    const { mode, target } = useAppSelector(selectPuzzleState)
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
                <label>Puzzle Mode:&nbsp;&nbsp;&nbsp;
                    <Toggle onClick={() => dispatch(setMode('rgb'))}>
                        {mode === 'rgb' ? '[' : ''}RGB{mode === 'rgb' ? ']' : ''}
                    </Toggle>&nbsp;
                    <Toggle onClick={() => dispatch(setMode('hsl'))}>
                        {mode === 'hsl' ? '[' : ''}HSL{mode === 'hsl' ? ']' : ''}
                    </Toggle>&nbsp;
                    <Toggle onClick={() => dispatch(setMode('hsb'))}>
                        {mode === 'hsb' ? '[' : ''}HSB{mode === 'hsb' ? ']' : ''}
                    </Toggle>
                </label>
                <br/><br/>
                <label>Target Colour</label>
                {describeColour(target)}
                <label>Selected Colour</label>
                {describeColour(colour)}
                <label>Previous Guesses</label>
                <ul style={{fontSize: 'xx-small'}}>
                    {
                        previousGuesses.map((guess: AnyColor, idx: number) => {
                            const rgbT = toRGB(target)
                            const hslT = toHSL(target)
                            const hsbT = toHSB(target)
                            const rgbG = toRGB(guess)
                            const hslG = toHSL(guess)
                            const hsbG = toHSB(guess)
                            const rgbDiffString = 'ΔRGB: ' +
                                `${rgbT.r - rgbG.r}, ${rgbT.g - rgbG.g}, ${rgbT.b - rgbG.b}`
                            const hslDiffString = 'ΔHSL: ' +
                                `${hueDiff(hslT.h, hslG.h)} ${hslT.s - hslG.s}% ${hslT.l - hslG.l}%`
                            const hsbDiffString = 'HSB: ' +
                                `${hueDiff(hsbT.h, hsbG.h)} ${hsbT.s - hsbG.s}% ${hsbT.b - hsbG.b}%`
                            let diffString = ''
                            switch (mode) {
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