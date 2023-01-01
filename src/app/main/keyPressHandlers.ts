import { AppDispatch } from '../../redux/store'
import { toggleTheme } from '../../redux/app/appSlice'

export function handleKeyDown(event: KeyboardEvent, dispatch: AppDispatch): void {
  if (event.key === 't') {
    dispatch(toggleTheme())
  }
}

export function handleKeyUp(event: KeyboardEvent, dispatch: AppDispatch): void {}
