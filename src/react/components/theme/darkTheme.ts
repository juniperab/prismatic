import { Theme, ThemeName } from './theme'
import logo from './images/logo.png'
import { ReactComponent as iconHelp } from './icons/icon-help.svg'
import { ReactComponent as iconHint } from './icons/icon-hint.svg'
import { ReactComponent as iconKey } from './icons/icon-key.svg'
import { ReactComponent as iconMenu } from './icons/icon-menu.svg'
import { ReactComponent as iconPerson } from './icons/icon-person.svg'
import { ReactComponent as iconPuzzle } from './icons/icon-puzzle.svg'
import { ReactComponent as iconSearch } from './icons/icon-search.svg'
import { ReactComponent as iconSettings } from './icons/icon-settings.svg'

export const darkTheme: Theme = {
  colours: {
    background: 'black',
    text: 'white',
    border: 'white',
  },
  icons: {
    help: { svg: iconHelp, colour: '#a45490' },
    hint: { svg: iconHint, colour: '#a45490' },
    key: { svg: iconKey, colour: '#a45490' },
    menu: { svg: iconMenu, colour: '#a45490' },
    person: { svg: iconPerson, colour: '#a45490' },
    puzzle: { svg: iconPuzzle, colour: '#a45490' },
    search: { svg: iconSearch, colour: '#a45490' },
    settings: { svg: iconSettings, colour: '#a45490' },
  },
  images: {
    logo,
  },
  themeName: ThemeName.dark,
}
