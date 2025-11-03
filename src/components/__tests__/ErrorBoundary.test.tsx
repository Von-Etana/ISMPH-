import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '../ErrorBoundary';
import { COLORS } from '../../constants/theme';

// Mock child component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error');
};

const NormalComponent = () => <div>Normal component</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal component')).toBeTruthy();
  });

  it('should render error UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Test error')).toBeTruthy();
    expect(screen.getByText('Try Again')).toBeTruthy();
  });

  it('should render custom fallback when provided', () => {
    const fallback = <div>Custom error fallback</div>;

    render(
      <ErrorBoundary fallback={fallback}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error fallback')).toBeTruthy();
  });

  it('should call onError callback when an error occurs', () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('should retry when Try Again button is pressed', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();

    // Press retry button
    const retryButton = screen.getByText('Try Again');
    fireEvent.press(retryButton);

    // Rerender with normal component
    rerender(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal component')).toBeTruthy();
  });

  it('should display error message correctly', () => {
    const customError = new Error('Custom error message');

    const TestErrorComponent = () => {
      throw customError;
    };

    render(
      <ErrorBoundary>
        <TestErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeTruthy();
  });
});