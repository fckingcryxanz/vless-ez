const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const crypto = require('crypto');
const path = require('path');
const app = express();

// Эти две строчки намертво чинят ошибку 500 при отправке формы авторизации
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Импортируем наш HTML-шаблон как модуль
const templateBuilder = require('./templateModule');

// 1. НАСТРОЙКА TELEGRAM-БОТА
const bot = new Telegraf(process.env.BOT_TOKEN || 'ЗАГЛУШКА_ТОКЕНА');

function generateComplexLogin() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 24; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
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
    const userLogin = generateComplexLogin();
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    
    await ctx.answerCbQuery();
    await ctx.reply(`✨ Ваши уникальные данные для входа сгенерированы!\n\n🌐 Наш сайт: ${domain}\n\n👤 Логин: \`${userLogin}\`\n🔑 Пароль: \`${userLogin}\`\n\n⚠️ Скопируйте логин/пароль и вставьте их на главной странице сайта для входа в личный кабинет.`);
});

app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});

// 2. СИСТЕМА РОУТОВ И СТИЛЕЙ
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// Главная страница — форма логина
app.get('/', (req, res) => {
    res.send(templateBuilder.renderLoginPage(''));
});

// Обработка клика по кнопке "Войти в аккаунт" (Исправлено)
app.post('/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    
    if (username && username.length === 25 && username === password) {
        res.redirect(`/user/${username}`);
    } else {
        res.send(templateBuilder.renderLoginPage('Неверный логин или пароль. Проверьте данные из бота.'));
    }
});

// Личный кабинет (Доступ строго по 25-значному коду)
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    if (!userCode || userCode.length !== 25) return res.redirect('/');
    
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    const configUrl = `${domain}/configs.txt?id=${userCode}`;

    res.send(templateBuilder.renderCabinet(userCode, configUrl));
});

app.get('/configs.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send("vless://рабочий_прокси_ключ_из_индекса");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер успешно запущен'));

module.exports = app;
