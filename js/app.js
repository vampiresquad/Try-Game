/* TRY - ULTIMATE QUIZ SYSTEM ENGINE 
    Developed by Muhammad Shourov
    Version: 4.0 (Final Release)
*/

// --- 1. DATA STORE & LOCAL STORAGE ---
const store = {
    // Default Data Schema
    data: {
        name: null,       // User Name
        age: null,        // User Age
        xp: 0,
        level: 1,
        inventory: { '5050': 2, 'skip': 2 },
        stats: {
            matchesPlayed: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0
        },
        settings: { sound: true }
    },

    load: function() {
        const saved = localStorage.getItem('try_data_v4');
        if (saved) {
            this.data = JSON.parse(saved);
        }
    },

    save: function() {
        localStorage.setItem('try_data_v4', JSON.stringify(this.data));
        ui.updateAll(); // Update UI whenever saved
    },

    // Registration Logic
    register: function(name, age) {
        this.data.name = name;
        this.data.age = age;
        this.save();
    },

    // Progress Logic
    addXP: function(amount) {
        this.data.xp += amount;
        this.data.level = Math.floor(this.data.xp / 100) + 1;
        this.save();
    },

    updateStats: function(isCorrect) {
        this.data.stats.totalQuestions++;
        if(isCorrect) this.data.stats.correctAnswers++;
        else this.data.stats.wrongAnswers++;
        this.save();
    },

    finishMatch: function() {
        this.data.stats.matchesPlayed++;
        this.save();
    },

    // Shop Logic
    buyItem: function(type, cost) {
        if(this.data.xp >= cost) {
            this.data.xp -= cost;
            this.data.inventory[type]++;
            this.save();
            sfx.correct();
            alert(`Purchased: ${type.toUpperCase()}`);
        } else {
            sfx.wrong();
            alert("Insufficient BITS!");
        }
    },

    useItem: function(type) {
        if(this.data.inventory[type] > 0) {
            this.data.inventory[type]--;
            this.save();
            return true;
        }
        return false;
    },

    resetData: function() {
        if(confirm("WARNING: This will delete your identity and progress. Continue?")) {
            localStorage.removeItem('try_data_v4');
            location.reload();
        }
    }
};

// --- 2. SOUND & HAPTIC ENGINE (Code Generated) ---
const sfx = {
    ctx: null,
    init: function() {
        if(!store.data.settings.sound) return;
        if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playTone: function(freq, type, duration) {
        if(!store.data.settings.sound || !this.ctx) { this.init(); return; }
        if(!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    click: () => { sfx.playTone(800, 'square', 0.05); navigator.vibrate?.(10); },
    correct: () => { sfx.playTone(600, 'sine', 0.1); setTimeout(() => sfx.playTone(1200, 'sine', 0.2), 100); navigator.vibrate?.([50, 50]); },
    wrong: () => { sfx.playTone(150, 'sawtooth', 0.3); navigator.vibrate?.(200); }
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
        this.screens[name].classList.remove('hidden');
        this.screens[name].classList.add('active');
    },

    openModal: function(type) {
        sfx.click();
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('hidden');
        
        document.querySelectorAll('.modal-box').forEach(b => b.classList.add('hidden'));
        
        const modal = document.getElementById(`modal-${type}`);
        modal.classList.remove('hidden');

        // Prevent closing registration modal
        if(type === 'register') {
            overlay.onclick = null; // Disable background click close
        } else {
            // Background click closes other modals
            overlay.onclick = (e) => {
                if(e.target === overlay) ui.closeModal();
            };
        }

        if(type === 'leaderboard') app.generateLeaderboard();
        ui.updateAll();
    },

    closeModal: function() {
        sfx.click();
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    updateAll: function() {
        // Safe Update
        const safeSet = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };

        // Header
        safeSet('user-points', store.data.xp);
        safeSet('current-level', store.data.level);
        safeSet('player-name-display', store.data.name || "Agent");

        // Profile Modal
        safeSet('p-name', store.data.name || "Unknown");
        safeSet('p-age', store.data.age || "--");
        safeSet('p-xp', store.data.xp);
        safeSet('p-matches', store.data.stats.matchesPlayed);
        safeSet('p-total-q', store.data.stats.totalQuestions);
        safeSet('p-correct', store.data.stats.correctAnswers);
        safeSet('p-wrong', store.data.stats.wrongAnswers);

        // Rank Calculation
        const rankEl = document.getElementById('p-rank');
        if(rankEl) {
            const lvl = store.data.level;
            if(lvl < 5) rankEl.innerText = "Script Kiddie";
            else if(lvl < 10) rankEl.innerText = "White Hat";
            else if(lvl < 20) rankEl.innerText = "Cyber Ninja";
            else rankEl.innerText = "Elite Phantom";
        }

        // Shop & Game
        safeSet('shop-balance', store.data.xp);
        safeSet('qty-5050', store.data.inventory['5050']);
        safeSet('qty-skip', store.data.inventory['skip']);
        
        // Settings
        const sndBtn = document.getElementById('btn-sound');
        if(sndBtn) {
            sndBtn.innerText = store.data.settings.sound ? "ON" : "OFF";
            sndBtn.className = store.data.settings.sound ? "toggle-btn on" : "toggle-btn";
        }
    }
};

// --- 4. MAIN APPLICATION LOGIC ---
const app = {
    currentQuestions: [],
    qIndex: 0,
    score: 0,
    combo: 0,
    timer: null,
    timeLeft: 100,
    gameActive: false,

    init: function() {
        // Boot Sequence
        setTimeout(() => { document.getElementById('boot-log').innerText = "LOADING USER DATA..."; }, 1500);
        
        setTimeout(() => {
            document.getElementById('boot-screen').style.display = 'none';
            document.getElementById('main-app').classList.remove('hidden');
            store.load();

            // CHECK REGISTRATION
            if(!store.data.name) {
                ui.openModal('register');
            } else {
                ui.updateAll();
            }
        }, 2500);

        document.body.addEventListener('click', () => sfx.init(), { once: true });
    },

    registerUser: function() {
        const name = document.getElementById('reg-name').value.trim();
        const age = document.getElementById('reg-age').value.trim();

        if(name.length > 2 && age > 0) {
            sfx.correct();
            store.register(name, age);
            ui.closeModal();
            alert(`Welcome, Agent ${name}. System unlocked.`);
        } else {
            sfx.wrong();
            alert("Invalid Identity. Please enter valid Name and Age.");
        }
    },

    toggleSound: function() {
        store.data.settings.sound = !store.data.settings.sound;
        store.save();
    },

    showCategorySelection: function() {
        sfx.click();
        ui.showScreen('category');
    },

    startGame: function(cat) {
        sfx.click();
        let qs = (cat === 'mixed') ? window.questionBank : window.questionBank.filter(q => q.category === cat);
        
        if (!qs || qs.length < 1) { alert("No Questions Found!"); return; }
        
        this.currentQuestions = qs.sort(() => Math.random() - 0.5).slice(0, 10);
        this.qIndex = 0;
        this.score = 0;
        this.combo = 0;
        this.gameActive = true;
        
        ui.showScreen('game');
        this.loadQuestion();
    },

    loadQuestion: function() {
        if (this.qIndex >= this.currentQuestions.length) {
            this.endGame();
            return;
        }
        const q = this.currentQuestions[this.qIndex];
        
        // Update UI
        document.getElementById('q-current').innerText = this.qIndex + 1;
        document.getElementById('q-total').innerText = this.currentQuestions.length;
        document.getElementById('question-text').innerText = q.question;
        
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => app.handleAnswer(opt, btn);
            container.appendChild(btn);
        });

        this.startTimer();
    },

    handleAnswer: function(selected, btn) {
        if (!this.gameActive) return;
        clearInterval(this.timer);
        
        const correct = this.currentQuestions[this.qIndex].answer;
        const isCorrect = (selected === correct);

        // Update Stats
        store.updateStats(isCorrect);

        if (isCorrect) {
            this.combo++;
            let points = 10;
            if (this.combo > 1) {
                points += 5;
                const cEl = document.getElementById('combo-display');
                cEl.innerText = `COMBO x${this.combo}!`;
                cEl.classList.remove('hidden');
                setTimeout(() => cEl.classList.add('hidden'), 1000);
            }
            this.score += points;
            btn.classList.add('correct');
            sfx.correct();
        } else {
            this.combo = 0;
            btn.classList.add('wrong');
            sfx.wrong();
            // Highlight correct answer
            Array.from(document.querySelectorAll('.option-btn')).forEach(b => {
                if(b.innerText === correct) b.classList.add('correct');
            });
        }

        setTimeout(() => {
            this.qIndex++;
            this.loadQuestion();
        }, 1500);
    },

    startTimer: function() {
        clearInterval(this.timer);
        this.timeLeft = 100;
        const bar = document.getElementById('timer-bar');
        bar.style.width = '100%';
        bar.style.backgroundColor = 'var(--secondary-color)';

        this.timer = setInterval(() => {
            this.timeLeft -= 1;
            bar.style.width = this.timeLeft + '%';
            if(this.timeLeft < 30) bar.style.backgroundColor = '#f00';
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                sfx.wrong();
                store.updateStats(false); // Time out = wrong
                this.combo = 0;
                this.qIndex++;
                this.loadQuestion();
            }
        }, 150);
    },

    useLifeline: function(type) {
        sfx.click();
        const btn = document.getElementById(`life-${type}`);
        
        if(store.useItem(type)) {
            btn.style.opacity = '0.5';
            btn.disabled = true;
            
            if (type === '5050') {
                const correct = this.currentQuestions[this.qIndex].answer;
                const opts = Array.from(document.querySelectorAll('.option-btn'));
                let removed = 0;
                opts.forEach(o => {
                    if (o.innerText !== correct && removed < 2) {
                        o.style.visibility = 'hidden';
                        removed++;
                    }
                });
            } else if (type === 'skip') {
                clearInterval(this.timer);
                this.qIndex++;
                this.loadQuestion();
            }
        } else {
            alert("No items left! Visit Market.");
        }
    },

    endGame: function() {
        this.gameActive = false;
        clearInterval(this.timer);
        store.addXP(this.score);
        store.finishMatch();
        
        document.getElementById('final-score').innerText = this.score;
        document.getElementById('res-correct').innerText = store.data.stats.correctAnswers; // Showing Total Stats in result for now or session stats? 
        // Let's show Session Stats in Result for better UX, but we tracked Total. 
        // For simplicity, showing score is enough here.
        
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
        const text = `⚠️ SYSTEM ALERT ⚠️\nAgent ${store.data.name} just scored ${this.score} BITS in TRY! \nRank: ${document.getElementById('p-rank').innerText}\nCan you beat me?`;
        if (navigator.share) {
            navigator.share({ title: 'TRY System', text: text, url: window.location.href });
        } else {
            navigator.clipboard.writeText(text);
            alert("Score copied to clipboard!");
        }
    },

    generateLeaderboard: function() {
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = '';
        const ranks = [
            { name: "VampireSquad", xp: 9999 },
            { name: "Cyber_Wolf", xp: 5000 },
            { name: "Zero_Cool", xp: 4200 },
            { name: store.data.name || "You", xp: store.data.xp }
        ].sort((a,b) => b.xp - a.xp);

        ranks.forEach((r, i) => {
            const div = document.createElement('div');
            div.style.cssText = "display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #333; font-size:0.9rem;";
            if(r.name === store.data.name) div.style.color = "var(--primary-color)";
            div.innerHTML = `<span>#${i+1} ${r.name}</span> <span>${r.xp} XP</span>`;
            list.appendChild(div);
        });
    }
};

// INITIALIZE
document.addEventListener('DOMContentLoaded', app.init);
