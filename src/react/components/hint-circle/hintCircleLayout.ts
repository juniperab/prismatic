import styled from 'styled-components'

export const hintCircleLayout = {
  container: {
    border: {
      width: 2,
    },
  },
  centre: {
    diameter: 34, // percent
    border: {
      width: 1,
    },
  },
}

export const _HintCircle = styled.div.attrs({
  className: 'hint-circle',
})`
  place-self: stretch;

  aspect-ratio: 1;
  box-sizing: border-box;
  position: relative;
  border-style: solid;
  border-width: ${hintCircleLayout.container.border.width}px;
  border-color: ${(props) => props.theme.colours.border};
  border-radius: 50%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
  gap: 0;
  overflow: hidden;
`

export const _HintCircleQuadrant = styled.div.attrs({
  className: 'hint-circle-quadrant',
})`
  box-sizing: border-box;
  height: 50%;
  width: 50%;
  flex: 1 1 50%;
`

export const _HintCircleCentre = styled.div.attrs({
  className: 'hint-circle-centre',
})`
  box-sizing: border-box;
  aspect-ratio: 1;
  width: ${hintCircleLayout.centre.diameter}%;
  border-style: solid;
  border-width: ${hintCircleLayout.centre.border.width}px;
  border-color: ${(props) => props.theme.colours.border};
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
