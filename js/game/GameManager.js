// Менеджер игры - управляет основной логикой
class GameManager {
    constructor(scene, difficulty) {
        this.scene = scene;
        this.difficulty = difficulty;
        this.budget = gameSettings.startingBudget;
        this.currentDay = 1;
        this.regions = {};
        this.activeEffects = [];
        
        // Инициализируем регионы
        this.initializeRegions();
        
        // Применяем множитель сложности
        this.applyDifficultyMultiplier();
        
        // Глобальная ссылка для доступа из других модулей
        window.gameManager = this;
    }

    initializeRegions() {
        const regionKeys = ['north', 'center', 'gagauzia', 'transnistria'];
        
        regionKeys.forEach(key => {
            const config = gameSettings.regions[key];
            let startingPopularity = config.popularity;
            
            // Применяем множитель сложности к начальной популярности
            if (this.difficulty === 'opposition') {
                startingPopularity = Math.max(20, startingPopularity - 10);
            } else if (this.difficulty === 'ruling') {
                startingPopularity = Math.min(80, startingPopularity + 5);
            }
            
            this.regions[key] = {
                name: config.name,
                popularity: startingPopularity,
                influence: config.influence,
                effects: []
            };
        });
    }

    applyDifficultyMultiplier() {
        const multiplier = gameSettings.difficulty[this.difficulty].multiplier;
        
        // Применяем множитель к бюджету
        this.budget = Math.round(this.budget * multiplier);
        
        // Применяем множитель к популярности регионов
        Object.keys(this.regions).forEach(key => {
            const region = this.regions[key];
            region.popularity = Math.round(region.popularity * multiplier);
            
            // Ограничиваем популярность в разумных пределах
            region.popularity = Math.max(0, Math.min(100, region.popularity));
        });
    }

    // Получение информации о регионах
    getRegionPopularity(regionKey) {
        if (this.regions[regionKey]) {
            return this.regions[regionKey].popularity;
        }
        return 50; // Значение по умолчанию
    }

    getRegionInfluence(regionKey) {
        if (this.regions[regionKey]) {
            return this.regions[regionKey].influence;
        }
        return 0.25; // Значение по умолчанию
    }

    getRegionName(regionKey) {
        if (this.regions[regionKey]) {
            return this.regions[regionKey].name;
        }
        return 'Неизвестный регион';
    }

    // Получение общей информации
    getBudget() {
        return this.budget;
    }

    getTotalPopularity() {
        let totalPopularity = 0;
        let totalInfluence = 0;
        
        Object.keys(this.regions).forEach(key => {
            const region = this.regions[key];
            totalPopularity += region.popularity * region.influence;
            totalInfluence += region.influence;
        });
        
        return totalInfluence > 0 ? totalPopularity / totalInfluence : 50;
    }

    getCurrentDay() {
        return this.currentDay;
    }

    getDifficulty() {
        return this.difficulty;
    }

    // Применение событий
    applyEvent(event) {
        const effects = this.difficulty === 'ruling' ? event.rulingParty : event.opposition;
        
        // Применяем изменения популярности по регионам
        if (effects.popularity) {
            Object.keys(effects.popularity).forEach(regionKey => {
                if (this.regions[regionKey]) {
                    this.regions[regionKey].popularity += effects.popularity[regionKey];
                    this.regions[regionKey].popularity = Math.max(0, Math.min(100, this.regions[regionKey].popularity));
                }
            });
        }
        
        // Применяем изменения бюджета
        if (effects.budget) {
            this.budget += effects.budget;
            this.budget = Math.max(0, this.budget);
        }
        
        // Логируем событие
        console.log(`Применено событие: ${event.title}`);
        console.log(`Эффекты:`, effects);
    }

    // Применение выборов в специальных событиях
    applyChoice(choice) {
        // Применяем изменения популярности
        if (choice.popularity) {
            Object.keys(choice.popularity).forEach(regionKey => {
                if (this.regions[regionKey]) {
                    this.regions[regionKey].popularity += choice.popularity[regionKey];
                    this.regions[regionKey].popularity = Math.max(0, Math.min(100, this.regions[regionKey].popularity));
                }
            });
        }
        
        // Применяем изменения бюджета
        if (choice.cost) {
            this.budget -= choice.cost;
            this.budget = Math.max(0, this.budget);
        }
        
        // Логируем выбор
        console.log(`Применен выбор: ${choice.text}`);
        console.log(`Эффекты:`, choice);
    }

    // Покупка действий
    buyAction(actionId) {
        const action = availableActions.find(a => a.id === actionId);
        if (!action) {
            console.error(`Действие не найдено: ${actionId}`);
            return false;
        }
        
        // Проверяем достаточно ли бюджета
        if (this.budget < action.cost) {
            console.log(`Недостаточно средств для покупки действия: ${action.title}`);
            return false;
        }
        
        // Списываем стоимость
        this.budget -= action.cost;
        
        // Применяем эффекты действия
        if (action.effects.popularity) {
            Object.keys(action.effects.popularity).forEach(regionKey => {
                if (this.regions[regionKey]) {
                    this.regions[regionKey].popularity += action.effects.popularity[regionKey];
                    this.regions[regionKey].popularity = Math.max(0, Math.min(100, this.regions[regionKey].popularity));
                }
            });
        }
        
        // Добавляем действие в активные эффекты
        this.activeEffects.push({
            actionId: actionId,
            effects: action.effects,
            duration: action.effects.duration,
            dayApplied: this.currentDay
        });
        
        console.log(`Куплено действие: ${action.title}`);
        return true;
    }

    // Обновление эффектов (вызывается каждый день)
    updateEffects() {
        const currentDay = this.currentDay;
        const expiredEffects = [];
        
        this.activeEffects.forEach((effect, index) => {
            if (currentDay - effect.dayApplied >= effect.duration) {
                expiredEffects.push(index);
            }
        });
        
        // Убираем истекшие эффекты
        expiredEffects.reverse().forEach(index => {
            const effect = this.activeEffects[index];
            console.log(`Истек эффект действия: ${effect.actionId}`);
            this.activeEffects.splice(index, 1);
        });
    }

    // Переход к следующему дню
    nextDay() {
        this.currentDay++;
        
        // Обновляем эффекты
        this.updateEffects();
        
        // Проверяем случайные события
        this.checkRandomEvents();
        
        // Проверяем специальные события
        this.checkSpecialEvents();
        
        console.log(`День ${this.currentDay} начался`);
    }

    // Проверка случайных событий
    checkRandomEvents() {
        randomEvents.forEach(event => {
            if (Math.random() < event.probability) {
                console.log(`Произошло случайное событие: ${event.title}`);
                this.applyEvent(event);
            }
        });
    }

    // Проверка специальных событий
    checkSpecialEvents() {
        const specialEvent = specialEvents.find(event => event.day === this.currentDay);
        if (specialEvent) {
            console.log(`Произошло специальное событие: ${specialEvent.title}`);
            // Здесь можно запустить сцену специального события
        }
    }

    // Проверка условий победы/поражения
    checkGameEnd() {
        const totalPopularity = this.getTotalPopularity();
        
        if (this.currentDay >= 28) {
            // Игра закончена
            return totalPopularity > 50 ? 'victory' : 'defeat';
        }
        
        // Проверяем критически низкую популярность
        if (totalPopularity < 20) {
            return 'defeat';
        }
        
        // Проверяем критически высокую популярность
        if (totalPopularity > 80) {
            return 'victory';
        }
        
        return 'continue';
    }

    // Получение статистики
    getStatistics() {
        const stats = {
            currentDay: this.currentDay,
            budget: this.budget,
            totalPopularity: this.getTotalPopularity(),
            regions: {},
            activeEffects: this.activeEffects.length,
            difficulty: this.difficulty
        };
        
        Object.keys(this.regions).forEach(key => {
            stats.regions[key] = {
                name: this.regions[key].name,
                popularity: this.regions[key].popularity,
                influence: this.regions[key].influence
            };
        });
        
        return stats;
    }

    // Сохранение состояния игры
    getGameState() {
        return {
            difficulty: this.difficulty,
            budget: this.budget,
            currentDay: this.currentDay,
            regions: this.regions,
            activeEffects: this.activeEffects
        };
    }

    // Загрузка состояния игры
    loadGameState(state) {
        if (state.difficulty) this.difficulty = state.difficulty;
        if (state.budget !== undefined) this.budget = state.budget;
        if (state.currentDay) this.currentDay = state.currentDay;
        if (state.regions) this.regions = state.regions;
        if (state.activeEffects) this.activeEffects = state.activeEffects;
        
        console.log('Состояние игры загружено');
    }

    // Сброс игры
    resetGame() {
        this.budget = gameSettings.startingBudget;
        this.currentDay = 1;
        this.activeEffects = [];
        
        // Переинициализируем регионы
        this.initializeRegions();
        this.applyDifficultyMultiplier();
        
        console.log('Игра сброшена');
    }

    // Получение доступных действий
    getAvailableActions() {
        return availableActions.filter(action => this.budget >= action.cost);
    }

    // Получение информации о действии
    getActionInfo(actionId) {
        return availableActions.find(a => a.id === actionId);
    }

    // Проверка возможности покупки действия
    canAffordAction(actionId) {
        const action = this.getActionInfo(actionId);
        return action && this.budget >= action.cost;
    }

    // Получение рекомендаций
    getRecommendations() {
        const recommendations = [];
        const totalPopularity = this.getTotalPopularity();
        
        // Проверяем общую популярность
        if (totalPopularity < 40) {
            recommendations.push('Ваша популярность критически низка! Используйте действия для повышения рейтинга.');
        } else if (totalPopularity < 60) {
            recommendations.push('Популярность ниже среднего. Рассмотрите возможность покупки действий.');
        }
        
        // Проверяем бюджет
        if (this.budget < 100000) {
            recommendations.push('Бюджет заканчивается. Экономьте на дорогих действиях.');
        }
        
        // Проверяем регионы с низкой популярностью
        Object.keys(this.regions).forEach(key => {
            const region = this.regions[key];
            if (region.popularity < 30) {
                recommendations.push(`Критически низкая популярность в регионе ${region.name}.`);
            }
        });
        
        return recommendations;
    }
}
