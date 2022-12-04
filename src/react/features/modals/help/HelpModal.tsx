import React, { ReactElement } from 'react'
import { ModalType, selectAppState, setActiveModal } from '../../../../redux/app/appSlice'
import { Modal } from '../../../components/modal/Modal'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { Rules } from "./Rules"

export function HelpModal(): ReactElement | null {
  const { activeModal } = useAppSelector(selectAppState)
  const dispatch = useAppDispatch()

  if (activeModal !== ModalType.help) {
    return null
  }

  return (
    <Modal title="Help" onClickClose={() => dispatch(setActiveModal(undefined))}>
      <Rules/>
    </Modal>
  )
}
