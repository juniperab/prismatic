import { ReactElement } from 'react'
import {
  _HeaderIcon as HIcon,
  _HeaderImage as HImage,
  _Header as HeaderElement,
  _HeaderSectionLeft as HSectionLeft,
  _HeaderSectionRight as HSectionRight,
  _HeaderTitle as HTitle,
} from './headerLayout'
import { useTheme } from 'styled-components'
import { Theme } from '../../theme/theme'

export interface HeaderProps {
  onClickLogo?: () => void
  onClickHelp: () => void
  onClickPerson: () => void
  onClickSettings: () => void
}

export function Header(props: HeaderProps): ReactElement {
  const theme = useTheme() as Theme
  return (
    <HeaderElement>
      <HSectionLeft>
        <HImage src={theme.images.logo} onClick={props.onClickLogo} />
        <HTitle>Prismatic</HTitle>
      </HSectionLeft>
      <HSectionRight>
        <HIcon color={theme.icons.help.colour} onClick={props.onClickHelp}>
          <theme.icons.help.svg />
        </HIcon>
        <HIcon color={theme.icons.person.colour} onClick={props.onClickPerson}>
          <theme.icons.person.svg />
        </HIcon>
        <HIcon color={theme.icons.settings.colour} onClick={props.onClickSettings}>
          <theme.icons.settings.svg />
        </HIcon>
      </HSectionRight>
    </HeaderElement>
  )
}
