import React from "react";
import type { ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  /** Rendered when an error is caught */
  fallback: ReactNode;
  /** Optional callback for logging */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Generic typed error boundary — the single place in the codebase that uses
 * the React 19 class component workaround (`as any`).
 *
 * All map/page error boundaries should use this component rather than
 * re-implementing the pattern.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BaseComponent = React.Component as any;

export class ErrorBoundary extends BaseComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
