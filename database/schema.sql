-- ========================================================================
-- CƠ SỞ DỮ LIỆU: KHÁCH SẠN BẮC HƯƠNG (bachuong_hotel)
-- Hệ quản trị cơ sở dữ liệu: MySQL
-- ========================================================================
CREATE DATABASE IF NOT EXISTS bachuong_hotel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bachuong_hotel;
-- 1. BẢNG THÔNG TIN KHÁCH SẠN BẮC HƯƠNG
CREATE TABLE IF NOT EXISTS hotel_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    hotline VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    google_maps_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 2. BẢNG DANH SÁCH PHÒNG
-- Trạng thái phòng:
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    floor INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    -- Standard, Deluxe, VIP, Family
    price_per_night DECIMAL(12, 2) NOT NULL,
    capacity INT NOT NULL,
    bed_type VARCHAR(100) NOT NULL,
    amenities TEXT,
    image_url TEXT,
    status ENUM('AVAILABLE', 'OCCUPIED', 'CLEANING') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 3. BẢNG ĐƠN ĐẶT PHÒNG
-- Trạng thái đơn: PENDING (Chờ duyệt), CONFIRMED (Đã xác nhận), CANCELLED (Đã hủy), COMPLETED (Đã trả phòng)
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    room_id INT NOT NULL,
    guest_name VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    guest_email VARCHAR(150) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights INT NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'CONFIRMED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
-- ========================================================================
-- CHÈN DỮ LIỆU BAN ĐẦU CHO KHÁCH SẠN BẮC HƯƠNG
-- ========================================================================
-- Thông tin khách sạn Bắc Hương
INSERT INTO hotel_info (
        name,
        address,
        hotline,
        email,
        google_maps_url,
        description
    )
VALUES (
        'Khách Sạn Bắc Hương',
        '196 Trần Hưng Đạo, Phường Quyết Thắng, TP. Kon Tum, Tỉnh Kon Tum',
        '0935.911.889 - 0828.211.222 (Bàn: 0260.3862.666)',
        'khachsanbachuong.kontum@gmail.com',
        'https://www.google.com/maps/place/Kh%C3%A1ch+S%E1%BA%A1n+B%E1%BA%AFc+H%C6%B0%C6%A1ng/@14.3602403,108.0124471,15z/data=!4m9!3m8!1s0x316bffa204140589:0xcc7e4d82c2632ce!5m2!4m1!1i2!8m2!3d14.3499989!4d108.0069535!16s%2Fg%2F1hc2bzk7m!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D',
        'Khách sạn Bắc Hương tọa lạc tại số 196 Trần Hưng Đạo, vị trí trung tâm sầm uất bậc nhất thành phố Kon Tum. Rất thuận tiện để quý khách di chuyển tham quan Nhà Thờ Gỗ Kon Tum, Tòa Giám Mục, Cầu treo Kon Klor và dòng sông Đăk Bla huyền thoại.'
    );
-- Danh sách các phòng mẫu (Tầng 1, Tầng 2, Tầng 3)
INSERT INTO rooms (
        room_number,
        floor,
        type,
        price_per_night,
        capacity,
        bed_type,
        amenities,
        image_url,
        status
    )
VALUES -- Tầng 1
    (
        'P.101',
        1,
        'Standard Single',
        450000,
        1,
        '1 Giường đơn',
        'Điều hòa, Tivi, Wifi miễn phí, Nước nóng lạnh',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        'AVAILABLE'
    ),
    (
        'P.102',
        1,
        'Superior Double',
        650000,
        2,
        '1 Giường đôi Queen',
        'Điều hòa, Tivi 50 inch, Tủ lạnh mini, Bàn làm việc',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
        'OCCUPIED'
    ),
    (
        'P.103',
        1,
        'Deluxe Twin',
        750000,
        2,
        '2 Giường đơn',
        'Ban công thoáng mát, Bồn tắm nằm, Máy sấy tóc',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        'CLEANING'
    ),
    -- Tầng 2
    (
        'P.201',
        2,
        'Superior Double',
        650000,
        2,
        '1 Giường đôi Queen',
        'Cửa sổ lớn ngắm phố, Tủ lạnh, Két sắt an toàn',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        'AVAILABLE'
    ),
    (
        'P.202',
        2,
        'Deluxe River View',
        950000,
        2,
        '1 Giường King view sông Đăk Bla',
        'View trọn sông Đăk Bla, Bồn tắm sục, Smart TV',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
        'OCCUPIED'
    ),
    (
        'P.203',
        2,
        'Family Suite',
        1350000,
        4,
        '2 Giường đôi King lớn',
        'Phòng khách riêng, Sofa bed, Bếp mini, 2 phòng tắm',
        'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
        'AVAILABLE'
    ),
    -- Tầng 3
    (
        'P.301',
        3,
        'Bắc Hương VIP Suite',
        1850000,
        2,
        '1 Giường Hoàng gia King Size',
        'Kính tràn ngắm trọn TP. Kon Tum, Rượu vang miễn phí, Bồn tắm panorama',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        'AVAILABLE'
    ),
    (
        'P.302',
        3,
        'Deluxe City View',
        950000,
        2,
        '1 Giường King Size',
        'Ban công rộng ngắm phố núi, Trà cà phê miễn phí',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        'OCCUPIED'
    ),
    (
        'P.303',
        3,
        'Standard Single',
        450000,
        1,
        '1 Giường đơn cao cấp',
        'Yên tĩnh, Đầy đủ tiện nghi, Đèn đọc sách',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        'CLEANING'
    );
-- Đơn đặt phòng mẫu ban đầu
INSERT INTO bookings (
        booking_code,
        room_id,
        guest_name,
        guest_phone,
        guest_email,
        check_in_date,
        check_out_date,
        nights,
        total_price,
        status,
        notes
    )
VALUES (
        'BH-1001',
        2,
        'Nguyễn Tuấn Kiệt',
        '0912345678',
        'tuankiet@gmail.com',
        '2026-10-20',
        '2026-10-22',
        2,
        1300000,
        'CONFIRMED',
        'Khách yêu cầu nhận phòng sớm lúc 12h trưa'
    ),
    (
        'BH-1002',
        5,
        'Trần Thu Thảo',
        '0987654321',
        'thuthao@gmail.com',
        '2026-10-19',
        '2026-10-23',
        4,
        3800000,
        'CONFIRMED',
        'Kỷ niệm ngày cưới, cần set up hoa hồng'
    ),
    (
        'BH-1003',
        8,
        'Lê Hoàng Nam',
        '0905111222',
        'hoangnam@gmail.com',
        '2026-10-20',
        '2026-10-21',
        1,
        950000,
        'CONFIRMED',
        'Công tác, cần xuất hóa đơn VAT'
    );