import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DataRefreshContext,
  FeedbackContext,
  PageTitleContext,
  ThemeContext,
  type Theme,
} from "./app-contexts";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [version, setVersion] = useState(0);
  const [detailTitle, setDetailTitle] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.dataset.theme = next;
      localStorage.setItem("fluxo-theme", next);
      return next;
    });
  }, []);

  const notifyDataChanged = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  const notify = useCallback((message: string) => setFeedbackMessage(message), []);
  const dismiss = useCallback(() => setFeedbackMessage(null), []);

  useEffect(() => {
    if (!feedbackMessage) return;
    const timeout = window.setTimeout(dismiss, 4000);
    return () => window.clearTimeout(timeout);
  }, [dismiss, feedbackMessage]);

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  const dataValue = useMemo(
    () => ({ version, notifyDataChanged }),
    [version, notifyDataChanged],
  );
  const pageTitleValue = useMemo(
    () => ({ detailTitle, setDetailTitle }),
    [detailTitle],
  );
  const feedbackValue = useMemo(
    () => ({ message: feedbackMessage, notify, dismiss }),
    [dismiss, feedbackMessage, notify],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <DataRefreshContext.Provider value={dataValue}>
        <PageTitleContext.Provider value={pageTitleValue}>
          <FeedbackContext.Provider value={feedbackValue}>
            {children}
          </FeedbackContext.Provider>
        </PageTitleContext.Provider>
      </DataRefreshContext.Provider>
    </ThemeContext.Provider>
  );
}
