// change-detail.js - Logica dettaglio change

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