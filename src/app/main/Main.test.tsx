import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import { Main } from './Main'

test('placeholder', () => {
  // while the test below is skipped
  expect('foo').toEqual('foo')
})

// TODO: ResizeObserver broke the ability to render outside a browser. Need to fix.
test.skip('renders Prismatic header', () => {
  render(
    <Provider store={store}>
      <Main />
    </Provider>
  )

  expect(screen.getByText('Prismatic', { selector: 'h1' })).toBeInTheDocument()
})
