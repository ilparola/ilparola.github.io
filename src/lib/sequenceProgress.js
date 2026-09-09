const LAST_SEQUENCE_INDEX_KEY = "intesa_vincente_last_sequence_index";

export const getLastSequenceIndex = () => {
  if (typeof window === "undefined") return null;

  const savedIndex = Number(localStorage.getItem(LAST_SEQUENCE_INDEX_KEY));
  return Number.isInteger(savedIndex) && savedIndex >= 0 ? savedIndex : null;
};

export const saveLastSequenceIndex = (index) => {
  if (typeof window === "undefined" || !Number.isInteger(index) || index < 0) {
    return;
  }

  localStorage.setItem(LAST_SEQUENCE_INDEX_KEY, String(index));
};
