import React from 'react';
import styled from "styled-components";
import {ColourPicker} from "./components/colour-picker/ColourPicker";

const Header = styled.h1`
  text-align: center;
`

const Main = styled.div`
  column-gap: 10px;
  display: grid;
  grid: 1fr / repeat(3, 1fr);
  margin: auto;
  width: 800px;
`

const Section = styled.div`
  border: 2px solid black;
  display: inline-block;
  left: 0;
  padding: 0 10px;
  right: 0;
  text-align: center;
`

const SectionHeader = styled.h4`
    margin: 10px 0;
`

const GuessButton = styled.button.attrs(props => ({
    type: 'button',
}))`
  background-color: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  display: inline-block;
  font-size: 1em;
  margin: 1em 0;
  padding: 0.25em 1em;
  width: 100%;
  //box-shadow: rgba(0, 0, 0, 0.15) 0 0 0 1px, rgba(0, 0, 0, 0.15) 0 8px 16px;
`

export function App() {
    return (
        <>
            <Header>Prismatic</Header>
            <Main>
                <Section>
                    <SectionHeader>Colour Picker</SectionHeader>
                    <ColourPicker/>
                    <GuessButton>Make a guess</GuessButton>
                </Section>
                <Section>
                    <SectionHeader>Response View</SectionHeader>
                </Section>
                <Section>
                    <SectionHeader>Debug Info</SectionHeader>
                    <p>Hello world</p>
                </Section>
            </Main>
        </>
    );
}
