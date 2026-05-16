export interface SkillDefinition {
  index: string;
  name: string;
  abilityIndex: string;
}

export const SKILLS: SkillDefinition[] = [
  { index: 'skill-acrobatics',      name: 'Acrobatics',      abilityIndex: 'dexterity' },
  { index: 'skill-animal-handling', name: 'Animal Handling', abilityIndex: 'wisdom' },
  { index: 'skill-arcana',          name: 'Arcana',          abilityIndex: 'intelligence' },
  { index: 'skill-athletics',       name: 'Athletics',       abilityIndex: 'strength' },
  { index: 'skill-deception',       name: 'Deception',       abilityIndex: 'charisma' },
  { index: 'skill-history',         name: 'History',         abilityIndex: 'intelligence' },
  { index: 'skill-insight',         name: 'Insight',         abilityIndex: 'wisdom' },
  { index: 'skill-intimidation',    name: 'Intimidation',    abilityIndex: 'charisma' },
  { index: 'skill-investigation',   name: 'Investigation',   abilityIndex: 'intelligence' },
  { index: 'skill-medicine',        name: 'Medicine',        abilityIndex: 'wisdom' },
  { index: 'skill-nature',          name: 'Nature',          abilityIndex: 'intelligence' },
  { index: 'skill-perception',      name: 'Perception',      abilityIndex: 'wisdom' },
  { index: 'skill-performance',     name: 'Performance',     abilityIndex: 'charisma' },
  { index: 'skill-persuasion',      name: 'Persuasion',      abilityIndex: 'charisma' },
  { index: 'skill-religion',        name: 'Religion',        abilityIndex: 'intelligence' },
  { index: 'skill-sleight-of-hand', name: 'Sleight of Hand', abilityIndex: 'dexterity' },
  { index: 'skill-stealth',         name: 'Stealth',         abilityIndex: 'dexterity' },
  { index: 'skill-survival',        name: 'Survival',        abilityIndex: 'wisdom' },
];