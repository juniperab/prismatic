import styled from "styled-components";
import {ColourPicker} from "../../components/colour-picker/ColourPicker";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectColour, selectColourGuesserState} from "./colourGuesserSlice";
import {RGBColor} from "react-color";

const GuessButton = styled.button.attrs(props => ({
    type: 'button',
}))`
  background-color: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  display: inline-block;
  font-size: 1em;
  margin: 1em 0 0 0;
  padding: 0.25em 1em;
  width: 100%;
  //box-shadow: rgba(0, 0, 0, 0.15) 0 0 0 1px, rgba(0, 0, 0, 0.15) 0 8px 16px;
`

function cssRGB(colour: RGBColor): string {
    return `rgb(${colour.r}, ${colour.g}, ${colour.b})`
}

export function ColourGuesser() {
    const { colour } = useAppSelector(selectColourGuesserState)
    const dispatch = useAppDispatch()

    return (
        <>
            <ColourPicker colour={colour} onSelect={(newColour) => dispatch(selectColour(newColour))}/>
            <GuessButton style={{backgroundColor: cssRGB(colour)}}>Make a guess</GuessButton>
        </>
    )
}