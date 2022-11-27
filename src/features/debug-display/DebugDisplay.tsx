import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import styled from "styled-components";
import {RGBColor} from "react-color";
import {AnyColor, toHex, toHSL, toHSV, toRGB} from "../../app/utils/colourMath";
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
                        const rgbDiffString = `ΔRGB: ${rgbG.r - rgbT.r}, ${rgbG.g - rgbT.g}, ${rgbG.b - rgbT.b}`
                        const hslDiffString = `ΔHSL: ${hslG.h - hslT.h} ${hslG.s - hslT.s}% ${hslG.l - hslT.l}%`
                        const hsvDiffString = `ΔHSV: ${hsvG.h - hsvT.h} ${hsvG.s - hsvT.s}% ${hsvG.v - hsvT.v}%`
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