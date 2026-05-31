module.exports = function(errorMessage) {
    const errorBlock = errorMessage ? `<div style="color: #ef4444; font-size: 13px; margin-bottom: 16px; text-align: center; font-weight: 500;">${errorMessage}</div>` : '';
    return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LOGIN</title>
        <link href="https://googleapis.com" rel="stylesheet">
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
    <div class="wrapper">
        <div class="main-card login-card">
            <div class="login-title">LOGIN</div>
            ${errorBlock}
            <form action="/login" method="POST">
                <div class="form-group">
                    <label>Логин</label>
                    <input type="text" name="username" class="form-input" placeholder="Введите логин из бота" required autocomplete="off">
                </div>
                <div class="form-group">
                    <label>Пароль</label>
                    <input type="password" name="password" class="form-input" placeholder="Введите пароль" required>
                </div>
                <button type="submit" class="btn-submit">Войти в аккаунт</button>
            </form>
        </div>
    </div>
    <script>
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
