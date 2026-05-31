// Импортируем две изолированные страницы
const renderCabinet = require('./cabinetPage');
const renderLoginPage = require('./loginPage');

// Экспортируем их наружу для index.js
module.exports = { renderCabinet, renderLoginPage };
