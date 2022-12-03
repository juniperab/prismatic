import styled from "styled-components";

export const appWindowLayout = {
  padding: {
    side: 15,
    topBottom: 5,
  },
  width: {
    max: 800,
    min: 100,
  }
}

export const AppWindowOuter = styled.div.attrs({
  className: 'app-window-outer',
})`
  box-sizing: border-box;
  background-color: ${props => props.theme.colours.background};
  border: solid transparent;
  border-width: ${appWindowLayout.padding.topBottom}px ${appWindowLayout.padding.side}px;
  color: ${props => props.theme.colours.text};
  height: 100%;
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(${appWindowLayout.width.min}px, 100vw, ${appWindowLayout.width.max}px);
`

export const AppWindowInner = styled.div.attrs({
  className: 'app-window-inner',
})`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`