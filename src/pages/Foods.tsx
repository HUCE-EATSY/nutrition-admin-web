import React, { useState, useEffect } from 'react';
import { adminFoods } from '../services/adminApiConfig';
import type { AdminFood, FoodStats } from '../services/adminApiConfig';
import { useToast } from '../components/Toast';
import { 
  Search, 
  Plus, 
  Upload, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  X,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';

export const Foods: React.FC = () => {
  const [foods, setFoods] = useState<AdminFood[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<FoodStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal food state
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState<AdminFood | null>(null);
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('100');
  const [unit, setUnit] = useState('g');
  const [actionLoading, setActionLoading] = useState(false);

  // CSV Import state
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);

  const { showToast } = useToast();

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const response = await adminFoods.getAll({
        page,
        pageSize: 15,
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        visibility: visibilityFilter !== 'all' ? visibilityFilter : undefined,
      });
      setFoods(response.data);
      setTotalPages(response.totalPages);
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
  }, [page, categoryFilter, visibilityFilter]);

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
      const updated = await adminFoods.toggleVisibility(food.id);
      showToast(
        `${updated.isVisible ? 'Đã hiển thị' : 'Đã ẩn'} món ăn ${updated.nameVi}`,
        'success'
      );
      setFoods(foods.map((f) => (f.id === food.id ? updated : f)));
      fetchFiltersAndStats();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const handleDeleteFood = async (id: number) => {
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
    setCategory('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setServingSize('100');
    setUnit('g');
    setShowFoodModal(true);
  };

  const handleOpenEditModal = (food: AdminFood) => {
    setEditingFood(food);
    setNameVi(food.nameVi);
    setNameEn(food.nameEn);
    setCategory(food.category);
    setCalories(food.calories.toString());
    setProtein(food.protein.toString());
    setCarbs(food.carbs.toString());
    setFat(food.fat.toString());
    setServingSize(food.servingSize.toString());
    setUnit(food.unit);
    setShowFoodModal(true);
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVi || !category || !calories || !protein || !carbs || !fat || !servingSize || !unit) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
      return;
    }

    const foodData = {
      nameVi,
      nameEn,
      category,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
      servingSize: parseFloat(servingSize),
      unit,
      isVisible: editingFood ? editingFood.isVisible : true,
    };

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

  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) {
      showToast('Vui lòng nhập nội dung CSV', 'warning');
      return;
    }

    setImporting(true);
    try {
      const result = await adminFoods.importCsv(csvText);
      showToast(`Nhập dữ liệu thành công! Đã thêm ${result.imported} món ăn.`, 'success');
      setShowImportModal(false);
      setCsvText('');
      fetchFoods();
      fetchFiltersAndStats();
    } catch (error: any) {
      showToast(error.message || 'Lỗi định dạng dữ liệu hoặc import thất bại', 'error');
    } finally {
      setImporting(false);
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
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} 
            className="select-premium"
          >
            <option value="all">Tất cả danh mục</option>
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
            <option value="visible">Đang hiện</option>
            <option value="hidden">Đang ẩn</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowImportModal(true)} className="btn-premium btn-secondary" style={{ padding: '10px 16px', borderRadius: '8px' }}>
            <Upload size={16} />
            <span>Nhập CSV</span>
          </button>
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
                <tr key={food.id} style={{ opacity: food.isVisible ? 1 : 0.6 }}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{food.nameVi}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{food.nameEn || '—'}</span>
                    </div>
                  </td>
                  <td><span className="badge-custom badge-muted">{food.category}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{food.calories} kcal</td>
                  <td>{food.protein}g</td>
                  <td>{food.carbs}g</td>
                  <td>{food.fat}g</td>
                  <td>{food.servingSize} {food.unit}</td>
                  <td>
                    <button 
                      onClick={() => handleToggleVisibility(food)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: food.isVisible ? 'var(--color-success)' : 'var(--color-text-muted)' }}
                    >
                      {food.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
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
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Hải sản, Tinh bột..." className="input-premium" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Định lượng *</label>
                  <input type="number" value={servingSize} onChange={(e) => setServingSize(e.target.value)} placeholder="100" className="input-premium" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Đơn vị *</label>
                  <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="g, ml, quả" className="input-premium" required />
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

      {/* CSV Bulk Import Dialog */}
      {showImportModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>Nhập thực đơn hàng loạt bằng CSV</h3>
              <button onClick={() => setShowImportModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>
              Dán nội dung CSV của bạn vào khung bên dưới. Dòng đầu tiên phải là header chính xác theo cấu trúc:<br />
              <code style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(255,255,255,0.03)', padding: '2px 4px', borderRadius: '4px', fontSize: '11px' }}>
                nameVi, nameEn, category, calories, protein, carbs, fat, servingSize, unit
              </code>
            </p>

            <form onSubmit={handleImportCsv} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="nameVi, nameEn, category, calories, protein, carbs, fat, servingSize, unit&#10;Cơm gạo lứt, Brown Rice, Tinh bột, 110, 2.6, 23, 0.9, 100, g&#10;Ức gà áp chảo, Pan-seared Chicken, Thịt, 165, 31, 0, 3.6, 100, g"
                className="input-premium"
                style={{ minHeight: '220px', fontFamily: 'monospace', fontSize: '12px', resize: 'vertical', lineHeight: '1.5' }}
                required
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  💡 Dấu phẩy ngăn cách các trường dinh dưỡng.
                </span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setShowImportModal(false)} className="btn-premium btn-secondary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
                    Hủy
                  </button>
                  <button type="submit" className="btn-premium" style={{ padding: '8px 16px', borderRadius: '8px' }} disabled={importing}>
                    {importing ? 'Đang import...' : 'Bắt đầu import'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
