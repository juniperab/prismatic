import { ReactElement } from 'react'
import { FooterOuter, FooterSectionLeft, FooterSectionRight, FooterText } from './footerLayout'

export function Footer(): ReactElement {
  return (
    <FooterOuter>
      <FooterSectionLeft>
        <FooterText>© Juniper Alanna Berry</FooterText>
      </FooterSectionLeft>
      <FooterSectionRight>
        <FooterText>Acknowledgements</FooterText>
      </FooterSectionRight>
    </FooterOuter>
  )
}
