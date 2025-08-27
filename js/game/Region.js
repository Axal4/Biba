// Класс региона - управляет отдельным регионом Молдовы
class Region {
    constructor(key, config) {
        this.key = key;
        this.name = config.name;
        this.popularity = config.popularity;
        this.influence = config.influence;
        this.effects = [];
        this.history = [];
    }

    // Получение текущей популярности
    getPopularity() {
        return this.popularity;
    }

    // Установка популярности
    setPopularity(value) {
        this.popularity = Math.max(0, Math.min(100, value));
        this.addToHistory(this.popularity);
    }

    // Изменение популярности
    changePopularity(delta) {
        this.setPopularity(this.popularity + delta);
    }

    // Получение влияния региона
    getInfluence() {
        return this.influence;
    }

    // Добавление эффекта
    addEffect(effect) {
        this.effects.push({
            ...effect,
            appliedAt: Date.now()
        });
    }

    // Удаление истекших эффектов
    removeExpiredEffects() {
        const now = Date.now();
        this.effects = this.effects.filter(effect => {
            return now - effect.appliedAt < effect.duration * 24 * 60 * 60 * 1000;
        });
    }

    // Получение активных эффектов
    getActiveEffects() {
        return this.effects;
    }

    // Добавление в историю
    addToHistory(popularity) {
        this.history.push({
            popularity: popularity,
            timestamp: Date.now()
        });
        
        // Ограничиваем историю последними 100 записями
        if (this.history.length > 100) {
            this.history.shift();
        }
    }

    // Получение истории
    getHistory() {
        return this.history;
    }

    // Получение статистики
    getStats() {
        return {
            key: this.key,
            name: this.name,
            currentPopularity: this.popularity,
            influence: this.influence,
            activeEffects: this.effects.length,
            historyLength: this.history.length
        };
    }

    // Сброс региона
    reset() {
        this.popularity = 50; // Значение по умолчанию
        this.effects = [];
        this.history = [];
    }

    // Клонирование региона
    clone() {
        return new Region(this.key, {
            name: this.name,
            popularity: this.popularity,
            influence: this.influence
        });
    }
}
