import { ReactElement, ReactNode } from 'react'
import { BodyOuter } from './bodyLayout'

export function Body(props: { children: ReactNode }): ReactElement {
  return <BodyOuter>{props.children}</BodyOuter>
}
