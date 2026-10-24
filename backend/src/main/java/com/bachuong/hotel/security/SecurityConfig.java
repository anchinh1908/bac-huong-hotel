package com.bachuong.hotel.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Tắt CSRF vì hệ thống sử dụng REST API Stateless
            .csrf(AbstractHttpConfigurer::disable)

            // 2. Cấu hình CORS cho phép Frontend kết nối
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Quản lý Session là STATELESS (Không lưu session trên server, xác thực qua JWT)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 4. Xử lý lỗi xác thực trả về JSON 401/403 rõ ràng
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json;charset=UTF-8");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\": true, \"message\": \"Yêu cầu cần Token xác thực (JWT) hợp lệ để truy cập!\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setContentType("application/json;charset=UTF-8");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("{\"error\": true, \"message\": \"Bạn không có quyền (Role) phù hợp để thực hiện hành động này!\"}");
                })
            )

            // 5. Phân quyền chi tiết cho từng API
            .authorizeHttpRequests(auth -> auth
                // Cho phép toàn bộ Preflight OPTIONS requests từ trình duyệt
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // API Công khai cho Khách hàng & luồng xác thực (Không cần JWT)
                .requestMatchers("/api/auth/login", "/api/auth/google", "/api/auth/register", "/api/auth/forgot-password/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/rooms/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/hotel-info/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/bookings").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").permitAll()

                // API dành riêng cho Lễ Tân (STAFF) và Quản Trị Viên (ADMIN)
                .requestMatchers(HttpMethod.GET, "/api/bookings").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/rooms/*/status").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/bookings/*/approve").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/bookings/*/reject").hasAnyRole("STAFF", "ADMIN")

                // API quyền lực cao nhất dành RIÊNG cho ADMIN tối cao
                .requestMatchers(HttpMethod.POST, "/api/rooms/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/hotel-info/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/hotel-info/reset").hasRole("ADMIN")
                .requestMatchers("/api/auth/staff/**").hasRole("ADMIN")

                // Đổi mật khẩu: Cần đăng nhập tài khoản bất kỳ
                .requestMatchers("/api/auth/change-password").authenticated()

                // Mọi API khác mở mặc định
                .anyRequest().permitAll()
            )

            // 6. Đưa bộ lọc JWT vào trước bộ lọc UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
