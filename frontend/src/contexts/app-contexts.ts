import { createContext, useContext, useEffect } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export interface DataRefreshContextValue {
  version: number;
  notifyDataChanged: () => void;
}

export interface PageTitleContextValue {
  detailTitle: string | null;
  setDetailTitle: (title: string | null) => void;
}

export interface FeedbackContextValue {
  message: string | null;
  notify: (message: string) => void;
  dismiss: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
export const DataRefreshContext = createContext<DataRefreshContextValue | null>(null);
export const PageTitleContext = createContext<PageTitleContextValue | null>(null);
export const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside AppProviders");
  return context;
}

export function useDataRefresh() {
  const context = useContext(DataRefreshContext);
  if (!context) throw new Error("useDataRefresh must be used inside AppProviders");
  return context;
}

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  if (!context) throw new Error("usePageTitle must be used inside AppProviders");
  return context;
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useFeedback must be used inside AppProviders");
  return context;
}

export function useDetailPageTitle(title?: string) {
  const { setDetailTitle } = usePageTitle();

  useEffect(() => {
    setDetailTitle(title ?? null);
    return () => setDetailTitle(null);
  }, [setDetailTitle, title]);
}
