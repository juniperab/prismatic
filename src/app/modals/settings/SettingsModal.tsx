import React, { ReactElement } from 'react'
import { ModalType, selectAppState, setActiveModal, setTheme } from '../../../redux/app/appSlice'
import { Modal } from '../../../react/components/modal/Modal'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { OptionsOneLine } from '../../../react/components/options/OptionsOneLine'
import { _ModalBodySection as MBodySection } from '../../../react/components/modal/modalLayout'
import { ThemeName } from '../../../react/components/theme/theme'
import { titleCase } from 'title-case'
import { selectConfigState, setHintStyle } from '../../../redux/config/configSlice'
import { enumKeys } from '../../../lib/util/enumKeys'
import { HintStyle } from '../../../lib/puzzle/hint'

export function SettingsModal(): ReactElement | null {
  const { activeModal, theme: themeName } = useAppSelector(selectAppState)
  const { hintStyle } = useAppSelector(selectConfigState)
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
          options={enumKeys(ThemeName).map((k) => ThemeName[k])}
          optionFormatter={(opt) => titleCase(opt.toString())}
          selected={themeName}
        />
        <OptionsOneLine
          label={'Hint Style'}
          onSelect={(selectedOption) => dispatch(setHintStyle(selectedOption))}
          options={enumKeys(HintStyle).map((k) => HintStyle[k])}
          optionFormatter={(opt) => opt.toString().toUpperCase()}
          selected={hintStyle}
        />
        <p>
          Easy hints give you visual cues about the direction you'll need to move on the colour chooser. With hard
          hints, you'll need to figure out what to do from the colours of the hints alone.
        </p>
      </MBodySection>

      <MBodySection>
        <OptionsOneLine
          label={'Track Statistics'}
          onSelect={() => {}}
          options={['On', 'Off', 'Reset']}
          selected={'Off'}
          disabledOptions={['On', 'Reset']}
        />
        <p>Whether or not to track statistics, by means of a small cookie stored on your device.</p>
      </MBodySection>
    </Modal>
  )
}
