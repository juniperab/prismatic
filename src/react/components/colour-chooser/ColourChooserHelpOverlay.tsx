import { CSSProperties, Dispatch, ReactElement, SetStateAction, useState } from 'react'
import pinchZoomImage from './PinchZoom.png'
import swipeImage from './Swipe.png'
import rotateImage from './Rotate.png'
import modifiedDragImage from './ModifiedDrag.png'
import { ColourChooserHelpOverlayOuter, ColourChooserHelpOverlaySection } from './colourChooserOverlayLayout'
import { isMobile } from 'react-device-detect'

export interface HelpOverlayState {
  show: boolean
  ticksBeforeHide: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function helpOverlayStateFunctions(
  initialState: HelpOverlayState,
  setState: Dispatch<SetStateAction<HelpOverlayState>>
) {
  const addHelpOverlayTicks = (ticks: number): void =>
    setState((prev) => {
      const newTicks = prev.ticksBeforeHide - ticks
      return {
        ...prev,
        ticksBeforeHide: newTicks,
        show: prev.show && newTicks > 0,
      }
    })

  const hideHelpOverlay = (): void =>
    setState((prev) => {
      return { ...prev, show: false }
    })

  const showHelpOverlay = (): void =>
    setState((prev) => {
      return {
        ...prev,
        show: true,
        ticksBeforeHide: initialState.ticksBeforeHide,
      }
    })

  return { addHelpOverlayTicks, hideHelpOverlay, showHelpOverlay }
}

export function useHelpOverlayState(
  initialState: HelpOverlayState
): [HelpOverlayState, (show: boolean) => void, (ticks: number) => void] {
  const [helpOverlay, setHelpOverlay] = useState(initialState)
  const { hideHelpOverlay, showHelpOverlay, addHelpOverlayTicks } = helpOverlayStateFunctions(initialState, setHelpOverlay)
  return [helpOverlay, (show: boolean) => (show ? showHelpOverlay() : hideHelpOverlay()), addHelpOverlayTicks]
}

export interface ColourChooserHelpOverlayProps {
  style: CSSProperties
  visible: boolean
}

const overlayContentsMobile = (
  <>
    <ColourChooserHelpOverlaySection>
      <img alt="zoom" src={pinchZoomImage} />
    </ColourChooserHelpOverlaySection>
    <ColourChooserHelpOverlaySection>
      <img alt="swipe" src={swipeImage} />
    </ColourChooserHelpOverlaySection>
    <ColourChooserHelpOverlaySection>
      <img alt="rotate" src={rotateImage} />
    </ColourChooserHelpOverlaySection>
  </>
)
const overlayContentsDesktop = (
  <>
    <ColourChooserHelpOverlaySection>
      <img alt="drag" src={swipeImage} />
    </ColourChooserHelpOverlaySection>
    <ColourChooserHelpOverlaySection>
      <img alt="drag (modified)" src={modifiedDragImage} />
    </ColourChooserHelpOverlaySection>
  </>
)

export function ColourChooserHelpOverlay(props: ColourChooserHelpOverlayProps): ReactElement {
  const { style, visible } = props
  return (
    <ColourChooserHelpOverlayOuter style={style} data-show={visible}>
      {isMobile ? overlayContentsMobile : overlayContentsDesktop}
    </ColourChooserHelpOverlayOuter>
  )
}
