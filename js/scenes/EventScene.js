// Сцена событий дня
class EventScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EventScene' });
        this.event = null;
        this.gameManager = null;
        this.eventContainer = null;
        this.choices = [];
    }

    init(data) {
        this.event = data.event;
        this.gameManager = data.gameManager;
    }

    create() {
        // Создаем затемнение фона
        this.createBackground();
        
        // Создаем основное окно события
        this.createEventWindow();
        
        // Анимация появления
        this.animateEventWindow();
        
        // Добавляем обработчики клавиш
        this.input.keyboard.on('keydown-ESC', () => this.closeEvent());
        this.input.keyboard.on('keydown-ENTER', () => this.selectChoice(0));
    }

    createBackground() {
        // Полупрозрачный черный фон
        this.background = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        
        // Делаем фон интерактивным для закрытия по клику
        this.background.setInteractive();
        this.background.on('pointerdown', () => this.closeEvent());
    }

    createEventWindow() {
        // Основной контейнер события
        this.eventContainer = this.add.container(400, 300);
        
        // Фон окна события
        const windowBg = this.add.rectangle(0, 0, 600, 400, 0xffffff);
        windowBg.setStrokeStyle(3, 0x333333);
        
        // Заголовок "Событие дня"
        const eventTitle = this.add.text(0, -150, 'СОБЫТИЕ ДНЯ', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Название события
        const eventName = this.add.text(0, -100, this.event.title, {
            fontSize: '22px',
            fontFamily: 'Arial',
            color: '#333333',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Описание события
        const eventDescription = this.add.text(0, -50, this.event.description, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#666666',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
        
        // Иконка события (если есть)
        if (this.event.image) {
            const eventIcon = this.add.image(-200, -50, this.event.image);
            eventIcon.setScale(0.5);
            this.eventContainer.add(eventIcon);
        }
        
        // Добавляем основную информацию
        this.eventContainer.add([windowBg, eventTitle, eventName, eventDescription]);
        
        // Создаем кнопки выбора
        this.createChoiceButtons();
        
        // Кнопка закрытия
        this.createCloseButton();
    }

    createChoiceButtons() {
        if (this.event.choices) {
            // Для специальных событий с выбором
            this.createSpecialEventChoices();
        } else {
            // Для обычных событий
            this.createStandardEventChoices();
        }
    }

    createSpecialEventChoices() {
        const choices = this.event.choices;
        const buttonHeight = 60;
        const buttonSpacing = 20;
        const totalHeight = choices.length * buttonHeight + (choices.length - 1) * buttonSpacing;
        const startY = 50;
        
        choices.forEach((choice, index) => {
            const buttonY = startY + index * (buttonHeight + buttonSpacing) - totalHeight / 2;
            
            const choiceButton = this.createChoiceButton(
                0, buttonY, 
                choice.text, 
                choice.cost,
                () => this.selectSpecialChoice(choice)
            );
            
            this.choices.push(choiceButton);
            this.eventContainer.add(choiceButton);
        });
    }

    createStandardEventChoices() {
        // Для обычных событий показываем только информацию
        const infoText = this.add.text(0, 50, 'Это событие повлияет на вашу популярность', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#666666',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        
        // Кнопка "Понятно"
        const understandButton = this.createChoiceButton(
            0, 120, 
            'Понятно', 
            0,
            () => this.closeEvent()
        );
        
        this.choices.push(understandButton);
        this.eventContainer.add([infoText, understandButton]);
    }

    createChoiceButton(x, y, text, cost, callback) {
        const buttonContainer = this.add.container(x, y);
        
        // Фон кнопки
        const buttonBg = this.add.rectangle(0, 0, 300, 50, 0x4CAF50);
        buttonBg.setStrokeStyle(2, 0x333333);
        
        // Текст кнопки
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Стоимость (если есть)
        let costText = null;
        if (cost > 0) {
            costText = this.add.text(0, 15, `Стоимость: ${cost.toLocaleString()} лей`, {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }).setOrigin(0.5);
        }
        
        buttonContainer.add([buttonBg, buttonText]);
        if (costText) buttonContainer.add(costText);
        
        // Делаем кнопку интерактивной
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-150, -25, 300, 50), Phaser.Geom.Rectangle.Contains);
        
        // Обработчики событий
        buttonContainer.on('pointerdown', callback);
        buttonContainer.on('pointerover', () => this.highlightButton(buttonContainer, true));
        buttonContainer.on('pointerout', () => this.highlightButton(buttonContainer, false));
        
        return buttonContainer;
    }

    createCloseButton() {
        const closeButton = this.add.container(250, -150);
        
        // Фон кнопки закрытия
        const closeBg = this.add.circle(0, 0, 20, 0xF44336);
        closeBg.setStrokeStyle(2, 0xffffff);
        
        // Крестик
        const closeX = this.add.text(0, 0, '×', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        closeButton.add([closeBg, closeX]);
        closeButton.setInteractive(new Phaser.Geom.Circle(0, 0, 20), Phaser.Geom.Circle.Contains);
        
        closeButton.on('pointerdown', () => this.closeEvent());
        closeButton.on('pointerover', () => this.highlightCloseButton(closeButton, true));
        closeButton.on('pointerout', () => this.highlightCloseButton(closeButton, false));
        
        this.eventContainer.add(closeButton);
    }

    highlightButton(button, isHighlighted) {
        const bg = button.getAt(0); // Фон кнопки
        if (isHighlighted) {
            this.tweens.add({
                targets: button,
                scaleX: 1.05,
                scaleY: 1.05,
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
            bg.setStrokeStyle(2, 0x333333);
        }
    }

    highlightCloseButton(button, isHighlighted) {
        const bg = button.getAt(0); // Фон кнопки
        if (isHighlighted) {
            this.tweens.add({
                targets: button,
                scaleX: 1.2,
                scaleY: 1.2,
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

    animateEventWindow() {
        // Начинаем с масштаба 0
        this.eventContainer.setScale(0);
        
        // Анимация появления
        this.tweens.add({
            targets: this.eventContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Добавляем небольшую анимацию для привлечения внимания
                this.tweens.add({
                    targets: this.eventContainer,
                    scaleX: 1.02,
                    scaleY: 1.02,
                    duration: 200,
                    yoyo: true,
                    ease: 'Sine.easeInOut'
                });
            }
        });
        
        // Анимация фона
        this.background.setAlpha(0);
        this.tweens.add({
            targets: this.background,
            alpha: 0.7,
            duration: 300,
            ease: 'Power2'
        });
    }

    selectChoice(index) {
        if (index < this.choices.length) {
            const choice = this.choices[index];
            
            // Анимация нажатия
            this.tweens.add({
                targets: choice,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Выполняем действие
                    choice.emit('pointerdown');
                }
            });
        }
    }

    selectSpecialChoice(choice) {
        // Проверяем достаточно ли бюджета
        if (this.gameManager && choice.cost > 0) {
            const currentBudget = this.gameManager.getBudget();
            if (currentBudget < choice.cost) {
                this.showInsufficientFunds();
                return;
            }
        }
        
        // Применяем эффекты выбора
        if (this.gameManager) {
            this.gameManager.applyChoice(choice);
        }
        
        // Показываем результат
        this.showChoiceResult(choice);
        
        // Закрываем событие через 2 секунды
        this.time.delayedCall(2000, () => {
            this.closeEvent();
        });
    }

    showInsufficientFunds() {
        // Показываем сообщение о недостатке средств
        const insufficientText = this.add.text(0, 200, 'Недостаточно средств!', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#F44336',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.eventContainer.add(insufficientText);
        
        // Анимация появления
        insufficientText.setScale(0);
        this.tweens.add({
            targets: insufficientText,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Убираем через 2 секунды
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: insufficientText,
                        scaleX: 0,
                        scaleY: 0,
                        duration: 300,
                        ease: 'Back.easeIn',
                        onComplete: () => insufficientText.destroy()
                    });
                });
            }
        });
    }

    showChoiceResult(choice) {
        // Показываем результат выбора
        let resultText = '';
        let resultColor = '#4CAF50';
        
        if (choice.popularity) {
            const totalEffect = Object.values(choice.popularity).reduce((sum, val) => sum + val, 0);
            if (totalEffect > 0) {
                resultText = `Популярность выросла на ${totalEffect}%`;
                resultColor = '#4CAF50';
            } else if (totalEffect < 0) {
                resultText = `Популярность упала на ${Math.abs(totalEffect)}%`;
                resultColor = '#F44336';
            }
        }
        
        if (choice.cost > 0) {
            resultText += `\nПотрачено: ${choice.cost.toLocaleString()} лей`;
        }
        
        if (resultText) {
            const resultDisplay = this.add.text(0, 200, resultText, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: resultColor,
                fontStyle: 'bold',
                align: 'center'
            }).setOrigin(0.5);
            
            this.eventContainer.add(resultDisplay);
            
            // Анимация появления
            resultDisplay.setScale(0);
            this.tweens.add({
                targets: resultDisplay,
                scaleX: 1,
                scaleY: 1,
                duration: 300,
                ease: 'Back.easeOut'
            });
        }
    }

    closeEvent() {
        // Анимация закрытия
        this.tweens.add({
            targets: this.eventContainer,
            scaleX: 0,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn'
        });
        
        this.tweens.add({
            targets: this.background,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                // Возвращаемся к основной игре
                this.scene.stop();
            }
        });
        
        // Звук закрытия
        if (this.sound.get('button_click')) {
            this.sound.play('button_click');
        }
    }
}
