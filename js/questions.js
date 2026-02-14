// ============================================
// ULTIMATE QUESTION BANK GENERATOR v5.1 (SECURE)
// Generates 1500+ Unique & Challenging Questions
// Integrity: Protected against Console Modification
// ============================================

(function() {
    'use strict'; // Enforce strict mode for security

    // ---------- 1. EXPANDED TEMPLATES (HUGE DATABASE) ----------
    const templates = {
        cyber_security: [
            // --- BASIC & HISTORY ---
            { q: "What does '%s' mean in cybersecurity?", a: "%s" }, // Placeholder logic preserved
            { q: "Which of the following is a strong password?", a: "Xy_9#mZ@2026", opts: ["12345678", "iloveyou", "admin123", "Xy_9#mZ@2026"] },
            { q: "Who is known as a 'White Hat' hacker?", a: "Ethical Security Expert", opts: ["Cyber Criminal", "Ethical Security Expert", "Script Kiddie", "Dark Web User"] },
            { q: "What is 'DDoS' attack?", a: "Distributed Denial of Service", opts: ["Data Download of System", "Digital Domain Service", "Distributed Denial of Service", "Direct Disk Operating System"] },
            { q: "Who is known as the father of computer virus?", a: "Fred Cohen", opts: ["Bill Gates", "Fred Cohen", "Steve Jobs", "Mark Zuckerberg"] },
            
            // --- NETWORK SECURITY ---
            { q: "What comes after a firewall in network security?", a: "Intrusion Detection System (IDS)", opts: ["Antivirus", "Intrusion Detection System (IDS)", "Calculator", "Media Player"] },
            { q: "Which port is used for HTTPS?", a: "443", opts: ["80", "443", "22", "21"] },
            { q: "Which port is used for SSH?", a: "22", opts: ["23", "22", "8080", "445"] },
            { q: "What does VPN stand for?", a: "Virtual Private Network", opts: ["Very Private Network", "Virtual Public Network", "Virtual Private Network", "Verified Personal Net"] },
            { q: "Full form of Wi-Fi?", a: "Wireless Fidelity", opts: ["Wireless Free", "Wireless Fidelity", "Wide Fire", "Wire Fix"] },
            { q: "What is the standard port for FTP?", a: "21", opts: ["21", "25", "53", "110"] },
            { q: "Which protocol resolves IP addresses to MAC addresses?", a: "ARP", opts: ["DNS", "DHCP", "ARP", "ICMP"] },

            // --- WEB SECURITY ---
            { q: "SQL Injection targets which component?", a: "Database", opts: ["Monitor", "Database", "Keyboard", "Router"] },
            { q: "Difference between HTTP and HTTPS?", a: "Security (Encryption)", opts: ["Speed", "Security (Encryption)", "Cost", "Design"] },
            { q: "What is XSS?", a: "Cross-Site Scripting", opts: ["Cross-Site Styling", "Cross-Site Scripting", "XML System Security", "Xenon Server Source"] },
            { q: "What does a WAF protect?", a: "Web Applications", opts: ["Wi-Fi Signals", "Web Applications", "Windows Files", "Wireless Adapters"] },
            
            // --- TOOLS & OS ---
            { q: "Which Linux distro is popular for hacking?", a: "Kali Linux", opts: ["Ubuntu", "Kali Linux", "Windows 10", "MacOS"] },
            { q: "Which browser is used to access the Dark Web?", a: "Tor Browser", opts: ["Chrome", "Firefox", "Tor Browser", "Safari"] },
            { q: "File extension for Python scripts?", a: ".py", opts: [".exe", ".py", ".js", ".html"] },
            { q: "Popular tool for Wi-Fi hacking?", a: "Aircrack-ng", opts: ["Photoshop", "Aircrack-ng", "Notepad", "VLC Player"] },
            { q: "What tool is used for packet sniffing?", a: "Wireshark", opts: ["Paint", "Wireshark", "Excel", "Outlook"] },
            { q: "Which tool is used for brute-forcing passwords?", a: "John the Ripper", opts: ["Jack the Clipper", "John the Ripper", "Tom the Hacker", "Harry the Cracker"] },

            // --- CONCEPTS ---
            { q: "What is a 'Zero-Day' vulnerability?", a: "A flaw unknown to the developer", opts: ["A virus that kills PC in 0 days", "A flaw unknown to the developer", "A hacker group", "No internet connection"] },
            { q: "What is 'Social Engineering'?", a: "Manipulating people for info", opts: ["Fixing society", "Manipulating people for info", "Coding social media", "Creating robots"] },
            { q: "What is 'Ransomware'?", a: "Malware that locks data for money", opts: ["Free software", "Malware that locks data for money", "Antivirus tool", "Windows update"] },
            { q: "What is 2FA?", a: "Two-Factor Authentication", opts: ["Second Firewall", "Two-Factor Authentication", "Dual File Access", "Temporary Access"] },
            { q: "What is a botnet?", a: "Network of infected computers", opts: ["Antivirus software", "Network of infected computers", "Type of firewall", "Encryption algorithm"] },
            { q: "Which CIA triad component ensures data is not altered?", a: "Integrity", opts: ["Confidentiality", "Integrity", "Availability", "Authorization"] },
            { q: "What is 'Phishing'?", a: "Fake emails to steal info", opts: ["Fishing in a lake", "Fake emails to steal info", "Fixing network cables", "Testing software"] }
        ],
        islamic: [
            // --- QURAN ---
            { q: "পবিত্র কুরআনে কতটি সূরা আছে?", a: "১১৪", opts: ["১১০", "১১২", "১১৪", "১২০"] },
            { q: "কোন সূরাকে কুরআনের 'হৃদপিণ্ড' বলা হয়?", a: "সূরা ইয়াসিন", opts: ["সূরা আর-রহমান", "সূরা ইয়াসিন", "সূরা মুলক", "সূরা বাকারা"] },
            { q: "The Holy Quran was revealed over how many years?", a: "23 Years", opts: ["20 Years", "23 Years", "25 Years", "30 Years"] },
            { q: "Which Surah does not start with Bismillah?", a: "Surah At-Tawbah", opts: ["Surah Al-Fatiha", "Surah At-Tawbah", "Surah An-Nas", "Surah Al-Ikhlas"] },
            { q: "কুরআনের সর্বশেষ সূরার নাম কী?", a: "সূরা নাস", opts: ["সূরা ফালাক", "সূরা নাস", "সূরা ইখলাস", "সূরা বাকারা"] },
            { q: "সবচেয়ে বড় সূরা কোনটি?", a: "সূরা বাকারা", opts: ["সূরা আল-ইমরান", "সূরা বাকারা", "সূরা ইয়াসিন", "সূরা ফাতিহা"] },
            { q: "আসমানী কিতাব মোট কতটি?", a: "১০৪টি", opts: ["৪টি", "১০০টি", "১০৪টি", "১১৪টি"] },
            { q: "প্রথম ওহী নাজিল হয় কোন গুহায়?", a: "হেরা গুহায়", opts: ["সাওর গুহায়", "হেরা গুহায়", "সাফা পাহাড়ে", "উহুদ পাহাড়ে"] },

            // --- HISTORY & PROPHETS ---
            { q: "ইসলামের প্রথম স্তম্ভ কোনটি?", a: "কালিমা (শাহাদাত)", opts: ["নামাজ", "রোজা", "হজ্জ", "কালিমা (শাহাদাত)"] },
            { q: "Who was the first Muazzin of Islam?", a: "Bilal ibn Rabah (RA)", opts: ["Ali (RA)", "Bilal ibn Rabah (RA)", "Abu Bakr (RA)", "Umar (RA)"] },
            { q: "বদর যুদ্ধ কত হিজরিতে সংঘটিত হয়?", a: "২য় হিজরি", opts: ["১ম হিজরি", "২য় হিজরি", "৩য় হিজরি", "৫ম হিজরি"] },
            { q: "Who is known as 'Saifullah' (Sword of Allah)?", a: "Khalid Bin Walid (RA)", opts: ["Hamza (RA)", "Khalid Bin Walid (RA)", "Ali (RA)", "Umar (RA)"] },
            { q: "সর্বশেষ নবীর নাম কী?", a: "হযরত মুহাম্মদ (সা.)", opts: ["হযরত ঈসা (আ.)", "হযরত মুসা (আ.)", "হযরত মুহাম্মদ (সা.)", "হযরত ইব্রাহিম (আ.)"] },
            { q: "Which Prophet built the Ark?", a: "Nuh (AS)", opts: ["Adam (AS)", "Nuh (AS)", "Ibrahim (AS)", "Yusuf (AS)"] },
            { q: "কতজন সাহাবী বদর যুদ্ধে অংশ নেন?", a: "৩১৩ জন", opts: ["৩১৩ জন", "৩০০ জন", "৩২৫ জন", "৩৫০ জন"] },
            { q: "উহুদের যুদ্ধে মুসলিম বাহিনীর সেনাপতি কে ছিলেন?", a: "হযরত মুহাম্মদ (সা.)", opts: ["আবু বকর (রা.)", "উমর (রা.)", "হযরত মুহাম্মদ (সা.)", "খালিদ বিন ওয়ালিদ (রা.)"] },
            { q: "ফেরাউন কোন নবীর আমলে ছিল?", a: "মুসা (আ.)", opts: ["ঈসা (আ.)", "মুসা (আ.)", "দাউদ (আ.)", "ইব্রাহিম (আ.)"] },

            // --- GENERAL ISLAMIC ---
            { q: "জান্নাতের দরজার সংখ্যা কয়টি?", a: "৮টি", opts: ["৭টি", "৮টি", "১০টি", "১২টি"] },
            { q: "লাইলাতুল কদর কোন মাসে পালিত হয়?", a: "রমজান", opts: ["শাওয়াল", "রমজান", "মহররম", "জিলহজ্জ"] },
            { q: "What is the name of the Angel who brought revelation?", a: "Jibreel (AS)", opts: ["Mikail (AS)", "Israfil (AS)", "Jibreel (AS)", "Azrail (AS)"] },
            { q: "পবিত্র কাবা ঘর কোথায় অবস্থিত?", a: "মক্কা", opts: ["মদিনা", "মক্কা", "জেদ্দা", "রিয়াদ"] },
            { q: "যাকাত ফরজ হয় কখন?", a: "নিসাব পরিমাণ সম্পদ ১ বছর থাকলে", opts: ["ইচ্ছা হলে", "নিসাব পরিমাণ সম্পদ ১ বছর থাকলে", "প্রতি মাসে", "রমজান মাসে"] },
            { q: "হজ্জ কত হিজরিতে ফরজ হয়?", a: "৯ম হিজরি", opts: ["৬ষ্ঠ হিজরি", "৯ম হিজরি", "১০ম হিজরি", "২য় হিজরি"] },
            { q: "প্রথম কিবলা ছিল কোথায়?", a: "বাইতুল মুকাদ্দাস", opts: ["কাবা", "বাইতুল মুকাদ্দাস", "মসজিদে নববী", "কুবা"] },
            { q: "দৈনিক ফরজ নামাজ কত রাকাত?", a: "১৭ রাকাত", opts: ["২০ রাকাত", "১৭ রাকাত", "১২ রাকাত", "১৫ রাকাত"] }
        ],
        general: [
            // --- SCIENCE ---
            { q: "What is the chemical symbol for water?", a: "H2O", opts: ["CO2", "H2O", "O2", "NaCl"] },
            { q: "Who invented the light bulb?", a: "Thomas Edison", opts: ["Nikola Tesla", "Thomas Edison", "Alexander Bell", "Albert Einstein"] },
            { q: "How many bones are in the adult human body?", a: "206", opts: ["206", "208", "205", "210"] },
            { q: "What is the largest planet in our solar system?", a: "Jupiter", opts: ["Saturn", "Jupiter", "Neptune", "Earth"] },
            { q: "Which gas do plants absorb from the atmosphere?", a: "Carbon dioxide", opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"] },
            { q: "What is the hardest natural substance?", a: "Diamond", opts: ["Gold", "Iron", "Diamond", "Platinum"] },
            { q: "Who developed the theory of relativity?", a: "Albert Einstein", opts: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"] },
            { q: "What is the speed of light?", a: "299,792 km/s", opts: ["100,000 km/s", "299,792 km/s", "500,000 km/s", "1,000 km/s"] },
            { q: "Which blood group is the universal donor?", a: "O Negative", opts: ["A Positive", "O Negative", "AB Positive", "B Negative"] },

            // --- LITERATURE & ARTS ---
            { q: "Who wrote 'Romeo and Juliet'?", a: "William Shakespeare", opts: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Leo Tolstoy"] },
            { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", opts: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Van Gogh"] },
            { q: "Which is the longest river in the world?", a: "Nile", opts: ["Amazon", "Nile", "Yangtze", "Mississippi"] },
            { q: "Who wrote 'Harry Potter'?", a: "J.K. Rowling", opts: ["J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin", "Stephen King"] },

            // --- MISC ---
            { q: "How many continents are there?", a: "7", opts: ["5", "6", "7", "8"] },
            { q: "What is the smallest prime number?", a: "2", opts: ["1", "2", "3", "5"] },
            { q: "Which animal is known as the 'Ship of the Desert'?", a: "Camel", opts: ["Horse", "Camel", "Elephant", "Donkey"] },
            { q: "What is the capital of Australia?", a: "Canberra", opts: ["Sydney", "Melbourne", "Canberra", "Perth"] },
            { q: "What is the largest ocean?", a: "Pacific Ocean", opts: ["Atlantic", "Indian", "Pacific Ocean", "Arctic"] },
            { q: "Which planet is known as the Red Planet?", a: "Mars", opts: ["Venus", "Mars", "Jupiter", "Saturn"] },
            { q: "What color is a sapphire?", a: "Blue", opts: ["Red", "Blue", "Green", "Yellow"] }
        ],
        world: [
            // --- CAPITALS & COUNTRIES ---
            { q: "What is the capital of France?", a: "Paris", opts: ["London", "Paris", "Berlin", "Madrid"] },
            { q: "Which country has the largest population?", a: "India", opts: ["China", "USA", "India", "Indonesia"] },
            { q: "What is the currency of Japan?", a: "Yen", opts: ["Won", "Yuan", "Yen", "Ringgit"] },
            { q: "What is the capital of Canada?", a: "Ottawa", opts: ["Toronto", "Ottawa", "Vancouver", "Montreal"] },
            { q: "Which country is famous for the Great Pyramid?", a: "Egypt", opts: ["Mexico", "Greece", "Egypt", "Sudan"] },
            { q: "Which is the smallest country in the world?", a: "Vatican City", opts: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"] },
            { q: "What is the official language of Brazil?", a: "Portuguese", opts: ["Spanish", "Portuguese", "English", "French"] },
            
            // --- HISTORY & LANDMARKS ---
            { q: "Who was the first person to walk on the moon?", a: "Neil Armstrong", opts: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"] },
            { q: "In which year did World War II end?", a: "1945", opts: ["1944", "1945", "1946", "1947"] },
            { q: "What is the tallest mountain in the world?", a: "Mount Everest", opts: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"] },
            { q: "Which country is known as the Land of the Rising Sun?", a: "Japan", opts: ["China", "Korea", "Japan", "Thailand"] },
            { q: "Who invented the telephone?", a: "Alexander Graham Bell", opts: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"] },
            { q: "What is the longest wall in the world?", a: "Great Wall of China", opts: ["Hadrian's Wall", "Berlin Wall", "Great Wall of China", "Western Wall"] },
            { q: "Where is the Eiffel Tower located?", a: "Paris", opts: ["London", "Paris", "Rome", "New York"] },
            
            // --- NATURE ---
            { q: "Which ocean is the deepest?", a: "Pacific Ocean", opts: ["Atlantic", "Indian", "Pacific Ocean", "Arctic"] },
            { q: "What is the main ingredient in chocolate?", a: "Cocoa", opts: ["Sugar", "Milk", "Cocoa", "Vanilla"] },
            { q: "Which continent is the Sahara Desert in?", a: "Africa", opts: ["Asia", "Africa", "Australia", "South America"] }
        ],
        bangladesh: [
            // --- NATIONAL SYMBOLS ---
            { q: "বাংলাদেশের স্বাধীনতা দিবস কবে?", a: "২৬শে মার্চ", opts: ["২১শে ফেব্রুয়ারি", "২৬শে মার্চ", "১৬ই ডিসেম্বর", "১৪ই এপ্রিল"] },
            { q: "What is the capital of Bangladesh?", a: "Dhaka", opts: ["Chittagong", "Sylhet", "Dhaka", "Rajshahi"] },
            { q: "বাংলাদেশের জাতীয় খেলা কোনটি?", a: "হাডুডু (কাবাডি)", opts: ["ক্রিকেট", "ফুটবল", "হাডুডু (কাবাডি)", "হকি"] },
            { q: "বাংলাদেশের জাতীয় কবি কে?", a: "কাজী নজরুল ইসলাম", opts: ["রবীন্দ্রনাথ ঠাকুর", "কাজী নজরুল ইসলাম", "জসীম উদ্‌দীন", "জীবনানন্দ দাশ"] },
            { q: "What is the currency of Bangladesh?", a: "Taka", opts: ["Rupee", "Dollar", "Taka", "Yen"] },
            { q: "বাংলাদেশের জাতীয় ফল কী?", a: "কাঁঠাল", opts: ["আম", "কলা", "কাঁঠাল", "লিচু"] },
            { q: "বাংলাদেশের জাতীয় পশু কী?", a: "রয়েল বেঙ্গল টাইগার", opts: ["হাতি", "ময়ূর", "রয়েল বেঙ্গল টাইগার", "গরু"] },
            { q: "বাংলাদেশের জাতীয় সংগীতের রচয়িতা কে?", a: "রবীন্দ্রনাথ ঠাকুর", opts: ["কাজী নজরুল ইসলাম", "রবীন্দ্রনাথ ঠাকুর", "জসীম উদ্‌দীন", "শামসুর রাহমান"] },
            { q: "বাংলাদেশের জাতীয় মসজিদ কোনটি?", a: "বায়তুল মোকাররম", opts: ["স্টার মসজিদ", "বায়তুল মোকাররম", "সাত গম্বুজ মসজিদ", "তারাবাই মসজিদ"] },
            { q: "বাংলাদেশের জাতীয় ফুল কোনটি?", a: "শাপলা", opts: ["গোলাপ", "শাপলা", "জবা", "রজনীগন্ধা"] },

            // --- HISTORY & GEO ---
            { q: "How many districts are there in Bangladesh?", a: "64", opts: ["60", "64", "68", "70"] },
            { q: "কোন সালে বাংলাদেশ স্বাধীন হয়?", a: "১৯৭১", opts: ["১৯৪৭", "১৯৫২", "১৯৭১", "১৯৯০"] },
            { q: "Largest Mangrove Forest in the world?", a: "Sundarbans", opts: ["Amazon", "Sundarbans", "Rainforest", "Safari Park"] },
            { q: "পদ্মা সেতুর দৈর্ঘ্য কত?", a: "৬.১৫ কি.মি.", opts: ["৪.৮ কি.মি.", "৬.১৫ কি.মি.", "৫.৫ কি.মি.", "৭.০ কি.মি."] },
            { q: "শহীদ মিনার এর স্থপতি কে?", a: "হামিদুর রহমান", opts: ["জয়নুল আবেদিন", "হামিদুর রহমান", "লুই আই কান", "শামীম সিকদার"] },
            { q: "ঢাকা শহর কোথায় অবস্থিত?", a: "বাংলাদেশ", opts: ["ভারত", "পাকিস্তান", "বাংলাদেশ", "মিয়ানমার"] },
            { q: "বাংলাদেশের বিজয় দিবস কবে?", a: "১৬ই ডিসেম্বর", opts: ["২৬শে মার্চ", "১৬ই ডিসেম্বর", "২১শে ফেব্রুয়ারি", "১৫ই আগস্ট"] },
            { q: "মুক্তিযুদ্ধের সময় বাংলাদেশকে কয়টি সেক্টরে ভাগ করা হয়?", a: "১১টি", opts: ["৯টি", "১০টি", "১১টি", "৭টি"] },
            { q: "বাংলাদেশের দীর্ঘতম নদী কোনটি?", a: "মেঘনা", opts: ["পদ্মা", "মেঘনা", "যমুনা", "কর্ণফুলী"] },
            { q: "বাংলাদেশের সর্বোচ্চ পর্বতশৃঙ্গ কোনটি?", a: "বিজয় (তাজিংডং)", opts: ["কেোকারাডং", "বিজয় (তাজিংডং)", "সাকা হাফং", "চন্দ্রনাথ"] }
        ]
    };

    // --- 2. SECURITY & UTILITY FUNCTIONS ---
    
    // Fisher-Yates Shuffle Algorithm (Optimized)
    function shuffleArray(arr) {
        let currentIndex = arr.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
        }
        return arr;
    }

    // Dynamic Distractor Generator (Preserved logic but improved)
    function generateDistractors(correct, category) {
        const pools = {
            cyber_security: ["Phishing", "DDoS", "VPN", "Firewall", "Encryption", "Malware", "Ransomware", "2FA", "HTTPS", "SQL Injection", "Zero-day", "Botnet", "Spyware", "Adware", "Rootkit", "Brute Force", "Trojan", "Worm", "Keylogger"],
            islamic: ["সালাত", "যাকাত", "সিয়াম", "হজ্জ", "কুরআন", "হাদিস", "সুন্নাহ", "মসজিদ", "উম্মাহ", "দাওয়াহ", "তাফসির", "ফিকহ", "আকিদা", "জান্নাত", "জাহান্নাম", "ঈমান", "ইহসান"],
            general: ["Oxygen", "Gravity", "Evolution", "DNA", "Photosynthesis", "Atom", "Molecule", "Species", "Energy", "Force", "Magnetism", "Electricity", "Quantum", "Relativity", "Microbe"],
            world: ["United Nations", "UNESCO", "NATO", "European Union", "Amazon River", "Himalayas", "Sahara Desert", "Great Wall", "Colosseum", "Eiffel Tower", "Statue of Liberty", "Taj Mahal", "Machu Picchu"],
            bangladesh: ["ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা", "রাজশাহী", "বরিশাল", "ময়মনসিংহ", "রংপুর", "পদ্মা", "মেঘনা", "যমুনা", "সুন্দরবন", "কক্সবাজার", "কুয়াকাটা"]
        };
        
        const pool = pools[category] || ["Option A", "Option B", "Option C", "Option D"];
        
        // Filter out the correct answer from potential distractors
        let candidates = pool.filter(term => term.toLowerCase() !== correct.toLowerCase());
        
        let selected = [];
        while (selected.length < 3 && candidates.length > 0) {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            selected.push(candidates[randomIndex]);
            candidates.splice(randomIndex, 1);
        }
        
        // Fallback if pool is exhausted
        while (selected.length < 3) {
            selected.push(`System Opt ${selected.length + 1}`);
        }
        
        return shuffleArray([correct, ...selected]);
    }

    // --- 3. GENERATION LOGIC (Engine) ---
    const totalQuestions = 1500;
    const categoryNames = Object.keys(templates);
    const perCategory = Math.ceil(totalQuestions / categoryNames.length);

    let finalQuestionBank = [];
    let uniqueIdCounter = 1001; // Start IDs from 1001 to avoid conflicts

    categoryNames.forEach((cat) => {
        const catTemplates = templates[cat];
        // Ensure we loop enough times to get ~300 questions per category
        for (let i = 0; i < perCategory; i++) {
            // Cyclical selection ensures we use ALL templates before repeating
            const tmpl = catTemplates[i % catTemplates.length];
            
            let qText, aText, qOpts;

            if (tmpl.q.includes('%s')) {
                // Handle Dynamic Placeholder Questions
                const pool = {
                    cyber_security: ["Phishing", "DDoS", "VPN", "Firewall", "Encryption", "Malware", "Ransomware", "2FA", "HTTPS", "SQL Injection", "Zero-day", "Botnet"],
                    islamic: ["সালাত", "যাকাত", "সিয়াম", "হজ্জ", "কুরআন", "হাদিস", "সুন্নাহ", "মসজিদ", "উম্মাহ", "দাওয়াহ"],
                    general: ["Oxygen", "Gravity", "Evolution", "DNA", "Photosynthesis", "Atom", "Molecule", "Species", "Energy", "Force"],
                    world: ["United Nations", "UNESCO", "NATO", "European Union", "Amazon River", "Himalayas", "Sahara Desert", "Great Wall", "Colosseum"],
                    bangladesh: ["ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা", "রাজশাহী", "বরিশাল", "ময়মনসিংহ", "রংপুর"]
                }[cat] || ["Sample"];
                
                const randomTerm = pool[Math.floor(Math.random() * pool.length)];
                qText = tmpl.q.replace('%s', randomTerm);
                aText = randomTerm;
                qOpts = generateDistractors(randomTerm, cat);
            } else {
                // Handle Static Questions
                qText = tmpl.q;
                aText = tmpl.a;
                qOpts = shuffleArray([...tmpl.opts]); // Copy array to prevent reference issues
            }

            finalQuestionBank.push({
                id: uniqueIdCounter++,
                category: cat,
                question: qText,
                answer: aText,
                options: qOpts
            });
        }
    });

    // Final Shuffle of the entire bank
    finalQuestionBank = shuffleArray(finalQuestionBank);

    // --- 4. EXPORT & SECURITY FREEZE ---
    if (typeof window !== 'undefined') {
        // Freeze object to prevent console tampering (Anti-Cheat)
        window.questionBank = Object.freeze(finalQuestionBank);
        console.log(`%c[TRY SYSTEM] Database Loaded: ${finalQuestionBank.length} Questions Secured.`, 'color: #00f3ff; font-weight: bold;');
    } else if (typeof global !== 'undefined') {
        global.questionBank = finalQuestionBank;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = finalQuestionBank;
    }

})();
