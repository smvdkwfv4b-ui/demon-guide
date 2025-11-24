<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Демон-Гайд">
    <meta name="theme-color" content="#8b4049">
    <link rel="manifest" href="./manifest.json">
    <link rel="apple-touch-icon" href="./icon-192.png">
    <title>Демон-Гайд 😈</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        html, body { width: 100%; height: 100%; overflow: hidden; position: fixed; }
        body { 
            font-family: 'Courier New', monospace; 
            background: #1a1a1a;
            color: #e8e8e8; 
        }
        
        .app { display: flex; flex-direction: column; height: 100vh; height: 100dvh; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #1a1a1a; }
        
        .header { 
            background: #0d0d0d;
            padding: 12px 15px; 
            padding-top: max(12px, env(safe-area-inset-top)); 
            border-bottom: 2px solid #8b4049; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            flex-shrink: 0; 
        }
        .header-left { display: flex; align-items: center; gap: 10px; }
        .avatar { font-size: 32px; }
        .user-name { font-size: 15px; color: #e8b896; font-weight: bold; }
        .user-level { font-size: 10px; color: #999; }
        .header-stats { display: flex; gap: 8px; }
        .stat-pill { 
            background: rgba(139,64,73,0.4); 
            padding: 6px 12px; 
            border-radius: 15px; 
            border: 1px solid #8b4049; 
            font-size: 11px;
            font-weight: bold;
            color: #fff;
        }
        
        .content { flex: 1; overflow: hidden; position: relative; min-height: 0; background: #1a1a1a; }
        .screen { display: none; height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 12px; padding-bottom: max(80px, calc(80px + env(safe-area-inset-bottom))); }
        .screen.active { display: block; }
        
        .nav { 
            position: fixed; 
            bottom: 0; 
            left: 0; 
            right: 0; 
            background: #0d0d0d;
            border-top: 2px solid #8b4049; 
            padding: 8px 5px; 
            padding-bottom: max(8px, env(safe-area-inset-bottom)); 
            display: flex; 
            justify-content: space-around; 
            z-index: 1000; 
        }
        .nav-btn { 
            background: none; 
            border: none; 
            color: #999; 
            cursor: pointer; 
            padding: 6px; 
            border-radius: 8px; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            gap: 3px; 
            min-width: 50px; 
            transition: all 0.3s; 
        }
        .nav-btn.active { background: rgba(139,64,73,0.4); color: #e8b896; }
        .nav-icon { font-size: 20px; }
        .nav-label { font-size: 8px; font-weight: bold; }
        
        .dashboard-grid { display: grid; gap: 10px; margin-bottom: 12px; }
        .dash-card { 
            background: #2a2a2a;
            border: 2px solid #8b4049; 
            border-radius: 12px; 
            padding: 12px; 
        }
        .dash-title { font-size: 12px; color: #e8b896; font-weight: bold; margin-bottom: 8px; }
        .dash-content { font-size: 13px; color: #e8e8e8; }
        
        .xp-bar { 
            width: 100%; 
            height: 8px; 
            background: #0d0d0d;
            border-radius: 10px; 
            overflow: hidden; 
            margin: 6px 0; 
        }
        .xp-fill { 
            height: 100%; 
            background: linear-gradient(90deg, #8b4049, #a0525c); 
            transition: width 0.5s; 
            border-radius: 10px; 
        }
        
        .section { 
            font-size: 13px; 
            font-weight: bold; 
            color: #e8b896; 
            margin: 12px 0 8px; 
            padding-bottom: 5px; 
            border-bottom: 2px solid #8b4049; 
        }
        
        .card { 
            background: #2a2a2a;
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 10px; 
            margin-bottom: 8px; 
        }
        .card-title { font-size: 13px; font-weight: bold; color: #e8b896; margin-bottom: 4px; }
        .card-desc { font-size: 11px; color: #bbb; margin-bottom: 4px; }
        .card-hint { font-size: 10px; color: #999; font-style: italic; padding: 4px; background: rgba(0,0,0,0.5); border-radius: 4px; border-left: 2px solid #8b4049; margin-bottom: 4px; }
        .card-reward { font-size: 11px; color: #e8b896; font-weight: bold; }
        
        .quest-row { display: flex; align-items: start; gap: 8px; }
        .quest-info { flex: 1; }
        .checkbox { 
            width: 20px; 
            height: 20px; 
            border: 2px solid #8b4049; 
            border-radius: 50%; 
            cursor: pointer; 
            display: inline-flex; 
            align-items: center; 
            justify-content: center; 
            transition: all 0.3s; 
            flex-shrink: 0;
            background: #1a1a1a;
        }
        .checkbox.done { background: #5a7a5a; border-color: #6a9a6a; }
        .checkbox.done::after { content: '✓'; color: white; font-weight: bold; font-size: 12px; }
        
        .streak { 
            display: inline-flex; 
            align-items: center; 
            gap: 3px; 
            background: rgba(255,140,0,0.3); 
            padding: 2px 6px; 
            border-radius: 8px; 
            font-size: 10px; 
            color: #ff8c00; 
            border: 1px solid #ff8c00; 
        }
        
        .btn { 
            width: 100%; 
            background: linear-gradient(135deg, #8b4049, #a0525c); 
            color: white; 
            border: none; 
            padding: 10px; 
            border-radius: 10px; 
            font-size: 13px; 
            font-weight: bold; 
            cursor: pointer; 
            margin: 5px 0; 
            font-family: 'Courier New', monospace; 
        }
        .btn:active { transform: scale(0.98); }
        .btn-small { padding: 7px; font-size: 11px; }
        .btn-secondary { background: #666; }
        
        .modal { 
            display: none; 
            position: fixed; 
            inset: 0; 
            background: rgba(0,0,0,0.95); 
            z-index: 2000; 
            align-items: center; 
            justify-content: center; 
            padding: 15px; 
            overflow-y: auto; 
        }
        .modal.show { display: flex; }
        .modal-box { 
            background: #1a1a1a;
            border: 2px solid #8b4049; 
            border-radius: 12px; 
            padding: 15px; 
            max-width: 500px; 
            width: 100%; 
            max-height: 85vh; 
            overflow-y: auto; 
            margin: auto; 
        }
        .modal-box h3 { color: #e8b896; margin-bottom: 12px; text-align: center; font-size: 16px; }
        .modal-box label { display: block; color: #e8b896; margin: 10px 0 4px; font-size: 12px; font-weight: bold; }
        .modal-box input, .modal-box textarea, .modal-box select { 
            width: 100%; 
            background: #2a2a2a;
            border: 2px solid #8b4049; 
            border-radius: 8px; 
            padding: 8px; 
            color: #e8e8e8; 
            font-family: 'Courier New', monospace; 
            font-size: 13px; 
        }
        .modal-box textarea { resize: vertical; min-height: 50px; }
        .modal-close { background: #555; }
        
        .sos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .sos-btn { 
            background: rgba(139,64,73,0.4);
            border: 2px solid #8b4049; 
            padding: 15px 10px; 
            border-radius: 10px; 
            cursor: pointer; 
            text-align: center; 
            transition: all 0.3s; 
        }
        .sos-btn:active { transform: scale(0.95); background: rgba(139,64,73,0.6); }
        .sos-icon { font-size: 28px; margin-bottom: 5px; }
        .sos-title { font-size: 11px; font-weight: bold; color: #e8b896; }
        .sos-time { font-size: 9px; color: #999; }
        
        .achievement { 
            background: #2a2a2a;
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 10px; 
            margin-bottom: 8px; 
            display: flex; 
            align-items: center; 
            gap: 10px; 
        }
        .achievement.locked { opacity: 0.4; }
        .achievement-icon { font-size: 32px; }
        .achievement-info { flex: 1; }
        .achievement-name { font-size: 12px; font-weight: bold; color: #e8b896; }
        .achievement-desc { font-size: 10px; color: #999; }
        
        .progress-box { 
            background: #2a2a2a;
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 10px; 
            margin-bottom: 8px; 
        }
        .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .progress-name { font-size: 12px; font-weight: bold; color: #e8b896; }
        .progress-amount { font-size: 12px; color: #9ac99a; font-weight: bold; }
        .progress-bar { 
            width: 100%; 
            height: 6px; 
            background: #0d0d0d;
            border-radius: 10px; 
            overflow: hidden; 
        }
        .progress-fill { 
            height: 100%; 
            background: linear-gradient(90deg, #8b4049, #a0525c); 
            transition: width 0.5s; 
            border-radius: 10px; 
        }
        
        .sleep-entry { 
            background: #2a2a2a;
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 10px; 
            margin-bottom: 8px; 
        }
        .sleep-date { font-size: 12px; font-weight: bold; color: #e8b896; margin-bottom: 4px; }
        .sleep-info { font-size: 11px; color: #bbb; }
        .sleep-quality { display: inline-block; padding: 2px 6px; border-radius: 8px; font-size: 10px; }
        .quality-good { background: rgba(154,201,154,0.3); color: #9ac99a; }
        .quality-ok { background: rgba(255,165,0,0.3); color: #ffa500; }
        .quality-bad { background: rgba(200,80,80,0.3); color: #c85050; }
        
        .forecast-box { 
            background: rgba(139,64,73,0.2); 
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 12px; 
            margin-bottom: 10px; 
        }
        .forecast-title { font-size: 13px; font-weight: bold; color: #e8b896; margin-bottom: 8px; }
        .forecast-item { 
            display: flex; 
            justify-content: space-between; 
            padding: 5px 0; 
            font-size: 11px; 
            border-bottom: 1px solid rgba(139,64,73,0.3);
            color: #e8e8e8;
        }
        .forecast-item:last-child { border-bottom: none; }
        
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        .stat { 
            background: #2a2a2a;
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 10px; 
            text-align: center; 
        }
        .stat-label { font-size: 9px; color: #999; text-transform: uppercase; margin-bottom: 4px; }
        .stat-value { font-size: 22px; font-weight: bold; color: #e8b896; }
        
        .cal-day { 
            aspect-ratio: 1; 
            background: #2a2a2a;
            border: 1px solid #8b4049; 
            border-radius: 6px; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            font-size: 10px; 
            cursor: pointer; 
            position: relative; 
            padding: 3px 2px; 
            color: #e8e8e8;
        }
        .cal-day.today { border: 2px solid #e8b896; background: rgba(232,184,150,0.1); }
        .cal-day.has-booking { background: linear-gradient(135deg, rgba(139,64,73,0.6), rgba(160,82,92,0.4)); }
        .cal-day-num { font-weight: bold; }
        .cal-client-name { font-size: 7px; color: #e8b896; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .cal-client-price { font-size: 7px; color: #9ac99a; font-weight: bold; }
        
        .booking-card { 
            background: #2a2a2a;
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 10px; 
            margin-bottom: 8px; 
        }
        .booking-name { font-size: 13px; font-weight: bold; color: #e8b896; margin-bottom: 4px; }
        .booking-info { font-size: 11px; color: #bbb; margin: 3px 0; }
        .booking-badge { 
            display: inline-block; 
            font-size: 9px; 
            padding: 2px 6px; 
            border-radius: 8px; 
            font-weight: bold; 
            margin-right: 4px; 
        }
        .badge-new { background: rgba(154,201,154,0.3); color: #9ac99a; border: 1px solid #9ac99a; }
        .badge-return { background: rgba(100,149,237,0.3); color: #6495ed; border: 1px solid #6495ed; }
        .badge-warsaw { background: rgba(154,201,154,0.3); color: #9ac99a; border: 1px solid #9ac99a; }
        .badge-sochaczew { background: rgba(255,140,0,0.3); color: #ff8c00; border: 1px solid #ff8c00; }
        
        .insight-box { 
            background: rgba(139,64,73,0.2); 
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 12px; 
            margin-bottom: 10px; 
        }
        .insight-icon { font-size: 24px; margin-bottom: 5px; }
        .insight-text { font-size: 12px; line-height: 1.5; color: #e8e8e8; }
        
        .slider-container { margin: 8px 0; }
        .slider-label { 
            display: flex; 
            justify-content: space-between; 
            font-size: 11px; 
            margin-bottom: 4px;
            color: #e8e8e8;
        }
        .slider { width: 100%; }
        
        .btn-row { display: flex; gap: 6px; }
        .btn-row .btn { margin: 0; }
        
        .cal-day { 
            aspect-ratio: 1; 
            background: rgba(40,32,35,0.6); 
            border: 1px solid #8b4049; 
            border-radius: 6px; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            font-size: 10px; 
            cursor: pointer; 
            position: relative; 
            padding: 3px 2px; 
            color: #d4c5ba;
        }
        .cal-day.today { border: 2px solid #d4957d; }
        .cal-day.has-booking { background: linear-gradient(135deg, rgba(139,64,73,0.5), rgba(160,82,92,0.3)); }
        .cal-day-num { font-weight: bold; }
        .cal-client-name { font-size: 7px; color: #d4957d; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .cal-client-price { font-size: 7px; color: #9ac99a; font-weight: bold; }
        
        .booking-card { 
            background: rgba(40,32,35,0.8); 
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 10px; 
            margin-bottom: 8px; 
        }
        .booking-name { font-size: 13px; font-weight: bold; color: #d4957d; margin-bottom: 4px; }
        .booking-info { font-size: 11px; color: #aaa; margin: 3px 0; }
        .booking-badge { 
            display: inline-block; 
            font-size: 9px; 
            padding: 2px 6px; 
            border-radius: 8px; 
            font-weight: bold; 
            margin-right: 4px; 
        }
        .badge-new { background: rgba(154,201,154,0.3); color: #9ac99a; border: 1px solid #9ac99a; }
        .badge-return { background: rgba(100,149,237,0.3); color: #6495ed; border: 1px solid #6495ed; }
        .badge-warsaw { background: rgba(154,201,154,0.3); color: #9ac99a; border: 1px solid #9ac99a; }
        .badge-sochaczew { background: rgba(255,140,0,0.3); color: #ff8c00; border: 1px solid #ff8c00; }
        
        .insight-box { 
            background: rgba(139,64,73,0.2); 
            border: 2px solid #8b4049; 
            border-radius: 10px; 
            padding: 12px; 
            margin-bottom: 10px; 
        }
        .insight-icon { font-size: 24px; margin-bottom: 5px; }
        .insight-text { font-size: 12px; line-height: 1.5; color: #d4c5ba; }
        
        .slider-container { margin: 8px 0; }
        .slider-label { 
            display: flex; 
            justify-content: space-between; 
            font-size: 11px; 
            margin-bottom: 4px; 
        }
        .slider { width: 100%; }
        
        .btn-row { display: flex; gap: 6px; }
        .btn-row .btn { margin: 0; }
    </style>
</head>
<body>
    <div class="app">
        <div class="header">
            <div class="header-left">
                <div class="avatar">😈</div>
                <div>
                    <div class="user-name">Антон</div>
                    <div class="user-level">Уровень <span id="level">5</span></div>
                </div>
            </div>
            <div class="header-stats">
                <div class="stat-pill">⚡ <span id="xp">0</span></div>
                <div class="stat-pill">🩸 <span id="blood">0</span></div>
            </div>
        </div>
        
        <div class="content">
            <!-- ГЛАВНАЯ -->
            <div class="screen active" id="screen-home">
                <div class="dashboard-grid">
                    <div class="dash-card">
                        <div class="dash-title">⚡ Прогресс</div>
                        <div class="dash-content">
                            <div style="font-size:11px; color:#888; margin-bottom:4px;">До уровня <span id="nextLevel">6</span></div>
                            <div class="xp-bar">
                                <div class="xp-fill" id="xpBar" style="width:0%"></div>
                            </div>
                            <div style="font-size:10px; color:#888;"><span id="xpCurrent">0</span> / <span id="xpNeeded">100</span> XP</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">🎯 Квесты на Сегодня</div>
                <div id="todayQuests"></div>
                
                <div class="section">💰 Финансы</div>
                <div class="dash-card">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <div>
                            <div style="font-size:10px; color:#888;">Баланс</div>
                            <div style="font-size:20px; font-weight:bold; color:#9ac99a;"><span id="homeBalance">0</span> zł</div>
                        </div>
                        <div>
                            <div style="font-size:10px; color:#888;">До подушки</div>
                            <div style="font-size:16px; font-weight:bold; color:#d4957d;"><span id="homeToGoal">5000</span> zł</div>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="homeCushionProgress" style="width:0%"></div>
                    </div>
                </div>
                
                <div class="section">📅 Записи на Неделе</div>
                <div id="homeBookings"></div>
                
                <button class="btn" onclick="exportReport()" style="margin-top:15px;">📊 Экспорт для Клода</button>
            </div>
            
            <!-- КВЕСТЫ -->
            <div class="screen" id="screen-quests">
                <div class="section">⏰ Каждые 4 часа</div>
                <div id="quests-4h"></div>
                <div class="section">📅 Ежедневные</div>
                <div id="quests-daily"></div>
                <div class="section">📆 Еженедельные</div>
                <div id="quests-weekly"></div>
            </div>
            
            <!-- КАЛЕНДАРЬ -->
            <div class="screen" id="screen-calendar">
                <div class="stat-grid" style="margin-bottom:12px;">
                    <div class="stat"><div class="stat-label">Всего</div><div class="stat-value"><span id="stat-total">0</span></div></div>
                    <div class="stat"><div class="stat-label">Варшава</div><div class="stat-value"><span id="stat-warsaw">0</span></div></div>
                    <div class="stat"><div class="stat-label">Сохачев</div><div class="stat-value"><span id="stat-sochaczew">0</span></div></div>
                    <div class="stat"><div class="stat-label">Новых</div><div class="stat-value"><span id="stat-new">0</span></div></div>
                </div>
                <button class="btn" onclick="showAddBooking()">➕ Добавить Запись</button>
                <div class="section">📅 Календарь</div>
                <div style="display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin-bottom:6px; text-align:center; font-size:9px; color:#888; font-weight:bold;">
                    <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
                </div>
                <div id="calendar" style="display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin-bottom:12px;"></div>
                <div class="section">📋 Предстоящие</div>
                <div id="upcomingBookings"></div>
                <div class="section">✅ Завершённые</div>
                <div id="completedBookings"></div>
            </div>
            
            <!-- ДНЕВНИК -->
            <div class="screen" id="screen-diary">
                <button class="btn" onclick="showDiaryForm()">📝 Записать День</button>
                <div class="section">📖 История</div>
                <div id="diaryHistory"></div>
            </div>
            
            <!-- ТРЕВОГА SOS -->
            <div class="screen" id="screen-anxiety">
                <div class="section">🚨 Быстрая Помощь</div>
                <div class="sos-grid">
                    <div class="sos-btn" onclick="startSOS('breathing')">
                        <div class="sos-icon">🌬️</div>
                        <div class="sos-title">Дыхание 4-7-8</div>
                        <div class="sos-time">1 минута</div>
                    </div>
                    <div class="sos-btn" onclick="startSOS('grounding')">
                        <div class="sos-icon">🧊</div>
                        <div class="sos-title">Заземление</div>
                        <div class="sos-time">2 минуты</div>
                    </div>
                    <div class="sos-btn" onclick="startSOS('thoughts')">
                        <div class="sos-icon">💭</div>
                        <div class="sos-title">Ловушка Мыслей</div>
                        <div class="sos-time">3 минуты</div>
                    </div>
                    <div class="sos-btn" onclick="showAnxietyLog()">
                        <div class="sos-icon">📝</div>
                        <div class="sos-title">Журнал</div>
                        <div class="sos-time">Триггеры</div>
                    </div>
                </div>
                
                <div class="section">📊 История Тревоги</div>
                <div id="anxietyHistory"></div>
                
                <div class="section">😴 Журнал Сна</div>
                <button class="btn" onclick="showSleepLog()">📝 Записать Сон</button>
                <div id="sleepInsights" style="margin-top:10px;"></div>
                <div id="sleepHistory"></div>
            </div>
            
            <!-- ФИНАНСЫ -->
            <div class="screen" id="screen-finance">
                <div class="dash-card" style="text-align:center; margin-bottom:12px;">
                    <div style="font-size:11px; color:#888;">Баланс</div>
                    <div style="font-size:28px; font-weight:bold; color:#9ac99a; margin:5px 0;"><span id="balance">0</span> zł</div>
                    <div class="btn-row">
                        <button class="btn" onclick="showAddIncome()">💰 Доход</button>
                        <button class="btn" onclick="showAddExpense()">💸 Расход</button>
                    </div>
                </div>
                
                <div class="section">🎯 Прогноз</div>
                <div id="forecastBox"></div>
                
                <div class="section">🏺 Копилки</div>
                <div id="piggyBanks"></div>
                
                <div class="section">📊 Транзакции</div>
                <div id="transactionList"></div>
                
                <div class="section">🏆 Достижения</div>
                <div id="achievementsQuick"></div>
            </div>
        </div>
        
        <div class="nav">
            <button class="nav-btn active" data-tab="home" onclick="switchTab('home')">
                <div class="nav-icon">🏠</div><div class="nav-label">Главная</div>
            </button>
            <button class="nav-btn" data-tab="quests" onclick="switchTab('quests')">
                <div class="nav-icon">⚔️</div><div class="nav-label">Квесты</div>
            </button>
            <button class="nav-btn" data-tab="calendar" onclick="switchTab('calendar')">
                <div class="nav-icon">📅</div><div class="nav-label">Записи</div>
            </button>
            <button class="nav-btn" data-tab="diary" onclick="switchTab('diary')">
                <div class="nav-icon">📔</div><div class="nav-label">Дневник</div>
            </button>
            <button class="nav-btn" data-tab="finance" onclick="switchTab('finance')">
                <div class="nav-icon">💰</div><div class="nav-label">Финансы</div>
            </button>
            <button class="nav-btn" data-tab="anxiety" onclick="switchTab('anxiety')">
                <div class="nav-icon">😰</div><div class="nav-label">Тревога</div>
            </button>
        </div>
    </div>
    
    <!-- MODALS -->
    <div class="modal" id="diaryFormModal">
        <div class="modal-box">
            <h3>📔 Дневник за Сегодня</h3>
            <div class="slider-container">
                <div class="slider-label">
                    <span>Настроение:</span>
                    <span id="diaryMoodVal">5</span>
                </div>
                <input type="range" class="slider" id="diaryMood" min="1" max="10" value="5" oninput="document.getElementById('diaryMoodVal').textContent=this.value">
            </div>
            <div class="slider-container">
                <div class="slider-label">
                    <span>Энергия:</span>
                    <span id="diaryEnergyVal">5</span>
                </div>
                <input type="range" class="slider" id="diaryEnergy" min="1" max="10" value="5" oninput="document.getElementById('diaryEnergyVal').textContent=this.value">
            </div>
            <div class="slider-container">
                <div class="slider-label">
                    <span>Тревога:</span>
                    <span id="diaryAnxietyVal">5</span>
                </div>
                <input type="range" class="slider" id="diaryAnxiety" min="1" max="10" value="5" oninput="document.getElementById('diaryAnxietyVal').textContent=this.value">
            </div>
            <label>Шаги:</label>
            <input type="number" id="diarySteps" placeholder="8500">
            <label>Что сделал сегодня:</label>
            <textarea id="diaryAchievements" rows="3" placeholder="Татуировка, контент..."></textarea>
            <label>Что было сложно:</label>
            <textarea id="diaryStruggles" rows="3" placeholder="Тревога, усталость..."></textarea>
            <button class="btn" onclick="saveDiary()">💾 Сохранить (+20 🩸)</button>
            <button class="btn modal-close" onclick="closeModal('diaryFormModal')">Закрыть</button>
        </div>
    </div>
    
    <div class="modal" id="bookingModal">
        <div class="modal-box">
            <h3 id="bookingModalTitle">📅 Новая Запись</h3>
            <input type="hidden" id="bookingEditId">
            <label>Дата:</label>
            <input type="date" id="bookingDate">
            <label>Время:</label>
            <input type="time" id="bookingTime" value="12:00">
            <label>Имя клиента:</label>
            <input type="text" id="bookingName" placeholder="Анна Ковальская">
            <label>Город:</label>
            <select id="bookingCity">
                <option value="warsaw">🏙️ Варшава</option>
                <option value="sochaczew">🚗 Сохачев</option>
            </select>
            <label>Тип клиента:</label>
            <select id="bookingType">
                <option value="new">✨ Новый клиент</option>
                <option value="return">🔄 Постоянный клиент</option>
            </select>
            <label>Примерная цена (zł):</label>
            <input type="number" id="bookingPrice" placeholder="1200">
            <label>Заметки:</label>
            <textarea id="bookingNotes" rows="2" placeholder="Контакт, пожелания..."></textarea>
            <button class="btn" onclick="saveBooking()">💾 Сохранить</button>
            <button class="btn modal-close" onclick="closeModal('bookingModal')">Закрыть</button>
        </div>
    </div>
    
    <div class="modal" id="sleepModal">
        <div class="modal-box">
            <h3>😴 Журнал Сна</h3>
            <label>Лёг спать:</label>
            <input type="time" id="sleepBedTime" value="23:00">
            <label>Проснулся:</label>
            <input type="time" id="sleepWakeTime" value="07:00">
            <div class="slider-container">
                <div class="slider-label">
                    <span>Качество сна:</span>
                    <span id="sleepQualityVal">5</span>
                </div>
                <input type="range" class="slider" id="sleepQuality" min="1" max="10" value="5" oninput="document.getElementById('sleepQualityVal').textContent=this.value">
            </div>
            <label>Просыпался ночью (раз):</label>
            <input type="number" id="sleepWakeups" value="0" min="0">
            <label>Что мешало:</label>
            <textarea id="sleepIssues" rows="2" placeholder="Тревога, шум..."></textarea>
            <button class="btn" onclick="saveSleep()">💾 Сохранить (+15 🩸)</button>
            <button class="btn modal-close" onclick="closeModal('sleepModal')">Закрыть</button>
        </div>
    </div>
    
    <div class="modal" id="anxietyModal">
        <div class="modal-box">
            <h3>📝 Журнал Тревоги</h3>
            <div class="slider-container">
                <div class="slider-label">
                    <span>Уровень ДО:</span>
                    <span id="anxietyBeforeVal">7</span>
                </div>
                <input type="range" class="slider" id="anxietyBefore" min="1" max="10" value="7" oninput="document.getElementById('anxietyBeforeVal').textContent=this.value">
            </div>
            <label>Что случилось (триггер):</label>
            <textarea id="anxietyTrigger" rows="2" placeholder="Проверил счёт..."></textarea>
            <label>Где был:</label>
            <select id="anxietyLocation">
                <option value="home">🏠 Дома</option>
                <option value="warsaw">🏙️ Варшава</option>
                <option value="sochaczew">🚗 Сохачев</option>
                <option value="road">🛣️ В дороге</option>
            </select>
            <label>Автоматическая мысль:</label>
            <textarea id="anxietyThought" rows="2" placeholder="'У меня не хватит денег...'"></textarea>
            <button class="btn" onclick="saveAnxietyLog()">💾 Сохранить</button>
            <button class="btn modal-close" onclick="closeModal('anxietyModal')">Закрыть</button>
        </div>
    </div>
    
    <div class="modal" id="sosModal">
        <div class="modal-box">
            <h3 id="sosTitle">🌬️ Техника</h3>
            <div id="sosContent"></div>
            <div class="slider-container" style="margin-top:15px;">
                <div class="slider-label">
                    <span>Уровень ПОСЛЕ:</span>
                    <span id="anxietyAfterVal">5</span>
                </div>
                <input type="range" class="slider" id="anxietyAfter" min="1" max="10" value="5" oninput="document.getElementById('anxietyAfterVal').textContent=this.value">
            </div>
            <button class="btn" onclick="completeSOS()">✓ Готово (+10 🩸)</button>
            <button class="btn modal-close" onclick="closeModal('sosModal')">Закрыть</button>
        </div>
    </div>
    
    <div class="modal" id="incomeModal">
        <div class="modal-box">
            <h3>💰 Добавить Доход</h3>
            <label>Чистая Сумма (zł):</label>
            <input type="number" id="incomeAmount" placeholder="740">
            <button class="btn" onclick="showDistribution()">→ Распределить</button>
            <button class="btn modal-close" onclick="closeModal('incomeModal')">Отмена</button>
        </div>
    </div>
    
    <div class="modal" id="distributionModal">
        <div class="modal-box">
            <h3>🏺 Распредели по Копилкам</h3>
            <div id="distributionList"></div>
            <div style="margin-top:12px; padding:10px; background:rgba(139,64,73,0.2); border-radius:8px;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                    <span>Распределено:</span>
                    <span id="totalDistributed" style="color:#9ac99a; font-weight:bold;">0 zł</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span>Осталось:</span>
                    <span id="remaining" style="color:#d4957d; font-weight:bold;">0 zł</span>
                </div>
            </div>
            <button class="btn" onclick="applyDistribution()">✓ Применить</button>
            <button class="btn modal-close" onclick="closeModal('distributionModal')">Отмена</button>
        </div>
    </div>
    
    <div class="modal" id="expenseModal">
        <div class="modal-box">
            <h3>💸 Добавить Расход</h3>
            <label>Сумма (zł):</label>
            <input type="number" id="expenseAmount" placeholder="150">
            <label>Категория:</label>
            <select id="expenseCategory">
                <option value="rent">🏠 Аренда</option>
                <option value="food">🍕 Еда</option>
                <option value="transport">🚌 Дорога</option>
                <option value="medicine">💊 Лекарства</option>
                <option value="doctor">👨‍⚕️ Врач</option>
                <option value="debt">📉 Долги</option>
                <option value="education">📚 Обучение</option>
                <option value="other">💳 Другое</option>
            </select>
            <label>Заметка:</label>
            <input type="text" id="expenseNote" placeholder="На что потратил">
            <button class="btn" onclick="addExpense()">💸 Записать</button>
            <button class="btn modal-close" onclick="closeModal('expenseModal')">Закрыть</button>
        </div>
    </div>
    
    <script src="./demon-guide-v3.js"></script>
</body>
</html>
