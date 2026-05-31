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

// 2. РАЗДАЧА СТИЛЕЙ
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// 3. СБОРКА ИЗ ПОДФАЙЛОВ НА BACKEND
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    
    try {
        // Читаем все файлы синхронно для мгновенной сборки страницы
        const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
        const step1 = fs.readFileSync(path.join(__dirname, 'step1.html'), 'utf8');
        const step2 = fs.readFileSync(path.join(__dirname, 'step2.html'), 'utf8');
        const step3 = fs.readFileSync(path.join(__dirname, 'step3.html'), 'utf8');

        // Собираем конструктор вместе и подставляем 20-значные коды
        let compiledHtml = template
            .replace(/\{\{USER_CODE\}\}/g, userCode)
            .replace(/\{\{DOMAIN\}\}/g, domain)
            .replace(/\{\{STEP_1\}\}/g, step1)
            .replace(/\{\{STEP_2\}\}/g, step2)
            .replace(/\{\{STEP_3\}\}/g, step3);

        res.send(compiledHtml);
    } catch (err) {
        res.status(500).send('Ошибка сборки страницы: Проверьте наличие файлов step1.html, step2.html, step3.html');
    }
});

app.get('/configs.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'configs.txt'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Бэкенд запущен`));

module.exports = app;
