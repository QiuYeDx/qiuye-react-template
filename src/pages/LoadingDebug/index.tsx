import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSpring, animated, useTrail } from "@react-spring/web";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingComponent, SimpleLoadingComponent } from "@/components/Loading";

const LoadingDebug: React.FC = () => {
  const { t } = useTranslation();
  const [showMainLoading, setShowMainLoading] = useState(false);
  const [showSimpleLoading, setShowSimpleLoading] = useState(false);
  const [loadingDuration, setLoadingDuration] = useState([2000]);
  const [isAutoTesting, setIsAutoTesting] = useState(false);

  // 页面标题动画
  const titleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 280, friction: 60 },
    delay: 100,
  });

  // Card容器动画
  const cardContainers = [
    "mainTest", // 主要测试卡片
    "variants", // 样式变体卡片
    "preview", // 预览卡片
    "usage", // 使用说明卡片
  ];

  const cardTrail = useTrail(cardContainers.length, {
    from: {
      opacity: 0,
      transform: "translateY(40px) scale(0.96)",
      filter: "blur(8px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0px) scale(1)",
      filter: "blur(0px)",
    },
    config: { tension: 200, friction: 28 },
    delay: 300,
    trail: 120, // 每个卡片间隔120ms出现
  });

  // 自动测试效果
  useEffect(() => {
    if (isAutoTesting) {
      const interval = setInterval(() => {
        setShowMainLoading(true);
        setTimeout(() => {
          setShowMainLoading(false);
        }, loadingDuration[0]);
      }, loadingDuration[0] + 1000);

      return () => clearInterval(interval);
    }
  }, [isAutoTesting, loadingDuration]);

  // 手动触发主加载效果
  const triggerMainLoading = () => {
    setShowMainLoading(true);
    setTimeout(() => {
      setShowMainLoading(false);
    }, loadingDuration[0]);
  };

  // 手动触发简单加载效果
  const triggerSimpleLoading = () => {
    setShowSimpleLoading(true);
    setTimeout(() => {
      setShowSimpleLoading(false);
    }, loadingDuration[0]);
  };

  // 各种加载样式组件
  const LoadingVariant1 = () => {
    const spin = useSpring({
      from: { transform: "rotate(0deg)" },
      to: { transform: "rotate(360deg)" },
      config: { duration: 1000 },
      loop: true,
    });

    return (
      <animated.div style={spin}>
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full"></div>
      </animated.div>
    );
  };

  const LoadingVariant2 = () => {
    const dots = [0, 1, 2];
    return (
      <div className="flex space-x-1">
        {dots.map((dot) => (
          <div
            key={dot}
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{
              animationDelay: `${dot * 0.15}s`,
              animationDuration: "0.6s",
            }}
          ></div>
        ))}
      </div>
    );
  };

  const LoadingVariant3 = () => {
    const bars = [0, 1, 2, 3, 4];
    return (
      <div className="flex items-end space-x-1 h-8">
        {bars.map((bar) => (
          <div
            key={bar}
            className="w-1 bg-primary rounded-full animate-pulse"
            style={{
              height: `${20 + Math.random() * 20}px`,
              animationDelay: `${bar * 0.1}s`,
              animationDuration: "0.8s",
            }}
          ></div>
        ))}
      </div>
    );
  };

  const loadingVariants = [
    {
      name: t("pages.loadingDebug.variants.rotatingRing"),
      component: <LoadingVariant1 />,
    },
    {
      name: t("pages.loadingDebug.variants.bouncingDots"),
      component: <LoadingVariant2 />,
    },
    {
      name: t("pages.loadingDebug.variants.rhythmBars"),
      component: <LoadingVariant3 />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 页面标题 */}
      <animated.div style={titleAnimation} className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
          <SparklesIcon className="w-8 h-8 mr-3 text-primary" />
          {t("pages.loadingDebug.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t("pages.loadingDebug.subtitle")}
        </p>
      </animated.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* 主要加载组件测试 */}
        <animated.div style={cardTrail[0]}>
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-bold flex items-center text-foreground">
                <ArrowPathIcon className="w-6 h-6 mr-2 text-primary" />
                {t("pages.loadingDebug.mainLoadingTest.title")}
              </h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 控制面板 */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t("pages.loadingDebug.mainLoadingTest.durationLabel")}:{" "}
                    {loadingDuration[0]}ms
                  </label>
                  <input
                    type="range"
                    value={loadingDuration[0]}
                    onChange={(e) =>
                      setLoadingDuration([parseInt(e.target.value)])
                    }
                    max={5000}
                    min={500}
                    step={100}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>500ms</span>
                    <span>5000ms</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={triggerMainLoading} variant="default">
                    <PlayIcon className="w-4 h-4 mr-2" />
                    {t("pages.loadingDebug.mainLoadingTest.testMainLoading")}
                  </Button>

                  <Button onClick={triggerSimpleLoading} variant="secondary">
                    <PlayIcon className="w-4 h-4 mr-2" />
                    {t("pages.loadingDebug.mainLoadingTest.testSimpleLoading")}
                  </Button>

                  <Button
                    onClick={() => setIsAutoTesting(!isAutoTesting)}
                    variant={isAutoTesting ? "destructive" : "outline"}
                  >
                    {isAutoTesting ? (
                      <>
                        <PauseIcon className="w-4 h-4 mr-2" />
                        {t("pages.loadingDebug.mainLoadingTest.stopAutoTest")}
                      </>
                    ) : (
                      <>
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {t("pages.loadingDebug.mainLoadingTest.startAutoTest")}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* 状态显示 */}
              <div className="flex flex-wrap gap-2">
                <Badge variant={showMainLoading ? "default" : "secondary"}>
                  {t("pages.loadingDebug.mainLoadingTest.status.mainLoading")}:{" "}
                  {showMainLoading
                    ? t("pages.loadingDebug.mainLoadingTest.status.showing")
                    : t("pages.loadingDebug.mainLoadingTest.status.hidden")}
                </Badge>
                <Badge variant={showSimpleLoading ? "default" : "secondary"}>
                  {t("pages.loadingDebug.mainLoadingTest.status.simpleLoading")}
                  :{" "}
                  {showSimpleLoading
                    ? t("pages.loadingDebug.mainLoadingTest.status.showing")
                    : t("pages.loadingDebug.mainLoadingTest.status.hidden")}
                </Badge>
                <Badge variant={isAutoTesting ? "destructive" : "outline"}>
                  {t("pages.loadingDebug.mainLoadingTest.status.autoTest")}:{" "}
                  {isAutoTesting
                    ? t("pages.loadingDebug.mainLoadingTest.status.running")
                    : t("pages.loadingDebug.mainLoadingTest.status.stopped")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </animated.div>

        {/* 加载样式变体 */}
        <animated.div style={cardTrail[1]}>
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-bold flex items-center text-foreground">
                <SparklesIcon className="w-6 h-6 mr-2 text-primary" />
                {t("pages.loadingDebug.variants.title")}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {loadingVariants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                  >
                    <div className="font-medium text-foreground">
                      {variant.name}
                    </div>
                    <div className="flex items-center space-x-4">
                      {variant.component}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </animated.div>
      </div>

      {/* 简单加载预览区域 */}
      {showSimpleLoading && (
        <animated.div style={cardTrail[2]}>
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                {t("pages.loadingDebug.preview.title")}
              </h3>
            </CardHeader>
            <CardContent>
              <SimpleLoadingComponent />
            </CardContent>
          </Card>
        </animated.div>
      )}

      {/* 使用说明 */}
      <animated.div style={cardTrail[3]}>
        <Card>
          <CardHeader>
            <h3 className="text-2xl font-bold text-foreground">
              {t("pages.loadingDebug.usage.title")}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <strong>
                    {t("pages.loadingDebug.mainLoadingTest.status.mainLoading")}
                    :
                  </strong>{" "}
                  {t("pages.loadingDebug.usage.mainLoading")}
                </li>
                <li>
                  <strong>
                    {t(
                      "pages.loadingDebug.mainLoadingTest.status.simpleLoading"
                    )}
                    :
                  </strong>{" "}
                  {t("pages.loadingDebug.usage.simpleLoading")}
                </li>
                <li>
                  <strong>{t("pages.loadingDebug.usage.title")}:</strong>{" "}
                  {t("pages.loadingDebug.usage.debugFeatures")}
                </li>
                <li>
                  <strong>{t("pages.loadingDebug.variants.title")}:</strong>{" "}
                  {t("pages.loadingDebug.usage.styleVariants")}
                </li>
                <li>
                  <strong>{t("pages.loadingDebug.usage.performance")}</strong>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </animated.div>

      {/* 主加载组件覆盖层 */}
      {showMainLoading && <LoadingComponent />}
    </div>
  );
};

export default LoadingDebug;
