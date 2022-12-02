import styled from "styled-components";
import { H1 } from "../theme/elements/H1";
import { appWindowLayout } from "./appWindowStyle";

export const topBarLayout = {
  height: 40,
  border: {
    top: 0,
    bottom: 1,
  },
  padding: {
    side: 3,
  },
  contentHeight: -999,
}

topBarLayout.contentHeight = topBarLayout.height - topBarLayout.border.top - topBarLayout.border.bottom

export const TopBarOuter = styled.div.attrs({
  className: 'top-bar-outer'
})`
  box-sizing: border-box;
  border-color: ${props => props.theme.colours.border};
  border-bottom: ${topBarLayout.border.bottom}px solid;
  border-top: ${topBarLayout.border.top}px solid;
  width: calc(100% + ${appWindowLayout.padding.side * 2}px);
  left: -${appWindowLayout.padding.side}px;
  position: relative;
  height: ${topBarLayout.height}px;
  padding-left: ${topBarLayout.padding.side}px;
  padding-right: ${topBarLayout.padding.side}px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 3px;
`

export const TopBarSectionLeft = styled.div.attrs({
  className: 'top-bar-section',
})`
  box-sizing: border-box;
  flex-grow: 1;
  display: inline-block;
  flex-basis: content;
  height: ${topBarLayout.contentHeight}px;
  overflow: hidden;
  width: calc(100% / 1);
  & > * {
    vertical-align: top;
  }
`

export const TopBarSectionRight = styled(TopBarSectionLeft)`
  text-align: right;
`


export const TopBarImage = styled.img.attrs({
  alt: 'logo',
  className: 'top-bar-logo'
})`
  box-sizing: border-box;
  aspect-ratio: 1;
  height: ${topBarLayout.contentHeight}px;
  padding: 3px;
  display: inline-block;
`

export const TopBarIcon = styled.div.attrs({
  className: 'top-bar-icon'
})`
  box-sizing: border-box;
  aspect-ratio: 1;
  height: ${topBarLayout.contentHeight}px;
  padding: 3px;
  display: inline-block;
  & svg {
    box-sizing: border-box;
    display: inline-block;
    height: 100%;
    width: 100%;
  }
  & path {
    fill: ${props => props.color};
  }
`

export const TopBarTitle = styled(H1).attrs({
  className: 'top-bar-title'
})`
  box-sizing: border-box;
  display: inline-block;
  font-weight: 200;
  height: ${topBarLayout.contentHeight}px;
  margin: 0;
  font-size: ${topBarLayout.contentHeight}px;
  line-height: ${topBarLayout.contentHeight}px;
  position: relative;
`
