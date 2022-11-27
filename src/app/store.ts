import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import colourGuesser from "../features/colour-guesser/colourGuesserSlice";
import puzzle from "./modules/puzzle/puzzleSlice";

export const store = configureStore({
  reducer: {
    colourGuesser: colourGuesser,
    puzzle: puzzle,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
