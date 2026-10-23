package com.bachuong.hotel.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "hotel_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelInfo {

    @Id
    private Long id = 1L; // Cố định id = 1 cho thông tin khách sạn

    private String name; // Tên khách sạn
    private String tagline; // Khẩu hiệu / Slogan
    private String address; // Địa chỉ khách sạn
    private String hotline; // Hotline di động
    private String landline; // Số điện thoại bàn
    private String email; // Email liên hệ lễ tân
    private String adminEmail; // Email quản trị

    @Column(name = "google_maps_url", columnDefinition = "TEXT")
    private String googleMapsUrl; // Link Google Maps chỉ đường

    @Column(name = "open_time")
    private String openTime; // Thời gian phục vụ (24/7)

    @Column(name = "check_in_time")
    private String checkInTime; // Giờ nhận phòng (14:00)

    @Column(name = "check_out_time")
    private String checkOutTime; // Giờ trả phòng (12:00)

    @Column(columnDefinition = "TEXT")
    private String description; // Giới thiệu tổng quan

    @Column(name = "hero_image", columnDefinition = "TEXT")
    private String heroImage; // Link ảnh nền / Banner

    @Column(name = "custom_policies", columnDefinition = "LONGTEXT")
    private String customPolicies; // Danh sách mục thông tin bổ sung (JSON)
}
