import { render, screen } from '@testing-library/react';
import App from './App';

test('renders healthcare welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to Healthcare Management System/i);
  expect(welcomeElement).toBeInTheDocument();
});
