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

// Выдача файла конфигурации со списком стран для приложения Happ (Исправлено)
app.get('/configs.txt', (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    
    // Твой список серверов со странами
    const testServers = 
        `vless://8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c@194.135.24.81:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=google.com&fp=chrome&pbk=q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l&sid=a1b2c3d4&type=tcp#🇩🇪 Germany - Frankfurt 01\n` +
        `vless://8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c@195.122.31.42:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=google.com&fp=chrome&pbk=q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l&sid=a1b2c3d4&type=tcp#🇫🇮 Finland - Helsinki 02\n` +
        `vless://8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c@185.200.11.95:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=google.com&fp=chrome&pbk=q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l&sid=a1b2c3d4&type=tcp#🇳🇱 Netherlands - Amsterdam 03`;

    // Переводим обычный текст в кодировку Base64, которую требует Happ
    const base64Servers = Buffer.from(testServers).toString('base64');

    res.send(base64Servers);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Бэкенд-серверExpress успешно запущен'));

module.exports = app;
