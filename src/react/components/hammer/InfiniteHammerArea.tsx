import { defaultTo } from "lodash"
import { CSSProperties, ReactElement, useState } from "react"
import {
  InfiniteHammerAreaInner,
  InfiniteHammerAreaOuter,
  InfiniteHammerAreaTile,
} from "./infiniteHammerAreaLayout"
import { useResizeDetector } from "react-resize-detector"
import { HammerArea, HammerAreaProps, HammerAreaValues } from "./HammerArea"

export interface InfiniteHammerAreaProps extends HammerAreaProps {
  mirrorTiles?: boolean
}

export function InfiniteHammerArea(props: InfiniteHammerAreaProps): ReactElement {
  const { width, height, ref } = useResizeDetector();
  const [values, setValues] = useState({
    r: defaultTo(props.initialRotation, 0),
    s: defaultTo(props.initialScale, 1),
    x: defaultTo(props.initialX, 0),
    y: defaultTo(props.initialY, 0),
  })

  const handleHammerAreaChange = (values: HammerAreaValues): void => {
    setValues({
      r: values.displayRotation,
      s: values.displayScale,
      x: values.displayOffsetX,
      y: values.displayOffsetY,
    })
    if (props.onChange !== undefined) props.onChange(values)
  }

  const actualWidth = Math.max(defaultTo(width, 1), 1)
  const actualHeight = Math.max(defaultTo(height, 1), 1)

  // calculate the tile shifts necessary so that the viewable area is always filled
  const hypotenuse = Math.sqrt(Math.pow(values.x, 2) + Math.pow(values.y, 2))
  let currentAngleX = 0
  let currentAngleY = 0
  if (hypotenuse !== 0) {
    currentAngleX = Math.acos(values.x / hypotenuse)
    currentAngleY = Math.asin(values.y / hypotenuse)
    if (values.y < 0) currentAngleX *= -1
    if (values.x < 0) currentAngleY = Math.PI - currentAngleY
  }
  const newAngleX = -1 * ((values.r * Math.PI / 180) - currentAngleX)
  const newAngleY = -1 * ((values.r * Math.PI / 180) - currentAngleY)
  const unrotatedDeltaX = hypotenuse * Math.cos(newAngleX)
  const unrotatedDeltaY = hypotenuse * Math.sin(newAngleY)
  const shiftsX = -1 * Math.floor(Math.abs(unrotatedDeltaX / (actualWidth * values.s))) * Math.sign(unrotatedDeltaX)
  const shiftsY = -1 * Math.floor(Math.abs(unrotatedDeltaY / (actualHeight * values.s))) * Math.sign(unrotatedDeltaY)

  const tiles = []
  for (let i = Math.round(-2 / values.s) + shiftsX; i <= Math.round(2 / values.s) + shiftsX; i++) {
    for (let j = Math.round(-2 / values.s) + shiftsY; j <= Math.round(2 / values.s) + shiftsY; j++) {
      const styleIJ: CSSProperties = {
        transform: [
          `translateX(${i * 100}%)`,
          `translateY(${j * 100}%)`,
          `scaleX(${i % 2 ===0 ? 100 : -100}%)`,
          `scaleY(${j % 2 === 0 ? 100 : -100}%)`
        ].join(' '),
      }
      const tileIJ = <InfiniteHammerAreaTile style={styleIJ} key={`${i},${j}`}>{props.children}</InfiniteHammerAreaTile>
      tiles.push(tileIJ)
    }
  }

  const innerStyle: CSSProperties = {
    transform: `translateX(${values.x}px) translateY(${values.y}px) rotate(${values.r}deg) scale(${values.s * 100}%)`
  }

  const hammerAreaStyle: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  }

  const hammerAreaProps: HammerAreaProps = Object.assign({}, props)
  hammerAreaProps.children = undefined

  return (
    <InfiniteHammerAreaOuter ref={ref}>
      <InfiniteHammerAreaInner style={innerStyle}>
        {tiles}
      </InfiniteHammerAreaInner>
      <HammerArea
        {... hammerAreaProps}
        onChange={handleHammerAreaChange}
        style={hammerAreaStyle}
      />
    </InfiniteHammerAreaOuter>
  )
}
