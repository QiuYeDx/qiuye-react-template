import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";

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
      toast.error(data.message || "请求失败");
      return Promise.reject(new Error(data.message || "请求失败"));
    }
  },
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          toast.error("未授权，请重新登录");
          useUserStore.getState().logout();
          break;
        case 403:
          toast.error("拒绝访问");
          break;
        case 404:
          toast.error("请求地址出错");
          break;
        case 500:
          toast.error("服务器内部错误");
          break;
        default:
          toast.error("网络错误");
      }
    } else {
      toast.error("网络错误");
    }

    return Promise.reject(error);
  }
);

export default request;
