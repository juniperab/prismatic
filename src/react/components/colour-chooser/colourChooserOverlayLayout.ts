import styled from 'styled-components'
import { colourChooserLayout, fadeInOut } from './colourChooserLayout'

export const colourChooserOverlayLayout = {
  section: {
    padding: 10,
  },
}

export const ColourChooserOverlay = styled.div.attrs({
  className: 'colour-chooser-overlay',
})`
  align-content: stretch;
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: space-around;
  width: 100%;
  ${(props) => fadeInOut((props as any)['data-show'])}
`

export const ColourChooserOverlaySection = styled.div.attrs({
  className: 'colour-chooser-overlay-section',
})`
  box-sizing: border-box;
  flex: 1 1 auto;
  height: 100%;
  padding: ${colourChooserOverlayLayout.section.padding}px;
  position: relative;
  vertical-align: top;
  width: calc((100% - ${colourChooserLayout.selector.diameter}px) / 2);

  img {
    box-sizing: border-box;
    display: inline-block;
    height: auto;
    left: 50%;
    max-height: calc(100% - ${colourChooserOverlayLayout.section.padding * 2}px);
    max-width: calc(100% - ${colourChooserOverlayLayout.section.padding * 2}px);
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`
