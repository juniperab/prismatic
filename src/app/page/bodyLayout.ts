import styled from 'styled-components'
import { headerLayout } from './headerLayout'
import { footerLayout } from './footerLayout'
import { windowLayout } from './windowLayout'

export const bodyLayout = {
  margin: {
    top: 0,
    bottom: 0,
    sides: 0,
  },
  offset: {
    fromTopOfWindow: -999,
    fromBottomOfWindow: -999,
  },
  padding: {
    sides: 0,
    top: 10,
    bottom: 0,
  },
}

bodyLayout.offset.fromTopOfWindow = windowLayout.padding.top + headerLayout.height + bodyLayout.margin.top
bodyLayout.offset.fromBottomOfWindow = windowLayout.padding.bottom + footerLayout.height + bodyLayout.margin.bottom

export const _Body = styled.div.attrs({
  className: 'body',
})`
  bottom: ${bodyLayout.offset.fromBottomOfWindow}px;
  box-sizing: border-box;
  padding-bottom: ${bodyLayout.padding.bottom}px;
  padding-left: ${bodyLayout.padding.sides}px;
  padding-right: ${bodyLayout.padding.sides}px;
  padding-top: ${bodyLayout.padding.top}px;
  position: absolute;
  top: ${bodyLayout.offset.fromTopOfWindow}px;
  width: calc(100% - ${windowLayout.padding.sides * 2}px);
`
