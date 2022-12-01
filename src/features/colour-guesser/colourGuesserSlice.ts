import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../redux/store";
import {AnyColor, NamedColor} from "../../lib/colour/colourConversions";

export interface ColourGuesserState {
    currentColour: AnyColor;
    startingColour: AnyColor;
}

const startingColour = 'mediumslateblue' as NamedColor

const initialState: ColourGuesserState = {
    currentColour: startingColour,
    startingColour: startingColour
}

export const colourGuesserSlice = createSlice({
    name: 'colourGuesser',
    initialState,
    reducers: {
        setCurrentColour: (state, action: PayloadAction<AnyColor>) => {
            state.currentColour = action.payload
        },
        setStartingColour: (state, action: PayloadAction<AnyColor>) => {
            state.startingColour = action.payload
        }
    }
})

export const { setCurrentColour, setStartingColour  } = colourGuesserSlice.actions
export const selectColourGuesserState = (state: RootState) => state.colourGuesser
export default colourGuesserSlice.reducer
