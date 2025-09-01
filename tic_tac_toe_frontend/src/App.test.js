import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders start button and can start game', () => {
  render(<App />);
  const startBtn = screen.getByRole('button', { name: /start/i });
  expect(startBtn).toBeInTheDocument();
  fireEvent.click(startBtn);
  const restartBtn = screen.getByRole('button', { name: /restart/i });
  expect(restartBtn).toBeInTheDocument();
});
