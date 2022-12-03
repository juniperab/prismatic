import { ReactElement } from "react";

import {
  HeaderIcon,
  HeaderImage,
  HeaderOuter,
  HeaderSectionLeft,
  HeaderSectionRight,
  HeaderTitle
} from "./headerLayout";
import { useTheme } from "styled-components";
import { Theme } from "../theme/theme";

export interface HeaderProps {
  onClickLogo: () => void
  onClickHelp: () => void
  onClickPerson: () => void
  onClickSettings: () => void
}

export function Header(props: HeaderProps): ReactElement {
  const theme = useTheme() as Theme
  return <HeaderOuter>
    <HeaderSectionLeft>
      <HeaderImage src={theme.images.logo} onClick={props.onClickLogo}/>
      <HeaderTitle>Prismatic</HeaderTitle>
    </HeaderSectionLeft>
    <HeaderSectionRight>
      <HeaderIcon color={theme.icons.help.colour} onClick={props.onClickHelp}>
        <theme.icons.help.svg/>
      </HeaderIcon>
      <HeaderIcon color={theme.icons.person.colour} onClick={props.onClickPerson}>
        <theme.icons.person.svg/>
      </HeaderIcon>
      <HeaderIcon color={theme.icons.settings.colour} onClick={props.onClickSettings}>
        <theme.icons.settings.svg/>
      </HeaderIcon>
    </HeaderSectionRight>
  </HeaderOuter>
}
