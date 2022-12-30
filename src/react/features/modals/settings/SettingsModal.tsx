import React, { ReactElement } from "react";
import { ModalType, selectAppState, setActiveModal } from "../../../../redux/app/appSlice";
import { Modal } from "../../../components/modal/Modal";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { OptionsOneLine } from "../../../components/options/OptionsOneLine";
import { ModalBodySection } from "../../../components/modal/modalLayout";
import { selectPuzzleState, setGuessMode } from "../../../../redux/puzzle/puzzleSlice";
import { HintType } from "../../../../lib/puzzle/hint/hint";

export function SettingsModal(): ReactElement | null {
  const { activeModal } = useAppSelector(selectAppState)
  const { guessMode } = useAppSelector(selectPuzzleState)
  const dispatch = useAppDispatch()

  if (activeModal !== ModalType.settings) {
    return null
  }

  return (
    <Modal title="Settings" onClickClose={() => dispatch(setActiveModal(undefined))}>
      <ModalBodySection>
        <OptionsOneLine
          label={'Puzzle Mode'}
          onSelect={(selectedOption) => dispatch(setGuessMode(selectedOption))}
          options={[HintType.CMYK, HintType.HSB, HintType.RGB]}
          optionFormatter={(opt) => opt.toString().toUpperCase()}
          selected={guessMode}
        />
        <p>The puzzle mode determines the type of hints that you will receive.</p>
        <p>
          RGB hints will give you information about the Red, Green, and Blue components of the secret colour. This is
          the standard 'additive' colour model that is used by computer screens and television to create the perception
          of many colours by combining these three colours of light. From a basis of pure black (the absence of any
          light), these colours of light are added in varying degrees to create a light source that directly appears to
          be a certain colour.
        </p>
        <p>
          HSB hints will give you information about the Hue, Saturation, and Brightness of the secret colour. These are
          the colour dimensions used by the colour chooser you use to select your guesses. However, they do not
          correspond directly to a method of reproducing colours in the real world.
        </p>
        <p>
          CMYK hints will give you information the Cyan, Magenta, Yellow, and Black (K) of the secret colour. This is
          the standard 'subtractive' colour model used by printers to create the perception of many colours by combining
          these four colours of ink (or toner) on paper. From a basis of pure white (a blank sheet of paper), these
          colours of ink are applied they subtract their 'opposites' &ndash; the colours that they <i>do not</i>{' '}
          reflect.
        </p>
      </ModalBodySection>
      <ModalBodySection>
        <OptionsOneLine
          label={'Track Statistics'}
          onSelect={() => {}}
          options={['On', 'Off', 'Reset']}
          selected={'On'}
        />
        <p>Whether or not to track statistics, by means of a small cookie stored on your device.</p>
        <p>Choose 'reset' to erase all the statistics you have accumulated this far.</p>
      </ModalBodySection>
    </Modal>
  )
}
