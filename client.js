// client.js - Logica pagina cliente

function setupClientPage() {
    const user = requireAuth(['client']);
    if (!user) return;

    document.getElementById('loggedUser').innerHTML = `<i class="fas fa-building"></i> Cliente: ${companies[user.companyId].name} (${user.fullName})`;

    const companyData = getCurrentCompanyData();
    if (companyData) {
        populateDatalist('location-list', companyData.locations);
        populateDatalist('ci-list', companyData.cis);
        populateDatalist('service-list', companyData.services);
        populateDatalist('offering-list', companyData.serviceOfferings);
    }

    document.getElementById('requestedBy').value = user.username;
    renderClientTickets();

    const modal = document.getElementById('incidentModal');
    const btn = document.getElementById('newIncidentBtn');
    const span = document.querySelector('.close');

    btn.onclick = () => modal.style.display = 'block';
    span.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

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