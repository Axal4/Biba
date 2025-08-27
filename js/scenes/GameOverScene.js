// Сцена окончания игры
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
        this.gameManager = null;
        this.currentDay = 1;
        this.isVictory = false;
        this.finalScore = 0;
    }

    init(data) {
        this.gameManager = data.gameManager;
        this.currentDay = data.currentDay || 1;
        this.calculateResults();
    }

    create() {
        // Создаем фон
        this.createBackground();
        
        // Создаем основной контент
        this.createMainContent();
        
        // Создаем статистику
        this.createStatistics();
        
        // Создаем кнопки
        this.createButtons();
        
        // Анимация появления
        this.animateScene();
        
        // Добавляем обработчики клавиш
        this.input.keyboard.on('keydown-ENTER', () => this.restartGame());
        this.input.keyboard.on('keydown-ESC', () => this.returnToMainMenu());
    }

    createBackground() {
        // Градиентный фон
        const bg = this.add.graphics();
        if (this.isVictory) {
            // Зеленый градиент для победы
            bg.fillGradientStyle(0x4CAF50, 0x2E7D32, 0x4CAF50, 0x2E7D32, 1);
        } else {
            // Красный градиент для поражения
            bg.fillGradientStyle(0xF44336, 0xC62828, 0xF44336, 0xC62828, 1);
        }
        bg.fillRect(0, 0, 800, 600);
        
        // Добавляем декоративные элементы
        this.createBackgroundElements();
    }

    createBackgroundElements() {
        if (this.isVictory) {
            // Создаем конфетти для победы
            this.createConfetti();
        } else {
            // Создаем мрачные облака для поражения
            this.createDarkClouds();
        }
    }

    createConfetti() {
        const colors = [0xFFD700, 0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4];
        
        for (let i = 0; i < 50; i++) {
            const confetti = this.add.rectangle(
                Math.random() * 800,
                -20,
                4 + Math.random() * 8,
                4 + Math.random() * 8,
                colors[Math.floor(Math.random() * colors.length)]
            );
            
            // Анимация падения
            this.tweens.add({
                targets: confetti,
                y: 620,
                rotation: Math.random() * 6.28,
                duration: 3000 + Math.random() * 2000,
                ease: 'Linear',
                onComplete: () => confetti.destroy()
            });
            
            // Продолжаем создавать конфетти
            this.time.delayedCall(100 + Math.random() * 200, () => {
                if (this.scene.isActive('GameOverScene')) {
                    this.createConfetti();
                }
            });
        }
    }

    createDarkClouds() {
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.circle(
                Math.random() * 800,
                Math.random() * 200 + 50,
                30 + Math.random() * 40,
                0x424242,
                0.6
            );
            
            this.tweens.add({
                targets: cloud,
                x: cloud.x + 100,
                duration: 8000 + Math.random() * 4000,
                ease: 'Linear',
                repeat: -1,
                yoyo: true
            });
        }
    }

    createMainContent() {
        // Основной контейнер
        this.mainContainer = this.add.container(400, 200);
        
        // Заголовок
        const titleText = this.isVictory ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ';
        const titleColor = this.isVictory ? '#FFD700' : '#FF6B6B';
        
        this.title = this.add.text(0, 0, titleText, {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: titleColor,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Подзаголовок
        const subtitleText = this.isVictory 
            ? 'Вы выиграли выборы!' 
            : 'Вы проиграли выборы...';
        
        this.subtitle = this.add.text(0, 80, subtitleText, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Финальный счет
        this.finalScoreText = this.add.text(0, 120, `Финальный счет: ${this.finalScore}`, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.mainContainer.add([this.title, this.subtitle, this.finalScoreText]);
    }

    createStatistics() {
        // Контейнер статистики
        this.statsContainer = this.add.container(400, 350);
        
        // Фон для статистики
        const statsBg = this.add.rectangle(0, 0, 600, 150, 0xffffff, 0.9);
        statsBg.setStrokeStyle(2, 0x333333);
        
        // Заголовок статистики
        const statsTitle = this.add.text(0, -60, 'СТАТИСТИКА ИГРЫ', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Статистика по регионам
        const regions = ['north', 'center', 'gagauzia', 'transnistria'];
        const regionNames = ['Север', 'Центр', 'Гагаузия', 'Приднестровье'];
        
        let statsText = '';
        regions.forEach((region, index) => {
            const popularity = this.gameManager ? this.gameManager.getRegionPopularity(region) : 50;
            statsText += `${regionNames[index]}: ${popularity}%\n`;
        });
        
        // Добавляем общую статистику
        if (this.gameManager) {
            const budget = this.gameManager.getBudget();
            const totalPopularity = this.gameManager.getTotalPopularity();
            statsText += `\nБюджет: ${budget.toLocaleString()} лей`;
            statsText += `\nОбщая популярность: ${totalPopularity.toFixed(1)}%`;
        }
        
        const statsContent = this.add.text(0, 0, statsText, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#333333',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5);
        
        this.statsContainer.add([statsBg, statsTitle, statsContent]);
    }

    createButtons() {
        // Контейнер кнопок
        this.buttonsContainer = this.add.container(400, 520);
        
        // Кнопка "Играть снова"
        this.restartButton = this.createButton(-120, 0, 'Играть снова', 0x4CAF50, () => this.restartGame());
        
        // Кнопка "Главное меню"
        this.menuButton = this.createButton(120, 0, 'Главное меню', 0x2196F3, () => this.returnToMainMenu());
        
        this.buttonsContainer.add([this.restartButton, this.menuButton]);
    }

    createButton(x, y, text, color, callback) {
        const buttonContainer = this.add.container(x, y);
        
        // Фон кнопки
        const buttonBg = this.add.rectangle(0, 0, 150, 50, color);
        buttonBg.setStrokeStyle(2, 0xffffff);
        
        // Текст кнопки
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        buttonContainer.add([buttonBg, buttonText]);
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-75, -25, 150, 50), Phaser.Geom.Rectangle.Contains);
        
        // Обработчики событий
        buttonContainer.on('pointerdown', callback);
        buttonContainer.on('pointerover', () => this.highlightButton(buttonContainer, true));
        buttonContainer.on('pointerout', () => this.highlightButton(buttonContainer, false));
        
        return buttonContainer;
    }

    highlightButton(button, isHighlighted) {
        const bg = button.getAt(0); // Фон кнопки
        if (isHighlighted) {
            this.tweens.add({
                targets: button,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 150,
                ease: 'Power2'
            });
            bg.setStrokeStyle(3, 0xffff00);
        } else {
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Power2'
            });
            bg.setStrokeStyle(2, 0xffffff);
        }
    }

    animateScene() {
        // Анимация появления заголовка
        this.title.setScale(0);
        this.tweens.add({
            targets: this.title,
            scaleX: 1,
            scaleY: 1,
            duration: 800,
            ease: 'Back.easeOut',
            delay: 500
        });
        
        // Анимация подзаголовка
        this.subtitle.setScale(0);
        this.tweens.add({
            targets: this.subtitle,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            delay: 800
        });
        
        // Анимация финального счета
        this.finalScoreText.setScale(0);
        this.tweens.add({
            targets: this.finalScoreText,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            delay: 1000
        });
        
        // Анимация статистики
        this.statsContainer.setScale(0);
        this.tweens.add({
            targets: this.statsContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            delay: 1200
        });
        
        // Анимация кнопок
        this.buttonsContainer.setScale(0);
        this.tweens.add({
            targets: this.buttonsContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            delay: 1400
        });
        
        // Специальная анимация для победы
        if (this.isVictory) {
            this.animateVictory();
        }
    }

    animateVictory() {
        // Анимация пульсации заголовка
        this.tweens.add({
            targets: this.title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Анимация вращения финального счета
        this.tweens.add({
            targets: this.finalScoreText,
            rotation: 0.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    calculateResults() {
        if (!this.gameManager) {
            this.isVictory = false;
            this.finalScore = 0;
            return;
        }
        
        // Получаем общую популярность
        const totalPopularity = this.gameManager.getTotalPopularity();
        
        // Определяем победу (популярность выше 50%)
        this.isVictory = totalPopularity > 50;
        
        // Вычисляем финальный счет
        this.finalScore = Math.round(totalPopularity * 100);
        
        // Бонус за сложность
        if (this.gameManager.difficulty === 'opposition') {
            this.finalScore += 1000; // Бонус за сложный уровень
        }
        
        // Бонус за бюджет
        const budget = this.gameManager.getBudget();
        if (budget > 500000) {
            this.finalScore += 500; // Бонус за экономию
        }
        
        // Бонус за завершение игры
        if (this.currentDay >= 28) {
            this.finalScore += 2000; // Бонус за завершение
        }
    }

    restartGame() {
        // Анимация исчезновения
        this.tweens.add({
            targets: [this.mainContainer, this.statsContainer, this.buttonsContainer],
            scaleX: 0,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                // Очищаем сохраненный прогресс
                try {
                    localStorage.removeItem('moldova28days_progress');
                } catch (error) {
                    console.error('Ошибка очистки прогресса:', error);
                }
                
                // Переходим к главному меню
                this.scene.start('MainMenuScene');
            }
        });
    }

    returnToMainMenu() {
        // Анимация исчезновения
        this.tweens.add({
            targets: [this.mainContainer, this.statsContainer, this.buttonsContainer],
            scaleX: 0,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                // Переходим к главному меню
                this.scene.start('MainMenuScene');
            }
        });
    }
}
