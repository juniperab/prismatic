import { ReactElement } from 'react'
import {
  _Footer as FooterElement,
  _FooterSectionLeft as FSectionLeft,
  _FooterSectionRight as FSectionRight,
  _FooterText as FText,
} from './footerLayout'

export function Footer(): ReactElement {
  return (
    <FooterElement>
      <FSectionLeft>
        <FText>© Juniper Alanna Berry</FText> {/* TODO: add email or web page link */}
      </FSectionLeft>
      <FSectionRight>
        <FText>Acknowledgements</FText> {/* TODO: add content to acknowledgements */}
      </FSectionRight>
    </FooterElement>
  )
}
