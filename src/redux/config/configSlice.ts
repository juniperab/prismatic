import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { HintType } from '../../lib/puzzle/hint/hint'

export interface ConfigState {
  guessGridShape: [number, number] // cols, rows
  hintType: HintType
}

const initialState: ConfigState = {
  guessGridShape: [2, 3],
  hintType: HintType.HSB,
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setHintType: (state, action: PayloadAction<HintType>) => {
      state.hintType = action.payload
    },
    setGuessGridShape: (state, action: PayloadAction<[number, number]>) => {
      state.guessGridShape = action.payload
    },
  },
})

export const { setHintType, setGuessGridShape } = configSlice.actions
export const selectConfigState = (state: RootState): ConfigState => state.config
export default configSlice.reducer
