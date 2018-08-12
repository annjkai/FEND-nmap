import React, { Component } from 'react';

//REFERENCE: https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends Component {
    state = { hasError: false }

    componentDidCatch(error, info) {
        window.alert("Oops, something went wrong. Please refresh the page.")
        this.setState({ hasError: true })
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong. Please try again.</h1>
        }
        return this.props.children
    }
}

export default ErrorBoundary;
