import { SketchPicker } from 'react-color'
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  .div {
    margin: auto;
  }
`

export function ColourPicker() {
    return (
        <Container>
            <SketchPicker/>
        </Container>
    )

}