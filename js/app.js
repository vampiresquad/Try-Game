/* TRY - ULTIMATE QUIZ SYSTEM ENGINE v5.2 (Optimized)
   Developed by: Muhammad Shourov
   Status: STABLE, SECURE & MOBILE READY
*/

// --- 0. GLOBAL VARIABLES ---
let deferredPrompt; // PWA Install Prompt

// --- 1. DATA STORE (The Brain) ---
const store = {
    // Default State
    data: {
        name: null,
        age: null,
        xp: 0,
        level: 1,
        inventory: { '5050': 2, 'skip': 2 },
        mining: { rate: 5, lastClaim: Date.now() }, // Default rate 5
        themes: { current: 'cyan', owned: ['cyan'] },
        stats: { matches: 0, totalQ: 0, correct: 0, wrong: 0, consecutive: 0, totalMined: 0 },
        achievements: [],
        settings: { sound: true }
    },

    achievList: [
        { id: 'first_win', title: 'First Blood', desc: 'Complete your first match', reward: 50 },
        { id: 'richie', title: 'Richie Rich', desc: 'Accumulate 1000 BITS', reward: 100 },
        { id: 'sniper', title: 'Sniper', desc: 'Get 5 correct answers in a row', reward: 200 },
        { id: 'miner', title: 'Crypto Miner', desc: 'Upgrade mining rig once', reward: 150 },
        { id: 'hacker', title: 'Elite Hacker', desc: 'Reach Level 10', reward: 500 }
    ],

    // Deep Merge Load to prevent data loss
    load: function() {
        const saved = localStorage.getItem('try_v5_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                
                // Merge top-level data
                this.data = { ...this.data, ...parsed };

                // Deep Merge nested objects (Crucial for updates)
                this.data.stats = { ...store.data.stats, ...(parsed.stats || {}) };
                this.data.inventory = { ...store.data.inventory, ...(parsed.inventory || {}) };
                this.data.mining = { ...store.data.mining, ...(parsed.mining || {}) };
                this.data.themes = { ...store.data.themes, ...(parsed.themes || {}) };
                this.data.settings = { ...store.data.settings, ...(parsed.settings || {}) };

            } catch (e) {
                console.error("Save File Corrupted. Resetting to defaults.");
            }
        }
        
        // Safety Check: Ensure valid timestamp
        if (!this.data.mining.lastClaim) this.data.mining.lastClaim = Date.now();
        
        // Apply Visuals
        this.applyTheme(this.data.themes.current);
    },

    save: function() {
        localStorage.setItem('try_v5_data', JSON.stringify(this.data));
        ui.updateAll();
    },

    register: function(name, age) {
        this.data.name = name;
        this.data.age = age;
        this.save();
    },

    // --- ECONOMY SYSTEM ---
    addXP: function(amount) {
        this.data.xp += amount;
        
        // Level logic: 1 Level per 500 XP
        const newLevel = Math.floor(this.data.xp / 500) + 1; 
        
        if (newLevel > this.data.level) {
            this.data.level = newLevel;
            sfx.play('correct'); 
            alert(`SYSTEM UPGRADE: LEVEL ${newLevel} REACHED!`);
        }
        
        this.checkAchievements();
        this.save();
    },

    // Anti-Cheat Mining Calculation
    calculateMining: function() {
        const now = Date.now();
        
        // Security Check: If user changed phone time to future
        if (this.data.mining.lastClaim > now) {
            this.data.mining.lastClaim = now; // Reset timestamp
            return 0;
        }

        const diffMs = now - this.data.mining.lastClaim;
        const hours = diffMs / (1000 * 60 * 60);
        return Math.floor(hours * this.data.mining.rate);
    },

    claimMining: function() {
        const amount = this.calculateMining();
        if (amount > 0) {
            this.addXP(amount);
            
            if (!this.data.stats.totalMined) this.data.stats.totalMined = 0;
            this.data.stats.totalMined += amount;
            
            this.data.mining.lastClaim = Date.now();
            this.save();
            sfx.play('correct');
            alert(`SUCCESS: Extracted ${amount} BITS from network!`);
        } else {
            alert("MINING IN PROGRESS... Pool is currently empty.");
        }
    },

    upgradeMiner: function() {
        const cost = 500;
        if (this.data.xp >= cost) {
            this.data.xp -= cost;
            this.data.mining.rate += 10;
            this.unlockAchievement('miner');
            this.save();
            sfx.play('correct');
            alert(`UPGRADE COMPLETE: Rate increased to ${this.data.mining.rate} BITS/H`);
        } else {
            alert(`ACCESS DENIED: Insufficient BITS. Need ${cost}.`);
        }
    },

    // --- SHOP SYSTEM ---
    buyItem: function(type, cost) {
        if (this.data.xp >= cost) {
            this.data.xp -= cost;
            if (!this.data.inventory[type]) this.data.inventory[type] = 0;
            this.data.inventory[type]++;
            this.save();
            sfx.play('click');
            alert(`TRANSACTION SUCCESSFUL: Added 1x ${type.toUpperCase()}`);
        } else {
            sfx.play('wrong');
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
            sfx.play('correct');
            alert("NEW THEME ACQUIRED & ACTIVATED!");
        } else {
            alert("ACCESS DENIED: Insufficient BITS.");
        }
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
                sfx.play('correct');
                setTimeout(() => {
                    alert(`🏆 MEDAL UNLOCKED: ${ach.title}\nReward: ${ach.reward} BITS`);
                }, 500);
            }
        }
    },

    resetData: function() {
        if(confirm("WARNING: PERFORMING FACTORY RESET.\nAll progress will be lost. Proceed?")) {
            localStorage.removeItem('try_v5_data');
            location.reload();
        }
    }
};

// --- 2. SOUND ENGINE (SFX - Mobile Optimized) ---
const sfx = {
    ctx: null,
    
    init: function() {
        if(store.data.settings.sound && !this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
    },

    play: function(type) {
        if(!store.data.settings.sound) return;
        
        // Mobile Fix: Resume context if suspended
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        if(!this.ctx) { this.init(); return; }

        try {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            const now = this.ctx.currentTime;

            // Tone Configuration
            if (type === 'click') {
                o.type = 'square';
                o.frequency.setValueAtTime(800, now);
                g.gain.setValueAtTime(0.05, now);
                o.start(); o.stop(now + 0.05);
                navigator.vibrate?.(10);
            } 
            else if (type === 'correct') {
                o.type = 'sine';
                o.frequency.setValueAtTime(600, now);
                o.frequency.linearRampToValueAtTime(1200, now + 0.1);
                g.gain.setValueAtTime(0.1, now);
                g.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                o.start(); o.stop(now + 0.3);
                navigator.vibrate?.([50, 50]);
            } 
            else if (type === 'wrong') {
                o.type = 'sawtooth';
                o.frequency.setValueAtTime(150, now);
                g.gain.setValueAtTime(0.2, now);
                g.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                o.start(); o.stop(now + 0.4);
                navigator.vibrate?.(200);
            }
            else if (type === 'alarm') {
                o.type = 'sawtooth';
                o.frequency.setValueAtTime(800, now);
                o.frequency.linearRampToValueAtTime(600, now + 0.5);
                g.gain.setValueAtTime(0.2, now);
                o.start(); o.stop(now + 0.5);
            }
            
            o.connect(g);
            g.connect(this.ctx.destination);
            
        } catch(e) { console.warn("Audio Error:", e); }
    }
};

// --- 3. UI CONTROLLER ---
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
        const target = this.screens[name];
        if (target) {
            target.classList.remove('hidden');
            setTimeout(() => target.classList.add('active'), 10);
        }
    },

    openModal: function(type) {
        sfx.play('click');
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('hidden');
        
        document.querySelectorAll('.modal-box').forEach(b => b.classList.add('hidden'));
        document.getElementById(`modal-${type}`).classList.remove('hidden');

        // Dynamic Content Loading
        if (type === 'leaderboard') app.genLeaderboard();
        if (type === 'achievements') app.genAchievements();

        // Lock overlay for registration
        if (type === 'register') {
            overlay.onclick = null;
        } else {
            overlay.onclick = (e) => { if(e.target === overlay) ui.closeModal(); };
        }
        ui.updateAll();
    },

    closeModal: function() {
        sfx.play('click');
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

    // Central UI Update Loop
    updateAll: function() {
        const setVal = (id, val) => { 
            const el = document.getElementById(id); 
            if(el) el.innerText = val; 
        };

        // Header Stats
        setVal('user-points', store.data.xp);
        setVal('current-level', store.data.level);
        setVal('player-name-display', store.data.name || "Agent");
        setVal('shop-balance', store.data.xp);

        // Mining Display
        const mRate = store.data.mining.rate;
        setVal('mining-rate-display', mRate);
        setVal('mining-rate-modal', mRate);
        setVal('mining-pending', store.calculateMining());

        const mStatus = document.getElementById('mining-status');
        const mAnim = document.getElementById('mining-live-anim');
        if(mStatus) mStatus.innerText = (mRate > 0) ? "ONLINE" : "OFFLINE";
        if(mAnim) (mRate > 0) ? mAnim.classList.remove('hidden') : mAnim.classList.add('hidden');

        // Inventory
        setVal('qty-5050', store.data.inventory['5050'] || 0);
        setVal('qty-skip', store.data.inventory['skip'] || 0);

        // Profile Stats
        setVal('p-name', store.data.name || "Unknown");
        setVal('p-age', store.data.age || "--");
        setVal('p-rank', this.getRank(store.data.level));
        setVal('p-correct', store.data.stats.correct);
        setVal('p-wrong', store.data.stats.wrong);
        setVal('p-mined', store.data.stats.totalMined || 0);
        
        // [FIXED] Added Games Played Update
        setVal('p-games', store.data.stats.matches);

        // Accuracy Calc
        const total = store.data.stats.totalQ;
        const correct = store.data.stats.correct;
        const acc = total > 0 ? Math.round((correct / total)*100) : 0;
        setVal('p-acc', acc + "%");

        // Render Badges
        const badgeContainer = document.getElementById('p-badges-grid');
        if (badgeContainer) {
            badgeContainer.innerHTML = '';
            if (store.data.achievements.length === 0) {
                badgeContainer.innerHTML = '<span style="color:#444; font-size:0.7rem;">NO DATA</span>';
            } else {
                store.data.achievements.forEach(id => {
                    let icon = 'medal';
                    if(id === 'richie') icon = 'gem';
                    if(id === 'sniper') icon = 'crosshairs';
                    if(id === 'miner') icon = 'hammer';
                    if(id === 'hacker') icon = 'user-secret';
                    
                    const i = document.createElement('i');
                    i.className = `fas fa-${icon} mini-badge`;
                    i.title = id;
                    badgeContainer.appendChild(i);
                });
            }
        }
    }
};

// --- 4. MAIN APP CONTROLLER ---
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
            const boot = document.getElementById('boot-screen');
            if(boot) boot.style.display = 'none';
            document.getElementById('main-app').classList.remove('hidden');
            store.load();
            if(!store.data.name) ui.openModal('register');
        }, 2000);

        // Audio Initialization (First Interaction)
        document.body.addEventListener('click', () => sfx.init(), { once: true });
        document.body.addEventListener('touchstart', () => sfx.init(), { once: true });

        // Auto Update UI Loop (Every 30s)
        setInterval(() => ui.updateAll(), 30000); 

        // PWA Install Handler
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
        });
    },

    registerUser: function() {
        const name = document.getElementById('reg-name').value.trim();
        const age = document.getElementById('reg-age').value.trim();
        if(name.length >= 3 && age > 0) {
            store.register(name, age);
            ui.closeModal();
            sfx.play('correct');
        } else {
            alert("ERROR: Name must be 3+ chars & valid age.");
        }
    },

    showCategorySelection: function() {
        sfx.play('click');
        ui.showScreen('category');
    },

    startGame: function(cat) {
        sfx.play('click');
        let list = [];
        
        // Check if Question Bank exists
        if (window.questionBank) {
            list = (cat === 'mixed') ? window.questionBank : window.questionBank.filter(q => q.category === cat);
        }

        if(!list || list.length === 0) {
            alert("DATABASE ERROR: No questions found.");
            return;
        }

        // Logic: Breach Mode every 5th Level
        this.isBreach = (store.data.level % 5 === 0 && store.data.level > 0);
        const qCount = this.isBreach ? 5 : 10;

        // Shuffle & Slice
        this.qs = [...list].sort(() => Math.random() - 0.5).slice(0, qCount);
        this.qIdx = 0;
        this.score = 0;
        this.active = true;
        store.data.stats.consecutive = 0;

        // Breach Visuals
        const screen = document.getElementById('game-screen');
        const overlay = document.getElementById('breach-overlay');
        
        if (this.isBreach) {
            screen.classList.add('breach-mode');
            overlay.classList.remove('hidden');
            sfx.play('alarm');
        } else {
            screen.classList.remove('breach-mode');
            overlay.classList.add('hidden');
        }

        ui.showScreen('game');
        this.loadQ();
    },

    loadQ: function() {
        if (this.qIdx >= this.qs.length) {
            this.endGame();
            return;
        }

        const q = this.qs[this.qIdx];
        
        // Update Game UI
        document.getElementById('q-current').innerText = this.qIdx + 1;
        document.getElementById('q-total').innerText = this.qs.length;
        document.getElementById('question-text').innerText = q.question;
        document.getElementById('combo-display').classList.add('hidden');

        // Render Options
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
        const isCorrect = currentQ.answer === sel;
        store.data.stats.totalQ++;

        if(isCorrect) {
            store.data.stats.correct++;
            store.data.stats.consecutive++;
            
            // Score Calculation
            let points = this.isBreach ? 20 : 10;
            let bonus = 0;
            
            // Combo Logic
            if(store.data.stats.consecutive > 1) {
                bonus = (store.data.stats.consecutive - 1) * 2;
                const comboEl = document.getElementById('combo-display');
                comboEl.innerText = `COMBO x${store.data.stats.consecutive} (+${bonus})`;
                comboEl.classList.remove('hidden');
            }
            
            this.score += (points + bonus);
            btn.classList.add('correct');
            sfx.play('correct');
        } else {
            store.data.stats.wrong++;
            store.data.stats.consecutive = 0;
            btn.classList.add('wrong');
            sfx.play('wrong');

            // Show Correct Answer
            const opts = document.querySelectorAll('.option-btn');
            opts.forEach(b => {
                if(b.innerText === currentQ.answer) b.classList.add('correct');
            });

            // Breach Mode Penalty
            if(this.isBreach) {
                setTimeout(() => {
                    alert("SECURITY BREACH FAILED! SYSTEM LOCKED.");
                    this.endGame();
                }, 500);
                return;
            }
        }

        setTimeout(() => {
            this.qIdx++;
            this.loadQ();
        }, 1500);
    },

    startTimer: function() {
        clearInterval(this.timer);
        this.timeLeft = 100;
        const bar = document.getElementById('timer-bar');
        const speed = this.isBreach ? 60 : 100; // Faster drain in Breach Mode

        this.timer = setInterval(() => {
            this.timeLeft -= 1;
            bar.style.width = this.timeLeft + '%';
            
            // [FIXED] Used correct CSS Variable names and fallback colors
            if(this.timeLeft < 30) {
                // Try theme variable, fallback to hex
                bar.style.backgroundColor = 'var(--danger-color, #ff003c)';
            } else {
                bar.style.backgroundColor = 'var(--primary-color, #00f3ff)';
            }

            if(this.timeLeft <= 0) {
                clearInterval(this.timer);
                sfx.play('wrong');
                
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
            sfx.play('wrong');
            alert("SYSTEM ERROR: Lifelines disabled in Breach Mode!");
            return;
        }

        if(store.data.inventory[type] > 0) {
            store.data.inventory[type]--;
            sfx.play('click');

            if(type === 'skip') {
                clearInterval(this.timer);
                this.qIdx++;
                this.loadQ();
            } 
            else if(type === '5050') {
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
        clearInterval(this.timer);
        
        store.data.stats.matches++;
        store.addXP(this.score);

        document.getElementById('final-score').innerText = this.score;
        document.getElementById('res-correct').innerText = store.data.stats.correct;
        document.getElementById('game-screen').classList.remove('breach-mode');

        ui.showScreen('result');
        if(this.score > 50) sfx.play('correct');
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
                <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #333; ${isUser ? 'color:var(--primary); font-weight:bold;' : ''}">
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
                <div style="display:flex; align-items:center; gap:10px; padding:10px; border-bottom:1px solid #333; opacity:${unlocked ? 1 : 0.5}">
                    <i class="fas fa-${unlocked ? 'check-circle' : 'lock'}" style="color:${unlocked ? 'var(--success)' : '#555'}"></i>
                    <div>
                        <h4 style="margin:0; color:${unlocked ? '#fff' : '#888'}">${a.title}</h4>
                        <p style="margin:0; font-size:0.8rem; color:#666;">${a.desc}</p>
                    </div>
                </div>`;
        });
    },

    shareScore: function() {
        const rank = document.getElementById('p-rank').innerText;
        const text = `MISSION REPORT:\nAgent ${store.data.name} scored ${this.score} BITS in TRY v5.2!\nRank: ${rank}\nCan you hack the system?`;
        
        if(navigator.share) {
            navigator.share({ title: 'TRY System v5.2', text: text, url: window.location.href });
        } else {
            navigator.clipboard.writeText(text);
            alert("Report copied to clipboard!");
        }
    },

    // [FIXED] Updated to toggle Button Text and Class correctly
    toggleSound: function() {
        store.data.settings.sound = !store.data.settings.sound;
        store.save();
        
        const btn = document.getElementById('btn-sound');
        if(btn) {
            if(store.data.settings.sound) {
                btn.innerText = "ON";
                btn.classList.add('on');
                btn.classList.remove('off');
            } else {
                btn.innerText = "OFF";
                btn.classList.add('off');
                btn.classList.remove('on');
            }
        }
    },
    
    goHome: function() {
        sfx.play('click');
        clearInterval(this.timer);
        ui.closeModal();
        ui.showScreen('home');
    }
};

// Start the Engine
document.addEventListener('DOMContentLoaded', app.init);
