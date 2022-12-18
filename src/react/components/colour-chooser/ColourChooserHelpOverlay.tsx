import { CSSProperties, Dispatch, ReactElement, SetStateAction, useState } from "react"
import pinchZoomImage from "./PinchZoom.png"
import swipeImage from "./Swipe.png"
import rotateImage from "./Rotate.png"
import modifiedDragImage from "./ModifiedDrag.png"
import { ColourChooserOverlay, ColourChooserOverlaySection } from "./colourChooserOverlayLayout"
import { isMobile } from "react-device-detect"

export interface OverlayState {
  show: boolean,
  ticksBeforeHide: number,
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function overlayStateFunctions(initialState: OverlayState, setState: Dispatch<SetStateAction<OverlayState>>) {

  const addOverlayTicks = (ticks: number): void => setState(prev => {
    const newTicks = prev.ticksBeforeHide - ticks
    return {
      ...prev,
      ticksBeforeHide: newTicks,
      show: prev.show && newTicks > 0,
    }
  })

  const hideOverlay = (): void => setState(prev => { return { ...prev, show: false } })

  const showOverlay = (): void => setState(prev => { return {
    ...prev,
    show: true,
    ticksBeforeHide: initialState.ticksBeforeHide }
  })

  return { addOverlayTicks, hideOverlay, showOverlay }
}

export function useOverlayState(initialState: OverlayState): [
  OverlayState,
  (show: boolean) => void,
  (ticks: number) => void,
] {
  const [overlay, setOverlay] = useState(initialState)
  const { hideOverlay, showOverlay, addOverlayTicks } = overlayStateFunctions(initialState, setOverlay)
  return [
    overlay,
    (show: boolean) => show ? showOverlay() : hideOverlay(),
    addOverlayTicks,
  ]
}

export interface ColourChooserHelpOverlayProps {
  style: CSSProperties,
  visible: boolean
}

const overlayContentsMobile = <>
  <ColourChooserOverlaySection><img alt='zoom' src={pinchZoomImage}/></ColourChooserOverlaySection>
  <ColourChooserOverlaySection><img alt='swipe' src={swipeImage}/></ColourChooserOverlaySection>
  <ColourChooserOverlaySection><img alt='rotate' src={rotateImage}/></ColourChooserOverlaySection>
</>
const overlayContentsDesktop = <>
    <ColourChooserOverlaySection><img alt='drag' src={swipeImage}/></ColourChooserOverlaySection>
    <ColourChooserOverlaySection><img alt='drag (modified)' src={modifiedDragImage}/></ColourChooserOverlaySection>
</>

export function ColourChooserHelpOverlay(props: ColourChooserHelpOverlayProps): ReactElement {
  const { style, visible } = props
  return <ColourChooserOverlay style={style} data-show={visible}>
    { isMobile ? overlayContentsMobile : overlayContentsDesktop }
  </ColourChooserOverlay>
}