// --- CẤU HÌNH VÀ KHỞI TẠO FIREBASE (SDK Modular) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDhG6QUOP9i4CJxsnApKz_Zi8FhrWhyRRM",
    authDomain: "bong-planner.firebaseapp.com",
    projectId: "bong-planner",
    storageBucket: "bong-planner.firebasestorage.app",
    messagingSenderId: "59882727261",
    appId: "1:59882727261:web:ee46e5a11a631e78ef67b4"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID định danh dữ liệu trên Cloud
const DATA_DOC_ID = 'luu_ngoc_tran_planner_data';

let state = {
    currentTab: 'dashboard',
    calendarMode: 'month',
    currentDate: new Date(),
    taskFilterTab: 'today',
    taskViewMode: 'list',
    theme: 'light',
    accentColor: 'indigo',
    accentHex: '#6366f1',
    categories: [
        { id: 'cat-study', name: 'Học tập', color: 'pastel-blue', hex: '#CDE7F8', icon: 'fa-book' },
        { id: 'cat-work', name: 'Công việc', color: 'pastel-lavender', hex: '#DCD6F7', icon: 'fa-briefcase' },
        { id: 'cat-personal', name: 'Cá nhân', color: 'pastel-green', hex: '#D8F3DC', icon: 'fa-heart' },
        { id: 'cat-deadline', name: 'Hạn chót', color: 'pastel-pink', hex: '#F7D6E0', icon: 'fa-flag' }
    ],
    tasks: [],
    notifications: []
};

let selectedCatColorValue = 'pastel-blue';

// --- LƯU DỮ LIỆU LÊN FIREBASE CLOUD ---
async function saveToStorage() {
    // Lưu tạm vào trình duyệt đề phòng mất kết nối
    localStorage.setItem('pastel_planner_vi_state', JSON.stringify(state));

    try {
        await setDoc(doc(db, "planners", DATA_DOC_ID), state);
        console.log("Đã đồng bộ dữ liệu lên Firebase thành công!");
    } catch (error) {
        console.error("Lỗi khi đồng bộ lên Firebase: ", error);
    }
}

// --- TẢI DỮ LIỆU TỪ FIREBASE CLOUD ---
async function loadFromStorage(callback) {
    try {
        const docRef = doc(db, "planners", DATA_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const parsed = docSnap.data();
            state = { ...state, ...parsed };
            if (state.currentDate) {
                state.currentDate = new Date(state.currentDate);
            }
        } else {
            // Nếu trên Cloud chưa có, lấy từ localStorage máy
            const saved = localStorage.getItem('pastel_planner_vi_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
                if (state.currentDate) state.currentDate = new Date(state.currentDate);
            }
        }
    } catch (error) {
        console.error("Không thể tải từ Firebase, dùng dữ liệu thiết bị:", error);
    }

    if (callback) callback();
}

// --- KHỞI TẠO ỨNG DỤNG ---
window.onload = function() {
    loadFromStorage(() => {
        applyThemeAndAccent();
        renderAll();
        setupDynamicStyles();
    });
};

function setupDynamicStyles() {
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-accent-style';
    document.head.appendChild(styleEl);
    updateAccentStyleRules();
}

function updateAccentStyleRules() {
    const el = document.getElementById('dynamic-accent-style');
    if (!el) return;
    el.innerHTML = `
        .accent-bg { background-color: ${state.accentHex} !important; }
        .accent-text { color: ${state.accentHex} !important; }
        .accent-border { border-color: ${state.accentHex} !important; }
        .nav-btn.active { background-color: ${state.accentHex}15; color: ${state.accentHex}; font-weight: 600; }
        .cal-mode-btn.active, .task-tab-btn.active, .tview-btn.active { background-color: ${state.accentHex}; color: white; }
    `;
}

// --- RENDER ROUTER ---
function renderAll() {
    renderSidebarCategories();
    renderHeaderGreeting();
    renderNotificationsBadge();
    
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`view-${state.currentTab}`).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${state.currentTab}`);
    if (activeNav) activeNav.classList.add('active');

    if (state.currentTab === 'dashboard') renderDashboard();
    if (state.currentTab === 'calendar') renderCalendar();
    if (state.currentTab === 'tasks') renderTasksView();
    if (state.currentTab === 'statistics') renderStatistics();
}

function switchTab(tab) {
    state.currentTab = tab;
    renderAll();
    document.getElementById('main-scroll-container').scrollTop = 0;
}

// --- HEADER & SIDEBAR HELPERS ---
function renderHeaderGreeting() {
    const titles = {
        dashboard: ['Tổng quan', 'Chào mừng bạn trở lại không gian ấm cúng ✨'],
        calendar: ['Lịch', 'Lên kế hoạch tuần và quản lý thời gian linh hoạt'],
        tasks: ['Quản lý công việc', 'Tổ chức, theo dõi và hoàn thành việc cần làm'],
        statistics: ['Thống kê năng suất', 'Tổng quan về tiến độ cá nhân của bạn'],
        settings: ['Cài đặt', 'Tùy chỉnh màu sắc, giao diện và tùy chọn']
    };
    document.getElementById('page-title').innerText = titles[state.currentTab][0];
    document.getElementById('page-subtitle').innerText = titles[state.currentTab][1];

    const now = state.currentDate;
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = daysOfWeek[now.getDay()];
    document.getElementById('greeting-date').innerText = `${dayName}, ${now.getDate()} tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
    
    const hour = new Date().getHours();
    let greeting = 'Chào buổi sáng';
    if (hour >= 12 && hour < 18) greeting = 'Chào buổi chiều';
    else if (hour >= 18) greeting = 'Chào buổi tối';
    document.getElementById('greeting-time').innerText = greeting;
}

function renderSidebarCategories() {
    const container = document.getElementById('sidebar-categories');
    container.innerHTML = state.categories.map(cat => `
        <div class="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-sm group">
            <div class="flex items-center space-x-2.5">
                <span class="w-3 h-3 rounded-full bg-${cat.color}"></span>
                <span class="text-xs font-medium text-[#34343B] dark:text-zinc-300">${cat.name}</span>
            </div>
            <span class="text-[10px] text-[#777781] px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/10">
                ${state.tasks.filter(t => t.categoryId === cat.id).length}
            </span>
        </div>
    `).join('');

    const formCatSelect = document.getElementById('form-calendar');
    if (formCatSelect) {
        formCatSelect.innerHTML = state.categories.map(cat => `
            <option value="${cat.id}">${cat.name}</option>
        `).join('');
    }
}