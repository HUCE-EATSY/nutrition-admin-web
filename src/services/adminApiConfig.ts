/**
 * Admin API Configuration
 * 
 * Set USE_MOCK_API = true to test with mock data
 * Set USE_MOCK_API = false to connect with real Backend
 */

import * as mockApi from './adminApiMock';
import * as realApi from './adminApi';

export const USE_MOCK_API = false; // ⬅️ CHANGE HERE TO SWITCH - SET TO FALSE FOR REAL API

// Conditional API export
export const adminAuth = USE_MOCK_API ? mockApi.adminAuth : realApi.adminAuth;
export const adminDashboard = USE_MOCK_API ? mockApi.adminDashboard : realApi.adminDashboard;
export const adminUsers = USE_MOCK_API ? mockApi.adminUsers : realApi.adminUsers;
export const adminPremium = USE_MOCK_API ? mockApi.adminPremium : realApi.adminPremium;
export const adminFoods = USE_MOCK_API ? mockApi.adminFoods : realApi.adminFoods;
export const adminExercises = USE_MOCK_API ? mockApi.adminExercises : realApi.adminExercises;
export const adminSubscriptions = USE_MOCK_API ? mockApi.adminSubscriptions : realApi.adminSubscriptions;

// Export all types/interfaces
export type {
  AdminUser,
  PremiumPackage,
  Transaction,
  AdminFood,
  AdminFoodNutrition,
  AdminFoodCategory,
  AdminExercise,
  DashboardStats,
  UserGrowthPoint,
  FoodStats,
  ExerciseStats
} from './adminTypes';

