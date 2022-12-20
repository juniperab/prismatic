import styled from 'styled-components'

export const colourChooserLayout = {
  selector: {
    diameter: 50,
  },
}

export function fadeInOut(show: boolean): string {
  return show
    ? `
          visibility: visible;
          opacity: 1;
          transition: opacity 2s linear;
          `
    : `
          visibility: hidden;
          opacity: 0;
          transition: visibility 0s 0.5s, opacity 0.5s linear;
          `
}

export const ColourChooserOuter = styled.div.attrs({
  className: 'colour-chooser-outer',
})`
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 1;
`

export const ColourChooserInner = styled.div.attrs({
  className: 'colour-chooser-inner',
})`
  background-image: linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
  height: 100%;
  position: relative;
  width: 100%;
`

export const ColourChooserSelection = styled.div.attrs({
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
  ${(props) => fadeInOut((props as any)['data-show'])}
`

export const ColourChooserSelectionPending = styled(ColourChooserSelection)`
  height: ${colourChooserLayout.selector.diameter * 2}px;
  width: ${colourChooserLayout.selector.diameter * 2}px;
`
