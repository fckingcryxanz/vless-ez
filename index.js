const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const templateBuilder = require('./templateModule');
const { initBot } = require('./botModule');

const bot = initBot(process.env.BOT_TOKEN || 'ЗАГЛУШКА_ТОКЕНА');

app.post('/api/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/', (req, res) => {
    res.send(templateBuilder.renderLoginPage(''));
});

app.post('/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    const tgIdFromLogin = username.split('_')[0];
    
    if (username === `${tgIdFromLogin}_AsyncDNS` && password === `AsyncDNS$${tgIdFromLogin}`) {
        return res.redirect(`/user/${username}`);
    }
    res.send(templateBuilder.renderLoginPage('Неверный логин или пароль. Скопируйте данные из бота.'));
});

// Страница личного кабинета пользователя (Исправлено для iPhone)
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    const domain = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'vless-ez.vercel.app/';
    
    // Вместо ссылки на сайт мы зашиваем сюда чистую Base64 VPN-подписку со странами
    const vpnConfig = 
        'vless://8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c@194.135.24.81:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=google.com&fp=chrome&pbk=q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l&sid=a1b2c3d4&type=tcp#🇩🇪 Germany - Frankfurt 01\n' +
        'vless://8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c@195.122.31.42:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=google.com&fp=chrome&pbk=q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l&sid=a1b2c3d4&type=tcp#🇳🇱 Netherlands - Amsterdam 02';

    // Кодируем в Base64, чтобы Happ на iPhone принял её за 1 секунду
    const base64Config = Buffer.from(vpnConfig).toString('base64');

    // Передаем в шаблон Base64 строку вместо ссылки на сайт
    res.send(templateBuilder.renderCabinet(userCode, base64Config));
});

    // Если зашли через обычный браузер — показываем красивый личный кабинет
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vless-ez.vercel.app`;
    // Кнопка на сайте теперь ведет на этот же самый уникальный адрес!
    const configUrl = `${domain}/user/${userCode}`;
    
    res.send(templateBuilder.renderCabinet(userCode, configUrl));
});

// Резервный старый конфиг на всякий случай
app.get('/configs.txt', (req, res) => {
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер успешно запущен'));
module.exports = app;
