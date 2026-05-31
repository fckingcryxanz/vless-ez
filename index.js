const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Импортируем наши внешние подфайлы-модули
const templateBuilder = require('./templateModule');
const { initBot } = require('./botModule');

// Инициализируем бота, передавая токен из панели Vercel
const bot = initBot(process.env.BOT_TOKEN || 'ЗАГЛУШКА_ТОКЕНА');

// Эндпоинт для связи серверов Telegram и Vercel через Webhook
app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});

// Раздача твоего файла style.css из корня репозитория (Оставляем строго!)
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// Главная страница — форма авторизации (LOGIN)
app.get('/', (req, res) => {
    res.send(templateBuilder.renderLoginPage(''));
});

// Обработка отправки данных из формы логина
app.post('/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    
    const tgIdFromLogin = username.split('_')[0];
    
    if (username === `${tgIdFromLogin}_AsyncDNS` && password === `AsyncDNS$${tgIdFromLogin}`) {
        return res.redirect(`/user/${username}`);
    }
    res.send(templateBuilder.renderLoginPage('Неверный логин или пароль. Скопируйте данные из бота.'));
});

// Личный кабинет Marzban со шрифтом Inter
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    const configUrl = `${domain}/configs.txt?id=${userCode}`;

    res.send(templateBuilder.renderCabinet(userCode, configUrl));
});

// Текстовая раздача подписки для Happ
app.get('/configs.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send("vless://рабочий_прокси_ключ_успешно_запущен_в_happ");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Бэкенд-серверExpress успешно запущен'));

module.exports = app;
