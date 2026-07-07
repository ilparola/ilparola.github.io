import { useState, useEffect } from "react";
import { MdOutlineTimer } from "react-icons/md";
import { FaSlidersH } from "react-icons/fa";

const Settings = ({ isOpen, onApply, defaultTime, currentOption, currentRemoveDuplicate }) => {
  const [number, setNumber] = useState(defaultTime || 60);
  const [option, setOption] = useState(currentOption || "all");
  const [removeDuplicate, setRemoveDuplicate] = useState(currentRemoveDuplicate || false);

  useEffect(() => {
    if (defaultTime) {
      setNumber(defaultTime);
    }
  }, [defaultTime]);

  useEffect(() => {
    if (currentOption) {
      setOption(currentOption);
    }
  }, [currentOption]);

  useEffect(() => {
    if (currentRemoveDuplicate !== undefined) {
      setRemoveDuplicate(currentRemoveDuplicate);
    }
  }, [currentRemoveDuplicate]);

  const handleApply = () => {
    onApply({ number: Number(number), option, isDuplicate: removeDuplicate });
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
              <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", display: "flex", alignItems: "center" }}>
                <MdOutlineTimer size={18} />
              </span>
            </div>
            {/* Quick Presets */}
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button className={`btn btn-dark ${Number(number) === 30 ? 'btn-primary' : ''}`} style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem" }} onClick={() => setPresetTime(30)}>30s</button>
              <button className={`btn btn-dark ${Number(number) === 45 ? 'btn-primary' : ''}`} style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem" }} onClick={() => setPresetTime(45)}>45s</button>
              <button className={`btn btn-dark ${Number(number) === 60 ? 'btn-primary' : ''}`} style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem" }} onClick={() => setPresetTime(60)}>60s</button>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Dizionario Parole</label>
          <select
            className="select-custom"
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            <option value="all">Tutte le parole (esclusi raddoppi)</option>
            <option value="generated">Solo IA (generate artificialmente)</option>
            <option value="captured">Solo TV (dalla trasmissione)</option>
            <option value="raddoppi">Solo Raddoppi (parole composte)</option>
          </select>
        </div>

        <div className="field">
          <label className="checkbox-custom">
            <input
              type="checkbox"
              checked={removeDuplicate}
              onChange={(e) => setRemoveDuplicate(e.target.checked)}
            />
            Elimina doppioni
          </label>
        </div>

        <div className="field">
          {option === "raddoppi" && (
            <div style={{ padding: "0.5rem 0.75rem", background: "rgba(255, 159, 67, 0.1)", border: "1px solid rgba(255, 159, 67, 0.3)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--color-accent)" }}>
              ⚡ Modalità Raddoppi: le parole composte sono <b>esclusive</b> e non vengono mescolate con gli altri elenchi.
            </div>
          )}
        </div>

        <div className="field">
          {option !== "raddoppi" && (
            <label className="checkbox-custom">
              <input
                type="checkbox"
                checked={removeDuplicate}
                onChange={(e) => setRemoveDuplicate(e.target.checked)}
              />
              Elimina doppioni
            </label>
          )}
        </div>

        <div className="field">
          <button className="btn btn-primary" style={{ width: "100%", height: "42px" }} onClick={handleApply}>
            Applica Modifiche
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
