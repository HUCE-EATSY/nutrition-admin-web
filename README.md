# 🎛️ DNT Nutrition Admin Panel

**Modern Web Admin Dashboard** cho hệ thống quản lý ứng dụng Nutrition App.

## 📋 Tổng quan

Admin Panel được xây dựng với React + TypeScript + Vite, cung cấp giao diện quản trị hiện đại và responsive để quản lý:

- ✅ **Dashboard** - Thống kê tổng quan hệ thống
- ✅ **Users Management** - Quản lý người dùng (CRUD, Lock/Unlock)
- ✅ **Premium Management** - Quản lý gói Premium (Grant, Revoke, Extend)
- ✅ **Exercises Management** - Quản lý bài tập thể dục

## 🚀 Tech Stack

- **Framework**: React 19.2.6
- **Language**: TypeScript 6.0.2
- **Build Tool**: Vite 8.0.12
- **Routing**: React Router DOM 7.15.1
- **HTTP Client**: Axios 1.16.1
- **Icons**: Lucide React 1.16.0
- **Charts**: Recharts 3.8.1

## 📁 Cấu trúc Project

```
nutrition-admin-web/
├── src/
│   ├── assets/          # Static assets (images, icons)
│   ├── components/      # Reusable components
│   │   ├── AdminLayout.tsx    # Main layout with sidebar
│   │   └── Toast.tsx          # Toast notification system
│   ├── pages/           # Page components
│   │   ├── Login.tsx          # Admin login page
│   │   ├── Dashboard.tsx      # Dashboard overview
│   │   ├── Users.tsx          # Users management
│   │   ├── Subscriptions.tsx  # Premium subscriptions
│   │   └── Exercises.tsx      # Exercises management
│   ├── services/        # API services
│   │   ├── adminApi.ts           # Real API integration
│   │   ├── adminApiMock.ts       # Mock API for testing
│   │   ├── adminApiConfig.ts     # API configuration switcher
│   │   ├── adminTokenStore.ts    # Token management
│   │   └── adminTypes.ts         # TypeScript interfaces
│   ├── App.tsx          # Root component with routing
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with CSS variables
├── public/              # Public static files
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## 🔧 Installation & Setup

### 1. Cài đặt dependencies

```bash
cd nutrition-admin-web
npm install
```

### 2. Cấu hình Environment Variables

Copy `.env.example` thành `.env` và cập nhật:

```bash
# .env
VITE_API_URL=http://localhost:5184/api
```

### 3. Chọn API Mode

Mở file `src/services/adminApiConfig.ts`:

```typescript
export const USE_MOCK_API = true; // Mock API (không cần backend)
// hoặc
export const USE_MOCK_API = false; // Real API (cần backend running)
```

### 4. Chạy Development Server

```bash
npm run dev
```

App sẽ chạy tại: **http://localhost:5173**

### 5. Build cho Production

```bash
npm run build
```

Output sẽ ở thư mục `dist/`

## 🔐 Authentication

### Demo Account (Mock API)

```
Tài khoản: namdinh
Mật khẩu: 123
```

### Real API Authentication

Backend cần có endpoint:

```
POST /api/admin/auth/login
Body: { email: string, password: string }
Response: { success: true, token: string }
```

## 📡 API Integration

### Backend Requirements

Admin panel yêu cầu backend có các endpoints sau:

#### **Authentication**
```
POST   /api/admin/auth/login
```

#### **Dashboard**
```
GET    /api/admin/dashboard/stats
GET    /api/admin/dashboard/user-growth
```

#### **Users Management**
```
GET    /api/admin/users?page=1&pageSize=20&search=...&status=...
GET    /api/admin/users/{id}
PUT    /api/admin/users/{id}/toggle-lock
GET    /api/admin/users/stats
```

#### **Premium/Subscriptions**
```
GET    /api/admin/subscriptions?page=1&pageSize=20&status=...
GET    /api/admin/subscriptions/user/{userId}
POST   /api/admin/subscriptions/user/{userId}/grant
PUT    /api/admin/subscriptions/user/{userId}/revoke
PUT    /api/admin/subscriptions/user/{userId}/extend
GET    /api/admin/subscriptions/stats
```

#### **Exercises**
```
GET    /api/admin/exercises?page=1&search=...
POST   /api/admin/exercises
PUT    /api/admin/exercises/{id}
DELETE /api/admin/exercises/{id}
PUT    /api/admin/exercises/{id}/toggle-visibility
GET    /api/admin/exercises/stats
GET    /api/admin/exercises/categories
```

### API Response Format

Backend cần trả về format:

```json
// Success response
{
  "success": true,
  "data": { ... }
}

// Paginated response
{
  "success": true,
  "data": {
    "items": [...],  // hoặc "data": [...]
    "total": 100,
    "totalCount": 100,  // hoặc "total"
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}

// Error response
{
  "success": false,
  "message": "Error message"
}
```

## 🎨 UI/UX Features

### Dark Theme với CSS Variables

```css
--bg-primary: #090d16
--bg-surface: #111827
--color-primary: #10b981 (Emerald Green)
--color-text: #f9fafb
--color-text-muted: #9ca3af
```

### Components

- **Glass Morphism** effects
- **Smooth animations** và transitions
- **Responsive design** (Desktop & Tablet optimized)
- **Toast notifications** (Success, Error, Warning, Info)
- **Modal dialogs** với backdrop
- **Loading states** với spinners
- **Confirm dialogs** trước khi xóa

### Theme Colors

- **Primary**: Emerald Green (#10b981)
- **Success**: Green
- **Danger**: Red
- **Warning**: Orange
- **Info**: Blue
- **Premium**: Purple (#a78bfa)

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Lint
npm run lint         # Run ESLint
```

## 🔄 Mock API vs Real API

### Mock API Mode (`USE_MOCK_API = true`)

- ✅ Không cần backend running
- ✅ Data lưu trong memory (mất khi refresh)
- ✅ Tốc độ nhanh, test UI thuận tiện
- ✅ 13 mock users, 8 mock foods, 12 mock exercises

### Real API Mode (`USE_MOCK_API = false`)

- ❌ Cần backend running tại `http://localhost:5184`
- ✅ Data persistent trong database
- ✅ Real authentication với JWT
- ✅ Integration testing

## 🎯 Features Checklist

### ✅ Đã hoàn thành

**Authentication:**
- [x] Login page với validation
- [x] JWT token storage
- [x] Auto redirect khi chưa login
- [x] Protected routes
- [x] Logout functionality

**Dashboard:**
- [x] Stats cards (Users, Premium, Revenue, Exercises)
- [x] User growth chart (Recharts)
- [x] Premium statistics
- [x] Real-time indicators

**Users Management:**
- [x] List users với pagination
- [x] Search by email/name
- [x] Filter by status (All/Free/Premium/Locked)
- [x] Lock/Unlock users
- [x] Grant Premium
- [x] Revoke Premium
- [x] Extend Premium
- [x] View Premium history
- [x] User statistics

**Premium Management:**
- [x] List all subscriptions
- [x] Stats (Total, Active, Expired, Revenue)
- [x] Filter by status & plan
- [x] Search by user/orderId

**Exercises Management:**
- [x] List exercises với pagination
- [x] Search exercises
- [x] CRUD operations (Create, Edit, Delete)
- [x] Toggle visibility
- [x] Category management
- [x] Statistics

**UI/UX:**
- [x] Dark theme với glassmorphism
- [x] Responsive sidebar (collapse/expand)
- [x] Toast notifications
- [x] Loading states
- [x] Modal dialogs
- [x] Confirm dialogs

### 🔜 Có thể thêm sau

- [ ] Sorting columns (click header to sort)
- [ ] Advanced filters (date ranges, etc)
- [ ] Bulk actions (select multiple + delete)
- [ ] Export data (CSV/Excel)
- [ ] Image upload cho exercises
- [ ] Activity logs
- [ ] Email notifications
- [ ] Role-based permissions
- [ ] 2FA Authentication

## 🐛 Troubleshooting

### ✅ Build Status (Latest)

**Build Date**: June 3, 2026  
**Build Result**: ✅ SUCCESS  
**TypeScript Compilation**: ✅ 0 errors  
**Bundle Size**: 718 KB (minified), ~211 KB (gzipped)  
**Dev Server**: ✅ Running on http://localhost:5173

### Known Issues

1. **Large Bundle Size (718 KB)**
   - Nên implement code splitting với React.lazy()
   - Tree-shake unused lucide icons
   - Consider lighter alternatives cho chart libraries

2. **Mobile Responsiveness**
   - UI hiện tại optimize cho desktop/tablet
   - Mobile support cần improve thêm

3. **Token Auto-refresh**
   - Token không có auto-refresh mechanism
   - User cần re-login khi token expire

### Port đã được sử dụng

```bash
# Thay đổi port trong vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  // Đổi port khác
  }
})
```

### CORS Error

Đảm bảo backend có CORS enabled:

```csharp
// Program.cs
app.UseCors(options => options
    .WithOrigins("http://localhost:5173")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
```

### API không response

1. Kiểm tra backend đã chạy: `http://localhost:5184/api`
2. Kiểm tra `VITE_API_URL` trong `.env`
3. Kiểm tra `USE_MOCK_API` trong `adminApiConfig.ts`

## 📚 Documentation

### API Response Interceptor

Tự động unwrap backend response:

```typescript
// Backend response
{ success: true, data: {...} }

// Interceptor tự động trả về
{...}  // Data đã được unwrap
```

### Token Management

```typescript
import { adminTokenStore } from './services/adminTokenStore';

// Save token
adminTokenStore.setToken(token);

// Get token
const token = adminTokenStore.getToken();

// Clear token
adminTokenStore.clearToken();
```

### Toast Notifications

```typescript
import { useToast } from '../components/Toast';

const { showToast } = useToast();

showToast('Success message', 'success');
showToast('Error message', 'error');
showToast('Warning message', 'warning');
showToast('Info message', 'info');
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -m 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request

## 📝 License

Private project - All rights reserved

## 👨‍💻 Author

**DNT Nutrition Team**

---

**Built with ❤️ using React + TypeScript + Vite**
