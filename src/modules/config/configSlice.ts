import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../redux/store";
import {HintConfig} from "./hintConfig";

export interface Config {
    hint: HintConfig
}

export const initialState: Config = {
    hint: {
        hsb: {
            hueCutoff: 90,
            hueStep: 90,
            saturationCutoff: 25,
            brightnessCutoff: 25,
            brightnessStep: 25,
        }
    },
}

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setHintConfig: (state, action: PayloadAction<HintConfig>) => {
            state.hint = action.payload
        },
    },
})

export const { setHintConfig } = configSlice.actions
export const selectConfigState = (state: RootState) => state.config
export default configSlice.reducer
