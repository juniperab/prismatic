import {AnyColor, HSBColor} from "../../colour/colourConversions";
import {HSLColor, RGBColor} from "react-color";
import base64 from "base-64";
import utf8 from "utf8";
import {HintConfig} from "../hint/hintConfig";

export type PuzzleId = string;

export type PuzzleMode = 'rgb' | 'hsl' | 'hsb'

export type Puzzle = PuzzleRGB | PuzzleHSL | PuzzleHSB

interface PuzzleBase {
    answer: AnyColor
    answerName: string
    mode: PuzzleMode
    precision: number
}
export interface PuzzleRGB extends PuzzleBase {
    mode: 'rgb'
    answer: RGBColor
}

export interface PuzzleHSL extends PuzzleBase {
    mode: 'hsl'
    answer: HSLColor
}

export interface PuzzleHSB extends PuzzleBase {
    mode: 'hsb'
    answer: HSBColor
}

export interface PuzzleConfig {
    hint: HintConfig
}

export function getPuzzleId(puzzle: Puzzle): PuzzleId {
    return base64.encode(utf8.encode(JSON.stringify(puzzle)))
}

export function loadPuzzleById(id: PuzzleId): Puzzle {
    // theoretically, this function could load a stored puzzle definition from a database
    // for now, it will parse structured data stored in the PuzzleId string
    return JSON.parse(utf8.decode(base64.decode(id))) as Puzzle
}

