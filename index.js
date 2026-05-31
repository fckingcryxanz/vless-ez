const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const crypto = require('crypto');
const path = require('path');
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


// 2. РАЗДАЧА СТАТИЧЕСКИХ ФАЙЛОВ ИЗ КОРНЯ
// Этот блок заставляет Vercel правильно отдавать твой файл style.css
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});


// 3. НАСТРОЙКА ЛИЧНОГО КАБИНЕТА ПОЛЬЗОВАТЕЛЯ
app.get('/user/:code', (req, res) => {
    const userCode = req.params.code;
    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://vercel.app`;
    
    res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Management</title>
        <!-- Стили подключаются из твоего внешнего файла style.css -->
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>

    <div class="wrapper">
        
        <div class="header-panel">
            <div class="brand">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5v14M22 9v6M7 7v10M2 10v4"/></svg>
                Subscription
            </div>
            <div class="top-actions">
                <button class="btn-icon" id="copy-raw">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
                <button class="btn-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                </button>
            </div>
        </div>

        <div class="main-card">
            <div class="user-profile">
                <div class="status-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="user-details">
                    <h3>${userCode}</h3>
                    <span>Истекает через 3 дня</span>
                </div>
            </div>

            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Имя пользователя</div>
                    <div class="info-value" style="color: #38bdf8;">User_${userCode.slice(0, 6)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Статус</div>
                    <div class="info-value active-text">Активна</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Истекает</div>
                    <div class="info-value" style="color: var(--accent-red);">04 июня, 2026</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Трафик</div>
                    <div class="info-value">0 / ∞</div>
                </div>
            </div>
        </div>

        <div class="main-card">
            <div class="card-title-bar">
                <div class="section-head">Установка</div>
                <select class="os-select" id="os-dropdown">
                    <option value="android">Android</option>
                    <option value="ios">iOS</option>
                    <option value="windows">Windows</option>
                    <option value="linux">Linux</option>
                    <option value="macos">macOS</option>
                </select>
            </div>
            
            <div class="tabs-container">
                <div class="tab-item">Happ</div>
            </div>

            <div class="guide-list">
                <div class="guide-card">
                    <div class="guide-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </div>
                    <div class="guide-content">
                        <div class="guide-h4">Установка приложения</div>
                        <p>Выберите подходящую версию для вашего устройства, нажмите на кнопку ниже и установите приложение.</p>
                        <a href="https://github.com" target="_blank" class="btn-action">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            <span id="os-button-text">Android</span>
                        </a>
                    </div>
                </div>

                <div class="guide-card">
                    <div class="guide-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5v14M22 9v6M7 7v10M2 10v4"/></svg>
                    </div>
                    <div class="guide-content">
                        <div class="guide-h4">Добавление подписки</div>
                        <p>Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.</p>
                        <a href="happ://sub/add/${domain}/configs.txt?id=${userCode}" id="happ-link" class="btn-submit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="12" y2="12"></line></svg>
                            Добавить подписку
                        </a>
                    </div>
                </div>

                <div class="guide-card">
                    <div class="guide-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 14.14 14.14"/></svg>
                    </div>
                    <div class="guide-content">
                        <div class="guide-h4">Подключение и использование</div>
                        <p>В главном разделе нажмите большую кнопку включения в центре для подключения к VPN. Не забудьте выбрать сервер в списке серверов. При необходимости выберите другой сервер из списка серверов.</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script>
        const osSelect = document.getElementById('os-dropdown');
        const osBtnText = document.getElementById('os-button-text');
        const happLink = document.getElementById('happ-link');
        const configUrl = "${domain}/configs.txt?id=${userCode}";

        if (osSelect && osBtnText) {
            osSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                osBtnText.textContent = val.charAt(0).toUpperCase() + val.slice(1);
                
                if (val === 'ios') {
                    happLink.href = "https://notjakob.com" + configUrl;
                } else {
                    happLink.href = "happ://sub/add/" + configUrl;
                }
            });
        }

        document.getElementById('copy-raw').addEventListener('click', () => {
            navigator.clipboard.writeText(configUrl).then(() => {
                alert('Ссылка на подписку скопирована!');
            });
        });
    </script>
    </body>
    </html>
    `);
});

app.get('/configs.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'configs.txt'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Бэкенд запущен`));

module.exports = app;
