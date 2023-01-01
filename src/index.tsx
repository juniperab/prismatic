import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Main } from './app/main/Main'
import reportWebVitals from './reportWebVitals'
import './index.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Main />
  </Provider>
  // </React.StrictMode>
)

reportWebVitals()
