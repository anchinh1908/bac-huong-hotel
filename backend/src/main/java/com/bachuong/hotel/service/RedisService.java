package com.bachuong.hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Dịch vụ Redis trung tâm (RedisService) cho Khách Sạn Bắc Hương:
 * 1. Quản lý Blacklist JWT Token khi người dùng Đăng xuất (Token Revocation).
 * 2. Lưu trữ mã OTP Quên mật khẩu với thời gian tự hủy (TTL - Time To Live).
 * 3. Khóa phân tán (Distributed Lock - SETNX) chống đặt trùng phòng (Overbooking / Race Condition).
 * 4. Tích hợp cơ chế In-Memory Fallback tự động nếu Redis Server cục bộ chưa khởi chạy.
 */
@Service
public class RedisService {

    private static final String BLACKLIST_PREFIX = "blacklist:jwt:";
    private static final String OTP_PREFIX = "otp:reset:";
    private static final String ROOM_LOCK_PREFIX = "lock:room:";

    @Autowired(required = false)
    private StringRedisTemplate stringRedisTemplate;

    // Bộ nhớ dự phòng an toàn (Fallback) khi máy trạm chưa bật dịch vụ Redis
    private final Map<String, FallbackEntry> fallbackStore = new ConcurrentHashMap<>();

    private record FallbackEntry(String value, long expireAtMillis) {
        boolean isExpired() {
            return System.currentTimeMillis() > expireAtMillis;
        }
    }

    // =========================================================================
    // 1. QUẢN LÝ THU HỒI JWT TOKEN (TOKEN BLACKLIST KHI LOGOUT)
    // =========================================================================

    /**
     * Đưa JWT Token vào danh sách đen (Blacklist) trên Redis với thời gian sống bằng thời gian còn lại của Token
     */
    public void blacklistToken(String token, long remainingTtlMillis) {
        if (token == null || remainingTtlMillis <= 0) return;
        String key = BLACKLIST_PREFIX + token;
        try {
            if (stringRedisTemplate != null) {
                stringRedisTemplate.opsForValue().set(key, "REVOKED", remainingTtlMillis, TimeUnit.MILLISECONDS);
                return;
            }
        } catch (Exception e) {
            System.err.println("⚠️ [Redis Fallback] Lưu JWT Blacklist vào bộ nhớ dự phòng: " + e.getMessage());
        }
        fallbackStore.put(key, new FallbackEntry("REVOKED", System.currentTimeMillis() + remainingTtlMillis));
    }

    /**
     * Kiểm tra xem JWT Token có nằm trong Blacklist (đã đăng xuất) hay không
     */
    public boolean isTokenBlacklisted(String token) {
        if (token == null) return false;
        String key = BLACKLIST_PREFIX + token;
        try {
            if (stringRedisTemplate != null) {
                return Boolean.TRUE.equals(stringRedisTemplate.hasKey(key));
            }
        } catch (Exception e) {
            // Chuyển sang kiểm tra ở fallback store
        }
        FallbackEntry entry = fallbackStore.get(key);
        if (entry != null) {
            if (!entry.isExpired()) return true;
            fallbackStore.remove(key);
        }
        return false;
    }

    // =========================================================================
    // 2. QUẢN LÝ MÃ OTP QUÊN MẬT KHẨU VỚI TTL TỰ ĐỘNG HẾT HẠN
    // =========================================================================

    /**
     * Lưu mã OTP khôi phục mật khẩu vào Redis với TTL (ví dụ 10 phút tự hủy)
     */
    public void saveOtp(String email, String otp, long ttlMinutes) {
        if (email == null || otp == null) return;
        String key = OTP_PREFIX + email.trim().toLowerCase();
        try {
            if (stringRedisTemplate != null) {
                stringRedisTemplate.opsForValue().set(key, otp, ttlMinutes, TimeUnit.MINUTES);
                return;
            }
        } catch (Exception e) {
            System.err.println("⚠️ [Redis Fallback] Lưu OTP vào bộ nhớ dự phòng: " + e.getMessage());
        }
        fallbackStore.put(key, new FallbackEntry(otp, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(ttlMinutes)));
    }

    /**
     * Lấy mã OTP từ Redis theo email
     */
    public String getOtp(String email) {
        if (email == null) return null;
        String key = OTP_PREFIX + email.trim().toLowerCase();
        try {
            if (stringRedisTemplate != null) {
                return stringRedisTemplate.opsForValue().get(key);
            }
        } catch (Exception e) {
            // Fallback
        }
        FallbackEntry entry = fallbackStore.get(key);
        if (entry != null) {
            if (!entry.isExpired()) return entry.value();
            fallbackStore.remove(key);
        }
        return null;
    }

    /**
     * Xóa ngay mã OTP khỏi Redis sau khi người dùng đã đổi mật khẩu thành công (Chống dùng lại OTP)
     */
    public void deleteOtp(String email) {
        if (email == null) return;
        String key = OTP_PREFIX + email.trim().toLowerCase();
        try {
            if (stringRedisTemplate != null) {
                stringRedisTemplate.delete(key);
            }
        } catch (Exception e) {
            // Ignore
        }
        fallbackStore.remove(key);
    }

    // =========================================================================
    // 3. KHÓA PHÂN TÁN (DISTRIBUTED LOCK) CHỐNG ĐẶT TRÙNG PHÒNG (OVERBOOKING)
    // =========================================================================

    /**
     * Thiết lập khóa nguyên tử (Atomic SETNX) cho phòng đang được giao dịch đặt
     * @return true nếu chiếm được quyền đặt phòng, false nếu có người khác đang thao tác đặt cùng phòng này
     */
    public boolean acquireRoomBookingLock(Long roomId, long lockTimeoutSeconds) {
        if (roomId == null) return true;
        String key = ROOM_LOCK_PREFIX + roomId;
        try {
            if (stringRedisTemplate != null) {
                Boolean acquired = stringRedisTemplate.opsForValue()
                        .setIfAbsent(key, "LOCKED", lockTimeoutSeconds, TimeUnit.SECONDS);
                return Boolean.TRUE.equals(acquired);
            }
        } catch (Exception e) {
            // Fallback
        }
        synchronized (fallbackStore) {
            FallbackEntry existing = fallbackStore.get(key);
            if (existing != null && !existing.isExpired()) {
                return false;
            }
            fallbackStore.put(key, new FallbackEntry("LOCKED", System.currentTimeMillis() + TimeUnit.SECONDS.toMillis(lockTimeoutSeconds)));
            return true;
        }
    }

    /**
     * Giải phóng khóa phòng sau khi hoàn tất xử lý lưu đơn đặt phòng
     */
    public void releaseRoomBookingLock(Long roomId) {
        if (roomId == null) return;
        String key = ROOM_LOCK_PREFIX + roomId;
        try {
            if (stringRedisTemplate != null) {
                stringRedisTemplate.delete(key);
            }
        } catch (Exception e) {
            // Ignore
        }
        fallbackStore.remove(key);
    }
}

