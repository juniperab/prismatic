import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { ThemeName } from '../../react/components/theme/theme'

export interface AppState {
  showHelp: boolean
  theme: ThemeName
}

const initialState: AppState = {
  showHelp: false,
  theme: ThemeName.light,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setHelpVisible: (state, action: PayloadAction<boolean>) => {
      state.showHelp = action.payload
    },
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.theme = action.payload
    },
    toggleTheme: (state) => {
      if (state.theme === ThemeName.light) state.theme = ThemeName.dark
      else state.theme = ThemeName.light
    }
  },
})

export const { setHelpVisible, setTheme, toggleTheme } = appSlice.actions
export const selectAppState = (state: RootState): AppState => state.app
export default appSlice.reducer
