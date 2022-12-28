import styled from "styled-components";

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

export const _Window = styled.div.attrs({
  className: 'window',
})`
  background-color: ${(props) => props.theme.colours.background};
  box-sizing: border-box;
  color: ${(props) => props.theme.colours.text};
  height: 100%;
  left: 50%;
  padding: ${windowLayout.padding.topBottom}px ${windowLayout.padding.side}px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(${windowLayout.width.min}px, 100vw, ${windowLayout.width.max}px);
`
