import React from 'react';
import styled from "styled-components";
import {ColourPicker} from "./components/colour-picker/ColourPicker";
import {ColourGuesser} from "./features/colour-guesser/ColourGuesser";

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
  padding: 0 10px 20px 10px;
  right: 0;
  text-align: center;
`

const SectionHeader = styled.h4`
    margin: 10px 0;
`

export function App() {
    return (
        <>
            <Header>Prismatic</Header>
            <Main>
                <Section>
                    <SectionHeader>Colour Picker</SectionHeader>
                    <ColourGuesser/>
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
