import styled from 'styled-components'
import { headerLayout } from '../page/headerLayout'
import { windowLayout } from '../page/windowLayout'
import { footerLayout } from '../page/footerLayout'
import { Icon } from '../../../theme/elements/Icon'
import { H2 } from '../../../theme/elements/H1'
import { Theme } from '../../../theme/theme'

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

export const _ModalBackground = styled.div.attrs({
  className: 'modal-background',
})`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 9999;
`

export const _ModalContainer = styled.div.attrs({
  className: 'modal-container',
})`
  bottom: ${modalLayout.margin.fromBottomOfScreen}px;
  box-sizing: border-box;
  left: 50%;
  position: absolute;
  top: ${modalLayout.margin.fromTopOfScreen}px;
  transform: translateX(-50%);
  width: clamp(${windowLayout.width.min}px, 100vw, ${windowLayout.width.max}px);
`

export const _ModalContainerInner = styled.div.attrs({
  className: 'modal-container-inner',
})`
  bottom: 0;
  left: ${modalLayout.margin.side}px;
  position: absolute;
  right: ${modalLayout.margin.side}px;
  top: 0;
`

export const _ModalWindow = styled.div.attrs({
  className: 'modal-window',
})`
  box-sizing: border-box;
  background-color: ${(props) => (props.theme as Theme).colours.modalBackground};
  border-radius: 15px;
  border: 2px solid ${(props) => (props.theme as Theme).colours.modalBorders};
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
  box-shadow: 0 4px 23px 0 ${(props) => (props.theme as Theme).colours.modalBoxShadow};
`

export const _ModalHeader = styled.div.attrs({
  className: 'modal-header',
})`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 3px;
`

const _ModalHeaderSection = styled.div.attrs({
  className: 'modal-header-section',
})`
  font-size: ${modalLayout.header.height / 2}px;
  font-weight: 700;
`

export const _ModalHeaderSectionCentre = styled(_ModalHeaderSection)`
  text-align: center;
`

export const _ModalHeaderSectionEdge = styled(_ModalHeaderSection)`
  text-align: right;
`

export const _ModalBody = styled.div.attrs({
  className: 'modal-body',
})`
  text-align: justify;
  .modal-body-section {
    border-bottom-width: ${modalLayout.body.section.separatorBorder}px;
    border-bottom-style: dashed;
    border-bottom-color: ${(props) => (props.theme as Theme).colours.modalSectionBorder};
  }
  .modal-body-section:last-child {
    border-bottom: none;
  }
`

export const _ModalIcon = styled(Icon)`
  height: ${modalLayout.header.height}px;
`

export const _ModalBodySection = styled.div.attrs({
  className: 'modal-body-section',
})`
  box-sizing: border-box;
  margin: ${modalLayout.body.section.margin.topBottom}px 0;
`

export const _ModalBodySectionTitle = styled(H2)`
  font-size: inherit;
`
