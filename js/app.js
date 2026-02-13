/* MAIN GAME ENGINE: Controls Logic, Score, Timer */

const app = {
    // --- GAME STATE ---
    currentQuestions: [], // Filtered & Shuffled questions
    currentQIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    timer: null,
    timeLeft: 100, // Percentage
    isGameActive: false,
    
    // --- CONFIGURATION ---
    totalTimePerQ: 15, // Seconds per question
    pointsPerQ: 10,

    // --- 1. INITIALIZATION ---
    init: function() {
        console.log("System Initialized...");
        // Button Listeners are already set in HTML onclick attributes
        // pointing to app.method()
    },

    // --- 2. START GAME LOGIC ---
    showCategorySelection: function() {
        ui.showScreen('category');
    },

    startGame: function(category) {
        console.log("Mission Started: " + category);
        
        // 1. Filter Questions
        let filteredQs = [];
        if (category === 'mixed') {
            filteredQs = window.questionBank; // All questions
        } else {
            filteredQs = window.questionBank.filter(q => q.category === category);
        }

        // Check if questions exist
        if (filteredQs.length < 1) {
            alert("No data found for this mission!");
            return;
        }

        // 2. Shuffle Questions (Randomize)
        this.currentQuestions = filteredQs.sort(() => Math.random() - 0.5);
        
        // 3. Reset State
        this.currentQIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.isGameActive = true;

        // 4. Update UI & Show Screen
        document.getElementById('user-points').innerText = "0";
        ui.showScreen('game');
        
        // 5. Load First Question
        this.loadQuestion();
    },

    loadQuestion: function() {
        if (this.currentQIndex >= this.currentQuestions.length) {
            this.endGame();
            return;
        }

        const q = this.currentQuestions[this.currentQIndex];
        
        // Update UI
        ui.updateQuestion(q, this.currentQIndex + 1, this.currentQuestions.length);
        
        // Reset & Start Timer
        this.resetTimer();
    },

    // --- 3. ANSWER HANDLING ---
    handleAnswer: function(selectedOption, btnElement) {
        if (!this.isGameActive) return; // Prevent multiple clicks
        
        this.stopTimer(); // Stop clock immediately
        
        const currentQ = this.currentQuestions[this.currentQIndex];
        const isCorrect = (selectedOption === currentQ.answer);

        // Visual Feedback
        ui.showFeedback(isCorrect, btnElement);

        // Logic Update
        if (isCorrect) {
            this.score += this.pointsPerQ;
            this.correctCount++;
            // Play Sound (Optional)
            // new Audio('assets/sounds/correct.mp3').play();
        } else {
            this.wrongCount++;
            // new Audio('assets/sounds/wrong.mp3').play();
        }

        // Wait 1.5s then go to next
        setTimeout(() => {
            this.currentQIndex++;
            this.loadQuestion();
        }, 1500);
    },

    // --- 4. TIMER LOGIC ---
    resetTimer: function() {
        clearInterval(this.timer);
        this.timeLeft = 100; // 100% width
        
        const decrement = 100 / (this.totalTimePerQ * 10); // Calculation for smooth bar

        this.timer = setInterval(() => {
            this.timeLeft -= decrement;
            ui.updateTimer(this.timeLeft);

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.timeUp();
            }
        }, 100); // Update every 100ms
    },

    stopTimer: function() {
        clearInterval(this.timer);
    },

    timeUp: function() {
        // Treat as wrong answer
        this.wrongCount++;
        // Show correct answer visually (Red feedback on nothing, Green on correct)
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
        ui.showResult(this.score, this.correctCount, this.wrongCount, this.currentQuestions.length);
    },

    // --- 6. NAVIGATION ---
    goHome: function() {
        this.stopTimer();
        ui.showScreen('home');
    },

    showProfile: function() {
        alert("Access Denied: Agent Profile Encrypted.");
    },

    showSettings: function() {
        alert("System Configuration: Locked.");
    },

    // --- 7. LIFELINES (Optional) ---
    useLifeline: function(type) {
        const btn = document.getElementById(`life-${type}`);
        btn.disabled = true; // Disable after use
        btn.style.opacity = "0.5";

        if (type === '5050') {
            // Logic to remove 2 wrong options
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
        else if (type === 'time') {
            this.timeLeft = Math.min(this.timeLeft + 30, 100); // Add time
        }
    }
};

// Start App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
