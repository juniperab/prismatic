import styled from 'styled-components'
import { fadeInOut } from '../theme/styles/fadeInOut'
import { windowLayout } from '../page/windowLayout'
import { Icon } from '../theme/elements/Icon'

export const colourChooserLayout = {
  container: {
    fadeIn: (show: any) => fadeInOut(show['data-show'], 0.5, 0),
  },
  overlay: {
    fadeInOut: (show: any) => fadeInOut(show['data-show'], 0.5, 0.5),
    section: {
      padding: 10,
    },
    buttons: {
      size: 40,
    },
  },
  selector: {
    diameter: 50,
    fadeInOut: (show: any) => fadeInOut(show['data-show'], 0.5, 0.5),
  },
}

export const _ColourChooser = styled.div.attrs({
  className: 'colour-chooser',
})`
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 1;
  ${(props) => colourChooserLayout.container.fadeIn(props)}
`

export const _ColourChooserFullscreen = styled(_ColourChooser)`
  position: fixed;
  top: 0;
  left: 0;
  height: calc(100vh - var(--extra-vh, 0px));
  width: 100vw;
`

export const _ColourChooserArea = styled.div.attrs({
  className: 'colour-chooser-area',
})`
  background-image: linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
  height: 100%;
  position: relative;
  width: 100%;
`

export const _ColourChooserOverlay = styled.div`
  ${(props) => colourChooserLayout.selector.fadeInOut(props)}
`

const _ColourChooserButton = styled(Icon)`
  position: absolute;
  height: ${colourChooserLayout.overlay.buttons.size}px;
  width: ${colourChooserLayout.overlay.buttons.size}px;
  cursor: pointer;
`

export const _ColourChooserHelpButton = styled(_ColourChooserButton)`
  top: 0;
  left: 0;
`

export const _ColourChooserFullscreenButton = styled(_ColourChooserButton)`
  top: 0;
  right: 0;
`

export const _ColourChooserSelection = styled.div.attrs({
  className: 'colour-chooser-selection',
})`
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  height: ${colourChooserLayout.selector.diameter}px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${colourChooserLayout.selector.diameter}px;
`

export const ColourChooserSelectionPending = styled(_ColourChooserSelection)`
  height: ${colourChooserLayout.selector.diameter * 2}px;
  width: ${colourChooserLayout.selector.diameter * 2}px;
`
