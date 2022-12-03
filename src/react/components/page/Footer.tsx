import { ReactElement } from "react";
import {
  FooterOuter,
  FooterSectionLeft,
  FooterSectionRight, FooterText
} from "./footerLayout";
import { useTheme } from "styled-components";
import { Theme } from "../theme/theme";

export function Footer(): ReactElement {
  const theme = useTheme() as Theme
  return (
    <FooterOuter>
      <FooterSectionLeft>
        <FooterText>(C) Juniper Alanna Berry</FooterText>
      </FooterSectionLeft>
      <FooterSectionRight>
        <FooterText>Acknowledgements</FooterText>
      </FooterSectionRight>
    </FooterOuter>
  )
}