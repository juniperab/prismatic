import styled from "styled-components";
import { headerLayout } from "./headerLayout";

export const modalLayout = {
  margin: {
    top: 20,
    side: 30,
    fromTopOfWindow: -999,
  }
}

modalLayout.margin.fromTopOfWindow = headerLayout.height + modalLayout.margin.top

export const ModalOuter = styled.div.attrs({
  className: 'modal-outer',
})`
  position: absolute;
  top: ${modalLayout.margin.fromTopOfWindow}px;
  left: ${modalLayout.margin.side}px;
  right: ${modalLayout.margin.side}px;
  max-height: calc(100% - );
  background-color: grey;
`