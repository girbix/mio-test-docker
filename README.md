# Prototipo NOC basato su ServiceNow - Tesi ITS

Questo progetto implementa un prototipo funzionale di Network Operations Center (NOC) con interfacce cliente e tecnico, ispirato a ServiceNow. Include:

- Login con RBAC (ISO 27001) e multi-tenancy per 4 aziende.
- Theme switcher (chiaro/scuro) con salvataggio preferenza.
- Dashboard cliente con monitoraggio ticket e creazione incident (form fedele a screenshot).
- Dashboard NOC con contatori e tabella ticket attivi (Incident e Change).
- Dettaglio Incident con tutti i campi dell'immagine fornita.
- Dettaglio Change con tab Pianificazione, Note Interne, Chiusura e RCA obbligatoria per Grado 1.
- 12 tecnici distribuiti in 3 team (Network, Cloud, Cyber Security) con livelli L1, L2, L3 (4 per livello).
- Persistenza ticket in localStorage per simulazione database.

## Tecnologie utilizzate
- HTML5, CSS3 (variabili CSS per temi), JavaScript (ES6)
- Docker (nginx:alpine) e docker-compose
- GitHub Codespaces come ambiente di sviluppo

## Struttura dei file

.
├── index.html # Login
├── client.html # Dashboard cliente
├── tech.html # Dashboard NOC
├── incident-detail.html # Dettaglio incident
├── change-detail.html # Dettaglio change
├── style.css # Stili con tema dinamico
├── app.js # Logica applicativa
├── Dockerfile # Immagine nginx personalizzata
├── docker-compose.yml # Configurazione servizi
└── README.md # Questa documentazione
text


## Come avviare il progetto

### Prerequisiti
- Docker e docker-compose installati (o ambiente GitHub Codespaces).

### Passi
1. **Clonare il repository**:
   ```bash
   git clone https://github.com/tuo-utente/noc-servicenow.git
   cd noc-servicenow

    Se necessario, correggere l'autore del commit (es. dopo aver usato l'email di GitHub no-reply):
    bash

    git commit --amend --no-edit --reset-author
    git push --force

    Avviare con docker-compose:
    bash

    docker-compose up -d

    L'applicazione sarà disponibile su http://localhost:8080.

    Sviluppo live: I file HTML, CSS e JS sono montati come volumi; modificali e il browser li rifletterà dopo il refresh.

Utenti di test
Clienti (4 aziende)
Azienda	Email	Password	Nome referente
TechInnovate srl	client1@techinnovate.it	client	Mario Rossi
Global Logistics	client2@globallogistics.it	client	Laura Bianchi
FinanzaSicura S.A.	client3@finanzasicura.it	client	Giuseppe Verdi
EcoEnergy Group	client4@ecoenergy.it	client	Francesca Neri
Tecnico NOC
Email	Password	Ruolo
tecnico.noc@it.it	123	tech
Team e tecnici

Il sistema include 12 tecnici così distribuiti:
Livello	Network	Cloud	Cyber Security
L1	Mario Rossi, Luigi Bianchi	Giulia Verdi	Paolo Neri
L2	Anna Gialli	Marco Blu, Laura Viola	Stefano Arancio
L3	Chiara Rosa	Andrea Grigio	Elena Marrone, Davide Celeste
Funzionalità principali

    Theme switcher: In alto a destra su ogni pagina, cambia tra tema scuro (default) e chiaro. La scelta viene salvata in localStorage.

    Multi-tenancy: Ogni cliente vede solo le proprie sedi, servizi, CI e service offering nei campi di autocompletamento.

    Dashboard cliente: Mostra statistiche (aperti, in lavorazione, risolti) e una progress bar. La tabella elenca i ticket e cliccando si va al dettaglio.

    Creazione incident: Modale con tutti i campi dell'immagine, inclusi Requested by, Caller, Location, Service, ecc.

    Dashboard NOC: Contatori per ticket aperti, in progress e con SLA critico. Tabella interattiva con tutti i ticket.

    Dettaglio Incident: Pagina a due colonne con campi editabili (es. stato, priorità, assegnazione). Include campo Parent Incident con datalist.

    Dettaglio Change: Tabs per Pianificazione (giustificazione, piano, analisi rischio), Note Interne e Chiusura (RCA obbligatoria per grado 1).

    Persistenza: I ticket vengono salvati in localStorage e sono condivisi tra client e tecnico in tempo reale.