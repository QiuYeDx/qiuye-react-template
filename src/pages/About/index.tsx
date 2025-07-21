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
    { name: "React 18", type: "framework", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    { name: "TypeScript", type: "language", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300" },
    { name: "Vite", type: "build", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
    { name: "Tailwind CSS v4", type: "styling", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
    { name: "Shadcn/ui", type: "ui", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    { name: "Zustand", type: "state", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
    { name: "React Router", type: "routing", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
    { name: "React i18next", type: "i18n", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300" },
    { name: "Axios", type: "http", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
    { name: "React Spring", type: "animation", color: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300" },
  ];

  // 特性数据
  const features = [
    {
      icon: <RocketLaunchIcon className="w-5 h-5" />,
      title: "现代化架构",
      description: "基于最新的 React 18 和 TypeScript 构建，拥抱现代化开发模式",
    },
    {
      icon: <SparklesIcon className="w-5 h-5" />,
      title: "优雅的 UI",
      description: "Shadcn/ui + Tailwind CSS v4 打造的精美界面和组件系统",
    },
    {
      icon: <CodeBracketIcon className="w-5 h-5" />,
      title: "开发体验",
      description: "Vite 极速构建，TypeScript 类型安全，ESLint 代码规范",
    },
    {
      icon: <HeartIcon className="w-5 h-5" />,
      title: "开箱即用",
      description: "预配置路由、状态管理、国际化、主题切换等常用功能",
    },
  ];

  // 技术栈动画
  const techTrail = useTrail(techStack.length, {
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 300, friction: 40 },
    delay: 300,
  });

  // 特性动画
  const featureTrail = useTrail(features.length, {
    from: { opacity: 0, transform: "translateX(-20px)" },
    to: { opacity: 1, transform: "translateX(0px)" },
    config: { tension: 280, friction: 60 },
    delay: 600,
  });

  // 时间线数据
  const timelineItems = [
    {
      icon: <CheckCircleIcon className="w-4 h-4 text-green-500" />,
      title: "项目初始化",
      description: "创建基础项目结构和配置",
    },
    {
      icon: <SparklesIcon className="w-4 h-4 text-blue-500" />,
      title: "核心功能集成",
      description: "路由、状态管理、国际化等",
    },
    {
      icon: <StarIcon className="w-4 h-4 text-purple-500" />,
      title: "Tailwind CSS v4 升级",
      description: "采用最新版本的 Tailwind CSS",
    },
    {
      icon: <RocketLaunchIcon className="w-4 h-4 text-orange-500" />,
      title: "持续优化",
      description: "性能优化和开发体验提升",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 页面标题 */}
      <animated.div style={titleAnimation} className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          关于我们
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Qiuye React Template 是一个现代化的 React 项目脚手架，
          致力于为开发者提供最佳的开发体验和项目架构。
        </p>
      </animated.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* 项目介绍 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-bold flex items-center text-foreground">
                <SparklesIcon className="w-6 h-6 mr-2 text-primary" />
                项目特色
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

          {/* 发展历程 */}
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-bold flex items-center text-foreground">
                <RocketLaunchIcon className="w-6 h-6 mr-2 text-primary" />
                发展历程
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.icon}
                    </div>
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
        </div>

        {/* 技术栈 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-bold flex items-center text-foreground">
                <CodeBracketIcon className="w-6 h-6 mr-2 text-primary" />
                技术栈
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                我们精心挑选了最优秀的工具和库，确保项目的现代化、可维护性和开发效率。
              </p>

              <div className="grid grid-cols-2 gap-3">
                {techTrail.map((style, index) => {
                  const tech = techStack[index];
                  return (
                    <animated.div key={tech.name} style={style}>
                      <Badge
                        variant="secondary"
                        className={`w-full text-center py-2 px-3 rounded-lg font-medium hover:scale-105 transition-transform cursor-default ${tech.color}`}
                      >
                        {tech.name}
                      </Badge>
                    </animated.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 项目统计 */}
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-bold flex items-center text-foreground">
                <StarIcon className="w-6 h-6 mr-2 text-primary" />
                项目信息
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">版本</span>
                  <span className="font-semibold text-foreground">v2.0.0</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">最后更新</span>
                  <span className="font-semibold text-foreground">{new Date().toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">许可证</span>
                  <span className="font-semibold text-foreground">MIT</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">作者</span>
                  <span className="font-semibold text-foreground">QiuYeDx</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 感谢板块 */}
      <Card className="glass text-center">
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center text-foreground">
              <HeartIcon className="w-6 h-6 mr-2 text-red-500" />
              感谢
            </h3>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              感谢所有开源项目的贡献者们，没有你们的努力就没有这个美好的开发生态。
              也感谢每一位使用这个模板的开发者，你们的反馈让项目变得更好。
            </p>
            
            <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full font-medium">
              <HeartIcon className="w-5 h-5 mr-2" />
              Made with Love
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
