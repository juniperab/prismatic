import React, { useState } from 'react';
import {RGBColor, SketchPicker} from 'react-color'
import styled from "styled-components";

export interface ColourPickerProps {
    colour: RGBColor,
    onSelect: (colour: RGBColor) => void;
}

const Container = styled.div`
  text-align: center;
  .sketch-picker {
    width: 100%;
    margin: auto;
  }
`

export function ColourPicker(props: ColourPickerProps) {
    const [ activeColour, setActiveColour ] = useState(props.colour as RGBColor)

    return (
        <Container>
            <SketchPicker
                width='auto'
                color={activeColour}
                onChange={color => setActiveColour(color.rgb)}
                onChangeComplete={color => props.onSelect(color.rgb)}
            />
        </Container>
    )
}
