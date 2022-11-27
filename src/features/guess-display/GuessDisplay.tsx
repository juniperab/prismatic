import styled from "styled-components";
import {useAppSelector} from "../../app/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import {HSLColor, RGBColor} from "react-color";
import {HSVColor, toHex, toHSV} from "../../app/utils/colourMath";

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

    // const redHue = 0;
    // const greenHue = 120;
    // const blueHue = 240;
    // function rotateHue(hue: number, n: number): number {
    //     return (hue + n) % 360
    // }
    // function hint(hue: number, diff: number): string {
    //     const d = (diff / 255 / 2 + 0.5) * 100
    //     const hsv =  {h: hue, s: d, v: 100}
    //     return toHex(hsv)
    // }

    function getHints(guess: HSVColor): {hintH: HSVColor, hintS: HSVColor, hintV: HSVColor} {
        const tgt = toHSV(target)

        const diffH = Math.abs(tgt.h - guess.h) * 100 / 255
        const diffS = Math.abs(tgt.s - guess.s)
        const diffV = Math.abs(tgt.v - guess.v)

        const hintH = {h: guess.h, s: diffH, v: 100}
        const hintS = {h: guess.h, s: diffS, v: 100}
        const hintV = {h: guess.h, s: diffV, v: 100}
        return {hintH, hintS, hintV}
    }

    function renderGuessResult(rgb: RGBColor, key?: number) {
        const hsv = toHSV(rgb)
        const hints = getHints(toHSV(rgb))
        return <Guess key={key}>
            <div style={{backgroundColor: toHex(rgb), flexGrow: 2}}/>
            <div style={{backgroundColor: toHex(hints.hintH)}}/>
            <div style={{backgroundColor: toHex(hints.hintS)}}/>
            <div style={{backgroundColor: toHex(hints.hintV)}}/>
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
