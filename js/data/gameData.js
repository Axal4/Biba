// Данные игры: события, действия и их эффекты

// События дня
const dailyEvents = [
    {
        id: 'eu_visit',
        title: 'Визит лидеров ЕС',
        description: 'В Молдову прибывают высокопоставленные представители Европейского Союза',
        rulingParty: {
            popularity: { north: 5, center: 8, gagauzia: 3, transnistria: 2 },
            budget: 0
        },
        opposition: {
            popularity: { north: -3, center: -5, gagauzia: -2, transnistria: -1 },
            budget: 0
        },
        image: 'eu_flag'
    },
    {
        id: 'gas_prices',
        title: 'Рост цен на газ',
        description: 'Цены на природный газ выросли на 15%',
        rulingParty: {
            popularity: { north: -8, center: -6, gagauzia: -4, transnistria: -3 },
            budget: 0
        },
        opposition: {
            popularity: { north: 3, center: 2, gagauzia: 1, transnistria: 1 },
            budget: 0
        },
        image: 'gas_prices'
    },
    {
        id: 'corruption_scandal',
        title: 'Скандал с коррупцией',
        description: 'В СМИ появились обвинения в коррупции среди чиновников',
        rulingParty: {
            popularity: { north: -10, center: -12, gagauzia: -8, transnistria: -6 },
            budget: 0
        },
        opposition: {
            popularity: { north: 5, center: 6, gagauzia: 4, transnistria: 3 },
            budget: 0
        },
        image: 'corruption'
    },
    {
        id: 'economic_growth',
        title: 'Рост экономики',
        description: 'ВВП Молдовы вырос на 3.2% в этом квартале',
        rulingParty: {
            popularity: { north: 6, center: 8, gagauzia: 4, transnistria: 3 },
            budget: 0
        },
        opposition: {
            popularity: { north: -2, center: -3, gagauzia: -1, transnistria: -1 },
            budget: 0
        },
        image: 'economy'
    },
    {
        id: 'russian_media',
        title: 'Критика в российских СМИ',
        description: 'Российские СМИ критикуют политику Молдовы',
        rulingParty: {
            popularity: { north: -3, center: -2, gagauzia: -6, transnistria: -8 },
            budget: 0
        },
        opposition: {
            popularity: { north: 2, center: 1, gagauzia: 4, transnistria: 5 },
            budget: 0
        },
        image: 'russia_media'
    },
    {
        id: 'social_programs',
        title: 'Новые социальные программы',
        description: 'Правительство запускает программы поддержки малоимущих',
        rulingParty: {
            popularity: { north: 7, center: 9, gagauzia: 5, transnistria: 4 },
            budget: -50000
        },
        opposition: {
            popularity: { north: -1, center: -2, gagauzia: -1, transnistria: -1 },
            budget: 0
        },
        image: 'social_programs'
    },
    {
        id: 'diaspora_support',
        title: 'Поддержка диаспоры',
        description: 'Увеличены программы поддержки молдавских граждан за рубежом',
        rulingParty: {
            popularity: { north: 4, center: 6, gagauzia: 3, transnistria: 2 },
            budget: -30000
        },
        opposition: {
            popularity: { north: 1, center: 1, gagauzia: 1, transnistria: 1 },
            budget: 0
        },
        image: 'diaspora'
    },
    {
        id: 'infrastructure_projects',
        title: 'Инфраструктурные проекты',
        description: 'Завершены крупные дорожные проекты в регионах',
        rulingParty: {
            popularity: { north: 8, center: 6, gagauzia: 7, transnistria: 5 },
            budget: -80000
        },
        opposition: {
            popularity: { north: -1, center: -1, gagauzia: -1, transnistria: -1 },
            budget: 0
        },
        image: 'infrastructure'
    }
];

// Действия, которые можно купить за бюджет
const availableActions = [
    {
        id: 'tv_advertising',
        title: 'Телевизионная реклама',
        description: 'Рекламные ролики на основных каналах',
        cost: 100000,
        effects: {
            popularity: { north: 8, center: 10, gagauzia: 6, transnistria: 5 },
            duration: 3 // эффект длится 3 дня
        },
        image: 'tv_ad'
    },
    {
        id: 'social_media_campaign',
        title: 'Кампания в соцсетях',
        description: 'Активная работа в социальных сетях',
        cost: 50000,
        effects: {
            popularity: { north: 4, center: 6, gagauzia: 3, transnistria: 2 },
            duration: 2
        },
        image: 'social_media'
    },
    {
        id: 'local_meetings',
        title: 'Встречи с избирателями',
        description: 'Личные встречи в регионах',
        cost: 30000,
        effects: {
            popularity: { north: 6, center: 4, gagauzia: 8, transnistria: 7 },
            duration: 1
        },
        image: 'meetings'
    },
    {
        id: 'charity_events',
        title: 'Благотворительные акции',
        description: 'Поддержка местных сообществ',
        cost: 40000,
        effects: {
            popularity: { north: 5, center: 7, gagauzia: 4, transnistria: 3 },
            duration: 2
        },
        image: 'charity'
    },
    {
        id: 'youth_programs',
        title: 'Программы для молодежи',
        description: 'Образовательные и развлекательные программы',
        cost: 60000,
        effects: {
            popularity: { north: 3, center: 5, gagauzia: 2, transnistria: 2 },
            duration: 4
        },
        image: 'youth'
    },
    {
        id: 'elderly_support',
        title: 'Поддержка пожилых',
        description: 'Программы помощи пенсионерам',
        cost: 45000,
        effects: {
            popularity: { north: 7, center: 6, gagauzia: 5, transnistria: 4 },
            duration: 3
        },
        image: 'elderly'
    },
    {
        id: 'business_support',
        title: 'Поддержка бизнеса',
        description: 'Программы поддержки малого бизнеса',
        cost: 70000,
        effects: {
            popularity: { north: 4, center: 8, gagauzia: 3, transnistria: 2 },
            duration: 2
        },
        image: 'business'
    },
    {
        id: 'cultural_events',
        title: 'Культурные мероприятия',
        description: 'Фестивали и культурные акции',
        cost: 35000,
        effects: {
            popularity: { north: 3, center: 4, gagauzia: 6, transnistria: 5 },
            duration: 2
        },
        image: 'culture'
    }
];

// Специальные события (происходят в определенные дни)
const specialEvents = [
    {
        day: 7,
        id: 'mid_week_crisis',
        title: 'Кризис середины недели',
        description: 'Неожиданный кризис требует быстрого решения',
        choices: [
            {
                text: 'Быстро отреагировать',
                cost: 100000,
                popularity: { north: 5, center: 7, gagauzia: 4, transnistria: 3 }
            },
            {
                text: 'Игнорировать',
                cost: 0,
                popularity: { north: -8, center: -10, gagauzia: -6, transnistria: -5 }
            }
        ]
    },
    {
        day: 14,
        id: 'halfway_point',
        title: 'Половина пути',
        description: 'Кампания в разгаре, время для стратегических решений',
        choices: [
            {
                text: 'Агрессивная кампания',
                cost: 150000,
                popularity: { north: 10, center: 12, gagauzia: 8, transnistria: 6 }
            },
            {
                text: 'Консервативный подход',
                cost: 50000,
                popularity: { north: 3, center: 4, gagauzia: 2, transnistria: 2 }
            }
        ]
    },
    {
        day: 21,
        id: 'final_push',
        title: 'Финальный рывок',
        description: 'Последняя неделя перед выборами',
        choices: [
            {
                text: 'Максимальные усилия',
                cost: 200000,
                popularity: { north: 15, center: 18, gagauzia: 12, transnistria: 10 }
            },
            {
                text: 'Умеренная активность',
                cost: 100000,
                popularity: { north: 8, center: 10, gagauzia: 6, transnistria: 5 }
            }
        ]
    }
];

// Случайные события (происходят с определенной вероятностью)
const randomEvents = [
    {
        id: 'media_interview',
        title: 'Интервью в СМИ',
        description: 'Представитель партии дает интервью',
        probability: 0.3, // 30% шанс
        effects: {
            popularity: { north: 2, center: 3, gagauzia: 1, transnistria: 1 },
            budget: 0
        }
    },
    {
        id: 'opposition_attack',
        title: 'Атака оппонентов',
        description: 'Противники критикуют вашу партию',
        probability: 0.4,
        effects: {
            popularity: { north: -3, center: -4, gagauzia: -2, transnistria: -2 },
            budget: 0
        }
    },
    {
        id: 'endorsement',
        title: 'Поддержка знаменитости',
        description: 'Известная личность поддерживает вашу партию',
        probability: 0.2,
        effects: {
            popularity: { north: 4, center: 5, gagauzia: 3, transnistria: 2 },
            budget: 0
        }
    }
];

// Экспорт данных
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        dailyEvents,
        availableActions,
        specialEvents,
        randomEvents
    };
}
