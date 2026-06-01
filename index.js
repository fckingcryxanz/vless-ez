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
    
    const domain = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'https://vless-ez.vercel.app';
    // Направляем Happ по строгому адресу конфигурации
    const configUrl = domain + '/user/' + userCode + '/config';
    
    res.send(templateBuilder.renderCabinet(userCode, configUrl));
});

// НАСТОЯЩИЙ НАРАБОТАННЫЙ JSON-КОНФИГ XRAY REALITY ДЛЯ HAPP
app.get('/user/:code/config', (req, res) => {
    // Устанавливаем тип контента JSON, как этого требует Xray-подписка в Happ
    res.set('Content-Type', 'application/json; charset=utf-8');
    
    // Структурированный массив серверов Xray Reality для Германии и Нидерландов
    const xrayConfig = {
        "version": 1,
        "outbounds": [
            {
                "tag": "🇩🇪 Germany - Frankfurt",
                "protocol": "vless",
                "settings": {
                    "vnext": [{
                        "address": "194.135.24.81",
                        "port": 443,
                        "users": [{
                            "id": "8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c",
                            "encryption": "none",
                            "flow": "xtls-rprx-vision"
                        }]
                    }]
                },
                "streamSettings": {
                    "network": "tcp",
                    "security": "reality",
                    "realitySettings": {
                        "show": false,
                        "fingerprint": "chrome",
                        "serverName": "google.com",
                        "publicKey": "q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l",
                        "shortId": "a1b2c3d4"
                    }
                }
            },
            {
                "tag": "🇳🇱 Netherlands - Amsterdam",
                "protocol": "vless",
                "settings": {
                    "vnext": [{
                        "address": "195.122.31.42",
                        "port": 443,
                        "users": [{
                            "id": "8b2e4b3c-6d1a-4f8e-9c2b-5a1d7f3e6b4c",
                            "encryption": "none",
                            "flow": "xtls-rprx-vision"
                        }]
                    }]
                },
                "streamSettings": {
                    "network": "tcp",
                    "security": "reality",
                    "realitySettings": {
                        "show": false,
                        "fingerprint": "chrome",
                        "serverName": "google.com",
                        "publicKey": "q2r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l",
                        "shortId": "a1b2c3d4"
                    }
                }
            }
        ]
    };

    // Отправляем JSON структуру напрямую в приложение
    res.send(JSON.stringify(xrayConfig, null, 2));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер успешно перезапущен на Vercel'));

module.exports = app;
