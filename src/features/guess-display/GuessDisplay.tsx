import styled from "styled-components";
import {useAppSelector} from "../../app/hooks";
import {selectColourGuesserState} from "../colour-guesser/colourGuesserSlice";
import {HSLColor, RGBColor} from "react-color";
import {AnyColor, HSVColor, toHex, toHSV} from "../../app/utils/colourMath";
import {CSSProperties} from "react";

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

type HintColour = AnyColor | undefined

export function GuessDisplay() {
    const { previousGuesses, target } = useAppSelector(selectColourGuesserState)

    function getHints(guess: AnyColor): HintColour[] {
        const hsvG = toHSV(guess)
        const hsvT = toHSV(target)

        const diffH = Math.abs(hsvT.h - hsvG.h) * 100 / 255
        const diffS = Math.abs(hsvT.s - hsvG.s)
        const diffV = Math.abs(hsvT.v - hsvG.v)

        const a = {h: hsvG.h, s: diffH, v: 100}
        const b = {h: hsvG.h, s: diffS, v: 100}
        const c = {h: hsvG.h, s: diffV, v: 100}
        const d = {h: 100, s: 100, v: 100}
        return [a, b, c, d, a]
    }

    function renderGuessResult(guess: AnyColor, key?: number) {
        const hints = getHints(guess)
        return <GuessBox key={key}>
            {
                hints.map((hint, idx) => {
                    let hintStyle: CSSProperties = {}
                    if (hint) {
                        hintStyle = {
                            backgroundColor: toHex(hint)
                        }
                    }
                    return (
                        <HintBox key={idx} style={hintStyle}>
                            <span>{idx}</span>
                        </HintBox>
                    )
                })
            }
        </GuessBox>
    }

    return (
        <GuessList>
            {previousGuesses.map((guessRgb, idx) => renderGuessResult(guessRgb, idx))}
        </GuessList>
    )
}
