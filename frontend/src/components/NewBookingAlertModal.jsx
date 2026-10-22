import React, { useState } from 'react';
import { Bell, CheckCircle2, Calendar, Phone, Mail, User, Clock, ArrowRight, X, AlertCircle } from 'lucide-react';

// Âm thanh thông báo đã được tắt theo yêu cầu người dùng
export const playHotelBellChime = () => {
  // No-op: Âm thanh đã tắt
};

export default function NewBookingAlertModal({ 
  booking, 
  onClose, 
  onApprove, 
  onReject,
  onViewBookingsTable 
}) {
  if (!booking) return null;

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('Khách sạn hiện đang kín phòng vào khung giờ này');

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleApproveClick = async () => {
    setIsApproving(true);
    try {
      await onApprove(booking.id);
      onClose();
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectClick = async () => {
    setIsRejecting(true);
    try {
      await onReject(booking.id, rejectReason);
      onClose();
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1300, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '540px',
          padding: '28px 24px',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(180, 83, 9, 0.35)',
          border: '2px solid #f59e0b',
          position: 'relative',
          animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Nút đóng */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Header với Icon Chuông Lễ Tân rung */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(180, 83, 9, 0.4)'
            }}>
              <Bell size={36} />
            </div>
            {/* Ping effect */}
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              right: '-4px',
              bottom: '-4px',
              borderRadius: '50%',
              border: '2px solid #f59e0b',
              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />
          </div>

          <div style={{
            display: 'inline-block',
            background: '#fef3c7',
            color: '#92400e',
            fontWeight: 800,
            fontSize: '0.78rem',
            padding: '3px 12px',
            borderRadius: '20px',
            marginBottom: '8px',
            letterSpacing: '0.5px'
          }}>
            🛎️ THÔNG BÁO LỄ TÂN & ADMIN
          </div>

          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#78350f', margin: '4px 0' }}>
            Có Đơn Đặt Phòng Mới Cần Duyệt!
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
            Khách hàng vừa gửi yêu cầu qua website. Quý khách sạn vui lòng xác nhận đơn để khóa phòng và gửi email cho khách.
          </p>
        </div>

        {/* Khung Chi Tiết Đơn Đặt Phòng */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '14px',
          padding: '16px 18px',
          marginBottom: '20px',
          fontSize: '0.88rem'
        }}>
          {/* Mã đơn & Phòng */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #fef3c7', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>MÃ ĐƠN:</span>
              <strong style={{ marginLeft: '6px', color: '#b45309', background: 'white', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fde68a' }}>
                {booking.bookingCode || `#${booking.id}`}
              </strong>
            </div>
            <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
              Phòng {booking.roomNumber} - {booking.roomName}
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#b45309" />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Khách đặt:</div>
                <strong style={{ color: '#0f172a' }}>{booking.guestName}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#b45309" />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Số điện thoại:</div>
                <strong style={{ color: '#0f172a' }}>{booking.guestPhone}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Mail size={16} color="#b45309" />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Email nhận thông báo của khách:</div>
              <strong style={{ color: '#b45309' }}>{booking.guestEmail}</strong>
            </div>
          </div>

          {/* Lịch trình & Giá tiền */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', paddingTop: '10px', borderTop: '1px solid #fef3c7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#b45309" />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Ngày nhận phòng:</div>
                <strong style={{ color: '#0f172a' }}>{booking.checkInDate || booking.checkIn} ({booking.nights} đêm)</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Tổng tiền thanh toán:</div>
              <strong style={{ color: '#b45309', fontSize: '1.15rem', fontWeight: 800 }}>
                {formatVND(booking.totalPrice)}
              </strong>
            </div>
          </div>

          {/* Ghi chú nếu có */}
          {booking.notes && (
            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #fde68a', fontSize: '0.82rem', color: '#78350f' }}>
              <b>Ghi chú của khách:</b> <i>"{booking.notes}"</i>
            </div>
          )}
        </div>

        {/* Các nút hành động thao tác */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {showRejectForm ? (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.95rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={18} />
                <span>Xác Nhận Từ Chối Đơn Đặt Phòng #{booking.bookingCode}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#7f1d1d', marginBottom: '10px', lineHeight: 1.4 }}>
                Phòng sẽ vẫn ở trạng thái <b>Sẵn sàng (Xanh)</b> và hệ thống sẽ tự động gửi Email thông báo từ chối lịch sự kèm lý do tới khách: <b>{booking.guestEmail}</b>
              </p>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#991b1b', display: 'block', marginBottom: '4px' }}>
                  Lý do từ chối:
                </label>
                <select
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '0.85rem', background: 'white', marginBottom: '6px' }}
                >
                  <option value="Khách sạn hiện đang kín phòng vào khung giờ này">Khách sạn hiện đang kín phòng vào khung giờ này</option>
                  <option value="Hạng phòng đang trong thời gian bảo trì kỹ thuật khẩn cấp">Hạng phòng đang trong thời gian bảo trì kỹ thuật khẩn cấp</option>
                  <option value="Khách hàng đã liên hệ hotline thỏa thuận hủy đơn">Khách hàng đã liên hệ hotline thỏa thuận hủy đơn</option>
                  <option value="Khung ngày đặt không phù hợp với lịch đón tiếp đoàn">Khung ngày đặt không phù hợp với lịch đón tiếp đoàn</option>
                </select>
                <input
                  type="text"
                  placeholder="Hoặc nhập lý do khác..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '0.85rem', background: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Quay Lại
                </button>
                <button
                  type="button"
                  onClick={handleRejectClick}
                  disabled={isRejecting}
                  style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isRejecting ? 'Đang gửi email...' : 'Xác Nhận Từ Chối & Gửi Email Cho Khách'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Nút DUYỆT NGAY */}
              <button
                onClick={handleApproveClick}
                disabled={isApproving}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '13px 20px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <CheckCircle2 size={20} />
                <span>{isApproving ? 'Đang duyệt & Gửi Email...' : 'Duyệt Đặt Phòng Ngay (Khóa phòng & Gửi Email)'}</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowRejectForm(true)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#fff1f2',
                    color: '#e11d48',
                    border: '1px solid #fecdd3',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <X size={15} />
                  <span>Từ Chối Đơn</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onViewBookingsTable) onViewBookingsTable();
                  }}
                  style={{
                    flex: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fde68a',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span>Xem Trong Sổ</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={onClose}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Để Sau
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
