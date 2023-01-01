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
  background: string
  text: string
  border: string
  modalBackground: string
  modalBorder: string
  modalBoxShadow: string
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
