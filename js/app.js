/* TRY - ULTIMATE QUIZ SYSTEM ENGINE v5.0
   Developed by Muhammad Shourov
   Features: PWA, Mining, Themes, Breach Mode, Achievements
*/

// --- 1. DATA STORE ---
const store = {
    data: {
        name: null, age: null, xp: 0, level: 1,
        inventory: { '5050': 2, 'skip': 2 },
        mining: { rate: 0, lastClaim: Date.now() },
        themes: { current: 'cyan', owned: ['cyan'] },
        stats: { matches: 0, totalQ: 0, correct: 0, wrong: 0, consecutive: 0 },
        achievements: [], // List of unlocked IDs
        settings: { sound: true }
    },
    
    // Achievement List
    achievList: [
        { id: 'first_win', title: 'First Blood', desc: 'Complete your first match', reward: 50 },
        { id: 'richie', title: 'Richie Rich', desc: 'Accumulate 1000 BITS', reward: 100 },
        { id: 'sniper', title: 'Sniper', desc: 'Get 5 correct answers in a row', reward: 200 },
        { id: 'miner', title: 'Crypto Miner', desc: 'Upgrade mining rig once', reward: 150 }
    ],

    load: function() {
        const saved = localStorage.getItem('try_v5_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.data = { ...this.data, ...parsed }; // Merge to avoid missing new keys
        }
        this.applyTheme(this.data.themes.current);
    },

    save: function() {
        localStorage.setItem('try_v5_data', JSON.stringify(this.data));
        ui.updateAll();
    },

    register: function(name, age) {
        this.data.name = name; this.data.age = age;
        this.save();
    },

    // --- ECONOMY & MINING ---
    addXP: function(amount) {
        this.data.xp += amount;
        this.data.level = Math.floor(this.data.xp / 100) + 1;
        this.checkAchievements();
        this.save();
    },

    calculateMining: function() {
        const now = Date.now();
        const hours = (now - this.data.mining.lastClaim) / (1000 * 60 * 60);
        return Math.floor(hours * this.data.mining.rate);
    },

    claimMining: function() {
        const amount = this.calculateMining();
        if (amount > 0) {
            this.addXP(amount);
            this.data.mining.lastClaim = Date.now();
            this.save();
            sfx.correct();
            alert(`Claimed ${amount} BITS from mining!`);
        } else {
            alert("Mining in progress... Wait longer.");
        }
    },

    upgradeMiner: function() {
        if (this.data.xp >= 500) {
            this.data.xp -= 500;
            this.data.mining.rate += 10; // +10 BITS/Hour
            this.unlockAchievement('miner');
            this.save();
            sfx.correct();
            alert("Rig Upgraded! Rate +10 BITS/H");
        } else alert("Insufficient BITS!");
    },

    // --- THEMES ---
    buyTheme: function(theme, cost) {
        if (this.data.themes.owned.includes(theme)) {
            this.data.themes.current = theme;
            this.applyTheme(theme);
            this.save();
            alert(`Theme Applied: ${theme.toUpperCase()}`);
        } else if (this.data.xp >= cost) {
            this.data.xp -= cost;
            this.data.themes.owned.push(theme);
            this.data.themes.current = theme;
            this.applyTheme(theme);
            this.save();
            sfx.correct();
            alert("Theme Purchased & Applied!");
        } else alert("Insufficient BITS!");
    },

    applyTheme: function(theme) {
        document.body.className = `theme-${theme}`;
    },

    // --- ACHIEVEMENTS ---
    checkAchievements: function() {
        if (this.data.xp >= 1000) this.unlockAchievement('richie');
        if (this.data.stats.matches >= 1) this.unlockAchievement('first_win');
        if (this.data.stats.consecutive >= 5) this.unlockAchievement('sniper');
    },

    unlockAchievement: function(id) {
        if (!this.data.achievements.includes(id)) {
            this.data.achievements.push(id);
            const ach = this.achievList.find(a => a.id === id);
            this.data.xp += ach.reward;
            this.save();
            alert(`🏆 ACHIEVEMENT UNLOCKED: ${ach.title}\nReward: ${ach.reward} BITS`);
            sfx.correct();
        }
    },
    
    // --- RESET ---
    resetData: function() {
        if(confirm("Factory Reset?")) { localStorage.removeItem('try_v5_data'); location.reload(); }
    }
};

// --- 2. SOUND ENGINE ---
const sfx = {
    ctx: null,
    init: function() { if(store.data.settings.sound && !this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    tone: function(f, t, d) {
        if(!store.data.settings.sound || !this.ctx) { this.init(); return; }
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = t; o.frequency.setValueAtTime(f, this.ctx.currentTime);
        g.gain.setValueAtTime(0.05, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime+d);
        o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+d);
    },
    click: () => { sfx.tone(800, 'square', 0.05); navigator.vibrate?.(10); },
    correct: () => { sfx.tone(600, 'sine', 0.1); setTimeout(() => sfx.tone(1200, 'sine', 0.2), 100); navigator.vibrate?.([50,50]); },
    wrong: () => { sfx.tone(150, 'sawtooth', 0.3); navigator.vibrate?.(200); },
    alarm: () => { sfx.tone(800, 'sawtooth', 0.5); setTimeout(() => sfx.tone(600, 'sawtooth', 0.5), 500); }
};

// --- 3. UI CONTROLLER ---
const ui = {
    screens: { home: document.getElementById('home-screen'), category: document.getElementById('category-screen'), game: document.getElementById('game-screen'), result: document.getElementById('result-screen') },
    
    showScreen: function(name) {
        Object.values(this.screens).forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
        this.screens[name].classList.remove('hidden'); this.screens[name].classList.add('active');
    },

    openModal: function(type) {
        sfx.click();
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.querySelectorAll('.modal-box').forEach(b => b.classList.add('hidden'));
        document.getElementById(`modal-${type}`).classList.remove('hidden');
        
        if (type === 'leaderboard') app.genLeaderboard();
        if (type === 'achievements') app.genAchievements();
        if (type === 'register') document.getElementById('modal-overlay').onclick = null;
        else document.getElementById('modal-overlay').onclick = (e) => { if(e.target.id === 'modal-overlay') ui.closeModal(); };
        
        ui.updateAll();
    },

    closeModal: function() { sfx.click(); document.getElementById('modal-overlay').classList.add('hidden'); },

    switchShopTab: function(tab) {
        document.querySelectorAll('.shop-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`shop-${tab}`).classList.remove('hidden');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
    },

    updateAll: function() {
        const safe = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
        safe('user-points', store.data.xp); safe('current-level', store.data.level); safe('player-name-display', store.data.name || "Agent");
        safe('shop-balance', store.data.xp); safe('mining-rate-display', store.data.mining.rate);
        safe('mining-rate-modal', store.data.mining.rate); safe('mining-pending', store.calculateMining());
        safe('qty-5050', store.data.inventory['5050']); safe('qty-skip', store.data.inventory['skip']);
        
        // Profile
        safe('p-name', store.data.name); safe('p-xp', store.data.xp);
        safe('p-rank', store.data.level < 5 ? "Script Kiddie" : store.data.level < 10 ? "Hacker" : "Elite Phantom");
        const acc = store.data.stats.totalQ > 0 ? Math.round((store.data.stats.correct / store.data.stats.totalQ)*100) : 0;
        safe('p-acc', acc + "%");
    }
};

// --- 4. MAIN APP ---
const app = {
    qs: [], qIdx: 0, score: 0, timer: null, timeLeft: 100, isBreach: false, active: false,

    init: function() {
        setTimeout(() => { document.getElementById('boot-screen').style.display = 'none'; document.getElementById('main-app').classList.remove('hidden'); store.load(); if(!store.data.name) ui.openModal('register'); }, 2500);
        document.body.addEventListener('click', () => sfx.init(), { once: true });
        setInterval(() => ui.updateAll(), 60000); // Auto update mining UI every minute
    },

    registerUser: function() {
        const name = document.getElementById('reg-name').value.trim();
        const age = document.getElementById('reg-age').value.trim();
        if(name.length > 2 && age > 0) { store.register(name, age); ui.closeModal(); } else alert("Invalid Input");
    },

    showCategorySelection: function() { sfx.click(); ui.showScreen('category'); },

    startGame: function(cat) {
        sfx.click();
        let list = (cat === 'mixed') ? window.questionBank : window.questionBank.filter(q => q.category === cat);
        if(!list.length) { alert("No Data"); return; }
        
        // BREACH MODE CHECK (Every 5 levels)
        this.isBreach = (store.data.level % 5 === 0 && store.data.level > 0);
        
        this.qs = list.sort(() => Math.random() - 0.5).slice(0, this.isBreach ? 5 : 10);
        this.qIdx = 0; this.score = 0; this.active = true; store.data.stats.consecutive = 0;
        
        const screen = document.getElementById('game-screen');
        const overlay = document.getElementById('breach-overlay');
        
        if (this.isBreach) {
            screen.classList.add('breach-mode');
            overlay.classList.remove('hidden');
            sfx.alarm();
        } else {
            screen.classList.remove('breach-mode');
            overlay.classList.add('hidden');
        }

        ui.showScreen('game');
        this.loadQ();
    },

    loadQ: function() {
        if (this.qIdx >= this.qs.length) { this.endGame(); return; }
        const q = this.qs[this.qIdx];
        document.getElementById('q-current').innerText = this.qIdx + 1;
        document.getElementById('q-total').innerText = this.qs.length;
        document.getElementById('question-text').innerText = q.question;
        const cont = document.getElementById('options-container'); cont.innerHTML = '';
        q.options.forEach(opt => {
            const btn = document.createElement('button'); btn.className = 'option-btn'; btn.innerText = opt;
            btn.onclick = () => this.handle(opt, btn); cont.appendChild(btn);
        });
        this.startTimer();
    },

    handle: function(sel, btn) {
        if(!this.active) return; clearInterval(this.timer);
        const cor = this.qs[this.qIdx].answer === sel;
        
        // Stats
        store.data.stats.totalQ++;
        if(cor) { store.data.stats.correct++; store.data.stats.consecutive++; } 
        else { store.data.stats.wrong++; store.data.stats.consecutive = 0; }

        if(cor) {
            this.score += this.isBreach ? 20 : 10; // Double points in Breach
            btn.classList.add('correct'); sfx.correct();
        } else {
            btn.classList.add('wrong'); sfx.wrong();
            // Breach Fail Condition
            if(this.isBreach) { alert("BREACH FAILED! SYSTEM LOCKED."); this.endGame(); return; }
        }
        
        setTimeout(() => { this.qIdx++; this.loadQ(); }, 1500);
    },

    startTimer: function() {
        clearInterval(this.timer); this.timeLeft = 100;
        const bar = document.getElementById('timer-bar');
        const speed = this.isBreach ? 100 : 150; // Faster in Breach
        this.timer = setInterval(() => {
            this.timeLeft -= 1; bar.style.width = this.timeLeft + '%';
            if(this.timeLeft < 30) bar.style.backgroundColor = 'red';
            else bar.style.backgroundColor = 'var(--secondary-color)';
            if(this.timeLeft <= 0) {
                clearInterval(this.timer); sfx.wrong();
                if(this.isBreach) { alert("TIME OUT! BREACH FAILED."); this.endGame(); }
                else { this.qIdx++; this.loadQ(); }
            }
        }, speed);
    },

    useLifeline: function(type) {
        if(this.isBreach) { alert("LIFELINES DISABLED IN BREACH MODE!"); return; } // Hard mode
        if(store.data.inventory[type] > 0) {
            store.data.inventory[type]--;
            if(type === 'skip') { clearInterval(this.timer); this.qIdx++; this.loadQ(); }
            if(type === '5050') {
                const ans = this.qs[this.qIdx].answer;
                const opts = Array.from(document.querySelectorAll('.option-btn'));
                let r = 0; opts.forEach(o => { if(o.innerText !== ans && r < 2) { o.style.display = 'none'; r++; }});
            }
            ui.updateAll();
        } else alert("Empty!");
    },

    endGame: function() {
        this.active = false; clearInterval(this.timer);
        store.data.stats.matches++;
        store.addXP(this.score);
        document.getElementById('final-score').innerText = this.score;
        document.getElementById('res-correct').innerText = store.data.stats.correct; // Show lifetime correct just for stats
        document.getElementById('game-screen').classList.remove('breach-mode');
        ui.showScreen('result');
        if(this.score > 50) sfx.correct();
    },

    goHome: function() { sfx.click(); clearInterval(this.timer); ui.closeModal(); ui.showScreen('home'); },

    shareScore: function() {
        const t = `Agent ${store.data.name} scored ${this.score} BITS in TRY v5.0! Rank: ${document.getElementById('p-rank').innerText}`;
        if(navigator.share) navigator.share({ title: 'TRY', text: t, url: location.href });
        else { navigator.clipboard.writeText(t); alert("Copied!"); }
    },

    toggleSound: function() { store.data.settings.sound = !store.data.settings.sound; store.save(); ui.updateAll(); },

    genLeaderboard: function() {
        const list = document.getElementById('leaderboard-list'); list.innerHTML = '';
        const ranks = [{name:"VampireSquad",xp:9999}, {name:"AI_Ghost",xp:5000}, {name:store.data.name||"You",xp:store.data.xp}].sort((a,b)=>b.xp-a.xp);
        ranks.forEach((r,i) => { list.innerHTML += `<div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #333;color:${r.name===store.data.name?'var(--primary-color)':'#aaa'}"><span>#${i+1} ${r.name}</span><span>${r.xp} XP</span></div>`; });
    },

    genAchievements: function() {
        const list = document.getElementById('achievement-list'); list.innerHTML = '';
        store.achievList.forEach(a => {
            const unlocked = store.data.achievements.includes(a.id);
            list.innerHTML += `<div class="achievement-row ${unlocked ? 'unlocked' : ''}"><i class="fas fa-${unlocked ? 'check-circle' : 'lock'}"></i><div class="ach-info"><h4>${a.title}</h4><p>${a.desc}</p></div></div>`;
        });
    }
};

document.addEventListener('DOMContentLoaded', app.init);
