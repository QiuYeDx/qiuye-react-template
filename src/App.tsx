import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import AppRoutes from "./routes";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { i18n } = useTranslation();
  const { theme: themeConfig } = useThemeStore();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm:
          themeConfig.mode === "dark"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
        token: {
          colorPrimary: themeConfig.primaryColor,
        },
      }}
    >
      <BrowserRouter>
        <div
          className={`min-h-screen ${
            themeConfig.mode === "dark" ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: themeConfig.mode === "dark" ? "#242527" : "#fff",
                color: themeConfig.mode === "dark" ? "#fff" : "#000",
              },
            }}
          />
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
