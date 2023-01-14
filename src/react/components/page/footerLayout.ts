import styled from 'styled-components'
import { windowLayout } from './windowLayout'
import { Theme } from '../../../theme/theme'

export const footerLayout = {
  border: {
    bottom: 0,
    sides: 0,
    top: 0,
  },
  contentHeight: 0,
  height: -999,
  padding: {
    bottom: 3,
    sides: 3,
    top: 3,
  },
}

footerLayout.height =
  footerLayout.contentHeight === 0
    ? 0
    : footerLayout.contentHeight +
      footerLayout.border.top +
      footerLayout.padding.top +
      footerLayout.padding.bottom +
      footerLayout.border.bottom

export const _Footer = styled.div.attrs({
  className: 'footer',
})`
  align-items: flex-end;
  border-bottom: ${footerLayout.border.bottom}px solid;
  border-color: ${(props) => (props.theme as Theme).colours.appBorders};
  border-left: ${footerLayout.border.sides}px solid;
  border-right: ${footerLayout.border.sides}px solid;
  border-top: ${footerLayout.border.top}px solid;
  bottom: ${windowLayout.padding.bottom}px;
  box-sizing: border-box;
  display: flex;
  gap: 3px;
  height: ${footerLayout.height}px;
  justify-content: space-between;
  left: 0;
  padding-bottom: ${footerLayout.padding.bottom}px;
  padding-left: ${footerLayout.padding.sides}px;
  padding-right: ${footerLayout.padding.sides}px;
  padding-top: ${footerLayout.padding.top}px;
  position: absolute;
  width: 100%;
`

const _FooterSection = styled.div.attrs({
  className: 'footer-section',
})`
  box-sizing: border-box;
  flex: 1 1 content;
  display: inline-block;
  height: ${footerLayout.contentHeight}px;
  overflow: hidden;
  width: calc(100% / 1);
  & > * {
    vertical-align: top;
  }
`

export const _FooterSectionLeft = styled(_FooterSection)`
  text-align: left;
`

export const _FooterSectionRight = styled(_FooterSection)`
  text-align: right;
`

export const _FooterText = styled.p.attrs({
  className: 'footer-text',
})`
  box-sizing: border-box;
  font-weight: 150;
  height: ${footerLayout.contentHeight}px;
  margin: 0;
  font-size: ${footerLayout.contentHeight - 2}px;
  line-height: ${footerLayout.contentHeight + 2}px;
  position: relative;
`
