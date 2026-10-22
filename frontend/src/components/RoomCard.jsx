import React from 'react';
import { User, Bed, Check, Heart } from 'lucide-react';

export default function RoomCard({ room, onBook, isSaved, onToggleSave }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const isAvailable = room.status === 'AVAILABLE';

  return (
    <div className="guest-room-card">
      <div className="room-card-img-box" style={{ position: 'relative' }}>
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
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
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

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Giá phòng</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#92400e' }}>
              {formatCurrency(room.pricePerNight)}
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}> / đêm</span>
            </div>
          </div>

          <button 
            disabled={!isAvailable}
            onClick={() => onBook(room)}
            className="btn-book-now"
            style={{ 
              opacity: isAvailable ? 1 : 0.6, 
              cursor: isAvailable ? 'pointer' : 'not-allowed',
              background: isAvailable ? undefined : '#94a3b8'
            }}
          >
            {isAvailable ? 'Đặt phòng ngay' : 'Hết phòng'}
          </button>
        </div>
      </div>
    </div>
  );
}
