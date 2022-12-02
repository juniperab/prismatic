import { CSSProperties, ReactElement } from "react";

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

export function TopBar(): ReactElement {
  const theme = useTheme() as Theme
  const HelpIcon = theme.icons.help.svg
  return <TopBarOuter>
    <TopBarSectionLeft>
      <TopBarImage src={theme.images.logo}/>
      <TopBarTitle>Prismatic</TopBarTitle>
    </TopBarSectionLeft>
    <TopBarSectionRight>
      <TopBarIcon color={theme.icons.help.colour}>
        <HelpIcon/>
      </TopBarIcon>
    </TopBarSectionRight>
  </TopBarOuter>
}