import styled from "styled-components";

export const Img = styled.img`
  box-sizing: border-box;
  padding: 3px;
  display: inline-block;
`

export const ImgClickable = styled(Img)`
  ${props => props.onClick !== undefined && `
    &:hover {
      cursor: pointer;
      transform: rotate(15deg);
    }
  `}
`
