import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { adminAuth } from '../services/adminApiConfig';
import { 
  LayoutDashboard, 
  Users, 
  Gem, 
  Dumbbell, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Người dùng', icon: Users, path: '/users' },
  { title: 'Gói VIP', icon: Gem, path: '/vip' },
  { title: 'Tập luyện', icon: Dumbbell, path: '/exercises' },
];

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      const isAuth = await adminAuth.checkAuth();
      if (!isAuth) {
        navigate('/login');
      } else {
        setCheckingAuth(false);
      }
    };
    checkToken();
  }, [navigate]);

  const handleLogout = async () => {
    await adminAuth.logout();
    navigate('/login');
  };

  if (checkingAuth) {
    return (
      <div style={{
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#090d16',
        color: '#9ca3af',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(16, 185, 129, 0.1)',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: '14px', fontWeight: 500 }}>Kiểm tra quyền truy cập...</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal)',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--border-color)',
          height: '75px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck size={20} color="var(--bg-primary)" style={{ strokeWidth: 2.5 }} />
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>DNT Admin</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Nutrition System</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {!collapsed && (
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 800, 
              color: 'var(--color-text-muted)', 
              letterSpacing: '1.5px', 
              padding: '0 12px 8px 12px',
              textTransform: 'uppercase'
            }}>
              Quản trị chính
            </span>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: collapsed ? '12px' : '12px 16px',
                  borderRadius: 'var(--border-radius-sm)',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  backgroundColor: active ? 'var(--color-primary-glow)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  gap: '12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'background-color var(--transition-fast), color var(--transition-fast)',
                  borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* Collapse Button */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            style={{
              alignSelf: collapsed ? 'center' : 'flex-end',
              background: 'var(--bg-surface-hover)',
              border: '1px solid var(--border-color)',
              color: 'var(--color-text-muted)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: '12px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              cursor: 'pointer',
              width: '100%',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'background-color var(--transition-fast)'
            }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
        {/* Topbar */}
        <header style={{
          height: '75px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface)',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>
            {location.pathname === '/' && 'Tổng quan hệ thống'}
            {location.pathname === '/users' && 'Quản lý người dùng'}
            {location.pathname === '/vip' && 'Quản lý dịch vụ VIP'}
            {location.pathname === '/exercises' && 'Quản lý bài tập'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              animation: 'pulseGlow 2s infinite'
            }} />
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cơ sở dữ liệu đang trực tuyến</span>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }} className="animated-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
