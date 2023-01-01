import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import { Main } from './Main'

test('renders Prismatic header', () => {
  render(
    <Provider store={store}>
      <Main />
    </Provider>
  )

  expect(screen.getByText('Prismatic', { selector: 'h1' })).toBeInTheDocument()
})
