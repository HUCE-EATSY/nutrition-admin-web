/**
 * Mock Admin API Service - Frontend-only mock (no backend needed)
 * Includes: Users, Foods, Exercises, Premium Packages, Transactions, Dashboard
 */

import { adminTokenStore } from './adminTokenStore';
import type { 
  AdminUser, 
  PremiumPackage, 
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

export let mockPremiumPackages: PremiumPackage[] = [
  {
    id: 1,
    name: 'Premium Basic',
    price: 49000,
    durationDays: 30,
    features: ['Theo dõi dinh dưỡng không giới hạn', 'Kế hoạch ăn kiêng', 'Phân tích calo chi tiết'],
    isActive: true,
    createdAt: daysAgo(120),
  },
  {
    id: 2,
    name: 'Premium Pro',
    price: 99000,
    durationDays: 30,
    features: ['Tất cả tính năng Basic', 'Tư vấn dinh dưỡng AI', 'Kế hoạch tập luyện', 'Báo cáo sức khỏe nâng cao'],
    isActive: true,
    createdAt: daysAgo(120),
  },
  {
    id: 3,
    name: 'Premium Annual',
    price: 799000,
    durationDays: 365,
    features: ['Tất cả tính năng Pro', 'Ưu tiên hỗ trợ', 'Truy cập sớm tính năng mới', 'Không quảng cáo'],
    isActive: true,
    createdAt: daysAgo(90),
  },
];

export let mockTransactions: Transaction[] = [
  { id: 1, userId: 2, userName: 'Nguyễn Văn An', userEmail: 'an.nguyen@gmail.com', packageId: 2, packageName: 'Premium Pro', amount: 99000, status: 'success', createdAt: daysAgo(2) },
  { id: 2, userId: 3, userName: 'Trần Thị Bình', userEmail: 'binh.tran@gmail.com', packageId: 1, packageName: 'Premium Basic', amount: 49000, status: 'success', createdAt: daysAgo(5) },
  { id: 3, userId: 5, userName: 'Lê Minh Cường', userEmail: 'cuong.le@gmail.com', packageId: 3, packageName: 'Premium Annual', amount: 799000, status: 'success', createdAt: daysAgo(8) },
  { id: 4, userId: 6, userName: 'Phạm Thị Dung', userEmail: 'dung.pham@gmail.com', packageId: 2, packageName: 'Premium Pro', amount: 99000, status: 'pending', createdAt: daysAgo(1) },
  { id: 5, userId: 7, userName: 'Hoàng Văn Em', userEmail: 'em.hoang@gmail.com', packageId: 1, packageName: 'Premium Basic', amount: 49000, status: 'failed', createdAt: daysAgo(3) },
  { id: 6, userId: 8, userName: 'Ngô Thị Phương', userEmail: 'phuong.ngo@gmail.com', packageId: 2, packageName: 'Premium Pro', amount: 99000, status: 'success', createdAt: daysAgo(35) },
  { id: 7, userId: 9, userName: 'Vũ Đình Giang', userEmail: 'giang.vu@gmail.com', packageId: 3, packageName: 'Premium Annual', amount: 799000, status: 'success', createdAt: daysAgo(40) },
  { id: 8, userId: 10, userName: 'Đặng Thị Hà', userEmail: 'ha.dang@gmail.com', packageId: 1, packageName: 'Premium Basic', amount: 49000, status: 'success', createdAt: daysAgo(38) },
];

export let mockUsers: AdminUser[] = [
  { id: 1, email: 'namdinh', name: 'Admin', isActive: true, isLocked: false, premiumPackageId: null, premiumPackageName: null, premiumExpiresAt: null, createdAt: daysAgo(180) },
  { id: 2, email: 'an.nguyen@gmail.com', name: 'Nguyễn Văn An', isActive: true, isLocked: false, premiumPackageId: 2, premiumPackageName: 'Premium Pro', premiumExpiresAt: new Date(now.getTime() + 22 * 86400000).toISOString(), createdAt: daysAgo(60) },
  { id: 3, email: 'binh.tran@gmail.com', name: 'Trần Thị Bình', isActive: true, isLocked: false, premiumPackageId: 1, premiumPackageName: 'Premium Basic', premiumExpiresAt: new Date(now.getTime() + 18 * 86400000).toISOString(), createdAt: daysAgo(45) },
  { id: 4, email: 'chi.do@gmail.com', name: 'Đỗ Thị Chi', isActive: true, isLocked: false, premiumPackageId: null, premiumPackageName: null, premiumExpiresAt: null, createdAt: daysAgo(30) },
  { id: 5, email: 'cuong.le@gmail.com', name: 'Lê Minh Cường', isActive: true, isLocked: false, premiumPackageId: 3, premiumPackageName: 'Premium Annual', premiumExpiresAt: new Date(now.getTime() + 310 * 86400000).toISOString(), createdAt: daysAgo(90) },
  { id: 6, email: 'dung.pham@gmail.com', name: 'Phạm Thị Dung', isActive: true, isLocked: false, premiumPackageId: null, premiumPackageName: null, premiumExpiresAt: null, createdAt: daysAgo(10) },
  { id: 7, email: 'em.hoang@gmail.com', name: 'Hoàng Văn Em', isActive: true, isLocked: true, premiumPackageId: null, premiumPackageName: null, premiumExpiresAt: null, createdAt: daysAgo(25) },
  { id: 8, email: 'phuong.ngo@gmail.com', name: 'Ngô Thị Phương', isActive: true, isLocked: false, premiumPackageId: 2, premiumPackageName: 'Premium Pro', premiumExpiresAt: new Date(now.getTime() - 5 * 86400000).toISOString(), createdAt: daysAgo(70) },
  { id: 9, email: 'giang.vu@gmail.com', name: 'Vũ Đình Giang', isActive: true, isLocked: false, premiumPackageId: 3, premiumPackageName: 'Premium Annual', premiumExpiresAt: new Date(now.getTime() + 280 * 86400000).toISOString(), createdAt: daysAgo(50) },
  { id: 10, email: 'ha.dang@gmail.com', name: 'Đặng Thị Hà', isActive: true, isLocked: false, premiumPackageId: 1, premiumPackageName: 'Premium Basic', premiumExpiresAt: new Date(now.getTime() - 2 * 86400000).toISOString(), createdAt: daysAgo(55) },
  { id: 11, email: 'hung.bui@gmail.com', name: 'Bùi Văn Hùng', isActive: true, isLocked: false, premiumPackageId: null, premiumPackageName: null, premiumExpiresAt: null, createdAt: daysAgo(3) },
  { id: 12, email: 'lan.phan@gmail.com', name: 'Phan Thị Lan', isActive: true, isLocked: false, premiumPackageId: null, premiumPackageName: null, premiumExpiresAt: null, createdAt: daysAgo(6) },
  { id: 13, email: 'minh.tong@gmail.com', name: 'Tống Minh', isActive: true, isLocked: false, premiumPackageId: 2, premiumPackageName: 'Premium Pro', premiumExpiresAt: new Date(now.getTime() + 15 * 86400000).toISOString(), createdAt: daysAgo(20) },
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
  { id: 'mock-1', nameVi: 'Chạy bộ (tốc độ vừa)', nameEn: 'Running (moderate)', categoryId: 1, metValue: 8.0, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-2', nameVi: 'Đi bộ nhanh', nameEn: 'Brisk Walking', categoryId: 1, metValue: 3.8, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-3', nameVi: 'Bơi lội', nameEn: 'Swimming', categoryId: 1, metValue: 7.0, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-4', nameVi: 'Đạp xe', nameEn: 'Cycling', categoryId: 1, metValue: 6.0, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-5', nameVi: 'Yoga', nameEn: 'Yoga', categoryId: 3, metValue: 2.5, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-6', nameVi: 'Gym (luyện tạ)', nameEn: 'Weight Training', categoryId: 2, metValue: 5.0, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-7', nameVi: 'Aerobic', nameEn: 'Aerobics', categoryId: 1, metValue: 6.5, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-8', nameVi: 'Nhảy dây', nameEn: 'Jump Rope', categoryId: 1, metValue: 10.0, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-9', nameVi: 'Bóng đá', nameEn: 'Football', categoryId: 4, metValue: 7.0, unit: 'minutes', status: 0, iconUrl: null },
  { id: 'mock-10', nameVi: 'Cầu lông', nameEn: 'Badminton', categoryId: 4, metValue: 5.5, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-11', nameVi: 'Bóng rổ', nameEn: 'Basketball', categoryId: 4, metValue: 6.5, unit: 'minutes', status: 1, iconUrl: null },
  { id: 'mock-12', nameVi: 'Thiền', nameEn: 'Meditation', categoryId: 3, metValue: 1.5, unit: 'minutes', status: 0, iconUrl: null },
];

let nextPremiumPackageId = 4;
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
    const activeVip = mockUsers.filter(u => u.premiumPackageId && u.premiumExpiresAt && new Date(u.premiumExpiresAt) > now).length;

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
      activePremiumUsers: activeVip,
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
    if (params?.status === 'free') filtered = filtered.filter(u => !u.premiumPackageId);
    else if (params?.status === 'premium') filtered = filtered.filter(u => !!u.premiumPackageId);
    else if (params?.status === 'locked') filtered = filtered.filter(u => u.isLocked);
    return paginate(filtered, params?.page || 1, params?.pageSize || 20);
  },

  getById: async (id: number | string) => {
    await delay();
    const numId = typeof id === 'string' ? parseInt(id) : id;
    const user = mockUsers.find(u => u.id === numId);
    if (!user) throw new Error('User not found');
    return user;
  },

  toggleLock: async (id: number | string) => {
    await delay();
    const numId = typeof id === 'string' ? parseInt(id) : id;
    const idx = mockUsers.findIndex(u => u.id === numId);
    if (idx === -1) throw new Error('User not found');
    mockUsers[idx].isLocked = !mockUsers[idx].isLocked;
    return mockUsers[idx];
  },

  grantPremium: async (userId: number | string, packageId: number) => {
    await delay();
    const numUserId = typeof userId === 'string' ? parseInt(userId) : userId;
    const uIdx = mockUsers.findIndex(u => u.id === numUserId);
    const pkg = mockPremiumPackages.find(p => p.id === packageId);
    if (uIdx === -1 || !pkg) throw new Error('Not found');
    const expires = new Date(Date.now() + pkg.durationDays * 86400000);
    mockUsers[uIdx].premiumPackageId = packageId;
    mockUsers[uIdx].premiumPackageName = pkg.name;
    mockUsers[uIdx].premiumExpiresAt = expires.toISOString();

    mockTransactions.push({
      id: nextTransactionId++,
      userId: numUserId,
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

  revokePremium: async (userId: number | string) => {
    await delay();
    const numUserId = typeof userId === 'string' ? parseInt(userId) : userId;
    const idx = mockUsers.findIndex(u => u.id === numUserId);
    if (idx === -1) throw new Error('User not found');
    mockUsers[idx].premiumPackageId = null;
    mockUsers[idx].premiumPackageName = null;
    mockUsers[idx].premiumExpiresAt = null;
    return mockUsers[idx];
  },

  getStats: async () => {
    await delay();
    const now = new Date();
    return {
      total: mockUsers.length,
      premium: mockUsers.filter(u => u.premiumPackageId && u.premiumExpiresAt && new Date(u.premiumExpiresAt) > now).length,
      locked: mockUsers.filter(u => u.isLocked).length,
      free: mockUsers.filter(u => !u.premiumPackageId).length,
    };
  },
};

// ============================================================
// PREMIUM PACKAGES
// ============================================================

export const adminPremium = {
  getPackages: async () => {
    await delay();
    return [...mockPremiumPackages];
  },

  createPackage: async (data: Omit<PremiumPackage, 'id' | 'createdAt'>) => {
    await delay();
    const pkg: PremiumPackage = { ...data, id: nextPremiumPackageId++, createdAt: new Date().toISOString() };
    mockPremiumPackages.push(pkg);
    return pkg;
  },

  updatePackage: async (id: number, data: Partial<PremiumPackage>) => {
    await delay();
    const idx = mockPremiumPackages.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Package not found');
    mockPremiumPackages[idx] = { ...mockPremiumPackages[idx], ...data };
    return mockPremiumPackages[idx];
  },

  deletePackage: async (id: number) => {
    await delay();
    const idx = mockPremiumPackages.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Package not found');
    mockPremiumPackages.splice(idx, 1);
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
    return mockUsers.filter(u => u.premiumPackageId === packageId);
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
  getAll: async (params?: { page?: number; pageSize?: number; search?: string; categoryId?: number; status?: number }) => {
    await delay();
    let filtered = [...mockExercises];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(e => e.nameVi.toLowerCase().includes(s) || e.nameEn.toLowerCase().includes(s));
    }
    if (params?.categoryId && params.categoryId !== undefined) filtered = filtered.filter(e => e.categoryId === params.categoryId);
    if (params?.status !== undefined) filtered = filtered.filter(e => e.status === params.status);
    return paginate(filtered, params?.page || 1, params?.pageSize || 20);
  },

  getCategories: async () => {
    await delay(100);
    return [
      { id: 1, nameVi: 'Cardio', nameEn: 'Cardio' },
      { id: 2, nameVi: 'Sức mạnh', nameEn: 'Strength' },
      { id: 3, nameVi: 'Linh hoạt', nameEn: 'Flexibility' },
      { id: 4, nameVi: 'Thể thao', nameEn: 'Sports' }
    ];
  },

  create: async (data: Omit<AdminExercise, 'id' | 'createdAt'>) => {
    await delay();
    const ex: AdminExercise = { ...data, id: `mock-${nextExerciseId++}`, unit: 'minutes', status: data.status ?? 1 };
    mockExercises.push(ex);
    return ex;
  },

  update: async (id: string, data: Partial<AdminExercise>) => {
    await delay();
    const idx = mockExercises.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exercise not found');
    mockExercises[idx] = { ...mockExercises[idx], ...data };
    return mockExercises[idx];
  },

  delete: async (id: string) => {
    await delay();
    const idx = mockExercises.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exercise not found');
    mockExercises.splice(idx, 1);
    return { success: true };
  },

  toggleVisibility: async (id: string) => {
    await delay();
    const idx = mockExercises.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exercise not found');
    mockExercises[idx].status = mockExercises[idx].status === 1 ? 0 : 1;
    return mockExercises[idx];
  },

  getStats: async () => {
    await delay();
    return {
      total: mockExercises.length,
      visible: mockExercises.filter(e => e.status === 1).length,
      categories: [...new Set(mockExercises.map(e => e.categoryId))].length,
    };
  },
};

// ============================================================
// ADMIN SUBSCRIPTIONS
// ============================================================

export const adminSubscriptions = {
  getAll: async (params?: { page?: number; pageSize?: number; search?: string; status?: string; planId?: number }) => {
    await delay();
    
    // Convert mock users to subscriptions format
    let subs = mockUsers
      .filter(u => u.premiumPackageId) // Only users with premium
      .map(u => {
        const now = new Date();
        const expiresAt = u.premiumExpiresAt ? new Date(u.premiumExpiresAt) : null;
        let status = 'Expired';
        if (expiresAt) {
          if (expiresAt > now) {
            status = 'Active';
          }
        }
        
        return {
          id: `sub-${u.id}`,
          userId: u.id.toString(),
          userDisplayName: u.name,
          planName: u.premiumPackageName || 'Unknown',
          planCode: `PLAN_${u.premiumPackageId}`,
          price: mockPremiumPackages.find(p => p.id === u.premiumPackageId)?.price || 0,
          status,
          currentPeriodEnd: u.premiumExpiresAt || new Date().toISOString(),
          createdAt: u.createdAt,
          orderId: `ORD-${u.id}-${Date.now().toString(36)}`,
        };
      });

    // Apply filters
    if (params?.search) {
      const s = params.search.toLowerCase();
      subs = subs.filter(sub => 
        sub.userDisplayName.toLowerCase().includes(s) || 
        (sub.orderId && sub.orderId.toLowerCase().includes(s))
      );
    }
    if (params?.status && params.status !== 'all') {
      subs = subs.filter(sub => sub.status.toLowerCase() === params.status?.toLowerCase());
    }
    if (params?.planId) {
      subs = subs.filter(sub => sub.planCode === `PLAN_${params.planId}`);
    }

    return paginate(subs, params?.page || 1, params?.pageSize || 20);
  },

  getStats: async () => {
    await delay();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const totalPremium = mockUsers.filter(u => u.premiumPackageId).length;
    const activePremium = mockUsers.filter(u => 
      u.premiumPackageId && u.premiumExpiresAt && new Date(u.premiumExpiresAt) > now
    ).length;
    const expiredPremium = mockUsers.filter(u => 
      u.premiumPackageId && u.premiumExpiresAt && new Date(u.premiumExpiresAt) <= now
    ).length;
    
    const totalRevenue = mockTransactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyRevenue = mockTransactions
      .filter(t => t.status === 'success' && new Date(t.createdAt) >= monthStart)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalPremium,
      activePremium,
      expiredPremium,
      totalRevenue,
      monthlyRevenue,
    };
  },

  grantPremium: async (userId: string, data: { planId: number; durationDays?: number }) => {
    await delay();
    const numUserId = parseInt(userId);
    const uIdx = mockUsers.findIndex(u => u.id === numUserId);
    const pkg = mockPremiumPackages.find(p => p.id === data.planId);
    if (uIdx === -1 || !pkg) throw new Error('Not found');
    
    const days = data.durationDays || pkg.durationDays;
    const expires = new Date(Date.now() + days * 86400000);
    
    mockUsers[uIdx].premiumPackageId = data.planId;
    mockUsers[uIdx].premiumPackageName = pkg.name;
    mockUsers[uIdx].premiumExpiresAt = expires.toISOString();

    return mockUsers[uIdx];
  },

  revokePremium: async (userId: string) => {
    await delay();
    const numUserId = parseInt(userId);
    const idx = mockUsers.findIndex(u => u.id === numUserId);
    if (idx === -1) throw new Error('User not found');
    
    mockUsers[idx].premiumPackageId = null;
    mockUsers[idx].premiumPackageName = null;
    mockUsers[idx].premiumExpiresAt = null;
    
    return { success: true };
  },

  extendPremium: async (userId: string, data: { additionalDays: number }) => {
    await delay();
    const numUserId = parseInt(userId);
    const idx = mockUsers.findIndex(u => u.id === numUserId);
    if (idx === -1) throw new Error('User not found');
    
    const currentExpiry = mockUsers[idx].premiumExpiresAt ? new Date(mockUsers[idx].premiumExpiresAt!) : new Date();
    const newExpiry = new Date(currentExpiry.getTime() + data.additionalDays * 86400000);
    mockUsers[idx].premiumExpiresAt = newExpiry.toISOString();
    
    return mockUsers[idx];
  },

  getUserSubscriptions: async (userId: string) => {
    await delay();
    const numUserId = parseInt(userId);
    const user = mockUsers.find(u => u.id === numUserId);
    if (!user || !user.premiumPackageId) return [];
    
    // Return mock subscription history
    return [{
      id: `sub-${user.id}`,
      userId: user.id.toString(),
      userDisplayName: user.name,
      planName: user.premiumPackageName || 'Unknown',
      planCode: `PLAN_${user.premiumPackageId}`,
      price: mockPremiumPackages.find(p => p.id === user.premiumPackageId)?.price || 0,
      status: user.premiumExpiresAt && new Date(user.premiumExpiresAt) > new Date() ? 'Active' : 'Expired',
      currentPeriodEnd: user.premiumExpiresAt || new Date().toISOString(),
      createdAt: user.createdAt,
      orderId: `ORD-${user.id}-${Date.now().toString(36)}`,
    }];
  },
};
