import * as React from 'react'
import { HexColour, KeywordColour } from '../lib/colour/colours'

export type SVG = React.FunctionComponent<React.SVGProps<SVGSVGElement>>

export interface Theme {
  colours: ThemeColours
  icons: ThemeIcons
  images: ThemeImages
  themeName: ThemeName
}

export enum ThemeName {
  light = 'light',
  dark = 'dark',
}

export interface ThemeColours {
  appBackground: KeywordColour | HexColour
  appText: KeywordColour | HexColour
  appTextAlt: Array<KeywordColour | HexColour>
  appBorders: KeywordColour | HexColour
  appBordersAlt: Array<KeywordColour | HexColour>
  modalBackground: KeywordColour | HexColour
  modalBorders: KeywordColour | HexColour
  modalBoxShadow: string
  modalText: KeywordColour | HexColour
  modalSectionBorder: KeywordColour | HexColour
}

export interface SVGIcon {
  svg: SVG
  colour: string
}

export interface ThemeIcons {
  close: SVGIcon
  expand: SVGIcon
  help: SVGIcon
  hint: SVGIcon
  key: SVGIcon
  menu: SVGIcon
  minimize: SVGIcon
  person: SVGIcon
  pottedPlant: SVGIcon
  puzzle: SVGIcon
  question: SVGIcon
  search: SVGIcon
  settings: SVGIcon
  tada: SVGIcon
}

export interface ThemeImages {
  logo: any
}
