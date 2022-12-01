import {AnyColor, NamedColor, toHSB, toHSL, toNamed, toRGB} from "../../colour/colourConversions";
import {generateRandomColour} from "../../colour/colourMath";
import {getPuzzleId, loadPuzzleById, PuzzleId, PuzzleMode} from "./puzzle";
import {Hint, visitHintItems} from "./hint";
import {puzzleConfig} from "../puzzleConfig";
import {generateHintRGB} from "../hint/hintGeneratorRGB";
import {generateHintHSL} from "../hint/hintGeneratorHSL";
import {generateHintHSB} from "../hint/hintGeneratorHSB";

export interface ClientPuzzleSpec {
    puzzleId: PuzzleId,
    mode: PuzzleMode,
    precision: number,
}

const initialAnswer = 'mediumseagreen' as NamedColor
const initialPuzzle = {
    answer: toHSB(initialAnswer),
    answerName: toNamed(initialAnswer),
    mode: 'hsb' as 'hsb',
    precision: 3,
}

export function getInitialPuzzle(): ClientPuzzleSpec {
    return {
        puzzleId: getPuzzleId(initialPuzzle),
        mode: initialPuzzle.mode,
        precision: initialPuzzle.precision
    }
}

export function getNewPuzzle(): ClientPuzzleSpec {
    const answer = toNamed(generateRandomColour())
    const newPuzzleSpec = {
        answer: toHSB(answer),
        answerName: toNamed(answer),
        mode: initialPuzzle.mode,
        precision: initialPuzzle.precision,
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
