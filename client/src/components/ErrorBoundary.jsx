import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="animate-fade-in-up">
              <p className="text-xs font-bold uppercase tracking-widest text-error mb-4">System Error</p>
              <h1 className="text-6xl font-black tracking-tighter text-base-content">Oops.</h1>
              <p className="text-xl font-bold tracking-tight mt-4">Something went wrong</p>
              <p className="text-base-content/60 mt-2">The app crashed unexpectedly. Try refreshing the page.</p>
            </div>
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-ghost rounded-none hover:-translate-y-1 transition-all duration-300"
              >
                Reload Page
              </button>
              <Link
                to="/"
                className="btn btn-primary rounded-none hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;