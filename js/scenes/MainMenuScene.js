// Сцена главного меню
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
        this.selectedDifficulty = null;
    }

    create() {
        // Фон с градиентом
        this.createBackground();
        
        // Заголовок игры
        this.createTitle();
        
        // Кнопки выбора сложности
        this.createDifficultyButtons();
        
        // Кнопки управления
        this.createControlButtons();
        
        // Анимация появления
        this.animateMenu();
    }

    createBackground() {
        // Градиентный фон
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x667eea, 0x764ba2, 0x667eea, 0x764ba2, 1);
        bg.fillRect(0, 0, 800, 600);
        
        // Добавляем анимированные частицы
        this.createParticles();
    }

    createParticles() {
        // ВРЕМЕННО: Создаем простые анимированные круги вместо частиц
        // Раскомментируйте код выше после добавления favicon.png
        
        // Создаем простые анимированные круги
        for (let i = 0; i < 10; i++) {
            const circle = this.add.circle(
                Phaser.Math.Between(0, 800),
                Phaser.Math.Between(0, 600),
                3,
                0xffffff,
                0.3
            );
            
            this.tweens.add({
                targets: circle,
                x: Phaser.Math.Between(0, 800),
                y: Phaser.Math.Between(0, 600),
                alpha: 0,
                duration: Phaser.Math.Between(2000, 4000),
                ease: 'Linear',
                repeat: -1,
                onComplete: () => {
                    circle.destroy();
                }
            });
        }
    }

    createTitle() {
        // Основной заголовок
        this.title = this.add.text(400, 150, '28 ДНЕЙ', {
            fontSize: '72px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5,
            // Улучшаем качество текста
            resolution: 2,
            // Добавляем тень для лучшей читаемости
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 6,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Подзаголовок
        this.subtitle = this.add.text(400, 220, 'Игра о выборах в Молдове', {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            // Улучшаем качество текста
            resolution: 2
        }).setOrigin(0.5);
        
        // Дата выборов
        this.electionDate = this.add.text(400, 260, 'Выборы: 28 сентября 2024', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
    }

    createDifficultyButtons() {
        const buttonY = 350;
        const buttonSpacing = 120;
        
        // Кнопка "Правящая партия" (легкий уровень)
        this.rulingButton = this.add.container(400 - buttonSpacing, buttonY);
        this.createDifficultyButton(this.rulingButton, 'Правящая партия', 'Легкий уровень', 0x4CAF50);
        
        // Кнопка "Оппозиция" (тяжелый уровень)
        this.oppositionButton = this.add.container(400 + buttonSpacing, buttonY);
        this.createDifficultyButton(this.oppositionButton, 'Оппозиция', 'Тяжелый уровень', 0xF44336);
        
        // Добавляем интерактивность
        this.rulingButton.setInteractive(new Phaser.Geom.Rectangle(-100, -30, 200, 60), Phaser.Geom.Rectangle.Contains);
        this.oppositionButton.setInteractive(new Phaser.Geom.Rectangle(-100, -30, 200, 60), Phaser.Geom.Rectangle.Contains);
        
        // Обработчики событий
        this.rulingButton.on('pointerdown', () => this.selectDifficulty('ruling'));
        this.oppositionButton.on('pointerdown', () => this.selectDifficulty('opposition'));
        
        // Эффекты при наведении
        this.rulingButton.on('pointerover', () => this.highlightButton(this.rulingButton, true));
        this.rulingButton.on('pointerout', () => this.highlightButton(this.rulingButton, false));
        this.oppositionButton.on('pointerover', () => this.highlightButton(this.oppositionButton, true));
        this.oppositionButton.on('pointerout', () => this.highlightButton(this.oppositionButton, false));
    }

    createDifficultyButton(container, title, subtitle, color) {
        // Фон кнопки
        const bg = this.add.rectangle(0, 0, 200, 60, color);
        bg.setStrokeStyle(3, 0xffffff);
        
        // Заголовок кнопки
        const titleText = this.add.text(0, -10, title, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Подзаголовок
        const subtitleText = this.add.text(0, 10, subtitle, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        container.add([bg, titleText, subtitleText]);
        
        // Добавляем тень
        const shadow = this.add.rectangle(0, 2, 200, 60, 0x000000, 0.3);
        shadow.setOrigin(0.5);
        container.addAt(shadow, 0);
    }

    highlightButton(button, isHighlighted) {
        const bg = button.getAt(1); // Фон кнопки (после тени)
        if (isHighlighted) {
            this.tweens.add({
                targets: button,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Power2'
            });
            bg.setStrokeStyle(5, 0xffff00);
        } else {
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });
            bg.setStrokeStyle(3, 0xffffff);
        }
    }

    createControlButtons() {
        const buttonY = 500;
        
        // Кнопка "Загрузить игру"
        this.loadButton = this.createControlButton(400 - 100, buttonY, 'Загрузить', 0x2196F3);
        this.loadButton.on('pointerdown', () => this.loadGame());
        
        // Кнопка "Настройки"
        this.settingsButton = this.createControlButton(400, buttonY, 'Настройки', 0x9C27B0);
        this.settingsButton.on('pointerdown', () => this.showSettings());
        
        // Кнопка "О игре"
        this.aboutButton = this.createControlButton(400 + 100, buttonY, 'О игре', 0xFF9800);
        this.aboutButton.on('pointerdown', () => this.showAbout());
    }

    createControlButton(x, y, text, color) {
        const button = this.add.container(x, y);
        
        // Фон кнопки
        const bg = this.add.rectangle(0, 0, 80, 40, color);
        bg.setStrokeStyle(2, 0xffffff);
        
        // Текст кнопки
        const textObj = this.add.text(0, 0, text, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            // Улучшаем качество текста
            resolution: 2,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        button.add([bg, textObj]);
        button.setInteractive(new Phaser.Geom.Rectangle(-40, -20, 80, 40), Phaser.Geom.Rectangle.Contains);
        
        // Эффекты при наведении
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 150,
                ease: 'Power2'
            });
        });
        
        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Power2'
            });
        });
        
        return button;
    }

    animateMenu() {
        // Анимация появления заголовка
        this.title.setScale(0);
        this.tweens.add({
            targets: this.title,
            scaleX: 1,
            scaleY: 1,
            duration: 800,
            ease: 'Back.easeOut',
            delay: 200
        });
        
        // Анимация подзаголовка
        this.subtitle.setScale(0);
        this.tweens.add({
            targets: this.subtitle,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            delay: 400
        });
        
        // Анимация кнопок
        this.rulingButton.setScale(0);
        this.oppositionButton.setScale(0);
        
        this.tweens.add({
            targets: [this.rulingButton, this.oppositionButton],
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            delay: 600,
            stagger: 200
        });
        
        // Анимация контрольных кнопок
        [this.loadButton, this.settingsButton, this.aboutButton].forEach((button, index) => {
            button.setScale(0);
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 500,
                ease: 'Back.easeOut',
                delay: 1000 + index * 100
            });
        });
    }

    selectDifficulty(difficulty) {
        this.selectedDifficulty = difficulty;
        
        // Анимация выбора
        const selectedButton = difficulty === 'ruling' ? this.rulingButton : this.oppositionButton;
        
        this.tweens.add({
            targets: selectedButton,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                // Переходим к игре
                this.scene.start('GameScene', { difficulty: difficulty });
            }
        });
        
        // Звук выбора (временно отключен)
        // if (this.sound.get('button_click')) {
        //     this.sound.play('button_click');
        // }
    }

    loadGame() {
        // Попытка загрузить сохраненную игру
        const savedProgress = localStorage.getItem('moldova28days_progress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                this.scene.start('GameScene', { 
                    difficulty: progress.difficulty,
                    loadProgress: true 
                });
            } catch (error) {
                console.error('Ошибка загрузки:', error);
                this.showNotification('Ошибка загрузки сохраненной игры');
            }
        } else {
            this.showNotification('Сохраненная игра не найдена');
        }
    }

    showSettings() {
        // Показываем простые настройки
        this.showNotification('Настройки пока не реализованы');
    }

    showAbout() {
        // Показываем информацию об игре
        this.showNotification('28 дней - стратегическая игра о выборах в Молдове');
    }

    showNotification(message) {
        // Создаем временное уведомление
        const notification = this.add.text(400, 550, message, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffff00',
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
}
