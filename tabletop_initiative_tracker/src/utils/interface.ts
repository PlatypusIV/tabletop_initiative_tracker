
//character should have position in queue, name and 
export interface Character {
    name: string;
    position: number;
    initiativeScore?: number;
    initiativeBonus?: number;
    hitpoints?: number;
    hitpointHistory?: number[];//use this when making hp history
    effects?: Record<string,Effect>;
}

export interface Effect {
    name: string;
    duration?: number;
    damagePerRound?: number;
}