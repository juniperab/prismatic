import { ReactElement } from "react";

import {
  TopBarIcon,
  TopBarImage,
  TopBarOuter,
  TopBarSectionLeft,
  TopBarSectionRight,
  TopBarTitle
} from "./topBarLayout";
import { useTheme } from "styled-components";
import { Theme } from "../theme/theme";

export interface TopBarProps {
  onClickLogo: () => void
  onClickHelp: () => void
  onClickPerson: () => void
  onClickSettings: () => void
}

export function TopBar(props: TopBarProps): ReactElement {
  const theme = useTheme() as Theme
  return <TopBarOuter>
    <TopBarSectionLeft>
      <TopBarImage src={theme.images.logo} onClick={props.onClickLogo}/>
      <TopBarTitle>Prismatic</TopBarTitle>
    </TopBarSectionLeft>
    <TopBarSectionRight>
      <TopBarIcon color={theme.icons.help.colour} onClick={props.onClickHelp}>
        <theme.icons.help.svg/>
      </TopBarIcon>
      <TopBarIcon color={theme.icons.person.colour} onClick={props.onClickPerson}>
        <theme.icons.person.svg/>
      </TopBarIcon>
      <TopBarIcon color={theme.icons.settings.colour} onClick={props.onClickSettings}>
        <theme.icons.settings.svg/>
      </TopBarIcon>
    </TopBarSectionRight>
  </TopBarOuter>
}
