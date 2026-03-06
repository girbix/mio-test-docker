// Database Unificato (ISO 27001 - Segregazione Dati)
const db = {
    users: {
        "giovanni.culotta@noc.it": { pwd: "123", role: "client", clientId: "CLI-001", name: "G. Culotta (Global Logistics)" },
        "mario.rossi@tech.it": { pwd: "123", role: "client", clientId: "CLI-002", name: "M. Rossi (TechInnovate)" },
        "tecnico.noc@it.it": { pwd: "123", role: "tech", team: "Network_L2", name: "Admin NOC" }
    },
    clientData: {
        "CLI-001": {
            locations: ["Bra - Magazzino A", "Torino - HQ"],
            services: ["Network LAN", "VoIP"],
            cis: ["SW-WH-04", "AP-C2-CABINE"],
            contract: "SLA-GOLD-2026"
        },
        "CLI-002": {
            locations: ["Milano - Sede 1", "Verona - Logistic"],
            services: ["Cloud Storage", "Security"],
            cis: ["SVR-PROD-01", "FW-MI-02"],
            contract: "SLA-PREMIUM"
        }
    }
};

// --- Gestione Login ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const user = db.users[email];

        if (user && user.pwd === pass) {
            sessionStorage.setItem('session', JSON.stringify(user));
            window.location.href = (user.role === 'client') ? 'client.html' : 'tech.html';
        } else {
            alert("Credenziali errate!");
        }
    };
}

// --- Gestione Dashboard Cliente ---
function initClient() {
    const session = JSON.parse(sessionStorage.getItem('session'));
    if (!session) window.location.href = 'login.html';
    
    document.getElementById('userName').innerText = session.name;
    const data = db.clientData[session.clientId];

    const fill = (id, items) => {
        document.getElementById(id).innerHTML = items.map(i => `<option value="${i}">`).join('');
    };

    fill('locationsList', data.locations);
    fill('servicesList', data.services);
    fill('ciList', data.cis);
    document.getElementById('contract').value = data.contract;
}

// --- Gestione Tabs Tecnico ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}