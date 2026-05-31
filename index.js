const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// 1. НАСТРОЙКА TELEGRAM-БОТА
// Сюда мы чуть позже добавим токен из @BotFather через переменные среды Vercel
const bot = new Telegraf(process.env.BOT_TOKEN || 'ЗАГЛУШКА');

// Функция генерации 20 случайных символов
function generateRandomCode() {
    return crypto.randomBytes(10).toString('hex').toUpperCase();
}

// Команда /start в боте (меню как на твоем фото)
bot.start((ctx) => {
    ctx.reply('Привет! 👋\n\n🛡️ Async — включил и забыл.\n\n🚀 Мгновенная активация\n✅ Гибкие тарифы\n▶️ YouTube без рекламы', 
        Markup.inlineKeyboard([
            [Markup.button.callback('Подключиться 🚀', 'connect')],
            [Markup.button.callback('💳 Продлить подписку', 'renew')],
            [Markup.button.callback('📱 Инструкция', 'help'), Markup.button.callback('🎁 Бонусы', 'bonus')],
            [Markup.button.url('👉 Наш канал 👈', 'https://t.me')],
            [Markup.button.callback('ℹ️ О нас', 'about'), Markup.button.callback('💬 Поддержка', 'support')]
        ])
    );
});

// Обработка нажатия кнопки "Подключиться"
bot.action('connect', async (ctx) => {
    const randomCode = generateRandomCode();
    // Vercel автоматически выдаст нам домен, здесь мы подставим его динамически
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const userLink = `${domain}/user/${randomCode}`;
    
    await ctx.answerCbQuery();
    await ctx.reply(`✨ Ваша персональная подписка сгенерирована!\n\n🔗 Ссылка на ваш личный кабинет:\n${userLink}\n\nНикому не передавайте этот адрес.`);
});

// Эндпоинт, чтобы Telegram отправлял уведомления боту через Webhook
app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});


// 2. НАСТРОЙКА ДИНАМИЧЕСКОГО САЙТА
// Раздача статических стилей (style.css), если он есть
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// Перехват уникальной ссылки пользователя
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    
    // Читаем наш переименованный файл шаблона
    fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (err, htmlContent) => {
        if (err) {
            return res.status(500).send('Ошибка сервера, файл шаблона не найден.');
        }

        // Подменяем статичные текстовые заглушки на реальный сгенерированный 20-значный код!
        let customizedHtml = htmlContent
            .replace(/BrawlStars_User/g, userCode)
            .replace(/Brawl_DNS_Private/g, `User_${userCode.slice(0,6)}`)
            .replace(/happ:\/\/sub\/add\/https:\/\/fckingryxanz\.github\.io\/vless-ez\/configs\.txt/g, `happ://sub/add/${domain}/configs.txt?id=${userCode}`);

        res.send(customizedHtml);
    });
});

// Выдача самого файла конфигурации для Happ
app.get('/configs.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'configs.txt'));
});

// Запуск для локального тестирования
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

module.exports = app;
