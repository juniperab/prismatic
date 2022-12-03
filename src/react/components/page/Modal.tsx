import { ReactElement, ReactNode } from 'react'
import { ModalOuter } from "./modalLayout";

export function Modal(props: { children: ReactNode }): ReactElement {
  return <ModalOuter>{props.children}</ModalOuter>
}
