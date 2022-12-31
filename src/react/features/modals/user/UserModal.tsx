import React, { ReactElement } from 'react'
import { ModalType, selectAppState, setActiveModal } from '../../../../redux/app/appSlice'
import { Modal } from '../../../components/modal/Modal'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'

export function UserModal(): ReactElement | null {
  const { activeModal } = useAppSelector(selectAppState)
  const dispatch = useAppDispatch()

  if (activeModal !== ModalType.user) {
    return null
  }

  return (
    <Modal title="Player Info and Statistics" onClickClose={() => dispatch(setActiveModal(undefined))}>
      <p>
        Information about your games, scores, etc. will go here once I start tabulating and calculating it.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum elit ac est semper pretium. Integer
        molestie massa ac massa rutrum scelerisque. Proin vitae magna maximus, porta tortor quis, ultrices orci. Donec
        ultricies congue nibh, nec semper lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
        posuere cubilia curae; Etiam eu imperdiet velit. Fusce commodo elementum nisl accumsan convallis. Ut blandit
        augue a ligula malesuada hendrerit. Maecenas eleifend enim et dictum ultrices. Mauris at felis sit amet nisi
        varius tincidunt.
      </p>
    </Modal>
  )
}
