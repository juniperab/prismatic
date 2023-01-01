import styled from "styled-components";

export const Span = styled.span``

export const SpanClickable = styled(Span)`
  ${(props) =>
          props.onClick !== undefined &&
          `
    &:hover {
      cursor: pointer;
    }
  `}
`
