# Intesa Vincente Trainer

Trainer web per giocare a **Intesa Vincente** con un dizionario di parole, timer, punteggio, raddoppi e riepilogo della partita.

**Applicazione online:** [ilparola.github.io/intesa-vincente-trainer](https://ilparola.github.io/intesa-vincente-trainer/)

---

## Italiano

### Caratteristiche

- Partite a tempo con timer configurabile.
- Modalita predefinita **In sequenza**, con possibilita di usare anche l'ordine casuale.
- Progressione sequenziale salvata nel browser tramite `localStorage`.
- Indicazione nell'header dell'ultimo indice giocato.
- Archivio consultabile delle parole disponibili e dei relativi suggerimenti.
- Raddoppio con regole e punteggio dedicati.
- Storico della partita diviso tra parole corrette, errate e passate.
- Riepilogo finale stampabile.
- Gestione dell'ultima parola allo scadere del tempo direttamente dal riepilogo.

### Come si gioca

1. Premi **BUZZER / VIA** per rivelare una parola e avviare il timer.
2. Descrivi la parola senza pronunciarla direttamente.
3. Premi **BUZZER / PAUSA** per fermare temporaneamente il timer.
4. Assegna il risultato con **CORRETTO** o **ERRORE**, oppure usa **PASSO**.
5. Premi di nuovo il buzzer per passare alla parola successiva.
6. Quando il tempo termina, il riepilogo mostra anche l'ultima parola rimasta in gioco.

Se l'ultima parola non e stata ancora assegnata, dal riepilogo puoi scegliere:

- **Corretto**, per aggiungerla alle parole indovinate e assegnare i punti;
- **Errato**, per aggiungerla alle parole sbagliate e applicare la penalita;
- **Lascia non risposta**, per non inserirla nelle statistiche assegnate.

### Punteggio e raddoppio

- Una parola normale corretta vale `+1`.
- Una parola normale errata vale `-1`, senza scendere sotto zero.
- Il **RADDOPPIO** e disponibile con almeno 2 punti.
- Il raddoppio puo essere usato al massimo 2 volte per partita.
- Una parola di raddoppio corretta vale `+2`.
- Una parola di raddoppio errata vale `-2`, senza scendere sotto zero.
- Il raddoppio non modifica l'indice della sequenza delle parole normali.
- **PASSO** e disponibile per un massimo di 3 parole per partita.

### Modalita di gioco

#### In sequenza

Le parole vengono proposte seguendo l'ordine del dizionario. L'indice viene aggiornato a ogni nuovo buzzer e mostrato nell'header. Alla partita successiva la progressione riparte dal valore successivo.

Il progresso e salvato nel `localStorage` del browser. Questo significa che resta disponibile sullo stesso browser e dispositivo, ma non viene sincronizzato automaticamente tra computer diversi. Per continuare su un altro computer, usa il valore mostrato come **Ultimo indice** e inseriscilo nelle impostazioni come indice di partenza, oppure annota l'indice successivo desiderato.

#### Casuale

Le parole vengono estratte casualmente, evitando durante la partita quelle gia assegnate quando sono disponibili altre parole non utilizzate.

### Impostazioni e archivio

Dal pulsante **Impostazioni** puoi configurare:

- durata della partita, da 5 a 300 secondi;
- preset rapidi da 30, 45 o 60 secondi;
- ordine delle parole: casuale o sequenziale;
- indice di partenza quando usi la modalita sequenziale.

Dal pulsante **Archivio** puoi consultare il dizionario, filtrare le parole e aprire i suggerimenti disponibili. Le parole composte usate per i raddoppi sono riconoscibili separatamente.

### Scorciatoie da tastiera

| Tasto | Azione |
| --- | --- |
| `Spazio` / `Invio` | Buzzer / avvio o pausa |
| `Freccia su` / `P` | Passo |
| `Freccia destra` / `D` | Corretto |
| `Freccia sinistra` / `S` | Errore |
| `R` | Reset della partita |

### Avvio in locale

Requisiti:

- Node.js e npm;
- un browser moderno.

Installa le dipendenze:

```bash
npm install
```

Avvia il server di sviluppo:

```bash
npm start
```

L'app sara disponibile normalmente su [http://localhost:3000](http://localhost:3000).

Per creare una build di produzione:

```bash
npm run build
```

Per eseguire i test configurati:

```bash
npm test -- --watchAll=false --passWithNoTests
```

### Deploy su GitHub Pages

Il repository pubblico e `intesa-vincente-trainer` e il sito e configurato come project site:

```text
https://ilparola.github.io/intesa-vincente-trainer/
```

Il comando di pubblicazione crea la build e la invia al branch `gh-pages`:

```bash
npm run deploy
```

La proprieta `homepage` in `package.json` deve rimanere coerente con il percorso del project site. Nelle impostazioni GitHub Pages il repository deve usare il branch `gh-pages` e la cartella `/ (root)`.

### Struttura principale

```text
src/
	App.js                 Layout principale e stato globale della partita
	components/
		timer.js             Timer, controlli, parole e punteggio
		settings.js          Impostazioni della partita
		dictionary.js        Archivio delle parole
		summaryModal.js      Riepilogo finale e stampa
		hintModal.js         Modal dei suggerimenti
	data/
		capturedWords.js     Dizionario principale
		raddoppi.js          Parole composte per i raddoppi
		wordHints.js         Suggerimenti delle parole
	lib/
		dataProvider.js      Accesso ai dati statici
		sequenceProgress.js  Lettura e salvataggio dell'indice sequenziale
		soundManager.js      Audio e preferenza mute
```

I dati sono inclusi nella build come moduli JavaScript statici. Il CSV di origine viene usato per preparare i dati durante lo sviluppo e non viene interpretato direttamente dal browser.

---

## English

### Overview

**Intesa Vincente Trainer** is a browser-based trainer for the Italian word-association game. It provides a timed game, scoring, bonus rounds, hints, a word archive and a printable session summary.

**Live application:** [ilparola.github.io/intesa-vincente-trainer](https://ilparola.github.io/intesa-vincente-trainer/)

### Features

- Timed games with a configurable duration.
- **Sequential** mode enabled by default, with an optional random mode.
- Sequential progress saved in the browser through `localStorage`.
- The last played index displayed in the header.
- Searchable word archive with available hints.
- Bonus **Raddoppio** rounds with dedicated scoring rules.
- Separate history for correct, incorrect and passed words.
- Printable end-of-game summary.
- Final-word review and scoring directly from the summary modal.

### How to play

1. Press **BUZZER / VIA** to reveal a word and start the timer.
2. Describe the word without saying it directly.
3. Press **BUZZER / PAUSA** to pause the timer.
4. Mark the result with **CORRETTO** or **ERRORE**, or use **PASSO**.
5. Press the buzzer again to move to the next word.
6. When the timer reaches zero, the summary also displays the final active word.

If the final word has not been assigned yet, the summary lets you choose:

- **Corretto**, adding it to the correct words and awarding the points;
- **Errato**, adding it to the incorrect words and applying the penalty;
- **Lascia non risposta**, leaving it outside the assigned-word statistics.

### Scoring and bonus rounds

- A normal correct word scores `+1`.
- A normal incorrect word scores `-1`, with a minimum score of zero.
- **Raddoppio** is available when the score is at least 2.
- Raddoppio can be used no more than twice per game.
- A correct Raddoppio word scores `+2`.
- An incorrect Raddoppio word scores `-2`, with a minimum score of zero.
- Raddoppio words do not advance the normal sequential word index.
- **PASSO** is available for up to 3 words per game.

### Game modes

#### Sequential mode

Words are selected in dictionary order. The index advances on every new buzzer and is displayed in the header. The next game starts from the following index.

Progress is stored in the browser's `localStorage`. It is therefore available on the same browser and device, but it is not synchronized between computers. To continue on another computer, note the **Ultimo indice** value and enter the desired starting index in the settings.

#### Random mode

Words are selected randomly. When possible, the game avoids words that have already been assigned during the current session.

### Settings and archive

The **Settings** panel controls:

- game duration from 5 to 300 seconds;
- quick presets for 30, 45 and 60 seconds;
- word order: random or sequential;
- starting index for sequential games.

The **Archive** view lets you browse and filter the dictionary and open available hints. Compound words used for Raddoppio rounds are shown separately.

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` / `Enter` | Buzzer / start or pause |
| `Arrow Up` / `P` | Pass |
| `Arrow Right` / `D` | Correct |
| `Arrow Left` / `S` | Incorrect |
| `R` | Reset the game |

### Local development

Requirements:

- Node.js and npm;
- a modern browser.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The app is normally available at [http://localhost:3000](http://localhost:3000).

Create a production build:

```bash
npm run build
```

Run the configured tests:

```bash
npm test -- --watchAll=false --passWithNoTests
```

### GitHub Pages deployment

The repository is `intesa-vincente-trainer` and the application is deployed as a project site:

```text
https://ilparola.github.io/intesa-vincente-trainer/
```

The deployment command builds the app and publishes it to the `gh-pages` branch:

```bash
npm run deploy
```

The `homepage` property in `package.json` must match the project-site path. GitHub Pages should be configured to deploy from the `gh-pages` branch and the `/ (root)` folder.

### Main structure

```text
src/
	App.js                 Main layout and game state
	components/
		timer.js             Timer, controls, words and scoring
		settings.js          Game settings
		dictionary.js        Word archive
		summaryModal.js      End-of-game summary and printing
		hintModal.js         Hint dialog
	data/
		capturedWords.js     Main dictionary
		raddoppi.js          Compound bonus words
		wordHints.js         Word hints
	lib/
		dataProvider.js      Static data access
		sequenceProgress.js  Sequential index persistence
		soundManager.js      Audio and mute preference
```

The data is bundled as static JavaScript modules. The source CSV is used to prepare the data during development and is not parsed directly by the browser.
