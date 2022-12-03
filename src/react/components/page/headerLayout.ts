import styled from 'styled-components'
import { H1 } from '../theme/elements/H1'
import { windowLayout } from './windowLayout'
import { IconClickable } from "../theme/elements/Icon";
import { ImgClickable } from "../theme/elements/Image";

export const headerLayout = {
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

headerLayout.contentHeight = headerLayout.height - headerLayout.border.top - headerLayout.border.bottom

export const HeaderOuter = styled.div.attrs({
  className: 'header-outer',
})`
  box-sizing: border-box;
  border-color: ${(props) => props.theme.colours.border};
  border-bottom: ${headerLayout.border.bottom}px solid;
  border-top: ${headerLayout.border.top}px solid;
  width: calc(100% + ${windowLayout.padding.side * 2}px);
  left: -${windowLayout.padding.side}px;
  position: absolute;
  height: ${headerLayout.height}px;
  padding-left: ${headerLayout.padding.side}px;
  padding-right: ${headerLayout.padding.side}px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 3px;
`

const HeaderSection = styled.div.attrs({
  className: 'header-section',
})`
  box-sizing: border-box;
  flex-grow: 1;
  display: inline-block;
  flex-basis: content;
  height: ${headerLayout.contentHeight}px;
  overflow: hidden;
  width: calc(100% / 1);
  & > * {
    vertical-align: top;
  }
`

export const HeaderSectionLeft = styled(HeaderSection)`
  text-align: left;
`

export const HeaderSectionRight = styled(HeaderSection)`
  text-align: right;
`

export const HeaderImage = styled(ImgClickable).attrs({
  alt: 'logo',
  className: 'header-image',
})`
  aspect-ratio: 1;
  height: ${headerLayout.contentHeight}px;
`

export const HeaderIcon = styled(IconClickable)`
  height: ${headerLayout.contentHeight}px;
`

export const HeaderTitle = styled(H1).attrs({
  className: 'header-title',
})`
  box-sizing: border-box;
  display: inline-block;
  font-weight: 200;
  height: ${headerLayout.contentHeight}px;
  margin: 0;
  font-size: ${headerLayout.contentHeight}px;
  line-height: ${headerLayout.contentHeight}px;
  position: relative;
`
