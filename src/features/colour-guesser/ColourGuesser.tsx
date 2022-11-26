import styled from "styled-components";
import {ColourPicker} from "../../components/colour-picker/ColourPicker";
import React, {CSSProperties, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectColour, selectColourGuesserState} from "./colourGuesserSlice";
import {RGBToHex, RGBToHSL} from "../../app/utils/colourMath";

const WHITE = {r: 255, g: 255, b: 255}
const BLACK = {r: 0, g: 0, b: 0}

const GuessButton = styled.button.attrs(props => ({
    type: 'button',
}))`
  background-color: transparent;
  border-radius: 3px;
  border: 2px solid;
  display: inline-block;
  font-size: 1em;
  margin: 1em 0 0 0;
  padding: 0.25em 1em;
  width: 100%;
`

export function ColourGuesser() {
    const [ hovering, setHovering ] = useState(false)
    const { colour } = useAppSelector(selectColourGuesserState)
    const dispatch = useAppDispatch()

    const lowLuminance = RGBToHSL(colour).l < 50
    let mainColour = colour
    let accentColour = lowLuminance ? WHITE : BLACK
    let addShadow = lowLuminance

    if (hovering) {
        mainColour = accentColour
        accentColour = colour
        addShadow = !addShadow
    }

    const buttonStyle: CSSProperties = {
        backgroundColor: RGBToHex(mainColour),
        borderColor: RGBToHex(accentColour),
        color: RGBToHex(accentColour),
        boxShadow: addShadow ? 'rgba(0, 0, 0, 0.15) 0 0 0 1px, rgba(0, 0, 0, 0.15) 0 8px 16px' : 'none',
    }

    return (
        <>
            <ColourPicker colour={mainColour} onSelect={(newColour) => dispatch(selectColour(newColour))}/>
            <GuessButton
                style={buttonStyle}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                Make a guess
            </GuessButton>
        </>
    )
}