import React, { ReactElement, ReactNode } from 'react'
import {
  ModalBackground,
  ModalWindow,
  ModalInner,
  ModalOuter,
  ModalBody,
  ModalHeaderOuter,
  ModalHeaderSectionEdge,
  ModalHeaderSectionCentre,
  ModalIcon,
} from './modalLayout'
import { useTheme } from 'styled-components'
import { Theme } from '../theme/theme'

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
    <ModalHeaderOuter>
      <ModalHeaderSectionEdge style={{ visibility: 'hidden' }}>{props.rightContent}</ModalHeaderSectionEdge>
      <ModalHeaderSectionCentre>{props.centreContent}</ModalHeaderSectionCentre>
      <ModalHeaderSectionEdge>{props.rightContent}</ModalHeaderSectionEdge>
    </ModalHeaderOuter>
  )
}

export function Modal(props: ModalProps): ReactElement {
  const theme = useTheme() as Theme
  const closeButton = (
    <ModalIcon onClick={props.onClickClose}>
      <theme.icons.close.svg />
    </ModalIcon>
  )

  return (
    <ModalBackground onClick={props.onClickClose}>
      <ModalOuter>
        <ModalInner onClick={(e) => e.stopPropagation()}>
          <ModalWindow>
            <ModalHeader centreContent={props.title} rightContent={closeButton} />
            <ModalBody>{props.children}</ModalBody>
          </ModalWindow>
        </ModalInner>
      </ModalOuter>
    </ModalBackground>
  )
}
