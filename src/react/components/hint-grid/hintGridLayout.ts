import styled from 'styled-components'
import { fadeInOut } from "../theme/styles/fadeInOut";

export const hintGridLayout = {
  fadeIn: (show: any) => fadeInOut(show['data-show'], 1, 0),
  gap: 20,
}

export const _HintGrid = styled.div.attrs({
  className: 'hint-grid',
})`
  box-sizing: border-box;
  display: grid;
  gap: ${hintGridLayout.gap}px;
  grid-auto-flow: row;
  grid-template-columns: repeat(${(props) => (props as any)['data-cols']}, 1fr);
  grid-template-rows: repeat(${(props) => (props as any)['data-rows']}, 1fr);
  height: 100%;
  left: 50%;
  place-content: center;
  place-items: center;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  ${(props) => hintGridLayout.fadeIn(props)}
`
