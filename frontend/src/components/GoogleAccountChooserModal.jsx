import React, { useState, useEffect } from 'react';
import { User, MinusCircle, Trash2, ChevronDown, X, Eye, EyeOff, Globe, ExternalLink } from 'lucide-react';

export default function GoogleAccountChooserModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  // Ngôn ngữ: 'en' hoặc 'vi'
  const [lang, setLang] = useState('en');

  // Lấy danh sách tài khoản đã lưu từ localStorage (Hoàn toàn động, không gán cứng)
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('google_accounts_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Chế độ màn hình: Nếu chưa có tài khoản nào (như tab ẩn danh InPrivate) -> Hiện thẳng Sign in (Hình 2)
  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem('google_accounts_list');
      const list = saved ? JSON.parse(saved) : [];
      return list && list.length > 0 ? 'CHOOSER' : 'IDENTIFIER';
    } catch {
      return 'IDENTIFIER';
    }
  });

  // Mỗi khi modal mở lại, tự động đọc lại bộ nhớ trình duyệt để hiển thị đúng thực tế
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('google_accounts_list');
        const list = saved ? JSON.parse(saved) : [];
        setAccounts(list);
        if (list && list.length > 0) {
          setView('CHOOSER');
        } else {
          setView('IDENTIFIER');
        }
      } catch {
        setAccounts([]);
        setView('IDENTIFIER');
      }
      setEmailInput('');
      setEmailError('');
      setPasswordInput('');
      setIsRemoving(false);
    }
  }, [isOpen]);

  // Trạng thái xóa tài khoản
  const [isRemoving, setIsRemoving] = useState(false);

  // Form nhập Email / Phone (Hình 2)
  const [emailInput, setEmailInput] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Form nhập Password
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lưu danh sách tài khoản vào localStorage
  const saveAccountsList = (newList) => {
    setAccounts(newList);
    try {
      localStorage.setItem('google_accounts_list', JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  // Xóa 1 tài khoản khỏi danh sách
  const handleRemoveAccount = (emailToRemove) => {
    const updated = accounts.filter(a => a.email !== emailToRemove);
    saveAccountsList(updated);
    if (updated.length === 0) {
      setIsRemoving(false);
      setView('IDENTIFIER');
    }
  };

  // Khi chọn một tài khoản từ danh sách (Hình 3)
  const handleSelectAccount = (acc) => {
    if (isRemoving) {
      handleRemoveAccount(acc.email);
      return;
    }
    setSelectedAccount(acc);
    // Đi tới màn hình nhập mật khẩu (View Password)
    setPasswordInput('');
    setView('PASSWORD');
  };

  // Khi bấm "Next" ở màn hình Email or phone (Hình 2)
  const handleEmailNext = (e) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setEmailError(lang === 'vi' ? 'Nhập email hoặc số điện thoại' : 'Enter an email or phone number');
      return;
    }
    if (!trimmed.includes('@')) {
      setEmailError(lang === 'vi' ? 'Không tìm thấy tài khoản Google của bạn' : "Couldn't find your Google Account");
      return;
    }
    setEmailError('');

    // Kiểm tra xem email này đã có trong danh sách chưa
    let existing = accounts.find(a => a.email.toLowerCase() === trimmed.toLowerCase());
    if (!existing) {
      const derivedName = trimmed.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const colors = ['#00796b', '#7b1fa2', '#1976d2', '#d32f2f', '#f57c00'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      existing = {
        name: derivedName,
        email: trimmed,
        avatarLetter: derivedName.charAt(0).toUpperCase() || 'U',
        color: randomColor
      };
      // Lưu vào danh sách tài khoản
      const updated = [...accounts, existing];
      saveAccountsList(updated);
    }

    setSelectedAccount(existing);
    setPasswordInput('');
    setView('PASSWORD');
  };

  // Hoàn tất xác thực Google và đăng nhập vào Khách Sạn Bắc Hương
  const handleFinishLogin = async () => {
    if (!selectedAccount) return;
    setLoading(true);

    const googleUser = {
      email: selectedAccount.email,
      name: selectedAccount.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAccount.name)}&background=${selectedAccount.color.replace('#', '')}&color=fff&size=150`
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
        return;
      } else {
        alert(data.message || 'Đăng nhập Google thất bại!');
      }
    } catch (err) {
      alert('Không thể kết nối đến máy chủ Backend (Cổng 8080)!');
    } finally {
      setLoading(false);
    }
  };

  // Text đa ngôn ngữ chuẩn Google
  const t = {
    chooseAccount: lang === 'vi' ? 'Chọn một tài khoản' : 'Choose an account',
    toContinue: lang === 'vi' ? 'để tiếp tục đến Khách Sạn Bắc Hương' : 'to continue to Khách Sạn Bắc Hương',
    signedOut: lang === 'vi' ? 'Đã đăng xuất' : 'Signed out',
    useAnother: lang === 'vi' ? 'Sử dụng một tài khoản khác' : 'Use another account',
    removeAccount: lang === 'vi' ? 'Xóa tài khoản' : 'Remove an account',
    doneRemoving: lang === 'vi' ? 'Xong' : 'Done',
    signIn: lang === 'vi' ? 'Đăng nhập' : 'Sign in',
    emailOrPhone: lang === 'vi' ? 'Email hoặc số điện thoại' : 'Email or phone',
    forgotEmail: lang === 'vi' ? 'Bạn quên địa chỉ email?' : 'Forgot email?',
    guestModeText: lang === 'vi' 
      ? 'Đây không phải máy tính của bạn? Hãy sử dụng chế độ Khách để đăng nhập một cách riêng tư. '
      : 'Not your computer? Use Guest mode to sign in privately. ',
    learnMore: lang === 'vi' ? 'Tìm hiểu thêm về cách sử dụng chế độ Khách' : 'Learn more about using Guest mode',
    createAccount: lang === 'vi' ? 'Tạo tài khoản' : 'Create account',
    next: lang === 'vi' ? 'Tiếp theo' : 'Next',
    enterPassword: lang === 'vi' ? 'Nhập mật khẩu của bạn' : 'Enter your password',
    showPassword: lang === 'vi' ? 'Hiện mật khẩu' : 'Show password',
    forgotPassword: lang === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?',
    welcome: lang === 'vi' ? 'Chào mừng' : 'Welcome',
    help: lang === 'vi' ? 'Trợ giúp' : 'Help',
    privacy: lang === 'vi' ? 'Quyền riêng tư' : 'Privacy',
    terms: lang === 'vi' ? 'Điều khoản' : 'Terms'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#131314', // Nền đen chuẩn Google Dark Theme
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Google Sans', Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        color: '#e3e3e3',
        overflowY: 'auto'
      }}
    >
      {/* Nút thoát modal ở góc trên cùng */}
      <button
        onClick={onClose}
        title="Đóng / Close"
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: 'none',
          color: '#e3e3e3',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s',
          zIndex: 100000
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
      >
        <X size={18} />
      </button>

      {/* KHUNG THẺ TRUNG TÂM GOOGLE CARD (#1e1f20, bo góc 28px) */}
      <div
        style={{
          width: '100%',
          maxWidth: '448px',
          background: '#1e1f20',
          borderRadius: '28px',
          padding: '40px 36px 36px',
          boxSizing: 'border-box',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          minHeight: view === 'CHOOSER' ? '460px' : '480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* 1. Google 4-Color Logo */}
          <div style={{ marginBottom: '16px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>

          {/* ============================================================== */}
          {/* MÀN HÌNH 1: CHOOSE AN ACCOUNT (HÌNH 3 NGƯỜI DÙNG GỬI)         */}
          {/* ============================================================== */}
          {view === 'CHOOSER' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 400, color: '#e3e3e3', margin: '0 0 8px 0', lineHeight: 1.25 }}>
                {t.chooseAccount}
              </h1>
              <p style={{ fontSize: '14px', color: '#c4c7c5', margin: '0 0 28px 0' }}>
                {t.toContinue}
              </p>

              {/* Danh sách các tài khoản Google */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {accounts.map((acc, idx) => (
                  <div
                    key={acc.email}
                    onClick={() => handleSelectAccount(acc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      borderBottom: idx === accounts.length - 1 && accounts.length > 0 ? '1px solid #444746' : '1px solid #333538',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#282a2c'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Avatar chữ cái bo tròn */}
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: acc.color || '#00796b',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 500
                        }}
                      >
                        {acc.avatarLetter || acc.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#e3e3e3' }}>
                          {acc.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#c4c7c5', marginTop: '2px' }}>
                          {acc.email}
                        </div>
                      </div>
                    </div>

                    {isRemoving ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveAccount(acc.email); }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: '6px'
                        }}
                        title="Xóa tài khoản này"
                      >
                        <MinusCircle size={18} />
                      </button>
                    ) : (
                      <div style={{ fontSize: '12px', color: '#8e918f' }}>
                        {t.signedOut}
                      </div>
                    )}
                  </div>
                ))}

                {/* Nút: Sử dụng một tài khoản khác (Use another account) */}
                <div
                  onClick={() => {
                    setView('IDENTIFIER');
                    setEmailInput('');
                    setEmailError('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 10px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    borderBottom: '1px solid #444746',
                    transition: 'background 0.15s ease',
                    marginTop: '2px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#282a2c'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e3e3e3' }}>
                    <User size={20} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#e3e3e3' }}>
                    {t.useAnother}
                  </div>
                </div>

                {/* Nút: Xóa tài khoản (Remove an account) */}
                {accounts.length > 0 && (
                  <div
                    onClick={() => setIsRemoving(!isRemoving)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 10px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#282a2c'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isRemoving ? '#f87171' : '#e3e3e3' }}>
                      <MinusCircle size={20} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: isRemoving ? '#f87171' : '#e3e3e3' }}>
                      {isRemoving ? t.doneRemoving : t.removeAccount}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MÀN HÌNH 2: SIGN IN - EMAIL OR PHONE (HÌNH 2 NGƯỜI DÙNG GỬI)   */}
          {/* ============================================================== */}
          {view === 'IDENTIFIER' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 400, color: '#e3e3e3', margin: '0 0 8px 0', lineHeight: 1.25 }}>
                {t.signIn}
              </h1>
              <p style={{ fontSize: '14px', color: '#c4c7c5', margin: '0 0 32px 0' }}>
                {t.toContinue}
              </p>

              <form onSubmit={handleEmailNext}>
                {/* Google Outlined Text Field with Floating Style */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <div
                    style={{
                      border: emailError ? '2px solid #f28b82' : (emailFocused ? '2px solid #a8c7fa' : '1px solid #8e918f'),
                      borderRadius: '4px',
                      padding: '16px 14px',
                      position: 'relative',
                      background: 'transparent',
                      transition: 'border 0.15s ease'
                    }}
                  >
                    <label
                      style={{
                        position: 'absolute',
                        top: (emailFocused || emailInput) ? '-9px' : '17px',
                        left: '12px',
                        background: '#1e1f20',
                        padding: '0 4px',
                        fontSize: (emailFocused || emailInput) ? '12px' : '15px',
                        color: emailError ? '#f28b82' : (emailFocused ? '#a8c7fa' : '#c4c7c5'),
                        transition: 'all 0.15s ease',
                        pointerEvents: 'none'
                      }}
                    >
                      {t.emailOrPhone}
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={emailInput}
                      onChange={e => { setEmailInput(e.target.value); setEmailError(''); }}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        color: '#e3e3e3',
                        fontSize: '16px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  {emailError && (
                    <div style={{ color: '#f28b82', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>⚠️ {emailError}</span>
                    </div>
                  )}
                </div>

                {/* Forgot email? link */}
                <div style={{ marginBottom: '36px' }}>
                  <button
                    type="button"
                    onClick={() => alert(lang === 'vi' ? 'Vui lòng nhập địa chỉ Gmail của bạn.' : 'Please enter your Gmail address.')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#a8c7fa',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {t.forgotEmail}
                  </button>
                </div>

                {/* Guest mode disclaimer paragraph */}
                <div style={{ fontSize: '12px', color: '#c4c7c5', lineHeight: '1.5', marginBottom: '32px' }}>
                  {t.guestModeText}
                  <a
                    href="https://support.google.com/chrome/answer/6130773"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#a8c7fa', textDecoration: 'none' }}
                  >
                    {t.learnMore}
                  </a>
                </div>

                {/* Bottom action buttons row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {accounts.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setView('CHOOSER')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#a8c7fa',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '20px'
                      }}
                    >
                      {lang === 'vi' ? '← Quay lại' : '← Back'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => alert(lang === 'vi' ? 'Vui lòng nhập email của bạn để tiếp tục.' : 'Please enter your email to continue.')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#a8c7fa',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '20px'
                      }}
                    >
                      {t.createAccount}
                    </button>
                  )}

                  <button
                    type="submit"
                    style={{
                      background: '#a8c7fa',
                      color: '#041e49',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#d3e3fd'}
                    onMouseLeave={e => e.currentTarget.style.background = '#a8c7fa'}
                  >
                    {t.next}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* MÀN HÌNH 3: NHẬP PASSWORD GOOGLE XÁC THỰC                      */}
          {/* ============================================================== */}
          {view === 'PASSWORD' && selectedAccount && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 400, color: '#e3e3e3', margin: '0 0 10px 0', lineHeight: 1.25 }}>
                {t.welcome}
              </h1>

              {/* Account pill chip */}
              <button
                type="button"
                onClick={() => setView(accounts.length > 1 ? 'CHOOSER' : 'IDENTIFIER')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: '1px solid #444746',
                  borderRadius: '20px',
                  padding: '4px 12px 4px 6px',
                  color: '#e3e3e3',
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginBottom: '28px'
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: selectedAccount.color || '#00796b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {selectedAccount.avatarLetter}
                </div>
                <span>{selectedAccount.email}</span>
                <ChevronDown size={14} color="#c4c7c5" />
              </button>

              <form onSubmit={e => { e.preventDefault(); handleFinishLogin(); }}>
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <div
                    style={{
                      border: passwordFocused ? '2px solid #a8c7fa' : '1px solid #8e918f',
                      borderRadius: '4px',
                      padding: '16px 14px',
                      position: 'relative',
                      background: 'transparent'
                    }}
                  >
                    <label
                      style={{
                        position: 'absolute',
                        top: (passwordFocused || passwordInput) ? '-9px' : '17px',
                        left: '12px',
                        background: '#1e1f20',
                        padding: '0 4px',
                        fontSize: (passwordFocused || passwordInput) ? '12px' : '15px',
                        color: passwordFocused ? '#a8c7fa' : '#c4c7c5',
                        pointerEvents: 'none'
                      }}
                    >
                      {t.enterPassword}
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        color: '#e3e3e3',
                        fontSize: '16px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>

                {/* Checkbox show password */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                  <input
                    type="checkbox"
                    id="showPass"
                    checked={showPassword}
                    onChange={e => setShowPassword(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#a8c7fa', cursor: 'pointer' }}
                  />
                  <label htmlFor="showPass" style={{ fontSize: '13px', color: '#c4c7c5', cursor: 'pointer' }}>
                    {t.showPassword}
                  </label>
                </div>

                {/* Action buttons row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => alert(lang === 'vi' ? 'Bạn có thể bấm [Tiếp theo] để đăng nhập ngay mà không cần mật khẩu.' : 'You can click [Next] to proceed directly.')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#a8c7fa',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {t.forgotPassword}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: '#a8c7fa',
                      color: '#041e49',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? (lang === 'vi' ? 'Đang xác thực...' : 'Authenticating...') : t.next}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* FOOTER BÊN DƯỚI CARD: LANGUAGE + HELP + PRIVACY + TERMS        */}
        {/* ============================================================== */}
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '448px',
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#8e918f',
          padding: '0 8px'
        }}
      >
        {/* Dropdown ngôn ngữ */}
        <div>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            style={{
              background: 'transparent',
              color: '#8e918f',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="en" style={{ background: '#1e1f20', color: '#e3e3e3' }}>English (United States)</option>
            <option value="vi" style={{ background: '#1e1f20', color: '#e3e3e3' }}>Tiếng Việt</option>
          </select>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="https://support.google.com/accounts" target="_blank" rel="noreferrer" style={{ color: '#8e918f', textDecoration: 'none' }}>
            {t.help}
          </a>
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ color: '#8e918f', textDecoration: 'none' }}>
            {t.privacy}
          </a>
          <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" style={{ color: '#8e918f', textDecoration: 'none' }}>
            {t.terms}
          </a>
        </div>
      </div>
    </div>
  );
}
