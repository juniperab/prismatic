export interface Theme {
  backgroundColour: string
  textColour: string
  themeName: ThemeName
}

export enum ThemeName {
  light = 'light', dark = 'dark'
}
