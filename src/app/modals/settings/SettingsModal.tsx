import React, { ReactElement } from 'react'
import { ModalType, selectAppState, setActiveModal, setTheme } from '../../../redux/app/appSlice'
import { Modal } from '../../../react/components/modal/Modal'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { OptionsOneLine } from '../../../react/components/options/OptionsOneLine'
import { _ModalBodySection as MBodySection } from '../../../react/components/modal/modalLayout'
import { selectPuzzleState, setGuessMode } from '../../../redux/puzzle/puzzleSlice'
import { HintType } from '../../../lib/puzzle/hint'
import { ThemeName } from '../../../react/components/theme/theme'

export function SettingsModal(): ReactElement | null {
  const { activeModal, theme: themeName } = useAppSelector(selectAppState)
  const { guessMode } = useAppSelector(selectPuzzleState)
  const dispatch = useAppDispatch()

  if (activeModal !== ModalType.settings) {
    return null
  }

  return (
    <Modal title="Settings" onClickClose={() => dispatch(setActiveModal(undefined))}>
      <MBodySection>
        <OptionsOneLine
          label={'Theme'}
          onSelect={(selectedOption) => dispatch(setTheme(selectedOption))}
          options={[ThemeName.light, ThemeName.dark]}
          optionFormatter={(opt) => opt.toString().toUpperCase()}
          selected={themeName}
        />
        <p>The puzzle mode determines the type of hints that you will receive.</p>
      </MBodySection>

      <MBodySection>
        <OptionsOneLine
          label={'Puzzle Mode'}
          onSelect={(selectedOption) => dispatch(setGuessMode(selectedOption))}
          options={[HintType.HSB]}
          optionFormatter={(opt) => opt.toString().toUpperCase()}
          selected={guessMode}
        />
        <p>The puzzle mode determines the type of hints that you will receive.</p>
        <p>
          HSB hints will give you information about the Hue, Saturation, and Brightness of the secret colour. These are
          also the colour dimensions used by the colour chooser you use to select your guesses.
        </p>
      </MBodySection>
      <MBodySection>
        <OptionsOneLine
          label={'Track Statistics'}
          onSelect={() => {}}
          options={['On', 'Off', 'Reset']}
          selected={'Off'}
        />
        <p>Whether or not to track statistics, by means of a small cookie stored on your device.</p>
        <p>Choose 'reset' to erase all the statistics you have accumulated this far.</p>
        <p>Note: this feature is not implemented yet. 'Off' is the only option that can be selected.</p>
      </MBodySection>
    </Modal>
  )
}
