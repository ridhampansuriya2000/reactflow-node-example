import React, { Component, ReactNode } from "react";
import {connect} from "react-redux";
import {resetState} from "../store/actions";

interface ErrorBoundaryProps {
    children: ReactNode;
    resetState: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error Boundary Caught an Error:", error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
        this.props.resetState()
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.message}</p>
                    <button onClick={this.resetError}>Try Again</button>
                </div>
            );
        }
        return this.props.children;
    }
}

const mapDispatchToProps = (dispatch: any) => ({
    resetState: () => dispatch(resetState()),
});

export default connect(null, mapDispatchToProps)(ErrorBoundary)
