import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";

export interface AppState {
    showHelp: boolean;
}

export const initialState: AppState = {
    showHelp: false,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setHelpVisible: (state, action: PayloadAction<boolean>) => {
            state.showHelp = action.payload
        },
    },
})

export const { setHelpVisible } = appSlice.actions
export const selectAppState = (state: RootState) => state.app
export default appSlice.reducer
