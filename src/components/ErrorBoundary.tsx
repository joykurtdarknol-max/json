import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-zinc-950 text-amber-200 flex flex-col items-center justify-center p-6 font-mono">
          <div className="max-w-xl bg-zinc-900 border-2 border-red-800 p-6 rounded-xl space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-red-500">⚠️ BİR HATA OLUŞTU</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded-lg cursor-pointer"
            >
              Yeniden Başlat (F5)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
