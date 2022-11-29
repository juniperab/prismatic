import React, {useEffect, useState} from 'react';
import {RGBColor, SketchPicker} from 'react-color'
import styled from "styled-components";
import {AnyColor, toHex, toRGB} from "../../lib/colour/colourConversions";

export interface ColourPickerProps {
    colour: AnyColor,
    extraSwatches: AnyColor[],
    onSelect: (colour: AnyColor) => void;
}

const Container = styled.div`
  text-align: center;
  .sketch-picker {
    width: 100%;
    margin: auto;
  }
`

const standardPresetColours = [
    '#000000', '#ffffff', '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#9300ff'
]

export function ColourPicker(props: ColourPickerProps) {
    const [ activeColour, setActiveColour ] = useState(props.colour as RGBColor)

    useEffect(() => {
        setActiveColour(toRGB(props.colour))
    }, [props])

    const extraSwatches = props.extraSwatches.filter((item, idx) => {
        return props.extraSwatches.indexOf(item) === idx
    })
    let allSwatches = [
        ...standardPresetColours,
        ...(extraSwatches.slice(-8).map(colour => toHex(colour)))
    ]
    allSwatches = allSwatches.filter((item, idx) => allSwatches.indexOf(item) === idx)

    return (
        <Container>
            <SketchPicker
                disableAlpha={true}
                width='auto'
                color={activeColour}
                onChange={color => setActiveColour(color.rgb)}
                onChangeComplete={color => props.onSelect(color.rgb)}
                presetColors={allSwatches}
            />
        </Container>
    )
}
