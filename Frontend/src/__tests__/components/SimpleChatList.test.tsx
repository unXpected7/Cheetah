import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple test to check basic setup
describe('Simple ChatList Test', () => {
  it('renders basic content', () => {
    const SimpleComponent = () => <div>Test Component</div>;
    render(<SimpleComponent />);

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});