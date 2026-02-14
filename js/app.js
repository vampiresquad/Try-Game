/* TRY - ULTIMATE QUIZ SYSTEM ENGINE v5.1
   Developed by Muhammad Shourov
   Features: PWA, Live Mining, Advanced Profile, Themes, Breach Mode, Achievements
   Status: STABLE & OPTIMIZED
*/

// --- PWA INSTALLATION VARIABLE ---
let deferredPrompt;

// --- 1. DATA STORE (The Brain) ---
const store = {
    data: {
        name: null, 
        age: null, 
        xp: 0, 
        level: 1,
        inventory: { '5050': 2, 'skip': 2 },
        mining: { rate: 0, lastClaim: Date.now() },
        themes: { current: 'cyan', owned: ['cyan'] },
        // Updated Stats to track Total Mined
        stats: { matches: 0, totalQ: 0, correct: 0, wrong: 0, consecutive: 0, totalMined: 0 },
        achievements: [], // List of unlocked IDs
        settings: { sound: true }
    },
    
    // Achievement Definitions
    achievList: [
        { id: 'first_win', title: 'First Blood', desc: 'Complete your first match', reward: 50 },
        { id: 'richie', title: 'Richie Rich', desc: 'Accumulate 1000 BITS', reward: 100 },
        { id: 'sniper', title: 'Sniper', desc: 'Get 5 correct answers in a row', reward: 200 },
        { id: 'miner', title: 'Crypto Miner', desc: 'Upgrade mining rig once', reward: 150 },
        { id: 'hacker', title: 'Elite Hacker', desc: 'Reach Level 10', reward: 500 }
    ],

    // Load Data from LocalStorage
    load: function() {
        const saved = localStorage.getItem('try_v5_data');
        if (saved) {
            try {
    const parsed = JSON.parse(saved);
    this.data = { ...this.data, ...parsed };
} catch(e) {
    console.log("Save Data Corrupted - Resetting");
    localStorage.removeItem('try_v5_data');
} // Merge to ensure new keys exist
            
            // Fix: Reset mining time if invalid
            if (!this.data.mining.lastClaim) this.data.mining.lastClaim = Date.now();
            // Fix: Ensure totalMined exists for old users
            if (!this.data.stats.totalMined) this.data.stats.totalMined = 0;
        }
        this.applyTheme(this.data.themes.current);
    },

    // Save Data to LocalStorage
    save: function() {
        localStorage.setItem('try_v5_data', JSON.stringify(this.data));
        ui.updateAll();
    },

    register: function(name, age) {
        this.data.name = name; 
        this.data.age = age;
        this.save();
    },

    // --- ECONOMY & MINING SYSTEM ---
    addXP: function(amount) {
        this.data.xp += amount;
        // Level Calculation: Level increases every 100 XP
        const newLevel = Math.floor(this.data.xp / 100) + 1;
        
        if (newLevel > this.data.level) {
            this.data.level = newLevel;
            sfx.correct(); // Level up sound
            alert(`SYSTEM UPGRADE: LEVEL ${newLevel} REACHED!`);
        } else {
            this.data.level = newLevel;
        }

        this.checkAchievements();
        this.save();
    },

    calculateMining: function() {
        const now = Date.now();
        const diffMs = now - this.data.mining.lastClaim;
        const hours = diffMs / (1000 * 60 * 60);
        return Math.floor(hours * this.data.mining.rate);
    },

    claimMining: function() {
        const amount = this.calculateMining();
        if (amount > 0) {
            this.addXP(amount);
            
            // Track Total Mined Stats
            if (!this.data.stats.totalMined) this.data.stats.totalMined = 0;
            this.data.stats.totalMined += amount;

            this.data.mining.lastClaim = Date.now();
            this.save();
            sfx.correct();
            alert(`SUCCESS: Extracted ${amount} BITS from network!`);
        } else {
            alert("MINING IN PROGRESS... Mining pool is empty.");
        }
    },

    upgradeMiner: function() {
        const cost = 500;
        if (this.data.xp >= cost) {
            this.data.xp -= cost;
            this.data.mining.rate += 10; // Increase rate by 10
            this.unlockAchievement('miner');
            this.save();
            sfx.correct();
            alert(`UPGRADE COMPLETE: Rate increased to ${this.data.mining.rate} BITS/H`);
        } else alert(`ACCESS DENIED: Insufficient BITS. Need ${cost}.`);
    },

    // --- SHOP SYSTEM ---
    buyItem: function(type, cost) {
        if (this.data.xp >= cost) {
            this.data.xp -= cost;
            if (!this.data.inventory[type]) this.data.inventory[type] = 0;
            this.data.inventory[type]++;
            this.save();
            sfx.click();
            alert(`TRANSACTION SUCCESSFUL: Added 1x ${type.toUpperCase()}`);
        } else {
            sfx.wrong();
            alert("TRANSACTION FAILED: Insufficient Funds.");
        }
    },

    buyTheme: function(theme, cost) {
        if (this.data.themes.owned.includes(theme)) {
            this.data.themes.current = theme;
            this.applyTheme(theme);
            this.save();
            alert(`VISUAL SYSTEM UPDATED: Theme set to ${theme.toUpperCase()}`);
        } else if (this.data.xp >= cost) {
            this.data.xp -= cost;
            this.data.themes.owned.push(theme);
            this.data.themes.current = theme;
            this.applyTheme(theme);
            this.save();
            sfx.correct();
            alert("NEW THEME ACQUIRED & ACTIVATED!");
        } else alert("ACCESS DENIED: Insufficient BITS.");
    },

    applyTheme: function(theme) {
        document.body.className = `theme-${theme}`;
    },

    // --- ACHIEVEMENTS ---
    checkAchievements: function() {
        if (this.data.xp >= 1000) this.unlockAchievement('richie');
        if (this.data.stats.matches >= 1) this.unlockAchievement('first_win');
        if (this.data.stats.consecutive >= 5) this.unlockAchievement('sniper');
        if (this.data.level >= 10) this.unlockAchievement('hacker');
    },

    unlockAchievement: function(id) {
        if (!this.data.achievements.includes(id)) {
            this.data.achievements.push(id);
            const ach = this.achievList.find(a => a.id === id);
            if(ach) {
                this.data.xp += ach.reward;
                this.save();
                sfx.correct();
                setTimeout(() => {
                    alert(`🏆 MEDAL UNLOCKED: ${ach.title}\nReward: ${ach.reward} BITS`);
                }, 500);
            }
        }
    },
    
    // --- RESET ---
    resetData: function() {
        if(confirm("WARNING: PERFORMING FACTORY RESET.\nAll progress will be lost. Proceed?")) { 
            localStorage.removeItem('try_v5_data'); 
            location.reload(); 
        }
    }
};

// --- 2. SOUND ENGINE (SFX) ---
const sfx = {
    ctx: null,
    init: function() { 
        if(store.data.settings.sound && !this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)(); 
        }
    },
    tone: function(f, t, d) {
        if(!store.data.settings.sound || !this.ctx) { this.init(); return; }
        try {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = t; 
            o.frequency.setValueAtTime(f, this.ctx.currentTime);
            g.gain.setValueAtTime(0.05, this.ctx.currentTime); 
            g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime+d);
            o.connect(g); 
            g.connect(this.ctx.destination); 
            o.start(); 
            o.stop(this.ctx.currentTime+d);
        } catch(e) { console.log("Audio Error", e); }
    },
    click: () => { sfx.tone(800, 'square', 0.05); navigator.vibrate?.(10); },
    correct: () => { 
        sfx.tone(600, 'sine', 0.1); 
        setTimeout(() => sfx.tone(1200, 'sine', 0.2), 100); 
        navigator.vibrate?.([50,50]); 
    },
    wrong: () => { sfx.tone(150, 'sawtooth', 0.3); navigator.vibrate?.(200); },
    alarm: () => { 
        sfx.tone(800, 'sawtooth', 0.5); 
        setTimeout(() => sfx.tone(600, 'sawtooth', 0.5), 500); 
    }
};

// --- 3. UI CONTROLLER (UPDATED) ---
const ui = {
    screens: { 
        home: document.getElementById('home-screen'), 
        category: document.getElementById('category-screen'), 
        game: document.getElementById('game-screen'), 
        result: document.getElementById('result-screen') 
    },
    
    showScreen: function(name) {
        Object.values(this.screens).forEach(s => { 
            s.classList.remove('active'); 
            s.classList.add('hidden'); 
        });
        this.screens[name].classList.remove('hidden'); 
        this.screens[name].classList.add('active');
    },

    openModal: function(type) {
        sfx.click();
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.querySelectorAll('.modal-box').forEach(b => b.classList.add('hidden'));
        document.getElementById(`modal-${type}`).classList.remove('hidden');
        
        if (type === 'leaderboard') app.genLeaderboard();
        if (type === 'achievements') app.genAchievements();
        
        if (type === 'register') {
            document.getElementById('modal-overlay').onclick = null;
        } else {
            document.getElementById('modal-overlay').onclick = (e) => { 
                if(e.target.id === 'modal-overlay') ui.closeModal(); 
            };
        }
        
        ui.updateAll();
    },

    closeModal: function() { 
        sfx.click(); 
        document.getElementById('modal-overlay').classList.add('hidden'); 
    },

    switchShopTab: function(tab) {
        document.querySelectorAll('.shop-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`shop-${tab}`).classList.remove('hidden');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        if(event && event.target) event.target.classList.add('active');
    },

    getRank: function(lvl) {
        if (lvl < 5) return "Script Kiddie";
        if (lvl < 10) return "White Hat";
        if (lvl < 20) return "Cyber Ninja";
        return "Elite Phantom";
    },

    // --- CENTRAL UI UPDATE FUNCTION ---
    updateAll: function() {
        const safe = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
        
        // Basic Stats
        safe('user-points', store.data.xp); 
        safe('current-level', store.data.level); 
        safe('player-name-display', store.data.name || "Agent");
        safe('shop-balance', store.data.xp); 
        
        // --- LIVE MINING UI ---
        const mRate = store.data.mining.rate;
        safe('mining-rate-display', mRate);
        safe('mining-rate-modal', mRate); 
        safe('mining-pending', store.calculateMining());

        const mStatus = document.getElementById('mining-status');
        const mAnim = document.getElementById('mining-live-anim');
        
        if (mRate > 0) {
            if(mStatus) { mStatus.innerText = "ONLINE"; mStatus.className = "status-online"; }
            if(mAnim) mAnim.classList.remove('hidden');
        } else {
            if(mStatus) { mStatus.innerText = "OFFLINE"; mStatus.className = "status-offline"; }
            if(mAnim) mAnim.classList.add('hidden');
        }

        // Inventory
        safe('qty-5050', store.data.inventory['5050'] || 0); 
        safe('qty-skip', store.data.inventory['skip'] || 0);
        
        // --- DETAILED PROFILE UI ---
        safe('p-name', store.data.name || "Unknown"); 
        safe('p-age', store.data.age || "--");
        safe('p-rank', this.getRank(store.data.level));
        
        safe('p-correct', store.data.stats.correct);
        safe('p-wrong', store.data.stats.wrong);
        safe('p-mined', store.data.stats.totalMined || 0); // Show Total Mined
        
        const total = store.data.stats.totalQ;
        const correct = store.data.stats.correct;
        const acc = total > 0 ? Math.round((correct / total)*100) : 0;
        safe('p-acc', acc + "%");

        // --- BADGES IN PROFILE ---
        const badgeContainer = document.getElementById('p-badges-grid');
        if (badgeContainer) {
            badgeContainer.innerHTML = '';
            if (store.data.achievements.length === 0) {
                badgeContainer.innerHTML = '<span class="no-badge">No Intel Data</span>';
            } else {
                store.data.achievements.forEach(id => {
                    let icon = 'medal'; // default
                    if(id === 'richie') icon = 'gem';
                    if(id === 'sniper') icon = 'crosshairs';
                    if(id === 'miner') icon = 'hammer';
                    if(id === 'hacker') icon = 'user-secret';
                    
                    const el = document.createElement('i');
                    el.className = `fas fa-${icon} mini-badge`;
                    el.title = id;
                    badgeContainer.appendChild(el);
                });
            }
        }
    }
};

// --- 4. MAIN APP LOGIC ---
const app = {
    qs: [], 
    qIdx: 0, 
    score: 0, 
    timer: null, 
    timeLeft: 100, 
    isBreach: false, 
    active: false,

    init: function() {
        // Boot Sequence
        setTimeout(() => { 
            document.getElementById('boot-screen').style.display = 'none'; 
            document.getElementById('main-app').classList.remove('hidden'); 
            store.load(); 
            if(!store.data.name) ui.openModal('register'); 
        }, 2500);

        // Audio Init
        document.body.addEventListener('click', () => sfx.init(), { once: true });
        
        // Auto Update Loop (30s)
        setInterval(() => ui.updateAll(), 30000); 

        // PWA Install Prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            const installBtn = document.getElementById('install-container');
            if(installBtn) installBtn.style.display = 'flex';
        });

        // Install Button Action
        const btnInstall = document.getElementById('btn-install');
        if(btnInstall) {
            btnInstall.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt = null;
                }
            });
        }
    },

    registerUser: function() {
        const name = document.getElementById('reg-name').value.trim();
        const age = document.getElementById('reg-age').value.trim();
        if(name.length >= 3 && age > 0) { 
            store.register(name, age); 
            ui.closeModal(); 
            sfx.correct();
        } else alert("ERROR: Name must be 3+ chars & valid age.");
    },

    showCategorySelection: function() { 
        sfx.click(); 
        ui.showScreen('category'); 
    },

    startGame: function(cat) {
        sfx.click();
        
        // Fetch Questions
        let list = [];
        if (window.questionBank) {
            list = (cat === 'mixed') ? window.questionBank : window.questionBank.filter(q => q.category === cat);
        }
        
        if(!list || list.length === 0) { 
            alert("DATABASE ERROR: No questions found."); 
            return; 
        }
        
        // BREACH MODE LOGIC
        this.isBreach = (store.data.level % 5 === 0 && store.data.level > 0);
        
        const qCount = this.isBreach ? 5 : 10;
for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
}

this.qs = list.slice(0, qCount);
        
        this.qIdx = 0; 
        this.score = 0; 
        this.active = true; 
        store.data.stats.consecutive = 0;
        
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
        
        document.getElementById('combo-display').classList.add('hidden');

        const cont = document.getElementById('options-container'); 
        cont.innerHTML = '';
        
        q.options.forEach(opt => {
            const btn = document.createElement('button'); 
            btn.className = 'option-btn'; 
            btn.innerText = opt;
            btn.onclick = () => this.handle(opt, btn); 
            cont.appendChild(btn);
        });
        
        this.startTimer();
    },

    handle: function(sel, btn) {
        if(!this.active) return; 
        clearInterval(this.timer);
        
        const currentQ = this.qs[this.qIdx];
        const cor = currentQ.answer === sel;
        
        store.data.stats.totalQ++;

        if(cor) {
            store.data.stats.correct++; 
            store.data.stats.consecutive++;
            
            let points = this.isBreach ? 20 : 10;
            let bonus = 0;
            
            if(store.data.stats.consecutive > 1) {
                bonus = (store.data.stats.consecutive - 1) * 2;
                const comboEl = document.getElementById('combo-display');
                comboEl.innerText = `COMBO x${store.data.stats.consecutive} (+${bonus})`;
                comboEl.classList.remove('hidden');
            }
            
            this.score += (points + bonus);
            btn.classList.add('correct'); 
            sfx.correct();

        } else {
            store.data.stats.wrong++; 
            store.data.stats.consecutive = 0;
            btn.classList.add('wrong'); 
            sfx.wrong();
            
            const opts = document.querySelectorAll('.option-btn');
            opts.forEach(b => {
                if(b.innerText === currentQ.answer) b.classList.add('correct');
            });

            if(this.isBreach) { 
                setTimeout(() => {
                    alert("SECURITY BREACH FAILED! SYSTEM LOCKED."); 
                    this.endGame(); 
                }, 500);
                return; 
            }
        }
        
        setTimeout(() => { this.qIdx++; this.loadQ(); }, 1500);
    },

    startTimer: function() {
        if (this.timer) clearInterval(this.timer);
        this.timeLeft = 100;
        const bar = document.getElementById('timer-bar');
        const speed = this.isBreach ? 60 : 100; 
        
        this.timer = setInterval(() => {
            this.timeLeft -= 1; 
            bar.style.width = this.timeLeft + '%';
            
            if(this.timeLeft < 30) bar.style.backgroundColor = 'red';
            else bar.style.backgroundColor = 'var(--secondary-color)';
            
            if(this.timeLeft <= 0) {
                clearInterval(this.timer); 
                sfx.wrong();
                
                if(this.isBreach) { 
                    alert("TIME OUT! BREACH FAILED."); 
                    this.endGame(); 
                } else { 
                    store.data.stats.wrong++;
                    store.data.stats.consecutive = 0;
                    this.qIdx++; 
                    this.loadQ(); 
                }
            }
        }, speed);
    },

    useLifeline: function(type) {
        if(this.isBreach) { 
            sfx.wrong();
            alert("SYSTEM ERROR: Lifelines disabled in Breach Mode!"); 
            return; 
        } 
        
        if(store.data.inventory[type] > 0) {
            store.data.inventory[type]--;
            sfx.click();
            
            if(type === 'skip') { 
                clearInterval(this.timer); 
                this.qIdx++; 
                this.loadQ(); 
            }
            
            if(type === '5050') {
                const ans = this.qs[this.qIdx].answer;
                const opts = Array.from(document.querySelectorAll('.option-btn'));
                let removed = 0;
                
                opts.forEach(o => { 
                    if(o.innerText !== ans && removed < 2) { 
                        o.style.visibility = 'hidden';
                        removed++; 
                    }
                });
            }
            ui.updateAll();
        } else {
            alert("INVENTORY EMPTY: Purchase more from Black Market.");
        }
    },

    endGame: function() {
        this.active = false; 
if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
}
        
        store.data.stats.matches++;
        store.addXP(this.score);
        
        document.getElementById('final-score').innerText = this.score;
        document.getElementById('res-correct').innerText = store.data.stats.correct;
        
        document.getElementById('game-screen').classList.remove('breach-mode');
        ui.showScreen('result');
        
        if(this.score > 50) sfx.correct();
    },

    goHome: function() { 
        sfx.click(); 
        clearInterval(this.timer); 
        ui.closeModal(); 
        ui.showScreen('home'); 
    },

    shareScore: function() {
        const rank = document.getElementById('p-rank').innerText;
        const t = `MISSION REPORT:\nAgent ${store.data.name} scored ${this.score} BITS in TRY v5.1!\nRank: ${rank}\nCan you hack the system?`;
        
        if(navigator.share) {
            navigator.share({ title: 'TRY System v5.1', text: t, url: window.location.href });
        } else { 
            navigator.clipboard.writeText(t); 
            alert("Report copied to clipboard!"); 
        }
    },

    toggleSound: function() { 
        store.data.settings.sound = !store.data.settings.sound; 
        store.save(); 
        const btn = document.getElementById('btn-sound');
        if(btn) btn.innerText = store.data.settings.sound ? "ON" : "OFF";
        if(btn) btn.className = store.data.settings.sound ? "toggle-btn on" : "toggle-btn";
    },

    genLeaderboard: function() {
        const list = document.getElementById('leaderboard-list'); 
        list.innerHTML = '';
        
        const ranks = [
            {name: "VampireSquad", xp: 15000}, 
            {name: "AI_Ghost", xp: 8500}, 
            {name: "System_Admin", xp: 5000},
            {name: store.data.name || "You", xp: store.data.xp}
        ].sort((a,b) => b.xp - a.xp);
        
        ranks.forEach((r,i) => { 
            const isUser = r.name === (store.data.name || "You");
            list.innerHTML += `
                <div class="rank-row ${isUser ? 'highlight' : ''}">
                    <span>#${i+1} ${r.name}</span>
                    <span>${r.xp} XP</span>
                </div>`; 
        });
    },

    genAchievements: function() {
        const list = document.getElementById('achievement-list'); 
        list.innerHTML = '';
        
        store.achievList.forEach(a => {
            const unlocked = store.data.achievements.includes(a.id);
            list.innerHTML += `
                <div class="achievement-row ${unlocked ? 'unlocked' : ''}">
                    <i class="fas fa-${unlocked ? 'check-circle' : 'lock'}"></i>
                    <div class="ach-info">
                        <h4>${a.title}</h4>
                        <p>${a.desc}</p>
                    </div>
                </div>`;
        });
    }
};

// Start the Engine
document.addEventListener('DOMContentLoaded', app.init);
