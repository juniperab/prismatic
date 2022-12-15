import styled from 'styled-components'

export const colourChooserLayout = {
  selectorDiameter: 50,
}

export const ColourChooserOuter = styled.div.attrs({
  className: 'colour-chooser-outer',
})`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
`

export const ColourChooserInner = styled.div.attrs({
  className: 'colour-chooser-inner',
})`
  height: 100%;
  width: 100%;
  position: relative;

  background-image: linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
`

export const ColourChooserSelection = styled.div.attrs({
  className: 'colour-chooser-selection',
})`
  position: absolute;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  width: ${colourChooserLayout.selectorDiameter}px;
  height: ${colourChooserLayout.selectorDiameter}px;
  border: 2px solid white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
