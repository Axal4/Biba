# 🤖 Интеграция Moldova с Telegram играми

## 🎯 Цель
Интегрировать игру "Moldova" с Telegram для создания полноценной Telegram игры, доступной через бота.

## 📱 Что такое Telegram Web App

Telegram Web App - это технология, позволяющая запускать веб-приложения прямо в Telegram. Игроки могут:
- Запускать игру через бота
- Играть без выхода из Telegram
- Получать уведомления о прогрессе
- Делиться результатами с друзьями

## 🚀 Пошаговая интеграция

### Шаг 1: Создание Telegram бота

1. **Откройте Telegram** и найдите @BotFather
2. **Отправьте команду**: `/newbot`
3. **Введите имя бота**: `Moldova Game Bot`
4. **Введите username**: `moldova_game_bot` (должен заканчиваться на `_bot`)
5. **Сохраните токен бота** - он понадобится для настройки

### Шаг 2: Размещение игры на хостинге

#### Вариант A: Vercel (бесплатно)
```bash
# Установите Vercel CLI
npm i -g vercel

# В папке с игрой
vercel

# Следуйте инструкциям
# Получите URL вида: https://your-game.vercel.app
```

#### Вариант B: Netlify (бесплатно)
1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. Перетащите папку с игрой в Netlify
3. Получите URL вида: `https://random-name.netlify.app`

#### Вариант C: GitHub Pages
1. Создайте репозиторий на GitHub
2. Загрузите файлы игры
3. Включите GitHub Pages в настройках
4. Получите URL: `https://username.github.io/repository-name`

### Шаг 3: Настройка Web App в боте

1. **Отправьте команду** @BotFather: `/newapp`
2. **Выберите вашего бота**
3. **Введите название приложения**: `Moldova Game`
4. **Введите описание**: `Политическая стратегия в Молдове`
5. **Загрузите иконку** (512x512 пикселей)
6. **Введите URL игры**: `https://your-game-url.com`
7. **Получите Web App URL**

### Шаг 4: Создание кнопки "Играть"

Отправьте @BotFather команду:
```
/setmenubutton
```

Выберите бота и введите:
```
{
  "type": "web_app",
  "text": "🎮 Играть в Moldova",
  "web_app": {
    "url": "https://your-webapp-url.com"
  }
}
```

### Шаг 5: Настройка команд бота

Отправьте @BotFather команду:
```
/setcommands
```

Выберите бота и введите:
```
start - Начать игру Moldova
play - Играть в Moldova
help - Помощь по игре
rules - Правила игры
```

## 🔧 Техническая настройка

### 1. Добавление Telegram Web App API

Создайте файл `js/telegram-integration.js`:

```javascript
// Telegram Web App интеграция
class TelegramGame {
    constructor() {
        this.initTelegram();
    }

    initTelegram() {
        // Проверяем, запущена ли игра в Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            this.telegram = window.Telegram.WebApp;
            this.telegram.ready();
            this.telegram.expand();
            
            // Настраиваем тему
            this.setupTheme();
            
            // Инициализируем игру
            this.initGame();
        } else {
            console.log('Игра запущена не в Telegram');
            this.initGame();
        }
    }

    setupTheme() {
        // Применяем тему Telegram
        if (this.telegram.colorScheme === 'dark') {
            document.body.classList.add('telegram-dark');
        }
        
        // Устанавливаем основной цвет
        this.telegram.setHeaderColor('#667eea');
        this.telegram.setBackgroundColor('#667eea');
    }

    initGame() {
        // Запускаем основную игру
        if (typeof startGame === 'function') {
            startGame();
        }
    }

    // Отправка данных в Telegram
    sendData(data) {
        if (this.telegram) {
            this.telegram.sendData(JSON.stringify(data));
        }
    }

    // Показать главное меню
    showMainMenu() {
        if (this.telegram) {
            this.telegram.MainButton.setText('🎮 Играть снова');
            this.telegram.MainButton.show();
            this.telegram.MainButton.onClick(() => {
                this.restartGame();
            });
        }
    }

    // Перезапуск игры
    restartGame() {
        location.reload();
    }

    // Уведомление о победе
    showVictory(score) {
        if (this.telegram) {
            this.telegram.showAlert(`🎉 Поздравляем! Ваш счет: ${score}`);
        }
    }
}

// Инициализируем Telegram интеграцию
let telegramGame;
window.addEventListener('load', () => {
    telegramGame = new TelegramGame();
});
```

### 2. Обновление HTML

Добавьте в `index.html`:

```html
<head>
    <!-- ... существующие теги ... -->
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="js/telegram-integration.js"></script>
</head>
```

### 3. Обновление CSS для Telegram

Добавьте в `css/style.css`:

```css
/* Telegram Web App стили */
.telegram-dark {
    background: #1a1a1a !important;
    color: #ffffff !important;
}

.telegram-dark #game-container {
    background: #2c2c2c !important;
}

/* Адаптация под Telegram */
@media (max-width: 414px) {
    body {
        margin: 0;
        padding: 0;
    }
    
    #game-container {
        width: 100vw;
        height: 100vh;
        max-width: none;
        border: none;
        border-radius: 0;
    }
}
```

## 🎮 Тестирование Telegram интеграции

### 1. Локальное тестирование
```bash
# Запустите локальный сервер
python -m http.server 8000

# Используйте ngrok для внешнего доступа
ngrok http 8000

# Скопируйте URL из ngrok в Web App настройки
```

### 2. Тестирование в Telegram
1. Отправьте команду `/start` боту
2. Нажмите кнопку "🎮 Играть в Moldova"
3. Игра должна открыться в Telegram

## 📊 Мониторинг и аналитика

### 1. Статистика использования
```javascript
// Отслеживание событий
function trackEvent(event, data) {
    if (telegramGame && telegramGame.telegram) {
        telegramGame.telegram.sendData(JSON.stringify({
            event: event,
            data: data,
            timestamp: Date.now()
        }));
    }
}

// Примеры использования
trackEvent('game_started', { level: 1 });
trackEvent('level_completed', { level: 1, score: 100 });
trackEvent('game_over', { final_score: 500 });
```

### 2. Обработка данных на сервере
Создайте простой сервер для обработки данных:

```javascript
// server.js (Node.js)
const express = require('express');
const app = express();

app.post('/telegram-data', (req, res) => {
    const data = req.body;
    console.log('Данные от Telegram:', data);
    
    // Сохраняем в базу данных
    // Анализируем статистику
    
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
```

## 🚀 Развертывание

### 1. Подготовка к продакшену
- Минифицируйте CSS и JavaScript
- Оптимизируйте изображения
- Настройте кэширование
- Добавьте SSL сертификат

### 2. Мониторинг производительности
- Отслеживайте время загрузки
- Мониторьте ошибки
- Анализируйте пользовательское поведение

## 💡 Полезные ссылки

- [Telegram Web App документация](https://core.telegram.org/bots/webapps)
- [Bot API документация](https://core.telegram.org/bots/api)
- [Примеры Web App](https://github.com/Ajaxy/telegram-tt)
- [Vercel хостинг](https://vercel.com)
- [Netlify хостинг](https://netlify.com)

## 🎯 Следующие шаги

1. **Создайте бота** через @BotFather
2. **Разместите игру** на хостинге
3. **Настройте Web App** в боте
4. **Протестируйте интеграцию**
5. **Запустите в продакшене**

После выполнения всех шагов ваша игра "Moldova" станет полноценной Telegram игрой! 🎉
