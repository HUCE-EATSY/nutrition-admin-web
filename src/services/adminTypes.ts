export interface AdminUser {
  id: number;  // Changed from string to number for mock API compatibility
  email: string;
  name: string;
  createdAt: string;
  isActive: boolean;
  isLocked: boolean;
  premiumPackageId: number | null; // Premium package ID
  premiumPackageName: string | null; // Premium package name
  premiumExpiresAt: string | null; // Premium expiry date
}

export interface PremiumPackage {
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

export interface AdminFoodNutrition {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface AdminFood {
  id: string; // Guid from backend
  nameVi: string;
  nameEn: string | null;
  categoryId: number;
  status: number; // 1 = visible, 0 = hidden
  servingSizeG: number;
  servingUnitVi: string;
  thumbnailUrl: string | null;
  createdAt: string;
  nutrition: AdminFoodNutrition | null;
}

export interface AdminFoodCategory {
  id: number;
  name: string;
  foodCount: number;
}


export interface AdminExercise {
  id: string; // Guid from backend
  categoryId: number;
  nameVi: string;
  nameEn: string;
  description?: string | null;
  category?: string;
  metValue: number;
  unit: string;
  status: number; // 1 = visible, 0 = hidden
  iconUrl: string | null;
  createdAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  newUsers7Days: number;
  newUsers30Days: number;
  activePremiumUsers: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  totalFoods: number;
  totalExercises: number;
  activeUsers?: number;
}

export interface UserGrowthPoint {
  date: string;
  count: number;
  premiumCount?: number;
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
  premium: number; // Premium users count
  locked: number;
  free: number;
}

// Subscription (Premium) Types
export interface Subscription {
  id: string;
  userId: string;
  userDisplayName: string;
  planName: string;
  planCode: string;
  price: number;
  status: string; // "Active", "Trialing", "Cancelled", "Expired", "Pending"
  currentPeriodEnd: string;
  createdAt: string;
  orderId?: string;
}

export interface SubscriptionStats {
  totalPremium: number;      // Tổng số user từng có Premium
  activePremium: number;     // Số user đang có Premium active
  expiredPremium: number;    // Số user Premium đã hết hạn
  totalRevenue: number;      // Tổng doanh thu
  monthlyRevenue: number;    // Doanh thu tháng này
}

export interface GrantPremiumRequest {
  planId: number;
  durationDays?: number;
  note?: string;
}

export interface ExtendPremiumRequest {
  additionalDays: number;
}
