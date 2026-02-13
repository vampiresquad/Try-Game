/* GAME ENGINE V2.0 - With Persistence & Shop */

// --- 1. LOCAL STORAGE SYSTEM ---
const store = {
    data: {
        xp: 0,
        level: 1,
        matches: 0,
        inventory: { '5050': 1, 'skip': 1 }, // Default 1 free each
        settings: { sound: true }
    },

    load: function() {
        const saved = localStorage.getItem('try_game_data_v2');
        if (saved) {
            this.data = JSON.parse(saved);
        }
        this.updateUI();
    },

    save: function() {
        localStorage.setItem('try_game_data_v2', JSON.stringify(this.data));
        this.updateUI();
    },

    addXP: function(amount) {
        this.data.xp += amount;
        // Level Up Logic (Simple: Every 100 XP = 1 Level)
        this.data.level = Math.floor(this.data.xp / 100) + 1;
        this.data.matches++;
        this.save();
    },

    buyItem: function(type, cost) {
        if (this.data.xp >= cost) {
            this.data.xp -= cost;
            this.data.inventory[type]++;
            this.save();
            sfx.playCorrect(); // Success sound
            alert(`Purchased 1 ${type.toUpperCase()} module!`); // You can replace with custom toast later
        } else {
            sfx.playWrong();
            alert("Insufficient BITS (XP)!");
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

    resetData: function() {
        if(confirm("Factory Reset System? All progress will be lost.")) {
            localStorage.removeItem('try_game_data_v2');
            location.reload();
        }
    },

    updateUI: function() {
        // Update Top Bar
        document.getElementById('user-points').innerText = this.data.xp;
        document.getElementById('current-level').innerText = this.data.level;
        
        // Update Profile Modal
        document.getElementById('profile-xp').innerText = this.data.xp;
        document.getElementById('profile-matches').innerText = this.data.matches;
        document.getElementById('profile-rank').innerText = this.data.level > 5 ? "Elite Hacker" : "Script Kiddie";
        
        // Update Shop
        document.getElementById('shop-balance').innerText = this.data.xp;
        
        // Update Game Lifeline Badges
        document.getElementById('qty-5050').innerText = this.data.inventory['5050'];
        document.getElementById('qty-skip').innerText = this.data.inventory['skip'];

        // Update Settings
        const btn = document.getElementById('btn-sound');
        btn.innerText = this.data.settings.sound ? "ON" : "OFF";
        btn.className = this.data.settings.sound ? "toggle-btn on" : "toggle-btn";
    }
};

// --- 2. SOUND SYSTEM ---
const sfx = {
    ctx: null,
    init: function() {
        if (!store.data.settings.sound) return;
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playTone: function(freq, type, duration) {
        if (!store.data.settings.sound || !this.ctx) { this.init(); return; }
        if (!this.ctx) return; 
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    playClick: () => sfx.playTone(800, 'square', 0.05),
    playCorrect: () => { sfx.playTone(600, 'sine', 0.1); setTimeout(() => sfx.playTone(1200, 'sine', 0.2), 100); },
    playWrong: () => sfx.playTone(150, 'sawtooth', 0.3)
};

// --- 3. MAIN GAME LOGIC ---
const app = {
    currentQuestions: [],
    currentQIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    timer: null,
    timeLeft: 100,
    isGameActive: false,
    
    init: function() {
        store.load(); // Load Saved Data
        document.body.addEventListener('click', () => sfx.init(), { once: true });
    },

    toggleSound: function() {
        store.data.settings.sound = !store.data.settings.sound;
        store.save();
    },

    showCategorySelection: function() {
        sfx.playClick();
        ui.showScreen('category');
    },

    startGame: function(category) {
        sfx.playClick();
        let filteredQs = (category === 'mixed') ? window.questionBank : window.questionBank.filter(q => q.category === category);
        
        if (filteredQs.length < 1) { alert("No data!"); return; }

        this.currentQuestions = filteredQs.sort(() => Math.random() - 0.5).slice(0, 10); // Max 10 Questions per round
        
        this.currentQIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.isGameActive = true;

        ui.showScreen('game');
        this.loadQuestion();
    },

    loadQuestion: function() {
        if (this.currentQIndex >= this.currentQuestions.length) {
            this.endGame();
            return;
        }
        const q = this.currentQuestions[this.currentQIndex];
        ui.updateQuestion(q, this.currentQIndex + 1, this.currentQuestions.length);
        this.resetTimer();
    },

    handleAnswer: function(selectedOption, btnElement) {
        if (!this.isGameActive) return;
        this.stopTimer();
        
        const currentQ = this.currentQuestions[this.currentQIndex];
        const isCorrect = (selectedOption === currentQ.answer);

        ui.showFeedback(isCorrect, btnElement);

        if (isCorrect) {
            sfx.playCorrect();
            this.score += 10; // 10 XP per correct
            this.correctCount++;
        } else {
            sfx.playWrong();
            this.wrongCount++;
        }

        setTimeout(() => {
            this.currentQIndex++;
            this.loadQuestion();
        }, 1500);
    },

    resetTimer: function() {
        clearInterval(this.timer);
        this.timeLeft = 100; 
        this.timer = setInterval(() => {
            this.timeLeft -= 1; // Faster tick
            ui.updateTimer(this.timeLeft);
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.timeUp();
            }
        }, 150); // Speed control
    },

    stopTimer: function() { clearInterval(this.timer); },

    timeUp: function() {
        sfx.playWrong();
        this.wrongCount++;
        // Highlight logic here if needed
        setTimeout(() => {
            this.currentQIndex++;
            this.loadQuestion();
        }, 1500);
    },

    endGame: function() {
        this.isGameActive = false;
        this.stopTimer();
        
        // SAVE SCORE TO PERSISTENT STORAGE
        store.addXP(this.score);
        if(this.score > 0) sfx.playCorrect();
        
        ui.showResult(this.score, this.correctCount, this.wrongCount, this.currentQuestions.length);
    },

    goHome: function() {
        sfx.playClick();
        this.stopTimer();
        ui.closeModal(); // Close any open modal
        ui.showScreen('home');
    },

    useLifeline: function(type) {
        sfx.playClick();
        const btn = document.getElementById(`life-${type}`);
        
        if (btn.disabled) return;

        // CHECK INVENTORY
        if (store.useItem(type)) {
            // Apply Effect
            if (type === '5050') {
                const currentQ = this.currentQuestions[this.currentQIndex];
                const options = document.querySelectorAll('.option-btn');
                let removed = 0;
                options.forEach(opt => {
                    if (opt.innerText !== currentQ.answer && removed < 2) {
                        opt.style.visibility = "hidden";
                        removed++;
                    }
                });
                btn.disabled = true; // Disable for this question only
            } else if (type === 'skip') {
                this.stopTimer();
                this.currentQIndex++;
                this.loadQuestion();
            }
        } else {
            alert("Empty! Buy more from Black Market.");
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
