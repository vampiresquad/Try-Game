/* UI CONTROLLER V2.0 */
const ui = {
    screens: {
        home: document.getElementById('home-screen'),
        category: document.getElementById('category-screen'),
        game: document.getElementById('game-screen'),
        result: document.getElementById('result-screen')
    },

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
            this.screens[screenName].classList.add('active');
        }
    },

    // --- NEW: MODAL HANDLING ---
    openModal(type) {
        // Sound Effect
        if(typeof sfx !== 'undefined') sfx.playClick();
        
        document.getElementById('modal-overlay').classList.remove('hidden');
        
        // Hide all modals first
        document.querySelectorAll('.modal-box').forEach(box => box.classList.add('hidden'));
        
        // Show specific modal
        const modal = document.getElementById(`modal-${type}`);
        if(modal) {
            modal.classList.remove('hidden');
            store.updateUI(); // Refresh data in modal
        }
    },

    closeModal() {
        if(typeof sfx !== 'undefined') sfx.playClick();
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    // ... (বাকি updateQuestion, showFeedback, updateTimer আগের মতোই থাকবে) ...
    
    // updateQuestion এ শুধু টাইপরাইটার এফেক্টটা একটু ফাস্ট করবেন যদি পারেন
    updateQuestion(questionObj, currentQ, totalQ) {
        document.getElementById('q-current').innerText = currentQ;
        document.getElementById('q-total').innerText = totalQ;
        document.getElementById('question-text').innerText = questionObj.question;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        questionObj.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = option;
            btn.onclick = () => app.handleAnswer(option, btn);
            optionsContainer.appendChild(btn);
        });
        this.updateTimer(100);
        
        // Update Lifeline Counts
        store.updateUI();
    },
    
    showFeedback(isCorrect, btnElement) {
        if (isCorrect) btnElement.classList.add('correct');
        else btnElement.classList.add('wrong');
    },

    updateTimer(percent) {
        const bar = document.getElementById('timer-bar');
        bar.style.width = percent + '%';
        bar.style.backgroundColor = percent < 30 ? '#ff0000' : 'var(--secondary-color)';
    },

    showResult(score, correct, wrong, total) {
        document.getElementById('final-score').innerText = score;
        document.getElementById('res-correct').innerText = correct;
        document.getElementById('res-wrong').innerText = wrong;
        
        const title = document.getElementById('result-title');
        title.innerText = score > (total * 5) ? "MISSION SUCCESS" : "MISSION FAILED";
        title.style.color = score > (total * 5) ? "#0f0" : "#f00";
        
        this.showScreen('result');
    }
};
