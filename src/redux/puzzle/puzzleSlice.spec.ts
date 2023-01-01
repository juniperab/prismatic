import reducer, { PuzzleState } from './puzzleSlice'
import { getPuzzleId, Puzzle } from '../../lib/puzzle/puzzle'
import { AnyColour } from '../../lib/colour/colours'

describe('puzzle reducer', () => {
  it('should handle initial state', () => {
    const realInitialPuzzle: Puzzle = {
      answer: 'white',
      precision: 3,
    }
    const realStartingColour: AnyColour = { h: 120, s: 50, b: 50 }
    const realInitialState: PuzzleState = {
      currentColour: realStartingColour,
      gaveUp: false,
      guesses: [],
      hints: [],
      puzzleId: getPuzzleId(realInitialPuzzle),
    }
    expect(reducer(undefined, { type: 'unknown' })).toEqual(realInitialState)
  })
})
