import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { ThemeName } from '../../react/components/theme/theme'

export interface AppState {
  activeScreenView: ScreenView
  theme: ThemeName
}

export enum ScreenView {
  main = 'main', help = 'help', user = 'user', settings = 'settings'
}

const initialState: AppState = {
  activeScreenView: ScreenView.main,
  theme: ThemeName.light,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveScreenView: (state, action: PayloadAction<ScreenView>) => {
      state.activeScreenView = action.payload
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

export const { setActiveScreenView, setTheme, toggleTheme } = appSlice.actions
export const selectAppState = (state: RootState): AppState => state.app
export default appSlice.reducer
