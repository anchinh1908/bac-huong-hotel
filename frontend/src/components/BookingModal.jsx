import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, User, Calendar, ShieldCheck, CheckCircle2, LogIn } from 'lucide-react';

export default function BookingModal({ room, onClose, onSubmitBooking, currentUser, onOpenAuth }) {
  if (!room) return null;

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [nights, setNights] = useState(2);
  const [checkIn, setCheckIn] = useState('2026-10-21');
  const [notes, setNotes] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Regex kiểm tra số điện thoại Việt Nam (10 chữ số, đầu số 03, 05, 07, 08, 09 hoặc +84)
  const validatePhone = (val) => {
    const cleaned = (val || '').replace(/[\s.-]/g, '');
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    return phoneRegex.test(cleaned);
  };

  // Regex kiểm tra email chuẩn
  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test((val || '').trim());
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setGuestPhone(val);
    if (!val) {
      setPhoneError('Vui lòng nhập số điện thoại liên hệ');
    } else if (!validatePhone(val)) {
      setPhoneError('Số điện thoại không hợp lệ (Gồm 10 chữ số, ví dụ: 0912345678)');
    } else {
      setPhoneError('');
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setGuestEmail(val);
    if (!val) {
      setEmailError('Vui lòng nhập email nhận hóa đơn xác nhận');
    } else if (!validateEmail(val)) {
      setEmailError('Email không đúng định dạng (Ví dụ: vidu@gmail.com)');
    } else {
      setEmailError('');
    }
  };

  // Tự động điền thông tin nếu khách đã đăng nhập
  useEffect(() => {
    if (currentUser) {
      setGuestName(currentUser.fullName || '');
      setGuestEmail(currentUser.email || '');
      if (currentUser.phone) setGuestPhone(currentUser.phone);
    }
  }, [currentUser]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const totalPrice = room.pricePerNight * nights;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    let hasError = false;
    if (!validatePhone(guestPhone)) {
      setPhoneError('Số điện thoại không hợp lệ (Gồm 10 chữ số, ví dụ: 0912345678)');
      hasError = true;
    }
    if (!validateEmail(guestEmail)) {
      setEmailError('Email không đúng định dạng (Ví dụ: vidu@gmail.com)');
      hasError = true;
    }
    if (hasError || !guestName) {
      return;
    }

    const bookingData = {
      bookingCode: `BH-${Math.floor(1000 + Math.random() * 9000)}`,
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomName: room.name,
      guestName,
      guestPhone,
      guestEmail,
      checkIn,
      checkInDate: checkIn,
      nights,
      totalPrice,
      notes
    };

    onSubmitBooking(bookingData);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#78350f', marginBottom: '6px' }}>
          Đặt Phòng Khách Sạn Bắc Hương
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '18px' }}>
          Đang chọn: <b>{room.roomNumber} - {room.name}</b> ({formatCurrency(room.pricePerNight)} / đêm)
        </p>

        {/* THÔNG BÁO XÁC THỰC TÀI KHOẢN (AUTHENTICATION) */}
        {!currentUser ? (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ color: '#92400e', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
              🔒 Yêu Cầu Đăng Nhập Để Đặt Phòng
            </div>
            <p style={{ color: '#78350f', fontSize: '0.85rem', marginBottom: '14px' }}>
              Để bảo mật đơn đặt phòng và tự động gửi hóa đơn xác nhận đến bạn, vui lòng đăng nhập:
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={onOpenAuth}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'white',
                  border: '1px solid #cbd5e1',
                  padding: '9px 18px',
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: '#1e293b',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Đăng nhập Google (1-Click)</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
              Đang đặt phòng với tư cách: <b>{currentUser.fullName}</b> ({currentUser.email})
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Thông tin khách hàng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Họ và tên của bạn *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px' }}>
                <User size={16} color="#64748b" />
                <input 
                  type="text" 
                  required
                  placeholder="Nguyễn Văn A"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.92rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Số điện thoại liên hệ *
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                border: phoneError ? '1.5px solid #dc2626' : (guestPhone && validatePhone(guestPhone) ? '1.5px solid #16a34a' : '1px solid #cbd5e1'), 
                borderRadius: '8px', 
                padding: '10px 12px',
                background: phoneError ? '#fef2f2' : 'white',
                transition: 'all 0.2s'
              }}>
                <Phone size={16} color={phoneError ? "#dc2626" : "#64748b"} />
                <input 
                  type="tel" 
                  required
                  placeholder="0912345678"
                  value={guestPhone}
                  onChange={handlePhoneChange}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.92rem', background: 'transparent' }}
                />
              </div>
              {phoneError && (
                <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 500 }}>
                  ⚠️ {phoneError}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Email nhận hóa đơn xác nhận * (Hệ thống sẽ gửi email tự động)
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: emailError ? '1.5px solid #dc2626' : (guestEmail && validateEmail(guestEmail) ? '1.5px solid #16a34a' : '1px solid #cbd5e1'), 
              borderRadius: '8px', 
              padding: '10px 12px',
              background: emailError ? '#fef2f2' : 'white',
              transition: 'all 0.2s'
            }}>
              <Mail size={16} color={emailError ? "#dc2626" : "#b45309"} />
              <input 
                type="email" 
                required
                placeholder="vidu@gmail.com"
                value={guestEmail}
                onChange={handleEmailChange}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.92rem', background: 'transparent' }}
              />
            </div>
            {emailError && (
              <div style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 500 }}>
                ⚠️ {emailError}
              </div>
            )}
          </div>

          {/* Ngày đến & Số đêm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Ngày nhận phòng
              </label>
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', outline: 'none', fontSize: '0.92rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Số đêm lưu trú
              </label>
              <select 
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', outline: 'none', fontSize: '0.92rem', background: 'white' }}
              >
                <option value={1}>1 đêm</option>
                <option value={2}>2 đêm</option>
                <option value={3}>3 đêm</option>
                <option value={5}>5 đêm</option>
                <option value={7}>1 tuần (7 đêm)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Yêu cầu đặc biệt (nếu có)
            </label>
            <textarea 
              rows="2"
              placeholder="Ví dụ: Cần nhận phòng lúc 12h, tầng cao yên tĩnh..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', outline: 'none', fontSize: '0.9rem', resize: 'none' }}
            />
          </div>

          {/* Bảng tổng tiền & Nút xác nhận */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#92400e' }}>Tổng tiền ({nights} đêm)</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#78350f' }}>
                {formatCurrency(totalPrice)}
              </div>
            </div>

            <button 
              type="submit"
              className="btn-book-now"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              {currentUser ? 'Xác Nhận Đặt Phòng' : 'Đăng Nhập & Đặt Phòng'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>Thông báo đặt phòng và mã xác nhận sẽ được gửi đồng thời đến Email của bạn và Lễ tân khách sạn.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
