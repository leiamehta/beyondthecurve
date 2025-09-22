/*
   JavaScript for Beyond the Curve
   Implements:
   - SPA Navigation
   - Gamification: Streaks & Rewards (Duolingo-style) 
   - Tracker logic [cite: 12]
   - Chatbot toggle [cite: 36]
   - Theme toggle [cite: 8]
   - Simulated dynamic homepage [cite: 8]
   - Simulated data persistence (real app would use an API) [cite: 8]
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. State & Selectors ---
    
    // Simulates data that would be saved to a user's account via API [cite: 8, 195]
    let appState = {
        points: 0,
        streak: 0,
        lastLogDate: null, // Stores YYYY-MM-DD
        lastUsedFeature: '#home' // For dynamic homepage [cite: 8]
    };

    // Page containers
    const loginScreen = document.getElementById('login-screen');
    const appShell = document.getElementById('app-shell');
    const appPages = document.querySelectorAll('.app-page');
    const pageTitle = document.getElementById('page-title');

    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');

    // Gamification 
    const streakCountEl = document.getElementById('streak-count');
    const pointsCountEl = document.getElementById('points-count');

    // Trackers [cite: 12]
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const logBraceBtn = document.getElementById('log-brace-btn');
    const logPtBtn = document.getElementById('log-pt-btn');

    // Chatbot ("Spiney") [cite: 36]
    const spineyFab = document.getElementById('spiney-fab');
    const spineyModal = document.getElementById('spiney-chat-modal');
    const closeChatBtn = document.getElementById('close-chat');
    
    // Theme Toggle [cite: 8]
    const themeToggleBtn = document.getElementById('theme-toggle');

    // --- 2. Core App Logic (Login & Navigation) ---

    // Simulate Login 
    document.getElementById('login-button').addEventListener('click', () => {
        loginScreen.classList.remove('active');
        appShell.classList.add('active');
        // On login, update streak and load user data (simulated)
        updateStreak();
        updateGamificationUI();
        updateHomepage();
    });

    // SPA Navigation 
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); // Get 'home' from '#home'
            showPage(targetId);
            
            // Update last used feature
            appState.lastUsedFeature = link.getAttribute('href');
            updateHomepage();
        });
    });

    function showPage(pageId) {
        // Hide all pages
        appPages.forEach(page => page.classList.remove('active'));
        
        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update active nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
        
        // Update header title
        pageTitle.textContent = document.querySelector(`.nav-link[href="#${pageId}"]`).textContent.replace('home', 'Home').replace('check_circle', '').replace('menu_book', '').replace('groups', '').replace('edit_note', '');
    }

    // Dynamic Homepage Logic [cite: 8, 193]
    function updateHomepage() {
        const dynamicArea = document.getElementById('dynamic-content-area');
        const featureName = document.querySelector(`.nav-link[href="${appState.lastUsedFeature}"]`).textContent;
        dynamicArea.innerHTML = `
            <h3>Continue where you left off?</h3>
            <p>You were last visiting: <strong>${featureName.replace('home', 'Home').replace('check_circle', '').replace('menu_book', '').replace('groups', '').replace('edit_note', '')}</strong></p>
            <button onclick="document.querySelector('.nav-link[href=\\'${appState.lastUsedFeature}\\']').click()">Go to ${featureName.replace('home', 'Home').replace('check_circle', '').replace('menu_book', '').replace('groups', '').replace('edit_note', '')}</button>
        `;
    }

    // --- 3. Gamification & Reward System (Duolingo-style)  ---

    function addPoints(amount, feedbackEl) {
        appState.points += amount;
        if (feedbackEl) {
            feedbackEl.textContent = `+${amount} points! Great job!`;
            setTimeout(() => { feedbackEl.textContent = ''; }, 3000);
        }
        updateGamificationUI();
        
        // Milestone reward (simulated) [cite: 16, 20]
        if (appState.points > 0 && appState.points % 100 === 0) {
            alert(`🎉 Milestone! 🎉 You've reached ${appState.points} points! Keep it up!`);
        }
    }

    function updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        
        if (appState.lastLogDate === today) {
            // Already logged today, do nothing
            return;
        }

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        if (appState.lastLogDate === yesterday) {
            // It's a new day and they logged yesterday, increase streak!
            appState.streak++;
            alert(`🔥 Streak extended to ${appState.streak} days! +50 bonus points!`);
            addPoints(50);
        } else {
            // Missed a day, reset streak to 1
            appState.streak = 1;
        }

        appState.lastLogDate = today;
        updateGamificationUI();
    }

    function updateGamificationUI() {
        streakCountEl.textContent = appState.streak;
        pointsCountEl.textContent = appState.points;
    }

    // --- 4. Feature-Specific Logic ---

    // Tracker Tabs
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.dataset.tab;
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });

            tabLinks.forEach(tab => tab.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Brace Tracker Logic [cite: 15]
    logBraceBtn.addEventListener('click', () => {
        const hours = parseInt(document.getElementById('brace-hours').value);
        if (hours > 0 && hours <= 24) {
            updateStreak(); // Check and update streak on successful log
            addPoints(hours, logBraceBtn.nextElementSibling); // Reward: 1 point per hour
            document.getElementById('brace-hours').value = '';
        } else {
            alert('Please enter a valid number of hours (1-24).');
        }
    });

    // PT Tracker Logic [cite: 19]
    logPtBtn.addEventListener('click', () => {
        updateStreak(); // Check and update streak on successful log
        addPoints(20, logPtBtn.nextElementSibling); // Reward: 20 points for PT session
    });

    // "Spiney" Chatbot Toggle [cite: 36]
    spineyFab.addEventListener('click', () => {
        spineyModal.classList.toggle('hidden');
    });
    closeChatBtn.addEventListener('click', () => {
        spineyModal.classList.add('hidden');
    });

    // Theme Toggle Logic 
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }

    // Initialize
    showPage('home');
});
