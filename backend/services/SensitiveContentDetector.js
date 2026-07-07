import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FACULTY_CONFIG_PATH = path.join(__dirname, "../config/facultyNames.json");
const CONFIG_PATH = path.join(__dirname, "../config/detectorConfig.json");

// Default configuration parameters
let CONFIG = {
  similarityThreshold: 0.96,
  minFuzzyLength: 5,
  levenshteinLimitLength: 6,
  levenshteinMaxDistance: 1,
  minExactSlidingLength: 4
};

// Internal list storing faculty metadata
const facultyNames = [];
let maxWords = 1;

/**
 * Loads configuration from config/detectorConfig.json if it exists.
 */
export const loadConfig = () => {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const fileData = fs.readFileSync(CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(fileData);
      CONFIG = { ...CONFIG, ...parsed };
      console.log("[SensitiveContentDetector] Loaded config:", CONFIG);
    }
  } catch (error) {
    console.error("[SensitiveContentDetector] Error loading config:", error);
  }
};

// Initialize config load
loadConfig();

/**
 * Calculates the Levenshtein distance (edit distance) between two strings.
 */
export const levenshteinDistance = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));

  for (let i = 0; i <= len1; i++) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= len2; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[len2][len1];
};

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
 * Normalizes Unicode characters by decomposing accents/diacritics.
 */
export const unicodeNormalize = (text) => {
  if (!text) return "";
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Base normalization: lowercase, unicode diacritics removal, punctuation removal,
 * possessive 's removal, and space collapsing.
 */
export const normalizeText = (text) => {
  if (!text) return "";
  const unicodeClean = unicodeNormalize(text);
  return unicodeClean
    .toLowerCase()
    .replace(/'s\b/g, "") // remove possessive 's
    .replace(/[^\w\s]/g, "") // remove punctuation and special characters (like *, ., _, -, etc.)
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
 * Collapses long duplicate character sequences down to at most 1 character.
 * E.g., "sudhirrrrr" -> "sudhir", "helloooo" -> "hello".
 */
export const compressRepeatedChars = (text) => {
  if (!text) return "";
  return text.replace(/(.)\1{2,}/g, "$1");
};

/**
 * Returns multiple normalized versions of a post content string.
 */
export const getNormalizedVersions = (text) => {
  const originalNorm = normalizeText(text);
  const noSp = removeAllSpaces(originalNorm);

  // Compression Mode 1 (3+ identical characters reduced to 1 character)
  const comp1 = compressRepeatedChars(originalNorm);
  const comp1NoSp = removeAllSpaces(comp1);

  // Compression Mode 2 (3+ identical characters reduced to 2 characters)
  const comp2 = originalNorm.replace(/(.)\1{2,}/g, "$1$1");
  const comp2NoSp = removeAllSpaces(comp2);

  return {
    original: originalNorm,
    noSpaces: noSp,
    compressed: [comp1, comp2],
    compressedNoSpaces: [comp1NoSp, comp2NoSp]
  };
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
      console.warn(`[SensitiveContentDetector] Faculty config file not found at ${FACULTY_CONFIG_PATH}`);
    }
  } catch (error) {
    console.error("[SensitiveContentDetector] Error loading faculty names:", error);
  }
};

// Initialize load at startup
loadFacultyNames();

// --- HELPER FUNCTIONS FOR SEPARATE MATCH PIPELINES ---

/**
 * Performs exact match check on tokenized words and adjacent combinations (spaced texts).
 */
const scanExactTokenized = (versionText, versionName, targetStripped, facultyOriginal) => {
  const words = versionText.split(" ").filter(w => w.length > 0);
  for (let i = 0; i < words.length; i++) {
    for (let len = 1; len <= maxWords; len++) {
      if (i + len <= words.length) {
        const phrase = words.slice(i, i + len).join(" ");
        const phraseStripped = removeAllSpaces(phrase);
        if (phraseStripped === targetStripped) {
          console.log(`[SensitiveContentDetector] [BLOCKED] Stage: Exact | Faculty Name: "${facultyOriginal}" | Matched Version: "${versionName}" | Matched Part: "${phrase}" | Similarity: 1.0`);
          return true;
        }
      }
    }
  }
  return false;
};

/**
 * Performs exact match check using a sliding window of length L over space-stripped text.
 */
const scanExactSliding = (strippedText, versionName, targetStripped, facultyOriginal) => {
  const targetLen = targetStripped.length;
  if (strippedText.length < targetLen) return false;

  for (let i = 0; i <= strippedText.length - targetLen; i++) {
    const sub = strippedText.substring(i, i + targetLen);
    if (sub === targetStripped) {
      console.log(`[SensitiveContentDetector] [BLOCKED] Stage: Exact | Faculty Name: "${facultyOriginal}" | Matched Version: "${versionName}" | Matched Part: "${sub}" | Similarity: 1.0`);
      return true;
    }
  }
  return false;
};

/**
 * Performs fuzzy match check (Levenshtein + Jaro-Winkler) on tokenized combinations (spaced texts).
 */
const scanFuzzyTokenized = (versionText, versionName, targetStripped, facultyOriginal) => {
  const targetLen = targetStripped.length;
  const words = versionText.split(" ").filter(w => w.length > 0);

  for (let i = 0; i < words.length; i++) {
    for (let len = 1; len <= maxWords; len++) {
      if (i + len <= words.length) {
        const phrase = words.slice(i, i + len).join(" ");
        const phraseStripped = removeAllSpaces(phrase);

        // Check 1: Levenshtein auto-block
        const editDist = levenshteinDistance(phraseStripped, targetStripped);
        if (targetLen >= CONFIG.levenshteinLimitLength && editDist <= CONFIG.levenshteinMaxDistance) {
          console.log(`[SensitiveContentDetector] [BLOCKED] Stage: Levenshtein | Faculty Name: "${facultyOriginal}" | Matched Version: "${versionName}" | Matched Part: "${phrase}" | Edit Distance: ${editDist}`);
          return true;
        }

        // Check 2: Jaro-Winkler fallback
        if (Math.abs(phraseStripped.length - targetLen) <= 1) {
          const similarity = jaroWinklerSimilarity(phraseStripped, targetStripped);
          if (similarity >= CONFIG.similarityThreshold) {
            console.log(`[SensitiveContentDetector] [BLOCKED] Stage: Jaro-Winkler | Faculty Name: "${facultyOriginal}" | Matched Version: "${versionName}" | Matched Part: "${phrase}" | Similarity: ${similarity.toFixed(4)}`);
            return true;
          }
        }
      }
    }
  }
  return false;
};

/**
 * Performs fuzzy match check (Levenshtein + Jaro-Winkler) using sliding window over space-stripped text.
 */
const scanFuzzySliding = (strippedText, versionName, targetStripped, facultyOriginal) => {
  const targetLen = targetStripped.length;
  if (strippedText.length < targetLen - 1) return false;

  const minWin = Math.max(1, targetLen - 1);
  const maxWin = targetLen + 1;

  for (let winLen = minWin; winLen <= maxWin; winLen++) {
    for (let i = 0; i <= strippedText.length - winLen; i++) {
      const sub = strippedText.substring(i, i + winLen);

      // Check 1: Levenshtein auto-block
      const editDist = levenshteinDistance(sub, targetStripped);
      if (targetLen >= CONFIG.levenshteinLimitLength && editDist <= CONFIG.levenshteinMaxDistance) {
        console.log(`[SensitiveContentDetector] [BLOCKED] Stage: Levenshtein | Faculty Name: "${facultyOriginal}" | Matched Version: "${versionName}" | Matched Part: "${sub}" | Edit Distance: ${editDist}`);
        return true;
      }

      // Check 2: Jaro-Winkler fallback
      if (Math.abs(sub.length - targetLen) <= 1) {
        const similarity = jaroWinklerSimilarity(sub, targetStripped);
        if (similarity >= CONFIG.similarityThreshold) {
          console.log(`[SensitiveContentDetector] [BLOCKED] Stage: Jaro-Winkler | Faculty Name: "${facultyOriginal}" | Matched Version: "${versionName}" | Matched Part: "${sub}" | Similarity: ${similarity.toFixed(4)}`);
          return true;
        }
      }
    }
  }
  return false;
};

/**
 * Scans content to check if it contains any faculty name (supports exact & hybrid Levenshtein / Jaro-Winkler matching).
 * @param {string} text - The input content to check.
 * @returns {boolean} - True if a faculty name is detected.
 */
export const containsFacultyName = (text) => {
  if (!text) return false;

  const postVersions = getNormalizedVersions(text);

  for (const faculty of facultyNames) {
    const targetStripped = faculty.spaceStripped;
    const targetLen = targetStripped.length;

    // --- STAGE 1: EXACT MATCHING (RUN FIRST ON ALL VERSIONS) ---
    
    // 1. original normalized (spaced)
    if (scanExactTokenized(postVersions.original, "original normalized", targetStripped, faculty.original)) {
      return true;
    }

    // 2. no-spaces
    if (targetLen >= CONFIG.minExactSlidingLength) {
      if (scanExactSliding(postVersions.noSpaces, "no-spaces", targetStripped, faculty.original)) {
        return true;
      }
    }

    // 3. compressed (spaced)
    for (let idx = 0; idx < postVersions.compressed.length; idx++) {
      const comp = postVersions.compressed[idx];
      if (scanExactTokenized(comp, `compressed (mode ${idx + 1})`, targetStripped, faculty.original)) {
        return true;
      }
    }

    // 4. compressed no-spaces
    if (targetLen >= CONFIG.minExactSlidingLength) {
      for (let idx = 0; idx < postVersions.compressedNoSpaces.length; idx++) {
        const compNoSp = postVersions.compressedNoSpaces[idx];
        if (scanExactSliding(compNoSp, `compressed no-spaces (mode ${idx + 1})`, targetStripped, faculty.original)) {
          return true;
        }
      }
    }

    // --- STAGE 2: FUZZY MATCHING (ONLY FOR TARGET LEN >= 5, ONLY IF NO EXACT MATCH IN STAGE 1) ---
    if (targetLen >= CONFIG.minFuzzyLength) {
      
      // 1. original normalized (spaced)
      if (scanFuzzyTokenized(postVersions.original, "original normalized", targetStripped, faculty.original)) {
        return true;
      }

      // 2. no-spaces
      if (scanFuzzySliding(postVersions.noSpaces, "no-spaces", targetStripped, faculty.original)) {
        return true;
      }

      // 3. compressed (spaced)
      for (let idx = 0; idx < postVersions.compressed.length; idx++) {
        const comp = postVersions.compressed[idx];
        if (scanFuzzyTokenized(comp, `compressed (mode ${idx + 1})`, targetStripped, faculty.original)) {
          return true;
        }
      }

      // 4. compressed no-spaces
      for (let idx = 0; idx < postVersions.compressedNoSpaces.length; idx++) {
        const compNoSp = postVersions.compressedNoSpaces[idx];
        if (scanFuzzySliding(compNoSp, `compressed no-spaces (mode ${idx + 1})`, targetStripped, faculty.original)) {
          return true;
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
