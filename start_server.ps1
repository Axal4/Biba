Write-Host "🚀 Запуск локального сервера для игры Moldova..." -ForegroundColor Green
Write-Host ""

# Проверяем наличие Python
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "✅ Python найден: $pythonVersion" -ForegroundColor Green
        Write-Host "🌐 Запускаем сервер на порту 8000..." -ForegroundColor Yellow
        Write-Host "📱 Откройте http://localhost:8000 в браузере" -ForegroundColor Cyan
        Write-Host "⏹️  Для остановки сервера нажмите Ctrl+C" -ForegroundColor Red
        Write-Host ""
        python -m http.server 8000
    }
} catch {
    try {
        $pyVersion = py --version 2>$null
        if ($pyVersion) {
            Write-Host "✅ Python найден: $pyVersion" -ForegroundColor Green
            Write-Host "🌐 Запускаем сервер на порту 8000..." -ForegroundColor Yellow
            Write-Host "📱 Откройте http://localhost:8000 в браузере" -ForegroundColor Cyan
            Write-Host "⏹️  Для остановки сервера нажмите Ctrl+C" -ForegroundColor Red
            Write-Host ""
            py -m http.server 8000
        }
    } catch {
        Write-Host "❌ Python не найден!" -ForegroundColor Red
        Write-Host ""
        Write-Host "📥 Установите Python:" -ForegroundColor Yellow
        Write-Host "   https://www.python.org/downloads/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🔧 Альтернативные решения:" -ForegroundColor Yellow
        Write-Host "   1. Используйте VS Code с расширением Live Server" -ForegroundColor White
        Write-Host "   2. Установите Node.js и используйте npx serve" -ForegroundColor White
        Write-Host "   3. Используйте встроенный сервер в браузере (не рекомендуется)" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 После установки Python запустите этот скрипт снова" -ForegroundColor Green
        Read-Host "Нажмите Enter для выхода"
    }
}
