// Автоматическое определение ссылки на текущий репозиторий GitHub Pages
const currentUrl = window.location.href;
const configRawUrl = currentUrl.endsWith('/') ? currentUrl + 'configs.txt' : currentUrl + '/configs.txt';

// Привязываем глубокую ссылку к главной кнопке Happ
const happBtn = document.getElementById('happ-link');
if (happBtn) {
    happBtn.href = `happ://sub/add/${configRawUrl}`;
}

// Настройка функционала кнопки копирования ссылки в буфер обмена
const copyBtn = document.getElementById('copy-raw');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(configRawUrl).then(() => {
            alert('Ссылка успешно скопирована!');
        }).catch(() => {
            alert('Скопируйте ссылку вручную: ' + configRawUrl);
        });
    });
}
