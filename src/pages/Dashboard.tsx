import React, { useState, useEffect } from 'react';
import { adminDashboard, adminSubscriptions } from '../services/adminApiConfig';
import type { DashboardStats, UserGrowthPoint, SubscriptionStats } from '../services/adminTypes';
import { useToast } from '../components/Toast';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Gem,
  Dumbbell,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null);
  const [growthData, setGrowthData] = useState<UserGrowthPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, growthRes, subStatsRes] = await Promise.all([
        adminDashboard.getStats(),
        adminDashboard.getUserGrowth(),
        adminSubscriptions.getStats(),
      ]);
      setStats(statsRes);
      // Dùng data thật từ BE, không inject mock
      setGrowthData(growthRes);
      setSubscriptionStats(subStatsRes);
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

  // Doanh thu: ưu tiên subscriptionStats (nguồn chính xác nhất), fallback về dashboard stats
  const totalRevenue = subscriptionStats?.monthlyRevenue ?? stats.revenueThisMonth ?? 0;

  // Premium active = lấy giá trị từ subscriptionStats nếu có, fallback về stats
  const activePremium = subscriptionStats?.activePremium ?? stats.activePremiumUsers ?? 0;
  const totalPremium = subscriptionStats?.totalPremium ?? activePremium;

  // Kiểm tra BE có trả premiumCount thật không (không dùng mock)
  const hasPremiumGrowthData = growthData.length > 0 && growthData.some(pt => pt.premiumCount !== undefined && pt.premiumCount !== null);

  // Custom Tooltip cho biểu đồ 2 đường
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
          {payload.map((entry: any) => (
            <p key={entry.dataKey} style={{ margin: '4px 0 0 0', fontSize: '14px', color: entry.color, fontWeight: 700 }}>
              {entry.dataKey === 'count' ? 'Tổng user' : 'Premium'}: {entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Grid Stats — 4 cards */}
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
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              +{stats.newUsers7Days || 0} mới trong 7 ngày qua
            </p>
          </div>
        </div>

        {/* New Users */}
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

        {/* Premium Active — hợp nhất "Premium đang chạy" + "Premium Active" */}
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Premium Active</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Gem size={18} />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#a78bfa' }}>{activePremium.toLocaleString()}</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              / {totalPremium.toLocaleString()} tổng hội viên Premium
            </p>
          </div>
        </div>

        {/* Revenue — hợp nhất "Doanh thu tháng này" + "DT Premium tháng này" */}
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Doanh thu tháng này</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)' }}>
              {formatVND(totalRevenue)}
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

      {/* User & Premium Growth Chart — 2 đường */}
      <div className="card-premium" style={{ padding: '28px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>Xu hướng tăng trưởng (30 ngày qua)</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            So sánh tăng trưởng tổng người dùng và hội viên Premium theo ngày
          </p>
        </div>
        
        <div style={{ width: '100%', height: '320px', fontSize: '11px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.0}/>
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
              <Legend 
                formatter={(value) => value === 'count' ? 'Tổng User' : 'Premium'}
                wrapperStyle={{ fontSize: '12px', color: 'var(--color-text-muted)', paddingTop: '16px' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                name="count"
                stroke="var(--color-primary)" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
              {hasPremiumGrowthData && (
                <Area 
                  type="monotone" 
                  dataKey="premiumCount"
                  name="premiumCount"
                  stroke="#a78bfa" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorPremium)"
                  strokeDasharray="5 3"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exercises DB Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
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
