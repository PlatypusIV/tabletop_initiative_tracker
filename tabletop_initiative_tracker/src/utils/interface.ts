
//character should have position in queue, name and 
export interface Character {
    name: string;
    position: number;
    initiativeScore?: number;
    initiativeBonus?: number;
    hitpoints?: number;
    hitpointHistory?: number[];//use this when making hp history
}

export interface Effect {
    name: string;
    duration: number;
}