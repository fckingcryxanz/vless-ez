const currentUrl = window.location.href;
const configRawUrl = currentUrl.endsWith('/') ? currentUrl + 'configs.txt' : currentUrl + '/configs.txt';

// База данных инструкций под разные ОС
const osInstructions = {
    ios: "Для iOS: Нажмите кнопку ниже, чтобы сгенерировать и установить индивидуальный профиль конфигурации в настройки вашего iPhone.",
    android: "Для Android: Нажмите кнопку ниже — мобильное приложение Happ автоматически откроется и загрузит вашу личную DNS-подписку.",
    windows: "Для Windows: Скачайте клиент по кнопке ниже, импортируйте подписку и включите системный TUN-режим.",
    linux: "Для Linux: Скопируйте URL вашей подписки и импортируйте её в консольный или GUI клиент через настройки.",
    macos: "Для macOS: Используйте совместимый Xray-клиент, добавив полученный URL адрес в список подписок."
};

const osSelect = document.getElementById('os-dropdown');
const instructionText = document.getElementById('instruction-text');
const happBtn = document.getElementById('happ-link');

// Функция смены инструкций
if (osSelect && instructionText) {
    osSelect.addEventListener('change', (e) => {
        const selectedOS = e.target.value;
        instructionText.textContent = osInstructions[selectedOS];
        
        // Меняем ссылки в зависимости от ОС, если нужно
        if (selectedOS === 'ios') {
            happBtn.href = `https://notjakob.com{configRawUrl}`;
        } else {
            happBtn.href = `happ://sub/add/${configRawUrl}`;
        }
    });
}

// Кнопка копирования
const copyBtn = document.getElementById('copy-raw');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(configRawUrl).then(() => {
            alert('Ссылка успешно скопирована!');
        });
    });
}
