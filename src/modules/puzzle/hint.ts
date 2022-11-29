import {AnyColor} from "../../lib/colour/colourConversions";

export type Hint = HSVHint

export interface HintItem {
    colour: AnyColor;
    value: number;
}
export interface BaseHint {
    guessedColour: AnyColor;
}
export interface HSVHint extends BaseHint {
    hue?: HintItem;
    saturation?: HintItem;
    brightness?: HintItem;
}
