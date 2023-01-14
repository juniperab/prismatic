import { enumKeys } from "../lib/util/enumKeys";
import { ThemeName } from "./theme";
import { getTheme } from "./themeRegistry";
import { isHex, isKeyword } from "../lib/colour/colourConversions";
import { get } from "lodash";

describe('theme colours', () => {
  enumKeys(ThemeName).map(k => ThemeName[k]).forEach(themeName => {
    const theme = getTheme(themeName)
    function isValid(colour: any): boolean {
      return isHex(colour) || isKeyword(colour)
    }

    const simpleColourProps = [
      'appBackground',
      'appBorders',
      'appText',
      'modalBackground',
      'modalBorders',
      'modalSectionBorder',
      'modalText',
    ]
    simpleColourProps.forEach(prop => {
      it(`'${themeName}' theme has a correctly typed value for the '${prop}' property`, () => {
        expect(isValid(get(theme.colours, prop))).toBeTruthy()
      })
    })

    const arrayColourProps = [
      'appBordersAlt',
      'appTextAlt'
    ]
    arrayColourProps.forEach(prop => {
      get(theme.colours, prop).forEach((val: any, idx: number) => {
        it(`'${themeName}' theme has a correctly typed value for the '${prop}[${idx}]' property`, () => {
          expect(isValid(val)).toBeTruthy()
        })
      })
    })
  })
})
