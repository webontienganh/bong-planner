// --- TASKS VIEW & MANAGEMENT LOGIC ---
function setTaskFilterTab(tab) {
    state.taskFilterTab = tab;
    document.querySelectorAll('.task-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`task-tab-${tab}`).classList.add('active');
    renderTasksView();
}

function setTaskViewMode(mode) {
    state.taskViewMode = mode;
    document.querySelectorAll('.tview-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tview-${mode}`).classList.add('active');
    renderTasksView();
}

function renderTasksView() {
    const container = document.getElementById('tasks-content-container');
    const todayStr = '2026-10-14';
    let filtered = [...state.tasks];

    if (state.taskFilterTab === 'today') filtered = filtered.filter(t => t.startDate === todayStr);
    else if (state.taskFilterTab === 'completed') filtered = filtered.filter(t => t.status === 'completed');
    else if (state.taskFilterTab === 'overdue') filtered = filtered.filter(t => t.startDate < todayStr && t.status !== 'completed');
    else if (state.taskFilterTab === 'upcoming') filtered = filtered.filter(t => t.startDate > todayStr);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 bg-white dark:bg-[#1E1E24] rounded-3xl border border-[#ECECF1] dark:border-[#2A2A30]">
                <i class="fa-solid fa-seedling text-4xl text-indigo-300 mb-3"></i>
                <h4 class="font-bold text-base">Không tìm thấy công việc</h4>
                <p class="text-xs text-[#777781] mt-1">Hãy thử bộ lọc khác hoặc tạo công việc mới.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="space-y-3">
            ${filtered.map(t => {
                const cat = state.categories.find(c => c.id === t.categoryId) || state.categories[0];
                const isDone = t.status === 'completed';
                return `
                    <div class="bg-white dark:bg-[#1E1E24] p-4 rounded-2xl border border-[#ECECF1] dark:border-[#2A2A30] flex items-center justify-between shadow-xs">
                        <div class="flex items-center space-x-3.5">
                            <button onclick="toggleTaskComplete('${t.id}')" class="w-6 h-6 rounded-lg border-2 border-${cat.color} flex items-center justify-center${isDone ? 'bg-'+cat.color+' text-indigo-900' : ''}" title="Đổi trạng thái">
                                ${isDone ? '<i class="fa-solid fa-check text-xs"></i>' : ''}
                            </button>
                            <div>
                                <div class="text-sm font-semibold ${isDone ? 'line-through text-[#777781]' : ''}">${t.title}</div>
                                <div class="text-xs text-[#777781] flex items-center space-x-3 mt-1">
                                    <span><i class="fa-regular fa-calendar mr-1"></i>${t.startDate}</span>
                                    <span><i class="fa-regular fa-clock mr-1"></i>${t.startTime || 'Cả ngày'}</span>
                                    <span class="px-2 py-0.5 rounded-md bg-${cat.color}/40 font-medium">${cat.name}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-xs px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 font-medium">${t.priority}</span>
                            <button onclick="openEditTaskModal('${t.id}')" class="w-8 h-8 rounded-xl hover:bg-black/5 flex items-center justify-center text-[#777781]" title="Chỉnh sửa"><i class="fa-solid fa-pen text-xs"></i></button>
                            <button onclick="deleteTask('${t.id}')" class="w-8 h-8 rounded-xl hover:bg-rose-50 text-rose-500 flex items-center justify-center" title="Xóa"><i class="fa-solid fa-trash text-xs"></i></button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// --- TASK MODAL ACTIONS ---
function openTaskModal() {
    document.getElementById('task-modal-title').innerText = 'Công việc mới';
    document.getElementById('task-form').reset();
    document.getElementById('task-edit-id').value = '';
    document.getElementById('form-start-date').value = '2026-10-14';
    document.getElementById('form-end-date').value = '2026-10-14';
    document.getElementById('task-modal').classList.remove('hidden');
}

function openTaskModalForDate(dateStr) {
    openTaskModal();
    document.getElementById('form-start-date').value = dateStr;
    document.getElementById('form-end-date').value = dateStr;
}

function openEditTaskModal(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    document.getElementById('task-modal-title').innerText = 'Chỉnh sửa công việc';
    document.getElementById('task-edit-id').value = task.id;
    document.getElementById('form-title').value = task.title;
    document.getElementById('form-calendar').value = task.categoryId;
    document.getElementById('form-priority').value = task.priority;
    document.getElementById('form-start-date').value = task.startDate;
    document.getElementById('form-start-time').value = task.startTime || '';
    document.getElementById('form-end-date').value = task.endDate;
    document.getElementById('form-end-time').value = task.endTime || '';
    document.getElementById('form-location').value = task.location || '';
    document.getElementById('form-description').value = task.description || '';
    document.getElementById('task-modal').classList.remove('hidden');
}

function closeTaskModal() {
    document.getElementById('task-modal').classList.add('hidden');
}

function saveTaskForm(e) {
    e.preventDefault();
    const id = document.getElementById('task-edit-id').value;
    const title = document.getElementById('form-title').value;
    const categoryId = document.getElementById('form-calendar').value;
    const priority = document.getElementById('form-priority').value;
    const startDate = document.getElementById('form-start-date').value;
    const startTime = document.getElementById('form-start-time').value;
    const endDate = document.getElementById('form-end-date').value;
    const endTime = document.getElementById('form-end-time').value;
    const location = document.getElementById('form-location').value;
    const description = document.getElementById('form-description').value;

    if (id) {
        const idx = state.tasks.findIndex(t => t.id === id);
        if (idx !== -1) {
            state.tasks[idx] = { ...state.tasks[idx], title, categoryId, priority, startDate, startTime, endDate, endTime, location, description };
        }
        showToast('Đã cập nhật công việc thành công ✨');
    } else {
        const newTask = {
            id: 'task-' + Date.now(),
            categoryId,
            title,
            startDate,
            startTime,
            endDate,
            endTime,
            priority,
            status: 'not-started',
            location,
            description
        };
        state.tasks.push(newTask);
        showToast('Đã tạo công việc thành công ✨');
    }

    saveToStorage();
    closeTaskModal();
    renderAll();
}

function toggleTaskComplete(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    task.status = task.status === 'completed' ? 'not-started' : 'completed';
    saveToStorage();
    renderAll();
    showToast(task.status === 'completed' ? 'Đã hoàn thành công việc 🎉' : 'Đã mở lại công việc');
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveToStorage();
    renderAll();
    showToast('Đã xóa công việc');
}