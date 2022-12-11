import styled from "styled-components"

export const InfiniteHammerAreaOuter = styled.div.attrs({
  className: 'infinite-hammer-area-outer',
})`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow: hidden;
`

export const InfiniteHammerAreaInner = styled.div.attrs({
  className: 'infinite-hammer-area-inner',
})`
  position: absolute;
  width: 100%;
  height: 100%;
`

export const InfiniteHammerAreaTile = styled.div.attrs({
  className: 'infinite-hammer-area-tile',
})`
  position: absolute;
  width: 100%;
  height: 100%;
`

export const InfiniteCover = styled.div.attrs({
  className: 'infinite-cover'
})`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99999;
`
