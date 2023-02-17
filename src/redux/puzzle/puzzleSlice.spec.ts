import reducer, { PuzzleState } from './puzzleSlice'
import { AnyColour } from '../../lib/colour/colours'

describe('puzzle reducer', () => {
  it('should handle initial state', () => {
    const realStartingColour: AnyColour = { h: 120, s: 50, b: 50 }
    const realInitialState: PuzzleState = {
      currentColour: realStartingColour,
      gaveUp: false,
      guesses: [],
      hints: [],
      puzzleId: undefined,
    }
    expect(reducer(undefined, { type: 'unknown' })).toEqual(realInitialState)
  })
})
