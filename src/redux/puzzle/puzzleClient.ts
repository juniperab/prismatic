import {AnyColor, NamedColor} from "../../lib/colour/colourConversions";
import {Hint} from "../../lib/puzzle/hint/hint";
import {PuzzleId} from "../../lib/puzzle/puzzle";
import {makeGuess, revealAnswer} from "../../lib/puzzle/puzzleServer";

export function submitGuessToServer(guess: AnyColor, puzzleId: PuzzleId): Promise<Hint | NamedColor> {
    return new Promise<Hint | NamedColor>((resolve) => {
        // a mock call to a server-side puzzle controller
        resolve(makeGuess(guess, puzzleId))
    })
}

export function getPuzzleAnswerFromServer(puzzleId: PuzzleId): Promise<NamedColor> {
    return new Promise<NamedColor>((resolve) => {
        // a mock call to a server-side puzzle controller
        resolve(revealAnswer(puzzleId))
    })
}
