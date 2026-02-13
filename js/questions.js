// ============================================
// ULTIMATE QUESTION BANK GENERATOR v5.0
// Generates 1500+ questions across 5 categories
// ============================================

(function() {
    // ---------- TEMPLATES FOR EACH CATEGORY ----------
    const templates = {
        cyber_security: [
            // Basic concepts
            { q: "What does '%s' mean in cybersecurity?", a: "%s" },
            { q: "Which of the following is a strong password?", a: "Xy_9#mZ@2026", opts: ["12345678", "iloveyou", "admin123", "Xy_9#mZ@2026"] },
            { q: "Who is known as a 'White Hat' hacker?", a: "Ethical Security Expert", opts: ["Cyber Criminal", "Ethical Security Expert", "Script Kiddie", "Dark Web User"] },
            { q: "What is 'DDoS' attack?", a: "Distributed Denial of Service", opts: ["Data Download of System", "Digital Domain Service", "Distributed Denial of Service", "Direct Disk Operating System"] },
            { q: "Which Linux distro is popular for hacking?", a: "Kali Linux", opts: ["Ubuntu", "Kali Linux", "Windows 10", "MacOS"] },
            { q: "SQL Injection targets which component?", a: "Database", opts: ["Monitor", "Database", "Keyboard", "Router"] },
            { q: "What does VPN stand for?", a: "Virtual Private Network", opts: ["Very Private Network", "Virtual Public Network", "Virtual Private Network", "Verified Personal Net"] },
            { q: "Who is known as the father of computer virus?", a: "Fred Cohen", opts: ["Bill Gates", "Fred Cohen", "Steve Jobs", "Mark Zuckerberg"] },
            { q: "What comes after a firewall in network security?", a: "Intrusion Detection System (IDS)", opts: ["Antivirus", "Intrusion Detection System (IDS)", "Calculator", "Media Player"] },
            { q: "Which browser is used to access the Dark Web?", a: "Tor Browser", opts: ["Chrome", "Firefox", "Tor Browser", "Safari"] },
            { q: "Difference between HTTP and HTTPS?", a: "Security (Encryption)", opts: ["Speed", "Security (Encryption)", "Cost", "Design"] },
            { q: "What is a 'Zero-Day' vulnerability?", a: "A flaw unknown to the developer", opts: ["A virus that kills PC in 0 days", "A flaw unknown to the developer", "A hacker group", "No internet connection"] },
            { q: "What is 'Social Engineering'?", a: "Manipulating people for info", opts: ["Fixing society", "Manipulating people for info", "Coding social media", "Creating robots"] },
            { q: "File extension for Python scripts?", a: ".py", opts: [".exe", ".py", ".js", ".html"] },
            { q: "Popular tool for Wi-Fi hacking?", a: "Aircrack-ng", opts: ["Photoshop", "Aircrack-ng", "Notepad", "VLC Player"] },
            { q: "What is 'Ransomware'?", a: "Malware that locks data for money", opts: ["Free software", "Malware that locks data for money", "Antivirus tool", "Windows update"] },
            { q: "Full form of Wi-Fi?", a: "Wireless Fidelity", opts: ["Wireless Free", "Wireless Fidelity", "Wide Fire", "Wire Fix"] },
            { q: "What is 2FA?", a: "Two-Factor Authentication", opts: ["Second Firewall", "Two-Factor Authentication", "Dual File Access", "Temporary Access"] },
            { q: "Which port is used for HTTPS?", a: "443", opts: ["80", "443", "22", "21"] },
            { q: "What is a botnet?", a: "Network of infected computers", opts: ["Antivirus software", "Network of infected computers", "Type of firewall", "Encryption algorithm"] },
            // More variations (will be filled with placeholders)
        ],
        islamic: [
            { q: "পবিত্র কুরআনে কতটি সূরা আছে?", a: "১১৪", opts: ["১১০", "১১২", "১১৪", "১২০"] },
            { q: "ইসলামের প্রথম স্তম্ভ কোনটি?", a: "কালিমা (শাহাদাত)", opts: ["নামাজ", "রোজা", "হজ্জ", "কালিমা (শাহাদাত)"] },
            { q: "Who was the first Muazzin of Islam?", a: "Bilal ibn Rabah (RA)", opts: ["Ali (RA)", "Bilal ibn Rabah (RA)", "Abu Bakr (RA)", "Umar (RA)"] },
            { q: "কোন সূরাকে কুরআনের 'হৃদপিণ্ড' বলা হয়?", a: "সূরা ইয়াসিন", opts: ["সূরা আর-রহমান", "সূরা ইয়াসিন", "সূরা মুলক", "সূরা বাকারা"] },
            { q: "বদর যুদ্ধ কত হিজরিতে সংঘটিত হয়?", a: "২য় হিজরি", opts: ["১ম হিজরি", "২য় হিজরি", "৩য় হিজরি", "৫ম হিজরি"] },
            { q: "The Holy Quran was revealed over how many years?", a: "23 Years", opts: ["20 Years", "23 Years", "25 Years", "30 Years"] },
            { q: "জান্নাতের দরজার সংখ্যা কয়টি?", a: "৮টি", opts: ["৭টি", "৮টি", "১০টি", "১২টি"] },
            { q: "Who is known as 'Saifullah' (Sword of Allah)?", a: "Khalid Bin Walid (RA)", opts: ["Hamza (RA)", "Khalid Bin Walid (RA)", "Ali (RA)", "Umar (RA)"] },
            { q: "সর্বশেষ নবীর নাম কী?", a: "হযরত মুহাম্মদ (সা.)", opts: ["হযরত ঈসা (আ.)", "হযরত মুসা (আ.)", "হযরত মুহাম্মদ (সা.)", "হযরত ইব্রাহিম (আ.)"] },
            { q: "Which Surah does not start with Bismillah?", a: "Surah At-Tawbah", opts: ["Surah Al-Fatiha", "Surah At-Tawbah", "Surah An-Nas", "Surah Al-Ikhlas"] },
            { q: "লাইলাতুল কদর কোন মাসে পালিত হয়?", a: "রমজান", opts: ["শাওয়াল", "রমজান", "মহররম", "জিলহজ্জ"] },
            { q: "What is the name of the Angel who brought revelation?", a: "Jibreel (AS)", opts: ["Mikail (AS)", "Israfil (AS)", "Jibreel (AS)", "Azrail (AS)"] },
            { q: "পবিত্র কাবা ঘর কোথায় অবস্থিত?", a: "মক্কা", opts: ["মদিনা", "মক্কা", "জেদ্দা", "রিয়াদ"] },
            { q: "Which Prophet built the Ark?", a: "Nuh (AS)", opts: ["Adam (AS)", "Nuh (AS)", "Ibrahim (AS)", "Yusuf (AS)"] },
            { q: "আসমানী কিতাব মোট কতটি?", a: "১০৪টি", opts: ["৪টি", "১০০টি", "১০৪টি", "১১৪টি"] },
            { q: "যাকাত ফরজ হয় কখন?", a: "নিসাব পরিমাণ সম্পদ ১ বছর থাকলে", opts: ["ইচ্ছা হলে", "নিসাব পরিমাণ সম্পদ ১ বছর থাকলে", "প্রতি মাসে", "রমজান মাসে"] },
            { q: "হজ্জ কত হিজরিতে ফরজ হয়?", a: "৯ম হিজরি", opts: ["৬ষ্ঠ হিজরি", "৯ম হিজরি", "১০ম হিজরি", "২য় হিজরি"] },
            { q: "কুরআনের সর্বশেষ সূরার নাম কী?", a: "সূরা নাস", opts: ["সূরা ফালাক", "সূরা নাস", "সূরা ইখলাস", "সূরা বাকারা"] },
            { q: "কতজন সাহাবী বদর যুদ্ধে অংশ নেন?", a: "৩১৩ জন", opts: ["৩১৩ জন", "৩০০ জন", "৩২৫ জন", "৩৫০ জন"] },
            { q: "প্রথম কিবলা ছিল কোথায়?", a: "বাইতুল মুকাদ্দাস", opts: ["কাবা", "বাইতুল মুকাদ্দাস", "মসজিদে নববী", "কুবা"] },
        ],
        general: [
            { q: "What is the chemical symbol for water?", a: "H2O", opts: ["CO2", "H2O", "O2", "NaCl"] },
            { q: "Who invented the light bulb?", a: "Thomas Edison", opts: ["Nikola Tesla", "Thomas Edison", "Alexander Bell", "Albert Einstein"] },
            { q: "How many bones are in the adult human body?", a: "206", opts: ["206", "208", "205", "210"] },
            { q: "What is the largest planet in our solar system?", a: "Jupiter", opts: ["Saturn", "Jupiter", "Neptune", "Earth"] },
            { q: "Which gas do plants absorb from the atmosphere?", a: "Carbon dioxide", opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"] },
            { q: "Who wrote 'Romeo and Juliet'?", a: "William Shakespeare", opts: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Leo Tolstoy"] },
            { q: "What is the hardest natural substance?", a: "Diamond", opts: ["Gold", "Iron", "Diamond", "Platinum"] },
            { q: "How many continents are there?", a: "7", opts: ["5", "6", "7", "8"] },
            { q: "What is the smallest prime number?", a: "2", opts: ["1", "2", "3", "5"] },
            { q: "Which animal is known as the 'Ship of the Desert'?", a: "Camel", opts: ["Horse", "Camel", "Elephant", "Donkey"] },
            { q: "Who developed the theory of relativity?", a: "Albert Einstein", opts: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"] },
            { q: "What is the capital of Australia?", a: "Canberra", opts: ["Sydney", "Melbourne", "Canberra", "Perth"] },
            { q: "Which is the longest river in the world?", a: "Nile", opts: ["Amazon", "Nile", "Yangtze", "Mississippi"] },
            { q: "What is the largest ocean?", a: "Pacific Ocean", opts: ["Atlantic", "Indian", "Pacific Ocean", "Arctic"] },
            { q: "Which planet is known as the Red Planet?", a: "Mars", opts: ["Venus", "Mars", "Jupiter", "Saturn"] },
        ],
        world: [
            { q: "What is the capital of France?", a: "Paris", opts: ["London", "Paris", "Berlin", "Madrid"] },
            { q: "Which country has the largest population?", a: "India", opts: ["China", "USA", "India", "Indonesia"] },
            { q: "Who was the first person to walk on the moon?", a: "Neil Armstrong", opts: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"] },
            { q: "In which year did World War II end?", a: "1945", opts: ["1944", "1945", "1946", "1947"] },
            { q: "What is the currency of Japan?", a: "Yen", opts: ["Won", "Yuan", "Yen", "Ringgit"] },
            { q: "Which country is famous for the Great Pyramid?", a: "Egypt", opts: ["Mexico", "Greece", "Egypt", "Sudan"] },
            { q: "What is the official language of Brazil?", a: "Portuguese", opts: ["Spanish", "Portuguese", "English", "French"] },
            { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", opts: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Van Gogh"] },
            { q: "What is the tallest mountain in the world?", a: "Mount Everest", opts: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"] },
            { q: "Which country is known as the Land of the Rising Sun?", a: "Japan", opts: ["China", "Korea", "Japan", "Thailand"] },
            { q: "Who invented the telephone?", a: "Alexander Graham Bell", opts: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"] },
            { q: "Which is the smallest country in the world?", a: "Vatican City", opts: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"] },
            { q: "What is the longest wall in the world?", a: "Great Wall of China", opts: ["Hadrian's Wall", "Berlin Wall", "Great Wall of China", "Western Wall"] },
            { q: "Which ocean is the deepest?", a: "Pacific Ocean", opts: ["Atlantic", "Indian", "Pacific Ocean", "Arctic"] },
            { q: "What is the main ingredient in chocolate?", a: "Cocoa", opts: ["Sugar", "Milk", "Cocoa", "Vanilla"] },
        ],
        bangladesh: [
            { q: "বাংলাদেশের স্বাধীনতা দিবস কবে?", a: "২৬শে মার্চ", opts: ["২১শে ফেব্রুয়ারি", "২৬শে মার্চ", "১৬ই ডিসেম্বর", "১৪ই এপ্রিল"] },
            { q: "What is the capital of Bangladesh?", a: "Dhaka", opts: ["Chittagong", "Sylhet", "Dhaka", "Rajshahi"] },
            { q: "বাংলাদেশের জাতীয় খেলা কোনটি?", a: "হাডুডু (কাবাডি)", opts: ["ক্রিকেট", "ফুটবল", "হাডুডু (কাবাডি)", "হকি"] },
            { q: "How many districts are there in Bangladesh?", a: "64", opts: ["60", "64", "68", "70"] },
            { q: "বাংলাদেশের জাতীয় কবি কে?", a: "কাজী নজরুল ইসলাম", opts: ["রবীন্দ্রনাথ ঠাকুর", "কাজী নজরুল ইসলাম", "জসীম উদ্‌দীন", "জীবনানন্দ দাশ"] },
            { q: "What is the currency of Bangladesh?", a: "Taka", opts: ["Rupee", "Dollar", "Taka", "Yen"] },
            { q: "কোন সালে বাংলাদেশ স্বাধীন হয়?", a: "১৯৭১", opts: ["১৯৪৭", "১৯৫২", "১৯৭১", "১৯৯০"] },
            { q: "Largest Mangrove Forest in the world?", a: "Sundarbans", opts: ["Amazon", "Sundarbans", "Rainforest", "Safari Park"] },
            { q: "পদ্মা সেতুর দৈর্ঘ্য কত?", a: "৬.১৫ কি.মি.", opts: ["৪.৮ কি.মি.", "৬.১৫ কি.মি.", "৫.৫ কি.মি.", "৭.০ কি.মি."] },
            { q: "শহীদ মিনার এর স্থপতি কে?", a: "হামিদুর রহমান", opts: ["জয়নুল আবেদিন", "হামিদুর রহমান", "লুই আই কান", "শামীম সিকদার"] },
            { q: "বাংলাদেশের জাতীয় ফল কী?", a: "কাঁঠাল", opts: ["আম", "কলা", "কাঁঠাল", "লিচু"] },
            { q: "বাংলাদেশের জাতীয় পশু কী?", a: "রয়েল বেঙ্গল টাইগার", opts: ["হাতি", "ময়ূর", "রয়েল বেঙ্গল টাইগার", "গরু"] },
            { q: "বাংলাদেশের জাতীয় সংগীতের রচয়িতা কে?", a: "রবীন্দ্রনাথ ঠাকুর", opts: ["কাজী নজরুল ইসলাম", "রবীন্দ্রনাথ ঠাকুর", "জসীম উদ্‌দীন", "শামসুর রাহমান"] },
            { q: "বাংলাদেশের জাতীয় মসজিদ কোনটি?", a: "বায়তুল মোকাররম", opts: ["স্টার মসজিদ", "বায়তুল মোকাররম", "সাত গম্বুজ মসজিদ", "তারাবাই মসজিদ"] },
            { q: "ঢাকা শহর কোথায় অবস্থিত?", a: "বাংলাদেশ", opts: ["ভারত", "পাকিস্তান", "বাংলাদেশ", "মিয়ানমার"] },
        ]
    };

    // Helper to shuffle an array
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Generate distractors for placeholder-based questions
    function generateDistractors(correct, category) {
        // Use a pool of common terms per category
        const pools = {
            cyber_security: ["Phishing", "DDoS", "VPN", "Firewall", "Encryption", "Malware", "Ransomware", "2FA", "HTTPS", "SQL Injection", "Zero-day", "Botnet", "Spyware", "Adware", "Rootkit"],
            islamic: ["সালাত", "যাকাত", "সিয়াম", "হজ্জ", "কুরআন", "হাদিস", "সুন্নাহ", "মসজিদ", "উম্মাহ", "দাওয়াহ", "তাফসির", "ফিকহ", "আকিদা"],
            general: ["Oxygen", "Gravity", "Evolution", "DNA", "Photosynthesis", "Atom", "Molecule", "Species", "Energy", "Force", "Magnetism", "Electricity"],
            world: ["United Nations", "UNESCO", "NATO", "European Union", "Amazon River", "Himalayas", "Sahara Desert", "Great Wall", "Colosseum", "Eiffel Tower"],
            bangladesh: ["ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা", "রাজশাহী", "বরিশাল", "ময়মনসিংহ", "রংপুর", "পদ্মা", "মেঘনা", "যমুনা"]
        };
        const pool = pools[category] || ["Term1", "Term2", "Term3", "Term4", "Term5"];
        // Ensure correct is not in the pool duplicates
        let candidates = pool.filter(term => term !== correct);
        // Pick 3 random unique distractors
        let selected = [];
        while (selected.length < 3 && candidates.length > 0) {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            selected.push(candidates[randomIndex]);
            candidates.splice(randomIndex, 1);
        }
        // If not enough, fill with placeholders
        while (selected.length < 3) {
            selected.push(`Option ${selected.length+1}`);
        }
        return shuffleArray([correct, ...selected]);
    }

    // Generate questions for each category
    const totalQuestions = 1500;
    const categoryNames = Object.keys(templates);
    const perCategory = Math.floor(totalQuestions / categoryNames.length);
    const remainder = totalQuestions - perCategory * categoryNames.length;

    let questionBank = [];
    let id = 1;

    categoryNames.forEach((cat, index) => {
        const catTemplates = templates[cat];
        const count = perCategory + (index < remainder ? 1 : 0);
        for (let i = 0; i < count; i++) {
            // Pick a template cyclically
            const tmpl = catTemplates[i % catTemplates.length];
            let questionText, answerText, options;

            if (tmpl.q.includes('%s')) {
                // Placeholder for a term
                const term = generateDistractors('', cat)[0]; // just a random term from pool
                // But we need a correct term for answer; better to pick from pool
                const pool = {
                    cyber_security: ["Phishing", "DDoS", "VPN", "Firewall", "Encryption", "Malware", "Ransomware", "2FA", "HTTPS", "SQL Injection", "Zero-day", "Botnet"],
                    islamic: ["সালাত", "যাকাত", "সিয়াম", "হজ্জ", "কুরআন", "হাদিস", "সুন্নাহ", "মসজিদ", "উম্মাহ", "দাওয়াহ"],
                    general: ["Oxygen", "Gravity", "Evolution", "DNA", "Photosynthesis", "Atom", "Molecule", "Species", "Energy", "Force"],
                    world: ["United Nations", "UNESCO", "NATO", "European Union", "Amazon River", "Himalayas", "Sahara Desert", "Great Wall", "Colosseum"],
                    bangladesh: ["ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা", "রাজশাহী", "বরিশাল", "ময়মনসিংহ", "রংপুর"]
                }[cat] || ["Sample"];
                const correctTerm = pool[Math.floor(Math.random() * pool.length)];
                questionText = tmpl.q.replace('%s', correctTerm);
                answerText = correctTerm;
                options = generateDistractors(correctTerm, cat);
            } else {
                // Fixed template
                questionText = tmpl.q;
                answerText = tmpl.a;
                // Shuffle options
                options = shuffleArray([...tmpl.opts]);
            }

            questionBank.push({
                id: id++,
                category: cat,
                question: questionText,
                answer: answerText,
                options: options
            });
        }
    });

    // Shuffle final bank
    questionBank = shuffleArray(questionBank);

    // Attach to global object
    if (typeof window !== 'undefined') {
        window.questionBank = questionBank;
        console.log(`Generated ${questionBank.length} questions.`);
    } else if (typeof global !== 'undefined') {
        global.questionBank = questionBank;
    }

    // Optional: Export for Node
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = questionBank;
    }
})();
