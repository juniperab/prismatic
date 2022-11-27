import {useAppSelector} from "../../app/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import styled from "styled-components";
import {RGBColor} from "react-color";
import {toHex, toHSL} from "../../app/utils/colourMath";

const DataView = styled.div`
  text-align: left;
  height: 360px;
  overflow-y: scroll;
  font-family: monospace;
  font-size: smaller;
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

export function DebugDisplay() {
    const { colour, previousGuesses, target } = useAppSelector(selectColourGuesserState)

    function swatch(rgb: RGBColor) {
        const hsl = toHSL(rgb)
        const hex = toHex(rgb)
        const swatchTextColour = hsl.l < 50 ? 'white' : 'black'
        return (
            <span className='swatch' style={{backgroundColor: hex, color: swatchTextColour}}>
                &nbsp;{hex}&nbsp;
            </span>
        )
    }

    function describeColour(rgb: RGBColor) {
        const hsl = toHSL(rgb)

        return (
            <ul>
                <li>Hex: {swatch(rgb)}</li>
                <li>RGB: {rgb.r}, {rgb.g}, {rgb.b}</li>
                <li>HSL: {hsl.h}, {hsl.s}%, {hsl.l}%</li>
            </ul>
        )
    }

    return (
        <DataView>
            <label>Target Colour</label>
            {describeColour(target)}
            <label>Selected Colour</label>
            {describeColour(colour)}
            <label>Previous Guesses</label>
            <ul>
                {
                    previousGuesses.map((guess, idx) => {
                        return (
                            <li key={idx}>
                                {swatch(guess)} ~&nbsp;
                                {guess.r - target.r},
                                {guess.g - target.g},
                                {guess.b - target.b}
                            </li>
                        )
                    })
                }
            </ul>
        </DataView>
    )
}