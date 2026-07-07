import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FACULTY_CONFIG_PATH = path.join(__dirname, "../config/facultyNames.json");

// Configuration
const CONFIG = {
  similarityThreshold: 0.90, // Configurable similarity threshold
  minFuzzyLength: 4 // Require exact match for short names under 4 chars to prevent false positives
};

// Internal list storing faculty metadata
const facultyNames = [];
let maxWords = 1;

/**
 * Calculates the Jaro-Winkler similarity between two strings.
 * Returns a value between 0.0 and 1.0.
 */
export const jaroWinklerSimilarity = (s1, s2) => {
  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;

  if (len1 === 0 || len2 === 0) return 0.0;

  // Maximum match window based on string lengths
  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);

  let matches = 0;
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(len2, i + matchWindow + 1);

    for (let j = start; j < end; j++) {
      if (!s2Matches[j] && s1[i] === s2[j]) {
        s1Matches[i] = true;
        s2Matches[j] = true;
        matches++;
        break;
      }
    }
  }

  if (matches === 0) return 0.0;

  // Count transpositions
  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (s1Matches[i]) {
      while (!s2Matches[k]) {
        k++;
      }
      if (s1[i] !== s2[k]) {
        transpositions++;
      }
      k++;
    }
  }

  const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3.0;

  // Winkler modifications for common prefixes
  let prefix = 0;
  const maxPrefix = Math.min(4, Math.min(len1, len2));
  for (let i = 0; i < maxPrefix; i++) {
    if (s1[i] === s2[i]) {
      prefix++;
    } else {
      break;
    }
  }

  return jaro + prefix * 0.1 * (1.0 - jaro);
};

/**
 * Normalizes input text by converting to lowercase, removing possessive 's,
 * removing punctuation and special characters, and collapsing whitespace.
 */
export const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/'s\b/g, "") // remove possessive 's
    .replace(/[^\w\s]/g, "") // remove punctuation and special characters (like *, -, etc.)
    .replace(/\s+/g, " ") // collapse multiple spaces to a single space
    .trim();
};

/**
 * Completely strips all spacing from the text.
 */
export const removeAllSpaces = (text) => {
  if (!text) return "";
  return text.replace(/\s+/g, "");
};

/**
 * Loads the faculty names from the JSON config file.
 */
export const loadFacultyNames = () => {
  try {
    if (fs.existsSync(FACULTY_CONFIG_PATH)) {
      const fileData = fs.readFileSync(FACULTY_CONFIG_PATH, "utf-8");
      const names = JSON.parse(fileData);
      
      facultyNames.length = 0; // Clear existing array
      let tempMaxWords = 1;

      if (Array.isArray(names)) {
        names.forEach(name => {
          if (name && typeof name === "string") {
            const normalized = normalizeText(name);
            if (normalized) {
              const spaceStripped = removeAllSpaces(normalized);
              facultyNames.push({
                original: name,
                normalized,
                spaceStripped
              });
              const wordCount = normalized.split(" ").length;
              if (wordCount > tempMaxWords) {
                tempMaxWords = wordCount;
              }
            }
          }
        });
      }
      maxWords = tempMaxWords;
      console.log(`[SensitiveContentDetector] Loaded ${facultyNames.length} faculty names. Max phrase word count: ${maxWords}`);
    } else {
      console.warn(`[SensitiveContentDetector] Config file not found at ${FACULTY_CONFIG_PATH}`);
    }
  } catch (error) {
    console.error("[SensitiveContentDetector] Error loading faculty names:", error);
  }
};

// Initialize load at startup
loadFacultyNames();

/**
 * Scans content to check if it contains any faculty name (supports exact & fuzzy matching).
 * @param {string} text - The input content to check.
 * @returns {boolean} - True if a faculty name is detected.
 */
export const containsFacultyName = (text) => {
  if (!text) return false;

  const normalizedPost = normalizeText(text);
  const spaceStrippedPost = removeAllSpaces(normalizedPost);
  const words = normalizedPost.split(" ").filter(w => w.length > 0);

  for (const faculty of facultyNames) {
    const targetNormalized = faculty.normalized;
    const targetStripped = faculty.spaceStripped;
    const targetLen = targetStripped.length;

    // Check 1: Tokenized words and adjacent combinations (e.g. check "avi", "shkar", "avi shkar")
    for (let i = 0; i < words.length; i++) {
      for (let len = 1; len <= maxWords; len++) {
        if (i + len <= words.length) {
          const phrase = words.slice(i, i + len).join(" ");
          const phraseStripped = removeAllSpaces(phrase);

          // Exact Match Check
          if (phraseStripped === targetStripped) {
            return true;
          }

          // Fuzzy Match Check
          if (targetLen >= CONFIG.minFuzzyLength && Math.abs(phraseStripped.length - targetLen) <= 1) {
            const similarity = jaroWinklerSimilarity(phraseStripped, targetStripped);
            if (similarity >= CONFIG.similarityThreshold) {
              return true;
            }
          }
        }
      }
    }

    // Check 2: Character-level sliding window scan on the entire space-stripped text
    // This catches obfuscations with inserted spaces, punctuation or extra symbols (e.g. "a v i s h k a r", "av*ishkar")
    if (spaceStrippedPost.length >= targetLen - 1) {
      // Check window sizes around target length to allow insertion/deletion typos (winLen = L-1, L, L+1)
      const minWin = Math.max(1, targetLen - 1);
      const maxWin = targetLen + 1;

      for (let winLen = minWin; winLen <= maxWin; winLen++) {
        for (let i = 0; i <= spaceStrippedPost.length - winLen; i++) {
          const sub = spaceStrippedPost.substring(i, i + winLen);

          // Exact Match Check
          if (sub === targetStripped) {
            return true;
          }

          // Fuzzy Match Check
          if (targetLen >= CONFIG.minFuzzyLength && Math.abs(sub.length - targetLen) <= 1) {
            const similarity = jaroWinklerSimilarity(sub, targetStripped);
            if (similarity >= CONFIG.similarityThreshold) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
};

/**
 * Checks for other restricted content like emails and phone numbers.
 * @param {string} text - Input text.
 * @returns {boolean} - True if match found.
 */
export const containsBannedPatterns = (text) => {
  if (!text) return false;

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g;

  return emailRegex.test(text) || phoneRegex.test(text);
};

/**
 * Unified check to detect if text contains restricted sensitive content.
 * @param {string} text - Input text to scan.
 * @returns {boolean} - True if sensitive.
 */
export const isSensitive = (text) => {
  return containsFacultyName(text) || containsBannedPatterns(text);
};
