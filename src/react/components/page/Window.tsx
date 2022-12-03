import { ReactElement, ReactNode } from 'react'
import { WindowInner, WindowOuter } from './windowLayout'

export function Window(props: { children: ReactNode }): ReactElement {
  return (
    <WindowOuter>
      <WindowInner>{props.children}</WindowInner>
    </WindowOuter>
  )
}
