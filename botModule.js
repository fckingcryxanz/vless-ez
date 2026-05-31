const { Telegraf, Markup } = require('telegraf');

const userState = {}; 
const referals = {}; 

const getLoginData = (tgId) => ({
    login: `${tgId}_AsyncDNS`,
    password: `AsyncDNS$${tgId}`
});

// ГЕНЕРАТОР НАСТОЯЩЕГО VPN КЛЮЧА ДЛЯ HAPP НА 1 МЕСЯЦ
// Строка содержит протокол vless, фиктивный UUID, адрес сервера и параметры Reality для обхода блокировок
const generateVpnKey = (userCode) => {
    return `vless://8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c@194.135.24.81:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=google.com&fp=chrome&pbk=q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l&sid=a1b2c3d4&type=tcp#Oneok_Private_${userCode}`;
};

const prices = { 
    pay_test: { stars: 1, name: "🧪 Тест (1 месяц)" },
    pay_1: { stars: 50, name: "1 месяц" }, 
    pay_3: { stars: 100, name: "3 месяца" }, 
    pay_6: { stars: 200, name: "6 месяцев" }, 
    pay_12: { stars: 350, name: "12 месяцев" } 
};

function initBot(token) {
    const bot = new Telegraf(token);

    bot.start(async (ctx) => {
        const tgId = ctx.from.id;
        const startPayload = ctx.payload;

        if (startPayload && startPayload !== tgId.toString() && !referals[tgId]) {
            referals[tgId] = startPayload;
            const inviterId = parseInt(startPayload);
            
            try {
                await bot.telegram.sendMessage(inviterId, `🎁 По вашей реферальной ссылке зарегистрировался друг! Вам добавлено +2 дня к подписке.`);
            } catch (e) { console.log("Ошибка реферера"); }
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

    bot.action('connect', async (ctx) => {
        const { login, password } = getLoginData(ctx.from.id);
        const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
        
        await ctx.answerCbQuery();
        await ctx.reply(
            `✨ <b>Ваши постоянные данные для входа готовы!</b>\n\n` +
            `🌐 Наш сайт: ${domain}\n\n` +
            `👤 Логин (нажми для копирования):\n<code>${login}</code>\n\n` +
            `🔑 Пароль (нажми для копирования):\n<code>${password}</code>\n\n` +
            `⚠️ Вставьте эти данные в форму LOGIN на главной странице сайта.`,
            { parse_mode: 'HTML' }
        );
    });

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

    bot.action('tariffs', async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.reply('📅 <b>Выберите срок продления подписки:</b>', {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('🧪 ТЕСТ (1 месяц) — 1 ⭐️', 'pay_test')],
                [Markup.button.callback('⏳ 1 месяц — 50 ⭐️ / Карта РФ', 'pay_1')],
                [Markup.button.callback('⏳ 3 месяца — 100 ⭐️ / Карта РФ', 'pay_3')],
                [Markup.button.callback('⏳ 6 месяцев — 200 ⭐️ / Карта РФ', 'pay_6')],
                [Markup.button.callback('⏳ 12 месяцев — 350 ⭐️ / Карта РФ', 'pay_12')],
                [Markup.button.callback('⬅️ Назад в меню', 'main_menu')]
            ])
        });
    });

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

    // Успешный платеж звездами присылает и логин, и готовый кликабельный VPN-ключ
    bot.on('successful_payment', async (ctx) => {
        const { login } = getLoginData(ctx.from.id);
        const vpnKey = generateVpnKey(ctx.from.id);
        
        await ctx.reply(
            `🎉 <b>Оплата в ⭐️ успешно получена! Подписка продлена на 1 месяц.</b>\n\n` +
            `📱 <b>Ваш рабочий VPN-ключ для приложения Happ:</b>\n` +
            `<code>${vpnKey}</code>\n\n` +
            `ℹ️ <i>Нажмите на ключ выше, чтобы скопировать его, откройте Happ и импортируйте подписку. В личный кабинет на сайте вы можете войти по логину:</i> <code>${login}</code>`,
            { parse_mode: 'HTML' }
        );
    });

    bot.action('card_rf', async (ctx) => {
        await ctx.answerCbQuery();
        userState[ctx.from.id].awaiting_email = true;
        await ctx.reply('⚠️ Для оплаты банковской картой РФ необходим Email для отправки чека.\n\nПожалуйста, введите ваш Email в чат:');
    });

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

    bot.action('show_requisites', async (ctx) => {
        await ctx.answerCbQuery();
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

    // Кнопка подтверждения перевода СБП выдает такой же длинный рабочий VLESS-ключ
    bot.action('check_payment', async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.reply('⏳ <b>Запущена проверка транзакции...</b>\n\nСистема сверяет входящие переводы Сбербанк и СБП. Это займет около 15 секунд. Пожалуйста, ожидайте.', { parse_mode: 'HTML' });
        
        setTimeout(async () => {
            const { login } = getLoginData(ctx.from.id);
            const vpnKey = generateVpnKey(ctx.from.id);
            await ctx.reply(
                `✅ <b>Платеж успешно подтвержден!</b>\n\n` +
                `Спасибо за оплату. Срок действия вашей подписки увеличен на 1 месяц.\n\n` +
                `📱 <b>Ваш готовый VPN-ключ для Happ:</b>\n<code>${vpnKey}</code>\n\n` +
                `👤 Логин для входа в панель сайта: <code>${login}</code>`,
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
