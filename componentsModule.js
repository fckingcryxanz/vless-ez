// Компонент верхней панели бренда
const header = `
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
`;

// Компонент Шага 1 гайда
const step1 = `
<div class="guide-card">
    <div class="guide-icon-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    </div>
    <div class="guide-content">
        <div class="guide-h4">Установка приложения</div>
        <p>Выберите подходящую версию для вашего устройства, нажмите на кнопку ниже и установите приложение.</p>
        <a href="https://google.com" id="download-app-btn" target="_blank" class="btn-action">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span id="os-button-text">Google Play</span>
        </a>
    </div>
</div>
`;

// Компонент Шага 3 гайда
const step3 = `
<div class="guide-card">
    <div class="guide-icon-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 14.14 14.14"/></svg>
    </div>
    <div class="guide-content">
        <div class="guide-h4">Подключение и использование</div>
        <p>В главном разделе нажмите большую кнопку включения в центре для подключения к VPN. Не забудьте выбрать сервер в списке серверов. При необходимости выберите другой сервер из списка серверов.</p>
    </div>
</div>
