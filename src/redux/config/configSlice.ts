import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { HintStyle, HintType } from '../../lib/puzzle/hint'
import { AnyColour } from '../../lib/colour/colours'

export interface ConfigState {
  guessGridShape: [number, number] // cols, rows
  hintType: HintType
  hintStyle: HintStyle
  startingColour: AnyColour
}

export const guessGridShapePortrait: [number, number] = [1, 1]
export const guessGridShapeLandscape: [number, number] = [1, 1]

const initialState: ConfigState = {
  guessGridShape: guessGridShapePortrait,
  hintStyle: HintStyle.EASY,
  hintType: HintType.HSB,
  startingColour: { h: 120, s: 50, b: 50 },
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setHintStyle: (state, action: PayloadAction<HintStyle>) => {
      state.hintStyle = action.payload
    },
    setHintType: (state, action: PayloadAction<HintType>) => {
      state.hintType = action.payload
    },
    setLandscapeOrientation: (state) => {
      state.guessGridShape = guessGridShapeLandscape
    },
    setPortraitOrientation: (state) => {
      state.guessGridShape = guessGridShapePortrait
    },
    setStartingColour: (state, action: PayloadAction<AnyColour>) => {
      state.startingColour = action.payload
    },
  },
})

export const { setHintStyle, setHintType, setLandscapeOrientation, setPortraitOrientation, setStartingColour } =
  configSlice.actions
export const selectConfigState = (state: RootState): ConfigState => state.config
export default configSlice.reducer
