import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HotelContactBar from './components/HotelContactBar';
import Hero from './components/Hero';
import RoomCard from './components/RoomCard';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import CustomerChangePasswordModal from './components/CustomerChangePasswordModal';
import SavedRoomsModal from './components/SavedRoomsModal';
import RoomFilterBar from './components/RoomFilterBar';
import Footer from './components/Footer';
import DbAlertBanner from './components/DbAlertBanner';
import DbErrorModal from './components/DbErrorModal';
import NewBookingAlertModal from './components/NewBookingAlertModal';
import { HOTEL_INFO, INITIAL_ROOMS, INITIAL_BOOKINGS } from './data/bacHuongData';
import { Calendar, CheckCircle2, Clock, X, Shield, ArrowRight, Heart, Trash2, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

export default function App() {
  // 1. Quản lý tài khoản đăng nhập chung (Role: 'ADMIN', 'STAFF', hoặc 'CUSTOMER')
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bh_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed.username === 'admin') parsed.fullName = 'Quản Trị Viên Bắc Hương';
      if (parsed.username === 'letan01') parsed.fullName = 'Lê Thị Thu Thảo (Lễ Tân)';
      return parsed;
    } catch {
      return null;
    }
  });

  // Tự động vào Trang Quản Trị nếu tài khoản là ADMIN hoặc STAFF
  const [isAdminMode, setIsAdminMode] = useState(() => {
    try {
      const saved = localStorage.getItem('bh_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'ADMIN' || u.role === 'STAFF';
      }
      return false;
    } catch {
      return false;
    }
  });

  // 2. Modals điều khiển
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCustomerChangePwdOpen, setIsCustomerChangePwdOpen] = useState(false);
  const [isClientBookingsOpen, setIsClientBookingsOpen] = useState(false);
  const [isSavedRoomsOpen, setIsSavedRoomsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [cancelConfirmBooking, setCancelConfirmBooking] = useState(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('');

  // 3. Quản lý thông báo popup chuông lễ tân khi có khách đặt mới
  const [pendingAlertBooking, setPendingAlertBooking] = useState(null);
  const [adminActiveTab, setAdminActiveTab] = useState('MATRIX');
  const dismissedBookingIdsRef = useRef(new Set());
  const isInitialFetchRef = useRef(true);

  // 4. Danh sách phòng yêu thích / đã lưu của khách
  const [savedRooms, setSavedRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('bh_saved_rooms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Dữ liệu phòng & Đơn đặt phòng
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [dbErrorModal, setDbErrorModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Tải dữ liệu từ Backend Spring Boot & MySQL và kích hoạt polling thời gian thực
  useEffect(() => {
    checkDbConnection(false);
    fetchBookings();

    // Polling tự động mỗi 4 giây để phát hiện ngay khi có khách vừa đặt phòng trực tuyến
    const timer = setInterval(() => {
      fetchBookings();
    }, 4000);

    return () => clearInterval(timer);
  }, [user]);

  // Kiểm tra kết nối Database & Tải lại dữ liệu
  const checkDbConnection = async (showToast = true) => {
    setIsCheckingDb(true);
    try {
      const res = await fetch(`${API_BASE}/rooms`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(r => {
            const initial = INITIAL_ROOMS.find(item => item.id === r.id) || {};
            return {
              ...initial,
              ...r,
              amenities: Array.isArray(r.amenities) ? r.amenities : (initial.amenities || ['Điều hòa', 'Wifi', 'Nước nóng', 'Tivi']),
              image: r.image || initial.image
            };
          });
          setRooms(formatted);
          setIsDbConnected(true);
          setDbErrorModal(null);
          setIsBannerDismissed(false);
          fetchBookings();
          if (showToast) {
            setToastMessage({ type: 'success', text: '✅ Đã kết nối Cơ sở dữ liệu MySQL thành công! Đang dùng dữ liệu trực tiếp.' });
            setTimeout(() => setToastMessage(null), 4000);
          }
          return true;
        }
      }
      setIsDbConnected(false);
      if (showToast) {
        setToastMessage({ type: 'error', text: '❌ Vẫn chưa kết nối được MySQL. Vui lòng kiểm tra lại dịch vụ MYSQL80.' });
        setTimeout(() => setToastMessage(null), 4000);
      }
      return false;
    } catch {
      setIsDbConnected(false);
      if (showToast) {
        setToastMessage({ type: 'error', text: '❌ Vẫn chưa kết nối được MySQL. Vui lòng kiểm tra lại dịch vụ MYSQL80.' });
        setTimeout(() => setToastMessage(null), 4000);
      }
      return false;
    } finally {
      setIsCheckingDb(false);
    }
  };

  const fetchRooms = async () => {
    await checkDbConnection(false);
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setBookings(data);

          // Lần đầu tải trang: Đánh dấu các đơn hiện có để không bắn popup spam
          if (isInitialFetchRef.current) {
            data.forEach(b => dismissedBookingIdsRef.current.add(b.id));
            isInitialFetchRef.current = false;
          } else {
            // Khi có đơn mới gửi lên có trạng thái PENDING và chưa từng tắt:
            // Nếu người đang xem là ADMIN hoặc STAFF (hoặc ở chế độ Quản trị), bắn popup thông báo & rung chuông
            const newPending = data.find(b => b.status === 'PENDING' && !dismissedBookingIdsRef.current.has(b.id));
            if (newPending) {
              setPendingAlertBooking(newPending);
            }
          }
        }
      }
    } catch {
      // Backend offline thì dùng INITIAL_BOOKINGS
    }
  };

  // Đăng nhập thành công: Phân luồng quyền hạn tự động
  const handleLoginSuccess = (account) => {
    setUser(account);
    localStorage.setItem('bh_user', JSON.stringify(account));

    if (account.role === 'ADMIN' || account.role === 'STAFF') {
      setIsAdminMode(true);
    } else {
      setIsAdminMode(false);
    }
  };

  // Đăng xuất chung cho mọi tài khoản
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bh_user');
    setIsAdminMode(false);
  };

  // Khách hàng bấm Đặt phòng: Lưu với trạng thái PENDING & Kích hoạt Email tới khách sạn
  const handleBookingSubmit = async (newBooking) => {
    // NẾU DATABASE CHƯA KẾT NỐI: Lập tức hiện Modal Cảnh báo & Hướng dẫn gọi Hotline lễ tân
    if (!isDbConnected) {
      setSelectedRoom(null);
      setDbErrorModal({
        roomName: newBooking.roomName,
        roomNumber: newBooking.roomNumber,
        guestName: newBooking.guestName,
        nights: newBooking.nights,
        totalPrice: newBooking.totalPrice
      });
      return;
    }

    // Lưu vào Database qua Backend Spring Boot & MySQL với trạng thái PENDING
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: newBooking.roomId,
          roomNumber: newBooking.roomNumber,
          roomName: newBooking.roomName,
          guestName: newBooking.guestName,
          guestPhone: newBooking.guestPhone,
          guestEmail: newBooking.guestEmail,
          checkInDate: newBooking.checkIn,
          nights: newBooking.nights,
          totalPrice: newBooking.totalPrice,
          notes: newBooking.notes
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.booking) {
          // Lưu vào danh sách đơn ở trạng thái PENDING
          setBookings(prev => [data.booking, ...prev]);
          setSelectedRoom(null);
          setBookingSuccess(data.booking);

          // Nếu tài khoản hiện tại là ADMIN / LỄ TÂN (hoặc đang xem demo):
          // Kích hoạt ngay chuông lễ tân và popup thông báo đơn mới
          if (user && (user.role === 'ADMIN' || user.role === 'STAFF')) {
            setPendingAlertBooking(data.booking);
          }

          fetchRooms();
          fetchBookings();
        }
      } else {
        // Backend trả về lỗi (ví dụ MySQL bị tắt đột ngột)
        setIsDbConnected(false);
        setSelectedRoom(null);
        setDbErrorModal({
          roomName: newBooking.roomName,
          roomNumber: newBooking.roomNumber,
          guestName: newBooking.guestName,
          nights: newBooking.nights,
          totalPrice: newBooking.totalPrice
        });
      }
    } catch (err) {
      // Mất kết nối tới Backend / MySQL
      setIsDbConnected(false);
      setSelectedRoom(null);
      setDbErrorModal({
        roomName: newBooking.roomName,
        roomNumber: newBooking.roomNumber,
        guestName: newBooking.guestName,
        nights: newBooking.nights,
        totalPrice: newBooking.totalPrice
      });
    }
  };

  // Quản trị viên / Lễ tân BẤM DUYỆT ĐƠN ĐẶT PHÒNG: Khóa phòng sang ĐỎ (OCCUPIED) & Bắn Email xác nhận cho Khách
  const handleApproveBooking = async (bookingId) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/approve`, {
        method: 'PUT'
      });
      if (res.ok) {
        const data = await res.json();
        const approved = data.booking || bookings.find(b => b.id === bookingId);

        // 1. Đổi trạng thái đơn sang CONFIRMED
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b));

        // 2. Đổi trạng thái phòng sang OCCUPIED (Đỏ - Đã có khách)
        if (approved && approved.roomId) {
          setRooms(prev => prev.map(r => r.id === approved.roomId ? {
            ...r,
            status: 'OCCUPIED',
            currentGuest: approved.guestName
          } : r));
        }

        // 3. Đánh dấu đã xử lý và đóng popup alert nếu đang mở đơn này
        dismissedBookingIdsRef.current.add(bookingId);
        if (pendingAlertBooking && pendingAlertBooking.id === bookingId) {
          setPendingAlertBooking(null);
        }

        setToastMessage({
          type: 'success',
          text: `✅ Đã duyệt thành công đơn #${approved?.bookingCode || bookingId}! Email xác nhận đã gửi tự động tới khách (${approved?.guestEmail}).`
        });
        setTimeout(() => setToastMessage(null), 6000);

        fetchRooms();
        fetchBookings();
        return true;
      }
    } catch (err) {
      console.error("Lỗi duyệt đơn:", err);
    }
    return false;
  };

  // Quản trị viên / Lễ tân TỪ CHỐI ĐƠN: Đơn sang REJECTED, Phòng giữ AVAILABLE (Xanh), Gửi Email cáo lỗi & lý do cho Khách
  const handleRejectBooking = async (bookingId, reason = 'Khách sạn hiện kín phòng hoặc đang bảo trì vào khung giờ này.') => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const data = await res.json();
        const rejected = data.booking || bookings.find(b => b.id === bookingId);

        // 1. Đổi trạng thái đơn sang REJECTED và lưu lý do
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'REJECTED', rejectionReason: reason } : b));

        // 2. Đảm bảo trạng thái phòng vẫn là AVAILABLE (Xanh - Sẵn sàng đón khách khác)
        if (rejected && rejected.roomId) {
          setRooms(prev => prev.map(r => r.id === rejected.roomId ? {
            ...r,
            status: r.status === 'OCCUPIED' ? 'AVAILABLE' : r.status,
            currentGuest: null
          } : r));
        }

        // 3. Đóng popup alert
        dismissedBookingIdsRef.current.add(bookingId);
        if (pendingAlertBooking && pendingAlertBooking.id === bookingId) {
          setPendingAlertBooking(null);
        }

        setToastMessage({
          type: 'success',
          text: `❌ Đã từ chối đơn #${rejected?.bookingCode || bookingId}! Khách sạn đã gửi email thông báo kèm lý do tới khách (${rejected?.guestEmail}).`
        });
        setTimeout(() => setToastMessage(null), 6000);

        fetchRooms();
        fetchBookings();
        return true;
      }
    } catch (err) {
      console.error("Lỗi từ chối đơn:", err);
    }
    return false;
  };

  // Lễ tân/Admin cập nhật trạng thái phòng (Xanh <-> Đỏ <-> Vàng)
  const handleUpdateRoomStatus = async (roomId, newStatus, guestName = '') => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          status: newStatus,
          currentGuest: newStatus === 'OCCUPIED' ? (guestName || room.currentGuest || 'Khách trực tiếp') : null
        };
      }
      return room;
    }));

    try {
      const url = `${API_BASE}/rooms/${roomId}/status?status=${newStatus}${guestName ? `&guestName=${encodeURIComponent(guestName)}` : ''}`;
      await fetch(url, { method: 'PUT' });
    } catch (err) {
      console.log("Lỗi cập nhật phòng:", err);
    }
  };

  // Hủy đơn đặt phòng (Khách hàng hoặc Lễ tân/Admin)
  const handleCancelBooking = async (bookingId, roomId = null) => {
    // 1. Tìm đơn đặt phòng để lấy roomId nếu chưa truyền
    const targetBooking = bookings.find(b => b.id === bookingId);
    const targetRoomId = roomId || (targetBooking ? targetBooking.roomId : null);

    // 2. Cập nhật state bookings ngay lập tức
    setBookings(prev => prev.filter(b => b.id !== bookingId));

    // 3. Tự động giải phóng phòng về trạng thái AVAILABLE (Xanh) ngay lập tức
    if (targetRoomId) {
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.id === targetRoomId) {
          return {
            ...room,
            status: 'AVAILABLE',
            currentGuest: null
          };
        }
        return room;
      }));
    }

    // 4. Gửi yêu cầu DELETE lên Backend Spring Boot & MySQL
    try {
      await fetch(`${API_BASE}/bookings/${bookingId}`, { method: 'DELETE' });
      fetchRooms();
      fetchBookings();
    } catch (err) {
      console.log("Hủy đơn cục bộ:", err);
    }
  };

  // Thêm / Bỏ lưu phòng yêu thích
  const handleToggleSaveRoom = (room) => {
    setSavedRooms(prev => {
      let updated;
      if (prev.some(r => r.id === room.id)) {
        updated = prev.filter(r => r.id !== room.id);
      } else {
        updated = [...prev, room];
      }
      localStorage.setItem('bh_saved_rooms', JSON.stringify(updated));
      return updated;
    });
  };

  // Xóa phòng khỏi danh sách lưu
  const handleRemoveSavedRoom = (roomId) => {
    setSavedRooms(prev => {
      const updated = prev.filter(r => r.id !== roomId);
      localStorage.setItem('bh_saved_rooms', JSON.stringify(updated));
      return updated;
    });
  };

  // Danh sách đơn đặt phòng của khách hiện tại (Khớp email, SĐT hoặc Tên)
  const myBookings = bookings.filter(b => {
    if (!user) return false;
    const userEmail = (user.email || '').toLowerCase().trim();
    const guestEmail = (b.guestEmail || '').toLowerCase().trim();
    if (userEmail && guestEmail && userEmail === guestEmail) return true;

    const userPhone = (user.phone || '').trim();
    const guestPhone = (b.guestPhone || '').trim();
    if (userPhone && guestPhone && userPhone === guestPhone) return true;

    const userName = (user.fullName || '').toLowerCase().trim();
    const guestName = (b.guestName || '').toLowerCase().trim();
    if (userName && guestName && userName === guestName) return true;

    return false;
  });

  // 5. Trạng thái & Logic Bộ Lọc Tìm Phòng cho Khách Hàng
  const [capacityFilter, setCapacityFilter] = useState('ALL');
  const [bedFilter, setBedFilter] = useState('ALL');
  const [priceRanges, setPriceRanges] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Phân trang danh sách phòng khách hàng: 10 phòng / trang
  const [guestRoomPage, setGuestRoomPage] = useState(1);
  const GUEST_ROOMS_PER_PAGE = 10;

  // Tự động về trang 1 khi thay đổi bất kỳ tiêu chí lọc nào
  useEffect(() => {
    setGuestRoomPage(1);
  }, [capacityFilter, bedFilter, priceRanges, onlyAvailable]);

  const handleResetFilters = () => {
    setCapacityFilter('ALL');
    setBedFilter('ALL');
    setPriceRanges([]);
    setOnlyAvailable(false);
    setGuestRoomPage(1);
  };

  const filteredRooms = rooms.filter(room => {
    // 1. Lọc theo Số người (Combobox)
    if (capacityFilter !== 'ALL') {
      const cap = Number(capacityFilter);
      if (cap === 4) {
        if (room.capacity < 3) return false;
      } else {
        if (room.capacity !== cap) return false;
      }
    }

    // 2. Lọc theo Loại giường (Combobox)
    if (bedFilter !== 'ALL') {
      const bedLower = (room.bed || '').toLowerCase();
      if (bedFilter === '1_SINGLE') {
        if (!bedLower.includes('1 giường đơn') && !bedLower.includes('1 giường don')) return false;
      } else if (bedFilter === '1_DOUBLE') {
        if (!bedLower.includes('giường đôi') && !bedLower.includes('queen') && !bedLower.includes('king') && !bedLower.includes('hoàng gia')) return false;
        if (bedLower.includes('2 giường')) return false;
      } else if (bedFilter === '2_SINGLE') {
        if (!bedLower.includes('2 giường đơn') && !bedLower.includes('2 giường don')) return false;
      } else if (bedFilter === 'FAMILY_BED') {
        if (!bedLower.includes('2 giường đôi') && !bedLower.includes('family')) return false;
      }
    }

    // 3. Lọc theo Khoảng giá (Checkbox: Dưới 500k, 500k - 800k, Trên 800k)
    if (priceRanges.length > 0) {
      const price = Number(room.pricePerNight);
      const matchAnyRange = priceRanges.some(range => {
        if (range === 'UNDER_500') return price < 500000;
        if (range === 'FROM_500_TO_800') return price >= 500000 && price <= 800000;
        if (range === 'OVER_800') return price > 800000;
        return false;
      });
      if (!matchAnyRange) return false;
    }

    // 4. Chỉ hiện phòng còn trống (Checkbox)
    if (onlyAvailable && room.status !== 'AVAILABLE') {
      return false;
    }

    return true;
  });

  // Sắp xếp phòng mới nhất lên đầu (ưu tiên id giảm dần)
  const sortedFilteredRooms = [...filteredRooms].sort((a, b) => (b.id || 0) - (a.id || 0));
  const totalGuestRoomPages = Math.max(1, Math.ceil(sortedFilteredRooms.length / GUEST_ROOMS_PER_PAGE));
  const currentGuestPage = Math.min(guestRoomPage, totalGuestRoomPages);
  const paginatedGuestRooms = sortedFilteredRooms.slice((currentGuestPage - 1) * GUEST_ROOMS_PER_PAGE, currentGuestPage * GUEST_ROOMS_PER_PAGE);
  const startGuestRoomIdx = sortedFilteredRooms.length === 0 ? 0 : (currentGuestPage - 1) * GUEST_ROOMS_PER_PAGE + 1;
  const endGuestRoomIdx = Math.min(currentGuestPage * GUEST_ROOMS_PER_PAGE, sortedFilteredRooms.length);

  const handleGuestPageChange = (newPage) => {
    setGuestRoomPage(newPage);
    const roomsSection = document.getElementById('rooms-list');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAdminOrStaff = user && (user.role === 'ADMIN' || user.role === 'STAFF');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ================= GIAO DIỆN QUẢN TRỊ VIÊN / LỄ TÂN ================= */}
      {isAdminMode && isAdminOrStaff ? (
        <div>
          {/* Thanh chuyển đổi nhanh dành cho Admin */}
          <div style={{ background: '#1c1917', color: '#e7e5e4', padding: '8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="#fbbf24" />
              <span>Cổng Quản Trị Khách Sạn Bắc Hương • Tài khoản: <strong>{user.fullName || user.username}</strong> ({user.role})</span>
            </div>
            <button
              onClick={() => setIsAdminMode(false)}
              style={{
                background: '#334155',
                color: 'white',
                border: 'none',
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>👁️ Xem Giao Diện Khách</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <DbAlertBanner 
            isDbConnected={isDbConnected}
            onRetry={() => checkDbConnection(true)}
            isRetrying={isCheckingDb}
            isDismissed={isBannerDismissed}
            onDismiss={() => setIsBannerDismissed(true)}
          />

          <AdminDashboard 
            adminUser={user}
            onLogout={handleLogout}
            rooms={rooms}
            onUpdateRoomStatus={handleUpdateRoomStatus}
            onRefreshRooms={fetchRooms}
            bookings={bookings}
            onApproveBooking={handleApproveBooking}
            onRejectBooking={handleRejectBooking}
            onCancelBooking={handleCancelBooking}
            isDbConnected={isDbConnected}
            activeTab={adminActiveTab}
            setActiveTab={setAdminActiveTab}
          />
        </div>
      ) : (
        /* ================= GIAO DIỆN KHÁCH HÀNG (CLIENT PORTAL) ================= */
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Banner thông báo nếu Admin đang xem giao diện Khách */}
          {isAdminOrStaff && (
            <div style={{ background: '#78350f', color: '#fef3c7', padding: '10px 20px', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <span>🛡️ Bạn đang xem giao diện khách với tư cách Quản Trị Viên ({user.fullName || user.username})</span>
              <button
                onClick={() => setIsAdminMode(true)}
                style={{
                  background: '#fbbf24',
                  color: '#78350f',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Quay Lại Trang Quản Trị
              </button>
            </div>
          )}

          {/* 1. Thanh thông tin liên hệ & Google Maps */}
          <HotelContactBar />

          {/* 2. Thanh Menu điều hướng */}
          <Navbar 
            currentUser={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogoutUser={handleLogout}
            onOpenChangePassword={() => setIsCustomerChangePwdOpen(true)}
            bookingsCount={myBookings.length}
            onOpenBookings={() => setIsClientBookingsOpen(true)}
            savedRoomsCount={savedRooms.length}
            onOpenSavedRooms={() => setIsSavedRoomsOpen(true)}
            onGoToAdminDashboard={() => setIsAdminMode(true)}
          />

          {/* CÁCH 1: THANH CẢNH BÁO MẤT KẾT NỐI DATABASE ĐẦU TRANG */}
          <DbAlertBanner 
            isDbConnected={isDbConnected}
            onRetry={() => checkDbConnection(true)}
            isRetrying={isCheckingDb}
            isDismissed={isBannerDismissed}
            onDismiss={() => setIsBannerDismissed(true)}
          />

          {/* 3. Nội dung trang chủ khách sạn */}
          <main style={{ flex: 1 }}>
            {/* Banner Khách sạn Bắc Hương Kon Tum */}
            <Hero onExploreRooms={() => document.getElementById('rooms-list')?.scrollIntoView({ behavior: 'smooth' })} />

            {/* Danh sách các phòng */}
            <div className="container" id="rooms-list" style={{ padding: '40px 20px 80px' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#78350f', marginTop: '6px', marginBottom: '10px' }}>
                  Danh Sách Hạng Phòng Khách Sạn Bắc Hương
                </h2>
                <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
                  Trang bị đầy đủ tiện nghi tiêu chuẩn, điều hòa, wifi tốc độ cao, nước nóng năng lượng mặt trời và phong cách phục vụ chu đáo tại 196 Trần Hưng Đạo, TP. Kon Tum.
                </p>
              </div>

              {/* BỘ LỌC TÌM PHÒNG THÔNG MINH */}
              <RoomFilterBar 
                capacityFilter={capacityFilter}
                setCapacityFilter={setCapacityFilter}
                bedFilter={bedFilter}
                setBedFilter={setBedFilter}
                priceRanges={priceRanges}
                setPriceRanges={setPriceRanges}
                onlyAvailable={onlyAvailable}
                setOnlyAvailable={setOnlyAvailable}
                totalMatches={filteredRooms.length}
                totalRooms={rooms.length}
                onReset={handleResetFilters}
              />

              {/* Danh sách thẻ phòng sau khi lọc */}
              {filteredRooms.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '50px 20px',
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '16px',
                  color: '#64748b',
                  margin: '10px 0'
                }}>
                  <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🔍</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Không tìm thấy phòng phù hợp với bộ lọc
                  </h3>
                  <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                    Quý khách có thể thử mở rộng khoảng giá hoặc chọn số lượng khách / loại giường khác để xem thêm nhiều lựa chọn phòng.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    style={{
                      background: '#b45309',
                      color: 'white',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)'
                    }}
                  >
                    Xem Lại Tất Cả Phòng
                  </button>
                </div>
              ) : (
                <>
                  <div className="rooms-grid">
                    {paginatedGuestRooms.map(room => (
                      <RoomCard 
                        key={room.id}
                        room={room}
                        onBook={setSelectedRoom}
                        isSaved={savedRooms.some(r => r.id === room.id)}
                        onToggleSave={handleToggleSaveRoom}
                      />
                    ))}
                  </div>

                  {/* Thanh phân trang xem phòng của khách (10 phòng / trang) */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '36px',
                    padding: '16px 22px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                      Hiển thị <b>{startGuestRoomIdx}</b> - <b>{endGuestRoomIdx}</b> trên tổng số <b>{sortedFilteredRooms.length}</b> phòng phù hợp • <i>(Trang {currentGuestPage}/{totalGuestRoomPages})</i>
                    </div>

                    {totalGuestRoomPages > 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleGuestPageChange(Math.max(1, currentGuestPage - 1))}
                          disabled={currentGuestPage === 1}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: currentGuestPage === 1 ? '#f8fafc' : 'white',
                            color: currentGuestPage === 1 ? '#94a3b8' : '#334155',
                            cursor: currentGuestPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            transition: 'all 0.15s'
                          }}
                        >
                          <ChevronLeft size={16} />
                          <span>Trước</span>
                        </button>

                        {Array.from({ length: totalGuestRoomPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => handleGuestPageChange(page)}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              border: currentGuestPage === page ? '1px solid #78350f' : '1px solid #cbd5e1',
                              background: currentGuestPage === page ? '#78350f' : 'white',
                              color: currentGuestPage === page ? 'white' : '#334155',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              boxShadow: currentGuestPage === page ? '0 2px 6px rgba(120, 53, 15, 0.3)' : 'none'
                            }}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => handleGuestPageChange(Math.min(totalGuestRoomPages, currentGuestPage + 1))}
                          disabled={currentGuestPage === totalGuestRoomPages}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: currentGuestPage === totalGuestRoomPages ? '#f8fafc' : 'white',
                            color: currentGuestPage === totalGuestRoomPages ? '#94a3b8' : '#334155',
                            cursor: currentGuestPage === totalGuestRoomPages ? 'not-allowed' : 'pointer',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            transition: 'all 0.15s'
                          }}
                        >
                          <span>Sau</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </main>

          {/* 4. Chân trang Footer */}
          <Footer />

          {/* 5. Modal Đặt phòng cho khách (Yêu cầu đăng nhập trước khi đặt) */}
          <BookingModal 
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
            onSubmitBooking={handleBookingSubmit}
            currentUser={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />

          {/* 6. Modal Xem phòng đã đặt của khách */}
          {isClientBookingsOpen && (
            <div className="modal-overlay" onClick={() => setIsClientBookingsOpen(false)} style={{ zIndex: 1100 }}>
              <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setIsClientBookingsOpen(false)}>
                  <X size={18} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Calendar size={22} color="#b45309" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
                    Phòng Đã Đặt Của Bạn ({myBookings.length})
                  </h3>
                </div>

                {/* Thông báo hủy thành công */}
                {cancelSuccessMsg && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.85rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#16a34a" />
                    <span>{cancelSuccessMsg}</span>
                  </div>
                )}

                {myBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <p style={{ fontSize: '1rem', marginBottom: '12px' }}>Bạn chưa có đơn đặt phòng nào tại Khách Sạn Bắc Hương.</p>
                    <button
                      onClick={() => {
                        setIsClientBookingsOpen(false);
                        document.getElementById('rooms-list')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{ background: '#b45309', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Chọn Phòng Đặt Ngay
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                    {myBookings.map((b, idx) => (
                      <div key={b.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '4px' }}>
                              {b.bookingCode || `#BH-${idx + 1}`}
                            </span>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
                              Phòng {b.roomNumber} - {b.roomName}
                            </h4>
                          </div>
                          <span style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: b.status === 'CONFIRMED' ? '#dcfce7' : (b.status === 'PENDING' ? '#fef3c7' : (b.status === 'REJECTED' ? '#fee2e2' : '#f1f5f9')),
                            color: b.status === 'CONFIRMED' ? '#15803d' : (b.status === 'PENDING' ? '#b45309' : (b.status === 'REJECTED' ? '#b91c1c' : '#64748b')),
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {b.status === 'CONFIRMED' ? (
                              <>
                                <CheckCircle2 size={13} />
                                <span>Đã Được Khách Sạn Xác Nhận</span>
                              </>
                            ) : b.status === 'PENDING' ? (
                              <>
                                <Clock size={13} />
                                <span>⏳ Chờ Khách Sạn Duyệt</span>
                              </>
                            ) : b.status === 'REJECTED' ? (
                              <>
                                <AlertTriangle size={13} />
                                <span>✕ Khách Sạn Không Thể Tiếp Nhận</span>
                              </>
                            ) : (
                              <span>✕ Đã Hủy</span>
                            )}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                          <div>📅 Nhận phòng: <strong>{b.checkInDate || b.checkIn}</strong> ({b.nights} đêm)</div>
                          <div>💰 Tổng tiền: <strong style={{ color: '#b45309' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalPrice)}</strong></div>
                          <div>👤 Khách: <strong>{b.guestName}</strong></div>
                          <div>📞 SĐT: <strong>{b.guestPhone}</strong></div>
                        </div>

                        {/* HIỂN THỊ LÝ DO NẾU KHÁCH SẠN TỪ CHỐI */}
                        {b.status === 'REJECTED' && (
                          <div style={{
                            marginTop: '10px',
                            padding: '10px 14px',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            fontSize: '0.83rem',
                            color: '#991b1b'
                          }}>
                            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <AlertTriangle size={15} />
                              <span>Lý do khách sạn chưa thể tiếp nhận:</span>
                            </div>
                            <div style={{ fontStyle: 'italic', marginBottom: '6px', color: '#7f1d1d' }}>
                              "{b.rejectionReason || 'Khách sạn hiện kín phòng hoặc đang bảo trì vào khung giờ này.'}"
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#991b1b', borderTop: '1px dashed #fca5a5', paddingTop: '6px' }}>
                              📞 Quý khách có thể chọn phòng khác hoặc gọi hotline Lễ tân: <strong style={{ color: '#0284c7' }}>0935.911.889</strong>
                            </div>
                          </div>
                        )}

                        {/* NÚT HỦY ĐẶT PHÒNG CHO KHÁCH (CHỈ HIỆN KHI ĐƠN CÒN HIỆU LỰC HOẶC CHỜ DUYỆT) */}
                        {b.status !== 'CANCELLED' && b.status !== 'REJECTED' && (
                          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => setCancelConfirmBooking(b)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#fff1f2',
                                color: '#e11d48',
                                border: '1px solid #fecdd3',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#ffe4e6'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff1f2'}
                            >
                              <Trash2 size={14} />
                              <span>Hủy Đặt Phòng</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Xác Nhận Hủy Đặt Phòng Của Khách */}
          {cancelConfirmBooking && (
            <div className="modal-overlay" onClick={() => setCancelConfirmBooking(null)} style={{ zIndex: 1250 }}>
              <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center', padding: '28px 24px' }} onClick={e => e.stopPropagation()}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#dc2626' }}>
                  <AlertTriangle size={30} />
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
                  Xác Nhận Hủy Đặt Phòng?
                </h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
                  Quý khách có chắc chắn muốn hủy đơn đặt phòng <strong>{cancelConfirmBooking.bookingCode}</strong> (Phòng {cancelConfirmBooking.roomNumber} - {cancelConfirmBooking.roomName})?
                </p>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', fontSize: '0.84rem', color: '#b91c1c', textAlign: 'left', marginBottom: '22px' }}>
                  ⚠️ <b>Lưu ý:</b> Sau khi hủy, phòng sẽ được tự động mở lại cho khách khác đặt và đơn này sẽ được xóa khỏi hệ thống.
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={async () => {
                      const b = cancelConfirmBooking;
                      setCancelConfirmBooking(null);
                      await handleCancelBooking(b.id, b.roomId);
                      setCancelSuccessMsg(`Đã hủy thành công đơn ${b.bookingCode}! Phòng ${b.roomNumber} đã được giải phóng.`);
                      setTimeout(() => setCancelSuccessMsg(''), 5000);
                    }}
                    style={{
                      flex: 1,
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '11px 18px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Xác Nhận Hủy Phòng
                  </button>
                  <button
                    onClick={() => setCancelConfirmBooking(null)}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      padding: '11px 18px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Không, Giữ Lại Đơn
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. Modal Thông Báo Đặt Phòng Thành Công Rực Rỡ */}
          {bookingSuccess && (
            <div className="modal-overlay" onClick={() => setBookingSuccess(null)} style={{ zIndex: 1200 }}>
              <div className="modal-content" style={{ maxWidth: '520px', textAlign: 'center', padding: '30px 24px' }} onClick={e => e.stopPropagation()}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Clock size={36} color="#b45309" />
                </div>

                <div style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', fontWeight: 800, fontSize: '0.78rem', padding: '3px 12px', borderRadius: '20px', marginBottom: '8px' }}>
                  ⏳ ĐANG CHỜ KHÁCH SẠN XÁC NHẬN
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#78350f', marginBottom: '6px' }}>
                  Yêu Cầu Đặt Phòng Đã Gửi Thành Công!
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Khách Sạn Bắc Hương đã nhận được yêu cầu đặt phòng của bạn và đang tiến hành kiểm tra để duyệt đơn.
                </p>

                {/* Hộp chi tiết đơn */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '18px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Mã đặt phòng:</span>
                    <strong style={{ color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                      {bookingSuccess.bookingCode}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Hạng phòng:</span>
                    <strong>Phòng {bookingSuccess.roomNumber} - {bookingSuccess.roomName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Khách lưu trú:</span>
                    <strong>{bookingSuccess.guestName} ({bookingSuccess.guestPhone})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Thời gian:</span>
                    <strong>{bookingSuccess.checkInDate || bookingSuccess.checkIn} ({bookingSuccess.nights} đêm)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    <span style={{ color: '#64748b' }}>Tổng thanh toán:</span>
                    <strong style={{ color: '#b45309', fontSize: '1.05rem' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookingSuccess.totalPrice)}
                    </strong>
                  </div>
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', fontSize: '0.84rem', color: '#92400e', textAlign: 'left', lineHeight: 1.5 }}>
                  <div>🛎️ <b>Thông báo:</b> Yêu cầu đặt phòng đã gửi tới bộ phận Quản lý & Lễ tân khách sạn.</div>
                  <div style={{ marginTop: '4px' }}>📧 <b>Email xác nhận:</b> Ngay khi khách sạn nhấn duyệt, thư xác nhận đặt phòng chính thức sẽ được gửi tự động tới hòm thư: <b>{bookingSuccess.guestEmail}</b>.</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setBookingSuccess(null);
                      setIsClientBookingsOpen(true);
                    }}
                    style={{
                      flex: 1,
                      background: '#b45309',
                      color: 'white',
                      border: 'none',
                      padding: '11px 18px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Xem Phòng Đã Đặt
                  </button>
                  <button
                    onClick={() => setBookingSuccess(null)}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      padding: '11px 18px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 8. Modal Xem phòng đã lưu / Yêu thích */}
          <SavedRoomsModal 
            isOpen={isSavedRoomsOpen}
            onClose={() => setIsSavedRoomsOpen(false)}
            savedRooms={savedRooms}
            onRemoveSaved={handleRemoveSavedRoom}
            onBookRoom={(room) => setSelectedRoom(room)}
          />
        </div>
      )}

      {/* ================= CÁC MODAL HỆ THỐNG ================= */}
      {/* 1. Modal Đăng nhập chung */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 2. Modal Đổi Mật Khẩu cho Khách Hàng */}
      <CustomerChangePasswordModal 
        isOpen={isCustomerChangePwdOpen}
        onClose={() => setIsCustomerChangePwdOpen(false)}
        currentUser={user}
      />

      {/* CÁCH 3: MODAL THÔNG BÁO LỖI KẾT NỐI DATABASE KHI KHÁCH ĐẶT PHÒNG */}
      <DbErrorModal 
        isOpen={!!dbErrorModal}
        onClose={() => setDbErrorModal(null)}
        onRetry={() => checkDbConnection(true)}
        isRetrying={isCheckingDb}
        bookingDetails={dbErrorModal}
      />

      {/* 4. MODAL POPUP CHUÔNG LỄ TÂN KHI CÓ KHÁCH ĐẶT PHÒNG (DÀNH CHO ADMIN & LỄ TÂN) */}
      {pendingAlertBooking && (isAdminOrStaff || isAdminMode) && (
        <NewBookingAlertModal 
          booking={pendingAlertBooking}
          onClose={() => {
            dismissedBookingIdsRef.current.add(pendingAlertBooking.id);
            setPendingAlertBooking(null);
          }}
          onApprove={handleApproveBooking}
          onReject={handleRejectBooking}
          onViewBookingsTable={() => {
            dismissedBookingIdsRef.current.add(pendingAlertBooking.id);
            setIsAdminMode(true);
            setAdminActiveTab('BOOKINGS');
            setPendingAlertBooking(null);
          }}
        />
      )}

      {/* Floating Toast Thông Báo Kết Nối */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: toastMessage.type === 'success' ? '#15803d' : '#b91c1c',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
