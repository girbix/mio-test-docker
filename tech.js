// tech.js - Logica dashboard tecnico

function setupTechPage() {
    const user = requireAuth(['tech']);
    if (!user) return;

    document.getElementById('loggedUser').innerHTML = `<i class="fas fa-user-cog"></i> Tecnico: ${user.fullName} (${user.team} - ${user.level})`;

    const isDispatcher = (user.username === 'tecnico.noc@it.it');
    renderTechDashboard(isDispatcher ? null : user.team);
}

function renderTechDashboard(teamFilter = null) {
    let tickets = getTickets();
    if (teamFilter) {
        tickets = tickets.filter(t => t.assignedTeam === teamFilter);
    }

    const tbody = document.getElementById('ticketList');
    tbody.innerHTML = '';

    const open = tickets.filter(t => t.state === 'New').length;
    const inProgress = tickets.filter(t => t.state === 'In Progress').length;
    const critical = tickets.filter(t => t.priority && t.priority.includes('Critical')).length;

    document.getElementById('openTickets').textContent = open;
    document.getElementById('inProgressTickets').textContent = inProgress;
    document.getElementById('criticalSLA').textContent = critical;

    tickets.forEach(t => {
        const row = tbody.insertRow();
        row.insertCell().textContent = t.type === 'incident' ? 'Incident' : 'Change';
        row.insertCell().textContent = t.number;
        row.insertCell().textContent = t.shortDescription || '';
        row.insertCell().textContent = t.state;
        row.insertCell().textContent = t.priority || 'N/A';
        const displayTeam = t.assignedTeam || (t.type === 'incident' ? (t.suggestedTeam || 'Non assegnato') : 'N/A');
        row.insertCell().textContent = displayTeam;
        row.insertCell().textContent = t.assignedTo || '';
        row.insertCell().textContent = t.opened;
        row.addEventListener('click', () => {
            const page = t.type === 'incident' ? 'incident-detail.html' : 'change-detail.html';
            window.location.href = `${page}?id=${t.id}`;
        });
    });
}