import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../redux/store";
import {PuzzleMode} from "../../lib/puzzle/api/puzzle";


export interface DebugState {
    displayMode: PuzzleMode
}

const initialState: DebugState = {
    displayMode: 'hsb',
}

export const debugSlice = createSlice({
    name: 'debug',
    initialState,
    reducers: {
        setDisplayMode: (state, action: PayloadAction<PuzzleMode>) => {
            state.displayMode = action.payload
        },
    }
})

export const { setDisplayMode  } = debugSlice.actions
export const selectDebugState = (state: RootState) => state.debug
export default debugSlice.reducer
