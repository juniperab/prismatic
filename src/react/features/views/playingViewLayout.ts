import styled from 'styled-components'

export const playingViewLayout = {
  upper: {
    padding: 0,
    border: 0,
  },
  lower: {
    padding: 0,
    border: 0,
    minHeight: 200,
  },
  gap: 10,
}

export const _PlayingView = styled.div.attrs({
  className: 'playing-view',
})`
  box-sizing: border-box;
  height: 100%;
  position: relative;
  width: 100%;
`

const _PlayingViewSection = styled.div.attrs({
  className: 'playing-view-section',
})`
  box-sizing: border-box;
  text-align: center;
  border-style: solid;
  border-color: ${(props) => props.theme.colours.border};
  width: 100%;
  position: relative;
`

export const _PlayingViewSectionUpper = styled(_PlayingViewSection)`
  border-width: ${playingViewLayout.upper.border}px;
  padding: ${playingViewLayout.upper.padding}px;
  top: 0;
`

export const _PlayingViewSectionLower = styled(_PlayingViewSection)`
  border-width: ${playingViewLayout.lower.border}px;
  padding: ${playingViewLayout.lower.padding}px;
  bottom: 0;
`

export const _PlayingViewSectionLowerOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`
