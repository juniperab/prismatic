import styled from 'styled-components'

export const windowLayout = {
  padding: {
    side: 15,
    topBottom: 5,
  },
  width: {
    max: 800,
    min: 100,
  },
}

export const WindowOuter = styled.div.attrs({
  className: 'window-outer',
})`
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colours.background};
  border: solid transparent;
  border-width: ${windowLayout.padding.topBottom}px ${windowLayout.padding.side}px;
  color: ${(props) => props.theme.colours.text};
  height: 100%;
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(${windowLayout.width.min}px, 100vw, ${windowLayout.width.max}px);
`

export const WindowInner = styled.div.attrs({
  className: 'window-inner',
})`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`
