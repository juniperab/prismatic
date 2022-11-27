import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import styled from "styled-components";
import {RGBColor} from "react-color";
import {AnyColor, hueDiff, rotateHue, toHex, toHSL, toHSV, toRGB} from "../../app/utils/colourMath";
import {selectPuzzleState, setMode} from "../../app/modules/puzzle/puzzleSlice";

const DataView = styled.div`
  text-align: left;
  height: 360px;
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

    function describeColour(rgb: RGBColor) {
        const hsl = toHSL(rgb)
        const hsv = toHSV(rgb)

        return (
            <ul>
                <li>Hex: {swatch(rgb)} RGB: {rgb.r}, {rgb.g}, {rgb.b}</li>
                <li>HSL/V: {hsl.h} {hsl.s}% {hsl.l}% / {hsv.h} {hsv.s}% {hsv.v}%</li>
            </ul>
        )
    }

    return (
        <DataView>
            <label>Puzzle Mode:&nbsp;&nbsp;&nbsp;
                <Toggle onClick={() => dispatch(setMode('rgb'))}>
                    {mode === 'rgb' ? '[' : ''}RGB{mode === 'rgb' ? ']' : ''}
                </Toggle>&nbsp;
                <Toggle onClick={() => dispatch(setMode('hsl'))}>
                    {mode === 'hsl' ? '[' : ''}HSL{mode === 'hsl' ? ']' : ''}
                </Toggle>&nbsp;
                <Toggle onClick={() => dispatch(setMode('hsv'))}>
                    {mode === 'hsv' ? '[' : ''}HSV{mode === 'hsv' ? ']' : ''}
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
                    previousGuesses.map((guess, idx) => {
                        const rgbT = toRGB(target)
                        const hslT = toHSL(target)
                        const hsvT = toHSV(target)
                        const rgbG = toRGB(guess)
                        const hslG = toHSL(guess)
                        const hsvG = toHSV(guess)
                        const rgbDiffString = 'ΔRGB: ' +
                            `${rgbT.r - rgbG.r}, ${rgbT.g - rgbG.g}, ${rgbT.b - rgbG.b}`
                        const hslDiffString = 'ΔHSL: ' +
                            `${hueDiff({to: hslT.h, from: hslG.h})} ${hslT.s - hslG.s}% ${hslT.l - hslG.l}%`
                        const hsvDiffString = 'ΔHSV: ' +
                            `${hueDiff({to: hsvT.h, from: hsvG.h})} ${hsvT.s - hsvG.s}% ${hsvT.v - hsvG.v}%`
                        let diffString = ''
                        switch (mode) {
                            case 'rgb': diffString = rgbDiffString; break
                            case 'hsl': diffString = hslDiffString; break
                            case 'hsv': diffString = hsvDiffString; break
                        }
                        return (
                            <li key={idx}>
                                {swatch(rgbG)} {diffString}
                            </li>
                        )
                    })
                }
            </ul>
        </DataView>
    )
}