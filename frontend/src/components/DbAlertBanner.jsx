import React from 'react';
import { AlertTriangle, RefreshCw, X, Database } from 'lucide-react';

export default function DbAlertBanner({ isDbConnected, onRetry, isRetrying, isDismissed, onDismiss }) {
  // Nếu đã kết nối Database hoặc người dùng đã bấm tắt banner thì không hiện
  if (isDbConnected || isDismissed) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)',
        borderBottom: '1px solid #fde68a',
        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)',
        padding: '10px 20px',
        position: 'relative',
        zIndex: 40,
        transition: 'all 0.3s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Phần thông báo bên trái */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#fef08a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={18} />
          </div>

          <div style={{ fontSize: '0.88rem', color: '#92400e', lineHeight: 1.4 }}>
            <span
              style={{
                display: 'inline-block',
                background: '#fee2e2',
                color: '#b91c1c',
                fontWeight: 800,
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '6px',
                marginRight: '8px',
                letterSpacing: '0.5px'
              }}
            >
              CHẾ ĐỘ NGOẠI TUYẾN (OFFLINE)
            </span>
            <span style={{ fontWeight: 600 }}>Chưa kết nối được tới Cơ sở dữ liệu MySQL.</span>{' '}
            <span style={{ color: '#78350f' }}>
              Hệ thống đang hiển thị dữ liệu phòng mẫu (Offline Mode). Các thao tác thêm mới sẽ không lưu vào Database.
            </span>
          </div>
        </div>

        {/* Nút hành động bên phải */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1.5px solid #d97706',
              color: '#92400e',
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: isRetrying ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease',
              opacity: isRetrying ? 0.7 : 1
            }}
          >
            <RefreshCw size={14} className={isRetrying ? 'spin-icon' : ''} style={{ animation: isRetrying ? 'spin 1s linear infinite' : 'none' }} />
            {isRetrying ? 'Đang kiểm tra...' : 'Thử kết nối lại'}
          </button>

          <button
            type="button"
            onClick={onDismiss}
            title="Tắt thông báo này"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#92400e',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.7,
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
