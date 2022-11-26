import styled from "styled-components";
import {ColourPicker} from "../../components/colour-picker/ColourPicker";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectColour, selectColourGuesserState} from "./colourGuesserSlice";
import {RGBColor} from "react-color";
import {RGBToHex} from "../../app/utils/colourMath";

interface GuessButtonProps {
    textColour: string;
}

const GuessButton = styled.button.attrs(props => ({
    type: 'button',
}))<GuessButtonProps>`
  background-color: transparent;
  border-radius: 3px;
  border: 2px solid ${props => props.textColour};
  color: ${props => props.textColour};
  display: inline-block;
  font-size: 1em;
  margin: 1em 0 0 0;
  padding: 0.25em 1em;
  width: 100%;
  //box-shadow: rgba(0, 0, 0, 0.15) 0 0 0 1px, rgba(0, 0, 0, 0.15) 0 8px 16px;
`

export function ColourGuesser() {
    const { colour } = useAppSelector(selectColourGuesserState)
    const dispatch = useAppDispatch()

    console.log(RGBToHex(colour))

    return (
        <>
            <ColourPicker colour={colour} onSelect={(newColour) => dispatch(selectColour(newColour))}/>
            <GuessButton textColour='palevioletred' style={{backgroundColor: RGBToHex(colour)}}>Make a guess</GuessButton>
        </>
    )
}