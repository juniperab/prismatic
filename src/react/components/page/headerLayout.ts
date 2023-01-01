import styled from 'styled-components'
import { H1 } from '../theme/elements/H1'
import { IconClickable } from '../theme/elements/Icon'
import { ImgClickable } from '../theme/elements/Image'
import { windowLayout } from './windowLayout'
import { Theme } from '../theme/theme'

export const headerLayout = {
  height: 40,
  border: {
    top: 0,
    bottom: 1,
    sides: 0,
  },
  padding: {
    sides: 3,
  },
  contentHeight: -999,
}

headerLayout.contentHeight = headerLayout.height - headerLayout.border.top - headerLayout.border.bottom

export const _Header = styled.div.attrs({
  className: 'header',
})`
  align-items: flex-end;
  border-bottom: ${headerLayout.border.bottom}px solid;
  border-color: ${(props) => (props.theme as Theme).colours.appBorders};
  border-left: ${headerLayout.border.sides}px solid;
  border-right: ${headerLayout.border.sides}px solid;
  border-top: ${headerLayout.border.top}px solid;
  box-sizing: border-box;
  display: flex;
  gap: 3px;
  height: ${headerLayout.height}px;
  justify-content: space-between;
  left: 0;
  padding-left: ${headerLayout.padding.sides}px;
  padding-right: ${headerLayout.padding.sides}px;
  position: absolute;
  top: ${windowLayout.padding.top}px;
  width: 100%;
`

const _HeaderSection = styled.div.attrs({
  className: 'header-section',
})`
  box-sizing: border-box;
  flex: 1 1 content;
  display: inline-block;
  height: ${headerLayout.contentHeight}px;
  overflow: hidden;
  width: calc(100% / 1);
  & > * {
    vertical-align: top;
  }
`

export const _HeaderSectionLeft = styled(_HeaderSection)`
  text-align: left;
`

export const _HeaderSectionRight = styled(_HeaderSection)`
  text-align: right;
`

export const _HeaderImage = styled(ImgClickable).attrs({
  alt: 'logo',
  className: 'header-image',
})`
  aspect-ratio: 1;
  height: ${headerLayout.contentHeight}px;
`

export const _HeaderIcon = styled(IconClickable)`
  height: ${headerLayout.contentHeight}px;
`

export const _HeaderTitle = styled(H1).attrs({
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
