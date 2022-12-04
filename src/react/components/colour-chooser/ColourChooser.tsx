import { ReactElement, useState } from "react"
import { ColourChooserCover, ColourChooserOuter } from "./colourChooserLayout"
import { HsvColorPicker } from "react-colorful"
import { Gestures } from "../gestures/Gestures"

export function ColourChooser(): ReactElement {
  const [eventType, setEventType] = useState<string>("");
  const handleGesture = (event: HammerInput): void => setEventType(event.type);

  return <ColourChooserOuter>

    <Gestures
      recognizers={{
        Pan: {
          events: {
            panleft: handleGesture,
            panright: handleGesture,
            panup: handleGesture,
            pandown: handleGesture
          }
        }
      }}
    >
      <div>
        <h1>Gesture Section {eventType !== undefined && ` - This is ${eventType}`}</h1>
      </div>
    </Gestures>

    {/* <HsvColorPicker */}
    {/*   color={{h: 120, s: 50, v: 50}} */}
    {/* /> */}
    {/* <ColourChooserCover/> */}
  </ColourChooserOuter>
}