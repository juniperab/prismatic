import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import app from './app/appSlice'
import config from './config/configSlice'
import puzzle from './puzzle/puzzleSlice'
import createSagaMiddleware from '@redux-saga/core'
import { createLogger } from 'redux-logger'
import { puzzleSaga } from './puzzle/puzzleSaga'
import { all, call, FixedTask, SagaGenerator, spawn } from 'typed-redux-saga'
import { AllEffect, ForkEffect } from '@redux-saga/core/effects'
import { configSaga } from './config/configSaga'
import { appSaga } from './app/appSaga'

const logger = createLogger({
  level: {
    prevState: false,
    action: false, // 'info',
    nextState: false,
  },
})

const saga = createSagaMiddleware({
  onError: (error: Error) => {
    throw error
  },
})

export const store = configureStore({
  reducer: {
    app,
    config,
    puzzle,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, saga),
})

function* rootSaga(): Generator<AllEffect<SagaGenerator<FixedTask<void>, ForkEffect<void>>>, void> {
  const sagas = [appSaga, configSaga, puzzleSaga]
  // spawn each saga independently, and restart each after an error.
  // ref: https://redux-saga.js.org/docs/advanced/RootSaga
  // and: https://github.com/redux-saga/redux-saga/issues/570
  yield* all(
    sagas.map((saga) =>
      spawn(function* () {
        while (true) {
          try {
            yield* call(saga)
            break
          } catch (e) {
            console.log(e)
          }
        }
      })
    )
  )
}
saga.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
