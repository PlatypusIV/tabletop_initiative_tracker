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

export function getEffectsFromStorage(): Record<string, Effect> {
  const storageEffectList = window.localStorage.getItem(settings.effect_list_storage_key);
  if(!storageEffectList) return {};
  return JSON.parse(storageEffectList);
}

export function setEffectsToStorage(effectList: Record<string, Effect>){
  window.localStorage.setItem(settings.effect_list_storage_key,JSON.stringify(effectList));
}