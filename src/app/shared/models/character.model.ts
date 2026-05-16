export interface Character {
  id: number;
  created_at: string;
  updated_at: string;

  name: string;
  race: string;
  class: string;
  background: string;
  alignment: string;
  experience_points: number;
  level: number;

  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  max_hit_points: number;
  current_hit_points: number;
  temporary_hit_points: number;
  armor_class: number;
  speed: number;
  hit_dice: string;

  is_custom_race: boolean;
  is_custom_class: boolean;

  personality_traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
}

export type CreateCharacterRequest = Omit<Character, 'id' | 'created_at' | 'updated_at'>;