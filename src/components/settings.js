import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";

const Settings = ({ onApply, ...props }) => {
  const [number, setNumber] = useState(0);

  const [option, setOption] = useState("all");
  const [removeDuplicate, setRemoveDuplicate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onApply({ number, option, isDuplicate: removeDuplicate });
  };

  return (
    <div
      className={`card ${isOpen ? "is-open" : ""}`}
      style={{ backgroundColor: "#f5f5f5", marginBottom: "1em" }}
    >
      <header className="card-header" onClick={() => setIsOpen(!isOpen)}>
        <p className="card-header-title is-centered">
          Settings <FaAngleDown />
        </p>
      </header>
      {isOpen && (
        <div className="card-content">
          <div className="field is-grouped is-grouped-centered">
            <div className="control has-icons-right">
              <input
                className="input"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
              <span className="icon is-small is-right">
                <MdOutlineTimer />
              </span>
            </div>

            <div className="control">
              <div className="select">
                <select
                  value={option}
                  onChange={(e) => setOption(e.target.value)}
                >
                  <option value="all" defaultValue>
                    Tutte le parole
                  </option>
                  <option value="generated">Solo generate</option>
                  <option value="captured">Solo parole Trasmissione</option>
                </select>
              </div>
            </div>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={removeDuplicate}
                  onChange={(e) => setRemoveDuplicate(e.target.checked)}
                />
                Elimina doppioni
              </label>
            </div>
            <div className="control">
              <button className="button is-link" onClick={handleApply}>
                Applica
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
