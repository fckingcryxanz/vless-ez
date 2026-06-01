const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const app = express();

// Обязательные плагины Express для чтения POST данных из форм входа
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Импортируем наш обновленный диспетчер шаблонов
const templateBuilder = require('./templateModule');
const { initBot } = require('./botModule');

// Инициализируем бота
const bot = initBot(process.env.BOT_TOKEN || 'ЗАГЛУШКА_ТОКЕНА');

// Эндпоинт для работы Telegram Webhook
app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});

// Отдача файла стилей
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// Главная страница — форма LOGIN
app.get('/', (req, res) => {
    res.send(templateBuilder.renderLoginPage(''));
});

// Проверка авторизации
app.post('/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    
    if (username.endsWith('_AsyncDNS') && password.startsWith('AsyncDNS$')) {
        const idFromLogin = username.replace('_AsyncDNS', '');
        const idFromPassword = password.replace('AsyncDNS$', '');
        
        if (idFromLogin === idFromPassword && idFromLogin.length > 0) {
            return res.redirect('/user/' + username);
        }
    }
    res.send(templateBuilder.renderLoginPage('Неверный логин или пароль. Скопируйте данные из бота.'));
});

// Страница личного кабинета подписок
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    
    if (!userCode.endsWith('_AsyncDNS')) {
        return res.redirect('/');
    }
    
    const domain = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'https://vercel.app';
    const configUrl = domain + '/user/' + userCode + '/config';
    
    res.send(templateBuilder.renderCabinet(userCode, configUrl));
});

// ЖЕЛЕЗОБЕТОННЫЙ ЭНДПОИНТ КОНФИГУРАЦИИ: Выдает твой реальный VLESS ключ в Base64
app.get('/user/:code/config', (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    
    // Твой личный, 100% рабочий и быстрый VLESS-ключ Reality
    const myRealVlessKey = 'vless://6897c181-24b1-4880-8660-e6c5c7ee13c7@92.60.78.221:443?security=reality&encryption=none&pbk=pkIWxbuPAasjatPaHnAaTnCxVj1RkDFsJEWpLUTOcWY&headerType=none&fp=chrome&type=tcp&flow=xtls-rprx-vision&sni=www.tradingview.com&sid=9917d2350096#4Nika-9676';

    // Кодируем ключ в формат Base64, чтобы приложение Happ успешно приняло подписку без единой ошибки
    const base64Config = Buffer.from(myRealVlessKey).toString('base64');
    
    res.send(base64Config);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер успешно запущен с твоим реальным VLESS ключом'));

module.exports = app;
