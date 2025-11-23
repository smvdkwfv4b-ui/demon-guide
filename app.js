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

// ===== INIT =====
function load() {
    const saved = localStorage.getItem('demonDataV3');
    if (saved) {
        try { 
            const loaded = JSON.parse(saved);
            data = {...data, ...loaded};
        }
        catch(e) { console.error('Load failed'); }
    }
    render();
}

function save() {
    localStorage.setItem('demonDataV3', JSON.stringify(data));
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
    renderHome();
    renderQuests();
    renderAnxiety();
    renderFinance();
    renderSleep();
    renderAchievements();
    renderStats();
    
    // Update header
    document.getElementById('level').textContent = data.level;
    document.getElementById('xp').textContent = data.xp;
    document.getElementById('blood').textContent = data.blood;
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
    ['4h','daily','weekly'].forEach(p => {
        const qs = data.quests.filter(q=>q.period===p);
        document.getElementById(`quests-${p}`).innerHTML = qs.map(q=>`
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
    });
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
                <span style="color:#d4957d;">${monthsToCushion} мес</span>
            </div>
        </div>
    `;
    
    // Piggy banks
    document.getElementById('piggyBanks').innerHTML = data.piggyBanks.map(b=>{
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
    
    // Transactions
    const recent = data.transactions.slice(-10).reverse();
    document.getElementById('transactionList').innerHTML = recent.length>0 ? recent.map(t=>`
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div class="card-title">${t.type==='income'?'💰 Доход':'💸 '+getCategoryName(t.category)}</div>
                    <div class="card-desc">${formatDateTime(t.date)}</div>
                    ${t.description?`<div class="card-desc">${t.description}</div>`:''}
                </div>
                <div style="font-size:18px; font-weight:bold; color:${t.type==='income'?'#9ac99a':'#c85050'};">
                    ${t.type==='income'?'+':'-'}${Math.round(t.amount)} zł
                </div>
            </div>
        </div>
    `).join('') : '<div class="card">Пока нет транзакций</div>';
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
    ['finance','pro','health'].forEach(cat=>{
        const achievements = data.achievements.filter(a=>a.category===cat);
        const container = document.getElementById(`achievements${cat==='finance'?'Finance':cat==='pro'?'Pro':'Health'}`);
        container.innerHTML = achievements.map(a=>`
            <div class="achievement ${a.unlocked?'':'locked'}">
                <div class="achievement-icon">${a.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${a.name} ${a.unlocked?'✓':''}</div>
                    <div class="achievement-desc">${a.desc}</div>
                </div>
            </div>
        `).join('');
    });
    
    checkAchievements();
}

function renderStats() {
    document.getElementById('statLevel').textContent = data.level;
    document.getElementById('statBlood').textContent = data.blood;
    document.getElementById('statQuests').textContent = data.quests.filter(q=>q.done).length;
    document.getElementById('statWork').textContent = data.bookings.filter(b=>b.completed).length;
    
    document.getElementById('statsProgress').innerHTML = data.piggyBanks.map(b=>{
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
    
    save(); render(); closeModal('distributionModal');
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
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-'+name).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    event.currentTarget.classList.add('active');
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

// ===== INIT =====
window.onload = load;
