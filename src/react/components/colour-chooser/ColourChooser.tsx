import { CSSProperties, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import {
  ColourChooserFullscreenToggle, ColourChooserHelpButton,
  ColourChooserInner,
  ColourChooserOuter, ColourChooserOuterFullscreen, ColourChooserOverlay,
  ColourChooserSelection,
  ColourChooserSelectionPending
} from "./colourChooserLayout";
import { InfiniteHammerArea } from '../hammer/InfiniteHammerArea'
import { AnyColor, HSBColor, toCssColour, toHSB } from '../../../lib/colour/colourConversions'
import { rotateHue } from '../../../lib/colour/colourMath'
import { ColourChooserHelpOverlay, HelpOverlayState, useHelpOverlayState } from './ColourChooserHelpOverlay'
import { defaultTo } from 'lodash'
import { HammerOnChangeCallback, HammerOnResizeCallback, HammerOnTapCallback } from '../hammer/hammerAreaTypes'
import { useTheme } from "styled-components";
import { Theme } from "../theme/theme";

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

const initialHelpOverlayState: HelpOverlayState = {
  show: false,
  ticksBeforeHide: 20,
}

const defaultInitialColour: AnyColor = { h: 0, s: 50, b: 50 }

export function ColourChooser(props: ColourChooserProps): ReactElement {
  const { onChange, onChangeComplete, onSelect } = props
  const [propsColourHSB, setPropsColourHSB] = useState(toHSB(props.colour ?? defaultInitialColour))
  const [hasNewPropsColour, setHasNewPropsColour] = useState(true)

  const selectorRef = useRef<HTMLDivElement>(null)
  const helpButtonRef = useRef<HTMLDivElement>(null)
  const fullscreenToggleRef = useRef<HTMLDivElement>(null)
  const theme = useTheme() as Theme

  const [brightness, setBrightness] = useState(propsColourHSB.b)
  const [brightnessTile, setBrightnessTile] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [height, setHeight] = useState(1)
  const [hue, setHue] = useState(propsColourHSB.h)
  const [helpOverlay, showHelpOverlay, tickHelpOverlay] = useHelpOverlayState(initialHelpOverlayState)
  const [saturation, setSaturation] = useState(propsColourHSB.s)
  const [saturationTile, setSaturationTile] = useState(0)
  const [selectionPending, setSelectionPending] = useState(false)
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(1)

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
    if (props.colour !== undefined) {
      const newPropsColourHSB: HSBColor = toHSB(props.colour)
      if (propsColourHSB !== newPropsColourHSB) {
        setHue(newPropsColourHSB.h)
        setSaturation(newPropsColourHSB.s)
        setBrightness(newPropsColourHSB.b)
        setPropsColourHSB(newPropsColourHSB)
        setHasNewPropsColour(true)
      }
    }
    setVisible(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const handleHammerAreaChange: HammerOnChangeCallback = (newData) => {
    const { newValues, gestureComplete } = newData
    const { rotation, x, y } = newValues
    tickHelpOverlay(1)
    setDragging(!gestureComplete)
    setSelectionPending(false)
    setHasNewPropsColour(false)
    const newColour = {
      h: updateHue(rotation),
      s: updateSaturation(x),
      b: updateBrightness(y),
    }
    defaultTo(gestureComplete ? onChangeComplete : onChange, () => {})(newColour)
  }

  const handleHammerAreaResize: HammerOnResizeCallback = (width, height) => {
    setWidth(width)
    setHeight(height)
  }

  const handleHammerAreaTap: HammerOnTapCallback = (x, y, target: HTMLElement) => {
    console.log(target)
    if (helpOverlay.show) {
      showHelpOverlay(false)
    } else if (target === selectorRef.current) {
      setSelectionPending(!selectionPending)
      if (selectionPending && onSelect !== undefined) onSelect()
      if (selectionPending) setFullscreen(false)
    } else {
      setSelectionPending(false)
    }
  }

  const hammerAreaStyle: CSSProperties = {
    height: '100%',
    position: 'relative',
    width: '100%',
  }
  const innerStyle: CSSProperties = {
    backgroundColor: `hsl(${hue}, 100%, 50%)`,
  }
  const helpOverlayStyle: CSSProperties = {
    backgroundColor: toCssColour({ h: hue, s: 50, b: 100, a: 50 }),
  }
  const selectionStyle: CSSProperties = {
    backgroundColor: toCssColour({ h: hue, s: saturation, b: brightness }),
    cursor: dragging ? undefined : 'pointer',
  }


  const helpOverlapComponent = <ColourChooserHelpOverlay style={helpOverlayStyle} visible={helpOverlay.show} />

  const overlayComponent = (
    <ColourChooserOverlay data-show={!helpOverlay.show}>
      <ColourChooserHelpButton color='white' onClick={() => showHelpOverlay(true)}>
        <theme.icons.question.svg />
      </ColourChooserHelpButton>
      <ColourChooserFullscreenToggle color='white' onClick={() => setFullscreen(!fullscreen)}>
        { fullscreen ? <theme.icons.minimize.svg /> : <theme.icons.expand.svg /> }
      </ColourChooserFullscreenToggle>
      { selectionPending ? (
        <ColourChooserSelectionPending ref={selectorRef} style={selectionStyle} />
      ) : (
        <ColourChooserSelection ref={selectorRef} style={selectionStyle} />
      )}
    </ColourChooserOverlay>
  )

  const hammerValues = hasNewPropsColour ? {
    x: (50 - propsColourHSB.s) * width / 100,
    y: (propsColourHSB.b - 50) * height / 100,
    rotation: propsColourHSB.h,
  } : undefined
  if (hammerValues !== undefined) {
    if (saturationTile % 2 !== 0) hammerValues.x = width - hammerValues.x
    if (brightnessTile % 2 !== 0) hammerValues.y = height - hammerValues.y
  }

  const colourChooserContents = (
    <InfiniteHammerArea
      clampScale={[1, 10]}
      lockRotation={true}
      values={hammerValues}
      mirrorTiles={true}
      onChange={handleHammerAreaChange}
      onResize={handleHammerAreaResize}
      onTap={handleHammerAreaTap}
      underlay={helpOverlapComponent}
      overlay={overlayComponent}
      style={hammerAreaStyle}
    >
      <ColourChooserInner style={innerStyle} />
    </InfiniteHammerArea>
  )

  if (fullscreen) return (
    <ColourChooserOuterFullscreen data-show={visible}>
      {colourChooserContents}
    </ColourChooserOuterFullscreen>
  )

  return (
    <ColourChooserOuter data-show={visible}>
      {colourChooserContents}
    </ColourChooserOuter>
  )
}
