/**
 * Mock Admin API Service - Frontend-only mock (no backend needed)
 * Includes: Users, Foods, Exercises, VIP Packages, Transactions, Dashboard
 */

import { adminTokenStore } from './adminTokenStore';
import type { 
  AdminUser, 
  VipPackage, 
  Transaction, 
  AdminFood, 
  AdminFoodCategory,
  AdminExercise, 
  DashboardStats, 
  UserGrowthPoint 
} from './adminTypes';

// ============================================================
// MOCK DATA STORAGE
// ============================================================

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export let mockVipPackages: VipPackage[] = [
  {
    id: 1,
    name: 'VIP Basic',
    price: 49000,
    durationDays: 30,
    features: ['Theo dõi dinh dưỡng không giới hạn', 'Kế hoạch ăn kiêng', 'Phân tích calo chi tiết'],
    isActive: true,
    createdAt: daysAgo(120),
  },
  {
    id: 2,
    name: 'VIP Pro',
    price: 99000,
    durationDays: 30,
    features: ['Tất cả tính năng Basic', 'Tư vấn dinh dưỡng AI', 'Kế hoạch tập luyện', 'Báo cáo sức khỏe nâng cao'],
    isActive: true,
    createdAt: daysAgo(120),
  },
  {
    id: 3,
    name: 'VIP Annual',
    price: 799000,
    durationDays: 365,
    features: ['Tất cả tính năng Pro', 'Ưu tiên hỗ trợ', 'Truy cập sớm tính năng mới', 'Không quảng cáo'],
    isActive: true,
    createdAt: daysAgo(90),
  },
];

export let mockTransactions: Transaction[] = [
  { id: 1, userId: 2, userName: 'Nguyễn Văn An', userEmail: 'an.nguyen@gmail.com', packageId: 2, packageName: 'VIP Pro', amount: 99000, status: 'success', createdAt: daysAgo(2) },
  { id: 2, userId: 3, userName: 'Trần Thị Bình', userEmail: 'binh.tran@gmail.com', packageId: 1, packageName: 'VIP Basic', amount: 49000, status: 'success', createdAt: daysAgo(5) },
  { id: 3, userId: 5, userName: 'Lê Minh Cường', userEmail: 'cuong.le@gmail.com', packageId: 3, packageName: 'VIP Annual', amount: 799000, status: 'success', createdAt: daysAgo(8) },
  { id: 4, userId: 6, userName: 'Phạm Thị Dung', userEmail: 'dung.pham@gmail.com', packageId: 2, packageName: 'VIP Pro', amount: 99000, status: 'pending', createdAt: daysAgo(1) },
  { id: 5, userId: 7, userName: 'Hoàng Văn Em', userEmail: 'em.hoang@gmail.com', packageId: 1, packageName: 'VIP Basic', amount: 49000, status: 'failed', createdAt: daysAgo(3) },
  { id: 6, userId: 8, userName: 'Ngô Thị Phương', userEmail: 'phuong.ngo@gmail.com', packageId: 2, packageName: 'VIP Pro', amount: 99000, status: 'success', createdAt: daysAgo(35) },
  { id: 7, userId: 9, userName: 'Vũ Đình Giang', userEmail: 'giang.vu@gmail.com', packageId: 3, packageName: 'VIP Annual', amount: 799000, status: 'success', createdAt: daysAgo(40) },
  { id: 8, userId: 10, userName: 'Đặng Thị Hà', userEmail: 'ha.dang@gmail.com', packageId: 1, packageName: 'VIP Basic', amount: 49000, status: 'success', createdAt: daysAgo(38) },
];

export let mockUsers: AdminUser[] = [
  { id: 1, email: 'namdinh', name: 'Admin', isActive: true, isLocked: false, vipPackageId: null, vipPackageName: null, vipExpiresAt: null, createdAt: daysAgo(180) },
  { id: 2, email: 'an.nguyen@gmail.com', name: 'Nguyễn Văn An', isActive: true, isLocked: false, vipPackageId: 2, vipPackageName: 'VIP Pro', vipExpiresAt: new Date(now.getTime() + 22 * 86400000).toISOString(), createdAt: daysAgo(60) },
  { id: 3, email: 'binh.tran@gmail.com', name: 'Trần Thị Bình', isActive: true, isLocked: false, vipPackageId: 1, vipPackageName: 'VIP Basic', vipExpiresAt: new Date(now.getTime() + 18 * 86400000).toISOString(), createdAt: daysAgo(45) },
  { id: 4, email: 'chi.do@gmail.com', name: 'Đỗ Thị Chi', isActive: true, isLocked: false, vipPackageId: null, vipPackageName: null, vipExpiresAt: null, createdAt: daysAgo(30) },
  { id: 5, email: 'cuong.le@gmail.com', name: 'Lê Minh Cường', isActive: true, isLocked: false, vipPackageId: 3, vipPackageName: 'VIP Annual', vipExpiresAt: new Date(now.getTime() + 310 * 86400000).toISOString(), createdAt: daysAgo(90) },
  { id: 6, email: 'dung.pham@gmail.com', name: 'Phạm Thị Dung', isActive: true, isLocked: false, vipPackageId: null, vipPackageName: null, vipExpiresAt: null, createdAt: daysAgo(10) },
  { id: 7, email: 'em.hoang@gmail.com', name: 'Hoàng Văn Em', isActive: true, isLocked: true, vipPackageId: null, vipPackageName: null, vipExpiresAt: null, createdAt: daysAgo(25) },
  { id: 8, email: 'phuong.ngo@gmail.com', name: 'Ngô Thị Phương', isActive: true, isLocked: false, vipPackageId: 2, vipPackageName: 'VIP Pro', vipExpiresAt: new Date(now.getTime() - 5 * 86400000).toISOString(), createdAt: daysAgo(70) },
  { id: 9, email: 'giang.vu@gmail.com', name: 'Vũ Đình Giang', isActive: true, isLocked: false, vipPackageId: 3, vipPackageName: 'VIP Annual', vipExpiresAt: new Date(now.getTime() + 280 * 86400000).toISOString(), createdAt: daysAgo(50) },
  { id: 10, email: 'ha.dang@gmail.com', name: 'Đặng Thị Hà', isActive: true, isLocked: false, vipPackageId: 1, vipPackageName: 'VIP Basic', vipExpiresAt: new Date(now.getTime() - 2 * 86400000).toISOString(), createdAt: daysAgo(55) },
  { id: 11, email: 'hung.bui@gmail.com', name: 'Bùi Văn Hùng', isActive: true, isLocked: false, vipPackageId: null, vipPackageName: null, vipExpiresAt: null, createdAt: daysAgo(3) },
  { id: 12, email: 'lan.phan@gmail.com', name: 'Phan Thị Lan', isActive: true, isLocked: false, vipPackageId: null, vipPackageName: null, vipExpiresAt: null, createdAt: daysAgo(6) },
  { id: 13, email: 'minh.tong@gmail.com', name: 'Tống Minh', isActive: true, isLocked: false, vipPackageId: 2, vipPackageName: 'VIP Pro', vipExpiresAt: new Date(now.getTime() + 15 * 86400000).toISOString(), createdAt: daysAgo(20) },
];

export let mockFoods: AdminFood[] = [
  { id: 'mock-1', nameVi: 'Cơm trắng', nameEn: 'White Rice', categoryId: 1, status: 1, servingSizeG: 100, servingUnitVi: 'g', thumbnailUrl: null, createdAt: daysAgo(30), nutrition: { caloriesKcal: 130, proteinG: 2.7, carbsG: 28.2, fatG: 0.3 } },
  { id: 'mock-2', nameVi: 'Phở bò', nameEn: 'Beef Pho', categoryId: 1, status: 1, servingSizeG: 1, servingUnitVi: 'bát', thumbnailUrl: null, createdAt: daysAgo(28), nutrition: { caloriesKcal: 350, proteinG: 15, carbsG: 45, fatG: 12 } },
  { id: 'mock-3', nameVi: 'Gà luộc', nameEn: 'Boiled Chicken', categoryId: 4, status: 1, servingSizeG: 100, servingUnitVi: 'g', thumbnailUrl: null, createdAt: daysAgo(25), nutrition: { caloriesKcal: 165, proteinG: 31, carbsG: 0, fatG: 3.6 } },
  { id: 'mock-4', nameVi: 'Rau muống xào', nameEn: 'Stir-fried Morning Glory', categoryId: 2, status: 1, servingSizeG: 100, servingUnitVi: 'g', thumbnailUrl: null, createdAt: daysAgo(22), nutrition: { caloriesKcal: 85, proteinG: 3, carbsG: 8, fatG: 4 } },
  { id: 'mock-5', nameVi: 'Trứng chiên', nameEn: 'Fried Egg', categoryId: 5, status: 1, servingSizeG: 2, servingUnitVi: 'quả', thumbnailUrl: null, createdAt: daysAgo(20), nutrition: { caloriesKcal: 185, proteinG: 12, carbsG: 1, fatG: 14 } },
  { id: 'mock-6', nameVi: 'Chuối', nameEn: 'Banana', categoryId: 3, status: 1, servingSizeG: 1, servingUnitVi: 'quả', thumbnailUrl: null, createdAt: daysAgo(18), nutrition: { caloriesKcal: 89, proteinG: 1.1, carbsG: 23, fatG: 0.3 } },
  { id: 'mock-7', nameVi: 'Cá hồi áp chảo', nameEn: 'Pan-seared Salmon', categoryId: 4, status: 1, servingSizeG: 100, servingUnitVi: 'g', thumbnailUrl: null, createdAt: daysAgo(15), nutrition: { caloriesKcal: 208, proteinG: 20, carbsG: 0, fatG: 13 } },
  { id: 'mock-8', nameVi: 'Đậu phụ hấp', nameEn: 'Steamed Tofu', categoryId: 6, status: 0, servingSizeG: 100, servingUnitVi: 'g', thumbnailUrl: null, createdAt: daysAgo(10), nutrition: { caloriesKcal: 76, proteinG: 8, carbsG: 2, fatG: 4 } },
];

export let mockExercises: AdminExercise[] = [
  { id: 1, nameVi: 'Chạy bộ (tốc độ vừa)', nameEn: 'Running (moderate)', category: 'Cardio', metValue: 8.0, calPerKgPerHour: 8.0, isVisible: true, iconUrl: null },
  { id: 2, nameVi: 'Đi bộ nhanh', nameEn: 'Brisk Walking', category: 'Cardio', metValue: 3.8, calPerKgPerHour: 3.8, isVisible: true, iconUrl: null },
  { id: 3, nameVi: 'Bơi lội', nameEn: 'Swimming', category: 'Cardio', metValue: 7.0, calPerKgPerHour: 7.0, isVisible: true, iconUrl: null },
  { id: 4, nameVi: 'Đạp xe', nameEn: 'Cycling', category: 'Cardio', metValue: 6.0, calPerKgPerHour: 6.0, isVisible: true, iconUrl: null },
  { id: 5, nameVi: 'Yoga', nameEn: 'Yoga', category: 'Linh hoạt', metValue: 2.5, calPerKgPerHour: 2.5, isVisible: true, iconUrl: null },
  { id: 6, nameVi: 'Gym (luyện tạ)', nameEn: 'Weight Training', category: 'Sức mạnh', metValue: 5.0, calPerKgPerHour: 5.0, isVisible: true, iconUrl: null },
  { id: 7, nameVi: 'Aerobic', nameEn: 'Aerobics', category: 'Cardio', metValue: 6.5, calPerKgPerHour: 6.5, isVisible: true, iconUrl: null },
  { id: 8, nameVi: 'Nhảy dây', nameEn: 'Jump Rope', category: 'Cardio', metValue: 10.0, calPerKgPerHour: 10.0, isVisible: true, iconUrl: null },
  { id: 9, nameVi: 'Bóng đá', nameEn: 'Football', category: 'Thể thao', metValue: 7.0, calPerKgPerHour: 7.0, isVisible: false, iconUrl: null },
  { id: 10, nameVi: 'Cầu lông', nameEn: 'Badminton', category: 'Thể thao', metValue: 5.5, calPerKgPerHour: 5.5, isVisible: true, iconUrl: null },
  { id: 11, nameVi: 'Bóng rổ', nameEn: 'Basketball', category: 'Thể thao', metValue: 6.5, calPerKgPerHour: 6.5, isVisible: true, iconUrl: null },
  { id: 12, nameVi: 'Thiền', nameEn: 'Meditation', category: 'Linh hoạt', metValue: 1.5, calPerKgPerHour: 1.5, isVisible: false, iconUrl: null },
];

let nextVipPackageId = 4;
let nextTransactionId = 9;
let nextFoodId = 13;
let nextExerciseId = 13;

// ============================================================
// HELPERS
// ============================================================

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

function paginate<T>(data: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return {
    data: data.slice(start, start + pageSize),
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  };
}

// ============================================================
// ADMIN AUTH
// ============================================================

export const adminAuth = {
  login: async (email: string, password: string) => {
    await delay(600);
    if (email === 'namdinh' && password === '123') {
      const token = 'mock-admin-token-' + Date.now();
      adminTokenStore.setToken(token);
      const userInfo = { id: '1', email: 'namdinh', nickname: 'Admin', role: 'admin' as const };
      return { token, user: userInfo };
    }
    const err: any = new Error('Sai tài khoản hoặc mật khẩu');
    err.response = { data: { message: 'Sai tài khoản hoặc mật khẩu' } };
    throw err;
  },

  logout: async () => {
    adminTokenStore.clearToken();
    return { success: true };
  },

  checkAuth: async () => {
    await delay(100);
    return !!adminTokenStore.getToken();
  }
};

// ============================================================
// ADMIN DASHBOARD
// ============================================================

export const adminDashboard = {
  getStats: async (): Promise<DashboardStats> => {
    await delay();
    const now = new Date();
    const day7 = new Date(now.getTime() - 7 * 86400000);
    const day30 = new Date(now.getTime() - 30 * 86400000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const newUsers7 = mockUsers.filter(u => new Date(u.createdAt) >= day7).length;
    const newUsers30 = mockUsers.filter(u => new Date(u.createdAt) >= day30).length;
    const activeVip = mockUsers.filter(u => u.vipPackageId && u.vipExpiresAt && new Date(u.vipExpiresAt) > now).length;

    const revenueThis = mockTransactions
      .filter(t => t.status === 'success' && new Date(t.createdAt) >= monthStart)
      .reduce((s, t) => s + t.amount, 0);
    const revenueLast = mockTransactions
      .filter(t => t.status === 'success' && new Date(t.createdAt) >= lastMonthStart && new Date(t.createdAt) <= lastMonthEnd)
      .reduce((s, t) => s + t.amount, 0);

    return {
      totalUsers: mockUsers.length,
      newUsers7Days: newUsers7,
      newUsers30Days: newUsers30,
      activeVipUsers: activeVip,
      revenueThisMonth: revenueThis,
      revenueLastMonth: revenueLast,
      totalFoods: mockFoods.length,
      totalExercises: mockExercises.length,
    };
  },

  getUserGrowth: async (): Promise<UserGrowthPoint[]> => {
    await delay();
    const points: UserGrowthPoint[] = [];
    const now = new Date();
    let base = 3; // users before our window
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const newOnDay = mockUsers.filter(u => {
        const cd = new Date(u.createdAt).toISOString().split('T')[0];
        return cd === dateStr;
      }).length;
      base += newOnDay;
      points.push({ date: dateStr, count: base });
    }
    return points;
  },
};

// ============================================================
// ADMIN USERS
// ============================================================

export const adminUsers = {
  getAll: async (params?: { page?: number; pageSize?: number; search?: string; status?: string }) => {
    await delay();
    let filtered = [...mockUsers];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(u => u.email.toLowerCase().includes(s) || u.name.toLowerCase().includes(s));
    }
    if (params?.status === 'free') filtered = filtered.filter(u => !u.vipPackageId);
    else if (params?.status === 'vip') filtered = filtered.filter(u => !!u.vipPackageId);
    else if (params?.status === 'locked') filtered = filtered.filter(u => u.isLocked);
    return paginate(filtered, params?.page || 1, params?.pageSize || 20);
  },

  getById: async (id: number) => {
    await delay();
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  toggleLock: async (id: number) => {
    await delay();
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    mockUsers[idx].isLocked = !mockUsers[idx].isLocked;
    return mockUsers[idx];
  },

  grantVip: async (userId: number, packageId: number) => {
    await delay();
    const uIdx = mockUsers.findIndex(u => u.id === userId);
    const pkg = mockVipPackages.find(p => p.id === packageId);
    if (uIdx === -1 || !pkg) throw new Error('Not found');
    const expires = new Date(Date.now() + pkg.durationDays * 86400000);
    mockUsers[uIdx].vipPackageId = packageId;
    mockUsers[uIdx].vipPackageName = pkg.name;
    mockUsers[uIdx].vipExpiresAt = expires.toISOString();

    mockTransactions.push({
      id: nextTransactionId++,
      userId,
      userName: mockUsers[uIdx].name,
      userEmail: mockUsers[uIdx].email,
      packageId,
      packageName: pkg.name,
      amount: pkg.price,
      status: 'success',
      createdAt: new Date().toISOString(),
    });

    return mockUsers[uIdx];
  },

  revokeVip: async (userId: number) => {
    await delay();
    const idx = mockUsers.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    mockUsers[idx].vipPackageId = null;
    mockUsers[idx].vipPackageName = null;
    mockUsers[idx].vipExpiresAt = null;
    return mockUsers[idx];
  },

  getStats: async () => {
    await delay();
    const now = new Date();
    return {
      total: mockUsers.length,
      vip: mockUsers.filter(u => u.vipPackageId && u.vipExpiresAt && new Date(u.vipExpiresAt) > now).length,
      locked: mockUsers.filter(u => u.isLocked).length,
      free: mockUsers.filter(u => !u.vipPackageId).length,
    };
  },
};

// ============================================================
// VIP PACKAGES
// ============================================================

export const adminVip = {
  getPackages: async () => {
    await delay();
    return [...mockVipPackages];
  },

  createPackage: async (data: Omit<VipPackage, 'id' | 'createdAt'>) => {
    await delay();
    const pkg: VipPackage = { ...data, id: nextVipPackageId++, createdAt: new Date().toISOString() };
    mockVipPackages.push(pkg);
    return pkg;
  },

  updatePackage: async (id: number, data: Partial<VipPackage>) => {
    await delay();
    const idx = mockVipPackages.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Package not found');
    mockVipPackages[idx] = { ...mockVipPackages[idx], ...data };
    return mockVipPackages[idx];
  },

  deletePackage: async (id: number) => {
    await delay();
    const idx = mockVipPackages.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Package not found');
    mockVipPackages.splice(idx, 1);
    return { success: true };
  },

  getTransactions: async (params?: { page?: number; pageSize?: number; status?: string }) => {
    await delay();
    let filtered = [...mockTransactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(t => t.status === params.status);
    }
    return paginate(filtered, params?.page || 1, params?.pageSize || 20);
  },

  getUsersByPackage: async (packageId: number) => {
    await delay();
    return mockUsers.filter(u => u.vipPackageId === packageId);
  },
};

// ============================================================
// ADMIN FOODS
// ============================================================

export const adminFoods = {
  getAll: async (params?: { page?: number; pageSize?: number; search?: string; categoryId?: number; status?: number }) => {
    await delay();
    let filtered = [...mockFoods];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(f => f.nameVi.toLowerCase().includes(s) || (f.nameEn || '').toLowerCase().includes(s));
    }
    if (params?.categoryId !== undefined) filtered = filtered.filter(f => f.categoryId === params.categoryId);
    if (params?.status !== undefined) filtered = filtered.filter(f => f.status === params.status);
    return paginate(filtered, params?.page || 1, params?.pageSize || 20);
  },

  getCategories: async (): Promise<AdminFoodCategory[]> => {
    await delay(100);
    const CATEGORY_NAMES: Record<number, string> = {
      1: 'Ngũ cốc & Tinh bột', 2: 'Rau củ', 3: 'Trái cây', 4: 'Thịt & Hải sản',
      5: 'Sữa & Trứng', 6: 'Đậu & Hạt', 7: 'Dầu & Chất béo', 8: 'Gia vị & Nước chấm',
      9: 'Đồ uống', 10: 'Thức ăn nhanh', 11: 'Bánh & Kẹo', 12: 'Khác',
    };
    const grouped = mockFoods.reduce((acc, f) => {
      acc[f.categoryId] = (acc[f.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    return Object.entries(grouped).map(([id, count]) => ({
      id: Number(id),
      name: CATEGORY_NAMES[Number(id)] || `Danh mục ${id}`,
      foodCount: count,
    }));
  },

  create: async (data: Omit<AdminFood, 'id' | 'createdAt'>) => {
    await delay();
    const food: AdminFood = { ...data, id: `mock-${nextFoodId++}`, createdAt: new Date().toISOString() };
    mockFoods.push(food);
    return food;
  },

  update: async (id: string, data: Partial<AdminFood>) => {
    await delay();
    const idx = mockFoods.findIndex(f => f.id === id);
    if (idx === -1) throw new Error('Food not found');
    mockFoods[idx] = { ...mockFoods[idx], ...data };
    return mockFoods[idx];
  },

  delete: async (id: string) => {
    await delay();
    const idx = mockFoods.findIndex(f => f.id === id);
    if (idx === -1) throw new Error('Food not found');
    mockFoods.splice(idx, 1);
  },

  toggleVisibility: async (id: string) => {
    await delay();
    const idx = mockFoods.findIndex(f => f.id === id);
    if (idx === -1) throw new Error('Food not found');
    mockFoods[idx].status = mockFoods[idx].status === 1 ? 0 : 1;
  },

  getStats: async () => {
    await delay();
    return {
      total: mockFoods.length,
      visible: mockFoods.filter(f => f.status === 1).length,
      hidden: mockFoods.filter(f => f.status === 0).length,
      categories: [...new Set(mockFoods.map(f => f.categoryId))].length,
    };
  },
};

// ============================================================
// ADMIN EXERCISES
// ============================================================

export const adminExercises = {
  getAll: async (params?: { page?: number; pageSize?: number; search?: string; category?: string; visibility?: string }) => {
    await delay();
    let filtered = [...mockExercises];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(e => e.nameVi.toLowerCase().includes(s) || e.nameEn.toLowerCase().includes(s));
    }
    if (params?.category && params.category !== 'all') filtered = filtered.filter(e => e.category === params.category);
    if (params?.visibility === 'visible') filtered = filtered.filter(e => e.isVisible);
    else if (params?.visibility === 'hidden') filtered = filtered.filter(e => !e.isVisible);
    return paginate(filtered, params?.page || 1, params?.pageSize || 20);
  },

  getCategories: async () => {
    await delay(100);
    return [...new Set(mockExercises.map(e => e.category))];
  },

  create: async (data: Omit<AdminExercise, 'id'>) => {
    await delay();
    const ex: AdminExercise = { ...data, id: nextExerciseId++, calPerKgPerHour: data.metValue };
    mockExercises.push(ex);
    return ex;
  },

  update: async (id: number, data: Partial<AdminExercise>) => {
    await delay();
    const idx = mockExercises.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exercise not found');
    if (data.metValue) data.calPerKgPerHour = data.metValue;
    mockExercises[idx] = { ...mockExercises[idx], ...data };
    return mockExercises[idx];
  },

  delete: async (id: number) => {
    await delay();
    const idx = mockExercises.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exercise not found');
    mockExercises.splice(idx, 1);
    return { success: true };
  },

  toggleVisibility: async (id: number) => {
    await delay();
    const idx = mockExercises.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exercise not found');
    mockExercises[idx].isVisible = !mockExercises[idx].isVisible;
    return mockExercises[idx];
  },

  getStats: async () => {
    await delay();
    return {
      total: mockExercises.length,
      visible: mockExercises.filter(e => e.isVisible).length,
      categories: [...new Set(mockExercises.map(e => e.category))].length,
    };
  },
};
