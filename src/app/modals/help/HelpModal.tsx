import React, { ReactElement } from 'react'
import { ModalType, selectAppState, setActiveModal } from '../../../redux/app/appSlice'
import { Modal } from '../../modal/Modal'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import {
  _ModalBodySection as MBSection,
  _ModalBodySectionTitle as MBSectionTitle,
} from '../../modal/modalLayout'
import { BrowserView, MobileView } from 'react-device-detect'
import { _HelpModalImage as HMImage } from './helpModalLayout'
import hintBrighterLessSaturatedImageFile from './hint-brighter-less-saturated.png'
import hintDarkerImageFile from './hint-darker.png'
import hintNoHueImageFile from './hint-no-hue.png'

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

        <div style={{ textAlignLast: 'center' }}>
          <HMImage>
            <img
              alt="Hint showing the secret colour is brighter but less saturated"
              src={hintBrighterLessSaturatedImageFile}
            />
          </HMImage>
          <p>The secret colour is brighter, but less saturated. It is also greener.</p>

          <HMImage>
            <img
              alt="Hint showing the secret colour is darker, without any saturation information"
              src={hintDarkerImageFile}
            />
          </HMImage>
          <p>
            The secret colour is darker, and its saturation is very different from that of your guess. Because your hint
            has no saturation information, you also get no information about the hue.
          </p>

          <HMImage>
            <img alt="Hint showing no information about the hue of the secret colour" src={hintNoHueImageFile} />
          </HMImage>
          <p>
            The saturation and brightness of your hint both match those of the secret colour. However, the hue you have
            guessed is very wrong, and thus you go no information about what the correct hue might be.
          </p>
        </div>
      </MBSection>

      <MBSection>
        <MBSectionTitle>
          The Hue-
          <wbr />
          Saturation-
          <wbr />
          Brightness Colour Model
        </MBSectionTitle>
        <div>
          <p>
            The chooser allows you navigate the{' '}
            <a href="https://en.wikipedia.org/wiki/HSL_and_HSV">
              Hue-
              <wbr />
              Saturation-
              <wbr />
              Brightness
            </a>{' '}
            colour model.
          </p>
          <p>
            The <b>hue</b> of a colour describes where it lies on the rainbow or colour wheel.
          </p>
          <p>
            The <b>saturation</b> of a colour describes how 'colourful' it is. A colour with no saturation will be
            white, black, or some shade of grey. A colour with full saturation will be vibrant, and will clearly show
            its hue (provided it is bright enough.)
          </p>
          <p>
            The <b>brightness</b> of a colour describes how much light it emits (on your screen) or reflects (on a piece
            of paper). A colour with no brightness will be black, no matter what hue and saturation it has. A colour
            with full brightness will be clearly visible.
          </p>
          <MobileView>
            <p>
              On a mobile device:
              <ul>
                <li>slide left, right, up, and down with one finger to change saturation and brightness.</li>
                <li>Use two fingers to rotate the area to change the hue.</li>
                <li>
                  Pinch with two fingers to zoom in and out. This will allow you finer-grained control over the colour
                  you are selecting.
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
        </div>
      </MBSection>
    </Modal>
  )
}
