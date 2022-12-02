import { Theme, ThemeName } from '../theme'
import { ReactComponent as iconHelp} from '../common/icons/icon-help.svg'
import logo from "../common/images/logo.png"

export const lightTheme: Theme ={
  colours: {
    background: 'white',
    text: 'black',
    border: 'black',
  },
  icons: {
    help: {
      svg: iconHelp,
      colour: '#783f6b'
    },
  },
  images: {
    logo,
  },
  themeName: ThemeName.light,
}
