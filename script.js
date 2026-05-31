const currentUrl = window.location.href;
const configRawUrl = currentUrl.endsWith('/') ? currentUrl + 'configs.txt' : currentUrl + '/configs.txt';

const osNames = {
    android: "Android",
    ios: "iOS",
    windows: "Windows",
    linux: "Linux",
    macos: "macOS"
};

const osSelect = document.getElementById('os-dropdown');
const osDynamicText = document.getElementById('os-name-text');
const osBtnText = document.getElementById('os-button-text');
const happBtn = document.getElementById('happ-link');

if (osSelect && osDynamicText && osBtnText) {
    osSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        osDynamicText.textContent = osNames[val];
        osBtnText.textContent = osNames[val];
        
        if (val === 'ios') {
            happBtn.href = `https://notjakob.com{configRawUrl}`;
        } else {
            happBtn.href = `happ://sub/add/${configRawUrl}`;
        }
    });
}

if (happBtn) happBtn.href = `happ://sub/add/${configRawUrl}`;

document.getElementById('copy-raw').addEventListener('click', () => {
    navigator.clipboard.writeText(configRawUrl).then(() => {
        alert('Ссылка успешно скопирована!');
    });
});
