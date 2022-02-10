import React from "react";

const ErrorFullback = () => (
  <div className="gp2gp-width-container">
    <main className="nhsuk-main-wrapper">
      <h1>Oops, something went wrong.</h1>
      <p>Please try again later.</p>
    </main>
  </div>
);

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFullback />;
    }

    return this.props.children;
  }
}
