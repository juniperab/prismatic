import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { select } from 'typed-redux-saga'

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function* appSelect<TSelected>(selector: (state: RootState) => TSelected): Generator<any, TSelected, TSelected> {
  return yield* select(selector)
}
