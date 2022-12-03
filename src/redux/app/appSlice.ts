import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { ThemeName } from '../../react/components/theme/theme'

export interface AppState {
  activeModal?: ModalType
  theme: ThemeName
}

export enum ModalType {
  help = 'help',
  user = 'user',
  settings = 'settings',
}

const initialState: AppState = {
  theme: ThemeName.light,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveModal: (state, action: PayloadAction<ModalType | undefined>) => {
      state.activeModal = action.payload
    },
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.theme = action.payload
    },
    toggleTheme: (state) => {
      if (state.theme === ThemeName.light) state.theme = ThemeName.dark
      else state.theme = ThemeName.light
    },
  },
})

export const { setActiveModal, setTheme, toggleTheme } = appSlice.actions
export const selectAppState = (state: RootState): AppState => state.app
export default appSlice.reducer
