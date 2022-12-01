import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../redux/store";

export interface Config {
    foo: string // placeholder for when I need application-level configuration again
}

export const initialState: Config = {
    foo: 'bar',
}

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setFoo: (state, action: PayloadAction<string>) => {
            state.foo = action.payload
        },
    },
})

export const { setFoo } = configSlice.actions
export const selectConfigState = (state: RootState) => state.config
export default configSlice.reducer
