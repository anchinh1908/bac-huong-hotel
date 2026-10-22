package com.bachuong.hotel.controller;

import com.bachuong.hotel.model.Account;
import com.bachuong.hotel.repository.AccountRepository;
import com.bachuong.hotel.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private EmailService emailService;

    // 1. Đăng nhập truyền thống (Username hoặc Email + Password)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String identifier = body.get("username"); // Có thể là username hoặc email
        String password = body.get("password");

        if (identifier == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập tên đăng nhập/email và mật khẩu!"));
        }

        Optional<Account> accountOpt = accountRepository.findByUsernameOrEmail(identifier, identifier);
        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Tài khoản hoặc mật khẩu không chính xác!"));
        }

        Account account = accountOpt.get();
        if (!account.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Tài khoản của bạn đã bị tạm khóa!"));
        }

        if (!password.equals(account.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Mật khẩu không chính xác!"));
        }

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Đăng nhập thành công!");
        res.put("account", sanitizeAccount(account));
        return ResponseEntity.ok(res);
    }

    // 2. Đăng nhập nhanh bằng Google (1-Click Google Login cho Khách hàng)
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String name = body.get("name");
        String avatar = body.get("avatar");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email Google không hợp lệ!"));
        }

        Account account = accountRepository.findByEmail(email).orElseGet(() -> {
            Account newAcc = new Account();
            newAcc.setEmail(email);
            newAcc.setFullName(name != null ? name : "Khách Google");
            newAcc.setAvatarUrl(avatar);
            newAcc.setRole(Account.Role.CUSTOMER);
            newAcc.setProvider("GOOGLE");
            return accountRepository.save(newAcc);
        });

        // Cập nhật thông tin avatar hoặc tên mới nếu có
        if (name != null) account.setFullName(name);
        if (avatar != null) account.setAvatarUrl(avatar);
        accountRepository.save(account);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Đăng nhập Google thành công!");
        res.put("account", sanitizeAccount(account));
        return ResponseEntity.ok(res);
    }

    // 3. Khách hàng Đăng ký tài khoản mới bằng Email
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String fullName = body.get("fullName");
        String phone = body.get("phone");

        if (email == null || password == null || fullName == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng điền đầy đủ Email, Họ tên và Mật khẩu!"));
        }

        // 1. Kiểm tra định dạng Email
        String emailClean = email.trim();
        if (!emailClean.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không đúng định dạng (Ví dụ: vidu@gmail.com)!"));
        }

        // 2. Kiểm tra định dạng Số điện thoại
        String phoneClean = phone != null ? phone.replaceAll("[\\s.-]", "") : null;
        if (phoneClean != null && !phoneClean.isEmpty()) {
            if (!phoneClean.matches("^(0|\\+84)(3|5|7|8|9)[0-9]{8}$")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Số điện thoại không đúng định dạng (Phải gồm 10 số, ví dụ: 0912345678, đầu số 03, 05, 07, 08, 09)!"));
            }
        }

        if (accountRepository.existsByEmail(emailClean)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email này đã được đăng ký tài khoản!"));
        }

        Account newAcc = new Account();
        newAcc.setEmail(emailClean);
        newAcc.setPassword(password);
        newAcc.setFullName(fullName);
        newAcc.setPhone(phoneClean);
        newAcc.setRole(Account.Role.CUSTOMER);
        newAcc.setProvider("LOCAL");
        accountRepository.save(newAcc);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Đăng ký tài khoản thành công!",
                "account", sanitizeAccount(newAcc)
        ));
    }

    // 4. Đổi mật khẩu (Dành cho Admin, Quản lý hoặc Khách hàng)
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, Object> body) {
        Long accountId = Long.valueOf(body.get("accountId").toString());
        String oldPassword = (String) body.get("oldPassword");
        String newPassword = (String) body.get("newPassword");

        Optional<Account> accOpt = accountRepository.findById(accountId);
        if (accOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy tài khoản!"));
        }

        Account account = accOpt.get();
        // Kiểm tra mật khẩu cũ (nếu có mật khẩu cũ)
        if (account.getPassword() != null && !account.getPassword().equals(oldPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu hiện tại không đúng!"));
        }

        account.setPassword(newPassword);
        accountRepository.save(account);

        return ResponseEntity.ok(Map.of("success", true, "message", "Đổi mật khẩu thành công!"));
    }

    // 5. Yêu cầu mã OTP qua Gmail khi quên mật khẩu
    @PostMapping("/forgot-password/request-otp")
    public ResponseEntity<?> requestResetOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<Account> accOpt = accountRepository.findByEmail(email);
        if (accOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy tài khoản với email này!"));
        }

        Account account = accOpt.get();
        // Tạo mã OTP ngẫu nhiên 6 chữ số
        String otp = String.format("%06d", new Random().nextInt(999999));
        account.setResetOtp(otp);
        account.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        accountRepository.save(account);

        // Gửi email OTP
        emailService.sendOtpEmail(email, otp, "đặt lại mật khẩu");

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Mã OTP đã được gửi đến email " + email + ". Vui lòng kiểm tra hộp thư!"
        ));
    }

    // 6. Xác thực OTP và đặt lại mật khẩu mới qua Gmail
    @PostMapping("/forgot-password/verify-and-reset")
    public ResponseEntity<?> verifyAndResetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        String newPassword = body.get("newPassword");

        Optional<Account> accOpt = accountRepository.findByEmail(email);
        if (accOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy tài khoản!"));
        }

        Account account = accOpt.get();
        if (account.getResetOtp() == null || !account.getResetOtp().equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã OTP không chính xác!"));
        }

        if (account.getOtpExpiry() == null || account.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã OTP đã hết hạn!"));
        }

        account.setPassword(newPassword);
        account.setResetOtp(null);
        account.setOtpExpiry(null);
        accountRepository.save(account);

        return ResponseEntity.ok(Map.of("success", true, "message", "Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay."));
    }

    // 7. Lấy danh sách tài khoản Quản lý & Nhân viên Lễ tân (Dành riêng cho Admin)
    @GetMapping("/staff")
    public ResponseEntity<?> getAllStaff() {
        List<Account> staffList = accountRepository.findByRoleInOrderByCreatedAtDesc(
                List.of(Account.Role.ADMIN, Account.Role.STAFF)
        );
        List<Map<String, Object>> sanitized = staffList.stream().map(this::sanitizeAccount).toList();
        return ResponseEntity.ok(sanitized);
    }

    // 8. Admin tạo thêm tài khoản Quản lý / Lễ tân khác
    @PostMapping("/staff")
    public ResponseEntity<?> createStaff(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        String fullName = body.get("fullName");
        String phone = body.get("phone");
        String roleStr = body.get("role"); // "ADMIN" hoặc "STAFF"

        if (email == null || password == null || fullName == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đủ Email, Mật khẩu và Họ tên!"));
        }

        if (username != null && accountRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập này đã tồn tại!"));
        }

        if (accountRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email này đã được sử dụng!"));
        }

        Account staff = new Account();
        staff.setUsername(username);
        staff.setEmail(email);
        staff.setPassword(password);
        staff.setFullName(fullName);
        staff.setPhone(phone);
        staff.setRole("ADMIN".equalsIgnoreCase(roleStr) ? Account.Role.ADMIN : Account.Role.STAFF);
        staff.setProvider("LOCAL");
        accountRepository.save(staff);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Đã tạo tài khoản nhân sự mới thành công!",
                "account", sanitizeAccount(staff)
        ));
    }

    // 9. Admin xóa tài khoản nhân sự
    @DeleteMapping("/staff/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        Optional<Account> accOpt = accountRepository.findById(id);
        if (accOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy tài khoản!"));
        }
        if (accOpt.get().getRole() == Account.Role.ADMIN && "admin".equalsIgnoreCase(accOpt.get().getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không thể xóa tài khoản Super Admin gốc!"));
        }
        accountRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa tài khoản nhân sự thành công!"));
    }

    // Tiện ích ẩn trường password khi trả về Client
    private Map<String, Object> sanitizeAccount(Account acc) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", acc.getId());
        map.put("username", acc.getUsername());
        map.put("email", acc.getEmail());
        map.put("fullName", acc.getFullName());
        map.put("phone", acc.getPhone());
        map.put("role", acc.getRole().name());
        map.put("avatarUrl", acc.getAvatarUrl());
        map.put("provider", acc.getProvider());
        map.put("createdAt", acc.getCreatedAt());
        return map;
    }
}
