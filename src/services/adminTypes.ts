export interface AdminUser {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  isActive: boolean;
  isLocked: boolean;
  vipPackageId: number | null;
  vipPackageName: string | null;
  vipExpiresAt: string | null;
}

export interface VipPackage {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Transaction {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  packageId: number;
  packageName: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  createdAt: string;
}

export interface AdminFood {
  id: number;
  nameVi: string;
  nameEn: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  unit: string;
  isVisible: boolean;
}

export interface AdminExercise {
  id: number;
  nameVi: string;
  nameEn: string;
  category: string;
  metValue: number;
  calPerKgPerHour: number;
  isVisible: boolean;
  imageUrl: string | null;
}

export interface DashboardStats {
  totalUsers: number;
  newUsers7Days: number;
  newUsers30Days: number;
  activeVipUsers: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  totalFoods: number;
  totalExercises: number;
  activeUsers?: number;
}

export interface UserGrowthPoint {
  date: string;
  count: number;
}

export interface FoodStats {
  total: number;
  visible: number;
  hidden: number;
  categories: number;
}

export interface ExerciseStats {
  total: number;
  visible: number;
  categories: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserStats {
  total: number;
  vip: number;
  locked: number;
  free: number;
}
