import React, { ReactElement, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { ModalType, selectAppState, setActiveModal } from '../../../redux/app/appSlice'
import { toNamed } from "../../../lib/colour/colourConversions";
import { setCurrentColour, setStartingColour } from '../../../redux/puzzle/puzzleSlice'
import { handleKeyDown, handleKeyUp } from './keyPressHandlers'
import { getTheme } from '../../components/theme/themeRegistry'
import { Window } from '../../components/page/Window'
import { Header } from '../../components/page/Header'
import { Footer } from '../../components/page/Footer'
import { Body } from '../../components/page/Body'
import { HelpModal } from '../modals/help/HelpModal'
import { UserModal } from '../modals/UserModal'
import { SettingsModal } from '../modals/SettingsModal'
import { PlayingView } from '../views/PlayingView'
import { handleWindowResize, updateExtraVh } from './resizeHandlers'
import { generateRandomColour } from "../../../lib/colour/colourMath";

export function App(): ReactElement {
  const { theme } = useAppSelector(selectAppState)
  const dispatch = useAppDispatch()

  // initialize the colour picker with a random starting colour
  useEffect(() => {
    const startingColour = toNamed(generateRandomColour())
    dispatch(setStartingColour(startingColour))
    dispatch(setCurrentColour(startingColour))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // listen for window resize
  const receiveResize = (): void => handleWindowResize()
  useEffect(() => {
    receiveResize() // fire once on app load
    window.addEventListener('resize', receiveResize)
    window.addEventListener('resize', updateExtraVh)
    return function cleanup() {
      window.removeEventListener('resize', receiveResize)
      window.removeEventListener('resize', updateExtraVh)
    }
  }, [])

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
          <PlayingView />
        </Body>
        <Footer />
      </Window>
      <HelpModal />
      <UserModal />
      <SettingsModal />
    </ThemeProvider>
  )
}
