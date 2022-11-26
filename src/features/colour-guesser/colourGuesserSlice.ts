import {RGBColor} from "react-color";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";


export interface ColourGuesserState {
    colour: RGBColor;
    previousGuesses: RGBColor[];
}

const initialState: ColourGuesserState = {
    colour: {r: 40, g: 200, b: 100},
    previousGuesses: [],
}

export const colourGuesserSlice = createSlice({
    name: 'colourGuesser',
    initialState,
    reducers: {
        guessCurrentColour: (state) => {
            state.previousGuesses.push(state.colour)
        },
        selectColour: (state, action: PayloadAction<RGBColor>) => {
            state.colour = action.payload
        },
    }
})

export const { guessCurrentColour, selectColour  } = colourGuesserSlice.actions
export const selectColourGuesserState = (state: RootState) => state.colourGuesser
export default colourGuesserSlice.reducer
