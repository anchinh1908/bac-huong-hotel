package com.bachuong.hotel.controller;

import com.bachuong.hotel.model.Booking;
import com.bachuong.hotel.model.Room;
import com.bachuong.hotel.repository.BookingRepository;
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
    private EmailService emailService;

    // 1. API: Lấy thông tin khách sạn Bắc Hương
    @GetMapping("/hotel-info")
    public ResponseEntity<?> getHotelInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "Khách Sạn Bắc Hương");
        info.put("address", "196 Trần Hưng Đạo, Phường Quyết Thắng, TP. Kon Tum, Tỉnh Kon Tum");
        info.put("hotline", "0935.911.889 - 0828.211.222");
        info.put("landline", "0260.3862.666");
        info.put("email", "khachsanbachuong.kontum@gmail.com");
        info.put("googleMapsUrl", "https://www.google.com/maps/place/Kh%C3%A1ch+S%E1%BA%A1n+B%E1%BA%AFc+H%C6%B0%C6%A1ng/@14.3602403,108.0124471,15z/data=!4m9!3m8!1s0x316bffa204140589:0xcc7e4d82c2632ce!5m2!4m1!1i2!8m2!3d14.3499989!4d108.0069535!16s%2Fg%2F1hc2bzk7m!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D");
        return ResponseEntity.ok(info);
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
            @RequestParam(required = false) String guestName) {
        
        Optional<Room> roomOpt = roomRepository.findById(id);
        if (roomOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phòng!");
        }

        Room room = roomOpt.get();
        room.setStatus(status);
        if (status == Room.RoomStatus.OCCUPIED && guestName != null) {
            room.setCurrentGuest(guestName);
        } else if (status == Room.RoomStatus.AVAILABLE) {
            room.setCurrentGuest(null);
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

        // 1. Chuyển trạng thái phòng sang OCCUPIED (Đỏ - Đã có khách)
        if (booking.getRoomId() != null) {
            roomRepository.findById(booking.getRoomId()).ifPresent(room -> {
                room.setStatus(Room.RoomStatus.OCCUPIED);
                room.setCurrentGuest(booking.getGuestName());
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
