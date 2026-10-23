import React, { useState } from 'react';
import { Bed, User, Layers, Filter, CheckCircle2, AlertCircle, RefreshCw, Key, LogOut, Check, Sparkles, List, LayoutGrid, X, Plus, Minus, Calendar, Clock } from 'lucide-react';

export default function AdminRoomGrid({ rooms, onUpdateRoomStatus }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' hoặc 'TABLE'
  
  // Modal cập nhật chi tiết phòng đang chọn
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInGuestName, setCheckInGuestName] = useState('');
  const [checkInPhone, setCheckInPhone] = useState('');
  const [checkInNights, setCheckInNights] = useState(1);

  // Modal giao phòng nhanh
  const [isQuickAssignOpen, setIsQuickAssignOpen] = useState(false);
  const [assignRoomId, setAssignRoomId] = useState('');
  const [assignGuestName, setAssignGuestName] = useState('');
  const [assignPhone, setAssignPhone] = useState('');
  const [assignNights, setAssignNights] = useState(1);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm tính toán ngày dự kiến trả phòng theo thời gian thực (DD/MM/YYYY)
  const calculateCheckOutDate = (nights) => {
    const d = new Date();
    d.setDate(d.getDate() + Math.max(1, Number(nights) || 1));
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Hàm lấy ngày hiện tại định dạng DD/MM/YYYY
  const getTodayFormatted = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const countAvailable = rooms.filter(r => r.status === 'AVAILABLE').length;
  const countOccupied = rooms.filter(r => r.status === 'OCCUPIED').length;
  const countCleaning = rooms.filter(r => r.status === 'CLEANING').length;

  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE');

  // Lọc phòng theo trạng thái
  const filteredRooms = rooms.filter(room => {
    if (filterStatus === 'ALL') return true;
    return room.status === filterStatus;
  });

  const floors = [1, 2, 3];

  // Xử lý mở modal chi tiết phòng
  const handleOpenRoomAction = (room) => {
    setSelectedRoom(room);
    setCheckInGuestName('');
    setCheckInPhone('');
    setCheckInNights(1);
  };

  // 1. Giao phòng cho khách (Check-in)
  const handleCheckInSubmit = (e) => {
    e.preventDefault();
    if (!checkInGuestName.trim()) return;

    const calculatedCheckOut = calculateCheckOutDate(checkInNights);
    onUpdateRoomStatus(selectedRoom.id, 'OCCUPIED', checkInGuestName.trim(), calculatedCheckOut);
    setSelectedRoom(null);
  };

  // 2. Khách trả phòng (Check-out sang Dọn dẹp)
  const handleCheckOutToCleaning = (roomId) => {
    onUpdateRoomStatus(roomId, 'CLEANING');
    setSelectedRoom(null);
  };

  // 3. Khách trả phòng xong trực tiếp sang Trống
  const handleCheckOutToAvailable = (roomId) => {
    onUpdateRoomStatus(roomId, 'AVAILABLE');
    setSelectedRoom(null);
  };

  // 4. Hoàn tất dọn dẹp sang Trống
  const handleCleaningDone = (roomId) => {
    onUpdateRoomStatus(roomId, 'AVAILABLE');
    setSelectedRoom(null);
  };

  // 5. Giao phòng nhanh từ nút tổng
  const handleQuickAssignSubmit = (e) => {
    e.preventDefault();
    const targetRoomId = assignRoomId || (availableRooms[0] ? availableRooms[0].id : null);
    if (!targetRoomId || !assignGuestName.trim()) return;

    const calculatedCheckOut = calculateCheckOutDate(assignNights);
    onUpdateRoomStatus(Number(targetRoomId), 'OCCUPIED', assignGuestName.trim(), calculatedCheckOut);
    setIsQuickAssignOpen(false);
    setAssignRoomId('');
    setAssignGuestName('');
    setAssignPhone('');
    setAssignNights(1);
  };

  return (
    <div className="admin-section">
      <div className="container">
        {/* Khung điều khiển & Thống kê trên cùng */}
        <div className="admin-header-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#78350f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={22} color="#b45309" />
                <span>Sơ Đồ Quản Lý & Cập Nhật Trạng Thái Phòng</span>
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                Danh sách phòng hiện tại: Quản lý và Lễ tân theo dõi trạng thái, giao phòng cho khách đến quầy hoặc xử lý trả phòng.
              </p>
            </div>

            {/* Nút hành động nhanh: Giao phòng trực tiếp */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (availableRooms.length === 0) {
                    alert("Hiện tại không có phòng nào đang trống!");
                    return;
                  }
                  setAssignRoomId(availableRooms[0]?.id || '');
                  setIsQuickAssignOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#15803d',
                  color: 'white',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
                }}
              >
                <Key size={16} />
                <span>🔑 Giao Phòng Cho Khách Đến Quầy</span>
              </button>

              {/* Nút đổi dạng xem: Ma trận lưới vs Bảng danh sách */}
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px', border: '1px solid #cbd5e1' }}>
                <button
                  onClick={() => setViewMode('GRID')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: viewMode === 'GRID' ? 'white' : 'transparent',
                    color: viewMode === 'GRID' ? '#78350f' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: viewMode === 'GRID' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <LayoutGrid size={14} />
                  <span>Sơ đồ</span>
                </button>
                <button
                  onClick={() => setViewMode('TABLE')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: viewMode === 'TABLE' ? 'white' : 'transparent',
                    color: viewMode === 'TABLE' ? '#78350f' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: viewMode === 'TABLE' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <List size={14} />
                  <span>Bảng danh sách</span>
                </button>
              </div>
            </div>
          </div>

          {/* Các nút bấm lọc trạng thái */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            <button 
              onClick={() => setFilterStatus('ALL')}
              style={{
                padding: '6px 14px',
                borderRadius: '50px',
                border: '1px solid #cbd5e1',
                background: filterStatus === 'ALL' ? '#78350f' : 'white',
                color: filterStatus === 'ALL' ? 'white' : '#475569',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Tất cả ({rooms.length})
            </button>

            <button 
              onClick={() => setFilterStatus('AVAILABLE')}
              style={{
                padding: '6px 14px',
                borderRadius: '50px',
                border: '1px solid #86efac',
                background: filterStatus === 'AVAILABLE' ? '#16a34a' : '#dcfce7',
                color: filterStatus === 'AVAILABLE' ? 'white' : '#15803d',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              🟢 Phòng Trống ({countAvailable})
            </button>

            <button 
              onClick={() => setFilterStatus('OCCUPIED')}
              style={{
                padding: '6px 14px',
                borderRadius: '50px',
                border: '1px solid #fca5a5',
                background: filterStatus === 'OCCUPIED' ? '#dc2626' : '#fee2e2',
                color: filterStatus === 'OCCUPIED' ? 'white' : '#b91c1c',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              🔴 Đang Có Khách ({countOccupied})
            </button>

            <button 
              onClick={() => setFilterStatus('CLEANING')}
              style={{
                padding: '6px 14px',
                borderRadius: '50px',
                border: '1px solid #fcd34d',
                background: filterStatus === 'CLEANING' ? '#d97706' : '#fef3c7',
                color: filterStatus === 'CLEANING' ? 'white' : '#b45309',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              🟡 Đang Dọn Dẹp ({countCleaning})
            </button>
          </div>

          {/* Dòng chú thích ý nghĩa màu sắc (Chỉ 1 chấm tròn màu duy nhất) */}
          <div className="legend-row" style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Quy ước:</span>
            <div className="legend-item"><div className="legend-dot green"></div><span>Xanh = Phòng Trống (Giao khách được ngay)</span></div>
            <div className="legend-item"><div className="legend-dot red"></div><span>Đỏ = Đang có khách ở</span></div>
            <div className="legend-item"><div className="legend-dot yellow"></div><span>Vàng = Đang dọn dẹp</span></div>
          </div>
        </div>

        {/* ================= CHẾ ĐỘ 1: SƠ ĐỒ MA TRẬN LƯỚI ================= */}
        {viewMode === 'GRID' ? (
          <div>
            {floors.map(floor => {
              const roomsOnFloor = filteredRooms.filter(r => r.floor === floor);
              if (roomsOnFloor.length === 0) return null;

              return (
                <div key={floor} className="floor-group">
                  <div className="floor-title">
                    <span>🏢 Tầng {floor}</span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>
                      ({roomsOnFloor.length} phòng)
                    </span>
                  </div>

                  <div className="room-grid-matrix">
                    {roomsOnFloor.map(room => (
                      <div 
                        key={room.id}
                        className={`matrix-room-card ${room.status}`}
                        onClick={() => handleOpenRoomAction(room)}
                        style={{ cursor: 'pointer' }}
                        title="Bấm vào để Cập nhật trạng thái / Giao phòng / Trả phòng"
                      >
                        <div className="room-num-badge">
                          <span>{room.roomNumber}</span>
                          <span className="status-pill">
                            {room.status === 'AVAILABLE' && '🟢 TRỐNG'}
                            {room.status === 'OCCUPIED' && '🔴 CÓ KHÁCH'}
                            {room.status === 'CLEANING' && '🟡 DỌN DẸP'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '4px' }}>
                          {room.name}
                        </div>

                        <div style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                          Giá: <b>{formatCurrency(room.pricePerNight)}</b>/đêm
                        </div>

                        {/* Hiển thị thông tin khách nếu phòng đang bận */}
                        {room.status === 'OCCUPIED' && (
                          <div style={{ 
                            background: 'rgba(255, 255, 255, 0.95)', 
                            padding: '8px 10px', 
                            borderRadius: '8px', 
                            fontSize: '0.8rem', 
                            marginTop: '6px',
                            border: '1px solid #fecaca',
                            boxShadow: '0 1px 3px rgba(185, 28, 28, 0.08)'
                          }}>
                            <div style={{ color: '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                              <span>👤 Khách:</span>
                              <span style={{ color: '#7f1d1d' }}>{room.currentGuest || 'Khách trực tiếp'}</span>
                            </div>
                            <div style={{ color: '#b91c1c', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>📅 Dự kiến trả:</span>
                              <span style={{ fontWeight: 700, background: '#fee2e2', color: '#991b1b', padding: '1px 6px', borderRadius: '4px' }}>
                                {room.checkOut || 'Chưa định ngày'}
                              </span>
                            </div>
                          </div>
                        )}

                        {room.status === 'CLEANING' && (
                          <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', marginTop: '6px' }}>
                            🧹 Đang vệ sinh phòng
                          </div>
                        )}

                        {room.status === 'AVAILABLE' && (
                          <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', marginTop: '6px', color: '#15803d', fontWeight: 600 }}>
                            ✨ Sẵn sàng đón khách mới
                          </div>
                        )}

                        {/* Nút bấm gợi ý */}
                        <div style={{ textAlign: 'right', marginTop: '10px', fontSize: '0.78rem', fontWeight: 600, color: '#78350f' }}>
                          👉 Bấm để giao / trả phòng
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= CHẾ ĐỘ 2: BẢNG DANH SÁCH CHI TIẾT TRẠNG THÁI ================= */
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Phòng</th>
                  <th style={{ padding: '12px 16px' }}>Hạng Phòng</th>
                  <th style={{ padding: '12px 16px' }}>Tầng</th>
                  <th style={{ padding: '12px 16px' }}>Giá / Đêm</th>
                  <th style={{ padding: '12px 16px' }}>Trạng Thái Hiện Tại</th>
                  <th style={{ padding: '12px 16px' }}>Khách Đang Ở & Ngày Trả</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Thao Tác Cập Nhật</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map(room => (
                  <tr key={room.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#78350f' }}>
                      {room.roomNumber}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>
                      {room.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      Tầng {room.floor}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#b45309' }}>
                      {formatCurrency(room.pricePerNight)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span 
                        style={{
                          padding: '4px 10px',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: room.status === 'AVAILABLE' ? '#dcfce7' : (room.status === 'OCCUPIED' ? '#fee2e2' : '#fef3c7'),
                          color: room.status === 'AVAILABLE' ? '#15803d' : (room.status === 'OCCUPIED' ? '#b91c1c' : '#b45309')
                        }}
                      >
                        {room.status === 'AVAILABLE' && '🟢 TRỐNG'}
                        {room.status === 'OCCUPIED' && '🔴 CÓ KHÁCH'}
                        {room.status === 'CLEANING' && '🟡 DỌN DẸP'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {room.status === 'OCCUPIED' ? (
                        <div>
                          <div style={{ fontWeight: 700, color: '#991b1b' }}>👤 {room.currentGuest || 'Khách tại quầy'}</div>
                          <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '2px', fontWeight: 600 }}>
                            📅 Dự kiến trả: {room.checkOut || 'Chưa định ngày'}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleOpenRoomAction(room)}
                        style={{
                          background: '#78350f',
                          color: 'white',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= MODAL CẬP NHẬT TRẠNG THÁI / GIAO PHÒNG / TRẢ PHÒNG ================= */}
        {selectedRoom && (
          <div className="modal-overlay" onClick={() => setSelectedRoom(null)} style={{ zIndex: 1200 }}>
            <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedRoom(null)}>
                <X size={18} />
              </button>

              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '4px' }}>
                  Phòng {selectedRoom.roomNumber} • Tầng {selectedRoom.floor}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#78350f', marginTop: '6px', marginBottom: '4px' }}>
                  {selectedRoom.name}
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                  Trạng thái hiện tại:{' '}
                  <strong>
                    {selectedRoom.status === 'AVAILABLE' && '🟢 Đang Trống (Có thể giao khách ngay)'}
                    {selectedRoom.status === 'OCCUPIED' && `🔴 Đang Có Khách (${selectedRoom.currentGuest || 'Khách ở'})`}
                    {selectedRoom.status === 'CLEANING' && '🟡 Đang Dọn Dẹp Vệ Sinh'}
                  </strong>
                </div>
              </div>

              {/* 1. NẾU PHÒNG ĐANG TRỐNG: Cho phép giao phòng ngay cho khách mới */}
              {selectedRoom.status === 'AVAILABLE' && (
                <div>
                  <form onSubmit={handleCheckInSubmit} style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#15803d', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Key size={16} />
                      <span>Giao phòng cho khách đến quầy</span>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Họ và tên khách *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nhập tên khách hàng"
                        value={checkInGuestName}
                        onChange={e => setCheckInGuestName(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Số điện thoại (tùy chọn)</label>
                      <input 
                        type="tel" 
                        placeholder="0912345678"
                        value={checkInPhone}
                        onChange={e => setCheckInPhone(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* MỤC CHỌN SỐ NGÀY Ở */}
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Số ngày ở lại (đêm) *
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', background: 'white' }}>
                          <button
                            type="button"
                            onClick={() => setCheckInNights(prev => Math.max(1, prev - 1))}
                            style={{ padding: '8px 12px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: 800, color: '#475569' }}
                            title="Giảm 1 ngày"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            required
                            value={checkInNights}
                            onChange={e => setCheckInNights(Math.max(1, parseInt(e.target.value) || 1))}
                            style={{ width: '54px', textAlign: 'center', border: 'none', padding: '8px 2px', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
                          />
                          <button
                            type="button"
                            onClick={() => setCheckInNights(prev => prev + 1)}
                            style={{ padding: '8px 12px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: 800, color: '#475569' }}
                            title="Tăng 1 ngày"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>ngày (đêm)</span>

                        {/* Nút chọn nhanh số ngày */}
                        <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                          {[1, 2, 3, 5, 7].map(n => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setCheckInNights(n)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid',
                                borderColor: checkInNights === n ? '#15803d' : '#e2e8f0',
                                background: checkInNights === n ? '#dcfce7' : 'white',
                                color: checkInNights === n ? '#15803d' : '#475569',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {n}N
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* HỘP TÍNH TOÁN NGÀY TRẢ PHÒNG THEO THỜI GIAN THỰC & TIỀN PHÒNG */}
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '0.84rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#065f46' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> Ngày nhận phòng:
                        </span>
                        <b>{getTodayFormatted()} (Hôm nay)</b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#047857' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> Ngày dự kiến trả phòng:
                        </span>
                        <b style={{ background: '#d1fae5', color: '#065f46', padding: '1px 8px', borderRadius: '4px', border: '1px solid #6ee7b7' }}>
                          {calculateCheckOutDate(checkInNights)} (12:00 trưa)
                        </b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #6ee7b7', color: '#15803d', fontWeight: 700 }}>
                        <span>💰 Tổng tiền tạm tính ({checkInNights} đêm):</span>
                        <span style={{ fontSize: '0.95rem' }}>{formatCurrency(selectedRoom.pricePerNight * checkInNights)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '11px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Key size={16} />
                      <span>Xác Nhận Giao Phòng → Đổi Sang Có Khách (Đỏ)</span>
                    </button>
                  </form>

                  <button
                    onClick={() => onUpdateRoomStatus(selectedRoom.id, 'CLEANING')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#fef3c7',
                      color: '#b45309',
                      border: '1px solid #fde68a',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    🟡 Đổi sang: Đang Dọn Dẹp (Nếu cần bảo trì / dọn dẹp thêm)
                  </button>
                </div>
              )}

              {/* 2. NẾU PHÒNG ĐANG CÓ KHÁCH: Cho phép đổi trạng thái / trả phòng bất cứ lúc nào */}
              {selectedRoom.status === 'OCCUPIED' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '12px 14px', borderRadius: '8px', color: '#991b1b', fontSize: '0.9rem' }}>
                    <div style={{ marginBottom: '6px' }}>
                      👤 Khách đang ở: <strong>{selectedRoom.currentGuest || 'Khách trực tiếp'}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <span>📅 Ngày dự kiến trả phòng:</span>
                      <strong style={{ background: '#fecaca', padding: '2px 8px', borderRadius: '4px', color: '#7f1d1d' }}>
                        {selectedRoom.checkOut ? `${selectedRoom.checkOut} (12:00 trưa)` : 'Chưa định ngày cụ thể'}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#7f1d1d', marginTop: '6px', fontStyle: 'italic', borderTop: '1px dashed #fca5a5', paddingTop: '6px' }}>
                      💡 Lễ tân có thể xác nhận trả phòng bất cứ lúc nào (trả trước hạn hoặc đúng hạn) để giải phóng phòng đón khách mới.
                    </div>
                  </div>

                  <button
                    onClick={() => handleCheckOutToCleaning(selectedRoom.id)}
                    style={{
                      padding: '12px',
                      background: '#d97706',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogOut size={16} />
                    <span>🛎️ Khách Trả Phòng → Chuyển Sang Dọn Dẹp (Vàng)</span>
                  </button>

                  <button
                    onClick={() => handleCheckOutToAvailable(selectedRoom.id)}
                    style={{
                      padding: '11px',
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Khách Trả Phòng Xong → Đổi Thành Phòng Trống Luôn (Xanh)</span>
                  </button>
                </div>
              )}

              {/* 3. NẾU PHÒNG ĐANG DỌN DẸP: Cho phép báo dọn xong hoặc giao khách */}
              {selectedRoom.status === 'CLEANING' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '12px 14px', borderRadius: '8px', color: '#92400e', fontSize: '0.9rem' }}>
                    ⏳ Phòng đang trong quá trình thay chăn ga và vệ sinh khử khuẩn.
                  </div>

                  <button
                    onClick={() => handleCleaningDone(selectedRoom.id)}
                    style={{
                      padding: '13px',
                      background: '#15803d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
                    }}
                  >
                    <Sparkles size={18} />
                    <span>✨ Đã Dọn Xong → Sẵn Sàng Đón Khách (Đổi Sang Xanh)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MODAL GIAO PHÒNG NHANH CHO KHÁCH ĐẾN QUẦY ================= */}
        {isQuickAssignOpen && (
          <div className="modal-overlay" onClick={() => setIsQuickAssignOpen(false)} style={{ zIndex: 1200 }}>
            <div className="modal-content" style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setIsQuickAssignOpen(false)}>
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
                  <Key size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
                    Giao Phòng Cho Khách Đến Quầy
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                    Chọn phòng đang trống và nhập tên khách để bàn giao chìa khóa
                  </p>
                </div>
              </div>

              <form onSubmit={handleQuickAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Chọn phòng còn trống ({availableRooms.length} phòng) *
                  </label>
                  <select
                    required
                    value={assignRoomId}
                    onChange={e => setAssignRoomId(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: 'white' }}
                  >
                    {availableRooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} - {r.name} (Tầng {r.floor} • {formatCurrency(r.pricePerNight)}/đêm)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Họ và tên khách nhận phòng *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn Khách"
                    value={assignGuestName}
                    onChange={e => setAssignGuestName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Số điện thoại liên hệ (tùy chọn)
                  </label>
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={assignPhone}
                    onChange={e => setAssignPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                {/* MỤC CHỌN SỐ NGÀY Ở (QUICK ASSIGN) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Số ngày ở lại (đêm) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', background: 'white' }}>
                      <button
                        type="button"
                        onClick={() => setAssignNights(prev => Math.max(1, prev - 1))}
                        style={{ padding: '8px 12px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: 800, color: '#475569' }}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        required
                        value={assignNights}
                        onChange={e => setAssignNights(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ width: '54px', textAlign: 'center', border: 'none', padding: '8px 2px', fontWeight: 700, fontSize: '0.95rem', outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setAssignNights(prev => prev + 1)}
                        style={{ padding: '8px 12px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: 800, color: '#475569' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>ngày (đêm)</span>

                    <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                      {[1, 2, 3, 5, 7].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setAssignNights(n)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid',
                            borderColor: assignNights === n ? '#15803d' : '#e2e8f0',
                            background: assignNights === n ? '#dcfce7' : 'white',
                            color: assignNights === n ? '#15803d' : '#475569',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {n}N
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* HỘP DỰ KIẾN TRẢ PHÒNG & GIÁ TIỀN CHO QUICK ASSIGN */}
                {(() => {
                  const targetRoom = availableRooms.find(r => String(r.id) === String(assignRoomId)) || availableRooms[0];
                  return (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px 12px', fontSize: '0.84rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#065f46' }}>
                        <span>🕒 Ngày nhận phòng:</span>
                        <b>{getTodayFormatted()} (Hôm nay)</b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#047857' }}>
                        <span>📅 Ngày dự kiến trả:</span>
                        <b style={{ background: '#d1fae5', color: '#065f46', padding: '1px 8px', borderRadius: '4px', border: '1px solid #6ee7b7' }}>
                          {calculateCheckOutDate(assignNights)} (12:00 trưa)
                        </b>
                      </div>
                      {targetRoom && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #6ee7b7', color: '#15803d', fontWeight: 700 }}>
                          <span>💰 Tạm tính tiền ({assignNights} đêm):</span>
                          <span>{formatCurrency(targetRoom.pricePerNight * assignNights)}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <button
                  type="submit"
                  style={{
                    marginTop: '4px',
                    padding: '12px',
                    background: '#15803d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
                  }}
                >
                  <Key size={16} />
                  <span>Xác Nhận Giao Phòng & Chuyển Sang Màu Đỏ</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
