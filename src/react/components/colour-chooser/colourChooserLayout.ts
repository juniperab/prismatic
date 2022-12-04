import styled from "styled-components"

export const colourChooserLayout = {

}

export const ColourChooserOuter = styled.div.attrs({
  className: 'colour-chooser-outer',
})`
  height: 100%;
  width: 100%;
  position: relative;

  touch-action: none;
  
  .react-colorful {
    width: 100%;
  }
  .react-colorful__saturation {
    margin: 0;
    border-width: 0;
    padding: 0;
    border-color: transparent;
    border-radius: 0;
  }
  .react-colorful__hue {
    display: none;
  }
  .react-colorful__hue-pointer {
    height: 12px;
    width: inherit;
    border-radius: 0;
  }
`

export const ColourChooserCover = styled.div.attrs({
  className: 'colour-chooser-cover',
})`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
`