import { CSSProperties, ReactElement, useState } from "react"
import {
  InfiniteInner,
  InfiniteOuter,
  InfiniteTile,
} from "./infiniteLayout"
import { useResizeDetector } from "react-resize-detector"
import { HammerArea } from "../hammer/HammerArea"

export interface InfiniteProps {
  children: ReactElement,
}

export function Infinite(props: InfiniteProps): ReactElement {
  const { children } = props
  const { width, height, ref } = useResizeDetector();
  const [delta, setDelta] = useState({ x: 0, y: 0, r: 0, s: 1 })

  const handleManipulate = (x: number, y: number, r: number, s: number): void => setDelta({ x, y, r, s })

  const actualWidth = Math.max(width !== undefined ? width : 1, 1)
  const actualHeight = Math.max(height !== undefined ? height : 1, 1)
  const actualDeltaX = delta.x // % (actualWidth * delta.s)
  const actualDeltaY = delta.y // % (actualHeight * delta.s)

  const contents = <div>
    {children}
    <div>width: {width}, height: {height}</div>
    <div>
      x: {Math.round(delta.x * 10000) / 10000},
      y: {Math.round(delta.y * 10000) / 10000}<br/>
      r: {Math.round(delta.r * 10000) / 10000},
      s: {Math.round(delta.s * 10000) / 10000}
    </div>
    {children}
    ...
    {children}
    ...
    {children}
    <div className='my-dot-centre' style={{
      position: 'absolute',
      width: '10px',
      height: '10px',
      backgroundColor: 'darkviolet',
      top: 'calc((100% - 10px) / 2)',
      left: 'calc((100% - 10px) / 2)',
    }}></div>
  </div>

  const tiles = []
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      const styleIJ: CSSProperties = {
        transform: `translateX(${i * 100}%) translateY(${j * 100}%)`,
      }
      const tileIJ = <InfiniteTile style={styleIJ} key={`${i},${j}`}>{contents}</InfiniteTile>
      tiles.push(tileIJ)
    }
  }

  const innerStyle: CSSProperties = {
    transform: `translateX(${actualDeltaX}px) translateY(${actualDeltaY}px) scale(${delta.s * 100}%) rotate(${delta.r}deg)`,
  }

  const hammerStyle: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  }

  return (
    <InfiniteOuter ref={ref}>
      <InfiniteInner style={innerStyle}>
        {tiles}
      </InfiniteInner>
      <HammerArea
        clampScale={[1, 10]}
        onChange={handleManipulate}
        style={hammerStyle}
      />
    </InfiniteOuter>
  )
}
