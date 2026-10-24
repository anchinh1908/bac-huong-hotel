/**
 * Tiện ích hỗ trợ quản lý JWT Token và tự động đính kèm Authorization Header
 */

export const getAuthToken = () => {
  try {
    return localStorage.getItem('bh_token') || '';
  } catch {
    return '';
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('bh_token', token);
    } else {
      localStorage.removeItem('bh_token');
    }
  } catch (e) {
    console.error("Lỗi lưu token:", e);
  }
};

export const clearAuthToken = () => {
  try {
    localStorage.removeItem('bh_token');
  } catch (e) {
    console.error("Lỗi xóa token:", e);
  }
};

/**
 * Hàm fetch có tự động kèm JWT Token vào Header 'Authorization: Bearer <token>'
 */
export const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
