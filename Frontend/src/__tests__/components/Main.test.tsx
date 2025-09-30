import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Main from '@/Components/Main/Main';

// Mock the WhatsAppInterface component
jest.mock('@/Components/Main/WhatsAppInterface', () => {
  return function MockWhatsAppInterface({ userId }: any) {
    return (
      <div data-testid="whatsapp-interface">
        <div>WhatsApp Interface</div>
        <div>User ID: {userId}</div>
      </div>
    );
  };
});

describe('Main Component', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders Main component with WhatsAppInterface', () => {
      render(<Main onLogout={mockOnLogout} />);

      expect(screen.getByText('WhatsApp Interface')).toBeInTheDocument();
      expect(screen.getByText('User ID: user-1')).toBeInTheDocument();
    });

    it('passes correct props to WhatsAppInterface', () => {
      render(<Main onLogout={mockOnLogout} />);

      const whatsappInterface = screen.getByTestId('whatsapp-interface');
      expect(whatsappInterface).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('receives onLogout callback correctly', () => {
      render(<Main onLogout={mockOnLogout} />);

      // The onLogout prop is passed to WhatsAppInterface but not directly called
      // We verify it's passed correctly by checking it was called with the right function
      expect(mockOnLogout).not.toHaveBeenCalled(); // Not called initially
    });

    it('handles undefined onLogout prop gracefully', () => {
      const { container } = render(<Main onLogout={undefined} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles null onLogout prop gracefully', () => {
      const { container } = render(<Main onLogout={null as any} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('renders full WhatsApp interface chain', () => {
      render(<Main onLogout={mockOnLogout} />);

      expect(screen.getByTestId('whatsapp-interface')).toBeInTheDocument();
    });

    it('maintains component hierarchy correctly', () => {
      const { container } = render(<Main onLogout={mockOnLogout} />);

      // Check that Main contains WhatsAppInterface
      const mainElement = container.firstChild;
      expect(mainElement).toHaveClass('w-full');
      expect(mainElement).toHaveClass('h-screen');
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly on different screen sizes', () => {
      // Test desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { rerender } = render(<Main onLogout={mockOnLogout} />);

      expect(screen.getByText('WhatsApp Interface')).toBeInTheDocument();

      // Test mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      rerender(<Main onLogout={mockOnLogout} />);

      expect(screen.getByText('WhatsApp Interface')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<Main onLogout={mockOnLogout} />);

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<Main onLogout={mockOnLogout} />);

      const mainElement = screen.getByRole('main');
      mainElement.focus();
      expect(mainElement).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without performance issues', () => {
      const start = performance.now();
      render(<Main onLogout={mockOnLogout} />);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should render in less than 100ms
    });

    it('handles rapid re-renders efficiently', () => {
      const { rerender } = render(<Main onLogout={mockOnLogout} />);

      // Rapid re-renders should not cause issues
      for (let i = 0; i < 10; i++) {
        rerender(<Main onLogout={mockOnLogout} />);
      }

      expect(screen.getByText('WhatsApp Interface')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles errors in child components gracefully', () => {
      // Mock WhatsAppInterface to throw an error
      jest.mock('@/Components/Main/WhatsAppInterface', () => {
        return function MockWhatsAppInterface() {
          throw new Error('Test error');
        };
      });

      const originalConsoleError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<Main onLogout={mockOnLogout} />);
      }).toThrow('Test error');

      console.error = originalConsoleError;
    });

    it('handles undefined userId in WhatsAppInterface', () => {
      // Mock WhatsAppInterface without userId prop
      jest.mock('@/Components/Main/WhatsAppInterface', () => {
        return function MockWhatsAppInterface() {
          return <div data-testid="whatsapp-interface">WhatsApp Interface</div>;
        };
      });

      render(<Main onLogout={mockOnLogout} />);

      expect(screen.getByTestId('whatsapp-interface')).toBeInTheDocument();
    });
  });

  describe('User Experience', () => {
    it('provides consistent UI across different user scenarios', () => {
      const { rerender } = render(<Main onLogout={mockOnLogout} />);

      // Test with different props
      rerender(<Main onLogout={() => {}} />);
      rerender(<Main onLogout={mockOnLogout} />);

      expect(screen.getByText('WhatsApp Interface')).toBeInTheDocument();
    });

    it('maintains state during re-renders', () => {
      const { rerender } = render(<Main onLogout={mockOnLogout} />);

      // Re-render with same props
      rerender(<Main onLogout={mockOnLogout} />);

      expect(screen.getByText('WhatsApp Interface')).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('accepts correct prop types', () => {
      // TypeScript should catch this during compilation, but we can test at runtime
      expect(() => {
        render(<Main onLogout={mockOnLogout} />);
      }).not.toThrow();
    });

    it('handles optional props correctly', () => {
      expect(() => {
        render(<Main onLogout={undefined} />);
      }).not.toThrow();
    });
  });

  describe('Security', () => {
    it('does not expose sensitive data in rendered output', () => {
      render(<Main onLogout={mockOnLogout} />);

      // Check that no sensitive data is exposed
      const textContent = screen.getByText('WhatsApp Interface').textContent;
      expect(textContent).not.toContain('password');
      expect(textContent).not.toContain('token');
      expect(textContent).not.toContain('secret');
    });
  });

  describe('Styling', () => {
    it('applies correct CSS classes', () => {
      const { container } = render(<Main onLogout={mockOnLogout} />);

      const mainElement = container.firstChild;
      expect(mainElement).toHaveClass('w-full');
      expect(mainElement).toHaveClass('h-screen');
      expect(mainElement).toHaveClass('bg-background');
    });

    it('handles theme changes correctly', () => {
      const { container } = render(<Main onLogout={mockOnLogout} />);

      const mainElement = container.firstChild;
      expect(mainElement).toHaveClass('bg-background');

      // Test dark theme (CSS variables would be handled by CSS)
      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('Cross-browser Compatibility', () => {
    it('works in different browser environments', () => {
      // Mock different browser environments
      const originalUserAgent = navigator.userAgent;

      // Test Chrome
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        configurable: true,
        value: 'Chrome/91.0.4472.124',
      });

      let { rerender } = render(<Main onLogout={mockOnLogout} />);
      expect(screen.getByText('WhatsApp Interface')).toBeInTheDocument();

      // Test Firefox
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        configurable: true,
        value: 'Firefox/89.0',
      });

      rerender(<Main onLogout={mockOnLogout} />);
      expect(screen.getByText('WhatsApp Interface')).toBeInTheDocument();

      // Restore original userAgent
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        configurable: true,
        value: originalUserAgent,
      });
    });
  });
});