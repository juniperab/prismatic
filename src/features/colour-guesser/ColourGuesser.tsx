import styled from "styled-components";
import {ColourPicker} from "../../components/colour-picker/ColourPicker";
import React from "react";

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

export function ColourGuesser() {
    return (
        <>
            <ColourPicker onSelect={console.log}/>
            <GuessButton>Make a guess</GuessButton>
        </>
    )
}