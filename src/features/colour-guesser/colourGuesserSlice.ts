import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../redux/store";
import {AnyColor} from "../../lib/colour/colourConversions";
import {generateRandomColour} from "../../lib/colour/colourMath";


export interface ColourGuesserState {
    colour: AnyColor;
    previousGuesses: AnyColor[];
    startingColour: AnyColor;
}

const startingColour = generateRandomColour() // TODO: this should not be done in the initialState, I think

const initialState: ColourGuesserState = {
    colour: startingColour,
    previousGuesses: [],
    startingColour: startingColour
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
        },
        setStartingColour: (state, action: PayloadAction<AnyColor>) => {
            state.startingColour = action.payload
        }
    }
})

export const { guessColour, guessCurrentColour, selectColour, clearGuesses, setStartingColour  } = colourGuesserSlice.actions
export const selectColourGuesserState = (state: RootState) => state.colourGuesser
export default colourGuesserSlice.reducer
