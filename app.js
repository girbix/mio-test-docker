// app.js - Gestione completa: tema, autenticazione, multi-tenancy, ticket, team di tecnici

// ==================== CONFIGURAZIONE TEMA ====================
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

// ==================== DATI FAKE (strutturati) ====================

// Aziende (4)
const companies = {
    1: { id: 1, name: 'TechInnovate srl' },
    2: { id: 2, name: 'Global Logistics' },
    3: { id: 3, name: 'FinanzaSicura S.A.' },
    4: { id: 4, name: 'EcoEnergy Group' }
};

// Clienti (uno per azienda)
const clientUsers = [
    { username: 'client1@techinnovate.it', password: 'client', role: 'client', companyId: 1, fullName: 'Mario Rossi' },
    { username: 'client2@globallogistics.it', password: 'client', role: 'client', companyId: 2, fullName: 'Laura Bianchi' },
    { username: 'client3@finanzasicura.it', password: 'client', role: 'client', companyId: 3, fullName: 'Giuseppe Verdi' },
    { username: 'client4@ecoenergy.it', password: 'client', role: 'client', companyId: 4, fullName: 'Francesca Neri' }
];

// Team e tecnici (12 totali: 4 L1, 4 L2, 4 L3, distribuiti tra Network, Cloud, Cyber Security)
const technicians = [
    // L1
    { name: 'Mario Rossi', team: 'Network', level: 'L1', email: 'mario.rossi@noc.it', password: 'L1_network' },
    { name: 'Luigi Bianchi', team: 'Network', level: 'L1', email: 'luigi.bianchi@noc.it', password: 'L1_network' },
    { name: 'Giulia Verdi', team: 'Cloud', level: 'L1', email: 'giulia.verdi@noc.it', password: 'L1_cloud' },
    { name: 'Paolo Neri', team: 'Cyber Security', level: 'L1', email: 'paolo.neri@noc.it', password: 'L1_cyber' },
    // L2
    { name: 'Anna Gialli', team: 'Network', level: 'L2', email: 'anna.gialli@noc.it', password: 'L2_network' },
    { name: 'Marco Blu', team: 'Cloud', level: 'L2', email: 'marco.blu@noc.it', password: 'L2_cloud' },
    { name: 'Laura Viola', team: 'Cloud', level: 'L2', email: 'laura.viola@noc.it', password: 'L2_cloud' },
    { name: 'Stefano Arancio', team: 'Cyber Security', level: 'L2', email: 'stefano.arancio@noc.it', password: 'L2_cyber' },
    // L3
    { name: 'Chiara Rosa', team: 'Network', level: 'L3', email: 'chiara.rosa@noc.it', password: 'L3_network' },
    { name: 'Andrea Grigio', team: 'Cloud', level: 'L3', email: 'andrea.grigio@noc.it', password: 'L3_cloud' },
    { name: 'Elena Marrone', team: 'Cyber Security', level: 'L3', email: 'elena.marrone@noc.it', password: 'L3_cyber' },
    { name: 'Davide Celeste', team: 'Cyber Security', level: 'L3', email: 'davide.celeste@noc.it', password: 'L3_cyber' }
];

// Utente tecnico generico (admin)
const genericTechUser = {
    username: 'tecnico.noc@it.it',
    password: '123',
    role: 'tech',
    fullName: 'Admin NOC',
    team: 'N/A',
    level: 'N/A'
};

// Costruiamo l'array users: clienti + tutti i tecnici + generico
const users = [
    ...clientUsers,
    ...technicians.map(t => ({
        username: t.email,
        password: t.password,
        role: 'tech',
        fullName: t.name,
        team: t.team,
        level: t.level
    })),
    genericTechUser
];
// Location per azienda
const locations = {
    1: ['Torino', 'Milano'],
    2: ['Bra', 'Novara'],
    3: ['Torino Centro'],
    4: ['Moncalieri']
};

// Configuration Items (CI) per azienda
const cis = {
    1: ['SVR-PROD-01', 'FW-TOR-01', 'SW-CORE-02'],
    2: ['SW-WH-04', 'ROUTER-GW-01', 'FW-LOG-01'],
    3: ['VPN-TUNNEL', 'NAS-BACKUP', 'SRV-FIN-01'],
    4: ['VDI-USER-88', 'UPS-APC-05', 'SOLAR-INV-01']
};

// Servizi per azienda
const services = {
    1: ['Cloud', 'Cyber Security', 'Network'],
    2: ['Network', 'VoIP', 'Logistics'],
    3: ['VPN', 'Storage', 'Banking'],
    4: ['Monitoring', 'VDI', 'Energy']
};

// Service Offering per azienda
const serviceOfferings = {
    1: ['IaaS', 'Firewall Management', 'Endpoint Protection', 'SD-WAN'],
    2: ['SD-WAN', 'IP Telephony', 'Call Manager', 'Fleet Tracking'],
    3: ['Site-to-Site VPN', 'Remote Access VPN', 'SAN Storage', 'Core Banking'],
    4: ['Infrastructure Monitoring', 'Desktop Virtualization', 'Application Performance', 'Smart Grid']
};

// ==================== GESTIONE TICKET (localStorage) ====================
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

// Inizializza con ticket di esempio (per demo)
function seedTickets() {
    let tickets = getTickets();
    if (tickets.length === 0) {
        // Alcuni incident di esempio
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
            description: 'Gli utenti segnalano lentezza nella navigazione.',
            internalNotes: '',
            urgency: 'Medium',
            impact: 'High',
            contract: 'CON-001',
            assignmentGroup: 'Network',
            assignedTo: 'Mario Rossi'
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

// ==================== AUTENTICAZIONE ====================
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

// ==================== MULTI-TENANCY ====================
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

// ==================== CLIENT PAGE ====================
function setupClientPage() {
    const user = requireAuth(['client']);
    if (!user) return;

    document.getElementById('loggedUser').textContent = `Cliente: ${companies[user.companyId].name} (${user.fullName})`;

    // Popola datalist per la modale
    const companyData = getCurrentCompanyData();
    if (companyData) {
        populateDatalist('location-list', companyData.locations);
        populateDatalist('ci-list', companyData.cis);
        populateDatalist('service-list', companyData.services);
        populateDatalist('offering-list', companyData.serviceOfferings);
    }

    // Preimposta requestedBy
    document.getElementById('requestedBy').value = user.username;

    // Mostra i ticket del cliente
    renderClientTickets();

    // Gestione modale
    const modal = document.getElementById('incidentModal');
    const btn = document.getElementById('newIncidentBtn');
    const span = document.querySelector('.close');

    btn.onclick = () => modal.style.display = 'block';
    span.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    // Submit form incident
    document.getElementById('incidentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newIncident = {
            companyId: user.companyId,
            requestedBy: document.getElementById('requestedBy').value,
            caller: document.getElementById('caller').value,
            location: document.getElementById('location').value,
            service: document.getElementById('service').value,
            serviceOffering: document.getElementById('serviceOffering').value,
            ci: document.getElementById('ci').value,
            shortDescription: document.getElementById('shortDescription').value,
            description: document.getElementById('description').value,
            internalNotes: document.getElementById('internalNotes').value,
            urgency: document.getElementById('urgency').value,
            impact: document.getElementById('impact').value,
            contract: document.getElementById('contract').value
        };
        createIncident(newIncident);
        modal.style.display = 'none';
        renderClientTickets();
        e.target.reset();
    });
}

function renderClientTickets() {
    const user = getCurrentUser();
    const tickets = getTickets().filter(t => t.type === 'incident' && t.companyId === user.companyId);
    const tbody = document.getElementById('clientTicketList');
    tbody.innerHTML = '';

    // Aggiorna contatori
    const open = tickets.filter(t => t.state === 'New' || t.state === 'In Progress').length;
    const inProgress = tickets.filter(t => t.state === 'In Progress').length;
    const resolved = tickets.filter(t => t.state === 'Resolved' || t.state === 'Closed').length;
    document.getElementById('openCount').textContent = open;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('resolvedCount').textContent = resolved;

    const total = tickets.length;
    const progress = total ? (resolved / total) * 100 : 0;
    const fill = document.getElementById('progressFill');
    fill.style.width = progress + '%';
    fill.textContent = Math.round(progress) + '%';

    tickets.forEach(t => {
        const row = tbody.insertRow();
        row.insertCell().textContent = t.number;
        row.insertCell().textContent = 'Incident';
        row.insertCell().textContent = t.shortDescription;
        row.insertCell().textContent = t.state;
        row.insertCell().textContent = t.priority;
        row.insertCell().textContent = t.opened;
        row.addEventListener('click', () => {
            window.location.href = `incident-detail.html?id=${t.id}`;
        });
    });
}

// ==================== TECH DASHBOARD ====================
function setupTechPage() {
    const user = requireAuth(['tech']);
    if (!user) return;

    document.getElementById('loggedUser').textContent = `Tecnico: ${user.fullName} (${user.username})`;

    renderTechDashboard();
}

function renderTechDashboard() {
    const tickets = getTickets();
    const tbody = document.getElementById('ticketList');
    tbody.innerHTML = '';

    // Contatori
    const open = tickets.filter(t => t.state === 'New').length;
    const inProgress = tickets.filter(t => t.state === 'In Progress').length;
    const critical = tickets.filter(t => t.priority && t.priority.includes('Critical')).length;

    document.getElementById('openTickets').textContent = open;
    document.getElementById('inProgressTickets').textContent = inProgress;
    document.getElementById('criticalSLA').textContent = critical;

    // Tabella
    tickets.forEach(t => {
        const row = tbody.insertRow();
        row.insertCell().textContent = t.type === 'incident' ? 'Incident' : 'Change';
        row.insertCell().textContent = t.number;
        row.insertCell().textContent = t.shortDescription || '';
        row.insertCell().textContent = t.state;
        row.insertCell().textContent = t.priority || 'N/A';
        // Trova team e assegnato
        const assignedTech = technicians.find(tech => tech.name === t.assignedTo);
        row.insertCell().textContent = assignedTech ? assignedTech.team : (t.assignmentGroup || '');
        row.insertCell().textContent = t.assignedTo || '';
        row.insertCell().textContent = t.opened;
        row.addEventListener('click', () => {
            const page = t.type === 'incident' ? 'incident-detail.html' : 'change-detail.html';
            window.location.href = `${page}?id=${t.id}`;
        });
    });
}

// ==================== INCIDENT DETAIL PAGE ====================
function setupIncidentDetail() {
    const user = requireAuth(['tech']); // solo tech può modificare, ma cliente può visualizzare? per semplicità tech
    if (!user) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const tickets = getTickets();
    const ticket = tickets.find(t => t.id === id && t.type === 'incident');
    if (!ticket) {
        alert('Ticket non trovato');
        window.location.href = 'tech.html';
        return;
    }

    document.getElementById('incidentNumber').textContent = ticket.number;
    document.getElementById('number').value = ticket.number;
    document.getElementById('opened').value = ticket.opened;
    document.getElementById('requestedBy').value = ticket.requestedBy || '';
    document.getElementById('caller').value = ticket.caller || '';
    document.getElementById('location').value = ticket.location || '';
    document.getElementById('serviceOffering').value = ticket.serviceOffering || '';
    document.getElementById('ci').value = ticket.ci || '';
    document.getElementById('shortDescription').value = ticket.shortDescription || '';
    document.getElementById('description').value = ticket.description || '';
    document.getElementById('internalNotes').value = ticket.internalNotes || '';
    document.getElementById('state').value = ticket.state || 'New';
    document.getElementById('impact').value = ticket.impact || 'Medium';
    document.getElementById('urgency').value = ticket.urgency || 'Medium';
    document.getElementById('priority').value = ticket.priority || '3 - Low';
    document.getElementById('contract').value = ticket.contract || '';

    // Popola datalist parent incidents (altri incident)
    const parentList = document.getElementById('parent-list');
    if (parentList) {
        const otherIncidents = tickets.filter(t => t.type === 'incident' && t.id !== id);
        otherIncidents.forEach(inc => {
            const opt = document.createElement('option');
            opt.value = inc.number;
            parentList.appendChild(opt);
        });
    }
    document.getElementById('parentIncident').value = ticket.parentIncident || '';

    // Popola assignment group e assigned to
    const groupSelect = document.getElementById('assignmentGroup');
    const assignedSelect = document.getElementById('assignedTo');
    const teamsList = [...new Set(technicians.map(t => t.team))];
    teamsList.forEach(team => {
        const opt = document.createElement('option');
        opt.value = team;
        opt.textContent = team;
        groupSelect.appendChild(opt);
    });
    groupSelect.value = ticket.assignmentGroup || '';
    groupSelect.addEventListener('change', () => {
        const team = groupSelect.value;
        assignedSelect.innerHTML = '';
        technicians.filter(t => t.team === team).forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.name;
            opt.textContent = `${t.name} (${t.level})`;
            assignedSelect.appendChild(opt);
        });
    });
    if (ticket.assignmentGroup) {
        groupSelect.dispatchEvent(new Event('change'));
        assignedSelect.value = ticket.assignedTo || '';
    }

    document.getElementById('updateIncidentBtn').addEventListener('click', () => {
        const updates = {
            state: document.getElementById('state').value,
            impact: document.getElementById('impact').value,
            urgency: document.getElementById('urgency').value,
            priority: calculatePriority(document.getElementById('urgency').value, document.getElementById('impact').value),
            internalNotes: document.getElementById('internalNotes').value,
            assignmentGroup: groupSelect.value,
            assignedTo: assignedSelect.value,
            contract: document.getElementById('contract').value,
            parentIncident: document.getElementById('parentIncident').value,
            serviceOffering: document.getElementById('serviceOffering').value,
            ci: document.getElementById('ci').value,
            shortDescription: document.getElementById('shortDescription').value,
            description: document.getElementById('description').value
        };
        updateTicket(id, updates);
        alert('Ticket aggiornato');
        window.location.href = 'tech.html';
    });
}

// ==================== CHANGE DETAIL PAGE ====================
function setupChangeDetail() {
    const user = requireAuth(['tech']);
    if (!user) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const tickets = getTickets();
    const ticket = tickets.find(t => t.id === id && t.type === 'change');
    if (!ticket) {
        alert('Change non trovato');
        window.location.href = 'tech.html';
        return;
    }

    document.getElementById('changeNumber').textContent = ticket.number;
    document.getElementById('number').value = ticket.number;
    document.getElementById('opened').value = ticket.opened;
    document.getElementById('requestedBy').value = ticket.requestedBy || '';
    document.getElementById('serviceOffering').value = ticket.serviceOffering || '';
    document.getElementById('ci').value = ticket.ci || '';
    document.getElementById('shortDescription').value = ticket.shortDescription || '';
    document.getElementById('description').value = ticket.description || '';
    document.getElementById('risk').value = ticket.risk || 'Medium';
    document.getElementById('justification').value = ticket.justification || '';
    document.getElementById('implementationPlan').value = ticket.implementationPlan || '';
    document.getElementById('riskAnalysis').value = ticket.riskAnalysis || '';
    document.getElementById('workNotes').value = ticket.workNotes || '';
    document.getElementById('ticketGrade').value = ticket.ticketGrade || '3';
    document.getElementById('rca').value = ticket.rca || '';

    // Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // RCA obbligatoria per grado 1
    const ticketGrade = document.getElementById('ticketGrade');
    const rcaField = document.getElementById('rca');
    const toggleRcaRequired = () => {
        const isGrade1 = ticketGrade.value === '1';
        rcaField.required = isGrade1;
        const rcaGroup = document.getElementById('rcaGroup');
        if (isGrade1) {
            rcaGroup.classList.add('required');
        } else {
            rcaGroup.classList.remove('required');
        }
    };
    ticketGrade.addEventListener('change', toggleRcaRequired);
    toggleRcaRequired();

    document.getElementById('updateChangeBtn').addEventListener('click', () => {
        const updates = {
            justification: document.getElementById('justification').value,
            implementationPlan: document.getElementById('implementationPlan').value,
            riskAnalysis: document.getElementById('riskAnalysis').value,
            workNotes: document.getElementById('workNotes').value,
            ticketGrade: ticketGrade.value,
            rca: rcaField.value,
            risk: document.getElementById('risk').value,
            serviceOffering: document.getElementById('serviceOffering').value,
            ci: document.getElementById('ci').value,
            shortDescription: document.getElementById('shortDescription').value,
            description: document.getElementById('description').value
        };
        updateTicket(id, updates);
        alert('Change aggiornato');
        window.location.href = 'tech.html';
    });
}

// ==================== LOGOUT LINK ====================
function setupLogout() {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); });
}

// ==================== INIZIALIZZAZIONE ====================
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    initThemeToggle();
    setupLogout();

    // Inizializza ticket di esempio (solo se non presenti)
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