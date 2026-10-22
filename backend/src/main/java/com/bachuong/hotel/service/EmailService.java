package com.bachuong.hotel.service;

import com.bachuong.hotel.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:anchinh794@gmail.com}")
    private String senderEmail;

    @Value("${hotel.admin.email:anchinh794@gmail.com}")
    private String hotelAdminEmail;

    /**
     * 1. BƯỚC 1: Khi khách bấm đặt phòng -> Gửi email thông báo đơn mới CẦN DUYỆT tới Khách Sạn Bắc Hương
     */
    public boolean sendNewBookingAlertToHotel(Booking booking) {
        String subject = "🛎️ [ĐƠN ĐẶT PHÒNG MỚI CẦN DUYỆT] Khách " + booking.getGuestName() + " đặt " + booking.getRoomNumber() + " (#" + booking.getBookingCode() + ")";
        
        String content = "Kính gửi Ban Quản Lý & Lễ Tân Khách Sạn Bắc Hương,\n\n"
                + "Hệ thống vừa tiếp nhận 1 đơn đặt phòng MỚI và đang ở trạng thái CHỜ XÁC NHẬN:\n\n"
                + "==========================================================\n"
                + "THÔNG TIN CHI TIẾT ĐƠN ĐẶT PHÒNG\n"
                + "==========================================================\n"
                + "• Mã đặt phòng: #" + booking.getBookingCode() + "\n"
                + "• Trạng thái: CHỜ DUYỆT (PENDING)\n"
                + "• Hạng phòng: " + booking.getRoomNumber() + " - " + booking.getRoomName() + "\n"
                + "• Tên khách hàng: " + booking.getGuestName() + "\n"
                + "• Số điện thoại khách: " + booking.getGuestPhone() + "\n"
                + "• Email khách: " + booking.getGuestEmail() + "\n"
                + "• Ngày nhận phòng: " + booking.getCheckInDate() + "\n"
                + "• Số đêm lưu trú: " + booking.getNights() + " đêm\n"
                + "• Tổng tiền: " + booking.getTotalPrice() + " VNĐ\n"
                + "• Ghi chú của khách: " + (booking.getNotes() != null && !booking.getNotes().isEmpty() ? booking.getNotes() : "Không có") + "\n\n"
                + "👉 VUI LÒNG ĐĂNG NHẬP VÀO TRANG QUẢN TRỊ:\n"
                + "Truy cập: http://localhost:3001 -> Vào mục 'Sổ Đặt Phòng' để kiểm tra và bấm nút [DUYỆT ĐƠN] giữ phòng cho khách.\n\n"
                + "Trân trọng,\nHệ thống Đặt phòng Khách Sạn Bắc Hương 196 Trần Hưng Đạo, TP. Kon Tum";

        System.out.println("==========================================================");
        System.out.println("📧 [GỬI THÔNG BÁO ĐƠN MỚI TỚI KHÁCH SẠN: " + hotelAdminEmail + "]");
        System.out.println(content);
        System.out.println("==========================================================");

        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderEmail);
                message.setTo(hotelAdminEmail);
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                System.out.println("✅ Đã gửi email thông báo đơn mới tới Khách sạn thành công!");
                return true;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Lỗi gửi email tới khách sạn: " + e.getMessage());
        }

        return false;
    }

    /**
     * 2. BƯỚC 2: Khi Khách Sạn bấm [DUYỆT] đơn -> Gửi email xác nhận thành công tới Khách Hàng
     */
    public boolean sendBookingApprovalToGuest(Booking booking) {
        String subject = "🏨 [Khách Sạn Bắc Hương] Đơn đặt phòng #" + booking.getBookingCode() + " CỦA BẠN ĐÃ ĐƯỢC DUYỆT THÀNH CÔNG!";
        
        String content = "Kính chào Quý khách " + booking.getGuestName() + ",\n\n"
                + "Khách Sạn Bắc Hương trân trọng thông báo: Đơn đặt phòng của Quý khách ĐÃ ĐƯỢC KHÁCH SẠN XÁC NHẬN THÀNH CÔNG!\n\n"
                + "Phòng của Quý khách đã được giữ chỗ an toàn trong hệ thống của chúng tôi.\n\n"
                + "==========================================================\n"
                + "PHIẾU XÁC NHẬN ĐẶT PHÒNG THÀNH CÔNG\n"
                + "==========================================================\n"
                + "• Mã đặt phòng: #" + booking.getBookingCode() + "\n"
                + "• Trạng thái đơn: ĐÃ DUYỆT (CONFIRMED)\n"
                + "• Hạng phòng: " + booking.getRoomNumber() + " - " + booking.getRoomName() + "\n"
                + "• Ngày nhận phòng: " + booking.getCheckInDate() + "\n"
                + "• Thời gian lưu trú: " + booking.getNights() + " đêm\n"
                + "• Tổng thanh toán: " + booking.getTotalPrice() + " VNĐ\n"
                + "• Khách hàng: " + booking.getGuestName() + " (SĐT: " + booking.getGuestPhone() + ")\n\n"
                + "--- THÔNG TIN KHÁCH SẠN BẮC HƯƠNG ---\n"
                + "• Địa chỉ: 196 Trần Hưng Đạo, Phường Quyết Thắng, TP. Kon Tum, Tỉnh Kon Tum\n"
                + "• Hotline Lễ Tân 24/7: 0935.911.889 - 0828.211.222 (Bàn: 0260.3862.666)\n"
                + "• Chỉ đường Google Maps: https://www.google.com/maps/place/Kh%C3%A1ch+S%E1%BA%A1n+B%E1%BA%AFc+H%C6%B0%C6%A1ng/@14.3602403,108.0124471,15z\n\n"
                + "Khách Sạn Bắc Hương rất hân hạnh được đón tiếp và phục vụ Quý khách tại Kon Tum!";

        System.out.println("==========================================================");
        System.out.println("📧 [GỬI EMAIL DUYỆT ĐƠN TỚI KHÁCH HÀNG: " + booking.getGuestEmail() + "]");
        System.out.println(content);
        System.out.println("==========================================================");

        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderEmail);
                message.setTo(booking.getGuestEmail());
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                System.out.println("✅ Đã gửi email xác nhận duyệt đơn tới Khách hàng thành công!");
                return true;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Lỗi gửi email tới khách hàng: " + e.getMessage());
        }

        return false;
    }

    /**
     * 3. BƯỚC 3: Khi Khách Sạn bấm [TỪ CHỐI] đơn -> Gửi email lịch sự giải thích lý do tới Khách Hàng
     */
    public boolean sendBookingRejectionToGuest(Booking booking, String reason) {
        String subject = "🛎️ [Khách Sạn Bắc Hương] Thông báo về yêu cầu đặt phòng #" + booking.getBookingCode();
        String cleanReason = (reason != null && !reason.trim().isEmpty()) ? reason : "Hiện khách sạn đang kín phòng vào khung giờ này";

        String content = "Kính gửi Quý khách " + booking.getGuestName() + ",\n\n"
                + "Khách Sạn Bắc Hương xin gửi lời cảm ơn chân thành vì Quý khách đã quan tâm và đặt phòng tại khách sạn chúng tôi.\n\n"
                + "Tuy nhiên, khách sạn rất tiếc phải thông báo rằng chúng tôi CHƯA THỂ TIẾP NHẬN đơn đặt phòng #" + booking.getBookingCode() + " (Phòng " + booking.getRoomNumber() + " - " + booking.getRoomName() + ") của Quý khách vào thời điểm này.\n\n"
                + "==========================================================\n"
                + "CHI TIẾT THÔNG BÁO TỪ CHỐI ĐẶT PHÒNG\n"
                + "==========================================================\n"
                + "• Mã đặt phòng: #" + booking.getBookingCode() + "\n"
                + "• Trạng thái đơn: KHÔNG THỂ PHỤC VỤ (REJECTED)\n"
                + "• Lý do từ chối: " + cleanReason + "\n"
                + "• Ngày nhận phòng dự kiến: " + booking.getCheckInDate() + " (" + booking.getNights() + " đêm)\n"
                + "• Hạng phòng: " + booking.getRoomNumber() + " - " + booking.getRoomName() + "\n\n"
                + "Khách Sạn Bắc Hương thành thật xin lỗi vì sự bất tiện này. Quý khách có thể truy cập website để chọn hạng phòng khác hoặc đổi ngày lưu trú: http://localhost:3001\n\n"
                + "--- HỖ TRỢ ĐẶT PHÒNG LINH HOẠT ---\n"
                + "Nếu cần hỗ trợ gấp hoặc xếp phòng linh hoạt, Quý khách vui lòng liên hệ trực tiếp Hotline Lễ tân 24/7:\n"
                + "📞 0935.911.889 - 0828.211.222 (Bàn: 0260.3862.666)\n"
                + "📍 Địa chỉ: 196 Trần Hưng Đạo, Phường Quyết Thắng, TP. Kon Tum\n\n"
                + "Trân trọng,\nBộ phận Lễ tân & Đặt phòng - Khách Sạn Bắc Hương";

        System.out.println("==========================================================");
        System.out.println("📧 [GỬI EMAIL TỪ CHỐI ĐƠN TỚI KHÁCH HÀNG: " + booking.getGuestEmail() + "]");
        System.out.println(content);
        System.out.println("==========================================================");

        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderEmail);
                message.setTo(booking.getGuestEmail());
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                System.out.println("✅ Đã gửi email thông báo từ chối tới Khách hàng thành công!");
                return true;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Lỗi gửi email từ chối: " + e.getMessage());
        }

        return false;
    }

    /**
     * Tương thích ngược: Gửi xác nhận phòng
     */
    public boolean sendBookingConfirmation(Booking booking) {
        return sendBookingApprovalToGuest(booking);
    }

    /**
     * 3. Gửi mã OTP xác thực qua Gmail (Đổi mật khẩu / Quên mật khẩu)
     */
    public boolean sendOtpEmail(String toEmail, String otp, String purpose) {
        String subject = "🔐 [Khách Sạn Bắc Hương] Mã xác thực OTP: " + otp;
        String content = "Kính chào Quý khách,\n\n"
                + "Bạn vừa yêu cầu " + purpose + " tại hệ thống Khách Sạn Bắc Hương.\n"
                + "Mã xác thực OTP của bạn là: " + otp + "\n"
                + "Mã này có hiệu lực trong vòng 10 phút. Tuyệt đối không cung cấp mã này cho người khác để bảo mật tài khoản.\n\n"
                + "Trân trọng,\nBan Quản Lý Khách Sạn Bắc Hương";

        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                System.out.println("✅ Đã gửi mã OTP thực tế qua Gmail SMTP thành công!");
                return true;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Lỗi gửi OTP qua Gmail: " + e.getMessage());
        }

        return false;
    }
}
