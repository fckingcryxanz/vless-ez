const currentUrl = window.location.href;
const configRawUrl = currentUrl.endsWith('/') ? currentUrl + 'configs.txt' : currentUrl + '/configs.txt';

// Ссылки на скачивание Happ для разных платформ
const downloadLinks = {
    android: "https://github.com", // Ссылка на гитхаб Happ
    ios: "https://apple.com", 
    windows: "https://github.com",
    linux: "https://github.com",
    macos: "https://github.com"
};

const osSelect = document.getElementById('os-dropdown');
const downloadButtonLink = document.getElementById('download-app-btn');
const happBtn = document.getElementById('happ-link');

if (osSelect && downloadButtonLink) {
    osSelect.addEventListener('change', (e) => {
        const selectedOS = e.target.value;
        
        // Меняем ссылку кнопки скачивания приложения
        downloadButtonLink.href = downloadLinks[selectedOS] || "#";
        
        // Корректируем импорт подписки для iOS через веб-сервис
        if (selectedOS === 'ios') {
            happBtn.href = `https://notjakob.com{configRawUrl}`;
        } else {
            happBtn.href = `happ://sub/add/${configRawUrl}`;
        }
    });
}

// Первичная инициализация ссылок
if (happBtn) happBtn.href = `happ://sub/add/${configRawUrl}`;

const copyBtn = document.getElementById('copy-raw');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(configRawUrl).then(() => {
            alert('Ссылка на подписку успешно скопирована!');
        });
    });
}
