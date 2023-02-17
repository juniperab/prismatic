import styled from 'styled-components'
import { Theme } from '../../theme/theme'

export const windowLayout = {
  padding: {
    bottom: 5,
    sides: 15,
    top: 5,
  },
  width: {
    max: 800,
    min: 100,
  },
}

export const _Window = styled.div.attrs({
  className: 'window',
})`
  background-color: ${(props) => (props.theme as Theme).colours.appBackground};
  box-sizing: border-box;
  color: ${(props) => (props.theme as Theme).colours.appText};
  height: 100%;
  left: 50%;
  padding-bottom: ${windowLayout.padding.bottom}px;
  padding-left: ${windowLayout.padding.sides}px;
  padding-right: ${windowLayout.padding.sides}px;
  padding-top: ${windowLayout.padding.top}px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(${windowLayout.width.min}px, 100vw, ${windowLayout.width.max}px);
`
