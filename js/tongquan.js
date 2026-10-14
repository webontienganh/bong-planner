// --- DASHBOARD RENDER & LOGIC ---
function renderDashboard() {
    const todayStr = state.currentDate.toISOString().split('T')[0];
    const todayTasks = state.tasks.filter(t => t.startDate === todayStr);
    const completedCount = todayTasks.filter(t => t.status === 'completed').length;
    
    document.getElementById('stat-today').innerText = todayTasks.length;
    document.getElementById('stat-completed').innerText = state.tasks.filter(t => t.status === 'completed').length;
    document.getElementById('stat-upcoming').innerText = state.tasks.filter(t => t.startDate > todayStr).length;
    document.getElementById('stat-overdue').innerText = state.tasks.filter(t => t.startDate < todayStr && t.status !== 'completed').length;

    const pct = todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0;
    document.getElementById('dashboard-progress-text').innerText = `${completedCount} / ${todayTasks.length} Đã xong`;
    document.getElementById('dashboard-progress-bar').style.width = `${pct}%`;

    const timelineEl = document.getElementById('dashboard-timeline');
    if (todayTasks.length === 0) {
        timelineEl.innerHTML = `
            <div class="text-center py-10">
                <i class="fa-solid fa-mug-hot text-3xl text-indigo-300 mb-2"></i>
                <p class="text-sm font-medium">Hôm nay bạn hoàn toàn thảnh thơi ✨</p>
                <p class="text-xs text-[#777781] mt-1">Tận hưởng thời gian nghỉ ngơi hoặc lên kế hoạch mới.</p>
            </div>
        `;
    } else {
        timelineEl.innerHTML = todayTasks.map(t => {
            const cat = state.categories.find(c => c.id === t.categoryId) || state.categories[0];
            const isDone = t.status === 'completed';
            return `
                <div class="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#22222B] border border-[#ECECF1] dark:border-[#2A2A30] shadow-xs group">
                    <div class="flex items-center space-x-3">
                        <button onclick="toggleTaskComplete('${t.id}')" class="w-6 h-6 rounded-lg border-2 border-${cat.color} flex items-center justify-center ${isDone ? 'bg-'+cat.color+' text-indigo-900' : ''}" title="Đánh dấu hoàn thành">
                            ${isDone ? '<i class="fa-solid fa-check text-xs"></i>' : ''}
                        </button>
                        <div>
                            <div class="text-sm font-semibold ${isDone ? 'line-through text-[#777781]' : ''}">${t.title}</div>
                            <div class="text-xs text-[#777781] flex items-center space-x-2 mt-0.5">
                                <span><i class="fa-regular fa-clock mr-1"></i>${t.startTime || 'Cả ngày'}</span>
                                <span>•</span>
                                <span class="px-2 py-0.5 rounded-md bg-${cat.color}/40 text-xs font-medium">${cat.name}</span>
                            </div>
                        </div>
                    </div>
                    <button onclick="openEditTaskModal('${t.id}')" class="text-xs text-[#777781] hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Chỉnh sửa">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    const upcomingEl = document.getElementById('dashboard-upcoming');
    const upcomingTasks = state.tasks.filter(t => t.startDate > todayStr).slice(0, 5);
    upcomingEl.innerHTML = upcomingTasks.length === 0 ? `
        <div class="text-center py-8 text-xs text-[#777781]">Không có công việc sắp tới nào.</div>
    ` : upcomingTasks.map(t => `
        <div class="p-3 rounded-xl bg-white dark:bg-[#22222B] border border-[#ECECF1] dark:border-[#2A2A30] flex items-center justify-between">
            <div>
                <div class="text-xs font-semibold">${t.title}</div>
                <div class="text-[10px] text-[#777781] mt-0.5">${t.startDate}</div>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-md bg-pastel-blue/50 font-medium">${t.priority}</span>
        </div>
    `).join('');
}