import * as React from "react";

export type SVG = React.FunctionComponent<React.SVGProps<SVGSVGElement>>

export interface Theme {
  colours: ThemeColours
  icons: ThemeIcons
  images: ThemeImages
  themeName: ThemeName
}

export enum ThemeName {
  light = 'light', dark = 'dark'
}

export interface ThemeColours {
  background: string
  text: string
  border: string
}

export interface ThemeIcons {
  help: {
    svg: SVG,
    colour: string,
  }
}

export interface ThemeImages {
  logo: any
}