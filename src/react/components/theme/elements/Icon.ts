import styled from 'styled-components'

export const Icon = styled.div.attrs((props) => ({
  className: 'icon',
  color: props.color !== undefined ? props.color : 'black',
}))`
  box-sizing: border-box;
  aspect-ratio: 1;
  height: auto;
  width: auto;
  padding: 3px;
  display: inline-block;
  & svg {
    box-sizing: border-box;
    display: inline-block;
    height: 100%;
    width: 100%;
  }
  & path {
    fill: ${(props) => props.color};
  }
`

export const IconClickable = styled(Icon)`
  ${(props) =>
    props.onClick !== undefined &&
    `
    &:hover {
      cursor: pointer;
      transform: rotate(15deg) scale(120%);
    }
  `}
`
