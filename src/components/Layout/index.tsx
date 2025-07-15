import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout as AntdLayout, Menu, Button, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { MoonIcon, SunIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "@/store/useThemeStore";
import clsx from "clsx";

const { Header, Content, Footer } = AntdLayout;

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, setMode } = useThemeStore();

  const menuItems = [
    {
      key: "/",
      label: <Link to="/">{t("nav.home")}</Link>,
    },
    {
      key: "/about",
      label: <Link to="/about">{t("nav.about")}</Link>,
    },
  ];

  const languageItems = [
    {
      key: "zh-CN",
      label: "中文",
      onClick: () => i18n.changeLanguage("zh-CN"),
    },
    {
      key: "en-US",
      label: "English",
      onClick: () => i18n.changeLanguage("en-US"),
    },
  ];

  const toggleTheme = () => {
    setMode(theme.mode === "light" ? "dark" : "light");
  };

  // 根据主题模式动态设置Header样式
  const headerClassName =
    theme.mode === "light"
      ? "bg-white border-b border-gray-200"
      : "bg-gray-800 border-b border-gray-700";

  // 根据主题模式动态设置Logo文字颜色
  const logoClassName = theme.mode === "light" ? "text-gray-800" : "text-white";

  return (
    <AntdLayout className="min-h-screen">
      <Header
        className={clsx(
          headerClassName,
          "flex items-center justify-between sticky top-0 z-10"
        )}
      >
        <div className="flex items-center">
          <div
            className={clsx(
              logoClassName,
              "text-xl font-bold mr-8 text-nowrap"
            )}
          >
            Qiuye Template
          </div>
        </div>
        <div
          className={clsx(
            "flex-1",
            theme.mode === "dark"
              ? "border-b border-b-gray-700"
              : "border-b border-b-gray-200"
          )}
        >
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className={clsx(
              "border-none",
              theme.mode === "dark" ? "bg-gray-800" : "bg-white"
            )}
            theme={theme.mode === "dark" ? "dark" : "light"}
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button
            type="text"
            onClick={toggleTheme}
            className={clsx(
              "flex items-center justify-center px-[5px]",
              theme.mode === "dark" ? "text-white hover:bg-gray-700" : ""
            )}
          >
            {theme.mode === "light" ? (
              <MoonIcon className="w-5 h-5 flex-shrink-0" />
            ) : (
              <SunIcon className="w-5 h-5 flex-shrink-0" />
            )}
          </Button>
          <Dropdown menu={{ items: languageItems }} placement="bottomRight">
            <Button
              type="text"
              className={clsx(
                "flex items-center justify-center px-[5px]",
                theme.mode === "dark" ? "text-white hover:bg-gray-700" : ""
              )}
            >
              <GlobeAltIcon className="w-5 h-5 flex-shrink-0" />
            </Button>
          </Dropdown>
        </div>
      </Header>
      <Content className="px-6 py-4">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </Content>
      <Footer
        className={
          theme.mode === "light"
            ? "text-center bg-gray-50"
            : "text-center bg-gray-900 text-white"
        }
      >
        Qiuye React Template ©2025 Created by{" "}
        <a
          href="https://github.com/QiuYeDx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors underline"
        >
          QiuYeDx
        </a>
      </Footer>
    </AntdLayout>
  );
};

export default Layout;
