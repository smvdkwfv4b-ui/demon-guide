// ===== DATA STRUCTURE =====
let data = {
    // RPG System
    level: 5,
    xp: 0,
    blood: 0,
    
    // Finances
    balance: 0,
    piggyBanks: [
        {id:'cushion', name:'Финподушка', amount:0, goal:5000},
        {id:'rent', name:'Аренда', amount:0, goal:3000},
        {id:'debt', name:'Долги', amount:0, goal:0},
        {id:'teeth', name:'Зубы', amount:0, goal:3000},
        {id:'drawing', name:'Рисунок', amount:0, goal:800}
    ],
    transactions: [],
    
    // Quests with streaks
    quests: [
        {id:1,title:'Проверь Сообщения',desc:'Instagram и SMS',hint:'Быстрый ответ = больше клиентов',reward:10,xp:15,period:'4h',done:false,streak:0,lastDone:null},
        {id:2,title:'Пост о Датах',desc:'Сторис о свободных',hint:'Шаблон: "Свободные даты..."',reward:15,xp:20,period:'4h',done:false,streak:0,lastDone:null},
        {id:3,title:'Практика Рисунка',desc:'2+ часа эскизов',hint:'Тема: Кинжалы и мечи',reward:30,xp:50,period:'daily',done:false,streak:0,lastDone:null},
        {id:4,title:'AI Эксперименты',desc:'5 референсов',hint:'Stable Diffusion',reward:20,xp:30,period:'daily',done:false,streak:0,lastDone:null},
        {id:5,title:'Час Продвижения',desc:'1 час соцсети',hint:'Варшавское комьюнити',reward:25,xp:35,period:'daily',done:false,streak:0,lastDone:null},
        {id:6,title:'Обнови Портфолио',desc:'3 работы Instagram',hint:'Хорошие фото = записи',reward:50,xp:80,period:'weekly',done:false,streak:0,lastDone:null},
        {id:7,title:'Варшавское Промо',desc:'Таргетированная реклама',hint:'ChatGPT для текста',reward:60,xp:100,period:'weekly',done:false,streak:0,lastDone:null},
        {id:8,title:'Еженедельный Отчет',desc:'Статистика',hint:'Для анализа демоном',reward:40,xp:70,period:'weekly',done:false,streak:0,lastDone:null}
    ],
    
    // Anxiety tracking
    anxietyLogs: [],
    sosSessions: [],
    
    // Sleep tracking
    sleepLogs: [],
    
    // Diary
    diary: [],
    
    // Bookings/Calendar
    bookings: [],
    
    // Achievements
    achievements: [
        // Financial
        {id:'first_1k',name:'Первая 1000',desc:'1000 zł в финподушке',icon:'💰',unlocked:false,category:'finance'},
        {id:'rent_3x',name:'Стабильная Аренда',desc:'3 раза оплатил вовремя',icon:'🏠',unlocked:false,category:'finance'},
        {id:'debt_500',name:'Минус Долги',desc:'Выплатил 500 по долгам',icon:'📉',unlocked:false,category:'finance'},
        {id:'green_week',name:'Зелёная Неделя',desc:'Неделя без "красного"',icon:'💚',unlocked:false,category:'finance'},
        
        // Professional
        {id:'portfolio_10',name:'10 Работ',desc:'10 работ в портфолио',icon:'🎨',unlocked:false,category:'pro'},
        {id:'warsaw_first',name:'Варшавский Дебют',desc:'Первый клиент Варшава',icon:'🏙️',unlocked:false,category:'pro'},
        {id:'warsaw_5x',name:'Варшава x5',desc:'5 клиентов подряд',icon:'🔥',unlocked:false,category:'pro'},
        {id:'original_design',name:'Авторский Дизайн',desc:'Реализован без коллажа',icon:'✨',unlocked:false,category:'pro'},
        
        // Health
        {id:'sleep_7d',name:'Неделя Сна',desc:'7 дней по 7+ часов',icon:'😴',unlocked:false,category:'health'},
        {id:'anxiety_low',name:'Спокойствие',desc:'Неделя тревоги <5',icon:'🧘',unlocked:false,category:'health'},
        {id:'diary_30d',name:'Месяц Дневника',desc:'30 дней заполнения',icon:'📔',unlocked:false,category:'health'},
        {id:'therapy_10',name:'Терапия x10',desc:'10 сессий психолога',icon:'💬',unlocked:false,category:'health'}
    ],
    
    bookings: [],
    rewards: []
};

let tempIncome = 0;
let tempDistribution = {};
let currentSOSType = '';
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth(); // 0-11

// ===== INIT =====
function load() {
    const saved = localStorage.getItem('demonDataV3');
    if (saved) {
        try { 
            const loaded = JSON.parse(saved);
            // Merge with defaults to ensure all fields exist
            data = {
                ...data,
                ...loaded,
                // Ensure arrays exist
                quests: loaded.quests && loaded.quests.length > 0 ? loaded.quests : data.quests,
                piggyBanks: loaded.piggyBanks && loaded.piggyBanks.length > 0 ? loaded.piggyBanks : data.piggyBanks,
                achievements: loaded.achievements && loaded.achievements.length > 0 ? loaded.achievements : data.achievements
            };
        }
        catch(e) { 
            console.error('Load failed, using defaults'); 
        }
    }
    
    // Log for debugging
    console.log('Data loaded:', {
        quests: data.quests.length,
        piggyBanks: data.piggyBanks.length,
        balance: data.balance,
        transactions: data.transactions.length
    });
    
    render();
}

function save() {
    localStorage.setItem('demonDataV3', JSON.stringify(data));
}

// RESET function for debugging
function resetData() {
    if(confirm('⚠️ ВНИМАНИЕ! Это удалит ВСЕ данные! Продолжить?')) {
        localStorage.removeItem('demonDataV3');
        location.reload();
    }
}

// ===== XP & LEVEL SYSTEM =====
function getXPForLevel(lvl) {
    return 100 + (lvl - 1) * 50; // Level 1: 100, Level 2: 150, etc
}

function addXP(amount) {
    data.xp += amount;
    const needed = getXPForLevel(data.level);
    
    while(data.xp >= needed) {
        data.xp -= needed;
        data.level++;
        alert(`🎉 LEVEL UP! Теперь уровень ${data.level}!`);
    }
    save();
}

// ===== RENDER =====
function render() {
    console.log('=== MAIN RENDER START ===');
    console.log('Data state:', {
        level: data.level,
        xp: data.xp,
        blood: data.blood,
        quests: data.quests ? data.quests.length : 0,
        piggyBanks: data.piggyBanks ? data.piggyBanks.length : 0,
        balance: data.balance
    });
    
    renderHome();
    console.log('✓ Home rendered');
    
    renderQuests();
    console.log('✓ Quests rendered');
    
    renderCalendar();
    console.log('✓ Calendar rendered');
    
    renderDiary();
    console.log('✓ Diary rendered');
    
    renderAnxiety();
    console.log('✓ Anxiety rendered');
    
    renderFinance();
    console.log('✓ Finance rendered');
    
    renderSleep();
    console.log('✓ Sleep rendered');
    
    renderAchievements();
    console.log('✓ Achievements rendered');
    
    // Update header
    document.getElementById('level').textContent = data.level;
    document.getElementById('xp').textContent = data.xp;
    document.getElementById('blood').textContent = data.blood;
    
    console.log('=== MAIN RENDER END ===');
}

function renderHome() {
    // XP Bar
    const needed = getXPForLevel(data.level);
    const pct = (data.xp / needed * 100).toFixed(0);
    document.getElementById('xpBar').style.width = pct + '%';
    document.getElementById('xpCurrent').textContent = data.xp;
    document.getElementById('xpNeeded').textContent = needed;
    document.getElementById('nextLevel').textContent = data.level + 1;
    
    // Finance
    document.getElementById('homeBalance').textContent = Math.round(data.balance);
    const cushion = data.piggyBanks.find(b=>b.id==='cushion');
    const toGoal = Math.max(0, cushion.goal - cushion.amount);
    document.getElementById('homeToGoal').textContent = Math.round(toGoal);
    const cushionPct = (cushion.amount / cushion.goal * 100).toFixed(0);
    document.getElementById('homeCushionProgress').style.width = cushionPct + '%';
    
    // Today's quests
    const today = data.quests.filter(q=>!q.done).slice(0,3);
    document.getElementById('todayQuests').innerHTML = today.length > 0 ? today.map(q=>`
        <div class="card">
            <div class="quest-row">
                <div class="checkbox ${q.done?'done':''}" onclick="toggleQuest(${q.id})"></div>
                <div class="quest-info">
                    <div class="card-title">${q.title} ${q.streak>0?`<span class="streak">🔥 ${q.streak}</span>`:''}</div>
                    <div class="card-desc">${q.desc}</div>
                    <div class="card-reward">+${q.reward} 🩸 +${q.xp} XP</div>
                </div>
            </div>
        </div>
    `).join('') : '<div class="card">Все квесты выполнены! 🎉</div>';
    
    // Bookings
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = data.bookings.filter(b=>!b.completed && b.date>=todayStr).slice(0,2);
    document.getElementById('homeBookings').innerHTML = upcoming.length>0 ? upcoming.map(b=>`
        <div class="card">
            <div class="card-title">${b.name}</div>
            <div class="card-desc">📅 ${formatDate(b.date)} в ${b.time} • ${b.city==='warsaw'?'🏙️ Варшава':'🚗 Сохачев'}</div>
            ${b.price?`<div style="font-size:12px; color:#9ac99a; font-weight:bold;">💰 ${b.price} zł</div>`:''}
        </div>
    `).join('') : '<div class="card">Нет записей на неделе</div>';
    
    // Anxiety
    const todayAnxiety = data.anxietyLogs.filter(l=>l.date===todayStr);
    const lastAnxiety = todayAnxiety.length > 0 ? todayAnxiety[todayAnxiety.length-1].before : null;
    document.getElementById('homeAnxiety').innerHTML = lastAnxiety ? `${lastAnxiety}/10` : '-/10';
}

function renderQuests() {
    console.log('=== RENDER QUESTS START ===');
    console.log('Total quests in data:', data.quests.length);
    
    const periods = {
        '4h': 'quests-4h',
        'daily': 'quests-daily', 
        'weekly': 'quests-weekly'
    };
    
    Object.keys(periods).forEach(p => {
        const containerId = periods[p];
        const container = document.getElementById(containerId);
        
        console.log(`Looking for container: ${containerId}`);
        
        if(!container) {
            console.error(`❌ Container NOT FOUND: ${containerId}`);
            return;
        }
        
        console.log(`✅ Container found: ${containerId}`);
        
        const qs = data.quests.filter(q=>q.period===p);
        console.log(`Period ${p}: ${qs.length} quests found`);
        
        if(qs.length === 0) {
            container.innerHTML = '<div class="card">Нет квестов в этой категории</div>';
            return;
        }
        
        const html = qs.map(q=>`
            <div class="card">
                <div class="quest-row">
                    <div class="checkbox ${q.done?'done':''}" onclick="toggleQuest(${q.id})"></div>
                    <div class="quest-info">
                        <div class="card-title">
                            ${q.title} 
                            ${q.streak>0?`<span class="streak">🔥 ${q.streak}</span>`:''}
                        </div>
                        <div class="card-desc">${q.desc}</div>
                        <div class="card-hint">💡 ${q.hint}</div>
                        <div class="card-reward">+${q.reward} 🩸 +${q.xp} XP</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log(`Setting HTML for ${containerId}, length: ${html.length}`);
        container.innerHTML = html;
    });
    
    console.log('=== RENDER QUESTS END ===');
}

function renderCalendar() {
    const year = calendarYear;
    const month = calendarMonth;
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    const currentDay = isCurrentMonth ? today.getDate() : -1;
    
    // Update month display
    const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    
    let html = '';
    for(let i = 0; i < startDay; i++) html += '<div class="cal-day"></div>';
    
    for(let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const dayBookings = data.bookings.filter(b => b.date === dateStr && !b.completed);
        const hasBooking = dayBookings.length > 0;
        const isToday = day === currentDay;
        
        let clientInfo = '';
        if(hasBooking && dayBookings[0]) {
            const b = dayBookings[0];
            const shortName = b.name.split(' ')[0];
            clientInfo = `
                <div class="cal-client-name">${shortName}</div>
                ${b.price?`<div class="cal-client-price">${b.price}zł</div>`:''}
            `;
        }
        
        html += `
            <div class="cal-day ${isToday?'today':''} ${hasBooking?'has-booking':''}" onclick="calendarDayClick('${dateStr}')">
                <div class="cal-day-num">${day}</div>
                ${clientInfo}
            </div>
        `;
    }
    document.getElementById('calendar').innerHTML = html;
    
    const todayStr = today.toISOString().split('T')[0];
    const upcoming = data.bookings.filter(b => !b.completed && b.date >= todayStr).sort((a,b) => new Date(a.date+' '+a.time) - new Date(b.date+' '+b.time));
    const completed = data.bookings.filter(b => b.completed).sort((a,b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0,5);
    
    document.getElementById('upcomingBookings').innerHTML = upcoming.length>0 ? upcoming.map(b=>`
        <div class="booking-card">
            <div class="booking-name">${b.name}</div>
            <div style="margin:5px 0;">
                <span class="booking-badge badge-${b.type}">${b.type==='new'?'✨ Новый':'🔄 Постоянный'}</span>
                <span class="booking-badge badge-${b.city}">${b.city==='warsaw'?'🏙️ Варшава':'🚗 Сохачев'}</span>
            </div>
            <div class="booking-info">📅 ${formatDate(b.date)} в ${b.time}</div>
            ${b.price?`<div class="booking-info">💰 ${b.price} zł</div>`:''}
            ${b.notes?`<div class="booking-info">📝 ${b.notes}</div>`:''}
            <div class="btn-row" style="margin-top:8px;">
                <button class="btn btn-small" style="background:#5a7a5a;" onclick="completeBooking(${b.id})">✓ Готово</button>
                <button class="btn btn-small" style="background:#666;" onclick="editBooking(${b.id})">✏️</button>
                <button class="btn btn-small" style="background:#c85050;" onclick="deleteBooking(${b.id})">✕</button>
            </div>
        </div>
    `).join('') : '<div class="card">Нет предстоящих записей</div>';
    
    document.getElementById('completedBookings').innerHTML = completed.length>0 ? completed.map(b=>`
        <div class="booking-card" style="opacity:0.7;">
            <div class="booking-name">✓ ${b.name}</div>
            <div class="booking-info">${formatDate(b.date)} • ${b.city==='warsaw'?'Варшава':'Сохачев'}</div>
            ${b.price?`<div class="booking-info" style="color:#9ac99a;">+${b.price} zł</div>`:''}
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

function changeMonth(delta) {
    calendarMonth += delta;
    if(calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
    } else if(calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
    }
    renderCalendar();
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
    `).join('') : '<div class="card">Начни вести дневник</div>';
}

function renderAnxiety() {
    const last7 = data.anxietyLogs.slice(-7).reverse();
    document.getElementById('anxietyHistory').innerHTML = last7.length>0 ? last7.map(l=>`
        <div class="card">
            <div class="card-title">${formatDate(l.date)} ${l.time}</div>
            <div class="card-desc">
                📍 ${getLocationName(l.location)} • 
                ${l.before}/10 ${l.after?`→ ${l.after}/10`:''} 
                ${l.after && l.after<l.before?'✓ Лучше':''}
            </div>
            ${l.trigger?`<div class="card-hint">Триггер: ${l.trigger}</div>`:''}
            ${l.thought?`<div class="card-hint">💭 "${l.thought}"</div>`:''}
        </div>
    `).join('') : '<div class="card">Пока нет записей</div>';
}

function renderFinance() {
    console.log('Rendering finance, balance:', data.balance);
    console.log('Piggy banks:', data.piggyBanks.length);
    console.log('Transactions:', data.transactions.length);
    
    document.getElementById('balance').textContent = Math.round(data.balance);
    
    // Forecast
    const avgIncome = calculateAvgIncome();
    const avgExpense = calculateAvgExpense();
    const monthly = avgIncome - avgExpense;
    
    const cushion = data.piggyBanks.find(b=>b.id==='cushion');
    const monthsToCushion = monthly>0 ? Math.ceil((cushion.goal - cushion.amount) / monthly) : '∞';
    
    document.getElementById('forecastBox').innerHTML = `
        <div class="forecast-box">
            <div class="forecast-title">📈 Прогноз</div>
            <div class="forecast-item">
                <span>Средний доход/мес:</span>
                <span style="color:#9ac99a;">${Math.round(avgIncome)} zł</span>
            </div>
            <div class="forecast-item">
                <span>Средний расход/мес:</span>
                <span style="color:#c85050;">${Math.round(avgExpense)} zł</span>
            </div>
            <div class="forecast-item">
                <span>Остаётся:</span>
                <span style="color:${monthly>0?'#9ac99a':'#c85050'};">${monthly>0?'+':''}${Math.round(monthly)} zł</span>
            </div>
            <div class="forecast-item">
                <span>Финподушка через:</span>
                <span style="color:#e8b896;">${monthsToCushion} мес</span>
            </div>
        </div>
    `;
    
    // Piggy banks
    const piggyBanksHtml = data.piggyBanks.map(b=>{
        const pct = b.goal>0 ? Math.min(100, (b.amount/b.goal*100)).toFixed(0) : 0;
        return `
            <div class="progress-box">
                <div class="progress-header">
                    <div class="progress-name">${b.name}</div>
                    <div class="progress-amount">${Math.round(b.amount)} ${b.goal>0?`/ ${b.goal}`:''} zł</div>
                </div>
                ${b.goal>0?`<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>`:''}
            </div>
        `;
    }).join('');
    
    document.getElementById('piggyBanks').innerHTML = piggyBanksHtml;
    console.log('Piggy banks HTML generated');
    
    // Transactions
    const recent = data.transactions.slice(-10).reverse();
    document.getElementById('transactionList').innerHTML = recent.length>0 ? recent.map(t=>`
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <div style="flex:1;">
                    <div class="card-title">${t.type==='income'?'💰 Доход':'💸 '+getCategoryName(t.category)}</div>
                    <div class="card-desc">${formatDateTime(t.date)}</div>
                    ${t.description?`<div class="card-desc">${t.description}</div>`:''}
                    <div style="font-size:18px; font-weight:bold; color:${t.type==='income'?'#9ac99a':'#c85050'}; margin-top:5px;">
                        ${t.type==='income'?'+':'-'}${Math.round(t.amount)} zł
                    </div>
                </div>
                <div style="display:flex; gap:5px;">
                    <button class="btn btn-small" style="width:auto; padding:5px 10px; margin:0; background:#c85050;" onclick="deleteTransaction(${t.id})">✕</button>
                </div>
            </div>
        </div>
    `).join('') : '<div class="card">Пока нет транзакций</div>';
    
    // Quick achievements
    const unlockedAch = data.achievements.filter(a=>a.unlocked).slice(0,3);
    document.getElementById('achievementsQuick').innerHTML = unlockedAch.length>0 ? unlockedAch.map(a=>`
        <div class="achievement">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${a.name} ✓</div>
                <div class="achievement-desc">${a.desc}</div>
            </div>
        </div>
    `).join('') : '<div class="card">Достижения появятся здесь</div>';
    
    console.log('Finance rendering complete');
}

function renderSleep() {
    const last7 = data.sleepLogs.slice(-7).reverse();
    
    // Insights
    const insights = calculateSleepInsights();
    document.getElementById('sleepInsights').innerHTML = insights.length>0 ? insights.map(i=>`
        <div class="insight-box">
            <div class="insight-icon">${i.icon}</div>
            <div class="insight-text">${i.text}</div>
        </div>
    `).join('') : '<div class="card">Заполни 3+ дня для инсайтов</div>';
    
    // History
    document.getElementById('sleepHistory').innerHTML = last7.length>0 ? last7.map(s=>{
        const hours = s.hours.toFixed(1);
        const quality = s.quality >= 7 ? 'good' : s.quality >= 4 ? 'ok' : 'bad';
        const qualityText = s.quality >= 7 ? '😊 Хорошо' : s.quality >= 4 ? '😐 Норм' : '😞 Плохо';
        
        return `
            <div class="sleep-entry">
                <div class="sleep-date">${formatDate(s.date)}</div>
                <div class="sleep-info">
                    🌙 ${hours}ч сна • 
                    <span class="sleep-quality quality-${quality}">${qualityText}</span>
                    ${s.wakeups>0?` • 😵 ${s.wakeups} раз проснулся`:''}
                </div>
                ${s.issues?`<div class="card-hint">${s.issues}</div>`:''}
            </div>
        `;
    }).join('') : '<div class="card">Начни отслеживать сон</div>';
}

function renderAchievements() {
    checkAchievements();
}

// ===== QUEST SYSTEM =====
function toggleQuest(id) {
    const q = data.quests.find(x=>x.id===id);
    if(!q) return;
    
    q.done = !q.done;
    const today = new Date().toISOString().split('T')[0];
    
    if(q.done) {
        data.blood += q.reward;
        addXP(q.xp);
        
        // Streak logic
        if(q.lastDone) {
            const lastDate = new Date(q.lastDone);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000*60*60*24));
            
            if(diffDays === 1) {
                q.streak++;
            } else if(diffDays > 1) {
                q.streak = 1;
            }
        } else {
            q.streak = 1;
        }
        q.lastDone = today;
        
        if(q.streak >= 7) {
            alert(`🔥 STREAK 7 ДНЕЙ! ${q.title}! +${q.xp*2} BONUS XP!`);
            addXP(q.xp);
        }
    } else {
        data.blood = Math.max(0, data.blood - q.reward);
    }
    
    save(); render();
}

// ===== ANXIETY SOS =====
function startSOS(type) {
    currentSOSType = type;
    
    const content = {
        breathing: `
            <div style="text-align:center; padding:20px;">
                <p style="margin-bottom:15px;">Дыши по схеме:</p>
                <div style="font-size:18px; line-height:2;">
                    <div>Вдох носом: <b>4 секунды</b></div>
                    <div>Задержка: <b>7 секунд</b></div>
                    <div>Выдох ртом: <b>8 секунд</b></div>
                </div>
                <p style="margin-top:15px; color:#888; font-size:12px;">Повтори 4 раза</p>
            </div>
        `,
        grounding: `
            <div style="padding:15px;">
                <p style="margin-bottom:10px; font-weight:bold;">Назови вслух:</p>
                <div style="line-height:1.8; font-size:13px;">
                    <div>👁️ 5 вещей которые ВИДИШЬ</div>
                    <div>👂 4 звука которые СЛЫШИШЬ</div>
                    <div>🤚 3 вещи которые ТРОГАЕШЬ</div>
                    <div>👃 2 запаха которые ЧУВСТВУЕШЬ</div>
                    <div>👅 1 вкус во РТУ</div>
                </div>
            </div>
        `,
        thoughts: `
            <div style="padding:15px;">
                <p style="margin-bottom:10px;">Запиши мысль которая крутится:</p>
                <textarea id="thoughtCapture" style="width:100%; min-height:60px; padding:8px; background:rgba(40,32,35,0.6); border:2px solid #8b4049; border-radius:8px; color:#d4c5ba; font-family:'Courier New',monospace;"></textarea>
                <p style="margin-top:10px; font-size:12px; color:#888;">Это скорее всего одно из:</p>
                <div style="font-size:11px; line-height:1.6; margin-top:5px;">
                    <div>• Катастрофизация ("Всё плохо")</div>
                    <div>• Чтение мыслей ("Они думают...")</div>
                    <div>• Чёрно-белое мышление</div>
                    <div>• "Должен" вместо "хочу"</div>
                </div>
            </div>
        `
    };
    
    const titles = {
        breathing: '🌬️ Дыхание 4-7-8',
        grounding: '🧊 Заземление 5-4-3-2-1',
        thoughts: '💭 Ловушка Мыслей'
    };
    
    document.getElementById('sosTitle').textContent = titles[type];
    document.getElementById('sosContent').innerHTML = content[type];
    showModal('sosModal');
}

function completeSOS() {
    const after = parseInt(document.getElementById('anxietyAfter').value);
    
    data.sosSessions.push({
        type: currentSOSType,
        date: new Date().toISOString(),
        anxietyAfter: after
    });
    
    data.blood += 10;
    addXP(15);
    
    save(); render(); closeModal('sosModal');
    alert('✓ Молодец! +10 🩸 +15 XP');
}

function showAnxietyLog() {
    showModal('anxietyModal');
}

function saveAnxietyLog() {
    const before = parseInt(document.getElementById('anxietyBefore').value);
    const trigger = document.getElementById('anxietyTrigger').value;
    const location = document.getElementById('anxietyLocation').value;
    const thought = document.getElementById('anxietyThought').value;
    
    data.anxietyLogs.push({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'}),
        before, trigger, location, thought
    });
    
    data.blood += 5;
    addXP(10);
    
    save(); render(); closeModal('anxietyModal');
}

// ===== SLEEP TRACKING =====
function showSleepLog() {
    showModal('sleepModal');
}

function saveSleep() {
    const bedTime = document.getElementById('sleepBedTime').value;
    const wakeTime = document.getElementById('sleepWakeTime').value;
    const quality = parseInt(document.getElementById('sleepQuality').value);
    const wakeups = parseInt(document.getElementById('sleepWakeups').value);
    const issues = document.getElementById('sleepIssues').value;
    
    // Calculate hours
    const bed = new Date('2000-01-01 ' + bedTime);
    let wake = new Date('2000-01-01 ' + wakeTime);
    if(wake < bed) wake = new Date('2000-01-02 ' + wakeTime);
    const hours = (wake - bed) / (1000*60*60);
    
    data.sleepLogs.push({
        date: new Date().toISOString().split('T')[0],
        bedTime, wakeTime, hours, quality, wakeups, issues
    });
    
    const reward = hours >= 7 ? 15 : 10;
    const xpReward = hours >= 7 ? 25 : 15;
    data.blood += reward;
    addXP(xpReward);
    
    save(); render(); closeModal('sleepModal');
    
    if(hours >= 7) {
        alert(`✓ Отлично! 7+ часов! +${reward} 🩸 +${xpReward} XP`);
    }
}

function calculateSleepInsights() {
    if(data.sleepLogs.length < 3) return [];
    
    const insights = [];
    const recent = data.sleepLogs.slice(-7);
    const avgHours = recent.reduce((s,l)=>s+l.hours,0) / recent.length;
    
    if(avgHours < 6.5) {
        insights.push({
            icon: '😴',
            text: `Средний сон: ${avgHours.toFixed(1)}ч. Это мало! Цель: 7+ часов для энергии и меньшей тревоги.`
        });
    } else if(avgHours >= 7) {
        insights.push({
            icon: '✅',
            text: `Отлично! Средний сон: ${avgHours.toFixed(1)}ч. Продолжай в том же духе!`
        });
    }
    
    // Correlations with anxiety
    if(data.anxietyLogs.length >= 3) {
        const anxietyDates = data.anxietyLogs.map(a=>a.date);
        const sleepDates = recent.map(s=>s.date);
        const poorSleepDays = recent.filter(s=>s.hours<6).map(s=>s.date);
        
        const anxietyAfterPoorSleep = anxietyDates.filter(d=>poorSleepDays.includes(d)).length;
        if(anxietyAfterPoorSleep >= 2) {
            insights.push({
                icon: '🔗',
                text: `Замечено: после плохого сна (<6ч) тревога выше. Связь сон→тревога подтверждена.`
            });
        }
    }
    
    return insights;
}

// ===== FINANCE =====
function calculateAvgIncome() {
    const incomes = data.transactions.filter(t=>t.type==='income');
    if(incomes.length === 0) return 0;
    return incomes.reduce((s,t)=>s+t.amount,0) / Math.max(1, incomes.length/3);
}

function calculateAvgExpense() {
    const expenses = data.transactions.filter(t=>t.type==='expense');
    if(expenses.length === 0) return 0;
    return expenses.reduce((s,t)=>s+t.amount,0) / Math.max(1, expenses.length/3);
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
        <div style="background:rgba(40,32,35,0.6); border:2px solid #8b4049; border-radius:8px; padding:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <div style="color:#d4957d; font-size:12px; font-weight:bold;">${b.name}</div>
            <input type="number" style="width:90px; text-align:right; background:rgba(40,32,35,0.6); border:2px solid #8b4049; border-radius:6px; padding:6px; color:#d4c5ba; font-family:'Courier New',monospace;" id="dist-${b.id}" value="${tempDistribution[b.id] || 0}" oninput="updateTotal()">
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
    const incomeId = Date.now();
    data.transactions.push({
        id: incomeId,
        type: 'income',
        amount: tempIncome,
        description: 'Доход',
        date: new Date().toISOString()
    });
    
    data.blood += 20;
    addXP(30);
    
    save(); 
    closeModal('distributionModal');
    render(); 
    document.getElementById('incomeAmount').value='';
    alert(`✓ Доход ${Math.round(tempIncome)} zł добавлен! +20 🩸 +30 XP`);
}

function showAddExpense() { showModal('expenseModal'); }

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const note = document.getElementById('expenseNote').value;
    if(!amount || amount<=0) return alert('Введи сумму!');
    
    data.balance -= amount;
    const expenseId = Date.now();
    data.transactions.push({
        id: expenseId,
        type: 'expense',
        amount: amount,
        category: category,
        description: note,
        date: new Date().toISOString()
    });
    
    save(); render(); closeModal('expenseModal');
    document.getElementById('expenseAmount').value='';
    document.getElementById('expenseNote').value='';
}

function deleteTransaction(id) {
    const t = data.transactions.find(x=>x.id===id);
    if(!t) return;
    
    if(!confirm(`Удалить транзакцию ${t.type==='income'?'+':'-'}${Math.round(t.amount)} zł?`)) return;
    
    // Reverse the balance change
    if(t.type === 'income') {
        data.balance -= t.amount;
        // Also reverse piggy bank allocations if this was an income
        // (this is complex, so for now just adjust balance)
    } else {
        data.balance += t.amount;
    }
    
    data.transactions = data.transactions.filter(x=>x.id!==id);
    save(); render();
}

// ===== ACHIEVEMENTS =====
function checkAchievements() {
    const cushion = data.piggyBanks.find(b=>b.id==='cushion');
    
    // First 1k
    const ach1k = data.achievements.find(a=>a.id==='first_1k');
    if(!ach1k.unlocked && cushion.amount >= 1000) {
        ach1k.unlocked = true;
        alert('🏆 ДОСТИЖЕНИЕ! Первая 1000 в подушке! +50 🩸 +80 XP');
        data.blood += 50;
        addXP(80);
    }
    
    // 7 days sleep
    if(data.sleepLogs.length >= 7) {
        const last7 = data.sleepLogs.slice(-7);
        const all7h = last7.every(s=>s.hours>=7);
        const achSleep = data.achievements.find(a=>a.id==='sleep_7d');
        if(!achSleep.unlocked && all7h) {
            achSleep.unlocked = true;
            alert('🏆 ДОСТИЖЕНИЕ! Неделя сна 7+ часов! +50 🩸 +80 XP');
            data.blood += 50;
            addXP(80);
        }
    }
    
    save();
}

// ===== EXPORT =====
function exportReport() {
    const report = {
        export_date: new Date().toISOString(),
        level: data.level,
        xp: data.xp,
        blood: data.blood,
        balance: data.balance,
        piggy_banks: data.piggyBanks.map(b=>({
            name:b.name, 
            amount:Math.round(b.amount), 
            goal:b.goal,
            progress: b.goal>0 ? Math.round(b.amount/b.goal*100) : 0
        })),
        quests: {
            total: data.quests.length,
            completed: data.quests.filter(q=>q.done).length,
            streaks: data.quests.filter(q=>q.streak>0).map(q=>({
                title:q.title, 
                streak:q.streak
            }))
        },
        anxiety: {
            total_logs: data.anxietyLogs.length,
            sos_sessions: data.sosSessions.length,
            last_7: data.anxietyLogs.slice(-7)
        },
        sleep: {
            total_logs: data.sleepLogs.length,
            avg_hours: data.sleepLogs.length>0 ? 
                (data.sleepLogs.reduce((s,l)=>s+l.hours,0)/data.sleepLogs.length).toFixed(1) : 0,
            last_7: data.sleepLogs.slice(-7)
        },
        achievements: {
            total: data.achievements.length,
            unlocked: data.achievements.filter(a=>a.unlocked).length,
            list: data.achievements.filter(a=>a.unlocked).map(a=>a.name)
        },
        bookings: data.bookings.filter(b=>b.completed).length
    };
    
    const json = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(json).then(()=>{
        alert('📋 Отчет скопирован! Отправь Клоду для анализа.');
    }).catch(()=>{
        prompt('Скопируй отчет:', json);
    });
}

// ===== UI HELPERS =====
function switchTab(name) {
    console.log('Switching to tab:', name);
    
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-'+name).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    
    // Find and activate the correct nav button
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        if(btn.getAttribute('data-tab') === name) {
            btn.classList.add('active');
        }
    });
    
    // Force re-render for specific tabs to ensure content is displayed
    if(name === 'quests') {
        console.log('Force rendering quests...');
        renderQuests();
    } else if(name === 'finance') {
        console.log('Force rendering finance...');
        renderFinance();
    }
}

function showModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
}

function formatDateTime(dateStr) {
    const d = new Date(dateStr);
    const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${d.getDate()} ${months[d.getMonth()]} ${hours}:${minutes}`;
}

function getCategoryName(cat) {
    const names = {
        rent:'Аренда', food:'Еда', transport:'Дорога', 
        medicine:'Лекарства', doctor:'Врач', debt:'Долги', 
        education:'Обучение', other:'Другое'
    };
    return names[cat] || 'Другое';
}

function getLocationName(loc) {
    const names = {
        home:'🏠 Дома', warsaw:'🏙️ Варшава', 
        sochaczew:'🚗 Сохачев', road:'🛣️ В дороге'
    };
    return names[loc] || loc;
}

// ===== DIARY =====
function showDiaryForm() { showModal('diaryFormModal'); }

function saveDiary() {
    const entry = {
        date: new Date().toISOString().split('T')[0],
        mood: document.getElementById('diaryMood').value,
        energy: document.getElementById('diaryEnergy').value,
        anxiety: document.getElementById('diaryAnxiety').value,
        steps: document.getElementById('diarySteps').value,
        achievements: document.getElementById('diaryAchievements').value,
        struggles: document.getElementById('diaryStruggles').value,
        timestamp: new Date().toISOString()
    };
    data.diary.push(entry);
    data.blood += 20;
    addXP(30);
    save(); render(); closeModal('diaryFormModal');
    document.getElementById('diarySteps').value='';
    document.getElementById('diaryAchievements').value='';
    document.getElementById('diaryStruggles').value='';
    alert('✓ Дневник сохранён! +20 🩸 +30 XP');
}

// ===== CALENDAR / BOOKINGS =====
function calendarDayClick(dateStr) {
    const dayBookings = data.bookings.filter(b => b.date === dateStr && !b.completed);
    if(dayBookings.length > 0) {
        // Show first booking for editing
        editBooking(dayBookings[0].id);
    } else {
        // Create new booking for this date
        document.getElementById('bookingEditId').value = '';
        document.getElementById('bookingModalTitle').textContent = '📅 Новая Запись';
        document.getElementById('bookingDate').value = dateStr;
        document.getElementById('bookingTime').value = '12:00';
        document.getElementById('bookingName').value = '';
        document.getElementById('bookingCity').value = 'warsaw';
        document.getElementById('bookingType').value = 'new';
        document.getElementById('bookingPrice').value = '';
        document.getElementById('bookingNotes').value = '';
        showModal('bookingModal');
    }
}

function showAddBooking() {
    document.getElementById('bookingEditId').value = '';
    document.getElementById('bookingModalTitle').textContent = '📅 Новая Запись';
    document.getElementById('bookingDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('bookingTime').value = '12:00';
    document.getElementById('bookingName').value = '';
    document.getElementById('bookingCity').value = 'warsaw';
    document.getElementById('bookingType').value = 'new';
    document.getElementById('bookingPrice').value = '';
    document.getElementById('bookingNotes').value = '';
    showModal('bookingModal');
}

function editBooking(id) {
    const b = data.bookings.find(x=>x.id===id);
    if(!b) return;
    
    document.getElementById('bookingEditId').value = id;
    document.getElementById('bookingModalTitle').textContent = '✏️ Изменить Запись';
    document.getElementById('bookingDate').value = b.date;
    document.getElementById('bookingTime').value = b.time;
    document.getElementById('bookingName').value = b.name;
    document.getElementById('bookingCity').value = b.city;
    document.getElementById('bookingType').value = b.type;
    document.getElementById('bookingPrice').value = b.price || '';
    document.getElementById('bookingNotes').value = b.notes || '';
    showModal('bookingModal');
}

function saveBooking() {
    const editId = document.getElementById('bookingEditId').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const name = document.getElementById('bookingName').value;
    const city = document.getElementById('bookingCity').value;
    const type = document.getElementById('bookingType').value;
    const price = parseFloat(document.getElementById('bookingPrice').value) || 0;
    const notes = document.getElementById('bookingNotes').value;
    
    if(!date || !name) return alert('Заполни дату и имя!');
    
    if(editId) {
        // Edit existing
        const b = data.bookings.find(x=>x.id==editId);
        if(b) {
            b.date = date;
            b.time = time;
            b.name = name;
            b.city = city;
            b.type = type;
            b.price = price;
            b.notes = notes;
        }
    } else {
        // Create new
        data.bookings.push({
            id: Date.now(), date, time, name, city, type, price, notes,
            completed: false, createdAt: new Date().toISOString()
        });
    }
    
    save(); render(); closeModal('bookingModal');
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
    addXP(50);
    save(); render();
}

function deleteBooking(id) {
    if(!confirm('Удалить запись?')) return;
    data.bookings = data.bookings.filter(b=>b.id!==id);
    save(); render();
}

// ===== INIT =====
window.onload = function() {
    console.log('=== APP STARTING ===');
    console.log('DOM loaded, initializing...');
    
    load();
    
    console.log('Checking if containers exist:');
    console.log('quests-4h:', document.getElementById('quests-4h') ? 'YES' : 'NO');
    console.log('quests-daily:', document.getElementById('quests-daily') ? 'YES' : 'NO');
    console.log('quests-weekly:', document.getElementById('quests-weekly') ? 'YES' : 'NO');
    console.log('piggyBanks:', document.getElementById('piggyBanks') ? 'YES' : 'NO');
    console.log('transactionList:', document.getElementById('transactionList') ? 'YES' : 'NO');
    
    console.log('=== APP STARTED ===');
};
