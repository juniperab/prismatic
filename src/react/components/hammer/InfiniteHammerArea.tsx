import { CSSProperties, ReactElement, useEffect, useState } from "react";
import { InfiniteHammerAreaInner, InfiniteHammerAreaTile } from './infiniteHammerAreaLayout'
import {
  HammerArea,
  HammerAreaProps,
  HammerAreaValues,
  HammerOnChangeCallback,
  HammerOnResizeCallback
} from "./HammerArea";
import { euclideanDistance } from '../../../lib/math/math'

export interface InfiniteHammerAreaProps extends HammerAreaProps {
  mirrorTiles?: boolean
}

export function InfiniteHammerArea(props: InfiniteHammerAreaProps): ReactElement {
  const [width, setWidth] = useState(1)
  const [height, setHeight] = useState(1)
  const [r, setR] = useState(0)
  const [s, setS] = useState(1)
  const [y, setY] = useState(0)
  const [x, setX] = useState(0)

  useEffect(() => {
    setR(prevR => props.values?.displayRotation ?? prevR)
    setS(prevS => props.values?.displayScale ?? prevS)
    setX(prevX => props.values?.displayOffsetX ?? prevX)
    setY(prevY => props.values?.displayOffsetY ?? prevY)
  }, [props.values])

  const handleHammerAreaChange: HammerOnChangeCallback = (values: HammerAreaValues, gestureComplete: boolean): void => {
    setR(values.displayRotation)
    setS(values.displayScale)
    setX(values.displayOffsetX)
    setY(values.displayOffsetY)
    if (props.onChange !== undefined) props.onChange(values, gestureComplete)
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

  const innerStyle: CSSProperties = {
    transform: `translateX(${x}px) translateY(${y}px) rotate(${r}deg) scale(${s * 100}%)`,
  }

  return (
    <HammerArea {...props} onChange={handleHammerAreaChange} onResize={handleHammerAreaResize}>
      <InfiniteHammerAreaInner style={innerStyle}>{tiles}</InfiniteHammerAreaInner>
    </HammerArea>
  )
}
