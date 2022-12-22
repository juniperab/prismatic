import styled from 'styled-components'
import { playingViewLayout } from '../../features/views/playingViewLayout'

export const hintGridLayout = {
  gap: 20,
}

export const HintGridOuter = styled.div.attrs({
  className: 'hint-grid-grid-outer',
})`
  box-sizing: border-box;
  height: 100%;
  position: relative;
  width: 100%;
`

export const HintGridMiddle1 = styled.div.attrs({
  className: 'hint-grid-grid-middle1',
})`
  aspect-ratio: ${props => (props as any)['data-aspect-ratio']};
  max-height: 100%;
  max-width: 100%;
`

export const HintGridMiddle2 = styled.div.attrs({
  className: 'hint-grid-grid-middle2',
})`
  aspect-ratio: ${props => (props as any)['data-aspect-ratio']};
  box-sizing: border-box;
  left: 50%;
  max-height: calc(
    100vh - var(--extra-vh, 0px) - ${playingViewLayout.windowHeightMinusUpper}px + ${hintGridLayout.gap}px
  );
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + ${hintGridLayout.gap}px);
`

export const HintGridInner = styled.div.attrs({
  className: 'hint-grid-grid-inner',
})`
  box-sizing: border-box;
  height: calc(100% - ${hintGridLayout.gap}px);
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - ${hintGridLayout.gap}px);
  display: grid;
  grid-template-rows: repeat(${props => (props as any)['data-rows']}, 1fr);
  row-gap: ${hintGridLayout.gap}px;
`

export const HintRowOuter = styled.div.attrs({
  className: 'hint-grid-row-outer',
})`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(${props => (props as any)['data-cols']}, 1fr);
  column-gap: ${hintGridLayout.gap}px;
`

export const HintRowCell = styled.div.attrs({
  className: 'hint-grid-row-cell',
})`
  box-sizing: border-box;
  border-style: ${props => (props as any)['data-highlight'] === true ? 'dashed' : 'solid'};
  border-width: ${props => (props as any)['data-highlight'] === true ? '2px' : '1px'};;
  border-color: ${(props) => props.theme.colours.border};
  border-radius: 50%;
`
