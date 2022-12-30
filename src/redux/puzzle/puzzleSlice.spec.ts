import reducer, { PuzzleState, setCurrentColour, setStartingColour } from './puzzleSlice'
import { getPuzzleId, Puzzle } from '../../lib/puzzle/puzzle'
import { HintType } from '../../lib/puzzle/hint/hint'
import { NamedColour } from '../../lib/colour/colours'

const testInitialPuzzle: Puzzle = {
  answer: 'brickred',
  precision: 3,
}
const testStartingColour: NamedColour = 'yellow'
const testInitialState: PuzzleState = {
  currentColour: testStartingColour,
  gaveUp: false,
  guesses: [],
  hints: [],
  guessMode: HintType.HSB,
  puzzleId: getPuzzleId(testInitialPuzzle),
  startingColour: testStartingColour,
}

describe('puzzle reducer', () => {
  it('should handle initial state', () => {
    const realInitialPuzzle: Puzzle = {
      answer: 'mediumseagreen',
      precision: 3,
    }
    const realStartingColour: NamedColour = 'slateblue'
    const realInitialState: PuzzleState = {
      currentColour: realStartingColour,
      gaveUp: false,
      guesses: [],
      hints: [],
      guessMode: HintType.HSB,
      puzzleId: getPuzzleId(realInitialPuzzle),
      startingColour: realStartingColour,
    }
    expect(reducer(undefined, { type: 'unknown' })).toEqual(realInitialState)
  })
  it('should handle setCurrentColour', () => {
    const actual = reducer(testInitialState, setCurrentColour({ r: 41, g: 201, b: 101 }))
    expect(actual.currentColour).toEqual({ r: 41, g: 201, b: 101 })
    expect(actual.startingColour).toEqual(testInitialState.startingColour)
  })
  it('should handle setStartingColour', () => {
    const actual = reducer(testInitialState, setStartingColour({ r: 41, g: 201, b: 101 }))
    expect(actual.startingColour).toEqual({ r: 41, g: 201, b: 101 })
    expect(actual.currentColour).toEqual(testInitialState.currentColour)
  })
})
