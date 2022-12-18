import { CSSProperties, ReactElement } from "react"
import pinchZoomImage from "./PinchZoom.png"
import swipeImage from "./Swipe.png"
import rotateImage from "./Rotate.png"
import modifiedDragImage from "./ModifiedDrag.png"
import { ColourChooserOverlay, ColourChooserOverlaySection } from "./colourChooserOverlayLayout"
import { isMobile } from "react-device-detect"

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