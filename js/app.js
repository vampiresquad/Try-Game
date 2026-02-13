/* MAIN GAME ENGINE: Controls Logic, Score, Timer + Sound Generator */

// --- SOUND SYSTEM (NO ASSETS NEEDED) ---
const sfx = {
    ctx: null, // Audio Context

    init: function() {
        // Initialize Audio Context on first user interaction
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playTone: function(freq, type, duration) {
        if (!this.ctx) this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type; // sine, square, sawtooth, triangle
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playClick: function() {
        this.playTone(800, 'square', 0.05); // Short robotic blip
    },

    playCorrect: function() {
        // Two tones ascending (Success feel)
        this.playTone(600, 'sine', 0.1);
        setTimeout(() => this.playTone(1200, 'sine', 0.2), 100);
    },

    playWrong: function() {
        // Low buzzing sound (Error feel)
        this.playTone(150, 'sawtooth', 0.3);
    }
};


const app = {
    // --- GAME STATE ---
    currentQuestions: [],
    currentQIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    timer: null,
    timeLeft: 100,
    isGameActive: false,
    
    // --- CONFIGURATION ---
    totalTimePerQ: 15, 
    pointsPerQ: 10,

    // --- 1. INITIALIZATION ---
    init: function() {
        console.log("System Initialized...");
        // Initialize sound on first click to bypass browser restrictions
        document.body.addEventListener('click', () => sfx.init(), { once: true });
    },

    // --- 2. START GAME LOGIC ---
    showCategorySelection: function() {
        sfx.playClick();
        ui.showScreen('category');
    },

    startGame: function(category) {
        sfx.playClick();
        console.log("Mission Started: " + category);
        
        // 1. Filter Questions
        let filteredQs = [];
        if (category === 'mixed') {
            filteredQs = window.questionBank;
        } else {
            filteredQs = window.questionBank.filter(q => q.category === category);
        }

        if (filteredQs.length < 1) {
            alert("No data found for this mission!");
            return;
        }

        // 2. Shuffle
        this.currentQuestions = filteredQs.sort(() => Math.random() - 0.5);
        
        // 3. Reset State
        this.currentQIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.isGameActive = true;

        document.getElementById('user-points').innerText = "0";
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

    // --- 3. ANSWER HANDLING ---
    handleAnswer: function(selectedOption, btnElement) {
        if (!this.isGameActive) return;
        
        this.stopTimer();
        
        const currentQ = this.currentQuestions[this.currentQIndex];
        const isCorrect = (selectedOption === currentQ.answer);

        ui.showFeedback(isCorrect, btnElement);

        if (isCorrect) {
            sfx.playCorrect(); // Play Generated Correct Sound
            this.score += this.pointsPerQ;
            this.correctCount++;
        } else {
            sfx.playWrong(); // Play Generated Wrong Sound
            this.wrongCount++;
        }

        setTimeout(() => {
            this.currentQIndex++;
            this.loadQuestion();
        }, 1500);
    },

    // --- 4. TIMER LOGIC ---
    resetTimer: function() {
        clearInterval(this.timer);
        this.timeLeft = 100; 
        
        const decrement = 100 / (this.totalTimePerQ * 10); 

        this.timer = setInterval(() => {
            this.timeLeft -= decrement;
            ui.updateTimer(this.timeLeft);

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.timeUp();
            }
        }, 100); 
    },

    stopTimer: function() {
        clearInterval(this.timer);
    },

    timeUp: function() {
        sfx.playWrong(); // Play Sound
        this.wrongCount++;
        
        // Highlight correct answer
        const allBtns = document.querySelectorAll('.option-btn');
        const currentQ = this.currentQuestions[this.currentQIndex];
        allBtns.forEach(btn => {
            if (btn.innerText === currentQ.answer) {
                btn.classList.add('correct');
            }
        });

        setTimeout(() => {
            this.currentQIndex++;
            this.loadQuestion();
        }, 1500);
    },

    // --- 5. END GAME ---
    endGame: function() {
        this.isGameActive = false;
        this.stopTimer();
        // Play success sound
        if(this.score > 0) sfx.playCorrect();
        ui.showResult(this.score, this.correctCount, this.wrongCount, this.currentQuestions.length);
    },

    // --- 6. NAVIGATION ---
    goHome: function() {
        sfx.playClick();
        this.stopTimer();
        ui.showScreen('home');
    },

    showProfile: function() {
        sfx.playClick();
        alert("Access Denied: Agent Profile Encrypted.");
    },

    // --- 7. LIFELINES ---
    useLifeline: function(type) {
        sfx.playClick();
        const btn = document.getElementById(`life-${type}`);
        
        // Check if already used
        if(btn.disabled) return;

        btn.disabled = true;
        btn.style.opacity = "0.5";

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
        } 
        else if (type === 'skip') {
            this.stopTimer();
            this.currentQIndex++;
            this.loadQuestion();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
