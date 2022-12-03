import React, { ReactElement, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ScreenView, selectAppState, setActiveScreenView } from "../../../redux/app/appSlice";
import { generateRandomColour } from "../../../lib/colour/colourMath";
import { toNamed } from "../../../lib/colour/colourConversions";
import { setCurrentColour, setStartingColour } from "../../../redux/puzzle/puzzleSlice";
import { handleKeyDown, handleKeyUp } from "./keyPressHandlers";
import { getTheme } from "../../components/theme/themeRegistry";
import { Window } from "../../components/page/Window";
import { Header } from "../../components/page/Header";

export function App(): ReactElement {
  const { activeScreenView, theme } = useAppSelector(selectAppState)
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

  // set up callbacks
  function selectView(view: ScreenView): () => void {
    return function () { dispatch(setActiveScreenView(view)) }
  }

  return <ThemeProvider theme={getTheme(theme)}>
    <Window>
      <Header
        onClickLogo={selectView(ScreenView.main)}
        onClickHelp={selectView(ScreenView.help)}
        onClickPerson={selectView(ScreenView.user)}
        onClickSettings={selectView(ScreenView.settings)}
      />
      View: {activeScreenView}
    </Window>
  </ThemeProvider>
}
