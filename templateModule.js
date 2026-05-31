const { header, step1, step3 } = require('./componentsModule');
const renderUserInfo = require('./userModule');

// Компонент 1. Генерация личного кабинета (уже существующий)
function renderCabinet(userCode, configUrl) {
    return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription</title>
        <link rel="preconnect" href="https://googleapis.com">
        <link rel="preconnect" href="https://gstatic.com" crossorigin>
        <link href="https://googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Mono:wght@500;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
    <div class="wrapper">
        ${header}
        ${renderUserInfo(userCode)}
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
            <div class="tabs-container"><div class="tab-item">Happ</div></div>
            <div class="guide-list">
                ${step1}
                <div class="guide-card">
                    <div class="guide-icon-box">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5v14M22 9v6M7 7v10M2 10v4"/></svg>
                    </div>
                    <div class="guide-content">
                        <div class="guide-h4">Добавление подписки</div>
                        <p>Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.</p>
                        <a href="happ://sub/add/${configUrl}" id="happ-link" class="btn-submit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="12" y2="12"></line></svg>
                            Добавить подписку
                        </a>
                    </div>
                </div>
                ${step3}
            </div>
        </div>
    </div>
    <script>
        const osSelect = document.getElementById('os-dropdown');
        const osBtnText = document.getElementById('os-button-text');
        const downloadAppBtn = document.getElementById('download-app-btn');
        const happLink = document.getElementById('happ-link');
        const configUrl = "${configUrl}";
        const storeLinks = {
            android: "https://google.com",
            ios: "https://apple.com",
            windows: "https://github.com",
            linux: "https://github.com",
            macos: "https://github.com"
        };
        const storeNames = { android: "Google Play", ios: "App Store", windows: "Windows (GitHub)", linux: "Linux (GitHub)", macos: "macOS (GitHub)" };
        if (osSelect && osBtnText && downloadAppBtn) {
            osSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                osBtnText.textContent = storeNames[val];
                downloadAppBtn.href = storeLinks[val];
                if (val === 'ios') { happLink.href = "https://notjakob.com" + configUrl; } else { happLink.href = "happ://sub/add/" + configUrl; }
            });
        }
        document.getElementById('copy-raw').addEventListener('click', () => { navigator.clipboard.writeText(configUrl).then(() => { alert('Ссылка на подписку скопирована!'); }); });
        window.addEventListener('DOMContentLoaded', () => { const deleteToolbar = () => { const toolbars = document.querySelectorAll('[id*="vercel-preview-feedback"], [class*="vercel"], vercel-live-feedback'); toolbars.forEach(el => el.remove()); }; deleteToolbar(); setTimeout(deleteToolbar, 1000); });
    </script>
    </body>
    </html>
    `;
}

// Компонент 2. Новая стильная форма авторизации (Вход)
function renderLoginPage(errorMessage) {
    const errorBlock = errorMessage ? `<div style="color: #ef4444; font-size: 13px; margin-bottom: 16px; text-align: center; font-weight: 500;">${errorMessage}</div>` : '';
    return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Авторизация</title>
        <link rel="preconnect" href="https://googleapis.com">
        <link rel="preconnect" href="https://gstatic.com" crossorigin>
        <link href="https://googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/style.css">
        <style>
            .login-card {
                width: 100%;
                max-width: 400px;
                margin: 100px auto 0 auto;
            }
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 20px;
            }
            .form-group label {
                font-size: 12px;
                color: var(--text-secondary);
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .form-input {
                background-color: rgba(255, 255, 255, 0.03);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                padding: 14px;
                color: #fff;
                font-size: 14px;
                outline: none;
                font-family: 'Fira Mono', monospace;
                transition: border-color 0.2s;
            }
            .form-input:focus {
                border-color: var(--accent-blue);
            }
            .login-title {
                font-size: 22px;
                font-weight: 700;
                text-align: center;
                margin-bottom: 24px;
                color: #38bdf8;
            }
        </style>
    </head>
    <body>
    <div class="wrapper">
        <div class="main-card login-card">
            <div class="login-title">Вход в панель</div>
            ${errorBlock}
            <form action="/login" method="POST">
                <div class="form-group">
                    <label>Логин</label>
                    <input type="text" name="username" class="form-input" placeholder="Введите логин из бота" required maxlength="25">
                </div>
                <div class="form-group">
                    <label>Пароль</label>
                    <input type="password" name="password" class="form-input" placeholder="Введите пароль" required maxlength="25">
                </div>
                <button type="submit" class="btn-submit" style="margin-top: 10px;">Войти в аккаунт</button>
            </form>
        </div>
    </div>
    <script>
        window.addEventListener('DOMContentLoaded', () => { const deleteToolbar = () => { const toolbars = document.querySelectorAll('[id*="vercel-preview-feedback"], [class*="vercel"], vercel-live-feedback'); toolbars.forEach(el => el.remove()); }; deleteToolbar(); setTimeout(deleteToolbar, 1000); });
    </script>
    </body>
    </html>
    `;
}

module.exports = { renderCabinet, renderLoginPage };
