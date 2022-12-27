import styled from 'styled-components'
import { headerLayout } from '../page/headerLayout'
import { windowLayout } from '../page/windowLayout'
import { footerLayout } from '../page/footerLayout'
import { Icon } from '../theme/elements/Icon'

export const modalLayout = {
  margin: {
    top: 30,
    bottom: 30,
    side: 30,
    fromTopOfScreen: -999,
    fromBottomOfScreen: -999,
  },
  padding: {
    side: 20,
    top: 10,
    bottom: 10,
  },
  header: {
    height: 30,
  },
  body: {
    section: {
      margin: {
        topBottom: 10,
      },
      separatorBorder: 1,
    },
    paragraph: {
      margin: {
        topBottom: 5,
      },
    },
  },
}

modalLayout.margin.fromTopOfScreen = headerLayout.height + modalLayout.margin.top
modalLayout.margin.fromBottomOfScreen = footerLayout.height + modalLayout.margin.bottom

export const ModalBackground = styled.div.attrs({
  className: 'modal-background',
})`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 9999;
`

export const ModalOuter = styled.div.attrs({
  className: 'modal-outer',
})`
  bottom: ${modalLayout.margin.fromBottomOfScreen}px;
  box-sizing: border-box;
  left: 50%;
  position: absolute;
  top: ${modalLayout.margin.fromTopOfScreen}px;
  transform: translateX(-50%);
  width: clamp(${windowLayout.width.min}px, 100vw, ${windowLayout.width.max}px);
`

export const ModalInner = styled.div.attrs({
  className: 'modal-inner',
})`
  bottom: 0;
  left: ${modalLayout.margin.side}px;
  position: absolute;
  right: ${modalLayout.margin.side}px;
  top: 0;
`

export const ModalWindow = styled.div.attrs({
  className: 'modal-window',
})`
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colours.modalBackground};
  border-radius: 15px;
  border: 2px solid ${(props) => props.theme.colours.modalBorder};
  height: auto;
  max-height: 100%;
  overflow-y: scroll;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding-top: ${modalLayout.padding.top}px;
  padding-left: ${modalLayout.padding.side}px;
  padding-right: ${modalLayout.padding.side}px;
  padding-top: ${modalLayout.padding.bottom}px;
  box-shadow: 0 4px 23px 0 ${(props) => props.theme.colours.modalBoxShadow};
`

export const ModalHeaderOuter = styled.div.attrs({
  className: 'modal-header-outer',
})`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 3px;
`

const ModalHeaderSection = styled.div.attrs({
  className: 'modal-header-section',
})`
  font-size: ${modalLayout.header.height / 2}px;
  font-weight: 700;
`

export const ModalHeaderSectionCentre = styled(ModalHeaderSection)`
  text-align: center;
`

export const ModalHeaderSectionEdge = styled(ModalHeaderSection)`
  text-align: right;
`

export const ModalBody = styled.div.attrs({
  className: 'modal-body',
})`
  .modal-body-section {
    border-bottom-width: ${modalLayout.body.section.separatorBorder}px;
    border-bottom-style: dashed;
    border-bottom-color: ${props => props.theme.colours.modalSectionBorder};
  }
  .modal-body-section:last-child {
    border-bottom: none;
  }
`

export const ModalIcon = styled(Icon)`
  height: ${modalLayout.header.height}px;
`

export const ModalBodySection = styled.div.attrs({
  className: 'modal-body-section'
})`
  box-sizing: border-box;
  margin: ${modalLayout.body.section.margin.topBottom}px 0;

  // p {
  //   margin: ${modalLayout.body.paragraph.margin.topBottom}px 0;
  // }
`
