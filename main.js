// main.js - Routing e inizializzazione

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    initThemeToggle();
    setupLogout();
    seedTickets();

    const path = window.location.pathname.split('/').pop() || 'index.html';

    if (path === 'index.html') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value.trim();
                const user = authenticate(username, password);
                if (user) {
                    saveUserSession(user);
                    window.location.href = user.role === 'client' ? 'client.html' : 'tech.html';
                } else {
                    document.getElementById('loginError').textContent = 'Credenziali non valide.';
                }
            });
        }
    } else if (path === 'client.html') {
        setupClientPage();
    } else if (path === 'tech.html') {
        setupTechPage();
    } else if (path === 'incident-detail.html') {
        setupIncidentDetail();
    } else if (path === 'change-detail.html') {
        setupChangeDetail();
    }
});