import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import app from "../modules/app/appSlice";
import colourGuesser from "../features/colour-guesser/colourGuesserSlice";
import puzzle from "../modules/puzzle/puzzleSlice";

export const store = configureStore({
  reducer: {
    app: app,
    colourGuesser: colourGuesser,
    puzzle: puzzle,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
