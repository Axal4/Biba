// Конфигурация игры для Phaser 3
const gameConfig = {
    type: Phaser.AUTO,
    width: 375,  // Стандартная ширина мобильного телефона
    height: 667, // Стандартная высота мобильного телефона (16:9)
    parent: 'game-container',
    backgroundColor: '#667eea',
    scale: {
        mode: Phaser.Scale.FIT, // Фиксированный размер для мобильного формата
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 375,
        height: 667,
        min: {
            width: 320,
            height: 568
        },
        max: {
            width: 414,  // Максимальная ширина iPhone Plus
            height: 896  // Максимальная высота iPhone Plus
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [], // Сцены будут добавлены динамически
    dom: {
        createContainer: true
    },
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: false,
        powerPreference: 'high-performance',
        // Улучшаем качество рендеринга для мобильных
        antialias: true,
        roundPixels: false,
        // Добавляем поддержку высокого DPI
        resolution: Math.max(window.devicePixelRatio || 1, 2),
        // Улучшаем качество текстур
        mipmapFilter: 'LINEAR',
        // Улучшаем сглаживание
        smoothFactor: 1
    },
    audio: {
        disableWebAudio: false
    }
};

// Функция для добавления сцен в конфигурацию
function addScenesToConfig() {
    if (typeof BootScene !== 'undefined' && 
        typeof MainMenuScene !== 'undefined' && 
        typeof GameScene !== 'undefined' && 
        typeof EventScene !== 'undefined' && 
        typeof GameOverScene !== 'undefined') {
        
        gameConfig.scene = [
            BootScene,
            MainMenuScene,
            GameScene,
            EventScene,
            GameOverScene
        ];
        
        console.log('Все сцены добавлены в конфигурацию');
        return true;
    }
    return false;
}

// Функция определения типа устройства (всегда мобильный формат)
function getDeviceType() {
    // Всегда возвращаем мобильный формат для вертикальной игры
    return 'mobile';
}

// Настройки для мобильного вертикального формата
const screenConfig = {
    mobile: {
        width: 375,
        height: 667,
        quality: 'high',
        fontSize: 16,
        strokeThickness: 2,
        // Позиции для мобильного интерфейса
        ui: {
            topBar: { y: 50 },
            map: { y: 200 },
            buttons: { y: 500, spacing: 60 },
            info: { y: 120 }
        }
    },
    // Всегда используем мобильный формат
    tablet: {
        width: 375,
        height: 667,
        quality: 'high',
        fontSize: 16,
        strokeThickness: 2,
        ui: {
            topBar: { y: 50 },
            map: { y: 200 },
            buttons: { y: 500, spacing: 60 },
            info: { y: 120 }
        }
    },
    desktop: {
        width: 375,
        height: 667,
        quality: 'high',
        fontSize: 16,
        strokeThickness: 2,
        ui: {
            topBar: { y: 50 },
            map: { y: 200 },
            buttons: { y: 500, spacing: 60 },
            info: { y: 120 }
        }
    }
};

// Получаем текущий тип устройства
const currentDevice = getDeviceType();
console.log('Тип устройства:', currentDevice);
console.log('Настройки качества:', screenConfig[currentDevice]);

// Настройки игры
const gameSettings = {
    totalDays: 28,
    startDate: '2024-09-01',
    electionDate: '2024-09-28',
    startingBudget: 1000000, // 1 миллион леев
    startingPopularity: 50, // 50% начальная популярность
    regions: {
        north: { name: 'Север', popularity: 50, influence: 0.25 },
        center: { name: 'Центр', popularity: 50, influence: 0.35 },
        gagauzia: { name: 'Гагаузия', popularity: 50, influence: 0.20 },
        transnistria: { name: 'Приднестровье', popularity: 50, influence: 0.20 }
    },
    difficulty: {
        ruling: { name: 'Правящая партия', multiplier: 1.2, startingPopularity: 55 },
        opposition: { name: 'Оппозиция', multiplier: 0.8, startingPopularity: 45 }
    }
};

// Цвета для регионов
const regionColors = {
    north: 0x4CAF50,      // Зеленый
    center: 0x2196F3,     // Синий
    gagauzia: 0xFF9800,   // Оранжевый
    transnistria: 0x9C27B0 // Фиолетовый
};

// Настройки UI
const uiConfig = {
    colors: {
        primary: 0xFF6B6B,
        secondary: 0x74B9FF,
        success: 0x00B894,
        danger: 0xE17055,
        warning: 0xFDCB6E,
        info: 0x0984E3
    },
    fonts: {
        title: { fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' },
        subtitle: { fontSize: '24px', fontFamily: 'Arial', color: '#ffffff' },
        body: { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff' },
        small: { fontSize: '14px', fontFamily: 'Arial', color: '#ffffff' }
    },
    animations: {
        duration: 300,
        ease: 'Power2'
    }
};

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameConfig, gameSettings, regionColors, uiConfig };
}
