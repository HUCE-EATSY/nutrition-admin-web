import React, { useState, useEffect } from 'react';
import { adminSubscriptions } from '../services/adminApiConfig';
import type { Subscription, SubscriptionStats } from '../services/adminTypes';
import {
  Users, Diamond, TrendingUp, DollarSign,
  Search, Calendar, Package, ChevronLeft, ChevronRight,
  AlertCircle, RefreshCw, Gem, Clock,
} from 'lucide-react';

/* ─── colour tokens for status badges ─── */
const STATUS_CONFIG: Record<string, { label: string; cls: string; dot: string }> = {
  Active:    { label: 'Đang hoạt động', cls: 'badge-success', dot: '#10b981' },
  Trialing:  { label: 'Dùng thử',       cls: 'badge-info',    dot: '#3b82f6' },
  Expired:   { label: 'Đã hết hạn',     cls: 'badge-muted',   dot: '#9ca3af' },
  Cancelled: { label: 'Đã hủy',         cls: 'badge-danger',  dot: '#ef4444' },
  Pending:   { label: 'Chờ xử lý',      cls: 'badge-warning', dot: '#f59e0b' },
};

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => { loadData(); }, [page, statusFilter, planFilter]);

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); loadData(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = { page, pageSize };
      if (search)               params.search  = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (planFilter)             params.planId = planFilter;

      const [statsData, response] = await Promise.all([
        adminSubscriptions.getStats(),
        adminSubscriptions.getAll(params),
      ]);
      setStats(statsData);
      setSubscriptions(response.data);
      setTotalPages(response.totalPages);
      setTotalCount(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fmtVND = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const getDaysRemaining = (endDate: string) => {
    const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
    return diff;
  };

  /* ─── STATS CARDS ─── */
  const statCards = stats ? [
    {
      label: 'Tổng Premium',
      value: stats.totalPremium.toLocaleString(),
      icon: <Users size={18} />,
      iconBg: 'rgba(124, 58, 237, 0.15)',
      iconColor: '#a78bfa',
      subtext: 'Lịch sử hội viên',
    },
    {
      label: 'Đang hoạt động',
      value: stats.activePremium.toLocaleString(),
      icon: <Gem size={18} />,
      iconBg: 'var(--color-success-bg)',
      iconColor: 'var(--color-success)',
      subtext: 'Subscription active',
    },
    {
      label: 'Đã hết hạn',
      value: stats.expiredPremium.toLocaleString(),
      icon: <Calendar size={18} />,
      iconBg: 'var(--bg-surface-hover)',
      iconColor: 'var(--color-text-muted)',
      subtext: 'Cần gia hạn',
    },
    {
      label: 'Tổng doanh thu',
      value: fmtVND(stats.totalRevenue),
      icon: <DollarSign size={18} />,
      iconBg: 'var(--color-info-bg)',
      iconColor: 'var(--color-info)',
      subtext: 'Tích lũy toàn thời gian',
    },
    {
      label: 'Doanh thu tháng này',
      value: fmtVND(stats.monthlyRevenue),
      icon: <TrendingUp size={18} />,
      iconBg: 'var(--color-primary-glow)',
      iconColor: 'var(--color-primary)',
      subtext: 'Tháng hiện tại',
    },
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', animation: 'fadeIn 0.3s ease-out' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
            💎 Quản lý Premium
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Theo dõi và quản lý tất cả gói Premium &amp; subscriptions
          </p>
        </div>
        <button
          onClick={loadData}
          className="btn-premium btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px' }}
        >
          <RefreshCw size={14} />
          Làm mới
        </button>
      </div>

      {/* ── Stats Cards ── */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          {statCards.map((card) => (
            <div key={card.label} className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  {card.label}
                </span>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  backgroundColor: card.iconBg, color: card.iconColor,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                }}>
                  {card.icon}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '5px' }}>
                  {card.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters bar ── */}
      <div className="card-premium" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '14px', alignItems: 'center' }}>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--color-text-muted)',
            }} />
            <input
              type="text"
              placeholder="Tìm theo tên user hoặc Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-premium"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Status dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="select-premium"
            style={{ minWidth: '180px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="trialing">Dùng thử</option>
            <option value="expired">Đã hết hạn</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          {/* Plan dropdown */}
          <select
            value={planFilter ?? ''}
            onChange={(e) => { setPlanFilter(e.target.value ? parseInt(e.target.value) : null); setPage(1); }}
            className="select-premium"
            style={{ minWidth: '160px' }}
          >
            <option value="">Tất cả gói</option>
            <option value="2">Premium 1 Tháng</option>
            <option value="3">Premium 1 Năm</option>
          </select>
        </div>
      </div>

      {/* ── Table / States ── */}
      <div className="table-container">

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              border: '3px solid rgba(16,185,129,0.1)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Đang tải dữ liệu...</span>
            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px', gap: '16px' }}>
            <AlertCircle size={40} color="var(--color-danger)" />
            <p style={{ color: 'var(--color-danger)', fontSize: '14px' }}>{error}</p>
            <button onClick={loadData} className="btn-premium" style={{ padding: '10px 24px' }}>
              <RefreshCw size={14} /> Thử lại
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && subscriptions.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px', gap: '12px' }}>
            <Package size={48} color="var(--color-text-muted)" style={{ opacity: 0.4 }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Không tìm thấy subscription nào</p>
          </div>
        )}

        {/* Data table */}
        {!loading && !error && subscriptions.length > 0 && (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Gói</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Hết hạn</th>
                    <th>Còn lại</th>
                    <th>Order ID</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => {
                    const statusCfg = STATUS_CONFIG[sub.status] ?? { label: sub.status, cls: 'badge-muted', dot: '#9ca3af' };
                    const days = getDaysRemaining(sub.currentPeriodEnd);
                    const isActive = sub.status === 'Active';

                    return (
                      <tr key={sub.id}>
                        {/* User */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '34px', height: '34px', borderRadius: '50%',
                              background: 'linear-gradient(135deg, #7c3aed 0%, #10b981 100%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0,
                            }}>
                              {(sub.userDisplayName ?? 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                                {sub.userDisplayName}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                                {sub.userId.slice(0, 8)}…
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Diamond size={14} color="#a78bfa" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa' }}>
                              {sub.planName}
                            </span>
                          </div>
                        </td>

                        {/* Price */}
                        <td>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                            {fmtVND(sub.price)}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`badge-custom ${statusCfg.cls}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          >
                            <span style={{
                              width: '6px', height: '6px', borderRadius: '50%',
                              backgroundColor: statusCfg.dot, flexShrink: 0,
                            }} />
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* Created */}
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                          {fmtDate(sub.createdAt)}
                        </td>

                        {/* End date */}
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                          {fmtDate(sub.currentPeriodEnd)}
                        </td>

                        {/* Days remaining */}
                        <td>
                          {isActive ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} color={days <= 7 ? 'var(--color-warning)' : 'var(--color-success)'} />
                              <span style={{
                                fontSize: '12px', fontWeight: 600,
                                color: days <= 7 ? 'var(--color-warning)' : 'var(--color-success)',
                              }}>
                                {days > 0 ? `${days} ngày` : 'Hết hôm nay'}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>—</span>
                          )}
                        </td>

                        {/* Order ID */}
                        <td>
                          {sub.orderId ? (
                            <code style={{
                              fontSize: '11px', fontFamily: 'monospace',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              color: 'var(--color-text-muted)',
                            }}>
                              {sub.orderId.slice(0, 14)}…
                            </code>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'rgba(255,255,255,0.01)',
            }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Hiển thị <strong style={{ color: 'var(--color-text)' }}>
                  {Math.min((page - 1) * pageSize + 1, totalCount)}–{Math.min(page * pageSize, totalCount)}
                </strong> trong tổng số <strong style={{ color: 'var(--color-text)' }}>{totalCount}</strong> subscriptions
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-premium btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '12px', opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronLeft size={15} />
                </button>
                <span style={{
                  fontSize: '13px', color: 'var(--color-text)',
                  padding: '4px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                }}>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="btn-premium btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '12px', opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
