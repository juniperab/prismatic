import React, { ReactElement, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ModalType, selectAppState, setActiveModal } from "../../../redux/app/appSlice";
import { generateRandomColour } from "../../../lib/colour/colourMath";
import { toNamed } from "../../../lib/colour/colourConversions";
import { setCurrentColour, setStartingColour } from "../../../redux/puzzle/puzzleSlice";
import { handleKeyDown, handleKeyUp } from "./keyPressHandlers";
import { getTheme } from "../../components/theme/themeRegistry";
import { Window } from "../../components/page/Window";
import { Header } from "../../components/page/Header";
import { Footer } from "../../components/page/Footer";
import { Body } from "../../components/page/Body";
import { HelpModal } from "../../components/modal/HelpModal";
import { UserModal } from "../../components/modal/UserModal";
import { SettingsModal } from "../../components/modal/SettingsModal";

export function App(): ReactElement {
  const { theme } = useAppSelector(selectAppState)
  const dispatch = useAppDispatch()

  // initialize the colour picker with a random starting colour
  useEffect(() => {
    const startingColour = toNamed(generateRandomColour())
    dispatch(setStartingColour(startingColour))
    dispatch(setCurrentColour(startingColour))
  }, [dispatch])

  // listen for keyboard events
  const receiveKeyDown = (event: KeyboardEvent): void => {
    handleKeyDown(event, dispatch)
  }
  const receiveKeyUp = (event: KeyboardEvent): void => {
    handleKeyUp(event, dispatch)
  }
  useEffect(() => {
    document.addEventListener('keydown', receiveKeyDown)
    document.addEventListener('keyup', receiveKeyUp)
    return function cleanup() {
      document.removeEventListener('keydown', receiveKeyDown)
      document.removeEventListener('keyup', receiveKeyUp)
    }
  })

  // set up callbacks
  function openModal(modal: ModalType | undefined): () => void {
    return function () {
      dispatch(setActiveModal(modal))
    }
  }

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <Window>
        <Header
          onClickHelp={openModal(ModalType.help)}
          onClickPerson={openModal(ModalType.user)}
          onClickSettings={openModal(ModalType.settings)}
        />
        <Body>
          Hello World
        </Body>
        <Footer/>
      </Window>
      <HelpModal/>
      <UserModal/>
      <SettingsModal/>
    </ThemeProvider>
  )
}
