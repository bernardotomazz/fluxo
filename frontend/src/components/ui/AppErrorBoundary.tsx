import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "./button";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro inesperado na interface do Fluxo", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground">
        <section className="app-panel w-full max-w-lg p-6 text-center sm:p-8" role="alert">
          <TriangleAlert className="mx-auto text-negative" size={32} aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold">Algo saiu do esperado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Seus dados não foram apagados. Recarregue a interface para continuar.
          </p>
          <Button className="mt-5" onClick={() => window.location.reload()}>
            <RefreshCw size={17} aria-hidden="true" />
            Recarregar o Fluxo
          </Button>
        </section>
      </main>
    );
  }
}
