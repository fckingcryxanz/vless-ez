// Импортируем 3 разделенные части HTML-компонентов
const headerComponent = require('./headerModule');
const userComponentBuilder = require('./userModule');
const guideComponentBuilder = require('./guideModule');

module.exports = function(userCode, configUrl) {
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
        <!-- Ссылаемся на твойstyle.css в корне -->
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>

    <div class="wrapper">
        <!-- Часть 1. Шапка сайта -->
        ${headerComponent}

        <!-- Часть 2. Карточка пользователя с кодом -->
        ${userComponentBuilder(userCode)}

        <!-- Часть 3. Блок гайда по шагам -->
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

            <!-- Подключаем шаги инструкции -->
            ${guideComponentBuilder(configUrl)}
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

        const storeNames = {
            android: "Google Play",
            ios: "App Store",
            windows: "Windows (GitHub)",
            linux: "Linux (GitHub)",
            macos: "macOS (GitHub)"
        };

        if (osSelect && osBtnText && downloadAppBtn) {
            osSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                osBtnText.textContent = storeNames[val];
                downloadAppBtn.href = storeLinks[val];
                
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
    `;
};
