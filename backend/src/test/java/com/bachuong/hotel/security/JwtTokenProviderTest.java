package com.bachuong.hotel.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

public class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        passwordEncoder = new BCryptPasswordEncoder();
    }

    @Test
    void testGenerateAndValidateToken_Admin() {
        String username = "admin";
        String role = "ADMIN";
        Long id = 1L;
        String fullName = "Quản Trị Viên";

        String token = jwtTokenProvider.generateToken(username, role, id, fullName);

        assertNotNull(token);
        assertTrue(token.length() > 20);
        assertTrue(jwtTokenProvider.validateToken(token));

        assertEquals(username, jwtTokenProvider.getUsernameFromToken(token));
        assertEquals(role, jwtTokenProvider.getRoleFromToken(token));
        assertEquals(id, jwtTokenProvider.getAccountIdFromToken(token));
    }

    @Test
    void testGenerateAndValidateToken_Staff() {
        String token = jwtTokenProvider.generateToken("letan01", "STAFF", 2L, "Lê Thị Thu Thảo");

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("letan01", jwtTokenProvider.getUsernameFromToken(token));
        assertEquals("STAFF", jwtTokenProvider.getRoleFromToken(token));
        assertEquals(2L, jwtTokenProvider.getAccountIdFromToken(token));
    }

    @Test
    void testInvalidToken() {
        assertFalse(jwtTokenProvider.validateToken("invalid.token.structure"));
        assertFalse(jwtTokenProvider.validateToken(""));
        assertFalse(jwtTokenProvider.validateToken(null));
    }

    @Test
    void testBCryptPasswordEncoder() {
        String rawPassword = "admin123456";
        String encoded = passwordEncoder.encode(rawPassword);

        assertNotNull(encoded);
        assertNotEquals(rawPassword, encoded);
        assertTrue(passwordEncoder.matches(rawPassword, encoded));
        assertFalse(passwordEncoder.matches("wrongpassword", encoded));
    }
}
