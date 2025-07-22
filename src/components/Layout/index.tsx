import React, { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MoonIcon, SunIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
// Logo资源引入
import QiuyeLeafIcon from "@/assets/images/logos/qiuye-leaf-icon.svg";
import { useThemeStore } from "@/store/useThemeStore";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, setMode } = useThemeStore();

  // 路由切换时滚动到页面顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => {
    setMode(theme.mode === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/50 backdrop-blur-md">
        <div className="flex items-center basis-1/4">
          {/* 窄屏显示图标 */}
          <div className="md:hidden">
            <img
              src={QiuyeLeafIcon}
              alt="Qiuye Template"
              className="w-11 h-11"
            />
          </div>
          {/* 宽屏显示图标+文字组合 */}
          <div className="hidden md:flex items-center space-x-3">
            <img src={QiuyeLeafIcon} alt="Qiuye" className="w-8 h-8" />
            <div className="text-xl font-bold text-foreground whitespace-nowrap">
              Qiuye Template
            </div>
          </div>
        </div>

        <div className="max-w-md basis-1/2 flex justify-center mx-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild active={location.pathname === "/"}>
                  <Link
                    to="/"
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                      location.pathname === "/"
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {t("nav.home")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  active={location.pathname === "/about"}
                >
                  <Link
                    to="/about"
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                      location.pathname === "/about"
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {t("nav.about")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex justify-end items-center space-x-2 basis-1/4">
          <Tooltip delayDuration={300}>
            <TooltipTrigger>
              <Button
                asChild
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg transition-all duration-200 scale-in cursor-pointer"
              >
                {theme.mode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              {theme.mode === "light"
                ? t("theme.switchToDark")
                : t("theme.switchToLight")}
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg transition-all duration-200 scale-in cursor-pointer"
                aria-label={t("theme.languageSelect")}
              >
                <GlobeAltIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => i18n.changeLanguage("zh-CN")}>
                {t("language.chinese")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage("en-US")}>
                {t("language.english")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="container section-padding fade-in">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border text-center py-6">
        <div className="container">
          <p className="text-muted-foreground text-sm">
            Qiuye React Template ©{new Date().getFullYear()} Created with ❤️ by{" "}
            <a
              href="https://github.com/QiuYeDx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline decoration-2 underline-offset-2 hover:decoration-primary/60"
            >
              QiuYeDx
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
