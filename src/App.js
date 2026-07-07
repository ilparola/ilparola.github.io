import "./App.css";
import { useState, useEffect } from "react";
import Timer from "./components/timer";
import Settings from "./components/settings";
import Dictionary from "./components/dictionary";
import { getGeneratedWords, getCapturedWords, getRaddoppi } from "./lib/dataProvider";
import { getMuted, setMuted, playSound } from "./lib/soundManager";
import { FaVolumeUp, FaVolumeMute, FaCog, FaBook } from "react-icons/fa";

function App() {
  const [time, setTime] = useState(60);
  const [words, setWords] = useState([]);
  const [muted, setMutedState] = useState(getMuted());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [view, setView] = useState("game"); // 'game' o 'dictionary'
  const [dictionaryOption, setDictionaryOption] = useState("all");
  const [removeDuplicate, setRemoveDuplicate] = useState(false);

  // Inizializza le parole al primo caricamento
  useEffect(() => {
    const defaultWords = getGeneratedWords(false).concat(getCapturedWords(false));
    setWords(defaultWords);
    const timer = setTimeout(() => {
      playSound("intro");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  function applySettings({ number, option, isDuplicate }) {
    const finalTime = number > 0 ? Number(number) : 60;
    setTime(finalTime);
    setDictionaryOption(option);
    setRemoveDuplicate(isDuplicate);

    let loadedWords = [];
    if (option === "raddoppi") {
      loadedWords = getRaddoppi();
    } else if (option === "all") {
      loadedWords = getGeneratedWords(isDuplicate).concat(getCapturedWords(isDuplicate));
    } else if (option === "generated") {
      loadedWords = getGeneratedWords(isDuplicate);
    } else if (option === "captured") {
      loadedWords = getCapturedWords(isDuplicate);
    }
    setWords(loadedWords);
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

  return (
    <div className="App">
      <header className="app-header animate-slide-down">
        <div className="app-title-group">
          <div className="app-logo-badge"></div>
          <h1 className="app-title" style={{ cursor: "pointer" }} onClick={() => setView("game")}>
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
          
          {view === "game" && (
            <button 
              className={`btn btn-dark btn-icon-only ${isSettingsOpen ? 'btn-primary' : ''}`}
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
            {muted ? <FaVolumeMute size={18} style={{color: 'var(--color-danger)'}} /> : <FaVolumeUp size={18} />}
          </button>
        </div>
      </header>

      {view === "game" ? (
        <>
          <Settings 
            isOpen={isSettingsOpen} 
            onApply={applySettings} 
            defaultTime={time} 
            currentOption={dictionaryOption}
            currentRemoveDuplicate={removeDuplicate}
          />
          
          <Timer 
            startingTime={time} 
            words={words} 
            isMuted={muted} 
          />
        </>
      ) : (
        <Dictionary onClose={() => setView("game")} />
      )}
    </div>
  );
}

export default App;
