import React from 'react';
import { X, Heart, Bed, User, ArrowRight, Trash2, Eye } from 'lucide-react';

export default function SavedRoomsModal({ isOpen, onClose, savedRooms, onRemoveSaved, onBookRoom, onViewDetail }) {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
            <Heart size={22} fill="#e11d48" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
              Danh Sách Phòng Đã Lưu ({savedRooms.length})
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              Các hạng phòng yêu thích bạn đã lưu lại để tham khảo hoặc đặt nhanh
            </p>
          </div>
        </div>

        {savedRooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <Heart size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Chưa có phòng nào được lưu
            </h4>
            <p style={{ fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 18px' }}>
              Hãy bấm vào biểu tượng trái tim ❤️ ở bất kỳ phòng nào bạn thích để lưu lại và đặt phòng bất cứ lúc nào.
            </p>
            <button
              onClick={() => {
                onClose();
                document.getElementById('rooms-list')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: '#b45309',
                color: 'white',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Khám Phá Các Hạng Phòng
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {savedRooms.map(room => (
              <div 
                key={room.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px',
                  background: '#f8fafc'
                }}
              >
                <img 
                  src={room.image} 
                  alt={room.name} 
                  onClick={() => onViewDetail && onViewDetail(room)}
                  title="Nhấp để xem chi tiết phòng"
                  style={{ width: '90px', height: '70px', borderRadius: '8px', objectFit: 'cover', cursor: 'pointer' }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px' }}>
                      {room.roomNumber}
                    </span>
                    <h4 
                      onClick={() => onViewDetail && onViewDetail(room)}
                      title="Nhấp để xem chi tiết phòng"
                      style={{ 
                        fontSize: '0.98rem', 
                        fontWeight: 700, 
                        color: '#1e293b', 
                        margin: 0, 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#b45309'}
                      onMouseLeave={e => e.currentTarget.style.color = '#1e293b'}
                    >
                      {room.name}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    <span>{room.bed}</span>
                    <span>•</span>
                    <strong style={{ color: '#b45309', fontSize: '0.92rem' }}>
                      {formatCurrency(room.pricePerNight)}/đêm
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => onViewDetail && onViewDetail(room)}
                    title="Xem chi tiết ảnh & tiện nghi phòng"
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eye size={13} />
                    <span>Chi tiết</span>
                  </button>

                  <button
                    disabled={room.status && room.status !== 'AVAILABLE'}
                    onClick={() => {
                      if (room.status && room.status !== 'AVAILABLE') return;
                      onClose();
                      onBookRoom(room);
                    }}
                    style={{
                      background: (room.status && room.status !== 'AVAILABLE') ? '#94a3b8' : '#b45309',
                      color: 'white',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: (room.status && room.status !== 'AVAILABLE') ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{(room.status && room.status !== 'AVAILABLE') ? 'Hết phòng' : 'Đặt phòng'}</span>
                    {(!room.status || room.status === 'AVAILABLE') && <ArrowRight size={14} />}
                  </button>

                  <button
                    onClick={() => onRemoveSaved(room.id)}
                    title="Xóa khỏi danh sách lưu"
                    style={{
                      background: 'none',
                      border: '1px solid #cbd5e1',
                      color: '#94a3b8',
                      padding: '7px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={15} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
