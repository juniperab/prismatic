import { lightTheme } from './lightTheme'
import { darkTheme } from './darkTheme'
import { Theme, ThemeName } from './theme'

export function getTheme(name: ThemeName): Theme {
  switch (name) {
    case ThemeName.light:
      return lightTheme
    case ThemeName.dark:
      return darkTheme
  }
}
