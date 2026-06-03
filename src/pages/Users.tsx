import React, { useState, useEffect } from 'react';
import { adminUsers, adminSubscriptions } from '../services/adminApiConfig';
import type { AdminUser, Subscription } from '../services/adminTypes';
import { useToast } from '../components/Toast';
import { 
  Search, 
  Ban, 
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Diamond,
  Clock,
  Trash2
} from 'lucide-react';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'premium' | 'locked'>('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, premium: 0, locked: 0, free: 0 });

  // Grant Premium modal state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Premium grant form
  const [selectedPlan, setSelectedPlan] = useState<number>(2); // Default: Monthly
  const [customDays, setCustomDays] = useState<string>('');
  const [extendDays, setExtendDays] = useState<string>('');

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
    // No longer needed - using subscription plans directly
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
      const updated = await adminUsers.toggleLock(user.id.toString());
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

  const handleDeleteUser = async (user: AdminUser) => {
    if (user.email === 'namdinh') {
      showToast('Không thể xóa tài khoản Admin chính', 'warning');
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.name}? Hành động này không thể hoàn tác.`)) {
      return;
    }
    try {
      await adminUsers.deleteUser(user.id.toString());
      showToast(`Đã xóa người dùng ${user.name}`, 'success');
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleRevokePremium = async (user: AdminUser) => {
    if (!window.confirm(`Bạn có chắc chắn muốn thu hồi Premium của người dùng ${user.name}?`)) {
      return;
    }
    try {
      await adminSubscriptions.revokePremium(user.id.toString());
      showToast(`Đã thu hồi Premium của ${user.name}`, 'success');
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleOpenExtendModal = (user: AdminUser) => {
    setSelectedUser(user);
    setShowExtendModal(true);
    setExtendDays('');
  };

  const handleExtendPremium = async () => {
    if (!selectedUser) return;
    
    const days = parseInt(extendDays);
    if (!days || days <= 0) {
      showToast('Vui lòng nhập số ngày hợp lệ', 'error');
      return;
    }
    
    setActionLoading(true);
    try {
      await adminSubscriptions.extendPremium(selectedUser.id.toString(), { additionalDays: days });
      showToast(`Gia hạn Premium thành công cho ${selectedUser.name}`, 'success');
      setShowExtendModal(false);
      setSelectedUser(null);
      setExtendDays('');
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenGrantModal = (user: AdminUser) => {
    setSelectedUser(user);
    setShowGrantModal(true);
  };

  const handleGrantPremium = async () => {
    if (!selectedUser) return;
    
    const durationDays = selectedPlan === 0 ? parseInt(customDays) : undefined;
    
    if (selectedPlan === 0 && (!customDays || parseInt(customDays) <= 0)) {
      showToast('Vui lòng nhập số ngày hợp lệ', 'error');
      return;
    }
    
    setActionLoading(true);
    try {
      await adminSubscriptions.grantPremium(selectedUser.id.toString(), {
        planId: selectedPlan === 0 ? 2 : selectedPlan, // Use Monthly if custom
        durationDays,
        note: 'Admin grant from Users page'
      });
      showToast(`Cấp Premium thành công cho ${selectedUser.name}`, 'success');
      setShowGrantModal(false);
      setSelectedUser(null);
      setSelectedPlan(2);
      setCustomDays('');
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewHistory = async (user: AdminUser) => {
    setSelectedUser(user);
    setShowHistoryModal(true);
    setActionLoading(true);
    try {
      const history = await adminSubscriptions.getUserSubscriptions(user.id.toString());
      setUserSubscriptions(history);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Không thể tải lịch sử Premium', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const daysLeft = (expires: string | null) => {
    if (!expires) return 0;
    const diff = new Date(expires).getTime() - Date.now();
    return Math.ceil(diff / 86400000);
  };

  const getPremiumBadge = (user: AdminUser) => {
    if (!user.premiumPackageId || !user.premiumExpiresAt) {
      return <span className="badge-custom badge-muted">Miễn phí</span>;
    }

    const remaining = daysLeft(user.premiumExpiresAt);
    if (remaining <= 0) {
      return <span className="badge-custom badge-danger">Hết hạn</span>;
    }

    return (
      <span className="badge-custom" style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
        <Diamond size={12} />
        {user.premiumPackageName}
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
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Hội viên Premium</span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: '#a78bfa' }}>{stats.premium}</h3>
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
          {(['all', 'free', 'premium', 'locked'] as const).map((filter) => {
            const active = statusFilter === filter;
            const label =
              filter === 'all'
                ? 'Tất cả'
                : filter === 'free'
                ? 'Free'
                : filter === 'premium'
                ? 'Premium'
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
                <th>Hạn Premium</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const days = daysLeft(user.premiumExpiresAt);
                const isLocked = user.isLocked;

                return (
                  <tr key={user.id} style={{ backgroundColor: isLocked ? 'rgba(239, 68, 68, 0.02)' : 'transparent' }}>
                    <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{user.name}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>{getPremiumBadge(user)}</td>
                    <td style={{ fontWeight: 500 }}>
                      {user.premiumPackageId && user.premiumExpiresAt
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
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Lock / Unlock Toggle */}
                        <button
                          onClick={() => handleToggleLock(user)}
                          className={`btn-premium ${isLocked ? 'btn-secondary' : 'btn-danger'}`}
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                          disabled={user.email === 'namdinh'}
                        >
                          {isLocked ? 'Mở khóa' : 'Khóa'}
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="btn-premium btn-danger"
                          style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}
                          disabled={user.email === 'namdinh'}
                          title="Xóa người dùng"
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* View History */}
                        <button
                          onClick={() => handleViewHistory(user)}
                          className="btn-premium btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Clock size={14} />
                          Lịch sử
                        </button>

                        {/* Premium actions */}
                        {user.premiumPackageId ? (
                          <>
                            <button
                              onClick={() => handleOpenExtendModal(user)}
                              className="btn-premium btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid #7c3aed', color: '#7c3aed' }}
                            >
                              Gia hạn
                            </button>
                            <button
                              onClick={() => handleRevokePremium(user)}
                              className="btn-premium btn-danger"
                              style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}
                            >
                              Thu hồi
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenGrantModal(user)}
                            className="btn-premium"
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            disabled={isLocked}
                          >
                            <Diamond size={14} />
                            Cấp Premium
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

      {/* Grant Premium Modal */}
      {showGrantModal && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                <Diamond size={20} style={{ display: 'inline', marginRight: '8px', color: '#a78bfa' }} />
                Cấp Premium cho User
              </h3>
              <button 
                onClick={() => { setShowGrantModal(false); setSelectedUser(null); setSelectedPlan(2); setCustomDays(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              Người dùng: <strong style={{ color: 'var(--color-text)' }}>{selectedUser.name}</strong>
            </p>

            {actionLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', border: '3px solid rgba(124, 58, 237, 0.1)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Đang xử lý...</span>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--color-text)' }}>
                    Chọn gói Premium:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '2px solid ' + (selectedPlan === 2 ? '#7c3aed' : 'var(--border-color)'), borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedPlan === 2 ? 'rgba(124, 58, 237, 0.05)' : 'transparent' }}>
                      <input
                        type="radio"
                        value="2"
                        checked={selectedPlan === 2}
                        onChange={() => setSelectedPlan(2)}
                        style={{ marginRight: '12px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>Premium 1 Tháng</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>30 ngày - 59,000 VNĐ (miễn phí khi admin cấp)</div>
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '2px solid ' + (selectedPlan === 3 ? '#7c3aed' : 'var(--border-color)'), borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedPlan === 3 ? 'rgba(124, 58, 237, 0.05)' : 'transparent' }}>
                      <input
                        type="radio"
                        value="3"
                        checked={selectedPlan === 3}
                        onChange={() => setSelectedPlan(3)}
                        style={{ marginRight: '12px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>Premium 1 Năm</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>365 ngày - 499,000 VNĐ (miễn phí khi admin cấp)</div>
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', padding: '12px', border: '2px solid ' + (selectedPlan === 0 ? '#7c3aed' : 'var(--border-color)'), borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedPlan === 0 ? 'rgba(124, 58, 237, 0.05)' : 'transparent' }}>
                      <input
                        type="radio"
                        value="0"
                        checked={selectedPlan === 0}
                        onChange={() => setSelectedPlan(0)}
                        style={{ marginRight: '12px', marginTop: '2px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Tùy chỉnh số ngày</div>
                        {selectedPlan === 0 && (
                          <input
                            type="number"
                            value={customDays}
                            onChange={(e) => setCustomDays(e.target.value)}
                            placeholder="Nhập số ngày..."
                            min="1"
                            className="input-premium"
                            style={{ fontSize: '13px', padding: '8px 12px' }}
                          />
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button 
                    onClick={() => { setShowGrantModal(false); setSelectedUser(null); setSelectedPlan(2); setCustomDays(''); }}
                    className="btn-premium btn-secondary"
                    style={{ padding: '8px 16px', borderRadius: '8px' }}
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleGrantPremium}
                    className="btn-premium"
                    style={{ padding: '8px 16px', borderRadius: '8px' }}
                  >
                    Cấp Premium
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Subscription History Modal */}
      {showHistoryModal && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                <Clock size={20} style={{ display: 'inline', marginRight: '8px', color: '#a78bfa' }} />
                Lịch sử Premium - {selectedUser.name}
              </h3>
              <button 
                onClick={() => { setShowHistoryModal(false); setSelectedUser(null); setUserSubscriptions([]); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {actionLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', border: '3px solid rgba(124, 58, 237, 0.1)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Đang tải lịch sử...</span>
              </div>
            ) : userSubscriptions.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Diamond size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>Người dùng này chưa có lịch sử Premium</p>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {userSubscriptions.map((sub) => {
                  const statusColors: Record<string, { bg: string; text: string }> = {
                    Active: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
                    Trialing: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
                    Expired: { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' },
                    Cancelled: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
                  };
                  const statusStyle = statusColors[sub.status] || statusColors.Expired;
                  
                  return (
                    <div 
                      key={sub.id}
                      style={{
                        padding: '16px',
                        marginBottom: '12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Diamond size={16} style={{ color: '#a78bfa' }} />
                          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{sub.planName}</span>
                        </div>
                        <span 
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text
                          }}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>Giá: {sub.price.toLocaleString('vi-VN')} VNĐ</div>
                        <div>Bắt đầu: {new Date(sub.createdAt).toLocaleDateString('vi-VN')}</div>
                        <div>Hết hạn: {new Date(sub.currentPeriodEnd).toLocaleDateString('vi-VN')}</div>
                        {sub.orderId && (
                          <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                            Order: {sub.orderId}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                onClick={() => { setShowHistoryModal(false); setSelectedUser(null); setUserSubscriptions([]); }}
                className="btn-premium btn-secondary"
                style={{ padding: '8px 16px', borderRadius: '8px' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Premium Modal */}
      {showExtendModal && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                <Diamond size={20} style={{ display: 'inline', marginRight: '8px', color: '#a78bfa' }} />
                Gia hạn Premium
              </h3>
              <button 
                onClick={() => { setShowExtendModal(false); setSelectedUser(null); setExtendDays(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px', lineHeight: '1.5' }}>
              Người dùng: <strong style={{ color: 'var(--color-text)' }}>{selectedUser.name}</strong>
            </p>
            {selectedUser.premiumExpiresAt && (
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
                Hết hạn hiện tại: <strong style={{ color: '#a78bfa' }}>
                  {new Date(selectedUser.premiumExpiresAt).toLocaleDateString('vi-VN')}
                </strong> ({daysLeft(selectedUser.premiumExpiresAt)} ngày còn lại)
              </p>
            )}

            {actionLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', border: '3px solid rgba(124, 58, 237, 0.1)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Đang xử lý...</span>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text)' }}>
                    Số ngày gia hạn thêm:
                  </label>
                  <input
                    type="number"
                    value={extendDays}
                    onChange={(e) => setExtendDays(e.target.value)}
                    placeholder="Nhập số ngày (VD: 30, 365)..."
                    min="1"
                    className="input-premium"
                    style={{ fontSize: '14px', padding: '10px 12px' }}
                  />
                  {extendDays && parseInt(extendDays) > 0 && selectedUser.premiumExpiresAt && (
                    <p style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '8px' }}>
                      Ngày hết hạn mới: {new Date(new Date(selectedUser.premiumExpiresAt).getTime() + parseInt(extendDays) * 86400000).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button 
                    onClick={() => { setShowExtendModal(false); setSelectedUser(null); setExtendDays(''); }}
                    className="btn-premium btn-secondary"
                    style={{ padding: '8px 16px', borderRadius: '8px' }}
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleExtendPremium}
                    className="btn-premium"
                    style={{ padding: '8px 16px', borderRadius: '8px' }}
                  >
                    Gia hạn
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
