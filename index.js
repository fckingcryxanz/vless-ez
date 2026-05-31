const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// 1. НАСТРОЙКА TELEGRAM-БОТА
const bot = new Telegraf(process.env.BOT_TOKEN || 'ЗАГЛУШКА_ТОКЕНА');

function generateRandomCode() {
    return crypto.randomBytes(10).toString('hex').toUpperCase();
}

bot.start((ctx) => {
    ctx.reply('Привет! 👋\n\n🛡️ Oneok — включил и забыл.\n\n🚀 Мгновенная активация\n✅ Гибкие тарифы\n▶️ YouTube без рекламы', 
        Markup.inlineKeyboard([
            [Markup.button.callback('Подключиться 🚀', 'connect')],
            [Markup.button.callback('💳 Продлить подписку', 'renew')],
            [Markup.button.callback('📱 Инструкция', 'help'), Markup.button.callback('🎁 Бонусы', 'bonus')],
            [Markup.button.url('👉 Наш канал 👈', 'https://t.me')],
            [Markup.button.callback('ℹ️ О нас', 'about'), Markup.button.callback('💬 Поддержка', 'support')]
        ])
    );
});

bot.action('connect', async (ctx) => {
    const randomCode = generateRandomCode();
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    const userLink = `${domain}/user/${randomCode}`;
    
    await ctx.answerCbQuery();
    await ctx.reply(`✨ Ваша персональная подписка сгенерирована!\n\n🔗 Ссылка на ваш личный кабинет:\n${userLink}\n\nНикому не передавайте этот адрес.`);
});

app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});

// 2. ОТДАЧА СТИЛЕЙ (если они запрашиваются отдельно)
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// 3. БЕЗОПАСНАЯ ВЫДАЧА ТВОЕГО НОВОГО ШАБЛОНА MARZBAN
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    
    // Читаем только template.html, никаких других подфайлов больше не требуем!
    fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (err, htmlContent) => {
        if (err) {
            return res.status(500).send('Ошибка: Файл template.html не найден в корне репозитория GitHub.');
        }

        // Подставляем твой 20-значный код и домен в сурс-код Marzban
        let compiledHtml = htmlContent
            .replace(/981373772__1799354/g, userCode) // Ищем чужой ID из сурса и меняем на динамический код
            .replace(/981373772_1799354/g, userCode)  
            .replace(/https:\/\/sub\.allcrash\.ru\/[A-Za-z0-9_]+/g, `happ://sub/add/${domain}/configs.txt?id=${userCode}`); // Подменяем ссылку добавления

        res.send(compiledHtml);
    });
});

app.get('/configs.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'configs.txt'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Бэкенд запущен`));

module.exports = app;
