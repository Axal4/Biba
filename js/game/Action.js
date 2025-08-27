// Класс действия - управляет действиями, которые может купить игрок
class Action {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.cost = data.cost;
        this.effects = data.effects || {};
        this.image = data.image;
        this.category = data.category || 'general';
        this.cooldown = data.cooldown || 0;
        this.lastUsed = null;
    }

    // Получение стоимости действия
    getCost() {
        return this.cost;
    }

    // Получение эффектов действия
    getEffects() {
        return this.effects;
    }

    // Получение информации о действии
    getInfo() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            cost: this.cost,
            effects: this.effects,
            image: this.image,
            category: this.category,
            cooldown: this.cooldown,
            isAvailable: this.isAvailable(),
            timeUntilAvailable: this.getTimeUntilAvailable()
        };
    }

    // Проверка доступности действия
    isAvailable() {
        if (this.cooldown <= 0) return true;
        
        if (!this.lastUsed) return true;
        
        const now = Date.now();
        const timeSinceLastUse = now - this.lastUsed;
        return timeSinceLastUse >= this.cooldown;
    }

    // Получение времени до доступности
    getTimeUntilAvailable() {
        if (this.isAvailable()) return 0;
        
        const now = Date.now();
        const timeSinceLastUse = now - this.lastUsed;
        return Math.max(0, this.cooldown - timeSinceLastUse);
    }

    // Использование действия
    use() {
        if (!this.isAvailable()) {
            throw new Error(`Действие ${this.title} недоступно`);
        }
        
        this.lastUsed = Date.now();
        return true;
    }

    // Применение эффектов действия
    applyEffects(gameManager) {
        if (!this.effects) return false;
        
        // Применяем изменения популярности по регионам
        if (this.effects.popularity) {
            Object.keys(this.effects.popularity).forEach(regionKey => {
                const region = gameManager.regions[regionKey];
                if (region) {
                    region.changePopularity(this.effects.popularity[regionKey]);
                }
            });
        }
        
        // Применяем изменения бюджета
        if (this.effects.budget) {
            gameManager.budget += this.effects.budget;
            gameManager.budget = Math.max(0, gameManager.budget);
        }
        
        // Применяем другие эффекты
        if (this.effects.morale) {
            // Эффект морали (если реализован)
        }
        
        if (this.effects.media) {
            // Эффект медиа (если реализован)
        }
        
        return true;
    }

    // Проверка возможности покупки
    canAfford(budget) {
        return budget >= this.cost;
    }

    // Получение эффективности действия
    getEfficiency() {
        if (!this.effects.popularity) return 0;
        
        let totalEffect = 0;
        let totalCost = this.cost;
        
        Object.values(this.effects.popularity).forEach(effect => {
            totalEffect += Math.abs(effect);
        });
        
        if (totalCost <= 0) return totalEffect;
        
        return totalEffect / totalCost;
    }

    // Получение лучших действий для региона
    static getBestForRegion(regionKey, budget, actions) {
        return actions
            .filter(action => action.canAfford(budget))
            .filter(action => action.effects.popularity && action.effects.popularity[regionKey])
            .sort((a, b) => {
                const aEffect = Math.abs(a.effects.popularity[regionKey]);
                const bEffect = Math.abs(b.effects.popularity[regionKey]);
                return bEffect - aEffect;
            });
    }

    // Получение действий по категории
    static getByCategory(category, actions) {
        return actions.filter(action => action.category === category);
    }

    // Получение действий в пределах бюджета
    static getAffordable(budget, actions) {
        return actions.filter(action => action.canAfford(budget));
    }

    // Создание действия из данных
    static createFromData(data) {
        return new Action(data);
    }

    // Создание нескольких действий из массива данных
    static createFromArray(dataArray) {
        return dataArray.map(data => new Action(data));
    }

    // Валидация действия
    validate() {
        const errors = [];
        
        if (!this.id) errors.push('Отсутствует ID действия');
        if (!this.title) errors.push('Отсутствует заголовок действия');
        if (!this.description) errors.push('Отсутствует описание действия');
        if (this.cost < 0) errors.push('Стоимость не может быть отрицательной');
        
        if (this.cooldown < 0) {
            errors.push('Время перезарядки не может быть отрицательным');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Клонирование действия
    clone() {
        return new Action({
            id: this.id,
            title: this.title,
            description: this.description,
            cost: this.cost,
            effects: { ...this.effects },
            image: this.image,
            category: this.category,
            cooldown: this.cooldown
        });
    }

    // Экспорт действия в JSON
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            cost: this.cost,
            effects: this.effects,
            image: this.image,
            category: this.category,
            cooldown: this.cooldown,
            lastUsed: this.lastUsed
        };
    }

    // Сравнение действий по эффективности
    compareEfficiency(other) {
        const thisEfficiency = this.getEfficiency();
        const otherEfficiency = other.getEfficiency();
        
        if (thisEfficiency > otherEfficiency) return 1;
        if (thisEfficiency < otherEfficiency) return -1;
        return 0;
    }

    // Получение рекомендации по использованию
    getRecommendation(gameManager) {
        if (!this.effects.popularity) {
            return 'Это действие не влияет на популярность';
        }
        
        const regions = Object.keys(this.effects.popularity);
        const lowPopularityRegions = regions.filter(regionKey => {
            const region = gameManager.regions[regionKey];
            return region && region.popularity < 40;
        });
        
        if (lowPopularityRegions.length > 0) {
            const regionNames = lowPopularityRegions.map(key => 
                gameManager.getRegionName(key)
            ).join(', ');
            
            return `Рекомендуется для повышения популярности в регионах: ${regionNames}`;
        }
        
        return 'Действие может быть полезным для поддержания текущего уровня популярности';
    }
}
