export const HOTEL_INFO = {
  name: "Khách Sạn Bắc Hương",
  tagline: "Điểm Dừng Chân Lý Tưởng Giữa Lòng Cao Nguyên Kon Tum",
  address: "196 Trần Hưng Đạo, Phường Quyết Thắng, TP. Kon Tum, Tỉnh Kon Tum",
  hotline: "0935.911.889 - 0828.211.222",
  landline: "0260.3862.666",
  email: "khachsanbachuong.kontum@gmail.com",
  adminEmail: "admin.bachuong@gmail.com",
  googleMapsUrl: "https://www.google.com/maps/place/Kh%C3%A1ch+S%E1%BA%A1n+B%E1%BA%AFc+H%C6%B0%C6%A1ng/@14.3602403,108.0124471,15z/data=!4m9!3m8!1s0x316bffa204140589:0xcc7e4d82c2632ce!5m2!4m1!1i2!8m2!3d14.3499989!4d108.0069535!16s%2Fg%2F1hc2bzk7m!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D",
  openTime: "Lễ tân phục vụ 24/7",
  checkInTime: "14:00",
  checkOutTime: "12:00",
  description: "Khách sạn Bắc Hương tọa lạc tại số 196 Trần Hưng Đạo, vị trí trung tâm sầm uất bậc nhất thành phố Kon Tum. Rất thuận tiện để quý khách di chuyển tham quan Nhà Thờ Gỗ Kon Tum, Tòa Giám Mục, Cầu treo Kon Klor và dòng sông Đăk Bla huyền thoại.",
  heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
};

export const INITIAL_ROOMS = [
  {
    id: 1,
    roomNumber: "P.101",
    floor: 1,
    name: "Phòng Tiêu Chuẩn 1 Giường Đơn",
    type: "Standard Single",
    pricePerNight: 450000,
    capacity: 1,
    bed: "1 Giường đơn cao cấp",
    status: "AVAILABLE", // Xanh lá
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    amenities: ["Điều hòa", "Wifi tốc độ cao", "Tivi 43 inch", "Nước nóng lạnh", "Bàn làm việc"]
  },
  {
    id: 2,
    roomNumber: "P.102",
    floor: 1,
    name: "Phòng Đôi Superior Giường Queen",
    type: "Superior Double",
    pricePerNight: 650000,
    capacity: 2,
    bed: "1 Giường đôi Queen Size",
    status: "OCCUPIED", // Đỏ
    currentGuest: "Nguyễn Tuấn Kiệt",
    checkOut: "22/10/2026",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    amenities: ["Điều hòa 2 chiều", "Tủ lạnh mini", "Tivi Smart 50 inch", "Máy sấy tóc", "Két sắt"]
  },
  {
    id: 3,
    roomNumber: "P.103",
    floor: 1,
    name: "Phòng Deluxe 2 Giường Đơn",
    type: "Deluxe Twin",
    pricePerNight: 750000,
    capacity: 2,
    bed: "2 Giường đơn 1m2",
    status: "CLEANING", // Vàng
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    amenities: ["Ban công thoáng mát", "Bồn tắm nằm", "Máy pha trà", "Wifi riêng từng phòng"]
  },
  {
    id: 4,
    roomNumber: "P.201",
    floor: 2,
    name: "Phòng Superior Cửa Sổ Hướng Phố",
    type: "Superior Double",
    pricePerNight: 650000,
    capacity: 2,
    bed: "1 Giường đôi Queen Size",
    status: "AVAILABLE", // Xanh lá
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    amenities: ["Cửa sổ lớn ngắm phố", "Bàn trang điểm", "Tủ lạnh", "Dịch vụ phòng 24/7"]
  },
  {
    id: 5,
    roomNumber: "P.202",
    floor: 2,
    name: "Phòng Deluxe View Sông Đăk Bla",
    type: "Deluxe River View",
    pricePerNight: 950000,
    capacity: 2,
    bed: "1 Giường King ngắm trọn sông Đăk Bla",
    status: "OCCUPIED", // Đỏ
    currentGuest: "Trần Thu Thảo",
    checkOut: "23/10/2026",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    amenities: ["View ngắm sông Đăk Bla", "Bồn tắm sục Jacuzzi", "Smart TV 55 inch", "Trà cafe cao cấp"]
  },
  {
    id: 6,
    roomNumber: "P.203",
    floor: 2,
    name: "Phòng Gia Đình Family Suite",
    type: "Family Suite",
    pricePerNight: 1350000,
    capacity: 4,
    bed: "2 Giường đôi King Size",
    status: "AVAILABLE", // Xanh lá
    image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80",
    amenities: ["2 Phòng ngủ riêng", "Phòng khách và Sofa", "Bếp mini", "Bàn ăn gia đình"]
  },
  {
    id: 7,
    roomNumber: "P.301",
    floor: 3,
    name: "Phòng Tổng Thống Bắc Hương VIP Suite",
    type: "VIP Suite",
    pricePerNight: 1850000,
    capacity: 2,
    bed: "1 Giường Hoàng gia King Size",
    status: "AVAILABLE", // Xanh lá
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    amenities: ["Kính tràn ngắm toàn cảnh TP. Kon Tum", "Rượu vang chào mừng", "Bồn tắm panorama", "Ăn sáng tại phòng"]
  },
  {
    id: 8,
    roomNumber: "P.302",
    floor: 3,
    name: "Phòng Deluxe Ban Công Hướng Phố",
    type: "Deluxe City View",
    pricePerNight: 950000,
    capacity: 2,
    bed: "1 Giường King Size",
    status: "OCCUPIED", // Đỏ
    currentGuest: "Lê Hoàng Nam",
    checkOut: "21/10/2026",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    amenities: ["Ban công riêng ngắm phố núi", "Két sắt", "Bàn làm việc", "Áo choàng tắm cao cấp"]
  },
  {
    id: 9,
    roomNumber: "P.303",
    floor: 3,
    name: "Phòng Standard Yên Tĩnh Tầng 3",
    type: "Standard Single",
    pricePerNight: 450000,
    capacity: 1,
    bed: "1 Giường đơn",
    status: "CLEANING", // Vàng
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    amenities: ["Không gian yên tĩnh", "Bàn đọc sách", "Điều hòa Inverter", "Wifi riêng"]
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: "BH-1001",
    roomNumber: "P.102",
    roomName: "Phòng Đôi Superior Giường Queen",
    guestName: "Nguyễn Tuấn Kiệt",
    guestPhone: "0912345678",
    guestEmail: "tuankiet@gmail.com",
    checkIn: "2026-10-20",
    checkOut: "2026-10-22",
    nights: 2,
    totalPrice: 1300000,
    status: "CONFIRMED",
    notes: "Khách yêu cầu nhận phòng sớm lúc 12h"
  },
  {
    id: "BH-1002",
    roomNumber: "P.202",
    roomName: "Phòng Deluxe View Sông Đăk Bla",
    guestName: "Trần Thu Thảo",
    guestPhone: "0987654321",
    guestEmail: "thuthao@gmail.com",
    checkIn: "2026-10-19",
    checkOut: "2026-10-23",
    nights: 4,
    totalPrice: 3800000,
    status: "CONFIRMED",
    notes: "Kỷ niệm ngày cưới, set up hoa tươi"
  },
  {
    id: "BH-1003",
    roomNumber: "P.302",
    roomName: "Phòng Deluxe Ban Công Hướng Phố",
    guestName: "Lê Hoàng Nam",
    guestPhone: "0905111222",
    guestEmail: "hoangnam@gmail.com",
    checkIn: "2026-10-20",
    checkOut: "2026-10-21",
    nights: 1,
    totalPrice: 950000,
    status: "CONFIRMED",
    notes: "Đi công tác, cần xuất hóa đơn công ty"
  }
];
