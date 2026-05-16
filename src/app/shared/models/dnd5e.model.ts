export interface Dnd5eListEntry {
  index: string;
  name: string;
  url: string;
}

export interface Dnd5eListResponse {
  count: number;
  results: Dnd5eListEntry[];
}

export interface AbilityBonus {
  ability_index: string;
  bonus: number;
}

export interface RaceData {
  index: string;
  name: string;
  speed: number;
  ability_bonuses: AbilityBonus[];
  traits: Dnd5eListEntry[];
}

export interface ClassData {
  index: string;
  name: string;
  hit_die: number;
  saving_throws: { index: string }[];
  spellcasting_ability: string;
}