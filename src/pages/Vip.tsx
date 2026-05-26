import React, { useState, useEffect } from 'react';
import { adminVip } from '../services/adminApiConfig';
import type { VipPackage, Transaction } from '../services/adminApiConfig';
import { useToast } from '../components/Toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Vip: React.FC = () => {
  const [packages, setPackages] = useState<VipPackage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [txStatusFilter, setTxStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);

  // Modal package state
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<VipPackage | null>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgDuration, setPkgDuration] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState('');
  const [pkgActive, setPkgActive] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  const fetchPackages = async () => {
    try {
      const pkgs = await adminVip.getPackages();
      setPackages(pkgs);
    } catch (error: any) {
      showToast(error.message || 'Không thể tải gói VIP', 'error');
    }
  };

  const fetchTransactions = async () => {
    setTxLoading(true);
    try {
      const response = await adminVip.getTransactions({
        page: txPage,
        pageSize: 10,
        status: txStatusFilter !== 'all' ? txStatusFilter : undefined,
      });
      setTransactions(response.data);
      setTxTotalPages(response.totalPages);
    } catch (error: any) {
      showToast(error.message || 'Không thể tải giao dịch', 'error');
    } finally {
      setTxLoading(false);
    }
  };

  const initData = async () => {
    setLoading(true);
    await Promise.all([fetchPackages(), fetchTransactions()]);
    setLoading(false);
  };

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [txPage, txStatusFilter]);

  const handleOpenCreateModal = () => {
    setEditingPkg(null);
    setPkgName('');
    setPkgPrice('');
    setPkgDuration('30');
    setPkgFeatures('');
    setPkgActive(true);
    setShowPkgModal(true);
  };

  const handleOpenEditModal = (pkg: VipPackage) => {
    setEditingPkg(pkg);
    setPkgName(pkg.name);
    setPkgPrice(pkg.price.toString());
    setPkgDuration(pkg.durationDays.toString());
    setPkgFeatures(pkg.features.join(', '));
    setPkgActive(pkg.isActive);
    setShowPkgModal(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName || !pkgPrice || !pkgDuration) {
      showToast('Vui lòng nhập đầy đủ thông tin bắt buộc', 'warning');
      return;
    }

    const price = parseInt(pkgPrice);
    const durationDays = parseInt(pkgDuration);
    if (isNaN(price) || isNaN(durationDays)) {
      showToast('Giá và thời hạn phải là số hợp lệ', 'warning');
      return;
    }

    const features = pkgFeatures
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    setActionLoading(true);
    try {
      if (editingPkg) {
        // Edit package
        const updated = await adminVip.updatePackage(editingPkg.id, {
          name: pkgName,
          price,
          durationDays,
          features,
          isActive: pkgActive
        });
        showToast(`Đã cập nhật gói ${updated.name}`, 'success');
      } else {
        // Create package
        const created = await adminVip.createPackage({
          name: pkgName,
          price,
          durationDays,
          features,
          isActive: pkgActive
        });
        showToast(`Đã thêm gói ${created.name} thành công`, 'success');
      }
      setShowPkgModal(false);
      fetchPackages();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi khi lưu gói VIP', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa gói VIP này? Người dùng đang sử dụng sẽ không bị ảnh hưởng trực tiếp, nhưng gói sẽ biến mất khỏi danh sách mua.')) {
      return;
    }
    try {
      await adminVip.deletePackage(id);
      showToast('Đã xóa gói VIP thành công', 'success');
      fetchPackages();
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi xóa gói VIP', 'error');
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return <span className="badge-custom badge-success">Thành công</span>;
      case 'pending':
        return <span className="badge-custom badge-warning">Đang chờ</span>;
      case 'failed':
        return <span className="badge-custom badge-danger">Thất bại</span>;
      default:
        return <span className="badge-custom badge-muted">—</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '40vh', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(16, 185, 129, 0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Đang tải gói dịch vụ...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Packages Admin Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>Gói Hội viên VIP đang cung cấp</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Quản lý giá, thời hạn và quyền lợi các gói VIP trên ứng dụng</p>
          </div>
          <button onClick={handleOpenCreateModal} className="btn-premium" style={{ borderRadius: '8px' }}>
            <Plus size={16} />
            <span>Thêm gói mới</span>
          </button>
        </div>

        {/* Packages Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {packages.map((pkg) => (
            <div key={pkg.id} className="card-premium" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
              border: pkg.isActive ? '1px solid var(--bg-card-border)' : '1px dashed var(--color-danger-bg)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>💎 {pkg.name}</h4>
                  <span className={`badge-custom ${pkg.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '10px' }}>
                    {pkg.isActive ? 'Bán chạy' : 'Ngưng bán'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '12px 0 20px 0' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>{pkg.price.toLocaleString('vi-VN')}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>đ / {pkg.durationDays} ngày</span>
                </div>
                
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                  {pkg.features.map((feature: string, idx: number) => (
                    <li key={idx} style={{ lineHeight: '1.4' }}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button 
                  onClick={() => handleOpenEditModal(pkg)} 
                  className="btn-premium btn-secondary" 
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px' }}
                >
                  <Edit size={14} />
                  <span>Sửa thông tin</span>
                </button>
                <button 
                  onClick={() => handleDeletePackage(pkg.id)} 
                  className="btn-premium btn-danger" 
                  style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '12px', backgroundColor: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transactions Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>Lịch sử nâng cấp & thanh toán VIP</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Danh sách giao dịch nạp VIP từ người dùng hệ thống</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Bộ lọc:</span>
            {(['all', 'success', 'pending', 'failed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => { setTxStatusFilter(st); setTxPage(1); }}
                className={`btn-premium ${txStatusFilter === st ? '' : 'btn-secondary'}`}
                style={{ padding: '4px 12px', fontSize: '11px', borderRadius: '20px' }}
              >
                {st === 'all' ? 'Tất cả' : st === 'success' ? 'Thành công' : st === 'pending' ? 'Chờ duyệt' : 'Thất bại'}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Table */}
        {txLoading && transactions.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '24px', height: '24px', border: '2px solid rgba(16, 185, 129, 0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="card-premium" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Không tìm thấy giao dịch nào phù hợp
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã GD</th>
                  <th>Hội viên</th>
                  <th>Gói VIP</th>
                  <th>Số tiền</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)' }}>#{tx.id}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{tx.userName}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{tx.userEmail}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{tx.packageName}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{tx.amount.toLocaleString('vi-VN')} đ</td>
                    <td>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                    <td>{getStatusBadge(tx.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions Pagination */}
        {!txLoading && txTotalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
            <button
              onClick={() => setTxPage(txPage - 1)}
              disabled={txPage === 1}
              className="btn-premium btn-secondary"
              style={{ padding: '6px 12px', borderRadius: '6px', opacity: txPage === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Trang {txPage} / {txTotalPages}</span>
            <button
              onClick={() => setTxPage(txPage + 1)}
              disabled={txPage === txTotalPages}
              className="btn-premium btn-secondary"
              style={{ padding: '6px 12px', borderRadius: '6px', opacity: txPage === txTotalPages ? 0.5 : 1 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </section>

      {/* Package Form Dialog */}
      {showPkgModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                {editingPkg ? 'Sửa thông tin gói VIP' : 'Cung cấp gói VIP mới'}
              </h3>
              <button onClick={() => setShowPkgModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePackage} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Tên gói VIP *</label>
                <input 
                  type="text" 
                  value={pkgName} 
                  onChange={(e) => setPkgName(e.target.value)} 
                  placeholder="Ví dụ: VIP Pro..."
                  className="input-premium" 
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Giá gói (VND) *</label>
                  <input 
                    type="number" 
                    value={pkgPrice} 
                    onChange={(e) => setPkgPrice(e.target.value)} 
                    placeholder="Ví dụ: 99000"
                    className="input-premium" 
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Thời hạn (ngày) *</label>
                  <input 
                    type="number" 
                    value={pkgDuration} 
                    onChange={(e) => setPkgDuration(e.target.value)} 
                    placeholder="Ví dụ: 30"
                    className="input-premium" 
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Quyền lợi (cách nhau bằng dấu phẩy)</label>
                <textarea 
                  value={pkgFeatures} 
                  onChange={(e) => setPkgFeatures(e.target.value)} 
                  placeholder="Phân tích dinh dưỡng nâng cao, Đề xuất thực đơn AI..."
                  className="input-premium" 
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                <input 
                  type="checkbox" 
                  id="pkgActive" 
                  checked={pkgActive} 
                  onChange={(e) => setPkgActive(e.target.checked)} 
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="pkgActive" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer' }}>
                  Mở bán gói này cho hội viên
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowPkgModal(false)} 
                  className="btn-premium btn-secondary"
                  style={{ padding: '8px 16px', borderRadius: '8px' }}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn-premium"
                  style={{ padding: '8px 16px', borderRadius: '8px' }}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
