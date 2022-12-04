import styled from "styled-components"
import { playingViewLayout } from "../../features/views/playingViewLayout"

export const hintGridLayout = {
  aspectRatio: -999,
  cols: 6,
  gap: 20,
  rows: 7,
}

export const HintGridOuter = styled.div.attrs({
  className: 'hint-grid-outer',
})`
  box-sizing: border-box;
  height: 100%;
  position: relative;
  width: 100%;
`

export const HintGridMiddle1 = styled.div.attrs({
  className: 'hint-grid-middle1',
})`
  aspect-ratio: ${hintGridLayout.cols / hintGridLayout.rows};
  max-height: 100%;
  max-width: 100%;
`

export const HintGridMiddle2 = styled.div.attrs({
  className: 'hint-grid-middle2',
})`
  aspect-ratio: ${hintGridLayout.cols / hintGridLayout.rows};
  box-sizing: border-box;
  left: 50%;
  max-height: calc(100vh - var(--extra-vh, 0px) - ${playingViewLayout.windowHeightMinusUpper}px + ${hintGridLayout.gap}px);
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + ${hintGridLayout.gap}px);
`

export const HintGridInner = styled.div.attrs({
  className: 'hint-grid-inner',
})`
  box-sizing: border-box;
  height: calc(100% - ${hintGridLayout.gap}px);
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - ${hintGridLayout.gap}px);
  display: grid;
`

export const HintGridRow = styled.div.attrs({
  className: 'hint-grid-row',
})`
  
`