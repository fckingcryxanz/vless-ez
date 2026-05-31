module.exports = function(configUrl) {
    return `
    <div class="guide-list">
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

        <div class="guide-card">
            <div class="guide-icon-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 14.14 14.14"/></svg>
            </div>
            <div class="guide-content">
                <div class="guide-h4">Подключение и использование</div>
                <p>В главном разделе нажмите большую кнопку включения в центре для подключения к VPN. Не забудьте выбрать сервер в списке серверов. При необходимости выберите другой сервер из списка серверов.</p>
            </div>
        </div>
    </div>
    `;
};
