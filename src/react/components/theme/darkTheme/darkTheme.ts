import { Theme, ThemeName } from '../theme'
import logo from '../common/images/logo.png'
import { ReactComponent as iconHelp} from '../common/icons/icon-help.svg'

export const darkTheme: Theme = {
  colours: {
    background: 'black',
    text: 'white',
    border: 'white',
  },
  icons: {
    help: {
      svg: iconHelp,
      colour: '#a45490'
    },
  },
  images: {
    logo,
  },
  themeName: ThemeName.dark,
}
