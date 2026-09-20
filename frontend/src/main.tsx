import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AppErrorBoundary from "./components/ui/AppErrorBoundary.tsx";

const savedTheme = localStorage.getItem("fluxo-theme");
const initialTheme = savedTheme === "dark" ? "dark" : "light";
document.documentElement.classList.toggle("dark", initialTheme === "dark");
document.documentElement.dataset.theme = initialTheme;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
