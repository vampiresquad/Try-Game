/* =================================================
TRY GAME — ULTRA CORE ENGINE
Vanilla JS Professional Engine
================================================= */


/* ================= GLOBAL SYSTEM ================= */

const TRY = {
version: "1.0.0",
audioCtx: null,
player: null,
stats: null,
settings: null
};


/* ================= DATABASE SYSTEM ================= */

const DB = {

init(){
if(!localStorage.player_profile){
localStorage.player_profile = JSON.stringify({
name:"",
age:0,
level:1,
xp:0,
bits:0,
rank:"Script Kiddie"
});
}

if(!localStorage.game_stats){
localStorage.game_stats = JSON.stringify({
gamesPlayed:0,
totalQuestions:0,
correct:0,
wrong:0
});
}

if(!localStorage.wallet){
localStorage.wallet = JSON.stringify({
bits:0,
lifeline5050:0,
skip:0
});
}

if(!localStorage.mining){
localStorage.mining = JSON.stringify({
lastMine: Date.now()
});
}

},

load(){
TRY.player = JSON.parse(localStorage.player_profile);
TRY.stats = JSON.parse(localStorage.game_stats);
TRY.wallet = JSON.parse(localStorage.wallet);
TRY.mining = JSON.parse(localStorage.mining);
},

save(){
localStorage.player_profile = JSON.stringify(TRY.player);
localStorage.game_stats = JSON.stringify(TRY.stats);
localStorage.wallet = JSON.stringify(TRY.wallet);
localStorage.mining = JSON.stringify(TRY.mining);
}

};


/* ================= AUDIO SYSTEM (NO FILES) ================= */

const AUDIO = {

init(){
TRY.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
},

beep(freq=500,time=0.1,type="sine"){
const osc = TRY.audioCtx.createOscillator();
const gain = TRY.audioCtx.createGain();

osc.type = type;
osc.frequency.value = freq;

osc.connect(gain);
gain.connect(TRY.audioCtx.destination);

osc.start();
gain.gain.exponentialRampToValueAtTime(
0.00001,
TRY.audioCtx.currentTime + time
);
},

click(){ this.beep(700,0.05); },
correct(){ this.beep(1200,0.15,"triangle"); },
wrong(){ this.beep(200,0.25,"sawtooth"); },
alarm(){ this.beep(90,0.5,"square"); },
levelup(){ this.beep(1600,0.3,"triangle"); }

};


/* ================= HAPTIC ================= */

const HAPTIC = {
tap(){ navigator.vibrate?.(20); },
success(){ navigator.vibrate?.([40,20,40]); },
error(){ navigator.vibrate?.([80,40,80]); }
};


/* ================= PLAYER SYSTEM ================= */

const PLAYER = {

register(name,age){
TRY.player.name = name;
TRY.player.age = age;
DB.save();
},

addXP(amount){
TRY.player.xp += amount;

if(TRY.player.xp >= 100){
TRY.player.level++;
TRY.player.xp = 0;
AUDIO.levelup();
}

this.updateRank();
DB.save();
},

updateRank(){
const lvl = TRY.player.level;

if(lvl >= 20) TRY.player.rank = "Elite Phantom";
else if(lvl >= 15) TRY.player.rank = "Shadow Hacker";
else if(lvl >= 10) TRY.player.rank = "Ghost Operator";
else if(lvl >= 5) TRY.player.rank = "Code Runner";
else TRY.player.rank = "Script Kiddie";
},

addBits(amount){
TRY.wallet.bits += amount;
TRY.player.bits = TRY.wallet.bits;
DB.save();
}

};


/* ================= PROFILE UI ================= */

function updateProfileUI(){

document.getElementById("profileName").textContent = TRY.player.name;
document.getElementById("profileAge").textContent = TRY.player.age;
document.getElementById("profileRank").textContent = TRY.player.rank;

document.getElementById("gamesPlayed").textContent = TRY.stats.gamesPlayed;
document.getElementById("totalQuestions").textContent = TRY.stats.totalQuestions;
document.getElementById("correctAnswers").textContent = TRY.stats.correct;
document.getElementById("wrongAnswers").textContent = TRY.stats.wrong;

let acc = TRY.stats.totalQuestions ?
((TRY.stats.correct / TRY.stats.totalQuestions)*100).toFixed(1) : 0;

document.getElementById("accuracyRate").textContent = acc + "%";

document.getElementById("bitsCount").textContent = TRY.wallet.bits;
document.getElementById("levelCount").textContent = TRY.player.level;

}


/* ================= MINING SYSTEM ================= */

const MINING = {

run(){
let now = Date.now();
let diff = now - TRY.mining.lastMine;

let earned = Math.floor(diff / 60000); // per minute

if(earned > 0){
PLAYER.addBits(earned);
TRY.mining.lastMine = now;
DB.save();
}
}

};


/* ================= NAVIGATION ================= */

const NAV = {

init(){
document.querySelectorAll("button").forEach(btn=>{
btn.addEventListener("click", ()=>{
AUDIO.click();
HAPTIC.tap();
});
});
}

};


/* ================= REGISTER SYSTEM ================= */

function initRegister(){

const modal = document.getElementById("registerModal");

if(TRY.player.name){
modal.style.display="none";
updateProfileUI();
return;
}

document.getElementById("registerBtn").onclick = ()=>{

let name = document.getElementById("playerNameInput").value.trim();
let age = document.getElementById("playerAgeInput").value;

if(!name || !age){
AUDIO.wrong();
HAPTIC.error();
return;
}

PLAYER.register(name,age);
modal.style.display="none";
updateProfileUI();
AUDIO.correct();
HAPTIC.success();

};

}


/* ================= ADVANCED QUIZ ENGINE ================= */

const QUIZ = {

currentQuestion:null,
timer:null,
timeLeft:30,
bossMode:false,

start(){

TRY.stats.gamesPlayed++;
DB.save();
this.loadQuestion();

},

/* ================= LOAD QUESTION ================= */

loadQuestion(){

if(!window.getSmartQuestion) return;

let q = getSmartQuestion();

/* Difficulty Scaling By Level */
if(TRY.player.level >= 15 && q.difficulty === "easy"){
q = getSmartQuestion();
}

this.currentQuestion = q;

document.getElementById("questionText").textContent = q.question;
document.getElementById("questionCategory").textContent = q.category;

this.renderAnswers(q);
this.startTimer();

/* Boss Breach Mode */
if(TRY.player.level % 5 === 0){
this.activateBossMode();
}else{
this.deactivateBossMode();
}

},

/* ================= ANSWERS ================= */

renderAnswers(q){

const btns = document.querySelectorAll(".answer-btn");

btns.forEach((b,i)=>{

b.style.display="block";
b.textContent = q.answers[i];

b.onclick = ()=>{
this.answer(q.answers[i] === q.correct);
};

});

},

/* ================= TIMER ================= */

startTimer(){

clearInterval(this.timer);
this.timeLeft = this.bossMode ? 20 : 30;

document.getElementById("timer").textContent = this.timeLeft;

this.timer = setInterval(()=>{

this.timeLeft--;
document.getElementById("timer").textContent = this.timeLeft;

if(this.timeLeft <= 0){
clearInterval(this.timer);
this.answer(false);
}

},1000);

},

/* ================= ANSWER RESULT ================= */

answer(isCorrect){

clearInterval(this.timer);

TRY.stats.totalQuestions++;

if(isCorrect){

TRY.stats.correct++;

PLAYER.addXP(this.bossMode ? 40 : 20);
PLAYER.addBits(this.bossMode ? 15 : 5);

AUDIO.correct();
HAPTIC.success();

}else{

TRY.stats.wrong++;
AUDIO.wrong();
HAPTIC.error();

}

DB.save();
updateProfileUI();

setTimeout(()=>{
this.loadQuestion();
},600);

},

/* ================= LIFELINE 50:50 ================= */

use5050(){

if(TRY.wallet.lifeline5050 <= 0) return;

TRY.wallet.lifeline5050--;

const btns = [...document.querySelectorAll(".answer-btn")];

let wrong = btns.filter(b => b.textContent !== this.currentQuestion.correct);

wrong.sort(()=>Math.random()-0.5);

wrong[0].style.display="none";
wrong[1].style.display="none";

DB.save();
updateProfileUI();

},

/* ================= LIFELINE SKIP ================= */

useSkip(){

if(TRY.wallet.skip <= 0) return;

TRY.wallet.skip--;
DB.save();
updateProfileUI();

this.loadQuestion();

},

/* ================= BOSS MODE ================= */

activateBossMode(){

this.bossMode = true;
document.body.classList.add("breach");
AUDIO.alarm();

},

deactivateBossMode(){

this.bossMode = false;
document.body.classList.remove("breach");

}

};


/* ================= BUTTON LINK ================= */

document.getElementById("lifeline5050").onclick = ()=>{
QUIZ.use5050();
};

document.getElementById("lifelineSkip").onclick = ()=>{
QUIZ.useSkip();
};

document.getElementById("startGameBtn").onclick = ()=>{
QUIZ.start();
};

/* ================= START GAME ================= */

document.getElementById("startGameBtn").onclick = ()=>{
TRY.stats.gamesPlayed++;
DB.save();
QUIZ.loadQuestion();
};


/* ================= INIT ================= */

window.addEventListener("load",()=>{

DB.init();
DB.load();

AUDIO.init();
NAV.init();
MINING.run();
initRegister();
updateProfileUI();

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js");
}

});
/* =================================================
STEP 6 — ECONOMY + STORE + ACHIEVEMENT + LEADERBOARD
================================================= */


/* ================= STORE SYSTEM ================= */

const STORE = {

buy5050(){

if(TRY.wallet.bits < 50) return;

TRY.wallet.bits -= 50;
TRY.wallet.lifeline5050++;

DB.save();
updateProfileUI();

},

buySkip(){

if(TRY.wallet.bits < 40) return;

TRY.wallet.bits -= 40;
TRY.wallet.skip++;

DB.save();
updateProfileUI();

}

};


/* ================= THEME SYSTEM ================= */

const THEME = {

set(color){

document.documentElement.style.setProperty("--neon",color);

localStorage.try_theme = color;

},

load(){

if(localStorage.try_theme){
this.set(localStorage.try_theme);
}

}

};


/* ================= ACHIEVEMENT SYSTEM ================= */

const ACH = {

check(){

if(TRY.wallet.bits >= 1000){
this.unlock("Bit Collector");
}

if(TRY.stats.correct >= 50){
this.unlock("Sharp Mind");
}

},

unlock(name){

let a = JSON.parse(localStorage.try_ach || "[]");

if(!a.includes(name)){
a.push(name);
localStorage.try_ach = JSON.stringify(a);
AUDIO.levelup();
}

}

};


/* ================= LEADERBOARD ================= */

const LEADERBOARD = {

save(){

let board = JSON.parse(localStorage.try_board || "[]");

board.push({
name:TRY.player.name,
level:TRY.player.level,
bits:TRY.wallet.bits
});

board.sort((a,b)=> b.level - a.level);

board = board.slice(0,10);

localStorage.try_board = JSON.stringify(board);

},

render(){

let board = JSON.parse(localStorage.try_board || "[]");

let html = "";

board.forEach((p,i)=>{
html += `<p>${i+1}. ${p.name} — Lv ${p.level}</p>`;
});

document.getElementById("leaderboardList").innerHTML =
html || "No Data Yet";

}

};


/* ================= SOCIAL SHARE ================= */

const SOCIAL = {

share(){

let text =
`I reached Level ${TRY.player.level} in TRY Game!\nCan you beat me?`;

if(navigator.share){
navigator.share({
title:"TRY Quiz Game",
text:text
});
}else{
alert(text);
}

},

preview(){

document.getElementById("sharePreview").textContent =
`Player: ${TRY.player.name}
Level: ${TRY.player.level}
BITS: ${TRY.wallet.bits}`;

}

};


/* ================= STORE BUTTON LINK ================= */

document.querySelectorAll(".store-item button")[0].onclick = ()=>{
STORE.buy5050();
};

document.querySelectorAll(".store-item button")[1].onclick = ()=>{
STORE.buySkip();
};


/* ================= SHARE BUTTON ================= */

document.getElementById("shareBtn").onclick = ()=>{
SOCIAL.share();
};


/* ================= GAME HOOK ================= */

setInterval(()=>{
ACH.check();
},5000);


/* ================= LOAD HOOK ================= */

window.addEventListener("load",()=>{

THEME.load();
LEADERBOARD.render();

});
