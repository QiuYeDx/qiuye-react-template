import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { 
  UserIcon, 
  ShieldCheckIcon, 
  Cog6ToothIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import { useUserStore } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useUserStore();
  const { theme, setMode } = useThemeStore();
  const { logout } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 个人资料表单
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: "",
    },
  });

  // 密码修改表单
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // 保存个人资料
  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({
        name: data.name,
        email: data.email,
      });
      
      setIsEditingProfile(false);
      // TODO: 显示成功消息
    } catch (error) {
      // TODO: 显示错误消息
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 修改密码
  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError("confirmPassword", {
        message: t("profile.messages.passwordMismatch")
      });
      return;
    }

    setIsSaving(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      passwordForm.reset();
      setIsChangingPassword(false);
      // TODO: 显示成功消息
    } catch (error) {
      // TODO: 显示错误消息
      console.error("Failed to change password:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 上传头像
  const handleAvatarUpload = () => {
    // TODO: 实现头像上传
    console.log("Upload avatar");
  };

  // 切换主题
  const handleThemeChange = (isDark: boolean) => {
    setMode(isDark ? "dark" : "light");
  };

  // 切换语言
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("profile.title")}</h1>
        <p className="text-muted-foreground">{t("profile.subtitle")}</p>
      </div>

      {/* 主要内容 */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            {t("profile.tabs.general")}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4" />
            {t("profile.tabs.security")}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Cog6ToothIcon className="h-4 w-4" />
            {t("profile.tabs.preferences")}
          </TabsTrigger>
        </TabsList>

        {/* 基本信息 */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.general.basicInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 头像部分 */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAvatarUpload}
                  >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    {t("profile.general.changeAvatar")}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <Separator />

              {/* 个人信息表单 */}
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.general.name")}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditingProfile}
                              placeholder="Your name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.general.email")}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              disabled={!isEditingProfile}
                              placeholder="your.email@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.general.bio")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            disabled={!isEditingProfile}
                            placeholder={t("profile.general.bioPlaceholder")}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    {!isEditingProfile ? (
                      <Button onClick={() => setIsEditingProfile(true)}>
                        {t("profile.actions.edit")}
                      </Button>
                    ) : (
                      <>
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? t("profile.actions.saving") : t("profile.actions.save")}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsEditingProfile(false);
                            profileForm.reset();
                          }}
                        >
                          {t("profile.actions.cancel")}
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value="security" className="space-y-6">
          {/* 密码设置 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.security.passwordSecurity")}</CardTitle>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <Button onClick={() => setIsChangingPassword(true)}>
                  {t("profile.security.changePassword")}
                </Button>
              ) : (
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.security.currentPassword")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="输入当前密码"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? (
                                  <EyeSlashIcon className="h-4 w-4" />
                                ) : (
                                  <EyeIcon className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.security.newPassword")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type={showNewPassword ? "text" : "password"}
                                placeholder="输入新密码"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? (
                                  <EyeSlashIcon className="h-4 w-4" />
                                ) : (
                                  <EyeIcon className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.security.confirmNewPassword")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="确认新密码"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeSlashIcon className="h-4 w-4" />
                                ) : (
                                  <EyeIcon className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? t("profile.actions.saving") : t("profile.security.changePassword")}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsChangingPassword(false);
                          passwordForm.reset();
                        }}
                      >
                        {t("profile.actions.cancel")}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* 双重认证 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.security.twoFactor")}</CardTitle>
              <CardDescription>
                {t("profile.security.twoFactorDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profile.security.enableTwoFactor")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("profile.security.twoFactorDesc")}
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 偏好设置 */}
        <TabsContent value="preferences" className="space-y-6">
          {/* 外观设置 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.preferences.appearance")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profile.preferences.theme")}</Label>
                  <p className="text-sm text-muted-foreground">
                    切换应用的亮色/暗色主题
                  </p>
                </div>
                <Switch 
                  checked={theme.mode === "dark"}
                  onCheckedChange={handleThemeChange}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>{t("profile.preferences.language")}</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={i18n.language === "zh-CN" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLanguageChange("zh-CN")}
                  >
                    中文
                  </Button>
                  <Button 
                    variant={i18n.language === "en-US" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLanguageChange("en-US")}
                  >
                    English
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 通知设置 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.preferences.notifications")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profile.preferences.emailNotifications")}</Label>
                  <p className="text-sm text-muted-foreground">
                    接收重要更新和通知的邮件
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profile.preferences.securityAlerts")}</Label>
                  <p className="text-sm text-muted-foreground">
                    账户安全相关的警报通知
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("profile.preferences.marketingEmails")}</Label>
                  <p className="text-sm text-muted-foreground">
                    产品更新和推广信息
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage; 