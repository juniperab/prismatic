import React, {useEffect} from 'react';
import styled from "styled-components";
import {ColourGuesser} from "./features/colour-guesser/ColourGuesser";
import {HintDisplay} from "./features/hint-display/HintDisplay";
import {Debug} from "./features/debug/Debug";
import logoFile from './logo.jpg'
import {Rules} from "./features/rules/Rules";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {selectAppState} from "./modules/app/appSlice";
import {generateRandomColour} from "./lib/colour/colourMath";
import {toNamed} from "./lib/colour/colourConversions";
import {setCurrentColour, setStartingColour} from "./features/colour-guesser/colourGuesserSlice";

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
    const { showHelp } = useAppSelector(selectAppState)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const startingColour = toNamed(generateRandomColour())
        dispatch(setStartingColour(startingColour))
        dispatch(setCurrentColour(startingColour))
    },[dispatch]);

    return (
        <>
            <Header><img alt='logo' src={logoFile} width='24px'/> Prismatic</Header>
            {showHelp && <Rules/>}
            <Main>
                <Section>
                    <SectionHeader>Colour Picker</SectionHeader>
                    <ColourGuesser/>
                </Section>
                <Section>
                    <SectionHeader>Response View</SectionHeader>
                    <HintDisplay/>
                </Section>
                <Section>
                    <SectionHeader>Debug Info</SectionHeader>
                    <Debug/>
                </Section>
            </Main>
        </>
    );
}
