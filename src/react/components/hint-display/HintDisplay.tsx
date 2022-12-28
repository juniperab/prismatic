import { ReactElement } from "react";
import { HintDisplayInner, HintDisplayOuter, HintDisplayQuadrant } from "./hintDisplayStyle";
import { Hint } from "../../../lib/puzzle/hint/hint";

export interface HintDisplayProps {
  hint?: Hint
}

export function HintDisplay(props: HintDisplayProps): ReactElement {
  return <HintDisplayOuter>
    <HintDisplayInner>
      <HintDisplayQuadrant style={{backgroundColor: 'blue'}}/>
      <HintDisplayQuadrant style={{backgroundColor: 'green'}}/>
      <HintDisplayQuadrant style={{backgroundColor: 'red'}}/>
      <HintDisplayQuadrant style={{backgroundColor: 'yellow'}}/>
    </HintDisplayInner>
  </HintDisplayOuter>
}
