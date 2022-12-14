import { Theme, ThemeName } from './theme'
import { ReactComponent as iconClose } from './icons/icon-close.svg'
import { ReactComponent as iconExpand } from './icons/icon-expand.svg'
import { ReactComponent as iconHelp } from './icons/icon-help.svg'
import { ReactComponent as iconHint } from './icons/icon-hint.svg'
import { ReactComponent as iconKey } from './icons/icon-key.svg'
import { ReactComponent as iconMinimize } from './icons/icon-minimize.svg'
import { ReactComponent as iconMenu } from './icons/icon-menu.svg'
import { ReactComponent as iconPerson } from './icons/icon-person.svg'
import { ReactComponent as iconPottedPlant } from './icons/icon-potted-plant.svg'
import { ReactComponent as iconPuzzle } from './icons/icon-puzzle.svg'
import { ReactComponent as iconQuestion } from './icons/icon-question.svg'
import { ReactComponent as iconSearch } from './icons/icon-search.svg'
import { ReactComponent as iconSettings } from './icons/icon-settings.svg'
import { ReactComponent as iconTada } from './icons/icon-tada.svg'
import logo from './images/logo.png'

export const lightTheme: Theme = {
  colours: {
    appBackground: 'white',
    appBorders: 'black',
    appBordersAlt: ['white'],
    appText: 'black',
    appTextAlt: ['white'],
    modalBackground: 'lightgrey',
    modalBorders: 'darkgrey',
    modalBoxShadow: 'rgba(0, 0, 0, 30%)',
    modalSectionBorder: 'black',
    modalText: 'black',
  },
  icons: {
    close: { svg: iconClose, colour: '#783f6b' },
    expand: { svg: iconExpand, colour: '#783f6b' },
    help: { svg: iconHelp, colour: '#783f6b' },
    hint: { svg: iconHint, colour: '#783f6b' },
    key: { svg: iconKey, colour: '#783f6b' },
    menu: { svg: iconMenu, colour: '#783f6b' },
    minimize: { svg: iconMinimize, colour: '#783f6b' },
    person: { svg: iconPerson, colour: '#783f6b' },
    pottedPlant: { svg: iconPottedPlant, colour: '#783f6b' },
    puzzle: { svg: iconPuzzle, colour: '#783f6b' },
    question: { svg: iconQuestion, colour: '#783f6b' },
    search: { svg: iconSearch, colour: '#783f6b' },
    settings: { svg: iconSettings, colour: '#783f6b' },
    tada: { svg: iconTada, colour: '#783f6b' },
  },
  images: {
    logo,
  },
  themeName: ThemeName.light,
}
