import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { useThemeStore } from "./store/useThemeStore";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  const { theme: themeConfig } = useThemeStore();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <AppRoutes />
          <Toaster
            position="top-right"
            theme={themeConfig.mode === "dark" ? "dark" : "light"}
            toastOptions={{
              className: 'custom-toast',
            }}
          />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
