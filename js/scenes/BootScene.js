// Сцена загрузки игры
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Создаем загрузочный экран
        this.createLoadingScreen();
        
        // Загружаем основные ресурсы
        this.loadAssets();
    }

    createLoadingScreen() {
        // Фон
        this.add.rectangle(400, 300, 800, 600, 0x667eea);
        
        // Заголовок
        this.add.text(400, 200, '28 ДНЕЙ', {
            fontSize: '56px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Подзаголовок
        this.add.text(400, 260, 'Игра о выборах в Молдове', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Прогресс бар
        const progressBarBg = this.add.rectangle(400, 400, 300, 20, 0xffffff, 0.3);
        const progressBar = this.add.rectangle(400, 400, 0, 20, 0x00ff00);
        
        // Текст прогресса
        const progressText = this.add.text(400, 430, 'Загрузка...', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Анимация загрузки
        this.tweens.add({
            targets: progressBar,
            width: 300,
            duration: 2000,
            ease: 'Power2',
            onUpdate: function() {
                const percent = Math.floor((progressBar.width / 300) * 100);
                progressText.setText(`Загрузка... ${percent}%`);
            }
        });
        
        // Сохраняем ссылки для обновления
        this.progressBar = progressBar;
        this.progressText = progressText;
    }

    loadAssets() {
        // Загружаем изображения
        console.log('Начинаем загрузку изображений...');
        
        // Основная карта Молдовы
        console.log('Загружаем moldova_map...');
        
        // Пробуем разные пути для загрузки
        const imagePath = 'assets/images/moldova_map.png';
        console.log('Путь к изображению:', imagePath);
        console.log('Текущий URL:', window.location.href);
        console.log('Полный путь:', window.location.href + imagePath);
        
        this.load.image('moldova_map', imagePath);
        
        // Остальные изображения (закомментируем пока для отладки)
        // this.load.image('eu_flag', 'assets/images/eu_flag.png');
        // this.load.image('gas_prices', 'assets/images/gas_prices.png');
        // this.load.image('corruption', 'assets/images/corruption.png');
        // this.load.image('economy', 'assets/images/economy.png');
        // this.load.image('russia_media', 'assets/images/russia_media.png');
        // this.load.image('social_programs', 'assets/images/social_programs.png');
        // this.load.image('diaspora', 'assets/images/diaspora.png');
        // this.load.image('infrastructure', 'assets/images/infrastructure.png');
        
        // Загружаем изображения для действий (закомментируем пока для отладки)
        // this.load.image('tv_ad', 'assets/images/tv_ad.png');
        // this.load.image('social_media', 'assets/images/social_media.png');
        // this.load.image('meetings', 'assets/images/meetings.png');
        // this.load.image('charity', 'assets/images/charity.png');
        // this.load.image('youth', 'assets/images/youth.png');
        // this.load.image('elderly', 'assets/images/elderly.png');
        // this.load.image('business', 'assets/images/business.png');
        // this.load.image('culture', 'assets/images/culture.png');
        
        // Загружаем иконки (закомментируем пока для отладки)
        // this.load.image('favicon', 'assets/icons/favicon.png');
        // this.load.image('money_icon', 'assets/icons/money.png');
        // this.load.image('popularity_icon', 'assets/icons/popularity.png');
        // this.load.image('calendar_icon', 'assets/icons/calendar.png');
        
        // Загружаем звуки (закомментируем пока для отладки)
        // this.load.audio('button_click', 'assets/sounds/button_click.mp3');
        // this.load.audio('event_popup', 'assets/sounds/event_popup.mp3');
        // this.load.audio('success_sound', 'assets/sounds/success.mp3');
        // this.load.audio('failure_sound', 'assets/sounds/failure.mp3');
        
        // Обработчики загрузки
        this.load.on('progress', (value) => {
            console.log('Прогресс загрузки:', Math.floor(value * 100) + '%');
            if (this.progressBar) {
                this.progressBar.width = value * 300;
                const percent = Math.floor(value * 100);
                if (this.progressText) {
                    this.progressText.setText(`Загрузка... ${percent}%`);
                }
            }
        });

        this.load.on('complete', () => {
            console.log('=== ЗАГРУЗКА ЗАВЕРШЕНА ===');
            console.log('Проверяем загруженные текстуры:');
            
            // Безопасная проверка текстур
            if (this.textures && typeof this.textures.exists === 'function') {
                console.log('moldova_map:', this.textures.exists('moldova_map'));
                
                if (this.textures.exists('moldova_map')) {
                    console.log('✅ moldova_map успешно загружен!');
                    
                    // Безопасное получение информации о текстуре
                    if (typeof this.textures.get === 'function') {
                        try {
                            const texture = this.textures.get('moldova_map');
                            if (texture && texture.source && texture.source[0]) {
                                console.log('Размеры текстуры:', texture.source[0].width, 'x', texture.source[0].height);
                            }
                        } catch (error) {
                            console.warn('Ошибка получения информации о текстуре:', error);
                        }
                    }
                } else {
                    console.log('❌ moldova_map НЕ загружен!');
                }
            } else {
                console.warn('⚠️ this.textures не доступен для проверки');
            }
            
            // Переходим к главному меню через 2 секунды
            this.time.delayedCall(2000, () => {
                // Проверяем, что основные ресурсы загрузились
                if (this.textures && typeof this.textures.exists === 'function' && this.textures.exists('moldova_map')) {
                    console.log('✅ Переходим к главному меню с загруженными ресурсами');
                    this.scene.start('MainMenuScene');
                } else {
                    console.warn('⚠️ Ресурсы не загрузились, но переходим к меню');
                    this.scene.start('MainMenuScene');
                }
            });
        });
        
        this.load.on('loaderror', (file) => {
            console.error('❌ ОШИБКА ЗАГРУЗКИ ФАЙЛА:');
            console.error('Источник:', file.src);
            console.error('Тип файла:', file.type);
            console.error('Ключ:', file.key);
            console.error('Полный URL:', window.location.href + file.src);
            
            // Если это критический файл (moldova_map), показываем предупреждение
            if (file.key === 'moldova_map') {
                console.error('🚨 КРИТИЧЕСКАЯ ОШИБКА: Не удалось загрузить основную карту!');
                console.error('💡 Решение: Запустите игру через локальный сервер (http://localhost:8000)');
            }
        });
        
        // Добавляем обработчик начала загрузки файла
        this.load.on('start', (file) => {
            console.log('🚀 Начинается загрузка файла:', file.key, 'из', file.src);
        });
        
        // Добавляем обработчик успешной загрузки файла
        this.load.on('filecomplete', (key, type, data) => {
            console.log('✅ Файл успешно загружен:', key, 'тип:', type);
        });
    }

    create() {
        // Сцена создана
        console.log('BootScene создана');
    }
}
