@echo off
echo Запуск локального сервера для игры Moldova...
echo.
echo Пробуем запустить Python сервер...
python -m http.server 8000
if %errorlevel% neq 0 (
    echo Python не найден, пробуем py...
    py -m http.server 8000
    if %errorlevel% neq 0 (
        echo Python не установлен.
        echo.
        echo Установите Python с сайта: https://www.python.org/downloads/
        echo Или используйте VS Code с расширением Live Server
        echo.
        pause
    )
)
pause
