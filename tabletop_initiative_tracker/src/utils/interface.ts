
//character should have position in queue, name and 
export interface Character {
    name: string;
    position: number;
    initiativeScore?: number;
    initiativeBonus?: number;
    hitpoints?: number;
}

export interface Effect {
    name: string;
    duration: number;
}