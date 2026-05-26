import React, { useState, useEffect } from 'react';
import { adminDashboard } from '../services/adminApiConfig';
import type { DashboardStats, UserGrowthPoint } from '../services/adminApiConfig';
import { useToast } from '../components/Toast';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Gem, 
  Utensils, 
  Dumbbell,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growthData, setGrowthData] = useState<UserGrowthPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, growthRes] = await Promise.all([
        adminDashboard.getStats(),
        adminDashboard.getUserGrowth(),
      ]);
      setStats(statsRes);
      setGrowthData(growthRes);
    } catch (error: any) {
      showToast(error.message || 'Không thể tải dữ liệu dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatVND = (n: number) => {
    return n.toLocaleString('vi-VN') + ' đ';
  };

  const calculateRevenueGrowth = () => {
    if (!stats || stats.revenueLastMonth === undefined || stats.revenueThisMonth === undefined) return 0;
    const { revenueThisMonth, revenueLastMonth } = stats;
    if (revenueLastMonth === 0) return revenueThisMonth > 0 ? 100 : 0;
    return Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100);
  };

  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(16, 185, 129, 0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Đang tải dữ liệu dashboard...</span>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  const revGrowth = calculateRevenueGrowth();

  // Custom styling for the Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--color-primary)',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: 'var(--box-shadow-premium)'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Ngày: {label}</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: 'var(--color-primary)', fontWeight: 700 }}>
            Tổng user: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>Chào mừng trở lại 👋</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Dưới đây là thông số hoạt động của hệ thống DNT Nutrition hôm nay.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={fetchData} className="btn-premium btn-secondary" style={{ padding: '8px 14px', borderRadius: '8px' }}>
            <RefreshCw size={14} />
            <span>Làm mới</span>
          </button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            color: 'var(--color-primary)',
            fontWeight: 600
          }}>
            <Calendar size={14} />
            <span>
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px'
      }}>
        {/* Total Users */}
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tổng người dùng</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)' }}>{stats.totalUsers.toLocaleString()}</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Tài khoản đã đăng ký</p>
          </div>
        </div>

        {/* New Users (7 days) */}
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Mới (7 ngày)</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-success)' }}>+{stats.newUsers7Days || 0}</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Tài khoản mới 7 ngày qua</p>
          </div>
        </div>

        {/* Active VIP Packages */}
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Gói VIP đang chạy</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Gem size={18} />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#a78bfa' }}>{stats.activeVipUsers || 0}</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Hội viên Premium active</p>
          </div>
        </div>

        {/* Revenue This Month */}
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Doanh thu tháng này</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)' }}>
              {formatVND(stats.revenueThisMonth || 0)}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span className={`badge-custom ${revGrowth >= 0 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '2px 8px', fontSize: '11px' }}>
                {revGrowth >= 0 ? '▲' : '▼'} {Math.abs(revGrowth)}%
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>so với tháng trước</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="card-premium" style={{ padding: '28px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>Xu hướng tăng trưởng người dùng (30 ngày qua)</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Biểu đồ thống kê lũy kế người dùng đăng ký trên hệ thống</p>
        </div>
        
        <div style={{ width: '100%', height: '320px', fontSize: '11px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-text-muted)" 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(str) => {
                  const parts = str.split('-');
                  return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : str;
                }}
              />
              <YAxis 
                stroke="var(--color-text-muted)" 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="var(--color-primary)" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorGrowth)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Databases Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Foods DB Card */}
        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Thư viện món ăn</span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.totalFoods}</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Món ăn & thực phẩm trong DB</span>
          </div>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--color-primary)',
            fontSize: '36px'
          }}>
            <Utensils size={36} />
          </div>
        </div>

        {/* Exercises DB Card */}
        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Danh mục bài tập</span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.totalExercises}</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Bài tập thể chất hỗ trợ tính calo</span>
          </div>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--color-primary)',
            fontSize: '36px'
          }}>
            <Dumbbell size={36} />
          </div>
        </div>
      </div>
    </div>
  );
};
