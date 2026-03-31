import { Character, Effect } from "./interface";
import settings from './settings.json';


export function remapCharacterPositions(characters: Character[]) {
    return characters.map((char, index)=> {
        return {
        ...char,
        position: index,
      }});
}


export function getCharactersFromStorage(): Character[] {
  const storageInitiativeQueue = window.localStorage.getItem(settings.initiative_queeu_storage_key);
  if(!storageInitiativeQueue) return [];
  return JSON.parse(storageInitiativeQueue);
}

export function setCharactersToStorage(initiativeQueue: Character[]): void {
  window.localStorage.setItem(settings.initiative_queeu_storage_key,JSON.stringify(initiativeQueue));
}

export function getCurrentCharacterNumberFromStorage(){
  const storageCharacterNumber = window.localStorage.getItem(settings.current_character_number_storage_key);
  if(!storageCharacterNumber) return;
  return JSON.parse(storageCharacterNumber);
}

export function setCurrentCharacterNumberToStorage(currentCharacterNumber: number){
  window.localStorage.setItem(settings.current_character_number_storage_key,JSON.stringify(currentCharacterNumber));
}

export function getEffectsFromStorage(): Record<string, Effect> {
  const storageEffectList = window.localStorage.getItem(settings.effect_list_storage_key);
  if(!storageEffectList) return {};
  return JSON.parse(storageEffectList);
}

export function setEffectsToStorage(effectList: Record<string, Effect>){
  window.localStorage.setItem(settings.effect_list_storage_key,JSON.stringify(effectList));
}

//TODO Logic for saving a list/array of characters to storage that can then be added back in later
export function setSavedCharacterToStorage(characterToSave: Character): void {
  //wrap into try catch, then add errorHandling
  let savedCharacters = getAllSavedCharactersFromStorage();

  const existingCharacterIndex = savedCharacters.findIndex(chara => chara.name.toLocaleLowerCase() === characterToSave.name.toLocaleLowerCase());
  //if exists, overwrite, else add to list
  if(existingCharacterIndex>-1){
    savedCharacters[existingCharacterIndex] = characterToSave;
  }else{
    savedCharacters.push(characterToSave);
  }

  window.localStorage.setItem(settings.saved_character_collection_storage_key, JSON.stringify(savedCharacters));

  //save character to list of stored characters, if character with same name doesnt exist
}

export function getAllSavedCharactersFromStorage(): Character[]{
  const characterListString = window.localStorage.getItem(settings.saved_character_collection_storage_key);
  if(!characterListString) return [];
  const characterList = JSON.parse(characterListString);
  return characterList as Character[];
}

