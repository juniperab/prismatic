import styled from "styled-components"
import { playingViewLayout } from "../../features/views/playingViewLayout"

export const colourChooserLayout = {
  selectorDiameter: 50,
}

export const ColourChooserOuter = styled.div.attrs({
  className: 'colour-chooser-outer',
})`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow: hidden;
`

export const ColourChooserInner = styled.div.attrs({
  className: 'colour-chooser-inner',
})`
  height: 100%;
  width: 100%;
  position: relative;
  
  // background-color: #00ff00;
  background-image: linear-gradient(0deg,#000,transparent),linear-gradient(90deg,#fff,hsla(0,0%,100%,0));
  
  // .react-colorful {
  //   box-sizing: border-box;
  //   width: 100%;
  //   height: ${playingViewLayout.height.lowerContents}px;
  // }
  //.react-colorful__hue {
  //  display: none;
  //}
  //.react-colorful__saturation {
  //  margin: 0;
  //  border-width: 0;
  //  padding: 0;
  //  border-color: transparent;
  //  border-radius: 0;
  //}
  //.react-colorful__pointer {
  //  display: none;
  //}
`

export const ColourChooserSelection = styled.div.attrs({
  className: 'colour-chooser-selection',
})`
  position: absolute;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0,0,0,.2);
  border-radius: 50%;
  width: ${colourChooserLayout.selectorDiameter}px;
  height: ${colourChooserLayout.selectorDiameter}px;
  border: 2px solid white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const ColourChooserCover = styled.div.attrs({
  className: 'colour-chooser-cover',
})`
  height: 0;
  width: 0;
  position: absolute;
  top: 50%;
  left: 50%;
`
