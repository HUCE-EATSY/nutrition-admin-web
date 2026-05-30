import React, { useState, useEffect } from 'react';
import { adminExercises } from '../services/adminApiConfig';
import type { AdminExercise, ExerciseStats } from '../services/adminApiConfig';
import { useToast } from '../components/Toast';
import { 
  Search, 
  Plus, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  X,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

export const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<AdminExercise[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<ExerciseStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal exercise state
  const [showModal, setShowModal] = useState(false);
  const [editingEx, setEditingEx] = useState<AdminExercise | null>(null);
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('');
  const [metValue, setMetValue] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await adminExercises.getAll({
        page,
        pageSize: 15,
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        visibility: visibilityFilter !== 'all' ? visibilityFilter : undefined,
      });
      setExercises(response.data);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      showToast(error.message || 'Không thể tải bài tập', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltersAndStats = async () => {
    try {
      const [cats, statsData] = await Promise.all([
        adminExercises.getCategories(),
        adminExercises.getStats(),
      ]);
      setCategories(cats);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load filters or stats:', error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [page, categoryFilter, visibilityFilter]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchExercises();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    fetchFiltersAndStats();
  }, []);

  const handleToggleVisibility = async (ex: AdminExercise) => {
    try {
      const updated = await adminExercises.toggleVisibility(ex.id);
      showToast(
        `${updated.isVisible ? 'Đã hiển thị' : 'Đã ẩn'} bài tập ${updated.nameVi}`,
        'success'
      );
      setExercises(exercises.map((item) => (item.id === ex.id ? updated : item)));
      fetchFiltersAndStats();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleDeleteExercise = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài tập này ra khỏi hệ thống?')) {
      return;
    }
    try {
      await adminExercises.delete(id);
      showToast('Đã xóa bài tập thành công', 'success');
      fetchExercises();
      fetchFiltersAndStats();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi khi xóa bài tập', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEx(null);
    setNameVi('');
    setNameEn('');
    setCategory('');
    setMetValue('');
    setIconUrl('');
    setShowModal(true);
  };

  const handleOpenEditModal = (ex: AdminExercise) => {
    setEditingEx(ex);
    setNameVi(ex.nameVi);
    setNameEn(ex.nameEn);
    setCategory(ex.category);
    setMetValue(ex.metValue.toString());
    setIconUrl(ex.iconUrl || '');
    setShowModal(true);
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVi || !category || !metValue) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
      return;
    }

    const valMET = parseFloat(metValue);
    if (isNaN(valMET) || valMET <= 0) {
      showToast('Chỉ số MET phải là số dương lớn hơn 0', 'warning');
      return;
    }

    const exData = {
      nameVi,
      nameEn,
      category,
      metValue: valMET,
      calPerKgPerHour: valMET,
      iconUrl: iconUrl.trim() || null,
      isVisible: editingEx ? editingEx.isVisible : true,
    };

    setActionLoading(true);
    try {
      if (editingEx) {
        await adminExercises.update(editingEx.id, exData);
        showToast(`Đã sửa bài tập ${nameVi}`, 'success');
      } else {
        await adminExercises.create(exData);
        showToast(`Đã thêm bài tập ${nameVi} thành công`, 'success');
      }
      setShowModal(false);
      fetchExercises();
      fetchFiltersAndStats();
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi lưu bài tập', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Stats Summary Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tổng bài tập</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>{stats.total}</h3>
            </div>
            <Zap size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="card-premium">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Đang hoạt động</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--color-success)' }}>{stats.visible}</h3>
          </div>
          <div className="card-premium">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Số phân loại</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--color-info)' }}>{stats.categories}</h3>
          </div>
        </div>
      )}

      {/* Action / Filtering Row */}
      <div className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Tìm bài tập theo tên tiếng Việt/Anh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium"
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <select 
            value={categoryFilter} 
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} 
            className="select-premium"
          >
            <option value="all">Tất cả phân loại</option>
            {categories.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>

          <select 
            value={visibilityFilter} 
            onChange={(e) => { setVisibilityFilter(e.target.value); setPage(1); }} 
            className="select-premium"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="visible">Đang mở</option>
            <option value="hidden">Đang ẩn</option>
          </select>
        </div>

        <button onClick={handleOpenCreateModal} className="btn-premium" style={{ padding: '10px 16px', borderRadius: '8px' }}>
          <Plus size={16} />
          <span>Thêm bài tập</span>
        </button>
      </div>

      {/* Exercises Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid rgba(16, 185, 129, 0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : exercises.length === 0 ? (
        <div className="card-premium" style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
          Không tìm thấy bài tập nào phù hợp trong kho dữ liệu
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên bài tập (Vi/En)</th>
                <th>Phân loại</th>
                <th>Chỉ số MET</th>
                <th>Kcal tiêu hao / kg / giờ</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.id} style={{ opacity: ex.isVisible ? 1 : 0.6 }}>
                  <td>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                      {ex.iconUrl ? (
                        <img src={ex.iconUrl} alt={ex.nameVi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <span style={{ fontSize: '18px' }}>💪</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{ex.nameVi}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{ex.nameEn || '—'}</span>
                    </div>
                  </td>
                  <td><span className="badge-custom badge-muted">{ex.category}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{ex.metValue}</td>
                  <td style={{ fontWeight: 500 }}>{ex.metValue * 1} kcal</td>
                  <td>
                    <button 
                      onClick={() => handleToggleVisibility(ex)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: ex.isVisible ? 'var(--color-success)' : 'var(--color-text-muted)' }}
                    >
                      {ex.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => handleOpenEditModal(ex)} className="btn-premium btn-secondary" style={{ padding: '6px 10px', borderRadius: '6px' }}>
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDeleteExercise(ex.id)} className="btn-premium btn-danger" style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn-premium btn-secondary" style={{ padding: '6px 12px', borderRadius: '6px', opacity: page === 1 ? 0.5 : 1 }}>
            <ChevronLeft size={14} />
          </button>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Trang {page} / {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="btn-premium btn-secondary" style={{ padding: '6px 12px', borderRadius: '6px', opacity: page === totalPages ? 0.5 : 1 }}>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Exercise Modal Form */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                {editingEx ? 'Sửa thông tin bài tập' : 'Thêm bài tập mới'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveExercise} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Tên tiếng Việt *</label>
                  <input type="text" value={nameVi} onChange={(e) => setNameVi(e.target.value)} placeholder="Chạy bộ, nhảy dây..." className="input-premium" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Tên tiếng Anh</label>
                  <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Running, rope jumping..." className="input-premium" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Phân loại bài tập *</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Cardio, Sức mạnh, Linh hoạt..." className="input-premium" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Chỉ số MET *</label>
                  <input type="number" step="any" value={metValue} onChange={(e) => setMetValue(e.target.value)} placeholder="6.0" className="input-premium" required />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Đường dẫn hình ảnh minh họa (URL)</label>
                <input type="text" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://res.cloudinary.com/..." className="input-premium" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-premium btn-secondary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
                  Hủy
                </button>
                <button type="submit" className="btn-premium" style={{ padding: '8px 16px', borderRadius: '8px' }} disabled={actionLoading}>
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
