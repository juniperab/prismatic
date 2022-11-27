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
        {r: 139, g: 87, b: 42},
        {r: 144, g: 19, b: 254},
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
