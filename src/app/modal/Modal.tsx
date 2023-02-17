import React, { ReactElement, ReactNode } from 'react'
import {
  _ModalBackground as ModalElement,
  _ModalWindow as MWindow,
  _ModalContainerInner as MCInner,
  _ModalContainer as MContainer,
  _ModalBody as MBody,
  _ModalHeader as MHeader,
  _ModalHeaderSectionEdge as MHSectionEdge,
  _ModalHeaderSectionCentre as MHSectionCentre,
  _ModalIcon as MIcon,
} from './modalLayout'
import { useTheme } from 'styled-components'
import { Theme } from '../../theme/theme'

export interface ModalProps {
  children: ReactNode
  onClickClose: () => void
  title: string
}

interface ModalHeaderProps {
  centreContent: ReactNode
  rightContent: ReactNode
}

function ModalHeader(props: ModalHeaderProps): ReactElement {
  // N.B. we set the right content on both sides, so that the centre content
  // lines up perfectly between them, and hide the left copy of it.
  return (
    <MHeader>
      <MHSectionEdge style={{ visibility: 'hidden' }}>{props.rightContent}</MHSectionEdge>
      <MHSectionCentre>{props.centreContent}</MHSectionCentre>
      <MHSectionEdge>{props.rightContent}</MHSectionEdge>
    </MHeader>
  )
}

export function Modal(props: ModalProps): ReactElement {
  const theme = useTheme() as Theme
  const closeButton = (
    <MIcon onClick={props.onClickClose}>
      <theme.icons.close.svg />
    </MIcon>
  )

  return (
    <ModalElement onClick={props.onClickClose}>
      <MContainer>
        <MCInner onClick={(e) => e.stopPropagation()}>
          <MWindow>
            <ModalHeader centreContent={props.title} rightContent={closeButton} />
            <MBody>{props.children}</MBody>
          </MWindow>
        </MCInner>
      </MContainer>
    </ModalElement>
  )
}
