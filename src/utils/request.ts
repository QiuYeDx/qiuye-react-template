import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import i18n from "@/i18n";

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const { token } = useUserStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;

    // 根据后端约定处理响应
    if (data.code === 200) {
      return data.data;
    } else {
      toast.error(data.message || i18n.t("toast.requestFailed"));
      return Promise.reject(new Error(data.message || i18n.t("toast.requestFailed")));
    }
  },
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          toast.error(i18n.t("toast.unauthorized"));
          useUserStore.getState().logout();
          break;
        case 403:
          toast.error(i18n.t("toast.forbidden"));
          break;
        case 404:
          toast.error(i18n.t("toast.notFound"));
          break;
        case 500:
          toast.error(i18n.t("toast.serverError"));
          break;
        default:
          toast.error(i18n.t("toast.networkError"));
      }
    } else {
      toast.error(i18n.t("toast.networkError"));
    }

    return Promise.reject(error);
  }
);

export default request;
