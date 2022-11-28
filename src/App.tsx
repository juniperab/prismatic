import React from 'react';
import styled from "styled-components";
import {ColourGuesser} from "./features/colour-guesser/ColourGuesser";
import {GuessDisplay} from "./features/guess-display/GuessDisplay";
import {DebugDisplay} from "./features/debug-display/DebugDisplay";
import logoFile from './logo.jpg'

const Header = styled.h1`
  text-align: center;
`

const Main = styled.div`
  column-gap: 10px;
  display: grid;
  grid: 1fr / repeat(3, 1fr);
  margin: auto auto 30px auto;
  width: 800px;
`

const Section = styled.div`
  border: 2px solid black;
  display: inline-block;
  left: 0;
  padding: 0 10px 15px 10px;
  right: 0;
  text-align: center;
`

const SectionHeader = styled.h4`
    margin: 10px 0;
`

export function App() {
    return (
        <>
            <Header><img src={logoFile} width='24px'/> Prismatic</Header>
            <Main>
                <Section>
                    <SectionHeader>Colour Picker</SectionHeader>
                    <ColourGuesser/>
                </Section>
                <Section>
                    <SectionHeader>Response View</SectionHeader>
                    <GuessDisplay/>
                </Section>
                <Section>
                    <SectionHeader>Debug Info</SectionHeader>
                    <DebugDisplay/>
                </Section>
            </Main>
        </>
    );
}
