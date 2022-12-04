import styled from 'styled-components'
import { windowLayout } from './windowLayout'

export const footerLayout = {
  height: 0,
  border: {
    top: 0,
    bottom: 0,
  },
  padding: {
    side: 3,
  },
  contentHeight: -999,
}

footerLayout.contentHeight = footerLayout.height - footerLayout.border.top - footerLayout.border.bottom

export const FooterOuter = styled.div.attrs({
  className: 'footer-outer',
})`
  box-sizing: border-box;
  border-color: ${(props) => props.theme.colours.border};
  border-bottom: ${footerLayout.border.bottom}px solid;
  border-top: ${footerLayout.border.top}px solid;
  width: calc(100% + ${windowLayout.padding.side * 2}px);
  left: -${windowLayout.padding.side}px;
  position: absolute;
  height: ${footerLayout.height}px;
  padding-left: ${footerLayout.padding.side}px;
  padding-right: ${footerLayout.padding.side}px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 3px;
  bottom: 0;
`

const FooterSection = styled.div.attrs({
  className: 'footer-section',
})`
  box-sizing: border-box;
  flex-grow: 1;
  display: inline-block;
  flex-basis: content;
  height: ${footerLayout.contentHeight}px;
  overflow: hidden;
  width: calc(100% / 1);
  & > * {
    vertical-align: top;
  }
`

export const FooterSectionLeft = styled(FooterSection)`
  text-align: left;
`

export const FooterSectionRight = styled(FooterSection)`
  text-align: right;
`

export const FooterText = styled.p.attrs({
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
