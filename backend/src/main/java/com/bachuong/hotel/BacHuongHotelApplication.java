package com.bachuong.hotel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BacHuongHotelApplication {
    public static void main(String[] args) {
        SpringApplication.run(BacHuongHotelApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("🚀 BACKEND KHÁCH SẠN BẮC HƯƠNG ĐANG CHẠY CỔNG: 8080");
        System.out.println("📌 Kết nối MySQL: bachuong_hotel");
        System.out.println("📌 Sẵn sàng phục vụ API & Tự động gửi Email xác nhận!");
        System.out.println("==========================================================");
    }
}
