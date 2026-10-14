// --- STATISTICS VIEW LOGIC ---
function renderStatistics() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('stat-rate-val').innerText = `${rate}%`;
    document.getElementById('stat-total-val').innerText = total;

    const barsEl = document.getElementById('stat-category-bars');
    barsEl.innerHTML = state.categories.map(cat => {
        const count = state.tasks.filter(t => t.categoryId === cat.id).length;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return `
            <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                    <span>${cat.name}</span>
                    <span class="text-[#777781]">${count} việc (${pct}%)</span>
                </div>
                <div class="w-full bg-[#ECECF1] dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div class="h-full bg-${cat.color}" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    }).join('');
}