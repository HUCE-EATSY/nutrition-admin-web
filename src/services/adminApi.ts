import axios from 'axios';
import { adminTokenStore } from './adminTokenStore';
import type { 
  AdminUser, 
  PremiumPackage, 
  Transaction, 
  AdminFood, 
  AdminFoodCategory,
  AdminExercise, 
  DashboardStats, 
  FoodStats, 
  ExerciseStats, 
  PaginatedResponse, 
  UserStats 
} from './adminTypes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5184/api';

// Admin API Client
const adminApiClient = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add admin token
adminApiClient.interceptors.request.use(
  async (config) => {
    const token = adminTokenStore.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
adminApiClient.interceptors.response.use(
  (response) => {
    // Automatically unwrap backend { success: true, data: ... } or { isSuccess: true, data: ... } wrapper
    const hasWrapper = (response.data && 
      (response.data.success !== undefined || response.data.isSuccess !== undefined) && 
      response.data.data !== undefined);
    
    if (hasWrapper) {
      if (Array.isArray(response.data.data)) {
        // Convert to paginated response for lists
        response.data = {
          data: response.data.data,
          total: response.data.data.length,
          page: 1,
          pageSize: 20,
          totalPages: 1
        };
      } else {
        response.data = response.data.data;
        // Normalize PaginatedResponse from C# (items -> data, totalCount -> total)
        if (response.data && response.data.items !== undefined) {
          response.data.data = response.data.items;
          response.data.total = response.data.totalCount;
        }
      }
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      adminTokenStore.clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION ====================

export const adminAuth = {
  login: async (email: string, password: string) => {
    const response = await adminApiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      adminTokenStore.setToken(response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    adminTokenStore.clearToken();
  },

  checkAuth: async () => {
    const token = adminTokenStore.getToken();
    return !!token;
  },
};

// ==================== DASHBOARD ====================

export interface RecentActivity {
  id: string;
  type: 'user' | 'food' | 'exercise';
  action: string;
  description: string;
  timestamp: string;
}

export const adminDashboard = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await adminApiClient.get('/dashboard/stats');
    return response.data;
  },

  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    const response = await adminApiClient.get('/dashboard/recent-activity', {
      params: { limit },
    });
    return Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
  },

  getUserGrowth: async () => {
    const response = await adminApiClient.get('/dashboard/user-growth');
    return Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
  }
};

// ==================== USERS MANAGEMENT ====================

export const adminUsers = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<AdminUser>> => {
    const response = await adminApiClient.get('/users', { params });
    return response.data;
  },

  getById: async (id: string): Promise<AdminUser> => {
    const response = await adminApiClient.get(`/users/${id}`);
    return response.data;
  },

  toggleLock: async (id: string): Promise<AdminUser> => {
    const response = await adminApiClient.put(`/users/${id}/toggle-lock`);
    return response.data;
  },

  grantPremium: async (userId: string, packageId: number): Promise<AdminUser> => {
    const response = await adminApiClient.post(`/users/${userId}/grant-premium`, { packageId });
    return response.data;
  },

  revokePremium: async (userId: string): Promise<AdminUser> => {
    const response = await adminApiClient.post(`/users/${userId}/revoke-premium`);
    return response.data;
  },

  getStats: async (): Promise<UserStats> => {
    const response = await adminApiClient.get('/users/stats');
    return response.data;
  },
};

// ==================== PREMIUM PACKAGES & TRANSACTIONS ====================

export const adminPremium = {
  getPackages: async (): Promise<PremiumPackage[]> => {
    const response = await adminApiClient.get('/premium/packages');
    return Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
  },

  createPackage: async (data: Partial<PremiumPackage>): Promise<PremiumPackage> => {
    const response = await adminApiClient.post('/premium/packages', data);
    return response.data;
  },

  updatePackage: async (id: number, data: Partial<PremiumPackage>): Promise<PremiumPackage> => {
    const response = await adminApiClient.put(`/premium/packages/${id}`, data);
    return response.data;
  },

  deletePackage: async (id: number): Promise<void> => {
    await adminApiClient.delete(`/premium/packages/${id}`);
  },

  getTransactions: async (params?: { page?: number; pageSize?: number; status?: string }): Promise<PaginatedResponse<Transaction>> => {
    const response = await adminApiClient.get('/premium/transactions', { params });
    return response.data;
  },
};

// ==================== FOODS MANAGEMENT ====================

export const adminFoods = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    categoryId?: number;
    status?: number;
  }): Promise<PaginatedResponse<AdminFood>> => {
    const response = await adminApiClient.get('/foods', { params });
    return response.data;
  },

  getById: async (id: string): Promise<AdminFood> => {
    const response = await adminApiClient.get(`/foods/${id}`);
    return response.data;
  },

  create: async (data: {
    nameVi: string;
    nameEn?: string;
    categoryId: number;
    servingSizeG: number;
    servingUnitVi?: string;
    thumbnailUrl?: string;
    nutrition: { caloriesKcal: number; proteinG: number; carbsG: number; fatG: number };
  }): Promise<AdminFood> => {
    const response = await adminApiClient.post('/foods', data);
    return response.data;
  },

  update: async (id: string, data: {
    nameVi?: string;
    nameEn?: string;
    categoryId?: number;
    servingSizeG?: number;
    servingUnitVi?: string;
    thumbnailUrl?: string;
    nutrition?: { caloriesKcal: number; proteinG: number; carbsG: number; fatG: number };
  }): Promise<AdminFood> => {
    const response = await adminApiClient.put(`/foods/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await adminApiClient.delete(`/foods/${id}`);
  },

  toggleVisibility: async (id: string): Promise<void> => {
    await adminApiClient.put(`/foods/${id}/toggle-visibility`);
  },

  getStats: async (): Promise<FoodStats> => {
    const response = await adminApiClient.get('/foods/stats');
    return response.data;
  },

  getCategories: async (): Promise<AdminFoodCategory[]> => {
    const response = await adminApiClient.get('/foods/categories');
    // The interceptor wraps array responses in a paginated object { data: [...] }
    // so we need to unwrap it here
    return Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
  },
};

// ==================== EXERCISES MANAGEMENT ====================

export const adminExercises = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    categoryId?: number;
    status?: number;
  }): Promise<PaginatedResponse<AdminExercise>> => {
    const response = await adminApiClient.get('/exercises', { params });
    return response.data;
  },

  getById: async (id: string): Promise<AdminExercise> => {
    const response = await adminApiClient.get(`/exercises/${id}`);
    return response.data;
  },

  create: async (data: {
    categoryId: number;
    nameVi: string;
    nameEn?: string;
    description?: string;
    metValue: number;
    unit?: string;
    iconUrl?: string;
  }): Promise<AdminExercise> => {
    const response = await adminApiClient.post('/exercises', data);
    return response.data;
  },

  update: async (id: string, data: {
    categoryId?: number;
    nameVi?: string;
    nameEn?: string;
    description?: string;
    metValue?: number;
    unit?: string;
    iconUrl?: string;
    status?: number;
  }): Promise<AdminExercise> => {
    const response = await adminApiClient.put(`/exercises/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await adminApiClient.delete(`/exercises/${id}`);
  },

  toggleVisibility: async (id: string): Promise<AdminExercise> => {
    const response = await adminApiClient.put(`/exercises/${id}/toggle-visibility`);
    return response.data;
  },

  getStats: async (): Promise<ExerciseStats> => {
    const response = await adminApiClient.get('/exercises/stats');
    return response.data;
  },

  getCategories: async (): Promise<any[]> => {
    const response = await adminApiClient.get('/exercises/categories');
    return Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
  },
};

// ==================== SUBSCRIPTIONS (PREMIUM) MANAGEMENT ====================

export interface Subscription {
  id: string;
  userId: string;
  userDisplayName: string;
  planName: string;
  planCode: string;
  price: number;
  status: string;
  currentPeriodEnd: string;
  createdAt: string;
  orderId?: string;
}

export interface SubscriptionStats {
  totalPremium: number;
  activePremium: number;
  expiredPremium: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export const adminSubscriptions = {
  // Lấy tất cả subscriptions
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: 'active' | 'trialing' | 'expired' | 'cancelled';
    planId?: number;
  }): Promise<PaginatedResponse<Subscription>> => {
    const response = await adminApiClient.get('/subscriptions', { params });
    return response.data;
  },

  // Lấy subscription history của user
  getUserSubscriptions: async (userId: string): Promise<Subscription[]> => {
    const response = await adminApiClient.get(`/subscriptions/user/${userId}`);
    return Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
  },

  // Cấp Premium
  grantPremium: async (userId: string, data: {
    planId: number;
    durationDays?: number;
    note?: string;
  }): Promise<Subscription> => {
    const response = await adminApiClient.post(`/subscriptions/user/${userId}/grant`, data);
    return response.data;
  },

  // Thu hồi Premium
  revokePremium: async (userId: string): Promise<void> => {
    await adminApiClient.put(`/subscriptions/user/${userId}/revoke`);
  },

  // Gia hạn Premium
  extendPremium: async (userId: string, data: { additionalDays: number }): Promise<Subscription> => {
    const response = await adminApiClient.put(`/subscriptions/user/${userId}/extend`, data);
    return response.data;
  },

  // Thống kê
  getStats: async (): Promise<SubscriptionStats> => {
    const response = await adminApiClient.get('/subscriptions/stats');
    return response.data;
  },
};

export default adminApiClient;
