package com.bachuong.hotel.controller;

import com.bachuong.hotel.model.Booking;
import com.bachuong.hotel.model.HotelInfo;
import com.bachuong.hotel.model.Room;
import com.bachuong.hotel.repository.BookingRepository;
import com.bachuong.hotel.repository.HotelInfoRepository;
import com.bachuong.hotel.repository.RoomRepository;
import com.bachuong.hotel.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Cho phép Frontend kết nối
public class HotelController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HotelInfoRepository hotelInfoRepository;

    @Autowired
    private EmailService emailService;

    @Autowired(required = false)
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @jakarta.annotation.PostConstruct
    public void initHotelTable() {
        if (jdbcTemplate != null) {
            try {
                jdbcTemplate.execute("ALTER TABLE hotel_info MODIFY COLUMN google_maps_url TEXT NULL");
                jdbcTemplate.execute("ALTER TABLE hotel_info MODIFY COLUMN email VARCHAR(255) NULL");
                jdbcTemplate.execute("ALTER TABLE hotel_info MODIFY COLUMN hotline VARCHAR(255) NULL");
                jdbcTemplate.execute("ALTER TABLE hotel_info MODIFY COLUMN address VARCHAR(255) NULL");
                jdbcTemplate.execute("ALTER TABLE hotel_info MODIFY COLUMN name VARCHAR(255) NULL");
            } catch (Exception e) {
                // Ignore if already modified
            }
        }
    }

    private HotelInfo getDefaultHotelInfo() {
        HotelInfo info = new HotelInfo();
        info.setId(1L);
        info.setName("Khách Sạn Bắc Hương");
        info.setTagline("Điểm Dừng Chân Lý Tưởng Giữa Lòng Cao Nguyên Kon Tum");
        info.setAddress("196 Trần Hưng Đạo, Phường Quyết Thắng, TP. Kon Tum, Tỉnh Kon Tum");
        info.setHotline("0935.911.889 - 0828.211.222");
        info.setLandline("0260.3862.666");
        info.setEmail("khachsanbachuong.kontum@gmail.com");
        info.setAdminEmail("admin.bachuong@gmail.com");
        info.setGoogleMapsUrl("https://www.google.com/maps/place/Kh%C3%A1ch+S%E1%BA%A1n+B%E1%BA%AFc+H%C6%B0%C6%A1ng/@14.3602403,108.0124471,15z/data=!4m9!3m8!1s0x316bffa204140589:0xcc7e4d82c2632ce!5m2!4m1!1i2!8m2!3d14.3499989!4d108.0069535!16s%2Fg%2F1hc2bzk7m!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D");
        info.setOpenTime("Lễ tân phục vụ 24/7");
        info.setCheckInTime("14:00");
        info.setCheckOutTime("12:00");
        info.setDescription("Khách sạn Bắc Hương tọa lạc tại số 196 Trần Hưng Đạo, vị trí trung tâm sầm uất bậc nhất thành phố Kon Tum. Rất thuận tiện để quý khách di chuyển tham quan Nhà Thờ Gỗ Kon Tum, Tòa Giám Mục, Cầu treo Kon Klor và dòng sông Đăk Bla huyền thoại.");
        info.setHeroImage("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80");
        info.setCustomPolicies("[{\"id\":\"p1\",\"title\":\"Chính sách nhận & trả phòng\",\"content\":\"Nhận phòng từ 14:00 và trả phòng trước 12:00 trưa. Khách nhận sớm hoặc trả trễ vui lòng thông báo trước với Lễ tân.\"},{\"id\":\"p2\",\"title\":\"Hỗ trợ phương tiện & đưa đón\",\"content\":\"Có bãi đậu xe ô tô và xe máy rộng rãi có mái che, bảo vệ 24/24. Khách sạn hỗ trợ đặt xe đưa đón sân bay Pleiku.\"},{\"id\":\"p3\",\"title\":\"Dịch vụ dọn phòng & giặt ủi\",\"content\":\"Dọn phòng sạch sẽ mỗi ngày. Có dịch vụ giặt ủi lấy nhanh theo yêu cầu của quý khách.\"}]");
        return info;
    }

    // 1. API: Lấy thông tin khách sạn Bắc Hương từ MySQL
    @GetMapping("/hotel-info")
    public ResponseEntity<?> getHotelInfo() {
        Optional<HotelInfo> opt = hotelInfoRepository.findById(1L);
        if (opt.isPresent()) {
            return ResponseEntity.ok(opt.get());
        }
        HotelInfo defaultInfo = getDefaultHotelInfo();
        return ResponseEntity.ok(hotelInfoRepository.save(defaultInfo));
    }

    // 1.1. API (Admin): Cập nhật thông tin khách sạn (Tên, địa chỉ, sđt, giờ giấc, chính sách...)
    @PutMapping("/hotel-info")
    public ResponseEntity<?> updateHotelInfo(@RequestBody HotelInfo updated) {
        HotelInfo existing = hotelInfoRepository.findById(1L).orElseGet(this::getDefaultHotelInfo);
        
        if (updated.getName() != null && !updated.getName().trim().isEmpty()) {
            existing.setName(updated.getName().trim());
        }
        if (updated.getTagline() != null) {
            existing.setTagline(updated.getTagline().trim());
        }
        if (updated.getAddress() != null && !updated.getAddress().trim().isEmpty()) {
            existing.setAddress(updated.getAddress().trim());
        }
        if (updated.getHotline() != null && !updated.getHotline().trim().isEmpty()) {
            existing.setHotline(updated.getHotline().trim());
        }
        if (updated.getLandline() != null) {
            existing.setLandline(updated.getLandline().trim());
        }
        if (updated.getEmail() != null && !updated.getEmail().trim().isEmpty()) {
            existing.setEmail(updated.getEmail().trim());
        }
        if (updated.getAdminEmail() != null) {
            existing.setAdminEmail(updated.getAdminEmail().trim());
        }
        if (updated.getGoogleMapsUrl() != null && !updated.getGoogleMapsUrl().trim().isEmpty()) {
            existing.setGoogleMapsUrl(updated.getGoogleMapsUrl().trim());
        } else if (existing.getGoogleMapsUrl() == null) {
            existing.setGoogleMapsUrl("");
        }
        if (updated.getOpenTime() != null) {
            existing.setOpenTime(updated.getOpenTime().trim());
        }
        if (updated.getCheckInTime() != null) {
            existing.setCheckInTime(updated.getCheckInTime().trim());
        }
        if (updated.getCheckOutTime() != null) {
            existing.setCheckOutTime(updated.getCheckOutTime().trim());
        }
        if (updated.getDescription() != null) {
            existing.setDescription(updated.getDescription().trim());
        }
        if (updated.getHeroImage() != null) {
            existing.setHeroImage(updated.getHeroImage().trim());
        }
        if (updated.getCustomPolicies() != null) {
            existing.setCustomPolicies(updated.getCustomPolicies().trim());
        }

        HotelInfo saved = hotelInfoRepository.save(existing);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Đã cập nhật thông tin khách sạn thành công!");
        resp.put("hotelInfo", saved);
        return ResponseEntity.ok(resp);
    }

    // 1.2. API (Admin): Khôi phục thông tin khách sạn về mặc định ban đầu
    @PostMapping("/hotel-info/reset")
    public ResponseEntity<?> resetHotelInfo() {
        HotelInfo defaultInfo = getDefaultHotelInfo();
        HotelInfo saved = hotelInfoRepository.save(defaultInfo);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Đã khôi phục thông tin khách sạn về mặc định thành công!");
        resp.put("hotelInfo", saved);
        return ResponseEntity.ok(resp);
    }

    // 2. API: Lấy danh sách toàn bộ phòng (kèm trạng thái Xanh/Đỏ/Vàng)
    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    // 2.1. API (Admin): Thêm phòng mới
    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(@RequestBody Room room) {
        if (room.getRoomNumber() == null || room.getPricePerNight() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập số phòng và giá phòng!"));
        }
        if (room.getStatus() == null) {
            room.setStatus(Room.RoomStatus.AVAILABLE);
        }
        Room saved = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 2.2. API (Admin): Cập nhật thông tin phòng (Tên, giá, sức chứa, ảnh...)
    @PutMapping("/rooms/{id}")
    public ResponseEntity<?> updateRoomDetails(@PathVariable Long id, @RequestBody Room updated) {
        Optional<Room> opt = roomRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy phòng!"));
        }
        Room room = opt.get();
        if (updated.getName() != null) room.setName(updated.getName());
        if (updated.getType() != null) room.setType(updated.getType());
        if (updated.getPricePerNight() != null) room.setPricePerNight(updated.getPricePerNight());
        if (updated.getCapacity() != null) room.setCapacity(updated.getCapacity());
        if (updated.getBed() != null) room.setBed(updated.getBed());
        if (updated.getImage() != null) room.setImage(updated.getImage());
        if (updated.getFloor() != null) room.setFloor(updated.getFloor());
        if (updated.getStatus() != null) room.setStatus(updated.getStatus());
        if (updated.getCurrentGuest() != null) room.setCurrentGuest(updated.getCurrentGuest());
        if (updated.getCheckOut() != null) room.setCheckOut(updated.getCheckOut());
        
        Room saved = roomRepository.save(room);
        return ResponseEntity.ok(saved);
    }

    // 2.3. API (Admin): Xóa phòng khỏi khách sạn
    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        if (!roomRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy phòng!"));
        }
        roomRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa phòng thành công!"));
    }

    // 3. API: Lễ tân cập nhật trạng thái phòng (AVAILABLE, OCCUPIED, CLEANING)
    @PutMapping("/rooms/{id}/status")
    public ResponseEntity<?> updateRoomStatus(
            @PathVariable Long id,
            @RequestParam Room.RoomStatus status,
            @RequestParam(required = false) String guestName,
            @RequestParam(required = false) String checkOut) {
        
        Optional<Room> roomOpt = roomRepository.findById(id);
        if (roomOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phòng!");
        }

        Room room = roomOpt.get();
        room.setStatus(status);
        if (status == Room.RoomStatus.OCCUPIED) {
            if (guestName != null && !guestName.trim().isEmpty()) {
                room.setCurrentGuest(guestName.trim());
            }
            if (checkOut != null && !checkOut.trim().isEmpty()) {
                room.setCheckOut(checkOut.trim());
            }
        } else {
            // Khi phòng chuyển sang AVAILABLE hoặc CLEANING (trả phòng hoặc dọn dẹp)
            room.setCurrentGuest(null);
            room.setCheckOut(null);
        }

        roomRepository.save(room);
        return ResponseEntity.ok(room);
    }

    // 4. API: Lấy danh sách các đơn đặt phòng (Dành cho Lễ tân)
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAllByOrderByCreatedAtDesc());
    }

    // 5. API: Khách hàng Đặt phòng -> Lưu DB với trạng thái PENDING (Chờ duyệt), Gửi Email thông báo tới Khách Sạn!
    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        if (booking.getGuestName() == null || booking.getGuestPhone() == null || booking.getGuestEmail() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng điền đủ Họ tên, Số điện thoại và Email!"));
        }

        // 1. Kiểm tra định dạng Email
        String emailClean = booking.getGuestEmail().trim();
        if (!emailClean.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không đúng định dạng (Ví dụ: vidu@gmail.com)!"));
        }

        // 2. Kiểm tra định dạng Số điện thoại Việt Nam (10 số, đầu 03, 05, 07, 08, 09 hoặc +84)
        String phoneClean = booking.getGuestPhone().replaceAll("[\\s.-]", "");
        if (!phoneClean.matches("^(0|\\+84)(3|5|7|8|9)[0-9]{8}$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Số điện thoại không đúng định dạng (Phải gồm 10 số, ví dụ: 0912345678, đầu số 03, 05, 07, 08, 09)!"));
        }

        booking.setGuestEmail(emailClean);
        booking.setGuestPhone(phoneClean);

        // Tạo mã đơn ngẫu nhiên
        booking.setBookingCode("BH-" + (int)(1000 + Math.random() * 9000));

        // Tự động tính ngày trả phòng nếu chưa có
        if (booking.getCheckOutDate() == null && booking.getCheckInDate() != null && booking.getNights() != null) {
            booking.setCheckOutDate(booking.getCheckInDate().plusDays(booking.getNights()));
        }
        
        // Đơn mới tạo luôn ở trạng thái CHỜ XÁC NHẬN (PENDING)
        booking.setStatus(Booking.BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        // BƯỚC 1: KÍCH HOẠT GỬI EMAIL THÔNG BÁO TỚI KHÁCH SẠN BẮC HƯƠNG (anchinh794@gmail.com)
        try {
            emailService.sendNewBookingAlertToHotel(savedBooking);
        } catch (Exception e) {
            System.err.println("Gửi email tới khách sạn lỗi: " + e.getMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã gửi yêu cầu đặt phòng thành công! Đơn đặt đang ở trạng thái Chờ Khách Sạn Xác Nhận.");
        response.put("booking", savedBooking);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 5.1. API: Lễ tân / Admin DUYỆT ĐƠN ĐẶT PHÒNG -> Khóa phòng sang ĐỎ (OCCUPIED) và Bắn Email duyệt tới Khách Hàng!
    @PutMapping("/bookings/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy đơn đặt phòng!"));
        }

        Booking booking = bookingOpt.get();
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        Booking savedBooking = bookingRepository.save(booking);

        // 1. Chuyển trạng thái phòng sang OCCUPIED (Đỏ - Đã có khách) và gán ngày dự kiến trả phòng
        if (booking.getRoomId() != null) {
            roomRepository.findById(booking.getRoomId()).ifPresent(room -> {
                room.setStatus(Room.RoomStatus.OCCUPIED);
                room.setCurrentGuest(booking.getGuestName());
                if (booking.getCheckOutDate() != null) {
                    java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    room.setCheckOut(booking.getCheckOutDate().format(dtf));
                }
                roomRepository.save(room);
            });
        }

        // 2. BƯỚC 2: BẮN EMAIL DUYỆT ĐƠN TỚI KHÁCH HÀNG (ví dụ anchinhktvn123@gmail.com)
        try {
            emailService.sendBookingApprovalToGuest(savedBooking);
        } catch (Exception e) {
            System.err.println("Gửi email duyệt đơn tới khách lỗi: " + e.getMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã duyệt đơn đặt phòng #" + booking.getBookingCode() + " thành công! Email xác nhận đã được gửi tự động tới khách: " + booking.getGuestEmail());
        response.put("booking", savedBooking);

        return ResponseEntity.ok(response);
    }

    // 5.2. API: Lễ tân / Admin TỪ CHỐI ĐƠN ĐẶT PHÒNG -> Giữ nguyên phòng AVAILABLE và Bắn Email từ chối kèm lý do cho khách
    @PutMapping("/bookings/{id}/reject")
    public ResponseEntity<?> rejectBooking(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy đơn đặt phòng!"));
        }

        Booking booking = bookingOpt.get();
        booking.setStatus(Booking.BookingStatus.REJECTED);
        String reason = (body != null && body.get("reason") != null && !body.get("reason").trim().isEmpty()) 
                ? body.get("reason") 
                : "Khách sạn hiện đang kín phòng vào khung giờ này";
        booking.setRejectionReason(reason);
        Booking savedBooking = bookingRepository.save(booking);

        // 1. Đảm bảo phòng vẫn ở trạng thái AVAILABLE (Xanh - Sẵn sàng)
        if (booking.getRoomId() != null) {
            roomRepository.findById(booking.getRoomId()).ifPresent(room -> {
                if (room.getStatus() != Room.RoomStatus.OCCUPIED) {
                    room.setStatus(Room.RoomStatus.AVAILABLE);
                    room.setCurrentGuest(null);
                    room.setCheckOut(null);
                    roomRepository.save(room);
                }
            });
        }

        // 2. BƯỚC 3: BẮN EMAIL TỪ CHỐI KÈM LÝ DO TỚI KHÁCH HÀNG (anchinhktvn123@gmail.com)
        try {
            emailService.sendBookingRejectionToGuest(savedBooking, reason);
        } catch (Exception e) {
            System.err.println("Gửi email từ chối đơn tới khách lỗi: " + e.getMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã từ chối đơn đặt phòng #" + booking.getBookingCode() + ". Email thông báo lịch sự đã được gửi tới khách: " + booking.getGuestEmail());
        response.put("booking", savedBooking);

        return ResponseEntity.ok(response);
    }

    // 6. API: Hủy đơn đặt phòng (Giải phóng phòng về trạng thái Sẵn sàng)
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy đơn đặt phòng!"));
        }

        Booking booking = bookingOpt.get();

        // 1. Tự động giải phóng phòng về trạng thái AVAILABLE (Xanh - Sẵn sàng)
        if (booking.getRoomId() != null) {
            roomRepository.findById(booking.getRoomId()).ifPresent(room -> {
                room.setStatus(Room.RoomStatus.AVAILABLE);
                room.setCurrentGuest(null);
                room.setCheckOut(null);
                roomRepository.save(room);
            });
        }

        // 2. Xóa đơn đặt phòng khỏi hệ thống
        bookingRepository.deleteById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã hủy đơn thành công! Phòng " + (booking.getRoomNumber() != null ? booking.getRoomNumber() : "") + " đã được mở lại.");
        return ResponseEntity.ok(response);
    }
}
