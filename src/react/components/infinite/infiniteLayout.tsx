import styled from "styled-components"

export const infiniteLayout = {

}

export const InfiniteOuter = styled.div.attrs({
  className: 'infinite-outer',
})`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow: hidden;
`

export const InfiniteInner = styled.div.attrs({
  className: 'infinite-inner',
})`
  position: absolute;
  width: 100%;
  height: 100%;
`

export const InfiniteTile = styled.div.attrs({
  className: 'infinite-tile',
})`
  position: absolute;
  width: 100%;
  height: 100%;
`

export const InfiniteTile4 = styled(InfiniteTile)`
  transform: translate(-100%, 0%) rotate(45deg);
`

export const InfiniteTile5 = styled(InfiniteTile)`

`

export const InfiniteTile6 = styled(InfiniteTile)`
  transform: translate(100%, 0%);
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