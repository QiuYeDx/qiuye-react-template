import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MoonIcon,
  SunIcon,
  GlobeAltIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
// Logo资源引入
import QiuyeLeafIcon from "@/assets/images/logos/qiuye-leaf-icon.svg";
import { useThemeStore } from "@/store/useThemeStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { LoadingComponent } from "@/components/Loading";
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
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, setMode } = useThemeStore();
  const { isLoading, config } = useLoadingStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 路由切换时滚动到页面顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => {
    setMode(theme.mode === "light" ? "dark" : "light");
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  const navItems = [
    { path: "/", key: "nav.home" },
    { path: "/about", key: "nav.about" },
    { path: "/loading-debug", key: "nav.loadingDebug" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/50 bg-background">
        <div className="flex items-center basis-1/4">
          {/* 移动端汉堡菜单按钮 */}
          <div className="md:hidden mr-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Bars3Icon className="size-6" />
                  <span className="sr-only">{t("nav.menu")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-6 pb-4">
                  <SheetTitle className="text-left">{t("nav.menu")}</SheetTitle>
                </SheetHeader>

                <div className="px-6 space-y-4">
                  {/* 导航菜单 */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      {t("nav.navigation")}
                    </h3>
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeSheet}
                        className={`flex items-center w-full h-10 px-3 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                          location.pathname === item.path
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </div>

                  <Separator />

                  {/* 主题切换 */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t("theme.appearance")}
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={toggleTheme}
                      className="w-full justify-start h-10 px-3"
                    >
                      {theme.mode === "light" ? (
                        <MoonIcon className="w-5 h-5 mr-3" />
                      ) : (
                        <SunIcon className="w-5 h-5 mr-3" />
                      )}
                      {theme.mode === "light"
                        ? t("theme.switchToDark")
                        : t("theme.switchToLight")}
                    </Button>
                  </div>

                  <Separator />

                  {/* 语言切换 */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {t("theme.language")}
                    </h3>
                    <div className="space-y-1">
                      <Button
                        variant={
                          i18n.language === "zh-CN" ? "secondary" : "ghost"
                        }
                        onClick={() => i18n.changeLanguage("zh-CN")}
                        className="w-full justify-start h-10 px-3"
                      >
                        <GlobeAltIcon className="w-5 h-5 mr-3" />
                        {t("language.chinese")}
                      </Button>
                      <Button
                        variant={
                          i18n.language === "en-US" ? "secondary" : "ghost"
                        }
                        onClick={() => i18n.changeLanguage("en-US")}
                        className="w-full justify-start h-10 px-3"
                      >
                        <GlobeAltIcon className="w-5 h-5 mr-3" />
                        {t("language.english")}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* 宽屏显示图标+文字组合 */}
          <div className="hidden md:flex items-center space-x-1">
            <img src={QiuyeLeafIcon} alt="Qiuye" className="w-11 h-11" />
            <div className="text-xl font-bold text-foreground whitespace-nowrap">
              QiuYe Template
            </div>
          </div>
        </div>

        {/* 窄屏居中显示文字 */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2">
          <div className="text-xl font-bold text-foreground whitespace-nowrap">
            QiuYe Template
          </div>
        </div>

        {/* 桌面端导航菜单 */}
        <div className="max-w-md basis-1/2 justify-center mx-1 hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavigationMenuLink
                    asChild
                    active={location.pathname === item.path}
                  >
                    <Link
                      to={item.path}
                      className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                        location.pathname === item.path
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {t(item.key)}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* 桌面端右侧按钮 */}
        <div className="justify-end items-center space-x-2 basis-1/4 hidden md:flex">
          <Tooltip delayDuration={300}>
            <TooltipTrigger>
              <Button
                asChild
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-11 h-11 rounded-lg transition-all duration-200 scale-in cursor-pointer"
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
                className="w-11 h-11 rounded-lg transition-all duration-200 scale-in cursor-pointer"
                aria-label={t("theme.languageSelect")}
              >
                <GlobeAltIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={i18n.language}
                onValueChange={(value) => i18n.changeLanguage(value)}
              >
                <DropdownMenuRadioItem value="zh-CN">
                  {t("language.chinese")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en-US">
                  {t("language.english")}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
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
            QiuYe React Template ©{new Date().getFullYear()} Created with ❤️ by{" "}
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

      {/* 全局Loading组件 */}
      {isLoading && (
        <LoadingComponent className={config.className} text={config.text} />
      )}
    </div>
  );
};

export default Layout;
