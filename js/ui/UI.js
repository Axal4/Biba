// Класс UI - управляет пользовательским интерфейсом
class UI {
    constructor(scene) {
        this.scene = scene;
        this.gameManager = scene.gameManager;
        this.uiElements = {};
        
        // Создаем основные элементы UI
        this.createMainUI();
        
        // Запускаем обновление UI
        this.startUIUpdate();
    }

    createMainUI() {
        // Создаем панель информации
        this.createInfoPanel();
        
        // Создаем панель прогресса
        this.createProgressPanel();
        
        // Создаем панель рекомендаций
        this.createRecommendationsPanel();
    }

    createInfoPanel() {
        // Контейнер для информации
        this.uiElements.infoPanel = this.scene.add.container(100, 100);
        
        // Фон панели
        const infoBg = this.scene.add.rectangle(0, 0, 200, 120, 0x000000, 0.7);
        infoBg.setStrokeStyle(2, 0xffffff);
        
        // Заголовок панели
        const infoTitle = this.scene.add.text(0, -50, 'ИНФОРМАЦИЯ', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Текущий день
        this.uiElements.dayText = this.scene.add.text(0, -25, 'День: 1', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Бюджет
        this.uiElements.budgetText = this.scene.add.text(0, 0, 'Бюджет: 1,000,000 лей', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#00ff00'
        }).setOrigin(0.5);
        
        // Общая популярность
        this.uiElements.popularityText = this.scene.add.text(0, 25, 'Популярность: 50%', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffff00'
        }).setOrigin(0.5);
        
        // Сложность
        this.uiElements.difficultyText = this.scene.add.text(0, 50, 'Сложность: Легкий', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#cccccc'
        }).setOrigin(0.5);
        
        this.uiElements.infoPanel.add([infoBg, infoTitle, this.uiElements.dayText, this.uiElements.budgetText, this.uiElements.popularityText, this.uiElements.difficultyText]);
    }

    createProgressPanel() {
        // Контейнер для прогресса
        this.uiElements.progressPanel = this.scene.add.container(100, 250);
        
        // Фон панели
        const progressBg = this.scene.add.rectangle(0, 0, 200, 200, 0x000000, 0.7);
        progressBg.setStrokeStyle(2, 0xffffff);
        
        // Заголовок панели
        const progressTitle = this.scene.add.text(0, -80, 'ПРОГРЕСС', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Прогресс бар дней
        const daysProgressBg = this.scene.add.rectangle(0, -50, 150, 15, 0x333333);
        const daysProgressBar = this.scene.add.rectangle(0, -50, 0, 15, 0x4CAF50);
        
        this.uiElements.daysProgressBar = daysProgressBar;
        
        // Текст прогресса дней
        this.uiElements.daysProgressText = this.scene.add.text(0, -30, '1 / 28 дней', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Прогресс бар популярности
        const popularityProgressBg = this.scene.add.rectangle(0, 0, 150, 15, 0x333333);
        const popularityProgressBar = this.scene.add.rectangle(0, 0, 0, 15, 0xFF9800);
        
        this.uiElements.popularityProgressBar = popularityProgressBar;
        
        // Текст прогресса популярности
        this.uiElements.popularityProgressText = this.scene.add.text(0, 20, '50% популярность', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Прогресс бар бюджета
        const budgetProgressBg = this.scene.add.rectangle(0, 50, 150, 15, 0x333333);
        const budgetProgressBar = this.scene.add.rectangle(0, 50, 0, 15, 0x2196F3);
        
        this.uiElements.budgetProgressBar = budgetProgressBar;
        
        // Текст прогресса бюджета
        this.uiElements.budgetProgressText = this.scene.add.text(0, 70, '100% бюджет', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.uiElements.progressPanel.add([
            progressBg, progressTitle,
            daysProgressBg, this.uiElements.daysProgressBar, this.uiElements.daysProgressText,
            popularityProgressBg, this.uiElements.popularityProgressBar, this.uiElements.popularityProgressText,
            budgetProgressBg, this.uiElements.budgetProgressBar, this.uiElements.budgetProgressText
        ]);
    }

    createRecommendationsPanel() {
        // Контейнер для рекомендаций
        this.uiElements.recommendationsPanel = this.scene.add.container(100, 480);
        
        // Фон панели
        const recBg = this.scene.add.rectangle(0, 0, 200, 100, 0x000000, 0.7);
        recBg.setStrokeStyle(2, 0xffffff);
        
        // Заголовок панели
        const recTitle = this.scene.add.text(0, -40, 'РЕКОМЕНДАЦИИ', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Текст рекомендаций
        this.uiElements.recommendationsText = this.scene.add.text(0, 0, 'Начните игру для получения рекомендаций', {
            fontSize: '10px',
            fontFamily: 'Arial',
            color: '#cccccc',
            align: 'center',
            wordWrap: { width: 180 }
        }).setOrigin(0.5);
        
        this.uiElements.recommendationsPanel.add([recBg, recTitle, this.uiElements.recommendationsText]);
    }

    startUIUpdate() {
        // Обновляем UI каждую секунду
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateUI,
            callbackScope: this,
            loop: true
        });
        
        // Первоначальное обновление
        this.updateUI();
    }

    updateUI() {
        if (!this.gameManager) return;
        
        // Обновляем информацию
        this.updateInfoPanel();
        
        // Обновляем прогресс
        this.updateProgressPanel();
        
        // Обновляем рекомендации
        this.updateRecommendationsPanel();
    }

    updateInfoPanel() {
        // Обновляем текущий день
        this.uiElements.dayText.setText(`День: ${this.gameManager.getCurrentDay()}`);
        
        // Обновляем бюджет
        const budget = this.gameManager.getBudget();
        this.uiElements.budgetText.setText(`Бюджет: ${budget.toLocaleString()} лей`);
        
        // Меняем цвет бюджета в зависимости от суммы
        if (budget < 100000) {
            this.uiElements.budgetText.setColor('#ff0000'); // Красный для низкого бюджета
        } else if (budget < 300000) {
            this.uiElements.budgetText.setColor('#ffaa00'); // Оранжевый для среднего
        } else {
            this.uiElements.budgetText.setColor('#00ff00'); // Зеленый для высокого
        }
        
        // Обновляем общую популярность
        const totalPopularity = this.gameManager.getTotalPopularity();
        this.uiElements.popularityText.setText(`Популярность: ${totalPopularity.toFixed(1)}%`);
        
        // Меняем цвет популярности
        if (totalPopularity < 30) {
            this.uiElements.popularityText.setColor('#ff0000'); // Красный
        } else if (totalPopularity < 50) {
            this.uiElements.popularityText.setColor('#ffaa00'); // Оранжевый
        } else if (totalPopularity < 70) {
            this.uiElements.popularityText.setColor('#ffff00'); // Желтый
        } else {
            this.uiElements.popularityText.setColor('#00ff00'); // Зеленый
        }
        
        // Обновляем сложность
        const difficultyName = this.gameManager.getDifficulty() === 'ruling' ? 'Легкий' : 'Тяжелый';
        this.uiElements.difficultyText.setText(`Сложность: ${difficultyName}`);
    }

    updateProgressPanel() {
        // Обновляем прогресс дней
        const currentDay = this.gameManager.getCurrentDay();
        const daysProgress = currentDay / 28;
        this.uiElements.daysProgressBar.width = daysProgress * 150;
        this.uiElements.daysProgressText.setText(`${currentDay} / 28 дней`);
        
        // Обновляем прогресс популярности
        const totalPopularity = this.gameManager.getTotalPopularity();
        const popularityProgress = totalPopularity / 100;
        this.uiElements.popularityProgressBar.width = popularityProgress * 150;
        this.uiElements.popularityProgressText.setText(`${totalPopularity.toFixed(1)}% популярность`);
        
        // Обновляем прогресс бюджета
        const budget = this.gameManager.getBudget();
        const budgetProgress = budget / gameSettings.startingBudget;
        this.uiElements.budgetProgressBar.width = budgetProgress * 150;
        this.uiElements.budgetProgressText.setText(`${Math.round(budgetProgress * 100)}% бюджет`);
        
        // Меняем цвет прогресс баров в зависимости от значений
        this.updateProgressBarColors();
    }

    updateProgressBarColors() {
        // Цвет для дней (всегда зеленый, так как это просто прогресс)
        this.uiElements.daysProgressBar.setFillStyle(0x4CAF50);
        
        // Цвет для популярности
        const totalPopularity = this.gameManager.getTotalPopularity();
        if (totalPopularity < 30) {
            this.uiElements.popularityProgressBar.setFillStyle(0xF44336); // Красный
        } else if (totalPopularity < 50) {
            this.uiElements.popularityProgressBar.setFillStyle(0xFF9800); // Оранжевый
        } else if (totalPopularity < 70) {
            this.uiElements.popularityProgressBar.setFillStyle(0xFFEB3B); // Желтый
        } else {
            this.uiElements.popularityProgressBar.setFillStyle(0x4CAF50); // Зеленый
        }
        
        // Цвет для бюджета
        const budget = this.gameManager.getBudget();
        const budgetProgress = budget / gameSettings.startingBudget;
        if (budgetProgress < 0.3) {
            this.uiElements.budgetProgressBar.setFillStyle(0xF44336); // Красный
        } else if (budgetProgress < 0.6) {
            this.uiElements.budgetProgressBar.setFillStyle(0xFF9800); // Оранжевый
        } else {
            this.uiElements.budgetProgressBar.setFillStyle(0x2196F3); // Синий
        }
    }

    updateRecommendationsPanel() {
        // Получаем рекомендации от менеджера игры
        const recommendations = this.gameManager.getRecommendations();
        
        if (recommendations.length === 0) {
            this.uiElements.recommendationsText.setText('Все идет хорошо! Продолжайте в том же духе.');
            this.uiElements.recommendationsText.setColor('#00ff00');
        } else {
            // Показываем первую рекомендацию
            this.uiElements.recommendationsText.setText(recommendations[0]);
            
            // Меняем цвет в зависимости от типа рекомендации
            if (recommendations[0].includes('критически')) {
                this.uiElements.recommendationsText.setColor('#ff0000');
            } else if (recommendations[0].includes('низка')) {
                this.uiElements.recommendationsText.setColor('#ffaa00');
            } else {
                this.uiElements.recommendationsText.setColor('#ffff00');
            }
        }
    }

    // Показ уведомления
    showNotification(message, type = 'info', duration = 3000) {
        // Создаем уведомление
        const notification = this.scene.add.text(400, 550, message, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : type === 'warning' ? '#ffaa00' : '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Анимация появления
        notification.setScale(0);
        this.scene.tweens.add({
            targets: notification,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Автоматически скрываем через указанное время
                this.scene.time.delayedCall(duration, () => {
                    this.scene.tweens.add({
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

    // Показ модального окна
    showModal(title, content, buttons = []) {
        // Создаем затемнение
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        
        // Создаем основное окно
        const modal = this.scene.add.container(400, 300);
        
        // Фон модального окна
        const modalBg = this.scene.add.rectangle(0, 0, 500, 300, 0xffffff);
        modalBg.setStrokeStyle(3, 0x333333);
        
        // Заголовок
        const modalTitle = this.scene.add.text(0, -120, title, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Содержимое
        const modalContent = this.scene.add.text(0, -50, content, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#666666',
            align: 'center',
            wordWrap: { width: 450 }
        }).setOrigin(0.5);
        
        modal.add([modalBg, modalTitle, modalContent]);
        
        // Добавляем кнопки
        buttons.forEach((button, index) => {
            const buttonObj = this.createModalButton(
                (index - (buttons.length - 1) / 2) * 120,
                80,
                button.text,
                button.color || 0x4CAF50,
                button.callback
            );
            modal.add(buttonObj);
        });
        
        // Анимация появления
        modal.setScale(0);
        this.scene.tweens.add({
            targets: modal,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        // Возвращаем объекты для управления
        return { overlay, modal };
    }

    createModalButton(x, y, text, color, callback) {
        const button = this.scene.add.container(x, y);
        
        // Фон кнопки
        const buttonBg = this.scene.add.rectangle(0, 0, 100, 40, color);
        buttonBg.setStrokeStyle(2, 0xffffff);
        
        // Текст кнопки
        const buttonText = this.scene.add.text(0, 0, text, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        button.add([buttonBg, buttonText]);
        button.setInteractive(new Phaser.Geom.Rectangle(-50, -20, 100, 40), Phaser.Geom.Rectangle.Contains);
        
        // Обработчики событий
        button.on('pointerdown', callback);
        button.on('pointerover', () => {
            this.scene.tweens.add({
                targets: button,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 150,
                ease: 'Power2'
            });
        });
        button.on('pointerout', () => {
            this.scene.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Power2'
            });
        });
        
        return button;
    }

    // Скрытие UI элементов
    hideUI() {
        Object.values(this.uiElements).forEach(element => {
            if (element && element.setVisible) {
                element.setVisible(false);
            }
        });
    }

    // Показ UI элементов
    showUI() {
        Object.values(this.uiElements).forEach(element => {
            if (element && element.setVisible) {
                element.setVisible(true);
            }
        });
    }

    // Очистка UI
    destroy() {
        Object.values(this.uiElements).forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        this.uiElements = {};
    }
}
