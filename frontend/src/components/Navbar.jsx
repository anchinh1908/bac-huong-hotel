import React from 'react';
import { Building, ShieldCheck, User, CalendarCheck, LogIn, LogOut, KeyRound, Heart } from 'lucide-react';
import { HOTEL_INFO } from '../data/bacHuongData';

export default function Navbar({ 
  currentUser, 
  onOpenAuth, 
  onLogoutUser, 
  onOpenChangePassword,
  bookingsCount, 
  onOpenBookings,
  savedRoomsCount = 0,
  onOpenSavedRooms,
  onGoToAdminDashboard,
  hotelInfo
}) {
  const isAdminOrStaff = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF');
  const info = hotelInfo || HOTEL_INFO;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo Khách sạn Bắc Hương */}
        <div className="brand-box">
          <div className="brand-icon-bh">
            <Building size={24} />
          </div>
          <div>
            <div className="brand-name-bh">{info.name}</div>
            <div className="brand-sub">{info.address}</div>
          </div>
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Nút xem danh sách phòng đã lưu / yêu thích */}
          <button 
            onClick={onOpenSavedRooms}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#be123c',
              padding: '7px 14px',
              borderRadius: '50px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            title="Xem danh sách các phòng bạn đã bấm lưu yêu thích"
          >
            <Heart size={15} color="#e11d48" fill={savedRoomsCount > 0 ? "#e11d48" : "none"} />
            <span>Phòng đã lưu ({savedRoomsCount})</span>
          </button>

          {/* Nút xem phòng đã đặt: CHỈ HIỂN THỊ KHI KHÁCH ĐÃ ĐĂNG NHẬP */}
          {currentUser && (
            <button 
              onClick={onOpenBookings}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                color: '#92400e',
                padding: '7px 14px',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <CalendarCheck size={15} />
              <span>Phòng đã đặt ({bookingsCount})</span>
            </button>
          )}

          {/* Trạng thái tài khoản người dùng */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 10px 4px 6px', borderRadius: '50px' }}>
              {/* Hình đại diện trống trung tính (không dùng hình người lạ) */}
              <div 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: '#e2e8f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#64748b',
                  border: '1px solid #cbd5e1'
                }}
                title="Tài khoản của bạn"
              >
                <User size={15} />
              </div>

              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                {currentUser.fullName || currentUser.username || currentUser.email}
              </span>

              {/* Huy hiệu nếu là Admin/Lễ tân */}
              {isAdminOrStaff && (
                <button
                  onClick={onGoToAdminDashboard}
                  title="Chuyển đến Trang Quản Trị"
                  style={{
                    background: '#78350f',
                    color: '#fef3c7',
                    border: 'none',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Quản Trị
                </button>
              )}

              <button
                onClick={onOpenChangePassword}
                title="Đổi mật khẩu tài khoản"
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
              >
                <KeyRound size={14} />
              </button>
              <button
                onClick={onLogoutUser}
                title="Đăng xuất"
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#78350f',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(120, 53, 15, 0.2)'
              }}
            >
              <LogIn size={15} color="#fde68a" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
