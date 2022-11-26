import React, { useState } from 'react';
import {RGBColor, SketchPicker} from 'react-color'
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  .sketch-picker {
    width: 100%;
    margin: auto;
  }
`

export function ColourPicker() {
    const [ colour, setColour ] = useState({r: 100, g: 40, b: 120} as RGBColor)
    return (
        <Container>
            <SketchPicker
                width='auto'
                color={colour}
                onChange={color => setColour(color.rgb)}
            />
        </Container>
    )
}