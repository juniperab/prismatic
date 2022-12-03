import React, { ReactElement } from "react";
import { ModalType, selectAppState, setActiveModal } from "../../../redux/app/appSlice";
import { Modal } from "./Modal";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

export function UserModal(): ReactElement | null {
  const { activeModal } = useAppSelector(selectAppState)
  const dispatch = useAppDispatch()

  if (activeModal !== ModalType.user) {
    return null
  }

  return <Modal title='Player Info and Statistics' onClickClose={() => dispatch(setActiveModal(undefined))}>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum elit ac est semper pretium. Integer molestie massa ac massa rutrum scelerisque. Proin vitae magna maximus, porta tortor quis, ultrices orci. Donec ultricies congue nibh, nec semper lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam eu imperdiet velit. Fusce commodo elementum nisl accumsan convallis. Ut blandit augue a ligula malesuada hendrerit. Maecenas eleifend enim et dictum ultrices. Mauris at felis sit amet nisi varius tincidunt.</p>
    <p>Sed consectetur sapien quis ullamcorper pharetra. Cras interdum, enim vitae gravida porta, mi libero lacinia ex, ut eleifend metus lacus a erat. Nunc maximus, metus id condimentum varius, leo purus porttitor risus, at ullamcorper augue mauris non tellus. Mauris blandit mauris purus, et tincidunt justo ullamcorper id. Sed arcu odio, sollicitudin eu gravida sit amet, elementum vehicula felis. Maecenas sit amet ultricies nisi, elementum hendrerit tellus. Morbi ultricies in augue vitae maximus. Aliquam interdum, urna vitae sagittis imperdiet, felis magna sollicitudin massa, sit amet tincidunt ipsum orci faucibus mauris. Maecenas tincidunt tellus et commodo finibus. Pellentesque sit amet cursus diam. Phasellus sapien dolor, viverra non libero a, commodo ultricies est. Proin lobortis aliquam mauris, nec varius sem finibus non. Donec lacinia eu elit vitae ultrices. Cras ac hendrerit sapien.</p>
    <p>Maecenas tempus ipsum nisl, id cursus diam mollis faucibus. Nulla euismod sodales aliquet. Proin nec egestas ipsum. Suspendisse vel lectus arcu. Donec elementum quis odio non faucibus. Vestibulum vel erat ut nulla accumsan congue eu in felis. Maecenas quis vehicula turpis. Nullam mattis a odio sollicitudin efficitur. Proin orci purus, accumsan vitae vestibulum a, interdum vitae tortor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris eget tellus non ipsum bibendum placerat vel sed enim. Curabitur sit amet lacus non ipsum varius ultrices vel at neque. Nam eros lacus, molestie vitae justo sit amet, viverra ultrices mauris. Sed consectetur at diam non tincidunt. Etiam bibendum tellus vel risus mattis ultrices. Pellentesque sed erat sed velit accumsan pellentesque.</p>
    <p>Nulla efficitur lorem eget lacinia scelerisque. Sed ut arcu nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque sit amet lectus urna. Nullam porttitor gravida pulvinar. Praesent convallis justo sit amet risus tempus, id accumsan massa mattis. Nam imperdiet sed purus a auctor. Morbi vehicula hendrerit aliquet.</p>
    <p>Donec eu dolor non elit volutpat auctor. Maecenas varius magna elit, eu interdum lacus rhoncus ac. Quisque nulla massa, consequat eu nibh et, tempor consectetur augue. Etiam cursus imperdiet sem in mattis. Praesent tincidunt pharetra nibh, at tempus orci convallis in. Morbi et euismod massa. Aliquam erat volutpat. Etiam finibus egestas egestas. Maecenas commodo rutrum lectus vel sodales. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam gravida magna sed dolor bibendum, eget euismod sapien tristique.</p>
  </Modal>
}
