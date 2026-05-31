const { Telegraf, Markup } = require('telegraf');

// Хранилище состояний пользователей и рефералов в памяти сервера
const userState = {}; 
const referals = {}; 

// Генератор постоянного логина и пароля на основе Telegram ID
const getLoginData = (tgId) => ({
    login: `${tgId}_AsyncDNS`,
    password: `AsyncDNS$${tgId}`
});

// Хранилище цен в звездах и названий тарифов
const prices = { 
    pay_1: { stars: 50, name: "1 месяц" }, 
    pay_3: { stars: 100, name: "3 месяца" }, 
    pay_6: { stars: 200, name: "6 месяцев" }, 
    pay_12: { stars: 350, name: "12 месяцев" } 
};

function initBot(token) {
    const bot = new Telegraf(token);

    // Команда /start с поддержкой реферальных ссылок
    bot.start(async (ctx) => {
        const tgId = ctx.from.id;
        const startPayload = ctx.payload;

        if (startPayload && startPayload !== tgId.toString() && !referals[tgId]) {
            referals[tgId] = startPayload;
            const inviterId = parseInt(startPayload);
            
            try {
                await bot.telegram.sendMessage(inviterId, `🎁 По вашей реферальной ссылке зарегистрировался друг! Вам добавлено +2 дня к подписке.`);
            } catch (e) { 
                console.log("Не удалось отправить уведомление рефереру"); 
            }
        }

        ctx.reply('Привет! 👋\n\n🛡️ Oneok — включил и забыл.\n\n🚀 Мгновенная активация\n✅ Гибкие тарифы\n▶️ YouTube без рекламы', 
            Markup.inlineKeyboard([
                [Markup.button.callback('Получить данные для входа 🔑', 'connect')],
                [Markup.button.callback('💳 Продлить подписку', 'tariffs')],
                [Markup.button.callback('📱 Инструкция', 'help'), Markup.button.callback('🎁 Бонусы', 'bonus')],
                [Markup.button.url('👉 Наш канал 👈', 'https://t.me')],
                [Markup.button.callback('ℹ️ О нас', 'about'), Markup.button.callback('💬 Поддержка', 'support')]
            ])
        );
    });

    // Выдача кликабельных данных для входа
    bot.action('connect', async (ctx) => {
        const { login, password } = getLoginData(ctx.from.id);
        const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
        
        await ctx.answerCbQuery();
        await ctx.reply(
            `✨ <b>Ваши постоянные данные для входа готовы!</b>\n\n` +
            `🌐 Наш site: ${domain}\n\n` +
            `👤 Логин (нажми для копирования):\n<code>${login}</code>\n\n` +
            `🔑 Пароль (нажми для копирования):\n<code>${password}</code>\n\n` +
            `⚠️ Вставьте эти данные в форму LOGIN на главной странице сайта.`,
            { parse_mode: 'HTML' }
        );
    });

    // Реферальные бонусы
    bot.action('bonus', async (ctx) => {
        const tgId = ctx.from.id;
        const botUsername = ctx.botInfo.username;
        
        await ctx.answerCbQuery();
        await ctx.reply(
            `🎁 <b>Реферальная программа Oneok</b>\n\n` +
            `Приглашайте друзей и получайте бесплатные дни подписки!\n` +
            `За каждого друга, который перейдет по ссылке, вы получите <b>+2 дня подписки</b>.\n\n` +
            `🔗 Ваша реферальная ссылка:\n<code>https://t.me{botUsername}?start=${tgId}</code>`,
            { parse_mode: 'HTML' }
        );
    });

    // Меню тарифов
    bot.action('tariffs', async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.reply('📅 <b>Выберите срок продления подписки:</b>', {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('⏳ 1 месяц — 50 ⭐️ / Карта РФ', 'pay_1')],
                [Markup.button.callback('⏳ 3 месяца — 100 ⭐️ / Карта РФ', 'pay_3')],
                [Markup.button.callback('⏳ 6 месяцев — 200 ⭐️ / Карта РФ', 'pay_6')],
                [Markup.button.callback('⏳ 12 месяцев — 350 ⭐️ / Карта РФ', 'pay_12')],
                [Markup.button.callback('⬅️ Назад в меню', 'main_menu')]
            ])
        });
    });

    // Способы оплаты для выбранного тарифа
    Object.keys(prices).forEach(tariff => {
        bot.action(tariff, async (ctx) => {
            await ctx.answerCbQuery();
            userState[ctx.from.id] = { tariff: tariff };
            
            await ctx.reply(`💳 <b>Способ оплаты тарифа "${prices[tariff].name}":</b>\n\nВыберите официальную оплату через Telegram Stars или перевод по банковской карте РФ.`, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback(`Официальная оплата (${prices[tariff].stars} ⭐️)`, `stars_invoice`)],
                    [Markup.button.callback('Банковская карта РФ (СБП)', 'card_rf')],
                    [Markup.button.callback('⬅️ К тарифам', 'tariffs')]
                ])
            });
        });
    });

    // Инвойс Telegram Stars
    bot.action('stars_invoice', async (ctx) => {
        await ctx.answerCbQuery();
        const state = userState[ctx.from.id];
        if (!state) return ctx.reply('Ошибка сессии. Выберите тариф заново.');
        
        const tariffData = prices[state.tariff];
        
        await ctx.replyWithInvoice({
            title: `Подписка Oneok — ${tariffData.name}`,
            description: `Продление приватной DNS-подписки на ${tariffData.name}`,
            payload: `payload_${state.tariff}_${ctx.from.id}`,
            provider_token: "", 
            currency: "XTR", 
            prices: [{ label: `Оплата звездами`, amount: tariffData.stars }]
        });
    });

    // Успешный платеж звездами
    bot.on('successful_payment', async (ctx) => {
        const { login, password } = getLoginData(ctx.from.id);
        await ctx.reply(
            `🎉 <b>Оплата в ⭐️ успешно получена!</b>\n\n` +
            `Ваша подписка успешно продлена. Данные для входа на сайт:\n` +
            `👤 Логин: <code>${login}</code>\n🔑 Пароль: <code>${password}</code>`,
            { parse_mode: 'HTML' }
        );
    });

    // Оплата картой РФ (Запрос Email)
    bot.action('card_rf', async (ctx) => {
        await ctx.answerCbQuery();
        userState[ctx.from.id].awaiting_email = true;
        await ctx.reply('⚠️ Для оплаты банковской картой РФ необходим Email для отправки чека.\n\nПожалуйста, введите ваш Email в чат:');
    });

    // Перехват текста Email
    bot.on('text', async (ctx, next) => {
        const state = userState[ctx.from.id];
        
        if (state && state.awaiting_email) {
            const email = ctx.message.text.trim();
            if (!email.includes('@') || !email.includes('.')) {
                return ctx.reply('❌ Неверный формат Email. Пожалуйста, введите корректный адрес:');
            }
            
            state.email = email;
            state.awaiting_email = false;
            
            return ctx.reply(`✅ Email ${email} успешно сохранен.`, 
                Markup.inlineKeyboard([
                    [Markup.button.callback('Оплатить 💳', 'show_requisites')],
                    [Markup.button.callback('⬅️ Назад', 'tariffs')]
                ])
            );
        }
        return next();
    });

    // Вывод реквизитов и СБП
    bot.action('show_requisites', async (ctx) => {
        await ctx.answerCbQuery();
        const state = userState[ctx.from.id];
        if (!state) return ctx.reply('Ошибка сессии. Сгенерируйте тариф заново.');
        
        const sbpLink = "https://nspk.ru";

        await ctx.reply(
            `💳 <b>Реквизиты для оплаты перевода РФ:</b>\n\n` +
            `📌 Номер карты: <code>2202 2088 1611 8466</code>\n` +
            `🏦 Банк получателя: <b>Сбербанк</b>\n\n` +
            `📱 Или оплатите мгновенно через <b>QR-код СБП</b>, нажав на кнопку ниже.`,
            {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('Открыть QR-код СБП (Оплата) 📲', sbpLink)],
                    [Markup.button.callback('Я оплатил, проверить платеж ✅', 'check_payment')]
                ])
            }
        );
    });

    // Имитация проверки
    bot.action('check_payment', async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.reply('⏳ <b>Запущена проверка транзакции...</b>\n\nСистема сверяет входящие переводы Сбербанк и СБП. Это займет около 15 секунд. Пожалуйста, ожидайте.', { parse_mode: 'HTML' });
        
        setTimeout(async () => {
            const { login, password } = getLoginData(ctx.from.id);
            await ctx.reply(
                `✅ <b>Платеж успешно подтвержден!</b>\n\n` +
                `Спасибо за оплату. Срок действия вашей подписки продлен.\n\n` +
                `👤 Ваш постоянный логин: <code>${login}</code>\n` +
                `🔑 Ваш постоянный пароль: <code>${password}</code>`,
                { parse_mode: 'HTML' }
            );
        }, 15000); 
    });

    bot.action('main_menu', async (ctx) => {
        await ctx.answerCbQuery();
        ctx.reply('Вы вернулись в главное меню:', 
            Markup.inlineKeyboard([
                [Markup.button.callback('Получить данные для входа 🔑', 'connect')],
                [Markup.button.callback('💳 Продлить подписку', 'tariffs')]
            ])
        );
    });

    return bot;
}

module.exports = { initBot };
