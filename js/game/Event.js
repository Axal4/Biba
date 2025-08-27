// Класс события - управляет игровыми событиями
class Event {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.image = data.image;
        this.rulingParty = data.rulingParty || {};
        this.opposition = data.opposition || {};
        this.choices = data.choices || [];
        this.probability = data.probability || 0;
        this.day = data.day || null;
        this.isSpecial = !!data.day;
        this.isRandom = !!data.probability;
    }

    // Получение эффектов для определенной партии
    getEffects(party) {
        return party === 'ruling' ? this.rulingParty : this.opposition;
    }

    // Проверка, является ли событие специальным
    isSpecialEvent() {
        return this.isSpecial;
    }

    // Проверка, является ли событие случайным
    isRandomEvent() {
        return this.isRandom;
    }

    // Проверка, происходит ли событие в определенный день
    occursOnDay(day) {
        return this.day === day;
    }

    // Проверка, должно ли произойти случайное событие
    shouldOccur() {
        if (!this.isRandom) return false;
        return Math.random() < this.probability;
    }

    // Получение информации о событии
    getInfo() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            image: this.image,
            type: this.isSpecial ? 'special' : this.isRandom ? 'random' : 'daily',
            day: this.day,
            probability: this.probability,
            hasChoices: this.choices.length > 0
        };
    }

    // Получение доступных выборов
    getChoices() {
        return this.choices;
    }

    // Проверка, есть ли выборы у события
    hasChoices() {
        return this.choices.length > 0;
    }

    // Применение эффектов события
    applyEffects(party, gameManager) {
        const effects = this.getEffects(party);
        
        if (effects.popularity) {
            Object.keys(effects.popularity).forEach(regionKey => {
                const region = gameManager.regions[regionKey];
                if (region) {
                    region.changePopularity(effects.popularity[regionKey]);
                }
            });
        }
        
        if (effects.budget) {
            gameManager.budget += effects.budget;
            gameManager.budget = Math.max(0, gameManager.budget);
        }
        
        return effects;
    }

    // Создание события из данных
    static createFromData(data) {
        return new Event(data);
    }

    // Создание случайного события
    static createRandom() {
        const randomEvents = window.randomEvents || [];
        if (randomEvents.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * randomEvents.length);
        return new Event(randomEvents[randomIndex]);
    }

    // Создание события для определенного дня
    static createForDay(day) {
        const specialEvents = window.specialEvents || [];
        const eventData = specialEvents.find(event => event.day === day);
        
        if (eventData) {
            return new Event(eventData);
        }
        
        return null;
    }

    // Создание ежедневного события
    static createDaily() {
        const dailyEvents = window.dailyEvents || [];
        if (dailyEvents.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * dailyEvents.length);
        return new Event(dailyEvents[randomIndex]);
    }

    // Валидация события
    validate() {
        const errors = [];
        
        if (!this.id) errors.push('Отсутствует ID события');
        if (!this.title) errors.push('Отсутствует заголовок события');
        if (!this.description) errors.push('Отсутствует описание события');
        
        if (this.isSpecial && !this.day) {
            errors.push('Специальное событие должно иметь день');
        }
        
        if (this.isRandom && (this.probability < 0 || this.probability > 1)) {
            errors.push('Вероятность должна быть от 0 до 1');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Клонирование события
    clone() {
        return new Event({
            id: this.id,
            title: this.title,
            description: this.description,
            image: this.image,
            rulingParty: { ...this.rulingParty },
            opposition: { ...this.opposition },
            choices: [...this.choices],
            probability: this.probability,
            day: this.day
        });
    }

    // Экспорт события в JSON
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            image: this.image,
            rulingParty: this.rulingParty,
            opposition: this.opposition,
            choices: this.choices,
            probability: this.probability,
            day: this.day
        };
    }
}
