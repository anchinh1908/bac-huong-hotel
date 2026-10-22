import React from 'react';
import { User, Bed, Check, Heart, Eye } from 'lucide-react';

export default function RoomCard({ room, onBook, isSaved, onToggleSave, onViewDetail }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const isAvailable = room.status === 'AVAILABLE';

  return (
    <div className="guest-room-card">
      <div 
        className="room-card-img-box" 
        style={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => onViewDetail && onViewDetail(room)}
        title="Nhấp để xem chi tiết & album ảnh phòng"
      >
        <img 
          src={room.image} 
          alt={room.name} 
          loading="lazy" 
          style={{
            filter: !isAvailable ? 'grayscale(20%) brightness(0.92)' : 'none',
            transition: 'filter 0.3s ease'
          }}
        />
        <span 
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            background: 'rgba(15, 23, 42, 0.8)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 800
          }}
        >
          {room.roomNumber} • {room.type}
        </span>

        {/* Nút Xem ảnh nổi nhẹ khi hover */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(15, 23, 42, 0.75)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backdropFilter: 'blur(4px)'
        }}>
          <Eye size={12} />
          <span>Xem ảnh</span>
        </div>

        {/* Nút Trái Tim (Yêu thích / Lưu phòng) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleSave) onToggleSave(room);
          }}
          title={isSaved ? "Bỏ lưu phòng" : "Lưu vào phòng yêu thích"}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Heart 
            size={19} 
            color={isSaved ? "#e11d48" : "#64748b"} 
            fill={isSaved ? "#e11d48" : "none"} 
          />
        </button>
      </div>

      <div className="room-card-body">
        <h3 
          onClick={() => onViewDetail && onViewDetail(room)}
          title="Nhấp để xem chi tiết phòng"
          style={{ 
            fontSize: '1.2rem', 
            fontWeight: 700, 
            color: '#0f172a', 
            marginBottom: '8px',
            cursor: 'pointer',
            transition: 'color 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#b45309'}
          onMouseLeave={e => e.currentTarget.style.color = '#0f172a'}
        >
          {room.name}
        </h3>

        <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '0.88rem', marginBottom: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={15} /> Tối đa {room.capacity} người
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bed size={15} /> {room.bed}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {room.amenities.map((item, idx) => (
            <span key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
              ✓ {item}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '16px', gap: '8px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Giá phòng</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#92400e' }}>
              {formatCurrency(room.pricePerNight)}
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}> / đêm</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => onViewDetail && onViewDetail(room)}
              title="Xem ảnh & tiện nghi chi tiết"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '9px 13px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#334155',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.color = '#92400e'; e.currentTarget.style.borderColor = '#fde68a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              <Eye size={15} />
              <span>Chi tiết</span>
            </button>

            <button 
              disabled={!isAvailable}
              onClick={() => onBook(room)}
              className="btn-book-now"
              style={{ 
                opacity: isAvailable ? 1 : 0.6, 
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                background: isAvailable ? undefined : '#94a3b8',
                padding: '9px 16px'
              }}
            >
              {isAvailable ? 'Đặt ngay' : 'Hết phòng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
