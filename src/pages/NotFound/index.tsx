import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExclamationTriangleIcon, HomeIcon } from "@heroicons/react/24/outline";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          {/* 404 图标 */}
          <div className="mb-6">
            <ExclamationTriangleIcon className="w-24 h-24 mx-auto text-muted-foreground/50" />
          </div>

          {/* 404 文字 */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t("pages.notFound.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("pages.notFound.description")}
            </p>
          </div>

          {/* 返回按钮 */}
          <Button onClick={handleBackHome} className="inline-flex items-center">
            <HomeIcon className="w-4 h-4 mr-0.5" />
            {t("pages.notFound.backHome")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
