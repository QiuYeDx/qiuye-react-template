import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { useTranslation } from "react-i18next";
import AppRoutes from "./routes";
import { useThemeStore } from "./store/useThemeStore";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  const { i18n } = useTranslation();
  const { theme: themeConfig } = useThemeStore();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <AppRoutes />
          <Toaster
            position="top-right"
            richColors
            theme={themeConfig.mode === "dark" ? "dark" : "light"}
          />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
