import reducer, {ColourGuesserState, setCurrentColour, setStartingColour} from './colourGuesserSlice'

describe('colour-guesser reducer', () => {
    const initialState: ColourGuesserState = {
        currentColour: {r: 40, g: 200, b: 100},
        startingColour: {r: 40, g: 200, b: 100},
    }
    it('should handle initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual({
            colour: {r: 40, g: 200, b: 100},
            previousGuesses: [],
        });
    })
    it('should handle setCurrentColour', () => {
        const actual = reducer(initialState, setCurrentColour({r: 41, g: 201, b: 101}))
        expect(actual.currentColour).toEqual({r: 41, g: 201, b: 101})
        expect(actual.startingColour).toEqual(initialState.startingColour)
    })
    it('should handle setStartingColour', () => {
        const actual = reducer(initialState, setStartingColour({r: 41, g: 201, b: 101}))
        expect(actual.startingColour).toEqual({r: 41, g: 201, b: 101})
        expect(actual.currentColour).toEqual(initialState.currentColour)
    })
})
