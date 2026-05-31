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
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
    <div class="wrapper">
        <div class="header-panel">
            <div class="brand">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5v14M22 9v6M7 7v10M2 10v4"/></svg>
                Subscription
            </div>
            <div class="top-actions">
                <button class="btn-icon" id="copy-raw">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
            </div>
        </div>

        <div class="main-card" style="margin-bottom: 16px;">
            <div class="user-profile">
                <div class="status-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="user-details">
                    <h3>${userCode}</h3>
                    <span>Истекает через 3 дня</span>
                </div>
            </div>
            <div class="info-grid">
                <div class="info-item" style="background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%); border: 1px solid rgba(56, 189, 248, 0.15);">
                    <div class="info-label">Имя пользователя</div>
                    <div class="info-value" style="color: #38bdf8;">${userCode}</div>
                </div>
                <div class="info-item" style="background: linear-gradient(180deg, rgba(16, 185, 129, 0.04) 0%, rgba(16, 185, 129, 0) 100%); border: 1px solid rgba(16, 185, 129, 0.2);">
                    <div class="info-label">Статус</div>
                    <div class="info-value active-text" style="color: #10b981; font-weight: 700;">Активна</div>
                </div>
                <div class="info-item" style="background: linear-gradient(180deg, rgba(239, 68, 68, 0.04) 0%, rgba(239, 68, 68, 0) 100%); border: 1px solid rgba(239, 68, 68, 0.15);">
                    <div class="info-label">Истекает</div>
                    <div class="info-value" style="color: #ffffff;">04 июня, 2026</div>
                </div>
                <div class="info-item" style="background: linear-gradient(180deg, rgba(245, 158, 11, 0.04) 0%, rgba(245, 158, 11, 0) 100%); border: 1px solid rgba(245, 158, 11, 0.15);">
                    <div class="info-label">Трафик</div>
                    <div class="info-value" style="color: #ffffff;">0 / ∞</div>
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
            <div class="tabs-container"><div class="tab-item">Happ</div></div>
            <div class="guide-list">
                <div class="guide-card">
                    <div class="guide-icon-box"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
                    <div class="guide-content">
                        <div class="guide-h4">Установка приложения</div>
                        <p>Выберите подходящую версию для вашего устройства, нажмите на кнопку ниже и установите приложение.</p>
                        <a href="https://google.com" id="download-app-btn" target="_blank" class="btn-action"><span id="os-button-text">Google Play</span></a>
                    </div>
                </div>
                <div class="guide-card">
                    <div class="guide-icon-box"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5v14M22 9v6M7 7v10M2 10v4"/></svg></div>
                    <div class="guide-content">
                        <div class="guide-h4">Добавление подписки</div>
                        <p>Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.</p>
                        <a href="happ://sub/add/${configUrl.replace('https://', '')}" id="happ-link" class="btn-submit">Добавить подписку</a>
                    </div>
                </div>
                <div class="guide-card">
                    <div class="guide-icon-box"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 14.14 14.14"/></svg></div>
                    <div class="guide-content">
                        <div class="guide-h4">Подключение и использование</div>
                        <p>В главном разделе нажмите большую кнопку включения в центре для подключения к VPN.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        const osSelect = document.getElementById('os-dropdown');
        const osBtnText = document.getElementById('os-button-text');
        const downloadAppBtn = document.getElementById('download-app-btn');
        const happLink = document.getElementById('happ-link');
        
        const baseConfigUrl = "${configUrl}";
        const cleanUrl = baseConfigUrl.replace('https://', '');
        
        const storeLinks = { 
            android: "https://google.com", 
            ios: "https://apple.com" 
        };
        const storeNames = { android: "Google Play", ios: "App Store", windows: "Windows (GitHub)", linux: "Linux (GitHub)", macos: "macOS (GitHub)" };
        
        if (osSelect && downloadAppBtn && osBtnText && happLink) {
            osSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                osBtnText.textContent = storeNames[val] || "Скачать";
                downloadAppBtn.href = storeLinks[val] || "https://github.com";
                
                if (val === 'ios') { 
                    happLink.setAttribute('href', "sing-box://import-remote?url=" + encodeURIComponent(baseConfigUrl));
                } else { 
                    happLink.setAttribute('href', "happ://sub/add/" + cleanUrl);
                }
            });
        }
        
        document.getElementById('copy-raw').addEventListener('click', () => { 
            navigator.clipboard.writeText(baseConfigUrl).then(() => { alert('Ссылка скопирована!'); }); 
        });
        window.addEventListener('DOMContentLoaded', () => { 
            const deleteToolbar = () => { 
                const toolbars = document.querySelectorAll('[id*="vercel-preview-feedback"], [class*="vercel"], vercel-live-feedback'); 
                toolbars.forEach(el => el.remove()); 
            }; 
            deleteToolbar(); 
            setTimeout(deleteToolbar, 1000); 
        });
    </script>
    </body>
    </html>
    `;
};
