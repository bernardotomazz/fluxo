import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AppProviders } from "./contexts/AppContext";
import { useDataRefresh, useFeedback, usePageTitle } from "./contexts/app-contexts";
import Header from "./components/ui/Header";
import Sidebar from "./layouts/Sidebar";
import MobileNavigation from "./layouts/MobileNavigation";
import TransactionFormDialog from "./components/modals/TransactionFormDialog";
import FeedbackToast from "./components/ui/FeedbackToast";
import type { TipoTransacao } from "./types/finance";

const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const TransactionsPage = lazy(() => import("./components/pages/TransactionsPage"));
const CategoriesPage = lazy(() => import("./components/pages/CategoriesPage"));
const GoalsPage = lazy(() => import("./components/pages/GoalsPage"));
const TransactionDetailPage = lazy(() => import("./components/pages/TransactionDetailPage"));
const CategoryDetailPage = lazy(() => import("./components/pages/CategoryDetailPage"));
const GoalDetailPage = lazy(() => import("./components/pages/GoalDetailPage"));
const NotFoundPage = lazy(() => import("./components/pages/NotFoundPage"));

const PAGE_TITLES: Record<string, string> = {
  "/": "Visão geral",
  "/transacoes": "Transações",
  "/categorias": "Categorias",
  "/metas": "Metas",
};

function RouteFallback() {
  return (
    <div className="space-y-5" role="status" aria-live="polite" aria-label="Carregando página">
      <span className="sr-only">Carregando página</span>
      <div className="h-9 w-52 animate-pulse rounded-[4px] bg-muted" />
      <div className="h-48 animate-pulse rounded-[4px] border bg-muted" />
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const { notifyDataChanged } = useDataRefresh();
  const { notify } = useFeedback();
  const { detailTitle } = usePageTitle();
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TipoTransacao>("DESPESA");

  function openTransaction(tipo: TipoTransacao = "DESPESA") {
    setTransactionType(tipo);
    setTransactionOpen(true);
  }

  const pageTitle = PAGE_TITLES[location.pathname]
    ?? (location.pathname.startsWith("/transacoes/")
      ? detailTitle ?? "Transação"
      : location.pathname.startsWith("/categorias/")
        ? detailTitle ?? "Categoria"
        : location.pathname.startsWith("/metas/")
          ? detailTitle ?? "Meta"
          : "Página não encontrada");

  useEffect(() => {
    document.title = `${pageTitle} | Fluxo`;
  }, [pageTitle]);

  return (
    <div className="min-h-dvh bg-background text-foreground md:grid md:grid-cols-[216px_minmax(0,1fr)]">
      <a href="#main-content" className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-[4px] bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground focus:translate-y-0">
        Pular para o conteúdo
      </a>
      <Sidebar />
      <div className="min-w-0">
        <Header
          title={pageTitle}
          onNewTransaction={openTransaction}
        />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1600px] px-4 pb-28 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transacoes" element={<TransactionsPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/metas" element={<GoalsPage />} />
              <Route path="/transacoes/:id" element={<TransactionDetailPage />} />
              <Route path="/categorias/:id" element={<CategoryDetailPage />} />
              <Route path="/metas/:id" element={<GoalDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <MobileNavigation onNewTransaction={() => openTransaction()} />
      <FeedbackToast />
      <TransactionFormDialog
        open={transactionOpen}
        onOpenChange={setTransactionOpen}
        tipoInicial={transactionType}
        onSuccess={() => {
          notifyDataChanged();
          notify("Transação criada com sucesso.");
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppShell />
      </AppProviders>
    </BrowserRouter>
  );
}
