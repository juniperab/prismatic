import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { App } from './App';

test('renders Prismatic header', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByText('Prismatic', {selector: 'h1'})).toBeInTheDocument()
});
