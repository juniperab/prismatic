import { Theme, ThemeName } from './theme'
import logo from './images/logo.png'
import { ReactComponent as iconClose } from './icons/icon-close.svg'
import { ReactComponent as iconExpand } from './icons/icon-expand.svg'
import { ReactComponent as iconHelp } from './icons/icon-help.svg'
import { ReactComponent as iconHint } from './icons/icon-hint.svg'
import { ReactComponent as iconKey } from './icons/icon-key.svg'
import { ReactComponent as iconMenu } from './icons/icon-menu.svg'
import { ReactComponent as iconMinimize } from './icons/icon-minimize.svg'
import { ReactComponent as iconPerson } from './icons/icon-person.svg'
import { ReactComponent as iconPottedPlant } from './icons/icon-potted-plant.svg'
import { ReactComponent as iconPuzzle } from './icons/icon-puzzle.svg'
import { ReactComponent as iconQuestion } from './icons/icon-question.svg'
import { ReactComponent as iconSearch } from './icons/icon-search.svg'
import { ReactComponent as iconSettings } from './icons/icon-settings.svg'
import { ReactComponent as iconTada } from './icons/icon-tada.svg'

export const darkTheme: Theme = {
  colours: {
    appBackground: 'black',
    appText: 'white',
    appBorders: 'white',
    modalBackground: 'darkgrey',
    modalBorders: 'lightgrey',
    modalBoxShadow: 'rgba(255, 255, 255, 70%)',
    modalSectionBorder: 'black',
    appBordersAlt: ['white'],
    appTextAlt: ['black'],
    modalText: 'white',
  },
  icons: {
    close: { svg: iconClose, colour: '#a45490' },
    expand: { svg: iconExpand, colour: '#a45490' },
    help: { svg: iconHelp, colour: '#a45490' },
    hint: { svg: iconHint, colour: '#a45490' },
    key: { svg: iconKey, colour: '#a45490' },
    menu: { svg: iconMenu, colour: '#a45490' },
    minimize: { svg: iconMinimize, colour: '#a45490' },
    person: { svg: iconPerson, colour: '#a45490' },
    pottedPlant: { svg: iconPottedPlant, colour: '#a45490' },
    puzzle: { svg: iconPuzzle, colour: '#a45490' },
    question: { svg: iconQuestion, colour: '#a45490' },
    search: { svg: iconSearch, colour: '#a45490' },
    settings: { svg: iconSettings, colour: '#a45490' },
    tada: { svg: iconTada, colour: '#a45490' },
  },
  images: {
    logo,
  },
  themeName: ThemeName.dark,
}
