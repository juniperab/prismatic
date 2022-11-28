import React, {useEffect, useState} from 'react';
import {RGBColor, SketchPicker} from 'react-color'
import styled from "styled-components";
import {AnyColor, toRGB} from "../../app/utils/colourMath";

export interface ColourPickerProps {
    colour: AnyColor,
    onSelect: (colour: AnyColor) => void;
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

    useEffect(() => {
        setActiveColour(toRGB(props.colour))
    }, [props])

    return (
        <Container>
            <SketchPicker
                disableAlpha={true}
                width='auto'
                color={activeColour}
                onChange={color => setActiveColour(color.rgb)}
                onChangeComplete={color => props.onSelect(color.rgb)}
            />
        </Container>
    )
}
