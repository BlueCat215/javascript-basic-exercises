import { Component } from "react";
import { Link } from "react-router-dom";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("bắt được lỗi:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-paper px-6">
          <div className="text-center max-w-sm space-y-4">
            <h1 className="text-xl font-display font-bold text-ink">
              Đã có lỗi xảy ra
            </h1>
            <p className="text-sm text-ink/50">
              Trang gặp sự cố không mong muốn. Vui lòng thử tải lại trang hoặc
              quay về trang chủ.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary text-sm"
              >
                Tải lại trang
              </button>
              <Link
                to="/"
                onClick={this.handleReset}
                className="btn-primary text-sm"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
