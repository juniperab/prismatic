import { ReactElement, ReactNode } from 'react'
import { _Body as BodyElement } from './bodyLayout'

export function Body(props: { children: ReactNode }): ReactElement {
  return <BodyElement>{props.children}</BodyElement>
}
