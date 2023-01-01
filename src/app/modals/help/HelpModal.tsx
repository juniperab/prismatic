import React, { ReactElement } from 'react'
import { ModalType, selectAppState, setActiveModal } from '../../../../redux/app/appSlice'
import { Modal } from '../../../components/modal/Modal'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import {
  _ModalBodySection as MBSection,
  _ModalBodySectionTitle as MBSectionTitle,
} from '../../../components/modal/modalLayout'
import { BrowserView, MobileView } from 'react-device-detect'

export function HelpModal(): ReactElement | null {
  const { activeModal } = useAppSelector(selectAppState)
  const dispatch = useAppDispatch()

  if (activeModal !== ModalType.help) {
    return null
  }

  return (
    <Modal title="How to Play" onClickClose={() => dispatch(setActiveModal(undefined))}>
      <MBSection>
        <p>In Prismatic, you guess colours to gather information about a secret colour.</p>
        <p>
          Use the colour chooser at the bottom of your screen to select your guesses. Tap the centre circle twice to
          register your guess.
        </p>
        <p>
          Hints will help you find the secret colour. Your guess appears at the centre (tap it to take the colour
          chooser back to that guess). The colour at the edge shows the way toward the secret colour, but you will only
          be able to see some of the information you need depending on how close your guess is on each colour dimension
          (see below). And, if you're too far away, you may get no information about a dimension at all.
        </p>
        <p>
          The right and left edges guide you toward the correct saturation. The top and bottom edges guide you toward
          the correct brightness. The colour that you see all around the outer edge guides you toward the correct hue.
          (Beware, if you did not get any hint about the saturation, you will also not be able to see any hint you may
          have gotten about the hue.)
        </p>
      </MBSection>
      <MBSection>
        <MBSectionTitle>The Hue-Saturation-Brightness Colourspace</MBSectionTitle>
        <p>The chooser allows you navigate the Hue-Saturation-Brightness colour space.</p>
        <MobileView>
          <p>
            On a mobile device:
            <ul>
              <li>slide left, right, up, and down with one finger to change saturation and brightness.</li>
              <li>Use two fingers to rotate the area to change the hue.</li>
              <li>
                Pinch with two fingers to zoom in and out. This will allow you finer-grained control over the colour you
                are selecting.
              </li>
            </ul>
          </p>
        </MobileView>
        <BrowserView>
          <p>
            On a desktop device:
            <ul>
              <li>Drag left, right, up, and down to change saturation and brightness.</li>
              <li>Hold the 'alt' key while dragging left or right change the hue.</li>
              <li>
                Hold the 'alt' key while dragging up or down to zoom in or out. This will allow you finer-grained
                control over the colour you are selecting.
              </li>
            </ul>
          </p>
        </BrowserView>
        <p>
          The 'hue' of a colour is basically where it lies on the rainbow, from red to purple and back to red again.
        </p>
        <p>
          The 'saturation' of a colour is basically how 'colourful' it is. A colour with 0% saturation will be white,
          black, or some shade of grey. A colour with 100% saturation will be vibrant, and will clearly show its hue
          (provided it is bright enough.)
        </p>
        <p>
          The 'brightness' (sometimes also called 'value') of a colour is basically how much light it emits (on your
          screen) or reflects (on a piece of paper). A colour with 0% brightness will be black, no matter what hue and
          saturation it has. A colour with 100% brightness will be clearly visible.
        </p>
      </MBSection>
    </Modal>
  )
}

/*

<MBSection>
        <MBSectionTitle>The Colour Chooser</MBSectionTitle>
        <p>
          Use the colour chooser at the bottom of your screen to select your guesses. Tap the centre circle
          twice to register your guess.
        </p>
        <MobileView>
          <p>
            On a mobile device:
            <ul>
              <li>slide left, right, up, and down with one finger to change saturation and brightness.</li>
              <li>Use two fingers to rotate the area to change the hue.</li>
              <li>
                Pinch with two fingers to zoom in and out.
                This will allow you finer-grained control over the colour you are selecting.
              </li>
            </ul>
          </p>
        </MobileView>
        <BrowserView>
          <p>
            On a desktop device:
            <ul>
              <li>Drag left, right, up, and down to change saturation and brightness.</li>
              <li>Hold the 'alt' key while dragging left or right change the hue.</li>
              <li>
                Hold the 'alt' key while dragging up or down to zoom in or out.
                This will allow you finer-grained control over the colour you are selecting.
              </li>
            </ul>
          </p>
        </BrowserView>
        <p>
          The currently selected colour appears in the centre circle.
          When you're ready to make your selection,
          tap the circle for an expanded view,
          then tap again to confirm.
          You can also make the colour chooser go full-screen by tapping
          the icon in its upper-right corner.
        </p>
      </MBSection>
      <MBSection>
        <MBSectionTitle>The Hints</MBSectionTitle>
        <p>After each guess, you will receive a hint to help you find the secret colour.</p>
        <p></p>
      </MBSection>

 */
