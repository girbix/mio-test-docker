// utils.js - Funzioni di utilità

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.className = savedTheme;
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-mode');
    const newTheme = isDark ? 'light-mode' : 'dark-mode';
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
}

function authenticate(username, password) {
    return users.find(u => u.username === username && u.password === password);
}

function saveUserSession(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function requireAuth(allowedRoles) {
    const user = getCurrentUser();
    if (!user || !allowedRoles.includes(user.role)) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

function getTickets() {
    return JSON.parse(localStorage.getItem('tickets')) || [];
}

function saveTickets(tickets) {
    localStorage.setItem('tickets', JSON.stringify(tickets));
}

function generateTicketNumber(type) {
    const prefix = type === 'incident' ? 'INC' : 'CHG';
    const tickets = getTickets();
    const count = tickets.filter(t => t.type === type).length + 1;
    return prefix + String(count).padStart(7, '0');
}

function createIncident(incidentData) {
    const tickets = getTickets();
    const newTicket = {
        id: Date.now(),
        type: 'incident',
        number: generateTicketNumber('incident'),
        opened: new Date().toISOString().slice(0, 19).replace('T', ' '),
        state: 'New',
        priority: calculatePriority(incidentData.urgency, incidentData.impact),
        suggestedTeam: suggestTeam(incidentData.shortDescription, incidentData.description),
        ...incidentData
    };
    tickets.push(newTicket);
    saveTickets(tickets);
    return newTicket;
}

function createChange(changeData) {
    const tickets = getTickets();
    const newTicket = {
        id: Date.now(),
        type: 'change',
        number: generateTicketNumber('change'),
        opened: new Date().toISOString().slice(0, 19).replace('T', ' '),
        state: 'New',
        ...changeData
    };
    tickets.push(newTicket);
    saveTickets(tickets);
    return newTicket;
}

function updateTicket(id, updates) {
    const tickets = getTickets();
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
        tickets[index] = { ...tickets[index], ...updates };
        saveTickets(tickets);
    }
}

function calculatePriority(urgency, impact) {
    const levels = { 'Low': 1, 'Medium': 2, 'High': 3 };
    const total = (levels[urgency] || 1) + (levels[impact] || 1);
    if (total >= 5) return '1 - Critical';
    if (total >= 3) return '2 - High';
    return '3 - Low';
}

function suggestTeam(shortDesc, desc = '') {
    const text = (shortDesc + ' ' + desc).toLowerCase();
    for (const [team, keywords] of Object.entries(teamKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return team;
        }
    }
    return 'Network';
}

function seedTickets() {
    let tickets = getTickets();
    if (tickets.length === 0) {
        tickets.push({
            id: 1,
            type: 'incident',
            number: 'INC0000001',
            opened: '2026-03-01 09:30:00',
            state: 'In Progress',
            priority: '2 - High',
            companyId: 1,
            requestedBy: 'client1@techinnovate.it',
            caller: 'Mario Rossi',
            location: 'Torino',
            service: 'Network',
            serviceOffering: 'SD-WAN',
            ci: 'FW-TOR-01',
            shortDescription: 'Rallentamento connessione sede Torino',
            description: 'Gli utenti segnalano lentezza nella navigazione. Possibile problema di routing.',
            internalNotes: '',
            urgency: 'Medium',
            impact: 'High',
            contract: 'CON-001',
            assignmentGroup: 'Network',
            assignedTo: 'Mario Rossi',
            assignedTeam: 'Network',
            suggestedTeam: 'Network'
        });
        tickets.push({
            id: 2,
            type: 'change',
            number: 'CHG0000001',
            opened: '2026-03-02 14:15:00',
            state: 'New',
            companyId: 2,
            requestedBy: 'client2@globallogistics.it',
            serviceOffering: 'IP Telephony',
            ci: 'ROUTER-GW-01',
            shortDescription: 'Aggiornamento firmware router',
            description: 'Pianificare aggiornamento firmware del router principale.',
            risk: 'Medium',
            justification: 'Necessario per sicurezza',
            implementationPlan: 'Eseguire in finestra di manutenzione notturna',
            riskAnalysis: 'Possibile downtime di 10 minuti',
            workNotes: '',
            ticketGrade: '3',
            rca: ''
        });
        saveTickets(tickets);
    }
}

function getCurrentCompanyData() {
    const user = getCurrentUser();
    if (!user || user.role !== 'client' || !user.companyId) return null;
    return {
        company: companies[user.companyId],
        locations: locations[user.companyId] || [],
        cis: cis[user.companyId] || [],
        services: services[user.companyId] || [],
        serviceOfferings: serviceOfferings[user.companyId] || []
    };
}

function populateDatalist(listId, items) {
    const list = document.getElementById(listId);
    if (list) {
        list.innerHTML = '';
        items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            list.appendChild(opt);
        });
    }
}

function setupLogout() {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); });
}
