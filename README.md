# BẮC HƯƠNG HOTEL - HỆ THỐNG QUẢN LÝ & ĐẶT PHÒNG KHÁCH SẠN TRỰC TUYẾN

> **Khách Sạn Bắc Hương** — Dự án Fullstack hoàn chỉnh quản lý lưu trú và đặt phòng khách sạn theo thời gian thực (Real-time Hotel Management System).
---

## 🌟 TỔNG QUAN DỰ ÁN

Hệ thống cung cấp giải pháp chuyển đổi số toàn diện cho mô hình khách sạn vừa và nhỏ:
- **Cổng thông tin khách hàng (Client Portal):** Tra cứu phòng nghỉ, xem chi tiết tiện nghi, lọc phòng thông minh, đặt phòng trực tuyến, theo dõi trạng thái đơn và nhận email xác nhận tự động.
- **Trung tâm điều hành Quản trị & Lễ tân (Admin & Staff Dashboard):** Theo dõi sơ đồ ma trận phòng trực quan bằng màu sắc, tiếp nhận và duyệt đơn đặt phòng với chuông báo tức thời, quản lý danh mục phòng (Thêm/Sửa/Xóa), phân quyền nhân viên và đổi mật khẩu an toàn.

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG (TECH STACK)

| Thành phần | Công nghệ / Thư viện | Vai trò |
| :--- | :--- | :--- |
| **Backend** | **Java 17+ / Spring Boot 3** | Xây dựng RESTful API, xử lý nghiệp vụ, bảo mật xác thực |
| **Database** | **MySQL 8.0** | Hệ quản trị cơ sở dữ liệu quan hệ lưu trữ phòng, đơn đặt phòng, tài khoản |
| **ORM** | **Spring Data JPA / Hibernate** | Ánh xạ đối tượng Java với bảng CSDL MySQL |
| **Email Service** | **Spring Mail (Gmail SMTP)** | Tự động gửi email xác nhận đặt phòng kèm mã đơn / lý do từ chối |
| **Frontend** | **React 18 + Vite** | Giao diện người dùng Single Page Application (SPA) tốc độ cao |
| **Giao diện & Icon**| **Vanilla CSS + Lucide React** | Thiết kế phong cách Luxury Amber ấm áp, tối ưu trên mọi màn hình |
| **Xác thực** | **BCrypt + Google Identity OAuth2** | Đăng nhập tài khoản mật khẩu mã hóa hoặc qua Google |

---

## 🚀 TÍNH NĂNG NỔI BẬT

### 1. Dành Cho Khách Hàng (Client Portal)
- 🔎 **Bộ lọc phòng thông minh:** Lọc theo số lượng khách (1-4+ người), loại giường (đơn, đôi, family), khoảng giá linh hoạt và tùy chọn chỉ hiện phòng đang trống.
- 📄 **Phân trang & Sắp xếp mới nhất:** Hiển thị 10 phòng/trang, tự động ưu tiên phòng mới lên đầu, tự động cuộn trang mượt mà khi chuyển trang.
- 📝 **Đặt phòng chuẩn hóa:** Tích hợp kiểm tra định dạng Email và Số điện thoại Việt Nam (10 số, đầu 03, 05, 07, 08, 09), tính toán tổng tiền theo số đêm lưu trú.
- 💖 **Phòng yêu thích:** Lưu lại các phòng ưng ý vào danh sách để đặt sau mà không cần đăng nhập lại.
- 📋 **Sổ đơn cá nhân:** Khách có thể theo dõi tiến độ duyệt đơn, lý do từ chối (nếu có) và chủ động hủy đơn khi thay đổi lịch trình.

### 2. Dành Cho Quản Trị Viên & Lễ Tân (Admin & Staff)
- 🎨 **Sơ đồ ma trận màu sắc (Room Matrix):** 
  - 🟢 **Xanh lá:** Phòng trống sẵn sàng đón khách.
  - 🔴 **Đỏ:** Phòng đang có khách lưu trú (hiển thị tên khách).
  - 🟡 **Vàng:** Phòng đang trong quá trình dọn dẹp / bảo trì.
  - *Lễ tân có thể đổi trạng thái phòng chỉ bằng 1 cú click chuột.*
- 🔔 **Chuông lễ tân & Cảnh báo tức thì:** Phát chuông âm thanh kèm popup thông báo nổi ngay khi có khách gửi yêu cầu đặt phòng mới từ xa.
- 📑 **Sổ quản lý đơn đặt phòng:**
  - Bộ lọc trạng thái nhanh: *Tất cả*, *Chờ duyệt*, *Đã xác nhận*, *Đã từ chối / Hủy*.
  - Hiển thị ngày nhận phòng và ngày trả phòng chuẩn `DD/MM/YYYY`.
  - Phân trang 10 đơn/trang, sắp xếp đơn mới nhất lên đầu.
  - Nút **Duyệt đơn** (tự động chuyển phòng sang Có Khách và gửi email xác nhận) hoặc **Từ chối đơn** kèm hộp thoại nhập lý do gửi đến khách hàng.
- 🏢 **Quản lý danh mục phòng (CRUD - Dành riêng Admin):** Thêm phòng mới, cập nhật giá, hình ảnh, tiện nghi, phân trang 10 phòng/trang.
- 👥 **Quản lý nhân sự:** Admin tối cao có thể cấp tài khoản cho nhân viên lễ tân mới và quản lý danh sách nhân sự.

---

## 📁 CẤU TRÚC DỰ ÁN

```bash
bac-huong-hotel/
├── backend/                             # Mã nguồn Backend Spring Boot 3
│   ├── src/main/java/com/bachuong/hotel/
│   │   ├── controller/                 # REST Controllers (HotelController, AuthController)
│   │   ├── model/                      # JPA Entities (Room, Booking, Account)
│   │   ├── repository/                 # Spring Data JPA Repositories
│   │   └── service/                    # EmailService gửi thư tự động
│   ├── src/main/resources/
│   │   ├── application.properties.example # Cấu hình mẫu kết nối DB & Mail
│   │   └── application.properties      # Cấu hình nội bộ (đã ignore)
│   └── pom.xml                         # Quản lý thư viện Maven
│
├── frontend/                            # Mã nguồn Frontend React + Vite
│   ├── src/
│   │   ├── components/                 # Các component (AdminDashboard, BookingModal, ...)
│   │   ├── data/bacHuongData.js        # Dữ liệu tĩnh dự phòng (Offline fallback)
│   │   ├── App.jsx                     # Component gốc điều hướng toàn hệ thống
│   │   └── main.jsx
│   └── package.json
│
├── database/                            # Kịch bản cơ sở dữ liệu
│   └── schema.sql                      # Kịch bản khởi tạo bảng & dữ liệu mẫu
├── run_backend.bat                      # Phím tắt chạy nhanh Backend
├── run_frontend.bat                     # Phím tắt chạy nhanh Frontend
├── .gitignore                           # Loại trừ node_modules, target, file mật
└── README.md                            # Tài liệu dự án
```

---

## ⚡ HƯỚNG DẪN CÀI ĐẶT & CHẠY NHANH

### 1. Khởi tạo Cơ Sở Dữ Liệu MySQL
1. Mở MySQL Workbench, phpMyAdmin hoặc dòng lệnh MySQL.
2. Mở file [`database/schema.sql`](database/schema.sql) và thực thi (Execute) để tạo database `bachuong_hotel` cùng các bảng dữ liệu mẫu.

### 2. Cấu hình Backend
1. Vào thư mục `backend/src/main/resources/`.
2. Sao chép file `application.properties.example` thành `application.properties`.
3. Cập nhật mật khẩu MySQL và mật khẩu ứng dụng Gmail của bạn:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=mat_khau_mysql_cua_ban
   spring.mail.username=email_gui_cua_ban@gmail.com
   spring.mail.password=mat_khau_ung_dung_gmail
   ```

### 3. Chạy Ứng Dụng
- **Khởi động Backend (Port 8080):**
  Nhấp đúp vào file `run_backend.bat` hoặc mở terminal tại `backend/`:
  ```bash
  ./mvnw spring-boot:run
  ```
- **Khởi động Frontend (Port 3001 hoặc 5173):**
  Nhấp đúp vào file `run_frontend.bat` hoặc mở terminal tại `frontend/`:
  ```bash
  npm install
  npm run dev
  ```
- **Truy cập ứng dụng:** Mở trình duyệt web tại địa chỉ `http://localhost:3001`.

