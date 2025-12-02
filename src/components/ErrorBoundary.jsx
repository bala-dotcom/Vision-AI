
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                    <p className="text-gray-400 mb-8">The application encountered an unexpected error.</p>

                    <div className="bg-gray-900 p-6 rounded-xl border border-red-500/20 max-w-2xl w-full overflow-auto text-left">
                        <h2 className="text-xl font-semibold text-red-400 mb-2">Error Details:</h2>
                        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap mb-4">
                            {this.state.error && this.state.error.toString()}
                        </pre>

                        <h2 className="text-xl font-semibold text-gray-400 mb-2">Component Stack:</h2>
                        <pre className="text-xs text-gray-500 font-mono whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
