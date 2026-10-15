# 💰 Budget Manager

Un'applicazione web leggera e intuitiva (Single Page Application) realizzata in HTML, CSS e JavaScript Vanilla per il tracciamento delle finanze personali, la gestione delle entrate/uscite e la visualizzazione dei bilanci mensili.

---

## ✨ Caratteristiche Principali

* **Registrazione Entrate e Uscite:** Inserimento rapido di importo e motivazione tramite un'interfaccia minimale. Include uno *switch* visivo che distingue cromaticamente le **entrate** (verde, `#27ae60`) dalle **uscite** (rosso, `#c0392b`, impostato di default).
* **Ultime 10 Transazioni:** Caricamento automatico all'avvio delle 10 operazioni più recenti in formato tabellare.
* **Storico Completo:** Possibilità di espandere la vista per consultare tutte le transazioni registrate tramite il pulsante **Get all**.
* **Eliminazione Voci:** Rimozione immediata di singole transazioni direttamente dalla tabella.
* **Riepilogo Mensile:** Aggregazione dei dati per mese (**Get All By Month**) con calcolo di entrate totali, uscite totali ed eventuale guadagno netto.
* **Ambiente Dinamico:** Selezione automatica dell'endpoint API tra ambiente di sviluppo locale (`localhost`) e ambiente di produzione (`onrender.com`).

---

## 🛠️ Tecnologie Utilizzate

* **HTML5:** Struttura semantica del form e delle tabelle dati.
* **CSS3:** Layout basato su Flexbox, input personalizzati e toggle switch animato per la selezione entrata/uscita.
* **JavaScript (ES6+):** Logica client-side asincrona (`async/await`, `Fetch API`) e manipolazione dinamica del DOM tramite *template literals*.

---

## 📁 Struttura del Progetto

Per il corretto funzionamento di tutte le risorse grafiche, assicurati che la directory del progetto rispetti la seguente struttura:

```text
├── index.html          # File principale dell'applicazione
├── favicon.ico         # Icona del sito
└── icons/
    └── delete.svg      # Icona per il pulsante di eliminazione nella tabella
