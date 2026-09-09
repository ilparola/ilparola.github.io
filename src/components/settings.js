import { useState, useEffect } from "react";
import { MdOutlineTimer } from "react-icons/md";
import { FaSlidersH } from "react-icons/fa";

const Settings = ({
  isOpen,
  onApply,
  defaultTime,
  currentMode,
  currentStartIndex,
  wordCount,
}) => {
  const [number, setNumber] = useState(defaultTime || 60);
  const [mode, setMode] = useState(currentMode || "random");
  const [startIndex, setStartIndex] = useState(currentStartIndex || 0);

  useEffect(() => {
    if (defaultTime) {
      setNumber(defaultTime);
    }
  }, [defaultTime]);

  useEffect(() => {
    if (currentMode) setMode(currentMode);
  }, [currentMode]);

  useEffect(() => {
    if (currentStartIndex !== undefined) setStartIndex(currentStartIndex);
  }, [currentStartIndex]);

  const handleApply = () => {
    onApply({
      number: Number(number),
      mode,
      startIndex: Number(startIndex),
    });
  };

  const setPresetTime = (secs) => {
    setNumber(secs);
  };

  return (
    <div className={`glass-panel settings-panel ${isOpen ? "is-open" : ""}`}>
      <div className="settings-title">
        <FaSlidersH /> Impostazioni di Gioco
      </div>
      <div className="settings-grid">
        <div className="field">
          <label>Tempo di Gioco (secondi)</label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ position: "relative", flexGrow: 1 }}>
              <input
                className="input-custom"
                type="number"
                min="5"
                max="300"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MdOutlineTimer size={18} />
              </span>
            </div>
            {/* Quick Presets */}
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                className={`btn btn-dark ${Number(number) === 30 ? "btn-primary" : ""}`}
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}
                onClick={() => setPresetTime(30)}
              >
                30s
              </button>
              <button
                className={`btn btn-dark ${Number(number) === 45 ? "btn-primary" : ""}`}
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}
                onClick={() => setPresetTime(45)}
              >
                45s
              </button>
              <button
                className={`btn btn-dark ${Number(number) === 60 ? "btn-primary" : ""}`}
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}
                onClick={() => setPresetTime(60)}
              >
                60s
              </button>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Ordine delle parole</label>
          <select
            className="select-custom"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="random">Casuale</option>
            <option value="sequential">In sequenza</option>
          </select>
        </div>

        {mode === "sequential" && (
          <div className="field">
            <label>Indice di partenza (0 - {Math.max(0, wordCount - 1)})</label>
            <input
              className="input-custom"
              type="number"
              min="0"
              max={Math.max(0, wordCount - 1)}
              value={startIndex}
              onChange={(e) => setStartIndex(e.target.value)}
            />
          </div>
        )}

        <div className="field">
          <button
            className="btn btn-primary"
            style={{ width: "100%", height: "42px" }}
            onClick={handleApply}
          >
            Applica Modifiche
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
