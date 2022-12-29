import { ReactElement, ReactNode } from 'react'
import { _Window as WindowElement } from './windowLayout'

export function Window(props: { children: ReactNode }): ReactElement {
  return <WindowElement>{props.children}</WindowElement>
}
