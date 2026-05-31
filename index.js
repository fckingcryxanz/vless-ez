const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const crypto = require('crypto');
const path = require('path');
const app = express();

// Импортируем HTML-шаблон личного кабинета и страницы логина
const templateBuilder = require('./templateModule');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. НАСТРОЙКА TELEGRAM-БОТА
const bot = new Telegraf(process.env.BOT_TOKEN || 'ЗАГЛУШКА_ТОКЕНА');

// Уникальный генератор: 25 символов (буквы + цифры + строго ОДНО подчеркивание)
function generateComplexLogin() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    // Генерируем 24 случайных символа
    for (let i = 0; i < 24; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Вставляем ровно одно подчеркивание в случайное место (не в самое начало и не в конец)
    const underscorePos = Math.floor(Math.random() * 22) + 1;
    return result.slice(0, underscorePos) + '_' + result.slice(underscorePos);
}

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
    const userLogin = generateComplexLogin(); // Генерирует код (например: X79F_K92LSM1056N2WQX9184)
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vless-ez.vercel.app`;
    
    await ctx.answerCbQuery();
    await ctx.reply(`✨ Ваши уникальные данные для входа сгенерированы!\n\n🌐 Наш сайт: ${domain}\n\n👤 Логин: \`${userLogin}\`\n🔑 Пароль: \`${userLogin}\`\n\n⚠️ Скопируйте логин/пароль и вставьте их на главной странице сайта для входа в личный кабинет. Никому не передавайте эти данные.`);
});

app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});


// 2. СИСТЕМА ЛОГИНА НА САЙТЕ (РОУТЫ)
// Раздача стилей
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// Главная страница — Страница авторизации (Вход)
app.get('/', (req, res) => {
    res.send(templateBuilder.renderLoginPage(''));
});

// Обработка формы авторизации
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Проверяем: логин должен быть длиной 25 символов и пароль должен быть строго равен логину
    if (username && username.length === 25 && username === password) {
        // Если всё верно — перенаправляем в личный кабинет пользователя
        res.redirect(`/user/${username}`);
    } else {
        // Если данные неверны — перезагружаем страницу входа с текстом ошибки
        res.send(templateBuilder.renderLoginPage('Неверный логин или пароль. Проверьте данные из бота.'));
    }
});

// Страница личного кабинета (Доступна только по 25-значному коду)
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    
    if (!userCode || userCode.length !== 25) {
        return res.redirect('/');
    }
    
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vless-ez.vercel.app`;
    const configUrl = `${domain}/configs.txt?id=${userCode}`;

    const htmlPage = templateBuilder.renderCabinet(userCode, configUrl);
    res.send(htmlPage);
});

app.get('/configs.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send("vless://тестовый_рабочий_ключ_для_brawl_stars_здесь");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер запущен'));

module.exports = app;
