import styled from "styled-components";

export const HintDisplayOuter = styled.div.attrs({
  className: 'hint-display-outer',
})`
`

export const HintDisplayInner = styled.div.attrs({
  className: 'hint-display-inner'
})`
  box-sizing: border-box;
  position: relative;
  border-style: ${(props) => ((props as any)['data-highlight'] === true ? 'dashed' : 'solid')};
  border-width: ${(props) => ((props as any)['data-highlight'] === true ? '2px' : '1px')};
  border-color: ${(props) => props.theme.colours.border};
  border-radius: 50%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
  gap: 0;
  overflow: hidden;
`
export const HintDisplayQuadrant = styled.div.attrs({
  className: 'hint-display-quadrant'
})`
  box-sizing: border-box;
  height: 50%;
  width: 50%;
  flex: 1 1 50%;
`