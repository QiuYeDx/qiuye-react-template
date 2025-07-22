import React from "react";
import { useTranslation } from "react-i18next";
import { useSpring, animated, useTrail } from "@react-spring/web";
import { toast } from "sonner";
import {
  RocketLaunchIcon,
  CogIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Home: React.FC = () => {
  const { t } = useTranslation();

  // 主要内容动画
  const heroAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 280, friction: 60 },
    delay: 200,
  });

  // 特性卡片数据
  const features = [
    {
      icon: <RocketLaunchIcon className="w-6 h-6" />,
      title: t("pages.home.features.items.fast.title"),
      description: t("pages.home.features.items.fast.description"),
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      badge: t("pages.home.features.items.fast.badge"),
    },
    {
      icon: <CogIcon className="w-6 h-6" />,
      title: t("pages.home.features.items.complete.title"),
      description: t("pages.home.features.items.complete.description"),
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      badge: t("pages.home.features.items.complete.badge"),
    },
    {
      icon: <HeartIcon className="w-6 h-6" />,
      title: t("pages.home.features.items.outOfBox.title"),
      description: t("pages.home.features.items.outOfBox.description"),
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      badge: t("pages.home.features.items.outOfBox.badge"),
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: t("pages.home.features.items.typeSafe.title"),
      description: t("pages.home.features.items.typeSafe.description"),
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      badge: t("pages.home.features.items.typeSafe.badge"),
    },
  ];

  // 特性卡片动画
  const trail = useTrail(features.length, {
    from: { opacity: 0, transform: "translateY(40px) scale(0.9)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    config: { tension: 280, friction: 60 },
    delay: 600,
  });

  const handleGetStarted = () => {
    toast.success(t("pages.home.messages.getStarted"));
  };

  const handleViewGitHub = () => {
    window.open("https://github.com/QiuYeDx/qiuye-react-template", "_blank");
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 z-100 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-16">
        <animated.div style={heroAnimation}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <SparklesIcon className="w-4 h-4 mr-2" />
            {t("pages.home.badge")}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 slide-in-from-bottom">
            {t("pages.home.title")}
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 slide-in-from-bottom">
            {t("pages.home.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="px-8 py-3 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              {t("pages.home.getStarted")}
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleViewGitHub}
              className="px-8 py-3 text-base font-medium rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              <CodeBracketIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {t("pages.home.github")}
            </Button>
          </div>
        </animated.div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <animated.div style={trail[0]} className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            {t("pages.home.features.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("pages.home.features.subtitle")}
          </p>
        </animated.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trail.map((style, index) => {
            const feature = features[index];
            return (
              <animated.div key={index} style={style}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 border-border/50 hover:border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`${feature.bgColor} w-16 h-16 rounded-2xl center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className={feature.color}>{feature.icon}</div>
                    </div>

                    <div className="flex items-center justify-center mb-3">
                      <h4 className="text-lg font-semibold text-foreground">
                        {feature.title}
                      </h4>
                      <Badge
                        variant="default"
                        className="ml-2 text-xs font-bold"
                      >
                        {feature.badge}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </animated.div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack Section */}
      <animated.div style={trail[features.length - 1]}>
        <Card className="glass p-8 text-center">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              {t("pages.home.techStack.title")}
            </h3>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[
                "React 18",
                "TypeScript",
                "Vite",
                "Tailwind CSS v4",
                "Shadcn/ui",
                "Zustand",
                "React Router",
                "React i18next",
              ].map((tech, index) => (
                <div
                  key={tech}
                  className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-default"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {tech}
                </div>
              ))}
            </div>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("pages.home.techStack.description")}
            </p>
          </CardContent>
        </Card>
      </animated.div>
    </div>
  );
};

export default Home;
