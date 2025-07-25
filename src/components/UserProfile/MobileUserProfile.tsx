import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MobileUserProfileProps {
  onItemClick?: () => void;
}

const MobileUserProfile: React.FC<MobileUserProfileProps> = ({
  onItemClick,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useUserStore();
  const { logout } = useAuth();

  const handleLogin = () => {
    onItemClick?.(); // 先关闭抽屉
    navigate("/login");
  };

  const handleLogout = async () => {
    onItemClick?.(); // 先关闭抽屉
    await logout();
  };

  if (!isAuthenticated || !user) {
    // 未登录状态
    return (
      <div className="space-y-3">
        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
          <Avatar className="mr-3 size-10">
            <AvatarFallback className="text-base font-medium">U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("user.notLoggedIn")}</p>
            <p className="text-xs text-muted-foreground">
              {t("user.loginToAccessMore")}
            </p>
          </div>
        </div>
        <Button
          variant="default"
          onClick={handleLogin}
          className="w-full justify-start h-10 px-3"
        >
          <UserIcon className="w-5 h-5 mr-3" />
          {t("user.login")}
        </Button>
      </div>
    );
  }

  // 已登录状态
  return (
    <div className="space-y-3">
      {/* 用户信息卡片 */}
      <div className="flex items-center p-3 bg-muted/50 rounded-lg">
        <Avatar className="mr-3 size-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-base font-medium">
            {user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      {/* 用户操作按钮 */}
      <div className="space-y-1">
        <Button
          variant="ghost"
          onClick={() => {
            onItemClick?.();
            navigate("/profile");
          }}
          className="w-full justify-start h-10 px-3"
        >
          <UserIcon className="w-5 h-5 mr-3" />
          {t("user.profile")}
        </Button>
        <Button
          variant="ghost"
          onClick={onItemClick}
          className="w-full justify-start h-10 px-3"
        >
          <Cog6ToothIcon className="w-5 h-5 mr-3" />
          {t("user.settings")}
        </Button>
        <Separator className="my-2" />
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          {t("user.logout")}
        </Button>
      </div>
    </div>
  );
};

export { MobileUserProfile };
