import reducer, {setCurrentColour, setStartingColour} from './puzzleSlice'
import {PuzzleState} from "./puzzleSlice";
import {AnyColor, toHSB, toNamed} from "../../lib/colour/colourConversions";
import {getPuzzleId, Puzzle} from "../../lib/puzzle/puzzle";

const testInitialPuzzle: Puzzle = {
    answer: toHSB('brickred'),
    answerName: toNamed('brickred'),
    mode: 'hsb',
    precision: 3,
}
const testStartingColour: AnyColor = 'yellow'
const testInitialState: PuzzleState = {
    currentColour: testStartingColour,
    gaveUp: false,
    hints: [],
    mode: testInitialPuzzle.mode,
    precision: testInitialPuzzle.precision,
    puzzleId: getPuzzleId(testInitialPuzzle),
    startingColour: testStartingColour,
}

describe('puzzle reducer', () => {
    it('should handle initial state', () => {
        const realInitialPuzzle: Puzzle = {
            answer: toHSB('mediumseagreen'),
            answerName: toNamed('mediumseagreen'),
            mode: 'hsb',
            precision: 3,
        }
        const realStartingColour: AnyColor = 'slateblue'
        const realInitialState: PuzzleState = {
            currentColour: realStartingColour,
            gaveUp: false,
            hints: [],
            mode: realInitialPuzzle.mode,
            precision: realInitialPuzzle.precision,
            puzzleId: getPuzzleId(realInitialPuzzle),
            startingColour: realStartingColour,
        }
        expect(reducer(undefined, { type: 'unknown' })).toEqual(realInitialState);
    })
    it('should handle setCurrentColour', () => {
        const actual = reducer(testInitialState, setCurrentColour({r: 41, g: 201, b: 101}))
        expect(actual.currentColour).toEqual({r: 41, g: 201, b: 101})
        expect(actual.startingColour).toEqual(testInitialState.startingColour)
    })
    it('should handle setStartingColour', () => {
        const actual = reducer(testInitialState, setStartingColour({r: 41, g: 201, b: 101}))
        expect(actual.startingColour).toEqual({r: 41, g: 201, b: 101})
        expect(actual.currentColour).toEqual(testInitialState.currentColour)
    })
})
