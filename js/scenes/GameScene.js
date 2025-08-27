// Основная игровая сцена
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gameManager = null;
        this.regions = {};
        this.ui = null;
        this.currentDay = 1;
        this.difficulty = 'ruling';
    }

    init(data) {
        this.difficulty = data.difficulty || 'ruling';
        this.loadProgress = data.loadProgress || false;
    }

    create() {
        console.log('=== GAME SCENE СОЗДАНА ===');
        console.log('Проверяем доступные текстуры в начале:');
        
        // Проверяем инициализацию сцены
        if (!this.textures) {
            console.error('❌ this.textures не инициализирован!');
            console.log('this:', this);
            console.log('Тип this.textures:', typeof this.textures);
            
            // Пытаемся дождаться инициализации текстур
            this.time.delayedCall(100, () => {
                if (this.textures) {
                    console.log('✅ this.textures инициализирован после задержки');
                    this.retryCreate();
                } else {
                    console.error('❌ this.textures все еще не инициализирован');
                }
            });
            return;
        }
        
        // Безопасная проверка текстур
        if (typeof this.textures.getTextureNames === 'function') {
            console.log('Доступные текстуры:', this.textures.getTextureNames());
            console.log('moldova_map существует:', this.textures.exists('moldova_map'));
        } else {
            console.warn('⚠️ getTextureNames не доступен');
            console.log('Доступные методы this.textures:', Object.getOwnPropertyNames(this.textures));
        }
        
        // Проверяем, что GameManager определен
        if (typeof GameManager === 'undefined') {
            console.error('GameManager класс не определен');
            return;
        }
        
        // Инициализируем менеджер игры
        try {
            this.gameManager = new GameManager(this, this.difficulty);
        } catch (error) {
            console.error('Ошибка создания GameManager:', error);
            this.gameManager = null;
        }
        
        // Создаем фон
        this.createBackground();
        
        // Создаем карту Молдовы
        this.createMoldovaMap();
        
        // Создаем регионы
        this.createRegions();
        
        // Создаем UI
        this.createUI();
        
        // Загружаем сохраненный прогресс если нужно
        if (this.loadProgress) {
            this.loadSavedProgress();
        }
        
        // Запускаем игровой цикл
        this.startGameLoop();
        
        // Анимация появления
        this.animateScene();
    }

    createBackground() {
        // Получаем размеры экрана
        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;
        
        // Градиентный фон высокого качества
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x667eea, 0x764ba2, 0x667eea, 0x764ba2, 1);
        bg.fillRect(0, 0, gameWidth, gameHeight);
        
        // Добавляем декоративные элементы
        this.createBackgroundElements();
    }

    createBackgroundElements() {
        // Создаем анимированные облака
        for (let i = 0; i < 3; i++) {
            const cloud = this.add.circle(
                Math.random() * 800,
                Math.random() * 200 + 50,
                20 + Math.random() * 30,
                0xffffff,
                0.3
            );
            
            this.tweens.add({
                targets: cloud,
                x: cloud.x + 100,
                duration: 10000 + Math.random() * 5000,
                ease: 'Linear',
                repeat: -1,
                yoyo: true
            });
        }
    }

    createMoldovaMap() {
        // Получаем размеры экрана для мобильного формата
        const gameWidth = this.game.config.width;  // 375
        const gameHeight = this.game.config.height; // 667
        const centerX = gameWidth / 2;  // 187.5
        const centerY = gameHeight * 0.4; // 266.8 (40% от высоты)
        
        // Создаем контейнер для карты в верхней части экрана
        const mapContainer = this.add.container(centerX, centerY);
        
        console.log('=== СОЗДАНИЕ КАРТЫ МОЛДОВЫ ===');
        
        // Безопасная проверка текстур
        if (this.textures && typeof this.textures.exists === 'function') {
            console.log('Текстура moldova_map существует:', this.textures.exists('moldova_map'));
        } else {
            console.warn('⚠️ this.textures.exists не доступен');
        }
        
        // Проверяем все доступные текстуры
        if (this.textures && typeof this.textures.getTextureNames === 'function') {
            console.log('Доступные текстуры:', this.textures.getTextureNames());
        } else {
            console.warn('⚠️ this.textures.getTextureNames не доступен');
        }
        
        // Загружаем изображение карты Молдовы
        if (this.textures && typeof this.textures.exists === 'function' && this.textures.exists('moldova_map')) {
            console.log('✅ moldova_map найден, создаем изображение...');
            const moldovaImage = this.add.image(0, 0, 'moldova_map');
            
            // Получаем информацию о текстуре
            if (this.textures && typeof this.textures.get === 'function') {
                try {
                    const texture = this.textures.get('moldova_map');
                    if (texture && texture.source && texture.source[0]) {
                        console.log('Размеры текстуры:', texture.source[0].width, 'x', texture.source[0].height);
                    }
                } catch (error) {
                    console.warn('Ошибка получения информации о текстуре:', error);
                }
            }
            console.log('Размеры изображения:', moldovaImage.width, 'x', moldovaImage.height);
            
            // Масштабирование карты для мобильного вертикального формата
            const scaleX = (gameWidth * 0.7) / moldovaImage.width;  // 70% от ширины экрана
            const scaleY = (gameHeight * 0.35) / moldovaImage.height; // 35% от высоты экрана
            const scale = Math.min(scaleX, scaleY, 1.0); // Ограничиваем масштаб для мобильного
            
            moldovaImage.setScale(scale);
            mapContainer.add(moldovaImage);
            
            // Добавляем рамку вокруг изображения для отладки (только в режиме разработки)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                const border = this.add.rectangle(0, 0, moldovaImage.width * scale, moldovaImage.height * scale, 0x000000, 0);
                border.setStrokeStyle(2, 0xffff00);
                mapContainer.add(border);
            }
            
            console.log('✅ Карта Молдовы успешно создана!');
        } else {
            console.log('❌ moldova_map НЕ найден или текстуры недоступны, создаем fallback...');
            // Fallback: создаем упрощенную карту высокого качества если изображение не загружено
            const moldovaShape = this.add.graphics();
            
            // Размеры fallback карты для мобильного формата
            const fallbackWidth = gameWidth * 0.5;  // 50% от ширины экрана
            const fallbackHeight = gameHeight * 0.25; // 25% от высоты экрана
            
            // Улучшенная линия с антиалиасингом
            moldovaShape.lineStyle(4, 0xffffff, 1);
            moldovaShape.fillStyle(0x4CAF50, 0.4);
            
            // Рисуем упрощенную форму Молдовы с адаптивными размерами
            moldovaShape.beginPath();
            moldovaShape.moveTo(-fallbackWidth/2, -fallbackHeight/2);
            moldovaShape.lineTo(fallbackWidth/2, -fallbackHeight/2);
            moldovaShape.lineTo(fallbackWidth/2 + 20, -fallbackHeight/4);
            moldovaShape.lineTo(fallbackWidth/2, 0);
            moldovaShape.lineTo(fallbackWidth/2 - 20, fallbackHeight/4);
            moldovaShape.lineTo(fallbackWidth/2 - 40, fallbackHeight/2);
            moldovaShape.lineTo(-fallbackWidth/2 + 40, fallbackHeight/2);
            moldovaShape.lineTo(-fallbackWidth/2 + 20, fallbackHeight/4);
            moldovaShape.lineTo(-fallbackWidth/2, 0);
            moldovaShape.closePath();
            moldovaShape.strokePath();
            moldovaShape.fillPath();
            
            mapContainer.add(moldovaShape);
        }
        
        // Добавляем название страны для мобильного формата
        const deviceType = getDeviceType();
        const fontSize = screenConfig[deviceType].fontSize * 1.2; // Размер для мобильного
        const strokeThickness = screenConfig[deviceType].strokeThickness;
        
        const countryName = this.add.text(0, -80, 'МОЛДОВА', {
            fontSize: fontSize + 'px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: strokeThickness,
            // Улучшаем качество текста для мобильных
            resolution: Math.max(window.devicePixelRatio || 1, 2),
            // Добавляем тень для лучшей читаемости
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5);
        
        mapContainer.add(countryName);
        
        // Анимация карты
        this.tweens.add({
            targets: mapContainer,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createRegions() {
        // Проверяем, что regionColors определен
        if (typeof regionColors === 'undefined') {
            console.error('regionColors не определен');
            return;
        }
        
        // Создаем 4 региона Молдовы
        const regionConfigs = [
            {
                key: 'north',
                name: 'Север',
                x: -50,
                y: -60,
                color: regionColors.north || 0x4CAF50,
                influence: 0.25
            },
            {
                key: 'center',
                name: 'Центр',
                x: 0,
                y: 0,
                color: regionColors.center || 0x2196F3,
                influence: 0.35
            },
            {
                key: 'gagauzia',
                name: 'Гагаузия',
                x: 80,
                y: 40,
                color: regionColors.gagauzia || 0xFF9800,
                influence: 0.20
            },
            {
                key: 'transnistria',
                name: 'Приднестровье',
                x: 60,
                y: -20,
                color: regionColors.transnistria || 0x9C27B0,
                influence: 0.20
            }
        ];
        
        regionConfigs.forEach(config => {
            const region = this.createRegion(config);
            if (region) {
                this.regions[config.key] = region;
            } else {
                console.error('Не удалось создать регион:', config.key);
            }
        });
    }

    createRegion(config) {
        // Проверяем, что конфигурация корректна
        if (!config || !config.name || typeof config.color === 'undefined') {
            console.error('Некорректная конфигурация региона:', config);
            return null;
        }
        
        const regionContainer = this.add.container(400 + config.x, 300 + config.y);
        
        // Создаем форму региона
        const regionShape = this.add.graphics();
        regionShape.fillStyle(config.color, 0.7);
        regionShape.lineStyle(2, 0xffffff, 1);
        
        // Рисуем форму региона (круг для простоты)
        regionShape.fillCircle(0, 0, 40);
        regionShape.strokeCircle(0, 0, 40);
        
        regionContainer.add(regionShape);
        
        // Название региона
        const regionName = this.add.text(0, -50, config.name, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
            // Улучшаем качество текста
            resolution: 2
        }).setOrigin(0.5);
        
        regionContainer.add(regionName);
        
        // Показатель популярности
        const popularityText = this.add.text(0, 50, '50%', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
            // Улучшаем качество текста
            resolution: 2
        }).setOrigin(0.5);
        
        regionContainer.add(popularityText);
        
        // Делаем регион интерактивным
        regionContainer.setInteractive(new Phaser.Geom.Circle(0, 0, 40), Phaser.Geom.Circle.Contains);
        
        // Обработчики событий
        regionContainer.on('pointerover', () => this.highlightRegion(regionContainer, true));
        regionContainer.on('pointerout', () => this.highlightRegion(regionContainer, false));
        regionContainer.on('pointerdown', () => this.showRegionDetails(config.key));
        
        // Сохраняем ссылки на элементы
        regionContainer.regionShape = regionShape;
        regionContainer.popularityText = popularityText;
        regionContainer.config = config;
        
        return regionContainer;
    }

    highlightRegion(region, isHighlighted) {
        if (!region || !region.regionShape) {
            console.error('Некорректный регион для подсветки:', region);
            return;
        }
        
        if (isHighlighted) {
            this.tweens.add({
                targets: region,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                ease: 'Power2'
            });
            if (region.regionShape && typeof region.regionShape.setStrokeStyle === 'function') {
                region.regionShape.setStrokeStyle(4, 0xffff00);
            }
        } else {
            this.tweens.add({
                targets: region,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });
            if (region.regionShape && typeof region.regionShape.setStrokeStyle === 'function') {
                region.regionShape.setStrokeStyle(2, 0xffffff);
            }
        }
    }

    showRegionDetails(regionKey) {
        const region = this.regions[regionKey];
        if (!region || !region.config) {
            console.error('Регион не найден:', regionKey);
            return;
        }
        
        const config = region.config;
        
        // Показываем детальную информацию о регионе
        if (this.gameManager && typeof this.gameManager.getRegionPopularity === 'function') {
            try {
                const popularity = this.gameManager.getRegionPopularity(regionKey);
                this.showNotification(`${config.name}: Популярность ${popularity || 50}%`);
            } catch (error) {
                console.error('Ошибка получения популярности региона:', error);
                this.showNotification(`${config.name}: Популярность 50%`);
            }
        } else {
            this.showNotification(`${config.name}: Популярность 50%`);
        }
    }

    createUI() {
        // Проверяем, что UI класс определен
        if (typeof UI === 'undefined') {
            console.error('UI класс не определен');
            return;
        }
        
        // Создаем основной UI
        try {
            this.ui = new UI(this);
        } catch (error) {
            console.error('Ошибка создания UI:', error);
            this.ui = null;
        }
        
        // Кнопка "Следующий день"
        this.createNextDayButton();
        
        // Кнопка "Действия"
        this.createActionsButton();
        
        // Кнопка "Сохранить"
        this.createSaveButton();
        
        // Добавляем информацию о текущем дне
        this.createDayInfo();
    }

    createNextDayButton() {
        // Позиционирование для мобильного вертикального формата
        const gameWidth = this.game.config.width;  // 375
        const gameHeight = this.game.config.height; // 667
        const buttonX = gameWidth * 0.5;  // Центр экрана
        const buttonY = gameHeight * 0.75; // 75% от высоты экрана
        
        const nextDayButton = this.add.container(buttonX, buttonY);
        
        // Фон кнопки - делаем больше и ярче
        const bg = this.add.rectangle(0, 0, 120, 50, 0x4CAF50);
        bg.setStrokeStyle(3, 0xffffff);
        
        // Текст кнопки - делаем больше и читабельнее
        const text = this.add.text(0, 0, 'Завершить\nдень', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        nextDayButton.add([bg, text]);
        nextDayButton.setInteractive(new Phaser.Geom.Rectangle(-60, -25, 120, 50), Phaser.Geom.Rectangle.Contains);
        
        nextDayButton.on('pointerdown', () => this.nextDay());
        
        // Эффекты при наведении
        nextDayButton.on('pointerover', () => {
            this.tweens.add({
                targets: nextDayButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 150,
                ease: 'Power2'
            });
            bg.setStrokeStyle(4, 0xffff00);
        });
        
        nextDayButton.on('pointerout', () => {
            this.tweens.add({
                targets: nextDayButton,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Power2'
            });
            bg.setStrokeStyle(3, 0xffffff);
        });
        
        this.nextDayButton = nextDayButton;
    }

    createActionsButton() {
        // Позиционирование для мобильного вертикального формата
        const gameWidth = this.game.config.width;  // 375
        const gameHeight = this.game.config.height; // 667
        const buttonX = gameWidth * 0.5;  // Центр экрана
        const buttonY = gameHeight * 0.85; // 85% от высоты экрана
        
        const actionsButton = this.add.container(buttonX, buttonY);
        
        // Фон кнопки - делаем больше и ярче
        const bg = this.add.rectangle(0, 0, 120, 50, 0x2196F3);
        bg.setStrokeStyle(3, 0xffffff);
        
        // Текст кнопки - делаем больше и читабельнее
        const text = this.add.text(0, 0, 'Действия', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        actionsButton.add([bg, text]);
        actionsButton.setInteractive(new Phaser.Geom.Rectangle(-60, -25, 120, 50), Phaser.Geom.Rectangle.Contains);
        
        actionsButton.on('pointerdown', () => this.showActions());
        
        // Эффекты при наведении
        actionsButton.on('pointerover', () => {
            this.tweens.add({
                targets: actionsButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 150,
                ease: 'Power2'
            });
            bg.setStrokeStyle(4, 0xffff00);
        });
        
        actionsButton.on('pointerout', () => {
            this.tweens.add({
                targets: actionsButton,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Power2'
            });
            bg.setStrokeStyle(3, 0xffffff);
        });
        
        this.actionsButton = actionsButton;
    }

    createSaveButton() {
        // Позиционирование для мобильного вертикального формата
        const gameWidth = this.game.config.width;  // 375
        const gameHeight = this.game.config.height; // 667
        const buttonX = gameWidth * 0.5;  // Центр экрана
        const buttonY = gameHeight * 0.95; // 95% от высоты экрана
        
        const saveButton = this.add.container(buttonX, buttonY);
        
        // Фон кнопки - делаем больше и ярче
        const bg = this.add.rectangle(0, 0, 120, 50, 0x9C27B0);
        bg.setStrokeStyle(3, 0xffffff);
        
        // Текст кнопки - делаем больше и читабельнее
        const text = this.add.text(0, 0, 'Сохранить', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        saveButton.add([bg, text]);
        saveButton.setInteractive(new Phaser.Geom.Rectangle(-60, -25, 120, 50), Phaser.Geom.Rectangle.Contains);
        
        saveButton.on('pointerdown', () => this.saveGame());
        
        // Эффекты при наведении
        saveButton.on('pointerover', () => {
            this.tweens.add({
                targets: saveButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 150,
                ease: 'Power2'
            });
            bg.setStrokeStyle(4, 0xffff00);
        });
        
        saveButton.on('pointerout', () => {
            this.tweens.add({
                targets: saveButton,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Power2'
            });
            bg.setStrokeStyle(3, 0xffffff);
        });
        
        this.saveButton = saveButton;
    }
    
    createDayInfo() {
        // Информация о текущем дне для мобильного формата
        const gameWidth = this.game.config.width;  // 375
        const gameHeight = this.game.config.height; // 667
        const infoX = gameWidth * 0.5;  // Центр экрана
        const infoY = gameHeight * 0.1; // 10% от высоты экрана
        
        const dayInfo = this.add.container(infoX, infoY);
        
        // Фон для информации
        const bg = this.add.rectangle(0, 0, 200, 80, 0x000000, 0.7);
        bg.setStrokeStyle(2, 0xffffff);
        
        // Текст дня
        const dayText = this.add.text(0, -20, `День ${this.currentDay}`, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffff00',
            fontStyle: 'bold',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Текст до выборов
        const daysLeftText = this.add.text(0, 10, `До выборов: ${28 - this.currentDay} дней`, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        dayInfo.add([bg, dayText, daysLeftText]);
        this.dayInfo = dayInfo;
    }
    
    updateDayInfo() {
        if (this.dayInfo) {
            try {
                // Обновляем текст дня
                const dayText = this.dayInfo.getAt(1);
                if (dayText && typeof dayText.setText === 'function') {
                    dayText.setText(`День ${this.currentDay}`);
                }
                
                // Обновляем текст дней до выборов
                const daysLeftText = this.dayInfo.getAt(2);
                if (daysLeftText && typeof daysLeftText.setText === 'function') {
                    daysLeftText.setText(`До выборов: ${28 - this.currentDay} дней`);
                }
            } catch (error) {
                console.error('Ошибка обновления информации о дне:', error);
            }
        }
    }

    animateScene() {
        // Анимация появления регионов
        Object.values(this.regions).forEach((region, index) => {
            if (region && typeof region.setScale === 'function') {
                region.setScale(0);
                this.tweens.add({
                    targets: region,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 600,
                    ease: 'Back.easeOut',
                    delay: index * 200
                });
            }
        });
        
        // Анимация появления UI
        const uiButtons = [this.nextDayButton, this.actionsButton, this.saveButton];
        uiButtons.forEach((button, index) => {
            if (button && typeof button.setScale === 'function') {
                button.setScale(0);
                this.tweens.add({
                    targets: button,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 500,
                    ease: 'Back.easeOut',
                    delay: 1000 + index * 100
                });
            }
        });
    }

    startGameLoop() {
        // Обновляем UI каждую секунду
        this.time.addEvent({
            delay: 1000,
            callback: this.updateUI,
            callbackScope: this,
            loop: true
        });
        
        // Проверяем условия победы/поражения
        this.time.addEvent({
            delay: 5000,
            callback: this.checkGameEnd,
            callbackScope: this,
            loop: true
        });
        
        // Обновляем информацию о регионах каждые 2 секунды
        this.time.addEvent({
            delay: 2000,
            callback: this.updateRegionsInfo,
            callbackScope: this,
            loop: true
        });
    }

    updateUI() {
        if (this.ui) {
            this.ui.update();
        }
        
        // Обновляем показатели регионов
        Object.keys(this.regions).forEach(regionKey => {
            const region = this.regions[regionKey];
            const popularity = this.gameManager.getRegionPopularity(regionKey);
            region.popularityText.setText(`${popularity}%`);
            
            // Меняем цвет в зависимости от популярности
            if (popularity >= 60) {
                region.regionShape.setFillStyle(0x4CAF50, 0.7); // Зеленый
            } else if (popularity >= 40) {
                region.regionShape.setFillStyle(0xFF9800, 0.7); // Оранжевый
            } else {
                region.regionShape.setFillStyle(0xF44336, 0.7); // Красный
            }
        });
    }

    nextDay() {
        if (this.currentDay >= 28) {
            this.endGame();
            return;
        }
        
        this.currentDay++;
        
        // Обновляем информацию о дне
        this.updateDayInfo();
        
        // Генерируем событие дня
        this.generateDailyEvent();
        
        // Обновляем UI
        this.updateUI();
        
        // Проверяем условия победы
        if (this.currentDay === 28) {
            this.endGame();
        }
    }

    generateDailyEvent() {
        // Проверяем, что dailyEvents определен
        if (typeof dailyEvents === 'undefined' || !dailyEvents.length) {
            console.error('dailyEvents не определен или пуст');
            return;
        }
        
        // Выбираем случайное событие
        const event = dailyEvents[Math.floor(Math.random() * dailyEvents.length)];
        
        // Проверяем, что событие корректно
        if (!event || !event.id) {
            console.error('Некорректное событие:', event);
            return;
        }
        
        // Применяем эффекты события
        if (this.gameManager && typeof this.gameManager.applyEvent === 'function') {
            this.gameManager.applyEvent(event);
        } else {
            console.error('gameManager.applyEvent не определен');
        }
        
        // Показываем окно события
        try {
            if (this.scene.get('EventScene')) {
                this.scene.launch('EventScene', { event: event, gameManager: this.gameManager });
            } else {
                console.error('EventScene не найдена');
            }
        } catch (error) {
            console.error('Ошибка запуска EventScene:', error);
        }
    }

    showActions() {
        // Показываем доступные действия
        this.showActionsModal();
    }
    
    showActionsModal() {
        // Проверяем, что модальное окно не открыто
        if (this.actionsModal) {
            try {
                this.actionsModal.destroy();
            } catch (error) {
                console.error('Ошибка закрытия предыдущего модального окна:', error);
            }
        }
        
        // Создаем модальное окно с действиями
        const modal = this.add.container(400, 300);
        
        // Фон модального окна
        const bg = this.add.rectangle(0, 0, 500, 400, 0x000000, 0.9);
        bg.setStrokeStyle(3, 0xffffff);
        
        // Заголовок
        const title = this.add.text(0, -150, 'Доступные действия', {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffff00',
            fontStyle: 'bold',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Список действий
        if (typeof availableActions === 'undefined' || !availableActions.length) {
            console.error('availableActions не определен или пуст');
            return;
        }
        
        const actions = availableActions.slice(0, 6); // Показываем первые 6 действий
        const actionButtons = [];
        
        actions.forEach((action, index) => {
            // Проверяем, что действие имеет все необходимые свойства
            if (!action || !action.name || typeof action.cost === 'undefined') {
                console.error('Некорректное действие:', action);
                return;
            }
            
                        try {
                const buttonY = -80 + index * 50;
                const actionButton = this.add.container(0, buttonY);
                
                // Фон кнопки
                const buttonBg = this.add.rectangle(0, 0, 400, 40, 0x2196F3);
                buttonBg.setStrokeStyle(2, 0xffffff);
                
                // Текст действия
                const actionText = this.add.text(-150, 0, action.name, {
                    fontSize: '16px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    // Улучшаем качество текста
                    resolution: 2,
                    stroke: '#000000',
                    strokeThickness: 1
                }).setOrigin(0, 0.5);
                
                // Стоимость
                const costText = this.add.text(100, 0, `${action.cost} лей`, {
                    fontSize: '16px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#ffff00',
                    // Улучшаем качество текста
                    resolution: 2,
                    stroke: '#000000',
                    strokeThickness: 1
                }).setOrigin(0, 0.5);
                
                actionButton.add([buttonBg, actionText, costText]);
                actionButton.setInteractive(new Phaser.Geom.Rectangle(-200, -20, 400, 40), Phaser.Geom.Rectangle.Contains);
                
                // Обработчик клика
                actionButton.on('pointerdown', () => this.buyAction(action));
                
                // Эффекты при наведении
                actionButton.on('pointerover', () => {
                    this.tweens.add({
                        targets: actionButton,
                        scaleX: 1.05,
                        scaleY: 1.05,
                        duration: 150,
                        ease: 'Power2'
                    });
                });
                
                actionButton.on('pointerout', () => {
                    this.tweens.add({
                        targets: actionButton,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 150,
                        ease: 'Power2'
                    });
                });
                
                actionButtons.push(actionButton);
            } catch (error) {
                console.error('Ошибка создания кнопки действия:', error);
            }
        });
        
        // Кнопка закрытия
        const closeButton = this.add.container(0, 120);
        const closeBg = this.add.rectangle(0, 0, 100, 40, 0xF44336);
        closeBg.setStrokeStyle(2, 0xffffff);
        
        const closeText = this.add.text(0, 0, 'Закрыть', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        closeButton.add([closeBg, closeText]);
        closeButton.setInteractive(new Phaser.Geom.Rectangle(-50, -20, 100, 40), Phaser.Geom.Rectangle.Contains);
        closeButton.on('pointerdown', () => {
            try {
                modal.destroy();
            } catch (error) {
                console.error('Ошибка закрытия модального окна:', error);
            }
        });
        
        try {
            modal.add([bg, title, ...actionButtons, closeButton]);
            this.actionsModal = modal;
        } catch (error) {
            console.error('Ошибка создания модального окна:', error);
            try {
                modal.destroy();
            } catch (destroyError) {
                console.error('Ошибка уничтожения модального окна:', destroyError);
            }
        }
    }
    
    updateUI() {
        // Обновляем UI элементы
        if (this.ui && typeof this.ui.update === 'function') {
            try {
                this.ui.update();
            } catch (error) {
                console.error('Ошибка обновления UI:', error);
            }
        }
        
        // Обновляем информацию о регионах
        this.updateRegionsInfo();
        
        // Обновляем информацию о дне
        this.updateDayInfo();
    }
    
    updateRegionsInfo() {
        // Обновляем популярность регионов
        if (this.gameManager && typeof this.gameManager.getRegions === 'function') {
            try {
                const regions = this.gameManager.getRegions();
                if (regions && typeof regions === 'object') {
                    Object.keys(regions).forEach(regionKey => {
                        const region = regions[regionKey];
                        if (this.regions[regionKey]) {
                            // Обновляем текст популярности
                            const popularityText = this.regions[regionKey].getAt(2);
                            if (popularityText && typeof popularityText.setText === 'function') {
                                popularityText.setText(`${Math.round(region.popularity || 50)}%`);
                                                        // Меняем цвет в зависимости от популярности
                        if (region.popularity >= 70) {
                            popularityText.setColor('#00ff00'); // Зеленый
                        } else if (region.popularity >= 40) {
                            popularityText.setColor('#ffff00'); // Желтый
                        } else {
                            popularityText.setColor('#ff0000'); // Красный
                        }
                        
                        // Также обновляем цвет формы региона
                        if (region.regionShape && typeof region.regionShape.setFillStyle === 'function') {
                            if (region.popularity >= 70) {
                                region.regionShape.setFillStyle(0x4CAF50, 0.7); // Зеленый
                            } else if (region.popularity >= 40) {
                                region.regionShape.setFillStyle(0xFF9800, 0.7); // Оранжевый
                            } else {
                                region.regionShape.setFillStyle(0xF44336, 0.7); // Красный
                            }
                        }
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Ошибка обновления информации о регионах:', error);
            }
        }
    }
    
    buyAction(action) {
        if (this.gameManager && typeof this.gameManager.buyAction === 'function') {
            try {
                const success = this.gameManager.buyAction(action);
                if (success) {
                    this.showNotification(`Действие "${action.name}" куплено!`, 'success');
                    // Обновляем UI
                    this.updateUI();
                } else {
                    this.showNotification('Недостаточно средств!', 'error');
                }
            } catch (error) {
                console.error('Ошибка покупки действия:', error);
                this.showNotification('Ошибка покупки действия', 'error');
            }
        } else {
            console.error('gameManager.buyAction не определен');
            this.showNotification('Ошибка: менеджер игры не инициализирован', 'error');
        }
    }

    saveGame() {
        if (this.gameManager && typeof this.gameManager.getGameState === 'function') {
            try {
                const gameState = this.gameManager.getGameState();
                localStorage.setItem('moldova28days_progress', JSON.stringify(gameState));
                this.showNotification('Игра сохранена!', 'success');
            } catch (error) {
                console.error('Ошибка сохранения:', error);
                this.showNotification('Ошибка сохранения', 'error');
            }
        } else {
            console.error('gameManager.getGameState не определен');
            this.showNotification('Ошибка: менеджер игры не инициализирован', 'error');
        }
    }

    loadSavedProgress() {
        try {
            const savedProgress = localStorage.getItem('moldova28days_progress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                if (this.gameManager && typeof this.gameManager.loadGameState === 'function') {
                    this.gameManager.loadGameState(progress);
                } else {
                    console.error('gameManager.loadGameState не определен');
                }
                this.currentDay = progress.currentDay || 1;
                this.showNotification('Прогресс загружен!', 'success');
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            this.showNotification('Ошибка загрузки', 'error');
        }
    }

    checkGameEnd() {
        if (this.currentDay >= 28) {
            this.endGame();
        }
    }

    endGame() {
        // Переходим к сцене окончания игры
        try {
            if (this.scene.get('GameOverScene')) {
                this.scene.start('GameOverScene', { 
                    gameManager: this.gameManager,
                    currentDay: this.currentDay
                });
            } else {
                console.error('GameOverScene не найдена');
                // Fallback: показываем простое сообщение
                this.showNotification('Игра завершена! День: ' + this.currentDay, 'success');
            }
        } catch (error) {
            console.error('Ошибка перехода к GameOverScene:', error);
            this.showNotification('Игра завершена! День: ' + this.currentDay, 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Создаем временное уведомление для мобильного формата
        const gameWidth = this.game.config.width;  // 375
        const gameHeight = this.game.config.height; // 667
        const notificationX = gameWidth * 0.5;  // Центр экрана
        const notificationY = gameHeight * 0.65; // 65% от высоты экрана
        
        const notification = this.add.text(notificationX, notificationY, message, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : '#ffff00',
            stroke: '#000000',
            strokeThickness: 3,
            // Улучшаем качество текста
            resolution: 2
        }).setOrigin(0.5);
        
        // Анимация появления и исчезновения
        notification.setScale(0);
        this.tweens.add({
            targets: notification,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: notification,
                        scaleX: 0,
                        scaleY: 0,
                        duration: 300,
                        ease: 'Back.easeIn',
                        onComplete: () => notification.destroy()
                    });
                });
            }
        });
    }

    retryCreate() {
        console.log('🔄 Повторная попытка создания сцены...');
        try {
            this.create();
        } catch (error) {
            console.error('❌ Ошибка при повторной попытке создания:', error);
            // Создаем fallback сцену
            this.createFallbackScene();
        }
    }

    createFallbackScene() {
        console.log('🛠️ Создание fallback сцены для мобильного формата...');
        
        // Очищаем все существующие объекты
        this.children.removeAll(true);
        
        // Получаем размеры экрана для мобильного формата
        const gameWidth = this.game.config.width;  // 375
        const gameHeight = this.game.config.height; // 667
        const centerX = gameWidth / 2;  // 187.5
        const centerY = gameHeight / 2; // 333.5
        
        // Создаем простую fallback сцену высокого качества
        const bg = this.add.graphics();
        bg.fillStyle(0x2c3e50, 1);
        bg.fillRect(0, 0, gameWidth, gameHeight);
        
        // Определяем тип устройства для качества
        const deviceType = getDeviceType();
        const titleFontSize = screenConfig[deviceType].fontSize * 2.4;
        const subtitleFontSize = screenConfig[deviceType].fontSize * 1.2;
        const bodyFontSize = screenConfig[deviceType].fontSize * 0.9;
        const strokeThickness = screenConfig[deviceType].strokeThickness;
        
        // Заголовок
        this.add.text(centerX, centerY * 0.3, 'MOLDOVA GAME', {
            fontSize: titleFontSize + 'px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: strokeThickness,
            resolution: Math.max(window.devicePixelRatio || 1, 2)
        }).setOrigin(0.5);
        
        // Сообщение об ошибке
        this.add.text(centerX, centerY * 0.5, 'Проблема с загрузкой ресурсов', {
            fontSize: subtitleFontSize + 'px',
            fill: '#ff6b6b',
            resolution: Math.max(window.devicePixelRatio || 1, 2)
        }).setOrigin(0.5);
        
        // Инструкция
        this.add.text(centerX, centerY * 0.65, 'Запустите игру через локальный сервер:', {
            fontSize: bodyFontSize + 'px',
            fill: '#ffffff',
            resolution: Math.max(window.devicePixelRatio || 1, 2)
        }).setOrigin(0.5);
        
        this.add.text(centerX, centerY * 0.75, 'http://localhost:8000', {
            fontSize: bodyFontSize + 'px',
            fill: '#00ff00',
            fontStyle: 'bold',
            resolution: Math.max(window.devicePixelRatio || 1, 2)
        }).setOrigin(0.5);
        
        // Кнопка перезагрузки
        const reloadBtn = this.add.text(centerX, centerY * 0.8, '🔄 Перезагрузить', {
            fontSize: subtitleFontSize + 'px',
            fill: '#ffffff',
            backgroundColor: '#007bff',
            padding: { x: 20, y: 10 },
            resolution: Math.max(window.devicePixelRatio || 1, 2)
        }).setOrigin(0.5).setInteractive();
        
        reloadBtn.on('pointerdown', () => {
            location.reload();
        });
    }
}
