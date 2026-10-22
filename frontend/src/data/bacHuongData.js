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
    area: "22 m²",
    view: "Không gian yên tĩnh nội khu",
    status: "AVAILABLE", // Xanh lá
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Phòng Tiêu Chuẩn 1 Giường Đơn tại Khách Sạn Bắc Hương được thiết kế tinh tế, cách âm tốt và ấm cúng. Rất phù hợp cho khách đi công tác hoặc du lịch một mình cần không gian nghỉ ngơi yên tĩnh giữa trung tâm Kon Tum.",
    amenities: ["Điều hòa Inverter", "Wifi tốc độ cao", "Tivi 43 inch", "Nước nóng năng lượng mặt trời", "Bàn làm việc", "Nước suối miễn phí"],
    highlights: ["Không hút thuốc", "Bàn làm việc yên tĩnh", "Vòi sen tăng áp", "Dọn phòng hàng ngày"]
  },
  {
    id: 2,
    roomNumber: "P.102",
    floor: 1,
    name: "Phòng Đôi Superior Giường Queen",
    type: "Superior Double",
    pricePerNight: 650000,
    capacity: 2,
    bed: "1 Giường đôi Queen Size (1m6 x 2m)",
    area: "28 m²",
    view: "Hướng sân vườn & phố",
    status: "OCCUPIED", // Đỏ
    currentGuest: "Nguyễn Tuấn Kiệt",
    checkOut: "22/10/2026",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Không gian lãng mạn và thoải mái với nệm Queen cao cấp đạt chuẩn khách sạn. Trang bị Smart TV 50 inch, tủ lạnh mini và phòng tắm hiện đại, là lựa chọn lý tưởng cho các cặp đôi du lịch hoặc kỳ nghỉ ngắn ngày.",
    amenities: ["Điều hòa 2 chiều", "Tủ lạnh mini", "Tivi Smart 50 inch", "Máy sấy tóc", "Két sắt an toàn", "Trà & cà phê miễn phí"],
    highlights: ["Giường Queen êm ái", "Cửa sổ thoáng mát", "Khăn tắm & đồ dùng cao cấp", "Wifi riêng từng phòng"]
  },
  {
    id: 3,
    roomNumber: "P.103",
    floor: 1,
    name: "Phòng Deluxe 2 Giường Đơn",
    type: "Deluxe Twin",
    pricePerNight: 750000,
    capacity: 2,
    bed: "2 Giường đơn 1m2 x 2m",
    area: "32 m²",
    view: "Ban công đón gió tự nhiên",
    status: "CLEANING", // Vàng
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Thiết kế 2 giường đơn riêng biệt tiện nghi với ban công thoáng mát đón ánh sáng tự nhiên của phố núi Kon Tum. Phòng tắm rộng rãi có bồn tắm nằm ngâm mình thư giãn sau chuyến tham quan dài.",
    amenities: ["Ban công thoáng mát", "Bồn tắm nằm thư giãn", "Máy pha trà & bình đun", "Tủ lạnh", "Wifi riêng từng phòng", "Điều hòa"],
    highlights: ["2 Giường riêng biệt", "Bồn tắm nằm", "Ban công riêng biệt", "Áo choàng tắm"]
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
    area: "30 m²",
    view: "Cửa sổ lớn ngắm phố Trần Hưng Đạo",
    status: "AVAILABLE", // Xanh lá
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Nằm tại tầng 2 với cửa sổ kính lớn nhìn xuống con phố Trần Hưng Đạo sầm uất. Không gian ngập tràn ánh nắng ban mai, rèm cản sáng 100% giúp bạn có giấc ngủ sâu và trọn vẹn.",
    amenities: ["Cửa sổ lớn ngắm phố", "Bàn trang điểm & làm việc", "Tủ lạnh", "Dịch vụ phòng 24/7", "Điều hòa Inverter", "Két sắt"],
    highlights: ["Cửa sổ view đường phố", "Rèm cản sáng 2 lớp", "Cách âm chất lượng", "Trà cafe miễn phí"]
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
    area: "38 m²",
    view: "Trực diện dòng sông Đăk Bla & cầu Kon Klor",
    status: "OCCUPIED", // Đỏ
    currentGuest: "Trần Thu Thảo",
    checkOut: "23/10/2026",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Một trong những hạng phòng đẹp nhất tại khách sạn với tầm nhìn trực diện ra dòng sông Đăk Bla thơ mộng. Trang bị bồn tắm sục Jacuzzi thư giãn cùng Smart TV 55 inch mang đến trải nghiệm nghỉ dưỡng đẳng cấp.",
    amenities: ["View ngắm sông Đăk Bla", "Bồn tắm sục Jacuzzi", "Smart TV 55 inch", "Trà cafe thượng hạng", "Mini-bar đầy đủ", "Áo choàng tắm"],
    highlights: ["View triệu đô sông Đăk Bla", "Bồn sục Jacuzzi", "Giường King Size 1m8", "Trái cây chào mừng"]
  },
  {
    id: 6,
    roomNumber: "P.203",
    floor: 2,
    name: "Phòng Gia Đình Family Suite",
    type: "Family Suite",
    pricePerNight: 1350000,
    capacity: 4,
    bed: "2 Giường đôi King Size (1m8 x 2m)",
    area: "55 m²",
    view: "Hướng phố & núi Chư Hreng",
    status: "AVAILABLE", // Xanh lá
    image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Căn hộ Suite gia đình rộng 55m² gồm không gian phòng khách tiện nghi với sofa êm ái, khu bếp mini ấm cúng và 2 giường King Size thoải mái cho cả gia đình hoặc nhóm bạn 4 người.",
    amenities: ["Không gian phòng khách & Sofa", "Khu bếp mini & Bàn ăn", "2 Giường đôi King Size", "Tủ lạnh 2 cánh", "2 Tivi riêng biệt", "Wifi riêng"],
    highlights: ["Sức chứa 4 người lớn", "Phòng khách riêng", "Bếp mini & bàn ăn", "Ban công đón gió"]
  },
  {
    id: 7,
    roomNumber: "P.301",
    floor: 3,
    name: "Phòng Tổng Thống Bắc Hương VIP Suite",
    type: "VIP Suite",
    pricePerNight: 1850000,
    capacity: 2,
    bed: "1 Giường Hoàng gia King Size (2m x 2m2)",
    area: "65 m²",
    view: "Toàn cảnh 360 độ TP. Kon Tum & dòng Đăk Bla",
    status: "AVAILABLE", // Xanh lá
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Đỉnh cao của sự sang trọng tại tầng cao nhất. Cửa kính panorama kịch trần ngắm trọn vẹn thành phố Kon Tum, bồn tắm kính nhìn ra sông, tặng kèm rượu vang chào mừng và dịch vụ phục vụ bữa sáng tận phòng.",
    amenities: ["Kính tràn ngắm toàn cảnh thành phố", "Rượu vang & Trái cây chào mừng", "Bồn tắm panorama", "Ăn sáng tại phòng miễn phí", "Hệ thống âm thanh", "Smart TV 65 inch"],
    highlights: ["Tầng cao nhất VIP", "Bồn tắm kính Panorama", "Rượu vang thượng hạng", "Giường Hoàng Gia 2m2"]
  },
  {
    id: 8,
    roomNumber: "P.302",
    floor: 3,
    name: "Phòng Deluxe Ban Công Hướng Phố",
    type: "Deluxe City View",
    pricePerNight: 950000,
    capacity: 2,
    bed: "1 Giường King Size cao cấp",
    area: "36 m²",
    view: "Ban công riêng ngắm phố núi Kon Tum",
    status: "OCCUPIED", // Đỏ
    currentGuest: "Lê Hoàng Nam",
    checkOut: "21/10/2026",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Sở hữu ban công riêng ngắm nhìn phố núi rực rỡ ánh đèn về đêm. Phòng được bài trí với gam màu ấm cúng, sàn gỗ sang trọng và bàn làm việc rộng rãi phục vụ công tác.",
    amenities: ["Ban công riêng ngắm phố núi", "Két sắt an toàn", "Bàn làm việc & ghế da", "Áo choàng tắm cao cấp", "Tủ lạnh mini", "Tivi 50 inch"],
    highlights: ["Ban công riêng biệt", "Sàn gỗ cao cấp", "Bàn làm việc doanh nhân", "Nước suối miễn phí"]
  },
  {
    id: 9,
    roomNumber: "P.303",
    floor: 3,
    name: "Phòng Standard Yên Tĩnh Tầng 3",
    type: "Standard Single",
    pricePerNight: 450000,
    capacity: 1,
    bed: "1 Giường đơn 1m2",
    area: "24 m²",
    view: "Tầng cao yên tĩnh nội khu",
    status: "CLEANING", // Vàng
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Vị trí tầng 3 yên tĩnh tuyệt đối, lý tưởng cho giấc ngủ nghỉ ngơi phục hồi năng lượng sau chặng đường dài. Trang bị đèn đọc sách đầu giường, điều hòa êm ái và bàn làm việc nhỏ gọn.",
    amenities: ["Không gian yên tĩnh tuyệt đối", "Bàn đọc sách đầu giường", "Điều hòa Inverter siêu êm", "Wifi riêng", "Vòi sen nóng lạnh"],
    highlights: ["Yên tĩnh tuyệt đối", "Đèn đọc sách", "Điều hòa siêu êm", "Vệ sinh khép kín"]
  }
];

// Hàm hỗ trợ tự động bổ sung danh sách ảnh & thông tin chi tiết cho bất kỳ phòng nào (kể cả phòng lấy từ MySQL)
export function getEnhancedRoomDetails(room) {
  if (!room) return null;
  const match = INITIAL_ROOMS.find(r => r.roomNumber === room.roomNumber || r.id === room.id);
  
  const defaultImages = [
    room.image || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
  ];

  return {
    ...room,
    area: room.area || match?.area || `${20 + (room.capacity || 2) * 6} m²`,
    view: room.view || match?.view || (room.floor >= 2 ? "Hướng phố Trần Hưng Đạo" : "Không gian yên tĩnh nội khu"),
    description: room.description || match?.description || `Phòng ${room.name} tại Khách Sạn Bắc Hương được trang bị đầy đủ tiện nghi tiêu chuẩn, điều hòa Inverter, wifi tốc độ cao và phòng tắm riêng hiện đại. Không gian ấm cúng, sạch sẽ đảm bảo sự hài lòng tuyệt đối cho quý khách.`,
    images: (Array.isArray(room.images) && room.images.length > 0) ? room.images : (match?.images || defaultImages),
    highlights: room.highlights || match?.highlights || ["Không hút thuốc", "Wifi tốc độ cao", "Nước suối miễn phí", "Dọn phòng hàng ngày"],
    amenities: Array.isArray(room.amenities) ? room.amenities : (match?.amenities || ["Điều hòa", "Wifi tốc độ cao", "Tivi", "Nước nóng lạnh", "Bình đun siêu tốc"])
  };
}

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
