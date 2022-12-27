import styled from 'styled-components'
import { colourChooserLayout } from './colourChooserLayout'

export const ColourChooserHelpOverlayOuter = styled.div.attrs({
  className: 'colour-chooser-help-overlay-outer',
})`
  align-content: stretch;
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: space-around;
  width: 100%;
  ${(props) => colourChooserLayout.overlay.fadeInOut(props)}
`

export const ColourChooserHelpOverlaySection = styled.div.attrs({
  className: 'colour-chooser-help-overlay-section',
})`
  box-sizing: border-box;
  flex: 1 1 auto;
  height: 100%;
  padding: ${colourChooserLayout.overlay.section.padding}px;
  position: relative;
  vertical-align: top;
  width: calc((100% - ${colourChooserLayout.selector.diameter}px) / 2);

  img {
    box-sizing: border-box;
    display: inline-block;
    height: auto;
    left: 50%;
    max-height: calc(100% - ${colourChooserLayout.overlay.section.padding * 2}px);
    max-width: calc(100% - ${colourChooserLayout.overlay.section.padding * 2}px);
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`
