import { capturedWords } from "../data/capturedWords";
import { raddoppi } from "../data/raddoppi";

export const getCapturedWords = (removeDuplicate = false) => {
  if (removeDuplicate) {
    return [...new Set(capturedWords)];
  }
  return capturedWords;
};

export const getRaddoppi = () => {
  return raddoppi;
};
