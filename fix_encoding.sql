SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE bachuong_hotel;

ALTER DATABASE bachuong_hotel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE hotel_info CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE rooms CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE bookings CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE accounts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1. CẬP NHẬT THÔNG TIN KHÁCH SẠN BẮC HƯƠNG CHUẨN TIẾNG VIỆT
UPDATE hotel_info SET 
  name = 'Khách Sạn Bắc Hương',
  address = '196 Trần Hưng Đạo, Phường Quyết Thắng, TP. Kon Tum, Tỉnh Kon Tum',
  description = 'Khách sạn Bắc Hương tọa lạc tại số 196 Trần Hưng Đạo, vị trí trung tâm sầm uất bậc nhất thành phố Kon Tum. Rất thuận tiện để quý khách di chuyển tham quan Nhà Thờ Gỗ Kon Tum, Tòa Giám Mục, Cầu treo Kon Klor và dòng sông Đăk Bla huyền thoại.'
WHERE id = 1;

-- 2. CẬP NHẬT TÀI KHOẢN ADMIN & LỄ TÂN CHUẨN TIẾNG VIỆT
UPDATE accounts SET full_name = 'Quản Trị Viên Bắc Hương' WHERE username = 'admin';
UPDATE accounts SET full_name = 'Lê Thị Thu Thảo (Lễ Tân)' WHERE username = 'letan01';
UPDATE accounts SET full_name = 'Nguyễn Văn Khách' WHERE email = 'khachhang.demo@gmail.com' OR full_name LIKE '%Khách%';

-- 3. CẬP NHẬT DANH SÁCH 9 PHÒNG CHUẨN TIẾNG VIỆT
UPDATE rooms SET 
  name = 'Phòng Tiêu Chuẩn 1 Giường Đơn',
  bed = '1 Giường đơn cao cấp',
  current_guest = NULL
WHERE room_number = 'P.101';

UPDATE rooms SET 
  name = 'Phòng Đôi Superior Giường Queen',
  bed = '1 Giường đôi Queen Size',
  current_guest = 'Nguyễn Tuấn Kiệt'
WHERE room_number = 'P.102';

UPDATE rooms SET 
  name = 'Phòng Deluxe 2 Giường Đơn',
  bed = '2 Giường đơn 1m2',
  current_guest = NULL
WHERE room_number = 'P.103';

UPDATE rooms SET 
  name = 'Phòng Superior Cửa Sổ Hướng Phố',
  bed = '1 Giường đôi Queen Size',
  current_guest = NULL
WHERE room_number = 'P.201';

UPDATE rooms SET 
  name = 'Phòng Deluxe View Sông Đăk Bla',
  bed = '1 Giường King ngắm trọn sông Đăk Bla',
  current_guest = 'Trần Thu Thảo'
WHERE room_number = 'P.202';

UPDATE rooms SET 
  name = 'Phòng Gia Đình Family Suite',
  bed = '2 Giường đôi King Size',
  current_guest = NULL
WHERE room_number = 'P.203';

UPDATE rooms SET 
  name = 'Phòng Tổng Thống Bắc Hương VIP Suite',
  bed = '1 Giường Hoàng gia King Size',
  current_guest = NULL
WHERE room_number = 'P.301';

UPDATE rooms SET 
  name = 'Phòng Deluxe Ban Công Hướng Phố',
  bed = '1 Giường King Size',
  current_guest = 'Lê Hoàng Nam'
WHERE room_number = 'P.302';

UPDATE rooms SET 
  name = 'Phòng Standard Yên Tĩnh Tầng 3',
  bed = '1 Giường đơn',
  current_guest = NULL
WHERE room_number = 'P.303';

-- 4. CẬP NHẬT ĐƠN ĐẶT PHÒNG CHUẨN TIẾNG VIỆT
UPDATE bookings SET 
  guest_name = 'Nguyễn Tuấn Kiệt',
  notes = 'Khách yêu cầu nhận phòng sớm lúc 12h trưa',
  room_name = 'Phòng Đôi Superior Giường Queen',
  room_number = 'P.102'
WHERE id = 1;

UPDATE bookings SET 
  guest_name = 'Trần Thu Thảo',
  notes = 'Kỷ niệm ngày cưới, cần set up hoa hồng',
  room_name = 'Phòng Deluxe View Sông Đăk Bla',
  room_number = 'P.202'
WHERE id = 2;

UPDATE bookings SET 
  guest_name = 'Lê Hoàng Nam',
  notes = 'Công tác, cần xuất hóa đơn VAT',
  room_name = 'Phòng Deluxe Ban Công Hướng Phố',
  room_number = 'P.302'
WHERE id = 3;
