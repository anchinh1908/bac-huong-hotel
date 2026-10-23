import React, { useState, useEffect } from 'react';
import { 
  Building, MapPin, Phone, Mail, Clock, Globe, Image, Save, RotateCcw, 
  Plus, Trash2, CheckCircle2, AlertCircle, Eye, Sparkles, Navigation, Info
} from 'lucide-react';

export default function AdminHotelInfo({ hotelInfo, onUpdateHotelInfo, onResetHotelInfo }) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    address: '',
    hotline: '',
    landline: '',
    email: '',
    adminEmail: '',
    googleMapsUrl: '',
    openTime: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    description: '',
    heroImage: '',
    customPolicies: []
  });

  const [activeSubTab, setActiveSubTab] = useState('BASIC'); // 'BASIC', 'CONTACT', 'HOURS', 'POLICIES', 'PREVIEW'
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync khi hotelInfo truyền vào thay đổi
  useEffect(() => {
    if (hotelInfo) {
      let policies = [];
      try {
        if (typeof hotelInfo.customPolicies === 'string') {
          policies = JSON.parse(hotelInfo.customPolicies || '[]');
        } else if (Array.isArray(hotelInfo.customPolicies)) {
          policies = hotelInfo.customPolicies;
        }
      } catch (e) {
        policies = [];
      }

      setFormData({
        name: hotelInfo.name || '',
        tagline: hotelInfo.tagline || '',
        address: hotelInfo.address || '',
        hotline: hotelInfo.hotline || '',
        landline: hotelInfo.landline || '',
        email: hotelInfo.email || '',
        adminEmail: hotelInfo.adminEmail || '',
        googleMapsUrl: hotelInfo.googleMapsUrl || '',
        openTime: hotelInfo.openTime || '',
        checkInTime: hotelInfo.checkInTime || '14:00',
        checkOutTime: hotelInfo.checkOutTime || '12:00',
        description: hotelInfo.description || '',
        heroImage: hotelInfo.heroImage || '',
        customPolicies: policies
      });
    }
  }, [hotelInfo]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Thêm chính sách / thông tin mới
  const handleAddPolicy = () => {
    const newPolicy = {
      id: 'p_' + Date.now(),
      title: 'Thông tin / Chính sách mới',
      content: 'Nhập nội dung chi tiết tại đây...'
    };
    setFormData(prev => ({
      ...prev,
      customPolicies: [...prev.customPolicies, newPolicy]
    }));
  };

  // Sửa chính sách
  const handlePolicyChange = (index, field, value) => {
    const updated = [...formData.customPolicies];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, customPolicies: updated }));
  };

  // Xóa chính sách
  const handleDeletePolicy = (index) => {
    const updated = formData.customPolicies.filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, customPolicies: updated }));
  };

  // Gửi lưu cập nhật
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        ...formData,
        customPolicies: JSON.stringify(formData.customPolicies)
      };
      const ok = await onUpdateHotelInfo(payload);
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Khôi phục mặc định
  const handleReset = async () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục toàn bộ thông tin khách sạn về mặc định ban đầu không?")) {
      setIsSaving(true);
      try {
        await onResetHotelInfo();
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* HEADER QUẢN LÝ THÔNG TIN KHÁCH SẠN */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px 28px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #78350f, #b45309)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 10px rgba(180, 83, 9, 0.25)'
          }}>
            <Building size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
              Quản Lý Toàn Bộ Thông Tin Khách Sạn
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
              Quản trị viên có toàn quyền Thêm / Sửa / Xóa tên, địa chỉ, hotline, giờ giấc và các chính sách dịch vụ.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 22px',
              borderRadius: '8px',
              border: 'none',
              background: '#15803d',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(21, 128, 61, 0.3)'
            }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #86efac',
          borderRadius: '10px',
          padding: '12px 18px',
          color: '#15803d',
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <CheckCircle2 size={18} />
          <span>✅ Đã lưu và cập nhật toàn bộ thông tin khách sạn thành công lên hệ thống & cơ sở dữ liệu!</span>
        </div>
      )}

      {/* THANH TAB PHÂN LOẠI THÔNG TIN */}
      <div style={{
        display: 'flex',
        gap: '6px',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'BASIC', label: '1. Thông Tin Cơ Bản', icon: Building },
          { id: 'CONTACT', label: '2. Địa Chỉ & Liên Hệ', icon: MapPin },
          { id: 'HOURS', label: '3. Giờ Giấc Nhận/Trả Phòng', icon: Clock },
          { id: 'POLICIES', label: `4. Chính Sách & Thông Tin Bổ Sung (${formData.customPolicies.length})`, icon: Sparkles },
          { id: 'PREVIEW', label: '5. Xem Trước Thực Tế', icon: Eye }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '11px 18px',
                border: 'none',
                background: isActive ? '#78350f' : 'transparent',
                color: isActive ? 'white' : '#64748b',
                borderRadius: '8px 8px 0 0',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* FORM NỘI DUNG TỪNG TAB */}
      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        {/* TAB 1: THÔNG TIN CƠ BẢN */}
        {activeSubTab === 'BASIC' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
                Thông Tin Thương Hiệu Khách Sạn
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Tên khách sạn và khẩu hiệu xuất hiện trên tiêu đề trang, logo và banner chính.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Tên khách sạn *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Ví dụ: Khách Sạn Bắc Hương"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Khẩu hiệu / Slogan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={e => handleChange('tagline', e.target.value)}
                  placeholder="Ví dụ: Điểm Dừng Chân Lý Tưởng Giữa Lòng Cao Nguyên Kon Tum"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Mô tả giới thiệu tổng quan khách sạn
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Nhập mô tả giới thiệu về vị trí, tiện nghi và ưu điểm nổi bật..."
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Đường dẫn hình ảnh bìa / Banner đại diện (URL)
              </label>
              <input
                type="url"
                value={formData.heroImage}
                onChange={e => handleChange('heroImage', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
              {formData.heroImage && (
                <div style={{ marginTop: '10px', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img src={formData.heroImage} alt="Banner preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ĐỊA CHỈ & LIÊN HỆ */}
        {activeSubTab === 'CONTACT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
                Địa Chỉ & Kênh Liên Hệ
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Thông tin này sẽ hiển thị ở đầu trang (Top bar), chân trang (Footer) và email gửi cho khách.
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                📍 Địa chỉ trụ sở khách sạn *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="Ví dụ: 196 Trần Hưng Đạo, Phường Quyết Thắng, TP. Kon Tum, Tỉnh Kon Tum"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  📞 Số điện thoại Hotline (Di động) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hotline}
                  onChange={e => handleChange('hotline', e.target.value)}
                  placeholder="0935.911.889 - 0828.211.222"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  ☎️ Số điện thoại bàn (Cố định)
                </label>
                <input
                  type="text"
                  value={formData.landline}
                  onChange={e => handleChange('landline', e.target.value)}
                  placeholder="0260.3862.666"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  ✉️ Email Lễ tân tiếp nhận khách *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="khachsanbachuong.kontum@gmail.com"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  🛡️ Email Quản trị viên (Nhận thông báo đơn đặt phòng)
                </label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={e => handleChange('adminEmail', e.target.value)}
                  placeholder="admin.bachuong@gmail.com"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                🗺️ Đường dẫn Google Maps (Chỉ đường trực tiếp)
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={e => handleChange('googleMapsUrl', e.target.value)}
                placeholder="https://www.google.com/maps/place/..."
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
              />
              {formData.googleMapsUrl && (
                <div style={{ marginTop: '8px' }}>
                  <a
                    href={formData.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.84rem', color: '#b45309', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Navigation size={14} /> Thử mở liên kết chỉ đường trên Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GIỜ GIẤC HOẠT ĐỘNG */}
        {activeSubTab === 'HOURS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
                Quy Định Giờ Giấc Nhận & Trả Phòng
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Khung thời gian chuẩn của khách sạn để thông báo và áp dụng trong hợp đồng/đơn đặt phòng.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  🕒 Giờ nhận phòng tiêu chuẩn (Check-in) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.checkInTime}
                  onChange={e => handleChange('checkInTime', e.target.value)}
                  placeholder="Ví dụ: 14:00"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  🕛 Giờ trả phòng tiêu chuẩn (Check-out) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.checkOutTime}
                  onChange={e => handleChange('checkOutTime', e.target.value)}
                  placeholder="Ví dụ: 12:00"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  🛎️ Thời gian phục vụ của Lễ tân *
                </label>
                <input
                  type="text"
                  required
                  value={formData.openTime}
                  onChange={e => handleChange('openTime', e.target.value)}
                  placeholder="Ví dụ: Lễ tân phục vụ 24/7"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.86rem', color: '#475569' }}>
              <div style={{ fontWeight: 700, color: '#78350f', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={16} /> Ghi chú nghiệp vụ lễ tân:
              </div>
              <div>
                Thời gian trả phòng tiêu chuẩn ({formData.checkOutTime}) sẽ được hệ thống dùng làm mốc tính toán ngày dự kiến trả phòng tự động khi giao phòng tại quầy hoặc duyệt đơn đặt phòng.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHÍNH SÁCH & THÔNG TIN BỔ SUNG (THÊM / SỬA / XÓA) */}
        {activeSubTab === 'POLICIES' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
                  Chính Sách & Các Mục Thông Tin Khách Sạn
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                  Quản trị viên có thể Thêm, Sửa hoặc Xóa từng mục thông tin như: Bãi đỗ xe, Đưa đón sân bay, Giặt ủi...
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPolicy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#15803d',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(21, 128, 61, 0.25)'
                }}
              >
                <Plus size={16} />
                <span>Thêm Mục Thông Tin Mới</span>
              </button>
            </div>

            {formData.customPolicies.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#64748b' }}>
                <Info size={28} style={{ margin: '0 auto 8px', display: 'block', color: '#94a3b8' }} />
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#475569' }}>Chưa có mục chính sách bổ sung nào</div>
                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>Bấm nút "Thêm Mục Thông Tin Mới" phía trên để tạo thêm các điều khoản, chính sách hoặc ghi chú cho khách sạn.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {formData.customPolicies.map((policy, idx) => (
                  <div 
                    key={policy.id || idx} 
                    style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      padding: '16px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#78350f', background: '#fef3c7', padding: '3px 8px', borderRadius: '4px' }}>
                        Mục #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeletePolicy(idx)}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          color: '#dc2626',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Xóa mục thông tin này"
                      >
                        <Trash2 size={14} />
                        <span>Xóa mục</span>
                      </button>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Tiêu đề mục *
                      </label>
                      <input
                        type="text"
                        required
                        value={policy.title}
                        onChange={e => handlePolicyChange(idx, 'title', e.target.value)}
                        placeholder="Ví dụ: Chính sách bãi đậu xe & đưa đón"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Nội dung chi tiết *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={policy.content}
                        onChange={e => handlePolicyChange(idx, 'content', e.target.value)}
                        placeholder="Nhập nội dung chi tiết của điều khoản này..."
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', lineHeight: 1.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: XEM TRƯỚC THỰC TẾ (PREVIEW) */}
        {activeSubTab === 'PREVIEW' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
                Xem Trước Giao Diện Với Thông Tin Vừa Điền
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Dưới đây là hình ảnh xem trước cách các thông tin sẽ hiển thị trên Website Khách sạn Bắc Hương.
              </p>
            </div>

            {/* Mô phỏng Top Bar */}
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                1. Mô phỏng Thanh liên hệ trên cùng (Top Contact Bar):
              </div>
              <div style={{ background: '#78350f', color: 'white', padding: '12px 20px', borderRadius: '8px', fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} color="#fde68a" />
                  <span>{formData.address || '196 Trần Hưng Đạo, Kon Tum'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={14} color="#fde68a" />
                    <span>Hotline: <b>{formData.hotline || '0935.911.889'}</b></span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={14} color="#fde68a" />
                    <span>{formData.email || 'email@bachuong.com'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Mô phỏng Card Khách Sạn */}
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                2. Thẻ hồ sơ thông tin khách sạn:
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#78350f', margin: '0 0 6px 0' }}>
                  {formData.name || 'Khách Sạn Bắc Hương'}
                </h2>
                <div style={{ color: '#b45309', fontWeight: 600, fontSize: '0.92rem', marginBottom: '12px' }}>
                  {formData.tagline || 'Khẩu hiệu khách sạn'}
                </div>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  {formData.description || 'Mô tả tóm tắt về khách sạn...'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', fontSize: '0.85rem', color: '#334155' }}>
                  <div>📍 Địa chỉ: <b>{formData.address}</b></div>
                  <div>📞 Hotline: <b>{formData.hotline}</b></div>
                  <div>☎️ Điện thoại bàn: <b>{formData.landline || 'Chưa cập nhật'}</b></div>
                  <div>✉️ Email: <b>{formData.email}</b></div>
                  <div>🕒 Giờ nhận/trả: <b>{formData.checkInTime} / {formData.checkOutTime}</b></div>
                  <div>🛎️ Phục vụ: <b>{formData.openTime}</b></div>
                </div>

                {formData.customPolicies.length > 0 && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
                    <div style={{ fontWeight: 700, color: '#78350f', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Các chính sách & dịch vụ nổi bật ({formData.customPolicies.length}):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.customPolicies.map((p, idx) => (
                        <div key={idx} style={{ background: 'white', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.84rem' }}>
                          <b style={{ color: '#0f172a' }}>✓ {p.title}:</b> <span style={{ color: '#475569' }}>{p.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NÚT LƯU Ở CUỐI FORM */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9', gap: '12px' }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '8px',
              border: 'none',
              background: '#15803d',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(21, 128, 61, 0.3)'
            }}
          >
            <Save size={18} />
            <span>{isSaving ? 'Đang lưu cập nhật...' : 'Lưu Thay Đổi Thông Tin Khách Sạn'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
