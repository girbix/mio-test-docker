# Prototipo NOC basato su ServiceNow - Tesi ITS

Questo progetto implementa un prototipo funzionale di Network Operations Center (NOC) con interfacce cliente e tecnico, ispirato a ServiceNow. Include:
- Login con RBAC (ISO 27001) e multi-tenancy (4 aziende).
- Theme switcher (chiaro/scuro) con salvataggio preferenza.
- Pagina cliente per la creazione di Incident con dati specifici del tenant (location, CI, servizi).
- Pagina tecnico con workspace a tab (Pianificazione, Note Interne, Chiusura con RCA obbligatoria per ticket Grado 1).
- Docker e docker-compose per ambienti di sviluppo riproducibili.

## Tecnologie utilizzate
- HTML5, CSS3 (variabili CSS per temi), JavaScript (ES6)
- Docker (nginx:alpine) e docker-compose
- GitHub Codespaces come ambiente di sviluppo

## Struttura dei file
.
├── index.html # Login
├── client.html # Creazione Incident (cliente)
├── tech.html # Workspace tecnico
├── style.css # Stili con tema dinamico
├── app.js # Logica applicativa
├── Dockerfile # Immagine nginx personalizzata
├── docker-compose.yml # Configurazione servizi
└── README.md # Questa documentazione


## Come avviare il progetto

### Prerequisiti
- Docker e docker-compose installati (o ambiente GitHub Codespaces).

### Passi
1. **Clonare il repository** (assicurati di aver configurato l'email GitHub per i commit):
   ```bash
   git clone https://github.com/tuo-utente/noc-servicenow.git
   cd noc-servicenow
2. **Se necessario, correggere l'autore del commit (es. dopo aver usato l'email di GitHub no-reply):**
   ```bash
    git commit --amend --no-edit --reset-author
    git push --force
3. **Avviare con docker-compose:**
    ```bash
    docker-compose up -d
    L'applicazione sarà disponibile su http://localhost:8080.
4. Sviluppo live: I file HTML, CSS e JS sono montati come volumi; modificali e il browser li rifletterà dopo il refresh.

Utenti di test
Ruolo	Email	Password	Azienda
Cliente	client1@techinnovate.it	client	TechInnovate srl
Cliente	client2@globallogistics.it	client	Global Logistics
Cliente	client3@finanzasicura.it	client	FinanzaSicura S.A.
Cliente	client4@ecoenergy.it	client	EcoEnergy Group
Tecnico	tecnico.noc@it.it	123	Team Network L2
Funzionalità principali

    Theme switcher: In alto a destra su ogni pagina, cambia tra tema scuro (default) e chiaro. La scelta viene salvata in localStorage.

    Multi-tenancy: Ogni cliente vede solo le proprie sedi, servizi, CI e service offering nei campi di autocompletamento.

    Validazione: Campi obbligatori contrassegnati con *. In tech.html, la RCA è obbligatoria solo per ticket di Grado 1.

    Simulazioni: I form non inviano dati a un backend ma mostrano un alert e stampano in console.

Note per la tesi

    Il codice è ampiamente commentato per illustrare le scelte implementative (RBAC, isolamento dati, gestione temi).

    La conformità ISO 27001 è simulata tramite separazione dei dati per tenant e controllo accessi basato sui ruoli.

    L'uso di Docker garantisce riproducibilità dell'ambiente di esecuzione.

Possibili miglioramenti futuri

    Integrazione con un backend reale (es. Node.js + database).

    Autenticazione più robusta (JWT, OAuth2).

    Test automatici con Cypress o Jest.

text


---

### **Conclusione**

Il progetto è completo e pronto per essere utilizzato in un contesto di tesi. Ogni file è stato progettato per essere modulare e ben commentato. Ricorda di verificare che i percorsi dei file nel `docker-compose.yml` corrispondano alla struttura effettiva. Buon lavoro!

