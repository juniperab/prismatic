import * as React from 'react'

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
  appBackground: string
  appText: string
  appTextAlt: string[]
  appBorders: string
  appBordersAlt: string[]
  modalBackground: string
  modalBorders: string
  modalBoxShadow: string
  modalText: string
  modalSectionBorder: string
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
