import {AnyColor, NamedColor} from "../../lib/colour/colourConversions";
import {Hint} from "../../lib/puzzle/api/hint";
import {PuzzleId} from "../../lib/puzzle/api/puzzle";
import {makeGuess, revealAnswer} from "../../lib/puzzle/api/client";

export function submitGuessToServer(guess: AnyColor, puzzleId: PuzzleId): Promise<Hint | NamedColor> {
    return new Promise<Hint | NamedColor>((resolve) => {
        // a mock call to a server-side puzzle controller
        setTimeout(() => resolve(makeGuess(guess, puzzleId)), 100)
    })
}

export function getPuzzleAnswerFromServer(puzzleId: PuzzleId): Promise<NamedColor> {
    return new Promise<NamedColor>((resolve) => {
        // a mock call to a server-side puzzle controller
        setTimeout(() => resolve(revealAnswer(puzzleId)), 100)
    })
}
