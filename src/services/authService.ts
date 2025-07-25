// 认证相关的API服务
// 这里提供了API接口的抽象层，方便后续对接真实的后端服务

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    token: string;
  };
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 模拟API请求延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟用户数据库
const mockUsers = [
  {
    id: "1",
    name: "QiuYeDx",
    email: "qiuyedx@example.com",
    password: "123456",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2", 
    name: "张三",
    email: "zhangsan@example.com",
    password: "123456",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  }
];

class AuthService {
  // 登录API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await delay(1500); // 模拟网络延迟

    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token: `mock-jwt-token-${user.id}-${Date.now()}`,
        },
      };
    }

    return {
      success: false,
      error: "邮箱或密码错误",
    };
  }

  // 注册API
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    await delay(1500); // 模拟网络延迟

    // 检查邮箱是否已存在
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        error: "邮箱已被注册",
      };
    }

    // 检查密码确认
    if (userData.password !== userData.confirmPassword) {
      return {
        success: false,
        error: "密码确认不匹配",
      };
    }

    // 创建新用户
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
    };

    mockUsers.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
      },
    };
  }

  // 登出API
  async logout(): Promise<ApiResponse> {
    await delay(500); // 模拟网络延迟
    return {
      success: true,
      message: "登出成功",
    };
  }

  // 获取用户信息API
  async getUserInfo(token: string): Promise<AuthResponse> {
    await delay(800); // 模拟网络延迟
    
    // 这里可以根据token获取用户信息
    // 实际项目中会向后端发送请求验证token
    return {
      success: true,
      data: {
        user: mockUsers[0],
        token,
      },
    };
  }

  // 刷新令牌API
  async refreshToken(token: string): Promise<AuthResponse> {
    await delay(600); // 模拟网络延迟
    
    return {
      success: true,
      data: {
        user: mockUsers[0],
        token: `refreshed-${token}-${Date.now()}`,
      },
    };
  }
}

// 导出单例
export const authService = new AuthService();
export default authService; 