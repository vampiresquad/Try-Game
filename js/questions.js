/* =================================================
TRY GAME — ULTRA QUESTION DICTIONARY SYSTEM
================================================= */


/* ================= QUESTION DATABASE ================= */

const QUESTIONS_DB = [

/* ================= CYBER SECURITY ================= */

{
id:1,
category:"Cyber Security",
difficulty:"easy",
question:"What does VPN stand for?",
answers:[
"Virtual Private Network",
"Very Personal Network",
"Virtual Public Node",
"Verified Private Node"
],
correct:"Virtual Private Network"
},

{
id:2,
category:"Cyber Security",
difficulty:"medium",
question:"Which attack floods server traffic?",
answers:[
"Phishing",
"DDoS",
"Keylogging",
"Sniffing"
],
correct:"DDoS"
},

{
id:3,
category:"Cyber Security",
difficulty:"easy",
question:"Password hashing protects against?",
answers:[
"Password theft",
"Internet speed",
"Hardware failure",
"Power outage"
],
correct:"Password theft"
},

{
id:4,
category:"Cyber Security",
difficulty:"hard",
question:"Which protocol is secure?",
answers:[
"HTTP",
"FTP",
"HTTPS",
"Telnet"
],
correct:"HTTPS"
},


/* ================= ISLAMIC ================= */

{
id:101,
category:"Islamic",
difficulty:"easy",
question:"How many pillars are in Islam?",
answers:["3","4","5","6"],
correct:"5"
},

{
id:102,
category:"Islamic",
difficulty:"easy",
question:"First revealed Surah?",
answers:[
"Al Fatiha",
"Al Baqarah",
"Al Alaq",
"An Nas"
],
correct:"Al Alaq"
},

{
id:103,
category:"Islamic",
difficulty:"medium",
question:"Night journey of Prophet (SAW)?",
answers:[
"Hijrah",
"Isra and Miraj",
"Badr",
"Uhud"
],
correct:"Isra and Miraj"
},


/* ================= GENERAL ================= */

{
id:201,
category:"General",
difficulty:"easy",
question:"Capital of Japan?",
answers:[
"Tokyo",
"Seoul",
"Beijing",
"Bangkok"
],
correct:"Tokyo"
},

{
id:202,
category:"General",
difficulty:"easy",
question:"Largest planet?",
answers:[
"Earth",
"Saturn",
"Jupiter",
"Mars"
],
correct:"Jupiter"
},

{
id:203,
category:"General",
difficulty:"medium",
question:"Human body bones total?",
answers:[
"206",
"201",
"300",
"150"
],
correct:"206"
},


/* ================= WORLD ================= */

{
id:301,
category:"World",
difficulty:"easy",
question:"United Nations founded?",
answers:[
"1945",
"1939",
"1955",
"1920"
],
correct:"1945"
},

{
id:302,
category:"World",
difficulty:"medium",
question:"World largest ocean?",
answers:[
"Indian",
"Pacific",
"Atlantic",
"Arctic"
],
correct:"Pacific"
},


/* ================= MIXED BANGLA ================= */

{
id:401,
category:"Mixed",
difficulty:"easy",
question:"বাংলাদেশের রাজধানী কোথায়?",
answers:[
"চট্টগ্রাম",
"ঢাকা",
"খুলনা",
"সিলেট"
],
correct:"ঢাকা"
},

{
id:402,
category:"Mixed",
difficulty:"easy",
question:"পৃথিবীর উপগ্রহ কি?",
answers:[
"সূর্য",
"চাঁদ",
"মঙ্গল",
"শুক্র"
],
correct:"চাঁদ"
},

{
id:403,
category:"Mixed",
difficulty:"medium",
question:"Internet কে আবিষ্কার করেন?",
answers:[
"Tim Berners Lee",
"Elon Musk",
"Bill Gates",
"Steve Jobs"
],
correct:"Tim Berners Lee"
}

];


/* ================= MEMORY SYSTEM (NO REPEAT) ================= */

const QUESTION_MEMORY_KEY = "try_question_memory";


function loadQuestionMemory(){
let mem = localStorage.getItem(QUESTION_MEMORY_KEY);
return mem ? JSON.parse(mem) : [];
}

function saveQuestionMemory(mem){
localStorage.setItem(QUESTION_MEMORY_KEY, JSON.stringify(mem));
}


/* ================= SMART RANDOM ENGINE ================= */

function getSmartQuestion(){

let memory = loadQuestionMemory();

let available = QUESTIONS_DB.filter(q => !memory.includes(q.id));

/* যদি সব প্রশ্ন শেষ হয় → Reset Memory */
if(available.length === 0){
memory = [];
saveQuestionMemory(memory);
available = QUESTIONS_DB;
}

/* Difficulty Weight Random */
let weighted = [];

available.forEach(q=>{
if(q.difficulty === "easy") weighted.push(q,q,q);
if(q.difficulty === "medium") weighted.push(q,q);
if(q.difficulty === "hard") weighted.push(q);
});

let selected = weighted[Math.floor(Math.random()*weighted.length)];

/* Memory Update */
memory.push(selected.id);
saveQuestionMemory(memory);

return selected;

}


/* ================= GLOBAL EXPORT ================= */

window.QUESTIONS = QUESTIONS_DB;
window.getSmartQuestion = getSmartQuestion;
