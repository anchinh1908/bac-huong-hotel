import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, User, Bed, Maximize2, Compass, 
  Building, CheckCircle2, Heart, CalendarCheck, ShieldCheck, 
  Sparkles, Coffee, Wifi, Tv, Wind, Bath, PhoneCall
} from 'lucide-react';
import { getEnhancedRoomDetails } from '../data/bacHuongData';

export default function RoomDetailModal({ 
  room, 
  isOpen, 
  onClose, 
  onBook, 
  isSaved, 
  onToggleSave,
  hotelInfo
}) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Reset về ảnh đầu tiên mỗi khi mở phòng mới
  useEffect(() => {
    setActiveImgIdx(0);
  }, [room?.id]);

  // Phím bấm mũi tên trái/phải để chuyển ảnh, Escape để đóng
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeImgIdx, room]);

  if (!isOpen || !room) return null;

  const enhanced = getEnhancedRoomDetails(room);
  const images = enhanced.images || [enhanced.image];
  const isAvailable = enhanced.status === 'AVAILABLE';

  const nextImage = () => {
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1150, padding: '16px' }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '860px', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          padding: 0,
          borderRadius: '20px',
          background: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* 1. THANH HEADER TIÊU ĐỀ */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                fontWeight: 800, 
                fontSize: '0.85rem', 
                padding: '4px 10px', 
                borderRadius: '6px' 
              }}>
                {enhanced.roomNumber}
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                {enhanced.name}
              </h2>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '50px',
                background: isAvailable ? '#dcfce7' : (enhanced.status === 'OCCUPIED' ? '#fee2e2' : '#fef3c7'),
                color: isAvailable ? '#15803d' : (enhanced.status === 'OCCUPIED' ? '#b91c1c' : '#b45309')
              }}>
                {isAvailable ? '🟢 Sẵn Sàng Đón Khách' : (enhanced.status === 'OCCUPIED' ? '🔴 Đang Có Khách' : '🟡 Đang Dọn Dẹp')}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              Hạng phòng: <b>{enhanced.type}</b> • Khách Sạn Bắc Hương Kon Tum
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. THƯ VIỆN HÌNH ẢNH SLIDER (INTERACTIVE GALLERY) */}
        <div style={{ position: 'relative', background: '#0f172a', overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: '100%', height: '420px' }}>
            <img 
              src={images[activeImgIdx]} 
              alt={`${enhanced.name} - ảnh ${activeImgIdx + 1}`} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 0.25s ease-in-out'
              }}
            />

            {/* Nút bấm chuyển ảnh Trái */}
            {images.length > 1 && (
              <button 
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '16px',
                  transform: 'translateY(-50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)'}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Nút bấm chuyển ảnh Phải */}
            {images.length > 1 && (
              <button 
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '16px',
                  transform: 'translateY(-50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)'}
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Chỉ số ảnh (Badge góc phải dưới) */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: 'rgba(15, 23, 42, 0.75)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: '20px',
              backdropFilter: 'blur(4px)'
            }}>
              📷 {activeImgIdx + 1} / {images.length} hình ảnh
            </div>

            {/* Nút yêu thích góc trái dưới */}
            <button
              onClick={() => onToggleSave && onToggleSave(room)}
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                padding: '6px 14px',
                borderRadius: '30px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: isSaved ? '#e11d48' : '#334155',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              <Heart size={16} fill={isSaved ? '#e11d48' : 'none'} color={isSaved ? '#e11d48' : '#334155'} />
              <span>{isSaved ? 'Đã lưu phòng' : 'Lưu yêu thích'}</span>
            </button>
          </div>

          {/* DẢI ẢNH NHỎ (THUMBNAILS) */}
          {images.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '10px',
              padding: '12px 16px',
              background: '#090d16',
              overflowX: 'auto'
            }}>
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  style={{
                    position: 'relative',
                    width: '76px',
                    height: '52px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: activeImgIdx === idx ? '2px solid #fbbf24' : '2px solid transparent',
                    opacity: activeImgIdx === idx ? 1 : 0.55,
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. NỘI DUNG MỞ RỘNG CHI TIẾT */}
        <div style={{ padding: '24px' }}>
          
          {/* A. THẺ THÔNG SỐ NHANH (QUICK SPECS) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginBottom: '26px'
          }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <Maximize2 size={20} color="#b45309" style={{ margin: '0 auto 6px', display: 'block' }} />
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Diện tích</div>
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.92rem' }}>{enhanced.area}</div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <User size={20} color="#b45309" style={{ margin: '0 auto 6px', display: 'block' }} />
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Sức chứa</div>
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.92rem' }}>Tối đa {enhanced.capacity} khách</div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <Bed size={20} color="#b45309" style={{ margin: '0 auto 6px', display: 'block' }} />
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Giường ngủ</div>
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>{enhanced.bed}</div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <Compass size={20} color="#b45309" style={{ margin: '0 auto 6px', display: 'block' }} />
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hướng nhìn</div>
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>{enhanced.view}</div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <Building size={20} color="#b45309" style={{ margin: '0 auto 6px', display: 'block' }} />
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Vị trí</div>
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.92rem' }}>Tầng {enhanced.floor}</div>
            </div>
          </div>

          {/* B. MÔ TẢ CHI TIẾT VỀ PHÒNG */}
          <div style={{ marginBottom: '26px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350f', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} />
              <span>Giới Thiệu Không Gian Phòng</span>
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0, textAlign: 'justify' }}>
              {enhanced.description}
            </p>
          </div>

          {/* C. ĐIỂM NỔI BẬT CỦA PHÒNG */}
          {enhanced.highlights && enhanced.highlights.length > 0 && (
            <div style={{ marginBottom: '26px' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
                Đặc Quyền & Điểm Nổi Bật
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {enhanced.highlights.map((h, i) => (
                  <span 
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      color: '#92400e',
                      padding: '6px 14px',
                      borderRadius: '30px',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}
                  >
                    <CheckCircle2 size={15} color="#d97706" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* D. TRANG THIẾT BỊ & TIỆN NGHI CAO CẤP */}
          <div style={{ marginBottom: '26px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350f', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} />
              <span>Tiện Nghi Đầy Đủ Trong Phòng</span>
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              {enhanced.amenities.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.88rem',
                    color: '#334155'
                  }}
                >
                  <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* E. CHÍNH SÁCH LƯU TRÚ & DỊCH VỤ KHÁCH SẠN */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '14px',
            padding: '16px 20px',
            fontSize: '0.86rem',
            color: '#92400e',
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Coffee size={17} />
              <span>Chính sách nhận / trả phòng & Dịch vụ tại {hotelInfo?.name || 'Khách Sạn Bắc Hương'}:</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><b>Giờ nhận phòng:</b> từ {hotelInfo?.checkInTime || '14:00'} • <b>Giờ trả phòng:</b> trước {hotelInfo?.checkOutTime || '12:00'} trưa hôm sau.</li>
              <li>Hỗ trợ nhận phòng sớm nếu khách sạn còn phòng trống sẵn sàng.</li>
              <li>Miễn phí 02 chai nước suối, trà và cà phê đặt tại phòng mỗi ngày.</li>
              <li>Bộ phận Lễ tân phục vụ 24/7 trực tiếp tại sảnh hoặc qua hotline: <b>{hotelInfo?.hotline || '0935.911.889'}</b>.</li>
            </ul>
          </div>
        </div>

        {/* 4. FOOTER THANH HÀNH ĐỘNG CỐ ĐỊNH DƯỚI ĐÁY */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Giá phòng niêm yết</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#92400e' }}>
                {formatVND(enhanced.pricePerNight)}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ đêm</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '11px 20px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: 'white',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Đóng
            </button>

            <button
              disabled={!isAvailable}
              onClick={() => {
                onClose();
                if (onBook) onBook(room);
              }}
              style={{
                padding: '11px 26px',
                borderRadius: '10px',
                border: 'none',
                background: isAvailable ? '#78350f' : '#94a3b8',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                boxShadow: isAvailable ? '0 4px 12px rgba(120, 53, 15, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CalendarCheck size={18} />
              <span>{isAvailable ? 'Đặt Phòng Này Ngay' : 'Phòng Hiện Đang Hết'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
