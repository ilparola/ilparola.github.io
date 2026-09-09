import { useState, useEffect, useCallback, useRef } from "react";
import SummaryModal from "./summaryModal";
import HintModal from "./hintModal";
import { playSound } from "../lib/soundManager";
import { getWordHint } from "../lib/dataProvider";
import { saveLastSequenceIndex } from "../lib/sequenceProgress";
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaPlus,
  FaMinus,
  FaChevronUp,
  FaKeyboard,
  FaLightbulb,
} from "react-icons/fa";

function Timer({
  words,
  startingTime,
  mode = "sequential",
  startIndex = 0,
  nextStartIndex = startIndex,
  raddoppiWords = [],
  onSequentialIndexChange,
  onSequentialGameEnd,
}) {
  const [time, setTime] = useState(startingTime);
  const [startTime, setStartTime] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [word, setWord] = useState("");
  const [score, setScore] = useState(0);
  const [guessedWords, setGuessedWords] = useState([]);
  const [passedWords, setPassedWords] = useState([]);
  const [errors, setErrors] = useState([]);
  const [endGame, setEndGame] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(null);
  const [isRaddoppioActive, setIsRaddoppioActive] = useState(false);
  const [usedRaddoppi, setUsedRaddoppi] = useState([]);

  const lastTickRef = useRef(10);
  const sequenceIndexRef = useRef(startIndex);
  const lastSequentialIndexRef = useRef(null);

  const cantPass = useCallback(() => {
    return !word || word === "" || passedWords.length === 3;
  }, [word, passedWords]);

  // Gestione dell'intervallo del timer
  useEffect(() => {
    let interval = null;
    if (!isPaused && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const nextTime =
            prevTime <= 0.1 ? 0 : parseFloat((prevTime - 0.1).toFixed(1));
          return nextTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPaused, time]);

  // Fine del gioco
  useEffect(() => {
    if (time === 0 && !endGame) {
      if (mode === "sequential" && lastSequentialIndexRef.current !== null) {
        saveLastSequenceIndex(lastSequentialIndexRef.current);
        onSequentialGameEnd?.(lastSequentialIndexRef.current);
      }
      setEndGame(true);
      setIsPaused(true);
      playSound("timeup");
      setIsModalOpen(true);
    }
  }, [time, endGame, mode, onSequentialGameEnd]);

  // Reset del timer all'aggiornamento del tempo di partenza
  useEffect(() => {
    setTime(startingTime);
    lastTickRef.current = 10;
  }, [startingTime]);

  useEffect(() => {
    sequenceIndexRef.current = startIndex;
    lastSequentialIndexRef.current = null;
    setIsPaused(true);
    setWord("");
    setWordIndex(null);
    setGuessedWords([]);
    setPassedWords([]);
    setErrors([]);
    setScore(0);
    setIsRaddoppioActive(false);
    setUsedRaddoppi([]);
    setEndGame(false);
    setIsModalOpen(false);
    setIsHintModalOpen(false);
  }, [words, mode, startIndex, startingTime]);

  // Effetto sonoro per i secondi finali (ultimi 10s)
  useEffect(() => {
    if (isPaused) return;
    const sec = Math.ceil(time);
    if (sec <= 10 && sec > 0 && sec !== lastTickRef.current) {
      playSound("tick");
      lastTickRef.current = sec;
    }
  }, [time, isPaused]);

  const finalWordStatus = word
    ? guessedWords.some((item) => item.word === word)
      ? "correct"
      : errors.some((item) => item.word === word)
        ? "error"
        : passedWords.some((item) => item.word === word)
          ? "passed"
          : "unanswered"
    : null;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFinalWordDecision = useCallback(
    (decision) => {
      if (!word || finalWordStatus !== "unanswered") return;

      if (decision === "unanswered") {
        setIsModalOpen(false);
        return;
      }

      const responseTime = startTime - time;
      if (decision === "correct") {
        playSound("correct");
        setScore((prevScore) => prevScore + (isRaddoppioActive ? 2 : 1));
        setGuessedWords((prev) => [...prev, { word, time: responseTime }]);
      } else if (decision === "error") {
        playSound("incorrect");
        setScore((prevScore) =>
          Math.max(0, prevScore - (isRaddoppioActive ? 2 : 1)),
        );
        setErrors((prev) => [...prev, { word, time: responseTime }]);
      }
    },
    [word, finalWordStatus, startTime, time, isRaddoppioActive],
  );

  const handleBuzz = useCallback(() => {
    if (endGame) return;

    playSound("buzzer");

    if (isPaused) {
      let selectedWord = "";
      let selectedIndex = null;
      if (words.length > 0 && mode === "sequential") {
        selectedIndex = sequenceIndexRef.current % words.length;
        selectedWord = words[selectedIndex];
        sequenceIndexRef.current = (selectedIndex + 1) % words.length;
        lastSequentialIndexRef.current = selectedIndex;
        saveLastSequenceIndex(selectedIndex);
        onSequentialIndexChange?.(selectedIndex);
      } else {
        const unusedWords = words.filter(
          (w) =>
            !guessedWords.some((g) => g.word === w) &&
            !errors.some((e) => e.word === w) &&
            !passedWords.some((p) => p.word === w),
        );
        const pool = unusedWords.length > 0 ? unusedWords : words;
        if (pool.length > 0) {
          selectedWord = pool[Math.floor(Math.random() * pool.length)];
          selectedIndex = words.indexOf(selectedWord);
        }
      }

      setWord(selectedWord);
      setWordIndex(selectedIndex);
      setIsRaddoppioActive(false);
      setStartTime(time);
      setIsPaused(false);
    } else {
      // Si mette in pausa per rispondere
      setIsPaused(true);
    }
  }, [
    isPaused,
    time,
    words,
    guessedWords,
    errors,
    passedWords,
    endGame,
    mode,
    onSequentialIndexChange,
  ]);

  const handleRaddoppio = useCallback(() => {
    if (
      endGame ||
      !isPaused ||
      score < 2 ||
      usedRaddoppi.length >= 2 ||
      raddoppiWords.length === 0
    ) {
      return;
    }

    const availableRaddoppi = raddoppiWords.filter(
      (raddoppio) => !usedRaddoppi.includes(raddoppio),
    );
    if (availableRaddoppi.length === 0) return;

    const selectedRaddoppio =
      availableRaddoppi[Math.floor(Math.random() * availableRaddoppi.length)];
    playSound("buzzer");
    setUsedRaddoppi((previous) => [...previous, selectedRaddoppio]);
    setWord(selectedRaddoppio);
    setWordIndex(null);
    setIsRaddoppioActive(true);
    setStartTime(time);
    setIsPaused(false);
  }, [endGame, isPaused, score, usedRaddoppi, raddoppiWords, time]);

  const handlePasso = useCallback(() => {
    if (endGame || cantPass()) return;

    playSound("passo");
    setIsPaused(true);

    if (
      guessedWords.some((g) => g.word === word) ||
      errors.some((e) => e.word === word) ||
      passedWords.some((p) => p.word === word)
    ) {
      return;
    }

    setPassedWords((prev) => [...prev, { word: word, time: startTime - time }]);
  }, [
    word,
    startTime,
    time,
    guessedWords,
    errors,
    passedWords,
    endGame,
    cantPass,
  ]);

  const handleAddScore = useCallback(() => {
    if (endGame || !isPaused || !word) return;

    if (
      guessedWords.some((g) => g.word === word) ||
      errors.some((e) => e.word === word) ||
      passedWords.some((p) => p.word === word)
    ) {
      return;
    }

    playSound("correct");
    setScore((prevScore) => prevScore + (isRaddoppioActive ? 2 : 1));
    setGuessedWords((prev) => [
      ...prev,
      { word: word, time: startTime - time },
    ]);
  }, [
    word,
    startTime,
    time,
    guessedWords,
    errors,
    passedWords,
    endGame,
    isPaused,
    isRaddoppioActive,
  ]);

  const handleSubtractScore = useCallback(() => {
    if (endGame || !isPaused || !word) return;

    if (
      guessedWords.some((g) => g.word === word) ||
      errors.some((e) => e.word === word) ||
      passedWords.some((p) => p.word === word)
    ) {
      return;
    }

    playSound("incorrect");
    setScore((prevScore) =>
      Math.max(0, prevScore - (isRaddoppioActive ? 2 : 1)),
    );
    setErrors((prev) => [...prev, { word: word, time: startTime - time }]);
  }, [
    word,
    startTime,
    time,
    guessedWords,
    errors,
    passedWords,
    endGame,
    isPaused,
    isRaddoppioActive,
  ]);

  const handleReset = useCallback(() => {
    playSound("intro");
    setIsPaused(true);
    setGuessedWords([]);
    setErrors([]);
    setPassedWords([]);
    setWord("");
    setWordIndex(null);
    setIsRaddoppioActive(false);
    setScore(0);
    setUsedRaddoppi([]);
    setTime(startingTime);
    setEndGame(false);
    sequenceIndexRef.current = nextStartIndex;
    lastTickRef.current = 10;
  }, [startingTime, nextStartIndex]);

  // Registrazione delle scorciatoie da tastiera
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      // Previene lo scrolling per tasti di gioco comuni
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          event.code,
        )
      ) {
        event.preventDefault();
      }

      if (event.code === "Space" || event.code === "Enter") {
        handleBuzz();
      } else if (
        key === "+" ||
        event.code === "ArrowRight" ||
        key.toLowerCase() === "d"
      ) {
        handleAddScore();
      } else if (
        key === "-" ||
        event.code === "ArrowLeft" ||
        key.toLowerCase() === "s"
      ) {
        handleSubtractScore();
      } else if (event.code === "ArrowUp" || key.toLowerCase() === "p") {
        handlePasso();
      } else if (key.toLowerCase() === "r") {
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleBuzz,
    handleRaddoppio,
    handleAddScore,
    handleSubtractScore,
    handlePasso,
    handleReset,
  ]);

  // Calcoli per il timer circolare
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    startingTime > 0
      ? circumference - (time / startingTime) * circumference
      : circumference;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Dashboard Row (Timer e Punteggio) */}
      <div className="dashboard-row">
        <div className="glass-panel dashboard-card animate-scale-in">
          <span className="card-label">Timer</span>
          <div className="timer-container">
            <svg className="timer-svg" viewBox="0 0 120 120">
              <circle className="timer-circle-bg" cx="60" cy="60" r={radius} />
              <circle
                className="timer-circle-progress"
                cx="60"
                cy="60"
                r={radius}
                stroke={
                  time <= 5
                    ? "var(--color-danger)"
                    : time <= 15
                      ? "var(--color-accent)"
                      : "var(--color-primary)"
                }
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                style={{
                  filter:
                    time <= 5
                      ? "drop-shadow(0 0 4px var(--color-danger))"
                      : "none",
                }}
              />
            </svg>
            <div
              className={`timer-text ${time <= 5 ? "warning animate-pulse" : ""}`}
            >
              {time.toFixed(1)}
            </div>
          </div>
        </div>

        <div
          className="glass-panel dashboard-card animate-scale-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="card-label">Punteggio</span>
          <div className="score-display">{score}</div>
        </div>
      </div>

      {/* Riquadro Parola Attiva */}
      <div
        className="glass-panel word-section animate-scale-in"
        style={{ animationDelay: "0.2s" }}
      >
        {word ? (
          <>
            <span
              className={`word-status-badge ${isPaused ? "in-pausa" : "in-corso"}`}
            >
              {isPaused
                ? "Tempo in Pausa - Conferma Risposta"
                : "Tempo in Corso - Descrivi la parola"}
            </span>
            <div className="word-display animate-fade-in">
              {word.toUpperCase()}
            </div>
            <div className="word-index">Indice: {wordIndex}</div>
            <button
              className="btn btn-primary hint-button"
              onClick={() => setIsHintModalOpen(true)}
              title="Mostra il suggerimento"
              aria-label={`Mostra il suggerimento per ${word}`}
            >
              <FaLightbulb /> SUGGERIMENTO
            </button>
          </>
        ) : (
          <div className="word-placeholder">
            Premi il pulsante <b>BUZZER</b> (o la barra <b>Spazio</b>) per
            iniziare il gioco e rivelare la prima parola.
          </div>
        )}
      </div>

      {/* Pannello Controlli */}
      <div
        className="glass-panel controls-panel animate-scale-in"
        style={{ animationDelay: "0.3s" }}
      >
        {/* Riga 1: Buzzer e Passo */}
        <div className="controls-row-primary">
          <button
            className="btn btn-buzzer"
            onClick={handleBuzz}
            disabled={endGame}
          >
            {isPaused ? (
              <FaPlay style={{ fontSize: "1.1rem" }} />
            ) : (
              <FaPause style={{ fontSize: "1.1rem" }} />
            )}
            {isPaused ? "BUZZER / VIA" : "BUZZER / PAUSA"}
          </button>

          <button
            className="btn btn-accent btn-raddoppio"
            onClick={handleRaddoppio}
            disabled={
              endGame || !isPaused || score < 2 || usedRaddoppi.length >= 2
            }
            title="Disponibile con almeno 2 punti, massimo 2 volte per partita"
          >
            RADDOPPIO
          </button>

          <button
            className="btn btn-dark btn-passo"
            onClick={handlePasso}
            disabled={endGame || cantPass()}
          >
            <FaChevronUp /> PASSO
          </button>
        </div>

        {/* Riga 2: Assegnazione Punti (+ e -) */}
        <div className="controls-row-score">
          <button
            className="btn btn-success btn-score-adjust"
            onClick={handleAddScore}
            disabled={endGame || !isPaused || !word}
            title="Assegna Punto (+1)"
          >
            <FaPlus /> CORRETTO
          </button>

          <button
            className="btn btn-danger btn-score-adjust"
            onClick={handleSubtractScore}
            disabled={endGame || !isPaused || !word}
            title="Penalità (-1)"
          >
            <FaMinus /> ERRORE
          </button>
        </div>

        {/* Riga 3: Reset */}
        <div className="controls-row-utils">
          <button className="btn btn-dark" onClick={handleReset}>
            <FaRedo /> Reset Partita
          </button>
        </div>

        {/* Scorciatoie Guida */}
        <div className="shortcuts-hint">
          <span>
            <FaKeyboard style={{ marginRight: "4px" }} /> Scorciatoie:
          </span>
          <span>
            <span className="shortcut-badge">Spazio / Invio</span> Buzzer
          </span>
          <span>
            <span className="shortcut-badge">↑ / P</span> Passo
          </span>
          <span>
            <span className="shortcut-badge">→ / D</span> Corretto
          </span>
          <span>
            <span className="shortcut-badge">← / S</span> Errore
          </span>
          <span>
            <span className="shortcut-badge">R</span> Reset
          </span>
        </div>
      </div>

      {/* Tabella Storico Parole Giocate */}
      <div
        className="glass-panel history-section animate-scale-in"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="history-header">
          <div className="history-title">Storico Parole della Partita</div>
          <div className="words-count-badge">{words.length} nel dizionario</div>
        </div>

        <div className="history-columns">
          {/* Colonna Corrette */}
          <div className="history-col">
            <div className="col-header correct">
              Indovinate <span>{guessedWords.length}</span>
            </div>
            <ul className="pill-list">
              {guessedWords.map((item, index) => (
                <li key={index} className="word-pill correct">
                  <span>{item.word.toUpperCase()}</span>
                  <span className="pill-time">{item.time.toFixed(1)}s</span>
                </li>
              ))}
              {guessedWords.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                    fontSize: "0.8rem",
                    padding: "1rem",
                    fontStyle: "italic",
                  }}
                >
                  Vuoto
                </div>
              )}
            </ul>
          </div>

          {/* Colonna Errate */}
          <div className="history-col">
            <div className="col-header errors">
              Sbagliate <span>{errors.length}</span>
            </div>
            <ul className="pill-list">
              {errors.map((item, index) => (
                <li key={index} className="word-pill errors">
                  <span>{item.word.toUpperCase()}</span>
                  <span className="pill-time">{item.time.toFixed(1)}s</span>
                </li>
              ))}
              {errors.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                    fontSize: "0.8rem",
                    padding: "1rem",
                    fontStyle: "italic",
                  }}
                >
                  Vuoto
                </div>
              )}
            </ul>
          </div>

          {/* Colonna Passate */}
          <div className="history-col">
            <div className="col-header passed">
              Passate <span>{passedWords.length} / 3</span>
            </div>
            <ul className="pill-list">
              {passedWords.map((item, index) => (
                <li key={index} className="word-pill passed">
                  <span>{item.word.toUpperCase()}</span>
                  <span className="pill-time">{item.time.toFixed(1)}s</span>
                </li>
              ))}
              {passedWords.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                    fontSize: "0.8rem",
                    padding: "1rem",
                    fontStyle: "italic",
                  }}
                >
                  Vuoto
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal di fine sessione */}
      <SummaryModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        score={score}
        guessedWords={guessedWords}
        errorWords={errors}
        passedWords={passedWords}
        finalWord={word}
        finalWordStatus={finalWordStatus}
        onFinalWordDecision={handleFinalWordDecision}
      />

      <HintModal
        isOpen={isHintModalOpen}
        word={word}
        hint={getWordHint(word)}
        onClose={() => setIsHintModalOpen(false)}
      />
    </div>
  );
}

export default Timer;
