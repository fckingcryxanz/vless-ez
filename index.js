const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const app = express();

// Активируем чтение POST-данных из форм авторизации сайта
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. НАСТРОЙКА TELEGRAM-БОТА
const bot = new Telegraf(process.env.BOT_TOKEN || 'ЗАГЛУШКА_ТОКЕНА');

bot.start((ctx) => {
    ctx.reply('Привет! 👋\n\n🛡️ Oneok — включил и забыл.\n\n🚀 Мгновенная активация\n✅ Гибкие тарифы\n▶️ YouTube без рекламы', 
        Markup.inlineKeyboard([
            [Markup.button.callback('Получить данные для входа 🔑', 'connect')],
            [Markup.button.callback('💳 Продлить подписку', 'renew')],
            [Markup.button.callback('📱 Инструкция', 'help'), Markup.button.callback('🎁 Бонусы', 'bonus')],
            [Markup.button.url('👉 Наш канал 👈', 'https://t.me')],
            [Markup.button.callback('ℹ️ О нас', 'about'), Markup.button.callback('💬 Поддержка', 'support')]
        ])
    );
});

bot.action('connect', async (ctx) => {
    const tgId = ctx.from.id; // Уникальный неизменяемый ID человека в Telegram
    
    // Формируем постоянные данные по твоей схеме
    const userLogin = `${tgId}_AsyncDNS`;
    const userPassword = `AsyncDNS$${tgId}`;
    
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    
    await ctx.answerCbQuery();
    // Использование знака \` делает текст кликабельным (копируется при нажатии)
    await ctx.reply(
        `✨ Ваши постоянные данные для входа готовы!\n\n` +
        `🌐 Наш сайт: ${domain}\n\n` +
        `👤 Логин (нажми для копирования):\n\`${userLogin}\`\n\n` +
        `🔑 Пароль (нажми для копирования):\n\`${userPassword}\`\n\n` +
        `⚠️ Вставьте эти данные в форму LOGIN на главной странице сайта.`
    );
});

app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});


// 2. РАЗДАЧА СТИЛЕЙ ИЗ КОРНЯ
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});


// 3. СИСТЕМА АВТОРИЗАЦИИ НА САЙТЕ (ЖЕЛЕЗОБЕТОННЫЙ ЛОГИН)
const templateBuilder = require('./templateModule');

app.get('/', (req, res) => {
    res.send(templateBuilder.renderLoginPage(''));
});

app.post('/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    
    // Алгоритм мгновенной проверки без базы данных:
    // Вытаскиваем чистый Telegram ID из логина (всё, что до знака подчеркивания)
    const tgIdFromLogin = username.split('_')[0];
    
    // Сверяем: 
    // 1. Логин должен заканчиваться на _AsyncDNS
    // 2. Пароль должен быть равен AsyncDNS$ + этот же Telegram ID
    if (username === `${tgIdFromLogin}_AsyncDNS` && password === `AsyncDNS$${tgIdFromLogin}`) {
        // Успешный вход — пускаем в кабинет!
        return res.redirect(`/user/${username}`);
    }
    
    res.send(templateBuilder.renderLoginPage('Неверный логин или пароль. Скопируйте данные из бота.'));
});

app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    const configUrl = `${domain}/configs.txt?id=${userCode}`;

    res.send(templateBuilder.renderCabinet(userCode, configUrl));
});

app.get('/configs.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send("vless://рабочий_прокси_ключ_успешно_запущен_в_happ");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер успешно работает'));

module.exports = app;
