import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { FaTrophy, FaPercentage, FaStopwatch, FaPrint, FaTimes, FaCheck, FaBan, FaArrowRight } from "react-icons/fa";

const SummaryModal = ({
  isOpen,
  handleClose,
  score,
  guessedWords = [],
  errorWords = [],
  passedWords = [],
  finalWord = "",
  finalWordStatus = null,
}) => {
  const componentRef = useRef();
  
  const date = new Date();
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();
  let hour = String(date.getHours()).padStart(2, '0');
  let minutes = String(date.getMinutes()).padStart(2, '0');
  let today = `${day}/${month}/${year} ${hour}:${minutes}`;

  // Statistiche
  const totalWords = guessedWords.length + errorWords.length + passedWords.length;
  const accuracy = totalWords > 0 ? ((guessedWords.length / totalWords) * 100).toFixed(0) : 0;
  
  const sumTime = (arr) => arr.reduce((acc, curr) => acc + (curr.time || 0), 0);
  const totalTimeSpent = sumTime(guessedWords) + sumTime(errorWords) + sumTime(passedWords);
  const avgTime = totalWords > 0 ? (totalTimeSpent / totalWords).toFixed(1) : "0.0";
  const avgCorrectTime = guessedWords.length > 0 ? (sumTime(guessedWords) / guessedWords.length).toFixed(1) : "0.0";

  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-card" ref={componentRef}>
        <header className="modal-card-head">
          <p className="modal-card-title">Resoconto Sessione</p>
          <button
            className="modal-close-btn"
            aria-label="close"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
        </header>
        
        <section className="modal-card-body">
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Sessione del {today}</span>
          </div>

          {/* Stats Dashboard */}
          <div className="modal-stats-grid">
            <div className="stat-box">
              <div className="stat-box-label"><FaTrophy style={{color: "var(--color-accent)", marginRight: "4px"}} /> Punti</div>
              <div className="stat-box-val score">{score}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label"><FaPercentage style={{color: "var(--color-success)", marginRight: "4px"}} /> Precisione</div>
              <div className="stat-box-val accuracy">{accuracy}%</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label"><FaStopwatch style={{color: "var(--color-primary)", marginRight: "4px"}} /> Tempo Medio</div>
              <div className="stat-box-val speed">{avgCorrectTime}s</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem", fontSize: "0.85rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
            <div>Parole Totali Giocate: <b>{totalWords}</b></div>
            <div>Tempo Totale Risposta: <b>{totalTimeSpent.toFixed(1)}s</b></div>
            <div>Media Generica Risposta: <b>{avgTime}s</b></div>
            <div>Parole Non Indovinate: <b>{errorWords.length + passedWords.length}</b></div>
          </div>

          {finalWord && finalWordStatus && (
            <div
              style={{
                marginBottom: "2rem",
                padding: "1rem",
                border: "1px solid var(--panel-border)",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.03)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                }}
              >
                Ultima parola allo scadere
              </div>
              <div
                style={{
                  margin: "0.35rem 0",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                }}
              >
                {finalWord.toUpperCase()}
              </div>
              <div
                style={{
                  color:
                    finalWordStatus === "correct"
                      ? "var(--color-success)"
                      : finalWordStatus === "error"
                        ? "var(--color-danger)"
                        : "var(--color-text-muted)",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {finalWordStatus === "correct"
                  ? "Corretto"
                  : finalWordStatus === "error"
                    ? "Errato"
                    : "Non risposto"}
              </div>
            </div>
          )}

          {/* Parole Dettagliate */}
          <div className="modal-word-summary">
            {guessedWords.length > 0 && (
              <>
                <h3 className="modal-summary-section-title correct">
                  <FaCheck style={{marginRight: "6px"}} /> Indovinate ({guessedWords.length})
                </h3>
                <div className="modal-pill-wrap">
                  {guessedWords.map((word, index) => (
                    <span key={index} className="modal-word-tag correct">
                      {word.word} <span style={{fontSize: "0.7rem", opacity: 0.7}}>({word.time.toFixed(1)}s)</span>
                    </span>
                  ))}
                </div>
              </>
            )}

            {errorWords.length > 0 && (
              <>
                <h3 className="modal-summary-section-title errors">
                  <FaBan style={{marginRight: "6px"}} /> Sbagliate ({errorWords.length})
                </h3>
                <div className="modal-pill-wrap">
                  {errorWords.map((word, index) => (
                    <span key={index} className="modal-word-tag errors">
                      {word.word} <span style={{fontSize: "0.7rem", opacity: 0.7}}>({word.time.toFixed(1)}s)</span>
                    </span>
                  ))}
                </div>
              </>
            )}

            {passedWords.length > 0 && (
              <>
                <h3 className="modal-summary-section-title passed">
                  <FaArrowRight style={{marginRight: "6px"}} /> Passate ({passedWords.length})
                </h3>
                <div className="modal-pill-wrap">
                  {passedWords.map((word, index) => (
                    <span key={index} className="modal-word-tag passed">
                      {word.word} <span style={{fontSize: "0.7rem", opacity: 0.7}}>({word.time.toFixed(1)}s)</span>
                    </span>
                  ))}
                </div>
              </>
            )}
            
            {totalWords === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                Nessuna parola giocata in questa sessione.
              </div>
            )}
          </div>
        </section>
        
        <footer className="modal-card-foot">
          <button className="btn btn-dark" onClick={handleClose} style={{marginRight: "auto"}}>
            Chiudi
          </button>
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-success">
                <FaPrint /> Stampa Resoconto
              </button>
            )}
            content={() => componentRef.current}
          />
        </footer>
      </div>
    </div>
  );
};

export default SummaryModal;
