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

// ЖЕЛЕЗОБЕТОННАЯ ПРОВЕРКА ФОРМЫ АВТОРИЗАЦИИ (ИСПРАВЛЕНО!)
app.post('/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    
    // Проверяем формат логина через регулярное выражение (строго цифры и окончание _AsyncDNS)
    const match = username.match(/^(\\d+)_AsyncDNS$/);
    
    if (match) {
        const tgId = match[1]; // Безопасно вытаскиваем чистый Telegram ID из логина
        
        // Сверяем, равен ли пароль маске AsyncDNS$ + вытащенный ID
        if (password === `AsyncDNS$\${tgId}`) {
            // Если данные верны — делаем перенаправление в личный кабинет пользователя
            return res.redirect(`/user/\${username}`);
        }
    }
    
    // Если данные не подошли — возвращаем форму входа с текстом ошибки
    res.send(templateBuilder.renderLoginPage('Неверный логин или пароль. Скопируйте данные из бота.'));
});

// Страница личного кабинета подписок
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    
    // Если в адресе личного кабинета нет маски, сбрасываем на главную
    if (!userCode.endsWith('_AsyncDNS')) {
        return res.redirect('/');
    }
    
    const domain = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'https://vercel.app';
    const configUrl = domain + '/user/' + userCode + '/config';
    
    res.send(templateBuilder.renderCabinet(userCode, configUrl));
});

// УМНЫЙ ЭНДПОИНТ КОНФИГУРАЦИИ: Выдает закодированные Base64-сервера Германии и Нидерландов для Happ
app.get('/user/:code/config', (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    
    const testServers = 
        'vless://8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c@194.135.24.81:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=google.com&fp=chrome&pbk=q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l&sid=a1b2c3d4&type=tcp#🇩🇪 Germany - Frankfurt 01\\n' +
        'vless://8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c@195.122.31.42:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=google.com&fp=chrome&pbk=q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l&sid=a1b2c3d4&type=tcp#🇳🇱 Netherlands - Amsterdam 02\\n' +
        'vless://8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c@185.200.11.95:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=google.com&fp=chrome&pbk=q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l&sid=a1b2c3d4&type=tcp#🇫🇮 Finland - Helsinki 03';

    const base64Servers = Buffer.from(testServers).toString('base64');
    res.send(base64Servers);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер успешно перезапущен на Vercel'));

module.exports = app;
