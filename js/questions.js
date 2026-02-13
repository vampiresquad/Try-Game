/* DATABASE: Try Game Question Bank
  Categories: 'cyber_security', 'islamic', 'general', 'mixed'
*/

const questionBank = [
    // --- CYBER SECURITY ---
    {
        id: 1,
        category: "cyber_security",
        question: "What does 'Phishing' mean in hacking terms?",
        answer: "Sending fake emails to steal data",
        options: [
            "Catching fish using tech",
            "Sending fake emails to steal data",
            "Testing website speed",
            "Encrypting a hard drive"
        ]
    },
    {
        id: 2,
        category: "cyber_security",
        question: "Which of the following is a strong password?",
        answer: "P@ssw0rd_2026!",
        options: [
            "12345678",
            "iloveyou",
            "admin123",
            "P@ssw0rd_2026!"
        ]
    },
    {
        id: 3,
        category: "cyber_security",
        question: "SQL Injection is an attack on:",
        answer: "Database",
        options: [
            "Network cables",
            "Database",
            "Monitor screen",
            "Keyboard"
        ]
    },
    {
        id: 4,
        category: "cyber_security",
        question: "What is a 'White Hat' hacker?",
        answer: "An ethical security expert",
        options: [
            "A hacker who wears a white hat",
            "A cyber criminal",
            "An ethical security expert",
            "A government spy"
        ]
    },

    // --- ISLAMIC (Bangla & English Mixed) ---
    {
        id: 5,
        category: "islamic",
        question: "How many Sujood (Prostrations) are there in the Quran?",
        answer: "15 (According to majority)",
        options: [
            "12",
            "14",
            "15 (According to majority)",
            "10"
        ]
    },
    {
        id: 6,
        category: "islamic",
        question: "পবিত্র কুরআনের সবথেকে ছোট সূরা কোনটি?",
        answer: "সূরা আল-কাউসার",
        options: [
            "সূরা আল-ফাতিহা",
            "সূরা আল-ইখলাস",
            "সূরা আল-কাউসার",
            "সূরা আন-নাস"
        ]
    },
    {
        id: 7,
        category: "islamic",
        question: "First Muazzin of Islam was:",
        answer: "Bilal ibn Rabah (RA)",
        options: [
            "Ali (RA)",
            "Bilal ibn Rabah (RA)",
            "Abu Bakr (RA)",
            "Umar (RA)"
        ]
    },

    // --- GENERAL KNOWLEDGE ---
    {
        id: 8,
        category: "general",
        question: "What is the capital of Bangladesh?",
        answer: "Dhaka",
        options: [
            "Chittagong",
            "Sylhet",
            "Dhaka",
            "Khulna"
        ]
    },
    {
        id: 9,
        category: "general",
        question: "Which planet is known as the Red Planet?",
        answer: "Mars",
        options: [
            "Venus",
            "Mars",
            "Jupiter",
            "Saturn"
        ]
    },
    {
        id: 10,
        category: "general",
        question: "কম্পিউটারের মস্তিষ্ক (Brain) কাকে বলা হয়?",
        answer: "CPU",
        options: [
            "Monitor",
            "RAM",
            "CPU",
            "Hard Disk"
        ]
    }
];

// This helps us access this data from other files
window.questionBank = questionBank;
