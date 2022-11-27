import {RGBColor} from "react-color";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";


export interface ColourGuesserState {
    colour: RGBColor;
    previousGuesses: RGBColor[];
}

const initialState: ColourGuesserState = {
    colour: {r: 75, g: 144, b: 226},
    previousGuesses: [
        {r: 208, g: 2, b: 27},
        {r: 65, g: 117, b: 5},
        {r: 88, g: 149, b: 91},
        {r: 80, g: 55, b: 101},
    ],
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
