import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome Back/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders sign in form', () => {
  render(<App />);
  const emailLabel = screen.getByText(/Email address/i);
  const passwordField = screen.getByLabelText(/Password/i);
  expect(emailLabel).toBeInTheDocument();
  expect(passwordField).toBeInTheDocument();
});
