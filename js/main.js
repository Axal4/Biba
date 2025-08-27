// Основной файл игры "28 дней"

// Инициализация Telegram Web App
let tg = null;
if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Применяем тему Telegram
    document.body.classList.add('telegram-theme');
}

// Глобальные переменные игры
let gameInstance = null;
let gameManager = null;

// Функция инициализации игры
function initGame() {
    try {
        // Проверяем, что все сцены загружены и добавлены в конфигурацию
        if (!addScenesToConfig()) {
            console.error('Не все сцены загружены');
            showNotification('Ошибка: не все компоненты игры загружены', 'error');
            return;
        }
        
        // Создаем экземпляр игры Phaser
        gameInstance = new Phaser.Game(gameConfig);
        
        // Инициализируем менеджер игры после загрузки первой сцены
        gameInstance.events.once('ready', () => {
            console.log('Игра готова к запуску');
        });
        
        // Обработка ошибок
        gameInstance.events.on('error', (error) => {
            console.error('Ошибка в игре:', error);
            showNotification('Произошла ошибка в игре', 'error');
        });
        
    } catch (error) {
        console.error('Ошибка инициализации игры:', error);
        showNotification('Не удалось запустить игру', 'error');
    }
}

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Функция для сохранения прогресса
function saveGameProgress() {
    if (gameManager) {
        const progress = gameManager.getGameState();
        try {
            localStorage.setItem('moldova28days_progress', JSON.stringify(progress));
            showNotification('Прогресс сохранен', 'success');
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            showNotification('Не удалось сохранить прогресс', 'error');
        }
    }
}

// Функция для загрузки прогресса
function loadGameProgress() {
    try {
        const savedProgress = localStorage.getItem('moldova28days_progress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            if (gameManager) {
                gameManager.loadGameState(progress);
                showNotification('Прогресс загружен', 'success');
            }
            return progress;
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showNotification('Не удалось загрузить прогресс', 'error');
    }
    return null;
}

// Функция для сброса прогресса
function resetGameProgress() {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
        try {
            localStorage.removeItem('moldova28days_progress');
            if (gameManager) {
                gameManager.resetGame();
            }
            showNotification('Прогресс сброшен', 'warning');
        } catch (error) {
            console.error('Ошибка сброса:', error);
            showNotification('Не удалось сбросить прогресс', 'error');
        }
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализируем игру...');
    
    // Проверяем поддержку Phaser
    if (typeof Phaser === 'undefined') {
        showNotification('Ошибка: Phaser не загружен', 'error');
        return;
    }
    
    // Инициализируем игру
    initGame();
    
    // Добавляем обработчики для кнопок управления (если есть)
    setupControlButtons();
});

// Настройка кнопок управления
function setupControlButtons() {
    // Кнопка сохранения
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveGameProgress);
    }
    
    // Кнопка загрузки
    const loadBtn = document.getElementById('load-btn');
    if (loadBtn) {
        loadBtn.addEventListener('click', loadGameProgress);
    }
    
    // Кнопка сброса
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGameProgress);
    }
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (gameInstance && gameInstance.scale) {
        gameInstance.scale.refresh();
    }
});

// Обработка видимости страницы (для паузы игры)
document.addEventListener('visibilitychange', () => {
    if (gameInstance) {
        if (document.hidden) {
            // Страница скрыта - можно поставить игру на паузу
            if (gameInstance.scene && gameInstance.scene.isActive('GameScene')) {
                gameInstance.scene.pause('GameScene');
            }
        } else {
            // Страница видна - возобновляем игру
            if (gameInstance.scene && gameInstance.scene.isPaused('GameScene')) {
                gameInstance.scene.resume('GameScene');
            }
        }
    }
});

// Экспорт функций для использования в других модулях
window.gameAPI = {
    saveGameProgress,
    loadGameProgress,
    resetGameProgress,
    showNotification,
    getGameInstance: () => gameInstance,
    getGameManager: () => gameManager
};

// Глобальные обработчики ошибок
window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
    showNotification('Произошла неожиданная ошибка', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Необработанное отклонение промиса:', event.reason);
    showNotification('Ошибка в асинхронной операции', 'error');
});

console.log('Основной файл игры загружен');
