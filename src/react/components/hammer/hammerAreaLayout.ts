import styled from "styled-components"

export const HammerAreaOuter = styled.div.attrs({
  className: 'hammer-area-outer',
})``

export const HammerAreaInner = styled.div.attrs({
  className: 'hammer-area-inner',
})`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9999;
`
