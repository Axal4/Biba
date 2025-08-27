// Конфигурация игры для Phaser 3
const gameConfig = {
    type: Phaser.AUTO,
    width: 414,  // Максимальная ширина для высокого качества
    height: 896, // Максимальная высота для высокого качества
    parent: 'game-container',
    backgroundColor: '#667eea',
    scale: {
        mode: Phaser.Scale.FIT, // Фиксированный размер для мобильного формата
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 414,
        height: 896,
        min: {
            width: 375,
            height: 667
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
        // Максимальное качество рендеринга для мобильных
        antialias: true,
        roundPixels: false,
        // Максимальная поддержка высокого DPI
        resolution: Math.max(window.devicePixelRatio || 1, 4),
        // Улучшаем качество текстур
        mipmapFilter: 'LINEAR',
        // Улучшаем сглаживание
        smoothFactor: 1,
        // Дополнительные настройки качества
        backgroundColor: '#667eea',
        transparent: false
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

// Настройки для мобильного вертикального формата с высоким качеством
const screenConfig = {
    mobile: {
        width: 414,
        height: 896,
        quality: 'ultra',
        fontSize: 20,
        strokeThickness: 3,
        // Позиции для мобильного интерфейса
        ui: {
            topBar: { y: 80 },
            map: { y: 300 },
            buttons: { y: 700, spacing: 80 },
            info: { y: 180 }
        }
    },
    // Всегда используем мобильный формат
    tablet: {
        width: 414,
        height: 896,
        quality: 'ultra',
        fontSize: 20,
        strokeThickness: 3,
        ui: {
            topBar: { y: 80 },
            map: { y: 300 },
            buttons: { y: 700, spacing: 80 },
            info: { y: 180 }
        }
    },
    desktop: {
        width: 414,
        height: 896,
        quality: 'ultra',
        fontSize: 20,
        strokeThickness: 3,
        ui: {
            topBar: { y: 80 },
            map: { y: 300 },
            buttons: { y: 700, spacing: 80 },
            info: { y: 180 }
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
