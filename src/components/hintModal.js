import { FaLightbulb, FaTimes } from "react-icons/fa";

const HintModal = ({ isOpen, word, hint, onClose }) => {
  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div
        className="modal-card hint-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hint-modal-title"
      >
        <header className="modal-card-head">
          <p id="hint-modal-title" className="modal-card-title">
            <FaLightbulb /> Suggerimento
          </p>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Chiudi suggerimento"
          >
            <FaTimes />
          </button>
        </header>
        <section className="modal-card-body hint-modal-body">
          <span className="hint-word">{word ? word.toUpperCase() : ""}</span>
          {hint ? (
            <p className="hint-text">{hint}</p>
          ) : (
            <p className="hint-empty">
              Nessun suggerimento disponibile per questa parola.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default HintModal;
