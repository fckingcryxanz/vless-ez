// Импортируем подфайлы-компоненты
const { header, step1, step3 } = require('./componentsModule');
const renderUserInfo = require('./userModule');

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
        <!-- Ссылаемся на наш style.css в корне -->
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>

    <div class="wrapper">
        
        <!-- Вставляем шапку из подфайла -->
        ${header}

        <!-- Вставляем инфо-карточку из подфайла -->
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
            
            <div class="tabs-container">
                <div class="tab-item">Happ</div>
            </div>

            <div class="guide-list">
                <!-- Шаг 1 (из подфайла) -->
                ${step1}

                <!-- Шаг 2 (генерируется на месте с уникальной ссылкой) -->
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

                <!-- Шаг 3 (из подфайла) -->
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
