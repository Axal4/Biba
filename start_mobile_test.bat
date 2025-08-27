@echo off
echo 🚀 Запуск сервера для мобильного тестирования...
echo.

echo 📱 Инструкция для тестирования на телефоне:
echo 1. Убедитесь, что телефон и компьютер в одной Wi-Fi сети
echo 2. Запустите этот скрипт
echo 3. На телефоне откройте браузер и введите IP адрес компьютера
echo.

echo 🔍 Определяем IP адрес компьютера...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set ip=%%a
    goto :found
)
:found
echo ✅ IP адрес: %ip%
echo.

echo 🌐 Запускаем сервер на всех интерфейсах...
echo 📱 На телефоне откройте: http://%ip%:8000
echo.

python -m http.server 8000 --bind 0.0.0.0
if %errorlevel% neq 0 (
    echo Python не найден, пробуем py...
    py -m http.server 8000 --bind 0.0.0.0
    if %errorlevel% neq 0 (
        echo Python не установлен.
        echo Установите Python с сайта: https://www.python.org/downloads/
        pause
    )
)
pause
