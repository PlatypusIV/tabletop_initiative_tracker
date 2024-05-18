import { Character } from "./interface";

export function remapCharacterPositions(characters: Character[]){
    return characters.map((char, index)=> {
        return {
        ...char,
        position: index,
      }});
}
