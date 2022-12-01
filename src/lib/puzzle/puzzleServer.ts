import {AnyColor, NamedColor, toHSB, toHSL, toNamed, toRGB} from "../colour/colourConversions";
import {generateRandomColour} from "../colour/colourMath";
import {getPuzzleId, loadPuzzleById, Puzzle, PuzzleId, PuzzleMode} from "./puzzle";
import {Hint, visitHintItems} from "./hint/hint";
import {puzzleConfig} from "./puzzleConfig";
import {generateHintRGB} from "./hint/hintGeneratorRGB";
import {generateHintHSL} from "./hint/hintGeneratorHSL";
import {generateHintHSB} from "./hint/hintGeneratorHSB";

export interface ClientPuzzleSpec {
    puzzleId: PuzzleId,
    mode: PuzzleMode,
    precision: number,
}

export function getNewPuzzle(): ClientPuzzleSpec {
    const answer = toNamed(generateRandomColour())
    const newPuzzleSpec: Puzzle = {
        answer: toHSB(answer),
        answerName: toNamed(answer),
        mode: 'hsb',
        precision: 3,
    }
    return {
        puzzleId: getPuzzleId(newPuzzleSpec),
        mode: newPuzzleSpec.mode,
        precision: newPuzzleSpec.precision
    }
}

export function makeGuess(guess: AnyColor, puzzleId: PuzzleId): Hint | NamedColor {
    const puzzle = loadPuzzleById(puzzleId)
    const hintConfig = puzzleConfig.hint
    let hint
    switch(puzzle.mode) {
        case 'rgb': hint = generateHintRGB(toRGB(guess), puzzle, hintConfig.rgb); break;
        case 'hsl': hint = generateHintHSL(toHSL(guess), puzzle, hintConfig.hsl); break;
        case 'hsb': hint = generateHintHSB(toHSB(guess), puzzle, hintConfig.hsb); break;
        default: throw new Error("invalid mode")
    }
    if (visitHintItems(hint, item => item).every(item => item?.match)) {
        return puzzle.answerName
    }
    return hint
}

export function revealAnswer(puzzleId: PuzzleId): NamedColor {
    const puzzle = loadPuzzleById(puzzleId)
    return puzzle.answerName
}
