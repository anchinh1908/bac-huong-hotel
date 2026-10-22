import React from 'react';
import { SlidersHorizontal, User, Bed, RotateCcw, CheckSquare, Square } from 'lucide-react';

export default function RoomFilterBar({
  capacityFilter,
  setCapacityFilter,
  bedFilter,
  setBedFilter,
  priceRanges,
  setPriceRanges,
  onlyAvailable,
  setOnlyAvailable,
  totalMatches,
  totalRooms,
  onReset
}) {
  const isFiltered = capacityFilter !== 'ALL' || bedFilter !== 'ALL' || priceRanges.length > 0 || onlyAvailable;

  const togglePriceRange = (rangeKey) => {
    if (priceRanges.includes(rangeKey)) {
      setPriceRanges(priceRanges.filter(k => k !== rangeKey));
    } else {
      setPriceRanges([...priceRanges, rangeKey]);
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '22px 24px',
      boxShadow: '0 4px 20px -2px rgba(120, 53, 15, 0.06)',
      marginBottom: '36px'
    }}>
      {/* Tiêu đề & Đặt lại bộ lọc */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingBottom: '16px',
        borderBottom: '1px solid #f1f5f9',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#92400e'
          }}>
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
              Bộ Lọc Tìm Phòng Nhanh
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Chọn số lượng người, loại giường và mức giá để tìm phòng ưng ý nhất
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '0.85rem',
            color: '#475569',
            background: '#f8fafc',
            padding: '5px 12px',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            fontWeight: 600
          }}>
            Tìm thấy <b style={{ color: '#b45309' }}>{totalMatches}</b> / {totalRooms} phòng
          </span>

          {isFiltered && (
            <button
              onClick={onReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#fff1f2',
                color: '#e11d48',
                border: '1px solid #fecdd3',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Khôi phục lại tất cả bộ lọc"
            >
              <RotateCcw size={13} />
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>

      {/* Lưới các bộ lọc */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* 1. COMBOBOX SỐ LƯỢNG NGƯỜI */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#334155',
            marginBottom: '8px'
          }}>
            <User size={15} color="#b45309" />
            <span>Số lượng người:</span>
          </label>
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.9rem',
              color: '#0f172a',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#b45309'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          >
            <option value="ALL">Tất cả số người</option>
            <option value="1">1 Người (Khách lẻ / Công tác)</option>
            <option value="2">2 Người (Cặp đôi / Bạn bè)</option>
            <option value="4">Từ 3 - 4 Người (Gia đình)</option>
          </select>
        </div>

        {/* 2. COMBOBOX LOẠI GIƯỜNG */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#334155',
            marginBottom: '8px'
          }}>
            <Bed size={15} color="#b45309" />
            <span>Loại giường:</span>
          </label>
          <select
            value={bedFilter}
            onChange={(e) => setBedFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.9rem',
              color: '#0f172a',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#b45309'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          >
            <option value="ALL">Tất cả loại giường</option>
            <option value="1_SINGLE">1 Giường Đơn</option>
            <option value="1_DOUBLE">1 Giường Đôi (Queen / King)</option>
            <option value="2_SINGLE">2 Giường Đơn (Twin)</option>
            <option value="FAMILY_BED">2 Giường Đôi (Gia đình)</option>
          </select>
        </div>

        {/* 3. CHECKBOX KHOẢNG GIÁ */}
        <div style={{ gridColumn: 'span 1' }}>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#334155',
            marginBottom: '8px'
          }}>
            💰 Khoảng giá / đêm:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={priceRanges.includes('UNDER_500')}
                onChange={() => togglePriceRange('UNDER_500')}
                style={{ width: '16px', height: '16px', accentColor: '#b45309', cursor: 'pointer' }}
              />
              <span>Dưới 500.000 đ</span>
            </label>

            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={priceRanges.includes('FROM_500_TO_800')}
                onChange={() => togglePriceRange('FROM_500_TO_800')}
                style={{ width: '16px', height: '16px', accentColor: '#b45309', cursor: 'pointer' }}
              />
              <span>500.000 đ – 800.000 đ</span>
            </label>

            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={priceRanges.includes('OVER_800')}
                onChange={() => togglePriceRange('OVER_800')}
                style={{ width: '16px', height: '16px', accentColor: '#b45309', cursor: 'pointer' }}
              />
              <span>Trên 800.000 đ</span>
            </label>
          </div>
        </div>

        {/* 4. CHECKBOX TRẠNG THÁI PHÒNG */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#334155',
            marginBottom: '8px'
          }}>
            ⚡ Trạng thái:
          </label>
          <div style={{
            background: onlyAvailable ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${onlyAvailable ? '#86efac' : '#e2e8f0'}`,
            borderRadius: '10px',
            padding: '12px 14px',
            transition: 'all 0.2s ease'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              color: onlyAvailable ? '#15803d' : '#334155',
              fontWeight: 600,
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#16a34a', cursor: 'pointer' }}
              />
              <span>Chỉ hiện phòng còn trống</span>
            </label>
            <p style={{ margin: '4px 0 0 28px', fontSize: '0.78rem', color: '#64748b' }}>
              Ẩn các phòng đang có khách hoặc đang dọn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
