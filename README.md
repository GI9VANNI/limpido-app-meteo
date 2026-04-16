# Limpido

## Panoramica del progetto
Limpido è un'applicazione meteo sviluppata in HTML5 e JavaScript con architettura MVC.
L'utente inserisce una città, l'app usa la geocodifica Open-Meteo per ottenere le coordinate e mostra meteo corrente + previsione a 7 giorni.

## Istruzioni di installazione
1. Clona o copia la cartella `limpido-app-meteo`.
2. Apri il progetto in VS Code (o terminale).
3. Installa le dipendenze:
   ```bash
   npm install
   ```

## Guida all'utilizzo
1. Avvia il server locale:
   ```bash
   npm run start
   ```
2. Apri `http://localhost:8080/public/index.html`.
3. Inserisci una città e clicca `Cerca`.
4. Visualizza meteo attuale, poi clicca le card dei giorni per il dettaglio della previsione.
5. Usa `Reset` per ripristinare la ricerca.

## Output di esempio
Esempio di output dati (semplificato) restituito dal service:
```json
{
  "city": "Roma",
  "countryCode": "IT",
  "current": {
    "temperature": 17.5,
    "weatherCode": 61,
    "windSpeed": 18
  },
  "daily": [
    {
      "date": "2026-04-16",
      "temperatureMin": 12.0,
      "temperatureMax": 20.0
    }
  ]
}
```

## Funzionalità
- Validazione input città lato HTML + Model.
- Geocoding Open-Meteo (città -> latitudine/longitudine).
- Forecast Open-Meteo (meteo corrente + previsione 7 giorni).
- Interfaccia migliorata con icone meteo e selezione giorno.
- Reset ricerca e stato iniziale rapido.
- Test automatici con Vitest.

## Gestione degli errori
- Input vuoto o non valido: blocco lato Model con messaggio chiaro.
- Città non trovata: messaggio di errore dedicato.
- Errori API (HTTP 4xx/5xx, timeout/network): intercettati e mostrati all'utente senza bloccare l'app.
- Risposta incompleta (es. previsioni giornaliere assenti): gestione esplicita con errore controllato.

## Informazioni API
L'app usa API pubbliche Open-Meteo:
- Geocoding API: ricerca città e coordinate.
- Forecast API: meteo corrente e variabili giornaliere.

Riferimenti:
- https://open-meteo.com/en/docs

## Struttura del progetto
- `public/`: pagina HTML principale.
- `src/controllers/`: coordinamento input utente e flusso applicativo.
- `src/models/`: validazione e logica dominio.
- `src/views/`: rendering UI e messaggi.
- `src/services/`: integrazione API Open-Meteo.
- `src/utils/`: formatter e helper.
- `tests/`: test unitari/integrativi con Vitest.

## Sicurezza ed etica
- Validazione input per ridurre dati non attesi.
- Gestione errori controllata, senza esporre stack trace all'utente.
- Nessun dato sensibile persistito lato client.
- Licenza del progetto: GNU GPLv3 (`LICENSE`).