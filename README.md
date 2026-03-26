README.md (aggiornato)
markdown

# NOC ServiceNow – Prototipo Tesi ITS

Questo progetto implementa un **Network Operations Center** basato su ServiceNow con:

- Multi-tenancy per 4 aziende.
- 12 tecnici con credenziali individuali divisi in team (Network, Cloud, Cyber Security) e livelli (L1, L2, L3).
- Dispatcher L1 (tecnico generico) con suggerimenti automatici per l'assegnazione dei ticket.
- Dashboard cliente con monitoraggio e creazione incident.
- Dashboard NOC con filtri per team e contatori SLA.
- Storico clienti e suggerimento team basato su parole chiave (AI).
- Tema scuro/chiaro persistente.

## Avvio rapido
git clone 
cd noc-servicenow
docker-compose up -d

Apri http://localhost:8080
Credenziali di test

    Clienti: client1@techinnovate.it / client (e altri 3)

    Tecnici: vedi lista nella pagina di login

    Dispatcher: tecnico.noc@it.it / 123

Struttura modulare JavaScript

    data.js – dati statici (aziende, utenti, tecnici, location, etc.)

    utils.js – funzioni di utilità (tema, autenticazione, storage, suggerimento team)

    client.js – logica pagina cliente

    tech.js – logica dashboard tecnico

    incident-detail.js – logica dettaglio incident

    change-detail.js – logica dettaglio change

    main.js – routing e inizializzazione

Docker

Il progetto utilizza nginx:alpine su porta 8080. I file sono montati come volumi per sviluppo live.
text


---

## ✅ **Riepilogo**

- **Rimosso** `app.js` (non più usato).
- **Aggiunti** i moduli JavaScript come descritto.
- **Aggiornati** tutti i file HTML per includere gli script corretti.
- **Aggiornato** `docker-compose.yml` per montare i nuovi file JS.
- **Mantenuti** i file CSS e Docker invariati.

Il progetto è ora ben organizzato, modulare e pronto per essere avviato con `docker-compose up -d`. Buon lavoro per la tesi!

