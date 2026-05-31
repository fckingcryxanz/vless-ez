module.exports = `
:root {
    --bg-main: #0c0f19;
    --bg-card: #131722;
    --bg-subcard: #181d2c;
    --border-color: #1e2538;
    --text-primary: #ffffff;
    --text-secondary: #707e94;
    --accent-blue: #0084ff;
    --accent-green: #10b981;
    --accent-red: #ef4444;
    --font-mono: 'Fira Mono', monospace;
}
body {
    background-color: var(--bg-main); color: var(--text-primary);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0; padding: 24px 16px; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; box-sizing: border-box;
}
.wrapper { width: 100%; max-width: 720px; display: flex; flex-direction: column; gap: 16px; }
.header-panel { display: flex; justify-content: space-between; align-items: center; padding: 0 4px; }
.brand { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; color: #38bdf8; }
.top-actions { display: flex; gap: 10px; }
.btn-icon { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; }
.main-card { background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
.user-profile { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; }
.status-badge { background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--accent-green); }
.user-details h3 { margin: 0 0 2px 0; font-size: 16px; font-weight: 700; font-family: var(--font-mono); }
.user-details span { font-size: 12px; color: var(--text-secondary); }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.info-item { border-radius: 10px; padding: 12px 16px; }
.info-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; font-weight: 500; display: flex; align-items: center; gap: 6px; }
.info-value { font-size: 14px; font-weight: 700; font-family: var(--font-mono); }
.active-text { color: var(--accent-green); display: flex; align-items: center; gap: 6px; }
.active-text::before { content: ""; width: 6px; height: 6px; background-color: var(--accent-green); border-radius: 50%; }
.card-title-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-head { font-size: 16px; font-weight: 700; }
.os-select { background-color: #181d2c; color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 6px 12px; font-size: 13px; cursor: pointer; outline: none; font-family: 'Inter', sans-serif; }
.tabs-container { display: flex; background-color: rgba(0, 0, 0, 0.15); padding: 4px; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 20px; }
.tab-item { flex: 1; background: none; border: none; color: var(--text-primary); padding: 10px; font-size: 13px; font-weight: 600; border-radius: 8px; text-align: center; background-color: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.05); font-family: 'Inter', sans-serif; }
.guide-list { display: flex; flex-direction: column; gap: 12px; }
.guide-card { background-color: var(--bg-subcard); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; gap: 14px; align-items: flex-start; }
.guide-icon-box { background-color: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.1); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #38bdf8; flex-shrink: 0; }
.guide-content { flex: 1; text-align: left; }
.guide-h4 { font-size: 14px; font-weight: 700; margin: 0 0 4px 0; }
.guide-content p { margin: 0 0 14px 0; font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
.btn-action { background-color: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-family: 'Inter', sans-serif; }
.btn-submit { background-color: #0084ff; color: white; border: none; border-radius: 10px; padding: 12px; font-size: 13px; font-weight: 600; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; box-sizing: border-box; box-shadow: 0 0 15px rgba(0, 132, 255, 0.3); font-family: 'Inter', sans-serif; }
`;
