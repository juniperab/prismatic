import React, { ReactElement, useEffect, useRef } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { ColourGuesser } from '../colour-guesser/ColourGuesser'
import { HintDisplay } from '../hint-display/HintDisplay'
import { Debug } from '../debug/Debug'
import { Rules } from '../rules/Rules'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectAppState } from '../../../redux/app/appSlice'
import { generateRandomColour } from '../../../lib/colour/colourMath'
import { toNamed } from '../../../lib/colour/colourConversions'
import {
  setCurrentColour,
  setStartingColour,
} from '../../../redux/puzzle/puzzleSlice'
import { handleKeyDown, handleKeyUp } from "./keyPressHandlers";
import { getTheme } from "../../components/theme/themeRegistry";
import { AppWindow } from "../../components/page/AppWindow";
import { TopBar } from "../../components/page/TopBar";

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

export function App(): ReactElement {
  const { showHelp, theme } = useAppSelector(selectAppState)
  const dispatch = useAppDispatch()

  // initialize the colour picker with a random starting colour
  useEffect(() => {
    const startingColour = toNamed(generateRandomColour())
    dispatch(setStartingColour(startingColour))
    dispatch(setCurrentColour(startingColour))
  }, [dispatch])

  // listen for keyboard events
  const receiveKeyDown = (event: KeyboardEvent): void => { handleKeyDown(event, dispatch) }
  const receiveKeyUp = (event: KeyboardEvent): void => { handleKeyUp(event, dispatch) }
  useEffect(() => {
    document.addEventListener('keydown', receiveKeyDown)
    document.addEventListener('keyup', receiveKeyUp)
    return function cleanup() {
      document.removeEventListener('keydown', receiveKeyDown)
      document.removeEventListener('keyup', receiveKeyUp)
    }
  })
  return <ThemeProvider theme={getTheme(theme)}>
    <AppWindow>
      <TopBar/>
    </AppWindow>
  </ThemeProvider>

  // return (
  //   <>
  //     <Header>
  //       <img alt="logo" src={logoFile} width="24px" /> Prismatic
  //     </Header>
  //     {showHelp && <Rules />}
  //     <Main>
  //       <Section>
  //         <SectionHeader>Colour Picker</SectionHeader>
  //         <ColourGuesser />
  //       </Section>
  //       <Section>
  //         <SectionHeader>Response View</SectionHeader>
  //         <HintDisplay />
  //       </Section>
  //       <Section>
  //         <SectionHeader>Debug Info</SectionHeader>
  //         <Debug />
  //       </Section>
  //     </Main>
  //   </>
  // )
}
