import styled from "styled-components";

export const hintDisplayLayout = {
  container: {
    border: {
      width: 2,
    },
  },
  centre: {
    diameter: 34, // percent
    border: {
      width: 1,
    }
  }
}

export const HintDisplayOuter = styled.div.attrs({
  className: 'hint-display-outer',
})`
  place-self: stretch;
`

export const HintDisplayInner = styled.div.attrs({
  className: 'hint-display-inner',
})`
  aspect-ratio: 1;
  box-sizing: border-box;
  position: relative;
  border-style: solid;
  border-width: ${hintDisplayLayout.container.border.width}px;
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
  className: 'hint-display-quadrant',
})`
  box-sizing: border-box;
  height: 50%;
  width: 50%;
  flex: 1 1 50%;
`

export const HintDisplayCentre = styled.div.attrs({
  className: 'hint-display-centre',
})`
  box-sizing: border-box;
  aspect-ratio: 1;
  width: ${hintDisplayLayout.centre.diameter}%;
  border-style: solid;
  border-width: ${hintDisplayLayout.centre.border.width}px;
  border-color: ${(props) => props.theme.colours.border};
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`