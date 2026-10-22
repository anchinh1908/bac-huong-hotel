import React from 'react';
import { AlertOctagon, PhoneCall, RefreshCw, X, ServerOff, MapPin, ShieldAlert } from 'lucide-react';

export default function DbErrorModal({ isOpen, onClose, onRetry, isRetrying, bookingDetails }) {
  if (!isOpen) return null;

  const hotline = '0935 911 889';
  const hotlineClean = '0935911889';

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          borderRadius: '24px',
          padding: '32px 28px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Biểu tượng cảnh báo lớn */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: '#fee2e2',
            border: '3px solid #fecaca',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px auto'
          }}
        >
          <ServerOff size={36} />
        </div>

        {/* Tiêu đề */}
        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
          Không Thể Lưu Đơn Đặt Phòng
        </h3>

        <p style={{ color: '#64748b', fontSize: '0.93rem', lineHeight: 1.5, marginBottom: '20px' }}>
          Máy chủ <b>Cơ sở dữ liệu MySQL</b> hiện đang ngoại tuyến hoặc đang dừng hoạt động. Để đảm bảo thông tin của Quý khách không bị thất lạc, hệ thống tạm ngưng nhận đơn trực tuyến.
        </p>

        {/* Khối thông tin phòng định đặt (nếu có) */}
        {bookingDetails && (
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              textAlign: 'left',
              fontSize: '0.88rem'
            }}
          >
            <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
              🏨 Phòng bạn chọn: {bookingDetails.roomNumber} - {bookingDetails.roomName}
            </div>
            <div style={{ color: '#64748b' }}>
              Khách hàng: <b>{bookingDetails.guestName || 'Quý khách'}</b> | Số đêm: <b>{bookingDetails.nights || 1} đêm</b>
            </div>
          </div>
        )}

        {/* Khối Hotline Lễ Tân Nổi Bật */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '2px dashed #f59e0b',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#92400e', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>
            <PhoneCall size={20} className="phone-pulse" />
            <span>Liên Hệ Hotline Lễ Tân Để Giữ Phòng Ngay</span>
          </div>
          
          <a
            href={`tel:${hotlineClean}`}
            style={{
              display: 'inline-block',
              fontSize: '1.75rem',
              fontWeight: 900,
              color: '#b45309',
              textDecoration: 'none',
              letterSpacing: '1px',
              margin: '6px 0',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {hotline}
          </a>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#78350f', fontSize: '0.82rem', marginTop: '6px' }}>
            <MapPin size={14} />
            <span>Khách Sạn Bắc Hương - 196 Trần Hưng Đạo, TP. Kon Tum</span>
          </div>
        </div>

        {/* Hướng dẫn dành cho Admin / Demo */}
        <div
          style={{
            background: '#f1f5f9',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.8rem',
            color: '#475569',
            textAlign: 'left',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}
        >
          <ShieldAlert size={16} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
          <span>
            <b>Lưu ý kỹ thuật:</b> Vui lòng kiểm tra dịch vụ <code>MYSQL80</code> trên máy và đảm bảo Backend Spring Boot đang chạy ở cổng <code>8080</code> để lưu đơn vào MySQL.
          </span>
        </div>

        {/* Các nút hành động */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={`tel:${hotlineClean}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#b45309',
              color: '#ffffff',
              padding: '12px 22px',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '0.92rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(180, 83, 9, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            <PhoneCall size={16} />
            Gọi Giữ Phòng Ngay
          </a>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                color: '#334155',
                padding: '12px 20px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: isRetrying ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={16} style={{ animation: isRetrying ? 'spin 1s linear infinite' : 'none' }} />
              {isRetrying ? 'Đang thử lại...' : 'Thử kết nối lại DB'}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#e2e8f0',
              border: 'none',
              color: '#475569',
              padding: '12px 20px',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .phone-pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
