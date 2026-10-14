// --- USER INTERACTIONS & NOTIFICATIONS LOGIC ---
function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    dropdown.classList.toggle('hidden');
    renderNotificationsList();
}

function renderNotificationsList() {
    const listEl = document.getElementById('notification-list');
    listEl.innerHTML = state.notifications.length === 0 ? `
        <div class="text-center py-4 text-xs text-[#777781]">Không có thông báo</div>
    ` : state.notifications.map(n => `
        <div class="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs">
            <div>
                <div class="font-semibold">${n.title}</div>
                <div class="text-[10px] text-[#777781] mt-0.5">${n.time}</div>
            </div>
        </div>
    `).join('');
}

function clearNotifications() {
    state.notifications = [];
    renderNotificationsBadge();
    renderNotificationsList();
}

function renderNotificationsBadge() {
    const badge = document.getElementById('notif-badge');
    if (state.notifications.length > 0) {
        badge.innerText = state.notifications.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// --- TOAST SYSTEM ---
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'bg-white dark:bg-[#22222B] text-[#34343B] dark:text-zinc-200 px-4 py-3 rounded-2xl shadow-xl border border-[#ECECF1] dark:border-[#2A2A30] text-xs font-semibold flex items-center space-x-3 pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300';
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i><span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- SEARCH & SIDEBAR ---
function handleSearch(query) {
    if (!query.trim()) return;
    state.currentTab = 'tasks';
    renderAll();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
}