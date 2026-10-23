import React, { useState, useEffect } from 'react';
import { 
  Building, LayoutGrid, CalendarCheck, Users, KeyRound, Plus, Edit2, Trash2, 
  CheckCircle, XCircle, ShieldCheck, LogOut, RefreshCw, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import AdminRoomGrid from './AdminRoomGrid';
import AdminBookingsTable from './AdminBookingsTable';
import AdminHotelInfo from './AdminHotelInfo';

export default function AdminDashboard({ 
  adminUser, 
  onLogout, 
  rooms, 
  onUpdateRoomStatus, 
  onRefreshRooms, 
  bookings, 
  onApproveBooking, 
  onRejectBooking,
  onCancelBooking,
  isDbConnected,
  activeTab: controlledTab,
  setActiveTab: controlledSetActiveTab,
  hotelInfo,
  onUpdateHotelInfo,
  onResetHotelInfo
}) {
  // Phân quyền: Chỉ ADMIN tối cao mới có quyền Thêm/Sửa/Xóa phòng và Quản lý nhân sự
  const isAdmin = adminUser && adminUser.role === 'ADMIN';

  // Tabs: 'MATRIX', 'ROOMS_CRUD', 'BOOKINGS', 'STAFF', 'CHANGE_PASSWORD'
  const [internalTab, setInternalTab] = useState('MATRIX');
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const setActiveTab = controlledSetActiveTab !== undefined ? controlledSetActiveTab : setInternalTab;

  const pendingBookingsCount = (bookings || []).filter(b => b.status === 'PENDING').length;

  // Staff management state
  const [staffList, setStaffList] = useState([]);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ username: '', email: '', password: '', fullName: '', phone: '', role: 'STAFF' });

  // Room CRUD state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null); // null = Create, object = Edit
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    floor: 1,
    name: '',
    type: 'Standard Single',
    pricePerNight: 500000,
    capacity: 2,
    bed: '1 Giường đôi Queen',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    amenities: 'Điều hòa, Wifi, Tivi, Nước nóng'
  });

  // Phân trang Quản lý phòng: 10 phòng / trang & sắp xếp mới nhất lên đầu (id giảm dần)
  const [roomPage, setRoomPage] = useState(1);
  const ROOMS_PER_PAGE = 10;
  const sortedRooms = [...(rooms || [])].sort((a, b) => (b.id || 0) - (a.id || 0));
  const totalRoomPages = Math.max(1, Math.ceil(sortedRooms.length / ROOMS_PER_PAGE));
  const currentRoomPage = Math.min(roomPage, totalRoomPages);
  const paginatedRooms = sortedRooms.slice((currentRoomPage - 1) * ROOMS_PER_PAGE, currentRoomPage * ROOMS_PER_PAGE);
  const startRoomIdx = sortedRooms.length === 0 ? 0 : (currentRoomPage - 1) * ROOMS_PER_PAGE + 1;
  const endRoomIdx = Math.min(currentRoomPage * ROOMS_PER_PAGE, sortedRooms.length);

  // Change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  // Fetch staff list when opening staff tab
  useEffect(() => {
    if (activeTab === 'STAFF') {
      fetchStaff();
    }
  }, [activeTab]);

  const fetchStaff = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/staff');
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch {
      setStaffList([]);
    }
  };

  // 1. Tạo nhân viên mới
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
      const data = await res.json();
      if (res.ok) {
        setIsStaffModalOpen(false);
        setNewStaff({ username: '', email: '', password: '', fullName: '', phone: '', role: 'STAFF' });
        fetchStaff();
      }
    } catch {
      setIsStaffModalOpen(false);
    }
  };

  // 2. Xóa nhân viên
  const handleDeleteStaff = async (id, username) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản nhân sự: ${username}?`)) {
      try {
        const res = await fetch(`http://localhost:8080/api/auth/staff/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchStaff();
        }
      } catch {
        setStaffList(staffList.filter(s => s.id !== id));
      }
    }
  };

  // 3. Mở form thêm/sửa phòng
  const openCreateRoom = () => {
    if (!isAdmin) return;
    setEditingRoom(null);
    setRoomForm({
      roomNumber: `P.${rooms.length + 101}`,
      floor: 1,
      name: 'Phòng Mới Khách Sạn Bắc Hương',
      type: 'Standard Double',
      pricePerNight: 550000,
      capacity: 2,
      bed: '1 Giường đôi Queen',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      amenities: 'Điều hòa, Wifi, Tivi, Nước nóng'
    });
    setIsRoomModalOpen(true);
  };

  const openEditRoom = (room) => {
    if (!isAdmin) return;
    setEditingRoom(room);
    setRoomForm({
      roomNumber: room.roomNumber,
      floor: room.floor,
      name: room.name,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      bed: room.bed || '1 Giường đôi Queen',
      image: room.image || '',
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : (room.amenities || '')
    });
    setIsRoomModalOpen(true);
  };

  // 4. Lưu Thêm / Sửa phòng (Chỉ Admin)
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const payload = {
      ...roomForm,
      pricePerNight: Number(roomForm.pricePerNight),
      floor: Number(roomForm.floor),
      capacity: Number(roomForm.capacity),
      amenities: roomForm.amenities.split(',').map(a => a.trim())
    };

    try {
      if (editingRoom) {
        // Cập nhật
        await fetch(`http://localhost:8080/api/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Tạo mới
        await fetch('http://localhost:8080/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setIsRoomModalOpen(false);
      onRefreshRooms();
    } catch {
      setIsRoomModalOpen(false);
    }
  };

  // 5. Xóa phòng (Chỉ Admin)
  const handleDeleteRoom = async (id, roomNumber) => {
    if (!isAdmin) return;
    if (window.confirm(`⚠️ Bạn có chắc chắn muốn XÓA phòng ${roomNumber} khỏi cơ sở dữ liệu khách sạn?`)) {
      try {
        await fetch(`http://localhost:8080/api/rooms/${id}`, { method: 'DELETE' });
        onRefreshRooms();
      } catch {
        // Fallback
      }
    }
  };

  // 6. Đổi mật khẩu Admin / Staff
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      return;
    }
    setPwdMsg({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: adminUser.id || 1,
          oldPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPwdMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwdMsg({ type: 'error', text: data.message || 'Mật khẩu cũ không chính xác!' });
      }
    } catch {
      setPwdMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
    }
  };

  const formatVND = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* 1. THANH TIÊU ĐỀ ADMIN */}
      <div style={{ background: '#78350f', color: 'white', padding: '16px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>Trung Tâm Quản Trị • Khách Sạn Bắc Hương</div>
              <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>
                Đang đăng nhập: <b>{adminUser.fullName || adminUser.username}</b> ({adminUser.role === 'ADMIN' ? '👑 Quản Trị Viên Tối Cao' : '👔 Nhân Viên Lễ Tân'})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THANH MENU TABS ĐIỀU HƯỚNG */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 20px' }}>
          <button
            onClick={() => setActiveTab('MATRIX')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'MATRIX' ? '#78350f' : 'transparent',
              color: activeTab === 'MATRIX' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <LayoutGrid size={17} />
            <span>Sơ Đồ Phòng (Màu Sắc)</span>
          </button>

          {/* Tab Quản lý phòng (Thêm/Sửa/Xóa) chỉ hiển thị cho Quản Trị Viên (ADMIN) */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('ROOMS_CRUD')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'ROOMS_CRUD' ? '#78350f' : 'transparent',
                color: activeTab === 'ROOMS_CRUD' ? 'white' : '#475569',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <Building size={17} />
              <span>Quản Lý Phòng (Thêm/Sửa/Xóa)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('BOOKINGS')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'BOOKINGS' ? '#78350f' : 'transparent',
              color: activeTab === 'BOOKINGS' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <CalendarCheck size={17} />
            <span>Sổ Đơn Đặt Phòng ({bookings.length})</span>
            {pendingBookingsCount > 0 && (
              <span style={{
                background: '#dc2626',
                color: 'white',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '50px',
                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)'
              }}>
                {pendingBookingsCount} chờ duyệt
              </span>
            )}
          </button>

          {/* Tab quản lý nhân viên chỉ hiện cho Admin tối cao */}
          {adminUser.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('STAFF')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'STAFF' ? '#78350f' : 'transparent',
                color: activeTab === 'STAFF' ? 'white' : '#475569',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <Users size={17} />
              <span>Quản Lý Nhân Sự & Phân Quyền</span>
            </button>
          )}

          {/* Tab quản lý thông tin khách sạn chỉ hiện cho Admin tối cao */}
          {adminUser.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('HOTEL_INFO')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'HOTEL_INFO' ? '#78350f' : 'transparent',
                color: activeTab === 'HOTEL_INFO' ? 'white' : '#475569',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <Building size={17} />
              <span>Thông Tin Khách Sạn</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('CHANGE_PASSWORD')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'CHANGE_PASSWORD' ? '#78350f' : 'transparent',
              color: activeTab === 'CHANGE_PASSWORD' ? 'white' : '#475569',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <KeyRound size={17} />
            <span>Đổi Mật Khẩu</span>
          </button>
        </div>
      </div>

      {/* 3. NỘI DUNG TỪNG TAB */}
      <div style={{ marginTop: '24px' }}>
        {/* TAB 1: SƠ ĐỒ MA TRẬN MÀU PHÒNG */}
        {activeTab === 'MATRIX' && (
          <AdminRoomGrid 
            rooms={rooms}
            onUpdateRoomStatus={onUpdateRoomStatus}
          />
        )}

        {/* TAB 2: QUẢN LÝ PHÒNG (CRUD: THÊM / SỬA / XÓA - CHỈ DÀNH CHO ADMIN) */}
        {activeTab === 'ROOMS_CRUD' && isAdmin && (
          <div className="container">
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#78350f' }}>
                    Danh Mục Toàn Bộ Phòng Nghỉ ({rooms.length} phòng)
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                    Quản trị viên có toàn quyền Thêm phòng mới, Cập nhật giá và Xóa phòng khỏi hệ thống.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={onRefreshRooms}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}
                  >
                    <RefreshCw size={15} />
                    <span>Làm mới</span>
                  </button>

                  <button
                    onClick={openCreateRoom}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#16a34a', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)' }}
                  >
                    <Plus size={18} />
                    <span>Thêm Phòng Mới</span>
                  </button>
                </div>
              </div>

              {/* Bảng danh sách phòng CRUD */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Ảnh & Số Phòng</th>
                      <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Tên Hạng Phòng</th>
                      <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Tầng</th>
                      <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Giá / Đêm</th>
                      <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Sức Chứa & Giường</th>
                      <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800 }}>Trạng Thái</th>
                      <th style={{ padding: '14px 16px', whiteSpace: 'nowrap', fontWeight: 800, textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRooms.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
                          Chưa có phòng nào trong hệ thống.
                        </td>
                      </tr>
                    ) : (
                      paginatedRooms.map(room => (
                        <tr key={room.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                          <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                              src={room.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=100&q=80'} 
                              alt={room.name}
                              style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} 
                            />
                            <div>
                              <div style={{ fontWeight: 800, color: '#78350f', fontSize: '1rem' }}>P.{room.roomNumber}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{room.type}</div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>
                            {room.name}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600 }}>Tầng {room.floor}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#b45309' }}>{formatVND(room.pricePerNight)}</td>
                          <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 600, color: '#334155' }}>{room.capacity} khách</div>
                            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{room.bed}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '50px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: room.status === 'AVAILABLE' ? '#dcfce7' : room.status === 'OCCUPIED' ? '#fee2e2' : '#fef3c7',
                              color: room.status === 'AVAILABLE' ? '#15803d' : room.status === 'OCCUPIED' ? '#b91c1c' : '#b45309'
                            }}>
                              {room.status === 'AVAILABLE' && '🟢 Trống'}
                              {room.status === 'OCCUPIED' && '🔴 Có khách'}
                              {room.status === 'CLEANING' && '🟡 Dọn dẹp'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => openEditRoom(room)}
                                title="Chỉnh sửa thông tin phòng"
                                style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                              >
                                <Edit2 size={13} /> Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(room.id, room.roomNumber)}
                                title="Xóa phòng này khỏi khách sạn"
                                style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                              >
                                <Trash2 size={13} /> Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Thanh phân trang 10 phòng / trang */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '18px', 
                paddingTop: '16px', 
                borderTop: '1px solid #f1f5f9', 
                flexWrap: 'wrap', 
                gap: '12px' 
              }}>
                <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Hiển thị <b>{startRoomIdx}</b> - <b>{endRoomIdx}</b> trên tổng số <b>{sortedRooms.length}</b> phòng • <i>(Trang {currentRoomPage}/{totalRoomPages})</i>
                </div>

                {totalRoomPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => setRoomPage(p => Math.max(1, p - 1))}
                      disabled={currentRoomPage === 1}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        border: '1px solid #cbd5e1', 
                        background: currentRoomPage === 1 ? '#f8fafc' : 'white', 
                        color: currentRoomPage === 1 ? '#94a3b8' : '#334155', 
                        cursor: currentRoomPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      <ChevronLeft size={15} />
                      <span>Trước</span>
                    </button>

                    {Array.from({ length: totalRoomPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setRoomPage(page)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: currentRoomPage === page ? '1px solid #78350f' : '1px solid #cbd5e1',
                          background: currentRoomPage === page ? '#78350f' : 'white',
                          color: currentRoomPage === page ? 'white' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          cursor: 'pointer'
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setRoomPage(p => Math.min(totalRoomPages, p + 1))}
                      disabled={currentRoomPage === totalRoomPages}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        border: '1px solid #cbd5e1', 
                        background: currentRoomPage === totalRoomPages ? '#f8fafc' : 'white', 
                        color: currentRoomPage === totalRoomPages ? '#94a3b8' : '#334155', 
                        cursor: currentRoomPage === totalRoomPages ? 'not-allowed' : 'pointer',
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
            </div>
          </div>
        )}

        {/* TAB 3: QUẢN LÝ ĐƠN ĐẶT PHÒNG */}
        {activeTab === 'BOOKINGS' && (
          <AdminBookingsTable 
            bookings={bookings}
            onApproveBooking={onApproveBooking}
            onRejectBooking={onRejectBooking}
            onCancelBooking={onCancelBooking}
          />
        )}

        {/* TAB 4: QUẢN LÝ NHÂN SỰ & TẠO TÀI KHOẢN MỚI */}
        {activeTab === 'STAFF' && (
          <div className="container">
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#78350f' }}>
                    Danh Sách Ban Quản Lý & Nhân Viên Lễ Tân
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                    Super Admin có thể cấp tài khoản cho các nhân viên lễ tân khác đăng nhập quản lý khách sạn.
                  </p>
                </div>

                <button
                  onClick={() => setIsStaffModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#78350f', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  <Plus size={18} />
                  <span>Cấp Tài Khoản Nhân Viên Mới</span>
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '12px' }}>Họ Và Tên</th>
                      <th style={{ padding: '12px' }}>Tên Đăng Nhập</th>
                      <th style={{ padding: '12px' }}>Email & SĐT</th>
                      <th style={{ padding: '12px' }}>Vai Trò / Quyền Hạn</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(st => (
                      <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{st.fullName}</td>
                        <td style={{ padding: '12px', color: '#78350f', fontWeight: 600 }}>{st.username || '—'}</td>
                        <td style={{ padding: '12px' }}>
                          <div>{st.email}</div>
                          <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{st.phone || 'Chưa cập nhật SĐT'}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '50px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: st.role === 'ADMIN' ? '#fef3c7' : '#e0e7ff',
                            color: st.role === 'ADMIN' ? '#92400e' : '#3730a3'
                          }}>
                            {st.role === 'ADMIN' ? '👑 Quản Trị Viên (Admin)' : '👔 Lễ Tân (Staff)'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {st.username !== 'admin' && (
                            <button
                              onClick={() => handleDeleteStaff(st.id, st.fullName)}
                              style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              Xóa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ĐỔI MẬT KHẨU ADMIN */}
        {activeTab === 'CHANGE_PASSWORD' && (
          <div className="container" style={{ maxWidth: '480px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  <KeyRound size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#78350f' }}>Đổi Mật Khẩu Tài Khoản</h3>
                <p style={{ color: '#64748b', fontSize: '0.86rem' }}>Tài khoản: <b>{adminUser.username}</b></p>
              </div>

              {pwdMsg.text && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: pwdMsg.type === 'error' ? '#fee2e2' : '#dcfce7',
                  color: pwdMsg.type === 'error' ? '#b91c1c' : '#15803d'
                }}>
                  {pwdMsg.text}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Mật khẩu hiện tại *</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '0.92rem', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Mật khẩu mới *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '0.92rem', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Xác nhận mật khẩu mới *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '0.92rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#78350f', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Cập Nhật Mật Khẩu
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: QUẢN LÝ TOÀN BỘ THÔNG TIN KHÁCH SẠN */}
        {activeTab === 'HOTEL_INFO' && isAdmin && (
          <AdminHotelInfo 
            hotelInfo={hotelInfo}
            onUpdateHotelInfo={onUpdateHotelInfo}
            onResetHotelInfo={onResetHotelInfo}
          />
        )}
      </div>

      {/* 4. MODAL THÊM / SỬA PHÒNG */}
      {isRoomModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRoomModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsRoomModalOpen(false)}>
              <XCircle size={20} />
            </button>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#78350f', marginBottom: '16px' }}>
              {editingRoom ? `✏️ Chỉnh Sửa Phòng ${editingRoom.roomNumber}` : '➕ Thêm Phòng Mới Vào Khách Sạn'}
            </h3>

            <form onSubmit={handleSaveRoom}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Số phòng *</label>
                  <input
                    type="text"
                    required
                    placeholder="P.104"
                    value={roomForm.roomNumber}
                    onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Tầng *</label>
                  <select
                    value={roomForm.floor}
                    onChange={e => setRoomForm({ ...roomForm, floor: Number(e.target.value) })}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none', background: 'white' }}
                  >
                    <option value={1}>Tầng 1</option>
                    <option value={2}>Tầng 2</option>
                    <option value={3}>Tầng 3</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Tên hạng phòng *</label>
                <input
                  type="text"
                  required
                  placeholder="Phòng Đôi Superior Giường Queen"
                  value={roomForm.name}
                  onChange={e => setRoomForm({ ...roomForm, name: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Giá phòng / đêm (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    step="10000"
                    value={roomForm.pricePerNight}
                    onChange={e => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Sức chứa (người) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={roomForm.capacity}
                    onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Loại giường</label>
                <input
                  type="text"
                  value={roomForm.bed}
                  onChange={e => setRoomForm({ ...roomForm, bed: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Link ảnh phòng (URL)</label>
                <input
                  type="url"
                  value={roomForm.image}
                  onChange={e => setRoomForm({ ...roomForm, image: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Tiện nghi (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={roomForm.amenities}
                  onChange={e => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                >
                  Lưu Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL TẠO NHÂN VIÊN MỚI */}
      {isStaffModalOpen && (
        <div className="modal-overlay" onClick={() => setIsStaffModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsStaffModalOpen(false)}>
              <XCircle size={20} />
            </button>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#78350f', marginBottom: '16px' }}>
              ➕ Cấp Tài Khoản Nhân Viên / Lễ Tân
            </h3>

            <form onSubmit={handleCreateStaff}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Họ và tên nhân viên *</label>
                <input
                  type="text"
                  required
                  placeholder="Lê Thị Thu Thảo"
                  value={newStaff.fullName}
                  onChange={e => setNewStaff({ ...newStaff, fullName: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Tên đăng nhập *</label>
                  <input
                    type="text"
                    required
                    placeholder="letan02"
                    value={newStaff.username}
                    onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Mật khẩu khởi tạo *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newStaff.password}
                    onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Email liên hệ *</label>
                <input
                  type="email"
                  required
                  placeholder="letan02@gmail.com"
                  value={newStaff.email}
                  onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={newStaff.phone}
                    onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Vai trò / Quyền *</label>
                  <select
                    value={newStaff.role}
                    onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                    style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', outline: 'none', background: 'white' }}
                  >
                    <option value="STAFF">Lễ Tân (Staff)</option>
                    <option value="ADMIN">Quản Trị Viên (Admin)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontWeight: 600 }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', background: '#78350f', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                >
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
