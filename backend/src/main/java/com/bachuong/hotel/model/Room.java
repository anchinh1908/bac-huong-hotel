package com.bachuong.hotel.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", unique = true, nullable = false)
    private String roomNumber; // Ví dụ: P.101, P.202

    private Integer floor;      // Tầng: 1, 2, 3
    private String type;        // Standard, Deluxe, VIP
    private String name;        // Tên phòng hiển thị

    @Column(name = "price_per_night")
    private BigDecimal pricePerNight;

    private Integer capacity;   // Sức chứa (người)
    private String bed;         // 1 Giường đôi King, 2 Giường đơn
    private String image;       // Link ảnh phòng

    // Trạng thái: AVAILABLE (Xanh lá), OCCUPIED (Đỏ), CLEANING (Vàng)
    @Enumerated(EnumType.STRING)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(name = "current_guest")
    private String currentGuest; // Tên khách đang ở (nếu trạng thái là OCCUPIED)

    public enum RoomStatus {
        AVAILABLE,  // Phòng trống
        OCCUPIED,   // Đang có khách
        CLEANING    // Đang dọn dẹp
    }
}
