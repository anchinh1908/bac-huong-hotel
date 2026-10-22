import React, { useState, useEffect } from 'react';
import { CalendarCheck, Calendar, Mail, Phone, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminBookingsTable({ bookings, onApproveBooking, onRejectBooking, onCancelBooking }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'PENDING', 'CONFIRMED', 'REJECTED'
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset về trang 1 mỗi khi đổi từ khóa tìm kiếm hoặc tab trạng thái
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Định dạng ngày theo chuẩn Việt Nam DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const clean = dateStr.split('T')[0];
      const parts = clean.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const counts = {
    all: (bookings || []).length,
    pending: (bookings || []).filter(b => b.status === 'PENDING').length,
    confirmed: (bookings || []).filter(b => b.status === 'CONFIRMED').length,
    rejected: (bookings || []).filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED').length,
  };

  // 1. Lọc theo từ khóa & Trạng thái
  const filteredBookings = (bookings || []).filter(b => {
    if (statusFilter === 'PENDING' && b.status !== 'PENDING') return false;
    if (statusFilter === 'CONFIRMED' && b.status !== 'CONFIRMED') return false;
    if (statusFilter === 'REJECTED' && b.status !== 'REJECTED' && b.status !== 'CANCELLED') return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    const checkInStr = formatDate(b.checkInDate || b.checkIn);
    const checkOutStr = formatDate(b.checkOutDate);
    return (
      (b.bookingCode && b.bookingCode.toLowerCase().includes(q)) ||
      (b.guestName && b.guestName.toLowerCase().includes(q)) ||
      (b.guestPhone && b.guestPhone.includes(q)) ||
      (b.guestEmail && b.guestEmail.toLowerCase().includes(q)) ||
      (b.roomNumber && b.roomNumber.toLowerCase().includes(q)) ||
      checkInStr.includes(q) ||
      checkOutStr.includes(q)
    );
  });

  // 2. SẮP XẾP DỮ LIỆU MỚI NHẤT LÊN ĐẦU (ID giảm dần)
  const sortedBookings = [...filteredBookings].sort((a, b) => (b.id || 0) - (a.id || 0));

  // 3. PHÂN TRANG: 10 DỮ LIỆU / 1 TRANG
  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = sortedBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container" style={{ marginBottom: '60px' }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px 28px', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)' 
      }}>
        
        {/* TIÊU ĐỀ & THANH TÌM KIẾM */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#78350f', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarCheck size={20} />
              </div>
              <span>Sổ Đặt Phòng Khách Sạn Bắc Hương</span>
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
              Dữ liệu được tự động sắp xếp <b>mới nhất lên trên</b> • Hiển thị 10 đơn mỗi trang.
            </p>
          </div>

          {/* Ô tìm kiếm tra cứu nhanh */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            border: '1px solid #cbd5e1', 
            borderRadius: '10px', 
            padding: '9px 14px', 
            background: '#f8fafc', 
            width: '340px', 
            maxWidth: '100%',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}>
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, mã đơn, ngày..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.88rem' }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* CÁC TAB LỌC TRẠNG THÁI NHANH */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setStatusFilter('ALL')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: statusFilter === 'ALL' ? '1px solid #78350f' : '1px solid #e2e8f0',
              background: statusFilter === 'ALL' ? '#78350f' : '#f8fafc',
              color: statusFilter === 'ALL' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Tất cả đơn</span>
            <span style={{ 
              padding: '1px 7px', 
              borderRadius: '20px', 
              fontSize: '0.74rem', 
              background: statusFilter === 'ALL' ? 'rgba(255,255,255,0.25)' : '#e2e8f0', 
              color: statusFilter === 'ALL' ? 'white' : '#334155' 
            }}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('PENDING')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: statusFilter === 'PENDING' ? '1px solid #d97706' : '1px solid #e2e8f0',
              background: statusFilter === 'PENDING' ? '#fef3c7' : '#f8fafc',
              color: statusFilter === 'PENDING' ? '#92400e' : '#475569',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⏳ Chờ duyệt</span>
            <span style={{ 
              padding: '1px 7px', 
              borderRadius: '20px', 
              fontSize: '0.74rem', 
              background: '#fde68a', 
              color: '#92400e' 
            }}>
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: statusFilter === 'CONFIRMED' ? '1px solid #16a34a' : '1px solid #e2e8f0',
              background: statusFilter === 'CONFIRMED' ? '#dcfce7' : '#f8fafc',
              color: statusFilter === 'CONFIRMED' ? '#15803d' : '#475569',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>✓ Đã xác nhận</span>
            <span style={{ 
              padding: '1px 7px', 
              borderRadius: '20px', 
              fontSize: '0.74rem', 
              background: '#bbf7d0', 
              color: '#15803d' 
            }}>
              {counts.confirmed}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('REJECTED')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: statusFilter === 'REJECTED' ? '1px solid #dc2626' : '1px solid #e2e8f0',
              background: statusFilter === 'REJECTED' ? '#fee2e2' : '#f8fafc',
              color: statusFilter === 'REJECTED' ? '#b91c1c' : '#475569',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>✕ Đã từ chối / Hủy</span>
            <span style={{ 
              padding: '1px 7px', 
              borderRadius: '20px', 
              fontSize: '0.74rem', 
              background: '#fecaca', 
              color: '#b91c1c' 
            }}>
              {counts.rejected}
            </span>
          </button>
        </div>

        {/* BẢNG DỮ LIỆU ĐƯỢC THIẾT KẾ ĐỒNG BỘ */}
        {sortedBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
            <CalendarCheck size={40} color="#cbd5e1" style={{ margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {searchTerm ? 'Không tìm thấy đơn đặt phòng nào khớp!' : 'Không có đơn đặt phòng nào trong mục này.'}
            </div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ 
                    background: '#f8fafc', 
                    borderBottom: '1px solid #e2e8f0', 
                    color: '#475569',
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Mã Đơn</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Phòng</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Khách Hàng</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Ngày Nhận Phòng</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Lưu Trú / Trả Phòng</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Tổng Tiền</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Trạng Thái</th>
                    <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800, textAlign: 'center' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((b) => {
                    const checkInFormatted = formatDate(b.checkInDate || b.checkIn);
                    const checkOutFormatted = formatDate(b.checkOutDate);

                    return (
                      <tr 
                        key={b.id} 
                        style={{ 
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                      >
                        {/* 1. MÃ ĐƠN */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            fontWeight: 800, 
                            color: '#78350f', 
                            background: '#fef3c7', 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            fontSize: '0.84rem',
                            border: '1px solid #fde68a'
                          }}>
                            {b.bookingCode || (`BH-${b.id}`)}
                          </span>
                        </td>

                        {/* 2. PHÒNG */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              fontWeight: 800, 
                              color: '#1e293b', 
                              background: '#f1f5f9', 
                              padding: '3px 8px', 
                              borderRadius: '5px',
                              fontSize: '0.85rem'
                            }}>
                              {b.roomNumber}
                            </span>
                            <span style={{ color: '#475569', fontSize: '0.84rem' }}>{b.roomName}</span>
                          </div>
                        </td>

                        {/* 3. THÔNG TIN KHÁCH */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{b.guestName}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.78rem', color: '#64748b' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={12} color="#0284c7" />
                              <b>{b.guestPhone}</b>
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={12} color="#b45309" />
                              {b.guestEmail}
                            </span>
                          </div>
                        </td>

                        {/* 4. CỘT: NGÀY NHẬN PHÒNG (CHỈ HIỂN THỊ NGÀY) */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            color: '#0f172a', 
                            fontWeight: 700, 
                            fontSize: '0.9rem'
                          }}>
                            <Calendar size={15} color="#b45309" />
                            <span>{checkInFormatted}</span>
                          </div>
                        </td>

                        {/* 5. LƯU TRÚ & TRẢ PHÒNG (CHỈ HIỂN THỊ NGÀY) */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ 
                              padding: '2px 7px', 
                              borderRadius: '4px', 
                              background: '#f1f5f9', 
                              color: '#334155', 
                              fontWeight: 700, 
                              fontSize: '0.78rem' 
                            }}>
                              {b.nights} đêm
                            </span>
                            <span style={{ color: '#64748b', fontSize: '0.82rem' }}>
                              Trả phòng: <b>{checkOutFormatted}</b>
                            </span>
                          </div>
                        </td>

                        {/* 6. TỔNG TIỀN */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800, color: '#92400e', fontSize: '0.92rem' }}>
                          {formatCurrency(b.totalPrice)}
                        </td>

                        {/* 7. TRẠNG THÁI */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <span 
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '50px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              background: b.status === 'CONFIRMED' ? '#dcfce7' : (b.status === 'PENDING' ? '#fef3c7' : (b.status === 'REJECTED' ? '#fee2e2' : '#f1f5f9')),
                              color: b.status === 'CONFIRMED' ? '#15803d' : (b.status === 'PENDING' ? '#b45309' : (b.status === 'REJECTED' ? '#b91c1c' : '#64748b')),
                              border: b.status === 'CONFIRMED' ? '1px solid #bbf7d0' : (b.status === 'PENDING' ? '1px solid #fde68a' : (b.status === 'REJECTED' ? '1px solid #fecaca' : '1px solid #e2e8f0'))
                            }}
                          >
                            <span style={{ 
                              width: '6px', 
                              height: '6px', 
                              borderRadius: '50%', 
                              background: b.status === 'CONFIRMED' ? '#16a34a' : (b.status === 'PENDING' ? '#d97706' : (b.status === 'REJECTED' ? '#dc2626' : '#94a3b8')) 
                            }} />
                            {b.status === 'CONFIRMED' ? 'Đã xác nhận' : (b.status === 'PENDING' ? 'Chờ duyệt' : (b.status === 'REJECTED' ? 'Đã từ chối' : 'Đã hủy'))}
                          </span>
                        </td>

                        {/* 8. THAO TÁC */}
                        <td style={{ padding: '14px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            {b.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => onApproveBooking(b.id)}
                                  style={{ 
                                    background: '#16a34a', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '5px 12px', 
                                    borderRadius: '6px', 
                                    fontSize: '0.78rem', 
                                    fontWeight: 700, 
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 3px rgba(22, 163, 74, 0.3)'
                                  }}
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = window.prompt("Nhập lý do từ chối gửi email cho khách:", "Khách sạn hiện đang kín phòng vào ngày này");
                                    if (reason !== null) {
                                      onRejectBooking(b.id, reason);
                                    }
                                  }}
                                  style={{ 
                                    background: '#fff1f2', 
                                    color: '#e11d48', 
                                    border: '1px solid #fecdd3', 
                                    padding: '5px 10px', 
                                    borderRadius: '6px', 
                                    fontSize: '0.78rem', 
                                    fontWeight: 600, 
                                    cursor: 'pointer' 
                                  }}
                                >
                                  Từ chối
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => onCancelBooking(b.id)}
                              style={{ 
                                background: '#f8fafc', 
                                color: '#64748b', 
                                border: '1px solid #e2e8f0', 
                                padding: '5px 11px', 
                                borderRadius: '6px', 
                                fontSize: '0.78rem', 
                                fontWeight: 600, 
                                cursor: 'pointer' 
                              }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* THANH PHÂN TRANG (PAGINATION) - 10 ĐƠN / TRANG */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginTop: '18px', 
              paddingTop: '16px', 
              borderTop: '1px solid #f1f5f9', 
              flexWrap: 'wrap', 
              gap: '12px' 
            }}>
              <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                Hiển thị <b>{startIndex + 1}</b> - <b>{Math.min(startIndex + ITEMS_PER_PAGE, sortedBookings.length)}</b> trên tổng số <b>{sortedBookings.length}</b> đơn • <i>(Trang {currentPage}/{totalPages})</i>
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid #cbd5e1', 
                      background: currentPage === 1 ? '#f8fafc' : 'white', 
                      color: currentPage === 1 ? '#94a3b8' : '#334155', 
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    <ChevronLeft size={15} />
                    <span>Trước</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: currentPage === page ? '1px solid #78350f' : '1px solid #cbd5e1',
                        background: currentPage === page ? '#78350f' : 'white',
                        color: currentPage === page ? 'white' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer'
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid #cbd5e1', 
                      background: currentPage === totalPages ? '#f8fafc' : 'white', 
                      color: currentPage === totalPages ? '#94a3b8' : '#334155', 
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    <span>Sau</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
