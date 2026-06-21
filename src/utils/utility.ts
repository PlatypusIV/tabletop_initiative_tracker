import { Character, Effect } from "./interface";
import settings from "./settings.json";

export function remapCharacterPositions(characters: Character[]): Character[] {
  return characters.map((char, index) => {
    return {
      ...char,
      position: index,
    };
  });
}

// Upper bounds for a single dice term, guarding against UI-freezing roll loops.
const MAX_DICE_COUNT = 1000;
const MAX_DICE_SIDES = 1000;

// Evaluates a dice formula (e.g. "2d8+2", "1d20-1") or a flat integer (e.g. "7").
// Returns null on any invalid input: floats, text, malformed dice, empty.
// A flat integer is just a single-term formula, so this doubles as input validation.
export function evaluateDiceFormula(
  formula: string,
): { total: number; separateValues: number[] } | null {
  const cleaned = formula.replace(/\s/g, "").toLowerCase();
  if (!cleaned) return null;

  const mathOperators = cleaned.match(/[+-]/g);
  const combos = cleaned.split(/[+-]/);
  const results: number[] = [];

  for (const combo of combos) {
    if (combo === "") return null; // leading/empty operator term, e.g. "2++3"
    if (combo.includes("d")) {
      const parts = combo.split("d");
      if (parts.length !== 2) return null; // reject malformed dice like "2d6d8"
      const [amountStr, sidesStr] = parts;
      if (!/^\d+$/.test(amountStr) || !/^\d+$/.test(sidesStr)) return null;
      const amount = parseInt(amountStr);
      const sides = parseInt(sidesStr);
      if (amount < 1 || sides < 2) return null;
      // Cap to keep a fat-fingered formula (e.g. "99999999d6") from freezing the UI.
      if (amount > MAX_DICE_COUNT || sides > MAX_DICE_SIDES) return null;

      let roll = 0;
      for (let j = 0; j < amount; j++) {
        roll += Math.floor(Math.random() * sides) + 1;
      }
      results.push(roll);
    } else {
      if (!/^\d+$/.test(combo)) return null; // flat term must be a whole integer
      results.push(parseInt(combo));
    }
  }

  let total = results[0];
  mathOperators?.forEach((operator, i) => {
    operator === "+" ? (total += results[i + 1]) : (total -= results[i + 1]);
  });

  return { total, separateValues: results };
}

// Returns the next display name for a creature being added, disambiguating
// against existing names. Matches strictly: "<base>" or "<base> <number>"
// (so "Hobgoblin" / "Goblin Archer" are treated as different creatures).
// A bare base name counts as 1; the first add of a name stays bare.
export function getNextCharacterName(
  baseName: string,
  existingNames: string[],
): string {
  const escaped = baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`^${escaped}( (\\d+))?$`);

  let highest = 0;
  let exists = false;
  for (const name of existingNames) {
    const match = name.match(matcher);
    if (!match) continue;
    exists = true;
    const num = match[2] ? parseInt(match[2]) : 1;
    if (num > highest) highest = num;
  }

  if (!exists) return baseName;
  return `${baseName} ${highest + 1}`;
}

export function getCharactersFromStorage(): Character[] {
  const storageInitiativeQueue = window.localStorage.getItem(
    settings.initiative_queeu_storage_key,
  );
  if (!storageInitiativeQueue) return [];
  return JSON.parse(storageInitiativeQueue);
}

export function setCharactersToStorage(initiativeQueue: Character[]): void {
  window.localStorage.setItem(
    settings.initiative_queeu_storage_key,
    JSON.stringify(initiativeQueue),
  );
}

export function getCurrentCharacterNumberFromStorage() {
  const storageCharacterNumber = window.localStorage.getItem(
    settings.current_character_number_storage_key,
  );
  if (!storageCharacterNumber) return;
  return JSON.parse(storageCharacterNumber);
}

export function setCurrentCharacterNumberToStorage(
  currentCharacterNumber: number,
) {
  window.localStorage.setItem(
    settings.current_character_number_storage_key,
    JSON.stringify(currentCharacterNumber),
  );
}

export function getEffectsFromStorage(): Record<string, Effect> {
  const storageEffectList = window.localStorage.getItem(
    settings.effect_list_storage_key,
  );
  if (!storageEffectList) return {};
  return JSON.parse(storageEffectList);
}

export function setSavedCharacterToStorage(characterToSave: Character): void {
  const savedCharacters = getAllSavedCharactersFromStorage();

  const existingCharacterIndex = savedCharacters.findIndex(
    (chara) =>
      chara.name.toLocaleLowerCase() ===
      characterToSave.name.toLocaleLowerCase(),
  );
  //if exists, overwrite, else add to list
  if (existingCharacterIndex > -1) {
    savedCharacters[existingCharacterIndex] = characterToSave;
  } else {
    savedCharacters.push(characterToSave);
  }

  setSavedCharacterCollectionToStorage(savedCharacters);
}

function setSavedCharacterCollectionToStorage(
  savedCharacters: Character[],
): void {
  try {
    window.localStorage.setItem(
      settings.saved_character_collection_storage_key,
      JSON.stringify(savedCharacters),
    );
  } catch (error) {
    console.error("Failed to save character to storage", error);
    throw error;
  }
}

export function deleteSavedCharacterFromStorage(name: string): Character[] {
  const savedCharacters = getAllSavedCharactersFromStorage().filter(
    (chara) => chara.name.toLocaleLowerCase() !== name.toLocaleLowerCase(),
  );

  setSavedCharacterCollectionToStorage(savedCharacters);

  return savedCharacters;
}

export function getAllSavedCharactersFromStorage(): Character[] {
  const characterListString = window.localStorage.getItem(
    settings.saved_character_collection_storage_key,
  );
  if (!characterListString) return [];
  const characterList = JSON.parse(characterListString);
  return characterList as Character[];
}
