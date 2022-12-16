import { useEffect, useState } from 'react'

export function useModifierKeys(): {
  altKeyDown: boolean
  ctrlKeyDown: boolean
  metaKeyDown: boolean
  shiftKeyDown: boolean
} {
  const [altKeyDown, setAltKeyDown] = useState(false)
  const [ctrlKeyDown, setCtrlKeyDown] = useState(false)
  const [metaKeyDown, setMetaKeyDown] = useState(false)
  const [shiftKeyDown, setShiftKeyDown] = useState(false)

  const receiveKeyDown = (event: KeyboardEvent): void => {
    setAltKeyDown(event.altKey)
    setCtrlKeyDown(event.ctrlKey)
    setMetaKeyDown(event.metaKey)
    setShiftKeyDown(event.shiftKey)
  }
  const receiveKeyUp = (event: KeyboardEvent): void => {
    setAltKeyDown(event.altKey)
    setCtrlKeyDown(event.ctrlKey)
    setMetaKeyDown(event.metaKey)
    setShiftKeyDown(event.shiftKey)
  }
  useEffect(() => {
    document.addEventListener('keydown', receiveKeyDown)
    document.addEventListener('keyup', receiveKeyUp)
    return function () {
      document.removeEventListener('keydown', receiveKeyDown)
      document.removeEventListener('keyup', receiveKeyUp)
    }
  })

  return { altKeyDown, ctrlKeyDown, metaKeyDown, shiftKeyDown }
}
