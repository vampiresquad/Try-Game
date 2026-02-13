/* TRY SYSTEM v3.0 - ULTIMATE EDITION */

// --- 1. LOCAL STORAGE & DATA ---
const store = {
    data: {
        xp: 0,
        level: 1,
        matches: 0,
        inventory: { '5050': 2, 'skip': 2 },
        highScore: 0
    },

    load: function() {
        const saved = localStorage.getItem('try_v3_data');
        if (saved) this.data = JSON.parse(saved);
        this.updateUI();
    },

    save: function() {
        localStorage.setItem('try_v3_data', JSON.stringify(this.data));
        this.updateUI();
    },

    addXP: function(amount) {
        this.data.xp += amount;
        this.data.level = Math.floor(this.data.xp / 100) + 1; // 100 XP = 1 Level
        
        // Update High Score
        if (this.data.xp > this.data.highScore) {
            this.data.highScore = this.data.xp;
        }
        
        this.data.matches++;
        this.save();
    },

    buyItem: function(type, cost) {
        if (this.data.xp >= cost) {
            this.data.xp -= cost;
            this.data.inventory[type]++;
            this.save();
            sfx.playCorrect();
            ui.showToast(`Purchased: ${type.toUpperCase()}`);
        } else {
            sfx.playWrong();
            ui.showToast("Insufficient BITS!");
        }
    },

    useItem: function(type) {
        if (this.data.inventory[type] > 0) {
            this.data.inventory[type]--;
            this.save();
            return true;
        }
        return false;
    },

    updateUI: function() {
        // Safe check for elements before updating
        const setText = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.innerText = val;
        };

        setText('user-points', this.data.xp);
        setText('current-level', this.data.level);
        setText('profile-xp', this.data.xp);
        setText('profile-matches', this.data.matches);
        setText('shop-balance', this.data.xp);
        setText('qty-5050', this.data.inventory['5050']);
        setText('qty-skip', this.data.inventory['skip']);
        
        // Dynamic Rank Name
        const rankEl = document.getElementById('profile-rank');
        if(rankEl) {
            if(this.data.level < 5) rankEl.innerText = "Script Kiddie";
            else if(this.data.level < 10) rankEl.innerText = "White Hat";
            else if(this.data.level < 20) rankEl.innerText = "Cyber Ninja";
            else rankEl.innerText = "Elite Phantom";
        }
    }
};

// --- 2. SOUND & HAPTICS ENGINE ---
const sfx = {
    ctx: null,
    init: function() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playTone: function(freq, type, duration) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime); // Low volume
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    click: () => { sfx.playTone(800, 'square', 0.05); navigator.vibrate?.(10); },
    correct: () => { sfx.playTone(600, 'sine', 0.1); setTimeout(() => sfx.playTone(1200, 'sine', 0.2), 100); navigator.vibrate?.([50, 50, 50]); },
    wrong: () => { sfx.playTone(150, 'sawtooth', 0.3); navigator.vibrate?.(200); }
};

// --- 3. UI CONTROLLER (Toast & Modals) ---
const ui = {
    screens: {
        home: document.getElementById('home-screen'),
        category: document.getElementById('category-screen'),
        game: document.getElementById('game-screen'),
        result: document.getElementById('result-screen')
    },

    showScreen(name) {
        Object.values(this.screens).forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        this.screens[name].classList.remove('hidden');
        this.screens[name].classList.add('active');
    },

    openModal(type) {
        sfx.click();
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.querySelectorAll('.modal-box').forEach(b => b.classList.add('hidden'));
        document.getElementById(`modal-${type}`).classList.remove('hidden');
        
        if(type === 'leaderboard') app.generateLeaderboard();
    },

    closeModal() {
        sfx.click();
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    showToast(msg) {
        // Simple alert replacement for now, can be upgraded to custom toast
        alert(`[SYSTEM]: ${msg}`);
    },
    
    // UI Helpers
    updateQuestion(q, current, total) {
        document.getElementById('q-current').innerText = current;
        document.getElementById('q-total').innerText = total;
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
    },

    showCombo(count) {
        const el = document.getElementById('combo-display');
        el.innerText = `COMBO x${count}!`;
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('hidden'), 1000);
    }
};

// --- 4. MAIN APPLICATION ---
const app = {
    currentQuestions: [],
    qIndex: 0,
    score: 0,
    combo: 0,
    timer: null,
    timeLeft: 100,
    gameActive: false,

    init: function() {
        // Boot Sequence Logic
        setTimeout(() => {
            document.getElementById('boot-log').innerText = "ACCESS GRANTED...";
        }, 1500);
        setTimeout(() => {
            document.getElementById('boot-screen').style.display = 'none';
            document.getElementById('main-app').classList.remove('hidden');
            store.load();
        }, 2500);

        // Sound Init
        document.body.addEventListener('click', () => sfx.init(), { once: true });
    },

    showCategorySelection: function() {
        sfx.click();
        ui.showScreen('category');
    },

    startGame: function(cat) {
        sfx.click();
        let qs = (cat === 'mixed') ? window.questionBank : window.questionBank.filter(q => q.category === cat);
        
        if (qs.length < 1) { ui.showToast("No Data Available"); return; }
        
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
        ui.updateQuestion(this.currentQuestions[this.qIndex], this.qIndex + 1, this.currentQuestions.length);
        this.startTimer();
    },

    handleAnswer: function(selected, btn) {
        if (!this.gameActive) return;
        clearInterval(this.timer);
        
        const correct = this.currentQuestions[this.qIndex].answer;
        const isCorrect = (selected === correct);

        if (isCorrect) {
            this.combo++;
            let points = 10;
            if (this.combo > 1) {
                points += 5; // Bonus for combo
                ui.showCombo(this.combo);
            }
            this.score += points;
            btn.classList.add('correct');
            sfx.correct();
        } else {
            this.combo = 0;
            btn.classList.add('wrong');
            sfx.wrong();
            // Highlight correct one
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
        document.getElementById('timer-bar').style.width = '100%';
        
        this.timer = setInterval(() => {
            this.timeLeft -= 1;
            const bar = document.getElementById('timer-bar');
            bar.style.width = this.timeLeft + '%';
            
            if (this.timeLeft < 30) bar.style.backgroundColor = '#f00';
            else bar.style.backgroundColor = 'var(--secondary-color)';

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                sfx.wrong();
                this.combo = 0;
                this.qIndex++;
                this.loadQuestion(); // Auto skip on timeout
            }
        }, 150); // Speed
    },

    endGame: function() {
        this.gameActive = false;
        clearInterval(this.timer);
        store.addXP(this.score);
        
        document.getElementById('final-score').innerText = this.score;
        // Simple counts logic omitted for brevity, you can add if needed
        ui.showScreen('result');
        if(this.score > 50) sfx.correct();
    },

    useLifeline: function(type) {
        sfx.click();
        const btn = document.getElementById(`life-${type}`);
        if (store.useItem(type)) {
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
            ui.showToast("Buy from Black Market!");
        }
    },
    
    // --- 5. SOCIAL SHARE (NATIVE) ---
    shareScore: function() {
        const shareData = {
            title: 'TRY - Cyber Quiz',
            text: `⚠️ SECURITY ALERT ⚠️\nI just scored ${this.score} BITS in TRY System! Rank: ${store.data.level}.\nCan you hack my score?`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).then(() => console.log('Shared successfully'));
        } else {
            // Fallback for PC
            navigator.clipboard.writeText(`${shareData.text} \nPlay: ${shareData.url}`);
            ui.showToast("Score copied to clipboard!");
        }
    },

    // --- 6. FAKE LEADERBOARD GENERATOR ---
    generateLeaderboard: function() {
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = '';
        
        // Mock Data
        let ranks = [
            { name: "VampireSquad", xp: 5000 },
            { name: "Neon_Ghost", xp: 4200 },
            { name: "Cyber_Wolf", xp: 3800 },
            { name: "Zero_Cool", xp: 3100 },
            { name: "You (Agent)", xp: store.data.xp } // Your Score
        ];

        // Sort by XP
        ranks.sort((a, b) => b.xp - a.xp);

        ranks.forEach((r, i) => {
            const div = document.createElement('div');
            div.className = `rank-row ${r.name.includes('You') ? 'highlight' : ''}`;
            div.innerHTML = `<span>#${i+1} ${r.name}</span> <span>${r.xp} XP</span>`;
            list.appendChild(div);
        });
    }
};

// START
document.addEventListener('DOMContentLoaded', app.init);
