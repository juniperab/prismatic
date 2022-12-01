import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface ConfigState {
  foo: string // placeholder for when I need application-level configuration again
}

const initialState: ConfigState = {
  foo: 'bar'
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setFoo: (state, action: PayloadAction<string>) => {
      state.foo = action.payload
    }
  }
})

export const { setFoo } = configSlice.actions
export const selectConfigState = (state: RootState): ConfigState => state.config
export default configSlice.reducer
