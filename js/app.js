/********************** GLOBAL STATE **********************/
let user = {
    name: '',
    age: null,
    level: 1,
    xp: 0,
    bits: 100,
    gamesPlayed: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    inventory: { '5050': 2, 'skip': 2 },
    lastMining: Date.now()
};

let gameSession = {
    questions: [],
    currentIndex: 0,
    askedIds: new Set(),     // better than array for lookup
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    bitsEarned: 0,
    xpEarned: 0,
    lifelinesUsed: { '5050': false, 'skip': false },
    timerInterval: null,
    timeLeft: 30,
    currentQuestion: null,
    category: 'all'
};

let achievements = [
    { id: 'play5', name: 'Novice', desc: 'Play 5 games', condition: () => user.gamesPlayed >= 5, unlocked: false },
    { id: 'correct50', name: 'Sharp Mind', desc: '50 correct answers', condition: () => user.totalCorrect >= 50, unlocked: false },
    { id: 'bits1000', name: 'Rich Hacker', desc: 'Earn 1000 bits', condition: () => user.bits >= 1000, unlocked: false }
];

let audioCtx = null;

/********************** DOM ELEMENTS **********************/
const bootScreen = document.getElementById('boot-screen');
const app = document.getElementById('app');
const registerModal = document.getElementById('register-modal');
const registerForm = document.getElementById('register-form');
const views = {
    menu: document.getElementById('menu-view'),
    play: document.getElementById('play-view'),
    quiz: document.getElementById('quiz-view'),
    result: document.getElementById('result-view'),
    profile: document.getElementById('profile-view'),
    leaderboard: document.getElementById('leaderboard-view'),
    shop: document.getElementById('shop-view'),
    achievements: document.getElementById('achievements-view')
};

/********************** INIT & BOOT **********************/
window.addEventListener('load', () => {
    setTimeout(() => {
        bootScreen.style.display = 'none';
        app.style.display = 'block';
        initApp();
    }, 3400); // CSS animation + buffer
});

function initApp() {
    loadUserData();
    if (!user.name) {
        showRegisterModal();
    } else {
        hideRegisterModal();
        updateMenuStats();
        showView('menu');
        calculateOfflineMining(); // new: offline earning
        startMiningTimer();
    }
    setupEventListeners();
    initAudio();
}

/********************** REGISTRATION **********************/
function showRegisterModal() {
    registerModal.classList.remove('hidden');
    hideAllViews();
}

function hideRegisterModal() {
    registerModal.classList.add('hidden');
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const age = parseInt(document.getElementById('reg-age').value);
    if (name && !isNaN(age) && age >= 1 && age <= 120) {
        user.name = name;
        user.age = age;
        saveUserData();
        hideRegisterModal();
        updateMenuStats();
        showView('menu');
        playSound('startup');
    } else {
        alert('Please enter valid name and age!');
    }
});

/********************** VIEW MANAGEMENT **********************/
function showView(viewName) {
    hideAllViews();
    if (views[viewName]) {
        views[viewName].classList.remove('hidden');
    }
}

function hideAllViews() {
    Object.values(views).forEach(v => v.classList.add('hidden'));
}

// Back buttons
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showView('menu');
        if (gameSession.timerInterval) {
            clearInterval(gameSession.timerInterval);
            gameSession.timerInterval = null;
        }
    });
});

// Menu navigation
document.querySelectorAll('[data-view]').forEach(item => {
    item.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        if (view === 'play') showView('play');
        else if (view === 'profile') { showProfile(); showView('profile'); }
        else if (view === 'leaderboard') { showLeaderboard(); showView('leaderboard'); }
        else if (view === 'shop') { showShop(); showView('shop'); }
        else if (view === 'achievements') { showAchievements(); showView('achievements'); }
    });
});

/********************** PROFILE **********************/
function showProfile() {
    document.getElementById('profile-name').innerText = user.name || 'Unknown';
    document.getElementById('profile-age').innerText = user.age || '-';
    document.getElementById('profile-rank').innerText = getRank(user.level);
    document.getElementById('profile-games').innerText = user.gamesPlayed;
    document.getElementById('profile-total').innerText = user.totalAnswered;
    document.getElementById('profile-correct').innerText = user.totalCorrect;
    document.getElementById('profile-wrong').innerText = user.totalWrong;
    const acc = user.totalAnswered ? ((user.totalCorrect / user.totalAnswered) * 100).toFixed(1) : '0.0';
    document.getElementById('profile-accuracy').innerText = acc + '%';
    document.getElementById('profile-level').innerText = user.level;
    document.getElementById('profile-bits').innerText = user.bits;
}

/********************** MINING (Offline + Online) **********************/
function calculateOfflineMining() {
    const now = Date.now();
    const diffMs = now - user.lastMining;
    const minutesOffline = Math.floor(diffMs / 60000);
    if (minutesOffline > 0) {
        const earned = minutesOffline * 2; // 2 bits/min
        user.bits += earned;
        user.lastMining = now;
        saveUserData();
        // Optional: show notification
        console.log(`Offline mining: +${earned} BITS`);
    }
}

function startMiningTimer() {
    setInterval(() => {
        user.bits += 2; // 2 bits per minute
        user.lastMining = Date.now();
        saveUserData();
        document.getElementById('mining-amount').innerText = '2';
    }, 60000);
}

/********************** AUDIO **********************/
function initAudio() {
    const resumeAudio = () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    };

    document.body.addEventListener('click', resumeAudio, { once: true });
    document.body.addEventListener('touchstart', resumeAudio, { once: true });
}

function playSound(type) {
    if (!audioCtx || audioCtx.state === 'suspended') return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const config = {
        correct: { freq: 1200, dur: 0.15 },
        wrong: { freq: 300, dur: 0.2 },
        timeout: { freq: 200, dur: 0.5 },
        lifeline: { freq: 600, dur: 0.1 },
        buy: { freq: 900, dur: 0.1 },
        error: { freq: 150, dur: 0.3 },
        startup: { freq: 400, dur: 0.2 },
        collect: { freq: 1000, dur: 0.1 },
        levelup: { freq: 1500, dur: 0.4 }
    }[type] || { freq: 800, dur: 0.1 };

    osc.frequency.value = config.freq;
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + config.dur);

    osc.start();
    osc.stop(audioCtx.currentTime + config.dur);
}

/********************** GAMEPLAY **********************/
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        startGame(card.dataset.cat);
    });
});

function startGame(category) {
    if (!window.QUESTIONS || !Array.isArray(window.QUESTIONS)) {
        alert('Questions not loaded! Check questions.js');
        return;
    }

    gameSession = {
        ...gameSession,
        category,
        currentIndex: 0,
        score: 0,
        correctCount: 0,
        wrongCount: 0,
        bitsEarned: 0,
        xpEarned: 0,
        lifelinesUsed: { '5050': false, 'skip': false },
        askedIds: new Set(),
        questions: []
    };

    let qs = window.QUESTIONS;
    if (category !== 'all') {
        qs = qs.filter(q => q.category === category);
    }

    if (qs.length === 0) {
        alert('No questions in this category!');
        return;
    }

    gameSession.questions = shuffleArray([...qs]); // copy & shuffle
    showView('quiz');
    updateQuizStats();
    loadQuestion();
}

function loadQuestion() {
    if (gameSession.currentIndex >= gameSession.questions.length) {
        endGame();
        return;
    }

    const q = gameSession.questions[gameSession.currentIndex];
    gameSession.currentQuestion = q;
    gameSession.askedIds.add(q.id || q.question); // fallback to question text if no id

    document.getElementById('quiz-question').innerText = q.question;
    const optsDiv = document.getElementById('quiz-options');
    optsDiv.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.dataset.index = idx;
        btn.addEventListener('click', () => handleAnswer(idx));
        optsDiv.appendChild(btn);
    });

    // Update lifeline buttons with count
    document.getElementById('lifeline-5050').innerText = `50:50 (${user.inventory['5050']})`;
    document.getElementById('lifeline-skip').innerText = `SKIP (${user.inventory['skip']})`;

    gameSession.timeLeft = 30;
    document.getElementById('quiz-timer').innerText = gameSession.timeLeft;
    if (gameSession.timerInterval) clearInterval(gameSession.timerInterval);

    gameSession.timerInterval = setInterval(() => {
        gameSession.timeLeft--;
        document.getElementById('quiz-timer').innerText = gameSession.timeLeft;
        if (gameSession.timeLeft <= 0) {
            clearInterval(gameSession.timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleAnswer(selectedIdx) {
    clearInterval(gameSession.timerInterval);
    const correctIdx = gameSession.currentQuestion.correct;
    const isCorrect = selectedIdx === correctIdx;

    // Visual feedback
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correctIdx) btn.classList.add('correct');
        if (idx === selectedIdx && !isCorrect) btn.classList.add('wrong');
    });

    user.totalAnswered++;
    if (isCorrect) {
        user.totalCorrect++;
        gameSession.correctCount++;
        user.bits += 10;
        gameSession.bitsEarned += 10;
        user.xp += 10;
        gameSession.xpEarned += 10;
        playSound('correct');
        vibrate(50);
    } else {
        user.totalWrong++;
        gameSession.wrongCount++;
        user.bits = Math.max(0, user.bits - 5);
        gameSession.bitsEarned -= 5;
        playSound('wrong');
        vibrate(200);
    }

    gameSession.score += isCorrect ? 10 : -5;
    checkLevelUp();
    saveUserData();

    setTimeout(() => {
        gameSession.currentIndex++;
        loadQuestion();
    }, 1600);
}

/* বাকি ফাংশনগুলো (handleTimeout, endGame, checkLevelUp, save/load, utils) আপনার কোডের মতোই রাখা হয়েছে, শুধু ছোট ফিক্স যোগ করা হয়েছে */

function checkLevelUp() {
    const xpNeeded = user.level * 100;
    if (user.xp >= xpNeeded) {
        user.level++;
        user.xp = Math.max(0, user.xp - xpNeeded);
        playSound('levelup');
        alert(`LEVEL UP! Now level ${user.level}`);
        saveUserData();
    }
}

function vibrate(ms) {
    if ('vibrate' in navigator) {
        navigator.vibrate(ms);
    }
}
