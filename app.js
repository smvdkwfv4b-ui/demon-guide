let data = {
    blood: 0, balance: 0, level: 5,
    piggyBanks: [
        {id:'cushion', name:'Финподушка', amount:0, goal:5000},
        {id:'rent', name:'Следующая Аренда', amount:0, goal:3000},
        {id:'debt', name:'Долги', amount:0, goal:0},
        {id:'teeth', name:'Зубы', amount:0, goal:3000},
        {id:'drawing', name:'Рисунок', amount:0, goal:800}
    ],
    quests: [
        {id:1,title:'Проверь Сообщения',desc:'Instagram и SMS',hint:'Быстрый ответ = больше клиентов',reward:10,period:'4h',done:false},
        {id:2,title:'Пост о Датах',desc:'Сторис о свободных',hint:'Шаблон: "Свободные даты..."',reward:15,period:'4h',done:false},
        {id:3,title:'Практика Рисунка',desc:'2+ часа эскизов',hint:'Тема: Кинжалы и мечи',reward:30,period:'daily',done:false},
        {id:4,title:'AI Эксперименты',desc:'5 референсов Stable Diffusion',hint:'Черно-белая графика',reward:20,period:'daily',done:false},
        {id:5,title:'Час Продвижения',desc:'1 час соцсети',hint:'Варшавское тату-комьюнити',reward:25,period:'daily',done:false},
        {id:6,title:'Обнови Портфолио',desc:'3 работы Instagram',hint:'Хорошие фото = больше записей',reward:50,period:'weekly',done:false},
        {id:7,title:'Варшавское Промо',desc:'Таргетированная реклама',hint:'ChatGPT для текста объявления',reward:60,period:'weekly',done:false},
        {id:8,title:'Еженедельный Отчет',desc:'Статистика и отчет',hint:'Для анализа демоном',reward:40,period:'weekly',done:false}
    ],
    diary: [], bookings: [], expenses: [], rewards: []
};

let tempIncome = 0;
let tempDistribution = {};

function load() {
    const saved = localStorage.getItem('demonData');
    if (saved) {
        try { data = {...data, ...JSON.parse(saved)}; }
        catch(e) { console.error('Failed to load'); }
    }
    render();
}

function save() {
    localStorage.setItem('demonData', JSON.stringify(data));
}

function render() {
    document.getElementById('blood').textContent = data.blood;
    document.getElementById('level').textContent = data.level;
    document.getElementById('balance').textContent = data.balance;
    document.getElementById('stat-level').textContent = data.level;
    document.getElementById('stat-blood').textContent = data.blood;
    document.getElementById('stat-quests').textContent = data.quests.filter(q=>q.done).length;
    document.getElementById('stat-money').textContent = data.balance;
    
    renderQuests();
    renderFinance();
    renderCalendar();
    renderDiary();
    renderRewards();
}

function renderQuests() {
    ['4h','daily','weekly'].forEach(p => {
        const qs = data.quests.filter(q=>q.period===p);
        document.getElementById(`quests-${p}`).innerHTML = qs.map(q=>`
            <div class="card">
                <div class="quest-row">
                    <div class="checkbox ${q.done?'done':''}" onclick="toggleQuest(${q.id})"></div>
                    <div class="quest-info">
                        <div class="card-title">${q.title}</div>
                        <div class="card-desc">${q.desc}</div>
                        <div class="card-hint">💡 ${q.hint}</div>
                        <div class="card-reward">+${q.reward} 🩸</div>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

function renderFinance() {
    document.getElementById('piggyBanks').innerHTML = data.piggyBanks.map(b=>{
        const pct = b.goal>0 ? Math.min(100, (b.amount/b.goal*100)).toFixed(0) : 0;
        return `
            <div class="piggy">
                <div class="piggy-header">
                    <div class="piggy-name">${b.name}</div>
                    <div class="piggy-amount">${Math.round(b.amount)} ${b.goal>0?`/ ${b.goal}`:''} zł</div>
                </div>
                ${b.goal>0?`<div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>`:''}
            </div>
        `;
    }).join('');
    
    document.getElementById('statsGoals').innerHTML = data.piggyBanks.map(b=>{
        const pct = b.goal>0 ? Math.min(100, (b.amount/b.goal*100)).toFixed(0) : 0;
        return `
            <div class="piggy">
                <div class="piggy-header">
                    <div class="piggy-name">${b.name}</div>
                    <div class="piggy-amount">${Math.round(b.amount)} ${b.goal>0?`/ ${b.goal}`:''} zł</div>
                </div>
                ${b.goal>0?`<div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>`:''}
            </div>
        `;
    }).join('');
    
    const recent = data.expenses.slice(-10).reverse();
    document.getElementById('expenseList').innerHTML = recent.length>0 ? recent.map(e=>`
        <div class="card">
            <div class="card-title">${getCategoryIcon(e.category)} ${getCategoryName(e.category)}</div>
            <div class="card-desc">${e.note || ''}</div>
            <div class="card-reward" style="color:#ff6666">-${e.amount} zł</div>
        </div>
    `).join('') : '<div class="card">Пока нет трат</div>';
}

function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    
    let html = '';
    for(let i = 0; i < startDay; i++) html += '<div class="cal-day"></div>';
    
    for(let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const hasBooking = data.bookings.some(b => b.date === dateStr);
        const isToday = day === today;
        html += `
            <div class="cal-day ${isToday?'today':''} ${hasBooking?'has-booking':''}" onclick="showDayBookings('${dateStr}')">
                <div class="cal-day-num">${day}</div>
                ${hasBooking?'<div class="cal-dot"></div>':''}
            </div>
        `;
    }
    document.getElementById('calendar').innerHTML = html;
    
    const todayStr = now.toISOString().split('T')[0];
    const upcoming = data.bookings.filter(b => !b.completed && b.date >= todayStr).sort((a,b) => new Date(a.date+' '+a.time) - new Date(b.date+' '+b.time));
    const completed = data.bookings.filter(b => b.completed).sort((a,b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0,5);
    
    document.getElementById('upcomingBookings').innerHTML = upcoming.length>0 ? upcoming.map(b=>`
        <div class="booking-card">
            <div class="booking-header">
                <div>
                    <div class="booking-name">${b.name}</div>
                    <div style="display:flex;gap:4px;margin-top:4px;">
                        <span class="booking-badge badge-${b.type}">${b.type==='new'?'✨ Новый':'🔄 Постоянный'}</span>
                        <span class="booking-badge badge-${b.city}">${b.city==='warsaw'?'🏙️ Варшава':'🚗 Сохачев'}</span>
                    </div>
                </div>
            </div>
            <div class="booking-info">📅 ${formatDate(b.date)} в ${b.time}</div>
            ${b.price?`<div class="booking-info">💰 ${b.price} zł</div>`:''}
            ${b.notes?`<div class="booking-info">📝 ${b.notes}</div>`:''}
            <div class="booking-actions">
                <button class="btn btn-small btn-complete" onclick="completeBooking(${b.id})">✓ Выполнено</button>
                <button class="btn btn-small btn-delete" onclick="deleteBooking(${b.id})">✕</button>
            </div>
        </div>
    `).join('') : '<div class="card">Нет предстоящих записей</div>';
    
    document.getElementById('completedBookings').innerHTML = completed.length>0 ? completed.map(b=>`
        <div class="booking-card" style="opacity:0.7">
            <div class="booking-name">✓ ${b.name}</div>
            <div class="booking-info">${formatDate(b.date)} • ${b.city==='warsaw'?'Варшава':'Сохачев'}</div>
            ${b.price?`<div class="booking-info" style="color:#66ff66">+${b.price} zł</div>`:''}
        </div>
    `).join('') : '<div class="card">Пока нет завершённых</div>';
    
    const stats = {
        total: data.bookings.filter(b=>b.completed).length,
        warsaw: data.bookings.filter(b=>b.completed && b.city==='warsaw').length,
        sochaczew: data.bookings.filter(b=>b.completed && b.city==='sochaczew').length,
        new: data.bookings.filter(b=>b.completed && b.type==='new').length
    };
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-warsaw').textContent = stats.warsaw;
    document.getElementById('stat-sochaczew').textContent = stats.sochaczew;
    document.getElementById('stat-new').textContent = stats.new;
}

function renderDiary() {
    const recent = data.diary.slice(-7).reverse();
    document.getElementById('diaryHistory').innerHTML = recent.length>0 ? recent.map(e=>`
        <div class="card">
            <div class="card-title">${formatDate(e.date)}</div>
            <div class="card-desc">😊 ${e.mood}/10 | ⚡ ${e.energy}/10 | 😰 ${e.anxiety}/10 ${e.steps?`| 👣 ${e.steps}`:''}</div>
            ${e.achievements?`<div class="card-hint">✓ ${e.achievements}</div>`:''}
            ${e.struggles?`<div class="card-hint">⚠️ ${e.struggles}</div>`:''}
        </div>
    `).join('') : '<div class="card">Пока нет записей</div>';
}

function renderRewards() {
    document.getElementById('rewardsList').innerHTML = data.rewards.length>0 ? data.rewards.map(r=>{
        const canBuy = data.balance >= r.price && !r.purchased;
        return `
            <div class="reward-card" style="${r.purchased?'opacity:0.5':''}">
                <div class="reward-icon">${r.emoji}</div>
                <div class="reward-info">
                    <div class="reward-name">${r.name}</div>
                    <div class="reward-price">${r.price} zł</div>
                    <div class="reward-status">${r.purchased?'✓ Куплено':canBuy?'✓ Можешь купить!':'Не хватает '+Math.round(r.price-data.balance)+' zł'}</div>
                </div>
                <div>
                    ${canBuy?`<button class="btn btn-small" onclick="buyReward(${r.id})">Купить</button>`:''}
                    <button class="btn btn-small btn-delete" onclick="deleteReward(${r.id})">✕</button>
                </div>
            </div>
        `;
    }).join('') : '<div class="card">Добавь награды для мотивации</div>';
}

function toggleQuest(id) {
    const q = data.quests.find(x=>x.id===id);
    if(!q) return;
    q.done = !q.done;
    if(q.done) data.blood += q.reward;
    else data.blood = Math.max(0, data.blood-q.reward);
    save(); render();
}

function switchTab(name) {
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-'+name).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function showModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

function showDiary() { showModal('diaryModal'); }

function saveDiary() {
    const entry = {
        date: new Date().toISOString().split('T')[0],
        mood: document.getElementById('mood').value,
        energy: document.getElementById('energy').value,
        anxiety: document.getElementById('anxiety').value,
        steps: document.getElementById('steps').value,
        achievements: document.getElementById('achievements').value,
        struggles: document.getElementById('struggles').value,
        timestamp: new Date().toISOString()
    };
    data.diary.push(entry);
    data.blood += 20;
    save(); render(); closeModal('diaryModal');
    document.getElementById('steps').value='';
    document.getElementById('achievements').value='';
    document.getElementById('struggles').value='';
}

function showAddIncome() { showModal('incomeModal'); }

function showDistribution() {
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    if(!amount || amount<=0) return alert('Введи сумму!');
    
    tempIncome = amount;
    let remaining = amount;
    
    tempDistribution = {};
    
    const rent = data.piggyBanks.find(b=>b.id==='rent');
    if(rent.amount < rent.goal) {
        tempDistribution.rent = Math.min(rent.goal - rent.amount, Math.round(remaining * 0.3));
        remaining -= tempDistribution.rent;
    } else {
        tempDistribution.rent = 0;
    }
    
    const cushion = data.piggyBanks.find(b=>b.id==='cushion');
    if(cushion.amount < cushion.goal && remaining > 0) {
        tempDistribution.cushion = Math.round(remaining * 0.4);
        remaining -= tempDistribution.cushion;
    } else {
        tempDistribution.cushion = 0;
    }
    
    if(remaining > 400) {
        tempDistribution.debt = Math.min(700, Math.round(remaining * 0.3));
        remaining -= tempDistribution.debt;
    } else {
        tempDistribution.debt = 0;
    }
    
    const drawing = data.piggyBanks.find(b=>b.id==='drawing');
    if(drawing.amount < drawing.goal && remaining > 0) {
        tempDistribution.drawing = Math.round(remaining * 0.5);
        remaining -= tempDistribution.drawing;
    } else {
        tempDistribution.drawing = 0;
    }
    
    const teeth = data.piggyBanks.find(b=>b.id==='teeth');
    if(remaining > 0 && teeth.amount < teeth.goal) {
        tempDistribution.teeth = remaining;
    } else {
        tempDistribution.teeth = 0;
    }
    
    document.getElementById('distributionList').innerHTML = data.piggyBanks.map(b=>`
        <div class="distribute-row">
            <div class="distribute-name">${b.name}</div>
            <input type="number" class="distribute-input" id="dist-${b.id}" value="${tempDistribution[b.id] || 0}" oninput="updateTotal()">
        </div>
    `).join('');
    
    updateTotal();
    closeModal('incomeModal');
    showModal('distributionModal');
}

function updateTotal() {
    let total = 0;
    data.piggyBanks.forEach(b => {
        const val = parseFloat(document.getElementById(`dist-${b.id}`).value) || 0;
        total += val;
    });
    document.getElementById('totalDistributed').textContent = Math.round(total) + ' zł';
    document.getElementById('remaining').textContent = Math.round(tempIncome - total) + ' zł';
}

function applyDistribution() {
    let total = 0;
    data.piggyBanks.forEach(b => {
        const val = parseFloat(document.getElementById(`dist-${b.id}`).value) || 0;
        b.amount += val;
        total += val;
    });
    
    data.balance += tempIncome;
    save(); render(); closeModal('distributionModal');
    document.getElementById('incomeAmount').value='';
    alert(`✓ Доход ${Math.round(tempIncome)} zł добавлен и распределен!`);
}

function showAddExpense() { showModal('expenseModal'); }

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const note = document.getElementById('expenseNote').value;
    if(!amount || amount<=0) return alert('Введи сумму!');
    
    data.balance -= amount;
    data.expenses.push({
        amount, category, note,
        date: new Date().toISOString(),
        id: Date.now()
    });
    save(); render(); closeModal('expenseModal');
    document.getElementById('expenseAmount').value='';
    document.getElementById('expenseNote').value='';
}

function showAddBooking() {
    document.getElementById('bookingDate').value = new Date().toISOString().split('T')[0];
    showModal('bookingModal');
}

function addBooking() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const name = document.getElementById('bookingName').value;
    const city = document.getElementById('bookingCity').value;
    const type = document.getElementById('bookingType').value;
    const price = parseFloat(document.getElementById('bookingPrice').value) || 0;
    const notes = document.getElementById('bookingNotes').value;
    
    if(!date || !name) return alert('Заполни дату и имя!');
    
    data.bookings.push({
        id: Date.now(), date, time, name, city, type, price, notes,
        completed: false, createdAt: new Date().toISOString()
    });
    save(); render(); closeModal('bookingModal');
    document.getElementById('bookingName').value='';
    document.getElementById('bookingPrice').value='';
    document.getElementById('bookingNotes').value='';
}

function completeBooking(id) {
    const b = data.bookings.find(x=>x.id===id);
    if(!b || b.completed) return;
    
    if(b.price && confirm(`Добавить доход ${b.price} zł?`)) {
        document.getElementById('incomeAmount').value = b.price;
        showDistribution();
    }
    
    b.completed = true;
    b.completedAt = new Date().toISOString();
    data.blood += 30;
    save(); render();
}

function deleteBooking(id) {
    if(!confirm('Удалить запись?')) return;
    data.bookings = data.bookings.filter(b=>b.id!==id);
    save(); render();
}

function showDayBookings(dateStr) {
    const bookings = data.bookings.filter(b=>b.date===dateStr);
    if(bookings.length === 0) return alert('Нет записей на этот день');
    const info = bookings.map(b=>`${b.time} - ${b.name} (${b.city==='warsaw'?'Варшава':'Сохачев'})`).join('\n');
    alert(`📅 ${formatDate(dateStr)}\n\n${info}`);
}

function showAddReward() { showModal('rewardModal'); }

function addReward() {
    const name = document.getElementById('rewardName').value;
    const price = parseFloat(document.getElementById('rewardPrice').value);
    const emoji = document.getElementById('rewardEmoji').value || '🎁';
    if(!name || !price) return alert('Заполни все поля!');
    
    data.rewards.push({ id: Date.now(), name, price, emoji, purchased: false });
    save(); render(); closeModal('rewardModal');
    document.getElementById('rewardName').value='';
    document.getElementById('rewardPrice').value='';
    document.getElementById('rewardEmoji').value='🎁';
}

function buyReward(id) {
    const r = data.rewards.find(x=>x.id===id);
    if(!r || r.purchased || data.balance < r.price) return;
    if(!confirm(`Купить "${r.name}" за ${r.price} zł?`)) return;
    r.purchased = true;
    data.balance -= r.price;
    save(); render();
    alert(`🎉 Поздравляю! Ты купил ${r.name}!`);
}

function deleteReward(id) {
    if(!confirm('Удалить награду?')) return;
    data.rewards = data.rewards.filter(r=>r.id!==id);
    save(); render();
}

function exportReport() {
    const report = {
        export_date: new Date().toISOString(),
        player: { level: data.level, blood_points: data.blood, balance: data.balance },
        piggy_banks: data.piggyBanks.map(b=>({
            name:b.name, amount:Math.round(b.amount), goal:b.goal,
            progress_percent: b.goal>0 ? Math.round(b.amount/b.goal*100) : 0
        })),
        quests: {
            total: data.quests.length,
            completed: data.quests.filter(q=>q.done).length,
            completion_rate: Math.round(data.quests.filter(q=>q.done).length / data.quests.length * 100)
        },
        diary: {
            total_entries: data.diary.length,
            last_7_days: data.diary.slice(-7),
            avg_mood: data.diary.length>0 ? (data.diary.reduce((s,e)=>s+parseInt(e.mood||5),0)/data.diary.length).toFixed(1) : 0,
            avg_energy: data.diary.length>0 ? (data.diary.reduce((s,e)=>s+parseInt(e.energy||5),0)/data.diary.length).toFixed(1) : 0,
            avg_anxiety: data.diary.length>0 ? (data.diary.reduce((s,e)=>s+parseInt(e.anxiety||5),0)/data.diary.length).toFixed(1) : 0,
            total_steps: data.diary.reduce((s,e)=>s+parseInt(e.steps||0),0)
        },
        bookings: {
            total_completed: data.bookings.filter(b=>b.completed).length,
            warsaw: data.bookings.filter(b=>b.completed && b.city==='warsaw').length,
            sochaczew: data.bookings.filter(b=>b.completed && b.city==='sochaczew').length,
            new_clients: data.bookings.filter(b=>b.completed && b.type==='new').length,
            upcoming: data.bookings.filter(b=>!b.completed).length
        },
        expenses: {
            total: data.expenses.reduce((s,e)=>s+e.amount,0),
            by_category: getCategorySummary()
        }
    };
    
    const json = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(json).then(()=>{
        alert('📋 Отчет скопирован в буфер!\n\nОтправь его Клоду для анализа.');
    }).catch(()=>{
        prompt('Скопируй этот отчет:', json);
    });
}

function getCategorySummary() {
    const summary = {};
    data.expenses.forEach(e=>{
        if(!summary[e.category]) summary[e.category] = 0;
        summary[e.category] += e.amount;
    });
    return summary;
}

function getCategoryIcon(cat) {
    const icons = { rent:'🏠', food:'🍕', transport:'🚌', medicine:'💊', doctor:'👨‍⚕️', debt:'📉', education:'📚', other:'💳' };
    return icons[cat] || '💳';
}

function getCategoryName(cat) {
    const names = { rent:'Аренда', food:'Еда', transport:'Дорога', medicine:'Лекарства', doctor:'Врач', debt:'Долги', education:'Обучение', other:'Другое' };
    return names[cat] || 'Другое';
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
}

window.onload = load;
