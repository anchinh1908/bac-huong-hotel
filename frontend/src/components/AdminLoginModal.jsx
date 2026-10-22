import React, { useState } from 'react';
import { X, Shield, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onAdminLoginSuccess }) {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.account) {
        if (data.account.role === 'ADMIN' || data.account.role === 'STAFF') {
          onAdminLoginSuccess(data.account);
          onClose();
        } else {
          setError('Tài khoản này là Khách hàng, không có quyền truy cập trang Quản lý!');
        }
      } else {
        setError(data.message || 'Sai tên đăng nhập hoặc mật khẩu quản trị!');
      }
    } catch {
      setError('Không thể kết nối đến máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div className="modal-content" style={{ maxWidth: '420px', borderTop: '5px solid #78350f' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#78350f', color: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Shield size={26} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#78350f' }}>
            Đăng Nhập Quản Trị Viên
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '4px' }}>
            Dành riêng cho Ban Giám Đốc & Bộ Phận Lễ Tân Khách Sạn Bắc Hương
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Tên tài khoản quản trị *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px' }}>
              <User size={16} color="#64748b" />
              <input
                type="text"
                required
                placeholder="Nhập tên đăng nhập hoặc email quản trị..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Mật khẩu bảo mật *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px' }}>
              <Lock size={16} color="#64748b" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#78350f',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(120, 53, 15, 0.25)'
            }}
          >
            {loading ? 'Đang xác thực...' : 'Truy Cập Hệ Thống Quản Trị'}
          </button>
        </form>
      </div>
    </div>
  );
}
