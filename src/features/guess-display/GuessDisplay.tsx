import styled from "styled-components";
import {useAppSelector} from "../../app/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import {RGBColor} from "react-color";
import {toHex} from "../../app/utils/colourMath";

const GuessList = styled.div`
  height: 360px;
  overflow-y: scroll;
`

const Guess = styled.div`
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
  div {
    display: inline-block;
    height: 100%;
    background-color: blue;
    flex: none;
    flex-grow: 1;
  }
`

export function GuessDisplay() {
    const { previousGuesses, target } = useAppSelector(selectColourGuesserState)

    const redHue = 0;
    const greenHue = 120;
    const blueHue = 240;

    function hint(hue: number, diff: number): string {
        const diffLuminance = (diff / 255 / 2 + 0.5) * 100

        const hsl =  {h: hue, s: 100, l: diffLuminance}
        return toHex(hsl)
    }

    function renderGuessResult(rgb: RGBColor, key?: number) {
        return <Guess key={key}>
            <div style={{backgroundColor: toHex(rgb), flexGrow: 2}}/>
            <div style={{backgroundColor: hint(redHue, target.r - rgb.r)}}/>
            <div style={{backgroundColor: hint(greenHue, target.g - rgb.g)}}/>
            <div style={{backgroundColor: hint(blueHue, target.b - rgb.b)}}/>
        </Guess>
    }

    return (
        <GuessList>
            {previousGuesses.map((guessRgb, idx) => renderGuessResult(guessRgb, idx))}
            <br/><br/>
            {renderGuessResult(target)}
        </GuessList>
    )
}
