import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import app from './app/appSlice'
import config from './config/configSlice'
import debug from './debug/debugSlice'
import puzzle from './puzzle/puzzleSlice'

export const store = configureStore({
  reducer: {
    app,
    config,
    debug,
    puzzle
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
