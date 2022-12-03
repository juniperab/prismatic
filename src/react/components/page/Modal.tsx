import { ReactElement, ReactNode } from 'react'

export function Modal(props: { children: ReactNode }): ReactElement {
  return <>{props.children}</>
}
