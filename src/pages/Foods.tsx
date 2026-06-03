import React, { useState, useEffect } from 'react';
import { adminFoods } from '../services/adminApiConfig';
import type { AdminFood, AdminFoodCategory, FoodStats } from '../services/adminApiConfig';
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
  Database
} from 'lucide-react';

// Category name mapping (matches backend)
const CATEGORY_NAMES: Record<number, string> = {
  1: 'Ngũ cốc & Tinh bột',
  2: 'Rau củ',
  3: 'Trái cây',
  4: 'Thịt & Hải sản',
  5: 'Sữa & Trứng',
  6: 'Đậu & Hạt',
  7: 'Dầu & Chất béo',
  8: 'Gia vị & Nước chấm',
  9: 'Đồ uống',
  10: 'Thức ăn nhanh',
  11: 'Bánh & Kẹo',
  12: 'Khác',
};

const getCategoryName = (id: number) => CATEGORY_NAMES[id] || `Danh mục ${id}`;

export const Foods: React.FC = () => {
  const [foods, setFoods] = useState<AdminFood[]>([]);
  const [categories, setCategories] = useState<AdminFoodCategory[]>([]);
  const [stats, setStats] = useState<FoodStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal food state
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState<AdminFood | null>(null);
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSizeG, setServingSizeG] = useState('100');
  const [servingUnitVi, setServingUnitVi] = useState('g');
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await adminFoods.getAll({
        page,
        pageSize: 15,
        search: searchQuery || undefined,
        categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setFoods(response.data);
      setTotalPages(response.totalPages || 1);
    } catch (error: any) {
      showToast(error.message || 'Không thể tải danh sách món ăn', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltersAndStats = async () => {
    try {
      const [cats, statsData] = await Promise.all([
        adminFoods.getCategories(),
        adminFoods.getStats(),
      ]);
      setCategories(cats);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load filter/stats data:', error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [page, categoryFilter, statusFilter]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchFoods();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    fetchFiltersAndStats();
  }, []);

  const handleToggleVisibility = async (food: AdminFood) => {
    try {
      await adminFoods.toggleVisibility(food.id);
      const newStatus = food.status === 1 ? 0 : 1;
      showToast(
        `${newStatus === 1 ? 'Đã hiển thị' : 'Đã ẩn'} món ăn ${food.nameVi}`,
        'success'
      );
      setFoods(foods.map((f) => (f.id === food.id ? { ...f, status: newStatus } : f)));
      fetchFiltersAndStats();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món ăn này ra khỏi cơ sở dữ liệu?')) {
      return;
    }
    try {
      await adminFoods.delete(id);
      showToast('Đã xóa món ăn thành công', 'success');
      fetchFoods();
      fetchFiltersAndStats();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi khi xóa', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingFood(null);
    setNameVi('');
    setNameEn('');
    setCategoryId(1);
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setServingSizeG('100');
    setServingUnitVi('g');
    setShowFoodModal(true);
  };

  const handleOpenEditModal = (food: AdminFood) => {
    setEditingFood(food);
    setNameVi(food.nameVi);
    setNameEn(food.nameEn || '');
    setCategoryId(food.categoryId);
    setCalories(food.nutrition?.caloriesKcal?.toString() || '');
    setProtein(food.nutrition?.proteinG?.toString() || '');
    setCarbs(food.nutrition?.carbsG?.toString() || '');
    setFat(food.nutrition?.fatG?.toString() || '');
    setServingSizeG(food.servingSizeG?.toString() || '100');
    setServingUnitVi(food.servingUnitVi || 'g');
    setShowFoodModal(true);
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVi || !calories || !protein || !carbs || !fat || !servingSizeG || !servingUnitVi) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
      return;
    }

    const foodData: any = {
      nameVi,
      categoryId,
      servingSizeG: parseFloat(servingSizeG),
      servingUnitVi,
      status: 1, // Default to visible
      nutrition: {
        caloriesKcal: parseFloat(calories),
        proteinG: parseFloat(protein),
        carbsG: parseFloat(carbs),
        fatG: parseFloat(fat),
      },
    };
    
    if (nameEn) {
      foodData.nameEn = nameEn;
    }

    setActionLoading(true);
    try {
      if (editingFood) {
        await adminFoods.update(editingFood.id, foodData);
        showToast(`Đã sửa món ăn ${nameVi}`, 'success');
      } else {
        await adminFoods.create(foodData);
        showToast(`Đã thêm món ăn ${nameVi} thành công`, 'success');
      }
      setShowFoodModal(false);
      fetchFoods();
      fetchFiltersAndStats();
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi lưu món ăn', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Grid Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Tổng món ăn</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>{stats.total}</h3>
            </div>
            <Database size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="card-premium">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Đang hiển thị</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--color-success)' }}>{stats.visible}</h3>
          </div>
          <div className="card-premium">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Đang ẩn</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--color-danger)' }}>{stats.hidden}</h3>
          </div>
          <div className="card-premium">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Số danh mục</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: 'var(--color-info)' }}>{stats.categories}</h3>
          </div>
        </div>
      )}

      {/* Action panel (Search + filters + buttons) */}
      <div className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Tìm món ăn (tiếng Việt / Anh)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium"
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <select 
            value={categoryFilter} 
            onChange={(e) => { setCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value)); setPage(1); }} 
            className="select-premium"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.foodCount})</option>
            ))}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value === 'all' ? 'all' : Number(e.target.value)); setPage(1); }} 
            className="select-premium"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value={1}>Đang hiện</option>
            <option value={0}>Đang ẩn</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleOpenCreateModal} className="btn-premium" style={{ padding: '10px 16px', borderRadius: '8px' }}>
            <Plus size={16} />
            <span>Thêm món</span>
          </button>
        </div>
      </div>

      {/* Food list table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid rgba(16, 185, 129, 0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : foods.length === 0 ? (
        <div className="card-premium" style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
          Không tìm thấy món ăn nào phù hợp trong kho dữ liệu
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên món ăn (Vi/En)</th>
                <th>Danh mục</th>
                <th>Calo</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
                <th>Định lượng</th>
                <th>Hiển thị</th>
                <th style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food.id} style={{ opacity: food.status === 1 ? 1 : 0.6 }}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{food.nameVi}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{food.nameEn || '—'}</span>
                    </div>
                  </td>
                  <td><span className="badge-custom badge-muted">{getCategoryName(food.categoryId)}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{food.nutrition?.caloriesKcal ?? '—'} kcal</td>
                  <td>{food.nutrition?.proteinG ?? '—'}g</td>
                  <td>{food.nutrition?.carbsG ?? '—'}g</td>
                  <td>{food.nutrition?.fatG ?? '—'}g</td>
                  <td>{food.servingSizeG} {food.servingUnitVi}</td>
                  <td>
                    <button 
                      onClick={() => handleToggleVisibility(food)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: food.status === 1 ? 'var(--color-success)' : 'var(--color-text-muted)' }}
                    >
                      {food.status === 1 ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => handleOpenEditModal(food)} className="btn-premium btn-secondary" style={{ padding: '6px 10px', borderRadius: '6px' }}>
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDeleteFood(food.id)} className="btn-premium btn-danger" style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}>
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

      {/* Food Add / Edit Dialog */}
      {showFoodModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                {editingFood ? 'Sửa thông tin thực phẩm' : 'Thêm thực phẩm mới'}
              </h3>
              <button onClick={() => setShowFoodModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFood} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Tên tiếng Việt *</label>
                  <input type="text" value={nameVi} onChange={(e) => setNameVi(e.target.value)} placeholder="Ví dụ: Cá ngừ..." className="input-premium" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Tên tiếng Anh</label>
                  <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Ví dụ: Tuna..." className="input-premium" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Danh mục thực phẩm *</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="select-premium" required>
                    {Object.entries(CATEGORY_NAMES).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Định lượng *</label>
                  <input type="number" value={servingSizeG} onChange={(e) => setServingSizeG(e.target.value)} placeholder="100" className="input-premium" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Đơn vị *</label>
                  <input type="text" value={servingUnitVi} onChange={(e) => setServingUnitVi(e.target.value)} placeholder="g, ml, quả" className="input-premium" required />
                </div>
              </div>

              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginTop: '8px' }}>
                Giá trị dinh dưỡng (tính trên định lượng trên)
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Calo (kcal) *</label>
                  <input type="number" step="any" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="130" className="input-premium" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Protein (g) *</label>
                  <input type="number" step="any" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="3.5" className="input-premium" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Carbs (g) *</label>
                  <input type="number" step="any" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="28" className="input-premium" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Fat (g) *</label>
                  <input type="number" step="any" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="0.5" className="input-premium" required />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowFoodModal(false)} className="btn-premium btn-secondary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
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
