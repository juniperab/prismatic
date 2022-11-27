import reducer, {ColourGuesserState, guessCurrentColour, selectColour} from './colourGuesserSlice'

describe('colour-guesser reducer', () => {
    const initialState: ColourGuesserState = {
        colour: {r: 40, g: 200, b: 100},
        previousGuesses: [
            {r: 140, g: 201, b: 13},
            {r: 42, g: 198, b: 58},
        ],
        target: {r: 0, g: 0, b: 0},
    }
    it('should handle initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual({
            colour: {r: 40, g: 200, b: 100},
            previousGuesses: [],
        });
    })
    it('should handle guessCurrentColour', () => {
        const actual = reducer(initialState, guessCurrentColour())
        // colour should not have changed
        expect(actual.colour).toEqual({r: 40, g: 200, b: 100})
        // colour should have been added to the list of previous guesses
        expect(actual.previousGuesses.length).toEqual(3)
        expect(actual.previousGuesses).toEqual([
            {r: 140, g: 201, b: 13},
            {r: 42, g: 198, b: 58},
            {r: 40, g: 200, b: 100},
        ])
    })
    it('should handle selectColour', () => {
        const actual = reducer(initialState, selectColour({r: 41, g: 201, b: 101}))
        // colour should have been updated
        expect(actual.colour).toEqual({r: 41, g: 201, b: 101})
        // the list of previous guesses should not have changed
        expect(actual.previousGuesses.length).toEqual(2)
        expect(actual.previousGuesses).toEqual([
            {r: 140, g: 201, b: 13},
            {r: 42, g: 198, b: 58},
        ])
    })
})
