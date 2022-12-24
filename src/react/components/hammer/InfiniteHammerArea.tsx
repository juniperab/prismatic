import { CSSProperties, ReactElement, useState } from 'react'
import { euclideanDistance } from '../../../lib/math/math'
import { HammerAreaProps, HammerOnResizeCallback } from './hammerAreaTypes'
import { InternalHammerAreaProps, InternalHammerOnChangeCallback } from './hammerAreaTypesInternal'
import { InternalFiniteHammerArea } from './FiniteHammerArea'
import styled from 'styled-components'

interface InfiniteHammerAreaPropsMixin {
  mirrorTiles?: boolean
}

export type InfiniteHammerAreaProps = HammerAreaProps & InfiniteHammerAreaPropsMixin
export type InternalInfiniteHammerAreaProps = InternalHammerAreaProps & InfiniteHammerAreaPropsMixin

const InfiniteHammerAreaTile = styled.div.attrs({
  className: 'infinite-hammer-area-tile',
})`
  position: absolute;
  width: 100%;
  height: 100%;
`

export function InternalInfiniteHammerArea(props: InternalInfiniteHammerAreaProps): ReactElement {
  const { onChangeInternal } = props
  const [width, setWidth] = useState(1)
  const [height, setHeight] = useState(1)
  const [r, setR] = useState(0)
  const [s, setS] = useState(1)
  const [y, setY] = useState(0)
  const [x, setX] = useState(0)

  const handleHammerAreaChange: InternalHammerOnChangeCallback = (newData) => {
    const { newDisplayValues } = newData
    setR(newDisplayValues.rotation)
    setS(newDisplayValues.scale)
    setX(newDisplayValues.x)
    setY(newDisplayValues.y)
    if (onChangeInternal !== undefined) onChangeInternal(newData)
  }

  const handleHammerAreaResize: HammerOnResizeCallback = (width: number, height: number): void => {
    setWidth(width)
    setHeight(height)
    if (props.onResize !== undefined) props.onResize(width, height)
  }

  // calculate the tile shifts necessary so that the viewable area is always filled
  const hypotenuse = euclideanDistance([x, y])
  let currentAngleX = 0
  let currentAngleY = 0
  if (hypotenuse !== 0) {
    currentAngleX = Math.acos(x / hypotenuse)
    currentAngleY = Math.asin(y / hypotenuse)
    if (y < 0) currentAngleX *= -1
    if (x < 0) currentAngleY = Math.PI - currentAngleY
  }
  const newAngleX = -1 * ((r * Math.PI) / 180 - currentAngleX)
  const newAngleY = -1 * ((r * Math.PI) / 180 - currentAngleY)
  const unrotatedDeltaX = hypotenuse * Math.cos(newAngleX)
  const unrotatedDeltaY = hypotenuse * Math.sin(newAngleY)
  const shiftsX = -1 * Math.floor(Math.abs(unrotatedDeltaX / (width * s))) * Math.sign(unrotatedDeltaX)
  const shiftsY = -1 * Math.floor(Math.abs(unrotatedDeltaY / (height * s))) * Math.sign(unrotatedDeltaY)
  const gridStart = Math.floor(-2 / s)
  const gridStop = Math.ceil(2 / s)

  const tiles = []
  for (let i = gridStart + shiftsX; i <= gridStop + shiftsX; i++) {
    for (let j = gridStart + shiftsY; j <= gridStop + shiftsY; j++) {
      const scaleX = props.mirrorTiles === true ? (i % 2 === 0 ? 1 : -1) : 1
      const scaleY = props.mirrorTiles === true ? (j % 2 === 0 ? 1 : -1) : 1
      const styleIJ: CSSProperties = {
        transform: [
          `translateX(${i * 100}%)`,
          `translateY(${j * 100}%)`,
          `scaleX(${scaleX * 100}%)`,
          `scaleY(${scaleY * 100}%)`,
        ].join(' '),
      }
      const tileIJ = (
        <InfiniteHammerAreaTile style={styleIJ} key={`${i},${j}`}>
          {props.children}
        </InfiniteHammerAreaTile>
      )
      tiles.push(tileIJ)
    }
  }

  return (
    <InternalFiniteHammerArea {...props} onChangeInternal={handleHammerAreaChange} onResize={handleHammerAreaResize}>
      {tiles}
    </InternalFiniteHammerArea>
  )
}

export function InfiniteHammerArea(props: InfiniteHammerAreaProps): ReactElement {
  return <InternalInfiniteHammerArea {...props}>{props.children}</InternalInfiniteHammerArea>
}
