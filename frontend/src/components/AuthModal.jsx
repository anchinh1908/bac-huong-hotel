import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User, Phone, KeyRound, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import GoogleAccountChooserModal from './GoogleAccountChooserModal';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  // Mode: 'LOGIN', 'REGISTER', 'FORGOT_PASSWORD'
  const [mode, setMode] = useState('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const googleBtnContainerRef = useRef(null);

  // Quên mật khẩu OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Giải mã JWT credential từ Google Identity Services
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // Khởi tạo Google Identity Services (GIS) và render nút chuẩn của Google
  useEffect(() => {
    if (!isOpen) return;

    const initGoogle = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: "135457415775-ed5onq2pcr2tden14og2669k4faqk1dp.apps.googleusercontent.com",
            callback: async (response) => {
              if (response && response.credential) {
                const payload = parseJwt(response.credential);
                if (payload) {
                  await executeGoogleLogin(payload.email, payload.name, payload.picture);
                }
              }
            },
            auto_select: false
          });

          // Render nút Google chuẩn trực tiếp vào container
          if (googleBtnContainerRef.current) {
            googleBtnContainerRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              theme: "outline",
              size: "large",
              text: "continue_with",
              shape: "rectangular",
              width: 380,
              logo_alignment: "left"
            });
            setGisLoaded(true);
          }

          // Kích hoạt Google One-Tap nếu tài khoản đã đăng nhập trên trình duyệt
          window.google.accounts.id.prompt();
        } catch (err) {
          console.log("Google GIS init:", err);
        }
      }
    };

    if (window.google && window.google.accounts) {
      initGoogle();
    } else {
      const timer = setTimeout(initGoogle, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode]);

  // Lắng nghe đăng nhập Google thành công từ cửa sổ popup
  useEffect(() => {
    const handleGoogleMessage = async (event) => {
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { email: gEmail, name: gName, color: gColor } = event.data;
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(gName)}&background=${(gColor || '#00796b').replace('#', '')}&color=fff&size=150`;
        await executeGoogleLogin(gEmail, gName, avatar);
      }
    };
    window.addEventListener('message', handleGoogleMessage);
    return () => window.removeEventListener('message', handleGoogleMessage);
  }, []);

  // 1. Thực hiện Đăng nhập Google (Chọn tài khoản thật hoặc tự nhập)
  const executeGoogleLogin = async (userEmail, userName, userAvatar) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const googleUser = {
      email: userEmail,
      name: userName,
      avatar: userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };

    try {
      const res = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser)
      });
      const data = await res.json();
      if (res.ok && data.account) {
        onLoginSuccess(data.account);
        onClose();
      } else {
        setMessage({ type: 'error', text: data.message || 'Đăng nhập Google không thành công!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ Backend (Cổng 8080)!' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Đăng nhập truyền thống
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const data = await res.json();
      if (res.ok && data.account) {
        onLoginSuccess(data.account);
        onClose();
      } else {
        setMessage({ type: 'error', text: data.message || 'Sai tài khoản hoặc mật khẩu!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ Backend (Cổng 8080)!' });
    } finally {
      setLoading(false);
    }
  };

  // 3. Đăng ký tài khoản
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Kiểm tra định dạng Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test((email || '').trim())) {
      setMessage({ type: 'error', text: 'Email không đúng định dạng (Ví dụ: vidu@gmail.com)!' });
      return;
    }

    // Kiểm tra định dạng Số điện thoại (Việt Nam 10 chữ số)
    const phoneClean = (phone || '').replace(/[\s.-]/g, '');
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(phoneClean)) {
      setMessage({ type: 'error', text: 'Số điện thoại không đúng định dạng (Phải gồm 10 số, ví dụ: 0912345678, đầu 03, 05, 07, 08, 09)!' });
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if ((password || '').length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có tối thiểu 6 ký tự!' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, fullName, phone: phoneClean })
      });
      const data = await res.json();
      if (res.ok && data.account) {
        onLoginSuccess(data.account);
        onClose();
      } else {
        setMessage({ type: 'error', text: data.message || 'Đăng ký thất bại!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ Backend để đăng ký!' });
    } finally {
      setLoading(false);
    }
  };

  // 4. Quên mật khẩu: Yêu cầu OTP qua Gmail
  const handleRequestOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      setMessage({ type: 'error', text: 'Vui lòng nhập Email hợp lệ để nhận mã OTP!' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:8080/api/auth/forgot-password/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message || 'Không tìm thấy tài khoản!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Không thể gửi mã OTP. Vui lòng kiểm tra lại kết nối máy chủ!' });
    } finally {
      setLoading(false);
    }
  };

  // 5. Xác thực OTP & Đặt mật khẩu mới
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:8080/api/auth/forgot-password/verify-and-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMode('LOGIN');
        setOtpSent(false);
        setMessage({ type: 'success', text: '✅ Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Mã OTP không chính xác!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Xác thực OTP thất bại do không kết nối được máy chủ!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Tiêu đề Modal */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#b45309' }}>
            <ShieldCheck size={26} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#78350f' }}>
            {mode === 'LOGIN' && 'Đăng Nhập Khách Sạn Bắc Hương'}
            {mode === 'REGISTER' && 'Tạo Tài Khoản Khách Hàng'}
            {mode === 'FORGOT_PASSWORD' && 'Khôi Phục Mật Khẩu Qua Gmail'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
            {mode === 'LOGIN' && 'Đăng nhập để nhận mã ưu đãi và đặt phòng tức thì'}
            {mode === 'REGISTER' && 'Đăng ký tài khoản để quản lý đơn phòng dễ dàng'}
            {mode === 'FORGOT_PASSWORD' && 'Nhận mã OTP bảo mật 6 số gửi thẳng vào hộp thư Gmail'}
          </p>
        </div>

        {/* Thông báo lỗi / thành công */}
        {message.text && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: message.type === 'error' ? '#fee2e2' : '#dcfce7',
            color: message.type === 'error' ? '#b91c1c' : '#15803d',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {message.type === 'error' ? '⚠️' : <CheckCircle2 size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* NÚT ĐĂNG NHẬP GOOGLE 1-CLICK Ở MÀN HÌNH CHÍNH */}
        {mode !== 'FORGOT_PASSWORD' && (
          <div style={{ marginBottom: '20px' }}>
            {/* 1. Nút Google chính thức của Google Identity Services (GIS) */}
            <div 
              ref={googleBtnContainerRef} 
              style={{ width: '100%', display: gisLoaded ? 'flex' : 'none', justifyContent: 'center' }} 
            />

            {/* 2. Nút bấm dự phòng khi GIS đang nạp hoặc cần mở giao diện Dark Theme */}
            {!gisLoaded && (
              <button
                type="button"
                onClick={() => {
                  setMessage({ type: '', text: '' });
                  if (window.google && window.google.accounts && window.google.accounts.id) {
                    try {
                      window.google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                          setIsGoogleModalOpen(true);
                        }
                      });
                      return;
                    } catch (e) {
                      console.log("GIS prompt error:", e);
                    }
                  }
                  setIsGoogleModalOpen(true);
                }}
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '11px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: 'white',
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}
              >
                {/* Google SVG Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Tiếp tục với Google</span>
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0', color: '#94a3b8', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ padding: '0 10px' }}>HOẶC DÙNG EMAIL</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>
          </div>
        )}

        {/* 1. FORM ĐĂNG NHẬP */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleEmailLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Email hoặc Tên đăng nhập *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px' }}>
                <Mail size={16} color="#64748b" />
                <input
                  type="text"
                  required
                  placeholder="admin, letan01 hoặc email của bạn..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Mật khẩu *</label>
                <button
                  type="button"
                  onClick={() => setMode('FORGOT_PASSWORD')}
                  style={{ background: 'none', border: 'none', color: '#b45309', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px' }}>
                <Lock size={16} color="#64748b" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-book-now"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '6px' }}
            >
              {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#64748b' }}>
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                style={{ background: 'none', border: 'none', color: '#b45309', fontWeight: 700, cursor: 'pointer' }}
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        )}

        {/* 2. FORM ĐĂNG KÝ */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Họ và tên *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px' }}>
                <User size={16} color="#64748b" />
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email nhận thông báo *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px' }}>
                <Mail size={16} color="#64748b" />
                <input
                  type="email"
                  required
                  placeholder="vidu@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Số điện thoại *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px' }}>
                <Phone size={16} color="#64748b" />
                <input
                  type="tel"
                  required
                  placeholder="0912345678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Mật khẩu *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px' }}>
                <Lock size={16} color="#64748b" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-book-now"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản Ngay'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#64748b' }}>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                style={{ background: 'none', border: 'none', color: '#b45309', fontWeight: 700, cursor: 'pointer' }}
              >
                Đăng nhập
              </button>
            </div>
          </form>
        )}

        {/* 3. FORM QUÊN MẬT KHẨU / XÁC THỰC QUA GMAIL */}
        {mode === 'FORGOT_PASSWORD' && (
          <div>
            {!otpSent ? (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Nhập địa chỉ Gmail của bạn:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px' }}>
                    <Mail size={16} color="#64748b" />
                    <input
                      type="email"
                      required
                      placeholder="vidu@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="btn-book-now"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  {loading ? 'Đang gửi mã...' : 'Gửi Mã Xác Thực OTP Về Gmail'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Mã xác thực OTP 6 số (trong hộp thư Gmail) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px' }}>
                    <KeyRound size={16} color="#b45309" />
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="123456"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1.1rem', letterSpacing: '4px', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Mật khẩu mới *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px' }}>
                    <Lock size={16} color="#64748b" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-book-now"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  {loading ? 'Đang cập nhật...' : 'Xác Nhận & Đổi Mật Khẩu Mới'}
                </button>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => { setMode('LOGIN'); setOtpSent(false); }}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Quay lại đăng nhập
              </button>
            </div>
          </div>
        )}

        {/* Modal đăng nhập Google chuẩn Dark Theme theo hình 2 và hình 3 */}
        <GoogleAccountChooserModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          onLoginSuccess={(account) => {
            setIsGoogleModalOpen(false);
            onLoginSuccess(account);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
