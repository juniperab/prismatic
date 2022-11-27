import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RGBColor} from "react-color";
import {RootState} from "../../store";

export type PuzzleMode = 'rgb' | 'hsl' | 'hsv'

export interface HintSpec {
    hueCutoff: number;
    hueStep: number;
}

export interface PuzzleState {
    hintSpec: HintSpec;
    mode: PuzzleMode;
    target: RGBColor;
}

const initialState: PuzzleState = {
    hintSpec: {
        hueCutoff: 60,
        hueStep: 30,
    },
    mode: 'hsv',
    target: {r: 40, g: 200, b: 100},
}

export const puzzleSlice = createSlice({
    name: 'puzzle',
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<PuzzleMode>) => {
            state.mode = action.payload
        },
        setTarget: (state, action: PayloadAction<RGBColor>) => {
            state.target = action.payload
        },
    }
})

export const { setMode, setTarget } = puzzleSlice.actions
export const selectPuzzleState = (state: RootState) => state.puzzle
export default puzzleSlice.reducer
