import "./App.css";
import { useState, useEffect, useCallback } from "react";
import Timer from "./components/timer";
import Settings from "./components/settings";
import Dictionary from "./components/dictionary";
import { getCapturedWords, getRaddoppi } from "./lib/dataProvider";
import { getLastSequenceIndex } from "./lib/sequenceProgress";
import { getMuted, setMuted, playSound } from "./lib/soundManager";
import { FaVolumeUp, FaVolumeMute, FaCog, FaBook } from "react-icons/fa";

function App() {
  const [time, setTime] = useState(60);
  const [words, setWords] = useState([]);
  const [muted, setMutedState] = useState(getMuted());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [view, setView] = useState("game"); // 'game' o 'dictionary'
  const [gameMode, setGameMode] = useState("random");
  const [lastSequenceIndex, setLastSequenceIndex] = useState(getLastSequenceIndex());
  const [startIndex, setStartIndex] = useState(() => {
    const lastIndex = getLastSequenceIndex();
    const wordCount = getCapturedWords().length;
    return lastIndex === null || wordCount === 0
      ? 0
      : (lastIndex + 1) % wordCount;
  });
  const [nextStartIndex, setNextStartIndex] = useState(() => {
    const lastIndex = getLastSequenceIndex();
    const wordCount = getCapturedWords().length;
    return lastIndex === null || wordCount === 0
      ? 0
      : (lastIndex + 1) % wordCount;
  });

  // Inizializza le parole al primo caricamento
  useEffect(() => {
    setWords(getCapturedWords());
    const timer = setTimeout(() => {
      playSound("intro");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  function applySettings({ number, mode, startIndex: nextStartIndex }) {
    const finalTime = number > 0 ? Number(number) : 60;
    const finalStartIndex = Math.max(0, Number(nextStartIndex) || 0);
    setTime(finalTime);
    setGameMode(mode);
    setStartIndex(finalStartIndex);
    setNextStartIndex(finalStartIndex);

    setWords(getCapturedWords());
    setIsSettingsOpen(false);
    playSound("correct");
  }

  const toggleMute = () => {
    const nextMute = !muted;
    setMuted(nextMute);
    setMutedState(nextMute);
    if (!nextMute) {
      // Breve bip per confermare l'audio riattivato
      setTimeout(() => playSound("buzzer"), 50);
    }
  };

  const handleToggleView = () => {
    const nextView = view === "game" ? "dictionary" : "game";
    setView(nextView);
    playSound("passo");
  };

  const handleSequentialGameEnd = useCallback((completedIndex) => {
    setLastSequenceIndex(completedIndex);
    setNextStartIndex((completedIndex + 1) % words.length);
  }, [words.length]);

  return (
    <div className="App">
      <header className="app-header animate-slide-down">
        <div className="app-title-group">
          <div className="app-logo-badge"></div>
          <h1
            className="app-title"
            style={{ cursor: "pointer" }}
            onClick={() => setView("game")}
          >
            Intesa Vincente
          </h1>
        </div>
        <div className="app-header-controls">
          <button
            className={`btn btn-dark btn-icon-only ${view === "dictionary" ? "btn-primary" : ""}`}
            onClick={handleToggleView}
            title={view === "game" ? "Vedi Archivio Parole" : "Torna al Gioco"}
          >
            <FaBook size={18} />
          </button>

          <span
            className="sequence-progress"
            title="Ultimo indice sequenziale della partita conclusa"
          >
            Ultimo indice: {lastSequenceIndex === null ? "-" : lastSequenceIndex}
          </span>

          {view === "game" && (
            <button
              className={`btn btn-dark btn-icon-only ${isSettingsOpen ? "btn-primary" : ""}`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title="Impostazioni"
            >
              <FaCog size={18} />
            </button>
          )}

          <button
            className="btn btn-dark btn-icon-only"
            onClick={toggleMute}
            title={muted ? "Riattiva Audio" : "Disattiva Audio"}
          >
            {muted ? (
              <FaVolumeMute
                size={18}
                style={{ color: "var(--color-danger)" }}
              />
            ) : (
              <FaVolumeUp size={18} />
            )}
          </button>
        </div>
      </header>

      {view === "game" ? (
        <>
          <Settings
            isOpen={isSettingsOpen}
            onApply={applySettings}
            defaultTime={time}
            currentMode={gameMode}
            currentStartIndex={nextStartIndex}
            wordCount={words.length}
          />

          <Timer
            startingTime={time}
            words={words}
            isMuted={muted}
            mode={gameMode}
            startIndex={startIndex}
            nextStartIndex={nextStartIndex}
            raddoppiWords={getRaddoppi()}
            onSequentialGameEnd={handleSequentialGameEnd}
          />
        </>
      ) : (
        <Dictionary onClose={() => setView("game")} />
      )}
    </div>
  );
}

export default App;
