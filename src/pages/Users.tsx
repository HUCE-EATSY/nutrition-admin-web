import React, { useState, useEffect } from 'react';
import { adminUsers, adminVip } from '../services/adminApiConfig';
import type { AdminUser, VipPackage } from '../services/adminApiConfig';
import { useToast } from '../components/Toast';
import { 
  Search, 
  Ban, 
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [packages, setPackages] = useState<VipPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'vip' | 'locked'>('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, vip: 0, locked: 0, free: 0 });

  // Grant VIP modal state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminUsers.getAll({
        page,
        pageSize: 10,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setUsers(response.data);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      showToast(error.message || 'Không thể tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await adminUsers.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const pkgs = await adminVip.getPackages();
      setPackages(pkgs.filter(p => p.isActive));
    } catch (error) {
      console.error('Failed to fetch VIP packages:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  // Handle search with local debounce or trigger on key press/button submit
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    fetchStats();
    fetchPackages();
  }, []);

  const handleToggleLock = async (user: AdminUser) => {
    if (user.email === 'namdinh') {
      showToast('Không thể khóa tài khoản Admin chính', 'warning');
      return;
    }
    try {
      const updated = await adminUsers.toggleLock(user.id);
      showToast(
        `${updated.isLocked ? 'Đã khóa' : 'Đã mở khóa'} tài khoản ${updated.name}`,
        'success'
      );
      setUsers(users.map((u) => (u.id === user.id ? updated : u)));
      fetchStats();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleRevokeVip = async (user: AdminUser) => {
    if (!window.confirm(`Bạn có chắc chắn muốn thu hồi VIP của người dùng ${user.name}?`)) {
      return;
    }
    try {
      const updated = await adminUsers.revokeVip(user.id);
      showToast(`Đã thu hồi gói VIP của ${updated.name}`, 'success');
      setUsers(users.map((u) => (u.id === user.id ? updated : u)));
      fetchStats();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleOpenGrantModal = (user: AdminUser) => {
    setSelectedUser(user);
    setShowGrantModal(true);
  };

  const handleGrantVip = async (packageId: number) => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const updated = await adminUsers.grantVip(selectedUser.id, packageId);
      showToast(`Cấp VIP thành công cho ${updated.name}`, 'success');
      setUsers(users.map((u) => (u.id === selectedUser.id ? updated : u)));
      setShowGrantModal(false);
      setSelectedUser(null);
      fetchStats();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const daysLeft = (expires: string | null) => {
    if (!expires) return 0;
    const diff = new Date(expires).getTime() - Date.now();
    return Math.ceil(diff / 86400000);
  };

  const getVipBadge = (user: AdminUser) => {
    if (!user.vipPackageId || !user.vipExpiresAt) {
      return <span className="badge-custom badge-muted">Miễn phí</span>;
    }

    const remaining = daysLeft(user.vipExpiresAt);
    if (remaining <= 0) {
      return <span className="badge-custom badge-danger">Hết hạn</span>;
    }

    return (
      <span className="badge-custom" style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa' }}>
        💎 {user.vipPackageName}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
        <div className="card-premium" style={{ borderLeft: '4px solid var(--color-text-muted)' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tổng người dùng</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>{stats.total}</h3>
        </div>
        <div className="card-premium" style={{ borderLeft: '4px solid #7c3aed' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Hội viên VIP</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: '#a78bfa' }}>{stats.vip}</h3>
        </div>
        <div className="card-premium" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Người dùng Free</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--color-success)' }}>{stats.free}</h3>
        </div>
        <div className="card-premium" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tài khoản bị khóa</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--color-danger)' }}>{stats.locked}</h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', padding: '20px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo email, họ tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-premium"
            style={{ paddingLeft: '44px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', marginRight: '8px' }}>Lọc trạng thái:</span>
          {(['all', 'free', 'vip', 'locked'] as const).map((filter) => {
            const active = statusFilter === filter;
            const label =
              filter === 'all'
                ? 'Tất cả'
                : filter === 'free'
                ? 'Free'
                : filter === 'vip'
                ? 'VIP'
                : 'Bị khóa';
            return (
              <button
                key={filter}
                onClick={() => { setStatusFilter(filter); setPage(1); }}
                className={`btn-premium ${active ? '' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px' }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Listing Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '30vh', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid rgba(16, 185, 129, 0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Đang tải người dùng...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
          <ShieldAlert size={48} style={{ color: 'var(--color-text-muted)' }} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Không tìm thấy người dùng phù hợp</span>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th>Ngày đăng ký</th>
                <th>Gói dịch vụ</th>
                <th>Hạn VIP</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const days = daysLeft(user.vipExpiresAt);
                const isLocked = user.isLocked;

                return (
                  <tr key={user.id} style={{ backgroundColor: isLocked ? 'rgba(239, 68, 68, 0.02)' : 'transparent' }}>
                    <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{user.name}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>{getVipBadge(user)}</td>
                    <td style={{ fontWeight: 500 }}>
                      {user.vipPackageId && user.vipExpiresAt
                        ? days > 0
                          ? `${days} ngày`
                          : 'Hết hạn'
                        : '—'}
                    </td>
                    <td>
                      <span className={`badge-custom ${isLocked ? 'badge-danger' : 'badge-success'}`}>
                        {isLocked ? <Ban size={12} /> : <CheckCircle size={12} />}
                        {isLocked ? 'Bị khóa' : 'Hoạt động'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* Lock / Unlock Toggle */}
                        <button
                          onClick={() => handleToggleLock(user)}
                          className={`btn-premium ${isLocked ? 'btn-secondary' : 'btn-danger'}`}
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                          disabled={user.email === 'namdinh'}
                        >
                          {isLocked ? 'Mở khóa' : 'Khóa'}
                        </button>

                        {/* VIP actions */}
                        {user.vipPackageId ? (
                          <button
                            onClick={() => handleRevokeVip(user)}
                            className="btn-premium btn-danger"
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}
                          >
                            Hủy VIP
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenGrantModal(user)}
                            className="btn-premium"
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                            disabled={isLocked}
                          >
                            Cấp VIP
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn-premium btn-secondary"
            style={{ padding: '8px 16px', borderRadius: '8px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={16} />
            <span>Trước</span>
          </button>
          
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Trang {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="btn-premium btn-secondary"
            style={{ padding: '8px 16px', borderRadius: '8px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
          >
            <span>Sau</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Grant VIP Modal */}
      {showGrantModal && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>Nâng cấp Hội viên VIP</h3>
              <button 
                onClick={() => { setShowGrantModal(false); setSelectedUser(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              Chọn gói VIP thích hợp bên dưới để cấp quyền sử dụng tính năng Premium cho hội viên:{' '}
              <strong style={{ color: 'var(--color-text)' }}>{selectedUser.name}</strong>.
            </p>

            {actionLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', border: '3px solid rgba(16, 185, 129, 0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Đang xử lý nâng cấp...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handleGrantVip(pkg.id)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'border-color var(--transition-fast), background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.01)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'var(--bg-surface)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '14px' }}>💎 {pkg.name}</span>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '14px' }}>
                        {pkg.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      <span>Thời hạn: {pkg.durationDays} ngày</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                      {pkg.features.join(' • ')}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => { setShowGrantModal(false); setSelectedUser(null); }}
                className="btn-premium btn-secondary"
                style={{ padding: '8px 16px', borderRadius: '8px' }}
                disabled={actionLoading}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
