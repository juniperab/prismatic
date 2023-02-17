import { CSSProperties, ReactElement, useState } from 'react'
import { HammerAreaProps, HammerAreaValues } from './hammerAreaTypes'
import { InternalHammerArea } from './HammerArea'
import {
  InternalHammerAreaProps,
  InternalHammerOnChangeCallback,
  InternalHammerOnUpdatePropValuesCallback,
} from './hammerAreaTypesInternal'
import styled from 'styled-components'

const FiniteHammerAreaInner = styled.div.attrs({
  className: 'finite-hammer-area-inner',
})`
  position: relative;
  width: 100%;
  height: 100%;
`

export function InternalFiniteHammerArea(props: InternalHammerAreaProps): ReactElement {
  const { children, onChangeInternal, onUpdatePropValues } = props
  const [displayValues, setDisplayValues] = useState<HammerAreaValues>({ rotation: 0, scale: 1, x: 0, y: 0 })

  const handleHammerAreaChange: InternalHammerOnChangeCallback = (newData) => {
    setDisplayValues(newData.newDisplayValues)
    if (onChangeInternal !== undefined) onChangeInternal(newData)
  }

  const handleHammerAreaUpdatePropValues: InternalHammerOnUpdatePropValuesCallback = (newValues, newDisplayValues) => {
    setDisplayValues(newDisplayValues)
    if (onUpdatePropValues !== undefined) onUpdatePropValues(newValues, newDisplayValues)
  }

  const innerStyle: CSSProperties = {
    transform: [
      `translateX(${displayValues.x}px)`,
      `translateY(${displayValues.y}px)`,
      `rotate(${displayValues.rotation}deg)`,
      `scale(${displayValues.scale * 100}%)`,
    ].join(' '),
  }

  return (
    <InternalHammerArea
      {...props}
      onChangeInternal={handleHammerAreaChange}
      onUpdatePropValues={handleHammerAreaUpdatePropValues}
    >
      <FiniteHammerAreaInner style={innerStyle}>{children}</FiniteHammerAreaInner>
    </InternalHammerArea>
  )
}

// noinspection JSUnusedGlobalSymbols
export function FiniteHammerArea(props: HammerAreaProps): ReactElement {
  return <InternalFiniteHammerArea {...props}>{props.children}</InternalFiniteHammerArea>
}
