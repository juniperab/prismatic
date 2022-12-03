import styled from 'styled-components'
import { headerLayout } from './headerLayout'
import { footerLayout } from './footerLayout'

export const bodyLayout = {
  margin: {
    top: 0,
    bottom: 0,
    side: 0,
    fromTopOfWindow: -999,
    fromBottomOfWindow: -999,
  },
}

bodyLayout.margin.fromTopOfWindow = headerLayout.height + bodyLayout.margin.top
bodyLayout.margin.fromBottomOfWindow = footerLayout.height + bodyLayout.margin.bottom

export const BodyOuter = styled.div.attrs({
  className: 'body-outer',
})`
  bottom: ${bodyLayout.margin.fromBottomOfWindow}px;
  position: absolute;
  top: ${bodyLayout.margin.fromTopOfWindow}px;
  width: 100%;
`
