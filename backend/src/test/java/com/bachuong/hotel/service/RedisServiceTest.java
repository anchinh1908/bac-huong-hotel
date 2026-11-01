package com.bachuong.hotel.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RedisServiceTest {

    @Mock
    private StringRedisTemplate stringRedisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private RedisService redisService;

    @BeforeEach
    void setUp() {
        lenient().when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    @DisplayName("1. Thu hồi JWT Token vào Redis Blacklist khi người dùng Logout")
    void testBlacklistToken() {
        String sampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample";
        long remainingMs = 3600000L;

        when(stringRedisTemplate.hasKey("blacklist:jwt:" + sampleToken)).thenReturn(true);

        redisService.blacklistToken(sampleToken, remainingMs);
        boolean blacklisted = redisService.isTokenBlacklisted(sampleToken);

        assertTrue(blacklisted);
        verify(valueOperations, times(1))
                .set("blacklist:jwt:" + sampleToken, "REVOKED", remainingMs, TimeUnit.MILLISECONDS);
    }

    @Test
    @DisplayName("2. Lưu, lấy và xóa mã OTP Quên mật khẩu trên Redis với TTL 10 phút")
    void testOtpLifecycleWithTtl() {
        String email = "khachhang@gmail.com";
        String otp = "686868";

        when(valueOperations.get("otp:reset:" + email)).thenReturn(otp);

        // Lưu OTP
        redisService.saveOtp(email, otp, 10);
        verify(valueOperations, times(1)).set("otp:reset:" + email, otp, 10L, TimeUnit.MINUTES);

        // Lấy OTP
        String fetchedOtp = redisService.getOtp(email);
        assertEquals("686868", fetchedOtp);

        // Xóa OTP sau khi đổi mật khẩu thành công
        redisService.deleteOtp(email);
        verify(stringRedisTemplate, times(1)).delete("otp:reset:" + email);
    }

    @Test
    @DisplayName("3. Khóa phân tán (Distributed Lock SETNX) chống đặt trùng phòng cùng lúc")
    void testDistributedRoomBookingLock() {
        Long roomId = 101L;

        // Khách hàng 1 bấm đặt trước -> Chiếm được Lock (SETNX trả về true)
        when(valueOperations.setIfAbsent("lock:room:101", "LOCKED", 10L, TimeUnit.SECONDS))
                .thenReturn(true)
                .thenReturn(false); // Khách hàng 2 bấm cùng mili-giây -> Bị từ chối (false)

        boolean firstCustomerLock = redisService.acquireRoomBookingLock(roomId, 10);
        boolean secondCustomerLock = redisService.acquireRoomBookingLock(roomId, 10);

        assertTrue(firstCustomerLock, "Khách hàng thứ 1 phải lấy được khóa đặt phòng");
        assertFalse(secondCustomerLock, "Khách hàng thứ 2 đặt trùng thời điểm phải bị chặn Overbooking");

        // Giải phóng khóa sau khi hoàn tất
        redisService.releaseRoomBookingLock(roomId);
        verify(stringRedisTemplate, times(1)).delete("lock:room:101");
    }
}

