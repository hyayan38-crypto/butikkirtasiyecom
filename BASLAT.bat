@echo off
title Butiik Kirtasiye - Dev Server
color 0A

echo ============================================
echo   BUTIIK KIRTASIYE - E-TICARET SITESI
echo ============================================
echo.
echo Site baslatiliyor...
echo.

cd /d "%~dp0"
set DATABASE_URL=file:./dev.db

:menu
echo [1] Siteyi baslat (http://localhost:3000)
echo [2] Admin paneli: http://localhost:3000/admin
echo [3] Veritabani sifirla ve seed calistir
echo.

choice /c 123 /n /m "Seciminiz: "

if errorlevel 3 goto seed
if errorlevel 2 goto start
if errorlevel 1 goto start

:start
echo.
echo Site baslatiliyor...
echo Tarayicinizda http://localhost:3000 adresini acin
echo.
echo Admin giris: admin@butikkirtasiye.com / admin123
echo.
npm run dev
pause
goto menu

:seed
echo.
echo Veritabani sifirlanıyor...
npx prisma db push
npx tsx prisma/seed.ts
echo.
echo Tamamlandi!
pause
goto menu
