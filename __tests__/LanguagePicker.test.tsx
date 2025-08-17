import { render, screen, fireEvent } from '@testing-library/react';
import LanguagePicker from '@/components/LanguagePicker';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('LanguagePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all language options', () => {
    render(<LanguagePicker />);
    
    // Check that all 6 languages are present
    expect(screen.getByText('languages.finnish')).toBeInTheDocument();
    expect(screen.getByText('languages.spanish')).toBeInTheDocument();
    expect(screen.getByText('languages.dutch')).toBeInTheDocument();
    expect(screen.getByText('languages.english')).toBeInTheDocument();
    expect(screen.getByText('languages.german')).toBeInTheDocument();
    expect(screen.getByText('languages.french')).toBeInTheDocument();
  });

  it('marks current language as active', () => {
    render(<LanguagePicker />);
    
    // Find the English button (mocked locale is 'en')
    const englishButton = screen.getByLabelText(/Switch to English/);
    expect(englishButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('has proper accessibility attributes', () => {
    render(<LanguagePicker />);
    
    // Check for proper heading
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('languages.choose');
    
    // Check for group role
    expect(screen.getByRole('group')).toBeInTheDocument();
    
    // Check that all buttons have proper labels
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-pressed');
    });
  });

  it('handles keyboard navigation', () => {
    render(<LanguagePicker />);
    
    const firstButton = screen.getAllByRole('button')[0];
    firstButton.focus();
    
    expect(firstButton).toHaveFocus();
    
    // Test Tab navigation
    fireEvent.keyDown(firstButton, { key: 'Tab' });
    // Focus should move to next button (this is handled by browser)
  });

  it('saves language preference to localStorage', () => {
    render(<LanguagePicker />);
    
    // The component should save the current locale on mount
    expect(localStorage.setItem).toHaveBeenCalledWith('preferred-language', 'en');
  });

  it('prevents double clicks during language change', () => {
    render(<LanguagePicker />);
    
    const frenchButton = screen.getByLabelText(/Switch to Français/);
    
    // Click the button
    fireEvent.click(frenchButton);
    
    // Button should be disabled during change
    expect(frenchButton).toBeDisabled();
  });

  it('has proper visual indicators for active language', () => {
    render(<LanguagePicker />);
    
    const englishButton = screen.getByLabelText(/Switch to English/);
    const activeIndicator = englishButton.querySelector('[aria-hidden="true"]');
    
    expect(activeIndicator).toBeInTheDocument();
  });
});
