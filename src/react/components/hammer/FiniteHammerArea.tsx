import { CSSProperties, ReactElement, useState } from "react";
import { HammerAreaProps, HammerAreaValues } from "./hammerAreaTypes";
import { InternalHammerArea } from "./HammerArea";
import { InternalHammerAreaProps, InternalHammerOnChangeCallback } from "./hammerAreaTypesInternal";
import { FiniteHammerAreaInner } from "./finiteHammerAreaLayout";

export function InternalFiniteHammerArea(props: InternalHammerAreaProps): ReactElement {
  const { children, onChangeInternal } = props
  const [ displayValues, setDisplayValues ] = useState<HammerAreaValues>({ rotation: 0, scale: 1, x: 0, y: 0})

  const handleHammerAreaChange: InternalHammerOnChangeCallback = newData => {
    setDisplayValues(newData.newDisplayValues)
    if (onChangeInternal !== undefined) onChangeInternal(newData)
  }

  const innerStyle: CSSProperties = {
    transform: [
      `translateX(${displayValues.x}px)`,
      `translateY(${displayValues.y}px)`,
      `rotate(${displayValues.rotation}deg)`,
      `scale(${displayValues.scale * 100}%)`
    ].join(' '),
  }

  return (
    <InternalHammerArea {...props} onChangeInternal={handleHammerAreaChange}>
      <FiniteHammerAreaInner style={innerStyle}>{children}</FiniteHammerAreaInner>
    </InternalHammerArea>
  )
}

export function FiniteHammerArea(props: HammerAreaProps): ReactElement {
  return <InternalFiniteHammerArea {...props}>{props.children}</InternalFiniteHammerArea>
}
