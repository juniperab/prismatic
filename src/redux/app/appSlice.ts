import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { ThemeName } from '../../react/components/theme/theme'

export interface AppState {
  activeModal?: ModalType
  activeView: ViewType
  theme: ThemeName
}

export enum ModalType {
  help = 'help',
  user = 'user',
  settings = 'settings',
}

export enum ViewType {
  playing = 'playing',
}

const initialState: AppState = {
  activeView: ViewType.playing,
  theme: ThemeName.light,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveModal: (state, action: PayloadAction<ModalType | undefined>) => {
      state.activeModal = action.payload
    },
    setActiveView: (state, action: PayloadAction<ViewType>) => {
      state.activeView = action.payload
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

export const { setActiveModal, setActiveView, setTheme, toggleTheme } = appSlice.actions
export const selectAppState = (state: RootState): AppState => state.app
export default appSlice.reducer
