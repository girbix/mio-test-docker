// app.js - Gestione tema, autenticazione RBAC, multi-tenancy e interazioni

// ==================== CONFIGURAZIONE TEMA (localStorage) ====================

// Applica il tema salvato o default (dark)
function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.className = savedTheme; // 'dark-mode' o 'light-mode'
}

// Salva e applica il tema opposto
function toggleTheme() {
    const isDark = document.body.classList.contains('dark-mode');
    const newTheme = isDark ? 'light-mode' : 'dark-mode';
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

// Inizializza il pulsante theme toggle su tutte le pagine
function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
}

// ==================== DATI FAKE MULTI-TENANCY (ISO 27001 compliant) ====================

const companies = {
    1: { id: 1, name: 'TechInnovate srl' },
    2: { id: 2, name: 'Global Logistics' },
    3: { id: 3, name: 'FinanzaSicura S.A.' },
    4: { id: 4, name: 'EcoEnergy Group' }
};

// Utenti (password in chiaro solo per demo)
const users = [
    { username: 'client1@techinnovate.it', password: 'client', role: 'client', companyId: 1 },
    { username: 'client2@globallogistics.it', password: 'client', role: 'client', companyId: 2 },
    { username: 'client3@finanzasicura.it', password: 'client', role: 'client', companyId: 3 },
    { username: 'client4@ecoenergy.it', password: 'client', role: 'client', companyId: 4 },
    { username: 'tecnico.noc@it.it', password: '123', role: 'tech', companyId: null, team: 'Network L2' }
];

// Location per azienda
const locations = {
    1: ['Torino', 'Milano'],
    2: ['Bra', 'Novara'],
    3: ['Torino Centro'],
    4: ['Moncalieri']
};

// Configuration Items
const cis = {
    1: ['SVR-PROD-01', 'FW-TOR-01'],
    2: ['SW-WH-04', 'ROUTER-GW-01'],
    3: ['VPN-TUNNEL', 'NAS-BACKUP'],
    4: ['VDI-USER-88', 'UPS-APC-05']
};

// Servizi
const services = {
    1: ['Cloud', 'Cyber Security'],
    2: ['Network', 'VoIP'],
    3: ['VPN', 'Storage'],
    4: ['Monitoring', 'VDI']
};

// Service Offering (associati ai servizi)
const serviceOfferings = {
    1: ['IaaS', 'Firewall Management', 'Endpoint Protection'],
    2: ['SD-WAN', 'IP Telephony', 'Call Manager'],
    3: ['Site-to-Site VPN', 'Remote Access VPN', 'SAN Storage'],
    4: ['Infrastructure Monitoring', 'Desktop Virtualization', 'Application Performance']
};

// ==================== AUTENTICAZIONE E SESSIONE ====================

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

function requireAuth(allowedRoles = ['client', 'tech']) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    if (!allowedRoles.includes(user.role)) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// ==================== FUNZIONI MULTI-TENANCY ====================

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

// Popola le datalist in client.html con i dati del tenant
function populateClientDatalists() {
    const companyData = getCurrentCompanyData();
    if (!companyData) return;

    // Location
    const locationList = document.getElementById('location-list');
    if (locationList) {
        locationList.innerHTML = '';
        companyData.locations.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc;
            locationList.appendChild(option);
        });
    }

    // CI
    const ciList = document.getElementById('ci-list');
    if (ciList) {
        ciList.innerHTML = '';
        companyData.cis.forEach(ci => {
            const option = document.createElement('option');
            option.value = ci;
            ciList.appendChild(option);
        });
    }

    // Service
    const serviceList = document.getElementById('service-list');
    if (serviceList) {
        serviceList.innerHTML = '';
        companyData.services.forEach(svc => {
            const option = document.createElement('option');
            option.value = svc;
            serviceList.appendChild(option);
        });
    }

    // Service Offering
    const offeringList = document.getElementById('offering-list');
    if (offeringList) {
        offeringList.innerHTML = '';
        companyData.serviceOfferings.forEach(off => {
            const option = document.createElement('option');
            option.value = off;
            offeringList.appendChild(option);
        });
    }

    // Preimposta "Requested by" con l'email del cliente
    const requestedByField = document.getElementById('requestedBy');
    if (requestedByField) {
        const user = getCurrentUser();
        requestedByField.value = user.username;
    }
}

// ==================== GESTIONE EVENTI ====================

// Login
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorEl = document.getElementById('loginError');

        const user = authenticate(username, password);
        if (user) {
            saveUserSession(user);
            if (user.role === 'client') {
                window.location.href = 'client.html';
            } else if (user.role === 'tech') {
                window.location.href = 'tech.html';
            }
        } else {
            errorEl.textContent = 'Credenziali non valide. Riprova.';
        }
    });
}

// Pagina cliente
function setupClientPage() {
    const user = requireAuth(['client']);
    if (!user) return;

    // Mostra info utente
    const loggedUserSpan = document.getElementById('loggedUser');
    if (loggedUserSpan) {
        loggedUserSpan.textContent = `Cliente: ${companies[user.companyId].name}`;
    }

    populateClientDatalists();

    // Submit incident (simulazione)
    const incidentForm = document.getElementById('incidentForm');
    if (incidentForm) {
        incidentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Incident creato (simulazione). Dati in console.');
            console.log('Nuovo Incident:', {
                requestedBy: document.getElementById('requestedBy').value,
                service: document.getElementById('service').value,
                shortDescription: document.getElementById('shortDescription').value,
                location: document.getElementById('location').value,
                serviceOffering: document.getElementById('serviceOffering').value,
                ci: document.getElementById('ci').value,
                urgency: document.getElementById('urgency').value,
                impact: document.getElementById('impact').value,
                contract: document.getElementById('contract').value
            });
        });
    }
}

// Pagina tecnico
function setupTechPage() {
    const user = requireAuth(['tech']);
    if (!user) return;

    // Mostra info utente
    const loggedUserSpan = document.getElementById('loggedUser');
    if (loggedUserSpan) {
        loggedUserSpan.textContent = `Tecnico: ${user.username} (${user.team})`;
    }

    // Gestione tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // RCA obbligatoria per Grado 1
    const ticketGrade = document.getElementById('ticketGrade');
    const rcaField = document.getElementById('rca');
    if (ticketGrade && rcaField) {
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
    }

    // Chiusura ticket
    const closureForm = document.querySelector('#closure form');
    if (closureForm) {
        closureForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Ticket chiuso (simulazione). Dati in console.');
            console.log('Chiusura ticket:', {
                grado: document.getElementById('ticketGrade').value,
                rca: document.getElementById('rca').value
            });
        });
    }

    // Salva note interne (pulsante aggiunto)
    const notesTab = document.querySelector('#notes');
    if (notesTab) {
        const textarea = notesTab.querySelector('textarea');
        const saveNotesBtn = document.createElement('button');
        saveNotesBtn.textContent = 'Salva Note';
        saveNotesBtn.classList.add('btn-primary');
        saveNotesBtn.style.marginTop = '1rem';
        saveNotesBtn.addEventListener('click', () => {
            alert('Note salvate (simulazione)');
            console.log('Work Notes:', textarea.value);
        });
        notesTab.appendChild(saveNotesBtn);
    }
}

// Logout link
function setupLogout() {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// ==================== INIZIALIZZAZIONE GLOBALE ====================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Applica tema salvato
    applyTheme();

    // 2. Inizializza theme toggle su tutte le pagine
    initThemeToggle();

    // 3. Logout link (se presente)
    setupLogout();

    // 4. Routing in base alla pagina
    const path = window.location.pathname.split('/').pop() || 'index.html';

    if (path === 'index.html') {
        setupLogin();
    } else if (path === 'client.html') {
        setupClientPage();
    } else if (path === 'tech.html') {
        setupTechPage();
    }
});