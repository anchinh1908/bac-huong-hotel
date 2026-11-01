package com.bachuong.hotel.config;

import org.springframework.cache.Cache;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Cấu hình Redis & Spring Cache cho hệ thống Khách Sạn Bắc Hương:
 * 1. Tuần tự hóa dữ liệu (Serialization) dạng JSON dễ đọc trên Redis.
 * 2. Thiết lập TTL (Time-To-Live) mặc định 10 phút cho Cache Phòng và Thông tin Khách sạn.
 * 3. Tích hợp cơ chế Fault-Tolerant (Graceful Degradation): Nếu máy chủ Redis tạm thời chưa bật
 *    hoặc mất kết nối, hệ thống tự động chuyển tiếp (fallback) xuống truy vấn MySQL bình thường
 *    mà không bao giờ làm gián đoạn trải nghiệm của khách hàng.
 */
@Configuration
@EnableCaching
public class RedisConfig implements CachingConfigurer {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();

        // Key sử dụng String thuần, Value sử dụng JSON chuẩn
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10)) // Cache sống 10 phút
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .build();
    }

    /**
     * Xử lý lỗi Cache thông minh (Graceful Degradation):
     * Khi Redis Server offline, tự động bỏ qua bước Cache và lấy dữ liệu trực tiếp từ MySQL.
     */
    @Override
    public CacheErrorHandler errorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {
                System.err.println("⚠️ [Redis Cache Fallback] Không thể đọc cache '" + cache.getName() + "', tự động truy vấn từ MySQL: " + exception.getMessage());
            }

            @Override
            public void handleCachePutError(RuntimeException exception, Cache cache, Object key, Object value) {
                System.err.println("⚠️ [Redis Cache Fallback] Không thể ghi cache '" + cache.getName() + "': " + exception.getMessage());
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, Cache cache, Object key) {
                System.err.println("⚠️ [Redis Cache Fallback] Không thể xóa cache '" + cache.getName() + "': " + exception.getMessage());
            }

            @Override
            public void handleCacheClearError(RuntimeException exception, Cache cache) {
                System.err.println("⚠️ [Redis Cache Fallback] Không thể làm sạch cache '" + cache.getName() + "': " + exception.getMessage());
            }
        };
    }
}

