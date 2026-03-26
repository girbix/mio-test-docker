// incident-detail.js - Logica dettaglio incident

function setupIncidentDetail() {
    const user = requireAuth(['tech']);
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

    // Popola campi base
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

    // Parent incident list
    const parentList = document.getElementById('parent-list');
    if (parentList) {
        parentList.innerHTML = '';
        const otherIncidents = tickets.filter(t => t.type === 'incident' && t.id !== id);
        otherIncidents.forEach(inc => {
            const opt = document.createElement('option');
            opt.value = inc.number;
            parentList.appendChild(opt);
        });
    }
    document.getElementById('parentIncident').value = ticket.parentIncident || '';

    // Assignment group e assigned to
    const groupSelect = document.getElementById('assignmentGroup');
    const assignedSelect = document.getElementById('assignedTo');
    const teamsList = [...new Set(technicians.map(t => t.team))];
    groupSelect.innerHTML = '<option value="">Seleziona team</option>';
    teamsList.forEach(team => {
        const opt = document.createElement('option');
        opt.value = team;
        opt.textContent = team;
        groupSelect.appendChild(opt);
    });
    groupSelect.value = ticket.assignmentGroup || '';
    groupSelect.addEventListener('change', () => {
        const team = groupSelect.value;
        assignedSelect.innerHTML = '<option value="">Seleziona tecnico</option>';
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

    // Suggerimento team AI
    const suggested = ticket.suggestedTeam || suggestTeam(ticket.shortDescription, ticket.description);
    document.getElementById('suggestedTeam').value = suggested;
    document.getElementById('assignedTeam').value = ticket.assignedTeam || '';

    // Storico cliente
    const clientHistory = document.getElementById('clientHistory');
    if (clientHistory) {
        clientHistory.innerHTML = '';
        const clientTickets = tickets.filter(t => t.type === 'incident' && t.companyId === ticket.companyId && t.id !== id);
        clientTickets.slice(0, 5).forEach(t => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-ticket-alt"></i> ${t.number} - ${t.shortDescription} (${t.state})`;
            li.addEventListener('click', () => {
                window.location.href = `incident-detail.html?id=${t.id}`;
            });
            clientHistory.appendChild(li);
        });
        if (clientTickets.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = '<i class="fas fa-info-circle"></i> Nessun ticket precedente';
            clientHistory.appendChild(li);
        }
    }

    // Aggiornamento
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
            description: document.getElementById('description').value,
            assignedTeam: document.getElementById('assignedTeam').value
        };
        updateTicket(id, updates);
        alert('Ticket aggiornato');
        window.location.href = 'tech.html';
    });
}