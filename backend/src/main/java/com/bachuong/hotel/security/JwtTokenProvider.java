package com.bachuong.hotel.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // Khóa bí mật ký số chuẩn HMAC-SHA256 (tối thiểu 256 bits / 32 bytes)
    @Value("${jwt.secret:BacHuongHotelSuperSecureSecretKeyForJwtAuthentication2026!@#$}")
    private String jwtSecret = "BacHuongHotelSuperSecureSecretKeyForJwtAuthentication2026!@#$";

    // Thời gian sống của Token: 7 ngày (7 * 24 * 60 * 60 * 1000 = 604800000 ms)
    @Value("${jwt.expiration-ms:604800000}")
    private long jwtExpirationMs = 604800000L;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Tạo mã JWT token chứa thông tin username, accountId, role và họ tên
     */
    public String generateToken(String username, String role, Long accountId, String fullName) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username != null ? username : String.valueOf(accountId))
                .claim("role", role)
                .claim("id", accountId)
                .claim("fullName", fullName)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Trích xuất subject (username hoặc email) từ JWT token
     */
    public String getUsernameFromToken(String token) {
        Claims claims = getClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    /**
     * Trích xuất vai trò (Role: ADMIN / STAFF / CUSTOMER) từ JWT token
     */
    public String getRoleFromToken(String token) {
        Claims claims = getClaims(token);
        return claims != null ? claims.get("role", String.class) : null;
    }

    /**
     * Trích xuất ID tài khoản từ JWT token
     */
    public Long getAccountIdFromToken(String token) {
        Claims claims = getClaims(token);
        if (claims == null) return null;
        Object idObj = claims.get("id");
        if (idObj instanceof Number) {
            return ((Number) idObj).longValue();
        }
        return null;
    }

    /**
     * Kiểm tra tính hợp lệ và chữ ký của JWT token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            System.err.println("JWT Token không hợp lệ: " + e.getMessage());
            return false;
        }
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            return null;
        }
    }
}
