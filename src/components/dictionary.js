import { useState, useMemo } from "react";
import { FaSearch, FaBook, FaArrowLeft, FaLightbulb, FaSlash } from "react-icons/fa";
import { getCapturedWords, getRaddoppi, getWordHint } from "../lib/dataProvider";
import HintModal from "./hintModal";

const Dictionary = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, captured
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedHint, setSelectedHint] = useState(null);

  // Carica ed unisci le parole contrassegnandole con la sorgente
  const allWords = useMemo(() => {
    const cap = getCapturedWords(true).map((w) => ({
      word: w,
      type: "captured",
      hint: getWordHint(w),
    }));
    const doubles = getRaddoppi().map((w) => ({
      word: w,
      type: "raddoppi",
      hint: getWordHint(w),
    }));
    const merged = [...cap, ...doubles];

    // Ordina alfabeticamente
    return merged.sort((a, b) => a.word.localeCompare(b.word));
  }, []);

  // Lettere disponibili per il filtro rapido (A-Z)
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Filtra le parole in base a ricerca, tipo e lettera iniziale
  const filteredWords = useMemo(() => {
    return allWords.filter((item) => {
      const matchSearch = item.word
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isRaddoppio = item.word.includes(" ");

      let matchType = false;
      if (filterType === "all") matchType = !isRaddoppio;
      else if (filterType === "captured")
        matchType = !isRaddoppio && item.type === "captured";
      else if (filterType === "raddoppi") matchType = isRaddoppio;

      const matchLetter =
        selectedLetter === "" ||
        item.word.toUpperCase().startsWith(selectedLetter);

      return matchSearch && matchType && matchLetter;
    });
  }, [allWords, searchTerm, filterType, selectedLetter]);

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%",
      }}
    >
      {/* Intestazione del Dizionario */}
      <div
        className="glass-panel"
        style={{
          padding: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            className="btn btn-dark btn-icon-only"
            onClick={onClose}
            title="Torna al gioco"
          >
            <FaArrowLeft />
          </button>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2
              className="title"
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                textTransform: "uppercase",
                margin: 0,
                color: "var(--color-primary)",
              }}
            >
              <FaBook style={{ marginRight: "6px" }} /> Archivio Parole
            </h2>
            <span
              style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}
            >
              Visualizzazione di consultazione in sola lettura
            </span>
          </div>
        </div>

        {/* Contatore parole filtrate */}
        <div
          className="words-count-badge"
          style={{ fontSize: "0.9rem", padding: "0.4rem 0.8rem" }}
        >
          {filteredWords.length} / {allWords.length} parole trovate
        </div>
      </div>

      {/* Pannello dei filtri di ricerca */}
      <div
        className="glass-panel"
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {/* Barra di ricerca */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="input-custom"
              placeholder="Cerca una parola..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "2.5rem" }}
            />
            <FaSearch
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
              }}
            />
          </div>

          {/* Filtro Tipo */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              className={`btn btn-dark ${filterType === "all" ? "btn-primary" : ""}`}
              style={{ flexGrow: 1, padding: "0.5rem" }}
              onClick={() => setFilterType("all")}
            >
              Tutte
            </button>
            <button
              className={`btn btn-dark ${filterType === "captured" ? "btn-primary" : ""}`}
              style={{ flexGrow: 1, padding: "0.5rem", fontSize: "0.85rem" }}
              onClick={() => setFilterType("captured")}
            >
              Solo TV
            </button>
            <button
              className={`btn btn-dark ${filterType === "raddoppi" ? "btn-accent" : ""}`}
              style={{ flexGrow: 1, padding: "0.5rem", fontSize: "0.85rem" }}
              onClick={() => setFilterType("raddoppi")}
            >
              Raddoppi
            </button>
          </div>
        </div>

        {/* Legenda ed info */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            fontSize: "0.78rem",
            color: "var(--color-text-muted)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "0.75rem",
          }}
        >
          <div>
            📺 <b style={{ color: "var(--color-accent)" }}>TV</b>: Parole reali
            tratte dalle puntate della trasmissione televisiva "Reazione a
            Catena".
          </div>
          <div>
            🔀 <b style={{ color: "#c084fc" }}>Raddoppio</b>: Parola composta da
            più termini (es. "new york") &mdash; variante esclusiva del gioco.
          </div>
        </div>

        {/* Filtro Alfabetico A-Z */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              marginBottom: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Filtro Alfabetico</span>
            {selectedLetter && (
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-danger)",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => setSelectedLetter("")}
              >
                Rimuovi filtro ({selectedLetter})
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {alphabet.map((letter) => (
              <button
                key={letter}
                className={`btn btn-dark ${selectedLetter === letter ? "btn-primary" : ""}`}
                style={{
                  width: "32px",
                  height: "32px",
                  padding: 0,
                  fontSize: "0.8rem",
                  borderRadius: "4px",
                }}
                onClick={() =>
                  setSelectedLetter(selectedLetter === letter ? "" : letter)
                }
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Griglia delle Parole */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        {filteredWords.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "0.75rem",
              maxHeight: "60vh",
              overflowY: "auto",
              paddingRight: "0.5rem",
            }}
          >
            {filteredWords.map((item, index) => {
              const isRaddoppio = item.word.includes(" ");
              let badgeColor = "var(--color-text-muted)";
              let label = "TV";
              if (isRaddoppio) {
                badgeColor = "#c084fc";
                label = "Raddoppio";
              } else if (item.type === "captured") {
                badgeColor = "var(--color-accent)";
                label = "TV";
              }

              return (
                <div
                  key={index}
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    padding: "0.5rem 0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "var(--transition-fast)",
                  }}
                  className="word-card-hover"
                >
                  <button
                    className="dictionary-word-button"
                    onClick={() => setSelectedHint(item)}
                    title={item.hint || "Nessun suggerimento disponibile"}
                    aria-label={`Mostra il suggerimento per ${item.word}`}
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "white",
                    }}
                  >
                    {item.word.toUpperCase()}
                  </button>
                  <span
                    className={`hint-status-icon ${item.hint ? "has-hint" : "no-hint"}`}
                    title={item.hint ? "Suggerimento disponibile" : "Nessun suggerimento disponibile"}
                    aria-label={item.hint ? "Suggerimento disponibile" : "Nessun suggerimento disponibile"}
                  >
                    <FaLightbulb aria-hidden="true" />
                    {!item.hint && <FaSlash className="hint-status-slash" aria-hidden="true" />}
                  </span>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "0.15rem 0.35rem",
                      borderRadius: "4px",
                      background: `${badgeColor}22`,
                      border: `1px solid ${badgeColor}44`,
                      color: badgeColor,
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--color-text-muted)",
            }}
          >
            Nessuna parola corrisponde ai criteri di ricerca impostati.
          </div>
        )}
      </div>

      <HintModal
        isOpen={Boolean(selectedHint)}
        word={selectedHint?.word}
        hint={selectedHint?.hint}
        onClose={() => setSelectedHint(null)}
      />
    </div>
  );
};

export default Dictionary;
