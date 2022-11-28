import {RGBColor} from "react-color";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {AnyColor, generateRandomColour} from "../../app/utils/colourMath";


export interface ColourGuesserState {
    colour: AnyColor;
    previousGuesses: AnyColor[];
}

const initialState: ColourGuesserState = {
    colour: generateRandomColour(), // TODO: this should not be done in the initialState, I think
    previousGuesses: [],
}

export const colourGuesserSlice = createSlice({
    name: 'colourGuesser',
    initialState,
    reducers: {
        guessColour: (state, action: PayloadAction<AnyColor>) => {
            state.colour = action.payload
            state.previousGuesses.push(action.payload)
        },
        guessCurrentColour: (state) => {
            state.previousGuesses.push(state.colour)
        },
        selectColour: (state, action: PayloadAction<AnyColor>) => {
            state.colour = action.payload
        },
        clearGuesses: (state) => {
            state.previousGuesses = []
        }
    }
})

export const { guessColour, guessCurrentColour, selectColour, clearGuesses  } = colourGuesserSlice.actions
export const selectColourGuesserState = (state: RootState) => state.colourGuesser
export default colourGuesserSlice.reducer
