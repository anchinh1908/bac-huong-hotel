@echo off
title Backend Khach San Bac Huong
cd /d "%~dp0backend"
echo ========================================================
echo   KHOI DONG BACKEND KHACH SAN BAC HUONG - CONG 8080
echo ========================================================
java -Xmx128m -Xms32m -XX:+UseSerialGC -XX:CompressedClassSpaceSize=64m -XX:ReservedCodeCacheSize=32m -jar target/hotel-backend-0.0.1-SNAPSHOT.jar
pause
