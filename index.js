const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const crypto = require('crypto');
const path = require('path');
const app = express();

// Обязательные плагины Express для чтения POST данных из форм входа
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. НАСТРОЙКА TELEGRAM-БОТА
const bot = new Telegraf(process.env.BOT_TOKEN || 'ЗАГЛУШКА_ТОКЕНА');

// Генератор уникального логина: буквы + цифры + строго ОДНО подчеркивание (25 символов)
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
    // Формируем пароль строго по твоему правилу: AsyncDNS$ + чистый логин пользователя
    const userPassword = `AsyncDNS$${userLogin}`; 
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    
    await ctx.answerCbQuery();
    await ctx.reply(`✨ Ваши уникальные данные для входа сгенерированы!\n\n🌐 Наш сайт: ${domain}\n\n👤 Логин: \`${userLogin}\`\n🔑 Пароль: \`${userPassword}\`\n\n⚠️ Скопируйте логин и новый пароль, после чего вставьте их на главной странице сайта для входа.`);
});

app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});


// 2. РАЗДАЧА СТИЛЕЙ ИЗ КОРНЯ
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});


// 3. СИСТЕМА АВТОРИЗАЦИИ НА САЙТЕ
const templateBuilder = require('./templateModule');

app.get('/', (req, res) => {
    res.send(templateBuilder.renderLoginPage(''));
});

// Железобетонная проверка совпадения логина и префикса пароля
app.post('/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    
    // Если пароль равен строке "AsyncDNS$" + введенный логин, то авторизация успешна!
    if (username && password === `AsyncDNS$${username}`) {
        return res.redirect(`/user/${username}`);
    }
    
    res.send(templateBuilder.renderLoginPage('Неверный логин или пароль. Проверьте данные из бота.'));
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
