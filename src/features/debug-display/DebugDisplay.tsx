import {useAppSelector} from "../../app/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import {RGBToHex, RGBToHSL} from "../../app/utils/colourMath";
import styled from "styled-components";

const DataView = styled.div`
  text-align: left;
  height: 360px;
  overflow-y: scroll;
`

export function DebugDisplay() {
    const { colour, previousGuesses } = useAppSelector(selectColourGuesserState)
    const hsl = RGBToHSL(colour)

    return (
        <DataView>
            <label>Selected Colour</label>
            <ul>
                <li>Colour RGB: {colour.r}, {colour.g}, {colour.b}</li>
                <li>Colour HSL: {hsl.h}, {hsl.s}%, {hsl.l}%</li>
            </ul>
            <label>Previous Guesses</label>
            <ul>
                {
                    previousGuesses.map((guess, idx) => {
                        return (
                            <li key={idx}>{RGBToHex(guess)} / {guess.r}, {guess.g}, {guess.b}</li>
                        )
                    })
                }
            </ul>
        </DataView>
    )
}