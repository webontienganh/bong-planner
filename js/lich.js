// --- CALENDAR RENDER & MANAGEMENT LOGIC ---

function setCalendarMode(mode) {
    state.calendarMode = mode;
    document.querySelectorAll('.cal-mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`cal-mode-${mode}`).classList.add('active');
    renderCalendar();
}

function changeCalendarDate(dir) {
    const d = new Date(state.currentDate);
    if (state.calendarMode === 'month') d.setMonth(d.getMonth() + dir);
    else if (state.calendarMode === 'week') d.setDate(d.getDate() + (dir * 7));
    else if (state.calendarMode === 'day') d.setDate(d.getDate() + dir);
    else if (state.calendarMode === 'year') d.setFullYear(d.getFullYear() + dir);
    state.currentDate = d;
    renderCalendar();
}

function goToday() {
    state.currentDate = new Date(2026, 9, 14); // October 14, 2026
    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById('calendar-container');
    const cur = state.currentDate;
    
    if (state.calendarMode === 'month') {
        const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        document.getElementById('calendar-current-title').innerText = `${monthNames[cur.getMonth()]} ${cur.getFullYear()}`;
        
        const year = cur.getFullYear();
        const month = cur.getMonth();
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        
        let html = `
            <div class="grid grid-cols-7 border-b border-[#ECECF1] dark:border-[#2A2A30] text-center text-xs font-semibold text-[#777781] py-3 bg-[#FFFDFB] dark:bg-[#18181C]">
                <span>CN</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span>
            </div>
            <div class="grid grid-cols-7 flex-1 auto-rows-fr bg-[#ECECF1] dark:bg-[#2A2A30] gap-[1px]">
        `;

        for (let i = 0; i < firstDayIndex; i++) {
            html += `<div class="bg-white dark:bg-[#1E1E24] p-2 opacity-40"></div>`;
        }

        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = state.tasks.filter(t => t.startDate === dateStr);
            const isToday = dateStr === '2026-10-14';

            html += `
                <div class="bg-white dark:bg-[#1E1E24] p-2.5 flex flex-col justify-between hover:bg-black/[0.01] transition-colors relative group min-h-[100px]">
                    <div class="flex items-center justify-between">
                        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isToday ? 'accent-bg text-white' : ''}">${day}</span>
                        <button onclick="openTaskModalForDate('${dateStr}')" class="opacity-0 group-hover:opacity-100 text-xs text-[#777781] hover:text-indigo-600" title="Thêm việc vào ngày này"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <div class="space-y-1 mt-1.5 flex-1 overflow-y-auto">
                        ${dayTasks.slice(0, 3).map(t => {
                            const cat = state.categories.find(c => c.id === t.categoryId) || state.categories[0];
                            return `
                                <div onclick="openEditTaskModal('${t.id}')" class="px-2 py-1 rounded-lg bg-${cat.color}/50 text-[11px] font-medium truncate cursor-pointer hover:opacity-80">
                                    ${t.startTime ? t.startTime + ' ' : ''}${t.title}
                                </div>
                            `;
                        }).join('')}
                        ${dayTasks.length > 3 ? `<div class="text-[10px] text-[#777781] font-medium">+${dayTasks.length - 3} việc khác</div>` : ''}
                    </div>
                </div>
            `;
        }
        html += `</div>`;
        container.innerHTML = html;
    } else if (state.calendarMode === 'week') {
        document.getElementById('calendar-current-title').innerText = `Tuần ${cur.toLocaleDateString()}`;
        container.innerHTML = `<div class="p-8 text-center text-sm text-[#777781]">Chế độ xem Tuần đang hoạt động.</div>`;
    } else if (state.calendarMode === 'day') {
        document.getElementById('calendar-current-title').innerText = cur.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        container.innerHTML = `<div class="p-8 text-center text-sm text-[#777781]">Chế độ xem Ngày đang hoạt động.</div>`;
    } else {
        document.getElementById('calendar-current-title').innerText = `Năm ${cur.getFullYear()}`;
        container.innerHTML = `<div class="p-8 text-center text-sm text-[#777781]">Tổng quan 12 tháng đang hoạt động.</div>`;
    }
}