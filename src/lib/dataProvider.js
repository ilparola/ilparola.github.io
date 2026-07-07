import { generatedWordsWithDuplicates } from "../data/generatedWords";
import { capturedWords } from "../data/capturedWords";
import { raddoppi } from "../data/raddoppi";

export const getGeneratedWords = (removeDuplicate = false) => {
  if (removeDuplicate) {
    return [...new Set(generatedWordsWithDuplicates)];
  }
  return generatedWordsWithDuplicates;
};

export const getCapturedWords = (removeDuplicate = false) => {
  if (removeDuplicate) {
    return [...new Set(capturedWords)];
  }
  return capturedWords;
};

export const getRaddoppi = () => {
  return raddoppi;
};
