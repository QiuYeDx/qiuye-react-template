import React from "react";
import { useTranslation } from "react-i18next";
import { useTrail, animated, useSpring } from "@react-spring/web";
import {
  CodeBracketIcon,
  RocketLaunchIcon,
  HeartIcon,
  SparklesIcon,
  CheckCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const About: React.FC = () => {
  const { t } = useTranslation();

  // 页面标题动画
  const titleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 280, friction: 60 },
    delay: 100,
  });

  // 技术栈数据
  const techStack = [
    {
      name: "React 18",
      type: "framework",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      name: "TypeScript",
      type: "language",
      color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    },
    {
      name: "Vite",
      type: "build",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      name: "Tailwind CSS v4",
      type: "styling",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      name: "Shadcn/ui",
      type: "ui",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      name: "Zustand",
      type: "state",
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    },
    {
      name: "React Router",
      type: "routing",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
    {
      name: "React i18next",
      type: "i18n",
      color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    },
    {
      name: "Axios",
      type: "http",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    },
    {
      name: "React Spring",
      type: "animation",
      color: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300",
    },
  ];

  // 特性数据
  const features = [
    {
      icon: <RocketLaunchIcon className="w-5 h-5" />,
      title: t("pages.about.features.items.modern.title"),
      description: t("pages.about.features.items.modern.description"),
    },
    {
      icon: <SparklesIcon className="w-5 h-5" />,
      title: t("pages.about.features.items.elegant.title"),
      description: t("pages.about.features.items.elegant.description"),
    },
    {
      icon: <CodeBracketIcon className="w-5 h-5" />,
      title: t("pages.about.features.items.dx.title"),
      description: t("pages.about.features.items.dx.description"),
    },
    {
      icon: <HeartIcon className="w-5 h-5" />,
      title: t("pages.about.features.items.outOfBox.title"),
      description: t("pages.about.features.items.outOfBox.description"),
    },
  ];

  // 技术栈动画
  const techTrail = useTrail(techStack.length, {
    from: {
      opacity: 0,
      transform: "translateY(30px) scale(0.9) rotateX(-15deg)",
      filter: "blur(8px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0px) scale(1) rotateX(0deg)",
      filter: "blur(0px)",
    },
    config: { tension: 200, friction: 25 },
    delay: 300,
    trail: 80, // 每个元素间隔80ms出现
  });

  // 特性动画
  const featureTrail = useTrail(features.length, {
    from: { opacity: 0, transform: "translateX(-20px)" },
    to: { opacity: 1, transform: "translateX(0px)" },
    config: { tension: 280, friction: 60 },
    delay: 600,
  });

  // 卡片容器动画
  const cardContainers = [
    "features", // 特性卡片
    "timeline", // 发展历程卡片
    "techStack", // 技术栈卡片
    "projectInfo", // 项目信息卡片
    "thanks", // 感谢卡片
  ];

  const cardTrail = useTrail(cardContainers.length, {
    from: {
      opacity: 0,
      transform: "translateY(40px) scale(0.95)",
      filter: "blur(10px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0px) scale(1)",
      filter: "blur(0px)",
    },
    config: { tension: 180, friction: 30 },
    delay: 400,
    trail: 150, // 每个卡片间隔150ms出现
  });

  // 时间线数据
  const timelineItems = [
    {
      icon: <CheckCircleIcon className="w-4 h-4 text-green-500" />,
      title: t("pages.about.timeline.items.init.title"),
      description: t("pages.about.timeline.items.init.description"),
    },
    {
      icon: <SparklesIcon className="w-4 h-4 text-blue-500" />,
      title: t("pages.about.timeline.items.core.title"),
      description: t("pages.about.timeline.items.core.description"),
    },
    {
      icon: <StarIcon className="w-4 h-4 text-purple-500" />,
      title: t("pages.about.timeline.items.tailwind.title"),
      description: t("pages.about.timeline.items.tailwind.description"),
    },
    {
      icon: <RocketLaunchIcon className="w-4 h-4 text-orange-500" />,
      title: t("pages.about.timeline.items.optimize.title"),
      description: t("pages.about.timeline.items.optimize.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 页面标题 */}
      <animated.div style={titleAnimation} className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("pages.about.title")}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t("pages.about.subtitle")}
        </p>
      </animated.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* 项目介绍 */}
        <div className="space-y-6">
          <animated.div style={cardTrail[0]}>
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold flex items-center text-foreground">
                  <SparklesIcon className="w-6 h-6 mr-2 text-primary" />
                  {t("pages.about.features.title")}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featureTrail.map((style, index) => {
                    const feature = features[index];
                    return (
                      <animated.div key={index} style={style}>
                        <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="text-primary mt-1">
                            {feature.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground mb-1">
                              {feature.title}
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                              {feature.description}
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </animated.div>

          {/* 发展历程 */}
          <animated.div style={cardTrail[1]}>
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold flex items-center text-foreground">
                  <RocketLaunchIcon className="w-6 h-6 mr-2 text-primary" />
                  {t("pages.about.timeline.title")}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timelineItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{item.icon}</div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {item.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </animated.div>
        </div>

        {/* 技术栈 */}
        <div className="space-y-6">
          <animated.div style={cardTrail[2]}>
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold flex items-center text-foreground">
                  <CodeBracketIcon className="w-6 h-6 mr-2 text-primary" />
                  {t("pages.about.techStack.title")}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {t("pages.about.techStack.description")}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {techTrail.map((style, index) => {
                    const tech = techStack[index];
                    return (
                      <animated.div key={tech.name} style={style}>
                        <Badge
                          variant="secondary"
                          className={`w-full text-center py-2 px-3 rounded-lg font-medium hover:bg-secondary/80 transition-transform cursor-default`}
                        >
                          {tech.name}
                        </Badge>
                      </animated.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </animated.div>

          {/* 项目统计 */}
          <animated.div style={cardTrail[3]}>
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold flex items-center text-foreground">
                  <StarIcon className="w-6 h-6 mr-2 text-primary" />
                  {t("pages.about.projectInfo.title")}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">
                      {t("pages.about.projectInfo.version")}
                    </span>
                    <span className="font-semibold text-foreground">
                      v2.0.0
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">
                      {t("pages.about.projectInfo.lastUpdate")}
                    </span>
                    <span className="font-semibold text-foreground">
                      {/* TODO: 记得更新时间 */}
                      2025/7/22
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">
                      {t("pages.about.projectInfo.license")}
                    </span>
                    <span className="font-semibold text-foreground">MIT</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">
                      {t("pages.about.projectInfo.author")}
                    </span>
                    <span className="font-semibold text-foreground">
                      QiuYeDx
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">
                      {t("pages.about.projectInfo.github")}
                    </span>
                    <a
                      href="https://github.com/QiuYeDx/qiuye-react-template"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:text-primary/80 transition-colors underline decoration-2 underline-offset-2 hover:decoration-primary/60"
                    >
                      {t("pages.about.projectInfo.viewSource")}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </animated.div>
        </div>
      </div>

      {/* 感谢板块 */}
      <animated.div style={cardTrail[4]}>
        <Card className="glass text-center">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center text-foreground">
                <HeartIcon className="w-6 h-6 mr-2 text-red-500" />
                {t("pages.about.thanks.title")}
              </h3>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t("pages.about.thanks.content")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full font-medium">
                  <HeartIcon className="w-5 h-5 mr-2" />
                  {t("pages.about.thanks.madeWithLove")}
                </div>

                <a
                  href="https://github.com/QiuYeDx/qiuye-react-template"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-border/50 hover:bg-border text-foreground rounded-full font-medium transition-all duration-300 hover:shadow-md group"
                >
                  <CodeBracketIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t("pages.about.thanks.starOnGitHub")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </animated.div>
    </div>
  );
};

export default About;
