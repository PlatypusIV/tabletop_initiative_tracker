import { Character } from "./interface";
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