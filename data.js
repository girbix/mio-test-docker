// data.js - Dati statici per il prototipo NOC

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

// Team e tecnici (12 totali)
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

// Utente tecnico generico (dispatcher)
const genericTechUser = {
    username: 'tecnico.noc@it.it',
    password: '123',
    role: 'tech',
    fullName: 'Dispatcher L1 (Generico)',
    team: 'N/A',
    level: 'L1'
};

// Costruzione array utenti completo
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

// Parole chiave per suggerimento team (AI)
const teamKeywords = {
    'Network': ['router', 'switch', 'firewall', 'connession', 'ping', 'vlan', 'rete', 'wifi', 'lan', 'cablaggio', 'interfaccia', 'banda', 'latenza', 'routing', 'gateway'],
    'Cloud': ['aws', 'azure', 'cloud', 'vm', 'virtual machine', 'storage', 's3', 'ec2', 'istanza', 'backup', 'vpc', 'load balancer', 'autoscaling'],
    'Cyber Security': ['virus', 'malware', 'phishing', 'ransomware', 'spoof', 'attack', 'intrusione', 'hack', 'vulnerabilità', 'antivirus', 'ids', 'ips', 'soc', 'security', 'breach']
};