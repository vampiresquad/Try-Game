/* UI CONTROLLER: Handles all visual updates */

const ui = {
    // 1. Screen Management
    screens: {
        home: document.getElementById('home-screen'),
        category: document.getElementById('category-screen'),
        game: document.getElementById('game-screen'),
        result: document.getElementById('result-screen')
    },

    // Function to switch screens smoothly
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });

        // Show the target screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
            this.screens[screenName].classList.add('active');
        }
    },

    // 2. Game UI Updates
    updateQuestion(questionObj, currentQ, totalQ) {
        // Update badges
        document.getElementById('q-current').innerText = currentQ;
        document.getElementById('q-total').innerText = totalQ;

        // Update Question Text with Typewriter effect (optional simplified here)
        document.getElementById('question-text').innerText = questionObj.question;

        // Clear old options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        // Create new option buttons
        questionObj.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = option;
            btn.onclick = () => app.handleAnswer(option, btn); // Call Main App Logic
            optionsContainer.appendChild(btn);
        });

        // Reset Timer Bar
        this.updateTimer(100);
    },

    // 3. Feedback (Correct/Wrong)
    showFeedback(isCorrect, btnElement) {
        if (isCorrect) {
            btnElement.classList.add('correct');
            // Play sound (if needed later)
        } else {
            btnElement.classList.add('wrong');
            // Highlight the correct answer automatically
            const allBtns = document.querySelectorAll('.option-btn');
            allBtns.forEach(btn => {
                if (btn.innerText === app.currentQuestion.answer) {
                    btn.classList.add('correct');
                }
            });
        }
    },

    // 4. Timer Animation
    updateTimer(percent) {
        const bar = document.getElementById('timer-bar');
        bar.style.width = percent + '%';
        
        // Change color based on time left
        if (percent < 30) {
            bar.style.backgroundColor = '#ff0000'; // Red alert
            bar.style.boxShadow = '0 0 10px #ff0000';
        } else {
            bar.style.backgroundColor = 'var(--secondary-color)';
            bar.style.boxShadow = '0 0 10px var(--secondary-color)';
        }
    },

    // 5. Result Screen Update
    showResult(score, correct, wrong, total) {
        document.getElementById('final-score').innerText = score;
        document.getElementById('res-correct').innerText = correct;
        document.getElementById('res-wrong').innerText = wrong;
        
        // Dynamic Message
        const title = document.getElementById('result-title');
        if (score > (total * 5)) { // Assuming 10 points per q
            title.innerText = "MISSION ACCOMPLISHED";
            title.style.color = "#0f0";
        } else {
            title.innerText = "MISSION FAILED";
            title.style.color = "#f00";
        }
        
        this.showScreen('result');
    }
};
