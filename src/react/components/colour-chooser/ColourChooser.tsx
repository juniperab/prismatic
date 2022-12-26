import { CSSProperties, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import {
  ColourChooserInner,
  ColourChooserOuter,
  ColourChooserSelection,
  ColourChooserSelectionPending,
} from './colourChooserLayout'
import { InfiniteHammerArea } from '../hammer/InfiniteHammerArea'
import { AnyColor, HSBColor, toCssColour, toHSB } from '../../../lib/colour/colourConversions'
import { rotateHue } from '../../../lib/colour/colourMath'
import { ColourChooserHelpOverlay, OverlayState, useOverlayState } from './ColourChooserHelpOverlay'
import { defaultTo } from 'lodash'
import { HammerOnChangeCallback, HammerOnResizeCallback, HammerOnTapCallback } from '../hammer/hammerAreaTypes'

export type NewColourCallback = (colour: HSBColor) => void

export interface ColourChooserProps {
  // callback triggered when the colour is changed in any way, even during a gesture
  onChange?: NewColourCallback

  // callback triggered when a gesture completes
  onChangeComplete?: NewColourCallback

  // callback triggered when the selection area is tapped
  onSelect?: () => void
  colour?: AnyColor
}

const initialOverlayState: OverlayState = {
  show: false, // TODO: either make this 'true' or add a way to manually show it
  ticksBeforeHide: 20,
}

const defaultInitialColour: AnyColor = 'mediumseagreen' // { h: 0, s: 50, b: 50 }

export function ColourChooser(props: ColourChooserProps): ReactElement {
  console.log('RENDER COLOUR CHOOSER START')
  console.log(props)
  const { onChange, onChangeComplete, onSelect } = props
  const selectorRef = useRef<HTMLDivElement>(null)
  const [propsColourHSB, setPropsColourHSB] = useState(toHSB(props.colour ?? defaultInitialColour))
  const [newPropsColour, setNewPropsColour] = useState(true)
  const [width, setWidth] = useState(1)
  const [height, setHeight] = useState(1)
  const [hue, setHue] = useState(propsColourHSB.h)
  const [saturation, setSaturation] = useState(propsColourHSB.s)
  const [brightness, setBrightness] = useState(propsColourHSB.b)
  const [saturationTile, setSaturationTile] = useState(0)
  const [brightnessTile, setBrightnessTile] = useState(0)
  const [overlay, showOverlay, tickOverlay] = useOverlayState(initialOverlayState)
  const [dragging, setDragging] = useState(false)
  const [selectionPending, setSelectionPending] = useState(false)

  console.log(`[main] current props colour: (${propsColourHSB.h}, ${propsColourHSB.s}, ${propsColourHSB.b}) is ${newPropsColour ? 'new' : 'old'} `)
  console.log(`[main] current state colour: (${hue}, ${saturation}, ${brightness})`)

  const updateHue: (rotation: number) => number = useCallback(
    (rotation) => {
      const newHue = rotateHue(rotation, 0)
      setHue(newHue)
      return newHue
    },
    [setHue]
  )

  const updateSaturation: (x: number) => number = useCallback(
    (x) => {
      const pctX = x / Math.max(width, 1)
      setSaturationTile(Math.floor(pctX + 0.5))
      let newSaturation = Math.abs(-1 * pctX * 100 + 50) % 200
      newSaturation = newSaturation > 100 ? 200 - newSaturation : newSaturation
      setSaturation(newSaturation)
      return newSaturation
    },
    [setSaturation, width]
  )

  const updateBrightness: (y: number) => number = useCallback(
    (y) => {
      const pctY = y / Math.max(height, 1)
      setBrightnessTile(Math.floor(pctY + 0.5))
      let newBrightness = Math.abs(pctY * 100 + 50) % 200
      newBrightness = newBrightness > 100 ? 200 - newBrightness : newBrightness
      setBrightness(newBrightness)
      return newBrightness
    },
    [setBrightness, height]
  )

  useEffect(() => {
    console.log('[useEffect] ---')
    console.log(props)
    if (props.colour !== undefined) {
      const newPropsColourHSB: HSBColor = toHSB(props.colour)
      if (propsColourHSB !== newPropsColourHSB) {
        setHue(newPropsColourHSB.h)
        setSaturation(newPropsColourHSB.s)
        setBrightness(newPropsColourHSB.b)
        setPropsColourHSB(newPropsColourHSB)
        setNewPropsColour(true)
        console.log(`[useEffect] new propsColour (${newPropsColourHSB.h}, ${newPropsColourHSB.s}, ${newPropsColourHSB.b})`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const handleHammerAreaChange: HammerOnChangeCallback = (newData) => {
    const { newValues, gestureComplete } = newData
    const { rotation, x, y } = newValues
    console.log(`[handleHammerAreaChange] from hammer: r: ${rotation}, x: ${x}, y: ${y}`)
    tickOverlay(1)
    setDragging(!gestureComplete)
    setSelectionPending(false)
    setNewPropsColour(false)
    const newColour = {
      h: updateHue(rotation),
      s: updateSaturation(x),
      b: updateBrightness(y),
    }
    console.log(`[handleHammerAreaChange] new colour: (${newColour.h}, ${newColour.s}, ${newColour.b})`)
    defaultTo(gestureComplete ? onChangeComplete : onChange, () => {})(newColour)
  }

  const handleHammerAreaResize: HammerOnResizeCallback = (width, height) => {
    console.log(`[handleHammerAreaResize] w: ${width}, h: ${height}`)
    setWidth(width)
    setHeight(height)
  }

  const handleHammerAreaTap: HammerOnTapCallback = (x, y, target: HTMLElement) => {
    console.log('[handleHammerAreaTap] ---')
    if (overlay.show) {
      showOverlay(false)
      return
    }
    if (target === selectorRef.current) {
      if (selectionPending) {
        setSelectionPending(false)
        if (onSelect !== undefined) onSelect()
      } else {
        setSelectionPending(true)
      }
    } else {
      setSelectionPending(false)
    }
  }

  const overlayStyle: CSSProperties = {
    backgroundColor: toCssColour({ h: hue, s: 50, b: 100, a: 50 }),
  }
  const selectorColour = toCssColour({ h: hue, s: saturation, b: brightness })
  const selectionStyle: CSSProperties = {
    backgroundColor: selectorColour,
    cursor: dragging ? undefined : 'pointer',
  }
  console.log(`[main] selector colour: (${hue}, ${saturation}, ${brightness}) = ${selectorColour}`)

  const underlayComponent = <ColourChooserHelpOverlay style={overlayStyle} visible={overlay.show} />
  const overlayComponent = selectionPending ? (
    <ColourChooserSelectionPending data-show={!overlay.show} ref={selectorRef} style={selectionStyle} />
  ) : (
    <ColourChooserSelection data-show={!overlay.show} ref={selectorRef} style={selectionStyle} />
  )

  console.log(`[main] tiles: s: ${saturationTile}, b: ${brightnessTile}`)
  const hammerValues = newPropsColour ? {
    x: (50 - propsColourHSB.s) * width / 100, // - (width * saturationTile),
    y: (propsColourHSB.b - 50) * height / 100, // - (height * brightnessTile),
    rotation: propsColourHSB.h,
  } : undefined
  if (hammerValues !== undefined) {
    if (saturationTile % 2 !== 0) hammerValues.x = width - hammerValues.x
    if (brightnessTile % 2 !== 0) hammerValues.y = height - hammerValues.y
    console.log(`[main] current size: w: ${width}, h: ${height}`)
    console.log(`[main] to hammer: r: ${hammerValues.rotation}, x: ${hammerValues.x}, y: ${hammerValues.y}`)
  }

  const result = (
    <ColourChooserOuter>
      <InfiniteHammerArea
        clampScale={[1, 10]}
        lockRotation={true}
        values={hammerValues}
        mirrorTiles={true}
        onChange={handleHammerAreaChange}
        onResize={handleHammerAreaResize}
        onTap={handleHammerAreaTap}
        underlay={underlayComponent}
        overlay={overlayComponent}
        style={{
          height: '100%',
          position: 'relative',
          width: '100%',
        }}
      >
        <ColourChooserInner
          style={{
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
          }}
        />
      </InfiniteHammerArea>
    </ColourChooserOuter>
  )
  console.log('RENDER COLOUR CHOOSER END')
  return result
}
