// --- SETTINGS / THEME / ACCENT LOGIC ---
function setAccentColor(name, hex) {
    state.accentColor = name;
    state.accentHex = hex;
    updateAccentStyleRules();
    saveToStorage();
    showToast(`Đã đổi màu chủ đạo sang ${name}`);
}

function setThemeMode(mode) {
    state.theme = mode;
    applyThemeAndAccent();
    saveToStorage();
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyThemeAndAccent();
    saveToStorage();
}

function applyThemeAndAccent() {
    const html = document.documentElement;
    if (state.theme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    updateAccentStyleRules();
}

function resetDemoData() {
    localStorage.removeItem('pastel_planner_vi_state');
    location.reload();
}

function exportDataJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "pastel_planner_vi_backup.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Đã xuất dữ liệu thành công!');
}