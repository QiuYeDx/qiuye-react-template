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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useUserStore();
  const { logout } = useAuth();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthenticated || !user) {
    // 未登录状态
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogin}
        className={`h-11 pl-3! pr-4! text-sm font-medium cursor-pointer ${className}`}
      >
        <UserIcon className="size-5 mr-0.5" />
        {t("user.login")}
      </Button>
    );
  }

  // 已登录状态
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="sm"
          className={`h-10 px-2 cursor-pointer ${className}`}
        >
          <Avatar className="mr-2 size-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-sm font-medium">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium max-w-20 truncate">
            {user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center">
          <Avatar className="mr-3 size-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-sm font-medium">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium max-w-36 truncate">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground max-w-36 truncate">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <UserIcon className="w-4 h-4 mr-2" />
          {t("user.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Cog6ToothIcon className="w-4 h-4 mr-2" />
          {t("user.settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
          {t("user.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserProfile };
